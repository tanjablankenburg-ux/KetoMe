"use client";
import { useState } from "react";

export type Rezept = {
  id: string;
  name: string;
  kategorie: "Frühstück" | "Mittagessen" | "Abendessen" | "Snack" | "Dessert";
  kcal: number;
  kh: number;
  eiweiss: number;
  fett: number;
  zeit: string;
  schwierigkeit: "Einfach" | "Mittel" | "Aufwendig";
  zutaten: string[];
  zubereitung: string[];
  bild: string;
  tags: string[];
};

export const REZEPTE: Rezept[] = [
  {
    id: "bulletproof-coffee",
    name: "Bulletproof Coffee",
    kategorie: "Frühstück",
    kcal: 230, kh: 0, eiweiss: 1, fett: 26,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "☕",
    tags: ["keto", "fasten", "energie"],
    zutaten: ["250ml starker Kaffee", "1 EL Ghee oder Butter (Gras-gefüttert)", "1 EL MCT-Öl", "optional: Zimt"],
    zubereitung: [
      "Kaffee frisch brühen.",
      "Alle Zutaten in einen Mixer geben.",
      "30 Sekunden auf höchster Stufe mixen bis schaumig.",
      "Sofort trinken — hält stundenlang satt.",
    ],
  },
  {
    id: "keto-omelette",
    name: "Käse-Kräuter-Omelett",
    kategorie: "Frühstück",
    kcal: 380, kh: 2, eiweiss: 24, fett: 30,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["keto", "eier", "frühstück"],
    zutaten: ["3 Eier", "50g Gouda gerieben", "2 EL Butter", "1 Handvoll Spinat", "Salz, Pfeffer", "frische Kräuter"],
    zubereitung: [
      "Eier mit Salz und Pfeffer verquirlen.",
      "Butter in Pfanne schmelzen lassen.",
      "Eimasse bei mittlerer Hitze stocken lassen.",
      "Käse und Spinat auf eine Hälfte geben.",
      "Omelett zusammenfalten und servieren.",
    ],
  },
  {
    id: "avocado-ei",
    name: "Avocado mit Spiegelei",
    kategorie: "Frühstück",
    kcal: 350, kh: 4, eiweiss: 14, fett: 30,
    zeit: "8 Min", schwierigkeit: "Einfach",
    bild: "🥑",
    tags: ["keto", "schnell", "avocado"],
    zutaten: ["1 Avocado", "2 Eier", "1 EL Olivenöl", "Salz, Pfeffer", "Chiliflocken optional", "Zitronensaft"],
    zubereitung: [
      "Avocado halbieren, Kern entfernen und in Scheiben schneiden.",
      "Eier in Olivenöl als Spiegeleier braten.",
      "Avocado mit Zitrone, Salz und Pfeffer würzen.",
      "Eier daneben anrichten.",
    ],
  },
  {
    id: "chia-pudding",
    name: "Keto Chia-Pudding",
    kategorie: "Frühstück",
    kcal: 290, kh: 6, eiweiss: 9, fett: 22,
    zeit: "5 Min + 8h", schwierigkeit: "Einfach",
    bild: "🥛",
    tags: ["keto", "vorbereitung", "süß"],
    zutaten: ["4 EL Chiasamen", "250ml Kokosmilch (vollfett)", "1 TL Vanilleextrakt", "Stevia nach Geschmack", "Himbeeren zum Garnieren"],
    zubereitung: [
      "Chiasamen mit Kokosmilch, Vanille und Stevia mischen.",
      "15 Minuten stehen lassen, dann nochmal rühren.",
      "Über Nacht im Kühlschrank quellen lassen.",
      "Morgens mit Himbeeren servieren.",
    ],
  },
  {
    id: "lachs-zucchini",
    name: "Lachs mit Zucchini-Nudeln",
    kategorie: "Abendessen",
    kcal: 490, kh: 5, eiweiss: 42, fett: 32,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "lachs", "lowcarb"],
    zutaten: ["200g Lachsfilet", "2 Zucchini", "2 EL Olivenöl", "2 Zehen Knoblauch", "Salz, Pfeffer", "Zitrone", "frischer Dill"],
    zubereitung: [
      "Zucchini mit Sparschäler oder Spiralschneider zu Nudeln verarbeiten.",
      "Lachs mit Salz, Pfeffer würzen und in 1 EL Öl braten (je 4 Min).",
      "Knoblauch im restlichen Öl anschwitzen.",
      "Zucchini-Nudeln 2 Minuten mitbraten.",
      "Zitronensaft und Dill dazu, servieren.",
    ],
  },
  {
    id: "haehnchen-brokkoli",
    name: "Hähnchenbrust mit Brokkoli in Knoblauchbutter",
    kategorie: "Mittagessen",
    kcal: 420, kh: 8, eiweiss: 52, fett: 20,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "hähnchen", "meal-prep"],
    zutaten: ["200g Hähnchenbrust", "300g Brokkoli", "3 EL Butter", "3 Zehen Knoblauch", "Paprikapulver", "Salz, Pfeffer"],
    zubereitung: [
      "Hähnchen in Stücke schneiden, würzen.",
      "In Butter von beiden Seiten goldbraun braten (8 Min).",
      "Knoblauch und Brokkoli dazugeben.",
      "5 Minuten mitbraten bis Brokkoli bissfest.",
      "Mit Paprikapulver abschmecken.",
    ],
  },
  {
    id: "ribeye-kraeuterbutter",
    name: "Ribeye Steak mit Kräuterbutter",
    kategorie: "Abendessen",
    kcal: 580, kh: 0, eiweiss: 45, fett: 45,
    zeit: "15 Min", schwierigkeit: "Mittel",
    bild: "🥩",
    tags: ["keto", "steak", "premium"],
    zutaten: ["300g Ribeye Steak", "2 EL Butter", "Frische Kräuter (Thymian, Rosmarin)", "1 Zehe Knoblauch", "Meersalz, schwarzer Pfeffer"],
    zubereitung: [
      "Steak 30 Min vorher aus dem Kühlschrank nehmen.",
      "Pfanne sehr heiß erhitzen (fast rauchend).",
      "Steak mit Salz und Pfeffer würzen, 3 Min je Seite braten.",
      "Butter, Kräuter und Knoblauch dazu, Steak damit übergießen.",
      "5 Min ruhen lassen, dann servieren.",
    ],
  },
  {
    id: "thunfisch-avocado-bowl",
    name: "Thunfisch-Avocado Bowl",
    kategorie: "Mittagessen",
    kcal: 440, kh: 4, eiweiss: 35, fett: 32,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["keto", "schnell", "kalt"],
    zutaten: ["1 Dose Thunfisch (im Wasser)", "1 Avocado", "1 EL Mayonnaise (keto)", "Salz, Pfeffer", "Zitronensaft", "Rucola", "Kapern optional"],
    zubereitung: [
      "Thunfisch abtropfen lassen.",
      "Avocado würfeln.",
      "Thunfisch mit Mayo, Zitrone, Salz und Pfeffer mischen.",
      "Auf Rucola anrichten, Avocado dazu.",
    ],
  },
  {
    id: "garnelen-knoblauch",
    name: "Knoblauch-Garnelen mit Salat",
    kategorie: "Abendessen",
    kcal: 350, kh: 3, eiweiss: 28, fett: 24,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🦐",
    tags: ["keto", "meeresfrüchte", "schnell"],
    zutaten: ["250g Garnelen (geschält)", "3 EL Butter", "4 Zehen Knoblauch", "Zitrone", "Petersilie", "Kopfsalat oder Rucola"],
    zubereitung: [
      "Knoblauch fein hacken.",
      "Butter in Pfanne schmelzen, Knoblauch anschwitzen.",
      "Garnelen dazu, 2-3 Min pro Seite braten.",
      "Zitronensaft und Petersilie dazu.",
      "Auf Salat anrichten.",
    ],
  },
  {
    id: "blumenkohl-reis",
    name: "Blumenkohl-Fried Rice (Keto)",
    kategorie: "Mittagessen",
    kcal: 310, kh: 9, eiweiss: 16, fett: 22,
    zeit: "20 Min", schwierigkeit: "Mittel",
    bild: "🥦",
    tags: ["keto", "vegetarisch", "sattmacher"],
    zutaten: ["1 kleiner Blumenkohl", "3 Eier", "100g Champions", "2 EL Sojasoße (oder Kokosaminosäuren)", "2 EL Sesamöl", "Frühlingszwiebeln", "Ingwer"],
    zubereitung: [
      "Blumenkohl in Röschen teilen, im Mixer zu Reis-Größe zerkleinern.",
      "Sesamöl erhitzen, Blumenkohlreis 5 Min braten.",
      "Champions und Ingwer dazu.",
      "Eier unterrühren und stocken lassen.",
      "Mit Sojasoße und Frühlingszwiebeln abschmecken.",
    ],
  },
  {
    id: "caesar-salad-keto",
    name: "Caesar Salad (Keto, ohne Croutons)",
    kategorie: "Mittagessen",
    kcal: 380, kh: 4, eiweiss: 35, fett: 24,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥬",
    tags: ["keto", "salat", "hähnchen"],
    zutaten: ["1 Hähnchenbrust", "1 Römersalat", "50g Parmesan", "Caesar-Dressing (selbst gemacht)", "Speck optional"],
    zubereitung: [
      "Hähnchen würzen und in Pfanne goldbraun braten.",
      "Caesar-Dressing: Mayonnaise, Zitrone, Knoblauch, Parmesan mischen.",
      "Salat zerreißen, Hähnchen in Streifen schneiden.",
      "Alles mischen, Parmesan drüber hobeln.",
    ],
  },
  {
    id: "keto-pancakes",
    name: "Keto Pancakes (Mandelmehl)",
    kategorie: "Frühstück",
    kcal: 340, kh: 5, eiweiss: 16, fett: 28,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥞",
    tags: ["keto", "süß", "wochenende"],
    zutaten: ["100g Mandelmehl", "2 Eier", "50g Frischkäse", "1 TL Backpulver", "Stevia", "Butter zum Braten", "Beeren + Sahne zum Garnieren"],
    zubereitung: [
      "Alle Zutaten zu einem glatten Teig mischen.",
      "Butter in Pfanne schmelzen.",
      "Kleine Häufchen Teig in die Pfanne geben.",
      "2-3 Min je Seite backen bis goldbraun.",
      "Mit frischen Beeren und Schlagsahne servieren.",
    ],
  },
  {
    id: "keto-curry",
    name: "Hähnchen-Kokos-Curry (ohne Reis)",
    kategorie: "Abendessen",
    kcal: 520, kh: 8, eiweiss: 40, fett: 38,
    zeit: "30 Min", schwierigkeit: "Mittel",
    bild: "🍛",
    tags: ["keto", "curry", "sattmacher"],
    zutaten: ["400g Hähnchen", "400ml Kokosmilch (vollfett)", "1 Zwiebel", "2 EL Currypulver", "1 TL Kurkuma", "Knoblauch, Ingwer", "Spinat", "Kokosöl"],
    zubereitung: [
      "Zwiebel, Knoblauch, Ingwer in Kokosöl anschwitzen.",
      "Currypulver und Kurkuma kurz mitrösten.",
      "Hähnchen in Stücken dazugeben und anbraten.",
      "Kokosmilch angießen, 15 Min köcheln.",
      "Spinat unterrühren, abschmecken.",
    ],
  },
  {
    id: "keto-schokomousse",
    name: "Keto Schoko-Mousse",
    kategorie: "Dessert",
    kcal: 280, kh: 4, eiweiss: 4, fett: 28,
    zeit: "10 Min + 1h", schwierigkeit: "Einfach",
    bild: "🍫",
    tags: ["keto", "dessert", "süß"],
    zutaten: ["200ml Schlagsahne", "2 EL Kakaopulver (ungesüßt)", "Stevia nach Geschmack", "1 TL Vanille", "optional: Kaffeepulver"],
    zubereitung: [
      "Sahne steif schlagen.",
      "Kakao, Stevia und Vanille unterfalten.",
      "In Gläser füllen, 1h kühlen.",
      "Optional mit Himbeeren servieren.",
    ],
  },
  {
    id: "lammkoteletts-rosenkohl",
    name: "Lammkoteletts mit Rosenkohl",
    kategorie: "Abendessen",
    kcal: 560, kh: 6, eiweiss: 42, fett: 40,
    zeit: "35 Min", schwierigkeit: "Mittel",
    bild: "🍖",
    tags: ["keto", "lamm", "premium"],
    zutaten: ["4 Lammkoteletts", "400g Rosenkohl", "3 EL Butter", "Rosmarin, Thymian", "Knoblauch", "Salz, Pfeffer"],
    zubereitung: [
      "Lammkoteletts würzen, mit Kräutern einreiben.",
      "In heißer Pfanne je 3 Min braten.",
      "Rosenkohl halbieren und in Butter 10 Min braten.",
      "Knoblauch kurz vor Ende dazugeben.",
      "Zusammen servieren.",
    ],
  },
  {
    id: "rinderhack-pilze",
    name: "Rinderhack-Pfanne mit Pilzen",
    kategorie: "Abendessen",
    kcal: 480, kh: 4, eiweiss: 34, fett: 36,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍄",
    tags: ["keto", "hack", "schnell"],
    zutaten: ["400g Rinderhack", "300g Champions", "1 Zwiebel", "2 EL Butter", "Sahne optional", "Petersilie", "Salz, Pfeffer, Paprika"],
    zubereitung: [
      "Zwiebel in Butter anschwitzen.",
      "Hack dazugeben und krümelig braten.",
      "Pilze dazu, 5 Min mitbraten.",
      "Würzen, optional Sahne angießen und kurz einkochen.",
      "Mit Petersilie bestreuen.",
    ],
  },
  {
    id: "griechischer-salat",
    name: "Griechischer Salat mit extra Feta",
    kategorie: "Mittagessen",
    kcal: 320, kh: 7, eiweiss: 12, fett: 26,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🫑",
    tags: ["keto", "vegetarisch", "sommer"],
    zutaten: ["200g Feta", "Kirschtomaten", "Gurke", "rote Paprika", "Oliven", "rote Zwiebel", "Olivenöl", "Oregano"],
    zubereitung: [
      "Gemüse in grobe Stücke schneiden.",
      "Feta in Würfel schneiden oder als Block lassen.",
      "Alles in Schale geben, Oliven dazu.",
      "Großzügig Olivenöl drüber, Oregano und Salz.",
    ],
  },
  {
    id: "keto-brot",
    name: "Keto-Brot (Mandelmehl)",
    kategorie: "Snack",
    kcal: 180, kh: 3, eiweiss: 8, fett: 15,
    zeit: "50 Min", schwierigkeit: "Mittel",
    bild: "🍞",
    tags: ["keto", "backen", "brot"],
    zutaten: ["200g Mandelmehl", "4 Eier", "50g Butter (geschmolzen)", "1 Päckchen Backpulver", "Salz", "Sesam oder Sonnenblumenkerne oben"],
    zubereitung: [
      "Ofen auf 180°C vorheizen.",
      "Alle Zutaten gut vermengen.",
      "In gefettete Kastenform füllen.",
      "40-45 Min backen.",
      "Vollständig abkühlen lassen vor dem Schneiden.",
    ],
  },
  {
    id: "spargel-schweinefilet",
    name: "Schweinefilet mit Spargel",
    kategorie: "Abendessen",
    kcal: 420, kh: 4, eiweiss: 38, fett: 27,
    zeit: "30 Min", schwierigkeit: "Mittel",
    bild: "🌿",
    tags: ["keto", "spargel", "elegant"],
    zutaten: ["300g Schweinefilet", "500g grüner Spargel", "3 EL Butter", "Zitrone", "Salz, Pfeffer", "Hollandaise (keto) optional"],
    zubereitung: [
      "Filet würzen, in Butter von allen Seiten anbraten.",
      "Bei 180°C ca. 15 Min im Ofen garen.",
      "Spargel in gesalzenem Wasser 5-7 Min kochen.",
      "Mit Butter und Zitrone schwenken.",
      "Zusammen servieren.",
    ],
  },
  {
    id: "zucchini-lasagne",
    name: "Zucchini-Lasagne mit Ricotta",
    kategorie: "Abendessen",
    kcal: 450, kh: 7, eiweiss: 30, fett: 33,
    zeit: "50 Min", schwierigkeit: "Aufwendig",
    bild: "🫙",
    tags: ["keto", "vegetarisch", "ofengericht"],
    zutaten: ["3 Zucchini", "400g Ricotta", "2 Eier", "Tomatensoße (zuckerfrei)", "Parmesan", "Mozzarella", "Basilikum", "Salz, Pfeffer"],
    zubereitung: [
      "Zucchini längs in dünne Scheiben schneiden.",
      "Kurz in Pfanne ohne Öl anrösten (Wasser entziehen).",
      "Ricotta mit Eiern, Salz und Pfeffer mischen.",
      "Schichten: Soße, Zucchini, Ricotta, Käse.",
      "Bei 180°C 30 Min backen.",
    ],
  },
];

const KATEGORIEN = ["Alle", "Frühstück", "Mittagessen", "Abendessen", "Snack", "Dessert"];

export default function RezeptePage() {
  const [kategorie, setKategorie] = useState("Alle");
  const [suche, setSuche] = useState("");
  const [offen, setOffen] = useState<string | null>(null);

  const gefiltert = REZEPTE.filter(r => {
    const matchKat = kategorie === "Alle" || r.kategorie === kategorie;
    const matchSuche = r.name.toLowerCase().includes(suche.toLowerCase()) ||
      r.tags.some(t => t.includes(suche.toLowerCase()));
    return matchKat && matchSuche;
  });

  const offenRezept = REZEPTE.find(r => r.id === offen);

  if (offenRezept) {
    return (
      <main className="px-4 py-6">
        <button onClick={() => setOffen(null)}
          className="flex items-center gap-2 mb-4 text-sm"
          style={{ color: "#22c55e" }}>
          ← Zurück
        </button>
        <div className="text-5xl mb-3 text-center">{offenRezept.bild}</div>
        <h1 className="text-xl font-bold mb-1">{offenRezept.name}</h1>
        <div className="flex gap-2 flex-wrap mb-4">
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#1a1a1a", color: "#888" }}>{offenRezept.kategorie}</span>
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#1a1a1a", color: "#888" }}>⏱ {offenRezept.zeit}</span>
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#1a1a1a", color: "#888" }}>{offenRezept.schwierigkeit}</span>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            { label: "Kalorien", wert: offenRezept.kcal, einheit: "" },
            { label: "Eiweiß", wert: offenRezept.eiweiss, einheit: "g" },
            { label: "Fett", wert: offenRezept.fett, einheit: "g" },
            { label: "KH", wert: offenRezept.kh, einheit: "g" },
          ].map(({ label, wert, einheit }) => (
            <div key={label} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-xs mb-0.5" style={{ color: "#555" }}>{label}</div>
              <div className="text-sm font-bold" style={{ color: label === "KH" ? (wert <= 5 ? "#22c55e" : wert <= 10 ? "#f59e0b" : "#ef4444") : "#fff" }}>
                {wert}{einheit}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>🛒 Zutaten</h2>
          <ul className="space-y-2">
            {offenRezept.zutaten.map((z, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span style={{ color: "#22c55e" }}>•</span> {z}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>👩‍🍳 Zubereitung</h2>
          <ol className="space-y-3">
            {offenRezept.zubereitung.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
                  style={{ backgroundColor: "#22c55e" }}>{i + 1}</span>
                <span style={{ color: "#ccc" }}>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-6">
      <h1 className="text-xl font-bold mb-1">📖 Rezepte</h1>
      <p className="text-sm mb-4" style={{ color: "#666" }}>{REZEPTE.length} Keto-Rezepte</p>

      <input value={suche} onChange={e => setSuche(e.target.value)}
        placeholder="🔍 Rezept suchen..."
        className="w-full px-4 py-3 rounded-xl outline-none text-white text-sm mb-4"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />

      <div className="flex gap-2 overflow-x-auto mb-5 pb-1">
        {KATEGORIEN.map(k => (
          <button key={k} onClick={() => setKategorie(k)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: kategorie === k ? "#22c55e" : "#1a1a1a", color: kategorie === k ? "#000" : "#888" }}>
            {k}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {gefiltert.map(r => (
          <button key={r.id} onClick={() => setOffen(r.id)}
            className="rounded-2xl p-4 text-left"
            style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-3xl mb-2">{r.bild}</div>
            <div className="text-sm font-semibold mb-1 leading-tight">{r.name}</div>
            <div className="text-xs mb-2" style={{ color: "#555" }}>{r.zeit} · {r.schwierigkeit}</div>
            <div className="flex gap-2 text-xs">
              <span style={{ color: r.kh <= 5 ? "#22c55e" : r.kh <= 10 ? "#f59e0b" : "#ef4444" }}>{r.kh}g KH</span>
              <span style={{ color: "#555" }}>{r.kcal} kcal</span>
            </div>
          </button>
        ))}
        {gefiltert.length === 0 && (
          <div className="col-span-2 text-center py-8" style={{ color: "#555" }}>Keine Rezepte gefunden.</div>
        )}
      </div>
    </main>
  );
}
