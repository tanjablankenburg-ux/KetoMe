"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Zutat = { menge: string; name: string };
type RezeptErgebnis = {
  titel: string;
  portionen: number;
  zubereitungszeit: string;
  zutaten: Zutat[];
  zubereitung: string[];
  naehrwerte: { kcal: number; kh: number; eiweiss: number; fett: number };
  ketoGeeignet: boolean;
  ketoHinweis?: string;
  fehler?: string;
};

async function bildVerkleinern(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const maxW = 1200;
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      resolve({ base64: dataUrl.split(",")[1], mediaType: "image/jpeg" });
    };
    img.src = url;
  });
}

export default function RezeptFotoPage() {
  const [status, setStatus]     = useState<"idle" | "loading" | "done" | "error">("idle");
  const [vorschau, setVorschau] = useState<string | null>(null);
  const [ergebnis, setErgebnis] = useState<RezeptErgebnis | null>(null);
  const [fehler, setFehler]     = useState<string | null>(null);
  const [gespeichert, setGespeichert] = useState(false);
  const fileRef   = useRef<HTMLInputElement>(null);
  const kameraRef = useRef<HTMLInputElement>(null);
  const router    = useRouter();

  async function bildAnalysieren(file: File) {
    setStatus("loading");
    setErgebnis(null);
    setFehler(null);
    setGespeichert(false);
    setVorschau(URL.createObjectURL(file));

    try {
      const { base64, mediaType } = await bildVerkleinern(file);
      const res  = await fetch("/api/rezept-foto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      });
      if (!res.ok) {
        setFehler(`Serverfehler (${res.status}) — bitte später nochmal versuchen.`);
        setStatus("error");
        return;
      }
      const data: RezeptErgebnis = await res.json();
      if (data.fehler) {
        setFehler(data.fehler);
        setStatus("error");
      } else {
        setErgebnis(data);
        setStatus("done");
      }
    } catch {
      setFehler("Verbindungsfehler — bitte Internetverbindung prüfen.");
      setStatus("error");
    }
  }

  function fotoWaehlen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) bildAnalysieren(file);
    e.target.value = "";
  }

  function rezeptSpeichern() {
    if (!ergebnis) return;
    const custom = JSON.parse(localStorage.getItem("ketome_custom_rezepte") || "[]");
    const bm     = JSON.parse(localStorage.getItem("ketome_bookmarks") || "[]");
    const id = `foto-${Date.now()}`;
    custom.push({
      id, name: ergebnis.titel, kategorie: "Mittagessen",
      zutaten: ergebnis.zutaten.map(z => `${z.menge} ${z.name}`),
      zubereitung: ergebnis.zubereitung,
      kcal: ergebnis.naehrwerte.kcal, kh: ergebnis.naehrwerte.kh,
      eiweiss: ergebnis.naehrwerte.eiweiss, fett: ergebnis.naehrwerte.fett,
      portionen: ergebnis.portionen, dauer: ergebnis.zubereitungszeit,
      tags: ["Foto-Import"], schwierigkeit: "Mittel" as const,
    });
    bm.push(id);
    localStorage.setItem("ketome_custom_rezepte", JSON.stringify(custom));
    localStorage.setItem("ketome_bookmarks", JSON.stringify(bm));
    setGespeichert(true);
  }

  function insTracking() {
    if (!ergebnis) return;
    const alle = JSON.parse(localStorage.getItem("ketome_naehrwerte") || "[]");
    alle.push({ id: Date.now().toString(), datum: new Date().toLocaleDateString("de-DE"), name: ergebnis.titel, kcal: ergebnis.naehrwerte.kcal, kh: ergebnis.naehrwerte.kh, eiweiss: ergebnis.naehrwerte.eiweiss, fett: ergebnis.naehrwerte.fett });
    localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
    router.push("/tracking");
  }

  const ampel = ergebnis ? (
    ergebnis.naehrwerte.kh <= 5  ? { farbe: "#22c55e", emoji: "✅", text: "Keto-freundlich" } :
    ergebnis.naehrwerte.kh <= 10 ? { farbe: "#f59e0b", emoji: "⚠️", text: "Grenzwertig" } :
    { farbe: "#ef4444", emoji: "❌", text: "Nicht keto-geeignet" }
  ) : null;

  return (
    <main className="px-4 py-6 pb-28">
      <h1 className="text-xl font-bold mb-1">📸 Rezept per Foto</h1>
      <p className="text-sm mb-5" style={{ color: "#666" }}>
        Fotografiere ein Rezept — die KI erkennt Zutaten, Mengen und Nährwerte automatisch
      </p>

      {/* Upload-Bereich — immer sichtbar */}
      {status !== "loading" && (
        <>
          {/* Vorschau */}
          {vorschau && status !== "idle" && (
            <img src={vorschau} alt="Vorschau" className="w-full max-h-64 object-contain rounded-2xl mb-4" />
          )}

          {/* Zwei Buttons */}
          <div className="flex gap-3 mb-2">
            <button onClick={() => kameraRef.current?.click()}
              className="flex-1 py-4 rounded-2xl font-bold text-black flex flex-col items-center gap-1"
              style={{ backgroundColor: "#22c55e" }}>
              <span className="text-2xl">📷</span>
              <span className="text-sm">Foto machen</span>
            </button>
            <button onClick={() => fileRef.current?.click()}
              className="flex-1 py-4 rounded-2xl font-bold flex flex-col items-center gap-1"
              style={{ backgroundColor: "#1a1a1a", color: "#ccc" }}>
              <span className="text-2xl">🖼️</span>
              <span className="text-sm">Galerie / Screenshot</span>
            </button>
          </div>
          <p className="text-xs text-center mb-4" style={{ color: "#444" }}>Kochbuch · Zeitschrift · Screenshot · Ausdruck</p>

          {/* Kamera-Input */}
          <input ref={kameraRef} type="file" accept="image/*" capture="environment"
            className="hidden" onChange={fotoWaehlen} />
          {/* Galerie-Input */}
          <input ref={fileRef} type="file" accept="image/*"
            className="hidden" onChange={fotoWaehlen} />
        </>
      )}

      {/* Laden */}
      {status === "loading" && (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#1a1a1a" }}>
          {vorschau && <img src={vorschau} alt="" className="w-full max-h-48 object-contain rounded-xl mb-4" />}
          <div className="text-4xl mb-3">🤖</div>
          <div className="font-semibold mb-1">KI analysiert das Rezept…</div>
          <p className="text-xs mb-4" style={{ color: "#666" }}>Erkennt Zutaten, Mengen und berechnet Nährwerte</p>
          <div className="flex justify-center gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: "#22c55e", animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Fehler */}
      {status === "error" && (
        <div className="rounded-2xl p-5 text-center mt-2" style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d" }}>
          <div className="text-3xl mb-2">😕</div>
          <p className="font-semibold mb-1" style={{ color: "#ef4444" }}>Analyse fehlgeschlagen</p>
          <p className="text-xs" style={{ color: "#fca5a5" }}>{fehler}</p>
        </div>
      )}

      {/* Ergebnis */}
      {status === "done" && ergebnis && ampel && (
        <div className="space-y-3 mt-2">
          <div className="rounded-2xl p-4 flex items-center gap-3"
            style={{ backgroundColor: ampel.farbe + "18", border: `1px solid ${ampel.farbe}44` }}>
            <span className="text-3xl">{ampel.emoji}</span>
            <div>
              <div className="font-bold" style={{ color: ampel.farbe }}>{ampel.text}</div>
              <div className="text-xs mt-0.5" style={{ color: "#888" }}>{ergebnis.naehrwerte.kh}g KH pro Portion</div>
            </div>
          </div>

          {ergebnis.ketoHinweis && (
            <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1200", border: "1px solid #854d0e" }}>
              <p className="text-xs leading-relaxed" style={{ color: "#fcd34d" }}>💡 {ergebnis.ketoHinweis}</p>
            </div>
          )}

          <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
            <h2 className="font-bold text-base mb-1">{ergebnis.titel}</h2>
            <div className="flex gap-4 text-xs mb-4" style={{ color: "#555" }}>
              <span>👥 {ergebnis.portionen} Portionen</span>
              <span>⏱ {ergebnis.zubereitungszeit}</span>
            </div>
            <div className="text-xs mb-2" style={{ color: "#555" }}>pro Portion ({ergebnis.portionen} Portionen gesamt)</div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: "kcal",   wert: ergebnis.naehrwerte.kcal,          farbe: "#f59e0b" },
                { label: "KH",     wert: `${ergebnis.naehrwerte.kh}g`,      farbe: ampel.farbe },
                { label: "Eiweiß", wert: `${ergebnis.naehrwerte.eiweiss}g`, farbe: "#22c55e" },
                { label: "Fett",   wert: `${ergebnis.naehrwerte.fett}g`,    farbe: "#8b5cf6" },
              ].map(({ label, wert, farbe }) => (
                <div key={label} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#2a2a2a" }}>
                  <div className="text-xs mb-0.5" style={{ color: "#555" }}>{label}</div>
                  <div className="text-sm font-bold" style={{ color: farbe }}>{wert}</div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <div className="text-xs font-semibold mb-2" style={{ color: "#888" }}>ZUTATEN</div>
              <div className="space-y-1">
                {ergebnis.zutaten.map((z, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span style={{ color: "#ccc" }}>{z.name}</span>
                    <span style={{ color: "#22c55e" }}>{z.menge}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: "#888" }}>ZUBEREITUNG</div>
              <ol className="space-y-2">
                {ergebnis.zubereitung.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ backgroundColor: "#22c55e", color: "#000" }}>{i + 1}</span>
                    <span style={{ color: "#ccc" }}>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={rezeptSpeichern} disabled={gespeichert}
              className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
              style={{ backgroundColor: gespeichert ? "#166534" : "#22c55e" }}>
              {gespeichert ? "✓ Gespeichert" : "💾 In Rezepte speichern"}
            </button>
            <button onClick={insTracking}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "#1a1a1a", color: "#888" }}>
              📊 Ins Tracking
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
