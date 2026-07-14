"use client";
import { useState } from "react";
import Link from "next/link";

const ABSCHNITTE = [
  {
    id: "erschoepfung",
    emoji: "😮‍💨",
    titel: "Warum du so erschopft bist — und warum es nicht deine Schuld ist",
    farbe: "#8b5cf6",
    inhalt: [
      {
        typ: "text",
        text: "Wenn du uber 40 bist und dich morgens bereits erschopft aufwachst, obwohl du genug geschlafen hast — dann kennst du dieses Gefuhl. Keine Energie fur die einfachsten Dinge. Ein Gehirn das sich anfuhlt wie Watte. Und alle sagen: 'Iss weniger, beweg dich mehr.'",
      },
      {
        typ: "text",
        text: "Was dabei ubersehen wird: Ab Mitte 30 verandert sich bei Frauen der Hormonhaushalt grundlegend. Ostrogen sinkt, Progesteron schwankt, Cortisol (Stresshormon) steigt — und der Blutzucker reagiert plotzlich viel empfindlicher als fruher.",
      },
      {
        typ: "box",
        titel: "Das eigentliche Problem: Blutzucker-Achterbahn",
        text: "Kohlenhydrate heben den Blutzucker — Insulin schiesst hoch — Zucker fallt ab — Energieloch. Wiederholt sich 5-6x am Tag. Das fuhlt sich an wie chronische Erschopfung, ist aber metabolisch erklarbar — und losbar.",
      },
    ],
  },
  {
    id: "hormone",
    emoji: "🔬",
    titel: "Hormone, Insulin & Fettverbrennung — was nach 40 passiert",
    farbe: "#3b82f6",
    inhalt: [
      {
        typ: "liste",
        titel: "Was sich ab 40 verandert:",
        punkte: [
          "Ostrogen sinkt — der Korper lagert Fett starker in der Bauchregion ein",
          "Insulin-Sensitivitat nimmt ab — Kohlenhydrate 'treffen' hareter als fruher",
          "Progesteron schwankt — Schlafqualitat leidet, Cortisol steigt",
          "Schilddrusenaktivitat kann nachlassen — weniger Energie, langsamerer Stoffwechsel",
          "Muskelmasse sinkt — Grundumsatz geht runter, Gewicht halt gleichbleibende Ernahrung nicht mehr",
        ],
      },
      {
        typ: "box",
        titel: "Warum Kalorien zahlen alleine nicht mehr funktioniert",
        text: "Der Korper einer Frau ab 40 reagiert nicht mehr auf 'weniger essen' wie mit 25. Insulin ist der Schlussel — nicht Kalorien. Wer den Insulinspiegel niedrig halt, ermoglicht dem Korper Fett zu verbrennen — auch ohne Hungern.",
      },
    ],
  },
  {
    id: "keto-frauen",
    emoji: "💚",
    titel: "Warum Keto fur Frauen 40+ besonders gut funktioniert",
    farbe: "#22c55e",
    inhalt: [
      {
        typ: "liste",
        titel: "Was Keto konkret verandert:",
        punkte: [
          "Stabile Energie den ganzen Tag — kein Mittagstief mehr durch Blutzuckerschwankungen",
          "Weniger Hunger — Ketone sattigen anders als Glucose, ohne Heisshungerattacken",
          "Klarerer Kopf — Gehirn lauft auf Ketonen oft besser als auf Zucker",
          "Weniger Wassereinlagerungen — Blahbauch und Schwellungen gehen oft in Woche 1 weg",
          "Tieferer Schlaf — stabiler Blutzucker nachts = bessere Schlafqualitat",
          "Bauchfett geht zuerst — genau dort wo Ostrogenmangel es angelagert hat",
        ],
      },
      {
        typ: "highlight",
        text: "Viele Frauen 40+ berichten von mehr Energie nach 2-3 Wochen Keto als in den letzten Jahren. Nicht weil Keto magisch ist — sondern weil der Korper endlich den Treibstoff bekommt der zu seinem Hormonsystem passt.",
      },
    ],
  },
  {
    id: "zyklus",
    emoji: "🌙",
    titel: "Keto & Zyklus — was du wissen musst",
    farbe: "#f59e0b",
    inhalt: [
      {
        typ: "text",
        text: "In der Perimenopause (oft ab Mitte 40) wird der Zyklus unregelmassig. Trotzdem reagiert der Korper hormonell auf verschiedene Zyklusphasen — auch wenn sie weniger spurbar sind.",
      },
      {
        typ: "liste",
        titel: "Zyklusphasen & Keto:",
        punkte: [
          "Follikelphase (Tage 1-14): Optimale Zeit fur striktes Keto — Insulin-Sensitivitat am besten",
          "Ovulationsphase: Energie ist hoch, Keto lauft meist problemlos",
          "Lutealphase (Tage 15-28): Progesteron steigt — mehr Hunger ist normal. Fett erhohen statt KH",
          "PMS-Phase: Magnesium-Bedarf steigt — Keto-Grippe-ahnliche Symptome moglich",
        ],
      },
      {
        typ: "box",
        titel: "Keto in der Menopause",
        text: "Nach der Menopause wird Keto fur viele Frauen einfacher — kein Zyklus mehr, stabilere Hormonlage. Viele bemerken dass Keto jetzt 'klickt' — weil der Korper nicht mehr gegen monatliche Schwankungen kampft.",
      },
    ],
  },
  {
    id: "schilddruse",
    emoji: "⚠️",
    titel: "Schilddruse & Keto — wichtiger Hinweis",
    farbe: "#ef4444",
    inhalt: [
      {
        typ: "text",
        text: "Frauen 40+ haben uberdurchschnittlich haufig Schilddrusenprobleme — oft undiagnostiziert. Hashimoto, Hypothyreose, subklinische Unterfunktion. Das erklart chronische Mudigkeit, Gewichtszunahme trotz 'normaler' Ernahrung und Kaltegefuhl.",
      },
      {
        typ: "liste",
        titel: "Was du wissen solltest:",
        punkte: [
          "Keto kann bei bestehender Schilddrusenproblem anfangs Symptome verstarken",
          "T3 (aktives Schilddrusenhormon) kann auf sehr low-carb kurzfristig sinken",
          "Losung: nicht unter 20g fallen — 30-50g Netto-KH kann fur Schilddrusenpatienten besser sein",
          "Selenmangel ist bei Frauen 40+ haufig und verschlimmert Schilddrusenprobleme — Supplemente prufen",
          "Arztlichen Rat holen wenn bekannte Schilddrusenerkrankung besteht",
        ],
      },
      {
        typ: "box",
        titel: "Tipp: Blutwerte prufen lassen",
        text: "TSH, fT3, fT4 und TPO-Antikorper prufen lassen — gerade wenn Keto nach 4 Wochen keine Besserung bringt. Eine unbehandelte Schilddrusenunterfunktion blockiert jeden Ernahrungsansatz.",
      },
    ],
  },
  {
    id: "praktisch",
    emoji: "🛠️",
    titel: "Keto fur Frauen 40+ — so geht es in der Praxis",
    farbe: "#22c55e",
    inhalt: [
      {
        typ: "liste",
        titel: "Anpassungen die fur Frauen 40+ besonders wichtig sind:",
        punkte: [
          "Mehr Protein als Manner — mindestens 1.5-2g pro kg Korpergewicht um Muskelmasse zu halten",
          "Kalzium und Vitamin D nicht vergessen — Knochengesundheit in der Perimenopause",
          "Magnesium abends (300-400mg) — verbessert Schlaf und reduziert Cortisol",
          "MCT-Ol statt Butter im Kaffee — schnelle Energie ohne Verdauungsbelastung",
          "Stress reduzieren — Cortisol blockiert Fettverbrennung auch auf Keto",
          "Schlaf priorisieren — Schlafmangel hebt Cortisol und Ghrelin (Hungerhormon)",
          "Nicht zu wenig essen — unter 1400 kcal signalisiert Stress, Cortisol steigt",
        ],
      },
      {
        typ: "highlight",
        text: "Wichtig: Frauen 40+ brauchen oft 4-6 Wochen bis die Ergebnisse sichtbar sind — nicht 2. Der Hormonhaushalt braucht langer um sich anzupassen. Nicht zu fruh aufgeben.",
      },
    ],
  },
  {
    id: "energie",
    emoji: "⚡",
    titel: "Sofort mehr Energie — was wirklich hilft",
    farbe: "#8b5cf6",
    inhalt: [
      {
        typ: "liste",
        titel: "Die 5 schnellsten Energie-Hebel auf Keto:",
        punkte: [
          "Elektrolyte morgens — Natrium + Kalium + Magnesium vor dem Fruhstuck",
          "Bulletproof Coffee — Butter + MCT-Ol gibt 4-6h stabile Energie ohne Hunger",
          "Intermittierendes Fasten (16:8) — Ketose vertieft sich, Energie stabilisiert sich",
          "Kein Alkohol in Woche 1-3 — blockiert Ketonproduktion und schlauchert",
          "Spaziergang morgens — senkt Cortisol, aktiviert Fettverbrennung, verbessert Stimmung",
        ],
      },
      {
        typ: "box",
        titel: "Keto-Grippe bei Frauen 40+",
        text: "Frauen 40+ reagieren auf die Umstellungsphase oft starker als jungere Frauen — weil Hormonschwankungen die Symptome verstarken. Mehr Elektrolyte, mehr Schlaf, weniger Sport in den ersten 5 Tagen. Danach wird es deutlich besser.",
      },
    ],
  },
];

type Typ =
  | { typ: "text"; text: string }
  | { typ: "box"; titel: string; text: string }
  | { typ: "highlight"; text: string }
  | { typ: "liste"; titel: string; punkte: string[] };

export default function FrauenPage() {
  const [offen, setOffen] = useState<string | null>("erschoepfung");

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      {/* Hero */}
      <div className="rounded-2xl p-5 mb-5" style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0d1520 100%)", border: "1px solid #8b5cf633" }}>
        <div className="text-4xl mb-3">👩</div>
        <h1 className="text-2xl font-black mb-2 leading-tight">Keto & Frauen 40+</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#aaa" }}>
          Du bist erschopft, obwohl du alles richtig machst. Du schlafs genug. Du isst nicht schlecht. Trotzdem keine Energie. Das hat einen Grund — und Keto kann ihn angreifen.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { wert: "2-5 Wo", label: "bis Energie steigt" },
            { wert: "40+",    label: "optimales Alter fur Keto" },
            { wert: "7",      label: "Themen erklart" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: "#ffffff0a" }}>
              <div className="font-black text-base" style={{ color: "#c4b5fd" }}>{s.wert}</div>
              <div className="text-[10px] mt-0.5" style={{ color: "#555" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Abschnitte */}
      <div className="space-y-2 mb-5">
        {ABSCHNITTE.map(a => (
          <div key={a.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
            <button className="w-full px-4 py-4 text-left flex items-center gap-3"
              onClick={() => setOffen(offen === a.id ? null : a.id)}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                style={{ backgroundColor: a.farbe + "22" }}>
                {a.emoji}
              </div>
              <span className="flex-1 font-semibold text-sm leading-snug">{a.titel}</span>
              <span className="text-xs flex-shrink-0" style={{ color: "#333" }}>{offen === a.id ? "▲" : "▼"}</span>
            </button>

            {offen === a.id && (
              <div className="px-4 pb-5 space-y-3 border-t" style={{ borderColor: "#2a2a2a" }}>
                {(a.inhalt as Typ[]).map((block, i) => {
                  if (block.typ === "text") {
                    return <p key={i} className="text-sm leading-relaxed pt-3" style={{ color: "#aaa" }}>{block.text}</p>;
                  }
                  if (block.typ === "box") {
                    return (
                      <div key={i} className="rounded-xl p-3 mt-3" style={{ backgroundColor: "#2a2a2a" }}>
                        <div className="text-xs font-bold mb-1" style={{ color: a.farbe }}>{block.titel}</div>
                        <p className="text-xs leading-relaxed" style={{ color: "#999" }}>{block.text}</p>
                      </div>
                    );
                  }
                  if (block.typ === "highlight") {
                    return (
                      <div key={i} className="rounded-xl p-4 mt-2" style={{ backgroundColor: a.farbe + "15", border: `1px solid ${a.farbe}33` }}>
                        <p className="text-sm font-medium leading-relaxed" style={{ color: a.farbe }}>{block.text}</p>
                      </div>
                    );
                  }
                  if (block.typ === "liste") {
                    return (
                      <div key={i} className="mt-3">
                        <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>{block.titel.toUpperCase()}</div>
                        <div className="space-y-2">
                          {block.punkte.map((p, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <span className="flex-shrink-0 mt-0.5 text-xs" style={{ color: a.farbe }}>✓</span>
                              <span className="text-sm leading-snug" style={{ color: "#aaa" }}>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Energie-CTA */}
      <Link href="/exogene-ketone"
        className="flex items-center gap-4 rounded-2xl p-4 mb-4"
        style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0d1520 100%)", border: "1px solid #8b5cf655" }}>
        <span className="text-3xl">⚡</span>
        <div className="flex-1">
          <div className="font-bold text-sm mb-0.5" style={{ color: "#c4b5fd" }}>Sofort-Energie wahrend der Umstellung</div>
          <div className="text-xs leading-snug" style={{ color: "#666" }}>Exogene Ketone uberbrucken die Mudigkeit in den ersten Wochen — in 30 Minuten spurbar</div>
        </div>
        <span className="text-xs" style={{ color: "#8b5cf6" }}>→</span>
      </Link>

      {/* Weiterführende Links */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>PASSENDE THEMEN</div>
        <div className="space-y-2">
          {[
            { href: "/startplan", emoji: "🗓", label: "7-Tage-Startplan", sub: "Tag-fur-Tag durch die erste Woche" },
            { href: "/keto-flu",  emoji: "🤒", label: "Keto-Grippe Guide",sub: "Symptome erkennen & schnell lindern" },
            { href: "/supplemente",emoji:"💊", label: "Supplemente",       sub: "Magnesium, Vitamin D, Selen & mehr" },
            { href: "/rechner",   emoji: "🧮", label: "Keto-Rechner",      sub: "Deinen personlichen Bedarf berechnen" },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className="flex items-center gap-3 rounded-xl p-3"
              style={{ backgroundColor: "#2a2a2a" }}>
              <span className="text-xl">{l.emoji}</span>
              <div>
                <div className="text-sm font-semibold">{l.label}</div>
                <div className="text-xs" style={{ color: "#555" }}>{l.sub}</div>
              </div>
              <span className="ml-auto text-xs" style={{ color: "#444" }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
