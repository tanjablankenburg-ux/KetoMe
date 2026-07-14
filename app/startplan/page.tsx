"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Mahlzeit = { name: string; zutaten: string; nettoKh: string };
type Tag = {
  nr: number;
  titel: string;
  motto: string;
  farbe: string;
  status: string;
  wasErwarten: string;
  fokus: string;
  fruehstueck: Mahlzeit;
  mittagessen: Mahlzeit;
  abendessen: Mahlzeit;
  snack?: Mahlzeit;
  tipp: string;
  aufgaben: string[];
};

const TAGE: Tag[] = [
  {
    nr: 1,
    titel: "Tag 1 — Der Neustart",
    motto: "Glykogenspeicher leeren, Ketose vorbereiten",
    farbe: "#22c55e",
    status: "Startphase",
    wasErwarten: "Heute merkst du noch kaum etwas. Der Körper leert langsam seine Glykogenspeicher. Energie ist noch normal — genieße es!",
    fokus: "Kohlenhydrate konsequent unter 20g Netto-KH halten. Viel Wasser trinken. Salz nicht vergessen.",
    fruehstueck: { name: "Rührei mit Speck & Avocado", zutaten: "3 Eier · 3 Scheiben Speck · ½ Avocado · Butter · Salz & Pfeffer", nettoKh: "2g" },
    mittagessen: { name: "Hähnchenbrust mit Brokkoli", zutaten: "200g Hähnchenbrust · 200g Brokkoli · 2 EL Olivenöl · Knoblauch · Salz", nettoKh: "6g" },
    abendessen: { name: "Lachs mit Spinat-Salat", zutaten: "200g Lachsfilet · 100g Babyspinat · 1 EL Zitronensaft · 2 EL Olivenöl · Salz", nettoKh: "3g" },
    snack: { name: "Handvoll Macadamia-Nüsse", zutaten: "30g Macadamia", nettoKh: "1g" },
    tipp: "Bereite heute schon für morgen vor — Eier kochen, Gemüse waschen. Wenn Tag 2 vorbereitet ist, passieren keine Fehler.",
    aufgaben: ["Startgewicht eintragen", "2,5L Wasser trinken", "Elektrolyte: Prise Salz ins Wasser", "Kühlschrank keto-tauglich machen"],
  },
  {
    nr: 2,
    titel: "Tag 2 — Die Welle kommt",
    motto: "Keto-Grippe kann beginnen — du bist vorbereitet",
    farbe: "#f59e0b",
    status: "Achtung: Keto-Grippe möglich",
    wasErwarten: "Viele merken ab Tag 2 erste Symptome: leichte Kopfschmerzen, Müdigkeit, Schwindel. Das ist normal und zeigt, dass der Körper umschaltet. Kein Grund aufzuhören!",
    fokus: "Elektrolyte sind heute dein wichtigstes Werkzeug. Brühe trinken, Magnesium nehmen, viel Wasser.",
    fruehstueck: { name: "Bulletproof Coffee + Spiegeleier", zutaten: "2 Tassen Kaffee · 1 EL Butter · 1 EL MCT-Öl · 2 Spiegeleier · Salz", nettoKh: "1g" },
    mittagessen: { name: "Thunfisch-Salat mit Ei", zutaten: "1 Dose Thunfisch · 2 hartgekochte Eier · 100g Feldsalat · Mayo · Zitrone", nettoKh: "3g" },
    abendessen: { name: "Rinderhackfleisch-Pfanne", zutaten: "250g Rinderhack · 150g Zucchini · 1 Paprika · Zwiebel · Olivenöl · Gewürze", nettoKh: "8g" },
    tipp: "Keto-Grippe? Sofort: 500ml Wasser + ½ TL Salz + Magnesium 300mg. Wirkt oft in 20 Minuten.",
    aufgaben: ["Magnesium nehmen (300mg)", "Knochenbrühe oder Gemüsebrühe trinken", "Leichte Bewegung — Spaziergang reicht", "Gewicht eintragen"],
  },
  {
    nr: 3,
    titel: "Tag 3 — Die Talsohle",
    motto: "Der härteste Tag — und der letzte seiner Art",
    farbe: "#ef4444",
    status: "Talsohle — Durchhalten!",
    wasErwarten: "Tag 3 ist für viele der schwerste. Ketone steigen aber bereits! MCT-Öl oder exogene Ketone überbrücken jetzt perfekt. Nach heute geht es bergauf.",
    fokus: "Fett erhöhen — MCT-Öl in Kaffee, Avocado zu jeder Mahlzeit. Der Körper braucht jetzt Energie.",
    fruehstueck: { name: "Avocado-Eggs mit Bacon", zutaten: "1 Avocado halbiert · 2 Eier in Avocado gebacken · 4 Scheiben Bacon · Salz · Chiliflocken", nettoKh: "3g" },
    mittagessen: { name: "Cremige Brokkoli-Suppe", zutaten: "300g Brokkoli · 200ml Sahne · 500ml Gemüsebrühe · Cheddar · Knoblauch · Butter", nettoKh: "7g" },
    abendessen: { name: "Schweinebauch mit Sauerkraut", zutaten: "250g Schweinebauch · 150g Sauerkraut · Senf · Salz · Kümmel", nettoKh: "4g" },
    snack: { name: "Käse & Gurken-Sticks", zutaten: "50g Gouda · ½ Gurke in Streifen", nettoKh: "2g" },
    tipp: "Wenn du heute durchhältst, ist das Schlimmste vorbei. Morgen fühlen sich die meisten deutlich besser.",
    aufgaben: ["MCT-Öl in Kaffee oder Smoothie", "Ketone messen falls Messgerät vorhanden", "Keto-Grippe Guide prüfen bei Symptomen", "Früh schlafen gehen"],
  },
  {
    nr: 4,
    titel: "Tag 4 — Die Wende",
    motto: "Erste Ketone messbar — Energie kommt zurück",
    farbe: "#f59e0b",
    status: "Besserung beginnt",
    wasErwarten: "Viele berichten ab Tag 4 von spürbarer Besserung. Kopfschmerzen lassen nach, Energie stabilisiert sich. Die ersten Ketone sind jetzt messbar (> 0.5 mmol/L).",
    fokus: "Eiweißzufuhr prüfen — nicht zu viel, nicht zu wenig. 1.2–1.7g pro kg Körpergewicht.",
    fruehstueck: { name: "Griechischer Joghurt mit Nüssen", zutaten: "150g Vollfett-Joghurt (Skyr) · 30g Walnüsse · 1 TL Chiasamen · Zimt", nettoKh: "6g" },
    mittagessen: { name: "Hähnchen-Caesar-Salat", zutaten: "200g Hähnchenbrust gegrillt · Römersalat · Parmesan · Caesar-Dressing · Speck", nettoKh: "5g" },
    abendessen: { name: "Zucchini-Nudeln mit Pesto & Lachs", zutaten: "2 Zucchini spiralisiert · 150g Lachs · 3 EL Pesto · Pinienkerne · Parmesan", nettoKh: "6g" },
    tipp: "Heute ist ein guter Tag um Ketone zu messen. Erste messbare Ketone im Blut bestätigen: es funktioniert!",
    aufgaben: ["Ketone messen (Ziel: > 0.5 mmol/L)", "Gewicht eintragen", "Makros prüfen — unter 20g Netto-KH?", "Etwas Sport: leichtes Krafttraining okay"],
  },
  {
    nr: 5,
    titel: "Tag 5 — Ketose!",
    motto: "Das Gehirn läuft auf Ketonen",
    farbe: "#22c55e",
    status: "Ketose erreicht!",
    wasErwarten: "Willkommen in der Ketose! Viele erleben jetzt ungewohnte mentale Klarheit, stabile Energie ohne Schwankungen und deutlich weniger Hunger. Das ist kein Placebo — das sind Ketone.",
    fokus: "Genießen! Aber weiter konsequent bleiben. Die nächsten Wochen vertieft sich die Adaption.",
    fruehstueck: { name: "Omelette mit Feta & Oliven", zutaten: "3 Eier · 50g Feta · 10 Oliven · Tomaten (klein) · Frühlingszwiebeln · Olivenöl", nettoKh: "4g" },
    mittagessen: { name: "Beef-Bowl mit Avocado", zutaten: "200g Rinderhack · 1 Avocado · Rucola · Tomaten · Limette · Koriander · Olivenöl", nettoKh: "5g" },
    abendessen: { name: "Garnelen-Pfanne mit Knoblauch-Butter", zutaten: "300g Garnelen · 4 Zehen Knoblauch · 3 EL Butter · Zitrone · Petersilie · Chili", nettoKh: "2g" },
    snack: { name: "Dunkle Schokolade 85%+", zutaten: "2 Riegel (20g) dunkle Schokolade ab 85%", nettoKh: "3g" },
    tipp: "Du hast es geschafft! Jetzt Ketone messen und das Ergebnis in der Profi-Zone festhalten — dein erster Beweis.",
    aufgaben: ["Ketone messen & in Profi-Zone eintragen", "Foto machen — du siehst schon anders aus", "Wochenplan für Woche 2 planen", "Freunde oder Familie informieren"],
  },
  {
    nr: 6,
    titel: "Tag 6 — In die Tiefe",
    motto: "Adaption vertieft sich — jetzt Routine aufbauen",
    farbe: "#22c55e",
    status: "Keto-adapted — fast!",
    wasErwarten: "Der Körper wird effizienter. Fettverbrennung läuft auf Hochtouren. Hunger ist deutlich geringer — viele überspringen das Frühstück natürlich (erstes Zeichen für Ketose-Adaption).",
    fokus: "Routine! Keto funktioniert wenn es zur Gewohnheit wird, nicht wenn man täglich kämpft.",
    fruehstueck: { name: "Bacon-Eier-Muffins (Batch)", zutaten: "6 Eier · 6 Scheiben Bacon · 50g Cheddar · Salz · Paprikapulver (Muffinform)", nettoKh: "1g" },
    mittagessen: { name: "Keto-Wrap mit Salatblatt", zutaten: "Große Salatblätter · 150g Hähnchen · Avocado · Gurke · Frischkäse · Senf", nettoKh: "4g" },
    abendessen: { name: "Lammkoteletts mit Spargel", zutaten: "300g Lammkoteletts · 200g grüner Spargel · 3 EL Butter · Rosmarin · Knoblauch", nettoKh: "4g" },
    tipp: "Batch-Cooking heute: Bacon-Muffins für 3 Tage vorkochen. Keto wird einfacher wenn Essen schon bereit liegt.",
    aufgaben: ["Batch-Cooking für Woche 2", "Einkaufsliste für nächste Woche erstellen", "Supplement-Guide prüfen", "Gewicht eintragen"],
  },
  {
    nr: 7,
    titel: "Tag 7 — Du hast es!",
    motto: "Eine Woche keto — dein Körper ist ein anderer",
    farbe: "#8b5cf6",
    status: "🎉 Woche 1 geschafft!",
    wasErwarten: "Glückwunsch! Nach 7 Tagen ist der härteste Teil hinter dir. Dein Körper hat umgestellt, Ketone fließen, der Hunger ist unter Kontrolle. Jetzt beginnt die echte Adaption.",
    fokus: "Rückblick + Ausblick. Was hat gut funktioniert? Was willst du in Woche 2 verbessern?",
    fruehstueck: { name: "Keto-Pancakes mit Beeren", zutaten: "3 Eier · 100g Frischkäse · 1 TL Flohsamenschalen · Vanille · 50g Beeren · Butter", nettoKh: "6g" },
    mittagessen: { name: "Caprese mit Parmaschinken", zutaten: "2 Tomaten · 150g Mozzarella · 4 Scheiben Parmaschinken · Basilikum · Olivenöl · Balsamico (1 TL)", nettoKh: "6g" },
    abendessen: { name: "Ribeye-Steak mit Kräuterbutter", zutaten: "300g Ribeye · 2 EL Kräuterbutter · Salz · Pfeffer · Thymian · Knoblauch", nettoKh: "0g" },
    snack: { name: "Keto-Mousse au Chocolat", zutaten: "100ml Sahne geschlagen · 2 EL Kakaopulver · Stevia nach Geschmack", nettoKh: "3g" },
    tipp: "Feiere heute — du hast eine Woche Keto durchgezogen! Das schaffen nicht viele. Woche 2 wird leichter, Woche 4 wird dein Leben verändern.",
    aufgaben: ["Wochengewicht vergleichen", "Ketone messen — Wochenergebnis", "Erfolge in der App eintragen", "Wochenplan für Woche 2 festlegen"],
  },
];

export default function StartplanPage() {
  const [aktiverTag, setAktiverTag] = useState<number>(1);
  const [erledigte, setErledigte] = useState<Record<string, boolean>>({});
  const [ketoTag, setKetoTag] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ketome_startplan_erledigte");
    if (saved) try { setErledigte(JSON.parse(saved)); } catch {}

    const g = localStorage.getItem("ketome_gewicht");
    if (g) {
      try {
        const arr = JSON.parse(g);
        if (arr.length > 0) {
          const [d, m, y] = arr[0].datum.split(".").map(Number);
          const start = new Date(y, m - 1, d);
          const diff = Math.floor((Date.now() - start.getTime()) / 86400000) + 1;
          const tag = Math.max(1, Math.min(7, diff));
          setKetoTag(tag);
          setAktiverTag(tag);
        }
      } catch {}
    }
  }, []);

  function toggleAufgabe(tagNr: number, aufgabe: string) {
    const key = `${tagNr}-${aufgabe}`;
    const neu = { ...erledigte, [key]: !erledigte[key] };
    setErledigte(neu);
    localStorage.setItem("ketome_startplan_erledigte", JSON.stringify(neu));
  }

  const tag = TAGE[aktiverTag - 1];
  const tagAufgabenErledigt = tag.aufgaben.filter(a => erledigte[`${tag.nr}-${a}`]).length;

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      {/* Hero */}
      <div className="mb-5">
        <h1 className="text-2xl font-black mb-1">🗓 7-Tage-Startplan</h1>
        <p className="text-sm" style={{ color: "#666" }}>Dein Schritt-für-Schritt Plan in die Ketose — mit Mahlzeiten, Tipps und Tagesaufgaben.</p>
      </div>

      {/* Aktueller Tag Banner */}
      {ketoTag && ketoTag <= 7 && (
        <div className="rounded-2xl p-3 mb-4 flex items-center gap-3"
          style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
          <span className="text-2xl">📍</span>
          <div>
            <div className="text-xs font-semibold" style={{ color: "#22c55e" }}>Du bist heute an Tag {ketoTag}</div>
            <div className="text-xs" style={{ color: "#555" }}>Automatisch aus deinem Tracking erkannt</div>
          </div>
        </div>
      )}

      {/* Tag-Auswahl */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {TAGE.map(t => (
          <button key={t.nr} onClick={() => setAktiverTag(t.nr)}
            className="flex-shrink-0 w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center"
            style={{
              backgroundColor: aktiverTag === t.nr ? t.farbe : ketoTag && t.nr < ketoTag ? "#0d2018" : "#1a1a1a",
              color: aktiverTag === t.nr ? "#000" : ketoTag && t.nr < ketoTag ? "#22c55e" : "#888",
              border: ketoTag === t.nr ? `2px solid ${t.farbe}` : "none",
            }}>
            {ketoTag && t.nr < ketoTag ? "✓" : t.nr}
          </button>
        ))}
      </div>

      {/* Tag-Karte */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a", borderLeft: `4px solid ${tag.farbe}` }}>
        <div className="text-xs font-semibold mb-0.5" style={{ color: tag.farbe }}>{tag.status.toUpperCase()}</div>
        <h2 className="text-lg font-black mb-1">{tag.titel}</h2>
        <p className="text-xs italic mb-3" style={{ color: "#555" }}>{tag.motto}</p>

        <div className="space-y-3">
          <div className="rounded-xl p-3" style={{ backgroundColor: "#2a2a2a" }}>
            <div className="text-xs font-semibold mb-1" style={{ color: "#f59e0b" }}>👀 WAS DICH ERWARTET</div>
            <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>{tag.wasErwarten}</p>
          </div>
          <div className="rounded-xl p-3" style={{ backgroundColor: "#0d1a1a" }}>
            <div className="text-xs font-semibold mb-1" style={{ color: "#22c55e" }}>🎯 HEUTIGER FOKUS</div>
            <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>{tag.fokus}</p>
          </div>
        </div>
      </div>

      {/* Mahlzeiten */}
      <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>MAHLZEITEN HEUTE</div>
      <div className="space-y-2 mb-4">
        {[
          { label: "🌅 Frühstück", m: tag.fruehstueck },
          { label: "☀️ Mittagessen", m: tag.mittagessen },
          { label: "🌙 Abendessen", m: tag.abendessen },
          ...(tag.snack ? [{ label: "🍫 Snack", m: tag.snack }] : []),
        ].map(({ label, m }) => (
          <div key={label} className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-semibold" style={{ color: "#555" }}>{label}</div>
              <div className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#0d2018", color: "#22c55e" }}>
                {m.nettoKh} Netto-KH
              </div>
            </div>
            <div className="font-semibold text-sm mb-1">{m.name}</div>
            <div className="text-xs leading-relaxed" style={{ color: "#666" }}>{m.zutaten}</div>
          </div>
        ))}
      </div>

      {/* Tages-Tipp */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a0a2e", border: "1px solid #8b5cf633" }}>
        <div className="text-xs font-semibold mb-1" style={{ color: "#8b5cf6" }}>💡 TIPP DES TAGES</div>
        <p className="text-xs leading-relaxed" style={{ color: "#c4b5fd" }}>{tag.tipp}</p>
      </div>

      {/* Tagesaufgaben */}
      <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>
        AUFGABEN — {tagAufgabenErledigt}/{tag.aufgaben.length} ERLEDIGT
      </div>
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="rounded-full h-1.5 mb-3" style={{ backgroundColor: "#2a2a2a" }}>
          <div className="rounded-full h-1.5 transition-all"
            style={{ backgroundColor: tag.farbe, width: `${(tagAufgabenErledigt / tag.aufgaben.length) * 100}%` }} />
        </div>
        <div className="space-y-2">
          {tag.aufgaben.map(a => {
            const key = `${tag.nr}-${a}`;
            const erledigt = !!erledigte[key];
            return (
              <button key={a} onClick={() => toggleAufgabe(tag.nr, a)}
                className="w-full flex items-center gap-3 py-1 text-left">
                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: erledigt ? tag.farbe : "#2a2a2a", border: erledigt ? "none" : "1px solid #333" }}>
                  {erledigt && <span className="text-[10px] font-bold" style={{ color: tag.nr === 7 ? "#fff" : "#000" }}>✓</span>}
                </div>
                <span className="text-sm" style={{ color: erledigt ? "#555" : "#ccc", textDecoration: erledigt ? "line-through" : "none" }}>
                  {a}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation zwischen Tagen */}
      <div className="flex gap-2 mb-4">
        {aktiverTag > 1 && (
          <button onClick={() => setAktiverTag(aktiverTag - 1)}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold"
            style={{ backgroundColor: "#1a1a1a", color: "#888" }}>
            ← Tag {aktiverTag - 1}
          </button>
        )}
        {aktiverTag < 7 && (
          <button onClick={() => setAktiverTag(aktiverTag + 1)}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold"
            style={{ backgroundColor: "#1a1a1a", color: "#22c55e" }}>
            Tag {aktiverTag + 1} →
          </button>
        )}
      </div>

      {/* Tag 7 CTA */}
      {aktiverTag === 7 && (
        <div className="rounded-2xl p-5 text-center" style={{ background: "linear-gradient(135deg, #1a0a2e, #0d2018)", border: "1px solid #8b5cf644" }}>
          <div className="text-4xl mb-2">🏆</div>
          <div className="font-black text-lg mb-1" style={{ color: "#c4b5fd" }}>Woche 1 geschafft!</div>
          <p className="text-xs mb-4" style={{ color: "#777" }}>Du hast die schwerste Phase hinter dir. Jetzt beginnt die echte Keto-Adaption.</p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/erfolge" className="py-2.5 rounded-xl text-xs font-bold text-center"
              style={{ backgroundColor: "#22c55e22", color: "#22c55e" }}>
              🏆 Erfolge ansehen
            </Link>
            <Link href="/profis" className="py-2.5 rounded-xl text-xs font-bold text-center"
              style={{ backgroundColor: "#3b82f622", color: "#3b82f6" }}>
              ⚗️ Ketone tracken
            </Link>
          </div>
        </div>
      )}

      {/* Keto-Grippe Hinweis (Tage 2-3) */}
      {(aktiverTag === 2 || aktiverTag === 3) && (
        <Link href="/keto-flu" className="mt-3 flex items-center gap-3 rounded-2xl p-4"
          style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d44" }}>
          <span className="text-xl">🤒</span>
          <div>
            <div className="font-semibold text-sm">Keto-Grippe Symptome?</div>
            <div className="text-xs" style={{ color: "#555" }}>Sofort-Hilfe im Keto-Grippe Guide</div>
          </div>
          <span className="ml-auto text-xs" style={{ color: "#ef4444" }}>→</span>
        </Link>
      )}
    </main>
  );
}
