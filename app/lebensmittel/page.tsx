"use client";
import { useState } from "react";

const LEBENSMITTEL = [
  // Fleisch
  { name: "Hähnchenbrust", kategorie: "Fleisch", kcal: 165, eiweiss: 31, fett: 3.6, kh: 0 },
  { name: "Hähnchenschenkel", kategorie: "Fleisch", kcal: 215, eiweiss: 26, fett: 12, kh: 0 },
  { name: "Rinderhack (20% Fett)", kategorie: "Fleisch", kcal: 254, eiweiss: 17, fett: 20, kh: 0 },
  { name: "Rindersteak", kategorie: "Fleisch", kcal: 271, eiweiss: 26, fett: 18, kh: 0 },
  { name: "Ribeye Steak", kategorie: "Fleisch", kcal: 291, eiweiss: 24, fett: 22, kh: 0 },
  { name: "Schweinebauch", kategorie: "Fleisch", kcal: 518, eiweiss: 14, fett: 52, kh: 0 },
  { name: "Schweinefilet", kategorie: "Fleisch", kcal: 143, eiweiss: 22, fett: 5, kh: 0 },
  { name: "Schweinekotelett", kategorie: "Fleisch", kcal: 215, eiweiss: 19, fett: 15, kh: 0 },
  { name: "Speck / Bacon", kategorie: "Fleisch", kcal: 541, eiweiss: 37, fett: 42, kh: 0 },
  { name: "Lammkeule", kategorie: "Fleisch", kcal: 282, eiweiss: 25, fett: 20, kh: 0 },
  { name: "Lammkotelett", kategorie: "Fleisch", kcal: 294, eiweiss: 24, fett: 21, kh: 0 },
  { name: "Entenbrust", kategorie: "Fleisch", kcal: 201, eiweiss: 24, fett: 11, kh: 0 },
  { name: "Truthahn / Pute", kategorie: "Fleisch", kcal: 135, eiweiss: 30, fett: 1, kh: 0 },
  { name: "Salami", kategorie: "Fleisch", kcal: 425, eiweiss: 22, fett: 37, kh: 1.5 },
  { name: "Chorizo", kategorie: "Fleisch", kcal: 455, eiweiss: 24, fett: 38, kh: 2 },
  { name: "Prosciutto / Rohschinken", kategorie: "Fleisch", kcal: 215, eiweiss: 29, fett: 11, kh: 0 },
  { name: "Bratwurst", kategorie: "Fleisch", kcal: 300, eiweiss: 14, fett: 26, kh: 2 },
  { name: "Wiener Würstchen", kategorie: "Fleisch", kcal: 290, eiweiss: 12, fett: 26, kh: 1 },
  // Fisch & Meeresfrüchte
  { name: "Lachs", kategorie: "Fisch", kcal: 208, eiweiss: 20, fett: 13, kh: 0 },
  { name: "Räucherlachs", kategorie: "Fisch", kcal: 179, eiweiss: 25, fett: 9, kh: 0 },
  { name: "Thunfisch (Dose, Wasser)", kategorie: "Fisch", kcal: 116, eiweiss: 26, fett: 1, kh: 0 },
  { name: "Thunfisch (Dose, Öl)", kategorie: "Fisch", kcal: 200, eiweiss: 24, fett: 11, kh: 0 },
  { name: "Sardinen (Dose)", kategorie: "Fisch", kcal: 208, eiweiss: 25, fett: 11, kh: 0 },
  { name: "Makrele", kategorie: "Fisch", kcal: 205, eiweiss: 19, fett: 14, kh: 0 },
  { name: "Forelle", kategorie: "Fisch", kcal: 190, eiweiss: 23, fett: 10, kh: 0 },
  { name: "Kabeljau / Dorsch", kategorie: "Fisch", kcal: 82, eiweiss: 18, fett: 0.7, kh: 0 },
  { name: "Garnelen", kategorie: "Fisch", kcal: 99, eiweiss: 24, fett: 0.3, kh: 0 },
  { name: "Muscheln", kategorie: "Fisch", kcal: 86, eiweiss: 12, fett: 2.2, kh: 3.7 },
  { name: "Tintenfisch", kategorie: "Fisch", kcal: 92, eiweiss: 16, fett: 1.4, kh: 3 },
  { name: "Hering", kategorie: "Fisch", kcal: 158, eiweiss: 18, fett: 9, kh: 0 },
  // Eier & Milchprodukte
  { name: "Ei (1 Stück, ca. 60g)", kategorie: "Eier & Milch", kcal: 78, eiweiss: 6, fett: 5, kh: 0.6 },
  { name: "Butter", kategorie: "Eier & Milch", kcal: 717, eiweiss: 0.9, fett: 81, kh: 0.1 },
  { name: "Ghee (geklärte Butter)", kategorie: "Eier & Milch", kcal: 900, eiweiss: 0, fett: 100, kh: 0 },
  { name: "Sahne (30% Fett)", kategorie: "Eier & Milch", kcal: 292, eiweiss: 2.4, fett: 30, kh: 3 },
  { name: "Saure Sahne", kategorie: "Eier & Milch", kcal: 191, eiweiss: 3.2, fett: 19, kh: 3.5 },
  { name: "Crème fraîche", kategorie: "Eier & Milch", kcal: 292, eiweiss: 2.6, fett: 30, kh: 3 },
  { name: "Frischkäse", kategorie: "Eier & Milch", kcal: 342, eiweiss: 7, fett: 34, kh: 3 },
  { name: "Mozzarella", kategorie: "Eier & Milch", kcal: 280, eiweiss: 18, fett: 22, kh: 2.2 },
  { name: "Parmesan", kategorie: "Eier & Milch", kcal: 392, eiweiss: 36, fett: 26, kh: 0 },
  { name: "Gouda", kategorie: "Eier & Milch", kcal: 356, eiweiss: 25, fett: 28, kh: 0.5 },
  { name: "Cheddar", kategorie: "Eier & Milch", kcal: 403, eiweiss: 25, fett: 33, kh: 0.1 },
  { name: "Brie", kategorie: "Eier & Milch", kcal: 334, eiweiss: 21, fett: 28, kh: 0.5 },
  { name: "Feta", kategorie: "Eier & Milch", kcal: 264, eiweiss: 14, fett: 21, kh: 4 },
  { name: "Halloumi", kategorie: "Eier & Milch", kcal: 321, eiweiss: 22, fett: 25, kh: 2.6 },
  { name: "Griechischer Joghurt (vollfett)", kategorie: "Eier & Milch", kcal: 97, eiweiss: 9, fett: 5, kh: 4 },
  { name: "Ricotta", kategorie: "Eier & Milch", kcal: 174, eiweiss: 11, fett: 13, kh: 3 },
  { name: "Mascarpone", kategorie: "Eier & Milch", kcal: 429, eiweiss: 6, fett: 45, kh: 3 },
  // Gemüse (keto-geeignet)
  { name: "Avocado", kategorie: "Gemüse", kcal: 160, eiweiss: 2, fett: 15, kh: 2 },
  { name: "Brokkoli", kategorie: "Gemüse", kcal: 34, eiweiss: 2.8, fett: 0.4, kh: 4 },
  { name: "Blumenkohl", kategorie: "Gemüse", kcal: 25, eiweiss: 1.9, fett: 0.3, kh: 3 },
  { name: "Zucchini", kategorie: "Gemüse", kcal: 17, eiweiss: 1.2, fett: 0.3, kh: 2.5 },
  { name: "Spinat", kategorie: "Gemüse", kcal: 23, eiweiss: 2.9, fett: 0.4, kh: 1.4 },
  { name: "Gurke", kategorie: "Gemüse", kcal: 12, eiweiss: 0.7, fett: 0.1, kh: 1.8 },
  { name: "Paprika (rot)", kategorie: "Gemüse", kcal: 31, eiweiss: 1, fett: 0.3, kh: 6 },
  { name: "Paprika (grün)", kategorie: "Gemüse", kcal: 20, eiweiss: 0.9, fett: 0.2, kh: 2.9 },
  { name: "Sellerie", kategorie: "Gemüse", kcal: 16, eiweiss: 0.7, fett: 0.2, kh: 2 },
  { name: "Spargel", kategorie: "Gemüse", kcal: 20, eiweiss: 2.2, fett: 0.1, kh: 2 },
  { name: "Grüne Bohnen", kategorie: "Gemüse", kcal: 31, eiweiss: 1.8, fett: 0.1, kh: 5 },
  { name: "Rosenkohl", kategorie: "Gemüse", kcal: 43, eiweiss: 3.4, fett: 0.3, kh: 5 },
  { name: "Weißkohl", kategorie: "Gemüse", kcal: 25, eiweiss: 1.3, fett: 0.1, kh: 4 },
  { name: "Rotkohl", kategorie: "Gemüse", kcal: 31, eiweiss: 1.5, fett: 0.1, kh: 5 },
  { name: "Wirsing", kategorie: "Gemüse", kcal: 28, eiweiss: 2, fett: 0.3, kh: 3 },
  { name: "Kopfsalat", kategorie: "Gemüse", kcal: 14, eiweiss: 1.4, fett: 0.2, kh: 1.2 },
  { name: "Rucola", kategorie: "Gemüse", kcal: 25, eiweiss: 2.6, fett: 0.7, kh: 2 },
  { name: "Feldsalat", kategorie: "Gemüse", kcal: 23, eiweiss: 2, fett: 0.4, kh: 2 },
  { name: "Pilze (Champions)", kategorie: "Gemüse", kcal: 22, eiweiss: 3.1, fett: 0.3, kh: 1 },
  { name: "Pilze (Pfifferlinge)", kategorie: "Gemüse", kcal: 38, eiweiss: 1.5, fett: 0.5, kh: 3 },
  { name: "Artischocke", kategorie: "Gemüse", kcal: 47, eiweiss: 3.3, fett: 0.2, kh: 5 },
  { name: "Aubergine", kategorie: "Gemüse", kcal: 25, eiweiss: 1, fett: 0.2, kh: 3.5 },
  { name: "Tomaten (Kirsch)", kategorie: "Gemüse", kcal: 18, eiweiss: 0.9, fett: 0.2, kh: 3 },
  { name: "Oliven (schwarz)", kategorie: "Gemüse", kcal: 145, eiweiss: 1, fett: 15, kh: 1 },
  { name: "Oliven (grün)", kategorie: "Gemüse", kcal: 145, eiweiss: 1.5, fett: 15, kh: 0.5 },
  { name: "Lauch / Porree", kategorie: "Gemüse", kcal: 61, eiweiss: 1.5, fett: 0.3, kh: 9 },
  { name: "Zwiebel", kategorie: "Gemüse", kcal: 40, eiweiss: 1.1, fett: 0.1, kh: 8 },
  { name: "Knoblauch (1 Zehe)", kategorie: "Gemüse", kcal: 5, eiweiss: 0.2, fett: 0, kh: 1 },
  { name: "Radieschen", kategorie: "Gemüse", kcal: 16, eiweiss: 0.7, fett: 0.1, kh: 2 },
  { name: "Kohlrabi", kategorie: "Gemüse", kcal: 27, eiweiss: 1.7, fett: 0.1, kh: 3.5 },
  { name: "Pak Choi", kategorie: "Gemüse", kcal: 13, eiweiss: 1.5, fett: 0.2, kh: 1.2 },
  // Nüsse & Samen
  { name: "Mandeln", kategorie: "Nüsse & Samen", kcal: 579, eiweiss: 21, fett: 50, kh: 6 },
  { name: "Walnüsse", kategorie: "Nüsse & Samen", kcal: 654, eiweiss: 15, fett: 65, kh: 7 },
  { name: "Macadamia", kategorie: "Nüsse & Samen", kcal: 718, eiweiss: 8, fett: 76, kh: 5 },
  { name: "Pecan-Nüsse", kategorie: "Nüsse & Samen", kcal: 691, eiweiss: 9, fett: 72, kh: 4 },
  { name: "Haselnüsse", kategorie: "Nüsse & Samen", kcal: 628, eiweiss: 15, fett: 61, kh: 7 },
  { name: "Cashews", kategorie: "Nüsse & Samen", kcal: 553, eiweiss: 18, fett: 44, kh: 27 },
  { name: "Erdnüsse", kategorie: "Nüsse & Samen", kcal: 567, eiweiss: 26, fett: 49, kh: 10 },
  { name: "Kürbiskerne", kategorie: "Nüsse & Samen", kcal: 559, eiweiss: 30, fett: 49, kh: 5 },
  { name: "Sonnenblumenkerne", kategorie: "Nüsse & Samen", kcal: 584, eiweiss: 21, fett: 51, kh: 11 },
  { name: "Leinsamen", kategorie: "Nüsse & Samen", kcal: 534, eiweiss: 18, fett: 42, kh: 2 },
  { name: "Chiasamen", kategorie: "Nüsse & Samen", kcal: 486, eiweiss: 17, fett: 31, kh: 8 },
  { name: "Sesam", kategorie: "Nüsse & Samen", kcal: 573, eiweiss: 18, fett: 50, kh: 7 },
  { name: "Hanfsamen", kategorie: "Nüsse & Samen", kcal: 553, eiweiss: 32, fett: 49, kh: 4 },
  // Öle & Fette
  { name: "Olivenöl (1 EL)", kategorie: "Öle & Fette", kcal: 119, eiweiss: 0, fett: 13.5, kh: 0 },
  { name: "Kokosöl (1 EL)", kategorie: "Öle & Fette", kcal: 117, eiweiss: 0, fett: 13, kh: 0 },
  { name: "Avocadoöl (1 EL)", kategorie: "Öle & Fette", kcal: 124, eiweiss: 0, fett: 14, kh: 0 },
  { name: "MCT Öl (1 EL)", kategorie: "Öle & Fette", kcal: 115, eiweiss: 0, fett: 14, kh: 0 },
  { name: "Weidebutter", kategorie: "Öle & Fette", kcal: 717, eiweiss: 0.9, fett: 81, kh: 0.1 },
  { name: "Schmalz", kategorie: "Öle & Fette", kcal: 902, eiweiss: 0, fett: 100, kh: 0 },
  // Früchte (keto-geeignet, wenige)
  { name: "Erdbeeren", kategorie: "Früchte", kcal: 32, eiweiss: 0.7, fett: 0.3, kh: 6 },
  { name: "Himbeeren", kategorie: "Früchte", kcal: 52, eiweiss: 1.2, fett: 0.7, kh: 5 },
  { name: "Brombeeren", kategorie: "Früchte", kcal: 43, eiweiss: 1.4, fett: 0.5, kh: 5 },
  { name: "Blaubeeren", kategorie: "Früchte", kcal: 57, eiweiss: 0.7, fett: 0.3, kh: 12 },
  { name: "Zitrone (Saft)", kategorie: "Früchte", kcal: 29, eiweiss: 1.1, fett: 0.3, kh: 6 },
  { name: "Kokosnuss (Fruchtfleisch)", kategorie: "Früchte", kcal: 354, eiweiss: 3.3, fett: 33, kh: 6 },
  // Getränke & Sonstiges
  { name: "Schwarzer Kaffee", kategorie: "Sonstiges", kcal: 2, eiweiss: 0.3, fett: 0, kh: 0 },
  { name: "Bulletproof Coffee (1 Tasse)", kategorie: "Sonstiges", kcal: 230, eiweiss: 0.3, fett: 25, kh: 0 },
  { name: "Kokosmehl (100g)", kategorie: "Sonstiges", kcal: 356, eiweiss: 19, fett: 9, kh: 9 },
  { name: "Mandelmehl (100g)", kategorie: "Sonstiges", kcal: 571, eiweiss: 21, fett: 50, kh: 6 },
  { name: "Dunkle Schokolade 85%", kategorie: "Sonstiges", kcal: 598, eiweiss: 8, fett: 43, kh: 20 },
  { name: "Dunkle Schokolade 90%", kategorie: "Sonstiges", kcal: 617, eiweiss: 9, fett: 47, kh: 14 },
  { name: "Apfelessig (1 EL)", kategorie: "Sonstiges", kcal: 3, eiweiss: 0, fett: 0, kh: 0.1 },
  { name: "Erythrit (Süßungsmittel)", kategorie: "Sonstiges", kcal: 0, eiweiss: 0, fett: 0, kh: 0 },
  { name: "Stevia", kategorie: "Sonstiges", kcal: 0, eiweiss: 0, fett: 0, kh: 0 },
];

const KATEGORIEN = ["Alle", "Fleisch", "Fisch", "Eier & Milch", "Gemüse", "Nüsse & Samen", "Öle & Fette", "Früchte", "Sonstiges"];

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
      <h1 className="text-xl font-bold mb-1">🍳 Lebensmittel</h1>
      <p className="text-sm mb-4" style={{ color: "#666" }}>{LEBENSMITTEL.length} Einträge · Nährwerte pro 100g</p>

      <input value={suche} onChange={e => setSuche(e.target.value)}
        placeholder="🔍 Lebensmittel suchen..."
        className="w-full px-4 py-3 rounded-xl outline-none text-white text-sm mb-4"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />

      <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
        {KATEGORIEN.map(k => (
          <button key={k} onClick={() => setKategorie(k)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: kategorie === k ? "#22c55e" : "#1a1a1a", color: kategorie === k ? "#000" : "#888" }}>
            {k}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mb-4 text-xs" style={{ color: "#666" }}>
        <span>🟢 0-5g KH</span><span>🟡 5-10g KH</span><span>🔴 10g+ KH</span>
      </div>

      <div className="space-y-2">
        {gefiltert.map(l => (
          <div key={l.name}>
            <button onClick={() => setOffen(offen === l.name ? null : l.name)}
              className="w-full rounded-2xl px-4 py-3 flex items-center justify-between"
              style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-left">
                <div className="font-semibold text-sm">{l.name}</div>
                <div className="text-xs" style={{ color: "#555" }}>{l.kategorie}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold" style={{ color: khFarbe(l.kh) }}>{l.kh}g KH</div>
                  <div className="text-xs" style={{ color: "#555" }}>{l.kcal} kcal</div>
                </div>
                <span style={{ color: "#444" }}>{offen === l.name ? "▲" : "▼"}</span>
              </div>
            </button>
            {offen === l.name && (
              <div className="grid grid-cols-4 gap-2 px-2 pb-2">
                {[
                  { label: "Kalorien", wert: `${l.kcal}` },
                  { label: "Eiweiß", wert: `${l.eiweiss}g` },
                  { label: "Fett", wert: `${l.fett}g` },
                  { label: "KH", wert: `${l.kh}g`, farbe: khFarbe(l.kh) },
                ].map(({ label, wert, farbe }) => (
                  <div key={label} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#222" }}>
                    <div className="text-xs mb-0.5" style={{ color: "#555" }}>{label}</div>
                    <div className="text-sm font-bold" style={{ color: farbe || "#fff" }}>{wert}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {gefiltert.length === 0 && (
          <div className="text-center py-8" style={{ color: "#555" }}>Kein Lebensmittel gefunden.</div>
        )}
      </div>
    </main>
  );
}
