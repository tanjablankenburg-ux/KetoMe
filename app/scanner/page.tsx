"use client";
import { useRef, useState } from "react";

type Produkt = {
  name: string;
  kcal: number;
  kh: number;
  eiweiss: number;
  fett: number;
  menge: string;
};

type Status = "idle" | "erkennen" | "laden" | "gefunden" | "nichtgefunden" | "fehler";

function ketoAmpel(kh: number) {
  if (kh <= 5)  return { farbe: "#22c55e", emoji: "✅", text: "Keto-freundlich" };
  if (kh <= 10) return { farbe: "#f59e0b", emoji: "⚠️", text: "Mit Maß — grenzwertig" };
  return { farbe: "#ef4444", emoji: "❌", text: "Nicht keto-geeignet" };
}

async function barcodeAusImage(file: File): Promise<string | null> {
  // Versuch 1: BarcodeDetector API (Chrome/Android nativ)
  if ("BarcodeDetector" in window) {
    try {
      // @ts-expect-error BarcodeDetector ist nicht in allen TS-Typen
      const detector = new BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"] });
      const bitmap = await createImageBitmap(file);
      const codes = await detector.detect(bitmap);
      if (codes.length > 0) return codes[0].rawValue;
    } catch { /* fallthrough */ }
  }

  // Versuch 2: ZXing
  try {
    const { BrowserMultiFormatReader } = await import("@zxing/browser");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await new Promise(res => { img.onload = res; });
    const reader = new BrowserMultiFormatReader();
    const result = await reader.decodeFromImageElement(img);
    URL.revokeObjectURL(url);
    return result.getText();
  } catch { /* fallthrough */ }

  return null;
}

async function produktLaden(barcode: string): Promise<Produkt | null> {
  const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
  const data = await res.json();
  if (data.status !== 1 || !data.product) return null;
  const p = data.product;
  const n = p.nutriments ?? {};
  return {
    name: p.product_name_de || p.product_name || p.generic_name_de || p.generic_name || "Unbekanntes Produkt",
    menge: p.quantity || "100g",
    kcal: Math.round(n["energy-kcal_100g"] ?? n["energy-kcal"] ?? 0),
    kh: Math.round((n["carbohydrates_100g"] ?? n["carbohydrates"] ?? 0) * 10) / 10,
    eiweiss: Math.round((n["proteins_100g"] ?? n["proteins"] ?? 0) * 10) / 10,
    fett: Math.round((n["fat_100g"] ?? n["fat"] ?? 0) * 10) / 10,
  };
}

export default function ScannerPage() {
  const [status, setStatus]   = useState<Status>("idle");
  const [vorschau, setVorschau] = useState<string | null>(null);
  const [produkt, setProdukt] = useState<Produkt | null>(null);
  const [fehlerText, setFehlerText] = useState("");
  const [toast, setToast]     = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function fotoVerarbeiten(file: File) {
    setVorschau(URL.createObjectURL(file));
    setStatus("erkennen");
    setProdukt(null);

    const barcode = await barcodeAusImage(file);
    if (!barcode) {
      setFehlerText("Kein Barcode erkannt. Halte die Kamera näher ran und sorge für gute Beleuchtung.");
      setStatus("fehler");
      return;
    }

    setStatus("laden");
    try {
      const p = await produktLaden(barcode);
      if (!p) { setStatus("nichtgefunden"); return; }
      setProdukt(p);
      setStatus("gefunden");
    } catch {
      setFehlerText("Verbindungsfehler — bitte Internetverbindung prüfen.");
      setStatus("fehler");
    }
  }

  function nochmal() {
    setStatus("idle");
    setVorschau(null);
    setProdukt(null);
    fileRef.current?.click();
  }

  function reset() {
    setStatus("idle");
    setVorschau(null);
    setProdukt(null);
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
    showToast("✓ Ins Nährwert-Tracking eingetragen!");
  }

  const ampel = produkt ? ketoAmpel(produkt.kh) : null;

  return (
    <main className="px-4 py-6 pb-28">
      <h1 className="text-xl font-bold mb-1">📷 Barcode Scanner</h1>
      <p className="text-sm mb-5" style={{ color: "#666" }}>
        Foto vom Barcode machen → Nährwerte + Keto-Check
      </p>

      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) fotoVerarbeiten(f); e.target.value = ""; }} />

      {/* Startscreen */}
      {status === "idle" && (
        <div className="text-center py-8">
          <div className="text-8xl mb-6">📷</div>
          <p className="text-sm mb-2" style={{ color: "#888" }}>
            Mach ein Foto vom Barcode auf der Verpackung
          </p>
          <p className="text-xs mb-8" style={{ color: "#444" }}>
            Gute Beleuchtung · Barcode mittig · Nah heran
          </p>
          <button onClick={() => fileRef.current?.click()}
            className="px-10 py-4 rounded-2xl font-bold text-black text-lg"
            style={{ backgroundColor: "#22c55e" }}>
            📸 Foto machen
          </button>
        </div>
      )}

      {/* Vorschau + Ladestand */}
      {(status === "erkennen" || status === "laden" || status === "gefunden" || status === "nichtgefunden" || status === "fehler") && vorschau && (
        <div className="rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <img src={vorschau} alt="Foto" className="w-full max-h-56 object-contain" />
        </div>
      )}

      {status === "erkennen" && (
        <div className="rounded-2xl p-5 text-center mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-3xl mb-2">🔍</div>
          <div className="font-semibold mb-1">Barcode wird erkannt…</div>
          <p className="text-xs" style={{ color: "#555" }}>Analysiere das Foto</p>
        </div>
      )}

      {status === "laden" && (
        <div className="rounded-2xl p-5 text-center mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-3xl mb-2">📡</div>
          <div className="font-semibold mb-1">Produkt wird gesucht…</div>
          <p className="text-xs" style={{ color: "#555" }}>Datenbank wird abgefragt</p>
        </div>
      )}

      {status === "fehler" && (
        <div className="space-y-3">
          <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d" }}>
            <div className="text-3xl mb-2">😕</div>
            <p className="font-semibold mb-2" style={{ color: "#ef4444" }}>Nicht erkannt</p>
            <p className="text-xs mb-4" style={{ color: "#fca5a5" }}>{fehlerText}</p>
          </div>
          <button onClick={nochmal}
            className="w-full py-4 rounded-2xl font-bold text-black"
            style={{ backgroundColor: "#22c55e" }}>
            📸 Nochmal fotografieren
          </button>
          <button onClick={reset} className="w-full py-3 rounded-xl text-sm"
            style={{ backgroundColor: "#1a1a1a", color: "#555" }}>Abbrechen</button>
        </div>
      )}

      {status === "nichtgefunden" && (
        <div className="space-y-3">
          <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-3xl mb-2">🤷</div>
            <p className="font-semibold mb-1">Produkt nicht in der Datenbank</p>
            <p className="text-xs" style={{ color: "#666" }}>
              Dieses Produkt ist noch nicht erfasst. Probiere ein anderes Produkt.
            </p>
          </div>
          <button onClick={nochmal}
            className="w-full py-4 rounded-2xl font-bold text-black"
            style={{ backgroundColor: "#22c55e" }}>
            📸 Anderes Produkt scannen
          </button>
          <button onClick={reset} className="w-full py-3 rounded-xl text-sm"
            style={{ backgroundColor: "#1a1a1a", color: "#555" }}>Zurück</button>
        </div>
      )}

      {status === "gefunden" && produkt && ampel && (
        <div className="space-y-3">
          {/* Keto-Ampel */}
          <div className="rounded-2xl p-4 flex items-center gap-3"
            style={{ backgroundColor: ampel.farbe + "18", border: `1px solid ${ampel.farbe}44` }}>
            <span className="text-3xl">{ampel.emoji}</span>
            <div>
              <div className="font-bold" style={{ color: ampel.farbe }}>{ampel.text}</div>
              <div className="text-xs mt-0.5" style={{ color: "#888" }}>{produkt.kh}g Kohlenhydrate pro 100g</div>
            </div>
          </div>

          {/* Produktinfo */}
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
              <p className="text-xs" style={{ color: "#fca5a5" }}>
                Mit {produkt.kh}g KH pro 100g würde dieses Produkt deine Ketose unterbrechen. Dein Tageslimit liegt bei 20g KH gesamt.
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

          <div className="flex gap-2">
            <button onClick={insTracking}
              className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
              style={{ backgroundColor: "#22c55e" }}>
              📊 Ins Tracking
            </button>
            <button onClick={nochmal}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "#1a1a1a", color: "#888" }}>
              📸 Nächstes Produkt
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
