"use client";
import { useEffect, useRef, useState } from "react";

type Produkt = { name: string; kcal: number; kh: number; eiweiss: number; fett: number; menge: string };
type Status = "idle" | "scanning" | "laden" | "gefunden" | "nichtgefunden" | "fehler" | "keinKamera";

function ketoAmpel(kh: number) {
  if (kh <= 5)  return { farbe: "#22c55e", emoji: "✅", text: "Keto-freundlich" };
  if (kh <= 10) return { farbe: "#f59e0b", emoji: "⚠️", text: "Grenzwertig" };
  return { farbe: "#ef4444", emoji: "❌", text: "Nicht keto-geeignet" };
}

export default function ScannerPage() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef    = useRef<number>(0);
  const aktiv     = useRef(false);

  const [status, setStatus]   = useState<Status>("idle");
  const [produkt, setProdukt] = useState<Produkt | null>(null);
  const [toast, setToast]     = useState<string | null>(null);
  const [liniePos, setLiniePos] = useState(20);
  const [linienDir, setLinienDir] = useState(1);

  // Scan-Linie Animation
  useEffect(() => {
    if (status !== "scanning") return;
    const id = setInterval(() => {
      setLiniePos(p => {
        const next = p + linienDir * 2;
        if (next >= 80) setLinienDir(-1);
        if (next <= 20) setLinienDir(1);
        return next;
      });
    }, 20);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  async function kameraStarten() {
    aktiv.current = true;
    setStatus("scanning");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        rafRef.current = requestAnimationFrame(scanLoop);
      }
    } catch {
      setStatus("keinKamera");
    }
  }

  async function scanLoop() {
    if (!aktiv.current) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    let code: string | null = null;

    // Versuch 1: Native BarcodeDetector (Chrome Android)
    if ("BarcodeDetector" in window) {
      try {
        // @ts-expect-error BarcodeDetector nicht überall in TS definiert
        const d = new BarcodeDetector({ formats: ["ean_13","ean_8","upc_a","upc_e","code_128"] });
        const r = await d.detect(canvas);
        if (r.length > 0) code = r[0].rawValue;
      } catch { /* weiter */ }
    }

    // Versuch 2: ZXing (iOS Safari + andere)
    if (!code) {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const reader = new BrowserMultiFormatReader();
        const result = reader.decodeFromCanvas(canvas);
        code = result.getText();
      } catch { /* kein Barcode */ }
    }

    if (code) {
      kameraAnhalten();
      await produktSuchen(code);
    } else {
      // Kleine Pause damit CPU nicht 100% läuft
      setTimeout(() => { if (aktiv.current) rafRef.current = requestAnimationFrame(scanLoop); }, 150);
    }
  }

  async function produktSuchen(barcode: string) {
    setStatus("laden");
    try {
      const res  = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status !== 1 || !data.product) { setStatus("nichtgefunden"); return; }
      const p = data.product;
      const n = p.nutriments ?? {};
      setProdukt({
        name:    p.product_name_de || p.product_name || p.generic_name_de || p.generic_name || "Unbekanntes Produkt",
        menge:   p.quantity || "100g",
        kcal:    Math.round(n["energy-kcal_100g"] ?? n["energy-kcal"] ?? 0),
        kh:      Math.round((n["carbohydrates_100g"] ?? n["carbohydrates"] ?? 0) * 10) / 10,
        eiweiss: Math.round((n["proteins_100g"]    ?? n["proteins"]    ?? 0) * 10) / 10,
        fett:    Math.round((n["fat_100g"]         ?? n["fat"]         ?? 0) * 10) / 10,
      });
      setStatus("gefunden");
    } catch { setStatus("fehler"); }
  }

  function kameraAnhalten() {
    aktiv.current = false;
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }

  function nochmalScannen() { setProdukt(null); kameraStarten(); }

  function insTracking() {
    if (!produkt) return;
    const alle = JSON.parse(localStorage.getItem("ketome_naehrwerte") || "[]");
    alle.push({ id: Date.now().toString(), datum: new Date().toLocaleDateString("de-DE"), name: produkt.name, kcal: produkt.kcal, kh: produkt.kh, eiweiss: produkt.eiweiss, fett: produkt.fett });
    localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
    showToast("✓ Ins Nährwert-Tracking eingetragen!");
  }

  useEffect(() => () => kameraAnhalten(), []);

  const ampel = produkt ? ketoAmpel(produkt.kh) : null;

  return (
    <main className="px-4 py-6 pb-28">
      <h1 className="text-xl font-bold mb-1">📷 Barcode Scanner</h1>
      <p className="text-sm mb-4" style={{ color: "#666" }}>Barcode im Rahmen halten — wird automatisch erkannt</p>

      {/* Idle */}
      {status === "idle" && (
        <div className="text-center py-10">
          <div className="text-8xl mb-6">📷</div>
          <p className="text-sm mb-8" style={{ color: "#888" }}>Scanne den Barcode eines Lebensmittels für den sofortigen Keto-Check</p>
          <button onClick={kameraStarten}
            className="px-10 py-4 rounded-2xl font-bold text-black text-lg"
            style={{ backgroundColor: "#22c55e" }}>
            Scanner starten
          </button>
        </div>
      )}

      {/* Live Scanner */}
      {status === "scanning" && (
        <div>
          {/* Kamera-View */}
          <div className="relative rounded-2xl overflow-hidden mb-4"
            style={{ backgroundColor: "#000", aspectRatio: "4/3" }}>

            <video ref={videoRef} playsInline muted autoPlay
              className="absolute inset-0 w-full h-full object-cover" />

            {/* Dunkle Ecken */}
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)"
            }} />

            {/* Scan-Rahmen */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative" style={{ width: "72%", height: "38%" }}>
                {/* 4 Ecken */}
                <div className="absolute top-0 left-0 w-8 h-8" style={{ borderTop: "3px solid #22c55e", borderLeft: "3px solid #22c55e", borderRadius: "4px 0 0 0" }} />
                <div className="absolute top-0 right-0 w-8 h-8" style={{ borderTop: "3px solid #22c55e", borderRight: "3px solid #22c55e", borderRadius: "0 4px 0 0" }} />
                <div className="absolute bottom-0 left-0 w-8 h-8" style={{ borderBottom: "3px solid #22c55e", borderLeft: "3px solid #22c55e", borderRadius: "0 0 0 4px" }} />
                <div className="absolute bottom-0 right-0 w-8 h-8" style={{ borderBottom: "3px solid #22c55e", borderRight: "3px solid #22c55e", borderRadius: "0 0 4px 0" }} />

                {/* Animierte Scan-Linie */}
                <div className="absolute left-2 right-2" style={{
                  top: `${liniePos}%`,
                  height: "2px",
                  background: "linear-gradient(to right, transparent, #22c55e 20%, #22c55e 80%, transparent)",
                  boxShadow: "0 0 10px 2px rgba(34,197,94,0.6)",
                }} />
              </div>
            </div>

            {/* Label unten */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
              <div className="px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                style={{ backgroundColor: "rgba(0,0,0,0.65)", color: "#22c55e" }}>
                <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ backgroundColor: "#22c55e" }} />
                Suche nach Barcode…
              </div>
            </div>
          </div>

          {/* Canvas (unsichtbar, für Scan-Logik) */}
          <canvas ref={canvasRef} className="hidden" />

          <button onClick={() => { kameraAnhalten(); setStatus("idle"); }}
            className="w-full py-3 rounded-xl text-sm"
            style={{ backgroundColor: "#1a1a1a", color: "#555" }}>
            Abbrechen
          </button>
        </div>
      )}

      {/* Laden */}
      {status === "laden" && (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-4xl mb-3">🔍</div>
          <div className="font-semibold mb-1">Produkt wird gesucht…</div>
          <div className="flex justify-center gap-1 mt-4">
            {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#22c55e", animationDelay: `${i*0.15}s` }} />)}
          </div>
        </div>
      )}

      {/* Kein Kamerazugriff */}
      {status === "keinKamera" && (
        <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d" }}>
          <div className="text-4xl mb-3">📵</div>
          <p className="font-semibold mb-2" style={{ color: "#ef4444" }}>Kein Kamerazugriff</p>
          <p className="text-xs mb-4" style={{ color: "#fca5a5" }}>Bitte erlaube der App den Kamerazugriff in deinen Browser-Einstellungen.</p>
          <button onClick={kameraStarten} className="px-6 py-3 rounded-xl font-bold text-black text-sm" style={{ backgroundColor: "#22c55e" }}>Nochmal versuchen</button>
        </div>
      )}

      {/* Nicht gefunden */}
      {status === "nichtgefunden" && (
        <div className="space-y-3">
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-4xl mb-3">🤷</div>
            <p className="font-semibold mb-1">Produkt nicht gefunden</p>
            <p className="text-xs" style={{ color: "#555" }}>Dieses Produkt ist noch nicht in der Datenbank.</p>
          </div>
          <button onClick={nochmalScannen} className="w-full py-4 rounded-2xl font-bold text-black" style={{ backgroundColor: "#22c55e" }}>Nochmal scannen</button>
        </div>
      )}

      {/* Fehler */}
      {status === "fehler" && (
        <div className="space-y-3">
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d" }}>
            <div className="text-3xl mb-2">⚠️</div>
            <p className="text-sm" style={{ color: "#ef4444" }}>Verbindungsfehler — bitte Internetverbindung prüfen.</p>
          </div>
          <button onClick={nochmalScannen} className="w-full py-4 rounded-2xl font-bold text-black" style={{ backgroundColor: "#22c55e" }}>Nochmal versuchen</button>
        </div>
      )}

      {/* Ergebnis */}
      {status === "gefunden" && produkt && ampel && (
        <div className="space-y-3">
          <div className="rounded-2xl p-4 flex items-center gap-3"
            style={{ backgroundColor: ampel.farbe + "18", border: `1px solid ${ampel.farbe}44` }}>
            <span className="text-3xl">{ampel.emoji}</span>
            <div>
              <div className="font-bold" style={{ color: ampel.farbe }}>{ampel.text}</div>
              <div className="text-xs mt-0.5" style={{ color: "#888" }}>{produkt.kh}g KH pro 100g</div>
            </div>
          </div>
          <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="font-semibold mb-0.5">{produkt.name}</div>
            <div className="text-xs mb-4" style={{ color: "#444" }}>pro 100g · {produkt.menge}</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "kcal", wert: produkt.kcal, farbe: "#f59e0b" },
                { label: "KH", wert: `${produkt.kh}g`, farbe: ampel.farbe },
                { label: "Eiweiß", wert: `${produkt.eiweiss}g`, farbe: "#22c55e" },
                { label: "Fett", wert: `${produkt.fett}g`, farbe: "#8b5cf6" },
              ].map(({ label, wert, farbe }) => (
                <div key={label} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#2a2a2a" }}>
                  <div className="text-xs mb-0.5" style={{ color: "#555" }}>{label}</div>
                  <div className="text-sm font-bold" style={{ color: farbe }}>{wert}</div>
                </div>
              ))}
            </div>
          </div>
          {produkt.kh > 10 && (
            <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#ef4444" }}>❌ Nicht keto-geeignet</p>
              <p className="text-xs" style={{ color: "#fca5a5" }}>Mit {produkt.kh}g KH pro 100g würde dieses Produkt deine Ketose unterbrechen.</p>
            </div>
          )}
          {produkt.kh > 5 && produkt.kh <= 10 && (
            <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1200", border: "1px solid #854d0e" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#f59e0b" }}>⚠️ Mit Vorsicht genießen</p>
              <p className="text-xs" style={{ color: "#fcd34d" }}>{produkt.kh}g KH/100g ist grenzwertig — zähle es zu deinen Tageskohlenhydraten.</p>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={insTracking} className="flex-1 py-3 rounded-xl font-bold text-black text-sm" style={{ backgroundColor: "#22c55e" }}>📊 Ins Tracking</button>
            <button onClick={nochmalScannen} className="flex-1 py-3 rounded-xl text-sm" style={{ backgroundColor: "#1a1a1a", color: "#888" }}>📷 Nächstes Produkt</button>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 left-4 right-4 z-50 py-3 px-4 rounded-2xl text-center text-sm font-semibold"
          style={{ backgroundColor: "#22c55e", color: "#000" }}>{toast}</div>
      )}
    </main>
  );
}
