"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_PASSWORT = "Tanja-VitaKeto-2026";

export default function AdminPremiumPage() {
  const [status, setStatus] = useState<"idle" | "aktiv" | "deaktiviert">("idle");
  const [hatPremium, setHatPremium] = useState(false);
  const [fotoCount, setFotoCount] = useState(0);
  const router = useRouter();
  const [eingeloggt, setEingeloggt] = useState(false);
  const [pw, setPw] = useState("");
  const [pwFehler, setPwFehler] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("vitaketo_admin") === "1") setEingeloggt(true);
    setHatPremium(localStorage.getItem("ketome_premium") === "true");
    setFotoCount(parseInt(localStorage.getItem("ketome_foto_count") || "0", 10));
  }, []);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORT) {
      sessionStorage.setItem("vitaketo_admin", "1");
      setEingeloggt(true);
    } else {
      setPwFehler(true);
    }
  }

  if (!eingeloggt) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#0a0a0a" }}>
        <form onSubmit={login} className="w-full max-w-xs space-y-4">
          <div className="text-center text-2xl mb-2">🔒</div>
          <input type="password" placeholder="Admin-Passwort" value={pw}
            onChange={e => { setPw(e.target.value); setPwFehler(false); }}
            className="w-full px-4 py-3 rounded-xl outline-none text-white text-sm"
            style={{ backgroundColor: "#1a1a1a", border: `1px solid ${pwFehler ? "#ef4444" : "#2a2a2a"}` }}
            autoFocus />
          {pwFehler && <p className="text-xs text-center" style={{ color: "#ef4444" }}>Falsches Passwort</p>}
          <button type="submit"
            className="w-full py-3 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e44" }}>
            Einloggen
          </button>
        </form>
      </main>
    );
  }

  function premiumAktivieren() {
    localStorage.setItem("ketome_premium", "true");
    localStorage.setItem("ketome_premium_art", "admin_geschenk");
    localStorage.setItem("ketome_premium_seit", new Date().toISOString());
    localStorage.removeItem("ketome_early_banner_weg");
    setHatPremium(true);
    setStatus("aktiv");
    setTimeout(() => router.push("/"), 1000);
  }

  function premiumDeaktivieren() {
    localStorage.removeItem("ketome_premium");
    localStorage.removeItem("ketome_premium_art");
    localStorage.removeItem("ketome_premium_seit");
    setHatPremium(false);
    setStatus("deaktiviert");
  }

  function fotoCountZuruecksetzen() {
    localStorage.setItem("ketome_foto_count", "0");
    setFotoCount(0);
  }

  return (
    <main className="px-4 py-6 pb-28">
      <div className="text-xs mb-6" style={{ color: "#333" }}>Admin · Nur für dich</div>

      <h1 className="text-xl font-black mb-6" style={{ color: "#22c55e" }}>Premium verwalten</h1>

      {/* Status */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>AKTUELLER STATUS</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: hatPremium ? "#22c55e" : "#ef4444" }} />
          <span className="font-semibold text-sm">{hatPremium ? "Premium aktiv" : "Kein Premium"}</span>
        </div>
        <div className="text-xs mt-1" style={{ color: "#555" }}>
          Foto-Rezepte diesen Monat: {fotoCount} / 10
        </div>
      </div>

      {/* Aktionen */}
      <div className="space-y-3">
        {!hatPremium ? (
          <button onClick={premiumAktivieren}
            className="w-full rounded-2xl py-4 text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #0d2018, #0a1020)", border: "1px solid #22c55e44", color: "#22c55e" }}>
            Premium aktivieren
          </button>
        ) : (
          <button onClick={premiumDeaktivieren}
            className="w-full rounded-2xl py-4 text-sm font-bold"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #ef444433", color: "#ef4444" }}>
            Premium deaktivieren
          </button>
        )}

        <button onClick={fotoCountZuruecksetzen}
          className="w-full rounded-2xl py-4 text-sm font-bold"
          style={{ backgroundColor: "#1a1a1a", border: "1px solid #f59e0b33", color: "#f59e0b" }}>
          Foto-Zahler zurucksetzen (auf 0)
        </button>
      </div>

      {status === "aktiv" && (
        <div className="mt-4 rounded-xl p-3 text-center text-sm" style={{ backgroundColor: "#0d2018", color: "#22c55e" }}>
          Premium aktiviert!
        </div>
      )}
      {status === "deaktiviert" && (
        <div className="mt-4 rounded-xl p-3 text-center text-sm" style={{ backgroundColor: "#1a0a0a", color: "#ef4444" }}>
          Premium deaktiviert.
        </div>
      )}

      <p className="text-xs mt-8 text-center" style={{ color: "#222" }}>
        vitaketo.app/admin/premium
      </p>
    </main>
  );
}
