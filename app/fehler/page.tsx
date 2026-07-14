"use client";
import { useState } from "react";
import Link from "next/link";

type Fehler = {
  id: string;
  nr: number;
  emoji: string;
  titel: string;
  symptome: string[];
  warum: string;
  loesung: string;
  tipp?: string;
  link?: { label: string; href: string };
};

const FEHLER: Fehler[] = [
  {
    id: "zu-viel-kh",
    nr: 1,
    emoji: "🍞",
    titel: "Zu viele Kohlenhydrate",
    symptome: ["Kein Gewichtsverlust", "Müdigkeit", "Keine Ketone messbar"],
    warum: "Der häufigste Fehler. Schon 50–80g KH täglich reichen um aus der Ketose zu fallen. Versteckte KH in Soßen, Dressings, Milchprodukten und sogenannten Low-Carb-Produkten werden unterschätzt.",
    loesung: "Ziel: unter 20g Netto-KH täglich. Alles tracken — auch Saucen, Getränke, Naschereien. Scanner benutzen.",
    tipp: "Netto-KH = Gesamt-KH minus Ballaststoffe. Kein Raten — wiegen und tracken.",
    link: { label: "Nährwerte tracken", href: "/tracking" },
  },
  {
    id: "zu-wenig-fett",
    nr: 2,
    emoji: "🥑",
    titel: "Zu wenig Fett gegessen",
    symptome: ["Dauerhunger", "Energiemangel", "Heißhunger auf Süßes"],
    warum: "Viele haben jahrelang gelernt: Fett = schlecht. Auf Keto ist Fett der Treibstoff. Wer Fett weglässt und auch keine KH isst, hat schlicht zu wenig Energie — der Körper geht in Notfallmodus.",
    loesung: "60–75% der Kalorien aus Fett. Avocado, Butter, Olivenöl, Nüsse, Eier, fetthaltiges Fleisch. Nicht sparen!",
    tipp: "Bulletproof Coffee morgens ist ein einfacher Weg um sofort mehr gesundes Fett zu essen.",
  },
  {
    id: "zu-wenig-wasser",
    nr: 3,
    emoji: "💧",
    titel: "Zu wenig Wasser trinken",
    symptome: ["Kopfschmerzen", "Verstopfung", "Müdigkeit", "Muskelkrämpfe"],
    warum: "Keto senkt den Insulinspiegel — dadurch scheiden die Nieren viel mehr Wasser und Natrium aus. Der Wasserbedarf auf Keto ist 30–40% höher als normal.",
    loesung: "Mindest 2,5–3 Liter täglich. Morgens sofort 500ml. Wasser-Tracker nutzen.",
    tipp: "Urin sollte hellgelb sein. Dunkelgelb = zu wenig Wasser.",
    link: { label: "Wasser tracken", href: "/" },
  },
  {
    id: "elektrolyte",
    nr: 4,
    emoji: "🧂",
    titel: "Elektrolyte vergessen",
    symptome: ["Muskelkrämpfe", "Herzrasen", "Schwindel", "Kopfschmerzen", "Keto-Grippe"],
    warum: "Mit dem Wasser verliert der Körper Natrium, Magnesium und Kalium. Diese Mineralstoffe sind für Nerven, Muskeln und Herzfunktion lebenswichtig — und werden auf Keto massiv schneller ausgeschieden.",
    loesung: "Täglich: 2–3g Natrium (Salz, Brühe), 300–400mg Magnesium (Supplement), 1–3g Kalium (Avocado, Spinat).",
    tipp: "Keto-Grippe ist fast immer Elektrolyt-Mangel — nicht Keto selbst macht krank.",
    link: { label: "Elektrolyte-Guide", href: "/keto-flu" },
  },
  {
    id: "zu-viel-eiweiss",
    nr: 5,
    emoji: "🥩",
    titel: "Zu viel Eiweiß",
    symptome: ["Keine Ketose trotz wenig KH", "Ketone niedrig", "Gewichtsstagnation"],
    warum: "Überschüssiges Protein wird in der Leber zu Glukose umgewandelt (Gluconeogenese). Bei sehr viel Eiweiß kann das den Insulinspiegel erhöhen und die Ketose bremsen.",
    loesung: "1,2–1,7g Protein pro kg Körpergewicht — nicht mehr. Fett als Hauptenergiequelle, nicht Protein.",
    tipp: "Keto ist eine fettreiche Ernährung, keine proteinreiche. Der Unterschied macht den Unterschied.",
  },
  {
    id: "ungeduld",
    nr: 6,
    emoji: "⏳",
    titel: "Zu wenig Geduld — Keto aufgeben",
    symptome: ["\"Keto funktioniert nicht bei mir\"", "Nach 2 Wochen aufgehört", "Keto-Grippe als Grund"],
    warum: "Die ersten 2–4 Wochen sind Umstellung — nicht Ergebnis. Der Körper baut Enzymkapazitäten auf, Mitochondrien passen sich an. Volle Keto-Adaptation dauert 6–12 Wochen.",
    loesung: "Mindestens 4 Wochen durchziehen. Keto-Grippe überstehen (dauert 3–7 Tage). Ergebnisse kommen — aber nicht sofort.",
    tipp: "Wer nach Woche 1 aufgibt, gibt genau dann auf wenn es gerade am härtesten ist — und kurz vor der Besserung.",
    link: { label: "Keto-Grippe Guide", href: "/keto-flu" },
  },
  {
    id: "versteckte-kh",
    nr: 7,
    emoji: "🕵️",
    titel: "Versteckte KH übersehen",
    symptome: ["Unerklärlicher Gewichtsstillstand", "Ketone schwanken stark"],
    warum: "KH verstecken sich überall: Milch (4,7g/100ml), Tomate (3,5g), Zwiebeln (9g), Ketchup (25g/100g), Light-Produkte, Proteinriegel, sogenannte zuckerfreie Süßigkeiten mit Maltitol.",
    loesung: "Scanner benutzen für alles Unbekannte. Verpackungen lesen — Gesamt-KH, nicht nur Zucker. Maltitol als KH zählen.",
    tipp: "Maltitol und andere Zuckeralkohole werden oft als keto-freundlich vermarktet — sind sie nicht. Nur Erythrit und Stevia sind wirklich unbedenklich.",
    link: { label: "Lebensmittel scannen", href: "/scanner" },
  },
  {
    id: "kein-tracking",
    nr: 8,
    emoji: "📊",
    titel: "Kein Tracking — auf Gefühl verlassen",
    symptome: ["\"Ich esse doch kaum KH\"", "Kein Überblick über Makros", "Keine Fortschritte"],
    warum: "Das Gehirn unterschätzt Portionsgrößen systematisch um 30–50%. Wer nicht trackt, isst fast immer mehr KH und Kalorien als gedacht.",
    loesung: "Alles loggen — zumindest in den ersten 4–6 Wochen. Danach entwickelt sich ein zuverlässiges Gefühl.",
    tipp: "Du musst nicht ewig tracken. Aber am Anfang ist es der Unterschied zwischen Erfolg und Frustration.",
    link: { label: "Nährwerte tracken", href: "/tracking" },
  },
  {
    id: "schlechter-schlaf",
    nr: 9,
    emoji: "😴",
    titel: "Schlaf ignorieren",
    symptome: ["Kein Gewichtsverlust trotz perfekter Ernährung", "Dauerhunger", "Heißhunger"],
    warum: "Schlechter Schlaf erhöht Cortisol und Ghrelin (Hungerhormon) um bis zu 30%. Das sabotiert Fettverbrennung und Ketonproduktion — selbst bei perfekter Keto-Ernährung.",
    loesung: "7–9 Stunden Schlaf. Magnesiumglycinat abends (300mg). Kein Bildschirm 1h vor dem Schlafen. Zimmer kühler als 19°C.",
    tipp: "Keto verbessert den Tiefschlaf messbar — aber erst nach 4–6 Wochen Adaption.",
    link: { label: "Supplement-Guide", href: "/supplemente" },
  },
  {
    id: "stress",
    nr: 10,
    emoji: "😤",
    titel: "Chronischen Stress unterschätzen",
    symptome: ["Blutzucker bleibt erhöht", "Kein Gewichtsverlust", "Schlechte Ketose trotz guter Ernährung"],
    warum: "Cortisol (Stresshormon) erhöht den Blutzucker direkt — ohne jede Kohlenhydrat-Aufnahme. Chronischer Stress kann Ketose aktiv hemmen und Fettverbrennung blockieren.",
    loesung: "Stressmanagement ist Keto-Pflicht: täglich 10 Min Spaziergang, Atemübungen, Schlafpriorisierung. Sport hilft — aber kein Übertraining.",
    tipp: "Keto löst keine Stressprobleme — aber es macht den Körper resilienter gegenüber Stress.",
  },
  {
    id: "cheat-days",
    nr: 11,
    emoji: "🍕",
    titel: "Cheat Days einbauen",
    symptome: ["Immer wieder von vorne anfangen", "Keto-Grippe mehrfach", "Frustriert aufgeben"],
    warum: "Ein einziger Cheat Day mit 150g+ KH leert die Ketose-Anpassung vollständig. Der Körper muss wieder von vorne beginnen — inklusive 2–3 Tage Keto-Grippe.",
    loesung: "Kein Cheat Day — aber Keto-freundliche Genussmomente: Zartbitter-Schokolade (85%+), Nüsse, Keto-Desserts, ein Glas Wein.",
    tipp: "Nach 8–12 Wochen voller Adaption vertragen manche Menschen gelegentlich mehr KH. Aber erst dann — und nicht als regelmäßige Ausrede.",
    link: { label: "Alkohol-Guide", href: "/alkohol" },
  },
  {
    id: "falsches-fett",
    nr: 12,
    emoji: "🫙",
    titel: "Falsches Fett essen",
    symptome: ["Entzündungen", "Schlechte Laborwerte", "Energielosigkeit trotz Keto"],
    warum: "Nicht jedes Fett ist gleich. Industrielle Pflanzenöle (Sonnenblumen-, Raps-, Maisöl) sind reich an Omega-6 und fördern Entzündungen. Das sabotiert die gesundheitlichen Vorteile von Keto.",
    loesung: "Bevorzuge: Olivenöl, Butter, Ghee, Kokosöl, Avocadoöl, Talgfett. Meide: Margarine, Sonnenblumenöl, industrielle Pflanzenöle aus der Flasche.",
    tipp: "Das Verhältnis Omega-3 zu Omega-6 sollte idealerweise 1:4 sein. Mit Industrieölen liegt es oft bei 1:20.",
  },
];

const KATEGORIEN = [
  { key: "alle", label: "Alle" },
  { key: "anfaenger", label: "Einsteiger" },
  { key: "fortgeschritten", label: "Fortgeschritten" },
  { key: "ernaehrung", label: "Ernährung" },
];

const ANFAENGER_IDS = ["zu-viel-kh", "zu-wenig-fett", "elektrolyte", "zu-wenig-wasser", "ungeduld", "kein-tracking"];
const FORTGESCHRITTEN_IDS = ["zu-viel-eiweiss", "versteckte-kh", "schlechter-schlaf", "stress", "cheat-days", "falsches-fett"];
const ERNAEHRUNG_IDS = ["zu-viel-kh", "zu-wenig-fett", "zu-viel-eiweiss", "versteckte-kh", "cheat-days", "falsches-fett"];

export default function FehlerPage() {
  const [offener, setOffener] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("alle");
  const [suche, setSuche] = useState("");

  function gefilterteList(): Fehler[] {
    let liste = FEHLER;
    if (filter === "anfaenger") liste = liste.filter(f => ANFAENGER_IDS.includes(f.id));
    if (filter === "fortgeschritten") liste = liste.filter(f => FORTGESCHRITTEN_IDS.includes(f.id));
    if (filter === "ernaehrung") liste = liste.filter(f => ERNAEHRUNG_IDS.includes(f.id));
    if (suche.trim()) {
      const s = suche.toLowerCase();
      liste = liste.filter(f =>
        f.titel.toLowerCase().includes(s) ||
        f.symptome.some(sy => sy.toLowerCase().includes(s)) ||
        f.warum.toLowerCase().includes(s)
      );
    }
    return liste;
  }

  const liste = gefilterteList();

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      {/* Hero */}
      <div className="mb-5">
        <h1 className="text-2xl font-black mb-1">❌ Die häufigsten<br />Keto-Fehler</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
          90% der Keto-Frustration kommt von 12 vermeidbaren Fehlern. Erkenne sie — und mach sie nicht.
        </p>
      </div>

      {/* Quick-Check Banner */}
      <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d44" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "#ef4444" }}>🔍 KETO LÄUFT NICHT? SUCHE HIER</div>
        <input
          value={suche}
          onChange={e => setSuche(e.target.value)}
          placeholder="Symptom eingeben — z.B. Muskelkrämpfe, Hunger..."
          className="w-full px-4 py-3 rounded-xl outline-none text-white text-sm"
          style={{ backgroundColor: "#2a1a1a", border: "1px solid #3a0a0a" }}
        />
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {KATEGORIEN.map(k => (
          <button key={k.key} onClick={() => { setFilter(k.key); setSuche(""); }}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: filter === k.key ? "#ef4444" : "#1a1a1a", color: filter === k.key ? "#fff" : "#888" }}>
            {k.label}
          </button>
        ))}
      </div>

      {/* Fehler-Liste */}
      <div className="space-y-2">
        {liste.map(f => (
          <div key={f.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
            {/* Header */}
            <button className="w-full px-4 py-3.5 text-left flex items-center gap-3"
              onClick={() => setOffener(offener === f.id ? null : f.id)}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
                style={{ backgroundColor: "#2a0a0a", color: "#ef4444" }}>
                {f.nr}
              </div>
              <span className="text-lg flex-shrink-0">{f.emoji}</span>
              <span className="flex-1 text-sm font-semibold leading-snug">{f.titel}</span>
              <span className="flex-shrink-0 text-xs" style={{ color: "#333" }}>{offener === f.id ? "▲" : "▼"}</span>
            </button>

            {/* Symptome Chips */}
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {f.symptome.map(s => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#2a1a1a", color: "#ef444488" }}>
                  {s}
                </span>
              ))}
            </div>

            {/* Detail */}
            {offener === f.id && (
              <div className="border-t px-4 pb-4 space-y-3" style={{ borderColor: "#2a2a2a" }}>
                <div className="pt-3">
                  <div className="text-xs font-semibold mb-1" style={{ color: "#f59e0b" }}>🔍 WARUM PASSIERT DAS?</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>{f.warum}</p>
                </div>
                <div className="rounded-xl p-3" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: "#22c55e" }}>✅ DIE LÖSUNG</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#ccc" }}>{f.loesung}</p>
                </div>
                {f.tipp && (
                  <div className="rounded-xl p-3" style={{ backgroundColor: "#1a1a2a", border: "1px solid #3b82f622" }}>
                    <div className="text-xs font-semibold mb-1" style={{ color: "#3b82f6" }}>💡 MERKE</div>
                    <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>{f.tipp}</p>
                  </div>
                )}
                {f.link && (
                  <Link href={f.link.href}
                    className="flex items-center gap-2 text-xs font-semibold"
                    style={{ color: "#22c55e" }}>
                    → {f.link.label}
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {liste.length === 0 && (
        <div className="text-center py-10" style={{ color: "#555" }}>
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm">Kein Fehler gefunden für "{suche}"</p>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-6 rounded-2xl p-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
        <div className="text-xs font-semibold mb-1" style={{ color: "#22c55e" }}>🏆 Keto richtig machen</div>
        <p className="text-xs leading-relaxed mb-3" style={{ color: "#888" }}>
          Tracke deine Makros, messe deine Ketone und nutze den Supplement-Guide — dann passieren diese Fehler gar nicht erst.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Tracking", href: "/tracking", emoji: "📊" },
            { label: "Profi-Zone", href: "/profis", emoji: "⚗️" },
            { label: "Supplemente", href: "/supplemente", emoji: "💊" },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className="flex flex-col items-center gap-1 py-2 rounded-xl text-center"
              style={{ backgroundColor: "#1a2a1a" }}>
              <span className="text-lg">{l.emoji}</span>
              <span className="text-xs" style={{ color: "#22c55e" }}>{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
