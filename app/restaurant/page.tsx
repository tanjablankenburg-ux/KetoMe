"use client";
import { useState } from "react";
import Link from "next/link";

type Ampel = "gruen" | "gelb" | "rot";

type Gericht = {
  name: string;
  ampel: Ampel;
  kh?: string;
  hinweis?: string;
};

type Kueche = {
  id: string;
  emoji: string;
  name: string;
  gerichte: Gericht[];
  profiTipp: string;
};

const AMPEL_CONFIG = {
  gruen: { farbe: "#22c55e", bg: "#0d2018", border: "#166534", label: "Keto-freundlich", emoji: "✅" },
  gelb:  { farbe: "#f59e0b", bg: "#1a1200", border: "#78350f", label: "Mit Anpassung okay", emoji: "⚠️" },
  rot:   { farbe: "#ef4444", bg: "#1a0a0a", border: "#7f1d1d", label: "Vermeiden", emoji: "❌" },
};

const KUECHEN: Kueche[] = [
  {
    id: "italienisch",
    emoji: "🍝",
    name: "Italienisch",
    profiTipp: "Bitte um Fleisch oder Fisch mit Gemüse statt Pasta. Olivenöl großzügig drauf. Antipasti-Platte ist oft perfekt keto.",
    gerichte: [
      { name: "Carpaccio", ampel: "gruen", kh: "~1g", hinweis: "Mit Rucola und Parmesan — perfekt" },
      { name: "Antipasti-Platte", ampel: "gruen", kh: "~3g", hinweis: "Auf Brot verzichten, alles andere essen" },
      { name: "Bistecca / Gegrilltes Fleisch", ampel: "gruen", kh: "~0g" },
      { name: "Branzino / Gegrillter Fisch", ampel: "gruen", kh: "~0g", hinweis: "Mit Zitrone und Olivenöl" },
      { name: "Insalata Caprese", ampel: "gruen", kh: "~4g" },
      { name: "Gemischter Salat (ohne Croutons)", ampel: "gruen", kh: "~5g" },
      { name: "Tiramisu", ampel: "rot", kh: "~35g" },
      { name: "Pizza", ampel: "rot", kh: "~60-80g" },
      { name: "Pasta jeder Art", ampel: "rot", kh: "~60-80g" },
      { name: "Risotto", ampel: "rot", kh: "~45g" },
      { name: "Focaccia / Brot", ampel: "rot", kh: "~40g" },
      { name: "Minestrone", ampel: "gelb", kh: "~15g", hinweis: "Hängt stark von Rezept ab" },
    ],
  },
  {
    id: "asiatisch",
    emoji: "🍜",
    name: "Asiatisch / Sushi",
    profiTipp: "Sashimi statt Sushi. Gebratenes Fleisch/Gemüse ohne Sauce oder mit Sojasoße. Vorsicht bei Teriyaki und Pad Thai — immer Zucker drin.",
    gerichte: [
      { name: "Sashimi", ampel: "gruen", kh: "~0g", hinweis: "Roher Fisch ohne Reis — ideal" },
      { name: "Edamame", ampel: "gruen", kh: "~2g Netto" },
      { name: "Miso-Suppe", ampel: "gruen", kh: "~3g" },
      { name: "Gebratenes Fleisch/Gemüse (ohne Sauce)", ampel: "gruen", kh: "~5g" },
      { name: "Sushi / Maki / Nigiri", ampel: "rot", kh: "~30-50g", hinweis: "Reis ist das Problem" },
      { name: "Pad Thai", ampel: "rot", kh: "~40g", hinweis: "Zucker + Reisnudeln" },
      { name: "Teriyaki-Sauce", ampel: "rot", kh: "~15g pro Portion", hinweis: "Sehr viel Zucker" },
      { name: "Frühlingsrollen (frittiert)", ampel: "rot", kh: "~25g" },
      { name: "Ramen / Nudelsuppen", ampel: "rot", kh: "~50g" },
      { name: "Tempura", ampel: "rot", kh: "~20g", hinweis: "Panade aus Mehl" },
      { name: "Gebratener Reis", ampel: "rot", kh: "~45g" },
      { name: "Teriyaki Fleisch (Fleisch selbst)", ampel: "gelb", kh: "~8g", hinweis: "Sauce weglassen oder fragen ob ohne Zucker moeglich" },
    ],
  },
  {
    id: "griechisch",
    emoji: "🫒",
    name: "Griechisch",
    profiTipp: "Griechisch ist fast das perfekte Keto-Restaurant. Gegrilltes Fleisch, Feta, Oliven, Salat — alles keto-freundlich. Nur Pita und Tzatziki-Menge beachten.",
    gerichte: [
      { name: "Griechischer Salat", ampel: "gruen", kh: "~6g", hinweis: "Feta und Oliven reichlich" },
      { name: "Souvlaki (Fleisch ohne Pita)", ampel: "gruen", kh: "~1g" },
      { name: "Gegrillter Oktopus", ampel: "gruen", kh: "~2g" },
      { name: "Feta gebacken", ampel: "gruen", kh: "~1g" },
      { name: "Lammkoteletts", ampel: "gruen", kh: "~0g" },
      { name: "Tzatziki", ampel: "gruen", kh: "~4g", hinweis: "Maßvoll — Joghurt hat KH" },
      { name: "Oliven", ampel: "gruen", kh: "~1g" },
      { name: "Pita-Brot", ampel: "rot", kh: "~30g" },
      { name: "Gyros-Teller mit Pommes", ampel: "rot", kh: "~50g" },
      { name: "Moussaka", ampel: "gelb", kh: "~15g", hinweis: "Kartoffeln und Bechamel — Portion klein halten" },
      { name: "Spanakopita", ampel: "rot", kh: "~25g", hinweis: "Blatterteig" },
    ],
  },
  {
    id: "burger",
    emoji: "🍔",
    name: "Burger / Fast Food",
    profiTipp: "Burger ohne Bun bestellen (die meisten machen das). Salat statt Pommes. Bei McDonald's, BK & Co.: Burger auspacken, Patty und Belag essen.",
    gerichte: [
      { name: "Burger ohne Bun (Patty + Kaese + Bacon)", ampel: "gruen", kh: "~2g" },
      { name: "Salat als Beilage", ampel: "gruen", kh: "~5g" },
      { name: "Gegrilltes Haehnchen (ohne Panade)", ampel: "gruen", kh: "~0g" },
      { name: "Burger mit Bun", ampel: "rot", kh: "~35-45g" },
      { name: "Pommes Frites", ampel: "rot", kh: "~40g" },
      { name: "Chicken Nuggets", ampel: "rot", kh: "~20g", hinweis: "Panade aus Mehl" },
      { name: "Milkshake", ampel: "rot", kh: "~60g" },
      { name: "Cola / Softdrinks", ampel: "rot", kh: "~35g pro 300ml" },
      { name: "Wraps", ampel: "rot", kh: "~40g" },
      { name: "Mayo / Senf", ampel: "gruen", kh: "~1g", hinweis: "Ketchup vermeiden — viel Zucker" },
    ],
  },
  {
    id: "deutsch",
    emoji: "🥩",
    name: "Deutsch / Steakhouse",
    profiTipp: "Steakhouses sind Keto-Paradies. Fleisch, Salat, Gemüse. Vorsicht bei Saucen (oft mit Mehl gebunden) und Beilagen. Einfach fragen und tauschen.",
    gerichte: [
      { name: "Steak (jede Art)", ampel: "gruen", kh: "~0g" },
      { name: "Schweinebraten (ohne Knoedel)", ampel: "gruen", kh: "~2g" },
      { name: "Schnitzel (ohne Panade, gebacken)", ampel: "gelb", kh: "~1g", hinweis: "Panade weglassen oder Naturschnitzel bestellen" },
      { name: "Gemischter Salat", ampel: "gruen", kh: "~5g" },
      { name: "Sauerkraut", ampel: "gruen", kh: "~3g" },
      { name: "Spargel mit Butter", ampel: "gruen", kh: "~4g" },
      { name: "Gemuese-Beilage", ampel: "gruen", kh: "~6g" },
      { name: "Knoedel / Kloesse", ampel: "rot", kh: "~40g" },
      { name: "Pommes / Bratkartoffeln", ampel: "rot", kh: "~35g" },
      { name: "Brot / Brezel", ampel: "rot", kh: "~45g" },
      { name: "Saucen (gebunden)", ampel: "gelb", kh: "~8g", hinweis: "Fragen ob ohne Mehl moeglich" },
      { name: "Weizenbier", ampel: "rot", kh: "~13g pro 0,5L" },
    ],
  },
  {
    id: "mexikanisch",
    emoji: "🌮",
    name: "Mexikanisch",
    profiTipp: "Burrito-Bowl statt Burrito — alle Zutaten ohne Tortilla. Guacamole ist keto-Gold. Bohnen und Reis weglassen oder tauschen.",
    gerichte: [
      { name: "Guacamole (mit Gemuese statt Chips)", ampel: "gruen", kh: "~4g" },
      { name: "Gegrilltes Fleisch / Carnitas", ampel: "gruen", kh: "~1g" },
      { name: "Burrito-Bowl (ohne Reis und Bohnen)", ampel: "gruen", kh: "~8g" },
      { name: "Salsa (maßvoll)", ampel: "gruen", kh: "~3g" },
      { name: "Kaese / Sour Cream", ampel: "gruen", kh: "~2g" },
      { name: "Tortilla / Wrap", ampel: "rot", kh: "~30g" },
      { name: "Tortilla-Chips", ampel: "rot", kh: "~20g pro Portion" },
      { name: "Reis", ampel: "rot", kh: "~40g" },
      { name: "Schwarze Bohnen", ampel: "rot", kh: "~20g" },
      { name: "Nachos mit allem", ampel: "rot", kh: "~50g" },
      { name: "Margarita", ampel: "rot", kh: "~20g", hinweis: "Zucker und Orangenlikör" },
    ],
  },
  {
    id: "indisch",
    emoji: "🍛",
    name: "Indisch",
    profiTipp: "Fleisch- und Gemüse-Currys ohne Reis bestellen. Tandoori-Gerichte sind oft keto-freundlich. Naan und Reis konsequent ablehnen.",
    gerichte: [
      { name: "Tandoori-Haehnchen", ampel: "gruen", kh: "~3g" },
      { name: "Saag Paneer (Spinat mit Kaese)", ampel: "gruen", kh: "~6g" },
      { name: "Lammcurry (ohne Reis)", ampel: "gruen", kh: "~8g" },
      { name: "Raita (Joghurt-Dip)", ampel: "gruen", kh: "~5g" },
      { name: "Butter Chicken (ohne Reis)", ampel: "gelb", kh: "~12g", hinweis: "Etwas Zucker in der Sauce, aber okay in Massen" },
      { name: "Naan-Brot", ampel: "rot", kh: "~35g" },
      { name: "Basmati-Reis", ampel: "rot", kh: "~45g" },
      { name: "Samosas", ampel: "rot", kh: "~25g", hinweis: "Teighulle aus Mehl" },
      { name: "Mango Lassi", ampel: "rot", kh: "~35g" },
      { name: "Dal (Linsensuppe)", ampel: "rot", kh: "~25g", hinweis: "Linsen sehr KH-reich" },
    ],
  },
];

const TIPPS = [
  { emoji: "🗣️", titel: "Was du sagen kannst", text: "\"Kann ich die Beilage tauschen? Statt Pommes lieber Salat oder Gemüse.\" — Fast jedes Restaurant macht das." },
  { emoji: "🥗", titel: "Notfall-Bestellung", text: "Salat mit gegrilltem Fleisch oder Fisch funktioniert in fast jedem Restaurant. Dressing separat bestellen und selbst portionieren." },
  { emoji: "🫙", titel: "Vorsicht Saucen", text: "Viele Saucen sind mit Mehl gebunden oder enthalten Zucker. Frage nach oder bestelle Saucen separat. Olivenöl + Zitrone ist immer sicher." },
  { emoji: "🍷", titel: "Getränke", text: "Wasser, Mineralwasser, Espresso, trockener Rotwein/Weisswein oder Spirituosen pur. Kein Saft, Cola, Bier oder Cocktails mit Likoer." },
  { emoji: "📱", titel: "Scanner als Backup", text: "Bei verpackten Sachen im Restaurant (Dressing, Sauce) einfach den Scanner nutzen." },
  { emoji: "😌", titel: "Nicht stressen", text: "Ein Essen ist kein Keto-Schaden. Wenn du 90% richtig machst, passiert nichts. Genieße das Essen — Stress ist schlechter als ein paar extra KH." },
];

export default function RestaurantPage() {
  const [aktiveKueche, setAktiveKueche] = useState<string | null>(null);
  const [ampelFilter, setAmpelFilter] = useState<Ampel | "alle">("alle");

  const kueche = KUECHEN.find(k => k.id === aktiveKueche);

  function gefilterteGerichte(gerichte: Gericht[]) {
    if (ampelFilter === "alle") return gerichte;
    return gerichte.filter(g => g.ampel === ampelFilter);
  }

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      <div className="mb-5">
        <h1 className="text-2xl font-black mb-1">🍽 Restaurant-Guide</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
          Keto auch beim Essen gehen — so bestellst du richtig in jedem Restaurant.
        </p>
      </div>

      {/* Ampel-Legende */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {(["gruen", "gelb", "rot"] as Ampel[]).map(a => {
          const cfg = AMPEL_CONFIG[a];
          return (
            <div key={a} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
              <div className="text-lg mb-0.5">{cfg.emoji}</div>
              <div className="text-[10px] font-semibold" style={{ color: cfg.farbe }}>{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Küchen-Auswahl */}
      {!aktiveKueche ? (
        <>
          <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>KÜCHE WÄHLEN</div>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {KUECHEN.map(k => (
              <button key={k.id} onClick={() => setAktiveKueche(k.id)}
                className="rounded-2xl p-4 text-left flex items-center gap-3"
                style={{ backgroundColor: "#1a1a1a" }}>
                <span className="text-3xl">{k.emoji}</span>
                <span className="font-semibold text-sm">{k.name}</span>
              </button>
            ))}
          </div>

          {/* Survival-Tipps */}
          <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>KETO-SURVIVAL BEIM ESSEN GEHEN</div>
          <div className="space-y-2">
            {TIPPS.map((t, i) => (
              <div key={i} className="rounded-2xl p-4 flex gap-3" style={{ backgroundColor: "#1a1a1a" }}>
                <span className="text-xl flex-shrink-0">{t.emoji}</span>
                <div>
                  <div className="font-semibold text-sm mb-0.5">{t.titel}</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#888" }}>{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        kueche && (
          <>
            {/* Back + Header */}
            <button onClick={() => { setAktiveKueche(null); setAmpelFilter("alle"); }}
              className="flex items-center gap-2 mb-4 text-sm" style={{ color: "#888" }}>
              ← Alle Küchen
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{kueche.emoji}</span>
              <h2 className="text-xl font-black">{kueche.name}</h2>
            </div>

            {/* Profi-Tipp */}
            <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
              <div className="text-xs font-semibold mb-1" style={{ color: "#22c55e" }}>💡 PROFI-TIPP</div>
              <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>{kueche.profiTipp}</p>
            </div>

            {/* Ampel-Filter */}
            <div className="flex gap-2 mb-4">
              {([
                { key: "alle", label: "Alle" },
                { key: "gruen", label: "✅ Okay" },
                { key: "gelb", label: "⚠️ Bedingt" },
                { key: "rot", label: "❌ Meiden" },
              ] as const).map(f => (
                <button key={f.key} onClick={() => setAmpelFilter(f.key)}
                  className="flex-1 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: ampelFilter === f.key
                      ? (f.key === "gruen" ? "#22c55e" : f.key === "gelb" ? "#f59e0b" : f.key === "rot" ? "#ef4444" : "#555")
                      : "#1a1a1a",
                    color: ampelFilter === f.key ? (f.key === "alle" ? "#fff" : "#000") : "#888",
                  }}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Gerichte */}
            <div className="space-y-1.5">
              {gefilterteGerichte(kueche.gerichte).map((g, i) => {
                const cfg = AMPEL_CONFIG[g.ampel];
                return (
                  <div key={i} className="rounded-xl px-4 py-3 flex items-start gap-3"
                    style={{ backgroundColor: "#1a1a1a", borderLeft: `3px solid ${cfg.farbe}` }}>
                    <span className="text-base flex-shrink-0 mt-0.5">{cfg.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{g.name}</span>
                        {g.kh && (
                          <span className="text-xs flex-shrink-0 font-semibold" style={{ color: cfg.farbe }}>{g.kh} KH</span>
                        )}
                      </div>
                      {g.hinweis && (
                        <p className="text-xs mt-0.5" style={{ color: "#666" }}>{g.hinweis}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Link zum Alkohol-Guide */}
            <Link href="/alkohol" className="mt-5 flex items-center gap-3 rounded-2xl p-4"
              style={{ backgroundColor: "#1a1a1a" }}>
              <span className="text-2xl">🍷</span>
              <div>
                <div className="font-semibold text-sm">Was trinken beim Essen?</div>
                <div className="text-xs" style={{ color: "#555" }}>Alkohol-Guide mit Ampel-System</div>
              </div>
              <span className="ml-auto text-xs" style={{ color: "#333" }}>→</span>
            </Link>
          </>
        )
      )}
    </main>
  );
}
