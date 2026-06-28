"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { REZEPTE, MeinPlan, MeinPlanTag } from "../rezepte/page";

// ─── Fertige Pläne ────────────────────────────────────────────────────────────

type FixeMahlzeit = { name: string; rezeptId?: string; zutaten?: string[] };
type FixerTag = { tag: string; fruehstueck: FixeMahlzeit; mittagessen: FixeMahlzeit; abendessen: FixeMahlzeit; snack: FixeMahlzeit };

const PLAENE: { name: string; beschreibung: string; tage: FixerTag[] }[] = [
  {
    name: "Klassisch Keto",
    beschreibung: "Einfacher Einstieg, wenig Kohlenhydrate, viel gesundes Fett",
    tage: [
      { tag: "Montag", fruehstueck: { name: "Käse-Kräuter-Omelett", rezeptId: "keto-omelette", zutaten: ["3 Eier", "50g Gouda", "Spinat", "Butter"] }, mittagessen: { name: "Hähnchenbrust mit Brokkoli in Knoblauchbutter", rezeptId: "haehnchen-brokkoli", zutaten: ["200g Hähnchenbrust", "300g Brokkoli", "Butter", "Knoblauch"] }, abendessen: { name: "Lachs mit Zucchini-Nudeln", rezeptId: "lachs-zucchini", zutaten: ["200g Lachs", "2 Zucchini", "Olivenöl", "Dill"] }, snack: { name: "Macadamia-Nüsse (30g)", zutaten: ["Macadamia"] } },
      { tag: "Dienstag", fruehstueck: { name: "Bulletproof Coffee + Spiegelei mit Räucherlachs", rezeptId: "bulletproof-coffee", zutaten: ["Kaffee", "Ghee", "MCT-Öl", "2 Eier", "Räucherlachs"] }, mittagessen: { name: "Thunfisch-Avocado Bowl", rezeptId: "thunfisch-avocado-bowl", zutaten: ["1 Dose Thunfisch", "1 Avocado", "Rucola", "Mayonnaise"] }, abendessen: { name: "Rinderhack-Pfanne mit Pilzen", rezeptId: "rinderhack-pilze", zutaten: ["400g Rinderhack", "300g Champions", "Zwiebel", "Sahne"] }, snack: { name: "Gurke mit Frischkäse", zutaten: ["Gurke", "Frischkäse"] } },
      { tag: "Mittwoch", fruehstueck: { name: "Keto Chia-Pudding", rezeptId: "chia-pudding", zutaten: ["Chiasamen", "Kokosmilch", "Himbeeren"] }, mittagessen: { name: "Caesar Salad mit Hähnchen", rezeptId: "caesar-salad-keto", zutaten: ["Hähnchenbrust", "Römersalat", "Parmesan"] }, abendessen: { name: "Schweinefilet mit Spargel", rezeptId: "spargel-schweinefilet", zutaten: ["300g Schweinefilet", "500g Spargel", "Butter"] }, snack: { name: "Hartkäse (Gouda/Cheddar)", zutaten: ["Gouda"] } },
      { tag: "Donnerstag", fruehstueck: { name: "Avocado mit Spiegelei", rezeptId: "avocado-ei", zutaten: ["1 Avocado", "2 Eier", "Olivenöl"] }, mittagessen: { name: "Griechischer Salat mit Feta", rezeptId: "griechischer-salat", zutaten: ["200g Feta", "Gurke", "Tomaten", "Oliven"] }, abendessen: { name: "Knoblauch-Garnelen mit Salat", rezeptId: "garnelen-knoblauch", zutaten: ["250g Garnelen", "Butter", "Knoblauch"] }, snack: { name: "Oliven", zutaten: ["Oliven"] } },
      { tag: "Freitag", fruehstueck: { name: "Keto Pancakes", rezeptId: "keto-pancakes", zutaten: ["Mandelmehl", "2 Eier", "Frischkäse", "Beeren"] }, mittagessen: { name: "Blumenkohl-Fried Rice", rezeptId: "blumenkohl-reis", zutaten: ["Blumenkohl", "3 Eier", "Champions"] }, abendessen: { name: "Ribeye Steak mit Kräuterbutter", rezeptId: "ribeye-kraeuterbutter", zutaten: ["300g Ribeye", "Butter", "Kräuter"] }, snack: { name: "Pecannüsse (30g)", zutaten: ["Pecannüsse"] } },
      { tag: "Samstag", fruehstueck: { name: "Großes Frühstück: Bacon, Ei, Avocado", zutaten: ["Bacon/Speck", "3 Eier", "1 Avocado"] }, mittagessen: { name: "Thunfisch-Avocado Bowl", rezeptId: "thunfisch-avocado-bowl", zutaten: ["1 Dose Thunfisch", "1 Avocado", "Rucola"] }, abendessen: { name: "Lammkoteletts mit Rosenkohl", rezeptId: "lammkoteletts-rosenkohl", zutaten: ["4 Lammkoteletts", "Rosenkohl", "Butter"] }, snack: { name: "Keto Schoko-Mousse", rezeptId: "keto-schokomousse", zutaten: ["Sahne", "Kakao", "Stevia"] } },
      { tag: "Sonntag", fruehstueck: { name: "Käse-Kräuter-Omelett", rezeptId: "keto-omelette", zutaten: ["3 Eier", "Käse", "Kräuter"] }, mittagessen: { name: "Caesar Salad mit Hähnchen", rezeptId: "caesar-salad-keto", zutaten: ["Hähnchenbrust", "Salat", "Parmesan"] }, abendessen: { name: "Hähnchen-Kokos-Curry", rezeptId: "keto-curry", zutaten: ["400g Hähnchen", "Kokosmilch", "Curry", "Spinat"] }, snack: { name: "Dunkle Schokolade 85% (2 Riegel)", zutaten: ["Dunkle Schokolade 85%"] } },
    ],
  },
  {
    name: "Fasten + Keto (16:8)",
    beschreibung: "16:8 Intervallfasten kombiniert mit Keto — maximale Fettverbrennung",
    tage: [
      { tag: "Montag", fruehstueck: { name: "Bulletproof Coffee (bricht Fasten nicht)", rezeptId: "bulletproof-coffee", zutaten: ["Kaffee", "Ghee", "MCT-Öl"] }, mittagessen: { name: "12 Uhr: Hähnchenbrust mit Avocado", zutaten: ["200g Hähnchenbrust", "1 Avocado", "Salat"] }, abendessen: { name: "20 Uhr: Lachs mit Gemüse", rezeptId: "lachs-zucchini", zutaten: ["200g Lachs", "Zucchini", "Brokkoli"] }, snack: { name: "Nur im Essensfenster: Nüsse", zutaten: ["Macadamia"] } },
      { tag: "Dienstag", fruehstueck: { name: "Schwarzer Kaffee oder Tee (Fastenzeit)", zutaten: ["Kaffee"] }, mittagessen: { name: "12 Uhr: Rinderhack Bowl mit Salat", rezeptId: "rinderhack-pilze", zutaten: ["400g Rinderhack", "Pilze", "Salat"] }, abendessen: { name: "20 Uhr: Schweinekotelett mit Spargel", zutaten: ["Schweinekotelett", "Spargel", "Butter"] }, snack: { name: "Käsewürfel", zutaten: ["Gouda oder Cheddar"] } },
      { tag: "Mittwoch", fruehstueck: { name: "Wasser / Kaffee (Fastenzeit)", zutaten: [] }, mittagessen: { name: "12 Uhr: Großer Thunfischsalat", rezeptId: "thunfisch-avocado-bowl", zutaten: ["Thunfisch", "Avocado", "Rucola"] }, abendessen: { name: "20 Uhr: Hähnchenbrust mit Brokkoli", rezeptId: "haehnchen-brokkoli", zutaten: ["Hähnchenbrust", "Brokkoli", "Knoblauchbutter"] }, snack: { name: "Oliven oder Macadamia", zutaten: ["Oliven", "Macadamia"] } },
      { tag: "Donnerstag", fruehstueck: { name: "Fastenzeit — nur Wasser/Kaffee", zutaten: [] }, mittagessen: { name: "12 Uhr: Käse-Omelett mit Speck", rezeptId: "keto-omelette", zutaten: ["3 Eier", "Käse", "Speck/Bacon"] }, abendessen: { name: "20 Uhr: Garnelen mit Zucchini", rezeptId: "garnelen-knoblauch", zutaten: ["Garnelen", "Zucchini", "Knoblauchbutter"] }, snack: { name: "Walnüsse (30g)", zutaten: ["Walnüsse"] } },
      { tag: "Freitag", fruehstueck: { name: "Fastenzeit", zutaten: [] }, mittagessen: { name: "12 Uhr: Caesar Salad mit Hähnchen", rezeptId: "caesar-salad-keto", zutaten: ["Hähnchenbrust", "Römersalat", "Parmesan"] }, abendessen: { name: "20 Uhr: Ribeye Steak", rezeptId: "ribeye-kraeuterbutter", zutaten: ["Ribeye Steak", "Grüne Bohnen", "Kräuterbutter"] }, snack: { name: "Hartkäse", zutaten: ["Gouda"] } },
      { tag: "Samstag", fruehstueck: { name: "Bulletproof Coffee (Ausnahme)", rezeptId: "bulletproof-coffee", zutaten: ["Kaffee", "Ghee", "MCT-Öl"] }, mittagessen: { name: "12 Uhr: Avocado-Lachs Bowl", zutaten: ["Räucherlachs", "Avocado", "Rucola"] }, abendessen: { name: "20 Uhr: Lammkoteletts", rezeptId: "lammkoteletts-rosenkohl", zutaten: ["Lammkoteletts", "Rosenkohl"] }, snack: { name: "Dunkle Schokolade 85%", zutaten: ["Dunkle Schokolade 85%"] } },
      { tag: "Sonntag", fruehstueck: { name: "Fastenzeit", zutaten: [] }, mittagessen: { name: "12 Uhr: Großes Keto-Frühstück", rezeptId: "keto-omelette", zutaten: ["Eier", "Bacon", "Avocado"] }, abendessen: { name: "20 Uhr: Hähnchen-Kokos-Curry", rezeptId: "keto-curry", zutaten: ["Hähnchen", "Kokosmilch", "Curry"] }, snack: { name: "Pecannüsse", zutaten: ["Pecannüsse"] } },
    ],
  },
  {
    name: "Vegetarisch Keto",
    beschreibung: "Kein Fleisch, aber trotzdem ketogen — mit Eiern, Käse und Gemüse",
    tage: [
      { tag: "Montag", fruehstueck: { name: "Rührei mit Käse und Spinat", rezeptId: "keto-omelette", zutaten: ["3 Eier", "Gouda", "Spinat", "Butter"] }, mittagessen: { name: "Avocado-Ei Salat", zutaten: ["2 Eier", "1 Avocado", "Rucola", "Olivenöl"] }, abendessen: { name: "Zucchini-Nudeln mit Pesto und Parmesan", zutaten: ["2 Zucchini", "Pesto", "Parmesan"] }, snack: { name: "Walnüsse", zutaten: ["Walnüsse"] } },
      { tag: "Dienstag", fruehstueck: { name: "Keto Chia-Pudding", rezeptId: "chia-pudding", zutaten: ["Chiasamen", "Kokosmilch", "Himbeeren"] }, mittagessen: { name: "Caprese mit Mozzarella", zutaten: ["Mozzarella", "Tomaten", "Basilikum", "Olivenöl"] }, abendessen: { name: "Blumenkohl-Fried Rice", rezeptId: "blumenkohl-reis", zutaten: ["Blumenkohl", "3 Eier", "Champions"] }, snack: { name: "Käsewürfel", zutaten: ["Gouda oder Cheddar"] } },
      { tag: "Mittwoch", fruehstueck: { name: "Avocado mit Spiegelei", rezeptId: "avocado-ei", zutaten: ["1 Avocado", "2 Eier"] }, mittagessen: { name: "Griechischer Salat mit Feta", rezeptId: "griechischer-salat", zutaten: ["Feta", "Oliven", "Gurke", "Tomate"] }, abendessen: { name: "Gefüllte Paprika mit Käse", zutaten: ["2 Paprika", "3 Eier", "Gouda"] }, snack: { name: "Macadamia", zutaten: ["Macadamia"] } },
      { tag: "Donnerstag", fruehstueck: { name: "Keto Pancakes", rezeptId: "keto-pancakes", zutaten: ["Mandelmehl", "Eier", "Frischkäse"] }, mittagessen: { name: "Halloumi-Salat (gegrillt)", rezeptId: "halloumi-salat", zutaten: ["Halloumi", "Rucola", "Kirschtomaten"] }, abendessen: { name: "Käse-Omelett Deluxe", rezeptId: "keto-omelette", zutaten: ["3 Eier", "Feta", "Spinat", "Pilze"] }, snack: { name: "Oliven", zutaten: ["Oliven"] } },
      { tag: "Freitag", fruehstueck: { name: "Bulletproof Coffee + Chia-Pudding", rezeptId: "chia-pudding", zutaten: ["Kaffee", "Ghee", "Chiasamen", "Kokosmilch"] }, mittagessen: { name: "Avocado Bowl mit Ei", zutaten: ["1 Avocado", "2 Eier", "Rucola"] }, abendessen: { name: "Blumenkohl-Pizza", zutaten: ["Blumenkohl", "Ei", "Mozzarella", "Tomatensoße"] }, snack: { name: "Pecannüsse", zutaten: ["Pecannüsse"] } },
      { tag: "Samstag", fruehstueck: { name: "Großes Käse-Omelett", rezeptId: "keto-omelette", zutaten: ["4 Eier", "Paprika", "Zucchini", "Gouda"] }, mittagessen: { name: "Griechischer Salat", rezeptId: "griechischer-salat", zutaten: ["Feta", "Oliven", "Gurke"] }, abendessen: { name: "Zucchini-Lasagne mit Ricotta", rezeptId: "zucchini-lasagne", zutaten: ["3 Zucchini", "Ricotta", "Mozzarella", "Parmesan"] }, snack: { name: "Keto Schoko-Mousse", rezeptId: "keto-schokomousse", zutaten: ["Sahne", "Kakao", "Stevia"] } },
      { tag: "Sonntag", fruehstueck: { name: "Joghurt mit Beeren und Nüssen", zutaten: ["Griechischer Joghurt", "Himbeeren", "Walnüsse"] }, mittagessen: { name: "Blumenkohl-Fried Rice", rezeptId: "blumenkohl-reis", zutaten: ["Blumenkohl", "Eier"] }, abendessen: { name: "Käse-Omelett und Salat", rezeptId: "keto-omelette", zutaten: ["Eier", "Käse", "Salat"] }, snack: { name: "Nuss-Mix", zutaten: ["Mandeln", "Walnüsse", "Macadamia"] } },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const TAGE_KURZ = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const SLOTS = [
  { key: "fruehstueck" as const, label: "Frühstück", icon: "🌅" },
  { key: "mittagessen" as const, label: "Mittagessen", icon: "☀️" },
  { key: "abendessen" as const, label: "Abendessen", icon: "🌙" },
  { key: "snack" as const, label: "Snack", icon: "🥜" },
];

function leerePlan(): MeinPlan {
  const plan: MeinPlan = {};
  TAGE.forEach(t => {
    plan[t] = { fruehstueck: { rezeptId: null }, mittagessen: { rezeptId: null }, abendessen: { rezeptId: null }, snack: { rezeptId: null } };
  });
  return plan;
}

function ladePlan(): MeinPlan {
  try {
    const d = localStorage.getItem("ketome_mein_plan");
    if (!d) return leerePlan();
    const parsed = JSON.parse(d);
    // Sicherstellen, dass alle Tage vorhanden sind
    TAGE.forEach(t => { if (!parsed[t]) parsed[t] = leerePlan()[t]; });
    return parsed;
  } catch { return leerePlan(); }
}

function speicherePlan(plan: MeinPlan) {
  localStorage.setItem("ketome_mein_plan", JSON.stringify(plan));
}

// ─── Nährwert-Eintrag in Tracking speichern ───────────────────────────────────

function naehrwertEintragen(id: string, name: string, rezept?: { kcal: number; kh: number; eiweiss: number; fett: number }) {
  const alle = JSON.parse(localStorage.getItem("ketome_naehrwerte") || "[]");
  const existiert = alle.find((e: { id: string }) => e.id === id);
  if (existiert) return;
  alle.push({
    id,
    datum: new Date().toLocaleDateString("de-DE"),
    name,
    kcal: rezept?.kcal ?? 0,
    kh: rezept?.kh ?? 0,
    eiweiss: rezept?.eiweiss ?? 0,
    fett: rezept?.fett ?? 0,
  });
  localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
}

function naehrwertEntfernen(id: string) {
  const alle = JSON.parse(localStorage.getItem("ketome_naehrwerte") || "[]");
  localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle.filter((e: { id: string }) => e.id !== id)));
}

// ─── Hauptkomponente ──────────────────────────────────────────────────────────

export default function WochenplanPage() {
  const [aktiv, setAktiv] = useState(0); // 0-2 = Fertigpläne, 3 = Mein Plan
  const [tag, setTag] = useState(0);
  const [saved, setSaved] = useState<string | null>(null);
  const [meinPlan, setMeinPlan] = useState<MeinPlan>(leerePlan());
  const [rezeptPicker, setRezeptPicker] = useState<{ slot: typeof SLOTS[number]["key"] } | null>(null);
  const [pickerSuche, setPickerSuche] = useState("");
  const [gegessen, setGegessen] = useState<Set<string>>(new Set());
  const [gegessenToast, setGegessenToast] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMeinPlan(ladePlan());
    const g = localStorage.getItem("ketome_gegessen");
    if (g) setGegessen(new Set(JSON.parse(g)));
  }, []);

  function toggleGegessen(key: string, name: string, rezeptId?: string) {
    const neues = new Set(gegessen);
    if (neues.has(key)) {
      neues.delete(key);
      naehrwertEntfernen(key);
      setGegessenToast(null);
    } else {
      neues.add(key);
      const rezept = rezeptId ? REZEPTE.find(r => r.id === rezeptId) : undefined;
      naehrwertEintragen(key, name, rezept);
      setGegessenToast(rezept ? `✓ ${name} — ${rezept.kcal} kcal, ${rezept.kh}g KH ins Tracking eingetragen` : `✓ ${name} als gegessen markiert`);
      setTimeout(() => setGegessenToast(null), 3000);
    }
    localStorage.setItem("ketome_gegessen", JSON.stringify([...neues]));
    setGegessen(neues);
  }

  // ── Fertige Pläne: Einkaufsliste ──────────────────────────────────────────

  function fixZutatenInListe(zutaten: string[]) {
    if (!zutaten || zutaten.length === 0) return;
    const vorhandene = JSON.parse(localStorage.getItem("ketome_einkaufsliste") || "[]");
    const neu = zutaten.map(z => ({ id: Date.now().toString() + Math.random(), name: z, menge: "", erledigt: false, kategorie: "Sonstiges" }));
    localStorage.setItem("ketome_einkaufsliste", JSON.stringify([...vorhandene, ...neu]));
    setSaved("Zur Einkaufsliste hinzugefügt!");
    setTimeout(() => setSaved(null), 2000);
  }

  function ganzeWocheInListe() {
    if (aktiv < 3) {
      const alle: string[] = [];
      PLAENE[aktiv].tage.forEach(t => {
        [t.fruehstueck, t.mittagessen, t.abendessen, t.snack].forEach(m => { if (m.zutaten) alle.push(...m.zutaten); });
      });
      fixZutatenInListe([...new Set(alle)]);
    } else {
      const alle: string[] = [];
      TAGE.forEach(tagName => {
        SLOTS.forEach(s => {
          const rezeptId = meinPlan[tagName]?.[s.key]?.rezeptId;
          if (rezeptId) {
            const r = REZEPTE.find(r => r.id === rezeptId);
            if (r) alle.push(...r.zutaten);
          }
        });
      });
      fixZutatenInListe([...new Set(alle)]);
    }
  }

  // ── Mein Plan: Slot bearbeiten ────────────────────────────────────────────

  function slotSetzen(slot: typeof SLOTS[number]["key"], rezeptId: string | null) {
    const neu = { ...meinPlan };
    neu[TAGE[tag]] = { ...neu[TAGE[tag]], [slot]: { rezeptId } };
    setMeinPlan(neu);
    speicherePlan(neu);
    setRezeptPicker(null);
    setPickerSuche("");
  }

  function slotLeeren(slot: typeof SLOTS[number]["key"]) {
    slotSetzen(slot, null);
  }

  const tagName = TAGE[tag];
  const tagPlan: MeinPlanTag = meinPlan[tagName] ?? leerePlan()[tagName];

  const ALLE_PLAN_NAMEN = ["Klassisch Keto", "Fasten + Keto (16:8)", "Vegetarisch Keto", "✏️ Mein Plan"];

  // ── Rezept-Picker ─────────────────────────────────────────────────────────

  const pickerRezepte = REZEPTE.filter(r => {
    const suchMatch = r.name.toLowerCase().includes(pickerSuche.toLowerCase()) || r.tags.some(t => t.includes(pickerSuche.toLowerCase()));
    return suchMatch;
  });

  return (
    <main className="px-4 py-6">
      <h1 className="text-xl font-bold mb-2">🥗 Wochenplan</h1>
      <p className="text-sm mb-4" style={{ color: "#666" }}>Fertige Pläne oder deinen eigenen erstellen</p>

      {/* Plan-Tabs */}
      <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
        {ALLE_PLAN_NAMEN.map((name, i) => (
          <button key={i} onClick={() => { setAktiv(i); setTag(0); }}
            className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium"
            style={{ backgroundColor: aktiv === i ? "#22c55e" : "#1a1a1a", color: aktiv === i ? "#000" : "#888", border: aktiv === i ? "none" : "1px solid #222" }}>
            {name}
          </button>
        ))}
      </div>

      {/* Beschreibung bei Fertigplänen */}
      {aktiv < 3 && (
        <div className="rounded-2xl p-3 mb-4 text-sm" style={{ backgroundColor: "#1a1a1a", color: "#888" }}>
          {PLAENE[aktiv].beschreibung}
        </div>
      )}

      {/* Mein Plan: Hinweis */}
      {aktiv === 3 && (
        <div className="rounded-2xl p-3 mb-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
          <p className="text-xs" style={{ color: "#86efac" }}>Tippe auf ein Mahlzeit-Feld um ein Rezept auszuwählen. Du kannst jeden Slot jederzeit ändern oder leeren.</p>
        </div>
      )}

      {/* Einkaufsliste Button */}
      <button onClick={ganzeWocheInListe}
        className="w-full py-2.5 rounded-xl text-xs font-semibold mb-4"
        style={{ backgroundColor: "#1a2a1a", border: "1px solid #166534", color: "#22c55e" }}>
        🛒 Ganze Woche in Einkaufsliste
      </button>

      {saved && (
        <div className="rounded-xl px-4 py-2 mb-4 text-center text-sm font-semibold text-black"
          style={{ backgroundColor: "#22c55e" }}>
          {saved}
        </div>
      )}

      {/* Tag-Auswahl */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto">
        {TAGE_KURZ.map((t, i) => (
          <button key={i} onClick={() => setTag(i)}
            className="flex-shrink-0 w-10 h-10 rounded-full text-xs font-bold"
            style={{ backgroundColor: tag === i ? "#22c55e" : "#1a1a1a", color: tag === i ? "#000" : "#888" }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── FERTIGE PLÄNE ── */}
      {aktiv < 3 && (() => {
        const tagData = PLAENE[aktiv].tage[tag];
        return (
          <>
            <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>{tagData.tag}</h2>
            <div className="space-y-3">
              {(["fruehstueck", "mittagessen", "abendessen", "snack"] as const).map(key => {
                const m = tagData[key];
                const slotInfo = SLOTS.find(s => s.key === key)!;
                const gKey = `fix-${aktiv}-${tagData.tag}-${key}`;
                const istGegessen = gegessen.has(gKey);
                return (
                  <div key={key} className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a", border: istGegessen ? "1px solid #166534" : "1px solid transparent" }}>
                    <div className="flex items-start justify-between mb-1">
                      <div className="text-xs font-semibold" style={{ color: "#22c55e" }}>
                        {slotInfo.icon} {slotInfo.label}
                      </div>
                      <button onClick={() => toggleGegessen(gKey, m.name, m.rezeptId)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2"
                        style={{ backgroundColor: istGegessen ? "#22c55e" : "#2a2a2a", color: istGegessen ? "#000" : "#666" }}>
                        {istGegessen ? "✓" : "○"} Gegessen
                      </button>
                    </div>
                    <div className="text-sm mb-2">{m.name}</div>
                    <div className="flex gap-2 flex-wrap">
                      {m.rezeptId && (
                        <button onClick={() => router.push(`/rezepte?id=${m.rezeptId}`)}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: "#0d2018", color: "#22c55e", border: "1px solid #166534" }}>
                          📖 Rezept
                        </button>
                      )}
                      {m.zutaten && m.zutaten.length > 0 && (
                        <button onClick={() => fixZutatenInListe(m.zutaten!)}
                          className="px-3 py-1 rounded-full text-xs"
                          style={{ backgroundColor: "#1a2a1a", color: "#86efac" }}>
                          🛒 Zutaten
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

      {/* ── MEIN PLAN ── */}
      {aktiv === 3 && (
        <>
          <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>{TAGE[tag]}</h2>
          <div className="space-y-3">
            {SLOTS.map(slotInfo => {
              const rezeptId = tagPlan[slotInfo.key]?.rezeptId ?? null;
              const rezept = rezeptId ? REZEPTE.find(r => r.id === rezeptId) : null;
              const gKey = `mein-${TAGE[tag]}-${slotInfo.key}`;
              const istGegessen = gegessen.has(gKey);
              return (
                <div key={slotInfo.key} className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a", border: istGegessen ? "1px solid #166534" : "1px solid transparent" }}>
                  <div className="text-xs font-semibold mb-2" style={{ color: "#22c55e" }}>
                    {slotInfo.icon} {slotInfo.label}
                  </div>
                  {rezept ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{rezept.bild}</span>
                          <div>
                            <div className="text-sm font-medium">{rezept.name}</div>
                            <div className="text-xs" style={{ color: "#555" }}>{rezept.kh}g KH · {rezept.kcal} kcal</div>
                          </div>
                        </div>
                        <button onClick={() => slotLeeren(slotInfo.key)}
                          className="text-xs px-2 py-1 rounded-lg"
                          style={{ backgroundColor: "#2a1a1a", color: "#ef4444" }}>
                          ✕
                        </button>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => router.push(`/rezepte?id=${rezept.id}`)}
                          className="px-3 py-1 rounded-full text-xs"
                          style={{ backgroundColor: "#0d2018", color: "#22c55e", border: "1px solid #166534" }}>
                          📖 Rezept
                        </button>
                        <button onClick={() => { setRezeptPicker({ slot: slotInfo.key }); setPickerSuche(""); }}
                          className="px-3 py-1 rounded-full text-xs"
                          style={{ backgroundColor: "#222", color: "#888" }}>
                          ↩ Ändern
                        </button>
                        <button onClick={() => fixZutatenInListe(rezept.zutaten)}
                          className="px-3 py-1 rounded-full text-xs"
                          style={{ backgroundColor: "#1a2a1a", color: "#86efac" }}>
                          🛒 Zutaten
                        </button>
                        <button onClick={() => toggleGegessen(gKey, rezept.name, rezept.id)}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: istGegessen ? "#22c55e" : "#2a2a2a", color: istGegessen ? "#000" : "#666" }}>
                          {istGegessen ? "✓ Gegessen" : "○ Gegessen"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setRezeptPicker({ slot: slotInfo.key }); setPickerSuche(""); }}
                      className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                      style={{ backgroundColor: "#222", color: "#555", border: "2px dashed #333" }}>
                      <span style={{ fontSize: 20 }}>+</span>
                      <span>Rezept wählen</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── GEGESSEN TOAST ── */}
      {gegessenToast && (
        <div className="fixed bottom-24 left-4 right-4 z-50 py-3 px-4 rounded-2xl text-center text-sm font-semibold"
          style={{ backgroundColor: "#22c55e", color: "#000" }}>
          {gegessenToast}
        </div>
      )}

      {/* ── REZEPT-PICKER MODAL ── */}
      {rezeptPicker && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "#0a0a0a" }}>
          <div className="px-4 pt-5 pb-3 flex items-center gap-3" style={{ borderBottom: "1px solid #222" }}>
            <button onClick={() => setRezeptPicker(null)} style={{ color: "#22c55e" }}>← Zurück</button>
            <span className="font-bold text-sm">
              Rezept für {SLOTS.find(s => s.key === rezeptPicker.slot)?.icon} {SLOTS.find(s => s.key === rezeptPicker.slot)?.label} wählen
            </span>
          </div>
          <div className="px-4 py-3">
            <input value={pickerSuche} onChange={e => setPickerSuche(e.target.value)}
              placeholder="🔍 Suchen..."
              className="w-full px-4 py-2 rounded-xl outline-none text-white text-sm"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-2">
            {pickerRezepte.map(r => (
              <button key={r.id} onClick={() => slotSetzen(rezeptPicker.slot, r.id)}
                className="w-full rounded-2xl p-3 flex items-center gap-3 text-left"
                style={{ backgroundColor: "#1a1a1a" }}>
                <span className="text-2xl flex-shrink-0">{r.bild}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{r.name}</div>
                  <div className="text-xs" style={{ color: "#555" }}>
                    {r.kategorie} · {r.zeit} · {r.kh}g KH · {r.kcal} kcal
                  </div>
                </div>
                <span style={{ color: "#444" }}>›</span>
              </button>
            ))}
            {pickerRezepte.length === 0 && (
              <div className="text-center py-8" style={{ color: "#555" }}>Kein Rezept gefunden.</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
