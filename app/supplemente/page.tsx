"use client";
import { useState } from "react";
import Link from "next/link";

type Prioritaet = "pflicht" | "wichtig" | "optional" | "pro";
type Ziel = "alle" | "keto-grippe" | "energie" | "schlaf" | "abnehmen" | "leistung";

type Supplement = {
  name: string;
  emoji: string;
  prioritaet: Prioritaet;
  ziele: Ziel[];
  warum: string;
  dosierung: string;
  form: string;
  wann: string;
  tipp?: string;
  warnung?: string;
  link?: string;
};

const SUPPLEMENTE: Supplement[] = [
  // PFLICHT
  {
    name: "Magnesium",
    emoji: "💊",
    prioritaet: "pflicht",
    ziele: ["keto-grippe", "schlaf", "energie"],
    warum: "Das wichtigste Keto-Supplement. Keto erhöht die Ausscheidung massiv. Mangel = Krämpfe, schlechter Schlaf, Herzrasen, Kopfschmerzen.",
    dosierung: "300–400 mg täglich",
    form: "Glycinat oder Citrat (kein Oxid — kaum bioverfügbar)",
    wann: "Abends vor dem Schlafen — fördert auch die Schlafqualität",
    tipp: "Magnesiumglycinat ist die beste Form: hohe Bioverfügbarkeit, kein Durchfall. Citrat wirkt leicht abführend (nützlich bei Verstopfung).",
  },
  {
    name: "Natrium (Salz)",
    emoji: "🧂",
    prioritaet: "pflicht",
    ziele: ["keto-grippe", "energie", "leistung"],
    warum: "Keto senkt Insulin → Nieren scheiden Natrium verstärkt aus. Ohne Ausgleich: Kopfschmerzen, Schwindel, Erschöpfung.",
    dosierung: "2.000–3.000 mg extra täglich (= 5–7 g Salz)",
    form: "Meersalz, Himalayasalz oder Natrium-Elektrolyt-Drinks",
    wann: "Über den Tag verteilt — morgens nüchtern ein Glas Salzwasser ist ideal",
    tipp: "Bouillon/Brühe ist die perfekte Keto-Lösung: Natrium + Kalium + warm + sättigend.",
  },
  {
    name: "Kalium",
    emoji: "🥑",
    prioritaet: "pflicht",
    ziele: ["keto-grippe", "leistung"],
    warum: "Geht zusammen mit Natrium verloren. Mangel: Muskelschwäche, Krämpfe, Herzrasen.",
    dosierung: "1.000–3.500 mg täglich",
    form: "Besser über Nahrung: Avocado, Spinat, Lachs — Supplement nur wenn nötig",
    wann: "Mit Mahlzeiten",
    tipp: "1 Avocado liefert ~975 mg Kalium. Täglich Avocado = Problem gelöst. Alternativ: LoSalt (Kaliumchlorid) als Salzersatz.",
    warnung: "Bei Nierenerkrankungen oder ACE-Hemmern Arzt fragen — Kaliumüberschuss kann gefährlich sein.",
  },
  {
    name: "MCT-Öl",
    emoji: "🥥",
    prioritaet: "pflicht",
    ziele: ["energie", "abnehmen", "leistung"],
    warum: "Mittelkettige Fettsäuren werden direkt zur Leber transportiert und sofort in Ketone umgewandelt — schnelle Energie ohne Blutzuckeranstieg.",
    dosierung: "1–3 EL täglich",
    form: "C8 (Caprylsäure) ist die wirksamste Form. Reines C8 besser als MCT-Mix.",
    wann: "Morgens nüchtern oder im Bulletproof Coffee",
    tipp: "Langsam einsteigen! 1 TL am Tag 1, sonst Magenprobleme. Nach 1–2 Wochen auf 1–3 EL steigern. Nicht erhitzen — als Dressing oder in Kaffee.",
    warnung: "Bei zu schneller Steigerung: Magenschmerzen, Durchfall. Wirklich langsam anfangen.",
  },
  // WICHTIG
  {
    name: "Vitamin D3 + K2",
    emoji: "☀️",
    prioritaet: "wichtig",
    ziele: ["alle", "leistung", "abnehmen"],
    warum: "85% der Deutschen haben Vitamin D-Mangel. Beeinflusst Immunsystem, Testosteron, Stimmung und Insulinsensitivität. K2 leitet Calcium in die Knochen statt in Arterien.",
    dosierung: "D3: 2.000–5.000 IE täglich · K2 (MK-7): 100–200 mcg",
    form: "Kombinationspräparat D3+K2 in Öl/Tropfen — fettlöslich, besser mit Mahlzeit",
    wann: "Morgens mit einer fetthaltigen Mahlzeit",
    tipp: "Im Winter täglich, im Sommer je nach Sonnenexposition. Bluttest beim Arzt empfehlenswert (25-OH-Vitamin-D).",
  },
  {
    name: "Omega-3 (Fischöl)",
    emoji: "🐟",
    prioritaet: "wichtig",
    ziele: ["alle", "leistung", "abnehmen"],
    warum: "Keto verbessert das Omega-6/Omega-3-Verhältnis bereits stark — aber hochdosiertes Omega-3 reduziert Entzündungen zusätzlich, verbessert Herzgesundheit und Gehirnfunktion.",
    dosierung: "2–3 g EPA+DHA täglich",
    form: "Triglycerid-Form (besser bioverfügbar als Ethylester). Algae-Öl für Veganer.",
    wann: "Mit fetthaltiger Mahlzeit — verbessert Aufnahme",
    tipp: "Qualität zählt: ranziges Fischöl ist schlimmer als keins. Geruchstest: frisches Öl riecht nach Meer, nicht ranzig. Im Kühlschrank lagern.",
  },
  {
    name: "Zink",
    emoji: "🛡️",
    prioritaet: "wichtig",
    ziele: ["alle", "leistung"],
    warum: "Wichtig für Immunfunktion, Testosteron, Wundheilung und über 300 Enzymreaktionen. Wird auf Keto etwas mehr ausgeschieden.",
    dosierung: "15–25 mg täglich",
    form: "Zinkbisglycinat oder -picolinat (besser als Oxid)",
    wann: "Abends, nicht zusammen mit Calcium oder Eisen",
    warnung: "Nicht dauerhaft über 40 mg — stört Kupferaufnahme.",
  },
  {
    name: "B-Vitamine (Komplex)",
    emoji: "⚡",
    prioritaet: "wichtig",
    ziele: ["energie", "keto-grippe"],
    warum: "B-Vitamine sind Cofaktoren im Energiestoffwechsel — besonders wichtig beim Fettabbau. B1, B2, B3, B5 direkt am Fettsäureabbau beteiligt.",
    dosierung: "1 Kapsel B-Komplex täglich",
    form: "Aktivierte Formen: B6 als P-5-P, B12 als Methylcobalamin, Folat als Methylfolat",
    wann: "Morgens mit Frühstück",
    tipp: "Besonders wichtig wenn Alkohol konsumiert wird — Alkohol verbraucht B-Vitamine stark.",
  },
  // OPTIONAL
  {
    name: "L-Carnitin",
    emoji: "🏃",
    prioritaet: "optional",
    ziele: ["abnehmen", "leistung", "energie"],
    warum: "Transportiert langkettige Fettsäuren in die Mitochondrien. Unterstützt die Fettverbrennung — besonders wichtig bei Ausdauersport.",
    dosierung: "1.000–3.000 mg täglich",
    form: "L-Carnitin-L-Tartrat oder Acetyl-L-Carnitin (besser fürs Gehirn)",
    wann: "30–60 Minuten vor dem Training",
    tipp: "Wirkung ist messbar bei Ausdauersport. Für reine Gewichtsabnahme ohne Sport weniger relevant.",
  },
  {
    name: "Kreatin",
    emoji: "💪",
    prioritaet: "optional",
    ziele: ["leistung"],
    warum: "Verbessert Kraftleistung, Muskelmasse und Erholung. Funktioniert hervorragend mit Keto — kein Zucker nötig zur Aufnahme.",
    dosierung: "3–5 g täglich",
    form: "Kreatin-Monohydrat — die günstigste und beste Form",
    wann: "Täglich, Timing spielt kaum eine Rolle",
    tipp: "Führt anfangs zu leichter Wassereinlagerung in der Muskulatur (nicht Fett!). Kreatin ist eines der bestuntersuchten Supplemente überhaupt.",
  },
  {
    name: "Verdauungsenzyme",
    emoji: "🔬",
    prioritaet: "optional",
    ziele: ["keto-grippe", "alle"],
    warum: "Viel Fett auf einmal kann die Gallenblasen-Kapazität überfordern — besonders in den ersten Wochen. Enzyme helfen beim Fettabbau.",
    dosierung: "1 Kapsel zu fettreichen Mahlzeiten",
    form: "Lipase + Ox Bile (Ochsengalle) für Fettabbau",
    wann: "Direkt zu oder nach fettreichen Mahlzeiten",
    tipp: "Besonders hilfreich in den ersten 2–4 Wochen Keto wenn der Körper sich an die Fettmenge gewöhnt.",
  },
  {
    name: "Kollagen / Glycin",
    emoji: "🦴",
    prioritaet: "optional",
    ziele: ["alle", "leistung"],
    warum: "Keto ist proteinmoderat — Kollagen liefert die Aminosäuren Glycin und Prolin für Gelenke, Haut und Schlaf. Glycin allein verbessert Schlafqualität nachweislich.",
    dosierung: "10–15 g Kollagenpeptide oder 3 g reines Glycin",
    form: "Hydrolysat-Kollagen (Pulver) oder Glycin-Pulver",
    wann: "Kollagen morgens im Kaffee, Glycin abends vor dem Schlafen",
    tipp: "Kollagen enthält kein Tryptophan — kein vollständiges Protein. Immer mit anderen Proteinquellen kombinieren.",
  },
  {
    name: "Berberin",
    emoji: "🌿",
    prioritaet: "optional",
    ziele: ["abnehmen", "alle"],
    warum: "Aktiviert AMPK — ähnlich wie Metformin. Verbessert Insulinsensitivität, Blutzuckerkontrolle und unterstützt die Gewichtsabnahme.",
    dosierung: "500 mg · 2–3x täglich zu den Mahlzeiten",
    form: "Berberinhydrochlorid",
    wann: "Direkt zu den Mahlzeiten",
    warnung: "Wechselwirkungen mit Medikamenten möglich (besonders Blutverdünner, Antidiabetika). Arzt fragen.",
  },
  // PRO
  {
    name: "Exogene Ketone",
    emoji: "⚡",
    prioritaet: "pro",
    ziele: ["energie", "keto-grippe", "leistung"],
    warum: "Liefern Ketone direkt — auch ohne Kaloriendefizit oder strenges Fasten. Helfen in der Keto-Grippe, vor dem Training oder bei einem KH-Ausrutscher.",
    dosierung: "Nach Herstellerangabe — meist 1 Portion",
    form: "BHB-Salze oder BHB-Ester. Ester wirken stärker aber schmecken intensiv.",
    wann: "Morgens nüchtern, vor dem Training oder nach einem KH-Ausrutscher",
    tipp: "Ein anderer Treibstoff für dein Gehirn und deine Muskeln — sofort verfügbar, kein langer Adaptionsprozess nötig. Die neue Generation (R-BHB + L-BHB + C5-Vorstufe) aktiviert zusätzlich die körpereigene Ketonproduktion — einmalig in Europa.",
    warnung: "Kein Ersatz für echte Keto-Ernährung. Ergänzung, kein Shortcut.",
    link: "https://CarbBye.pruvit.com",
  },
  {
    name: "Alpha-Liponsäure (ALA)",
    emoji: "🔋",
    prioritaet: "pro",
    ziele: ["abnehmen", "leistung"],
    warum: "Starkes Antioxidans. Verbessert Insulinsensitivität, schützt Mitochondrien und regeneriert andere Antioxidantien (Vitamin C, E, Glutathion).",
    dosierung: "300–600 mg täglich",
    form: "R-ALA (aktive Form) ist deutlich wirksamer als Racemat",
    wann: "Nüchtern oder zwischen Mahlzeiten — Nahrung reduziert Aufnahme",
    tipp: "R-ALA ist teurer aber 3–4x wirksamer als reguläre ALA. Lohnt sich.",
    warnung: "Kann Blutzucker senken — bei Diabetes mit Arzt absprechen.",
  },
  {
    name: "NAD+ / NMN",
    emoji: "🧬",
    prioritaet: "pro",
    ziele: ["energie", "leistung"],
    warum: "NAD+ sinkt mit dem Alter. Keto erhöht NAD+ bereits natürlich — NMN/NR als Supplement potenziert den Effekt. Mitochondriale Gesundheit, Energie, Longevity.",
    dosierung: "250–500 mg NMN oder NR täglich",
    form: "NMN oder NR (Nicotinamid-Ribosid)",
    wann: "Morgens nüchtern",
    tipp: "Relativ teuer — erst die Basis-Supplements sichern, dann dieses ergänzen.",
  },
];

const PRIORITAET_CONFIG = {
  pflicht: { label: "Muss-Haves", farbe: "#22c55e", bg: "#0d2018", border: "#166534", emoji: "✅" },
  wichtig: { label: "Sehr empfohlen", farbe: "#f59e0b", bg: "#1a1200", border: "#854d0e", emoji: "⭐" },
  optional: { label: "Sinnvoll", farbe: "#3b82f6", bg: "#0a1020", border: "#1e3a5f", emoji: "💡" },
  pro: { label: "Für Profis", farbe: "#8b5cf6", bg: "#0f0a1a", border: "#4c1d95", emoji: "⚗️" },
};

const ZIEL_FILTER: { key: Ziel; label: string; emoji: string }[] = [
  { key: "alle", label: "Alle", emoji: "📋" },
  { key: "keto-grippe", label: "Keto-Grippe", emoji: "🤒" },
  { key: "energie", label: "Energie", emoji: "⚡" },
  { key: "schlaf", label: "Schlaf", emoji: "😴" },
  { key: "abnehmen", label: "Abnehmen", emoji: "⚖️" },
  { key: "leistung", label: "Leistung", emoji: "💪" },
];

export default function SupplementePage() {
  const [zielFilter, setZielFilter] = useState<Ziel>("alle");
  const [offen, setOffen] = useState<string | null>(null);
  const [merkliste, setMerkliste] = useState<Set<string>>(new Set());

  const gefiltert = SUPPLEMENTE.filter(s =>
    zielFilter === "alle" || s.ziele.includes(zielFilter) || s.ziele.includes("alle")
  );

  const geordnet = (["pflicht", "wichtig", "optional", "pro"] as Prioritaet[]).map(p => ({
    prioritaet: p,
    items: gefiltert.filter(s => s.prioritaet === p),
  })).filter(g => g.items.length > 0);

  function toggleMerkliste(name: string) {
    setMerkliste(prev => {
      const neu = new Set(prev);
      if (neu.has(name)) neu.delete(name); else neu.add(name);
      return neu;
    });
  }

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>
      <h1 className="text-xl font-bold mb-1">💊 Supplement Guide</h1>
      <p className="text-sm mb-5" style={{ color: "#666" }}>Was du auf Keto wirklich brauchst — und was optional ist.</p>

      {/* Prioritäts-Übersicht */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {(["pflicht", "wichtig", "optional", "pro"] as Prioritaet[]).map(p => {
          const c = PRIORITAET_CONFIG[p];
          const count = SUPPLEMENTE.filter(s => s.prioritaet === p).length;
          return (
            <div key={p} className="rounded-2xl p-3" style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}>
              <div className="text-lg mb-0.5">{c.emoji}</div>
              <div className="text-xs font-bold" style={{ color: c.farbe }}>{c.label}</div>
              <div className="text-xs mt-0.5" style={{ color: "#555" }}>{count} Supplemente</div>
            </div>
          );
        })}
      </div>

      {/* Merkliste */}
      {merkliste.size > 0 && (
        <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-xs font-semibold mb-2" style={{ color: "#22c55e" }}>🛒 Deine Einkaufsliste ({merkliste.size})</div>
          <div className="flex flex-wrap gap-2">
            {Array.from(merkliste).map(name => (
              <button key={name} onClick={() => toggleMerkliste(name)}
                className="px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
                style={{ backgroundColor: "#2a2a2a", color: "#ccc" }}>
                {name} <span style={{ color: "#ef4444" }}>✕</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ziel-Filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {ZIEL_FILTER.map(z => (
          <button key={z.key} onClick={() => setZielFilter(z.key)}
            className="flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium"
            style={{ backgroundColor: zielFilter === z.key ? "#22c55e" : "#1a1a1a", color: zielFilter === z.key ? "#000" : "#888" }}>
            {z.emoji} {z.label}
          </button>
        ))}
      </div>

      {/* Supplement-Listen nach Priorität */}
      {geordnet.map(({ prioritaet, items }) => {
        const c = PRIORITAET_CONFIG[prioritaet];
        return (
          <div key={prioritaet} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{c.emoji}</span>
              <span className="text-sm font-bold" style={{ color: c.farbe }}>{c.label}</span>
              <div className="flex-1 h-px" style={{ backgroundColor: c.border }} />
            </div>
            <div className="space-y-2">
              {items.map(s => {
                const istOffen = offen === s.name;
                const gemerkt = merkliste.has(s.name);
                return (
                  <div key={s.name} className="rounded-2xl overflow-hidden"
                    style={{ backgroundColor: "#1a1a1a", border: `1px solid ${istOffen ? c.farbe + "44" : "transparent"}` }}>
                    <button className="w-full px-4 py-3 text-left flex items-center gap-3"
                      onClick={() => setOffen(istOffen ? null : s.name)}>
                      <span className="text-2xl">{s.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{s.name}</div>
                        <div className="text-xs mt-0.5 truncate" style={{ color: "#555" }}>{s.dosierung}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={e => { e.stopPropagation(); toggleMerkliste(s.name); }}
                          className="text-lg" title="Zur Einkaufsliste">
                          {gemerkt ? "✅" : "🛒"}
                        </button>
                        <span style={{ color: "#333", fontSize: 12 }}>{istOffen ? "▲" : "▼"}</span>
                      </div>
                    </button>

                    {istOffen && (
                      <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: "#222" }}>
                        <div className="pt-3">
                          <div className="text-xs font-semibold mb-1" style={{ color: c.farbe }}>WARUM</div>
                          <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>{s.warum}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl p-3" style={{ backgroundColor: "#2a2a2a" }}>
                            <div className="text-xs font-semibold mb-1" style={{ color: "#555" }}>DOSIERUNG</div>
                            <div className="text-xs" style={{ color: "#ccc" }}>{s.dosierung}</div>
                          </div>
                          <div className="rounded-xl p-3" style={{ backgroundColor: "#2a2a2a" }}>
                            <div className="text-xs font-semibold mb-1" style={{ color: "#555" }}>WANN</div>
                            <div className="text-xs" style={{ color: "#ccc" }}>{s.wann}</div>
                          </div>
                        </div>
                        <div className="rounded-xl p-3" style={{ backgroundColor: "#2a2a2a" }}>
                          <div className="text-xs font-semibold mb-1" style={{ color: "#555" }}>BESTE FORM</div>
                          <div className="text-xs" style={{ color: "#ccc" }}>{s.form}</div>
                        </div>
                        {s.tipp && (
                          <div className="rounded-xl p-3" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
                            <div className="text-xs font-semibold mb-1" style={{ color: "#22c55e" }}>💡 TIPP</div>
                            <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>{s.tipp}</p>
                          </div>
                        )}
                        {s.warnung && (
                          <div className="rounded-xl p-3" style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d44" }}>
                            <div className="text-xs font-semibold mb-1" style={{ color: "#ef4444" }}>⚠ ACHTUNG</div>
                            <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>{s.warnung}</p>
                          </div>
                        )}
                        {s.link && (
                          <a href={s.link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm"
                            style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", color: "#fff" }}>
                            ⚡ Jetzt entdecken →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Einnahme-Zeitplan */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="text-xs font-semibold mb-4" style={{ color: "#555" }}>🕐 OPTIMALER TAGESPLAN</div>
        {[
          { zeit: "Morgens nüchtern", items: ["Salzwasser (Natrium)", "MCT-Öl im Kaffee", "Vitamin D3+K2", "NMN/ALA (optional)"] },
          { zeit: "Mit Frühstück", items: ["Omega-3 Fischöl", "B-Komplex", "Zink"] },
          { zeit: "Vor dem Training", items: ["L-Carnitin (30–60 min vorher)", "Exogene Ketone (optional)", "Kreatin"] },
          { zeit: "Zu fettreichen Mahlzeiten", items: ["Verdauungsenzyme", "Berberin"] },
          { zeit: "Abends / vor dem Schlafen", items: ["Magnesium Glycinat (300–400 mg)", "Glycin (3 g)", "Kollagen"] },
        ].map((block, i) => (
          <div key={i} className="flex gap-3 mb-3 last:mb-0">
            <div className="w-28 flex-shrink-0">
              <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>{block.zeit}</span>
            </div>
            <div className="flex-1">
              {block.items.map((item, j) => (
                <div key={j} className="text-xs py-0.5" style={{ color: "#888" }}>· {item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: "#111" }}>
        <p className="text-xs leading-relaxed" style={{ color: "#444" }}>
          ⚠ Dieser Guide dient der allgemeinen Information und ersetzt keine medizinische Beratung. Bei Erkrankungen, Schwangerschaft oder Medikamenteneinnahme immer einen Arzt konsultieren, bevor du neue Supplemente einnimmst.
        </p>
      </div>
    </main>
  );
}
