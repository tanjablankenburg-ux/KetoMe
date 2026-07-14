"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { kiGuthabenAbziehen } from "@/lib/kiGuthaben";
import { REZEPTE, type Rezept } from "../rezepte/page";

async function bildVerkleinern(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const maxW = 800;
      const maxH = 800;
      const scale = Math.min(1, maxW / img.width, maxH / img.height);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
      resolve({ base64: dataUrl.split(",")[1], mediaType: "image/jpeg" });
    };
    img.src = url;
  });
}

function matcheRezepte(erkannteZutaten: string[]): { rezept: Rezept; treffer: string[]; score: number }[] {
  const erkannt = erkannteZutaten.map(z => z.toLowerCase());

  return REZEPTE.map(rezept => {
    const rezeptText = rezept.zutaten.join(" ").toLowerCase();
    const treffer = erkannt.filter(z => {
      const woerter = z.split(" ");
      return woerter.some(w => w.length > 2 && rezeptText.includes(w));
    });
    return { rezept, treffer, score: treffer.length };
  })
    .filter(r => r.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

export default function KuehlschrankScannerPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error" | "fehler">("idle");
  const [vorschau, setVorschau] = useState<string | null>(null);
  const [zutaten, setZutaten] = useState<string[]>([]);
  const [vorschlaege, setVorschlaege] = useState<{ rezept: Rezept; treffer: string[]; score: number }[]>([]);
  const [debugMsg, setDebugMsg] = useState("");
  const [hatPremium, setHatPremium] = useState<boolean | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const kameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHatPremium(localStorage.getItem("ketome_premium") === "true");
  }, []);

  if (hatPremium === null) return null;

  if (!hatPremium) {
    return (
      <main className="px-4 py-6 pb-28">
        <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>
        <div className="rounded-2xl p-6 text-center mt-8"
          style={{ background: "linear-gradient(135deg, #1a0d2e, #0d1a2e)", border: "1px solid #8b5cf644" }}>
          <div className="text-5xl mb-4">🧊</div>
          <h1 className="text-xl font-black mb-2" style={{ color: "#a78bfa" }}>Kühlschrank-Scanner</h1>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#aaa" }}>
            Fotografiere deinen Kühlschrank — die KI erkennt deine Zutaten und schlägt passende Keto-Rezepte vor.
          </p>
          <div className="rounded-xl p-3 mb-5 text-left" style={{ backgroundColor: "#ffffff08" }}>
            {["KI erkennt alle Zutaten automatisch", "Passende Rezepte sofort vorgeschlagen", "Kein Suchen mehr — einfach fotografieren"].map((p, i) => (
              <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
                <span className="text-xs" style={{ color: "#a78bfa" }}>✓</span>
                <span className="text-xs" style={{ color: "#ccc" }}>{p}</span>
              </div>
            ))}
          </div>
          <a href="https://carbbye.de/vitaketo"
            className="block rounded-xl py-3 text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff" }}>
            Jetzt Premium werden
          </a>
        </div>
      </main>
    );
  }

  async function bildAnalysieren(file: File) {
    if (!kiGuthabenAbziehen("foto")) {
      setStatus("fehler");
      return;
    }
    setStatus("loading");
    setZutaten([]);
    setVorschlaege([]);
    setVorschau(URL.createObjectURL(file));

    try {
      const { base64, mediaType } = await bildVerkleinern(file);
      const res = await fetch("/api/kuehlschrank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      });
      const data = await res.json();
      if (!res.ok) { setDebugMsg(`API Fehler ${res.status}: ${data.fehler || ""}`); setStatus("error"); return; }
      const z: string[] = data.zutaten || [];
      if (z.includes("KEIN_BILD") || z.length === 0) {
        setDebugMsg(`KI-Antwort: ${JSON.stringify(z)}`);
        setStatus("error");
        return;
      }
      setZutaten(z);
      setVorschlaege(matcheRezepte(z));
      setStatus("done");
    } catch (err) {
      setDebugMsg(`Fehler: ${err instanceof Error ? err.message : String(err)}`);
      setStatus("error");
    }
  }

  function neuScan() {
    setStatus("idle");
    setVorschau(null);
    setZutaten([]);
    setVorschlaege([]);
  }

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      {/* Hero */}
      <div className="rounded-2xl p-5 mb-6"
        style={{ background: "linear-gradient(135deg, #0d1a2e, #0a0a1a)", border: "1px solid #3b82f644" }}>
        <div className="text-4xl mb-2">🧊</div>
        <h1 className="text-2xl font-black mb-1">Kühlschrank-Scanner</h1>
        <p className="text-sm" style={{ color: "#888" }}>
          Foto machen → KI erkennt Zutaten → passende Keto-Rezepte
        </p>
      </div>

      {/* Idle: Upload */}
      {status === "idle" && (
        <div className="space-y-3">
          <input ref={kameraRef} type="file" accept="image/*" capture="environment"
            className="hidden" onChange={e => e.target.files?.[0] && bildAnalysieren(e.target.files[0])} />
          <input ref={fileRef} type="file" accept="image/*"
            className="hidden" onChange={e => e.target.files?.[0] && bildAnalysieren(e.target.files[0])} />

          <button onClick={() => kameraRef.current?.click()}
            className="w-full rounded-2xl py-5 font-bold text-lg flex items-center justify-center gap-3"
            style={{ background: "linear-gradient(135deg, #1e3a5f, #0d1a2e)", border: "1px solid #3b82f644", color: "#60a5fa" }}>
            <span className="text-3xl">📷</span>
            <span>Kühlschrank fotografieren</span>
          </button>

          <button onClick={() => fileRef.current?.click()}
            className="w-full rounded-2xl py-4 text-sm font-medium"
            style={{ backgroundColor: "#1a1a1a", color: "#555" }}>
            Foto aus Galerie wählen
          </button>

          <div className="rounded-2xl p-4 mt-4" style={{ backgroundColor: "#111" }}>
            <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>TIPPS FÜR BESTE ERGEBNISSE</div>
            {[
              "Kühlschrank weit öffnen — gute Beleuchtung",
              "Alles gut sichtbar im Bild",
              "Auch Produkte auf der Ablage",
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2 mb-1">
                <span className="text-xs" style={{ color: "#3b82f6" }}>→</span>
                <span className="text-xs" style={{ color: "#555" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {status === "loading" && (
        <div className="text-center py-12">
          {vorschau && (
            <img src={vorschau} alt="Kühlschrank" className="w-full rounded-2xl mb-6 object-cover" style={{ maxHeight: 240 }} />
          )}
          <div className="text-4xl mb-3 animate-pulse">🔍</div>
          <div className="font-semibold mb-1">Zutaten werden erkannt...</div>
          <div className="text-sm" style={{ color: "#555" }}>KI analysiert deinen Kühlschrank</div>
        </div>
      )}

      {/* Error */}
      {status === "fehler" && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">⚠️</div>
          <div className="font-semibold mb-2">KI-Guthaben aufgebraucht</div>
          <p className="text-sm mb-4" style={{ color: "#555" }}>Kaufe 100 weitere Anfragen für 2,99€.</p>
          <a href="/premium" className="px-6 py-3 rounded-xl font-bold text-black text-sm inline-block" style={{ backgroundColor: "#22c55e" }}>+ KI-Paket kaufen</a>
        </div>
      )}
      {status === "error" && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">😕</div>
          <div className="font-semibold mb-2">Keine Zutaten erkannt</div>
          <p className="text-sm mb-4" style={{ color: "#555" }}>Versuch ein klareres Foto mit besserer Beleuchtung.</p>
          {debugMsg && (
            <div className="rounded-xl p-3 mb-4 text-left text-xs break-all"
              style={{ backgroundColor: "#1a1a1a", color: "#888" }}>
              {debugMsg}
            </div>
          )}
          <button onClick={neuScan}
            className="px-6 py-3 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#1a1a1a", color: "#22c55e" }}>
            Nochmal versuchen
          </button>
        </div>
      )}

      {/* Done */}
      {status === "done" && (
        <div>
          {vorschau && (
            <img src={vorschau} alt="Kühlschrank" className="w-full rounded-2xl mb-4 object-cover" style={{ maxHeight: 200 }} />
          )}

          {/* Erkannte Zutaten */}
          <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold" style={{ color: "#555" }}>ERKANNTE ZUTATEN ({zutaten.length})</div>
              <button onClick={neuScan} className="text-xs" style={{ color: "#22c55e" }}>Neu scannen</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {zutaten.map((z, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e33" }}>
                  {z}
                </span>
              ))}
            </div>
          </div>

          {/* Rezeptvorschläge */}
          <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>
            {vorschlaege.length > 0
              ? `${vorschlaege.length} PASSENDE REZEPTE GEFUNDEN`
              : "KEINE PASSENDEN REZEPTE — MEHR ZUTATEN NÖTIG"}
          </div>

          {vorschlaege.length === 0 && (
            <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-3xl mb-2">🛒</div>
              <p className="text-sm" style={{ color: "#888" }}>
                Mit den erkannten Zutaten wurden keine Rezepte mit mindestens 2 Treffern gefunden.
                Probiere mehr Zutaten zu zeigen oder schau in alle Rezepte.
              </p>
              <Link href="/rezepte" className="block mt-4 text-sm font-semibold" style={{ color: "#22c55e" }}>
                Alle Rezepte ansehen →
              </Link>
            </div>
          )}

          <div className="space-y-3">
            {vorschlaege.map(({ rezept, treffer, score }) => (
              <Link key={rezept.id} href={`/rezepte?id=${rezept.id}`}
                className="block rounded-2xl p-4"
                style={{ backgroundColor: "#1a1a1a" }}>
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{rezept.bild}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-1 leading-tight">{rezept.name}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ backgroundColor: "#22c55e22", color: "#22c55e" }}>
                        {score} Zutaten
                      </span>
                      <span className="text-xs" style={{ color: "#555" }}>{rezept.zeit}</span>
                      <span className="text-xs" style={{ color: "#555" }}>{rezept.kh}g KH</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {treffer.map((t, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: "#0d2018", color: "#86efac" }}>
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {vorschlaege.length > 0 && (
            <Link href="/rezepte"
              className="block text-center mt-5 text-sm font-semibold"
              style={{ color: "#555" }}>
              Alle Rezepte ansehen →
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
