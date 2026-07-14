"use client";
import Link from "next/link";

const KATEGORIEN = [
  {
    label: "🍽️ Essen & Planen",
    items: [
      { href: "/essen",           icon: "🍽️", label: "Mahlzeiten erfassen" },
      { href: "/scanner",         icon: "📷", label: "Barcode scannen" },
      { href: "/wochenplan",      icon: "🗓", label: "Wochenplan" },
      { href: "/rezepte",         icon: "📖", label: "Rezepte" },
      { href: "/einkaufsliste",   icon: "🛒", label: "Einkaufsliste" },
      { href: "/rezept-foto",     icon: "📸", label: "Rezept-Scanner" },
      { href: "/kuehlschrank-scanner", icon: "🧊", label: "Kühlschrank-Scanner" },
      { href: "/exo-rezepte",     icon: "⚡", label: "Exo-Keton Rezepte" },
    ],
  },
  {
    label: "📊 Mein Keto",
    items: [
      { href: "/tracking",        icon: "📊", label: "Tracking & Ziele" },
      { href: "/energie-check",   icon: "⚡", label: "Energie-Check" },
      { href: "/fasten",          icon: "⏱",  label: "Intervallfasten" },
      { href: "/fitness",         icon: "💪", label: "Fitness" },
      { href: "/erfolge",         icon: "🏆", label: "Erfolge & Badges" },
      { href: "/rechner",         icon: "🧮", label: "Keto-Rechner" },
      { href: "/export",          icon: "📤", label: "Daten-Export" },
      { href: "/backup",          icon: "💾", label: "Backup & Restore" },
      { href: "/benachrichtigungen", icon: "🔔", label: "Erinnerungen" },
    ],
  },
  {
    label: "📚 Keto-Wissen",
    items: [
      { href: "/geldbeutel",      icon: "💰", label: "Keto für den schmalen Geldbeutel" },
      { href: "/info",            icon: "📚", label: "Keto-Info" },
      { href: "/frauen",          icon: "👩", label: "Keto & Frauen 40+" },
      { href: "/startplan",       icon: "🗓", label: "7-Tage-Start" },
      { href: "/ampel",           icon: "🟢", label: "Lebensmittel-Ampel" },
      { href: "/keto-flu",        icon: "🤒", label: "Keto-Grippe" },
      { href: "/fehler",          icon: "❌", label: "Keto-Fehler" },
      { href: "/alkohol",         icon: "🍷", label: "Alkohol & Keto" },
      { href: "/restaurant",      icon: "🍽", label: "Restaurant-Guide" },
    ],
  },
  {
    label: "✨ Premium & Mehr",
    items: [
      { href: "/coach",            icon: "🤖", label: "Keto-Coach" },
      { href: "/premium",         icon: "⭐", label: "Premium" },
      { href: "/profis",          icon: "⚗️", label: "Profi-Zone" },
      { href: "/supplemente",     icon: "💊", label: "Supplemente" },
      { href: "/exogene-ketone",  icon: "⚡", label: "Exogene Ketone" },
      { href: "/profil",          icon: "👤", label: "Profil & Sync" },
    ],
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen px-4 py-6 pb-28" style={{ backgroundColor: "#080b08" }}>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-sm" style={{ color: "#555" }}>←</Link>
        <h1 className="text-2xl font-black">🧰 Alle Funktionen</h1>
      </div>

      {/* ── Exogene Ketone Banner ─────────────────────────────────────────── */}
      <Link href="/exogene-ketone" className="rounded-2xl p-4 mb-6 block"
        style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0d0018 100%)", border: "1px solid #7c3aed55" }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed33, #4f1d9622)", border: "1px solid #7c3aed44" }}>⚡</div>
          <div className="flex-1">
            <div className="text-[10px] font-bold tracking-widest mb-0.5" style={{ color: "#a78bfa" }}>DER ANDERE TREIBSTOFF</div>
            <div className="font-black text-base">Exogene Ketone</div>
          </div>
          <span style={{ color: "#7c3aed" }}>›</span>
        </div>
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          Sofort-Energie ohne Eingewöhnung — wann & wie du sie richtig einsetzt.
        </p>
      </Link>

      <div className="space-y-6">
        {KATEGORIEN.map(kat => (
          <div key={kat.label}>
            <div className="text-sm font-semibold mb-3" style={{ color: "#3a5a3a" }}>{kat.label}</div>
            <div className="grid grid-cols-3 gap-2">
              {kat.items.map(item => (
                <Link key={item.href} href={item.href}
                  className="rounded-2xl p-3 flex flex-col items-center gap-2 text-center"
                  style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a" }}>
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-medium leading-tight" style={{ color: "#aaa" }}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Community */}
      <div className="mt-6 rounded-2xl p-4" style={{ backgroundColor: "#101410", border: "1px solid #222" }}>
        <div className="text-sm font-semibold mb-3" style={{ color: "#555" }}>COMMUNITY</div>
        <div className="space-y-2">
          <button onClick={() => window.location.href = "https://telegram.me/vitaketo_carbbye_community"}
            className="flex items-center gap-3 rounded-xl p-3 w-full text-left" style={{ backgroundColor: "#151a15" }}>
            <span className="text-xl">💬</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">VitaKeto Community</div>
              <div className="text-xs" style={{ color: "#555" }}>Telegram · Fragen, Tipps & Austausch</div>
            </div>
            <span style={{ color: "#2aabee" }}>→</span>
          </button>
          <a href="https://www.instagram.com/carbbye_tanja" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: "#151a15" }}>
            <span className="text-xl">📸</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">@carbbye_tanja</div>
              <div className="text-xs" style={{ color: "#555" }}>Instagram · Rezepte & Motivation</div>
            </div>
            <span style={{ color: "#e1306c" }}>→</span>
          </a>
          <a href="https://carbbye.de" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: "#151a15" }}>
            <span className="text-xl">🌐</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">carbbye.de</div>
              <div className="text-xs" style={{ color: "#555" }}>Blog · Guides & mehr</div>
            </div>
            <span style={{ color: "#22c55e" }}>→</span>
          </a>
        </div>
      </div>
    </main>
  );
}
