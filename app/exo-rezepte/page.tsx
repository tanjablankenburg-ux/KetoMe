"use client";
import { useState } from "react";
import Link from "next/link";

type Schwierigkeit = "Einfach" | "Mittel" | "Aufwendig";
type Kategorie = "Kuchen & Torten" | "Eis & Frozen" | "Drinks" | "Snacks";

type Rezept = {
  id: string;
  name: string;
  emoji: string;
  kategorie: Kategorie;
  ketonGeschmack: string;
  nettoKh: number;
  portionen: number;
  Zeit: string;
  schwierigkeit: Schwierigkeit;
  beschreibung: string;
  zutaten: { menge: string; zutat: string; hinweis?: string }[];
  schritte: string[];
  tipp: string;
  highlight: string;
};

const REZEPTE: Rezept[] = [
  {
    id: "erdbeer-sahnetorte",
    name: "Fake Erdbeer-Sahnetorte",
    emoji: "🍓",
    kategorie: "Kuchen & Torten",
    ketonGeschmack: "Erdbeer",
    nettoKh: 2,
    portionen: 10,
    Zeit: "30 Min + 4h Kuehlen",
    schwierigkeit: "Einfach",
    beschreibung: "Der WOW-Effekt auf jeder Party — keiner glaubt dass da keine echten Erdbeeren drin sind. Cremig, fruchtig, maechtig — und fast null Kohlenhydrate.",
    highlight: "Kein Backen · Keine echten Erdbeeren · 2g Netto-KH pro Stueck",
    zutaten: [
      { menge: "200g",  zutat: "Mandelmehl" },
      { menge: "50g",   zutat: "Butter (geschmolzen)" },
      { menge: "2 EL",  zutat: "Erythrit" },
      { menge: "500g",  zutat: "Mascarpone" },
      { menge: "400ml", zutat: "Sahne (kalt, zum Schlagen)" },
      { menge: "2-3 Portionen", zutat: "Exogene Ketone Erdbeer-Geschmack", hinweis: "Gibt Farbe, Suesse und den fruchtigen Geschmack" },
      { menge: "2 TL",  zutat: "Vanilleextrakt" },
      { menge: "3 Bl.", zutat: "Gelatine (weiss eingeweicht)" },
      { menge: "nach Geschmack", zutat: "Stevia oder Erythrit" },
    ],
    schritte: [
      "Mandelmehl, geschmolzene Butter und Erythrit mischen. In eine Springform (24cm) druecken und 15 Min kalt stellen.",
      "Gelatine in kaltem Wasser einweichen (ca. 5 Min). Ausdrucken und in 3 EL heissem Wasser aufloesen.",
      "Mascarpone mit Vanilleextrakt und den exogenen Ketonen (Erdbeer) cremig ruehren. Masse sollte Zimmertemperatur haben (max. 30°C). Suesse nach Geschmack anpassen.",
      "Die aufgeloeste Gelatine kurz abkuehlen lassen, dann in die Mascarpone-Masse einruehren.",
      "Sahne steif schlagen und vorsichtig unterheben.",
      "Masse auf den Mandelboden giessen, glatt streichen.",
      "Mindestens 4 Stunden kuehlstellen — am besten ueber Nacht.",
      "Vor dem Servieren aus der Form loesen. Optional: mit etwas Erythrit-Puderzucker bestauben.",
    ],
    tipp: "Die exogenen Ketone geben nicht nur Geschmack sondern auch eine schoene rosa Farbe — ganz ohne Lebensmittelfarbe. Je nach Marke und Geschmacksrichtung variiert die Intensitaet.",
  },
  {
    id: "keton-eiscreme",
    name: "Erdbeer-Keton-Eis",
    emoji: "🍦",
    kategorie: "Eis & Frozen",
    ketonGeschmack: "Erdbeer",
    nettoKh: 1.5,
    portionen: 6,
    Zeit: "10 Min + 4h Einfrieren",
    schwierigkeit: "Einfach",
    beschreibung: "Cremiges Eis ohne Eismaschine, ohne Zucker, ohne schlechtes Gewissen. Perfekt fuer heisse Sommertage.",
    highlight: "Keine Eismaschine · Nur 4 Zutaten · 1.5g Netto-KH",
    zutaten: [
      { menge: "400ml", zutat: "Sahne (kalt)" },
      { menge: "200g",  zutat: "Frischkaese" },
      { menge: "2 Portionen", zutat: "Exogene Ketone Erdbeer-Geschmack" },
      { menge: "2 EL",  zutat: "Erythrit (optional)" },
    ],
    schritte: [
      "Sahne steif schlagen.",
      "Frischkaese mit den exogenen Ketonen glatt ruehren. Erythrit nach Geschmack hinzufuegen.",
      "Geschlagene Sahne unterheben.",
      "In Silikonfoermchen oder eine Kastenform fuellen.",
      "4 Stunden einfrieren — fertig.",
      "10 Minuten vor dem Servieren herausnehmen damit es cremiger wird.",
    ],
    tipp: "In Muffinformen einfrieren — perfekte Portionskontrolle und sieht elegant aus. Mit einem Zahnstocher als Eis-am-Stiel-Form.",
  },
  {
    id: "keton-shake",
    name: "Creamy Keton-Shake",
    emoji: "🥤",
    kategorie: "Drinks",
    ketonGeschmack: "nach Wahl",
    nettoKh: 1,
    portionen: 1,
    Zeit: "3 Min",
    schwierigkeit: "Einfach",
    beschreibung: "Satt, energiegeladen und in 3 Minuten fertig. Perfektes Fruehstueck oder Pre-Workout auf Keto.",
    highlight: "3 Minuten · Kein Hunger bis Mittag · Ketone + MCT",
    zutaten: [
      { menge: "300ml", zutat: "Mandelmilch (ungesuesst)" },
      { menge: "1 Portion", zutat: "Exogene Ketone (Wunschgeschmack)" },
      { menge: "1 EL",  zutat: "MCT-Oel" },
      { menge: "2 EL",  zutat: "Mandelmus" },
      { menge: "100ml", zutat: "Sahne" },
      { menge: "4-5",   zutat: "Eiswuerfel" },
    ],
    schritte: [
      "Alle Zutaten in einen Mixer geben.",
      "30 Sekunden mixen bis alles cremig ist.",
      "In ein hohes Glas giessen und sofort geniessen.",
    ],
    tipp: "MCT-Oel erhoht die Ketonproduktion zusaetzlich — zusammen mit den exogenen Ketonen bekommst du einen doppelten Energie-Schub. Perfekt vor dem Sport.",
  },
  {
    id: "keton-cheesecake",
    name: "Zitronen-Keton-Cheesecake (No-Bake)",
    emoji: "🍋",
    kategorie: "Kuchen & Torten",
    ketonGeschmack: "Zitrone",
    nettoKh: 2.5,
    portionen: 8,
    Zeit: "25 Min + 3h Kuehlen",
    schwierigkeit: "Einfach",
    beschreibung: "Frisch, cremig, sommerlich — und kein Backen notwendig. Der Keton-Cheesecake der alle uberzeugt.",
    highlight: "No-Bake · Frischer Zitronengeschmack · Ohne echte Zitronenmasse",
    zutaten: [
      { menge: "150g",  zutat: "Mandelmehl" },
      { menge: "40g",   zutat: "Butter (geschmolzen)" },
      { menge: "400g",  zutat: "Frischkaese (Zimmertemperatur)" },
      { menge: "200ml", zutat: "Sahne" },
      { menge: "2 Portionen", zutat: "Exogene Ketone Zitronen-Geschmack" },
      { menge: "1 TL",  zutat: "Zitronenschale (optional, verstaerkt)" },
      { menge: "3 EL",  zutat: "Erythrit" },
      { menge: "2 Bl.", zutat: "Gelatine" },
    ],
    schritte: [
      "Mandelmehl und Butter mischen, in eine Form druecken, kuehlstellen.",
      "Gelatine einweichen und in etwas warmem Wasser aufloesen.",
      "Frischkaese mit Erythrit und den Zitronen-Ketonen cremig schlagen. Frischkaese sollte Zimmertemperatur haben — nie heiss.",
      "Sahne halb steif schlagen, unter die Frischkaese-Masse heben.",
      "Gelatine einarbeiten.",
      "Auf den Boden giessen, mindestens 3 Stunden kuehlen.",
    ],
    tipp: "Mit einem Hauch echter Zitronenschale (nur das Gelbe, nicht das Weisse) bekommt der Cheesecake eine noch frischere Note — kostet fast keine Kohlenhydrate extra.",
  },
  {
    id: "erdbeer-gummibaerchen",
    name: "Erdbeer-Keton-Gummibaerchen",
    emoji: "🐻",
    kategorie: "Snacks",
    ketonGeschmack: "Erdbeer",
    nettoKh: 0,
    portionen: 50,
    Zeit: "10 Min + 1h Kuehlen",
    schwierigkeit: "Einfach",
    beschreibung: "Echte Gummibaerchen-Konsistenz, echter Erdbeergeschmack — aber komplett ohne Zucker und mit Keton-Boost. Perfekter Snack fuer zwischendurch oder als Mitbringsel.",
    highlight: "0g Netto-KH · Echter Gummi-Biss · Kinder lieben sie auch",
    zutaten: [
      { menge: "250ml", zutat: "Wasser (oder ungesuesste Kokosmilch fuer cremigere Variante)" },
      { menge: "2 Portionen", zutat: "Exogene Ketone Erdbeer-Geschmack", hinweis: "Gibt Farbe, Suesse und Geschmack" },
      { menge: "6-8 Bl.", zutat: "Gelatine (weiss) — je nach gewuenschter Haerte", hinweis: "6 Bl. = weich, 8 Bl. = fester Biss" },
      { menge: "nach Geschmack", zutat: "Stevia oder Erythrit" },
    ],
    schritte: [
      "Gelatine in kaltem Wasser ca. 5 Min einweichen.",
      "Wasser leicht erwaermen (nicht kochen — max. 60 Grad), vom Herd nehmen.",
      "Gelatine ausdrucken und im warmen Wasser aufloesen.",
      "Wasser auf unter 40°C abkuehlen lassen — erst dann die exogenen Ketone einruehren damit die Wirkstoffe erhalten bleiben. Suesse abschmecken.",
      "Masse in Gummibaerchen-Silikonformen giessen. Alternativ: flach in eine Form giessen und spater in Wurfel schneiden.",
      "Mindestens 1 Stunde kuehlstellen bis fest.",
      "Aus der Form loesen und geniessen — kuehl lagern.",
    ],
    tipp: "Die Mengen sind ein Startpunkt — passe Gelatine und Ketone nach deinem Geschmack an. Mit Kokosmilch statt Wasser werden die Baerchen cremiger und etwas kalorienreicher aber noch leckerer.",
  },
  {
    id: "kaffee-energy-schokolade",
    name: "Kaffee-Energy-Schokolade",
    emoji: "☕",
    kategorie: "Snacks",
    ketonGeschmack: "Kaffee / Nat's",
    nettoKh: 1.5,
    portionen: 16,
    Zeit: "15 Min + 30 Min Kuehlen",
    schwierigkeit: "Einfach",
    beschreibung: "Selbstgemachte Schokolade mit echtem Koffein-Kick durch Kaffee-Ketone — energiegeladen, bitter-suess, mit Keton-Boost. Ein Riegelchen reicht fuer Stunden.",
    highlight: "Koffein + Ketone · 1.5g Netto-KH · Wach ohne Crash",
    zutaten: [
      { menge: "150g",  zutat: "Zartbitterschokolade 85%+" },
      { menge: "2 EL",  zutat: "Kokosoel" },
      { menge: "2 Portionen", zutat: "Exogene Ketone Kaffee-Geschmack (z.B. Nat's)", hinweis: "Gibt den Koffein-Kick und Keto-Energie" },
      { menge: "1 TL",  zutat: "Instantkaffee oder Espressopulver (optional, verstaerkt)" },
      { menge: "nach Geschmack", zutat: "Meersalz, Mandelblattchen oder Kakaoniebs zum Bestreuen" },
    ],
    schritte: [
      "Schokolade grob hacken und mit Kokosoel im Wasserbad (oder Mikrowelle in 30-Sek.-Intervallen) schmelzen.",
      "Vom Herd nehmen und abkuehlen lassen bis die Masse unter 40°C ist — das ist wichtig damit die Wirkstoffe der Ketone erhalten bleiben.",
      "Exogene Ketone und optional Instantkaffee einruehren.",
      "Masse auf Backpapier oder in eine Silikonform giessen — ca. 5mm dick.",
      "Nach Wunsch Meersalz, Mandeln oder Kakaonibs drueberstreuen.",
      "30 Min kuehlstellen bis fest, dann in Stuecke brechen oder schneiden.",
    ],
    tipp: "Wichtig: Ketone erst unter 40 Grad einruehren — zu viel Hitze kann die Wirkstoffe beeinflussen. Die Schokolade haelt im Kuehlschrank ca. 2 Wochen.",
  },
  {
    id: "keton-pralinen",
    name: "Keton-Schokoladenpralinen",
    emoji: "🍫",
    kategorie: "Snacks",
    ketonGeschmack: "nach Wahl",
    nettoKh: 1,
    portionen: 20,
    Zeit: "20 Min + 1h Kuehlen",
    schwierigkeit: "Einfach",
    beschreibung: "Handgemachte Pralinen die aussehen wie vom Chocolatier — und gleichzeitig Ketone liefern. Perfektes Mitbringsel.",
    highlight: "Mitbringsel-Garantie · 1g Netto-KH pro Praline · Keton-Boost",
    zutaten: [
      { menge: "200g",  zutat: "Zartbitterschokolade 85%+" },
      { menge: "100ml", zutat: "Sahne" },
      { menge: "1-2 Portionen", zutat: "Exogene Ketone (Wunschgeschmack)" },
      { menge: "1 EL",  zutat: "Kokosoel" },
      { menge: "nach Geschmack", zutat: "Meersalz, Mandelblattchen oder Kokos zum Dekorieren" },
    ],
    schritte: [
      "Schokolade grob hacken.",
      "Sahne erhitzen (nicht kochen), vom Herd nehmen.",
      "Schokolade und Kokosoel in die heisse Sahne geben, 2 Min stehen lassen, dann glatt ruehren.",
      "Masse auf unter 40°C abkuehlen lassen — erst dann die exogenen Ketone unterruehren damit die Wirkstoffe erhalten bleiben.",
      "Masse 1 Stunde kuehlstellen bis sie fest genug ist zum Formen.",
      "Mit einem Teeloeffel kleine Kugeln formen, nach Wahl in Kakao, Kokos oder Mandelblattchen waelzen.",
      "Bis zum Servieren kalt halten.",
    ],
    tipp: "Die exogenen Ketone wirken als natuarlicher Geschmacksverstaerker — Erdbeer-Keton plus Zartbitterschokolade ist eine sensationelle Kombination.",
  },
];

const KATEGORIEN: Kategorie[] = ["Kuchen & Torten", "Eis & Frozen", "Drinks", "Snacks"];

export default function ExoRezeptePage() {
  const [aktivesRezept, setAktivesRezept] = useState<string | null>(null);
  const [katFilter, setKatFilter] = useState<Kategorie | "alle">("alle");

  const gefiltert = katFilter === "alle" ? REZEPTE : REZEPTE.filter(r => r.kategorie === katFilter);

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      {/* Hero */}
      <div className="rounded-2xl p-5 mb-5" style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0d1520 100%)", border: "1px solid #8b5cf655" }}>
        <div className="text-4xl mb-2">⚡🍓</div>
        <h1 className="text-2xl font-black mb-2">Exo-Keton Rezepte</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#aaa" }}>
          Rezepte die exogene Ketone als Zutat nutzen — als Geschmacksgeber, Suessungsmittel und Energie-Boost gleichzeitig. Fast null Kohlenhydrate, voller Genuss.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { wert: `${REZEPTE.length}`,  label: "Rezepte" },
            { wert: "< 3g", label: "Netto-KH" },
            { wert: "⚡",   label: "Keton-Boost" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: "#ffffff0a" }}>
              <div className="font-black text-lg" style={{ color: "#c4b5fd" }}>{s.wert}</div>
              <div className="text-[10px] mt-0.5" style={{ color: "#555" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Temperatur-Hinweis */}
      <div className="rounded-2xl p-4 mb-4 flex items-start gap-3" style={{ backgroundColor: "#1a0a00", border: "1px solid #f59e0b44" }}>
        <span className="text-xl flex-shrink-0">🌡️</span>
        <div>
          <div className="text-xs font-bold mb-1" style={{ color: "#f59e0b" }}>WICHTIG: Ketone nicht zu stark erhitzen!</div>
          <p className="text-xs leading-relaxed" style={{ color: "#888" }}>
            Exogene Ketone (BHB-Salze) sollten nie uber 40°C erhitzt werden — hohere Temperaturen konnen die Wirkstoffe beeintrachtigen. Ketone immer erst einruhren wenn die Masse abgekuhlt ist.
          </p>
        </div>
      </div>

      {/* Kategorie-Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button onClick={() => setKatFilter("alle")}
          className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ backgroundColor: katFilter === "alle" ? "#8b5cf622" : "#1a1a1a", color: katFilter === "alle" ? "#c4b5fd" : "#555", border: katFilter === "alle" ? "1px solid #8b5cf644" : "none" }}>
          Alle ({REZEPTE.length})
        </button>
        {KATEGORIEN.map(k => {
          const anz = REZEPTE.filter(r => r.kategorie === k).length;
          return (
            <button key={k} onClick={() => setKatFilter(katFilter === k ? "alle" : k)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ backgroundColor: katFilter === k ? "#8b5cf622" : "#1a1a1a", color: katFilter === k ? "#c4b5fd" : "#555", border: katFilter === k ? "1px solid #8b5cf644" : "none" }}>
              {k} ({anz})
            </button>
          );
        })}
      </div>

      {/* Rezept-Karten */}
      <div className="space-y-3">
        {gefiltert.map(r => (
          <div key={r.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
            {/* Karten-Header */}
            <button className="w-full p-4 text-left" onClick={() => setAktivesRezept(aktivesRezept === r.id ? null : r.id)}>
              <div className="flex items-start gap-3">
                <div className="text-4xl flex-shrink-0">{r.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-black text-base">{r.name}</span>
                  </div>
                  <div className="text-xs mb-2" style={{ color: "#8b5cf6" }}>{r.highlight}</div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#0d2018", color: "#22c55e" }}>
                      {r.nettoKh}g Netto-KH
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1a0a2e", color: "#c4b5fd" }}>
                      ⚡ {r.ketonGeschmack}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#2a2a2a", color: "#555" }}>
                      {r.Zeit}
                    </span>
                  </div>
                </div>
                <span className="text-xs flex-shrink-0 mt-1" style={{ color: "#333" }}>{aktivesRezept === r.id ? "▲" : "▼"}</span>
              </div>
            </button>

            {/* Ausklapp-Inhalt */}
            {aktivesRezept === r.id && (
              <div className="px-4 pb-5 border-t space-y-4" style={{ borderColor: "#2a2a2a" }}>
                <p className="text-sm leading-relaxed pt-3" style={{ color: "#aaa" }}>{r.beschreibung}</p>

                {/* Meta */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Portionen",    wert: String(r.portionen) },
                    { label: "Zeit",         wert: r.Zeit.split("+")[0].trim() },
                    { label: "Schwierigkeit",wert: r.schwierigkeit },
                  ].map(m => (
                    <div key={m.label} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: "#2a2a2a" }}>
                      <div className="font-bold text-sm" style={{ color: "#c4b5fd" }}>{m.wert}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "#555" }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Zutaten */}
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>ZUTATEN</div>
                  <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
                    {r.zutaten.map((z, i) => (
                      <div key={i} className="flex items-start gap-3 px-3 py-2.5"
                        style={{ borderBottom: i < r.zutaten.length - 1 ? "1px solid #333" : "none",
                          backgroundColor: z.zutat.includes("Exogene Ketone") ? "#1a0a2e" : "transparent" }}>
                        <span className="font-semibold text-xs w-20 flex-shrink-0" style={{ color: "#888" }}>{z.menge}</span>
                        <div>
                          <span className="text-sm" style={{ color: z.zutat.includes("Exogene Ketone") ? "#c4b5fd" : "#ccc" }}>
                            {z.zutat.includes("Exogene Ketone") ? "⚡ " : ""}{z.zutat}
                          </span>
                          {z.hinweis && <div className="text-[10px] mt-0.5" style={{ color: "#555" }}>{z.hinweis}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schritte */}
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>ZUBEREITUNG</div>
                  <div className="space-y-2">
                    {r.schritte.map((s, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: "#8b5cf622", color: "#8b5cf6" }}>
                          {i + 1}
                        </div>
                        <p className="text-sm leading-snug pt-0.5" style={{ color: "#aaa" }}>{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tipp */}
                <div className="rounded-xl p-3" style={{ backgroundColor: "#1a0a2e", border: "1px solid #8b5cf633" }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: "#8b5cf6" }}>💡 TIPP</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#999" }}>{r.tipp}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mehr Rezepte kommen */}
      <div className="mt-4 rounded-2xl p-4 text-center" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
        <div className="text-2xl mb-2">🍰</div>
        <div className="font-semibold text-sm mb-1">Mehr Rezepte kommen bald!</div>
        <p className="text-xs" style={{ color: "#555" }}>Wir erweitern die Sammlung laufend. Hast du ein Lieblingsrezept mit exogenen Ketonen? Teile es in der Community.</p>
      </div>

      {/* Shop CTA */}
      <a href="https://CarbBye.pruvit.com" target="_blank" rel="noopener noreferrer"
        className="mt-4 flex items-center gap-4 rounded-2xl p-4"
        style={{ background: "linear-gradient(135deg, #1a0a2e, #0d1520)", border: "1px solid #8b5cf655" }}>
        <span className="text-3xl">⚡</span>
        <div className="flex-1">
          <div className="font-bold text-sm" style={{ color: "#c4b5fd" }}>Exogene Ketone fur deine Rezepte</div>
          <div className="text-xs mt-0.5" style={{ color: "#666" }}>R-BHB · L-BHB · C5 — verschiedene Geschmacksrichtungen</div>
        </div>
        <span className="text-xs font-bold" style={{ color: "#8b5cf6" }}>→</span>
      </a>
    </main>
  );
}
