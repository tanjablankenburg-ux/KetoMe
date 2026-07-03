import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ fehler: "API-Key nicht konfiguriert." }, { status: 500 });
  }

  const { imageBase64, mediaType } = await req.json();
  if (!imageBase64) {
    return NextResponse.json({ fehler: "Kein Bild erhalten." }, { status: 400 });
  }

  const prompt = `Du bist ein Keto-Ernährungsexperte. Analysiere dieses Bild und extrahiere das Rezept.

Antworte NUR mit einem JSON-Objekt, ohne Markdown-Codeblock, ohne Text davor oder danach:
{"titel":"Name","portionen":2,"zubereitungszeit":"30 Min","zutaten":[{"menge":"200g","name":"Hähnchenbrust"}],"zubereitung":["Schritt 1"],"naehrwerte":{"kcal":350,"kh":3,"eiweiss":28,"fett":22},"ketoGeeignet":true,"ketoHinweis":""}

Falls kein Rezept erkennbar: {"fehler":"Kein Rezept erkannt"}`;

  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: imageBase64 } },
        { type: "text", text: prompt }
      ]
    }]
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Anthropic Fehler:", res.status, err);
    return NextResponse.json({ fehler: `Anthropic API Fehler ${res.status}: ${err.slice(0, 200)}` }, { status: 500 });
  }

  const data = await res.json();
  const text = data.content?.[0]?.text ?? "";

  try {
    // JSON aus dem Text extrahieren (falls KI trotzdem Markdown drumherum schreibt)
    const match = text.match(/\{[\s\S]*\}/);
    const json = JSON.parse(match ? match[0] : text);
    return NextResponse.json(json);
  } catch {
    console.error("JSON Parse Fehler:", text);
    return NextResponse.json({ fehler: "Antwort konnte nicht verarbeitet werden." }, { status: 500 });
  }
}
