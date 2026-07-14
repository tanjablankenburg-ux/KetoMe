"use client";
import { useEffect, useState, useRef } from "react";
import { REZEPTE } from "@/app/rezepte/page";

type Eintrag = { datum: string; wert: number };
type Masse = { datum: string; taille: number; huefte: number; oberschenkel: number };
type NaehrwertEintrag = { id: string; datum: string; name: string; kcal: number; kh: number; eiweiss: number; fett: number; ballaststoffe?: number };

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
  const [tab, setTab] = useState<"gewicht" | "masse" | "naehrwerte" | "ziele">("gewicht");

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
  const [nBallaststoffe, setNBallaststoffe] = useState("");
  const [showNForm, setShowNForm] = useState(false);
  const [anzeigedatum, setAnzeigedatum] = useState(() => new Date().toLocaleDateString("de-DE"));

  // Scanner
  const [showScanner, setShowScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState<"scanning"|"laden"|"gefunden"|"nichtgefunden"|"fehler">("scanning");
  const [scanProdukt, setScanProdukt] = useState<{name:string;kcal:number;kh:number;eiweiss:number;fett:number;ballaststoffe:number}|null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream|null>(null);
  const rafRef = useRef<number>(0);
  const scanAktiv = useRef(false);

  // Rezept-Modal
  const [showRezepte, setShowRezepte] = useState(false);
  const [rezeptSuche, setRezeptSuche] = useState("");

  // Ziele (anpassbar)
  const [zielKcal, setZielKcal] = useState(1500);
  const [zielKh, setZielKh] = useState(20);
  const [zielEiweiss, setZielEiweiss] = useState(100);
  const [zielFett, setZielFett] = useState(120);
  const [gewichtsziel, setGewichtsziel] = useState("");

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
      if (zObj.gewichtsziel) setGewichtsziel(String(zObj.gewichtsziel));
    }
  }, []);

  // ── Scanner-Funktionen ──────────────────────────────────────────────────────
  async function scannerStarten() {
    setScanStatus("scanning");
    setScanProdukt(null);
    scanAktiv.current = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 } } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        rafRef.current = requestAnimationFrame(scanLoop);
      }
    } catch { setShowScanner(false); }
  }

  async function scanLoop() {
    if (!scanAktiv.current) return;
    const video = videoRef.current, canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) { rafRef.current = requestAnimationFrame(scanLoop); return; }
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    let code: string | null = null;
    if ("BarcodeDetector" in window) {
      try {
        // @ts-expect-error BarcodeDetector
        const d = new BarcodeDetector({ formats: ["ean_13","ean_8","upc_a","upc_e","code_128"] });
        const r = await d.detect(canvas);
        if (r.length > 0) code = r[0].rawValue;
      } catch { /* weiter */ }
    }
    if (!code) {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const result = new BrowserMultiFormatReader().decodeFromCanvas(canvas);
        code = result.getText();
      } catch { /* kein Barcode */ }
    }
    if (code) { scannerAnhalten(); await barcodeSuchen(code); }
    else { setTimeout(() => { if (scanAktiv.current) rafRef.current = requestAnimationFrame(scanLoop); }, 150); }
  }

  function scannerAnhalten() {
    scanAktiv.current = false;
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }

  async function barcodeSuchen(code: string) {
    setScanStatus("laden");
    try {
      const res = await fetch(`/api/barcode?code=${encodeURIComponent(code)}`);
      const data = await res.json() as { produkt: { name:string;kcal:number;kh:number;eiweiss:number;fett:number;ballaststoffe?:number } | null };
      if (data.produkt) { setScanProdukt({ ...data.produkt, ballaststoffe: data.produkt.ballaststoffe ?? 0 }); setScanStatus("gefunden"); }
      else setScanStatus("nichtgefunden");
    } catch { setScanStatus("fehler"); }
  }

  function scanProduktHinzufuegen() {
    if (!scanProdukt) return;
    const neu: NaehrwertEintrag = { id: Date.now().toString(), datum: anzeigedatum, name: scanProdukt.name, kcal: scanProdukt.kcal, kh: scanProdukt.kh, eiweiss: scanProdukt.eiweiss, fett: scanProdukt.fett, ballaststoffe: scanProdukt.ballaststoffe };
    const alle = [...naehrwerte, neu];
    setNaehrwerte(alle);
    localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
    setShowScanner(false);
    scannerAnhalten();
  }

  function scannerSchliessen() { scannerAnhalten(); setShowScanner(false); setScanProdukt(null); }

  function rezeptHinzufuegen(r: typeof REZEPTE[0], portionen: number) {
    const neu: NaehrwertEintrag = {
      id: Date.now().toString(),
      datum: anzeigedatum,
      name: r.name + (portionen !== 1 ? ` (${portionen} Port.)` : ""),
      kcal: Math.round(r.kcal * portionen),
      kh: Math.round(r.kh * portionen * 10) / 10,
      eiweiss: Math.round(r.eiweiss * portionen),
      fett: Math.round(r.fett * portionen),
      ballaststoffe: 0,
    };
    const alle = [...naehrwerte, neu];
    setNaehrwerte(alle);
    localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
    setShowRezepte(false);
  }

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
      ballaststoffe: parseFloat(nBallaststoffe) || 0,
    };
    const alle = [...naehrwerte, neu];
    setNaehrwerte(alle);
    localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
    setNName(""); setNKcal(""); setNKh(""); setNEiweiss(""); setNFett(""); setNBallaststoffe("");
    setShowNForm(false);
  }

  function naehrwertLoeschen(id: string) {
    const alle = naehrwerte.filter(n => n.id !== id);
    setNaehrwerte(alle);
    localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
  }

  function zieleSpeichern() {
    const gz = parseFloat(gewichtsziel);
    localStorage.setItem("ketome_ziele", JSON.stringify({
      kcal: zielKcal, kh: zielKh, eiweiss: zielEiweiss, fett: zielFett,
      ...(gz > 0 ? { gewichtsziel: gz } : {}),
    }));
  }

  const heute = new Date().toLocaleDateString("de-DE");

  function datumVerschieben(richtung: number) {
    const [d, m, y] = anzeigedatum.split(".").map(Number);
    const datum = new Date(y, m - 1, d);
    datum.setDate(datum.getDate() + richtung);
    const neu = datum.toLocaleDateString("de-DE");
    if (neu <= heute) setAnzeigedatum(neu);
  }

  function schnellHinzufuegen(eintrag: NaehrwertEintrag) {
    const neu: NaehrwertEintrag = {
      ...eintrag,
      id: Date.now().toString(),
      datum: anzeigedatum,
    };
    const alle = [...naehrwerte, neu];
    setNaehrwerte(alle);
    localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
  }
  const heuteEintraege = naehrwerte.filter(n => n.datum === heute);
  const heuteKcal = heuteEintraege.reduce((s, n) => s + n.kcal, 0);
  const heuteKh = heuteEintraege.reduce((s, n) => s + Math.max(0, n.kh - (n.ballaststoffe || 0)), 0);
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

  // Zuletzt & meist getrackt
  const zuletztGetrackt = [...naehrwerte]
    .reverse()
    .filter((n, i, arr) => arr.findIndex(x => x.name === n.name) === i)
    .slice(0, 6);

  const meistGetrackt = Object.values(
    naehrwerte.reduce((acc, n) => {
      if (!acc[n.name]) acc[n.name] = { ...n, count: 0 };
      acc[n.name].count++;
      return acc;
    }, {} as Record<string, NaehrwertEintrag & { count: number }>)
  ).sort((a, b) => b.count - a.count).slice(0, 6);

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
          { key: "ziele", label: "🎯 Ziele" },
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
      {tab === "naehrwerte" && (() => {
        const tagEintraege = naehrwerte.filter(n => n.datum === anzeigedatum);
        const tagKcal = tagEintraege.reduce((s, n) => s + n.kcal, 0);
        const tagKh = tagEintraege.reduce((s, n) => s + Math.max(0, n.kh - (n.ballaststoffe || 0)), 0);
        const tagEiweiss = tagEintraege.reduce((s, n) => s + n.eiweiss, 0);
        const tagFett = tagEintraege.reduce((s, n) => s + n.fett, 0);
        const istHeute = anzeigedatum === heute;

        return (
          <>
            {/* Tagesnavigation */}
            <div className="flex items-center justify-between mb-4 rounded-2xl px-4 py-3" style={{ backgroundColor: "#1a1a1a" }}>
              <button onClick={() => datumVerschieben(-1)} className="text-xl px-2" style={{ color: "#555" }}>‹</button>
              <div className="text-center">
                <div className="font-bold text-sm" style={{ color: istHeute ? "#22c55e" : "#fff" }}>
                  {istHeute ? "Heute" : anzeigedatum}
                </div>
                {!istHeute && (
                  <button onClick={() => setAnzeigedatum(heute)} className="text-xs" style={{ color: "#555" }}>
                    → Heute
                  </button>
                )}
              </div>
              <button onClick={() => datumVerschieben(1)}
                className="text-xl px-2"
                style={{ color: istHeute ? "#333" : "#555" }}
                disabled={istHeute}>
                ›
              </button>
            </div>

            {/* Tageszusammenfassung */}
            <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold" style={{ color: "#555" }}>TAGESZIEL</div>
                <button onClick={() => setTab("ziele")} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "#2a2a2a", color: "#888" }}>⚙ Ziele</button>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  { label: "kcal", wert: tagKcal, ziel: zielKcal, farbe: "#f59e0b" },
                  { label: "Netto-KH", wert: Math.round(tagKh * 10) / 10, ziel: zielKh, farbe: "#ef4444" },
                  { label: "Eiweiß", wert: tagEiweiss, ziel: zielEiweiss, farbe: "#22c55e" },
                  { label: "Fett", wert: tagFett, ziel: zielFett, farbe: "#8b5cf6" },
                ].map(({ label, wert, ziel, farbe }) => (
                  <div key={label} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#2a2a2a" }}>
                    <div className="text-[10px] mb-0.5" style={{ color: "#555" }}>{label}</div>
                    <div className="text-sm font-bold" style={{ color: wert >= ziel ? "#ef4444" : farbe }}>{wert}</div>
                    <div className="text-[10px]" style={{ color: "#444" }}>/ {ziel}</div>
                  </div>
                ))}
              </div>
              <ProgressBar wert={tagKcal} ziel={zielKcal} farbe="#f59e0b" label="Kalorien" einheit="kcal" />
              <ProgressBar wert={Math.round(tagKh * 10) / 10} ziel={zielKh} farbe="#ef4444" label="Netto-KH" einheit="g" />
            </div>

            {/* Schnellauswahl: Zuletzt getrackt */}
            {zuletztGetrackt.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>🕐 ZULETZT GETRACKT</div>
                <div className="flex flex-wrap gap-2">
                  {zuletztGetrackt.map((e, i) => (
                    <button key={i} onClick={() => schnellHinzufuegen(e)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ccc" }}>
                      + {e.name}
                      <span className="ml-1 text-[10px]" style={{ color: "#555" }}>{e.kcal > 0 ? `${e.kcal}kcal` : ""}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Schnellauswahl: Meist getrackt */}
            {meistGetrackt.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>⭐ MEIST GETRACKT</div>
                <div className="flex flex-wrap gap-2">
                  {meistGetrackt.map((e, i) => (
                    <button key={i} onClick={() => schnellHinzufuegen(e)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: "#1a1a1a", border: "1px solid #22c55e33", color: "#ccc" }}>
                      + {e.name}
                      <span className="ml-1 text-[10px]" style={{ color: "#555" }}>{e.kcal > 0 ? `${e.kcal}kcal` : ""}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hinzufügen-Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button onClick={() => { setShowScanner(true); setTimeout(scannerStarten, 100); }}
                className="py-3 rounded-xl font-bold text-black text-sm flex flex-col items-center gap-1"
                style={{ backgroundColor: "#22c55e" }}>
                <span className="text-lg">📷</span>
                <span className="text-xs">Barcode</span>
              </button>
              <button onClick={() => setShowRezepte(true)}
                className="py-3 rounded-xl font-bold text-sm flex flex-col items-center gap-1"
                style={{ backgroundColor: "#1a2a1a", border: "1px solid #22c55e44", color: "#22c55e" }}>
                <span className="text-lg">🍽️</span>
                <span className="text-xs">Rezept</span>
              </button>
              <button onClick={() => setShowNForm(!showNForm)}
                className="py-3 rounded-xl font-bold text-sm flex flex-col items-center gap-1"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #333", color: "#aaa" }}>
                <span className="text-lg">✏️</span>
                <span className="text-xs">Manuell</span>
              </button>
            </div>

            {showNForm && (
              <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
                <input value={nName} onChange={e => setNName(e.target.value)}
                  placeholder="Name (z.B. Quark, Hühnerbrust...)"
                  className="w-full px-4 py-2 rounded-xl outline-none text-white text-sm mb-3"
                  style={{ backgroundColor: "#2a2a2a" }} />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {[
                    { label: "kcal", val: nKcal, set: setNKcal },
                    { label: "KH gesamt (g)", val: nKh, set: setNKh },
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
                <div className="mb-3">
                  <div className="text-xs mb-1" style={{ color: "#666" }}>Ballaststoffe (g) <span style={{ color: "#444" }}>→ Netto-KH = KH − Ballaststoffe</span></div>
                  <input value={nBallaststoffe} onChange={e => setNBallaststoffe(e.target.value)} type="number"
                    className="w-full px-3 py-2 rounded-xl outline-none text-white text-sm"
                    style={{ backgroundColor: "#2a2a2a" }} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowNForm(false)}
                    className="flex-1 py-2 rounded-xl text-sm"
                    style={{ backgroundColor: "#2a2a2a", color: "#888" }}>
                    Abbrechen
                  </button>
                  <button onClick={() => {
                    if (!nKcal && !nKh) return;
                    const neu: NaehrwertEintrag = {
                      id: Date.now().toString(),
                      datum: anzeigedatum,
                      name: nName || "Mahlzeit",
                      kcal: parseInt(nKcal) || 0,
                      kh: parseFloat(nKh) || 0,
                      eiweiss: parseInt(nEiweiss) || 0,
                      fett: parseInt(nFett) || 0,
                      ballaststoffe: parseFloat(nBallaststoffe) || 0,
                    };
                    const alle = [...naehrwerte, neu];
                    setNaehrwerte(alle);
                    localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
                    setNName(""); setNKcal(""); setNKh(""); setNEiweiss(""); setNFett(""); setNBallaststoffe("");
                    setShowNForm(false);
                  }}
                    className="flex-1 py-2 rounded-xl font-bold text-black text-sm"
                    style={{ backgroundColor: "#22c55e" }}>
                    Hinzufügen
                  </button>
                </div>
              </div>
            )}

            {/* Einträge des gewählten Tages */}
            {tagEintraege.length > 0 ? (
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="px-4 py-2" style={{ backgroundColor: "#222" }}>
                  <span className="text-xs font-semibold" style={{ color: "#555" }}>
                    {tagEintraege.length} Einträge
                  </span>
                </div>
                {tagEintraege.map(e => (
                  <div key={e.id} className="px-4 py-3 flex items-center gap-3 border-t" style={{ borderColor: "#2a2a2a" }}>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{e.name}</div>
                      <div className="flex gap-2 text-xs mt-0.5" style={{ color: "#555" }}>
                        {e.kcal > 0 && <span>{e.kcal} kcal</span>}
                        {e.kh > 0 && <span>{Math.max(0, Math.round((e.kh - (e.ballaststoffe || 0)) * 10) / 10)}g Netto-KH</span>}
                        {e.eiweiss > 0 && <span>{e.eiweiss}g Eiw.</span>}
                        {e.fett > 0 && <span>{e.fett}g Fett</span>}
                      </div>
                    </div>
                    <button onClick={() => naehrwertLoeschen(e.id)} style={{ color: "#333" }}>✕</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8" style={{ color: "#555" }}>
                <div className="text-3xl mb-2">🥗</div>
                <p className="text-sm">Noch nichts für {istHeute ? "heute" : anzeigedatum} eingetragen.</p>
              </div>
            )}
          </>
        );
      })()}

      {/* ─── ZIELE ───────────────────────────────────────────────────────────── */}
      {tab === "ziele" && (
        <>
          {/* Heutige Makros vs. Ziele */}
          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
            <div className="text-xs font-semibold mb-4" style={{ color: "#22c55e" }}>📊 Heute ({heute})</div>
            {[
              { label: "Kalorien", wert: heuteKcal, ziel: zielKcal, farbe: "#f59e0b", einheit: "kcal" },
              { label: "Netto-KH", wert: Math.round(heuteKh * 10) / 10, ziel: zielKh, farbe: "#ef4444", einheit: "g" },
              { label: "Eiweiß", wert: heuteEiweiss, ziel: zielEiweiss, farbe: "#22c55e", einheit: "g" },
              { label: "Fett", wert: heuteFett, ziel: zielFett, farbe: "#8b5cf6", einheit: "g" },
            ].map(({ label, wert, ziel, farbe, einheit }) => {
              const pct = ziel > 0 ? Math.min(100, Math.round((wert / ziel) * 100)) : 0;
              const ueberschritten = wert > ziel && ziel > 0;
              return (
                <div key={label} className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "#aaa" }}>{label}</span>
                    <span style={{ color: ueberschritten ? "#ef4444" : "#ccc" }}>
                      {wert} / {ziel} {einheit}
                      {ueberschritten && <span style={{ color: "#ef4444" }}> ⚠</span>}
                    </span>
                  </div>
                  <div className="rounded-full h-3 overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
                    <div className="h-3 rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: ueberschritten ? "#ef4444" : farbe }} />
                  </div>
                  <div className="text-right text-[10px] mt-0.5" style={{ color: "#444" }}>{pct}%</div>
                </div>
              );
            })}
          </div>

          {/* Ziele bearbeiten */}
          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-sm font-semibold mb-4" style={{ color: "#888" }}>⚙️ Tagesziele anpassen</div>
            <div className="space-y-3">
              {[
                { label: "🔥 Kalorien", einheit: "kcal", val: zielKcal, set: setZielKcal },
                { label: "🍞 Netto-KH", einheit: "g", val: zielKh, set: setZielKh },
                { label: "🥩 Eiweiß", einheit: "g", val: zielEiweiss, set: setZielEiweiss },
                { label: "🧈 Fett", einheit: "g", val: zielFett, set: setZielFett },
              ].map(({ label, einheit, val, set }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-sm flex-1" style={{ color: "#ccc" }}>{label}</span>
                  <div className="flex items-center gap-1">
                    <input value={val} onChange={e => set(parseInt(e.target.value) || 0)}
                      type="number"
                      className="w-20 px-3 py-2 rounded-xl outline-none text-white text-sm text-center"
                      style={{ backgroundColor: "#2a2a2a" }} />
                    <span className="text-xs" style={{ color: "#555" }}>{einheit}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid #2a2a2a" }}>
                <span className="text-sm flex-1" style={{ color: "#ccc" }}>⚖️ Gewichtsziel</span>
                <div className="flex items-center gap-1">
                  <input value={gewichtsziel} onChange={e => setGewichtsziel(e.target.value)}
                    type="number" step="0.1" placeholder="z.B. 65"
                    className="w-20 px-3 py-2 rounded-xl outline-none text-white text-sm text-center"
                    style={{ backgroundColor: "#2a2a2a" }} />
                  <span className="text-xs" style={{ color: "#555" }}>kg</span>
                </div>
              </div>
            </div>
            <button onClick={zieleSpeichern}
              className="w-full py-3 rounded-xl font-bold text-black mt-4"
              style={{ backgroundColor: "#22c55e" }}>
              Ziele speichern
            </button>
          </div>

          {/* Keto-Richtwerte als Hilfe */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>💡 KETO-RICHTWERTE</div>
            <div className="space-y-2 text-xs" style={{ color: "#666" }}>
              <div className="flex justify-between">
                <span>Netto-KH (KH − Ballaststoffe)</span>
                <span style={{ color: "#ef4444" }}>&lt; 20–50g / Tag</span>
              </div>
              <div className="flex justify-between">
                <span>Eiweiß</span>
                <span style={{ color: "#22c55e" }}>1,2–1,7g pro kg Körpergewicht</span>
              </div>
              <div className="flex justify-between">
                <span>Fett</span>
                <span style={{ color: "#8b5cf6" }}>60–75% der Kalorien</span>
              </div>
              <div className="flex justify-between">
                <span>Kalorien</span>
                <span style={{ color: "#f59e0b" }}>Defizit: ~300–500 kcal unter Bedarf</span>
              </div>
            </div>
          </div>
        </>
      )}
      {/* ── BARCODE SCANNER MODAL ─────────────────────────────────────────── */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "#080b08" }}>
          <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: "1px solid #1a2a1a" }}>
            <button onClick={scannerSchliessen} style={{ color: "#555" }}>✕</button>
            <span className="font-bold">Barcode scannen</span>
          </div>

          {scanStatus === "scanning" && (
            <div className="flex-1 flex flex-col px-4 py-4">
              <div className="relative rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: "#000", aspectRatio: "4/3" }}>
                <video ref={videoRef} playsInline muted autoPlay className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative" style={{ width: "72%", height: "38%" }}>
                    <div className="absolute top-0 left-0 w-8 h-8" style={{ borderTop: "3px solid #22c55e", borderLeft: "3px solid #22c55e", borderRadius: "4px 0 0 0" }} />
                    <div className="absolute top-0 right-0 w-8 h-8" style={{ borderTop: "3px solid #22c55e", borderRight: "3px solid #22c55e", borderRadius: "0 4px 0 0" }} />
                    <div className="absolute bottom-0 left-0 w-8 h-8" style={{ borderBottom: "3px solid #22c55e", borderLeft: "3px solid #22c55e", borderRadius: "0 0 0 4px" }} />
                    <div className="absolute bottom-0 right-0 w-8 h-8" style={{ borderBottom: "3px solid #22c55e", borderRight: "3px solid #22c55e", borderRadius: "0 0 4px 0" }} />
                  </div>
                </div>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                  <div className="px-4 py-1.5 rounded-full text-xs flex items-center gap-2" style={{ backgroundColor: "rgba(0,0,0,0.65)", color: "#22c55e" }}>
                    <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ backgroundColor: "#22c55e" }} />
                    Suche nach Barcode…
                  </div>
                </div>
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {scanStatus === "laden" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="text-4xl">🔍</div>
              <div className="font-semibold">Produkt wird gesucht…</div>
              <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#22c55e", animationDelay: `${i*0.15}s` }} />)}</div>
            </div>
          )}

          {scanStatus === "gefunden" && scanProdukt && (
            <div className="flex-1 flex flex-col px-4 py-6 gap-4">
              <div className="rounded-2xl p-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
                <div className="font-bold text-lg mb-1">{scanProdukt.name}</div>
                <div className="text-xs mb-4" style={{ color: "#555" }}>pro 100g</div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "kcal", wert: scanProdukt.kcal, farbe: "#f59e0b" },
                    { label: "KH", wert: `${scanProdukt.kh}g`, farbe: "#ef4444" },
                    { label: "Eiweiß", wert: `${scanProdukt.eiweiss}g`, farbe: "#22c55e" },
                    { label: "Fett", wert: `${scanProdukt.fett}g`, farbe: "#8b5cf6" },
                  ].map(({ label, wert, farbe }) => (
                    <div key={label} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#1a1a1a" }}>
                      <div className="text-xs mb-0.5" style={{ color: "#555" }}>{label}</div>
                      <div className="text-sm font-bold" style={{ color: farbe }}>{wert}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={scanProduktHinzufuegen} className="w-full py-4 rounded-2xl font-bold text-black text-base" style={{ backgroundColor: "#22c55e" }}>
                ✓ Zu heute hinzufügen
              </button>
              <button onClick={() => { setScanProdukt(null); scannerStarten(); }} className="w-full py-3 rounded-xl text-sm" style={{ backgroundColor: "#1a1a1a", color: "#888" }}>
                Nochmal scannen
              </button>
            </div>
          )}

          {(scanStatus === "nichtgefunden" || scanStatus === "fehler") && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
              <div className="text-5xl">{scanStatus === "fehler" ? "⚠️" : "🤷"}</div>
              <div className="font-semibold text-center">{scanStatus === "fehler" ? "Verbindungsfehler" : "Produkt nicht gefunden"}</div>
              <button onClick={() => scannerStarten()} className="w-full py-4 rounded-2xl font-bold text-black" style={{ backgroundColor: "#22c55e" }}>Nochmal versuchen</button>
            </div>
          )}
        </div>
      )}

      {/* ── REZEPT-MODAL ──────────────────────────────────────────────────────── */}
      {showRezepte && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "#080b08" }}>
          <div className="flex items-center gap-3 px-4 py-4 sticky top-0 z-10" style={{ backgroundColor: "#080b08", borderBottom: "1px solid #1a2a1a" }}>
            <button onClick={() => setShowRezepte(false)} style={{ color: "#555" }}>✕</button>
            <span className="font-bold flex-1">Rezept auswählen</span>
          </div>
          <div className="px-4 pt-3 pb-2">
            <input
              value={rezeptSuche}
              onChange={e => setRezeptSuche(e.target.value)}
              placeholder="Rezept suchen…"
              className="w-full px-4 py-3 rounded-xl outline-none text-white text-sm"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 pt-2">
            {REZEPTE
              .filter(r => !rezeptSuche || r.name.toLowerCase().includes(rezeptSuche.toLowerCase()) || r.kategorie.toLowerCase().includes(rezeptSuche.toLowerCase()))
              .map(r => (
                <RezeptZeile key={r.id} rezept={r} onAdd={portionen => rezeptHinzufuegen(r, portionen)} />
              ))
            }
          </div>
        </div>
      )}
    </main>
  );
}

function RezeptZeile({ rezept, onAdd }: { rezept: typeof REZEPTE[0]; onAdd: (p: number) => void }) {
  const [portionen, setPortionen] = useState(1);
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{rezept.bild}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{rezept.name}</div>
          <div className="text-xs" style={{ color: "#555" }}>{rezept.kategorie} · {rezept.zeit}</div>
        </div>
      </div>
      <div className="flex gap-2 text-xs mb-3" style={{ color: "#666" }}>
        <span style={{ color: "#f59e0b" }}>{Math.round(rezept.kcal * portionen)} kcal</span>
        <span>·</span>
        <span style={{ color: "#ef4444" }}>{Math.round(rezept.kh * portionen * 10)/10}g KH</span>
        <span>·</span>
        <span style={{ color: "#22c55e" }}>{Math.round(rezept.eiweiss * portionen)}g Eiw.</span>
        <span>·</span>
        <span style={{ color: "#8b5cf6" }}>{Math.round(rezept.fett * portionen)}g Fett</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl px-3 py-1.5" style={{ backgroundColor: "#2a2a2a" }}>
          <button onClick={() => setPortionen(p => Math.max(0.5, p - 0.5))} className="text-lg font-bold w-6 text-center" style={{ color: "#22c55e" }}>−</button>
          <span className="text-sm w-8 text-center font-semibold">{portionen}</span>
          <button onClick={() => setPortionen(p => p + 0.5)} className="text-lg font-bold w-6 text-center" style={{ color: "#22c55e" }}>+</button>
        </div>
        <span className="text-xs flex-shrink-0" style={{ color: "#555" }}>Port.</span>
        <button onClick={() => onAdd(portionen)} className="flex-1 py-2 rounded-xl font-bold text-black text-sm" style={{ backgroundColor: "#22c55e" }}>
          + Hinzufügen
        </button>
      </div>
    </div>
  );
}
