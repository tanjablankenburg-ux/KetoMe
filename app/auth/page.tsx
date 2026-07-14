"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Modus = "login" | "register";

function AuthForm() {
  const [modus, setModus]       = useState<Modus>("login");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [passwort, setPasswort] = useState("");
  const [zeigePw, setZeigePw]   = useState(false);
  const [laden, setLaden]       = useState(false);
  const [fehler, setFehler]     = useState<string | null>(null);
  const [erfolg, setErfolg]     = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nachLogin = searchParams.get("nach") || "";

  async function absenden(e: React.FormEvent) {
    e.preventDefault();
    setFehler(null);
    setErfolg(null);
    setLaden(true);

    const endpoint = modus === "register" ? "/api/auth/register" : "/api/auth/login";
    const body = modus === "register"
      ? { name, email, passwort }
      : { email, passwort };

    const res  = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (data.fehler) {
      setFehler(fehlerText(data.fehler));
      setLaden(false);
      return;
    }

    if (data.emailBestaetigung) {
      setErfolg("Konto erstellt! Bitte bestätige deine E-Mail-Adresse und melde dich dann an.");
      setLaden(false);
      return;
    }

    // Admin-Premium automatisch setzen
    const PREMIUM_EMAILS = ["tanja@fanelli.club"];
    if (PREMIUM_EMAILS.includes(email.toLowerCase().trim())) {
      localStorage.setItem("ketome_premium", "true");
      localStorage.setItem("ketome_premium_art", "admin");
      localStorage.setItem("ketome_premium_seit", new Date().toISOString());
    }

    // Sync-Flag löschen damit CloudSync beim nächsten Start frisch lädt
    sessionStorage.removeItem("ketome_sync_done");
    window.location.href = nachLogin ? `/${nachLogin}` : "/";
  }

  function fehlerText(msg: string): string {
    if (msg.includes("Invalid login"))       return "E-Mail oder Passwort falsch.";
    if (msg.includes("Email not confirmed")) return "Bitte zuerst die E-Mail bestätigen.";
    if (msg.includes("already registered"))  return "Diese E-Mail ist bereits registriert.";
    if (msg.includes("Password should"))     return "Passwort muss mindestens 6 Zeichen haben.";
    if (msg.includes("User already registered")) return "Diese E-Mail ist bereits registriert.";
    return msg;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ backgroundColor: "#0a0a0a" }}>

      <div className="text-center mb-8">
        <div className="text-5xl mb-2">🥑</div>
        <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>VitaKeto</div>
        <div className="text-xs mt-1" style={{ color: "#555" }}>by Carbbye</div>
      </div>

      <style>{`
        .auth-input { background-color: #1e1e1e; color: #f0f4f0; border: 1.5px solid #555; border-radius: 12px; width: 100%; padding: 14px 16px; font-size: 16px; outline: none; transition: border-color 0.15s; }
        .auth-input:focus { border-color: #22c55e; }
        .auth-input::placeholder { color: #888; }
        .auth-input:-webkit-autofill,
        .auth-input:-webkit-autofill:focus { -webkit-box-shadow: 0 0 0 1000px #1e1e1e inset !important; -webkit-text-fill-color: #f0f0f0 !important; }
      `}</style>

      <div className="w-full max-w-sm">
        <div className="flex rounded-2xl p-1 mb-6" style={{ backgroundColor: "#1a1a1a" }}>
          {(["login", "register"] as Modus[]).map((m) => (
            <button key={m} onClick={() => { setModus(m); setFehler(null); setErfolg(null); }}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: modus === m ? "#22c55e" : "transparent",
                color: modus === m ? "#000" : "#aaa",
              }}>
              {m === "login" ? "Anmelden" : "Registrieren"}
            </button>
          ))}
        </div>

        <form onSubmit={absenden} className="space-y-3">
          {modus === "register" && (
            <div>
              <label className="text-sm mb-1.5 block font-medium" style={{ color: "#ccc" }}>Dein Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="z.B. Tanja" required
                className="auth-input" />
            </div>
          )}

          <div>
            <label className="text-sm mb-1.5 block font-medium" style={{ color: "#ccc" }}>E-Mail-Adresse</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="deine@email.de" required
              className="auth-input" />
          </div>

          <div>
            <label className="text-sm mb-1.5 block font-medium" style={{ color: "#ccc" }}>Passwort</label>
            <div className="relative">
              <input
                type={zeigePw ? "text" : "password"}
                value={passwort} onChange={e => setPasswort(e.target.value)}
                placeholder="Mindestens 6 Zeichen"
                required minLength={6}
                className="auth-input"
                style={{ paddingRight: "3rem" }}
              />
              <button type="button" onClick={() => setZeigePw(!zeigePw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
                style={{ color: zeigePw ? "#22c55e" : "#999" }}>
                {zeigePw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {modus === "register" && (
            <p className="text-xs text-center" style={{ color: "#999" }}>
              Mit der Registrierung stimmst du unseren{" "}
              <a href="/agb" target="_blank" style={{ color: "#22c55e", textDecoration: "underline" }}>
                AGB & Datenschutzbestimmungen
              </a>{" "}
              zu.
            </p>
          )}

          {fehler && (
            <div className="rounded-xl p-3 text-sm text-center" style={{ backgroundColor: "#1a0a0a", color: "#ef4444" }}>
              {fehler}
            </div>
          )}

          {erfolg && (
            <div className="rounded-xl p-3 text-sm text-center" style={{ backgroundColor: "#0a1a0a", color: "#22c55e" }}>
              {erfolg}
            </div>
          )}

          <button type="submit" disabled={laden}
            className="w-full py-4 rounded-2xl font-bold text-black text-base mt-2"
            style={{ backgroundColor: laden ? "#166534" : "#22c55e" }}>
            {laden ? "…" : modus === "login" ? "Anmelden" : "Konto erstellen"}
          </button>
        </form>

        {modus === "login" && (
          <p className="text-center text-xs mt-4" style={{ color: "#999" }}>
            Noch kein Konto?{" "}
            <button onClick={() => setModus("register")} style={{ color: "#22c55e" }}>
              Jetzt registrieren
            </button>
          </p>
        )}
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm />
    </Suspense>
  );
}

