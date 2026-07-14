"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Ziel = "abnehmen" | "halten" | "energie" | "gesundheit";
type Aktivitaet = "wenig" | "leicht" | "moderat";
type Geschlecht = "w" | "m";

const ZIELE = [
  { key: "energie" as Ziel, emoji: "⚡", titel: "Mehr Energie", text: "Weniger Erschöpfung, klarer Kopf, endlich wieder Power", highlight: true },
  { key: "abnehmen" as Ziel, emoji: "🌿", titel: "Abnehmen", text: "Sanft und ohne Hunger — Keto funktioniert", highlight: false },
  { key: "gesundheit" as Ziel, emoji: "💚", titel: "Gesünder leben", text: "Meinen Körper und Stoffwechsel unterstützen", highlight: false },
  { key: "halten" as Ziel, emoji: "🎯", titel: "Gewicht halten", text: "Mein Gewicht halten und dabei gut essen", highlight: false },
];

const AKTIVITAET = [
  { key: "wenig" as Aktivitaet, emoji: "🛋️", label: "Kaum Bewegung", sub: "Bürojob, viel sitzen" },
  { key: "leicht" as Aktivitaet, emoji: "🚶", label: "Leicht aktiv", sub: "Spazieren, leichte Bewegung" },
  { key: "moderat" as Aktivitaet, emoji: "🏃", label: "Regelmäßig Sport", sub: "3× oder mehr pro Woche" },
];

function berechneMakros(gewicht: number, groesse: number, alter: number, geschlecht: Geschlecht, aktivitaet: Aktivitaet, ziel: Ziel) {
  const bmr = geschlecht === "m"
    ? 10 * gewicht + 6.25 * groesse - 5 * alter + 5
    : 10 * gewicht + 6.25 * groesse - 5 * alter - 161;
  const faktor = AKTIVITAET.find(a => a.key === aktivitaet)?.key === "wenig" ? 1.2 : aktivitaet === "leicht" ? 1.375 : 1.55;
  let tdee = Math.round(bmr * faktor);
  if (ziel === "abnehmen") tdee = Math.round(tdee - 400);
  if (ziel === "energie" || ziel === "gesundheit") tdee = Math.round(tdee - 200);
  const kh = 20;
  const eiweiss = Math.round(gewicht * 1.5);
  const fett = Math.max(40, Math.round((tdee - kh * 4 - eiweiss * 4) / 9));
  return { kcal: tdee, kh, eiweiss, fett };
}

export default function OnboardingPage() {
  const router = useRouter();
  const [schritt, setSchritt] = useState(1);
  const [name, setName] = useState("");
  const [ziel, setZiel] = useState<Ziel | null>(null);
  const [geschlecht, setGeschlecht] = useState<Geschlecht>("w");
  const [gewicht, setGewicht] = useState("");
  const [groesse, setGroesse] = useState("");
  const [alter, setAlter] = useState("");
  const [aktivitaet, setAktivitaet] = useState<Aktivitaet>("leicht");
  const [makros, setMakros] = useState({ kcal: 1500, kh: 20, eiweiss: 100, fett: 120 });
  const [makrosBerechnet, setMakrosBerechnet] = useState(false);

  function weiter() {
    if (schritt === 3) {
      const g = parseFloat(gewicht), gr = parseFloat(groesse), a = parseInt(alter);
      if (g > 0 && gr > 0 && a > 0 && ziel) {
        setMakros(berechneMakros(g, gr, a, geschlecht, aktivitaet, ziel));
        setMakrosBerechnet(true);
      }
    }
    setSchritt(s => s + 1);
  }

  function abschliessen() {
    localStorage.setItem("ketome_ziele", JSON.stringify(makros));
    localStorage.setItem("ketome_profil", JSON.stringify({ name, ziel, gewicht: parseFloat(gewicht) || null, groesse: parseFloat(groesse) || null, alter: parseInt(alter) || null, geschlecht }));
    if (parseFloat(gewicht) > 0) {
      const arr = JSON.parse(localStorage.getItem("ketome_gewicht") || "[]");
      if (arr.length === 0) {
        arr.push({ datum: new Date().toLocaleDateString("de-DE"), wert: parseFloat(gewicht) });
        localStorage.setItem("ketome_gewicht", JSON.stringify(arr));
      }
    }
    localStorage.setItem("ketome_onboarding_done", "1");
    if (!localStorage.getItem("ketome_startdatum")) {
      localStorage.setItem("ketome_startdatum", new Date().toLocaleDateString("de-DE"));
    }
    router.push("/tracking");
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#080b08" }}>

      {/* Fortschrittsbalken oben */}
      <div className="flex gap-1.5 px-5 pt-6 pb-2">
        {[1,2,3,4,5].map(s => (
          <div key={s} className="flex-1 h-1 rounded-full transition-all duration-500"
            style={{ backgroundColor: s <= schritt ? "#22c55e" : "#1a1a1a" }} />
        ))}
      </div>

      <div className="flex-1 px-5 py-6 flex flex-col">

        {/* ─── SCHRITT 1: Willkommen ─────────────────────────────────────────── */}
        {schritt === 1 && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              {/* Hero */}
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl mb-5"
                  style={{ background: "linear-gradient(135deg, #0d2018, #1a3a1a)", border: "1px solid #22c55e33" }}>
                  🥑
                </div>
                <h1 className="text-4xl font-black leading-tight mb-1">
                  Willkommen<br />
                  <span style={{ color: "#22c55e" }}>bei VitaKeto</span>
                </h1>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: "#aaa" }}>
                  Dein persönlicher Keto-Begleiter.<br />In 2 Minuten komplett eingerichtet.
                </p>
              </div>

              {/* Tanjas Nachricht */}
              <div className="rounded-2xl p-4 mb-8"
                style={{ background: "linear-gradient(135deg, #0d180d, #0a1a12)", border: "1px solid #22c55e22" }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: "#22c55e22", border: "1px solid #22c55e44" }}>
                    T
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-1" style={{ color: "#22c55e" }}>Tanja · Gründerin</div>
                    <p className="text-sm leading-relaxed" style={{ color: "#ccc" }}>
                      Ich habe diese App gebaut weil ich als Frau über 40 einfach keine App gefunden habe, die <em>mich</em> versteht. Keine Diät-App, kein Kalorienzähler — sondern ein ehrlicher Begleiter für mehr Energie und weniger Erschöpfung. 💚
                    </p>
                  </div>
                </div>
              </div>

              {/* Name-Eingabe */}
              <div>
                <label className="text-xs font-semibold tracking-widest block mb-3" style={{ color: "#999" }}>
                  WIE HEISST DU?
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Dein Vorname"
                  className="w-full px-5 py-4 rounded-2xl outline-none text-white text-xl font-medium placeholder:text-gray-500"
                  style={{ backgroundColor: "#1a1a1a", border: name ? "1px solid #22c55e88" : "1px solid #444" }}
                  autoFocus
                />
              </div>
            </div>

            <button onClick={weiter} disabled={!name.trim()}
              className="w-full py-5 rounded-2xl font-black text-lg text-white mt-6 disabled:opacity-50"
              style={{ backgroundColor: "#22c55e" }}>
              Los geht's →
            </button>
          </div>
        )}

        {/* ─── SCHRITT 2: Ziel ───────────────────────────────────────────────── */}
        {schritt === 2 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-8">
              <p className="text-sm mb-1" style={{ color: "#999" }}>Hey {name} 👋</p>
              <h2 className="text-3xl font-black leading-tight">Was willst du<br />
                <span style={{ color: "#22c55e" }}>erreichen?</span>
              </h2>
            </div>

            <div className="flex-1 space-y-3">
              {ZIELE.map(z => (
                <button key={z.key} onClick={() => setZiel(z.key)}
                  className="w-full p-4 rounded-2xl text-left flex items-center gap-4 transition-all"
                  style={{
                    background: ziel === z.key
                      ? "linear-gradient(135deg, #0d2018, #0a1a0a)"
                      : z.highlight ? "#0d120d" : "#111",
                    border: `2px solid ${ziel === z.key ? "#22c55e" : z.highlight ? "#22c55e33" : "#1a1a1a"}`,
                  }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: ziel === z.key ? "#22c55e22" : "#1a1a1a" }}>
                    {z.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-sm">{z.titel}</span>
                      {z.highlight && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                          style={{ backgroundColor: "#22c55e", color: "#000" }}>
                          Beliebt
                        </span>
                      )}
                    </div>
                    <span className="text-xs" style={{ color: "#999" }}>{z.text}</span>
                  </div>
                  {ziel === z.key && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#22c55e" }}>
                      <span className="text-black text-xs font-black">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setSchritt(1)} className="w-12 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#111", color: "#999" }}>←</button>
              <button onClick={weiter} disabled={!ziel}
                className="flex-1 py-4 rounded-2xl font-black text-white disabled:opacity-50"
                style={{ backgroundColor: "#22c55e" }}>
                Weiter →
              </button>
            </div>
          </div>
        )}

        {/* ─── SCHRITT 3: Körperdaten ────────────────────────────────────────── */}
        {schritt === 3 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              <h2 className="text-3xl font-black mb-2">Deine Daten<br />
                <span style={{ color: "#22c55e" }}>— optional</span>
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#999" }}>
                Damit berechnen wir deine persönlichen Makros. Du kannst das auch überspringen.
              </p>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {([{ key: "w", label: "👩 Frau" }, { key: "m", label: "👨 Mann" }] as const).map(g => (
                  <button key={g.key} onClick={() => setGeschlecht(g.key)}
                    className="py-3.5 rounded-2xl font-semibold text-sm"
                    style={{
                      backgroundColor: geschlecht === g.key ? "#22c55e" : "#111",
                      color: geschlecht === g.key ? "#000" : "#bbb",
                    }}>
                    {g.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Gewicht", einheit: "kg", val: gewicht, set: setGewicht, placeholder: "75" },
                  { label: "Größe", einheit: "cm", val: groesse, set: setGroesse, placeholder: "168" },
                  { label: "Alter", einheit: "J.", val: alter, set: setAlter, placeholder: "42" },
                ].map(({ label, einheit, val, set, placeholder }) => (
                  <div key={label} className="rounded-2xl p-3" style={{ backgroundColor: "#111" }}>
                    <div className="text-[10px] mb-2 font-semibold" style={{ color: "#999" }}>{label}</div>
                    <input value={val} onChange={e => set(e.target.value)} type="number" placeholder={placeholder}
                      className="w-full outline-none text-white text-lg font-bold bg-transparent"
                      style={{ caretColor: "#22c55e" }} />
                    <div className="text-xs mt-1" style={{ color: "#888" }}>{einheit}</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-xs font-semibold mb-2 tracking-widest" style={{ color: "#999" }}>AKTIVITÄT</div>
                <div className="space-y-2">
                  {AKTIVITAET.map(a => (
                    <button key={a.key} onClick={() => setAktivitaet(a.key)}
                      className="w-full px-4 py-3 rounded-xl text-left flex items-center gap-3"
                      style={{
                        backgroundColor: aktivitaet === a.key ? "#0d2018" : "#111",
                        border: `1px solid ${aktivitaet === a.key ? "#22c55e55" : "transparent"}`,
                      }}>
                      <span className="text-xl">{a.emoji}</span>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: aktivitaet === a.key ? "#fff" : "#888" }}>{a.label}</div>
                        <div className="text-xs" style={{ color: "#888" }}>{a.sub}</div>
                      </div>
                      {aktivitaet === a.key && <span className="ml-auto text-xs font-bold" style={{ color: "#22c55e" }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setSchritt(2)} className="w-12 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#111", color: "#999" }}>←</button>
              <button onClick={weiter} className="flex-1 py-4 rounded-2xl font-black text-white"
                style={{ backgroundColor: "#22c55e" }}>
                {gewicht && groesse && alter ? "Makros berechnen →" : "Überspringen →"}
              </button>
            </div>
          </div>
        )}

        {/* ─── SCHRITT 4: Makroziele ─────────────────────────────────────────── */}
        {schritt === 4 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              {makrosBerechnet ? (
                <>
                  <div className="text-4xl mb-3">🧮</div>
                  <h2 className="text-3xl font-black mb-2">Deine<br />
                    <span style={{ color: "#22c55e" }}>Makros</span>
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "#999" }}>
                    Individuell für dich berechnet. Du kannst die Werte jederzeit anpassen.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-black mb-2">Deine<br />
                    <span style={{ color: "#22c55e" }}>Tagesziele</span>
                  </h2>
                  <p className="text-sm" style={{ color: "#999" }}>Passe die Werte an deine Bedürfnisse an.</p>
                </>
              )}
            </div>

            <div className="flex-1 space-y-3">
              {[
                { label: "Kalorien", key: "kcal" as const, einheit: "kcal", emoji: "🔥", farbe: "#f59e0b" },
                { label: "Kohlenhydrate", key: "kh" as const, einheit: "g", emoji: "🍞", farbe: "#ef4444" },
                { label: "Eiweiß", key: "eiweiss" as const, einheit: "g", emoji: "🥩", farbe: "#22c55e" },
                { label: "Fett", key: "fett" as const, einheit: "g", emoji: "🧈", farbe: "#8b5cf6" },
              ].map(({ label, key, einheit, emoji, farbe }) => (
                <div key={key} className="rounded-2xl p-4 flex items-center gap-4" style={{ backgroundColor: "#111" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: farbe + "22" }}>
                    {emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold mb-1" style={{ color: "#999" }}>{label}</div>
                    <input value={makros[key]}
                      onChange={e => setMakros(m => ({ ...m, [key]: parseInt(e.target.value) || 0 }))}
                      type="number"
                      className="w-full outline-none font-black text-2xl bg-transparent"
                      style={{ color: farbe, caretColor: farbe }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#888" }}>{einheit}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setSchritt(3)} className="w-12 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#111", color: "#999" }}>←</button>
              <button onClick={weiter} className="flex-1 py-4 rounded-2xl font-black text-white"
                style={{ backgroundColor: "#22c55e" }}>
                Fast fertig →
              </button>
            </div>
          </div>
        )}

        {/* ─── SCHRITT 5: Fertig ─────────────────────────────────────────────── */}
        {schritt === 5 && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="text-8xl">🎉</div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: "#22c55e" }}>
                  ✓
                </div>
              </div>

              <h2 className="text-4xl font-black mb-2">
                Bereit,<br />
                <span style={{ color: "#22c55e" }}>{name}!</span>
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "#999" }}>
                Alles eingerichtet. Deine Keto-Reise beginnt jetzt.
              </p>

              {/* Makros Zusammenfassung */}
              <div className="w-full rounded-2xl p-4 mb-4" style={{ backgroundColor: "#111" }}>
                <div className="text-xs font-semibold mb-3 tracking-widest text-left" style={{ color: "#999" }}>DEINE TAGESZIELE</div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "kcal", wert: makros.kcal, farbe: "#f59e0b" },
                    { label: "KH", wert: `${makros.kh}g`, farbe: "#ef4444" },
                    { label: "Eiw.", wert: `${makros.eiweiss}g`, farbe: "#22c55e" },
                    { label: "Fett", wert: `${makros.fett}g`, farbe: "#8b5cf6" },
                  ].map(({ label, wert, farbe }) => (
                    <div key={label} className="rounded-xl py-3 text-center" style={{ backgroundColor: "#1a1a1a" }}>
                      <div className="font-black text-base" style={{ color: farbe }}>{wert}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "#999" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nächster Schritt */}
              <div className="w-full rounded-2xl p-4 mb-4 text-left"
                style={{ background: "linear-gradient(135deg, #0d2018, #0a1a12)", border: "1px solid #22c55e33" }}>
                <div className="text-xs font-semibold mb-2 tracking-widest" style={{ color: "#22c55e" }}>DEIN ERSTER SCHRITT</div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <div className="font-bold text-sm">Erste Mahlzeit eintragen</div>
                    <div className="text-xs mt-0.5" style={{ color: "#999" }}>Tracking-App öffnet sich automatisch</div>
                  </div>
                </div>
              </div>

              <div className="w-full rounded-2xl p-4 text-left" style={{ backgroundColor: "#111" }}>
                <div className="text-xs font-semibold mb-2 tracking-widest" style={{ color: "#999" }}>COMMUNITY</div>
                <a href="https://t.me/vitaketo_carbbye_community" target="_blank"
                  className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="font-bold text-sm">VitaKeto Telegram-Gruppe</div>
                    <div className="text-xs mt-0.5" style={{ color: "#999" }}>Fragen, Tipps, nicht allein sein</div>
                  </div>
                  <span className="ml-auto text-xs" style={{ color: "#22c55e" }}>→</span>
                </a>
              </div>
            </div>

            <button onClick={abschliessen}
              className="w-full py-5 rounded-2xl font-black text-xl text-white mt-6"
              style={{ backgroundColor: "#22c55e" }}>
              App starten 🚀
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
