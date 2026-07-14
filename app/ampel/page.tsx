"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

type Ampel = "gruen" | "gelb" | "rot";
type Lebensmittel = {
  name: string;
  kh: number;
  kategorie: string;
  ampel: Ampel;
  hinweis?: string;
};

const LEBENSMITTEL: Lebensmittel[] = [
  // FLEISCH & GEFLÜGEL
  { name: "Hähnchenbrust",      kh: 0,   kategorie: "Fleisch",        ampel: "gruen" },
  { name: "Rindfleisch",        kh: 0,   kategorie: "Fleisch",        ampel: "gruen" },
  { name: "Schweinefleisch",    kh: 0,   kategorie: "Fleisch",        ampel: "gruen" },
  { name: "Lammfleisch",        kh: 0,   kategorie: "Fleisch",        ampel: "gruen" },
  { name: "Speck / Bacon",      kh: 0.5, kategorie: "Fleisch",        ampel: "gruen" },
  { name: "Salami",             kh: 1,   kategorie: "Fleisch",        ampel: "gruen" },
  { name: "Prosciutto",         kh: 0,   kategorie: "Fleisch",        ampel: "gruen" },
  { name: "Wurst (ungewuerzt)", kh: 1,   kategorie: "Fleisch",        ampel: "gruen" },
  { name: "Hackfleisch",        kh: 0,   kategorie: "Fleisch",        ampel: "gruen" },
  { name: "Leberwurst",         kh: 2,   kategorie: "Fleisch",        ampel: "gruen" },
  { name: "Putenbrustaufschnitt",kh:0.5, kategorie: "Fleisch",        ampel: "gruen" },
  { name: "Entenbrust",         kh: 0,   kategorie: "Fleisch",        ampel: "gruen" },

  // FISCH & MEERESFRÜCHTE
  { name: "Lachs",              kh: 0,   kategorie: "Fisch",          ampel: "gruen" },
  { name: "Thunfisch",          kh: 0,   kategorie: "Fisch",          ampel: "gruen" },
  { name: "Makrele",            kh: 0,   kategorie: "Fisch",          ampel: "gruen" },
  { name: "Hering",             kh: 0,   kategorie: "Fisch",          ampel: "gruen" },
  { name: "Garnelen",           kh: 0.5, kategorie: "Fisch",          ampel: "gruen" },
  { name: "Kabeljau",           kh: 0,   kategorie: "Fisch",          ampel: "gruen" },
  { name: "Sardinen",           kh: 0,   kategorie: "Fisch",          ampel: "gruen" },
  { name: "Forelle",            kh: 0,   kategorie: "Fisch",          ampel: "gruen" },
  { name: "Muscheln",           kh: 3.5, kategorie: "Fisch",          ampel: "gelb",  hinweis: "Masse beachten" },
  { name: "Tintenfisch",        kh: 3,   kategorie: "Fisch",          ampel: "gelb" },
  { name: "Surimi / Krebsfleisch-Imitation", kh: 14, kategorie: "Fisch", ampel: "rot", hinweis: "Viel Staerke" },

  // EIER & MILCHPRODUKTE
  { name: "Eier",               kh: 0.5, kategorie: "Eier & Milch",   ampel: "gruen" },
  { name: "Butter",             kh: 0.5, kategorie: "Eier & Milch",   ampel: "gruen" },
  { name: "Sahne (30%+)",       kh: 2.8, kategorie: "Eier & Milch",   ampel: "gruen" },
  { name: "Frischkaese",        kh: 2.5, kategorie: "Eier & Milch",   ampel: "gruen" },
  { name: "Mascarpone",         kh: 4,   kategorie: "Eier & Milch",   ampel: "gruen" },
  { name: "Cheddar",            kh: 0.5, kategorie: "Eier & Milch",   ampel: "gruen" },
  { name: "Gouda",              kh: 0.5, kategorie: "Eier & Milch",   ampel: "gruen" },
  { name: "Mozzarella",         kh: 1,   kategorie: "Eier & Milch",   ampel: "gruen" },
  { name: "Parmesan",           kh: 0,   kategorie: "Eier & Milch",   ampel: "gruen" },
  { name: "Feta",               kh: 1,   kategorie: "Eier & Milch",   ampel: "gruen" },
  { name: "Brie / Camembert",   kh: 0.5, kategorie: "Eier & Milch",   ampel: "gruen" },
  { name: "Ghee",               kh: 0,   kategorie: "Eier & Milch",   ampel: "gruen" },
  { name: "Griechy. Joghurt (Vollfett)", kh: 4, kategorie: "Eier & Milch", ampel: "gruen", hinweis: "Menge im Blick behalten" },
  { name: "Kuhmilch (3,5%)",    kh: 4.8, kategorie: "Eier & Milch",   ampel: "gelb",  hinweis: "Max. 100ml" },
  { name: "Haltbarmilch",       kh: 4.8, kategorie: "Eier & Milch",   ampel: "gelb",  hinweis: "Wie Kuhmilch" },
  { name: "Magermilch",         kh: 5,   kategorie: "Eier & Milch",   ampel: "gelb",  hinweis: "Wenig Fett, mehr KH" },
  { name: "Joghurt (mager)",    kh: 6,   kategorie: "Eier & Milch",   ampel: "rot",   hinweis: "Zu viel KH" },
  { name: "Fruchtjoghurt",      kh: 13,  kategorie: "Eier & Milch",   ampel: "rot" },
  { name: "Kondensmilch",       kh: 55,  kategorie: "Eier & Milch",   ampel: "rot" },

  // GEMÜSE
  { name: "Spinat",             kh: 1.5, kategorie: "Gemüse",         ampel: "gruen" },
  { name: "Zucchini",           kh: 2,   kategorie: "Gemüse",         ampel: "gruen" },
  { name: "Brokkoli",           kh: 4,   kategorie: "Gemüse",         ampel: "gruen" },
  { name: "Blumenkohl",         kh: 3,   kategorie: "Gemüse",         ampel: "gruen" },
  { name: "Gurke",              kh: 2,   kategorie: "Gemüse",         ampel: "gruen" },
  { name: "Salatguete (Rucola/Feldsalat)", kh: 1, kategorie: "Gemüse", ampel: "gruen" },
  { name: "Radieschen",         kh: 1.5, kategorie: "Gemüse",         ampel: "gruen" },
  { name: "Sellerie",           kh: 2,   kategorie: "Gemüse",         ampel: "gruen" },
  { name: "Spargel",            kh: 2,   kategorie: "Gemüse",         ampel: "gruen" },
  { name: "Avocado",            kh: 1.5, kategorie: "Gemüse",         ampel: "gruen", hinweis: "Viel gesundes Fett" },
  { name: "Gruene Bohnen",      kh: 4,   kategorie: "Gemüse",         ampel: "gruen" },
  { name: "Paprika (rot/gelb)", kh: 6,   kategorie: "Gemüse",         ampel: "gelb",  hinweis: "Menge im Blick behalten" },
  { name: "Tomate",             kh: 3,   kategorie: "Gemüse",         ampel: "gruen" },
  { name: "Gruenkohl",          kh: 6,   kategorie: "Gemüse",         ampel: "gruen" },
  { name: "Rosenkohl",          kh: 5,   kategorie: "Gemüse",         ampel: "gruen" },
  { name: "Kohlrabi",           kh: 4,   kategorie: "Gemüse",         ampel: "gruen" },
  { name: "Lauch / Porree",     kh: 6,   kategorie: "Gemüse",         ampel: "gelb" },
  { name: "Zwiebeln",           kh: 8,   kategorie: "Gemüse",         ampel: "gelb",  hinweis: "Wenig als Wuerze OK" },
  { name: "Moehren",            kh: 7,   kategorie: "Gemüse",         ampel: "gelb",  hinweis: "Max. 50g" },
  { name: "Erbsen",             kh: 11,  kategorie: "Gemüse",         ampel: "rot" },
  { name: "Mais",               kh: 16,  kategorie: "Gemüse",         ampel: "rot" },
  { name: "Kartoffeln",         kh: 17,  kategorie: "Gemüse",         ampel: "rot" },
  { name: "Susskartoffeln",     kh: 17,  kategorie: "Gemüse",         ampel: "rot" },
  { name: "Rote Bete",          kh: 8,   kategorie: "Gemüse",         ampel: "rot",   hinweis: "Hoher Zuckergehalt" },
  { name: "Kurbis",             kh: 6,   kategorie: "Gemüse",         ampel: "gelb",  hinweis: "Sorte beachten" },

  // OBST
  { name: "Avocado (Obst)",     kh: 1.5, kategorie: "Obst",           ampel: "gruen" },
  { name: "Himbeeren",          kh: 5,   kategorie: "Obst",           ampel: "gruen", hinweis: "Max. 100g" },
  { name: "Erdbeeren",          kh: 6,   kategorie: "Obst",           ampel: "gruen", hinweis: "Max. 100g" },
  { name: "Blaubeeren",         kh: 12,  kategorie: "Obst",           ampel: "gelb",  hinweis: "Max. 50g" },
  { name: "Brombeeren",         kh: 5,   kategorie: "Obst",           ampel: "gruen", hinweis: "Max. 100g" },
  { name: "Zitrone (Saft)",     kh: 8,   kategorie: "Obst",           ampel: "gruen", hinweis: "Kleine Menge als Wuerze" },
  { name: "Limette (Saft)",     kh: 8,   kategorie: "Obst",           ampel: "gruen", hinweis: "Kleine Menge als Wuerze" },
  { name: "Oliven",             kh: 1,   kategorie: "Obst",           ampel: "gruen" },
  { name: "Wassermelone",       kh: 7,   kategorie: "Obst",           ampel: "rot",   hinweis: "Hoher Zuckergehalt" },
  { name: "Apfel",              kh: 12,  kategorie: "Obst",           ampel: "rot" },
  { name: "Banane",             kh: 20,  kategorie: "Obst",           ampel: "rot" },
  { name: "Traube",             kh: 16,  kategorie: "Obst",           ampel: "rot" },
  { name: "Mango",              kh: 13,  kategorie: "Obst",           ampel: "rot" },
  { name: "Orange",             kh: 9,   kategorie: "Obst",           ampel: "rot" },
  { name: "Ananas",             kh: 12,  kategorie: "Obst",           ampel: "rot" },

  // NÜSSE & SAMEN
  { name: "Macadamia",          kh: 4,   kategorie: "Nüsse & Samen",  ampel: "gruen" },
  { name: "Pekannuesse",        kh: 4,   kategorie: "Nüsse & Samen",  ampel: "gruen" },
  { name: "Walnuesse",          kh: 7,   kategorie: "Nüsse & Samen",  ampel: "gruen" },
  { name: "Mandeln",            kh: 6,   kategorie: "Nüsse & Samen",  ampel: "gruen", hinweis: "Max. 30g" },
  { name: "Chiasamen",          kh: 2,   kategorie: "Nüsse & Samen",  ampel: "gruen", hinweis: "Netto-KH sehr niedrig" },
  { name: "Flohsamenschalen",   kh: 1,   kategorie: "Nüsse & Samen",  ampel: "gruen", hinweis: "Fast nur Ballaststoffe" },
  { name: "Leinsamen",          kh: 2,   kategorie: "Nüsse & Samen",  ampel: "gruen" },
  { name: "Sonnenblumenkerne",  kh: 11,  kategorie: "Nüsse & Samen",  ampel: "gelb",  hinweis: "Menge beachten" },
  { name: "Kuerbiskerne",       kh: 11,  kategorie: "Nüsse & Samen",  ampel: "gelb",  hinweis: "Menge beachten" },
  { name: "Paranuss",           kh: 4,   kategorie: "Nüsse & Samen",  ampel: "gruen" },
  { name: "Haselnuesse",        kh: 7,   kategorie: "Nüsse & Samen",  ampel: "gruen" },
  { name: "Erdnuesse",          kh: 9,   kategorie: "Nüsse & Samen",  ampel: "gelb",  hinweis: "Botanisch eine Huelsenfrucht" },
  { name: "Cashews",            kh: 27,  kategorie: "Nüsse & Samen",  ampel: "rot" },
  { name: "Pistazien",          kh: 18,  kategorie: "Nüsse & Samen",  ampel: "rot" },

  // FETTE & ÖLE
  { name: "Olivenoel",          kh: 0,   kategorie: "Fette & Öle",    ampel: "gruen" },
  { name: "Kokosoel",           kh: 0,   kategorie: "Fette & Öle",    ampel: "gruen" },
  { name: "MCT-Oel",            kh: 0,   kategorie: "Fette & Öle",    ampel: "gruen", hinweis: "Foerdert Ketonproduktion" },
  { name: "Avocadooel",         kh: 0,   kategorie: "Fette & Öle",    ampel: "gruen" },
  { name: "Butter / Ghee",      kh: 0,   kategorie: "Fette & Öle",    ampel: "gruen" },
  { name: "Schmalz",            kh: 0,   kategorie: "Fette & Öle",    ampel: "gruen" },
  { name: "Sesamoel",           kh: 0,   kategorie: "Fette & Öle",    ampel: "gruen", hinweis: "Sparingly als Wuerze" },
  { name: "Sonnenblumenoel",    kh: 0,   kategorie: "Fette & Öle",    ampel: "gelb",  hinweis: "Omega-6 lastig" },

  // GETRÄNKE
  { name: "Wasser",             kh: 0,   kategorie: "Getränke",       ampel: "gruen" },
  { name: "Kaffee (schwarz)",   kh: 0,   kategorie: "Getränke",       ampel: "gruen" },
  { name: "Tee (ungesuesst)",   kh: 0,   kategorie: "Getränke",       ampel: "gruen" },
  { name: "Bulletproof Coffee", kh: 0.5, kategorie: "Getränke",       ampel: "gruen" },
  { name: "Sprudel",            kh: 0,   kategorie: "Getränke",       ampel: "gruen" },
  { name: "Milch (ungesuesst pflanzl.)", kh: 1, kategorie: "Getränke", ampel: "gruen", hinweis: "Mandel-/Kokosmilch ungesuesst" },
  { name: "Dry Wein (rot/weis)",kh: 2,   kategorie: "Getränke",       ampel: "gelb",  hinweis: "Max. 1 Glas, kein Sekt" },
  { name: "Wodka / Gin / Whisky",kh: 0,  kategorie: "Getränke",       ampel: "gelb",  hinweis: "Unterbricht Ketose kurz" },
  { name: "Light-Getraenke",    kh: 0.5, kategorie: "Getränke",       ampel: "gelb",  hinweis: "Suesstoffe ggf. Insulin" },
  { name: "Orangensaft",        kh: 10,  kategorie: "Getränke",       ampel: "rot" },
  { name: "Apfelsaft",          kh: 11,  kategorie: "Getränke",       ampel: "rot" },
  { name: "Cola / Limo",        kh: 10,  kategorie: "Getränke",       ampel: "rot" },
  { name: "Bier",               kh: 3.5, kategorie: "Getränke",       ampel: "rot",   hinweis: "Hops = Kohlenhydrate" },
  { name: "Energydrinks",       kh: 11,  kategorie: "Getränke",       ampel: "rot" },
  { name: "Smoothies (Frucht)", kh: 12,  kategorie: "Getränke",       ampel: "rot" },

  // GETREIDE & BROT
  { name: "Weizenbrot",         kh: 45,  kategorie: "Getreide",       ampel: "rot" },
  { name: "Vollkornbrot",       kh: 38,  kategorie: "Getreide",       ampel: "rot",   hinweis: "Trotz Ballaststoffe zu viel KH" },
  { name: "Pasta",              kh: 62,  kategorie: "Getreide",       ampel: "rot" },
  { name: "Reis (weis)",        kh: 78,  kategorie: "Getreide",       ampel: "rot" },
  { name: "Couscous",           kh: 60,  kategorie: "Getreide",       ampel: "rot" },
  { name: "Haferflocken",       kh: 58,  kategorie: "Getreide",       ampel: "rot" },
  { name: "Quinoa",             kh: 57,  kategorie: "Getreide",       ampel: "rot" },
  { name: "Keto-Brot (Mandelmehl)", kh: 5, kategorie: "Getreide",    ampel: "gruen", hinweis: "Selbst gebacken mit Mandelmehl" },
  { name: "Mandelmehl",         kh: 5,   kategorie: "Getreide",       ampel: "gruen" },
  { name: "Kokosmehl",          kh: 10,  kategorie: "Getreide",       ampel: "gruen", hinweis: "Viele Ballaststoffe, Netto-KH OK" },

  // SÜSSES & SNACKS
  { name: "Schokolade 85%+",    kh: 14,  kategorie: "Süsses",         ampel: "gruen", hinweis: "Max. 2 Riegel (20g)" },
  { name: "Schokolade 70%",     kh: 20,  kategorie: "Süsses",         ampel: "gelb",  hinweis: "Wenig, selten" },
  { name: "Stevia",             kh: 0,   kategorie: "Süsses",         ampel: "gruen" },
  { name: "Erythrit",           kh: 0,   kategorie: "Süsses",         ampel: "gruen", hinweis: "Kein Einfluss auf Blutzucker" },
  { name: "Xucker (Xylit)",     kh: 10,  kategorie: "Süsses",         ampel: "gruen", hinweis: "Zahlt nur halb auf Blutzucker ein" },
  { name: "Keto-Mousse (Sahne+Kakao)", kh: 4, kategorie: "Süsses",   ampel: "gruen" },
  { name: "Zucker (weis)",      kh: 100, kategorie: "Süsses",         ampel: "rot" },
  { name: "Honig",              kh: 80,  kategorie: "Süsses",         ampel: "rot" },
  { name: "Agavensirup",        kh: 75,  kategorie: "Süsses",         ampel: "rot" },
  { name: "Gummibaerenchen",    kh: 77,  kategorie: "Süsses",         ampel: "rot" },
  { name: "Milchschokolade",    kh: 55,  kategorie: "Süsses",         ampel: "rot" },
  { name: "Chips",              kh: 50,  kategorie: "Süsses",         ampel: "rot" },
  { name: "Kekse / Gebäck",    kh: 65,  kategorie: "Süsses",         ampel: "rot" },
  { name: "Eis (normal)",       kh: 24,  kategorie: "Süsses",         ampel: "rot" },

  // SAUCEN & GEWÜRZE
  { name: "Senf (scharf/mittl.)",kh: 3,  kategorie: "Saucen",        ampel: "gruen" },
  { name: "Mayonnaise",         kh: 0.5, kategorie: "Saucen",        ampel: "gruen" },
  { name: "Sriracha",           kh: 6,   kategorie: "Saucen",        ampel: "gelb",  hinweis: "Wenig als Wuerze OK" },
  { name: "Sojasauce",          kh: 7,   kategorie: "Saucen",        ampel: "gelb",  hinweis: "Wenig als Wuerze OK" },
  { name: "Pesto (gruen)",      kh: 5,   kategorie: "Saucen",        ampel: "gruen" },
  { name: "Ketchup",            kh: 25,  kategorie: "Saucen",        ampel: "rot",   hinweis: "Voller Zucker" },
  { name: "BBQ-Sauce",          kh: 28,  kategorie: "Saucen",        ampel: "rot" },
  { name: "Susse Chilisauce",   kh: 35,  kategorie: "Saucen",        ampel: "rot" },
  { name: "Balsamico-Essig",    kh: 17,  kategorie: "Saucen",        ampel: "rot",   hinweis: "Nur Spritzer OK" },
  { name: "Apfelessig",         kh: 1,   kategorie: "Saucen",        ampel: "gruen" },
];

const KATEGORIEN = [...new Set(LEBENSMITTEL.map(l => l.kategorie))];

const AMPEL_CONFIG = {
  gruen: { label: "Keto-OK",    farbe: "#22c55e", bg: "#0d2018", border: "#166534" },
  gelb:  { label: "Mit Masse",  farbe: "#f59e0b", bg: "#1a1200", border: "#854d0e" },
  rot:   { label: "Vermeiden",  farbe: "#ef4444", bg: "#1a0a0a", border: "#7f1d1d" },
};

export default function AmpelPage() {
  const [suche,       setSuche]       = useState("");
  const [ampelFilter, setAmpelFilter] = useState<Ampel | "alle">("alle");
  const [katFilter,   setKatFilter]   = useState<string>("alle");

  const gefiltert = useMemo(() => {
    return LEBENSMITTEL.filter(l => {
      const matchSuche = l.name.toLowerCase().includes(suche.toLowerCase());
      const matchAmpel = ampelFilter === "alle" || l.ampel === ampelFilter;
      const matchKat   = katFilter === "alle" || l.kategorie === katFilter;
      return matchSuche && matchAmpel && matchKat;
    }).sort((a, b) => {
      const order = { gruen: 0, gelb: 1, rot: 2 };
      return order[a.ampel] - order[b.ampel] || a.name.localeCompare(b.name);
    });
  }, [suche, ampelFilter, katFilter]);

  const anzahl = {
    gruen: LEBENSMITTEL.filter(l => l.ampel === "gruen").length,
    gelb:  LEBENSMITTEL.filter(l => l.ampel === "gelb").length,
    rot:   LEBENSMITTEL.filter(l => l.ampel === "rot").length,
  };

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      <div className="mb-4">
        <h1 className="text-2xl font-black mb-1">🟢 Lebensmittel-Ampel</h1>
        <p className="text-sm" style={{ color: "#666" }}>{LEBENSMITTEL.length} Lebensmittel — sofort sehen was keto-OK ist.</p>
      </div>

      {/* Ampel-Übersicht */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(["gruen", "gelb", "rot"] as Ampel[]).map(a => {
          const cfg = AMPEL_CONFIG[a];
          return (
            <button key={a} onClick={() => setAmpelFilter(ampelFilter === a ? "alle" : a)}
              className="rounded-2xl p-3 text-center"
              style={{
                backgroundColor: ampelFilter === a ? cfg.bg : "#1a1a1a",
                border: `2px solid ${ampelFilter === a ? cfg.border : "transparent"}`,
              }}>
              <div className="text-2xl mb-1">{a === "gruen" ? "🟢" : a === "gelb" ? "🟡" : "🔴"}</div>
              <div className="font-bold text-base" style={{ color: cfg.farbe }}>{anzahl[a]}</div>
              <div className="text-[10px] mt-0.5" style={{ color: "#555" }}>{cfg.label}</div>
            </button>
          );
        })}
      </div>

      {/* Suche */}
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#555" }}>🔍</span>
        <input
          type="text"
          value={suche}
          onChange={e => setSuche(e.target.value)}
          placeholder="Lebensmittel suchen..."
          className="w-full rounded-2xl pl-9 pr-4 py-3 text-sm"
          style={{ backgroundColor: "#1a1a1a", color: "#f5f5f5", border: "none", outline: "none" }}
        />
        {suche && (
          <button onClick={() => setSuche("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#555" }}>✕</button>
        )}
      </div>

      {/* Kategorie-Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button onClick={() => setKatFilter("alle")}
          className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ backgroundColor: katFilter === "alle" ? "#22c55e22" : "#1a1a1a", color: katFilter === "alle" ? "#22c55e" : "#555", border: katFilter === "alle" ? "1px solid #22c55e44" : "none" }}>
          Alle
        </button>
        {KATEGORIEN.map(k => (
          <button key={k} onClick={() => setKatFilter(katFilter === k ? "alle" : k)}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ backgroundColor: katFilter === k ? "#22c55e22" : "#1a1a1a", color: katFilter === k ? "#22c55e" : "#555", border: katFilter === k ? "1px solid #22c55e44" : "none" }}>
            {k}
          </button>
        ))}
      </div>

      {/* Ergebnis-Anzahl */}
      <div className="text-xs mb-3" style={{ color: "#444" }}>
        {gefiltert.length} Lebensmittel {suche || ampelFilter !== "alle" || katFilter !== "alle" ? "gefunden" : "gesamt"}
      </div>

      {/* Liste */}
      <div className="space-y-1.5">
        {gefiltert.map(l => {
          const cfg = AMPEL_CONFIG[l.ampel];
          return (
            <div key={`${l.name}-${l.kategorie}`}
              className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{ backgroundColor: "#1a1a1a", borderLeft: `3px solid ${cfg.farbe}` }}>
              <div className="text-base flex-shrink-0">
                {l.ampel === "gruen" ? "🟢" : l.ampel === "gelb" ? "🟡" : "🔴"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm leading-tight">{l.name}</div>
                {l.hinweis && <div className="text-[11px] mt-0.5" style={{ color: "#555" }}>{l.hinweis}</div>}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-sm" style={{ color: cfg.farbe }}>{l.kh}g</div>
                <div className="text-[10px]" style={{ color: "#444" }}>Netto-KH</div>
              </div>
            </div>
          );
        })}
        {gefiltert.length === 0 && (
          <div className="text-center py-10" style={{ color: "#444" }}>
            <div className="text-4xl mb-2">🔍</div>
            <div className="text-sm">Kein Lebensmittel gefunden</div>
          </div>
        )}
      </div>

      {/* Legende */}
      <div className="mt-5 rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>LEGENDE</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2"><span>🟢</span><span><b style={{ color: "#22c55e" }}>Keto-OK</b> — Unbegrenzt essen, bleibt sicher unter 20g Netto-KH</span></div>
          <div className="flex items-start gap-2"><span>🟡</span><span><b style={{ color: "#f59e0b" }}>Mit Mass</b> — Keto-OK in kleinen Mengen, Tagesziel im Blick behalten</span></div>
          <div className="flex items-start gap-2"><span>🔴</span><span><b style={{ color: "#ef4444" }}>Vermeiden</b> — Wirft aus der Ketose, konsequent weglassen</span></div>
          <div className="mt-2 pt-2" style={{ borderTop: "1px solid #2a2a2a", color: "#444" }}>Alle KH-Angaben als Netto-KH (minus Ballaststoffe) pro 100g.</div>
        </div>
      </div>
    </main>
  );
}
