"use client";
import { useEffect, useState } from "react";

type Mahlzeit = {
  id: string;
  name: string;
  zutaten: string;
  kcal?: number;
  kh?: number;
  notiz?: string;
};

export default function MahlzeitenPage() {
  const [mahlzeiten, setMahlzeiten] = useState<Mahlzeit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [zutaten, setZutaten] = useState("");
  const [kcal, setKcal] = useState("");
  const [kh, setKh] = useState("");
  const [notiz, setNotiz] = useState("");

  useEffect(() => {
    const d = localStorage.getItem("ketome_mahlzeiten");
    if (d) setMahlzeiten(JSON.parse(d));
  }, []);

  function speichern() {
    if (!name || !zutaten) return;
    const neu: Mahlzeit = {
      id: Date.now().toString(),
      name, zutaten,
      kcal: kcal ? parseInt(kcal) : undefined,
      kh: kh ? parseFloat(kh) : undefined,
      notiz,
    };
    const alle = [...mahlzeiten, neu];
    setMahlzeiten(alle);
    localStorage.setItem("ketome_mahlzeiten", JSON.stringify(alle));
    setName(""); setZutaten(""); setKcal(""); setKh(""); setNotiz("");
    setShowForm(false);
  }

  function loeschen(id: string) {
    const alle = mahlzeiten.filter(m => m.id !== id);
    setMahlzeiten(alle);
    localStorage.setItem("ketome_mahlzeiten", JSON.stringify(alle));
  }

  return (
    <main className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">⭐ Favoriten</h1>
          <p className="text-sm" style={{ color: "#666" }}>Meine Lieblingsmahlzeiten</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl font-semibold text-sm text-black"
          style={{ backgroundColor: "#22c55e" }}>
          + Neu
        </button>
      </div>

      {/* Formular */}
      {showForm && (
        <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-sm font-semibold mb-4" style={{ color: "#22c55e" }}>Neue Mahlzeit speichern</div>
          <div className="space-y-3">
            {[
              { label: "Name *", value: name, set: setName, placeholder: "z.B. Lachs mit Avocado" },
              { label: "Zutaten *", value: zutaten, set: setZutaten, placeholder: "z.B. Lachs, Avocado, Olivenöl, Salz" },
              { label: "Kalorien (kcal)", value: kcal, set: setKcal, placeholder: "z.B. 450" },
              { label: "Kohlenhydrate (g)", value: kh, set: setKh, placeholder: "z.B. 3" },
              { label: "Notiz / Zubereitung", value: notiz, set: setNotiz, placeholder: "z.B. 15 Min bei 180° backen" },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <div className="text-xs mb-1" style={{ color: "#888" }}>{label}</div>
                <input value={value} onChange={e => set(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-4 py-2 rounded-xl outline-none text-white text-sm"
                  style={{ backgroundColor: "#2a2a2a" }} />
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{ backgroundColor: "#2a2a2a", color: "#888" }}>
                Abbrechen
              </button>
              <button onClick={speichern} disabled={!name || !zutaten}
                className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
                style={{ backgroundColor: name && zutaten ? "#22c55e" : "#333", color: name && zutaten ? "#000" : "#666" }}>
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste */}
      {mahlzeiten.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">⭐</div>
          <p style={{ color: "#666" }}>Noch keine Favoriten gespeichert.</p>
          <p className="text-sm mt-2" style={{ color: "#444" }}>Speichere deine Lieblingsmahlzeiten für schnellen Zugriff.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mahlzeiten.map(m => (
            <div key={m.id} className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold">{m.name}</div>
                <button onClick={() => loeschen(m.id)} className="text-lg" style={{ color: "#444" }}>✕</button>
              </div>
              <div className="text-sm mb-2" style={{ color: "#888" }}>{m.zutaten}</div>
              {(m.kcal || m.kh !== undefined) && (
                <div className="flex gap-3 text-xs">
                  {m.kcal && <span style={{ color: "#666" }}>{m.kcal} kcal</span>}
                  {m.kh !== undefined && (
                    <span style={{ color: m.kh <= 5 ? "#22c55e" : m.kh <= 10 ? "#f59e0b" : "#ef4444" }}>
                      {m.kh}g KH
                    </span>
                  )}
                </div>
              )}
              {m.notiz && (
                <div className="text-xs mt-2 p-2 rounded-lg" style={{ backgroundColor: "#2a2a2a", color: "#888" }}>
                  {m.notiz}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
