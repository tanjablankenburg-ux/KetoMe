"use client";
import { useState } from "react";

const PLAENE = [
  {
    name: "Klassisch Keto",
    beschreibung: "Einfacher Einstieg, wenig Kohlenhydrate, viel gesundes Fett",
    tage: [
      { tag: "Montag", fruehstueck: "Rühreier mit Speck und Avocado", mittagessen: "Hähnchenbrust mit Brokkoli in Butter", abendessen: "Lachs mit Zucchini-Nudeln", snack: "Macadamia-Nüsse" },
      { tag: "Dienstag", fruehstueck: "Bulletproof Coffee + Käse-Omelett", mittagessen: "Thunfischsalat mit Olivenöl", abendessen: "Rinderhackfleisch mit Pilzen", snack: "Gurke mit Frischkäse" },
      { tag: "Mittwoch", fruehstueck: "Griechischer Joghurt (vollfett) mit Walnüssen", mittagessen: "Caesar Salad mit Hähnchen (ohne Croutons)", abendessen: "Schweinefilet mit Spargel", snack: "Hartkäse" },
      { tag: "Donnerstag", fruehstueck: "Spiegelei mit Räucherlachs", mittagessen: "Blumenkohlsuppe mit Sahne", abendessen: "Hähnchenschenkel mit grünen Bohnen", snack: "Oliven" },
      { tag: "Freitag", fruehstueck: "Chia-Pudding mit Kokosöl (zuckerfrei)", mittagessen: "Garnelen mit Knoblauchbutter", abendessen: "Ribeye Steak mit Kräuterbutter", snack: "Pecannüsse" },
      { tag: "Samstag", fruehstueck: "Keto-Pancakes mit Frischkäse", mittagessen: "Avocado-Thunfisch Bowl", abendessen: "Lammkoteletts mit Rosenkohl", snack: "Mandeln" },
      { tag: "Sonntag", fruehstueck: "Großes Frühstück: Bacon, Ei, Avocado, Tomaten", mittagessen: "Reste vom Samstag", abendessen: "Hähnchen-Kokos-Curry (ohne Reis)", snack: "Dunkle Schokolade 85%" },
    ],
  },
  {
    name: "Fasten + Keto",
    beschreibung: "16:8 Intervallfasten kombiniert mit Keto — maximale Fettverbrennung",
    tage: [
      { tag: "Montag", fruehstueck: "Bulletproof Coffee (bricht das Fasten nicht)", mittagessen: "Erstes Essen 12 Uhr: Hähnchen mit Avocado", abendessen: "Letztes Essen 20 Uhr: Lachs mit Gemüse", snack: "Nur in Essensfenster: Nüsse" },
      { tag: "Dienstag", fruehstueck: "Wasser, schwarzer Kaffee oder Tee", mittagessen: "12 Uhr: Rinderhack Bowl mit Salat", abendessen: "20 Uhr: Schweinekotelett mit Spargel", snack: "Käse" },
      { tag: "Mittwoch", fruehstueck: "Fastenzeit — nur Wasser/Kaffee/Tee", mittagessen: "12 Uhr: Thunfischsalat groß", abendessen: "20 Uhr: Hähnchenbrust mit Brokkoli", snack: "Oliven oder Macadamia" },
      { tag: "Donnerstag", fruehstueck: "Fastenzeit", mittagessen: "12 Uhr: Omelett mit Speck und Käse", abendessen: "20 Uhr: Garnelen mit Zucchini", snack: "Walnüsse" },
      { tag: "Freitag", fruehstueck: "Fastenzeit", mittagessen: "12 Uhr: Caesar Salad mit Hähnchen", abendessen: "20 Uhr: Steak mit grünen Bohnen", snack: "Hartkäse" },
      { tag: "Samstag", fruehstueck: "Fastenzeit — Ausnahme: Bulletproof Coffee", mittagessen: "12 Uhr: Avocado-Lachs Bowl", abendessen: "20 Uhr: Lammkoteletts mit Salat", snack: "Dunkle Schokolade 85%" },
      { tag: "Sonntag", fruehstueck: "Fastenzeit", mittagessen: "12 Uhr: Großes Keto-Frühstück", abendessen: "20 Uhr: Hähnchen-Kokos-Curry", snack: "Pecannüsse" },
    ],
  },
  {
    name: "Vegeta­risch Keto",
    beschreibung: "Kein Fleisch, aber trotzdem ketogen — mit Eiern, Käse und Hülsenfrüchten",
    tage: [
      { tag: "Montag", fruehstueck: "Rührei mit Käse und Spinat", mittagessen: "Avocado-Ei Salat", abendessen: "Zucchini-Nudeln mit Pesto und Parmesan", snack: "Walnüsse" },
      { tag: "Dienstag", fruehstueck: "Keto-Joghurt mit Nüssen", mittagessen: "Caprese mit Mozzarella und Olivenöl", abendessen: "Blumenkohlreis mit Ei und Gemüse", snack: "Käsewürfel" },
      { tag: "Mittwoch", fruehstueck: "Chia-Pudding mit Kokosöl", mittagessen: "Griechischer Salat mit extra Feta", abendessen: "Gefüllte Paprika mit Käse und Ei", snack: "Macadamia" },
      { tag: "Donnerstag", fruehstueck: "Spiegelei auf Avocado", mittagessen: "Tomatensuppe mit Sahne (keine Nudeln)", abendessen: "Käsefondue mit Gemüse", snack: "Oliven" },
      { tag: "Freitag", fruehstueck: "Keto-Pancakes mit Frischkäse", mittagessen: "Halloumi-Salat gegrillt", abendessen: "Gemüse-Frittata", snack: "Pecan-Nüsse" },
      { tag: "Samstag", fruehstueck: "Großes Omelett mit allem was da ist", mittagessen: "Avocado-Bowl mit Ei", abendessen: "Blumenkohl-Pizza (Low Carb Boden)", snack: "Dunkle Schokolade 85%" },
      { tag: "Sonntag", fruehstueck: "Joghurt mit Beeren (wenige) und Nüssen", mittagessen: "Reste", abendessen: "Zucchini-Lasagne mit Ricotta", snack: "Nussmix" },
    ],
  },
];

const TAGE_KURZ = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export default function WochenplanPage() {
  const [aktiv, setAktiv] = useState(0);
  const [tag, setTag] = useState(0);
  const plan = PLAENE[aktiv];
  const tagData = plan.tage[tag];

  return (
    <main className="px-4 py-6">
      <h1 className="text-xl font-bold mb-2">🥗 Wochenplan</h1>
      <p className="text-sm mb-5" style={{ color: "#666" }}>Fertige Keto-Pläne für jeden Typ</p>

      {/* Plan Auswahl */}
      <div className="space-y-2 mb-6">
        {PLAENE.map((p, i) => (
          <button key={i} onClick={() => { setAktiv(i); setTag(0); }}
            className="w-full text-left rounded-2xl p-4"
            style={{ backgroundColor: aktiv === i ? "#0d2018" : "#1a1a1a", border: aktiv === i ? "1px solid #22c55e" : "1px solid transparent" }}>
            <div className="font-semibold text-sm">{p.name}</div>
            <div className="text-xs mt-1" style={{ color: "#666" }}>{p.beschreibung}</div>
          </button>
        ))}
      </div>

      {/* Tag Auswahl */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto">
        {TAGE_KURZ.map((t, i) => (
          <button key={i} onClick={() => setTag(i)}
            className="flex-shrink-0 w-10 h-10 rounded-full text-xs font-bold"
            style={{ backgroundColor: tag === i ? "#22c55e" : "#1a1a1a", color: tag === i ? "#000" : "#888" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Mahlzeiten */}
      <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>{tagData.tag}</h2>
      <div className="space-y-3">
        {[
          { label: "🌅 Frühstück", wert: tagData.fruehstueck },
          { label: "☀️ Mittagessen", wert: tagData.mittagessen },
          { label: "🌙 Abendessen", wert: tagData.abendessen },
          { label: "🥜 Snack", wert: tagData.snack },
        ].map(({ label, wert }) => (
          <div key={label} className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-xs font-semibold mb-1" style={{ color: "#22c55e" }}>{label}</div>
            <div className="text-sm">{wert}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
