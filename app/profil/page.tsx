"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hatPremium, setHatPremium] = useState(false);
  const [premiumArt, setPremiumArt] = useState("");

  useEffect(() => {
    try {
      const profil = localStorage.getItem("ketome_profil");
      if (profil) {
        const p = JSON.parse(profil);
        setName(p.name || "");
      }
    } catch {}
    // Cookie auslesen
    const tokenCookie = document.cookie.split(";").find(c => c.trim().startsWith("ketome_name="));
    if (tokenCookie) {
      setName(decodeURIComponent(tokenCookie.split("=")[1] || ""));
    }
    const emailCookie = document.cookie.split(";").find(c => c.trim().startsWith("ketome_email="));
    if (emailCookie) {
      setEmail(decodeURIComponent(emailCookie.split("=")[1] || ""));
    }
    setHatPremium(localStorage.getItem("ketome_premium") === "true");
    setPremiumArt(localStorage.getItem("ketome_premium_art") || "");
  }, []);

  async function abmelden() {
    await speichern(); // erst sichern, dann ausloggen
    await fetch("/api/auth/logout", { method: "POST" });
    sessionStorage.removeItem("ketome_sync_done");
    window.location.href = "/auth";
  }

  async function speichern() {
    const daten: Record<string, string> = {};
    for (const key of SYNC_KEYS) {
      const val = localStorage.getItem(key);
      if (val !== null) daten[key] = val;
    }
    await fetch("/api/sync/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(daten),
    }).catch(() => {});
  }

  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "loading" | "ok" | "fehler">("idle");

  const SYNC_KEYS = [
    "ketome_gewicht","ketome_start_gewicht","ketome_start_datum","ketome_profil_name",
    "ketome_ziel_kcal","ketome_ziel_kh","ketome_ziel_eiweiss","ketome_ziel_fett",
    "ketome_naehrwerte","ketome_rezepte","ketome_energie_check","ketome_aufgaben_heute",
    "ketome_onboarding_done","ketome_premium","ketome_foto_count","ketome_keto_streak",
    "ketome_wochenplan","ketome_koerper_daten","ketome_custom_rezepte","ketome_bookmarks",
    "ketome_mein_plan","ketome_ziele","ketome_profil","ketome_masse",
    "ketome_werkstatt2",
    "ketome_ki_guthaben", "ketome_ki_monat",
  ];

  async function manuellSpeichern() {
    setSyncStatus("saving");
    const daten: Record<string, string> = {};
    for (const key of SYNC_KEYS) {
      const val = localStorage.getItem(key);
      if (val !== null) daten[key] = val;
    }
    try {
      const res = await fetch("/api/sync/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(daten),
      });
      setSyncStatus(res.ok ? "ok" : "fehler");
    } catch { setSyncStatus("fehler"); }
    setTimeout(() => setSyncStatus("idle"), 3000);
  }

  async function manuellLaden() {
    setSyncStatus("loading");
    try {
      const res = await fetch("/api/sync/load");
      if (!res.ok) { setSyncStatus("fehler"); return; }
      const { data } = await res.json();
      if (!data || Object.keys(data).length === 0) {
        setSyncStatus("fehler");
        setTimeout(() => setSyncStatus("idle"), 3000);
        return;
      }
      for (const [key, val] of Object.entries(data as Record<string, string>)) {
        if (!SYNC_KEYS.includes(key)) continue;
        if (!val || val === "null" || val === "[]" || val === "{}") continue;
        const lokal = localStorage.getItem(key);
        if (lokal && lokal.startsWith("[")) {
          try {
            const la = JSON.parse(lokal);
            const sa = JSON.parse(val);
            if (Array.isArray(la) && Array.isArray(sa) && sa.length <= la.length) continue;
          } catch {}
        }
        localStorage.setItem(key, val);
      }
      sessionStorage.removeItem("ketome_sync_done");
      setSyncStatus("ok");
      setTimeout(() => window.location.href = "/", 1000);
    } catch { setSyncStatus("fehler"); }
  }

  const premiumLabel: Record<string, string> = {
    admin: "Admin",
    admin_geschenk: "Geschenk",
    early_adopter: "Early Adopter",
  };

  return (
    <main className="min-h-screen px-4 py-6 pb-28" style={{ backgroundColor: "#0a0a0a" }}>
      <Link href="/" className="text-xs mb-6 inline-block" style={{ color: "#555" }}>← Zurück</Link>
      <h1 className="text-2xl font-black mb-6">👤 Profil</h1>

      {/* Avatar + Name */}
      <div className="rounded-2xl p-5 mb-4 flex items-center gap-4" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black"
          style={{ backgroundColor: "#22c55e22", border: "2px solid #22c55e44" }}>
          {name ? name[0].toUpperCase() : "?"}
        </div>
        <div>
          <div className="font-bold text-base">{name || "Kein Name"}</div>
          {email && <div className="text-xs mt-0.5" style={{ color: "#555" }}>{email}</div>}
          <div className="flex items-center gap-2 mt-1">
            {hatPremium ? (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: "#22c55e22", color: "#22c55e" }}>
                ✓ Premium {premiumLabel[premiumArt] ? `(${premiumLabel[premiumArt]})` : ""}
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: "#1a1a1a", color: "#555", border: "1px solid #333" }}>
                Kostenlos
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="space-y-2 mb-6">
        {[
          { href: "/backup", icon: "💾", label: "Backup & Restore", desc: "Daten sichern oder wiederherstellen" },
          { href: "/export", icon: "📤", label: "Daten-Export", desc: "CSV für Excel oder PDF für den Arzt" },
          { href: "/benachrichtigungen", icon: "🔔", label: "Erinnerungen", desc: "Tägliche Keto-Erinnerungen" },
          { href: "/agb", icon: "📄", label: "AGB & Datenschutz", desc: "" },
          { href: "https://telegram.me/vitaketo_carbbye_community", icon: "💬", label: "Community & Feedback", desc: "Ideen, Rezeptwünsche, neue Features" },
        ].map((item, i) => (
          <a key={i} href={item.href}
            className="w-full rounded-2xl p-4 flex items-center gap-3 block"
            style={{ backgroundColor: "#1a1a1a" }}>
            <span className="text-xl">{item.icon}</span>
            <div className="flex-1">
              <div className="font-semibold text-sm">{item.label}</div>
              {item.desc && <div className="text-xs mt-0.5" style={{ color: "#555" }}>{item.desc}</div>}
            </div>
            <span style={{ color: "#333" }}>›</span>
          </a>
        ))}
      </div>

      {/* Premium / Upgrade */}
      {hatPremium ? (
        <button onClick={async () => {
          const res = await fetch("/api/stripe/portal", { method: "POST" });
          const d = await res.json();
          if (d.url) window.location.href = d.url;
        }}
          className="w-full rounded-2xl py-3.5 font-bold text-sm mb-3"
          style={{ backgroundColor: "#0d1a0d", border: "1px solid #22c55e33", color: "#22c55e" }}>
          ⭐ Abo verwalten / kündigen
        </button>
      ) : (
        <a href="/premium"
          className="w-full rounded-2xl py-3.5 font-bold text-sm mb-3 block text-center"
          style={{ backgroundColor: "#22c55e", color: "#000" }}>
          ⭐ Jetzt Premium werden
        </a>
      )}

      {/* Cloud Sync */}
      <div className="flex gap-2 mb-3">
        <button onClick={manuellSpeichern} disabled={syncStatus !== "idle"}
          className="flex-1 rounded-2xl py-3.5 font-bold text-sm"
          style={{ backgroundColor: "#0d1a10", border: "1px solid #22c55e33", color: "#22c55e" }}>
          {syncStatus === "saving" ? "⏳ Speichert…" : syncStatus === "ok" ? "✓ Gespeichert!" : "☁️ Hochladen"}
        </button>
        <button onClick={manuellLaden} disabled={syncStatus !== "idle"}
          className="flex-1 rounded-2xl py-3.5 font-bold text-sm"
          style={{ backgroundColor: "#0d1020", border: "1px solid #3b82f633", color: "#3b82f6" }}>
          {syncStatus === "loading" ? "⏳ Lädt…" : syncStatus === "ok" ? "✓ Geladen!" : "⬇️ Vom Server laden"}
        </button>
      </div>
      {syncStatus === "fehler" && (
        <p className="text-xs text-center mb-3" style={{ color: "#ef4444" }}>
          Fehler — bitte nochmal versuchen oder neu einloggen
        </p>
      )}

      {/* Abmelden */}
      <button onClick={abmelden}
        className="w-full rounded-2xl py-4 font-bold text-sm"
        style={{ backgroundColor: "#1a0a0a", border: "1px solid #ef444433", color: "#ef4444" }}>
        Abmelden
      </button>

      <p className="text-xs text-center mt-6" style={{ color: "#222" }}>VitaKeto by Carbbye</p>
    </main>
  );
}
