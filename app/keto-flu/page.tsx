"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const SYMPTOME = [
  { id: "kopfschmerz", emoji: "🤕", label: "Kopfschmerzen", sofort: "Sofort 500 ml Wasser + ½ TL Salz trinken. Magnesium 300 mg nehmen.", grund: "Dein Körper scheidet mit dem Wasser Natrium aus — der Blutdruck fällt leicht ab.", tipp: "2–3 g extra Natrium pro Tag (Brühe, Salzwasser). Koffein-Entzug verstärkt es — langsam reduzieren." },
  { id: "muedigkeit", emoji: "😴", label: "Müdigkeit & Erschöpfung", sofort: "Bulletproof Coffee oder MCT-Öl jetzt. Leichte Bewegung (Spaziergang, keine Hochleistung).", grund: "Dein Gehirn wechselt von Glukose auf Ketone — das dauert 2–5 Tage.", tipp: "Mehr Fett essen! Nicht zu wenig Kalorien. Avocado, Butter, Eier. Keine Hochintensitäts-Workouts in Woche 1." },
  { id: "schwindel", emoji: "💫", label: "Schwindel", sofort: "Hinsetzen, langsam aufstehen. Sofort Salzwasser trinken.", grund: "Elektrolyt-Ungleichgewicht — klassisch bei Keto-Grippe.", tipp: "Täglich: 2–3 g Natrium, 1–2 g Kalium, 300–400 mg Magnesium. Brühe ist dein bester Freund." },
  { id: "muskelkraempfe", emoji: "⚡", label: "Muskelkrämpfe", sofort: "Sofort Magnesium nehmen (300–400 mg). Beine dehnen.", grund: "Magnesiummangel — Keto erhöht die Ausscheidung von Elektrolyten stark.", tipp: "Täglich Magnesiumglycinat oder -citrat. Avocado und Spinat liefern Kalium. Viel Wasser!" },
  { id: "uebelkeit", emoji: "🤢", label: "Übelkeit", sofort: "Kleines Mahlzeit mit Fett essen, kein nüchterner Magen. Ingwertee.", grund: "Zu viel Fett auf einmal, wenn der Körper noch nicht angepasst ist.", tipp: "Fett langsam steigern. Mit Eiern und Avocado beginnen, erst dann viel Öl/Butter. Keine MCT-Öl-Überdosis am Anfang." },
  { id: "reizbarkeit", emoji: "😤", label: "Reizbarkeit & Stimmung", sofort: "Kurzer Spaziergang. Serotonin kommt zurück wenn Ketone steigen — durchhalten!", grund: "Blutzucker normalisiert sich, Gehirn fehlt kurzfristig Energie.", tipp: "Ausreichend Schlaf. Mit Freunden reden (und erklären warum du gerade zickig bist 😄). Normalerweise nach Tag 3–4 vorbei." },
  { id: "hirnnebel", emoji: "🌫️", label: "Hirnnebel / Konzentration", sofort: "MCT-Öl oder Kokosnussöl — liefert sofort Ketone fürs Gehirn.", grund: "Übergang von Glukose zu Ketonen. Das Gehirn braucht Zeit.", tipp: "Ketone brauchen 2–4 Tage. Danach: mentale Klarheit wie nie zuvor. Fisch (Omega-3), Eier (Cholin) helfen." },
  { id: "schlafprobleme", emoji: "🌙", label: "Schlafprobleme", sofort: "Magnesiumglycinat vor dem Schlafen (200–400 mg). Keine Koffein nach 14 Uhr.", grund: "Hormonsystem stellt sich um. Kortisol kann kurzzeitig erhöht sein.", tipp: "In 1–2 Wochen normalisiert sich der Schlaf. Danach schlafen viele tiefer als je zuvor." },
];

const TAGE = [
  { tag: 1, titel: "Tag 1 — Der Start", farbe: "#f59e0b", text: "Blutzucker sinkt, Glykogenspeicher leeren sich. Meist noch kein Symptome. Viel Wasser trinken, Elektrolyte nicht vergessen.", badge: "🟡 Startphase" },
  { tag: 2, titel: "Tag 2–3 — Die Grippe kommt", farbe: "#ef4444", text: "Jetzt trifft es die meisten. Kopfschmerzen, Müdigkeit, Schwindel. Das ist normal! Dein Körper wirft buchstäblich seinen alten Treibstoff raus.", badge: "🔴 Durchhaltezeit" },
  { tag: 3, titel: "Tag 3–4 — Talsohle", farbe: "#ef4444", text: "Oft der härteste Punkt. Aber: die Ketone steigen jetzt! MCT-Öl oder Bulletproof Coffee helfen direkt. Du bist fast durch.", badge: "🔴 Talsohle" },
  { tag: 4, titel: "Tag 4–5 — Die Wende", farbe: "#f59e0b", text: "Viele merken ab Tag 4 eine spürbare Besserung. Energie kommt zurück, Kopfschmerzen lassen nach. Ketone sind jetzt messbar.", badge: "🟡 Besserung" },
  { tag: 5, titel: "Tag 5–7 — Ketose!", farbe: "#22c55e", text: "Das Gehirn läuft auf Ketonen. Viele berichten von ungewohnter Klarheit und stabiler Energie ohne Nachmittagstief. Fast geschafft!", badge: "🟢 Fast da" },
  { tag: 7, titel: "Woche 2+ — Keto-Maschine", farbe: "#22c55e", text: "Glückwunsch — du bist adapted! Jetzt zeigen sich die echten Vorteile: Fettverbrennung, mentale Klarheit, stabiler Blutzucker, kein Hunger mehr.", badge: "🟢 Keto-adapted" },
];

const ELEKTROLYTE = [
  {
    name: "Natrium", emoji: "🧂", tagesmenge: "2.000–3.000 mg",
    warum: "Keto senkt Insulin → Nieren scheiden mehr Natrium aus. Das zieht Wasser und andere Elektrolyte mit.",
    quellen: ["Meersalz (1 TL = ~2.300 mg)", "Brühe (eine Tasse = ~900 mg)", "Salzwasser morgens nüchtern"],
    warnsignal: "Kopfschmerzen, Schwindel, Erschöpfung"
  },
  {
    name: "Magnesium", emoji: "💊", tagesmenge: "300–400 mg",
    warum: "Wichtig für Muskeln, Nerven, Schlaf. Wird auf Keto schnell verbraucht und kaum über Nahrung gedeckt.",
    quellen: ["Supplement: Magnesiumglycinat oder -citrat", "Kürbiskerne, Mandeln, Spinat", "Dunkle Schokolade (85%+)"],
    warnsignal: "Muskelkrämpfe, Schlafprobleme, Herzklopfen"
  },
  {
    name: "Kalium", emoji: "🥑", tagesmenge: "1.000–3.500 mg",
    warum: "Arbeitet mit Natrium zusammen. Mangel verursacht Schwäche und Krämpfe.",
    quellen: ["Avocado (1 Stück = ~975 mg)", "Spinat, Brokkoli, Pilze", "Lachsfilet, Hähnchenbrust"],
    warnsignal: "Muskelschwäche, Krämpfe, Herzrasen"
  },
];

export default function KetoFluPage() {
  const [aktivSymptome, setAktivSymptome] = useState<Set<string>>(new Set());
  const [ketoTag, setKetoTag] = useState<number | null>(null);
  const [tagEingabe, setTagEingabe] = useState("");
  const [tab, setTab] = useState<"symptome" | "verlauf" | "elektrolyte">("symptome");

  useEffect(() => {
    const gRaw = localStorage.getItem("ketome_gewicht");
    if (gRaw) {
      const arr = JSON.parse(gRaw);
      if (arr.length > 0) {
        const [d, m, y] = arr[0].datum.split(".").map(Number);
        const start = new Date(y, m - 1, d);
        const diff = Math.floor((Date.now() - start.getTime()) / 86400000) + 1;
        setKetoTag(Math.max(1, diff));
      }
    }
  }, []);

  function toggleSymptom(id: string) {
    setAktivSymptome(prev => {
      const neu = new Set(prev);
      if (neu.has(id)) neu.delete(id); else neu.add(id);
      return neu;
    });
  }

  const aktiveListe = SYMPTOME.filter(s => aktivSymptome.has(s.id));

  function tagFarbe(t: number): string {
    if (t <= 1) return "#f59e0b";
    if (t <= 4) return "#ef4444";
    if (t <= 6) return "#f59e0b";
    return "#22c55e";
  }

  function tagStatus(t: number): string {
    if (t <= 1) return "Startphase";
    if (t <= 3) return "Durchhaltezeit 💪";
    if (t <= 5) return "Besserung kommt";
    if (t <= 7) return "Fast Keto-adapted!";
    return "Keto-Maschine 🔥";
  }

  const aktuellTag = ketoTag ?? (tagEingabe ? parseInt(tagEingabe) : null);

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>
      <h1 className="text-xl font-bold mb-1">🤒 Keto-Grippe Guide</h1>
      <p className="text-sm mb-5" style={{ color: "#666" }}>Alles was du brauchst um die ersten Tage zu überleben — und warum es sich lohnt.</p>

      {/* Tag-Anzeige */}
      <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>WO STEHST DU GERADE?</div>
        {aktuellTag ? (
          <div className="flex items-center gap-4">
            <div className="rounded-2xl p-3 text-center min-w-[72px]" style={{ backgroundColor: "#0a0a0a" }}>
              <div className="text-3xl font-bold" style={{ color: tagFarbe(aktuellTag) }}>{aktuellTag}</div>
              <div className="text-xs mt-0.5" style={{ color: "#444" }}>Tag</div>
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ color: tagFarbe(aktuellTag) }}>{tagStatus(aktuellTag)}</div>
              <div className="text-xs mt-1" style={{ color: "#666" }}>
                {aktuellTag <= 3 && "Halte durch — der Körper baut gerade um. Das ist normal!"}
                {aktuellTag >= 4 && aktuellTag <= 6 && "Du bist fast durch. Elektrolyte und Fett nicht vergessen."}
                {aktuellTag > 6 && "Glückwunsch! Jetzt kommen die echten Keto-Vorteile."}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm mb-2" style={{ color: "#888" }}>An welchem Tag bist du?</div>
            <div className="flex gap-2">
              <input value={tagEingabe} onChange={e => setTagEingabe(e.target.value)}
                type="number" placeholder="z.B. 2"
                className="flex-1 px-4 py-3 rounded-xl outline-none text-white"
                style={{ backgroundColor: "#2a2a2a" }} />
              <div className="flex items-center px-3 text-sm" style={{ color: "#555" }}>Tag</div>
            </div>
            <div className="text-xs mt-2" style={{ color: "#444" }}>
              Tipp: Trag dein Startgewicht im Tracking ein — dann wird der Tag automatisch erkannt.
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {([
          { key: "symptome", label: "🤕 Symptome" },
          { key: "verlauf", label: "📅 Verlauf" },
          { key: "elektrolyte", label: "🧂 Elektrolyte" },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex-1 py-2 rounded-full text-xs font-medium"
            style={{ backgroundColor: tab === t.key ? "#22c55e" : "#1a1a1a", color: tab === t.key ? "#000" : "#888" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── SYMPTOME ────────────────────────────────────────────────────────── */}
      {tab === "symptome" && (
        <>
          <div className="rounded-2xl p-3 mb-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
            <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>
              Tippe auf deine aktuellen Symptome — du bekommst sofort gezielte Tipps was zu tun ist.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-5">
            {SYMPTOME.map(s => (
              <button key={s.id} onClick={() => toggleSymptom(s.id)}
                className="p-3 rounded-2xl text-left transition-all"
                style={{
                  backgroundColor: aktivSymptome.has(s.id) ? "#0d2018" : "#1a1a1a",
                  border: `2px solid ${aktivSymptome.has(s.id) ? "#22c55e" : "transparent"}`,
                }}>
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-xs font-medium leading-tight">{s.label}</div>
              </button>
            ))}
          </div>

          {aktiveListe.length > 0 && (
            <div className="space-y-4">
              <div className="text-xs font-semibold" style={{ color: "#555" }}>DEINE SOFORTMASSNAHMEN</div>
              {aktiveListe.map(s => (
                <div key={s.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: "#0d2018" }}>
                    <span className="text-xl">{s.emoji}</span>
                    <span className="font-semibold text-sm">{s.label}</span>
                  </div>
                  <div className="px-4 py-3 space-y-3">
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: "#22c55e" }}>⚡ SOFORT</div>
                      <p className="text-sm leading-relaxed" style={{ color: "#ccc" }}>{s.sofort}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: "#f59e0b" }}>🔍 WARUM</div>
                      <p className="text-xs leading-relaxed" style={{ color: "#888" }}>{s.grund}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: "#8b5cf6" }}>💡 LANGFRISTIG</div>
                      <p className="text-xs leading-relaxed" style={{ color: "#888" }}>{s.tipp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {aktiveListe.length > 0 && (
            <a href="https://CarbBye.pruvit.com" target="_blank" rel="noopener noreferrer"
              className="mt-5 flex items-center gap-3 rounded-2xl p-4"
              style={{ background: "linear-gradient(135deg, #1a0a2e, #0d1520)", border: "1px solid #8b5cf644" }}>
              <span className="text-2xl">⚡</span>
              <div className="flex-1">
                <div className="font-bold text-sm" style={{ color: "#c4b5fd" }}>Keto-Grippe schneller überwinden</div>
                <div className="text-xs mt-0.5" style={{ color: "#666" }}>Exogene Ketone überbrücken den Umstellungs-Schmerz — in 30 Minuten spürbar</div>
              </div>
              <span className="text-xs font-semibold" style={{ color: "#8b5cf6" }}>→</span>
            </a>
          )}

          {aktiveListe.length === 0 && (
            <div className="text-center py-6" style={{ color: "#555" }}>
              <div className="text-4xl mb-2">👆</div>
              <p className="text-sm">Tippe auf deine Symptome oben</p>
            </div>
          )}
        </>
      )}

      {/* ─── VERLAUF ─────────────────────────────────────────────────────────── */}
      {tab === "verlauf" && (
        <>
          <div className="rounded-2xl p-3 mb-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
            <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>
              Die meisten Symptome verschwinden nach 3–7 Tagen. Danach kommt die Belohnung: stable Energie, kein Hunger, mentale Klarheit.
            </p>
          </div>

          <div className="space-y-3">
            {TAGE.map((t, i) => {
              const istAktuell = aktuellTag !== null && (
                i < TAGE.length - 1
                  ? aktuellTag >= t.tag && aktuellTag < TAGE[i + 1].tag
                  : aktuellTag >= t.tag
              );
              return (
                <div key={t.tag} className="rounded-2xl p-4"
                  style={{
                    backgroundColor: istAktuell ? "#0d2018" : "#1a1a1a",
                    border: `1px solid ${istAktuell ? t.farbe : "transparent"}`,
                  }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: t.farbe + "22", color: t.farbe }}>
                      {t.badge}
                    </span>
                    {istAktuell && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ backgroundColor: t.farbe, color: "#000" }}>
                        ← Du bist hier
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-sm mb-1">{t.titel}</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#888" }}>{t.text}</p>
                </div>
              );
            })}
          </div>

          {/* Motivations-Karte */}
          <div className="rounded-2xl p-4 mt-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "#f59e0b" }}>💪 WARUM ES SICH LOHNT</div>
            <div className="space-y-2">
              {[
                "Stabile Energie den ganzen Tag — kein Nachmittagstief",
                "Kein ständiger Hunger mehr — Fett sättigt lang",
                "Mentale Klarheit die viele als \"Superkraft\" beschreiben",
                "Stabile Blutzuckerwerte — kein Zuckertief nach dem Essen",
                "Körperfett als Energiequelle — 24/7 Fettverbrennung",
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: "#22c55e" }}>✓</span>
                  <span className="text-xs leading-relaxed" style={{ color: "#aaa" }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ─── ELEKTROLYTE ─────────────────────────────────────────────────────── */}
      {tab === "elektrolyte" && (
        <>
          <div className="rounded-2xl p-3 mb-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
            <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>
              <strong style={{ color: "#22c55e" }}>90% der Keto-Grippe</strong> ist Elektrolytmangel — kein Zeichen dass Keto falsch ist. Wer Elektrolyte im Griff hat, merkt kaum etwas.
            </p>
          </div>

          <div className="space-y-4 mb-5">
            {ELEKTROLYTE.map(e => (
              <div key={e.name} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "#222" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{e.emoji}</span>
                    <span className="font-bold">{e.name}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "#22c55e22", color: "#22c55e" }}>
                    {e.tagesmenge} / Tag
                  </span>
                </div>
                <div className="px-4 py-3 space-y-3">
                  <p className="text-xs leading-relaxed" style={{ color: "#888" }}>{e.warum}</p>
                  <div>
                    <div className="text-xs font-semibold mb-1.5" style={{ color: "#555" }}>QUELLEN</div>
                    <div className="space-y-1">
                      {e.quellen.map((q, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span style={{ color: "#22c55e" }}>•</span>
                          <span className="text-xs" style={{ color: "#aaa" }}>{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl p-2.5" style={{ backgroundColor: "#1a0a0a", border: "1px solid #7f1d1d22" }}>
                    <span className="text-xs" style={{ color: "#ef4444" }}>⚠ Warnsignal: </span>
                    <span className="text-xs" style={{ color: "#888" }}>{e.warnsignal}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notfall-Rezept */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "#22c55e" }}>🚨 KETO-NOTFALL-DRINK</div>
            <p className="text-xs mb-3" style={{ color: "#888" }}>Wenn du dich richtig schlecht fühlst — das wirkt innerhalb von 30 Minuten:</p>
            <div className="space-y-1.5">
              {[
                "500 ml Wasser",
                "½ TL Meersalz (~1.200 mg Natrium)",
                "½ TL Kaliumchlorid (LoSalt) — optional",
                "Saft einer halben Zitrone",
                "1 Prise Magnesium-Pulver",
              ].map((z, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs font-bold w-4" style={{ color: "#22c55e" }}>{i + 1}.</span>
                  <span className="text-xs" style={{ color: "#ccc" }}>{z}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: "#555" }}>Alles mischen und in 10–15 Minuten trinken. Danach 30 Minuten Ruhe.</p>
          </div>
        </>
      )}
    </main>
  );
}
