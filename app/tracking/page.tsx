"use client";
import { useEffect, useState } from "react";

type Eintrag = { datum: string; wert: number };
type Masse = { datum: string; taille: number; huefte: number; oberschenkel: number };
type NaehrwertEintrag = { id: string; datum: string; name: string; kcal: number; kh: number; eiweiss: number; fett: number };

// ─── SVG Linienchart ──────────────────────────────────────────────────────────
function LineChart({ daten, farbe, einheit }: { daten: { label: string; wert: number }[]; farbe: string; einheit: string }) {
  if (daten.length < 2) return (
    <div className="flex items-center justify-center h-24 text-sm" style={{ color: "#444" }}>
      Mindestens 2 Einträge für Grafik
    </div>
  );

  const W = 320, H = 100, pad = 12;
  const werte = daten.map(d => d.wert);
  const min = Math.min(...werte), max = Math.max(...werte);
  const range = max - min || 1;

  const punkte = daten.map((d, i) => ({
    x: pad + (i / (daten.length - 1)) * (W - pad * 2),
    y: pad + (1 - (d.wert - min) / range) * (H - pad * 2),
    wert: d.wert,
    label: d.label,
  }));

  const pfad = punkte.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const flaeche = `${pfad} L ${punkte[punkte.length - 1].x} ${H} L ${punkte[0].x} ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 100 }}>
      <defs>
        <linearGradient id={`grad-${farbe.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={farbe} stopOpacity="0.3" />
          <stop offset="100%" stopColor={farbe} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={flaeche} fill={`url(#grad-${farbe.replace("#", "")})`} />
      <path d={pfad} fill="none" stroke={farbe} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {punkte.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={farbe} />
      ))}
      {/* Min/Max Labels */}
      <text x={pad} y={H - 2} fontSize="8" fill="#555">{min}{einheit}</text>
      <text x={W - pad} y={H - 2} fontSize="8" fill="#555" textAnchor="end">{max}{einheit}</text>
    </svg>
  );
}

// ─── Fortschrittsbalken ───────────────────────────────────────────────────────
function ProgressBar({ wert, ziel, farbe, label, einheit }: { wert: number; ziel: number; farbe: string; label: string; einheit: string }) {
  const prozent = Math.min(100, Math.round((wert / ziel) * 100));
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: "#888" }}>{label}</span>
        <span style={{ color: prozent >= 100 ? "#ef4444" : "#ccc" }}>{wert} / {ziel} {einheit}</span>
      </div>
      <div className="rounded-full h-2 overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
        <div className="h-2 rounded-full transition-all"
          style={{ width: `${prozent}%`, backgroundColor: prozent >= 100 ? "#ef4444" : farbe }} />
      </div>
    </div>
  );
}

export default function TrackingPage() {
  const [gewicht, setGewicht] = useState<Eintrag[]>([]);
  const [masse, setMasse] = useState<Masse[]>([]);
  const [naehrwerte, setNaehrwerte] = useState<NaehrwertEintrag[]>([]);
  const [tab, setTab] = useState<"gewicht" | "masse" | "naehrwerte">("gewicht");

  // Gewicht-Form
  const [neuesGewicht, setNeuesGewicht] = useState("");

  // Maße-Form
  const [taille, setTaille] = useState("");
  const [huefte, setHuefte] = useState("");
  const [oberschenkel, setOberschenkel] = useState("");

  // Nährwerte-Form
  const [nName, setNName] = useState("");
  const [nKcal, setNKcal] = useState("");
  const [nKh, setNKh] = useState("");
  const [nEiweiss, setNEiweiss] = useState("");
  const [nFett, setNFett] = useState("");
  const [showNForm, setShowNForm] = useState(false);

  // Ziele (anpassbar)
  const [zielKcal, setZielKcal] = useState(1500);
  const [zielKh, setZielKh] = useState(20);
  const [zielEiweiss, setZielEiweiss] = useState(100);
  const [zielFett, setZielFett] = useState(120);
  const [showZiele, setShowZiele] = useState(false);

  useEffect(() => {
    const g = localStorage.getItem("ketome_gewicht");
    const m = localStorage.getItem("ketome_masse");
    const n = localStorage.getItem("ketome_naehrwerte");
    const z = localStorage.getItem("ketome_ziele");
    if (g) setGewicht(JSON.parse(g));
    if (m) setMasse(JSON.parse(m));
    if (n) setNaehrwerte(JSON.parse(n));
    if (z) {
      const zObj = JSON.parse(z);
      setZielKcal(zObj.kcal || 1500);
      setZielKh(zObj.kh || 20);
      setZielEiweiss(zObj.eiweiss || 100);
      setZielFett(zObj.fett || 120);
    }
  }, []);

  function speichernGewicht() {
    if (!neuesGewicht) return;
    const neu = [...gewicht, { datum: new Date().toLocaleDateString("de-DE"), wert: parseFloat(neuesGewicht) }];
    setGewicht(neu);
    localStorage.setItem("ketome_gewicht", JSON.stringify(neu));
    setNeuesGewicht("");
  }

  function loeschenGewicht(idx: number) {
    const neu = gewicht.filter((_, i) => i !== idx);
    setGewicht(neu);
    localStorage.setItem("ketome_gewicht", JSON.stringify(neu));
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

  function naehrwertHinzufuegen() {
    if (!nKcal && !nKh) return;
    const neu: NaehrwertEintrag = {
      id: Date.now().toString(),
      datum: new Date().toLocaleDateString("de-DE"),
      name: nName || "Mahlzeit",
      kcal: parseInt(nKcal) || 0,
      kh: parseFloat(nKh) || 0,
      eiweiss: parseInt(nEiweiss) || 0,
      fett: parseInt(nFett) || 0,
    };
    const alle = [...naehrwerte, neu];
    setNaehrwerte(alle);
    localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
    setNName(""); setNKcal(""); setNKh(""); setNEiweiss(""); setNFett("");
    setShowNForm(false);
  }

  function naehrwertLoeschen(id: string) {
    const alle = naehrwerte.filter(n => n.id !== id);
    setNaehrwerte(alle);
    localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
  }

  function zieleSpeichern() {
    localStorage.setItem("ketome_ziele", JSON.stringify({ kcal: zielKcal, kh: zielKh, eiweiss: zielEiweiss, fett: zielFett }));
    setShowZiele(false);
  }

  const heute = new Date().toLocaleDateString("de-DE");
  const heuteEintraege = naehrwerte.filter(n => n.datum === heute);
  const heuteKcal = heuteEintraege.reduce((s, n) => s + n.kcal, 0);
  const heuteKh = heuteEintraege.reduce((s, n) => s + n.kh, 0);
  const heuteEiweiss = heuteEintraege.reduce((s, n) => s + n.eiweiss, 0);
  const heuteFett = heuteEintraege.reduce((s, n) => s + n.fett, 0);

  // Nährwerte nach Datum gruppieren
  const nachDatum = naehrwerte.reduce((acc, n) => {
    if (!acc[n.datum]) acc[n.datum] = [];
    acc[n.datum].push(n);
    return acc;
  }, {} as Record<string, NaehrwertEintrag[]>);
  const daten = Object.entries(nachDatum).sort((a, b) => {
    const [da, ma, ya] = a[0].split(".").map(Number);
    const [db, mb, yb] = b[0].split(".").map(Number);
    return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
  });

  const letztes = gewicht[gewicht.length - 1];
  const erstes = gewicht[0];
  const differenz = letztes && erstes ? (letztes.wert - erstes.wert).toFixed(1) : null;

  const letzteMasse = masse[masse.length - 1];
  const ersteMasse = masse[0];

  const gewichtChartDaten = gewicht.slice(-14).map(g => ({
    label: g.datum,
    wert: g.wert,
  }));

  // ─── Fortschritt berechnen ───────────────────────────────────────────────
  const ersterTag = gewicht[0]?.datum ?? null;
  const tageDabei = ersterTag ? (() => {
    const [d, m, y] = ersterTag.split(".").map(Number);
    const start = new Date(y, m - 1, d);
    return Math.floor((Date.now() - start.getTime()) / 86400000) + 1;
  })() : 0;

  const kgVerloren = gewicht.length >= 2
    ? parseFloat((gewicht[0].wert - gewicht[gewicht.length - 1].wert).toFixed(1))
    : 0;

  const tailleVerloren = masse.length >= 2
    ? parseFloat((masse[0].taille - masse[masse.length - 1].taille).toFixed(1))
    : 0;

  const mahlzeitenGeloggt = naehrwerte.length;

  return (
    <main className="px-4 py-6 pb-28">
      <h1 className="text-xl font-bold mb-4">📊 Übersicht</h1>

      {/* Fortschritt-Banner */}
      {tageDabei > 0 && (
        <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
          <div className="text-xs font-semibold mb-3" style={{ color: "#22c55e" }}>🏆 Mein Fortschritt</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#0a1a0a" }}>
              <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>{tageDabei}</div>
              <div className="text-xs mt-0.5" style={{ color: "#555" }}>Tage dabei</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#0a1a0a" }}>
              <div className="text-2xl font-bold" style={{ color: kgVerloren > 0 ? "#22c55e" : kgVerloren < 0 ? "#ef4444" : "#888" }}>
                {kgVerloren > 0 ? "-" : kgVerloren < 0 ? "+" : ""}{Math.abs(kgVerloren)} kg
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#555" }}>abgenommen</div>
            </div>
            {tailleVerloren !== 0 && (
              <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#0a1a0a" }}>
                <div className="text-2xl font-bold" style={{ color: tailleVerloren > 0 ? "#22c55e" : "#ef4444" }}>
                  {tailleVerloren > 0 ? "-" : "+"}{Math.abs(tailleVerloren)} cm
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#555" }}>Taille verloren</div>
              </div>
            )}
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#0a1a0a" }}>
              <div className="text-2xl font-bold" style={{ color: "#f59e0b" }}>{mahlzeitenGeloggt}</div>
              <div className="text-xs mt-0.5" style={{ color: "#555" }}>Mahlzeiten geloggt</div>
            </div>
          </div>
          {kgVerloren >= 5 && (
            <div className="mt-3 text-center text-xs font-semibold" style={{ color: "#22c55e" }}>
              🎉 Wow — über 5 kg abgenommen! Das ist riesig!
            </div>
          )}
          {tageDabei >= 30 && (
            <div className="mt-3 text-center text-xs font-semibold" style={{ color: "#f59e0b" }}>
              ⭐ 30+ Tage dabei — du hast es zu deiner Gewohnheit gemacht!
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {([
          { key: "gewicht", label: "⚖️ Gewicht" },
          { key: "masse", label: "📏 Umfang" },
          { key: "naehrwerte", label: "🥗 Nährwerte" },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: tab === t.key ? "#22c55e" : "#1a1a1a", color: tab === t.key ? "#000" : "#888" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── GEWICHT ─────────────────────────────────────────────────────────── */}
      {tab === "gewicht" && (
        <>
          {gewicht.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="text-xs mb-1" style={{ color: "#666" }}>Stargewicht</div>
                <div className="font-bold text-sm">{erstes.wert} kg</div>
              </div>
              <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="text-xs mb-1" style={{ color: "#666" }}>Aktuell</div>
                <div className="font-bold text-sm" style={{ color: "#22c55e" }}>{letztes.wert} kg</div>
              </div>
              <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="text-xs mb-1" style={{ color: "#666" }}>Verloren</div>
                {differenz !== null && (
                  <div className="font-bold text-sm" style={{ color: parseFloat(differenz) < 0 ? "#22c55e" : "#ef4444" }}>
                    {parseFloat(differenz) > 0 ? "+" : ""}{differenz} kg
                  </div>
                )}
              </div>
            </div>
          )}

          {gewicht.length >= 2 && (
            <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>VERLAUF (letzte 14 Einträge)</div>
              <LineChart daten={gewichtChartDaten} farbe="#22c55e" einheit=" kg" />
              <div className="flex justify-between text-xs mt-2" style={{ color: "#444" }}>
                <span>{gewichtChartDaten[0]?.label}</span>
                <span>{gewichtChartDaten[gewichtChartDaten.length - 1]?.label}</span>
              </div>
            </div>
          )}

          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-sm font-medium mb-3" style={{ color: "#888" }}>Gewicht eintragen</div>
            <div className="flex gap-2">
              <input value={neuesGewicht} onChange={e => setNeuesGewicht(e.target.value)}
                type="number" step="0.1" placeholder="z.B. 72.5"
                className="flex-1 px-4 py-3 rounded-xl outline-none text-white"
                style={{ backgroundColor: "#2a2a2a" }} />
              <span className="flex items-center px-2 font-semibold" style={{ color: "#666" }}>kg</span>
              <button onClick={speichernGewicht}
                className="px-4 py-3 rounded-xl font-bold text-black"
                style={{ backgroundColor: "#22c55e" }}>✓</button>
            </div>
          </div>

          <div className="space-y-2">
            {[...gewicht].reverse().map((e, i) => {
              const origIdx = gewicht.length - 1 - i;
              const prev = gewicht[origIdx - 1];
              const diff = prev ? (e.wert - prev.wert) : null;
              return (
                <div key={i} className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ backgroundColor: "#1a1a1a" }}>
                  <div className="flex-1">
                    <span className="text-sm" style={{ color: "#888" }}>{e.datum}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {diff !== null && (
                      <span className="text-xs" style={{ color: diff < 0 ? "#22c55e" : diff > 0 ? "#ef4444" : "#555" }}>
                        {diff > 0 ? "+" : ""}{diff.toFixed(1)} kg
                      </span>
                    )}
                    <span className="font-bold">{e.wert} kg</span>
                    <button onClick={() => loeschenGewicht(origIdx)} style={{ color: "#333" }}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ─── UMFANG ──────────────────────────────────────────────────────────── */}
      {tab === "masse" && (
        <>
          {masse.length > 0 && letzteMasse && ersteMasse && (
            <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>VERÄNDERUNG GESAMT</div>
              {[
                { label: "Taille", start: ersteMasse.taille, jetzt: letzteMasse.taille, farbe: "#f59e0b" },
                { label: "Hüfte", start: ersteMasse.huefte, jetzt: letzteMasse.huefte, farbe: "#8b5cf6" },
                { label: "Oberschenkel", start: ersteMasse.oberschenkel, jetzt: letzteMasse.oberschenkel, farbe: "#22c55e" },
              ].map(({ label, start, jetzt, farbe }) => {
                const diff = jetzt - start;
                return (
                  <div key={label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "#222" }}>
                    <span className="text-sm" style={{ color: "#888" }}>{label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: "#555" }}>{start} cm</span>
                      <span className="text-xs">→</span>
                      <span className="font-bold text-sm">{jetzt} cm</span>
                      {diff !== 0 && (
                        <span className="text-xs font-semibold" style={{ color: diff < 0 ? "#22c55e" : "#ef4444" }}>
                          ({diff > 0 ? "+" : ""}{diff.toFixed(1)})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {masse.length >= 2 && (
            <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>TAILLENUMFANG-VERLAUF</div>
              <LineChart
                daten={masse.slice(-10).map(m => ({ label: m.datum, wert: m.taille }))}
                farbe="#f59e0b" einheit=" cm" />
            </div>
          )}

          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
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
                className="w-full py-3 rounded-xl font-bold text-black mt-1"
                style={{ backgroundColor: "#22c55e" }}>
                Speichern
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {[...masse].reverse().map((m, i) => (
              <div key={i} className="rounded-xl px-4 py-3" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="text-xs mb-2" style={{ color: "#555" }}>{m.datum}</div>
                <div className="flex gap-4 text-sm flex-wrap">
                  {m.taille > 0 && <span style={{ color: "#f59e0b" }}>Taille: <strong>{m.taille} cm</strong></span>}
                  {m.huefte > 0 && <span style={{ color: "#8b5cf6" }}>Hüfte: <strong>{m.huefte} cm</strong></span>}
                  {m.oberschenkel > 0 && <span style={{ color: "#22c55e" }}>OS: <strong>{m.oberschenkel} cm</strong></span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ─── NÄHRWERTE ───────────────────────────────────────────────────────── */}
      {tab === "naehrwerte" && (
        <>
          {/* Heutiger Stand */}
          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold" style={{ color: "#555" }}>HEUTE ({heute})</div>
              <button onClick={() => setShowZiele(!showZiele)}
                className="text-xs px-2 py-1 rounded-lg"
                style={{ backgroundColor: "#2a2a2a", color: "#888" }}>
                ⚙ Ziele
              </button>
            </div>

            {showZiele && (
              <div className="mb-4 p-3 rounded-xl space-y-2" style={{ backgroundColor: "#2a2a2a" }}>
                <div className="text-xs font-semibold mb-2" style={{ color: "#888" }}>Tagesziele anpassen</div>
                {[
                  { label: "Kalorien (kcal)", val: zielKcal, set: setZielKcal },
                  { label: "Kohlenhydrate (g)", val: zielKh, set: setZielKh },
                  { label: "Eiweiß (g)", val: zielEiweiss, set: setZielEiweiss },
                  { label: "Fett (g)", val: zielFett, set: setZielFett },
                ].map(({ label, val, set }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-xs flex-1" style={{ color: "#888" }}>{label}</span>
                    <input value={val} onChange={e => set(parseInt(e.target.value) || 0)}
                      type="number"
                      className="w-20 px-2 py-1 rounded-lg outline-none text-white text-sm text-center"
                      style={{ backgroundColor: "#1a1a1a" }} />
                  </div>
                ))}
                <button onClick={zieleSpeichern}
                  className="w-full py-2 rounded-xl text-sm font-bold text-black mt-1"
                  style={{ backgroundColor: "#22c55e" }}>
                  Speichern
                </button>
              </div>
            )}

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: "kcal", wert: heuteKcal, ziel: zielKcal, farbe: "#f59e0b" },
                { label: "KH g", wert: Math.round(heuteKh), ziel: zielKh, farbe: "#ef4444" },
                { label: "Eiweiß", wert: heuteEiweiss, ziel: zielEiweiss, farbe: "#22c55e" },
                { label: "Fett g", wert: heuteFett, ziel: zielFett, farbe: "#8b5cf6" },
              ].map(({ label, wert, ziel, farbe }) => (
                <div key={label} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#2a2a2a" }}>
                  <div className="text-xs mb-0.5" style={{ color: "#555" }}>{label}</div>
                  <div className="text-sm font-bold" style={{ color: wert >= ziel ? "#ef4444" : farbe }}>{wert}</div>
                  <div className="text-xs" style={{ color: "#444" }}>/ {ziel}</div>
                </div>
              ))}
            </div>

            <ProgressBar wert={heuteKcal} ziel={zielKcal} farbe="#f59e0b" label="Kalorien" einheit="kcal" />
            <ProgressBar wert={Math.round(heuteKh)} ziel={zielKh} farbe="#ef4444" label="Kohlenhydrate" einheit="g" />
            <ProgressBar wert={heuteEiweiss} ziel={zielEiweiss} farbe="#22c55e" label="Eiweiß" einheit="g" />
            <ProgressBar wert={heuteFett} ziel={zielFett} farbe="#8b5cf6" label="Fett" einheit="g" />
          </div>

          {/* Mahlzeit hinzufügen */}
          <button onClick={() => setShowNForm(!showNForm)}
            className="w-full py-3 rounded-xl font-bold text-black mb-4"
            style={{ backgroundColor: "#22c55e" }}>
            + Mahlzeit eintragen
          </button>

          {showNForm && (
            <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
              <input value={nName} onChange={e => setNName(e.target.value)}
                placeholder="Name (z.B. Mittagessen)"
                className="w-full px-4 py-2 rounded-xl outline-none text-white text-sm mb-3"
                style={{ backgroundColor: "#2a2a2a" }} />
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label: "kcal", val: nKcal, set: setNKcal },
                  { label: "KH (g)", val: nKh, set: setNKh },
                  { label: "Eiweiß (g)", val: nEiweiss, set: setNEiweiss },
                  { label: "Fett (g)", val: nFett, set: setNFett },
                ].map(({ label, val, set }) => (
                  <div key={label}>
                    <div className="text-xs mb-1" style={{ color: "#666" }}>{label}</div>
                    <input value={val} onChange={e => set(e.target.value)} type="number"
                      className="w-full px-3 py-2 rounded-xl outline-none text-white text-sm"
                      style={{ backgroundColor: "#2a2a2a" }} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowNForm(false)}
                  className="flex-1 py-2 rounded-xl text-sm"
                  style={{ backgroundColor: "#2a2a2a", color: "#888" }}>
                  Abbrechen
                </button>
                <button onClick={naehrwertHinzufuegen}
                  className="flex-1 py-2 rounded-xl font-bold text-black text-sm"
                  style={{ backgroundColor: "#22c55e" }}>
                  Hinzufügen
                </button>
              </div>
            </div>
          )}

          {/* Verlauf nach Tagen */}
          {daten.length > 0 && (
            <div className="space-y-4">
              {[...daten].reverse().map(([datum, eintraege]) => {
                const tKcal = eintraege.reduce((s, n) => s + n.kcal, 0);
                const tKh = eintraege.reduce((s, n) => s + n.kh, 0);
                const tEiweiss = eintraege.reduce((s, n) => s + n.eiweiss, 0);
                const tFett = eintraege.reduce((s, n) => s + n.fett, 0);
                return (
                  <div key={datum} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
                    <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: "#222" }}>
                      <span className="text-xs font-semibold" style={{ color: datum === heute ? "#22c55e" : "#666" }}>
                        {datum === heute ? "Heute" : datum}
                      </span>
                      <div className="flex gap-3 text-xs">
                        <span style={{ color: "#f59e0b" }}>{tKcal} kcal</span>
                        <span style={{ color: "#ef4444" }}>{Math.round(tKh)}g KH</span>
                        <span style={{ color: "#22c55e" }}>{tEiweiss}g P</span>
                      </div>
                    </div>
                    {eintraege.map(e => (
                      <div key={e.id} className="px-4 py-2 flex items-center gap-3 border-t" style={{ borderColor: "#2a2a2a" }}>
                        <span className="flex-1 text-sm">{e.name}</span>
                        <div className="flex gap-2 text-xs" style={{ color: "#555" }}>
                          {e.kcal > 0 && <span>{e.kcal} kcal</span>}
                          {e.kh > 0 && <span>{e.kh}g KH</span>}
                          {e.eiweiss > 0 && <span>{e.eiweiss}g P</span>}
                        </div>
                        <button onClick={() => naehrwertLoeschen(e.id)} style={{ color: "#333" }}>✕</button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {naehrwerte.length === 0 && (
            <div className="text-center py-8" style={{ color: "#555" }}>
              <div className="text-3xl mb-2">🥗</div>
              <p>Noch nichts eingetragen.</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
