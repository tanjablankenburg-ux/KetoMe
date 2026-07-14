"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Geschlecht = "maennlich" | "weiblich";
type Ziel = "abnehmen" | "halten" | "aufbauen";
type Aktivitaet = 1.2 | 1.375 | 1.55 | 1.725 | 1.9;

const AKTIVITAET_OPTIONEN: { wert: Aktivitaet; label: string; sub: string }[] = [
  { wert: 1.2,   label: "Kaum Bewegung",     sub: "Bürojob, kein Sport" },
  { wert: 1.375, label: "Leicht aktiv",       sub: "1–3x Sport/Woche" },
  { wert: 1.55,  label: "Mäßig aktiv",        sub: "3–5x Sport/Woche" },
  { wert: 1.725, label: "Sehr aktiv",         sub: "6–7x intensiver Sport" },
  { wert: 1.9,   label: "Extrem aktiv",       sub: "Täglich + körperliche Arbeit" },
];

const ZIEL_OPTIONEN: { wert: Ziel; label: string; emoji: string; kcalDelta: number }[] = [
  { wert: "abnehmen",  label: "Abnehmen",       emoji: "📉", kcalDelta: -500 },
  { wert: "halten",    label: "Gewicht halten",  emoji: "⚖️", kcalDelta: 0 },
  { wert: "aufbauen",  label: "Aufbauen",        emoji: "💪", kcalDelta: 250 },
];

function berechneGrundUmsatz(gewicht: number, groesse: number, alter: number, geschlecht: Geschlecht): number {
  if (geschlecht === "maennlich") {
    return 10 * gewicht + 6.25 * groesse - 5 * alter + 5;
  }
  return 10 * gewicht + 6.25 * groesse - 5 * alter - 161;
}

export default function RechnerPage() {
  const [gewicht, setGewicht]       = useState<string>("");
  const [groesse, setGroesse]       = useState<string>("");
  const [alter, setAlter]           = useState<string>("");
  const [geschlecht, setGeschlecht] = useState<Geschlecht>("weiblich");
  const [aktivitaet, setAktivitaet] = useState<Aktivitaet>(1.375);
  const [ziel, setZiel]             = useState<Ziel>("abnehmen");
  const [ergebnis, setErgebnis]     = useState<null | {
    grundumsatz: number;
    tdee: number;
    zielKcal: number;
    protein: number;
    fett: number;
    kohlenhydrate: number;
    ketoPhase: string;
    bmi: number;
    bmiLabel: string;
  }>(null);

  useEffect(() => {
    const p = localStorage.getItem("ketome_profil");
    if (p) {
      try {
        const d = JSON.parse(p);
        if (d.gewicht) setGewicht(String(d.gewicht));
        if (d.groesse) setGroesse(String(d.groesse));
        if (d.alter)   setAlter(String(d.alter));
        if (d.geschlecht) setGeschlecht(d.geschlecht);
        if (d.aktivitaet) setAktivitaet(d.aktivitaet);
        if (d.ziel) setZiel(d.ziel === "Abnehmen" ? "abnehmen" : d.ziel === "Halten" ? "halten" : "aufbauen");
      } catch {}
    }
  }, []);

  function berechnen() {
    localStorage.setItem("ketome_rechner_benutzt", "1");
    const g = parseFloat(gewicht);
    const gr = parseFloat(groesse);
    const a = parseFloat(alter);
    if (!g || !gr || !a || g < 30 || g > 300 || gr < 100 || gr > 250 || a < 10 || a > 100) return;

    const grundumsatz = Math.round(berechneGrundUmsatz(g, gr, a, geschlecht));
    const tdee = Math.round(grundumsatz * aktivitaet);
    const zielDelta = ZIEL_OPTIONEN.find(z => z.wert === ziel)!.kcalDelta;
    const zielKcal = Math.max(1200, tdee + zielDelta);

    const protein = Math.round(g * 1.5);
    const fett = Math.round((zielKcal * 0.70) / 9);
    const kohlenhydrate = 20;

    const bmi = g / ((gr / 100) ** 2);
    const bmiLabel = bmi < 18.5 ? "Untergewicht" : bmi < 25 ? "Normalgewicht" : bmi < 30 ? "Übergewicht" : "Adipositas";

    const ketoPhase = ziel === "abnehmen"
      ? "Strenge Ketose (< 20g Netto-KH) — maximale Fettverbrennung"
      : ziel === "halten"
      ? "Nutritive Ketose (< 20g Netto-KH) — Ketose halten"
      : "Zyklische Ketose (SKD/TKD) — Muskelaufbau mit Ketonen";

    setErgebnis({ grundumsatz, tdee, zielKcal, protein, fett, kohlenhydrate, ketoPhase, bmi: Math.round(bmi * 10) / 10, bmiLabel });
  }

  function inTracking() {
    if (!ergebnis) return;
    const p = localStorage.getItem("ketome_profil");
    const existing = p ? JSON.parse(p) : {};
    localStorage.setItem("ketome_profil", JSON.stringify({
      ...existing,
      zielKcal: ergebnis.zielKcal,
      zielKh: ergebnis.kohlenhydrate,
      zielEiweiss: ergebnis.protein,
      zielFett: ergebnis.fett,
    }));
    alert("Ziele ins Tracking übernommen!");
  }

  const bereit = gewicht && groesse && alter &&
    parseFloat(gewicht) >= 30 && parseFloat(groesse) >= 100 && parseFloat(alter) >= 10;

  return (
    <main className="px-4 py-6 pb-28">
      <Link href="/" className="text-xs mb-4 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      <div className="mb-5">
        <h1 className="text-2xl font-black mb-1">🧮 Keto-Rechner</h1>
        <p className="text-sm" style={{ color: "#666" }}>Berechne deinen Kalorienbedarf, deine Makros und die optimale Keto-Strategie.</p>
      </div>

      {/* Eingaben */}
      <div className="space-y-3 mb-5">

        {/* Geschlecht */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>BIOLOGISCHES GESCHLECHT</div>
          <div className="grid grid-cols-2 gap-2">
            {(["weiblich", "maennlich"] as Geschlecht[]).map(g => (
              <button key={g} onClick={() => setGeschlecht(g)}
                className="py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  backgroundColor: geschlecht === g ? "#22c55e22" : "#2a2a2a",
                  color: geschlecht === g ? "#22c55e" : "#666",
                  border: geschlecht === g ? "1px solid #22c55e44" : "1px solid transparent",
                }}>
                {g === "weiblich" ? "♀ Weiblich" : "♂ Männlich"}
              </button>
            ))}
          </div>
        </div>

        {/* Körperdaten */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>KÖRPERDATEN</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Gewicht (kg)", value: gewicht, set: setGewicht, placeholder: "70" },
              { label: "Größe (cm)",   value: groesse, set: setGroesse, placeholder: "170" },
              { label: "Alter",        value: alter,   set: setAlter,   placeholder: "35" },
            ].map(f => (
              <div key={f.label}>
                <div className="text-[10px] mb-1" style={{ color: "#555" }}>{f.label}</div>
                <input
                  type="number"
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold text-center"
                  style={{ backgroundColor: "#2a2a2a", color: "#f5f5f5", border: "none", outline: "none" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Aktivität */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>AKTIVITÄTSLEVEL</div>
          <div className="space-y-1.5">
            {AKTIVITAET_OPTIONEN.map(opt => (
              <button key={opt.wert} onClick={() => setAktivitaet(opt.wert)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left"
                style={{
                  backgroundColor: aktivitaet === opt.wert ? "#22c55e22" : "#2a2a2a",
                  border: aktivitaet === opt.wert ? "1px solid #22c55e44" : "1px solid transparent",
                }}>
                <div className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: aktivitaet === opt.wert ? "#22c55e" : "#333" }} />
                <div>
                  <div className="text-sm font-semibold" style={{ color: aktivitaet === opt.wert ? "#22c55e" : "#ccc" }}>{opt.label}</div>
                  <div className="text-xs" style={{ color: "#555" }}>{opt.sub}</div>
                </div>
                <div className="ml-auto text-xs" style={{ color: "#333" }}>{opt.wert}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Ziel */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>DEIN ZIEL</div>
          <div className="grid grid-cols-3 gap-2">
            {ZIEL_OPTIONEN.map(z => (
              <button key={z.wert} onClick={() => setZiel(z.wert)}
                className="py-3 rounded-xl flex flex-col items-center gap-1"
                style={{
                  backgroundColor: ziel === z.wert ? "#22c55e22" : "#2a2a2a",
                  border: ziel === z.wert ? "1px solid #22c55e44" : "1px solid transparent",
                }}>
                <span className="text-xl">{z.emoji}</span>
                <span className="text-[11px] font-semibold" style={{ color: ziel === z.wert ? "#22c55e" : "#666" }}>{z.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={berechnen} disabled={!bereit}
          className="w-full py-4 rounded-2xl font-black text-base"
          style={{
            background: bereit ? "linear-gradient(135deg, #16a34a, #22c55e)" : "#1a1a1a",
            color: bereit ? "#000" : "#333",
          }}>
          {bereit ? "🧮 Jetzt berechnen" : "Bitte alle Felder ausfüllen"}
        </button>
      </div>

      {/* Ergebnis */}
      {ergebnis && (
        <div className="space-y-3">
          <div className="text-xs font-semibold" style={{ color: "#555" }}>DEIN ERGEBNIS</div>

          {/* Kalorien-Übersicht */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>KALORIENBEDARF</div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: "Grundumsatz", wert: ergebnis.grundumsatz, unit: "kcal", farbe: "#555" },
                { label: "TDEE (Bedarf)", wert: ergebnis.tdee, unit: "kcal", farbe: "#f59e0b" },
                { label: "Dein Ziel", wert: ergebnis.zielKcal, unit: "kcal", farbe: "#22c55e" },
              ].map(k => (
                <div key={k.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: "#2a2a2a" }}>
                  <div className="font-black text-xl" style={{ color: k.farbe }}>{k.wert}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "#555" }}>{k.unit}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "#666" }}>{k.label}</div>
                </div>
              ))}
            </div>
            <div className="text-xs rounded-xl p-3" style={{ backgroundColor: "#0d2018", color: "#22c55e" }}>
              💡 TDEE = Grundumsatz × Aktivitätsfaktor ({aktivitaet}). Mit Ziel-Anpassung: {ergebnis.tdee > ergebnis.zielKcal ? `-${ergebnis.tdee - ergebnis.zielKcal} kcal` : `+${ergebnis.zielKcal - ergebnis.tdee} kcal`}
            </div>
          </div>

          {/* Makros */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>DEINE KETO-MAKROS</div>
            <div className="space-y-2">
              {[
                { label: "Fett",            wert: ergebnis.fett,          unit: "g", prozent: "70%", farbe: "#f59e0b", note: "Hauptenergiequelle" },
                { label: "Protein",         wert: ergebnis.protein,       unit: "g", prozent: "25%", farbe: "#3b82f6", note: `${Math.round(parseFloat(gewicht) * 1.5 * 10) / 10}g / kg Körpergewicht` },
                { label: "Netto-KH (max)",  wert: ergebnis.kohlenhydrate, unit: "g", prozent: "5%",  farbe: "#22c55e", note: "Ketose-Grenze nicht überschreiten" },
              ].map(m => (
                <div key={m.label} className="rounded-xl p-3" style={{ backgroundColor: "#2a2a2a" }}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-semibold text-sm">{m.label}</span>
                      <span className="text-xs ml-1" style={{ color: "#555" }}>({m.prozent} der Kalorien)</span>
                    </div>
                    <div className="font-black text-lg" style={{ color: m.farbe }}>{m.wert}g</div>
                  </div>
                  <div className="rounded-full h-1.5" style={{ backgroundColor: "#3a3a3a" }}>
                    <div className="rounded-full h-1.5" style={{ backgroundColor: m.farbe, width: m.prozent }} />
                  </div>
                  <div className="text-[10px] mt-1" style={{ color: "#555" }}>{m.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BMI */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>BMI</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-black text-3xl">{ergebnis.bmi}</div>
                <div className="text-sm mt-0.5" style={{ color: ergebnis.bmi < 18.5 ? "#f59e0b" : ergebnis.bmi < 25 ? "#22c55e" : ergebnis.bmi < 30 ? "#f59e0b" : "#ef4444" }}>
                  {ergebnis.bmiLabel}
                </div>
              </div>
              <div className="text-right text-xs space-y-1" style={{ color: "#555" }}>
                <div>Untergewicht: &lt; 18.5</div>
                <div>Normalgewicht: 18.5 – 24.9</div>
                <div>Übergewicht: 25 – 29.9</div>
                <div>Adipositas: &gt; 30</div>
              </div>
            </div>
          </div>

          {/* Keto-Empfehlung */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: "#0d1a1a", border: "1px solid #22c55e33" }}>
            <div className="text-xs font-semibold mb-1" style={{ color: "#22c55e" }}>DEINE KETO-STRATEGIE</div>
            <p className="text-sm font-semibold mb-1">{ergebnis.ketoPhase}</p>
            <p className="text-xs" style={{ color: "#666" }}>
              {ziel === "abnehmen"
                ? "Bleib konsequent unter 20g Netto-KH. Das Kaloriendefizit sorgt fur Fettabbau, die Ketose schutzt die Muskelmasse und halt den Hunger gering."
                : ziel === "halten"
                ? "Du isst deinen genauen Bedarf. Ketose halt den Blutzucker stabil und die Energie gleichmaßig."
                : "Mit leichtem Kalorienuberschuss aufbauen. Zyklische Ketose: 5 Tage keto, 2 Tage mit moderaten KH nach dem Training."}
            </p>
          </div>

          {/* Ins Tracking übernehmen */}
          <button onClick={inTracking}
            className="w-full py-4 rounded-2xl font-bold text-sm"
            style={{ backgroundColor: "#0d2018", color: "#22c55e", border: "1px solid #22c55e44" }}>
            ✓ Ziele ins Tracking übernehmen
          </button>

          <Link href="/tracking"
            className="block text-center py-3 rounded-2xl text-sm font-semibold"
            style={{ backgroundColor: "#1a1a1a", color: "#555" }}>
            → Zum Tracking
          </Link>
        </div>
      )}

      {/* Erklärung wenn kein Ergebnis */}
      {!ergebnis && (
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-xs font-semibold mb-3" style={{ color: "#555" }}>WAS WIRD BERECHNET?</div>
          <div className="space-y-2">
            {[
              { emoji: "🔥", label: "Grundumsatz (BMR)", text: "Kalorien die dein Körper im Ruhezustand verbraucht — nach Harris-Benedict-Formel." },
              { emoji: "⚡", label: "TDEE", text: "Total Daily Energy Expenditure — dein realer Tagesbedarf inklusive Aktivität." },
              { emoji: "🥑", label: "Keto-Makros", text: "70% Fett / 25% Protein / 5% KH — angepasst an dein Gewicht und Ziel." },
              { emoji: "📊", label: "BMI", text: "Body Mass Index als erster Orientierungswert." },
            ].map(p => (
              <div key={p.label} className="flex gap-3">
                <span className="text-xl flex-shrink-0">{p.emoji}</span>
                <div>
                  <div className="text-sm font-semibold">{p.label}</div>
                  <div className="text-xs" style={{ color: "#555" }}>{p.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
