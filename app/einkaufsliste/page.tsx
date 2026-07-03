"use client";
import { useEffect, useState } from "react";

type Artikel = {
  id: string;
  name: string;
  menge: string;
  erledigt: boolean;
  kategorie: string;
  rezepte?: string[]; // Quell-Rezepte
};

const KATEGORIEN: Record<string, { farbe: string; keywords: string[] }> = {
  "Fleisch & Geflügel": { farbe: "#ef4444", keywords: ["hackfleisch","hähnchen","hühnchen","rind","schwein","speck","bacon","wurst","salami","schinken","putenbrust","lammfleisch","gulasch"] },
  "Gemüse":            { farbe: "#22c55e", keywords: ["zucchini","paprika","salat","gurke","tomate","brokkoli","spinat","lauch","zwiebel","knoblauch","sellerie","karotte","radieschen","kohl","rettich","bohnen","champignon","pilze","avocado","olive"] },
  "Milch & Käse":      { farbe: "#f59e0b", keywords: ["käse","sahne","butter","joghurt","quark","mozzarella","parmesan","frischkäse","schmand","creme fraiche","milch","ei","eier"] },
  "Nüsse & Öle":       { farbe: "#8b5cf6", keywords: ["mandeln","nüsse","walnuss","cashew","olivenöl","kokosöl","öl","leinöl","sesamöl","kokosmilch","mandelmehl"] },
  "Gewürze & Saucen":  { farbe: "#06b6d4", keywords: ["salz","pfeffer","paprikapulver","kurkuma","zimt","senf","sojasauce","worcester","tomatenmark","senf","lorbeer","oregano","thymian","rosmarin","basilikum"] },
  "Sonstiges":         { farbe: "#64748b", keywords: [] },
};

function autoKategorie(name: string): string {
  const lower = name.toLowerCase();
  for (const [kat, { keywords }] of Object.entries(KATEGORIEN)) {
    if (keywords.some(k => lower.includes(k))) return kat;
  }
  return "Sonstiges";
}

// Parst "500g" → { zahl: 500, einheit: "g" }
type ParsedMenge = { zahl: number; einheit: string } | null;

function parseMenge(str: string): ParsedMenge {
  if (!str) return null;
  const m = str.trim().replace(",", ".").match(/^(\d+(?:\.\d+)?)\s*(g|kg|ml|l|stück|stk|el|tl|pkg|bund)?$/i);
  if (!m) return null;
  return { zahl: parseFloat(m[1]), einheit: (m[2] || "Stück").toLowerCase() };
}

function formatMenge(zahl: number, einheit: string): string {
  // g → kg wenn >= 1000
  if (einheit === "g" && zahl >= 1000) return `${Math.round(zahl / 100) / 10} kg`;
  // ml → l wenn >= 1000
  if (einheit === "ml" && zahl >= 1000) return `${Math.round(zahl / 100) / 10} l`;
  // Schöne Zahlen
  const gerundet = Math.round(zahl * 100) / 100;
  return `${gerundet} ${einheit}`;
}

function mengeSummieren(a: string, b: string): string {
  const pa = parseMenge(a);
  const pb = parseMenge(b);
  if (!pa || !pb) return [a, b].filter(Boolean).join(" + ");
  // Einheiten angleichen: kg→g, l→ml
  let zahlA = pa.zahl, einheitA = pa.einheit;
  let zahlB = pb.zahl, einheitB = pb.einheit;
  if (einheitA === "kg" && einheitB === "g") { zahlA *= 1000; einheitA = "g"; }
  if (einheitA === "g" && einheitB === "kg") { zahlB *= 1000; einheitB = "g"; }
  if (einheitA === "l" && einheitB === "ml") { zahlA *= 1000; einheitA = "ml"; }
  if (einheitA === "ml" && einheitB === "l") { zahlB *= 1000; einheitB = "ml"; }
  if (einheitA !== einheitB) return [a, b].filter(Boolean).join(" + ");
  return formatMenge(zahlA + zahlB, einheitA);
}

// Findet ob ein Artikel mit ähnlichem Namen schon vorhanden ist
function findeGleichen(liste: Artikel[], name: string): Artikel | undefined {
  const lower = name.trim().toLowerCase();
  return liste.find(a => !a.erledigt && a.name.toLowerCase() === lower);
}

export default function EinkaufslistePage() {
  const [liste, setListe]       = useState<Artikel[]>([]);
  const [name, setName]         = useState("");
  const [menge, setMenge]       = useState("");
  const [kategorie, setKategorie] = useState("Sonstiges");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [editMenge, setEditMenge] = useState("");
  const [toast, setToast]       = useState<string | null>(null);
  const [gruppiertAnzeige, setGruppiertAnzeige] = useState(true);

  useEffect(() => {
    const d = localStorage.getItem("ketome_einkaufsliste");
    if (d) setListe(JSON.parse(d));
  }, []);

  function save(neu: Artikel[]) {
    setListe(neu);
    localStorage.setItem("ketome_einkaufsliste", JSON.stringify(neu));
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function nameGeaendert(val: string) {
    setName(val);
    setKategorie(autoKategorie(val));
  }

  function hinzufuegen() {
    if (!name.trim()) return;
    const gleicher = findeGleichen(liste, name);
    if (gleicher && menge) {
      // Mengen zusammenfassen
      const neueMenge = mengeSummieren(gleicher.menge, menge);
      const aktualisiert = liste.map(a => a.id === gleicher.id ? { ...a, menge: neueMenge } : a);
      save(aktualisiert);
      showToast(`✓ Menge zusammengefasst: ${gleicher.name} → ${neueMenge}`);
    } else if (gleicher && !menge) {
      showToast(`${gleicher.name} ist bereits in der Liste`);
    } else {
      save([...liste, { id: Date.now().toString(), name: name.trim(), menge, erledigt: false, kategorie }]);
    }
    setName(""); setMenge(""); setShowForm(false);
  }

  function toggle(id: string) {
    save(liste.map(a => a.id === id ? { ...a, erledigt: !a.erledigt } : a));
  }

  function loeschen(id: string) {
    save(liste.filter(a => a.id !== id));
  }

  function mengeBearbeiten(id: string) {
    const a = liste.find(x => x.id === id);
    if (!a) return;
    setEditId(id);
    setEditMenge(a.menge);
  }

  function mengeSpeichern(id: string) {
    save(liste.map(a => a.id === id ? { ...a, menge: editMenge } : a));
    setEditId(null);
  }

  function erledigtLoeschen() { save(liste.filter(a => !a.erledigt)); }
  function alleLoeschen() { save([]); }

  const offen    = liste.filter(a => !a.erledigt);
  const erledigt = liste.filter(a => a.erledigt);

  const gruppiertOffen = offen.reduce((acc, a) => {
    if (!acc[a.kategorie]) acc[a.kategorie] = [];
    acc[a.kategorie].push(a);
    return acc;
  }, {} as Record<string, Artikel[]>);

  // Sortierung: definierte Kategorien zuerst
  const katReihenfolge = Object.keys(KATEGORIEN);
  const sortiertKeys = Object.keys(gruppiertOffen).sort(
    (a, b) => (katReihenfolge.indexOf(a) ?? 99) - (katReihenfolge.indexOf(b) ?? 99)
  );

  return (
    <main className="px-4 py-6 pb-28">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-xl font-bold">🛒 Einkaufsliste</h1>
          <p className="text-sm" style={{ color: "#666" }}>{offen.length} offen · {erledigt.length} erledigt</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setName(""); setMenge(""); setKategorie("Sonstiges"); }}
          className="px-4 py-2 rounded-xl font-semibold text-sm text-black"
          style={{ backgroundColor: "#22c55e" }}>
          + Artikel
        </button>
      </div>

      {/* Hinweis intelligente Zusammenfassung */}
      <p className="text-xs mb-4" style={{ color: "#444" }}>
        💡 Gleiche Artikel werden automatisch zusammengefasst
      </p>

      {showForm && (
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="space-y-3">
            <input value={name} onChange={e => nameGeaendert(e.target.value)}
              placeholder="Artikel (z.B. Hackfleisch)"
              className="w-full px-4 py-2 rounded-xl outline-none text-white text-sm"
              style={{ backgroundColor: "#2a2a2a" }}
              onKeyDown={e => e.key === "Enter" && hinzufuegen()} />
            <input value={menge} onChange={e => setMenge(e.target.value)}
              placeholder="Menge (z.B. 500g, 2 Stück, 1 EL)"
              className="w-full px-4 py-2 rounded-xl outline-none text-white text-sm"
              style={{ backgroundColor: "#2a2a2a" }}
              onKeyDown={e => e.key === "Enter" && hinzufuegen()} />
            {/* Auto-Kategorie Anzeige + manuell wählbar */}
            <div>
              <div className="text-xs mb-1.5" style={{ color: "#555" }}>Kategorie (auto erkannt):</div>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(KATEGORIEN).map(([k, { farbe }]) => (
                  <button key={k} onClick={() => setKategorie(k)}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ backgroundColor: kategorie === k ? farbe : "#2a2a2a", color: kategorie === k ? "#fff" : "#666" }}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
            {/* Vorschau: wird zusammengefasst? */}
            {name && findeGleichen(liste, name) && menge && (
              <div className="rounded-xl px-3 py-2 text-xs" style={{ backgroundColor: "#0d2018", color: "#22c55e" }}>
                ✓ Wird zusammengefasst mit: {findeGleichen(liste, name)!.menge} + {menge} = {mengeSummieren(findeGleichen(liste, name)!.menge, menge)}
              </div>
            )}
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
          <button onClick={() => setGruppiertAnzeige(!gruppiertAnzeige)}
            className="flex-1 py-2 rounded-xl text-xs"
            style={{ backgroundColor: "#1a1a1a", color: "#888" }}>
            {gruppiertAnzeige ? "📋 Liste" : "📂 Kategorien"}
          </button>
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

      {/* Offene Artikel */}
      {gruppiertAnzeige ? (
        sortiertKeys.map(kat => (
          <div key={kat} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: KATEGORIEN[kat]?.farbe || "#666" }} />
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#555" }}>{kat}</span>
              <span className="text-xs" style={{ color: "#333" }}>({gruppiertOffen[kat].length})</span>
            </div>
            <div className="space-y-2">
              {gruppiertOffen[kat].map(a => (
                <ArtikelZeile key={a.id} a={a} farbe={KATEGORIEN[a.kategorie]?.farbe || "#666"}
                  onToggle={() => toggle(a.id)} onDelete={() => loeschen(a.id)}
                  editId={editId} editMenge={editMenge} setEditMenge={setEditMenge}
                  onEdit={() => mengeBearbeiten(a.id)} onSave={() => mengeSpeichern(a.id)} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="space-y-2 mb-4">
          {offen.map(a => (
            <ArtikelZeile key={a.id} a={a} farbe={KATEGORIEN[a.kategorie]?.farbe || "#666"}
              onToggle={() => toggle(a.id)} onDelete={() => loeschen(a.id)}
              editId={editId} editMenge={editMenge} setEditMenge={setEditMenge}
              onEdit={() => mengeBearbeiten(a.id)} onSave={() => mengeSpeichern(a.id)} />
          ))}
        </div>
      )}

      {/* Erledigte */}
      {erledigt.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#333" }}>✓ Erledigt</div>
          <div className="space-y-2">
            {erledigt.map(a => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ backgroundColor: "#111", opacity: 0.5 }}>
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

      {toast && (
        <div className="fixed bottom-24 left-4 right-4 z-50 py-3 px-4 rounded-2xl text-center text-sm font-semibold"
          style={{ backgroundColor: "#22c55e", color: "#000" }}>
          {toast}
        </div>
      )}
    </main>
  );
}

function ArtikelZeile({ a, farbe, onToggle, onDelete, editId, editMenge, setEditMenge, onEdit, onSave }: {
  a: Artikel; farbe: string;
  onToggle: () => void; onDelete: () => void;
  editId: string | null; editMenge: string; setEditMenge: (v: string) => void;
  onEdit: () => void; onSave: () => void;
}) {
  const istEdit = editId === a.id;
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{ backgroundColor: "#1a1a1a" }}>
      <button onClick={onToggle}
        className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
        style={{ borderColor: farbe }}>
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{a.name}</div>
        {istEdit ? (
          <input value={editMenge} onChange={e => setEditMenge(e.target.value)}
            onBlur={onSave} onKeyDown={e => e.key === "Enter" && onSave()}
            autoFocus
            className="text-xs outline-none rounded px-1 py-0.5 w-24"
            style={{ backgroundColor: "#2a2a2a", color: "#22c55e" }} />
        ) : (
          a.menge ? (
            <button onClick={onEdit} className="text-xs text-left" style={{ color: "#22c55e" }}>
              {a.menge} ✎
            </button>
          ) : (
            <button onClick={onEdit} className="text-xs" style={{ color: "#444" }}>
              Menge hinzufügen
            </button>
          )
        )}
      </div>
      <button onClick={onDelete} className="text-lg pl-2" style={{ color: "#333" }}>✕</button>
    </div>
  );
}
