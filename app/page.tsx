"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

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
];

function begruessung(): string {
  const h = new Date().getHours();
  if (h < 11) return "Guten Morgen! ☀️";
  if (h < 14) return "Guten Mittag! 🥗";
  if (h < 18) return "Guten Nachmittag! 💪";
  return "Guten Abend! 🌙";
}

export default function Home() {
  const [gewicht, setGewicht]           = useState<number | null>(null);
  const [startGewicht, setStartGewicht] = useState<number | null>(null);
  const [tageDabei, setTageDabei]       = useState(0);
  const [rezepteGespeichert, setRezepteGespeichert] = useState(0);
  const [mahlzeitenGeloggt, setMahlzeitenGeloggt]   = useState(0);
  const [heuteKh, setHeuteKh]           = useState(0);
  const [heuteKcal, setHeuteKcal]       = useState(0);
  const [check, setCheck]               = useState<Partial<EnergieCheck>>({});
  const [checkGespeichert, setCheckGespeichert] = useState<EnergieCheck | null>(null);
  const [aufgaben, setAufgaben]         = useState<Record<string, boolean>>({});

  const heute     = new Date().toLocaleDateString("de-DE");
  const wochentag = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });

  useEffect(() => {
    // Gewicht
    const gRaw = localStorage.getItem("ketome_gewicht");
    if (gRaw) {
      const arr = JSON.parse(gRaw);
      if (arr.length > 0) {
        setGewicht(arr[arr.length - 1].wert);
        setStartGewicht(arr[0].wert);
        const ersterTag = new Date(arr[0].datum.split(".").reverse().join("-"));
        const diff = Math.floor((Date.now() - ersterTag.getTime()) / 86400000);
        setTageDabei(Math.max(diff, 0));
      }
    }
    // Energie-Check
    const cRaw = localStorage.getItem("ketome_energie_check");
    if (cRaw) {
      const g: EnergieCheck = JSON.parse(cRaw);
      if (g.datum === heute) setCheckGespeichert(g);
    }
    // Mahlzeiten
    const mRaw = localStorage.getItem("ketome_naehrwerte");
    if (mRaw) {
      const alle = JSON.parse(mRaw);
      setMahlzeitenGeloggt(alle.length);
      const heuteEintraege = alle.filter((e: { datum: string }) => e.datum === heute);
      setHeuteKh(Math.round(heuteEintraege.reduce((s: number, e: { kh: number }) => s + (e.kh || 0), 0)));
      setHeuteKcal(Math.round(heuteEintraege.reduce((s: number, e: { kcal: number }) => s + (e.kcal || 0), 0)));
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

  const SCHNELLZUGRIFF = [
    { href: "/wochenplan",   icon: "🥗", label: "Wochenplan" },
    { href: "/rezepte",      icon: "📖", label: "Rezepte" },
    { href: "/fitness",      icon: "💪", label: "Fitness" },
    { href: "/tracking",     icon: "📊", label: "Tracking" },
    { href: "/einkaufsliste",icon: "🛒", label: "Einkauf" },
    { href: "/scanner",      icon: "📷", label: "Scanner" },
    { href: "/lebensmittel",  icon: "🍳", label: "Nährwerte" },
    { href: "/info",          icon: "📚", label: "Wissen" },
    { href: "/rezept-foto",   icon: "📸", label: "Foto-Rezept" },
  ];

  return (
    <main className="px-4 py-6 pb-28">

      {/* Begrüßung */}
      <div className="mb-5">
        <div className="text-xs mb-0.5" style={{ color: "#555" }}>{wochentag}</div>
        <h1 className="text-2xl font-bold mb-0.5">{begruessung()}</h1>
        <p className="text-sm" style={{ color: "#666" }}>
          {tageDabei > 0 ? `Tag ${tageDabei} deiner Keto-Reise` : "Willkommen bei KetoMe"}
          {kgVerloren > 0 ? ` · ${kgVerloren} kg abgenommen` : ""}
        </p>
      </div>

      {/* Heute im Überblick */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Gewicht", wert: gewicht ? `${gewicht} kg` : "– kg", farbe: "#22c55e", href: "/tracking" },
          { label: "KH heute", wert: `${heuteKh}g`, farbe: heuteKh > 20 ? "#ef4444" : heuteKh > 10 ? "#f59e0b" : "#22c55e", href: "/tracking" },
          { label: "kcal heute", wert: `${heuteKcal}`, farbe: "#8b5cf6", href: "/tracking" },
        ].map(s => (
          <Link key={s.label} href={s.href}
            className="rounded-2xl p-3 text-center"
            style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-xs mb-1" style={{ color: "#555" }}>{s.label}</div>
            <div className="text-lg font-bold" style={{ color: s.farbe }}>{s.wert}</div>
          </Link>
        ))}
      </div>

      {/* Erfolgs-Badges */}
      {(tageDabei >= 1 || kgVerloren > 0 || rezepteGespeichert > 0 || mahlzeitenGeloggt > 0) && (
        <div className="rounded-2xl p-4 mb-4 overflow-x-auto" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-xs font-semibold mb-3" style={{ color: "#f59e0b" }}>🏆 Deine Erfolge</div>
          <div className="flex gap-2 flex-wrap">
            {tageDabei >= 1 && (
              <div className="rounded-xl px-3 py-2 text-center whitespace-nowrap" style={{ backgroundColor: "#2a2a2a" }}>
                <div className="text-lg">🗓️</div>
                <div className="text-xs font-bold mt-0.5">{tageDabei} Tage</div>
                <div className="text-[10px]" style={{ color: "#555" }}>dabei</div>
              </div>
            )}
            {kgVerloren > 0 && (
              <div className="rounded-xl px-3 py-2 text-center whitespace-nowrap" style={{ backgroundColor: "#2a2a2a" }}>
                <div className="text-lg">⚖️</div>
                <div className="text-xs font-bold mt-0.5">{kgVerloren} kg</div>
                <div className="text-[10px]" style={{ color: "#555" }}>abgenommen</div>
              </div>
            )}
            {rezepteGespeichert > 0 && (
              <div className="rounded-xl px-3 py-2 text-center whitespace-nowrap" style={{ backgroundColor: "#2a2a2a" }}>
                <div className="text-lg">📖</div>
                <div className="text-xs font-bold mt-0.5">{rezepteGespeichert}</div>
                <div className="text-[10px]" style={{ color: "#555" }}>Rezepte</div>
              </div>
            )}
            {mahlzeitenGeloggt > 0 && (
              <div className="rounded-xl px-3 py-2 text-center whitespace-nowrap" style={{ backgroundColor: "#2a2a2a" }}>
                <div className="text-lg">🍽️</div>
                <div className="text-xs font-bold mt-0.5">{mahlzeitenGeloggt}</div>
                <div className="text-[10px]" style={{ color: "#555" }}>Mahlzeiten</div>
              </div>
            )}
            {tageDabei >= 7 && (
              <div className="rounded-xl px-3 py-2 text-center whitespace-nowrap" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
                <div className="text-lg">🔥</div>
                <div className="text-xs font-bold mt-0.5" style={{ color: "#22c55e" }}>7 Tage</div>
                <div className="text-[10px]" style={{ color: "#555" }}>Streak!</div>
              </div>
            )}
            {tageDabei >= 30 && (
              <div className="rounded-xl px-3 py-2 text-center whitespace-nowrap" style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d" }}>
                <div className="text-lg">👑</div>
                <div className="text-xs font-bold mt-0.5" style={{ color: "#f59e0b" }}>30 Tage</div>
                <div className="text-[10px]" style={{ color: "#555" }}>Legende!</div>
              </div>
            )}
            {kgVerloren >= 5 && (
              <div className="rounded-xl px-3 py-2 text-center whitespace-nowrap" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
                <div className="text-lg">💪</div>
                <div className="text-xs font-bold mt-0.5" style={{ color: "#22c55e" }}>5+ kg</div>
                <div className="text-[10px]" style={{ color: "#555" }}>weg!</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tagesaufgaben */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold" style={{ color: "#22c55e" }}>✅ Heute erledigen</div>
          <div className="text-xs" style={{ color: "#555" }}>{aufgabenErledigt}/{AUFGABEN_LISTE.length}</div>
        </div>
        {/* Fortschrittsbalken */}
        <div className="rounded-full h-1.5 mb-3" style={{ backgroundColor: "#2a2a2a" }}>
          <div className="rounded-full h-1.5 transition-all" style={{ backgroundColor: "#22c55e", width: `${(aufgabenErledigt / AUFGABEN_LISTE.length) * 100}%` }} />
        </div>
        <div className="space-y-2">
          {AUFGABEN_LISTE.map(a => {
            const erledigt = !!aufgaben[a.key] || (a.key === "energiecheck" && !!checkGespeichert);
            const inner = (
              <div key={a.key} className="flex items-center gap-3 py-1"
                onClick={() => !a.href && toggleAufgabe(a.key)}
                style={{ cursor: a.href ? "default" : "pointer" }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: erledigt ? "#22c55e" : "#2a2a2a", border: erledigt ? "none" : "1px solid #333" }}>
                  {erledigt && <span className="text-[10px] text-black font-bold">✓</span>}
                </div>
                <span className="text-sm" style={{ color: erledigt ? "#555" : "#ccc", textDecoration: erledigt ? "line-through" : "none" }}>
                  {a.label}
                </span>
              </div>
            );
            return a.href ? <Link key={a.key} href={a.href}>{inner}</Link> : inner;
          })}
        </div>
      </div>

      {/* Schnellzugriff */}
      <div className="mb-4">
        <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>SCHNELLZUGRIFF</div>
        <div className="grid grid-cols-4 gap-2">
          {SCHNELLZUGRIFF.map(item => (
            <Link key={item.href} href={item.href}
              className="rounded-2xl p-3 flex flex-col items-center gap-1.5"
              style={{ backgroundColor: "#1a1a1a" }}>
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[10px] font-medium text-center" style={{ color: "#888" }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Empfehlungen des Tages */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "#22c55e" }}>✨ KetoMe empfiehlt heute</div>
        <div className="space-y-2">
          {[
            { emoji: "🍳", text: "Frühstück: Rührei mit Speck und Avocado", href: "/rezepte" },
            { emoji: "💡", text: KETO_TIPPS[new Date().getDay() % KETO_TIPPS.length], href: null },
            { emoji: "🧂", text: "Elektrolyte nicht vergessen — Wasser mit Prise Salz", href: null },
            { emoji: "📚", text: "Keto-Wissen: Was ist Ketose?", href: "/info" },
          ].map((r, i) => (
            r.href ? (
              <Link key={i} href={r.href} className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">{r.emoji}</span>
                <span className="text-xs leading-relaxed" style={{ color: "#aaa" }}>{r.text}</span>
              </Link>
            ) : (
              <div key={i} className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">{r.emoji}</span>
                <span className="text-xs leading-relaxed" style={{ color: "#aaa" }}>{r.text}</span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Energie-Check */}
      {!checkGespeichert ? (
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-xs font-semibold mb-3" style={{ color: "#f59e0b" }}>⚡ Täglicher Energie-Check</div>
          <div className="space-y-4">
            {FRAGEN.map(f => (
              <div key={f.key}>
                <div className="text-sm mb-2" style={{ color: "#ccc" }}>{f.frage}</div>
                <div className="flex gap-2">
                  {f.optionen.map(o => (
                    <button key={o.wert} onClick={() => antwortSetzen(f.key, o.wert)}
                      className="flex-1 py-2.5 rounded-xl flex flex-col items-center gap-1"
                      style={{ backgroundColor: check[f.key] === o.wert ? "#f59e0b" : "#2a2a2a", color: check[f.key] === o.wert ? "#000" : "#888" }}>
                      <span className="text-xl">{o.emoji}</span>
                      <span className="text-xs font-medium">{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {(check.energie || check.schlaf || check.hunger) && !(check.energie && check.schlaf && check.hunger) && (
            <p className="text-xs mt-3 text-center" style={{ color: "#555" }}>
              Noch {3 - [check.energie, check.schlaf, check.hunger].filter(Boolean).length} Frage(n) übrig…
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a", border: "1px solid #854d0e" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold" style={{ color: "#f59e0b" }}>⚡ Dein heutiger Energie-Tipp</div>
            <button onClick={() => { setCheckGespeichert(null); setCheck({}); localStorage.removeItem("ketome_energie_check"); }}
              className="text-xs" style={{ color: "#555" }}>Neu</button>
          </div>
          <div className="flex gap-3 mb-2">
            <span className="text-3xl">{tipp.emoji}</span>
            <div>
              <div className="font-semibold text-sm mb-1">{tipp.titel}</div>
              <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>{tipp.text}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-3 text-xs" style={{ color: "#555" }}>
            <span>{["😴","😐","⚡"][checkGespeichert.energie-1]} Energie</span>
            <span>{["😫","😌","😊"][checkGespeichert.schlaf-1]} Schlaf</span>
            <span>{["🍽️","😐","✅"][checkGespeichert.hunger-1]} Hunger</span>
          </div>
        </div>
      )}
    </main>
  );
}
