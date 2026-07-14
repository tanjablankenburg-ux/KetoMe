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

  const prompt = `Schau dir dieses Bild an und erkenne alle sichtbaren Lebensmittel, Zutaten oder Produkte — egal ob einzeln, im Kühlschrank, auf dem Tisch oder in der Verpackung.

Antworte NUR mit einem JSON-Array auf Deutsch, ohne Markdown, ohne Text davor oder danach:
["Eier","Käse","Hähnchenbrust","Brokkoli","Sahne"]

Auch bei Nahaufnahmen, Verpackungen oder einzelnen Produkten: nenne was du erkennst.
Maximal 20 Zutaten. Falls absolut nichts Essbares erkennbar ist: ["KEIN_BILD"]`;

  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 256,
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
    return NextResponse.json({ fehler: `API Fehler ${res.status}` }, { status: 500 });
  }

  const data = await res.json();
  const text = data.content?.[0]?.text ?? "";

  try {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return NextResponse.json({ zutaten: [] });
    const zutaten: string[] = JSON.parse(match[0]);
    return NextResponse.json({ zutaten });
  } catch {
    return NextResponse.json({ zutaten: [] });
  }
}
