"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LAUNCH_DATUM = new Date("2026-07-12T00:00:00");

function tageVerbleibend() {
  const jetzt = new Date();
  const diff = LAUNCH_DATUM.getTime() - jetzt.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function ComingSoonPage() {
  const [zeigLogin, setZeigLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");
  const [fehler, setFehler] = useState("");
  const [laden, setLaden] = useState(false);
  const router = useRouter();
  const tage = tageVerbleibend();

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLaden(true);
    setFehler("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passwort }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const d = await res.json();
        setFehler(d.fehler || "Anmeldung fehlgeschlagen");
      }
    } catch {
      setFehler("Verbindungsfehler");
    } finally {
      setLaden(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: "#0a0a0a" }}>

      {/* Logo */}
      <div className="text-6xl mb-6">🥑</div>
      <h1 className="text-3xl font-black mb-1 text-center" style={{ color: "#22c55e" }}>VitaKeto</h1>
      <p className="text-sm mb-10 text-center" style={{ color: "#555" }}>by Carbbye</p>

      {/* Countdown */}
      <div className="rounded-2xl p-6 w-full max-w-sm text-center mb-8"
        style={{ background: "linear-gradient(135deg, #0d2018, #0a1020)", border: "1px solid #22c55e33" }}>
        <div className="text-xs font-semibold mb-3 tracking-widest" style={{ color: "#555" }}>LAUNCH IN</div>
        <div className="text-7xl font-black mb-1" style={{ color: "#22c55e" }}>{tage}</div>
        <div className="text-sm font-medium mb-4" style={{ color: "#aaa" }}>
          {tage === 1 ? "Tag" : "Tagen"}
        </div>
        <div className="text-sm font-semibold" style={{ color: "#f5f5f5" }}>12. Juli 2026</div>
        <div className="text-xs mt-1" style={{ color: "#555" }}>Die Keto-App fur Frauen ab 40</div>
      </div>

      {/* Teaser */}
      <div className="w-full max-w-sm space-y-3 mb-10">
        {[
          { emoji: "📊", text: "Keto-Tracking mit Netto-KH" },
          { emoji: "📷", text: "KI-Foto-Rezepte aus jedem Gericht" },
          { emoji: "🗓", text: "7-Tage-Startplan fur den perfekten Einstieg" },
          { emoji: "💜", text: "Speziell fur Frauen 40+ mit Erschopfung" },
        ].map((p, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ backgroundColor: "#1a1a1a" }}>
            <span className="text-xl">{p.emoji}</span>
            <span className="text-sm" style={{ color: "#ccc" }}>{p.text}</span>
          </div>
        ))}
      </div>

      {/* Admin Login */}
      {!zeigLogin ? (
        <button onClick={() => setZeigLogin(true)}
          className="text-xs py-2 px-4 rounded-xl"
          style={{ color: "#333", backgroundColor: "#111" }}>
          Anmelden
        </button>
      ) : (
        <form onSubmit={login} className="w-full max-w-sm space-y-3">
          <input type="email" placeholder="E-Mail" value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: "#1a1a1a", color: "#f5f5f5", border: "1px solid #2a2a2a" }} />
          <input type="password" placeholder="Passwort" value={passwort}
            onChange={e => setPasswort(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: "#1a1a1a", color: "#f5f5f5", border: "1px solid #2a2a2a" }} />
          {fehler && <p className="text-xs text-center" style={{ color: "#ef4444" }}>{fehler}</p>}
          <button type="submit" disabled={laden}
            className="w-full rounded-xl py-3 text-sm font-semibold"
            style={{ backgroundColor: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e44" }}>
            {laden ? "..." : "Anmelden"}
          </button>
        </form>
      )}

      <p className="text-xs mt-8 text-center" style={{ color: "#333" }}>
        carbbye.de/vitaketo
      </p>
    </main>
  );
}
