"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Reminder = {
  id: string;
  emoji: string;
  titel: string;
  body: string;
  url: string;
  aktiv: boolean;
  zeiten: string[];
};

const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: "wasser",
    emoji: "💧",
    titel: "Wasser trinken!",
    body: "Keto erhöht deinen Wasserbedarf — hast du heute genug getrunken?",
    url: "/",
    aktiv: false,
    zeiten: ["09:00", "13:00", "17:00"],
  },
  {
    id: "gewicht",
    emoji: "⚖️",
    titel: "Gewicht eintragen",
    body: "Kurz nüchtern wiegen und in VitaKeto eintragen — hält den Streaks am Leben!",
    url: "/tracking",
    aktiv: false,
    zeiten: ["07:30"],
  },
  {
    id: "mahlzeit",
    emoji: "🍽",
    titel: "Mahlzeit loggen",
    body: "Vergiss nicht deine letzte Mahlzeit einzutragen.",
    url: "/tracking",
    aktiv: false,
    zeiten: ["12:30", "19:00"],
  },
  {
    id: "fasten",
    emoji: "⏱",
    titel: "Fasten-Erinnerung",
    body: "Dein Fastenfenster beginnt bald — letzte Mahlzeit einplanen.",
    url: "/fasten",
    aktiv: false,
    zeiten: ["20:00"],
  },
  {
    id: "ketone",
    emoji: "⚗️",
    titel: "Ketone messen",
    body: "Zeit für deine tägliche Keton-Messung in der Profi-Zone.",
    url: "/profis",
    aktiv: false,
    zeiten: ["08:00"],
  },
  {
    id: "elektrolyte",
    emoji: "🧂",
    titel: "Elektrolyte nicht vergessen",
    body: "Natrium, Magnesium, Kalium — hast du heute deine Elektrolyte?",
    url: "/keto-flu",
    aktiv: false,
    zeiten: ["10:00"],
  },
];

const STORAGE_KEY = "ketome_reminders";

export default function BenachrichtigungenPage() {
  const [erlaubt, setErlaubt] = useState<NotificationPermission>("default");
  const [swAktiv, setSwAktiv] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>(DEFAULT_REMINDERS);
  const [gespeichert, setGespeichert] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("Notification" in window) setErlaubt(Notification.permission);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => setSwAktiv(true)).catch(() => {});
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setReminders(JSON.parse(saved)); } catch {}
    }
  }, []);

  async function erlaubnis() {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setErlaubt(perm);
    if (perm === "granted" && "serviceWorker" in navigator) {
      await navigator.serviceWorker.register("/sw.js");
      setSwAktiv(true);
    }
  }

  function toggleReminder(id: string) {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, aktiv: !r.aktiv } : r));
  }

  function zeitHinzufuegen(id: string, zeit: string) {
    if (!zeit) return;
    setReminders(prev => prev.map(r =>
      r.id === id && !r.zeiten.includes(zeit)
        ? { ...r, zeiten: [...r.zeiten, zeit].sort() }
        : r
    ));
  }

  function zeitEntfernen(id: string, zeit: string) {
    setReminders(prev => prev.map(r =>
      r.id === id ? { ...r, zeiten: r.zeiten.filter(z => z !== zeit) } : r
    ));
  }

  async function speichern() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));

    // In SW-Cache schreiben für Hintergrund-Checks
    if ("caches" in window) {
      const cache = await caches.open("VitaKeto-reminders-v1");
      await cache.put("/reminders-config", new Response(JSON.stringify(reminders)));
    }

    // SW benachrichtigen
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready.catch(() => null);
      if (reg?.active) {
        reg.active.postMessage({ type: "CHECK_REMINDERS" });
      }
    }

    setGespeichert(true);
    setTimeout(() => setGespeichert(false), 2000);
  }

  async function testNotification(r: Reminder) {
    if (erlaubt !== "granted") return;
    const reg = await navigator.serviceWorker.ready.catch(() => null);
    if (reg) {
      reg.active?.postMessage({ type: "SHOW_NOTIFICATION", titel: r.titel, body: r.body, url: r.url });
    } else {
      new Notification(r.titel, { body: r.body, icon: "/icon-192.png" });
    }
  }

  const aktiveAnzahl = reminders.filter(r => r.aktiv).length;

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      <div className="mb-5">
        <h1 className="text-2xl font-black mb-1">🔔 Erinnerungen</h1>
        <p className="text-sm" style={{ color: "#666" }}>Lass dich zur richtigen Zeit an Wasser, Gewicht & Co. erinnern.</p>
      </div>

      {/* Permission Status */}
      {erlaubt === "default" && (
        <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: "#1a1200", border: "1px solid #78350f" }}>
          <div className="text-sm font-semibold mb-1" style={{ color: "#f59e0b" }}>🔔 Benachrichtigungen erlauben</div>
          <p className="text-xs mb-3" style={{ color: "#888" }}>
            Damit VitaKeto dich erinnern kann, musst du Benachrichtigungen einmal erlauben.
          </p>
          <button onClick={erlaubnis}
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{ backgroundColor: "#f59e0b", color: "#000" }}>
            Benachrichtigungen aktivieren
          </button>
        </div>
      )}

      {erlaubt === "denied" && (
        <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d" }}>
          <div className="text-sm font-semibold mb-1" style={{ color: "#ef4444" }}>❌ Benachrichtigungen blockiert</div>
          <p className="text-xs" style={{ color: "#888" }}>
            Du hast Benachrichtigungen abgelehnt. Bitte in den Browser-Einstellungen manuell erlauben: Einstellungen → Datenschutz → Benachrichtigungen → VitaKeto erlauben.
          </p>
        </div>
      )}

      {erlaubt === "granted" && (
        <div className="rounded-2xl p-3 mb-5 flex items-center gap-3" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
          <span className="text-xl">✅</span>
          <div>
            <div className="text-xs font-semibold" style={{ color: "#22c55e" }}>Benachrichtigungen aktiv</div>
            <div className="text-xs" style={{ color: "#555" }}>{aktiveAnzahl} Erinnerung{aktiveAnzahl !== 1 ? "en" : ""} eingeschaltet</div>
          </div>
        </div>
      )}

      {/* Reminder-Liste */}
      <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>ERINNERUNGEN EINRICHTEN</div>
      <div className="space-y-2 mb-5">
        {reminders.map(r => (
          <div key={r.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
            {/* Header-Zeile */}
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-2xl flex-shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{r.titel}</div>
                <div className="text-xs truncate" style={{ color: "#555" }}>{r.body}</div>
              </div>
              {/* Toggle */}
              <button onClick={() => toggleReminder(r.id)}
                className="flex-shrink-0 w-12 h-6 rounded-full relative transition-all"
                style={{ backgroundColor: r.aktiv ? "#22c55e" : "#2a2a2a" }}
                disabled={erlaubt !== "granted"}>
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                  style={{ left: r.aktiv ? "calc(100% - 22px)" : "2px" }} />
              </button>
            </div>

            {/* Zeiten */}
            {r.aktiv && (
              <div className="px-4 pb-3 border-t" style={{ borderColor: "#2a2a2a" }}>
                <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
                  {r.zeiten.map(z => (
                    <div key={z} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                      style={{ backgroundColor: "#2a2a2a" }}>
                      <span style={{ color: "#22c55e" }}>{z}</span>
                      <button onClick={() => zeitEntfernen(r.id, z)} style={{ color: "#555" }}>×</button>
                    </div>
                  ))}
                  {editId === r.id ? (
                    <input type="time"
                      className="px-2 py-1 rounded-lg text-xs outline-none"
                      style={{ backgroundColor: "#2a2a2a", color: "#fff" }}
                      onChange={e => { zeitHinzufuegen(r.id, e.target.value); setEditId(null); }}
                      onBlur={() => setEditId(null)}
                      autoFocus />
                  ) : (
                    <button onClick={() => setEditId(r.id)}
                      className="px-2 py-1 rounded-lg text-xs"
                      style={{ backgroundColor: "#2a2a2a", color: "#555" }}>
                      + Zeit
                    </button>
                  )}
                </div>
                <button onClick={() => testNotification(r)}
                  className="text-xs" style={{ color: "#555" }}>
                  → Test-Benachrichtigung senden
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Speichern */}
      <button onClick={speichern}
        className="w-full py-4 rounded-2xl font-bold text-base mb-4"
        style={{ backgroundColor: erlaubt === "granted" ? "#22c55e" : "#2a2a2a", color: erlaubt === "granted" ? "#000" : "#555" }}
        disabled={erlaubt !== "granted"}>
        {gespeichert ? "✓ Gespeichert!" : "Einstellungen speichern"}
      </button>

      {/* Info */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>💡 HINWEISE</div>
        <div className="space-y-1.5">
          {[
            "Erinnerungen funktionieren auch wenn VitaKeto im Hintergrund ist",
            "iOS: App muss zum Homescreen hinzugefügt sein (iOS 16.4+)",
            "Zeiten sind individuell anpassbar — + Zeit tippen",
            "Test-Button schickt sofort eine Probe-Benachrichtigung",
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: "#22c55e" }}>✓</span>
              <span className="text-xs" style={{ color: "#888" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


