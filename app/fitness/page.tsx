"use client";
import { useState } from "react";

type Uebung = {
  id: string;
  name: string;
  icon: string;
  kategorie: "Kraft" | "Cardio" | "Core" | "Dehnen";
  muskel: string;
  sets: string;
  dauer?: string;
  schwierigkeit: "Einfach" | "Mittel" | "Fortgeschritten";
  tipp: string;
  ausfuehrung: string[];
};

const UEBUNGEN: Uebung[] = [
  // ─── KRAFT ────────────────────────────────────────────────────────────────
  {
    id: "kniebeugen",
    name: "Kniebeugen",
    icon: "🦵",
    kategorie: "Kraft",
    muskel: "Beine, Po",
    sets: "3 × 15 Wdh.",
    schwierigkeit: "Einfach",
    tipp: "Knie zeigen in Richtung Zehen, Rücken gerade — nicht nach vorne fallen.",
    ausfuehrung: [
      "Füße schulterbreit, Zehen leicht nach außen.",
      "Arme nach vorne strecken oder verschränken.",
      "Langsam in die Hocke — Oberschenkel parallel zum Boden.",
      "Durch die Fersen wieder hochdrücken.",
    ],
  },
  {
    id: "ausfallschritte",
    name: "Ausfallschritte",
    icon: "🚶",
    kategorie: "Kraft",
    muskel: "Oberschenkel, Po, Wade",
    sets: "3 × 12 pro Bein",
    schwierigkeit: "Einfach",
    tipp: "Vorderes Knie bleibt über dem Fuß — nicht darüber hinaus.",
    ausfuehrung: [
      "Aufrecht stehen, Hände an die Hüften.",
      "Großen Schritt nach vorne machen.",
      "Hinteres Knie Richtung Boden senken (nicht aufsetzen).",
      "Zurück zur Ausgangsposition drücken.",
    ],
  },
  {
    id: "liegestuetze",
    name: "Liegestütze",
    icon: "💪",
    kategorie: "Kraft",
    muskel: "Brust, Schultern, Trizeps",
    sets: "3 × 10–15 Wdh.",
    schwierigkeit: "Einfach",
    tipp: "Körper bleibt die ganze Zeit gerade — kein Hohlkreuz, kein Hängen.",
    ausfuehrung: [
      "Hände etwas breiter als schulterbreit, Finger zeigen nach vorne.",
      "Körper bildet eine gerade Linie von Kopf bis Ferse.",
      "Brust langsam zur Matte senken.",
      "Explosiv wieder hochdrücken.",
    ],
  },
  {
    id: "liegestuetze-knie",
    name: "Liegestütze auf Knien",
    icon: "💪",
    kategorie: "Kraft",
    muskel: "Brust, Schultern, Trizeps",
    sets: "3 × 12 Wdh.",
    schwierigkeit: "Einfach",
    tipp: "Ideal zum Einstieg — gleiche Technik wie normale Liegestütze.",
    ausfuehrung: [
      "Knie auf der Matte, Hände schulterbreit.",
      "Hüfte nach vorne schieben — Körper gerade.",
      "Brust zur Matte senken.",
      "Zurückdrücken.",
    ],
  },
  {
    id: "dips-stuhl",
    name: "Dips am Stuhl",
    icon: "🪑",
    kategorie: "Kraft",
    muskel: "Trizeps, Schultern",
    sets: "3 × 12 Wdh.",
    schwierigkeit: "Einfach",
    tipp: "Rücken nah am Stuhl halten — je weiter die Beine, desto schwerer.",
    ausfuehrung: [
      "Hände auf Stuhlkante, Finger zeigen nach vorne.",
      "Beine gestreckt oder angewinkelt vor dir.",
      "Ellbogen nach hinten beugen, Körper senken.",
      "Hochdrücken bis Arme fast gestreckt.",
    ],
  },
  {
    id: "rudern-rucksack",
    name: "Rudern mit Rucksack",
    icon: "🎒",
    kategorie: "Kraft",
    muskel: "Rücken, Bizeps",
    sets: "3 × 12 pro Arm",
    schwierigkeit: "Einfach",
    tipp: "Ellbogen nah am Körper führen — nicht mit dem Rücken schwingen.",
    ausfuehrung: [
      "Rucksack (gefüllt) in eine Hand nehmen.",
      "Anderen Arm auf Knie oder Tisch abstützen.",
      "Rucksack nah am Körper nach oben ziehen.",
      "Langsam ablassen.",
    ],
  },
  {
    id: "schulterpress-stehend",
    name: "Schulterdrücken stehend",
    icon: "🏋️",
    kategorie: "Kraft",
    muskel: "Schultern, Trizeps",
    sets: "3 × 12 Wdh.",
    schwierigkeit: "Mittel",
    tipp: "Kern anspannen — nicht ins Hohlkreuz fallen beim Drücken.",
    ausfuehrung: [
      "Hanteln/Wasserflaschen auf Schulternhöhe.",
      "Füße schulterbreit, Körper stabil.",
      "Gewichte gerade über den Kopf drücken.",
      "Kontrolliert zurück auf Schulternhöhe.",
    ],
  },
  {
    id: "wandsitzen",
    name: "Wandsitzen (Wall Sit)",
    icon: "🧱",
    kategorie: "Kraft",
    muskel: "Oberschenkel, Po",
    sets: "3 × 45 Sek.",
    dauer: "45 Sek.",
    schwierigkeit: "Einfach",
    tipp: "Rücken flach an der Wand — Oberschenkel parallel zum Boden.",
    ausfuehrung: [
      "Rücken an die Wand lehnen.",
      "In Sitzhaltung hinabgleiten — 90° Winkel im Knie.",
      "Arme locker vor dem Körper.",
      "Position halten.",
    ],
  },
  {
    id: "glute-bridge",
    name: "Glute Bridge (Hüftheben)",
    icon: "🍑",
    kategorie: "Kraft",
    muskel: "Po, hintere Oberschenkel",
    sets: "3 × 20 Wdh.",
    schwierigkeit: "Einfach",
    tipp: "Oben den Po aktiv anspannen und 1 Sekunde halten.",
    ausfuehrung: [
      "Rücken auf der Matte, Knie angewinkelt, Füße flach.",
      "Hüfte gerade nach oben drücken.",
      "Oben kurz halten, Po fest anspannen.",
      "Langsam ablassen — Rücken nicht aufsetzen zwischen den Wiederholungen.",
    ],
  },
  {
    id: "sumo-kniebeuge",
    name: "Sumo-Kniebeuge",
    icon: "🦵",
    kategorie: "Kraft",
    muskel: "Innenschenkel, Po, Beine",
    sets: "3 × 15 Wdh.",
    schwierigkeit: "Einfach",
    tipp: "Breiter Stand, Zehen stark nach außen — trainiert den Innenschenkel gezielt.",
    ausfuehrung: [
      "Weiter Stand als bei normalen Kniebeugen.",
      "Zehen 45° nach außen.",
      "Tief in die Hocke — Brust aufrecht.",
      "Durch die Fersen hochdrücken.",
    ],
  },

  // ─── CARDIO ───────────────────────────────────────────────────────────────
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    icon: "⭐",
    kategorie: "Cardio",
    muskel: "Ganzkörper",
    sets: "3 × 40 Sek.",
    dauer: "40 Sek.",
    schwierigkeit: "Einfach",
    tipp: "Auf Zehen landen — schont die Gelenke.",
    ausfuehrung: [
      "Aufrecht stehen, Arme seitlich am Körper.",
      "Gleichzeitig Beine auseinander springen und Arme über den Kopf.",
      "Zurück in die Ausgangsposition.",
      "Rhythmisch wiederholen.",
    ],
  },
  {
    id: "high-knees",
    name: "High Knees",
    icon: "🏃",
    kategorie: "Cardio",
    muskel: "Beine, Rumpf",
    sets: "3 × 30 Sek.",
    dauer: "30 Sek.",
    schwierigkeit: "Einfach",
    tipp: "Arme mitschwingen — erhöht die Intensität und Gleichgewicht.",
    ausfuehrung: [
      "Aufrecht stehen.",
      "Abwechselnd Knie so hoch wie möglich heben.",
      "Arme gegenseitig mitschwingen.",
      "Schnelles, kontrolliertes Tempo.",
    ],
  },
  {
    id: "seilspringen",
    name: "Seilspringen (oder ohne Seil)",
    icon: "🪢",
    kategorie: "Cardio",
    muskel: "Waden, Ausdauer",
    sets: "3 × 1 Min.",
    dauer: "1 Min.",
    schwierigkeit: "Einfach",
    tipp: "Auch ohne Seil (Phantom Rope) genauso effektiv für den Puls.",
    ausfuehrung: [
      "Seil oder Bewegung simulieren.",
      "Auf Zehenballen springen.",
      "Handgelenke drehen — nicht die Arme.",
      "Gleichmäßiger Rhythmus.",
    ],
  },
  {
    id: "burpees",
    name: "Burpees",
    icon: "🔥",
    kategorie: "Cardio",
    muskel: "Ganzkörper",
    sets: "3 × 8 Wdh.",
    schwierigkeit: "Mittel",
    tipp: "Qualität vor Geschwindigkeit — lieber 8 sauber als 20 schlampig.",
    ausfuehrung: [
      "Aufrecht stehen.",
      "In die Hocke — Hände auf den Boden.",
      "Beine nach hinten strecken (Liegestützhaltung).",
      "Optional: eine Liegestütze.",
      "Beine zurück zur Hocke — explosiv aufspringen.",
    ],
  },
  {
    id: "treppe",
    name: "Treppensteigen",
    icon: "🪜",
    kategorie: "Cardio",
    muskel: "Beine, Po, Ausdauer",
    sets: "10–15 Min.",
    dauer: "15 Min.",
    schwierigkeit: "Einfach",
    tipp: "Zwei Stufen auf einmal nehmen = mehr Po-Aktivierung.",
    ausfuehrung: [
      "Zügig die Treppe rauf — normales Tempo runter.",
      "Aufrecht bleiben, nicht auf Geländer stützen.",
      "Je steiler und länger, desto besser.",
      "15 Minuten kontinuierlich = effektives Cardio.",
    ],
  },
  {
    id: "spaziergang-intervall",
    name: "Intervall-Spaziergang",
    icon: "🚶",
    kategorie: "Cardio",
    muskel: "Ausdauer, Fettverbrennung",
    sets: "20 Min. total",
    dauer: "20 Min.",
    schwierigkeit: "Einfach",
    tipp: "Ideal auf Keto — Fettverbrennung im ruhigen Cardio-Bereich optimal.",
    ausfuehrung: [
      "2 Min. normales Gehtempo.",
      "1 Min. zügiges Tempo (leicht außer Atem).",
      "Intervall 6–7 Mal wiederholen.",
      "Kein Joggen nötig — schnelles Gehen reicht.",
    ],
  },

  // ─── CORE ─────────────────────────────────────────────────────────────────
  {
    id: "plank",
    name: "Plank",
    icon: "🧘",
    kategorie: "Core",
    muskel: "Bauch, Rumpf",
    sets: "3 × 30–60 Sek.",
    dauer: "45 Sek.",
    schwierigkeit: "Einfach",
    tipp: "Po nicht in die Luft — Körper ist eine gerade Linie.",
    ausfuehrung: [
      "Unterarme auf dem Boden, Ellbogen unter den Schultern.",
      "Körper gerade — von Kopf bis Ferse.",
      "Bauch anspannen, ruhig atmen.",
      "Position halten.",
    ],
  },
  {
    id: "seitstütz",
    name: "Seitstütz",
    icon: "🧘",
    kategorie: "Core",
    muskel: "Seitliche Bauchmuskeln, Hüfte",
    sets: "3 × 30 Sek. pro Seite",
    dauer: "30 Sek.",
    schwierigkeit: "Einfach",
    tipp: "Hüfte nicht einsinken lassen — gerade Linie von Kopf bis Fuß.",
    ausfuehrung: [
      "Auf einer Seite liegen, Unterarm auf dem Boden.",
      "Hüfte anheben — Körper bildet eine Linie.",
      "Obere Hand auf Hüfte oder gestreckt nach oben.",
      "Halten, dann Seite wechseln.",
    ],
  },
  {
    id: "crunches",
    name: "Crunches",
    icon: "💥",
    kategorie: "Core",
    muskel: "Bauch",
    sets: "3 × 20 Wdh.",
    schwierigkeit: "Einfach",
    tipp: "Hände locker hinter dem Kopf — nicht am Kopf ziehen.",
    ausfuehrung: [
      "Rücken auf der Matte, Knie angewinkelt.",
      "Hände locker hinters Ohr.",
      "Oberkörper leicht anheben — nur Schulterblätter vom Boden.",
      "Langsam zurück.",
    ],
  },
  {
    id: "bicycle-crunch",
    name: "Bicycle Crunch",
    icon: "🚲",
    kategorie: "Core",
    muskel: "Bauch, Schräge",
    sets: "3 × 16 Wdh. (8 pro Seite)",
    schwierigkeit: "Mittel",
    tipp: "Langsam und kontrolliert — nicht durch Schwung schummeln.",
    ausfuehrung: [
      "Rücken auf Matte, Hände locker hinter den Ohren.",
      "Beide Beine leicht angehoben.",
      "Rechtes Knie Richtung linke Schulter — linkes Bein strecken.",
      "Seiten wechseln — Fahrradbewegung.",
    ],
  },
  {
    id: "dead-bug",
    name: "Dead Bug",
    icon: "🐛",
    kategorie: "Core",
    muskel: "Tiefer Bauch, Rumpfstabilität",
    sets: "3 × 10 pro Seite",
    schwierigkeit: "Einfach",
    tipp: "Lendenwirbelbereich bleibt immer am Boden — kein Hohlkreuz.",
    ausfuehrung: [
      "Rücken auf Matte, Arme senkrecht nach oben, Beine 90° angewinkelt.",
      "Rechten Arm und linkes Bein gleichzeitig langsam absenken.",
      "Ohne Rücken anzuheben zurück zur Mitte.",
      "Seite wechseln.",
    ],
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    icon: "⛰️",
    kategorie: "Core",
    muskel: "Bauch, Schultern, Cardio",
    sets: "3 × 30 Sek.",
    dauer: "30 Sek.",
    schwierigkeit: "Mittel",
    tipp: "Hüfte unten halten — nicht auf und ab wippen.",
    ausfuehrung: [
      "Liegestützhaltung einnehmen.",
      "Abwechselnd Knie zur Brust ziehen.",
      "Schnelles Tempo — wie Bergsteigen.",
      "Arme und Rumpf stabil halten.",
    ],
  },
  {
    id: "beinheben",
    name: "Beinheben liegend",
    icon: "🦵",
    kategorie: "Core",
    muskel: "Unterer Bauch",
    sets: "3 × 12 Wdh.",
    schwierigkeit: "Mittel",
    tipp: "Je gerader die Beine, desto schwerer — bei Bedarf leicht beugen.",
    ausfuehrung: [
      "Rücken auf der Matte, Hände unter dem Steißbein.",
      "Beine gestreckt gemeinsam langsam anheben — 90°.",
      "Langsam absenken — ohne aufzusetzen.",
      "Unterer Rücken bleibt auf der Matte.",
    ],
  },

  // ─── DEHNEN ───────────────────────────────────────────────────────────────
  {
    id: "huefte-dehnen",
    name: "Hüftbeuger-Dehnung",
    icon: "🧘",
    kategorie: "Dehnen",
    muskel: "Hüftbeuger, Oberschenkel vorne",
    sets: "2 × 30 Sek. pro Seite",
    dauer: "30 Sek.",
    schwierigkeit: "Einfach",
    tipp: "Wichtig nach langem Sitzen — löst Verspannungen im unteren Rücken.",
    ausfuehrung: [
      "Knie auf den Boden, vorderes Bein angewinkelt.",
      "Becken nach vorne drücken — Dehnung vorne im Oberschenkel.",
      "Oberkörper aufrecht.",
      "Halten, dann Seite wechseln.",
    ],
  },
  {
    id: "hamstring-dehnen",
    name: "Ischiasdehnug (Hamstring)",
    icon: "🦵",
    kategorie: "Dehnen",
    muskel: "Hintere Oberschenkel",
    sets: "2 × 30 Sek. pro Seite",
    dauer: "30 Sek.",
    schwierigkeit: "Einfach",
    tipp: "Kein Rundrücken — aus der Hüfte vorbeugen, nicht den Rücken runden.",
    ausfuehrung: [
      "Auf dem Boden sitzen, ein Bein gestreckt, das andere angewinkelt.",
      "Aufrecht aus der Hüfte Richtung gestrecktes Bein beugen.",
      "Bis Dehnung hinten im Oberschenkel spürbar.",
      "Seite wechseln.",
    ],
  },
  {
    id: "schulter-dehnen",
    name: "Schulter- und Brustdehnung",
    icon: "🙆",
    kategorie: "Dehnen",
    muskel: "Schultern, Brust",
    sets: "2 × 30 Sek. pro Seite",
    dauer: "30 Sek.",
    schwierigkeit: "Einfach",
    tipp: "Ideal morgens — löst Schulter- und Nackenspannungen.",
    ausfuehrung: [
      "Einen Arm gestreckt auf Schulterhöhe.",
      "Mit dem anderen Arm den Ellbogen zur Brust ziehen.",
      "Schulter bleibt unten.",
      "Seite wechseln.",
    ],
  },
  {
    id: "katzenbuckel",
    name: "Katzenbuckel & Kuhstellung",
    icon: "🐱",
    kategorie: "Dehnen",
    muskel: "Wirbelsäule, Rücken",
    sets: "2 × 10 Wdh.",
    schwierigkeit: "Einfach",
    tipp: "Langsam und bewusst — jede Wirbelsäulenposition fühlen.",
    ausfuehrung: [
      "Auf Händen und Knien, Rücken neutral.",
      "Katze: Rücken runden — Kopf senken, Bauch einziehen.",
      "Kuh: Rücken durchbiegen — Kopf heben, Bauch Richtung Boden.",
      "Langsam zwischen beiden wechseln.",
    ],
  },
  {
    id: "kinderhaltung",
    name: "Kindshaltung",
    icon: "🧎",
    kategorie: "Dehnen",
    muskel: "Rücken, Hüfte, Schultern",
    sets: "1 × 60 Sek.",
    dauer: "60 Sek.",
    schwierigkeit: "Einfach",
    tipp: "Perfekte Abschlussübung — auch bei Rückenschmerzen sehr wirkungsvoll.",
    ausfuehrung: [
      "Knie auf der Matte, Po Richtung Fersen senken.",
      "Arme weit nach vorne strecken.",
      "Stirn zur Matte.",
      "Tief einatmen — Rücken dehnt sich beim Ausatmen.",
    ],
  },
  {
    id: "pigeon-pose",
    name: "Tauben-Pose (Po-Dehnung)",
    icon: "🕊️",
    kategorie: "Dehnen",
    muskel: "Po, Hüfte, Piriformis",
    sets: "2 × 40 Sek. pro Seite",
    dauer: "40 Sek.",
    schwierigkeit: "Mittel",
    tipp: "Beste Übung gegen Po- und Hüftverspannungen — tief atmen und loslassen.",
    ausfuehrung: [
      "Aus dem Vierfüßlerstand: rechtes Knie nach vorne — Shin (Schienbein) schräg zur Matte.",
      "Linkes Bein nach hinten strecken.",
      "Oberkörper nach vorne ablegen.",
      "Tief atmen und entspannen — dann Seite wechseln.",
    ],
  },
];

const KATEGORIEN = ["Alle", "Kraft", "Cardio", "Core", "Dehnen"];

const KAT_FARBEN: Record<string, string> = {
  Kraft: "#f59e0b",
  Cardio: "#ef4444",
  Core: "#8b5cf6",
  Dehnen: "#22c55e",
};

const SCHNELL_WORKOUTS = [
  {
    name: "10-Min Morgen-Boost",
    icon: "🌅",
    uebungen: ["plank", "glute-bridge", "kniebeugen", "katzenbuckel", "kinderhaltung"],
  },
  {
    name: "15-Min Ganzkörper",
    icon: "🔥",
    uebungen: ["jumping-jacks", "kniebeugen", "liegestuetze", "plank", "glute-bridge", "high-knees"],
  },
  {
    name: "Bauch & Core (10 Min)",
    icon: "💥",
    uebungen: ["plank", "crunches", "bicycle-crunch", "dead-bug", "beinheben"],
  },
  {
    name: "Sanftes Abend-Dehnen",
    icon: "🌙",
    uebungen: ["katzenbuckel", "kinderhaltung", "huefte-dehnen", "hamstring-dehnen", "schulter-dehnen"],
  },
];

export default function FitnessPage() {
  const [kategorie, setKategorie] = useState("Alle");
  const [offenId, setOffenId] = useState<string | null>(null);
  const [aktiveWorkout, setAktiveWorkout] = useState<string[] | null>(null);
  const [workoutName, setWorkoutName] = useState("");

  const gefiltert = UEBUNGEN.filter(u =>
    kategorie === "Alle" || u.kategorie === kategorie
  );

  const offenUebung = UEBUNGEN.find(u => u.id === offenId);

  // Workout-Ansicht
  if (aktiveWorkout) {
    const liste = UEBUNGEN.filter(u => aktiveWorkout.includes(u.id));
    return (
      <main className="px-4 py-6 pb-28">
        <button onClick={() => setAktiveWorkout(null)}
          className="flex items-center gap-2 mb-4 text-sm"
          style={{ color: "#22c55e" }}>
          ← Zurück
        </button>
        <h1 className="text-xl font-bold mb-1">{workoutName}</h1>
        <p className="text-sm mb-5" style={{ color: "#666" }}>{liste.length} Übungen</p>
        <div className="space-y-3">
          {liste.map((u, idx) => (
            <button key={u.id} onClick={() => { setAktiveWorkout(null); setOffenId(u.id); }}
              className="w-full rounded-2xl p-4 text-left flex items-center gap-4"
              style={{ backgroundColor: "#1a1a1a" }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                style={{ backgroundColor: "#22c55e" }}>
                {idx + 1}
              </span>
              <div className="flex-1">
                <div className="font-semibold text-sm">{u.icon} {u.name}</div>
                <div className="text-xs mt-0.5" style={{ color: KAT_FARBEN[u.kategorie] }}>{u.sets}</div>
              </div>
              <span style={{ color: "#444" }}>›</span>
            </button>
          ))}
        </div>
      </main>
    );
  }

  // Detailansicht
  if (offenUebung) {
    return (
      <main className="px-4 py-6 pb-28">
        <button onClick={() => setOffenId(null)}
          className="flex items-center gap-2 mb-4 text-sm"
          style={{ color: "#22c55e" }}>
          ← Zurück
        </button>

        <div className="text-5xl mb-3 text-center">{offenUebung.icon}</div>
        <h1 className="text-xl font-bold mb-2">{offenUebung.name}</h1>

        <div className="flex gap-2 flex-wrap mb-5">
          <span className="text-xs px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: KAT_FARBEN[offenUebung.kategorie] + "22", color: KAT_FARBEN[offenUebung.kategorie] }}>
            {offenUebung.kategorie}
          </span>
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#1a1a1a", color: "#888" }}>
            💪 {offenUebung.muskel}
          </span>
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#1a1a1a", color: "#888" }}>
            {offenUebung.schwierigkeit}
          </span>
        </div>

        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
          <div className="text-xs font-semibold mb-1" style={{ color: "#22c55e" }}>💡 Tipp</div>
          <p className="text-sm" style={{ color: "#ccc" }}>{offenUebung.tipp}</p>
        </div>

        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="font-bold mb-1" style={{ color: "#22c55e" }}>🎯 Umfang</div>
          <div className="text-lg font-semibold">{offenUebung.sets}</div>
          {offenUebung.dauer && (
            <div className="text-sm mt-1" style={{ color: "#666" }}>Dauer pro Satz: {offenUebung.dauer}</div>
          )}
        </div>

        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>📋 Ausführung</h2>
          <ol className="space-y-3">
            {offenUebung.ausfuehrung.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
                  style={{ backgroundColor: KAT_FARBEN[offenUebung.kategorie] }}>
                  {i + 1}
                </span>
                <span style={{ color: "#ccc" }}>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </main>
    );
  }

  // Listenansicht
  return (
    <main className="px-4 py-6 pb-28">
      <h1 className="text-xl font-bold mb-1">💪 Fitness</h1>
      <p className="text-sm mb-5" style={{ color: "#666" }}>Einfach & wirksam — kein Gym nötig</p>

      {/* Schnell-Workouts */}
      <div className="mb-5">
        <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#555" }}>
          Schnell-Workouts
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SCHNELL_WORKOUTS.map(w => (
            <button key={w.name}
              onClick={() => { setWorkoutName(w.name); setAktiveWorkout(w.uebungen); }}
              className="rounded-2xl p-4 text-left"
              style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-2xl mb-2">{w.icon}</div>
              <div className="text-sm font-semibold leading-tight">{w.name}</div>
              <div className="text-xs mt-1" style={{ color: "#555" }}>{w.uebungen.length} Übungen</div>
            </button>
          ))}
        </div>
      </div>

      {/* Alle Übungen */}
      <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#555" }}>
        Alle Übungen
      </div>

      <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
        {KATEGORIEN.map(k => (
          <button key={k} onClick={() => setKategorie(k)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: kategorie === k ? (KAT_FARBEN[k] || "#22c55e") : "#1a1a1a",
              color: kategorie === k ? "#000" : "#888",
            }}>
            {k}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {gefiltert.map(u => (
          <button key={u.id} onClick={() => setOffenId(u.id)}
            className="w-full rounded-2xl px-4 py-3 text-left flex items-center gap-4"
            style={{ backgroundColor: "#1a1a1a" }}>
            <span className="text-2xl">{u.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{u.name}</div>
              <div className="flex gap-2 items-center mt-0.5">
                <span className="text-xs" style={{ color: KAT_FARBEN[u.kategorie] }}>{u.kategorie}</span>
                <span className="text-xs" style={{ color: "#444" }}>·</span>
                <span className="text-xs" style={{ color: "#555" }}>{u.sets}</span>
              </div>
            </div>
            <span style={{ color: "#444" }}>›</span>
          </button>
        ))}
      </div>
    </main>
  );
}
