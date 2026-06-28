"use client";
import { useEffect, useState } from "react";

type Eintrag = { datum: string; wert: number };
type Masse = { datum: string; taille: number; huefte: number; oberschenkel: number };

export default function TrackingPage() {
  const [gewicht, setGewicht] = useState<Eintrag[]>([]);
  const [masse, setMasse] = useState<Masse[]>([]);
  const [neuesGewicht, setNeuesGewicht] = useState("");
  const [taille, setTaille] = useState("");
  const [huefte, setHuefte] = useState("");
  const [oberschenkel, setOberschenkel] = useState("");
  const [tab, setTab] = useState<"gewicht" | "masse">("gewicht");

  useEffect(() => {
    const g = localStorage.getItem("ketome_gewicht");
    const m = localStorage.getItem("ketome_masse");
    if (g) setGewicht(JSON.parse(g));
    if (m) setMasse(JSON.parse(m));
  }, []);

  function speichernGewicht() {
    if (!neuesGewicht) return;
    const neu = [...gewicht, { datum: new Date().toLocaleDateString("de-DE"), wert: parseFloat(neuesGewicht) }];
    setGewicht(neu);
    localStorage.setItem("ketome_gewicht", JSON.stringify(neu));
    setNeuesGewicht("");
  }

  function speichernMasse() {
    if (!taille && !huefte && !oberschenkel) return;
    const neu = [...masse, {
      datum: new Date().toLocaleDateString("de-DE"),
      taille: parseFloat(taille) || 0,
      huefte: parseFloat(huefte) || 0,
      oberschenkel: parseFloat(oberschenkel) || 0,
    }];
    setMasse(neu);
    localStorage.setItem("ketome_masse", JSON.stringify(neu));
    setTaille(""); setHuefte(""); setOberschenkel("");
  }

  const letztes = gewicht[gewicht.length - 1];
  const erstes = gewicht[0];
  const differenz = letztes && erstes ? (letztes.wert - erstes.wert).toFixed(1) : null;

  return (
    <main className="px-4 py-6">
      <h1 className="text-xl font-bold mb-6">📊 Tracking</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["gewicht", "masse"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-full text-sm font-medium capitalize"
            style={{ backgroundColor: tab === t ? "#22c55e" : "#1a1a1a", color: tab === t ? "#000" : "#888" }}>
            {t === "gewicht" ? "⚖️ Gewicht" : "📏 Körpermaße"}
          </button>
        ))}
      </div>

      {tab === "gewicht" && (
        <>
          {/* Zusammenfassung */}
          {gewicht.length > 1 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="text-xs mb-1" style={{ color: "#666" }}>Start</div>
                <div className="font-bold">{erstes.wert} kg</div>
              </div>
              <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="text-xs mb-1" style={{ color: "#666" }}>Aktuell</div>
                <div className="font-bold" style={{ color: "#22c55e" }}>{letztes.wert} kg</div>
              </div>
              <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="text-xs mb-1" style={{ color: "#666" }}>Differenz</div>
                <div className="font-bold" style={{ color: parseFloat(differenz!) < 0 ? "#22c55e" : "#ef4444" }}>
                  {parseFloat(differenz!) > 0 ? "+" : ""}{differenz} kg
                </div>
              </div>
            </div>
          )}

          {/* Eingabe */}
          <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-sm font-medium mb-3" style={{ color: "#888" }}>Neues Gewicht eintragen</div>
            <div className="flex gap-2">
              <input value={neuesGewicht} onChange={e => setNeuesGewicht(e.target.value)}
                type="number" step="0.1" placeholder="z.B. 72.5"
                className="flex-1 px-4 py-3 rounded-xl outline-none text-white"
                style={{ backgroundColor: "#2a2a2a" }} />
              <span className="flex items-center px-3 font-semibold" style={{ color: "#666" }}>kg</span>
              <button onClick={speichernGewicht}
                className="px-4 py-3 rounded-xl font-bold text-black"
                style={{ backgroundColor: "#22c55e" }}>
                ✓
              </button>
            </div>
          </div>

          {/* Verlauf */}
          <div className="space-y-2">
            {[...gewicht].reverse().map((e, i) => (
              <div key={i} className="rounded-xl px-4 py-3 flex justify-between items-center"
                style={{ backgroundColor: "#1a1a1a" }}>
                <span className="text-sm" style={{ color: "#888" }}>{e.datum}</span>
                <span className="font-bold">{e.wert} kg</span>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "masse" && (
        <>
          <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-sm font-medium mb-3" style={{ color: "#888" }}>Maße eintragen (cm)</div>
            <div className="space-y-3">
              {[
                { label: "Taille", value: taille, set: setTaille },
                { label: "Hüfte", value: huefte, set: setHuefte },
                { label: "Oberschenkel", value: oberschenkel, set: setOberschenkel },
              ].map(({ label, value, set }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-sm w-28" style={{ color: "#888" }}>{label}</span>
                  <input value={value} onChange={e => set(e.target.value)}
                    type="number" placeholder="cm"
                    className="flex-1 px-4 py-2 rounded-xl outline-none text-white text-sm"
                    style={{ backgroundColor: "#2a2a2a" }} />
                </div>
              ))}
              <button onClick={speichernMasse}
                className="w-full py-3 rounded-xl font-bold text-black mt-2"
                style={{ backgroundColor: "#22c55e" }}>
                Speichern
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {[...masse].reverse().map((m, i) => (
              <div key={i} className="rounded-xl px-4 py-3" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="text-xs mb-2" style={{ color: "#666" }}>{m.datum}</div>
                <div className="flex gap-4 text-sm">
                  <span>Taille: <strong>{m.taille} cm</strong></span>
                  <span>Hüfte: <strong>{m.huefte} cm</strong></span>
                  <span>OS: <strong>{m.oberschenkel} cm</strong></span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
