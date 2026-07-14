"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type BadgeTyp = "keto" | "log" | "gewicht" | "abnahme" | "special";

type Badge = {
  id: string;
  emoji: string;
  titel: string;
  beschreibung: string;
  schwelle: number;
  typ: BadgeTyp;
  einheit: string;
};

const BADGES: Badge[] = [
  // Keto-Streak
  { id: "keto_3",   emoji: "🌱", titel: "Erster Funke",      beschreibung: "3 Tage unter KH-Ziel",              schwelle: 3,   typ: "keto",    einheit: "Tage" },
  { id: "keto_7",   emoji: "🔥", titel: "Eine Woche",        beschreibung: "7 Tage Keto-Streak",                schwelle: 7,   typ: "keto",    einheit: "Tage" },
  { id: "keto_14",  emoji: "⚡", titel: "Zwei Wochen",       beschreibung: "14 Tage in Folge",                  schwelle: 14,  typ: "keto",    einheit: "Tage" },
  { id: "keto_21",  emoji: "🥈", titel: "Keto-Adapted",      beschreibung: "21 Tage — fat-adapted!",            schwelle: 21,  typ: "keto",    einheit: "Tage" },
  { id: "keto_30",  emoji: "🥇", titel: "Ein Monat",         beschreibung: "30 Tage Keto-Streak",               schwelle: 30,  typ: "keto",    einheit: "Tage" },
  { id: "keto_60",  emoji: "💎", titel: "Zwei Monate",       beschreibung: "60 Tage — du bist eine Maschine!",  schwelle: 60,  typ: "keto",    einheit: "Tage" },
  { id: "keto_90",  emoji: "👑", titel: "90-Tage-Champion",  beschreibung: "Drei Monate in Folge",              schwelle: 90,  typ: "keto",    einheit: "Tage" },
  { id: "keto_180", emoji: "🌟", titel: "Halb-Jahr-Legende", beschreibung: "180 Tage Keto-Streak",              schwelle: 180, typ: "keto",    einheit: "Tage" },
  { id: "keto_365", emoji: "🚀", titel: "Keto Forever",      beschreibung: "365 Tage — ein ganzes Jahr!",       schwelle: 365, typ: "keto",    einheit: "Tage" },
  // Log-Streak
  { id: "log_1",    emoji: "✏️", titel: "Erster Eintrag",    beschreibung: "Erste Mahlzeit geloggt",            schwelle: 1,   typ: "log",     einheit: "Tage" },
  { id: "log_7",    emoji: "📝", titel: "Fleißig dabei",     beschreibung: "7 Tage Mahlzeiten geloggt",         schwelle: 7,   typ: "log",     einheit: "Tage" },
  { id: "log_30",   emoji: "📊", titel: "Tracking-Pro",      beschreibung: "30 Tage Mahlzeiten geloggt",        schwelle: 30,  typ: "log",     einheit: "Tage" },
  { id: "log_100",  emoji: "🗓️", titel: "Data-Nerd",         beschreibung: "100 Tage Mahlzeiten geloggt",       schwelle: 100, typ: "log",     einheit: "Tage" },
  // Gewicht-Streak
  { id: "gew_7",    emoji: "⚖️", titel: "Waage-Held",        beschreibung: "7 Tage Gewicht eingetragen",        schwelle: 7,   typ: "gewicht", einheit: "Tage" },
  { id: "gew_30",   emoji: "📉", titel: "Trend-Watcher",     beschreibung: "30 Tage Gewicht getrackt",          schwelle: 30,  typ: "gewicht", einheit: "Tage" },
  { id: "gew_90",   emoji: "🎯", titel: "Gewichts-Profi",    beschreibung: "90 Tage Gewicht getrackt",          schwelle: 90,  typ: "gewicht", einheit: "Tage" },
  // Abnahme-Meilensteine
  { id: "ab_1",     emoji: "👏", titel: "Erster Kilo",       beschreibung: "1 kg abgenommen",                   schwelle: 1,   typ: "abnahme", einheit: "kg" },
  { id: "ab_3",     emoji: "💪", titel: "Drei Kilo",         beschreibung: "3 kg abgenommen",                   schwelle: 3,   typ: "abnahme", einheit: "kg" },
  { id: "ab_5",     emoji: "🎉", titel: "Fünf Kilo",         beschreibung: "5 kg abgenommen",                   schwelle: 5,   typ: "abnahme", einheit: "kg" },
  { id: "ab_10",    emoji: "🏆", titel: "Zehn Kilo",         beschreibung: "10 kg abgenommen",                  schwelle: 10,  typ: "abnahme", einheit: "kg" },
  { id: "ab_15",    emoji: "👑", titel: "15 Kilo",           beschreibung: "15 kg abgenommen",                  schwelle: 15,  typ: "abnahme", einheit: "kg" },
  { id: "ab_20",    emoji: "🌟", titel: "20 Kilo",           beschreibung: "20 kg abgenommen — wow!",           schwelle: 20,  typ: "abnahme", einheit: "kg" },
  // Special
  { id: "sp_startplan", emoji: "🗓", titel: "Startplan-Held", beschreibung: "7-Tage-Startplan gestartet",       schwelle: 1,   typ: "special", einheit: "" },
  { id: "sp_rechner",   emoji: "🧮", titel: "Makro-Kenner",   beschreibung: "Keto-Rechner benutzt",             schwelle: 1,   typ: "special", einheit: "" },
  { id: "sp_scan",      emoji: "📸", titel: "Scanner-Profi",  beschreibung: "Barcode oder Rezept gescannt",     schwelle: 1,   typ: "special", einheit: "" },
  { id: "sp_woche",     emoji: "📅", titel: "Planer",         beschreibung: "Wochenplan erstellt",              schwelle: 1,   typ: "special", einheit: "" },
];

function datumZuISO(datum: string): string {
  const [d, m, y] = datum.split(".").map(Number);
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function berechneStreak(tageSet: Set<string>): { aktuell: number; best: number; gesamt: number } {
  const gesamt = tageSet.size;
  let aktuell = 0;
  const heute = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(heute);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split("T")[0];
    if (tageSet.has(iso)) aktuell++;
    else if (i > 0) break;
  }
  const alle = Array.from(tageSet).sort();
  let best = 0, laufend = 0, vorher: string | null = null;
  for (const tag of alle) {
    if (vorher !== null) {
      const prev = new Date(vorher); prev.setDate(prev.getDate() + 1);
      laufend = prev.toISOString().split("T")[0] === tag ? laufend + 1 : 1;
    } else { laufend = 1; }
    best = Math.max(best, laufend);
    vorher = tag;
  }
  return { aktuell, best, gesamt };
}

const KATEGORIEN: { typ: BadgeTyp; label: string; farbe: string }[] = [
  { typ: "keto",    label: "🔥 Keto-Streak",     farbe: "#ef4444" },
  { typ: "abnahme", label: "📉 Gewichts-Erfolge", farbe: "#22c55e" },
  { typ: "log",     label: "📝 Tracking",         farbe: "#3b82f6" },
  { typ: "gewicht", label: "⚖️ Waage",            farbe: "#8b5cf6" },
  { typ: "special", label: "⭐ Special",          farbe: "#f59e0b" },
];

export default function ErfolgePage() {
  const [ketoStreak,     setKetoStreak]     = useState({ aktuell: 0, best: 0, gesamt: 0 });
  const [logStreak,      setLogStreak]      = useState({ aktuell: 0, best: 0, gesamt: 0 });
  const [gewichtStreak,  setGewichtStreak]  = useState({ aktuell: 0, best: 0, gesamt: 0 });
  const [abnahme,        setAbnahme]        = useState(0);
  const [freigeschaltet, setFreigeschaltet] = useState<Set<string>>(new Set());
  const [aktivFilter,    setAktivFilter]    = useState<BadgeTyp | "alle">("alle");
  const [gesamtStats,    setGesamtStats]    = useState({ mahlzeiten: 0, gewichtEintraege: 0, startGewicht: 0, aktGewicht: 0 });
  const [neuBadge,       setNeuBadge]       = useState<Badge | null>(null);

  useEffect(() => {
    const nRaw = localStorage.getItem("ketome_naehrwerte");
    const gRaw = localStorage.getItem("ketome_gewicht");
    const zRaw = localStorage.getItem("ketome_ziele");
    const spRaw = localStorage.getItem("ketome_startplan_erledigte");
    const rechnerRaw = localStorage.getItem("ketome_rechner_benutzt");
    const scannerRaw = localStorage.getItem("ketome_scanner_benutzt");
    const wochenplanRaw = localStorage.getItem("ketome_wochenplan");

    const naehrwerte: { datum: string; kh: number; ballaststoffe?: number }[] = nRaw ? JSON.parse(nRaw) : [];
    const gewichtArr: { datum: string; gewicht: number }[] = gRaw ? JSON.parse(gRaw) : [];
    const zielKh: number = zRaw ? (JSON.parse(zRaw).kh || 20) : 20;

    // Keto-Streak
    const ketoDag: Record<string, number> = {};
    for (const e of naehrwerte) {
      ketoDag[e.datum] = (ketoDag[e.datum] || 0) + Math.max(0, e.kh - (e.ballaststoffe || 0));
    }
    const ketoSet = new Set(Object.entries(ketoDag).filter(([, kh]) => kh <= zielKh).map(([d]) => datumZuISO(d)));
    const ks = berechneStreak(ketoSet);

    // Log-Streak
    const logSet = new Set(naehrwerte.map(e => datumZuISO(e.datum)));
    const ls = berechneStreak(logSet);

    // Gewicht-Streak
    const gSet = new Set(gewichtArr.map(e => datumZuISO(e.datum)));
    const gs = berechneStreak(gSet);

    // Abnahme
    let ab = 0;
    if (gewichtArr.length >= 2) {
      const start = gewichtArr[0].gewicht;
      const akt   = gewichtArr[gewichtArr.length - 1].gewicht;
      ab = Math.max(0, Math.round((start - akt) * 10) / 10);
    }

    setKetoStreak(ks);
    setLogStreak(ls);
    setGewichtStreak(gs);
    setAbnahme(ab);
    setGesamtStats({
      mahlzeiten: naehrwerte.length,
      gewichtEintraege: gewichtArr.length,
      startGewicht: gewichtArr[0]?.gewicht || 0,
      aktGewicht: gewichtArr[gewichtArr.length - 1]?.gewicht || 0,
    });

    // Freigeschaltete Badges
    const vorher = localStorage.getItem("ketome_badges_freigeschaltet");
    const vorherSet: Set<string> = vorher ? new Set(JSON.parse(vorher)) : new Set();
    const frei = new Set<string>();

    for (const b of BADGES) {
      let wert = 0;
      if (b.typ === "keto")    wert = ks.best;
      if (b.typ === "log")     wert = ls.gesamt;
      if (b.typ === "gewicht") wert = gs.gesamt;
      if (b.typ === "abnahme") wert = ab;
      if (b.typ === "special") {
        if (b.id === "sp_startplan" && spRaw) wert = 1;
        if (b.id === "sp_rechner"   && rechnerRaw) wert = 1;
        if (b.id === "sp_scan"      && scannerRaw) wert = 1;
        if (b.id === "sp_woche"     && wochenplanRaw) {
          try { const w = JSON.parse(wochenplanRaw); if (Object.keys(w).length > 0) wert = 1; } catch {}
        }
      }
      if (wert >= b.schwelle) frei.add(b.id);
    }

    // Neu freigeschaltetes Badge anzeigen
    const neuIds = [...frei].filter(id => !vorherSet.has(id));
    if (neuIds.length > 0) {
      const neuBadgeObj = BADGES.find(b => b.id === neuIds[neuIds.length - 1]);
      if (neuBadgeObj) setNeuBadge(neuBadgeObj);
    }
    localStorage.setItem("ketome_badges_freigeschaltet", JSON.stringify([...frei]));
    setFreigeschaltet(frei);
  }, []);

  const naechsteKeto = BADGES.filter(b => b.typ === "keto" && !freigeschaltet.has(b.id))[0];
  const naechsteAb   = BADGES.filter(b => b.typ === "abnahme" && !freigeschaltet.has(b.id))[0];

  const streakFarbe = ketoStreak.aktuell === 0 ? "#333"
    : ketoStreak.aktuell < 7  ? "#f59e0b"
    : ketoStreak.aktuell < 30 ? "#ef4444"
    : "#8b5cf6";

  const sichtbareBadges = BADGES.filter(b => aktivFilter === "alle" || b.typ === aktivFilter);
  const freiCount = [...freigeschaltet].length;

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      {/* Neu freigeschaltetes Badge */}
      {neuBadge && (
        <div className="rounded-2xl p-4 mb-4 text-center"
          style={{ background: "linear-gradient(135deg, #0d2018, #1a0a2e)", border: "1px solid #22c55e55" }}>
          <div className="text-xs font-semibold mb-1" style={{ color: "#22c55e" }}>NEUES BADGE FREIGESCHALTET!</div>
          <div className="text-5xl my-2">{neuBadge.emoji}</div>
          <div className="font-black text-lg">{neuBadge.titel}</div>
          <div className="text-xs mt-1" style={{ color: "#666" }}>{neuBadge.beschreibung}</div>
          <button onClick={() => setNeuBadge(null)} className="mt-3 text-xs" style={{ color: "#444" }}>Schließen</button>
        </div>
      )}

      <h1 className="text-2xl font-black mb-1">🏆 Meine Erfolge</h1>
      <p className="text-sm mb-5" style={{ color: "#555" }}>{freiCount} von {BADGES.length} Badges freigeschaltet</p>

      {/* Haupt-Streak Hero */}
      <div className="rounded-2xl p-5 mb-4 text-center"
        style={{ backgroundColor: ketoStreak.aktuell > 0 ? "#0d2018" : "#1a1a1a", border: `1px solid ${ketoStreak.aktuell > 0 ? "#166534" : "#222"}` }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>KETO-STREAK</div>
        <div className="text-8xl mb-1" style={{ filter: ketoStreak.aktuell > 0 ? `drop-shadow(0 0 24px ${streakFarbe}99)` : "none" }}>
          {ketoStreak.aktuell === 0 ? "💤" : ketoStreak.aktuell >= 90 ? "🌟" : ketoStreak.aktuell >= 30 ? "👑" : ketoStreak.aktuell >= 7 ? "🔥" : "🌱"}
        </div>
        <div className="text-6xl font-black mt-1" style={{ color: streakFarbe }}>{ketoStreak.aktuell}</div>
        <div className="text-base font-semibold mt-1" style={{ color: ketoStreak.aktuell > 0 ? streakFarbe : "#444" }}>
          {ketoStreak.aktuell === 1 ? "Tag" : "Tage"} in Folge
        </div>
        <p className="text-xs mt-3" style={{ color: "#666" }}>
          {ketoStreak.aktuell === 0 ? "Starte heute — auch Tag 1 ist ein Streak!"
            : ketoStreak.aktuell < 7  ? `${7 - ketoStreak.aktuell} Tage bis zur ersten Woche. Du schaffst das!`
            : ketoStreak.aktuell < 21 ? "Keto-Adaption laeuft — dein Koerper wird zur Fettverbrennungsmaschine!"
            : ketoStreak.aktuell < 30 ? "Fat-adapted! Die schwere Phase ist laengst vorbei."
            : "Du bist eine Legende. Weiter so!"}
        </p>
        {ketoStreak.best > ketoStreak.aktuell && (
          <div className="text-xs mt-2" style={{ color: "#444" }}>Bester Streak: {ketoStreak.best} Tage</div>
        )}
        {/* Fortschritt zum nächsten Badge */}
        {naechsteKeto && ketoStreak.aktuell > 0 && (
          <div className="mt-4 rounded-xl p-3" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: "#555" }}>Nächstes: {naechsteKeto.emoji} {naechsteKeto.titel}</span>
              <span style={{ color: "#444" }}>{ketoStreak.aktuell}/{naechsteKeto.schwelle}d</span>
            </div>
            <div className="rounded-full h-2 overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
              <div className="h-2 rounded-full" style={{
                width: `${Math.min(100, (ketoStreak.aktuell / naechsteKeto.schwelle) * 100)}%`,
                backgroundColor: "#22c55e"
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: "Abgenommen", wert: `${abnahme} kg`, farbe: "#22c55e", sub: gesamtStats.startGewicht > 0 ? `${gesamtStats.startGewicht} → ${gesamtStats.aktGewicht} kg` : "" },
          { label: "Log-Streak", wert: `${logStreak.aktuell}d`, farbe: "#3b82f6", sub: `Gesamt: ${logStreak.gesamt} Tage` },
          { label: "Waage-Streak", wert: `${gewichtStreak.aktuell}d`, farbe: "#8b5cf6", sub: `Gesamt: ${gewichtStreak.gesamt} Tage` },
          { label: "Mahlzeiten", wert: String(gesamtStats.mahlzeiten), farbe: "#f59e0b", sub: "Einträge insgesamt" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-xs mb-1" style={{ color: "#555" }}>{s.label}</div>
            <div className="font-black text-2xl" style={{ color: s.farbe }}>{s.wert}</div>
            {s.sub && <div className="text-[10px] mt-0.5" style={{ color: "#444" }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Abnahme-Fortschritt */}
      {naechsteAb && gesamtStats.startGewicht > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="flex justify-between text-xs mb-2">
            <span style={{ color: "#22c55e" }}>Naechstes Ziel: {naechsteAb.emoji} {naechsteAb.titel}</span>
            <span style={{ color: "#555" }}>{abnahme}/{naechsteAb.schwelle} kg</span>
          </div>
          <div className="rounded-full h-2 overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
            <div className="h-2 rounded-full" style={{
              width: `${Math.min(100, (abnahme / naechsteAb.schwelle) * 100)}%`,
              background: "linear-gradient(90deg, #16a34a, #22c55e)"
            }} />
          </div>
          <div className="text-[10px] mt-1.5" style={{ color: "#444" }}>
            Noch {Math.max(0, naechsteAb.schwelle - abnahme).toFixed(1)} kg bis zum naechsten Meilenstein
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        <button onClick={() => setAktivFilter("alle")}
          className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ backgroundColor: aktivFilter === "alle" ? "#22c55e22" : "#1a1a1a", color: aktivFilter === "alle" ? "#22c55e" : "#555", border: aktivFilter === "alle" ? "1px solid #22c55e44" : "1px solid transparent" }}>
          Alle ({freiCount}/{BADGES.length})
        </button>
        {KATEGORIEN.map(k => {
          const anzahl = BADGES.filter(b => b.typ === k.typ && freigeschaltet.has(b.id)).length;
          const gesamt = BADGES.filter(b => b.typ === k.typ).length;
          return (
            <button key={k.typ} onClick={() => setAktivFilter(k.typ)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ backgroundColor: aktivFilter === k.typ ? k.farbe + "22" : "#1a1a1a", color: aktivFilter === k.typ ? k.farbe : "#555", border: aktivFilter === k.typ ? `1px solid ${k.farbe}44` : "1px solid transparent" }}>
              {k.label.split(" ").slice(1).join(" ")} {anzahl}/{gesamt}
            </button>
          );
        })}
      </div>

      {/* Badge-Grid */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {sichtbareBadges.map(b => {
          const haben = freigeschaltet.has(b.id);
          const kat = KATEGORIEN.find(k => k.typ === b.typ)!;
          return (
            <div key={b.id} className="rounded-2xl p-3 text-center"
              style={{
                backgroundColor: haben ? kat.farbe + "15" : "#1a1a1a",
                border: `1px solid ${haben ? kat.farbe + "55" : "transparent"}`,
                opacity: haben ? 1 : 0.35,
              }}>
              <div className="text-3xl mb-1" style={{ filter: haben ? "none" : "grayscale(1)" }}>{b.emoji}</div>
              <div className="text-[11px] font-bold leading-tight" style={{ color: haben ? kat.farbe : "#555" }}>{b.titel}</div>
              <div className="text-[10px] mt-0.5 leading-tight" style={{ color: "#444" }}>{b.beschreibung}</div>
              {haben && (
                <div className="text-[10px] mt-1 font-semibold" style={{ color: kat.farbe }}>✓ Erreicht</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Erklärung */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>ℹ️ SO WERDEN BADGES VERGEBEN</div>
        <div className="space-y-1.5 text-xs" style={{ color: "#666" }}>
          <p>🔥 <b style={{ color: "#aaa" }}>Keto-Streak:</b> Aufeinanderfolgende Tage unter deinem KH-Ziel</p>
          <p>📉 <b style={{ color: "#aaa" }}>Abnahme:</b> Differenz zwischen Startgewicht und aktuellem Gewicht</p>
          <p>📝 <b style={{ color: "#aaa" }}>Tracking:</b> Tage mit mindestens einem Mahlzeiten-Eintrag</p>
          <p>⚖️ <b style={{ color: "#aaa" }}>Waage:</b> Tage mit Gewichtseintrag</p>
          <p>⭐ <b style={{ color: "#aaa" }}>Special:</b> Einmalig fuer bestimmte App-Aktionen</p>
        </div>
      </div>
    </main>
  );
}
