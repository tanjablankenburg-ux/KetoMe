"use client";
import { useState } from "react";
import Link from "next/link";

type Ampel = "gruen" | "gelb" | "rot";

type Getraenk = {
  name: string;
  kategorie: string;
  kh: number;
  alkohol: string;
  portion: string;
  ampel: Ampel;
  hinweis?: string;
};

const GETRAENKE: Getraenk[] = [
  // Spirituosen — grün
  { name: "Wodka", kategorie: "Spirituosen", kh: 0, alkohol: "40%", portion: "4 cl", ampel: "gruen", hinweis: "Pur oder mit Sprudelwasser — kein Zucker" },
  { name: "Gin", kategorie: "Spirituosen", kh: 0, alkohol: "40%", portion: "4 cl", ampel: "gruen", hinweis: "Mit zuckerfreiem Tonic (Fever-Tree Light)" },
  { name: "Tequila", kategorie: "Spirituosen", kh: 0, alkohol: "40%", portion: "4 cl", ampel: "gruen", hinweis: "100% Agave, pur oder mit Limette" },
  { name: "Rum (weiß/dunkel, pur)", kategorie: "Spirituosen", kh: 0, alkohol: "40%", portion: "4 cl", ampel: "gruen", hinweis: "Nur pur — kein Spiced Rum (Zucker)" },
  { name: "Whiskey / Bourbon", kategorie: "Spirituosen", kh: 0, alkohol: "40%", portion: "4 cl", ampel: "gruen", hinweis: "Pur, on the rocks oder mit Wasser" },
  { name: "Cognac / Brandy", kategorie: "Spirituosen", kh: 0, alkohol: "40%", portion: "4 cl", ampel: "gruen" },
  { name: "Schnaps (klar)", kategorie: "Spirituosen", kh: 0, alkohol: "40%", portion: "2 cl", ampel: "gruen" },
  // Wein — gelb
  { name: "Weißwein (trocken)", kategorie: "Wein", kh: 1.5, alkohol: "12%", portion: "150 ml", ampel: "gelb", hinweis: "Trocken = wenig Restzucker. Riesling trocken, Pinot Grigio" },
  { name: "Rotwein (trocken)", kategorie: "Wein", kh: 2.0, alkohol: "13%", portion: "150 ml", ampel: "gelb", hinweis: "Cabernet, Merlot, Pinot Noir trocken" },
  { name: "Rosé (trocken)", kategorie: "Wein", kh: 2.5, alkohol: "12%", portion: "150 ml", ampel: "gelb" },
  { name: "Sekt / Champagner (brut)", kategorie: "Wein", kh: 1.5, alkohol: "12%", portion: "120 ml", ampel: "gelb", hinweis: "Brut = trocken. Extra Dry oder Demi-Sec vermeiden" },
  { name: "Prosecco (brut)", kategorie: "Wein", kh: 1.5, alkohol: "11%", portion: "120 ml", ampel: "gelb" },
  { name: "Weißwein (halbtrocken)", kategorie: "Wein", kh: 5.5, alkohol: "12%", portion: "150 ml", ampel: "rot", hinweis: "Restzucker deutlich höher" },
  { name: "Rotwein (lieblich)", kategorie: "Wein", kh: 7.0, alkohol: "12%", portion: "150 ml", ampel: "rot" },
  { name: "Dessertwein / Portwein", kategorie: "Wein", kh: 14, alkohol: "18%", portion: "80 ml", ampel: "rot", hinweis: "Sehr hoher Zuckergehalt" },
  // Bier
  { name: "Bier (normal)", kategorie: "Bier", kh: 13, alkohol: "5%", portion: "500 ml", ampel: "rot", hinweis: "\"Flüssiges Brot\" — absolutes Keto-No-Go" },
  { name: "Weizenbier", kategorie: "Bier", kh: 16, alkohol: "5%", portion: "500 ml", ampel: "rot" },
  { name: "Alkoholfreies Bier", kategorie: "Bier", kh: 15, alkohol: "0%", portion: "500 ml", ampel: "rot", hinweis: "Mehr Kohlenhydrate als normales Bier!" },
  { name: "Leichtbier (z.B. Becks Gold)", kategorie: "Bier", kh: 8, alkohol: "4%", portion: "500 ml", ampel: "rot", hinweis: "Weniger KH, aber immer noch zu viel" },
  { name: "Craft Beer / IPA", kategorie: "Bier", kh: 15, alkohol: "6%", portion: "330 ml", ampel: "rot" },
  // Cocktails & Mixes
  { name: "Gin Tonic (zuckerfrei)", kategorie: "Cocktails", kh: 0.5, alkohol: "10%", portion: "250 ml", ampel: "gelb", hinweis: "Fever-Tree Light oder Schweppes Zero" },
  { name: "Wodka Soda + Limette", kategorie: "Cocktails", kh: 0, alkohol: "10%", portion: "250 ml", ampel: "gruen", hinweis: "Der Keto-Cocktail schlechthin" },
  { name: "Mojito (klassisch)", kategorie: "Cocktails", kh: 18, alkohol: "10%", portion: "250 ml", ampel: "rot", hinweis: "Zuckersirup + Limettensaft = KH-Bombe" },
  { name: "Margarita", kategorie: "Cocktails", kh: 14, alkohol: "15%", portion: "150 ml", ampel: "rot" },
  { name: "Pina Colada", kategorie: "Cocktails", kh: 28, alkohol: "12%", portion: "250 ml", ampel: "rot" },
  { name: "Aperol Spritz", kategorie: "Cocktails", kh: 16, alkohol: "8%", portion: "250 ml", ampel: "rot" },
  { name: "Hugo", kategorie: "Cocktails", kh: 20, alkohol: "8%", portion: "250 ml", ampel: "rot" },
  { name: "Long Island Ice Tea", kategorie: "Cocktails", kh: 22, alkohol: "22%", portion: "250 ml", ampel: "rot" },
  { name: "Bloody Mary", kategorie: "Cocktails", kh: 6, alkohol: "12%", portion: "250 ml", ampel: "gelb", hinweis: "Tomaten haben etwas KH — in Maßen ok" },
  // Liköre
  { name: "Baileys", kategorie: "Liköre", kh: 10, alkohol: "17%", portion: "4 cl", ampel: "rot" },
  { name: "Jägermeister", kategorie: "Liköre", kh: 16, alkohol: "35%", portion: "4 cl", ampel: "rot" },
  { name: "Amaretto", kategorie: "Liköre", kh: 22, alkohol: "28%", portion: "4 cl", ampel: "rot" },
  { name: "Limoncello", kategorie: "Liköre", kh: 18, alkohol: "30%", portion: "4 cl", ampel: "rot" },
];

const KATEGORIEN = ["Alle", "Spirituosen", "Wein", "Bier", "Cocktails", "Liköre"];

const AMPEL_CONFIG = {
  gruen: { farbe: "#22c55e", bg: "#0d2018", border: "#166534", label: "✓ Keto-OK", emoji: "🟢" },
  gelb: { farbe: "#f59e0b", bg: "#1a1200", border: "#854d0e", label: "⚠ In Maßen", emoji: "🟡" },
  rot: { farbe: "#ef4444", bg: "#1a0a0a", border: "#7f1d1d", label: "✕ Meiden", emoji: "🔴" },
};

export default function AlkoholPage() {
  const [filter, setFilter] = useState<Ampel | "alle">("alle");
  const [kategorie, setKategorie] = useState("Alle");
  const [suche, setSuche] = useState("");

  const gefiltert = GETRAENKE.filter(g => {
    if (filter !== "alle" && g.ampel !== filter) return false;
    if (kategorie !== "Alle" && g.kategorie !== kategorie) return false;
    if (suche && !g.name.toLowerCase().includes(suche.toLowerCase())) return false;
    return true;
  });

  const gruen = GETRAENKE.filter(g => g.ampel === "gruen").length;
  const gelb = GETRAENKE.filter(g => g.ampel === "gelb").length;
  const rot = GETRAENKE.filter(g => g.ampel === "rot").length;

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>
      <h1 className="text-xl font-bold mb-1">🍷 Alkohol auf Keto</h1>
      <p className="text-sm mb-5" style={{ color: "#666" }}>Was geht, was nicht — und warum Alkohol auf Keto anders wirkt.</p>

      {/* Wichtiger Hinweis */}
      <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d44" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "#ef4444" }}>⚠ WICHTIG ZU WISSEN</div>
        <div className="space-y-2 text-xs leading-relaxed" style={{ color: "#aaa" }}>
          <p>🔥 <strong style={{ color: "#fff" }}>Alkohol pausiert Ketose temporär</strong> — die Leber verarbeitet Alkohol vor Fett. Ketone sinken für einige Stunden.</p>
          <p>💫 <strong style={{ color: "#fff" }}>Du wirst schneller betrunken</strong> — kein Glykogen-Puffer mehr. Weniger trinken als sonst.</p>
          <p>🤕 <strong style={{ color: "#fff" }}>Kater ist schlimmer</strong> — Elektrolyte gehen schneller verloren. Vorher und nachher Elektrolyte nehmen.</p>
          <p>🍺 <strong style={{ color: "#fff" }}>Bier ist das absolute No-Go</strong> — „flüssiges Brot" mit 13–16g KH pro 500ml.</p>
        </div>
      </div>

      {/* Ampel-Filter */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(["gruen", "gelb", "rot"] as Ampel[]).map(a => {
          const c = AMPEL_CONFIG[a];
          const count = a === "gruen" ? gruen : a === "gelb" ? gelb : rot;
          return (
            <button key={a} onClick={() => setFilter(filter === a ? "alle" : a)}
              className="rounded-2xl p-3 text-center transition-all"
              style={{
                backgroundColor: filter === a ? c.bg : "#1a1a1a",
                border: `2px solid ${filter === a ? c.farbe : "transparent"}`,
              }}>
              <div className="text-xl mb-0.5">{c.emoji}</div>
              <div className="text-xs font-semibold" style={{ color: c.farbe }}>{c.label}</div>
              <div className="text-xs mt-0.5" style={{ color: "#444" }}>{count} Getränke</div>
            </button>
          );
        })}
      </div>

      {/* Suche */}
      <input value={suche} onChange={e => setSuche(e.target.value)}
        placeholder="Getränk suchen…"
        className="w-full px-4 py-3 rounded-xl outline-none text-white mb-3"
        style={{ backgroundColor: "#1a1a1a" }} />

      {/* Kategorie-Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {KATEGORIEN.map(k => (
          <button key={k} onClick={() => setKategorie(k)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: kategorie === k ? "#22c55e" : "#1a1a1a", color: kategorie === k ? "#000" : "#888" }}>
            {k}
          </button>
        ))}
      </div>

      {/* Getränke-Liste */}
      <div className="space-y-2 mb-8">
        {gefiltert.length === 0 && (
          <div className="text-center py-8" style={{ color: "#555" }}>
            <div className="text-3xl mb-2">🔍</div>
            <p>Kein Treffer</p>
          </div>
        )}
        {gefiltert.map((g, i) => {
          const c = AMPEL_CONFIG[g.ampel];
          return (
            <div key={i} className="rounded-2xl p-4"
              style={{ backgroundColor: "#1a1a1a", borderLeft: `3px solid ${c.farbe}` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm">{g.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#2a2a2a", color: "#555" }}>{g.kategorie}</span>
                  </div>
                  <div className="flex gap-3 text-xs mb-1" style={{ color: "#555" }}>
                    <span>{g.portion}</span>
                    <span>{g.alkohol} Alk.</span>
                  </div>
                  {g.hinweis && (
                    <p className="text-xs leading-relaxed" style={{ color: "#666" }}>💡 {g.hinweis}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold" style={{ color: c.farbe }}>
                    {g.kh === 0 ? "0g" : `${g.kh}g`}
                  </div>
                  <div className="text-xs" style={{ color: "#444" }}>Netto-KH</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Survival-Tipps */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "#22c55e" }}>💡 KETO-SURVIVAL-TIPPS FÜR ABENDE</div>
        <div className="space-y-3">
          {[
            { emoji: "🥑", tipp: "Vorher fettreich essen", detail: "Fett verlangsamt die Alkohol-Aufnahme. Avocado, Nüsse, Käse vor dem Ausgehen." },
            { emoji: "🧂", tipp: "Elektrolyte vorher & nachher", detail: "Alkohol entwässert stark. Magnesium & Natrium vor dem Schlafen = weniger Kater." },
            { emoji: "💧", tipp: "Wasser zwischen jedem Drink", detail: "1 Glas Wasser = 1 Drink. Halbiert den Kater und hält die Ketose stabiler." },
            { emoji: "🥃", tipp: "Spirituosen pur oder mit Soda", detail: "Wodka-Soda mit Limette ist der Keto-Standard. Null KH, gesellschaftsfähig." },
            { emoji: "🚫", tipp: "Zuckersirupe ablehnen", detail: "Bartender fragen ob zuckerfreie Variante möglich. Meist kein Problem." },
            { emoji: "📅", tipp: "Am nächsten Tag: mehr Fett", detail: "Ketose erholt sich schnell wenn du sofort wieder clean isst. Kein Frühstücks-Brötchen." },
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">{t.emoji}</span>
              <div>
                <div className="text-sm font-semibold">{t.tipp}</div>
                <div className="text-xs mt-0.5 leading-relaxed" style={{ color: "#888" }}>{t.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DIY Keto-Cocktails */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>🍹 KETO-COCKTAIL REZEPTE (0–2g KH)</div>
        <div className="space-y-4">
          {[
            {
              name: "Keto Mojito", kh: "~1g", zutaten: ["6 cl Weißrum", "Saft 1 Limette", "Frische Minze", "Soda-Wasser", "Stevia oder Erythrit"],
              zubereitung: "Minze andrücken, Limette auspressen, Rum dazu, Eis, mit Soda auffüllen. Stevia statt Zucker.",
            },
            {
              name: "Keto Gin Tonic", kh: "~0.5g", zutaten: ["5 cl Gin", "150 ml Fever-Tree Light Tonic", "Gurke oder Rosmarin", "Eis"],
              zubereitung: "Großes Glas, viel Eis, Gin, Light Tonic, Gurken-Scheibe rein. Fertig.",
            },
            {
              name: "Keto Margarita", kh: "~1g", zutaten: ["5 cl Tequila (100% Agave)", "2 cl Triple Sec (nur ein Schuss)", "Saft 1 Limette", "Salz-Rand", "Crushed Ice"],
              zubereitung: "Alles auf Eis shaken, gesalzenen Rand, servieren. Wenig Triple Sec = wenig KH.",
            },
          ].map((r, i) => (
            <div key={i} className="rounded-xl p-3" style={{ backgroundColor: "#2a2a2a" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{r.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "#22c55e22", color: "#22c55e" }}>{r.kh} KH</span>
              </div>
              <div className="mb-2">
                {r.zutaten.map((z, j) => (
                  <div key={j} className="flex items-center gap-1.5 text-xs py-0.5" style={{ color: "#888" }}>
                    <span style={{ color: "#333" }}>·</span> {z}
                  </div>
                ))}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#666", borderTop: "1px solid #333", paddingTop: "8px" }}>{r.zubereitung}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
