"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { kiGuthabenPruefen, kiGuthabenAbziehen } from "@/lib/kiGuthaben";

interface Nachricht {
  rolle: "user" | "coach";
  text: string;
}

const BEISPIELFRAGEN = [
  "Wie war mein Keto-Tag gestern?",
  "Warum komme ich nicht in Ketose?",
  "Was soll ich nach dem Sport essen?",
  "Welche Snacks sind keto-geeignet?",
  "Wie war meine letzte Woche?",
];

type NaehrwertEintrag = { id: string; datum: string; name: string; kcal: number; kh: number; eiweiss: number; fett: number; ballaststoffe?: number };

function datumVorTagen(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString("de-DE");
}

function ladeKontext(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const alleEintraege: NaehrwertEintrag[] = JSON.parse(localStorage.getItem("ketome_naehrwerte") || "[]");
  const ziele = JSON.parse(localStorage.getItem("ketome_ziele") || "{}");
  const gewichtVerlauf: { datum: string; wert: number }[] = JSON.parse(localStorage.getItem("ketome_gewicht") || "[]");

  // Heutige Mahlzeiten
  const heute = datumVorTagen(0);
  const heuteEintraege = alleEintraege.filter(e => e.datum === heute);
  const heuteKcal = Math.round(heuteEintraege.reduce((s, e) => s + e.kcal, 0));
  const heuteKh = Math.round(heuteEintraege.reduce((s, e) => s + Math.max(0, e.kh - (e.ballaststoffe || 0)), 0) * 10) / 10;
  const heuteEiweiss = Math.round(heuteEintraege.reduce((s, e) => s + e.eiweiss, 0));
  const heuteFett = Math.round(heuteEintraege.reduce((s, e) => s + e.fett, 0));
  const mahlzeitenListe = heuteEintraege.map(e => `${e.name} (${e.kcal} kcal, ${e.kh}g KH)`).join(", ") || "noch nichts";

  // Letzte 7 Tage Zusammenfassung
  const letzte7Tage: string[] = [];
  for (let i = 1; i <= 7; i++) {
    const datum = datumVorTagen(i);
    const eintraege = alleEintraege.filter(e => e.datum === datum);
    if (eintraege.length > 0) {
      const kcal = Math.round(eintraege.reduce((s, e) => s + e.kcal, 0));
      const kh = Math.round(eintraege.reduce((s, e) => s + Math.max(0, e.kh - (e.ballaststoffe || 0)), 0) * 10) / 10;
      const mahlzeiten = eintraege.map(e => e.name).join(", ");
      letzte7Tage.push(`${datum}: ${kcal} kcal, ${kh}g Netto-KH — ${mahlzeiten}`);
    }
  }

  // Gewichtsverlauf letzte 30 Tage
  const gewichtStr = gewichtVerlauf.slice(-10).map(e => `${e.datum}: ${e.wert} kg`).join(", ") || "keine Einträge";
  const letztesGewicht = gewichtVerlauf[gewichtVerlauf.length - 1]?.wert?.toString() ?? "";

  return {
    gewicht:          letztesGewicht,
    groesse:          localStorage.getItem("ketome_groesse") ?? "",
    ziel:             localStorage.getItem("ketome_ziel") ?? "",
    gewichtsziel:     ziele.gewichtsziel?.toString() ?? localStorage.getItem("ketome_gewichtsziel") ?? "",
    kcalZiel:         ziele.kcal?.toString() ?? "1500",
    khZiel:           ziele.kh?.toString() ?? "20",
    eiweissZiel:      ziele.eiweiss?.toString() ?? "",
    fettZiel:         ziele.fett?.toString() ?? "",
    fastet:           localStorage.getItem("ketome_fastet") ?? "false",
    heuteKcal:        String(heuteKcal),
    heuteKh:          String(heuteKh),
    heuteEiweiss:     String(heuteEiweiss),
    heuteFett:        String(heuteFett),
    mahlzeitenListe,
    letzte7Tage:      letzte7Tage.join("\n") || "keine Einträge",
    gewichtVerlauf:   gewichtStr,
  };
}

const SPEICHER_KEY = "ketome_coach_verlauf";
const MAX_GESPEICHERT = 60;

export default function CoachPage() {
  const [premium] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("ketome_premium") === "true"
  );
  const [guthaben, setGuthaben] = useState(() => kiGuthabenPruefen());
  const [nachrichten, setNachrichten] = useState<Nachricht[]>(() => {
    if (typeof window === "undefined") return [{ rolle: "coach", text: "Hallo! Ich bin dein persönlicher Keto-Coach 🥑 Stell mir deine Frage – ich helfe dir gerne!" }];
    try {
      const gespeichert = localStorage.getItem(SPEICHER_KEY);
      if (gespeichert) {
        const parsed: Nachricht[] = JSON.parse(gespeichert);
        if (parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return [{ rolle: "coach", text: "Hallo! Ich bin dein persönlicher Keto-Coach 🥑 Stell mir deine Frage – ich helfe dir gerne!" }];
  });
  const [eingabe, setEingabe] = useState("");
  const [laedt, setLaedt] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [nachrichten, laedt]);

  // Chat-Verlauf bei jeder Änderung speichern
  useEffect(() => {
    if (nachrichten.length > 1) {
      try {
        const zuSpeichern = nachrichten.slice(-MAX_GESPEICHERT);
        localStorage.setItem(SPEICHER_KEY, JSON.stringify(zuSpeichern));
      } catch { /* ignore */ }
    }
  }, [nachrichten]);

  function chatLeeren() {
    const neu: Nachricht[] = [{ rolle: "coach", text: "Chat geleert. Womit kann ich dir helfen?" }];
    setNachrichten(neu);
    localStorage.removeItem(SPEICHER_KEY);
  }

  async function sendeFrage(frage: string) {
    if (!frage.trim() || laedt) return;
    if (!kiGuthabenAbziehen("coach")) {
      setNachrichten(prev => [...prev, { rolle: "coach", text: "⚠️ Dein KI-Guthaben ist aufgebraucht. Kaufe 100 weitere Anfragen für 2,99€." }]);
      setGuthaben(0);
      return;
    }
    setGuthaben(g => Math.max(0, g - 1));
    const kontext = ladeKontext();
    setNachrichten(prev => [...prev, { rolle: "user", text: frage }]);
    setEingabe("");
    setLaedt(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frage, kontext }),
      });
      const data = await res.json() as { antwort?: string; fehler?: string };
      setNachrichten(prev => [...prev, {
        rolle: "coach",
        text: data.antwort ?? data.fehler ?? "Etwas ist schiefgelaufen.",
      }]);
    } catch {
      setNachrichten(prev => [...prev, { rolle: "coach", text: "Keine Verbindung. Bitte versuche es nochmal." }]);
    } finally {
      setLaedt(false);
    }
  }

  if (!premium) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 pb-28" style={{ backgroundColor: "#080b08" }}>
        <div className="text-5xl mb-4">🤖</div>
        <h1 className="text-2xl font-black mb-2 text-center">KI Keto-Coach</h1>
        <p className="text-center text-sm mb-6" style={{ color: "#888" }}>
          Dein persönlicher KI-Coach ist eine Premium-Funktion. Erhalte individuelle Antworten auf deine Keto-Fragen – rund um die Uhr.
        </p>
        <Link href="/premium"
          className="rounded-2xl px-8 py-4 font-bold text-black text-base"
          style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
          ⭐ Jetzt Premium werden
        </Link>
        <Link href="/" className="mt-4 text-sm" style={{ color: "#555" }}>← Zurück</Link>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen pb-28" style={{ backgroundColor: "#080b08" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 sticky top-0 z-10" style={{ backgroundColor: "#080b08", borderBottom: "1px solid #1a2a1a" }}>
        <Link href="/" className="text-sm" style={{ color: "#555" }}>←</Link>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: "#101410" }}>🤖</div>
        <div className="flex-1">
          <div className="font-bold text-sm">KI Keto-Coach</div>
          <div className="text-xs" style={{ color: "#22c55e" }}>● Online</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={chatLeeren} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "#1a1a1a", color: "#555" }} title="Chat löschen">
            🗑️
          </button>
          <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: guthaben > 10 ? "#0d2018" : "#2a0a0a", color: guthaben > 10 ? "#22c55e" : "#ef4444" }}>
            {guthaben} Anfragen
          </span>
          {guthaben <= 10 && (
            <button onClick={async () => {
              const res = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ typ: "ki_paket" }) });
              const { url } = await res.json();
              if (url) window.location.href = url;
            }} className="text-xs px-2 py-1 rounded-lg font-bold" style={{ backgroundColor: "#22c55e", color: "#000" }}>
              + kaufen
            </button>
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {nachrichten.map((msg, i) => (
          <div key={i} className={`flex ${msg.rolle === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="rounded-2xl px-4 py-3 text-sm max-w-[80%] leading-relaxed"
              style={msg.rolle === "user"
                ? { backgroundColor: "#22c55e", color: "#000", borderBottomRightRadius: 4 }
                : { backgroundColor: "#101410", color: "#e5e5e5", border: "1px solid #1a2a1a", borderBottomLeftRadius: 4 }
              }>
              {msg.text}
            </div>
          </div>
        ))}
        {laedt && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a", borderBottomLeftRadius: 4 }}>
              <span className="animate-pulse" style={{ color: "#555" }}>Coach tippt…</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Vorschläge */}
      {nachrichten.length <= 1 && (
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
          {BEISPIELFRAGEN.map(f => (
            <button key={f} onClick={() => sendeFrage(f)}
              className="rounded-xl px-3 py-2 text-xs whitespace-nowrap flex-shrink-0"
              style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a", color: "#aaa" }}>
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Eingabe */}
      <div className="px-4 py-3 flex gap-2 sticky bottom-20" style={{ backgroundColor: "#080b08", borderTop: "1px solid #1a2a1a" }}>
        <input
          type="text"
          value={eingabe}
          onChange={e => setEingabe(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendeFrage(eingabe)}
          placeholder="Deine Frage an den Coach…"
          className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
          style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a", color: "#e5e5e5" }}
        />
        <button
          onClick={() => sendeFrage(eingabe)}
          disabled={!eingabe.trim() || laedt}
          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-black disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
          ↑
        </button>
      </div>
    </main>
  );
}
