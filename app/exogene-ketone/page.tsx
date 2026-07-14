"use client";
import { useState } from "react";
import Link from "next/link";

const ANWENDUNGEN = [
  {
    emoji: "🌅",
    titel: "Morgens nüchtern",
    wann: "Direkt nach dem Aufwachen",
    warum: "Ketone sofort verfügbar — kein langsames Hochfahren. Geist klar, Fokus scharf, Energie stabil von Minute 1.",
    ideal: "Perfekter Start ohne Frühstück oder mit Bulletproof Coffee",
  },
  {
    emoji: "💪",
    titel: "Vor dem Training",
    wann: "15–30 Minuten vorher",
    warum: "Muskel und Gehirn bekommen sofort Keton-Energie. Ausdauer steigt, Laktat-Produktion sinkt, schnellere Erholung.",
    ideal: "Kraft- und Ausdauersport, HIIT, Rad, Laufen",
  },
  {
    emoji: "🤒",
    titel: "Keto-Grippe überwinden",
    wann: "Bei Symptomen — sofort",
    warum: "Der Körper bekommt Ketone ohne auf die eigene Produktion warten zu müssen. Kopfschmerzen und Müdigkeit verschwinden oft innerhalb von 30 Minuten.",
    ideal: "Die ersten 3–5 Tage Keto-Einstieg",
  },
  {
    emoji: "🍕",
    titel: "Nach einem KH-Ausrutscher",
    wann: "Sobald wie möglich danach",
    warum: "Beschleunigt die Rückkehr in Ketose. Der Blutzucker normalisiert sich schneller, Ketone im Blut trotzdem messbar.",
    ideal: "Party, Urlaub, ungewollte KH — kein Schuldgefühl nötig",
  },
  {
    emoji: "✈️",
    titel: "Reisen & unterwegs",
    wann: "Wann immer keto-Essen schwer zu finden ist",
    warum: "Ketone im Gepäck = Keto-Sicherheitsnetz. Egal ob Flughafen, Hotel oder Restaurant — du bist versorgt.",
    ideal: "Geschäftsreisen, Urlaub, lange Autofahrten",
  },
  {
    emoji: "🧠",
    titel: "Mentale Hochleistung",
    wann: "Vor wichtigen Meetings, Prüfungen, kreativer Arbeit",
    warum: "Das Gehirn läuft auf Ketonen auf einem anderen Level. Klarheit, Fokus und Gedächtnisleistung messbar verbessert.",
    ideal: "Präsentationen, Deadlines, kreative Projekte",
  },
];

const PROTOKOLLE = [
  {
    name: "Starter-Protokoll",
    fuer: "Keto-Einsteiger & Keto-Grippe",
    farbe: "#22c55e",
    emoji: "🌱",
    schritte: [
      "Tag 1–3: Morgens nüchtern — eine Portion exogene Ketone",
      "Zusätzlich: Elektrolyte (Salz, Magnesium)",
      "Keton-Wert 45–60 Min nach Einnahme messen (Ziel: > 0.5 mmol/L)",
      "Auf Signale achten: Energie, Klarheit, weniger Hunger",
      "Ab Tag 4: Körper beginnt eigene Ketone zu produzieren",
    ],
    ziel: "Keto-Grippe überspringen, sanften Einstieg ermöglichen",
  },
  {
    name: "Performance-Protokoll",
    fuer: "Sport & Hochleistung",
    farbe: "#3b82f6",
    emoji: "⚡",
    schritte: [
      "30 Min vor Training: Eine Portion exogene Ketone",
      "Optional: Kreatin + L-Carnitin dazu",
      "Nach Training: Proteinreiche Mahlzeit",
      "An Ruhetagen: Morgens nüchtern für Fokus",
      "Keton-Wert vor & nach messen für optimale Timing-Kalibrierung",
    ],
    ziel: "Ausdauer steigern, Erholung beschleunigen, Muskelerhalt",
  },
  {
    name: "Fasten-Protokoll",
    fuer: "Intermittierendes Fasten & Autophagie",
    farbe: "#8b5cf6",
    emoji: "⏱",
    schritte: [
      "Fastenperiode verlängern ohne Hunger: Ketone nehmen",
      "Keine Kalorien aus Protein/KH — Ketone unterbrechen Fasten kaum",
      "Autophagie bleibt aktiv (BHB-Salze = minimal insulinogen)",
      "Ideal mit 16:8 oder 24h-Fasten kombiniert",
      "Elektrolyte nicht vergessen — Fasten erhöht Ausscheidung",
    ],
    ziel: "Längeres Fasten ermöglichen, Autophagie unterstützen",
  },
];

const FAQ = [
  {
    frage: "Ersetzen exogene Ketone die Keto-Ernährung?",
    antwort: "Nein — sie sind eine Ergänzung, kein Ersatz. Ohne Keto-Ernährung liefern sie kurzfristig Ketone, aber die tiefgreifenden metabolischen Vorteile (Fettverbrennung, Insulinsensitivität, Ketose-Adaption) entstehen nur durch echte Ernährungsumstellung.",
  },
  {
    frage: "Wie schnell wirken sie?",
    antwort: "BHB ist meist nach 15–30 Minuten im Blut messbar. Die subjektive Wirkung (Energie, Klarheit) setzt oft noch früher ein. Maximaler Keton-Spiegel nach ca. 60–90 Minuten.",
  },
  {
    frage: "BHB-Salze oder BHB-Ester — was ist besser?",
    antwort: "Ester heben den Keton-Spiegel stärker an, schmecken aber intensiv und sind teurer. Salze sind alltagstauglicher, gut verträglich und für die meisten Zwecke ausreichend. Hochwertige BHB-Salze (Kalzium, Natrium, Magnesium-BHB) sind die beste Wahl für den Alltag.",
  },
  {
    frage: "Kann ich sie täglich nehmen?",
    antwort: "Ja — tägliche Einnahme ist unbedenklich. Viele Profis nehmen sie morgens als festen Bestandteil ihrer Routine. Der Körper entwickelt keine Abhängigkeit und die eigene Ketonproduktion wird nicht gehemmt.",
  },
  {
    frage: "Unterbrechen sie das Fasten?",
    antwort: "BHB-Salze sind minimal insulinogen — sie unterbrechen die Autophagie kaum. Für strenge therapeutische Protokolle nur Wasser und Elektrolyte. Für Alltags-Fasten und mentale Leistung sind sie ideal.",
  },
  {
    frage: "Was ist der Unterschied zu Ketose durch Ernährung?",
    antwort: "Ernährungsketose braucht 2–7 Tage Anpassung und strenge KH-Beschränkung. Exogene Ketone liefern Ketone innerhalb von 30 Minuten — unabhängig davon was du gegessen hast. Beides zusammen ist die mächtigste Kombination.",
  },
];

export default function ExogeneKetonePage() {
  const [offenesFAQ, setOffenesFAQ] = useState<number | null>(null);
  const [aktivesProtokoll, setAktivesProtokoll] = useState(0);

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      {/* Hero */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: "linear-gradient(135deg, #0d2018 0%, #0a1020 100%)", border: "1px solid #22c55e33" }}>
        <div className="text-4xl mb-3">⚡</div>
        <h1 className="text-2xl font-black mb-2 leading-tight">Ein anderer<br />Treibstoff.</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#aaa" }}>
          Exogene Ketone liefern deinem Körper und Gehirn sofort verfügbare Keton-Energie — ohne tagelange Umstellung, ohne Hunger, ohne Kompromisse.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { wert: "30 Min", label: "bis zur Wirkung" },
            { wert: "100%", label: "natürlich" },
            { wert: "0g", label: "Netto-KH" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: "#ffffff0a" }}>
              <div className="font-black text-lg" style={{ color: "#22c55e" }}>{s.wert}</div>
              <div className="text-[10px] mt-0.5" style={{ color: "#555" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Was passiert im Körper */}
      <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>WAS PASSIERT IN DEINEM KÖRPER</div>
        <div className="space-y-3">
          {[
            { emoji: "🧬", titel: "BHB direkt ins Blut", text: "Beta-Hydroxybutyrat (BHB) ist das primäre Keton im Körper. Exogen eingenommen wird es direkt vom Darm ins Blut aufgenommen — kein Umweg über die Leber." },
            { emoji: "🧠", titel: "Sofortenergie fürs Gehirn", text: "Das Gehirn kann BHB effizienter verbrennen als Glukose — 28% mehr ATP-Produktion pro Sauerstoffmolekül. Ergebnis: kristallklarer Fokus ohne Energieschwankungen." },
            { emoji: "🔥", titel: "Doppelter Keton-Boost", text: "In Ernährungsketose + exogene Ketone = Ketone aus eigener Produktion und von außen. Synergieeffekt für maximale metabolische Leistung." },
            { emoji: "💪", titel: "Muskelschutz", text: "BHB hemmt Proteinabbau (Leucin-sparender Effekt). Muskeln werden bei Kaloriendefizit und Fasten besser geschützt als mit Glukose." },
          ].map((p, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-xl flex-shrink-0">{p.emoji}</span>
              <div>
                <div className="text-sm font-semibold mb-0.5">{p.titel}</div>
                <p className="text-xs leading-relaxed" style={{ color: "#888" }}>{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anwendungsfälle */}
      <div className="mb-5">
        <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>WANN & WOFÜR</div>
        <div className="space-y-2">
          {ANWENDUNGEN.map((a, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{a.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm mb-0.5">{a.titel}</div>
                  <div className="text-xs mb-2" style={{ color: "#555" }}>⏰ {a.wann}</div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: "#888" }}>{a.warum}</p>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: "#22c55e11", color: "#22c55e" }}>
                    <span>✓</span> {a.ideal}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protokolle */}
      <div className="mb-5">
        <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>PROTOKOLLE</div>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {PROTOKOLLE.map((p, i) => (
            <button key={i} onClick={() => setAktivesProtokoll(i)}
              className="flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium flex items-center gap-1.5"
              style={{ backgroundColor: aktivesProtokoll === i ? p.farbe : "#1a1a1a", color: aktivesProtokoll === i ? "#000" : "#888" }}>
              {p.emoji} {p.name}
            </button>
          ))}
        </div>
        {(() => {
          const p = PROTOKOLLE[aktivesProtokoll];
          return (
            <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a", border: `1px solid ${p.farbe}33` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-xs" style={{ color: "#555" }}>Für: {p.fuer}</div>
                </div>
              </div>
              <div className="mt-3 rounded-xl p-3 mb-3 text-xs" style={{ backgroundColor: "#2a2a2a", color: "#888" }}>
                🎯 Ziel: {p.ziel}
              </div>
              <div className="space-y-2">
                {p.schritte.map((s, j) => (
                  <div key={j} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ backgroundColor: p.farbe + "22", color: p.farbe, marginTop: 1 }}>
                      {j + 1}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#ccc" }}>{s}</p>
                  </div>
                ))}
              </div>
              <Link href="/profis" className="mt-4 flex items-center gap-1.5 text-xs" style={{ color: p.farbe }}>
                → Keton-Wert in der Profi-Zone tracken
              </Link>
            </div>
          );
        })()}
      </div>

      {/* Keton-Typen */}
      <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>DIE DREI FORMEN</div>
        <div className="space-y-3">
          {[
            {
              name: "BHB-Salze", emoji: "🧂", bewertung: "★★★★☆",
              text: "Kalzium-, Natrium-, Magnesium- und Kalium-BHB. Alltagstauglich, gut verträglich, liefern gleichzeitig Elektrolyte. Die beste Wahl für die meisten Menschen.",
              pros: ["Guter Geschmack möglich", "Elektrolyte inklusive", "Alltagstauglich"],
              cons: ["Weniger starker Keton-Anstieg als Ester"],
            },
            {
              name: "BHB-Ester", emoji: "⚗️", bewertung: "★★★★★",
              text: "Direktester BHB ohne Mineralstoff-Bindung. Stärkster und schnellster Keton-Anstieg — der Gold-Standard für Spitzenleistung.",
              pros: ["Maximaler Keton-Anstieg", "Schnellste Wirkung", "Für Hochleistung"],
              cons: ["Intensiver Geschmack", "Teurer", "Für Einsteiger überwältigend"],
            },
            {
              name: "MCT → Ketone", emoji: "🥥", bewertung: "★★★☆☆",
              text: "MCT-Öl (C8) wird in der Leber zu Ketonen umgewandelt. Kein direktes BHB — sanftere, langsamere Wirkung. Ideal als tägliches Nahrungsmittel.",
              pros: ["Günstig", "Natürlicher Weg", "Gut als Basis"],
              cons: ["Langsamer als BHB", "Keine direkten Ketone"],
            },
          ].map(t => (
            <div key={t.name} className="rounded-xl p-3" style={{ backgroundColor: "#2a2a2a" }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{t.emoji}</span>
                  <span className="font-semibold text-sm">{t.name}</span>
                </div>
                <span className="text-xs" style={{ color: "#f59e0b" }}>{t.bewertung}</span>
              </div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: "#888" }}>{t.text}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  {t.pros.map((p, i) => <div key={i} className="text-xs" style={{ color: "#22c55e" }}>+ {p}</div>)}
                </div>
                <div>
                  {t.cons.map((c, i) => <div key={i} className="text-xs" style={{ color: "#ef4444" }}>− {c}</div>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* K_1 — Die neue Generation */}
      <div className="rounded-2xl p-4 mb-5" style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0d1520 100%)", border: "1px solid #8b5cf633" }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🧬</span>
          <div>
            <div className="text-xs font-semibold" style={{ color: "#8b5cf6" }}>DIE NÄCHSTE GENERATION</div>
            <div className="font-black text-lg leading-tight">K_1 — Drei Wirkstoffe.<br />Ein Ziel.</div>
          </div>
        </div>
        <p className="text-xs leading-relaxed mt-2 mb-4" style={{ color: "#aaa" }}>
          Klassische exogene Ketone liefern Ketone von außen. K_1 geht weiter:
          durch die einzigartige Kombination aus drei Wirkstoffen wird nicht nur Energie geliefert —
          dein Körper beginnt auch, <strong style={{ color: "#c4b5fd" }}>selbst mehr Ketone zu produzieren</strong>.
          Diese Formel ist aktuell einmalig in Europa.
        </p>

        <div className="space-y-3 mb-4">
          {[
            {
              kuerzel: "R-BHB",
              farbe: "#22c55e",
              titel: "R-Beta-Hydroxybutyrat",
              text: "Die aktive, körpereigene Form von BHB. Genau das Keton, das dein Körper selbst herstellt — direkt verfügbar für Gehirn, Herz und Muskeln. Maximale Bioverfügbarkeit.",
              badge: "Die Kraft-Ketonkörper",
            },
            {
              kuerzel: "L-BHB",
              farbe: "#3b82f6",
              titel: "L-Beta-Hydroxybutyrat",
              text: "Das zweite Isomer von BHB. Ergänzt R-BHB für ein vollständiges BHB-Spektrum. Neuere Forschung zeigt eigenständige metabolische Signalwirkung — nicht nur Energie, auch Regulation.",
              badge: "Der Vollspektrum-Faktor",
            },
            {
              kuerzel: "C5",
              farbe: "#f59e0b",
              titel: "C5-Vorstufe — der Gamechanger",
              text: "Eine 5-Kohlenstoff-Keton-Vorstufe, die direkt in die körpereigene Ketonproduktion eingreift. Statt nur Ketone zu liefern, aktiviert C5 den eigenen Ketonmotor — nachhaltiger, tiefer, metabolisch hochwirksam.",
              badge: "★ Einmalig in Europa",
            },
          ].map(w => (
            <div key={w.kuerzel} className="rounded-xl p-3" style={{ backgroundColor: "#ffffff08", border: `1px solid ${w.farbe}22` }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded-lg" style={{ backgroundColor: w.farbe + "22", color: w.farbe }}>{w.kuerzel}</span>
                  <span className="text-sm font-semibold">{w.titel}</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed mb-1.5" style={{ color: "#888" }}>{w.text}</p>
              <div className="text-xs font-medium" style={{ color: w.farbe }}>→ {w.badge}</div>
            </div>
          ))}
        </div>

        {/* Vergleich: klassisch vs K_1 */}
        <div className="rounded-xl p-3" style={{ backgroundColor: "#ffffff08" }}>
          <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>K_1 VS. KLASSISCHE KETONE</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-2.5" style={{ backgroundColor: "#1a1a2a" }}>
              <div className="text-xs font-bold mb-1.5" style={{ color: "#555" }}>Klassisch (nur R-BHB)</div>
              {["Sofortenergie von außen", "Keton-Spiegel steigt kurz", "Wirkung lässt nach", "Kein Einfluss auf eigene Produktion"].map((p, i) => (
                <div key={i} className="text-xs mb-0.5" style={{ color: "#666" }}>• {p}</div>
              ))}
            </div>
            <div className="rounded-lg p-2.5" style={{ backgroundColor: "#1a0a2e", border: "1px solid #8b5cf622" }}>
              <div className="text-xs font-bold mb-1.5" style={{ color: "#8b5cf6" }}>K_1 (R-BHB + L-BHB + C5)</div>
              {["Sofortenergie von außen", "Vollspektrum BHB-Wirkung", "C5 aktiviert eigene Produktion", "Körper + extern in Synergie"].map((p, i) => (
                <div key={i} className="text-xs mb-0.5" style={{ color: "#c4b5fd" }}>✓ {p}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl p-3 text-center" style={{ backgroundColor: "#2d1a4a" }}>
          <div className="text-xs mb-3" style={{ color: "#c4b5fd" }}>
            🌍 Diese 3-Wirkstoff-Kombination ist aktuell <strong>einmalig in Europa</strong> —
            und nur bei einem einzigen Anbieter erhältlich.
          </div>
          <a href="https://CarbBye.pruvit.com" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", color: "#fff" }}>
            ⚡ K_1 jetzt entdecken →
          </a>
        </div>
      </div>

      {/* Synergie mit Keto */}
      <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "#22c55e" }}>🔥 DIE PERFEKTE KOMBINATION</div>
        <div className="space-y-3">
          {[
            { links: "Keto-Ernährung allein", rechts: "Basis-Ketose, 2–7 Tage Anpassung" },
            { links: "Exogene Ketone allein", rechts: "Sofort-Ketone, 30 Min Wirkung" },
            { links: "Keto + Exogene Ketone", rechts: "Maximale Ketose, metabolische Flexibilität, Spitzenleistung" },
          ].map((r, i) => (
            <div key={i} className={`rounded-xl p-3 ${i === 2 ? "border" : ""}`}
              style={{ backgroundColor: i === 2 ? "#0a2a12" : "#1a2a1a", borderColor: i === 2 ? "#22c55e" : "transparent" }}>
              <div className="text-xs font-semibold mb-0.5" style={{ color: i === 2 ? "#22c55e" : "#888" }}>{r.links}</div>
              <div className="text-xs" style={{ color: i === 2 ? "#aaa" : "#555" }}>{r.rechts}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-5">
        <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>HÄUFIGE FRAGEN</div>
        <div className="space-y-2">
          {FAQ.map((f, i) => (
            <div key={i} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
              <button className="w-full px-4 py-3 text-left flex items-center gap-3"
                onClick={() => setOffenesFAQ(offenesFAQ === i ? null : i)}>
                <span className="flex-1 text-sm font-medium leading-snug">{f.frage}</span>
                <span className="flex-shrink-0 text-xs" style={{ color: "#333" }}>{offenesFAQ === i ? "▲" : "▼"}</span>
              </button>
              {offenesFAQ === i && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: "#222" }}>
                  <p className="text-xs leading-relaxed pt-3" style={{ color: "#888" }}>{f.antwort}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Shop CTA */}
      <a href="https://CarbBye.pruvit.com" target="_blank" rel="noopener noreferrer"
        className="block rounded-2xl p-5 text-center mb-4"
        style={{ background: "linear-gradient(135deg, #1a0a2e, #0d1520)", border: "1px solid #8b5cf655" }}>
        <div className="text-3xl mb-2">⚡</div>
        <div className="font-black text-base mb-1" style={{ color: "#c4b5fd" }}>Den einzigen Anbieter in Europa entdecken</div>
        <div className="text-xs mb-3" style={{ color: "#777" }}>K_1 mit R-BHB + L-BHB + C5 — die vollständige Formel</div>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", color: "#fff" }}>
          Jetzt informieren & bestellen →
        </div>
      </a>

      {/* Rezepte CTA */}
      <Link href="/exo-rezepte" className="block rounded-2xl p-4 text-center mb-4"
        style={{ backgroundColor: "#1a0a2e", border: "1px solid #8b5cf633" }}>
        <div className="text-2xl mb-1">🍓</div>
        <div className="font-bold text-sm mb-1" style={{ color: "#c4b5fd" }}>Rezepte mit exogenen Ketonen</div>
        <div className="text-xs" style={{ color: "#555" }}>Fake Erdbeer-Sahnetorte, Eis, Pralinen & mehr — unter 3g Netto-KH</div>
      </Link>

      {/* Keton messen CTA */}
      <Link href="/profis" className="block rounded-2xl p-4 text-center mb-4"
        style={{ backgroundColor: "#0a1020", border: "1px solid #3b82f633" }}>
        <div className="text-2xl mb-1">🩸</div>
        <div className="font-bold text-sm mb-1" style={{ color: "#3b82f6" }}>Keton-Wert messen & tracken</div>
        <div className="text-xs" style={{ color: "#555" }}>In der Profi-Zone deine Blut-Ketone eintragen und den Effekt sehen</div>
      </Link>

      {/* Community */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a", border: "1px solid #222" }}>
        <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>FRAGEN? COMMUNITY & MEHR</div>
        <div className="space-y-2">
          <a href="https://www.instagram.com/carbbye_tanja" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl p-3"
            style={{ backgroundColor: "#2a2a2a" }}>
            <span className="text-xl">📸</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">@carbbye_tanja</div>
              <div className="text-xs" style={{ color: "#555" }}>Erfahrungsberichte & Tipps auf Instagram</div>
            </div>
            <span className="text-xs" style={{ color: "#e1306c" }}>→</span>
          </a>
          <a href="https://carbbye.de" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl p-3"
            style={{ backgroundColor: "#2a2a2a" }}>
            <span className="text-xl">🌐</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">carbbye.de</div>
              <div className="text-xs" style={{ color: "#555" }}>Mehr Infos, Blog & Keto-Wissen</div>
            </div>
            <span className="text-xs" style={{ color: "#22c55e" }}>→</span>
          </a>
        </div>
      </div>
    </main>
  );
}
