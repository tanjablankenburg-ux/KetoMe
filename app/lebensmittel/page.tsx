"use client";
import { useState } from "react";

const LEBENSMITTEL = [
  // Fleisch & Fisch
  { name: "Hähnchenbrust", kategorie: "Fleisch", kcal: 165, eiweiss: 31, fett: 3.6, kh: 0 },
  { name: "Rinderhack (20% Fett)", kategorie: "Fleisch", kcal: 254, eiweiss: 17, fett: 20, kh: 0 },
  { name: "Speck / Bacon", kategorie: "Fleisch", kcal: 541, eiweiss: 37, fett: 42, kh: 0 },
  { name: "Lachs", kategorie: "Fisch", kcal: 208, eiweiss: 20, fett: 13, kh: 0 },
  { name: "Thunfisch (Dose, Wasser)", kategorie: "Fisch", kcal: 116, eiweiss: 26, fett: 1, kh: 0 },
  { name: "Garnelen", kategorie: "Fisch", kcal: 99, eiweiss: 24, fett: 0.3, kh: 0 },
  // Eier & Milch
  { name: "Ei (1 Stück)", kategorie: "Eier & Milch", kcal: 78, eiweiss: 6, fett: 5, kh: 0.6 },
  { name: "Butter (100g)", kategorie: "Eier & Milch", kcal: 717, eiweiss: 0.9, fett: 81, kh: 0.1 },
  { name: "Sahne (30% Fett)", kategorie: "Eier & Milch", kcal: 292, eiweiss: 2.4, fett: 30, kh: 3 },
  { name: "Frischkäse", kategorie: "Eier & Milch", kcal: 342, eiweiss: 7, fett: 34, kh: 3 },
  { name: "Mozzarella", kategorie: "Eier & Milch", kcal: 280, eiweiss: 18, fett: 22, kh: 2.2 },
  { name: "Parmesan", kategorie: "Eier & Milch", kcal: 392, eiweiss: 36, fett: 26, kh: 0 },
  // Gemüse
  { name: "Avocado (100g)", kategorie: "Gemüse", kcal: 160, eiweiss: 2, fett: 15, kh: 2 },
  { name: "Brokkoli", kategorie: "Gemüse", kcal: 34, eiweiss: 2.8, fett: 0.4, kh: 4 },
  { name: "Zucchini", kategorie: "Gemüse", kcal: 17, eiweiss: 1.2, fett: 0.3, kh: 2.5 },
  { name: "Spinat", kategorie: "Gemüse", kcal: 23, eiweiss: 2.9, fett: 0.4, kh: 1.4 },
  { name: "Blumenkohl", kategorie: "Gemüse", kcal: 25, eiweiss: 1.9, fett: 0.3, kh: 3 },
  { name: "Gurke", kategorie: "Gemüse", kcal: 12, eiweiss: 0.7, fett: 0.1, kh: 1.8 },
  // Nüsse & Öle
  { name: "Mandeln (30g)", kategorie: "Nüsse & Öle", kcal: 174, eiweiss: 6, fett: 15, kh: 2 },
  { name: "Walnüsse (30g)", kategorie: "Nüsse & Öle", kcal: 196, eiweiss: 4.6, fett: 19, kh: 1 },
  { name: "Macadamia (30g)", kategorie: "Nüsse & Öle", kcal: 204, eiweiss: 2.2, fett: 21, kh: 1.5 },
  { name: "Olivenöl (1 EL)", kategorie: "Nüsse & Öle", kcal: 119, eiweiss: 0, fett: 13.5, kh: 0 },
  { name: "Kokosöl (1 EL)", kategorie: "Nüsse & Öle", kcal: 117, eiweiss: 0, fett: 13, kh: 0 },
];

const KATEGORIEN = ["Alle", "Fleisch", "Fisch", "Eier & Milch", "Gemüse", "Nüsse & Öle"];

const AMPEL: Record<string, string> = {
  "0-5": "#22c55e",
  "5-10": "#f59e0b",
  "10+": "#ef4444",
};

function khFarbe(kh: number) {
  if (kh <= 5) return "#22c55e";
  if (kh <= 10) return "#f59e0b";
  return "#ef4444";
}

export default function LebensmittelPage() {
  const [suche, setSuche] = useState("");
  const [kategorie, setKategorie] = useState("Alle");
  const [offen, setOffen] = useState<string | null>(null);

  const gefiltert = LEBENSMITTEL.filter(l => {
    const matchKat = kategorie === "Alle" || l.kategorie === kategorie;
    const matchSuche = l.name.toLowerCase().includes(suche.toLowerCase());
    return matchKat && matchSuche;
  });

  return (
    <main className="px-4 py-6">
      <h1 className="text-xl font-bold mb-2">🍳 Lebensmittel</h1>
      <p className="text-sm mb-4" style={{ color: "#666" }}>Nährwerte pro 100g (außer anders angegeben)</p>

      {/* Suche */}
      <input value={suche} onChange={e => setSuche(e.target.value)}
        placeholder="🔍 Lebensmittel suchen..."
        className="w-full px-4 py-3 rounded-xl outline-none text-white text-sm mb-4"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />

      {/* Kategorien */}
      <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
        {KATEGORIEN.map(k => (
          <button key={k} onClick={() => setKategorie(k)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: kategorie === k ? "#22c55e" : "#1a1a1a", color: kategorie === k ? "#000" : "#888" }}>
            {k}
          </button>
        ))}
      </div>

      {/* Legende */}
      <div className="flex gap-3 mb-4 text-xs" style={{ color: "#666" }}>
        <span>🟢 0-5g KH</span>
        <span>🟡 5-10g KH</span>
        <span>🔴 10g+ KH</span>
      </div>

      {/* Liste */}
      <div className="space-y-2">
        {gefiltert.map(l => (
          <div key={l.name}>
            <button onClick={() => setOffen(offen === l.name ? null : l.name)}
              className="w-full rounded-2xl px-4 py-3 flex items-center justify-between"
              style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-left">
                <div className="font-semibold text-sm">{l.name}</div>
                <div className="text-xs" style={{ color: "#666" }}>{l.kategorie}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold" style={{ color: khFarbe(l.kh) }}>
                    {l.kh}g KH
                  </div>
                  <div className="text-xs" style={{ color: "#666" }}>{l.kcal} kcal</div>
                </div>
                <span style={{ color: "#444" }}>{offen === l.name ? "▲" : "▼"}</span>
              </div>
            </button>
            {offen === l.name && (
              <div className="grid grid-cols-3 gap-2 px-2 pb-2">
                {[
                  { label: "Kalorien", wert: `${l.kcal} kcal` },
                  { label: "Eiweiß", wert: `${l.eiweiss}g` },
                  { label: "Fett", wert: `${l.fett}g` },
                  { label: "Kohlenhydrate", wert: `${l.kh}g`, farbe: khFarbe(l.kh) },
                ].map(({ label, wert, farbe }) => (
                  <div key={label} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#222" }}>
                    <div className="text-xs mb-0.5" style={{ color: "#666" }}>{label}</div>
                    <div className="text-sm font-bold" style={{ color: farbe || "#fff" }}>{wert}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
