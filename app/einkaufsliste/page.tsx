"use client";
import { useEffect, useState } from "react";

type Artikel = { id: string; name: string; menge: string; erledigt: boolean; kategorie: string };

const KATEGORIEN_FARBEN: Record<string, string> = {
  "Fleisch & Fisch": "#ef4444",
  "Gemüse": "#22c55e",
  "Milchprodukte": "#f59e0b",
  "Nüsse & Öle": "#8b5cf6",
  "Sonstiges": "#64748b",
};

export default function EinkaufslistePage() {
  const [liste, setListe] = useState<Artikel[]>([]);
  const [name, setName] = useState("");
  const [menge, setMenge] = useState("");
  const [kategorie, setKategorie] = useState("Sonstiges");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const d = localStorage.getItem("ketome_einkaufsliste");
    if (d) setListe(JSON.parse(d));
  }, []);

  function save(neu: Artikel[]) {
    setListe(neu);
    localStorage.setItem("ketome_einkaufsliste", JSON.stringify(neu));
  }

  function hinzufuegen() {
    if (!name) return;
    save([...liste, { id: Date.now().toString(), name, menge, erledigt: false, kategorie }]);
    setName(""); setMenge(""); setShowForm(false);
  }

  function toggle(id: string) {
    save(liste.map(a => a.id === id ? { ...a, erledigt: !a.erledigt } : a));
  }

  function loeschen(id: string) {
    save(liste.filter(a => a.id !== id));
  }

  function alleLoeschen() {
    save([]);
  }

  function erledigtLoeschen() {
    save(liste.filter(a => !a.erledigt));
  }

  const offen = liste.filter(a => !a.erledigt);
  const erledigt = liste.filter(a => a.erledigt);

  const gruppiertOffen = offen.reduce((acc, a) => {
    if (!acc[a.kategorie]) acc[a.kategorie] = [];
    acc[a.kategorie].push(a);
    return acc;
  }, {} as Record<string, Artikel[]>);

  return (
    <main className="px-4 py-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold">🛒 Einkaufsliste</h1>
          <p className="text-sm" style={{ color: "#666" }}>{offen.length} offen · {erledigt.length} erledigt</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl font-semibold text-sm text-black"
          style={{ backgroundColor: "#22c55e" }}>
          + Artikel
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="space-y-3">
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Artikel (z.B. Hähnchenbrust)"
              className="w-full px-4 py-2 rounded-xl outline-none text-white text-sm"
              style={{ backgroundColor: "#2a2a2a" }} />
            <input value={menge} onChange={e => setMenge(e.target.value)}
              placeholder="Menge (z.B. 500g)"
              className="w-full px-4 py-2 rounded-xl outline-none text-white text-sm"
              style={{ backgroundColor: "#2a2a2a" }} />
            <div className="flex gap-2 flex-wrap">
              {Object.keys(KATEGORIEN_FARBEN).map(k => (
                <button key={k} onClick={() => setKategorie(k)}
                  className="px-3 py-1 rounded-full text-xs"
                  style={{ backgroundColor: kategorie === k ? KATEGORIEN_FARBEN[k] : "#2a2a2a", color: kategorie === k ? "#fff" : "#888" }}>
                  {k}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2 rounded-xl text-sm"
                style={{ backgroundColor: "#2a2a2a", color: "#888" }}>
                Abbrechen
              </button>
              <button onClick={hinzufuegen} disabled={!name}
                className="flex-1 py-2 rounded-xl font-bold text-sm"
                style={{ backgroundColor: name ? "#22c55e" : "#333", color: name ? "#000" : "#666" }}>
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {liste.length > 0 && (
        <div className="flex gap-2 mb-4">
          <button onClick={erledigtLoeschen}
            className="flex-1 py-2 rounded-xl text-xs"
            style={{ backgroundColor: "#1a1a1a", color: "#888" }}>
            Erledigte löschen
          </button>
          <button onClick={alleLoeschen}
            className="flex-1 py-2 rounded-xl text-xs"
            style={{ backgroundColor: "#1a1a1a", color: "#ef4444" }}>
            Alle löschen
          </button>
        </div>
      )}

      {/* Offene Artikel nach Kategorie */}
      {Object.entries(gruppiertOffen).map(([kat, artikel]) => (
        <div key={kat} className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: KATEGORIEN_FARBEN[kat] || "#666" }} />
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#555" }}>{kat}</span>
          </div>
          <div className="space-y-2">
            {artikel.map(a => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ backgroundColor: "#1a1a1a" }}>
                <button onClick={() => toggle(a.id)}
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: KATEGORIEN_FARBEN[a.kategorie] || "#444" }}>
                </button>
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.name}</div>
                  {a.menge && <div className="text-xs" style={{ color: "#555" }}>{a.menge}</div>}
                </div>
                <button onClick={() => loeschen(a.id)} style={{ color: "#333" }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Erledigte Artikel */}
      {erledigt.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#333" }}>✓ Erledigt</div>
          <div className="space-y-2">
            {erledigt.map(a => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ backgroundColor: "#111", opacity: 0.6 }}>
                <button onClick={() => toggle(a.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                  style={{ backgroundColor: "#22c55e", color: "#000" }}>✓</button>
                <div className="flex-1">
                  <div className="text-sm line-through" style={{ color: "#555" }}>{a.name}</div>
                  {a.menge && <div className="text-xs" style={{ color: "#444" }}>{a.menge}</div>}
                </div>
                <button onClick={() => loeschen(a.id)} style={{ color: "#333" }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {liste.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🛒</div>
          <p style={{ color: "#666" }}>Einkaufsliste ist leer.</p>
          <p className="text-sm mt-2" style={{ color: "#444" }}>Füge Artikel hinzu oder übernimm sie aus dem Wochenplan.</p>
        </div>
      )}
    </main>
  );
}
