"use client";
import { useEffect, useState } from "react";

type FastenModus = "16:8" | "18:6" | "20:4" | "OMAD";
type FastenEintrag = { start: string; ende: string; stunden: number; modus: FastenModus };

const MODI: Record<FastenModus, { essenFenster: number; fastenStunden: number; beschreibung: string }> = {
  "16:8":  { essenFenster: 8,  fastenStunden: 16, beschreibung: "Klassisch · 8h essen, 16h fasten" },
  "18:6":  { essenFenster: 6,  fastenStunden: 18, beschreibung: "Fortgeschritten · 6h essen, 18h fasten" },
  "20:4":  { essenFenster: 4,  fastenStunden: 20, beschreibung: "Warrior Diet · 4h essen, 20h fasten" },
  "OMAD":  { essenFenster: 1,  fastenStunden: 23, beschreibung: "One Meal A Day · 1 Mahlzeit täglich" },
};

const WASSER_ZIEL = 8; // Gläser

export default function FastenPage() {
  const [aktiv, setAktiv]       = useState(false);
  const [startZeit, setStartZeit] = useState<number | null>(null);
  const [modus, setModus]       = useState<FastenModus>("16:8");
  const [jetzt, setJetzt]       = useState(Date.now());
  const [verlauf, setVerlauf]   = useState<FastenEintrag[]>([]);
  const [wasser, setWasser]     = useState(0);
  const [wasserDatum, setWasserDatum] = useState("");
  const [tab, setTab]           = useState<"timer" | "wasser" | "verlauf">("timer");

  const heute = new Date().toLocaleDateString("de-DE");

  useEffect(() => {
    const s = localStorage.getItem("ketome_fasten_start");
    const m = localStorage.getItem("ketome_fasten_modus") as FastenModus | null;
    if (s) { setStartZeit(parseInt(s)); setAktiv(true); }
    if (m) setModus(m);
    const v = localStorage.getItem("ketome_fasten_verlauf");
    if (v) setVerlauf(JSON.parse(v));
    const w = localStorage.getItem("ketome_wasser");
    if (w) {
      const obj = JSON.parse(w);
      if (obj.datum === heute) { setWasser(obj.gläser); setWasserDatum(obj.datum); }
      else { setWasser(0); setWasserDatum(heute); }
    }
  }, [heute]);

  useEffect(() => {
    if (!aktiv) return;
    const interval = setInterval(() => setJetzt(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [aktiv]);

  function fastenStarten() {
    const now = Date.now();
    setStartZeit(now);
    setAktiv(true);
    localStorage.setItem("ketome_fasten_start", now.toString());
    localStorage.setItem("ketome_fasten_modus", modus);
  }

  function fastenBeenden() {
    if (!startZeit) return;
    const dauer = (Date.now() - startZeit) / 3600000;
    const eintrag: FastenEintrag = {
      start: new Date(startZeit).toLocaleString("de-DE"),
      ende: new Date().toLocaleString("de-DE"),
      stunden: Math.round(dauer * 10) / 10,
      modus,
    };
    const neu = [eintrag, ...verlauf].slice(0, 30);
    setVerlauf(neu);
    localStorage.setItem("ketome_fasten_verlauf", JSON.stringify(neu));
    localStorage.removeItem("ketome_fasten_start");
    localStorage.removeItem("ketome_fasten_modus");
    setAktiv(false);
    setStartZeit(null);
  }

  function wasserHinzufuegen(delta: number) {
    const neu = Math.max(0, Math.min(WASSER_ZIEL + 4, wasser + delta));
    setWasser(neu);
    localStorage.setItem("ketome_wasser", JSON.stringify({ datum: heute, gläser: neu }));
  }

  const vergangen   = startZeit ? (jetzt - startZeit) / 1000 : 0;
  const zielSekunden = MODI[modus].fastenStunden * 3600;
  const prozent     = Math.min((vergangen / zielSekunden) * 100, 100);
  const uebrig      = Math.max(zielSekunden - vergangen, 0);

  const hh = Math.floor(vergangen / 3600);
  const mm = Math.floor((vergangen % 3600) / 60);
  const ss = Math.floor(vergangen % 60);
  const uHH = Math.floor(uebrig / 3600);
  const uMM = Math.floor((uebrig % 3600) / 60);

  const zielErreicht = vergangen >= zielSekunden;

  // SVG Kreis
  const R = 88;
  const umfang = 2 * Math.PI * R;
  const strich = umfang - (prozent / 100) * umfang;

  return (
    <main className="px-4 py-6 pb-28">
      <h1 className="text-xl font-bold mb-1">⏱ Fasten & Wasser</h1>
      <p className="text-sm mb-4" style={{ color: "#666" }}>Intermittierendes Fasten tracken</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["timer","wasser","verlauf"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-xl text-sm font-medium capitalize"
            style={{ backgroundColor: tab === t ? "#22c55e" : "#1a1a1a", color: tab === t ? "#000" : "#666" }}>
            {t === "timer" ? "⏱ Timer" : t === "wasser" ? "💧 Wasser" : "📋 Verlauf"}
          </button>
        ))}
      </div>

      {/* TIMER */}
      {tab === "timer" && (
        <div>
          {/* Modus-Wahl (nur wenn nicht aktiv) */}
          {!aktiv && (
            <div className="space-y-2 mb-6">
              {(Object.entries(MODI) as [FastenModus, typeof MODI[FastenModus]][]).map(([key, val]) => (
                <button key={key} onClick={() => setModus(key)}
                  className="w-full rounded-2xl p-4 flex items-center gap-3 text-left"
                  style={{ backgroundColor: modus === key ? "#0d2018" : "#1a1a1a", border: modus === key ? "1px solid #22c55e" : "1px solid transparent" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: modus === key ? "#22c55e" : "#2a2a2a", color: modus === key ? "#000" : "#888" }}>
                    {key}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{key}</div>
                    <div className="text-xs" style={{ color: "#555" }}>{val.beschreibung}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Timer-Kreis */}
          {aktiv && (
            <div className="flex flex-col items-center mb-6">
              <div className="relative" style={{ width: 200, height: 200 }}>
                <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="100" cy="100" r={R} fill="none" stroke="#1a1a1a" strokeWidth="12" />
                  <circle cx="100" cy="100" r={R} fill="none"
                    stroke={zielErreicht ? "#f59e0b" : "#22c55e"} strokeWidth="12"
                    strokeDasharray={umfang} strokeDashoffset={strich}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s linear" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold font-mono">
                    {String(hh).padStart(2,"0")}:{String(mm).padStart(2,"0")}:{String(ss).padStart(2,"0")}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#555" }}>gefastet</div>
                  <div className="text-xs mt-1 font-semibold" style={{ color: zielErreicht ? "#f59e0b" : "#22c55e" }}>
                    {zielErreicht ? "🎉 Ziel erreicht!" : `noch ${uHH}h ${uMM}m`}
                  </div>
                </div>
              </div>
              <div className="text-sm mt-2" style={{ color: "#555" }}>
                Modus: <span style={{ color: "#22c55e" }}>{modus}</span> · Ziel: {MODI[modus].fastenStunden}h
              </div>
              <div className="text-xs mt-1" style={{ color: "#444" }}>
                Gestartet: {startZeit ? new Date(startZeit).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) : ""}
              </div>
            </div>
          )}

          {/* Start / Beenden */}
          {!aktiv ? (
            <button onClick={fastenStarten}
              className="w-full py-4 rounded-2xl font-bold text-black text-base"
              style={{ backgroundColor: "#22c55e" }}>
              ⏱ Fasten starten ({modus})
            </button>
          ) : (
            <button onClick={fastenBeenden}
              className="w-full py-4 rounded-2xl font-bold text-sm"
              style={{ backgroundColor: "#1a1a1a", color: "#ef4444", border: "1px solid #7f1d1d" }}>
              Fasten beenden & speichern
            </button>
          )}
        </div>
      )}

      {/* WASSER */}
      {tab === "wasser" && (
        <div>
          {/* Große Anzeige */}
          <div className="text-center mb-6">
            <div className="text-7xl font-bold mb-2" style={{ color: "#06b6d4" }}>{wasser}</div>
            <div className="text-sm mb-1" style={{ color: "#555" }}>von {WASSER_ZIEL} Gläsern (à 250ml)</div>
            <div className="text-xs" style={{ color: "#444" }}>{Math.round(wasser * 250 / 1000 * 10) / 10} von 2,0 Litern</div>
          </div>

          {/* Fortschritt */}
          <div className="rounded-full h-3 mb-6" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="rounded-full h-3 transition-all" style={{ backgroundColor: "#06b6d4", width: `${Math.min((wasser / WASSER_ZIEL) * 100, 100)}%` }} />
          </div>

          {/* Gläser-Visualisierung */}
          <div className="flex gap-2 flex-wrap justify-center mb-6">
            {Array.from({ length: WASSER_ZIEL }).map((_, i) => (
              <button key={i} onClick={() => setWasser(prev => {
                const neu = i < prev ? prev : i + 1;
                localStorage.setItem("ketome_wasser", JSON.stringify({ datum: heute, gläser: neu }));
                return neu;
              })}
                className="text-3xl">{i < wasser ? "🥤" : "🫙"}</button>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button onClick={() => wasserHinzufuegen(-1)}
              className="flex-1 py-4 rounded-2xl text-2xl font-bold"
              style={{ backgroundColor: "#1a1a1a" }}>−</button>
            <button onClick={() => wasserHinzufuegen(1)}
              className="flex-1 py-4 rounded-2xl font-bold text-black text-lg"
              style={{ backgroundColor: "#06b6d4" }}>
              + Glas
            </button>
          </div>

          {wasser >= WASSER_ZIEL && (
            <div className="mt-4 rounded-2xl p-3 text-center" style={{ backgroundColor: "#0a1a20", border: "1px solid #0e7490" }}>
              <p className="text-sm font-semibold" style={{ color: "#06b6d4" }}>🎉 Tagesziel erreicht! Weiter so!</p>
            </div>
          )}
        </div>
      )}

      {/* VERLAUF */}
      {tab === "verlauf" && (
        <div>
          {verlauf.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">📋</div>
              <p style={{ color: "#666" }}>Noch kein Fasten abgeschlossen.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {verlauf.map((e, i) => (
                <div key={i} className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold">{e.modus}</div>
                    <div className="text-sm font-bold" style={{ color: e.stunden >= MODI[e.modus].fastenStunden ? "#22c55e" : "#f59e0b" }}>
                      {e.stunden}h
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: "#555" }}>
                    {e.start} – {e.ende}
                  </div>
                  {e.stunden >= MODI[e.modus].fastenStunden && (
                    <div className="text-xs mt-1" style={{ color: "#22c55e" }}>✓ Ziel erreicht</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
