"use client";
import { useState } from "react";

const LEBENSMITTEL = [
  { emoji: "🥚", name: "Eier (10 Stück)", preis: 1.99, einheit: "Pkg", kcal: 620, kh: 1, eiweiss: 53, fett: 44, tipp: "Bestes Keto-Grundnahrungsmittel überhaupt" },
  { emoji: "🧀", name: "Gouda am Stück (400g)", preis: 2.49, einheit: "Stück", kcal: 1480, kh: 1, eiweiss: 104, fett: 116, tipp: "Schnell satt, lange haltbar" },
  { emoji: "🍗", name: "Hähnchenschenkel (1kg)", preis: 2.99, einheit: "kg", kcal: 1890, kh: 0, eiweiss: 155, fett: 136, tipp: "Günstiger als Brust, noch saftiger" },
  { emoji: "🥩", name: "Rinderhack (500g)", preis: 2.79, einheit: "Pkg", kcal: 1050, kh: 0, eiweiss: 78, fett: 84, tipp: "Vielseitig: Pfanne, Auflauf, Bällchen" },
  { emoji: "🥓", name: "Speck / Bauchspeck (200g)", preis: 1.49, einheit: "Pkg", kcal: 760, kh: 0.4, eiweiss: 28, fett: 72, tipp: "Perfekt zum Braten oder als Snack" },
  { emoji: "🐟", name: "Thunfisch in Öl (185g)", preis: 0.89, einheit: "Dose", kcal: 295, kh: 0, eiweiss: 42, fett: 14, tipp: "Schnellster Keto-Snack überhaupt" },
  { emoji: "🧈", name: "Butter (250g)", preis: 1.79, einheit: "Pkg", kcal: 1810, kh: 0.3, eiweiss: 1.5, fett: 200, tipp: "Gesundes Fett für alles" },
  { emoji: "🥦", name: "Brokkoli tiefgekühlt (750g)", preis: 1.19, einheit: "Beutel", kcal: 218, kh: 18, eiweiss: 20, fett: 3, tipp: "Immer griffbereit, nie schlecht" },
  { emoji: "🥬", name: "Blattspinat tiefgekühlt (750g)", preis: 1.09, einheit: "Beutel", kcal: 143, kh: 7, eiweiss: 18, fett: 3, tipp: "Ideal für Pfannengerichte" },
  { emoji: "🥒", name: "Zucchini (500g)", preis: 0.99, einheit: "Stück", kcal: 85, kh: 9, eiweiss: 6, fett: 1, tipp: "Roh, gebraten oder als Nudel-Ersatz" },
  { emoji: "🥗", name: "Eisbergsalat", preis: 0.79, einheit: "Kopf", kcal: 55, kh: 6, eiweiss: 4, fett: 1, tipp: "Basis für Salat-Wraps ohne Brot" },
  { emoji: "🫙", name: "Sahne (200ml)", preis: 0.79, einheit: "Becher", kcal: 680, kh: 3, eiweiss: 5, fett: 72, tipp: "Für Saucen, Suppen, Kaffee" },
];

const WOCHENPLAN = [
  { tag: "Mo", frueh: "3 Rühreier mit Speck", mittag: "Hähnchenschenkel + Brokkoli", abend: "Hack-Pfanne mit Zucchini" },
  { tag: "Di", frueh: "Thunfisch auf Salat", mittag: "Reste vom Vortag", abend: "Käse-Omelett mit Spinat" },
  { tag: "Mi", frueh: "3 Spiegeleier mit Butter", mittag: "Hähnchen + Salat", abend: "Hackbällchen in Sahnesauce" },
  { tag: "Do", frueh: "Rührei mit Käse", mittag: "Thunfisch-Salat", abend: "Hähnchen-Pfanne mit Brokkoli" },
  { tag: "Fr", frueh: "Speck & Eier", mittag: "Hack-Zucchini-Pfanne", abend: "Käse-Spinat-Auflauf" },
  { tag: "Sa", frueh: "Großes Frühstück: Eier, Speck, Käse", mittag: "Reste", abend: "Hähnchenschenkel mit Salat" },
  { tag: "So", frueh: "Omelette mit allem was da ist", mittag: "Hack-Patties mit Zucchini", abend: "Thunfisch-Spinat-Pfanne" },
];

const TIPPS = [
  { emoji: "🛒", titel: "Eigenmarken kaufen", text: "Aldi, Lidl, Penny — deren Eigenmarken sind identisch mit Marken, nur günstiger. Butter ist Butter." },
  { emoji: "❄️", titel: "Tiefkühlgemüse statt frisch", text: "Tiefkühlgemüse hat oft mehr Nährstoffe als frisches aus dem Supermarkt und kostet ein Drittel." },
  { emoji: "📦", titel: "Größere Mengen kaufen", text: "Rinderhack im 1kg-Paket ist günstiger als 2×500g. Einfrieren und portionsweise nutzen." },
  { emoji: "🥚", titel: "Eier sind Gold", text: "10 Stück für ~2€ = ~0,20€ pro Mahlzeit. Kaum ein Lebensmittel bietet mehr Nährstoffe pro Euro." },
  { emoji: "🍗", titel: "Schenkel statt Brust", text: "Hähnchenschenkel sind günstiger, saftiger und haben mehr gesundes Fett als Brustfilet." },
  { emoji: "🚫", titel: "Keine Keto-Produkte nötig", text: "Keto-Brot, Protein-Riegel, MCT-Öl — alles optional. Echtes Keto braucht das nicht." },
];

export default function GeldbeutelPage() {
  const [aktiv, setAktiv] = useState<"einkauf" | "woche" | "tipps">("einkauf");
  const gesamtPreis = LEBENSMITTEL.reduce((s, l) => s + l.preis, 0);

  return (
    <main className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">💰</div>
        <h1 className="text-2xl font-bold text-white">Keto für den schmalen Geldbeutel</h1>
        <p className="text-sm mt-1" style={{ color: "#86efac" }}>
          Keto geht auch für unter 3€ pro Tag
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl p-1 mb-6 gap-1" style={{ backgroundColor: "#1a1a1a" }}>
        {([["einkauf", "🛒 Einkauf"], ["woche", "📅 Wochenplan"], ["tipps", "💡 Tipps"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setAktiv(id)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              backgroundColor: aktiv === id ? "#22c55e" : "transparent",
              color: aktiv === id ? "#000" : "#aaa",
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Einkaufsliste */}
      {aktiv === "einkauf" && (
        <div className="space-y-3">
          <div className="rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: "#14532d" }}>
            <div>
              <div className="text-white font-bold text-base">Wocheneinkauf komplett</div>
              <div className="text-sm" style={{ color: "#86efac" }}>{LEBENSMITTEL.length} Grundnahrungsmittel</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">~{gesamtPreis.toFixed(2)}€</div>
              <div className="text-xs" style={{ color: "#86efac" }}>pro Woche</div>
            </div>
          </div>

          {LEBENSMITTEL.map((l) => (
            <div key={l.name} className="rounded-2xl p-4" style={{ backgroundColor: "#111" }}>
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{l.emoji}</span>
                  <div>
                    <div className="text-white font-semibold text-sm">{l.name}</div>
                    <div className="text-xs" style={{ color: "#86efac" }}>{l.tipp}</div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-white font-bold">{l.preis.toFixed(2)}€</div>
                  <div className="text-xs" style={{ color: "#666" }}>/{l.einheit}</div>
                </div>
              </div>
              <div className="flex gap-3 mt-2 text-xs" style={{ color: "#888" }}>
                <span>{l.kcal} kcal</span>
                <span>{l.kh}g KH</span>
                <span>{l.eiweiss}g E</span>
                <span>{l.fett}g F</span>
              </div>
            </div>
          ))}

          <div className="rounded-2xl p-4 text-center text-sm" style={{ backgroundColor: "#1a1a1a", color: "#888" }}>
            Preise ca.-Werte (Aldi/Lidl, Stand 2026). Tatsächliche Kosten können abweichen.
          </div>
        </div>
      )}

      {/* Wochenplan */}
      {aktiv === "woche" && (
        <div className="space-y-3">
          <div className="rounded-2xl p-3 text-sm text-center mb-2" style={{ backgroundColor: "#14532d", color: "#86efac" }}>
            7 Tage Keto — komplett aus der Einkaufsliste oben
          </div>
          {WOCHENPLAN.map((tag) => (
            <div key={tag.tag} className="rounded-2xl p-4" style={{ backgroundColor: "#111" }}>
              <div className="font-bold text-white mb-2">{tag.tag}</div>
              <div className="space-y-1 text-sm">
                <div className="flex gap-2">
                  <span style={{ color: "#f59e0b" }}>☀️</span>
                  <span style={{ color: "#ccc" }}>{tag.frueh}</span>
                </div>
                <div className="flex gap-2">
                  <span style={{ color: "#22c55e" }}>🍽️</span>
                  <span style={{ color: "#ccc" }}>{tag.mittag}</span>
                </div>
                <div className="flex gap-2">
                  <span style={{ color: "#818cf8" }}>🌙</span>
                  <span style={{ color: "#ccc" }}>{tag.abend}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tipps */}
      {aktiv === "tipps" && (
        <div className="space-y-3">
          <div className="rounded-2xl p-3 text-sm text-center mb-2" style={{ backgroundColor: "#14532d", color: "#86efac" }}>
            So sparst du beim Keto-Einkauf richtig
          </div>
          {TIPPS.map((t) => (
            <div key={t.titel} className="rounded-2xl p-4" style={{ backgroundColor: "#111" }}>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">{t.emoji}</span>
                <div>
                  <div className="font-semibold text-white mb-1">{t.titel}</div>
                  <div className="text-sm" style={{ color: "#aaa" }}>{t.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
