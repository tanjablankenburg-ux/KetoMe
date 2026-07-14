"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type KetonMessung = {
  id: string;
  datum: string;
  zeit: string;
  wert: number;
  methode: "blut" | "atem" | "urin";
  glukose?: number;
  notiz?: string;
};

type Zone = { label: string; farbe: string; emoji: string; beschreibung: string; fuer: string };

function ketonZone(wert: number): Zone {
  if (wert < 0.5) return { label: "Keine Ketose", farbe: "#555", emoji: "⚪", beschreibung: "Unter der Ketose-Schwelle. KH reduzieren, Fasten verlängern.", fuer: "Ziel: KH unter 20g Netto halten" };
  if (wert < 1.5) return { label: "Ernährungsketose", farbe: "#f59e0b", emoji: "🟡", beschreibung: "Leichte Ketose — gut für Gewichtsverlust und Einstieg.", fuer: "Ideal für: Abnehmen, Einstieg" };
  if (wert < 3.0) return { label: "Optimale Ketose", farbe: "#22c55e", emoji: "🟢", beschreibung: "Der Sweet Spot. Maximale Fettverbrennung, mentale Klarheit, volle Energie.", fuer: "Ideal für: Performance, Klarheit, Fettverbrennung" };
  if (wert < 5.0) return { label: "Tiefe Ketose", farbe: "#3b82f6", emoji: "🔵", beschreibung: "Therapeutische Ketose. Oft durch längeres Fasten oder sehr strict Keto.", fuer: "Ideal für: Therapie, Epilepsie, Krebs-Protokolle" };
  return { label: "Sehr tiefe Ketose", farbe: "#ef4444", emoji: "🔴", beschreibung: "Ungewöhnlich hohe Werte — bei Hunger, Krankheit oder intensivem Fasten. Nur mit ärztlicher Begleitung.", fuer: "⚠ Bitte Arzt konsultieren" };
}

function gkiZone(gki: number): { label: string; farbe: string; beschreibung: string } {
  if (gki < 1) return { label: "Extrem therapeutisch", farbe: "#3b82f6", beschreibung: "Tiefste therapeutische Zone — für spezifische Protokolle unter Aufsicht." };
  if (gki < 3) return { label: "Therapeutisch optimal", farbe: "#22c55e", beschreibung: "Optimaler GKI-Bereich für therapeutische Anwendungen (Krebs, Epilepsie)." };
  if (gki < 6) return { label: "Optimale Ketose", farbe: "#22c55e", beschreibung: "Hervorragend — volle metabolische Vorteile, Fettverbrennung auf Hochtouren." };
  if (gki < 9) return { label: "Moderate Ketose", farbe: "#f59e0b", beschreibung: "Gute Ketose — für Gewichtsabnahme und allgemeine Gesundheit ausreichend." };
  return { label: "Schwache / keine Ketose", farbe: "#ef4444", beschreibung: "Kaum metabolische Ketose-Vorteile. KH weiter reduzieren oder Fasten verlängern." };
}

function LineChart({ daten, farbe }: { daten: { label: string; wert: number }[]; farbe?: string }) {
  if (daten.length < 2) return (
    <div className="flex items-center justify-center h-20 text-sm" style={{ color: "#444" }}>Mindestens 2 Messungen für Chart</div>
  );
  const W = 320, H = 80, pad = 12;
  const werte = daten.map(d => d.wert);
  const min = Math.min(...werte, 0), max = Math.max(...werte, 0.5);
  const range = max - min || 1;
  const punkte = daten.map((d, i) => ({
    x: pad + (i / (daten.length - 1)) * (W - pad * 2),
    y: pad + (1 - (d.wert - min) / range) * (H - pad * 2),
    wert: d.wert, label: d.label,
  }));
  const pfad = punkte.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const flaeche = `${pfad} L ${punkte[punkte.length - 1].x} ${H} L ${punkte[0].x} ${H} Z`;
  const c = farbe || "#22c55e";

  // Referenzlinien
  const zonen = [{ wert: 0.5, label: "Ketose", c: "#f59e0b" }, { wert: 1.5, label: "Optimal", c: "#22c55e" }, { wert: 3.0, label: "Tief", c: "#3b82f6" }];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }}>
      <defs>
        <linearGradient id="keton-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.25" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      {zonen.map(z => {
        if (z.wert < min || z.wert > max) return null;
        const zy = pad + (1 - (z.wert - min) / range) * (H - pad * 2);
        return (
          <g key={z.wert}>
            <line x1={pad} y1={zy} x2={W - pad} y2={zy} stroke={z.c} strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4" />
            <text x={W - pad + 2} y={zy + 3} fontSize="6" fill={z.c} opacity="0.6">{z.label}</text>
          </g>
        );
      })}
      <path d={flaeche} fill="url(#keton-grad)" />
      <path d={pfad} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {punkte.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={ketonZone(p.wert).farbe} stroke="#0a0a0a" strokeWidth="1" />
      ))}
      <text x={pad} y={H - 1} fontSize="7" fill="#444">{daten[0].label}</text>
      <text x={W - pad} y={H - 1} fontSize="7" fill="#444" textAnchor="end">{daten[daten.length - 1].label}</text>
    </svg>
  );
}

export default function ProfiPage() {
  const [messungen, setMessungen] = useState<KetonMessung[]>([]);
  const [tab, setTab] = useState<"ketone" | "gki" | "insights">("ketone");
  const [showForm, setShowForm] = useState(false);
  const [fastingStunden, setFastingStunden] = useState<number | null>(null);
  const [tageDabei, setTageDabei] = useState(0);

  // Formular
  const [fWert, setFWert] = useState("");
  const [fMethode, setFMethode] = useState<"blut" | "atem" | "urin">("blut");
  const [fGlukose, setFGlukose] = useState("");
  const [fNotiz, setFNotiz] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("ketome_ketone");
    if (raw) setMessungen(JSON.parse(raw));

    // Fasting-Status
    const fRaw = localStorage.getItem("ketome_fasting");
    if (fRaw) {
      const f = JSON.parse(fRaw);
      if (f.aktiv && f.startzeit) {
        const diff = (Date.now() - new Date(f.startzeit).getTime()) / 3600000;
        setFastingStunden(Math.round(diff * 10) / 10);
      }
    }

    // Tage dabei
    const gRaw = localStorage.getItem("ketome_gewicht");
    if (gRaw) {
      const arr = JSON.parse(gRaw);
      if (arr.length > 0) {
        const [d, m, y] = arr[0].datum.split(".").map(Number);
        const start = new Date(y, m - 1, d);
        setTageDabei(Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000)));
      }
    }
  }, []);

  function speichern() {
    const wert = parseFloat(fWert);
    if (!wert || wert <= 0) return;
    const neu: KetonMessung = {
      id: Date.now().toString(),
      datum: new Date().toLocaleDateString("de-DE"),
      zeit: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      wert,
      methode: fMethode,
      glukose: fGlukose ? parseFloat(fGlukose) : undefined,
      notiz: fNotiz || undefined,
    };
    const alle = [...messungen, neu];
    setMessungen(alle);
    localStorage.setItem("ketome_ketone", JSON.stringify(alle));
    setFWert(""); setFGlukose(""); setFNotiz("");
    setShowForm(false);
  }

  function loeschen(id: string) {
    const alle = messungen.filter(m => m.id !== id);
    setMessungen(alle);
    localStorage.setItem("ketome_ketone", JSON.stringify(alle));
  }

  const letzteMessung = messungen[messungen.length - 1];
  const zone = letzteMessung ? ketonZone(letzteMessung.wert) : null;

  // GKI berechnen
  const mitGlukose = messungen.filter(m => m.glukose && m.glukose > 0);
  const letzteGKI = mitGlukose[mitGlukose.length - 1];
  const gki = letzteGKI ? Math.round((letzteGKI.glukose! / letzteGKI.wert) * 10) / 10 : null;
  const gkiZ = gki !== null ? gkiZone(gki) : null;

  // Trend
  const letzte14 = messungen.slice(-14);
  const chartDaten = letzte14.map(m => ({ label: `${m.datum} ${m.zeit}`, wert: m.wert }));

  // Durchschnitt letzte 7
  const letzte7 = messungen.slice(-7);
  const avg7 = letzte7.length > 0 ? Math.round(letzte7.reduce((s, m) => s + m.wert, 0) / letzte7.length * 100) / 100 : null;
  const avg7Zone = avg7 !== null ? ketonZone(avg7) : null;

  // Autophagie
  function autophagieStatus(stunden: number): { label: string; farbe: string; beschreibung: string } {
    if (stunden < 12) return { label: "Noch nicht", farbe: "#555", beschreibung: "Ab ~12h beginnt leichte Autophagie." };
    if (stunden < 16) return { label: "Leicht aktiv", farbe: "#f59e0b", beschreibung: "Erste Autophagie-Prozesse laufen an." };
    if (stunden < 24) return { label: "Aktiv", farbe: "#22c55e", beschreibung: "Autophagie läuft. Zellreinigung auf Hochtouren." };
    if (stunden < 48) return { label: "Stark aktiv", farbe: "#3b82f6", beschreibung: "Intensive Autophagie und Stammzellregeneration." };
    return { label: "Maximum", farbe: "#8b5cf6", beschreibung: "Tiefste Autophagie — nur mit Erfahrung und Vorbereitung." };
  }

  const autophagieS = fastingStunden !== null ? autophagieStatus(fastingStunden) : null;

  // Keto-Anpassungsgrad
  function adaptationsGrad(tage: number): { label: string; prozent: number; farbe: string; text: string } {
    if (tage < 3) return { label: "Umstellung", prozent: 10, farbe: "#ef4444", text: "Körper stellt um — Keto-Grippe möglich" };
    if (tage < 7) return { label: "Anpassung", prozent: 30, farbe: "#f59e0b", text: "Ketonproduktion steigt. Energie kommt zurück." };
    if (tage < 21) return { label: "Keto-Adapted", prozent: 65, farbe: "#f59e0b", text: "Fettverbrennung wird effizienter. Hunger nimmt ab." };
    if (tage < 42) return { label: "Fat-Adapted", prozent: 85, farbe: "#22c55e", text: "Maximale Fettverbrennung. Muskelprotein wird geschont." };
    return { label: "Metabolisch flexibel", prozent: 100, farbe: "#22c55e", text: "Dein Körper wechselt problemlos zwischen Fett und Glukose." };
  }

  const adapt = adaptationsGrad(tageDabei);

  const METHODEN = [
    { key: "blut" as const, emoji: "💉", label: "Blut", genau: "Genaueste Methode", einheit: "mmol/L" },
    { key: "atem" as const, emoji: "💨", label: "Atem", genau: "Gut & komfortabel", einheit: "ppm/mmol" },
    { key: "urin" as const, emoji: "🔬", label: "Urin", genau: "Einstieg, weniger präzise", einheit: "mmol/L" },
  ];

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-xl font-bold">⚗️ Profi-Zone</h1>
        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "#22c55e22", color: "#22c55e" }}>Advanced</span>
      </div>
      <p className="text-sm mb-5" style={{ color: "#666" }}>Keton-Monitoring, GKI, Autophagie & metabolische Anpassung.</p>

      {/* Status-Banner */}
      {(letzteMessung || fastingStunden || tageDabei > 0) && (
        <div className="grid grid-cols-2 gap-2 mb-5">
          {letzteMessung && zone && (
            <div className="rounded-2xl p-3 col-span-2" style={{ backgroundColor: "#0d2018", border: `1px solid ${zone.farbe}44` }}>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{zone.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold" style={{ color: zone.farbe }}>{zone.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#666" }}>{letzteMessung.wert} mmol/L · {letzteMessung.datum} {letzteMessung.zeit}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: zone.farbe }}>{letzteMessung.wert}</div>
                  <div className="text-xs" style={{ color: "#555" }}>mmol/L</div>
                </div>
              </div>
            </div>
          )}
          {fastingStunden !== null && autophagieS && (
            <div className="rounded-2xl p-3" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-xs mb-1" style={{ color: "#555" }}>AUTOPHAGIE</div>
              <div className="font-bold text-sm" style={{ color: autophagieS.farbe }}>{autophagieS.label}</div>
              <div className="text-xs mt-0.5" style={{ color: "#444" }}>{fastingStunden}h gefastet</div>
            </div>
          )}
          {tageDabei > 0 && (
            <div className="rounded-2xl p-3" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-xs mb-1" style={{ color: "#555" }}>ADAPTATION</div>
              <div className="font-bold text-sm" style={{ color: adapt.farbe }}>{adapt.label}</div>
              <div className="text-xs mt-0.5" style={{ color: "#444" }}>Tag {tageDabei}</div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {([
          { key: "ketone", label: "🩸 Ketone" },
          { key: "gki", label: "📊 GKI" },
          { key: "insights", label: "🧠 Insights" },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: tab === t.key ? "#22c55e" : "#1a1a1a", color: tab === t.key ? "#000" : "#888" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── KETONE ──────────────────────────────────────────────────────────── */}
      {tab === "ketone" && (
        <>
          {/* Zonen-Legende */}
          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>KETOSE-ZONEN (mmol/L)</div>
            <div className="space-y-2">
              {[
                { von: "< 0,5", label: "Keine Ketose", farbe: "#555", emoji: "⚪" },
                { von: "0,5–1,5", label: "Ernährungsketose", farbe: "#f59e0b", emoji: "🟡" },
                { von: "1,5–3,0", label: "Optimale Ketose ✓", farbe: "#22c55e", emoji: "🟢" },
                { von: "3,0–5,0", label: "Tiefe / Therapeutische Ketose", farbe: "#3b82f6", emoji: "🔵" },
                { von: "> 5,0", label: "Sehr tief (Vorsicht)", farbe: "#ef4444", emoji: "🔴" },
              ].map(z => (
                <div key={z.von} className="flex items-center gap-3">
                  <span className="text-sm w-20 font-mono text-xs" style={{ color: z.farbe }}>{z.von}</span>
                  <span className="text-xs" style={{ color: z.farbe }}>{z.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          {chartDaten.length >= 2 && (
            <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>VERLAUF (letzte {letzte14.length} Messungen)</div>
              <LineChart daten={chartDaten} />
              {avg7 !== null && avg7Zone && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs" style={{ color: "#555" }}>Ø letzte 7:</span>
                  <span className="text-xs font-bold" style={{ color: avg7Zone.farbe }}>{avg7} mmol/L — {avg7Zone.label}</span>
                </div>
              )}
            </div>
          )}

          {/* Messen Button */}
          <button onClick={() => setShowForm(!showForm)}
            className="w-full py-3 rounded-xl font-bold text-black mb-4"
            style={{ backgroundColor: "#22c55e" }}>
            + Messung eintragen
          </button>

          {showForm && (
            <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
              {/* Methode */}
              <div className="mb-4">
                <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>MESSMETHODE</div>
                <div className="grid grid-cols-3 gap-2">
                  {METHODEN.map(m => (
                    <button key={m.key} onClick={() => setFMethode(m.key)}
                      className="p-2 rounded-xl text-center"
                      style={{ backgroundColor: fMethode === m.key ? "#0d2018" : "#2a2a2a", border: `1px solid ${fMethode === m.key ? "#22c55e" : "transparent"}` }}>
                      <div className="text-lg">{m.emoji}</div>
                      <div className="text-xs font-medium mt-0.5" style={{ color: fMethode === m.key ? "#22c55e" : "#888" }}>{m.label}</div>
                      <div className="text-[9px] mt-0.5" style={{ color: "#444" }}>{m.genau}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keton-Wert */}
              <div className="mb-3">
                <div className="text-xs mb-1.5" style={{ color: "#666" }}>Keton-Wert (mmol/L)</div>
                <input value={fWert} onChange={e => setFWert(e.target.value)} type="number" step="0.1"
                  placeholder="z.B. 1.8"
                  className="w-full px-4 py-3 rounded-xl outline-none text-white text-lg text-center font-bold"
                  style={{ backgroundColor: "#2a2a2a", color: fWert ? ketonZone(parseFloat(fWert)).farbe : "#fff" }} />
                {fWert && parseFloat(fWert) > 0 && (
                  <div className="text-center mt-1.5 text-xs font-semibold" style={{ color: ketonZone(parseFloat(fWert)).farbe }}>
                    {ketonZone(parseFloat(fWert)).emoji} {ketonZone(parseFloat(fWert)).label}
                  </div>
                )}
              </div>

              {/* Blutzucker optional */}
              <div className="mb-3">
                <div className="text-xs mb-1.5" style={{ color: "#666" }}>Blutzucker (mmol/L) <span style={{ color: "#444" }}>— optional, für GKI</span></div>
                <input value={fGlukose} onChange={e => setFGlukose(e.target.value)} type="number" step="0.1"
                  placeholder="z.B. 4.8"
                  className="w-full px-4 py-3 rounded-xl outline-none text-white"
                  style={{ backgroundColor: "#2a2a2a" }} />
                {fWert && fGlukose && parseFloat(fWert) > 0 && parseFloat(fGlukose) > 0 && (() => {
                  const g = Math.round(parseFloat(fGlukose) / parseFloat(fWert) * 10) / 10;
                  const gz = gkiZone(g);
                  return (
                    <div className="mt-1.5 text-xs text-center font-semibold" style={{ color: gz.farbe }}>
                      GKI: {g} — {gz.label}
                    </div>
                  );
                })()}
              </div>

              {/* Notiz */}
              <div className="mb-4">
                <div className="text-xs mb-1.5" style={{ color: "#666" }}>Notiz (optional)</div>
                <input value={fNotiz} onChange={e => setFNotiz(e.target.value)}
                  placeholder="z.B. nach 16h Fasten, morgens nüchtern"
                  className="w-full px-4 py-2 rounded-xl outline-none text-white text-sm"
                  style={{ backgroundColor: "#2a2a2a" }} />
              </div>

              <div className="flex gap-2">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm" style={{ backgroundColor: "#2a2a2a", color: "#666" }}>
                  Abbrechen
                </button>
                <button onClick={speichern} disabled={!fWert || parseFloat(fWert) <= 0}
                  className="flex-1 py-2.5 rounded-xl font-bold text-black text-sm disabled:opacity-30"
                  style={{ backgroundColor: "#22c55e" }}>
                  Speichern
                </button>
              </div>
            </div>
          )}

          {/* Messliste */}
          {messungen.length > 0 && (
            <div className="space-y-2">
              {[...messungen].reverse().map(m => {
                const z = ketonZone(m.wert);
                const mGKI = m.glukose ? Math.round(m.glukose / m.wert * 10) / 10 : null;
                return (
                  <div key={m.id} className="rounded-xl px-4 py-3" style={{ backgroundColor: "#1a1a1a" }}>
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{z.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold" style={{ color: z.farbe }}>{m.wert} mmol/L</span>
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#2a2a2a", color: "#666" }}>
                            {m.methode === "blut" ? "💉" : m.methode === "atem" ? "💨" : "🔬"}
                          </span>
                          {mGKI && <span className="text-xs" style={{ color: "#555" }}>GKI {mGKI}</span>}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "#555" }}>{m.datum} {m.zeit}{m.notiz ? ` · ${m.notiz}` : ""}</div>
                      </div>
                      <button onClick={() => loeschen(m.id)} style={{ color: "#333" }}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {messungen.length === 0 && (
            <div className="text-center py-8" style={{ color: "#555" }}>
              <div className="text-4xl mb-2">🩸</div>
              <p className="text-sm">Noch keine Keton-Messung eingetragen.</p>
              <p className="text-xs mt-1" style={{ color: "#444" }}>Blut-Ketone: genaueste Methode (FreeStyle, Keto-Mojo)</p>
            </div>
          )}
        </>
      )}

      {/* ─── GKI ─────────────────────────────────────────────────────────────── */}
      {tab === "gki" && (
        <>
          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>WAS IST DER GKI?</div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "#888" }}>
              Der <strong style={{ color: "#fff" }}>Glucose-Keton-Index</strong> (GKI) ist das Verhältnis von Blutzucker zu Ketonen — entwickelt von Dr. Thomas Seyfried. Je niedriger, desto therapeutisch wirksamer.
            </p>
            <div className="font-mono text-center py-3 rounded-xl text-sm" style={{ backgroundColor: "#0a0a0a", color: "#22c55e" }}>
              GKI = Glukose (mmol/L) ÷ Ketone (mmol/L)
            </div>
          </div>

          {/* GKI Zonen-Tabelle */}
          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>GKI-ZONEN</div>
            <div className="space-y-2">
              {[
                { bereich: "< 1", label: "Extrem therapeutisch", farbe: "#3b82f6", fuer: "Krebs-Protokolle, intensive Therapie" },
                { bereich: "1–3", label: "Therapeutisch optimal", farbe: "#22c55e", fuer: "Epilepsie, metabolische Erkrankungen" },
                { bereich: "3–6", label: "Optimale Ketose", farbe: "#22c55e", fuer: "Performance, Fettverbrennung, Klarheit" },
                { bereich: "6–9", label: "Moderate Ketose", farbe: "#f59e0b", fuer: "Gewichtsabnahme, allgemeine Gesundheit" },
                { bereich: "> 9", label: "Schwache Ketose", farbe: "#ef4444", fuer: "Kaum metabolische Vorteile" },
              ].map(z => (
                <div key={z.bereich} className="flex gap-3 items-start py-2 border-b" style={{ borderColor: "#222" }}>
                  <span className="font-mono text-xs w-12 flex-shrink-0" style={{ color: z.farbe }}>{z.bereich}</span>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: z.farbe }}>{z.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#555" }}>{z.fuer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aktueller GKI */}
          {gki !== null && gkiZ && letzteGKI && (
            <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#0d2018", border: `1px solid ${gkiZ.farbe}44` }}>
              <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>DEIN AKTUELLER GKI</div>
              <div className="text-center mb-3">
                <div className="text-5xl font-bold mb-1" style={{ color: gkiZ.farbe }}>{gki}</div>
                <div className="font-semibold" style={{ color: gkiZ.farbe }}>{gkiZ.label}</div>
                <div className="text-xs mt-1" style={{ color: "#666" }}>{gkiZ.beschreibung}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl p-2" style={{ backgroundColor: "#1a1a1a" }}>
                  <div className="text-xs mb-0.5" style={{ color: "#555" }}>Glukose</div>
                  <div className="font-bold" style={{ color: "#f59e0b" }}>{letzteGKI.glukose} mmol/L</div>
                </div>
                <div className="rounded-xl p-2" style={{ backgroundColor: "#1a1a1a" }}>
                  <div className="text-xs mb-0.5" style={{ color: "#555" }}>Ketone</div>
                  <div className="font-bold" style={{ color: ketonZone(letzteGKI.wert).farbe }}>{letzteGKI.wert} mmol/L</div>
                </div>
              </div>
            </div>
          )}

          {gki === null && (
            <div className="text-center py-8 rounded-2xl" style={{ backgroundColor: "#1a1a1a", color: "#555" }}>
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">Noch kein GKI berechenbar.</p>
              <p className="text-xs mt-1" style={{ color: "#444" }}>Trag eine Messung mit Blutzucker-Wert ein.</p>
              <button onClick={() => { setTab("ketone"); setShowForm(true); }}
                className="mt-3 px-4 py-2 rounded-xl text-sm font-bold text-black"
                style={{ backgroundColor: "#22c55e" }}>
                Messung mit Blutzucker eintragen
              </button>
            </div>
          )}

          {/* GKI-Verlauf */}
          {mitGlukose.length >= 2 && (
            <div className="rounded-2xl p-4 mt-4" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>GKI-VERLAUF</div>
              <LineChart
                daten={mitGlukose.slice(-14).map(m => ({ label: `${m.datum}`, wert: Math.round(m.glukose! / m.wert * 10) / 10 }))}
                farbe="#3b82f6"
              />
            </div>
          )}
        </>
      )}

      {/* ─── INSIGHTS ────────────────────────────────────────────────────────── */}
      {tab === "insights" && (
        <>
          {/* Adaptationsgrad */}
          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>METABOLISCHE ADAPTATION</div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: adapt.farbe }}>{adapt.label}</span>
                  <span style={{ color: "#555" }}>Tag {tageDabei}</span>
                </div>
                <div className="rounded-full h-3 overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
                  <div className="h-3 rounded-full transition-all" style={{ width: `${adapt.prozent}%`, backgroundColor: adapt.farbe }} />
                </div>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#888" }}>{adapt.text}</p>
            <div className="mt-3 space-y-1.5">
              {[
                { tage: 3, label: "Ketose-Einstieg", done: tageDabei >= 3 },
                { tage: 7, label: "Keto-adapted", done: tageDabei >= 7 },
                { tage: 21, label: "Fat-adapted", done: tageDabei >= 21 },
                { tage: 42, label: "Metabolisch flexibel", done: tageDabei >= 42 },
              ].map(m => (
                <div key={m.tage} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: m.done ? "#22c55e" : "#2a2a2a" }}>
                    {m.done && <span className="text-[9px] text-black font-bold">✓</span>}
                  </div>
                  <span className="text-xs" style={{ color: m.done ? "#ccc" : "#444" }}>Tag {m.tage}: {m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Autophagie */}
          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>AUTOPHAGIE-FENSTER</div>
            {fastingStunden !== null && autophagieS ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">🔄</div>
                  <div>
                    <div className="font-bold" style={{ color: autophagieS.farbe }}>{autophagieS.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#666" }}>{fastingStunden}h aktiv gefastet</div>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#888" }}>{autophagieS.beschreibung}</p>
              </>
            ) : (
              <div className="text-center py-4" style={{ color: "#555" }}>
                <p className="text-sm">Kein aktiver Fasting-Timer.</p>
                <Link href="/fasten" className="text-xs mt-1 inline-block" style={{ color: "#22c55e" }}>→ Zum Fasting-Timer</Link>
              </div>
            )}
            <div className="mt-3 space-y-1.5">
              {[
                { h: 12, label: "Erste Autophagie", emoji: "🌱" },
                { h: 16, label: "Autophagie aktiv", emoji: "🔄" },
                { h: 24, label: "Tiefe Zellreinigung", emoji: "🧹" },
                { h: 48, label: "Stammzellregeneration", emoji: "⭐" },
              ].map(s => (
                <div key={s.h} className="flex items-center gap-2">
                  <span className="text-sm w-6">{s.emoji}</span>
                  <span className="text-xs w-12 font-mono" style={{ color: "#555" }}>{s.h}h</span>
                  <span className="text-xs" style={{ color: fastingStunden && fastingStunden >= s.h ? "#22c55e" : "#444" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Geräte-Empfehlungen */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>MESS-GERÄTE FÜR PROFIS</div>
            <div className="space-y-3">
              {[
                { emoji: "💉", name: "Keto-Mojo / FreeStyle Optium", typ: "Blut-Keton", genauigkeit: "★★★★★", preis: "~50–80 € + Streifen", text: "Genaueste Methode. Misst β-Hydroxybutyrat direkt im Blut. Gold-Standard." },
                { emoji: "💨", name: "BIOSENSE / Ketonix", typ: "Atem-Keton", genauigkeit: "★★★★☆", preis: "~150–200 € einmalig", text: "Misst Aceton in der Atemluft. Keine Streifen, komfortabel, leicht verzögert." },
                { emoji: "🔬", name: "Ketostix / Urin-Streifen", typ: "Urin-Keton", genauigkeit: "★★☆☆☆", preis: "~15 € / 50 Stück", text: "Einstieg — wenig präzise bei Fat-Adapted. Gut für die ersten 2 Wochen." },
                { emoji: "📊", name: "Continuous Glucose Monitor", typ: "CGM", genauigkeit: "★★★★★", preis: "~60–90 € / Monat", text: "Misst Blutzucker in Echtzeit (Libre, Dexcom). Perfekt für GKI-Tracking." },
              ].map(g => (
                <div key={g.name} className="rounded-xl p-3" style={{ backgroundColor: "#2a2a2a" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{g.emoji}</span>
                    <div>
                      <div className="text-sm font-semibold">{g.name}</div>
                      <div className="text-xs" style={{ color: "#555" }}>{g.typ} · {g.genauigkeit} · {g.preis}</div>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#888" }}>{g.text}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
