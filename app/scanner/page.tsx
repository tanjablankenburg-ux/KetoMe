"use client";
import { useEffect, useRef, useState } from "react";

type Produkt = {
  name: string;
  kcal: number;
  kh: number;
  eiweiss: number;
  fett: number;
  menge: string;
};

type Status = "idle" | "scanning" | "laden" | "gefunden" | "nichtgefunden" | "fehler" | "keinKamera";

function ketoAmpel(kh: number) {
  if (kh <= 5)  return { farbe: "#22c55e", emoji: "✅", text: "Keto-freundlich" };
  if (kh <= 10) return { farbe: "#f59e0b", emoji: "⚠️", text: "Mit Maß — grenzwertig" };
  return { farbe: "#ef4444", emoji: "❌", text: "Nicht keto-geeignet" };
}

export default function ScannerPage() {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const rafRef      = useRef<number>(0);
  const detectorRef = useRef<unknown>(null);
  const letzterCode = useRef<string>("");

  const [status, setStatus]   = useState<Status>("idle");
  const [produkt, setProdukt] = useState<Produkt | null>(null);
  const [toast, setToast]     = useState<string | null>(null);
  const [scanLinie, setScanLinie] = useState(0); // 0-100 für Animation

  // Scan-Linie Animation
  useEffect(() => {
    if (status !== "scanning") return;
    let pos = 0;
    let dir = 1;
    const id = setInterval(() => {
      pos += dir * 1.5;
      if (pos >= 100) dir = -1;
      if (pos <= 0)   dir = 1;
      setScanLinie(pos);
    }, 16);
    return () => clearInterval(id);
  }, [status]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function kameraStarten() {
    setStatus("scanning");
    letzterCode.current = "";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // BarcodeDetector initialisieren
      if ("BarcodeDetector" in window) {
        // @ts-expect-error BarcodeDetector nicht in allen TS-Definitionen
        detectorRef.current = new BarcodeDetector({
          formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "qr_code"]
        });
        scanSchleife();
      } else {
        // ZXing Fallback
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const reader = new BrowserMultiFormatReader();
        detectorRef.current = reader;
        scanSchleifeFallback(reader);
      }
    } catch (e) {
      console.error(e);
      setStatus("keinKamera");
    }
  }

  function scanSchleife() {
    if (!videoRef.current || !detectorRef.current) return;
    const video = videoRef.current;
    if (video.readyState < 2) {
      rafRef.current = requestAnimationFrame(scanSchleife);
      return;
    }
    // @ts-expect-error BarcodeDetector
    detectorRef.current.detect(video).then((codes: Array<{rawValue: string}>) => {
      if (codes.length > 0) {
        const code = codes[0].rawValue;
        if (code !== letzterCode.current) {
          letzterCode.current = code;
          produktSuchen(code);
        } else {
          rafRef.current = requestAnimationFrame(scanSchleife);
        }
      } else {
        rafRef.current = requestAnimationFrame(scanSchleife);
      }
    }).catch(() => {
      rafRef.current = requestAnimationFrame(scanSchleife);
    });
  }

  function scanSchleifeFallback(reader: InstanceType<typeof import("@zxing/browser").BrowserMultiFormatReader>) {
    if (!videoRef.current) return;
    reader.decodeFromVideoElement(videoRef.current, (result, err) => {
      if (result && result.getText() !== letzterCode.current) {
        letzterCode.current = result.getText();
        produktSuchen(result.getText());
      }
      void err;
    });
  }

  async function produktSuchen(barcode: string) {
    kameraAnhalten();
    setStatus("laden");
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status !== 1 || !data.product) { setStatus("nichtgefunden"); return; }
      const p = data.product;
      const n = p.nutriments ?? {};
      setProdukt({
        name: p.product_name_de || p.product_name || p.generic_name_de || p.generic_name || "Unbekanntes Produkt",
        menge: p.quantity || "100g",
        kcal: Math.round(n["energy-kcal_100g"] ?? n["energy-kcal"] ?? 0),
        kh:   Math.round((n["carbohydrates_100g"] ?? n["carbohydrates"] ?? 0) * 10) / 10,
        eiweiss: Math.round((n["proteins_100g"] ?? n["proteins"] ?? 0) * 10) / 10,
        fett: Math.round((n["fat_100g"] ?? n["fat"] ?? 0) * 10) / 10,
      });
      setStatus("gefunden");
    } catch {
      setStatus("fehler");
    }
  }

  function kameraAnhalten() {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }

  function nochmalScannen() {
    setProdukt(null);
    letzterCode.current = "";
    kameraStarten();
  }

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
      <p className="text-sm mb-4" style={{ color: "#666" }}>Halte die Kamera auf den Barcode</p>

      {/* Kein Kamera-Zugriff */}
      {status === "keinKamera" && (
        <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d" }}>
          <div className="text-4xl mb-3">📵</div>
          <p className="font-semibold mb-2" style={{ color: "#ef4444" }}>Kein Kamerazugriff</p>
          <p className="text-xs mb-4" style={{ color: "#fca5a5" }}>Bitte erlaube der App den Zugriff auf die Kamera in deinen Browser-Einstellungen.</p>
          <button onClick={kameraStarten} className="px-6 py-3 rounded-xl font-bold text-black text-sm" style={{ backgroundColor: "#22c55e" }}>Nochmal versuchen</button>
        </div>
      )}

      {/* Startscreen */}
      {status === "idle" && (
        <div className="text-center py-10">
          <div className="text-8xl mb-6">📷</div>
          <p className="text-sm mb-8" style={{ color: "#888" }}>Scanne den Barcode eines Lebensmittels und erhalte sofort den Keto-Check</p>
          <button onClick={kameraStarten}
            className="px-10 py-4 rounded-2xl font-bold text-black text-lg"
            style={{ backgroundColor: "#22c55e" }}>
            Scanner starten
          </button>
        </div>
      )}

      {/* Live Kamera + Scan-Animation */}
      {status === "scanning" && (
        <div>
          <div className="relative rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: "#000" }}>
            <video ref={videoRef} playsInline muted
              className="w-full"
              style={{ maxHeight: "65vw", objectFit: "cover", display: "block" }} />
            <canvas ref={canvasRef} className="hidden" />

            {/* Dunkle Ränder */}
            <div className="absolute inset-0" style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)"
            }} />

            {/* Scan-Rahmen */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ width: "65%", aspectRatio: "3/2" }}>
                {/* Ecken */}
                {[
                  { top: 0, left: 0, borderTop: "3px solid #22c55e", borderLeft: "3px solid #22c55e" },
                  { top: 0, right: 0, borderTop: "3px solid #22c55e", borderRight: "3px solid #22c55e" },
                  { bottom: 0, left: 0, borderBottom: "3px solid #22c55e", borderLeft: "3px solid #22c55e" },
                  { bottom: 0, right: 0, borderBottom: "3px solid #22c55e", borderRight: "3px solid #22c55e" },
                ].map((style, i) => (
                  <div key={i} className="absolute w-6 h-6" style={style} />
                ))}
                {/* Scan-Linie */}
                <div className="absolute left-0 right-0" style={{
                  top: `${scanLinie}%`,
                  height: "2px",
                  background: "linear-gradient(to right, transparent, #22c55e, transparent)",
                  boxShadow: "0 0 8px #22c55e",
                  transition: "top 0.016s linear",
                }} />
              </div>
            </div>

            {/* Hinweis */}
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#22c55e" }}>
                Barcode im Rahmen halten
              </span>
            </div>
          </div>

          <button onClick={() => { kameraAnhalten(); setStatus("idle"); }}
            className="w-full py-3 rounded-xl text-sm"
            style={{ backgroundColor: "#1a1a1a", color: "#666" }}>
            Abbrechen
          </button>
        </div>
      )}

      {/* Laden */}
      {status === "laden" && (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-4xl mb-3">🔍</div>
          <div className="font-semibold mb-1">Produkt wird gesucht…</div>
          <p className="text-xs" style={{ color: "#555" }}>Datenbank wird abgefragt</p>
          <div className="flex justify-center gap-1 mt-4">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: "#22c55e", animationDelay: `${i*0.15}s` }} />
            ))}
          </div>
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
          <button onClick={nochmalScannen} className="w-full py-4 rounded-2xl font-bold text-black" style={{ backgroundColor: "#22c55e" }}>
            Nochmal scannen
          </button>
        </div>
      )}

      {/* Fehler */}
      {status === "fehler" && (
        <div className="space-y-3">
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d" }}>
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-sm" style={{ color: "#ef4444" }}>Verbindungsfehler — bitte Internetverbindung prüfen.</p>
          </div>
          <button onClick={nochmalScannen} className="w-full py-4 rounded-2xl font-bold text-black" style={{ backgroundColor: "#22c55e" }}>
            Nochmal versuchen
          </button>
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
              <div className="text-xs mt-0.5" style={{ color: "#888" }}>{produkt.kh}g Kohlenhydrate pro 100g</div>
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="font-semibold mb-0.5">{produkt.name}</div>
            <div className="text-xs mb-4" style={{ color: "#444" }}>pro 100g · {produkt.menge}</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "kcal",   wert: produkt.kcal,          farbe: "#f59e0b" },
                { label: "KH",     wert: `${produkt.kh}g`,      farbe: ampel.farbe },
                { label: "Eiweiß", wert: `${produkt.eiweiss}g`, farbe: "#22c55e" },
                { label: "Fett",   wert: `${produkt.fett}g`,    farbe: "#8b5cf6" },
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
              <div className="font-semibold text-sm mb-1" style={{ color: "#ef4444" }}>❌ Nicht keto-geeignet</div>
              <p className="text-xs" style={{ color: "#fca5a5" }}>Mit {produkt.kh}g KH pro 100g würde dieses Produkt deine Ketose unterbrechen. Dein Tageslimit liegt bei 20g KH gesamt.</p>
            </div>
          )}
          {produkt.kh > 5 && produkt.kh <= 10 && (
            <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1200", border: "1px solid #854d0e" }}>
              <div className="font-semibold text-sm mb-1" style={{ color: "#f59e0b" }}>⚠️ Mit Vorsicht genießen</div>
              <p className="text-xs" style={{ color: "#fcd34d" }}>{produkt.kh}g KH/100g ist grenzwertig. Kleine Menge okay, aber zähle es zu deinen Tageskohlenhydraten.</p>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={insTracking}
              className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
              style={{ backgroundColor: "#22c55e" }}>
              📊 Ins Tracking
            </button>
            <button onClick={nochmalScannen}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "#1a1a1a", color: "#888" }}>
              📷 Nächstes Produkt
            </button>
          </div>
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
