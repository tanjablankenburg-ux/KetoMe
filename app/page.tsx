"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EarlyAdopterBanner from "./components/EarlyAdopterBanner";
import EssenSchnell from "./components/EssenSchnell";

type EnergieCheck = {
  datum: string;
  energie: number;
  schlaf: number;
  hunger: number;
};

function getTipp(e: EnergieCheck): { emoji: string; titel: string; text: string } {
  const score = e.energie + e.schlaf + e.hunger;
  if (e.energie === 1 && e.schlaf === 1) return { emoji: "😴", titel: "Schlaf ist dein größter Hebel heute", text: "Schlechter Schlaf blockiert alles — Fettverbrennung, Energie, Laune. Heute Abend: Handy weg um 21 Uhr, Magnesium nehmen, Zimmer kühler stellen. Morgen wird besser." };
  if (e.energie === 1 && e.hunger === 1) return { emoji: "🧂", titel: "Elektrolyte — sofort!", text: "Müde UND hungrig auf Keto ist fast immer ein Elektrolyt-Mangel. Trinke jetzt ein Glas Wasser mit einer Prise Salz oder mach dir eine Brühe." };
  if (e.energie === 1 && e.hunger === 3) return { emoji: "🥑", titel: "Mehr Fett — du isst zu wenig", text: "Kaum Hunger aber wenig Energie: du isst wahrscheinlich zu wenig Kalorien. Avocado, Nüsse, Butter — iss mehr Fett heute." };
  if (e.energie === 3 && score >= 8) return { emoji: "🔥", titel: "Du bist im Flow — nutze es!", text: "Perfekter Keto-Tag. Dein Körper läuft auf Ketonen. Nutze die Energie für Sport, wichtige Aufgaben oder einen langen Spaziergang." };
  if (e.schlaf === 1 && e.energie >= 2) return { emoji: "☕", titel: "Schlechter Schlaf, aber du schaffst das", text: "Heute trotzdem Energie — gut! Bulletproof Coffee hilft durch den Tag. Aber heute Abend früher ins Bett." };
  if (e.hunger === 1 && e.energie >= 2) return { emoji: "⏰", titel: "Hunger auf Keto — was steckt dahinter?", text: "Trinke erst Wasser (oft ist es Durst), prüfe ob du genug Fett gegessen hast, und überlege ob Stress den Hunger triggert." };
  if (e.energie === 2 && e.schlaf === 2) return { emoji: "💧", titel: "Mittelmäßiger Tag — Wasser und Bewegung helfen", text: "500 ml Wasser trinken, 10 Minuten spazieren gehen. Klingt banal, funktioniert aber fast immer." };
  if (score <= 4) return { emoji: "🌿", titel: "Heute sanft mit dir sein", text: "Nicht jeder Tag ist ein Hochleistungstag — und das ist okay. Iss sauber keto, trink viel, schlaf heute früh." };
  return { emoji: "✅", titel: "Guter Keto-Tag", text: "Du bist auf Kurs. Bleib bei deiner Ernährung, trink genug Wasser und vergiss die Elektrolyte nicht." };
}

const FRAGEN = [
  { key: "energie" as const, frage: "Wie ist deine Energie?", optionen: [{ wert: 1, emoji: "😴", label: "Müde" }, { wert: 2, emoji: "😐", label: "Okay" }, { wert: 3, emoji: "⚡", label: "Top!" }] },
  { key: "schlaf" as const, frage: "Wie hast du geschlafen?", optionen: [{ wert: 1, emoji: "😫", label: "Schlecht" }, { wert: 2, emoji: "😌", label: "Okay" }, { wert: 3, emoji: "😊", label: "Super" }] },
  { key: "hunger" as const, frage: "Wie ist dein Hunger?", optionen: [{ wert: 1, emoji: "🍽️", label: "Hungrig" }, { wert: 2, emoji: "😐", label: "Normal" }, { wert: 3, emoji: "✅", label: "Kaum" }] },
];

const KETO_TIPPS = [
  "Trinke mindestens 2–3 Liter Wasser täglich — Keto entwässert.",
  "Salz nicht vergessen! Elektrolyte sind entscheidend auf Keto.",
  "Keto-Grippe? Normal in den ersten Tagen — Magnesium hilft.",
  "Hunger? Oft ist es Durst. Erst ein Glas Wasser trinken.",
  "Bulletproof Coffee morgens hält stundenlang satt.",
  "Geduld — Ketose braucht 2–7 Tage. Bleib dran!",
  "Mehr Energie kommt nach der Eingewöhnungsphase — versprochen.",
  "Avocado täglich liefert gesunde Fette & sättigt lange.",
  "Intermittierendes Fasten (16:8) verstärkt die Ketose.",
  "Magnesium abends: besserer Schlaf, weniger Muskelkrämpfe.",
  "Zuckeralkohole wie Maltit bremsen Ketose — lieber Erythrit.",
  "Gewicht täglich messen macht keinen Sinn — Wasser schwankt.",
  "Leberflush: Eier + Speck morgens hält 5+ Stunden satt.",
  "Low Carb ≠ Keto — unter 20g Netto-KH für echte Ketose.",
  "Müde nach dem Sport? Mehr Salz + Kalium (Avocado!).",
  "Kaloriendefizit zählt trotzdem — auch auf Keto.",
  "Nüsse sind super — aber in Maßen, die KH summieren sich.",
  "Keto-Desserts mit Erythrit stillen den Süßhunger legal.",
  "Kaffee mit MCT-Öl morgens pusht die Energie.",
  "Stress erhöht Cortisol — das bremst Ketose. Pause machen!",
  "Dunkelgrünes Gemüse täglich: Spinat, Brokkoli, Zucchini.",
];

const FRUEHSTUECK_TIPPS = [
  "Rührei mit Speck und Avocado",
  "Griechischer Joghurt (natur) mit Walnüssen",
  "Spiegeleier mit Lachs und Gurkenscheiben",
  "Käse-Omelette mit Paprika und Kräutern",
  "Bulletproof Coffee + hartgekochte Eier",
  "Avocado-Bowl mit Ei und Chiliflocken",
  "Frischkäse auf Gurken mit geräuchertem Lachs",
  "Rührei mit Feta und getrockneten Tomaten",
  "Speck-Muffins (einfach im Muffinblech gebacken)",
  "Mandelbutter auf Selleriestreifen + Ei",
  "Quark (natur) mit Leinsamen und Beeren",
  "Bacon & Ei in der Pfanne — klassisch keto",
  "Zucchini-Pfannkuchen mit Schmand",
  "Käseomelett mit Spinat und Muskatnuss",
];

function tagIndex(): number {
  const d = new Date();
  return d.getFullYear() * 1000 + d.getMonth() * 31 + d.getDate();
}

function begruessung(): string {
  const h = new Date().getHours();
  if (h < 11) return "Guten Morgen! ☀️";
  if (h < 14) return "Guten Mittag! 🥗";
  if (h < 18) return "Guten Nachmittag! 💪";
  return "Guten Abend! 🌙";
}

export default function Home() {
  const router = useRouter();
  const [gewicht, setGewicht]           = useState<number | null>(null);
  const [startGewicht, setStartGewicht] = useState<number | null>(null);
  const [tageDabei, setTageDabei]       = useState(0);
  const [rezepteGespeichert, setRezepteGespeichert] = useState(0);
  const [mahlzeitenGeloggt, setMahlzeitenGeloggt]   = useState(0);
  const [heuteKh, setHeuteKh]           = useState(0);
  const [heuteKcal, setHeuteKcal]       = useState(0);
  const [heuteEiweiss, setHeuteEiweiss] = useState(0);
  const [heuteFett, setHeuteFett]       = useState(0);
  const [zielKcal, setZielKcal]         = useState(1500);
  const [zielKh, setZielKh]             = useState(20);
  const [zielEiweiss, setZielEiweiss]   = useState(100);
  const [zielFett, setZielFett]         = useState(120);
  const [gewichtsziel, setGewichtsziel] = useState<number | null>(null);
  const [profilName, setProfilName]     = useState("");
  const [ketoStreak, setKetoStreak]     = useState(0);
  const [check, setCheck]               = useState<Partial<EnergieCheck>>({});
  const [checkGespeichert, setCheckGespeichert] = useState<EnergieCheck | null>(null);
  const [checkOffen, setCheckOffen]     = useState(false);
  const [aufgaben, setAufgaben]         = useState<Record<string, boolean>>({});

  const heute     = new Date().toLocaleDateString("de-DE");
  const wochentag = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });

  function ladeMahlzeitDaten() {
    const mRaw = localStorage.getItem("ketome_naehrwerte");
    if (mRaw) {
      const alle = JSON.parse(mRaw);
      setMahlzeitenGeloggt(alle.length);
      const heuteEintraege = alle.filter((e: { datum: string }) => e.datum === heute);
      setHeuteKh(Math.round(heuteEintraege.reduce((s: number, e: { kh: number; ballaststoffe?: number }) => s + Math.max(0, (e.kh || 0) - (e.ballaststoffe || 0)), 0) * 10) / 10);
      setHeuteKcal(Math.round(heuteEintraege.reduce((s: number, e: { kcal: number }) => s + (e.kcal || 0), 0)));
      setHeuteEiweiss(Math.round(heuteEintraege.reduce((s: number, e: { eiweiss: number }) => s + (e.eiweiss || 0), 0)));
      setHeuteFett(Math.round(heuteEintraege.reduce((s: number, e: { fett: number }) => s + (e.fett || 0), 0)));

      // Streak: Tage ohne Einträge überspringen, nur bei tatsächlich zu vielen KH abbrechen
      const zRaw2 = localStorage.getItem("ketome_ziele");
      const zielKhVal = zRaw2 ? (JSON.parse(zRaw2).kh || 20) : 20;
      const tageKh: Record<string, number> = {};
      for (const e of alle) {
        const netto = Math.max(0, (e.kh || 0) - (e.ballaststoffe || 0));
        tageKh[e.datum] = (tageKh[e.datum] || 0) + netto;
      }
      let streak = 0;
      let lueckenTage = 0;
      const heuteD = new Date();
      for (let i = 0; i < 365; i++) {
        const d = new Date(heuteD);
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("de-DE");
        if (tageKh[label] === undefined) {
          if (i === 0) continue; // heute noch keine Einträge — weitermachen
          lueckenTage++;
          if (lueckenTage > 3) break; // mehr als 3 Tage ohne Log = Streak bricht
          continue;
        }
        lueckenTage = 0;
        if (tageKh[label] <= zielKhVal) streak++;
        else if (i > 0) break; // vergangener Tag über Limit
      }
      setKetoStreak(streak);
    }
  }

  useEffect(() => {
    // Onboarding-Check: wenn eingeloggt (ketome_name Cookie da), kurz auf Sync warten
    async function onboardingCheck() {
      if (!localStorage.getItem("ketome_onboarding_done")) {
        const istEingeloggt = document.cookie.includes("ketome_name=");
        if (istEingeloggt && !sessionStorage.getItem("ketome_sync_done")) {
          // Warte bis zu 4 Sekunden auf Sync
          await new Promise<void>(resolve => {
            let waited = 0;
            const check = setInterval(() => {
              waited += 200;
              if (localStorage.getItem("ketome_onboarding_done") || waited >= 4000) {
                clearInterval(check);
                resolve();
              }
            }, 200);
          });
        }
        if (!localStorage.getItem("ketome_onboarding_done")) {
          router.push("/onboarding");
          return;
        }
      }
      // Gewicht
      const gRaw = localStorage.getItem("ketome_gewicht");
      if (gRaw) {
        const arr = JSON.parse(gRaw);
        if (arr.length > 0) {
          setGewicht(arr[arr.length - 1].wert);
          setStartGewicht(arr[0].wert);
        }
      }
      // Tage dabei: Login-basierter Zähler
      {
        const heute2 = new Date().toLocaleDateString("de-DE");
        const letzterLogin = localStorage.getItem("ketome_letzter_login");
        let startdatum = localStorage.getItem("ketome_startdatum");

        if (letzterLogin && letzterLogin !== heute2) {
          // Prüfen ob mehr als 1 Tag seit letztem Login
          const [d, m, y] = letzterLogin.split(".").map(Number);
          const letzterLoginDate = new Date(y, m - 1, d);
          const diffTage = Math.floor((Date.now() - letzterLoginDate.getTime()) / 86400000);
          if (diffTage >= 2) {
            // 2+ Tage nicht eingeloggt → Streak reset
            startdatum = heute2;
            localStorage.setItem("ketome_startdatum", heute2);
          }
        }

        // Erster Login ever
        if (!startdatum) {
          startdatum = heute2;
          localStorage.setItem("ketome_startdatum", heute2);
        }

        // Letzten Login aktualisieren
        localStorage.setItem("ketome_letzter_login", heute2);

        // Tage berechnen
        const [d, m, y] = startdatum.split(".").map(Number);
        const ersterTag = new Date(y, m - 1, d);
        const diff = Math.floor((Date.now() - ersterTag.getTime()) / 86400000);
        setTageDabei(Math.max(diff + 1, 1));
      }
      // Energie-Check
      const cRaw = localStorage.getItem("ketome_energie_check");
      if (cRaw) {
        const g: EnergieCheck = JSON.parse(cRaw);
        if (g.datum === heute) setCheckGespeichert(g);
      }
      // Mahlzeiten + Streak
      ladeMahlzeitDaten();
      // Profil
      const pRaw = localStorage.getItem("ketome_profil");
      if (pRaw) { const p = JSON.parse(pRaw); if (p.name) setProfilName(p.name); }
      // Ziele
      const zRaw = localStorage.getItem("ketome_ziele");
      if (zRaw) {
        const z = JSON.parse(zRaw);
        if (z.kcal) setZielKcal(z.kcal);
        if (z.kh) setZielKh(z.kh);
        if (z.eiweiss) setZielEiweiss(z.eiweiss);
        if (z.fett) setZielFett(z.fett);
        if (z.gewichtsziel) setGewichtsziel(z.gewichtsziel);
      }
      // Rezepte
      const bRaw = localStorage.getItem("ketome_bookmarks");
      const crRaw = localStorage.getItem("ketome_custom_rezepte");
      const bm = bRaw ? JSON.parse(bRaw).length : 0;
      const cr = crRaw ? JSON.parse(crRaw).length : 0;
      setRezepteGespeichert(bm + cr);
      // Tagesaufgaben
      const aRaw = localStorage.getItem(`ketome_aufgaben_${heute}`);
      if (aRaw) setAufgaben(JSON.parse(aRaw));
    }
    onboardingCheck();

    // Live-Update wenn EssenSchnell eine Mahlzeit speichert
    window.addEventListener("ketome-daten-gespeichert", ladeMahlzeitDaten);
    return () => window.removeEventListener("ketome-daten-gespeichert", ladeMahlzeitDaten);
  }, [heute]);

  function toggleAufgabe(key: string) {
    const neu = { ...aufgaben, [key]: !aufgaben[key] };
    setAufgaben(neu);
    localStorage.setItem(`ketome_aufgaben_${heute}`, JSON.stringify(neu));
  }

  function antwortSetzen(key: "energie" | "schlaf" | "hunger", wert: number) {
    const neu = { ...check, [key]: wert };
    setCheck(neu);
    if (neu.energie && neu.schlaf && neu.hunger) {
      const fertig: EnergieCheck = { datum: heute, energie: neu.energie, schlaf: neu.schlaf, hunger: neu.hunger };
      localStorage.setItem("ketome_energie_check", JSON.stringify(fertig));
      setCheckGespeichert(fertig);
      toggleAufgabe("energiecheck");
    }
  }

  const tipp = getTipp(checkGespeichert ?? { datum: "", energie: 2, schlaf: 2, hunger: 2 });
  const kgVerloren = startGewicht && gewicht ? Math.round((startGewicht - gewicht) * 10) / 10 : 0;

  const AUFGABEN_LISTE = [
    { key: "gewicht",      label: "Gewicht eintragen",   href: "/tracking" },
    { key: "mahlzeit",     label: "Mahlzeit loggen",      href: "/tracking" },
    { key: "wasser",       label: "2L Wasser getrunken",  href: null },
    { key: "bewegung",     label: "Bewegung eingebaut",   href: "/fitness" },
    { key: "energiecheck", label: "Energie-Check",        href: null },
  ];

  const aufgabenErledigt = AUFGABEN_LISTE.filter(a => aufgaben[a.key]).length;


  return (
    <main className="pb-28" style={{ backgroundColor: "#080b08" }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative px-5 pt-8 pb-5 mb-2 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #22c55e18 0%, transparent 70%)", filter: "blur(20px)" }} />
        <div className="relative">
          <div className="text-sm font-medium mb-0.5" style={{ color: "#3a5a3a" }}>{wochentag}</div>
          <h1 className="font-black leading-tight mb-1" style={{ fontSize: "clamp(1.8rem, 7vw, 2.4rem)", letterSpacing: "-0.02em" }}>
            {begruessung()}{profilName && <span style={{ color: "#22c55e" }}> {profilName}</span>}
          </h1>
          <p className="text-base" style={{ color: "#3a5a3a" }}>
            {tageDabei > 0 ? `Tag ${tageDabei} deiner Keto-Reise` : "Willkommen bei VitaKeto"}
            {kgVerloren > 0 && <span style={{ color: "#22c55e" }}> · {kgVerloren} kg ↓</span>}
          </p>
        </div>
      </div>

      <div className="px-4">

      {/* ── Heute-Überblick: KH · Kalorien · Gewicht ─────────────────────── */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* KH-Ring */}
        {(() => {
          const pct = zielKh > 0 ? Math.min(1, heuteKh / zielKh) : 0;
          const over = heuteKh > zielKh && zielKh > 0;
          const farbe = over ? "#ef4444" : heuteKh > zielKh * 0.75 ? "#f59e0b" : "#22c55e";
          const r = 30; const circ = 2 * Math.PI * r;
          return (
            <Link href="/essen" className="rounded-2xl p-3 flex flex-col items-center justify-center gap-1"
              style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a" }}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r={r} fill="none" stroke="#1a2a1a" strokeWidth="6"/>
                <circle cx="36" cy="36" r={r} fill="none" stroke={farbe} strokeWidth="6"
                  strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
                  strokeLinecap="round" transform="rotate(-90 36 36)"/>
                <text x="36" y="40" textAnchor="middle" fontSize="14" fontWeight="900" fill={farbe}>{heuteKh}g</text>
              </svg>
              <div className="text-sm font-medium" style={{ color: "#3a5a3a" }}>Netto-KH</div>
              <div className="text-sm font-bold" style={{ color: over ? "#ef4444" : "#22c55e" }}>
                {over ? `+${Math.round(heuteKh - zielKh)}g` : `noch ${Math.round(zielKh - heuteKh)}g`}
              </div>
            </Link>
          );
        })()}
        {/* Kalorien-Ring */}
        {(() => {
          const pct = zielKcal > 0 ? Math.min(1, heuteKcal / zielKcal) : 0;
          const over = heuteKcal > zielKcal && zielKcal > 0;
          const farbe = over ? "#ef4444" : heuteKcal > zielKcal * 0.85 ? "#f59e0b" : "#8b5cf6";
          const r = 30; const circ = 2 * Math.PI * r;
          return (
            <Link href="/essen" className="rounded-2xl p-3 flex flex-col items-center justify-center gap-1"
              style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a" }}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r={r} fill="none" stroke="#1a1a2a" strokeWidth="6"/>
                <circle cx="36" cy="36" r={r} fill="none" stroke={farbe} strokeWidth="6"
                  strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
                  strokeLinecap="round" transform="rotate(-90 36 36)"/>
                <text x="36" y="40" textAnchor="middle" fontSize="11" fontWeight="900" fill={farbe}>{heuteKcal}</text>
              </svg>
              <div className="text-sm font-medium" style={{ color: "#3a5a3a" }}>Kalorien</div>
              <div className="text-sm font-bold" style={{ color: over ? "#ef4444" : "#8b5cf6" }}>
                {over ? `+${heuteKcal - zielKcal}` : `noch ${zielKcal - heuteKcal}`}
              </div>
            </Link>
          );
        })()}
        {/* Gewicht */}
        <Link href="/tracking" className="rounded-2xl p-3 flex flex-col items-center justify-center gap-1"
          style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a" }}>
          <div className="font-black" style={{ fontSize: "2.2rem", color: "#22c55e", lineHeight: 1.1 }}>
            {gewicht ?? "–"}
          </div>
          <div className="text-sm font-medium" style={{ color: "#3a5a3a" }}>kg</div>
          {gewichtsziel && gewicht ? (
            gewicht <= gewichtsziel
              ? <div className="text-sm font-bold" style={{ color: "#f59e0b" }}>🎉 Ziel!</div>
              : <div className="text-sm font-bold" style={{ color: "#22c55e" }}>−{Math.round((gewicht - gewichtsziel) * 10) / 10} kg</div>
          ) : (
            <div className="text-sm" style={{ color: "#555" }}>Gewicht</div>
          )}
        </Link>
      </div>

      {/* ── Essen-Schnelltracking ─────────────────────────────────────────── */}
      <EssenSchnell />

      {/* ── Heute erledigen ──────────────────────────────────────────────── */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#101410" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-base font-bold" style={{ color: "#22c55e" }}>✅ Heute erledigen</div>
          <div className="text-sm" style={{ color: "#555" }}>{aufgabenErledigt}/{AUFGABEN_LISTE.length}</div>
        </div>
        <div className="rounded-full h-2 mb-3" style={{ backgroundColor: "#151a15" }}>
          <div className="rounded-full h-2 transition-all" style={{ backgroundColor: "#22c55e", width: `${(aufgabenErledigt / AUFGABEN_LISTE.length) * 100}%` }} />
        </div>
        <div className="space-y-2">
          {AUFGABEN_LISTE.map(a => {
            const erledigt = !!aufgaben[a.key] || (a.key === "energiecheck" && !!checkGespeichert);
            const inner = (
              <div key={a.key} className="flex items-center gap-3 py-1.5"
                onClick={() => !a.href && toggleAufgabe(a.key)}
                style={{ cursor: a.href ? "default" : "pointer" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: erledigt ? "#22c55e" : "#2a2a2a", border: erledigt ? "none" : "1px solid #333" }}>
                  {erledigt && <span className="text-xs text-black font-bold">✓</span>}
                </div>
                <span className="text-base" style={{ color: erledigt ? "#555" : "#ddd", textDecoration: erledigt ? "line-through" : "none" }}>
                  {a.label}
                </span>
              </div>
            );
            return a.href ? <Link key={a.key} href={a.href}>{inner}</Link> : inner;
          })}
        </div>
      </div>

      {/* ── Keto-Streak ──────────────────────────────────────────────────── */}
      <Link href="/erfolge" className="flex items-center gap-4 rounded-2xl p-4 mb-4"
        style={{ backgroundColor: ketoStreak > 0 ? "#0d2018" : "#1a1a1a", border: `1px solid ${ketoStreak > 0 ? "#166534" : "#222"}` }}>
        <div className="text-4xl" style={{ filter: ketoStreak > 0 ? "drop-shadow(0 0 8px #f59e0b88)" : "none" }}>
          {ketoStreak === 0 ? "💤" : ketoStreak >= 30 ? "👑" : "🔥"}
        </div>
        <div className="flex-1">
          <div className="text-sm mb-0.5" style={{ color: "#555" }}>KETO-STREAK</div>
          <div className="text-2xl font-black" style={{ color: ketoStreak === 0 ? "#333" : ketoStreak < 7 ? "#f59e0b" : "#22c55e" }}>
            {ketoStreak} {ketoStreak === 1 ? "Tag" : "Tage"}
          </div>
          <div className="text-sm mt-0.5" style={{ color: "#555" }}>
            {ketoStreak === 0 ? "Heute starten — jeden Tag zählt!" : ketoStreak < 7 ? `Noch ${7 - ketoStreak} Tage bis zur ⚡-Badge!` : "Stark — weiter so! 💪"}
          </div>
        </div>
        <span style={{ color: "#333" }}>›</span>
      </Link>

      {/* ── Exogene Ketone ───────────────────────────────────────────────── */}
      <Link href="/exogene-ketone" className="rounded-2xl p-4 mb-4 block"
        style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0d0018 100%)", border: "1px solid #7c3aed55" }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed33, #4f1d9622)", border: "1px solid #7c3aed44" }}>⚡</div>
          <div className="flex-1">
            <div className="text-xs font-bold tracking-widest mb-0.5" style={{ color: "#a78bfa" }}>DER ANDERE TREIBSTOFF</div>
            <div className="font-black text-base">Exogene Ketone</div>
          </div>
          <span className="text-lg" style={{ color: "#7c3aed" }}>›</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          Sofort Energie ohne tagelange Ketose-Eingewöhnung — wann, warum und wie du exogene Ketone richtig einsetzt.
        </p>
      </Link>

      {/* ── KI Keto-Coach ────────────────────────────────────────────────── */}
      <Link href="/coach" className="flex items-center gap-4 rounded-2xl p-4 mb-4"
        style={{ background: "linear-gradient(135deg, #0d2018 0%, #0a1a14 100%)", border: "1px solid #22c55e44" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #22c55e22, #16a34a11)", border: "1px solid #22c55e33" }}>🤖</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-base mb-0.5">KI Keto-Coach</div>
          <div className="text-sm truncate" style={{ color: "#555" }}>Stell deine persönliche Keto-Frage →</div>
        </div>
        <span className="text-lg" style={{ color: "#22c55e" }}>›</span>
      </Link>

      {/* ── Energie-Check — kollapsierbar ────────────────────────────────── */}
      <div className="rounded-2xl mb-4 overflow-hidden" style={{ backgroundColor: "#101410", border: checkGespeichert ? "1px solid #854d0e" : "1px solid #1a1a1a" }}>
        <button className="w-full flex items-center justify-between p-4" onClick={() => setCheckOffen(o => !o)}>
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span className="text-base font-semibold" style={{ color: "#f59e0b" }}>Energie-Check</span>
            {checkGespeichert && (
              <span className="text-sm px-2 py-0.5 rounded-full" style={{ backgroundColor: "#854d0e44", color: "#f59e0b" }}>
                {["😴","😐","⚡"][checkGespeichert.energie-1]} erledigt
              </span>
            )}
          </div>
          <span style={{ color: "#555", transform: checkOffen ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block", transition: "transform 0.2s" }}>▼</span>
        </button>
        {checkOffen && (
          <div className="px-4 pb-4">
            {!checkGespeichert ? (
              <div className="space-y-4">
                {FRAGEN.map(f => (
                  <div key={f.key}>
                    <div className="text-base mb-2" style={{ color: "#ccc" }}>{f.frage}</div>
                    <div className="flex gap-2">
                      {f.optionen.map(o => (
                        <button key={o.wert} onClick={() => antwortSetzen(f.key, o.wert)}
                          className="flex-1 py-3 rounded-xl flex flex-col items-center gap-1"
                          style={{ backgroundColor: check[f.key] === o.wert ? "#f59e0b" : "#2a2a2a", color: check[f.key] === o.wert ? "#000" : "#888" }}>
                          <span className="text-2xl">{o.emoji}</span>
                          <span className="text-sm font-medium">{o.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex gap-3 mb-2">
                  <span className="text-3xl">{tipp.emoji}</span>
                  <div>
                    <div className="font-semibold text-base mb-1">{tipp.titel}</div>
                    <p className="text-sm leading-relaxed" style={{ color: "#aaa" }}>{tipp.text}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-3 text-sm" style={{ color: "#555" }}>
                    <span>{["😴","😐","⚡"][checkGespeichert.energie-1]}</span>
                    <span>{["😫","😌","😊"][checkGespeichert.schlaf-1]}</span>
                    <span>{["🍽️","😐","✅"][checkGespeichert.hunger-1]}</span>
                  </div>
                  <button onClick={() => { setCheckGespeichert(null); setCheck({}); localStorage.removeItem("ketome_energie_check"); }}
                    className="text-sm" style={{ color: "#555" }}>Neu</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Tipp des Tages ────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 rounded-2xl p-4 mb-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
        <span className="text-xl flex-shrink-0">💡</span>
        <p className="text-sm leading-relaxed" style={{ color: "#aaa" }}>{KETO_TIPPS[tagIndex() % KETO_TIPPS.length]}</p>
      </div>

      {/* ── Navigation: Alle Funktionen & Wissen ─────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link href="/tools" className="rounded-2xl p-4 flex flex-col gap-2"
          style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a" }}>
          <span className="text-2xl">🧰</span>
          <div className="text-base font-bold">Alle Funktionen</div>
          <div className="text-sm" style={{ color: "#555" }}>Tracking, Rezepte, Tools & mehr</div>
        </Link>
        <Link href="/info" className="rounded-2xl p-4 flex flex-col gap-2"
          style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a" }}>
          <span className="text-2xl">📚</span>
          <div className="text-base font-bold">Keto-Wissen</div>
          <div className="text-sm" style={{ color: "#555" }}>Guides, Tipps & Ernährung</div>
        </Link>
      </div>

      </div>{/* /px-4 */}
    </main>
  );
}


