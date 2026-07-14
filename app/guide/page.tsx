"use client";
import { useState } from "react";
import Link from "next/link";

const SCHRITTE = [
  {
    nr: 1,
    emoji: "🎯",
    titel: "Deine Ziele einrichten",
    text: "Beim ersten Start führt dich das Onboarding durch deine persönlichen Daten. VitaKeto berechnet automatisch deine Kalorienziele und Makros — angepasst an Gewicht, Größe, Alter und Aktivitätslevel.",
    tipps: [
      "Gewicht, Größe und Ziel eingeben",
      "Makros werden automatisch berechnet",
      "Ziele jederzeit im Tracking unter ⚙ Ziele anpassen",
    ],
    link: { label: "Zu den Zielen", href: "/tracking" },
    farbe: "#22c55e",
  },
  {
    nr: 2,
    emoji: "📊",
    titel: "Täglich tracken",
    text: "Das Herzstück der App. Trag täglich dein Gewicht und deine Mahlzeiten ein — VitaKeto zeigt dir ob du im Zielbereich bist und berechnet automatisch Netto-KH.",
    tipps: [
      "Gewicht morgens nüchtern eintragen",
      "Mahlzeiten mit Barcode-Scanner oder Suche loggen",
      "Netto-KH = KH minus Ballaststoffe — der echte Keto-Wert",
    ],
    link: { label: "Zum Tracking", href: "/tracking" },
    farbe: "#f59e0b",
  },
  {
    nr: 3,
    emoji: "🍽",
    titel: "Lebensmittel & Rezepte",
    text: "Finde keto-freundliche Lebensmittel, scanne Barcodes, lass dir per Foto ein Rezept erstellen oder nutze die Rezept-Datenbank für deinen Wochenplan.",
    tipps: [
      "Barcode scannen für schnelle Nährwertinfos",
      "Rezept-Scanner: Foto machen → KI erstellt Rezept",
      "Wochenplan für strukturierte Ernährung",
    ],
    link: { label: "Zu den Rezepten", href: "/rezepte" },
    farbe: "#3b82f6",
  },
  {
    nr: 4,
    emoji: "📚",
    titel: "Keto-Wissen nutzen",
    text: "Keto-Grippe? Fehler vermeiden? Essen gehen? Die Wissens-Seiten geben dir Antworten genau dann wenn du sie brauchst — nicht als trockene Theorie, sondern als Sofortlösung.",
    tipps: [
      "Keto-Grippe Guide bei Symptomen in den ersten Tagen",
      "Häufige Fehler checken wenn etwas nicht funktioniert",
      "Restaurant-Guide vor dem Essen gehen öffnen",
    ],
    link: { label: "Zum Keto-Wissen", href: "/info" },
    farbe: "#8b5cf6",
  },
  {
    nr: 5,
    emoji: "⚗️",
    titel: "Profi-Features (optional)",
    text: "Für Fortgeschrittene: Keton-Werte tracken, GKI berechnen, Fasten-Timer, Supplement-Guide und die Profi-Zone mit Adaption-Insights.",
    tipps: [
      "Profi-Zone: Blut-Ketone und GKI tracken",
      "Fasten-Timer mit Autophagie-Phasen",
      "Supplement-Guide für optimale Ergänzung",
    ],
    link: { label: "Zur Profi-Zone", href: "/profis" },
    farbe: "#ef4444",
  },
];

const FAQ_GUIDE = [
  {
    frage: "Wo fange ich an?",
    antwort: "Starte mit dem 7-Tage-Startplan — er fuhrt dich Tag fur Tag durch die erste Woche mit Mahlzeiten, Tipps und Tagesaufgaben. Dann taglich: Gewicht eintragen + Mahlzeiten loggen.",
  },
  {
    frage: "Was ist Netto-KH?",
    antwort: "Netto-KH = Gesamt-Kohlenhydrate minus Ballaststoffe. Das ist der echte Keto-Wert — Ballaststoffe werden nicht verdaut und zählen nicht zur Ketose-Grenze. Ziel: unter 20g Netto-KH täglich.",
  },
  {
    frage: "Wie lange bis zur Ketose?",
    antwort: "Bei konsequent unter 20g Netto-KH täglich: 2–5 Tage. Die Keto-Grippe dazwischen ist normal und geht vorbei. Volle Adaption dauert 4–8 Wochen.",
  },
  {
    frage: "Werden meine Daten gespeichert?",
    antwort: "Alle Daten werden lokal auf deinem Gerät gespeichert — kein Cloud-Sync, keine Weitergabe. Deine Daten gehören dir.",
  },
  {
    frage: "Was ist der Rezept-Scanner?",
    antwort: "Du fotografierst ein Gericht oder Zutaten — die KI erkennt was drauf ist und erstellt daraus ein vollständiges Keto-Rezept mit Makros. Praktisch für Inspiration oder wenn du nicht weißt was du kochen sollst.",
  },
  {
    frage: "Was sind exogene Ketone?",
    antwort: "Ein Supplement das dem Körper direkt Ketone liefert — auch ohne strikter Keto-Ernährung. Hilft bei Keto-Grippe, vor dem Sport oder nach einem KH-Ausrutscher. Mehr dazu auf der Exo-Ketone Seite.",
  },
  {
    frage: "Kann ich Erinnerungen wieder ausschalten?",
    antwort: "Ja — unter Erinnerungen (🔔) kannst du jede Erinnerung einzeln ein- und ausschalten. Uhrzeiten sind frei anpassbar. Du kannst auch einzelne Zeiten entfernen oder neue hinzufügen.",
  },
];

export default function GuidePage() {
  const [offenesFAQ, setOffenesFAQ] = useState<number | null>(null);
  const [aktiverSchritt, setAktiverSchritt] = useState<number | null>(null);

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      {/* Hero */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: "linear-gradient(135deg, #0d2018 0%, #0a1020 100%)", border: "1px solid #22c55e33" }}>
        <div className="text-4xl mb-3">🧭</div>
        <h1 className="text-2xl font-black mb-2 leading-tight">So nutzt du<br />VitaKeto richtig.</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#aaa" }}>
          Fünf Schritte — von der Einrichtung bis zur vollen Keto-Adaption. Kein Vorwissen nötig.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { wert: "5 Min", label: "Einrichtung" },
            { wert: "36+", label: "Features" },
            { wert: "0", label: "Vorwissen" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: "#ffffff0a" }}>
              <div className="font-black text-lg" style={{ color: "#22c55e" }}>{s.wert}</div>
              <div className="text-[10px] mt-0.5" style={{ color: "#555" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Schritte */}
      <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>IN 5 SCHRITTEN STARTEN</div>
      <div className="space-y-2 mb-6">
        {SCHRITTE.map(s => (
          <div key={s.nr} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
            <button className="w-full px-4 py-4 text-left flex items-center gap-3"
              onClick={() => setAktiverSchritt(aktiverSchritt === s.nr ? null : s.nr)}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{ backgroundColor: s.farbe + "22", border: `1px solid ${s.farbe}44` }}>
                {s.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold" style={{ color: s.farbe }}>Schritt {s.nr}</span>
                </div>
                <div className="font-semibold text-sm">{s.titel}</div>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: "#333" }}>{aktiverSchritt === s.nr ? "▲" : "▼"}</span>
            </button>

            {aktiverSchritt === s.nr && (
              <div className="px-4 pb-4 border-t space-y-3" style={{ borderColor: "#2a2a2a" }}>
                <p className="text-xs leading-relaxed pt-3" style={{ color: "#aaa" }}>{s.text}</p>
                <div className="rounded-xl p-3" style={{ backgroundColor: "#2a2a2a" }}>
                  {s.tipps.map((t, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1 last:mb-0">
                      <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: s.farbe }}>✓</span>
                      <span className="text-xs" style={{ color: "#ccc" }}>{t}</span>
                    </div>
                  ))}
                </div>
                <Link href={s.link.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: s.farbe }}>
                  → {s.link.label}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* App-Übersicht */}
      <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>ALLE BEREICHE AUF EINEN BLICK</div>
      <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: "#1a1a1a" }}>
        {[
          { label: "🥗 Essen & Planen", items: "Wochenplan · Rezepte · Einkaufsliste · Rezept-Scanner" },
          { label: "🍳 Lebensmittel", items: "Nährwerte suchen · Barcode scannen" },
          { label: "📊 Mein Keto", items: "Tracking · Fasten · Fitness · Erfolge & Streaks" },
          { label: "📚 Keto-Wissen", items: "Keto-Info · Keto-Grippe · Häufige Fehler · Alkohol · Restaurant" },
          { label: "⚗️ Profi & Extras", items: "Profi-Zone · Supplemente · Exogene Ketone" },
    { label: "🔔 Erinnerungen", items: "Wasser · Gewicht · Mahlzeiten · Fasten · Ketone — einzeln ein- und ausschaltbar, Uhrzeiten frei wählbar" },
        ].map((b, i) => (
          <div key={i} className={`py-3 ${i < 4 ? "border-b" : ""}`} style={{ borderColor: "#2a2a2a" }}>
            <div className="text-xs font-semibold mb-0.5">{b.label}</div>
            <div className="text-xs" style={{ color: "#555" }}>{b.items}</div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>HÄUFIGE FRAGEN</div>
      <div className="space-y-2 mb-6">
        {FAQ_GUIDE.map((f, i) => (
          <div key={i} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
            <button className="w-full px-4 py-3 text-left flex items-center gap-3"
              onClick={() => setOffenesFAQ(offenesFAQ === i ? null : i)}>
              <span className="flex-1 text-sm font-medium leading-snug">{f.frage}</span>
              <span className="flex-shrink-0 text-xs" style={{ color: "#333" }}>{offenesFAQ === i ? "▲" : "▼"}</span>
            </button>
            {offenesFAQ === i && (
              <div className="px-4 pb-4 border-t" style={{ borderColor: "#222" }}>
                <p className="text-xs leading-relaxed pt-3" style={{ color: "#888" }}>{f.antwort}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Start-CTA */}
      <Link href="/tracking"
        className="block rounded-2xl p-5 text-center"
        style={{ background: "linear-gradient(135deg, #0d2018, #0a1020)", border: "1px solid #22c55e44" }}>
        <div className="text-3xl mb-2">🚀</div>
        <div className="font-black text-lg mb-1" style={{ color: "#22c55e" }}>Jetzt loslegen</div>
        <div className="text-xs" style={{ color: "#555" }}>Gewicht eintragen und ersten Tag starten</div>
      </Link>
    </main>
  );
}

