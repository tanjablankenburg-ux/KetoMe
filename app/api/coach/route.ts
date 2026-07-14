import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { frage, kontext } = await req.json() as { frage: string; kontext: Record<string, string> };

    if (!frage?.trim()) {
      return NextResponse.json({ fehler: "Keine Frage angegeben" }, { status: 400 });
    }

    const systemPrompt = `Du bist der VitaKeto Keto-Coach – ein freundlicher, motivierender Keto-Experte auf Deutsch.
Du hilfst Nutzern bei ihrer ketogenen Ernährung mit praxisnahen, wissenschaftlich fundierten Antworten.

Halte Antworten kurz und klar (max. 200 Wörter). Nutze gelegentlich Emojis. Sei motivierend, nie belehrend.
Wenn du Makros oder Werte nennst, nutze immer die echten Daten des Nutzers aus diesem Profil.
Wenn der Nutzer nach einem bestimmten Tag fragt (z.B. "gestern", "letzte Woche"), schaue in den Verlauf der letzten 7 Tage.

Nutzerprofil:
- Aktuelles Gewicht: ${kontext.gewicht || "nicht angegeben"} kg
- Größe: ${kontext.groesse || "nicht angegeben"}
- Ziel: ${kontext.ziel || "nicht angegeben"}
- Gewichtsziel: ${kontext.gewichtsziel || "nicht angegeben"} kg
- Tages-Ziele: ${kontext.kcalZiel || "?"} kcal / KH max. ${kontext.khZiel || "20"}g / Eiweiß ${kontext.eiweissZiel || "?"}g / Fett ${kontext.fettZiel || "?"}g
- Fastenstatus: ${kontext.fastet === "true" ? "fastet gerade (Intervallfasten)" : "kein aktives Fasten"}

Heute (${new Date().toLocaleDateString("de-DE")}):
- Gegessen: ${kontext.heuteKcal || "0"} kcal, ${kontext.heuteKh || "0"}g Netto-KH, ${kontext.heuteEiweiss || "0"}g Eiweiß, ${kontext.heuteFett || "0"}g Fett
- Mahlzeiten: ${kontext.mahlzeitenListe || "noch nichts eingetragen"}

Letzte 7 Tage (Ernährungsverlauf):
${kontext.letzte7Tage || "keine Einträge vorhanden"}

Gewichtsverlauf (letzte Einträge):
${kontext.gewichtVerlauf || "keine Einträge"}`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: "user", content: frage.trim() }],
    });

    const antwort = message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ antwort });
  } catch (err) {
    console.error("Coach API Fehler:", err);
    return NextResponse.json({ fehler: "Coach nicht erreichbar. Bitte versuche es später." }, { status: 500 });
  }
}
