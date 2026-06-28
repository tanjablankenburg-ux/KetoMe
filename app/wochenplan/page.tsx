"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Mahlzeit = {
  name: string;
  rezeptId?: string;
  zutaten?: string[];
};

type Tag = {
  tag: string;
  fruehstueck: Mahlzeit;
  mittagessen: Mahlzeit;
  abendessen: Mahlzeit;
  snack: Mahlzeit;
};

const PLAENE: { name: string; beschreibung: string; tage: Tag[] }[] = [
  {
    name: "Klassisch Keto",
    beschreibung: "Einfacher Einstieg, wenig Kohlenhydrate, viel gesundes Fett",
    tage: [
      {
        tag: "Montag",
        fruehstueck: { name: "Käse-Kräuter-Omelett", rezeptId: "keto-omelette", zutaten: ["3 Eier", "50g Gouda", "Spinat", "Butter"] },
        mittagessen: { name: "Hähnchenbrust mit Brokkoli in Knoblauchbutter", rezeptId: "haehnchen-brokkoli", zutaten: ["200g Hähnchenbrust", "300g Brokkoli", "Butter", "Knoblauch"] },
        abendessen: { name: "Lachs mit Zucchini-Nudeln", rezeptId: "lachs-zucchini", zutaten: ["200g Lachs", "2 Zucchini", "Olivenöl", "Dill"] },
        snack: { name: "Macadamia-Nüsse (30g)", zutaten: ["Macadamia"] },
      },
      {
        tag: "Dienstag",
        fruehstueck: { name: "Bulletproof Coffee + Spiegelei mit Räucherlachs", rezeptId: "bulletproof-coffee", zutaten: ["Kaffee", "Ghee", "MCT-Öl", "2 Eier", "Räucherlachs"] },
        mittagessen: { name: "Thunfisch-Avocado Bowl", rezeptId: "thunfisch-avocado-bowl", zutaten: ["1 Dose Thunfisch", "1 Avocado", "Rucola", "Mayonnaise"] },
        abendessen: { name: "Rinderhack-Pfanne mit Pilzen", rezeptId: "rinderhack-pilze", zutaten: ["400g Rinderhack", "300g Champions", "Zwiebel", "Sahne"] },
        snack: { name: "Gurke mit Frischkäse", zutaten: ["Gurke", "Frischkäse"] },
      },
      {
        tag: "Mittwoch",
        fruehstueck: { name: "Keto Chia-Pudding", rezeptId: "chia-pudding", zutaten: ["Chiasamen", "Kokosmilch", "Himbeeren"] },
        mittagessen: { name: "Caesar Salad mit Hähnchen", rezeptId: "caesar-salad-keto", zutaten: ["Hähnchenbrust", "Römersalat", "Parmesan", "Caesar-Dressing"] },
        abendessen: { name: "Schweinefilet mit Spargel", rezeptId: "spargel-schweinefilet", zutaten: ["300g Schweinefilet", "500g Spargel", "Butter", "Zitrone"] },
        snack: { name: "Hartkäse (Gouda/Cheddar)", zutaten: ["Gouda"] },
      },
      {
        tag: "Donnerstag",
        fruehstueck: { name: "Avocado mit Spiegelei", rezeptId: "avocado-ei", zutaten: ["1 Avocado", "2 Eier", "Olivenöl"] },
        mittagessen: { name: "Griechischer Salat mit extra Feta", rezeptId: "griechischer-salat", zutaten: ["200g Feta", "Gurke", "Tomaten", "Oliven", "Olivenöl"] },
        abendessen: { name: "Knoblauch-Garnelen mit Salat", rezeptId: "garnelen-knoblauch", zutaten: ["250g Garnelen", "Butter", "Knoblauch", "Salat"] },
        snack: { name: "Oliven (Handvoll)", zutaten: ["Oliven"] },
      },
      {
        tag: "Freitag",
        fruehstueck: { name: "Keto Pancakes", rezeptId: "keto-pancakes", zutaten: ["Mandelmehl", "2 Eier", "Frischkäse", "Beeren"] },
        mittagessen: { name: "Blumenkohl-Fried Rice", rezeptId: "blumenkohl-reis", zutaten: ["Blumenkohl", "3 Eier", "Champions", "Sojasoße"] },
        abendessen: { name: "Ribeye Steak mit Kräuterbutter", rezeptId: "ribeye-kraeuterbutter", zutaten: ["300g Ribeye", "Butter", "Kräuter"] },
        snack: { name: "Pecannüsse (30g)", zutaten: ["Pecannüsse"] },
      },
      {
        tag: "Samstag",
        fruehstueck: { name: "Großes Frühstück: Bacon, Ei, Avocado", zutaten: ["Bacon/Speck", "3 Eier", "1 Avocado", "Kirschtomaten"] },
        mittagessen: { name: "Thunfisch-Avocado Bowl", rezeptId: "thunfisch-avocado-bowl", zutaten: ["1 Dose Thunfisch", "1 Avocado", "Rucola"] },
        abendessen: { name: "Lammkoteletts mit Rosenkohl", rezeptId: "lammkoteletts-rosenkohl", zutaten: ["4 Lammkoteletts", "Rosenkohl", "Butter", "Rosmarin"] },
        snack: { name: "Keto Schoko-Mousse", rezeptId: "keto-schokomousse", zutaten: ["Sahne", "Kakao", "Stevia"] },
      },
      {
        tag: "Sonntag",
        fruehstueck: { name: "Käse-Kräuter-Omelett", rezeptId: "keto-omelette", zutaten: ["3 Eier", "Käse", "Kräuter"] },
        mittagessen: { name: "Caesar Salad mit Hähnchen", rezeptId: "caesar-salad-keto", zutaten: ["Hähnchenbrust", "Salat", "Parmesan"] },
        abendessen: { name: "Hähnchen-Kokos-Curry", rezeptId: "keto-curry", zutaten: ["400g Hähnchen", "Kokosmilch", "Currypulver", "Spinat"] },
        snack: { name: "Dunkle Schokolade 85% (2 Riegel)", zutaten: ["Dunkle Schokolade 85%"] },
      },
    ],
  },
  {
    name: "Fasten + Keto (16:8)",
    beschreibung: "16:8 Intervallfasten kombiniert mit Keto — maximale Fettverbrennung",
    tage: [
      {
        tag: "Montag",
        fruehstueck: { name: "Bulletproof Coffee (bricht Fasten nicht)", rezeptId: "bulletproof-coffee", zutaten: ["Kaffee", "Ghee", "MCT-Öl"] },
        mittagessen: { name: "12 Uhr Erstes Essen: Hähnchenbrust mit Avocado", zutaten: ["200g Hähnchenbrust", "1 Avocado", "Salat"] },
        abendessen: { name: "20 Uhr Letztes Essen: Lachs mit Gemüse", rezeptId: "lachs-zucchini", zutaten: ["200g Lachs", "Zucchini", "Brokkoli"] },
        snack: { name: "Nur im Essensfenster: Nüsse oder Käse", zutaten: ["Macadamia", "Gouda"] },
      },
      {
        tag: "Dienstag",
        fruehstueck: { name: "Schwarzer Kaffee oder Tee (Fastenzeit)", zutaten: ["Kaffee"] },
        mittagessen: { name: "12 Uhr: Rinderhack Bowl mit Salat", rezeptId: "rinderhack-pilze", zutaten: ["400g Rinderhack", "Pilze", "Salat"] },
        abendessen: { name: "20 Uhr: Schweinekotelett mit Spargel", rezeptId: "spargel-schweinefilet", zutaten: ["Schweinekotelett", "Spargel", "Butter"] },
        snack: { name: "Käsewürfel", zutaten: ["Gouda oder Cheddar"] },
      },
      {
        tag: "Mittwoch",
        fruehstueck: { name: "Wasser / Kaffee (Fastenzeit)", zutaten: [] },
        mittagessen: { name: "12 Uhr: Großer Thunfischsalat", rezeptId: "thunfisch-avocado-bowl", zutaten: ["Thunfisch", "Avocado", "Rucola", "Olivenöl"] },
        abendessen: { name: "20 Uhr: Hähnchenbrust mit Brokkoli", rezeptId: "haehnchen-brokkoli", zutaten: ["Hähnchenbrust", "Brokkoli", "Knoblauchbutter"] },
        snack: { name: "Oliven oder Macadamia", zutaten: ["Oliven", "Macadamia"] },
      },
      {
        tag: "Donnerstag",
        fruehstueck: { name: "Fastenzeit — nur Wasser/Kaffee", zutaten: [] },
        mittagessen: { name: "12 Uhr: Käse-Omelett mit Speck", rezeptId: "keto-omelette", zutaten: ["3 Eier", "Käse", "Speck/Bacon"] },
        abendessen: { name: "20 Uhr: Garnelen mit Zucchini", rezeptId: "garnelen-knoblauch", zutaten: ["Garnelen", "Zucchini", "Knoblauchbutter"] },
        snack: { name: "Walnüsse (30g)", zutaten: ["Walnüsse"] },
      },
      {
        tag: "Freitag",
        fruehstueck: { name: "Fastenzeit", zutaten: [] },
        mittagessen: { name: "12 Uhr: Caesar Salad mit Hähnchen", rezeptId: "caesar-salad-keto", zutaten: ["Hähnchenbrust", "Römersalat", "Parmesan"] },
        abendessen: { name: "20 Uhr: Ribeye Steak mit grünen Bohnen", rezeptId: "ribeye-kraeuterbutter", zutaten: ["Ribeye Steak", "Grüne Bohnen", "Kräuterbutter"] },
        snack: { name: "Hartkäse", zutaten: ["Gouda"] },
      },
      {
        tag: "Samstag",
        fruehstueck: { name: "Bulletproof Coffee (Ausnahme am Wochenende)", rezeptId: "bulletproof-coffee", zutaten: ["Kaffee", "Ghee", "MCT-Öl"] },
        mittagessen: { name: "12 Uhr: Avocado-Lachs Bowl", zutaten: ["Räucherlachs", "Avocado", "Rucola"] },
        abendessen: { name: "20 Uhr: Lammkoteletts mit Salat", rezeptId: "lammkoteletts-rosenkohl", zutaten: ["Lammkoteletts", "Rosenkohl", "Rosmarin"] },
        snack: { name: "Dunkle Schokolade 85%", zutaten: ["Dunkle Schokolade 85%"] },
      },
      {
        tag: "Sonntag",
        fruehstueck: { name: "Fastenzeit", zutaten: [] },
        mittagessen: { name: "12 Uhr: Großes Keto-Frühstück zum Mittag", rezeptId: "keto-omelette", zutaten: ["Eier", "Bacon", "Avocado", "Käse"] },
        abendessen: { name: "20 Uhr: Hähnchen-Kokos-Curry", rezeptId: "keto-curry", zutaten: ["Hähnchen", "Kokosmilch", "Curry", "Spinat"] },
        snack: { name: "Pecannüsse", zutaten: ["Pecannüsse"] },
      },
    ],
  },
  {
    name: "Vegetarisch Keto",
    beschreibung: "Kein Fleisch, aber trotzdem ketogen — mit Eiern, Käse und Gemüse",
    tage: [
      {
        tag: "Montag",
        fruehstueck: { name: "Rührei mit Käse und Spinat", rezeptId: "keto-omelette", zutaten: ["3 Eier", "Gouda", "Spinat", "Butter"] },
        mittagessen: { name: "Avocado-Ei Salat", zutaten: ["2 Eier (hartgekocht)", "1 Avocado", "Rucola", "Olivenöl"] },
        abendessen: { name: "Zucchini-Nudeln mit Pesto und Parmesan", zutaten: ["2 Zucchini", "Pesto (keto)", "Parmesan", "Olivenöl"] },
        snack: { name: "Walnüsse", zutaten: ["Walnüsse"] },
      },
      {
        tag: "Dienstag",
        fruehstueck: { name: "Keto Chia-Pudding", rezeptId: "chia-pudding", zutaten: ["Chiasamen", "Kokosmilch", "Himbeeren"] },
        mittagessen: { name: "Caprese mit Mozzarella und Olivenöl", zutaten: ["Mozzarella", "Tomaten", "Basilikum", "Olivenöl"] },
        abendessen: { name: "Blumenkohl-Fried Rice", rezeptId: "blumenkohl-reis", zutaten: ["Blumenkohl", "3 Eier", "Champions", "Sojasoße"] },
        snack: { name: "Käsewürfel", zutaten: ["Gouda oder Cheddar"] },
      },
      {
        tag: "Mittwoch",
        fruehstueck: { name: "Avocado mit Spiegelei", rezeptId: "avocado-ei", zutaten: ["1 Avocado", "2 Eier", "Olivenöl"] },
        mittagessen: { name: "Griechischer Salat mit extra Feta", rezeptId: "griechischer-salat", zutaten: ["Feta", "Gurke", "Tomaten", "Oliven", "Olivenöl"] },
        abendessen: { name: "Gefüllte Paprika mit Käse und Ei", zutaten: ["2 Paprika", "3 Eier", "Gouda", "Kräuter"] },
        snack: { name: "Macadamia", zutaten: ["Macadamia"] },
      },
      {
        tag: "Donnerstag",
        fruehstueck: { name: "Keto Pancakes mit Frischkäse", rezeptId: "keto-pancakes", zutaten: ["Mandelmehl", "Eier", "Frischkäse", "Beeren"] },
        mittagessen: { name: "Halloumi-Salat (gegrillt)", zutaten: ["Halloumi", "Rucola", "Kirschtomaten", "Olivenöl"] },
        abendessen: { name: "Käse-Omelett Deluxe", rezeptId: "keto-omelette", zutaten: ["3 Eier", "Feta", "Spinat", "Pilze"] },
        snack: { name: "Oliven", zutaten: ["Oliven"] },
      },
      {
        tag: "Freitag",
        fruehstueck: { name: "Bulletproof Coffee + Chia-Pudding", rezeptId: "chia-pudding", zutaten: ["Kaffee", "Ghee", "Chiasamen", "Kokosmilch"] },
        mittagessen: { name: "Avocado Bowl mit hartgekochtem Ei", zutaten: ["1 Avocado", "2 Eier", "Rucola", "Zitrone"] },
        abendessen: { name: "Blumenkohl-Pizza (Low Carb Boden)", zutaten: ["Blumenkohl", "Ei", "Mozzarella", "Tomatensoße", "Belag nach Wahl"] },
        snack: { name: "Pecannüsse", zutaten: ["Pecannüsse"] },
      },
      {
        tag: "Samstag",
        fruehstueck: { name: "Großes Käse-Omelett mit Gemüse", rezeptId: "keto-omelette", zutaten: ["4 Eier", "Paprika", "Zucchini", "Gouda"] },
        mittagessen: { name: "Griechischer Salat", rezeptId: "griechischer-salat", zutaten: ["Feta", "Oliven", "Gurke", "Tomate"] },
        abendessen: { name: "Zucchini-Lasagne mit Ricotta", rezeptId: "zucchini-lasagne", zutaten: ["3 Zucchini", "Ricotta", "Mozzarella", "Parmesan", "Tomatensoße"] },
        snack: { name: "Keto Schoko-Mousse", rezeptId: "keto-schokomousse", zutaten: ["Sahne", "Kakao", "Stevia"] },
      },
      {
        tag: "Sonntag",
        fruehstueck: { name: "Joghurt mit Beeren und Nüssen", zutaten: ["Griechischer Joghurt", "Himbeeren", "Walnüsse"] },
        mittagessen: { name: "Blumenkohl-Fried Rice", rezeptId: "blumenkohl-reis", zutaten: ["Blumenkohl", "Eier", "Gemüse"] },
        abendessen: { name: "Käse-Omelett und Salat", rezeptId: "keto-omelette", zutaten: ["Eier", "Käse", "Salat"] },
        snack: { name: "Nuss-Mix", zutaten: ["Mandeln", "Walnüsse", "Macadamia"] },
      },
    ],
  },
];

const TAGE_KURZ = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MAHLZEIT_ICONS: Record<string, string> = {
  fruehstueck: "🌅",
  mittagessen: "☀️",
  abendessen: "🌙",
  snack: "🥜",
};
const MAHLZEIT_LABELS: Record<string, string> = {
  fruehstueck: "Frühstück",
  mittagessen: "Mittagessen",
  abendessen: "Abendessen",
  snack: "Snack",
};

export default function WochenplanPage() {
  const [aktiv, setAktiv] = useState(0);
  const [tag, setTag] = useState(0);
  const [saved, setSaved] = useState<string | null>(null);
  const router = useRouter();

  const plan = PLAENE[aktiv];
  const tagData = plan.tage[tag];

  function zutatenInEinkaufsliste(zutaten: string[]) {
    if (!zutaten || zutaten.length === 0) return;
    const vorhandene = JSON.parse(localStorage.getItem("ketome_einkaufsliste") || "[]");
    const neu = zutaten.map(z => ({
      id: Date.now().toString() + Math.random(),
      name: z,
      menge: "",
      erledigt: false,
      kategorie: "Sonstiges",
    }));
    localStorage.setItem("ketome_einkaufsliste", JSON.stringify([...vorhandene, ...neu]));
    setSaved("Zur Einkaufsliste hinzugefügt!");
    setTimeout(() => setSaved(null), 2000);
  }

  function ganzeWocheInEinkaufsliste() {
    const alle: string[] = [];
    plan.tage.forEach(t => {
      [t.fruehstueck, t.mittagessen, t.abendessen, t.snack].forEach(m => {
        if (m.zutaten) alle.push(...m.zutaten);
      });
    });
    const einzigartig = [...new Set(alle)];
    zutatenInEinkaufsliste(einzigartig);
  }

  return (
    <main className="px-4 py-6">
      <h1 className="text-xl font-bold mb-2">🥗 Wochenplan</h1>
      <p className="text-sm mb-5" style={{ color: "#666" }}>Fertige Keto-Pläne für jeden Typ</p>

      <div className="space-y-2 mb-5">
        {PLAENE.map((p, i) => (
          <button key={i} onClick={() => { setAktiv(i); setTag(0); }}
            className="w-full text-left rounded-2xl p-4"
            style={{ backgroundColor: aktiv === i ? "#0d2018" : "#1a1a1a", border: aktiv === i ? "1px solid #22c55e" : "1px solid transparent" }}>
            <div className="font-semibold text-sm">{p.name}</div>
            <div className="text-xs mt-1" style={{ color: "#666" }}>{p.beschreibung}</div>
          </button>
        ))}
      </div>

      <button onClick={ganzeWocheInEinkaufsliste}
        className="w-full py-3 rounded-xl text-sm font-semibold mb-4"
        style={{ backgroundColor: "#1a2a1a", border: "1px solid #166534", color: "#22c55e" }}>
        🛒 Ganze Woche in Einkaufsliste
      </button>

      {saved && (
        <div className="rounded-xl px-4 py-2 mb-4 text-center text-sm text-black font-semibold"
          style={{ backgroundColor: "#22c55e" }}>
          {saved}
        </div>
      )}

      <div className="flex gap-1.5 mb-5 overflow-x-auto">
        {TAGE_KURZ.map((t, i) => (
          <button key={i} onClick={() => setTag(i)}
            className="flex-shrink-0 w-10 h-10 rounded-full text-xs font-bold"
            style={{ backgroundColor: tag === i ? "#22c55e" : "#1a1a1a", color: tag === i ? "#000" : "#888" }}>
            {t}
          </button>
        ))}
      </div>

      <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>{tagData.tag}</h2>
      <div className="space-y-3">
        {(["fruehstueck", "mittagessen", "abendessen", "snack"] as const).map(key => {
          const m = tagData[key];
          return (
            <div key={key} className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-xs font-semibold mb-1" style={{ color: "#22c55e" }}>
                {MAHLZEIT_ICONS[key]} {MAHLZEIT_LABELS[key]}
              </div>
              <div className="text-sm mb-2">{m.name}</div>
              <div className="flex gap-2 flex-wrap">
                {m.rezeptId && (
                  <button onClick={() => router.push(`/rezepte?id=${m.rezeptId}`)}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "#0d2018", color: "#22c55e", border: "1px solid #166534" }}>
                    📖 Rezept ansehen
                  </button>
                )}
                {m.zutaten && m.zutaten.length > 0 && (
                  <button onClick={() => zutatenInEinkaufsliste(m.zutaten!)}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "#1a2a1a", color: "#86efac" }}>
                    🛒 Zutaten hinzufügen
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
