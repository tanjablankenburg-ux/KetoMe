import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { imageBase64, mediaType } = await req.json();

  const prompt = `Du bist ein Keto-Ernährungsexperte. Analysiere dieses Bild und extrahiere das Rezept.

Antworte NUR mit einem JSON-Objekt in diesem exakten Format (kein Markdown, kein Text davor/danach):
{
  "titel": "Rezepttitel",
  "portionen": 2,
  "zubereitungszeit": "30 Min",
  "zutaten": [
    { "menge": "200g", "name": "Hähnchenbrust" },
    { "menge": "2 EL", "name": "Olivenöl" }
  ],
  "zubereitung": ["Schritt 1", "Schritt 2"],
  "naehrwerte": {
    "kcal": 350,
    "kh": 3,
    "eiweiss": 28,
    "fett": 22
  },
  "ketoGeeignet": true,
  "ketoHinweis": "Optionaler Hinweis wenn KH > 5g"
}

Berechne die Nährwerte pro Portion so genau wie möglich.
Wenn ketoGeeignet false ist (KH > 10g pro Portion), gib einen konkreten Hinweis wie man das Rezept keto-freundlicher macht.
Falls kein Rezept erkennbar ist, antworte mit: {"fehler": "Kein Rezept erkannt"}`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as "image/jpeg" | "image/png" | "image/webp",
                data: imageBase64,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const json = JSON.parse(text.trim());
    return NextResponse.json(json);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Rezept-Foto Fehler:", msg);
    if (msg.includes("API key")) return NextResponse.json({ fehler: "API-Key fehlt oder ungültig." }, { status: 500 });
    if (msg.includes("credit") || msg.includes("billing")) return NextResponse.json({ fehler: "Kein Guthaben auf dem API-Account." }, { status: 500 });
    if (msg.includes("too large") || msg.includes("size")) return NextResponse.json({ fehler: "Bild zu groß — bitte kleineres Foto verwenden." }, { status: 500 });
    return NextResponse.json({ fehler: `Fehler: ${msg.slice(0, 120)}` }, { status: 500 });
  }
}
