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

type ScanStatus = "idle" | "scanning" | "loading" | "found" | "notfound" | "error";

function ketoAmpel(kh: number): { farbe: string; emoji: string; text: string } {
  if (kh <= 5)  return { farbe: "#22c55e", emoji: "✅", text: "Keto-freundlich" };
  if (kh <= 10) return { farbe: "#f59e0b", emoji: "⚠️", text: "Mit Maß — grenzwertig" };
  return { farbe: "#ef4444", emoji: "❌", text: "Nicht keto-geeignet" };
}

export default function ScannerPage() {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5ScannerRef = useRef<unknown>(null);
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [produkt, setProdukt] = useState<Produkt | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [letzterCode, setLetzterCode] = useState<string | null>(null);

  async function produktLaden(barcode: string) {
    if (barcode === letzterCode) return;
    setLetzterCode(barcode);
    setStatus("loading");
    setProdukt(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status !== 1 || !data.product) {
        setStatus("notfound");
        return;
      }
      const p = data.product;
      const n = p.nutriments ?? {};
      const name =
        p.product_name_de ||
        p.product_name ||
        p.generic_name_de ||
        p.generic_name ||
        "Unbekanntes Produkt";
      const menge = p.quantity || p.serving_size || "100g";
      setProdukt({
        name,
        kcal: Math.round(n["energy-kcal_100g"] ?? n["energy-kcal"] ?? 0),
        kh: Math.round((n["carbohydrates_100g"] ?? n["carbohydrates"] ?? 0) * 10) / 10,
        eiweiss: Math.round((n["proteins_100g"] ?? n["proteins"] ?? 0) * 10) / 10,
        fett: Math.round((n["fat_100g"] ?? n["fat"] ?? 0) * 10) / 10,
        menge,
      });
      setStatus("found");
    } catch {
      setStatus("error");
    }
  }

  function scannerStarten() {
    setStatus("scanning");
    setProdukt(null);
    setFehler(null);
    setLetzterCode(null);

    import("html5-qrcode").then(({ Html5QrcodeScanner }) => {
      if (!scannerRef.current) return;
      // Cleanup falls schon einer läuft
      if (html5ScannerRef.current) {
        (html5ScannerRef.current as { clear: () => Promise<void> }).clear().catch(() => {});
      }
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 150 }, rememberLastUsedCamera: true },
        false
      );
      html5ScannerRef.current = scanner;
      scanner.render(
        (code: string) => {
          produktLaden(code);
        },
        (err: string) => {
          // Scan-Fehler ignorieren — passiert ständig während der Suche
          void err;
        }
      );
    });
  }

  function scannerStoppen() {
    if (html5ScannerRef.current) {
      (html5ScannerRef.current as { clear: () => Promise<void> }).clear().catch(() => {});
      html5ScannerRef.current = null;
    }
    setStatus("idle");
    setLetzterCode(null);
  }

  function nochmalScannen() {
    setStatus("scanning");
    setProdukt(null);
    setLetzterCode(null);
    // Scanner läuft noch — neues Produkt wird automatisch erkannt
  }

  function insTracking() {
    if (!produkt) return;
    const alle = JSON.parse(localStorage.getItem("ketome_naehrwerte") || "[]");
    alle.push({
      id: Date.now().toString(),
      datum: new Date().toLocaleDateString("de-DE"),
      name: produkt.name,
      kcal: produkt.kcal,
      kh: produkt.kh,
      eiweiss: produkt.eiweiss,
      fett: produkt.fett,
    });
    localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
    setToast("✓ Ins Nährwert-Tracking eingetragen!");
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    return () => {
      if (html5ScannerRef.current) {
        (html5ScannerRef.current as { clear: () => Promise<void> }).clear().catch(() => {});
      }
    };
  }, []);

  const ampel = produkt ? ketoAmpel(produkt.kh) : null;

  return (
    <main className="px-4 py-6 pb-28">
      <h1 className="text-xl font-bold mb-1">📷 Barcode Scanner</h1>
      <p className="text-sm mb-5" style={{ color: "#666" }}>
        Produkt scannen → Nährwerte + Keto-Check
      </p>

      {/* Idle */}
      {status === "idle" && (
        <div className="text-center py-10">
          <div className="text-7xl mb-5">📷</div>
          <p className="text-sm mb-6" style={{ color: "#888" }}>
            Halte die Kamera auf den Barcode einer Lebensmittelverpackung
          </p>
          <button onClick={scannerStarten}
            className="px-8 py-4 rounded-2xl font-bold text-black text-base"
            style={{ backgroundColor: "#22c55e" }}>
            Scanner starten
          </button>
        </div>
      )}

      {/* Scanner aktiv */}
      {(status === "scanning" || status === "loading" || status === "found") && (
        <div className="mb-4">
          <div id="qr-reader" ref={scannerRef} className="rounded-2xl overflow-hidden" />
          <button onClick={scannerStoppen}
            className="w-full mt-3 py-2.5 rounded-xl text-sm"
            style={{ backgroundColor: "#1a1a1a", color: "#888" }}>
            Scanner beenden
          </button>
        </div>
      )}

      {/* Laden */}
      {status === "loading" && (
        <div className="rounded-2xl p-6 text-center mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm" style={{ color: "#888" }}>Produkt wird gesucht…</p>
        </div>
      )}

      {/* Nicht gefunden */}
      {status === "notfound" && (
        <div className="rounded-2xl p-6 text-center mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-3xl mb-2">🤷</div>
          <p className="font-semibold mb-1">Produkt nicht gefunden</p>
          <p className="text-sm mb-4" style={{ color: "#666" }}>
            Dieses Produkt ist noch nicht in der Datenbank.
          </p>
          <button onClick={nochmalScannen}
            className="px-6 py-2.5 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: "#22c55e" }}>
            Nochmal scannen
          </button>
        </div>
      )}

      {/* Fehler */}
      {status === "error" && (
        <div className="rounded-2xl p-6 text-center mb-4" style={{ backgroundColor: "#1a1010" }}>
          <div className="text-3xl mb-2">⚠️</div>
          <p className="text-sm mb-4" style={{ color: "#ef4444" }}>Verbindungsfehler — bitte Internetverbindung prüfen.</p>
          <button onClick={nochmalScannen}
            className="px-6 py-2.5 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: "#22c55e" }}>
            Nochmal versuchen
          </button>
        </div>
      )}

      {/* Produkt gefunden */}
      {status === "found" && produkt && ampel && (
        <div className="space-y-3">
          {/* Keto-Ampel */}
          <div className="rounded-2xl p-4 flex items-center gap-3"
            style={{ backgroundColor: ampel.farbe + "18", border: `1px solid ${ampel.farbe}44` }}>
            <span className="text-3xl">{ampel.emoji}</span>
            <div>
              <div className="font-bold" style={{ color: ampel.farbe }}>{ampel.text}</div>
              <div className="text-xs mt-0.5" style={{ color: "#888" }}>{produkt.kh}g KH pro 100g</div>
            </div>
          </div>

          {/* Produktinfo */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="font-semibold mb-0.5">{produkt.name}</div>
            <div className="text-xs mb-4" style={{ color: "#555" }}>pro 100g · Packungsgröße: {produkt.menge}</div>

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

          {/* Nicht keto — Hinweis */}
          {produkt.kh > 10 && (
            <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d" }}>
              <div className="font-semibold text-sm mb-1" style={{ color: "#ef4444" }}>❌ Nicht keto-geeignet</div>
              <p className="text-xs" style={{ color: "#fca5a5" }}>
                Mit {produkt.kh}g Kohlenhydraten pro 100g würde dieses Produkt deine Ketose unterbrechen.
                Dein Tageslimit liegt bei 20g KH gesamt.
              </p>
            </div>
          )}
          {produkt.kh > 5 && produkt.kh <= 10 && (
            <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1200", border: "1px solid #854d0e" }}>
              <div className="font-semibold text-sm mb-1" style={{ color: "#f59e0b" }}>⚠️ Mit Vorsicht genießen</div>
              <p className="text-xs" style={{ color: "#fcd34d" }}>
                {produkt.kh}g KH/100g ist grenzwertig. Kleine Menge okay, aber zähle es zu deinen Tageskohlenhydraten.
              </p>
            </div>
          )}

          {/* Aktionen */}
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
