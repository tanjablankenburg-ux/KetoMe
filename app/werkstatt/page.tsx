"use client";
import { useState, useCallback, useEffect, useRef } from "react";

// ─── Typen ────────────────────────────────────────────────────────────────────

type RezeptTyp = "grundrezept" | "rezept";
type RezeptStatus = "entwicklung" | "getestet";

type Zutat = {
  id: string;
  name: string;
  menge: number;
  einheit: "g" | "ml" | "Stück" | "EL" | "TL";
  kcalPro100: number;
  khPro100: number;
  eiweissPro100: number;
  fettPro100: number;
  ballaststoffePro100: number;
};

type TestProtokoll = {
  id: string;
  datum: string;
  geschmack: number;
  kruste: number;
  krume: number;
  lockerheit: number;
  optik: number;
  saettigung: number;
  wiederHolen: boolean;
  notiz: string;
  fotos?: string[];
};

type WerkstattRezept = {
  id: string;
  typ: RezeptTyp;
  name: string;
  version: string;
  status: RezeptStatus;
  beschreibung: string;
  kategorie: string;
  portionen: number;
  zeit: string;
  schwierigkeit: string;
  zutaten: Zutat[];
  zubereitung: string[];
  entwicklungsnotizen: string;
  ergibtGramm?: number;
  chargennummer?: string;
  haltbarkeit?: string;
  lagerung?: string;
  verwendetGrundrezeptId?: string;
  testProtokolle: TestProtokoll[];
  erstellt: string;
  favorit: boolean;
};

// ─── Konstanten ───────────────────────────────────────────────────────────────

const KATEGORIEN = ["Frühstück", "Mittagessen", "Abendessen", "Snack", "Dessert", "Basis"];
const EINHEITEN: Zutat["einheit"][] = ["g", "ml", "Stück", "EL", "TL"];
const SCHWIERIGKEITEN = ["Einfach", "Mittel", "Aufwendig"];

const KETO_TIPPS: Record<string, string> = {
  "mehl": "Mandelmehl oder VitaKetohl",
  "weizenmehl": "Mandelmehl oder VitaKetohl",
  "zucker": "Erythrit oder Allulose",
  "kartoffeln": "Blumenkohl",
  "reis": "Blumenkohlreis",
  "nudeln": "Zucchini-Nudeln",
  "brot": "Keto-Brot",
  "paniermehl": "Schweinekrusten oder Mandelmehl",
  "stärke": "Flohsamenschalen",
  "honig": "Erythrit-Sirup",
  "haferflocken": "Kokosmehl oder Mandelmehl",
};

const TEST_KRITERIEN = [
  { key: "geschmack", label: "Geschmack", emoji: "😋" },
  { key: "kruste", label: "Kruste", emoji: "🥖" },
  { key: "krume", label: "Krume", emoji: "🍞" },
  { key: "lockerheit", label: "Lockerheit", emoji: "☁️" },
  { key: "optik", label: "Optik", emoji: "👁️" },
  { key: "saettigung", label: "Sättigung", emoji: "💚" },
] as const;

// ─── Hilfsfunktionen ──────────────────────────────────────────────────────────

function naehrwertFaktor(z: Zutat) {
  if (z.einheit === "g" || z.einheit === "ml") return z.menge / 100;
  if (z.einheit === "EL") return (z.menge * 15) / 100;
  if (z.einheit === "TL") return (z.menge * 5) / 100;
  return (z.menge * 50) / 100;
}

function berechneGesamt(zutaten: Zutat[]) {
  return zutaten.reduce((acc, z) => {
    const f = naehrwertFaktor(z);
    return {
      kcal: acc.kcal + z.kcalPro100 * f,
      kh: acc.kh + z.khPro100 * f,
      eiweiss: acc.eiweiss + z.eiweissPro100 * f,
      fett: acc.fett + z.fettPro100 * f,
      ballaststoffe: acc.ballaststoffe + z.ballaststoffePro100 * f,
    };
  }, { kcal: 0, kh: 0, eiweiss: 0, fett: 0, ballaststoffe: 0 });
}

function ketoScore(kh: number) {
  if (kh <= 5) return { farbe: "#22c55e", emoji: "🟢", label: "Perfekt Keto" };
  if (kh <= 10) return { farbe: "#f59e0b", emoji: "🟡", label: "Keto-geeignet" };
  if (kh <= 20) return { farbe: "#f97316", emoji: "🟠", label: "Grenzwertig" };
  return { farbe: "#ef4444", emoji: "🔴", label: "Nicht Keto" };
}

function naechsteVersion(version: string): string {
  const teile = version.split(".");
  const minor = parseInt(teile[1] || "0") + 1;
  return `${teile[0]}.${minor}`;
}

function neueZutat(): Zutat {
  return { id: Math.random().toString(36).slice(2), name: "", menge: 0, einheit: "g", kcalPro100: 0, khPro100: 0, eiweissPro100: 0, fettPro100: 0, ballaststoffePro100: 0 };
}

function ladeRezepte(): WerkstattRezept[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("ketome_werkstatt2") || "[]"); } catch { return []; }
}

function speichereRezepte(r: WerkstattRezept[]): boolean {
  try {
    const json = JSON.stringify(r);
    localStorage.setItem("ketome_werkstatt2", json);
    window.dispatchEvent(new Event("ketome-daten-gespeichert"));
    return true;
  } catch (e) {
    console.error("Speichern fehlgeschlagen:", e);
    return false;
  }
}

async function komprimiereBild(dataUrl: string, maxPx = 900, qualitaet = 0.7): Promise<string> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(dataUrl); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", qualitaet));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function Sterne({ wert, setze, readonly }: { wert: number; setze?: (n: number) => void; readonly?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => setze?.(n)} disabled={readonly}
          className="text-lg leading-none" style={{ color: n <= wert ? "#f59e0b" : "#333" }}>★</button>
      ))}
    </div>
  );
}

// ─── Zutat-Eingabe mit Auto-Nährwert-Suche ────────────────────────────────────

type NaehrwertTreffer = {
  name: string;
  kcal: number; kh: number; eiweiss: number; fett: number; ballaststoffe: number;
};

function ZutatEingabe({ zutat, idx, zutatenCount, onChange, onDelete }: {
  zutat: Zutat;
  idx: number;
  zutatenCount: number;
  onChange: (feld: keyof Zutat, wert: string | number) => void;
  onDelete: () => void;
}) {
  const [vorschlaege, setVorschlaege] = useState<NaehrwertTreffer[]>([]);
  const [suche, setSuche] = useState(false);
  const [aktiv, setAktiv] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (zutat.name.length < 2) { setVorschlaege([]); setSuche(false); return; }
    setSuche(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/naehrwerte?q=${encodeURIComponent(zutat.name)}`);
        const daten = await res.json();
        setVorschlaege(daten.ergebnisse || []);
      } catch { setVorschlaege([]); }
      setSuche(false);
    }, 600);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [zutat.name]);

  function waehlen(t: NaehrwertTreffer) {
    onChange("name", t.name);
    onChange("kcalPro100", t.kcal);
    onChange("khPro100", t.kh);
    onChange("eiweissPro100", t.eiweiss);
    onChange("fettPro100", t.fett);
    onChange("ballaststoffePro100", t.ballaststoffe);
    setVorschlaege([]);
    setAktiv(false);
  }

  return (
    <div ref={containerRef} className="rounded-xl p-3" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
      <div className="flex gap-2 mb-2 relative">
        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-black flex-shrink-0 mt-2"
          style={{ backgroundColor: "#22c55e" }}>{idx + 1}</span>
        <div className="flex-1 relative">
          <div className="flex gap-2">
            <input value={zutat.name}
              onChange={e => { onChange("name", e.target.value); setAktiv(true); }}
              onFocus={() => setAktiv(true)}
              placeholder="Zutat eingeben…"
              className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "#1a1a1a", color: "#fff", border: "1px solid #2a2a2a" }} />
            {suche && <span className="absolute right-12 top-2.5 text-xs animate-pulse" style={{ color: "#555" }}>🔍</span>}
            {zutatenCount > 1 && (
              <button type="button" onClick={onDelete}
                className="px-2 py-2 rounded-lg text-xs flex-shrink-0" style={{ backgroundColor: "#2a0a0a", color: "#ef4444" }}>✕</button>
            )}
          </div>
          {/* Vorschläge-Dropdown */}
          {aktiv && vorschlaege.length > 0 && (
            <div className="absolute left-0 right-0 z-50 rounded-xl overflow-hidden mt-1"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #22c55e44", boxShadow: "0 8px 24px #000a" }}>
              <p className="text-[10px] px-3 pt-2 pb-1" style={{ color: "#555" }}>Tippe zum Übernehmen — Nährwerte werden auto-eingetragen:</p>
              {vorschlaege.map((t, i) => (
                <button key={i} type="button" onMouseDown={() => waehlen(t)}
                  className="w-full text-left px-3 py-2.5 text-sm"
                  style={{ borderTop: i > 0 ? "1px solid #111" : "none" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#222")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <div className="font-medium text-xs mb-0.5" style={{ color: "#fff" }}>{t.name}</div>
                  <div className="text-[10px]" style={{ color: "#666" }}>
                    {t.kcal} kcal · KH {t.kh}g · E {t.eiweiss}g · F {t.fett}g · B {t.ballaststoffe}g (pro 100g)
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2 ml-7">
        <input type="number" value={zutat.menge || ""}
          min={0}
          placeholder="Menge"
          onChange={e => onChange("menge", e.target.value === "" ? 0 : Number(e.target.value))}
          className="rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: "#1a1a1a", color: "#fff", border: "1px solid #2a2a2a" }} />
        <select value={zutat.einheit} onChange={e => onChange("einheit", e.target.value)}
          className="rounded-lg px-2 py-2 text-sm outline-none"
          style={{ backgroundColor: "#1a1a1a", color: "#fff", border: "1px solid #2a2a2a" }}>
          {EINHEITEN.map(e => <option key={e}>{e}</option>)}
        </select>
      </div>
      <p className="text-[10px] mb-1 ml-7" style={{ color: "#444" }}>Referenzwerte pro 100{zutat.einheit === "Stück" ? "g" : zutat.einheit}:</p>
      <div className="grid grid-cols-5 gap-1 ml-7">
        {([
          { f: "kcalPro100" as const, l: "kcal", c: "#fff" },
          { f: "eiweissPro100" as const, l: "Eiw.", c: "#3b82f6" },
          { f: "fettPro100" as const, l: "Fett", c: "#f59e0b" },
          { f: "khPro100" as const, l: "KH", c: "#ef4444" },
          { f: "ballaststoffePro100" as const, l: "Bst.", c: "#22c55e" },
        ]).map(({ f, l, c }) => (
          <div key={f}>
            <div className="text-[9px] text-center mb-1" style={{ color: "#444" }}>{l}</div>
            <input type="number" value={zutat[f] || ""} min={0} step={0.1}
              placeholder="0"
              onChange={e => onChange(f, e.target.value === "" ? 0 : Number(e.target.value))}
              className="w-full rounded-lg px-1 py-1.5 text-xs text-center outline-none"
              style={{ backgroundColor: "#1a1a1a", color: c, border: `1px solid ${c}33` }} />
          </div>
        ))}
      </div>
      {/* Tatsächlicher Beitrag für die eingegebene Menge */}
      {zutat.menge > 0 && zutat.kcalPro100 > 0 && (() => {
        const f = naehrwertFaktor(zutat);
        const khGesamt = Math.round(zutat.khPro100 * f * 10) / 10;
        const bst = Math.round(zutat.ballaststoffePro100 * f * 10) / 10;
        const nettoKh = Math.max(0, Math.round((khGesamt - bst) * 10) / 10);
        const kcal = Math.round(zutat.kcalPro100 * f);
        return (
          <div className="mt-2 ml-7 px-2 py-1 rounded-lg flex gap-3 text-[10px]"
            style={{ backgroundColor: "#0a1a0a", border: "1px solid #22c55e22" }}>
            <span style={{ color: "#22c55e" }}>→ für {zutat.menge}{zutat.einheit}:</span>
            <span style={{ color: "#aaa" }}>{kcal} kcal</span>
            <span style={{ color: "#ef4444" }}>Netto-KH {nettoKh}g</span>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Hauptkomponente ──────────────────────────────────────────────────────────

export default function WerkstattPage() {
  const [rezepte, setRezepte] = useState<WerkstattRezept[]>(ladeRezepte);
  const [ansicht, setAnsicht] = useState<"liste" | "neu" | "detail" | "test">("liste");
  const [aktivId, setAktivId] = useState<string | null>(null);
  const [suche, setSuche] = useState("");
  const [filterTyp, setFilterTyp] = useState<"alle" | "grundrezept" | "rezept">("alle");

  const aktivRezept = rezepte.find(r => r.id === aktivId) || null;

  const [speicherFehler, setSpeicherFehler] = useState(false);

  function update(neu: WerkstattRezept[]) {
    setRezepte(neu);
    const ok = speichereRezepte(neu);
    setSpeicherFehler(!ok);
  }

  function oeffneDetail(id: string) { setAktivId(id); setAnsicht("detail"); }

  function loeschen(id: string) {
    if (!confirm("Rezept löschen?")) return;
    update(rezepte.filter(r => r.id !== id));
    setAnsicht("liste");
  }

  function toggleFav(id: string) {
    update(rezepte.map(r => r.id === id ? { ...r, favorit: !r.favorit } : r));
  }

  function neueVersion(r: WerkstattRezept) {
    const klon: WerkstattRezept = {
      ...r,
      id: Math.random().toString(36).slice(2),
      version: naechsteVersion(r.version),
      status: "entwicklung",
      testProtokolle: [],
      entwicklungsnotizen: "",
      erstellt: new Date().toLocaleDateString("de-DE"),
      favorit: false,
    };
    update([...rezepte, klon]);
    oeffneDetail(klon.id);
  }

  const [bearbeitenTestId, setBearbeitenTestId] = useState<string | null>(null);

  function testSpeichern(rezeptId: string, test: TestProtokoll) {
    update(rezepte.map(r => {
      if (r.id !== rezeptId) return r;
      const istBearbeitung = r.testProtokolle.some(t => t.id === test.id);
      return {
        ...r,
        status: "getestet" as RezeptStatus,
        testProtokolle: istBearbeitung
          ? r.testProtokolle.map(t => t.id === test.id ? test : t)
          : [...r.testProtokolle, test],
      };
    }));
    setBearbeitenTestId(null);
    setAnsicht("detail");
  }

  function notizSpeichern(id: string, notiz: string) {
    update(rezepte.map(r => r.id === id ? { ...r, entwicklungsnotizen: notiz } : r));
  }

  const grundrezepte = rezepte.filter(r => r.typ === "grundrezept");

  const gefiltert = rezepte.filter(r => {
    const matchSuche = r.name.toLowerCase().includes(suche.toLowerCase());
    const matchTyp = filterTyp === "alle" || r.typ === filterTyp;
    return matchSuche && matchTyp;
  });

  // Gruppiert nach Name (für Versionsanzeige)
  const gruppen: Record<string, WerkstattRezept[]> = {};
  gefiltert.forEach(r => {
    const basis = r.name.replace(/ \d+\.\d+$/, "").trim();
    if (!gruppen[basis]) gruppen[basis] = [];
    gruppen[basis].push(r);
  });

  if (ansicht === "neu") return <FormAnsicht rezepte={rezepte} grundrezepte={grundrezepte} onSave={(r) => { update([...rezepte.filter(x => x.id !== r.id), r]); setAktivId(r.id); setAnsicht("detail"); }} onBack={() => setAnsicht("liste")} bearbeiten={aktivRezept} />;
  if (ansicht === "detail" && aktivRezept) return <DetailAnsicht rezept={aktivRezept} grundrezepte={grundrezepte} alle={rezepte} onBack={() => setAnsicht("liste")} onBearbeiten={() => setAnsicht("neu")} onLoeschen={() => loeschen(aktivRezept.id)} onNeueVersion={() => neueVersion(aktivRezept)} onToggleFav={() => toggleFav(aktivRezept.id)} onTestHinzufuegen={() => setAnsicht("test")} onNotizSpeichern={(n) => notizSpeichern(aktivRezept.id, n)}
    onTestBearbeiten={(testId) => { setBearbeitenTestId(testId); setAnsicht("test"); }}
    onTestLoeschen={(testId) => update(rezepte.map(r => r.id === aktivRezept.id ? { ...r, testProtokolle: r.testProtokolle.filter(t => t.id !== testId) } : r))}
    onFotoLoeschen={(testId, fotoIdx) => update(rezepte.map(r => r.id === aktivRezept.id ? { ...r, testProtokolle: r.testProtokolle.map(t => t.id !== testId ? t : { ...t, fotos: (t.fotos || []).filter((_, i) => i !== fotoIdx) }) } : r))}
  />;
  if (ansicht === "test" && aktivRezept) return <TestAnsicht rezept={aktivRezept} bearbeitenTest={aktivRezept.testProtokolle.find(t => t.id === bearbeitenTestId) || null} onSave={(t) => testSpeichern(aktivRezept.id, t)} onBack={() => { setBearbeitenTestId(null); setAnsicht("detail"); }} />;

  // ─── Liste ──────────────────────────────────────────────────────────────────
  return (
    <main className="px-4 py-6 pb-28">
      {speicherFehler && (
        <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ backgroundColor: "#2a0a0a", border: "1px solid #ef4444", color: "#ef4444" }}>
          ⚠️ Speichern fehlgeschlagen — Gerätespeicher voll. Lösche alte Fotos um Platz zu schaffen.
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">🧪 Rezept-Werkstatt</h1>
          <p className="text-xs mt-0.5" style={{ color: "#555" }}>Entwickle & versioniere deine Keto-Rezepte</p>
        </div>
        <button onClick={() => { setAktivId(null); setAnsicht("neu"); }}
          className="px-4 py-2 rounded-xl text-sm font-bold text-black"
          style={{ backgroundColor: "#22c55e" }}>+ Neu</button>
      </div>

      {/* Suche + Filter */}
      <input value={suche} onChange={e => setSuche(e.target.value)}
        placeholder="🔍 Rezept suchen…"
        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none mb-3"
        style={{ backgroundColor: "#1a1a1a", color: "#fff", border: "1px solid #333" }} />
      <div className="flex gap-2 mb-5">
        {(["alle", "grundrezept", "rezept"] as const).map(t => (
          <button key={t} onClick={() => setFilterTyp(t)}
            className="flex-1 py-2 rounded-xl text-xs font-medium"
            style={{ backgroundColor: filterTyp === t ? "#22c55e" : "#1a1a1a", color: filterTyp === t ? "#000" : "#666" }}>
            {t === "alle" ? "Alle" : t === "grundrezept" ? "🧱 Basis" : "🍽️ Rezepte"}
          </button>
        ))}
      </div>

      {Object.keys(gruppen).length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🧪</div>
          <p className="font-medium mb-2">Noch keine Rezepte</p>
          <p className="text-sm mb-6" style={{ color: "#555" }}>Starte mit einem Grundrezept wie „Tanjas Keto-Mehl" oder direkt mit einem Rezept.</p>
          <button onClick={() => { setAktivId(null); setAnsicht("neu"); }}
            className="px-6 py-3 rounded-xl text-sm font-bold text-black"
            style={{ backgroundColor: "#22c55e" }}>Erstes Rezept erstellen</button>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(gruppen).map(([basis, gruppe]) => {
            const aktuell = gruppe.sort((a, b) => b.version.localeCompare(a.version))[0];
            const g = berechneGesamt(aktuell.zutaten);
            const pp = { kh: Math.round(g.kh / Math.max(aktuell.portionen, 1) * 10) / 10, nettoKh: Math.max(0, Math.round((g.kh - g.ballaststoffe) / Math.max(aktuell.portionen, 1) * 10) / 10), kcal: Math.round(g.kcal / Math.max(aktuell.portionen, 1)) };
            const sc = ketoScore(pp.nettoKh);
            return (
              <div key={basis} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
                {/* Aktuelle Version */}
                <button onClick={() => oeffneDetail(aktuell.id)} className="w-full p-4 text-left">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: aktuell.typ === "grundrezept" ? "#22c55e22" : "#3b82f622", color: aktuell.typ === "grundrezept" ? "#22c55e" : "#3b82f6" }}>
                          {aktuell.typ === "grundrezept" ? "🧱 Basis" : "🍽️ Rezept"}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: aktuell.status === "getestet" ? "#22c55e22" : "#f59e0b22", color: aktuell.status === "getestet" ? "#22c55e" : "#f59e0b" }}>
                          {aktuell.status === "getestet" ? "✓ Getestet" : "⚗️ Entwicklung"}
                        </span>
                      </div>
                      <h3 className="font-bold">{aktuell.name}</h3>
                      <p className="text-xs mt-0.5" style={{ color: "#555" }}>{aktuell.kategorie} · v{aktuell.version} · {aktuell.erstellt}</p>
                    </div>
                    <div className="text-right ml-3">
                      {aktuell.typ !== "grundrezept" && <div className="text-sm font-bold" style={{ color: sc.farbe }}>{pp.nettoKh}g Netto-KH</div>}
                      {aktuell.typ === "grundrezept" && aktuell.ergibtGramm && <div className="text-sm font-bold" style={{ color: "#22c55e" }}>{aktuell.ergibtGramm}g</div>}
                      <div className="text-xs" style={{ color: "#555" }}>{aktuell.testProtokolle.length} Tests</div>
                    </div>
                  </div>
                </button>
                {/* Ältere Versionen */}
                {gruppe.length > 1 && (
                  <div className="px-4 pb-3 flex gap-2 flex-wrap" style={{ borderTop: "1px solid #222" }}>
                    <span className="text-xs mt-2" style={{ color: "#444" }}>Ältere Versionen:</span>
                    {gruppe.slice(1).map(v => (
                      <button key={v.id} onClick={() => oeffneDetail(v.id)}
                        className="text-xs px-2 py-1 rounded-lg mt-2"
                        style={{ backgroundColor: "#111", color: "#666" }}>v{v.version}</button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

// ─── Formular ─────────────────────────────────────────────────────────────────

function FormAnsicht({ rezepte, grundrezepte, onSave, onBack, bearbeiten }: {
  rezepte: WerkstattRezept[];
  grundrezepte: WerkstattRezept[];
  onSave: (r: WerkstattRezept) => void;
  onBack: () => void;
  bearbeiten: WerkstattRezept | null;
}) {
  const [typ, setTyp] = useState<RezeptTyp>(bearbeiten?.typ || "rezept");
  const [name, setName] = useState(bearbeiten?.name || "");
  const [version, setVersion] = useState(bearbeiten?.version || "1.0");
  const [beschreibung, setBeschreibung] = useState(bearbeiten?.beschreibung || "");
  const [kategorie, setKategorie] = useState(bearbeiten?.kategorie || "Mittagessen");
  const [portionen, setPortionen] = useState(bearbeiten?.portionen || 2);
  const [zeit, setZeit] = useState(bearbeiten?.zeit || "30 Min");
  const [schwierigkeit, setSchwierigkeit] = useState(bearbeiten?.schwierigkeit || "Einfach");
  const [zutaten, setZutaten] = useState<Zutat[]>(bearbeiten?.zutaten || [neueZutat()]);
  const [zubereitung, setZubereitung] = useState<string[]>(bearbeiten?.zubereitung || ["", ""]);
  const [ergibtGramm, setErgibtGramm] = useState(bearbeiten?.ergibtGramm || 0);
  const [chargennummer, setChargennummer] = useState(bearbeiten?.chargennummer || "");
  const [haltbarkeit, setHaltbarkeit] = useState(bearbeiten?.haltbarkeit || "");
  const [lagerung, setLagerung] = useState(bearbeiten?.lagerung || "");
  const [verwendetGrundrezeptId, setVerwendetGrundrezeptId] = useState(bearbeiten?.verwendetGrundrezeptId || "");
  const [portionenAnzeige, setPortionenAnzeige] = useState(bearbeiten?.portionen || 2);

  // Wenn Grundrezept verknüpft wird → Nährwerte berechnen und als Zutat eintragen
  function grundrezeptVerknuepfen(grId: string) {
    setVerwendetGrundrezeptId(grId);
    if (!grId) {
      setZutaten(prev => prev.filter(z => !z.id.startsWith("gr_")));
      return;
    }
    const gr = grundrezepte.find(g => g.id === grId);
    if (!gr) return;

    // Nährwerte pro 100g berechnen (aus Gesamtmenge) oder direkt aus Zutaten schätzen
    const g = berechneGesamt(gr.zutaten);
    let n100 = { kcal: 0, kh: 0, eiweiss: 0, fett: 0, ballaststoffe: 0 };
    if (gr.ergibtGramm && gr.ergibtGramm > 0) {
      n100 = {
        kcal: Math.round(g.kcal / gr.ergibtGramm * 100),
        kh: Math.round(g.kh / gr.ergibtGramm * 100 * 10) / 10,
        eiweiss: Math.round(g.eiweiss / gr.ergibtGramm * 100 * 10) / 10,
        fett: Math.round(g.fett / gr.ergibtGramm * 100 * 10) / 10,
        ballaststoffe: Math.round(g.ballaststoffe / gr.ergibtGramm * 100 * 10) / 10,
      };
    }

    const grZutat: Zutat = {
      id: `gr_${gr.id}`,
      name: `🧱 ${gr.name} (v${gr.version})`,
      menge: 100,
      einheit: "g",
      kcalPro100: n100.kcal,
      khPro100: n100.kh,
      eiweissPro100: n100.eiweiss,
      fettPro100: n100.fett,
      ballaststoffePro100: n100.ballaststoffe,
    };
    setZutaten(prev => {
      const ohneGR = prev.filter(z => !z.id.startsWith("gr_"));
      return [grZutat, ...ohneGR];
    });
  }

  const gesamt = berechneGesamt(zutaten);
  // gesamt = Gesamtmenge für alle portionen → pro Portion = gesamt / portionen → für portionenAnzeige = * portionenAnzeige
  const pp = {
    kcal: Math.round(gesamt.kcal / Math.max(portionen, 1) * portionenAnzeige),
    kh: Math.round(gesamt.kh / Math.max(portionen, 1) * portionenAnzeige * 10) / 10,
    eiweiss: Math.round(gesamt.eiweiss / Math.max(portionen, 1) * portionenAnzeige * 10) / 10,
    fett: Math.round(gesamt.fett / Math.max(portionen, 1) * portionenAnzeige * 10) / 10,
    ballaststoffe: Math.round(gesamt.ballaststoffe / Math.max(portionen, 1) * portionenAnzeige * 100) / 100,
  };
  const ppNettoKh = Math.max(0, Math.round((pp.kh - pp.ballaststoffe) * 100) / 100);
  const score = ketoScore(ppNettoKh);
  // Nährwerte pro 100g für Grundrezept
  const gr100 = ergibtGramm > 0 ? {
    kcal: Math.round(gesamt.kcal / ergibtGramm * 100),
    kh: Math.round(gesamt.kh / ergibtGramm * 100 * 10) / 10,
    eiweiss: Math.round(gesamt.eiweiss / ergibtGramm * 100 * 10) / 10,
    fett: Math.round(gesamt.fett / ergibtGramm * 100 * 10) / 10,
    ballaststoffe: Math.round(gesamt.ballaststoffe / ergibtGramm * 100 * 10) / 10,
  } : null;

  const optimierungen = zutaten
    .map(z => { const k = Object.keys(KETO_TIPPS).find(key => z.name.toLowerCase().includes(key)); return k ? { zutat: z.name, ersatz: KETO_TIPPS[k] } : null; })
    .filter(Boolean);

  const zutatAendern = useCallback((id: string, feld: keyof Zutat, wert: string | number) => {
    setZutaten(prev => prev.map(z => z.id === id ? { ...z, [feld]: wert } : z));
  }, []);

  function speichern() {
    if (!name.trim()) return;
    const r: WerkstattRezept = {
      id: bearbeiten?.id || Math.random().toString(36).slice(2),
      typ, name: name.trim(), version, status: bearbeiten?.status || "entwicklung",
      beschreibung, kategorie, portionen, zeit, schwierigkeit,
      zutaten, zubereitung: zubereitung.filter(s => s.trim()),
      entwicklungsnotizen: bearbeiten?.entwicklungsnotizen || "",
      ergibtGramm: typ === "grundrezept" ? ergibtGramm : undefined,
      chargennummer: typ === "grundrezept" ? chargennummer : undefined,
      haltbarkeit: typ === "grundrezept" ? haltbarkeit : undefined,
      lagerung: typ === "grundrezept" ? lagerung : undefined,
      verwendetGrundrezeptId: typ === "rezept" ? verwendetGrundrezeptId : undefined,
      testProtokolle: bearbeiten?.testProtokolle || [],
      erstellt: bearbeiten?.erstellt || new Date().toLocaleDateString("de-DE"),
      favorit: bearbeiten?.favorit || false,
    };
    onSave(r);
  }

  return (
    <main className="px-4 py-6 pb-28">
      <button onClick={onBack} className="flex items-center gap-2 text-sm mb-4" style={{ color: "#22c55e" }}>← Zurück</button>
      <h1 className="text-xl font-bold mb-5">{bearbeiten ? "Rezept bearbeiten" : "Neues Rezept"}</h1>

      {/* Typ-Auswahl */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>Rezepttyp</h2>
        <div className="grid grid-cols-2 gap-2">
          {([["grundrezept", "🧱 Grundrezept", "Mehl, Gewürze, Basis-Mischungen"], ["rezept", "🍽️ Rezept", "Mahlzeiten, Backwaren, Gerichte"]] as const).map(([t, label, desc]) => (
            <button key={t} onClick={() => setTyp(t)}
              className="rounded-xl p-3 text-left"
              style={{ backgroundColor: typ === t ? "#22c55e22" : "#111", border: `1px solid ${typ === t ? "#22c55e" : "#222"}` }}>
              <div className="font-bold text-sm">{label}</div>
              <div className="text-xs mt-0.5" style={{ color: "#666" }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Grundinfos */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>📝 Grundinfos</h2>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name *"
          className="w-full rounded-xl px-4 py-3 text-sm mb-2 outline-none"
          style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }} />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input value={version} onChange={e => setVersion(e.target.value)} placeholder="Version 1.0"
            className="rounded-xl px-3 py-3 text-sm outline-none"
            style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }} />
          <select value={kategorie} onChange={e => setKategorie(e.target.value)}
            className="rounded-xl px-3 py-3 text-sm outline-none"
            style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }}>
            {KATEGORIEN.map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
        <textarea value={beschreibung} onChange={e => setBeschreibung(e.target.value)}
          placeholder="Kurzbeschreibung" rows={2}
          className="w-full rounded-xl px-4 py-3 text-sm mb-2 outline-none resize-none"
          style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }} />
        {/* Zeit + Schwierigkeit nur für Rezept */}
        {typ === "rezept" && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input value={zeit} onChange={e => setZeit(e.target.value)} placeholder="Zeit z.B. 30 Min"
              className="rounded-xl px-3 py-3 text-sm outline-none"
              style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }} />
            <select value={schwierigkeit} onChange={e => setSchwierigkeit(e.target.value)}
              className="rounded-xl px-3 py-3 text-sm outline-none"
              style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }}>
              {SCHWIERIGKEITEN.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        )}
        {/* Portionen nur für Rezept */}
        {typ === "rezept" && (
          <div className="flex items-center justify-between mt-2 rounded-xl px-3 py-2.5" style={{ backgroundColor: "#111", border: "1px solid #333" }}>
            <span className="text-sm" style={{ color: "#888" }}>Portionen</span>
            <div className="flex items-center gap-3">
              <button onClick={() => { setPortionen(p => Math.max(1, p - 1)); setPortionenAnzeige(p => Math.max(1, p - 1)); }}
                className="w-7 h-7 rounded-full font-bold text-black flex items-center justify-center"
                style={{ backgroundColor: "#22c55e" }}>−</button>
              <span className="font-bold w-4 text-center">{portionen}</span>
              <button onClick={() => { setPortionen(p => p + 1); setPortionenAnzeige(p => p + 1); }}
                className="w-7 h-7 rounded-full font-bold text-black flex items-center justify-center"
                style={{ backgroundColor: "#22c55e" }}>+</button>
            </div>
          </div>
        )}
        {/* Grundrezept-Felder */}
        {typ === "grundrezept" && (
          <div className="mt-2 space-y-2">
            <input type="number" value={ergibtGramm || ""} onChange={e => setErgibtGramm(Number(e.target.value))}
              placeholder="Ergibt … g gesamt (z.B. 1500)"
              className="w-full rounded-xl px-3 py-3 text-sm outline-none"
              style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }} />
            <input value={chargennummer} onChange={e => setChargennummer(e.target.value)}
              placeholder="Chargennummer z.B. Charge #3"
              className="w-full rounded-xl px-3 py-3 text-sm outline-none"
              style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }} />
            <input value={haltbarkeit} onChange={e => setHaltbarkeit(e.target.value)}
              placeholder="Haltbarkeit z.B. 3 Monate"
              className="w-full rounded-xl px-3 py-3 text-sm outline-none"
              style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }} />
            <input value={lagerung} onChange={e => setLagerung(e.target.value)}
              placeholder="Lagerort z.B. kühl & trocken"
              className="w-full rounded-xl px-3 py-3 text-sm outline-none"
              style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }} />
          </div>
        )}
        {/* Grundrezept-Verknüpfung */}
        {typ === "rezept" && grundrezepte.length > 0 && (
          <div className="mt-2">
            <select value={verwendetGrundrezeptId} onChange={e => grundrezeptVerknuepfen(e.target.value)}
              className="w-full rounded-xl px-3 py-3 text-sm outline-none"
              style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }}>
              <option value="">🧱 Kein Grundrezept verknüpft</option>
              {grundrezepte.map(g => <option key={g.id} value={g.id}>🧱 {g.name} v{g.version}</option>)}
            </select>
            {verwendetGrundrezeptId && (() => {
              const gr = grundrezepte.find(g => g.id === verwendetGrundrezeptId);
              if (!gr?.ergibtGramm) return <p className="text-[10px] mt-1.5" style={{ color: "#f59e0b" }}>⚠️ Gesamtmenge im Grundrezept fehlt — Nährwerte bitte manuell eintragen</p>;
              return <p className="text-[10px] mt-1.5" style={{ color: "#22c55e" }}>✅ Nährwerte automatisch übernommen — nur Gramm-Menge anpassen</p>;
            })()}
          </div>
        )}
      </div>

      {/* Live-Makros für Rezept */}
      {typ === "rezept" && (
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#111", border: `1px solid ${score.farbe}44` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold" style={{ color: score.farbe }}>{score.emoji} {score.label}</span>
            <span className="text-xs" style={{ color: "#555" }}>pro Portion</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mb-1">
            {[{ l: "kcal", v: pp.kcal, u: "", f: "#fff" }, { l: "Eiweiß", v: pp.eiweiss, u: "g", f: "#3b82f6" }, { l: "Fett", v: pp.fett, u: "g", f: "#f59e0b" }].map(({ l, v, u, f }) => (
              <div key={l} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="text-[9px] mb-0.5" style={{ color: "#555" }}>{l}</div>
                <div className="text-xs font-bold" style={{ color: f }}>{v}{u}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {[{ l: "KH gesamt", v: pp.kh, u: "g", f: "#f97316" }, { l: "Netto-KH", v: ppNettoKh, u: "g", f: score.farbe }, { l: "Ballaststoffe", v: pp.ballaststoffe, u: "g", f: "#22c55e" }].map(({ l, v, u, f }) => (
              <div key={l} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="text-[9px] mb-0.5" style={{ color: "#555" }}>{l}</div>
                <div className="text-xs font-bold" style={{ color: f }}>{v}{u}</div>
              </div>
            ))}
          </div>
          {portionen > 1 && (
            <input type="range" min={1} max={portionen * 3} value={portionenAnzeige}
              onChange={e => setPortionenAnzeige(Number(e.target.value))}
              className="w-full accent-green-500" />
          )}
        </div>
      )}
      {/* Nährwerte pro 100g für Grundrezept */}
      {typ === "grundrezept" && (
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#111", border: "1px solid #22c55e33" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold" style={{ color: "#22c55e" }}>⚡ Nährwerte</span>
            <span className="text-xs" style={{ color: "#555" }}>
              {gr100 ? "pro 100g Mischung" : "Gesamtmenge eingeben für pro-100g-Werte"}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {[
              { l: "kcal", v: gr100 ? gr100.kcal : Math.round(gesamt.kcal), u: "", f: "#fff" },
              { l: "Eiw.", v: gr100 ? gr100.eiweiss : Math.round(gesamt.eiweiss * 10) / 10, u: "g", f: "#3b82f6" },
              { l: "Fett", v: gr100 ? gr100.fett : Math.round(gesamt.fett * 10) / 10, u: "g", f: "#f59e0b" },
              { l: "Netto-KH", v: gr100 ? Math.max(0, Math.round((gr100.kh - gr100.ballaststoffe) * 10) / 10) : Math.max(0, Math.round((gesamt.kh - gesamt.ballaststoffe) * 10) / 10), u: "g", f: "#ef4444" },
              { l: "Bst.", v: gr100 ? gr100.ballaststoffe : Math.round(gesamt.ballaststoffe * 10) / 10, u: "g", f: "#22c55e" },
            ].map(({ l, v, u, f }) => (
              <div key={l} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="text-[9px] mb-0.5" style={{ color: "#555" }}>{l}</div>
                <div className="text-xs font-bold" style={{ color: f }}>{v}{u}</div>
              </div>
            ))}
          </div>
          {!gr100 && ergibtGramm === 0 && (
            <p className="text-[10px] text-center" style={{ color: "#444" }}>
              ↑ Gib oben die Gesamtmenge in g ein → dann siehst du die Werte pro 100g
            </p>
          )}
          {gr100 && (
            <p className="text-[10px] text-center mt-1" style={{ color: "#555" }}>
              Gesamt: {Math.round(gesamt.kcal)} kcal · {ergibtGramm}g Mischung
            </p>
          )}
        </div>
      )}

      {/* Keto-Optimierer */}
      {optimierungen.length > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a", border: "1px solid #f59e0b33" }}>
          <h2 className="text-sm font-bold mb-2" style={{ color: "#f59e0b" }}>💡 Keto-Optimierer</h2>
          {optimierungen.map((h, i) => h && (
            <p key={i} className="text-xs mb-1" style={{ color: "#aaa" }}>
              <span style={{ color: "#f59e0b" }}>„{h.zutat}"</span> → <span style={{ color: "#22c55e" }}>{h.ersatz}</span>
            </p>
          ))}
        </div>
      )}

      {/* Zutaten */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>🛒 Zutaten</h2>
        <div className="space-y-3">
          {zutaten.map((z, idx) => (
            <ZutatEingabe key={z.id} zutat={z} idx={idx} zutatenCount={zutaten.length}
              onChange={(feld, wert) => zutatAendern(z.id, feld, wert)}
              onDelete={() => setZutaten(p => p.filter(x => x.id !== z.id))} />
          ))}
        </div>
        <button onClick={() => setZutaten(p => [...p, neueZutat()])}
          className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium"
          style={{ backgroundColor: "#111", color: "#22c55e", border: "1px dashed #22c55e44" }}>
          + Zutat hinzufügen
        </button>
      </div>

      {/* Zubereitung */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>👩‍🍳 Zubereitung</h2>
        <div className="space-y-2">
          {zubereitung.map((s, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-2"
                style={{ backgroundColor: "#22c55e" }}>{i + 1}</span>
              <textarea value={s} onChange={e => setZubereitung(p => p.map((x, idx) => idx === i ? e.target.value : x))}
                placeholder={`Schritt ${i + 1}…`} rows={2}
                className="flex-1 rounded-xl px-3 py-2 text-sm outline-none resize-none"
                style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #2a2a2a" }} />
              {zubereitung.length > 1 && (
                <button onClick={() => setZubereitung(p => p.filter((_, idx) => idx !== i))}
                  className="px-2 py-2 rounded-lg text-xs mt-2" style={{ backgroundColor: "#2a0a0a", color: "#ef4444" }}>✕</button>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => setZubereitung(p => [...p, ""])}
          className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium"
          style={{ backgroundColor: "#111", color: "#22c55e", border: "1px dashed #22c55e44" }}>
          + Schritt hinzufügen
        </button>
      </div>

      <button onClick={speichern} disabled={!name.trim()}
        className="w-full py-4 rounded-2xl font-bold text-base"
        style={{ backgroundColor: name.trim() ? "#22c55e" : "#333", color: name.trim() ? "#000" : "#666" }}>
        {bearbeiten ? "✅ Änderungen speichern" : "✅ Rezept speichern"}
      </button>
    </main>
  );
}

// ─── Detail-Ansicht ───────────────────────────────────────────────────────────

// ─── Export: In Rezepte / Wochenplan ─────────────────────────────────────────

const WOCHENTAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const MAHLZEIT_SLOTS = [
  { key: "fruehstueck", label: "Frühstück" },
  { key: "mittagessen", label: "Mittagessen" },
  { key: "abendessen", label: "Abendessen" },
  { key: "snack", label: "Snack" },
] as const;

function ExportAktionen({ rezept }: { rezept: WerkstattRezept }) {
  const [toast, setToast] = useState<string | null>(null);
  const [wochenplanOffen, setWochenplanOffen] = useState(false);
  const [gewTag, setGewTag] = useState("Montag");
  const [gewSlot, setGewSlot] = useState<typeof MAHLZEIT_SLOTS[number]["key"]>("mittagessen");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function inRezepteKopieren() {
    try {
      const g = berechneGesamt(rezept.zutaten);
      const port = Math.max(rezept.portionen, 1);
      const neues = {
        id: `werkstatt_${rezept.id}`,
        name: rezept.name,
        kategorie: (["Frühstück", "Mittagessen", "Abendessen", "Snack", "Dessert", "Salat"].includes(rezept.kategorie)
          ? rezept.kategorie : "Mittagessen") as string,
        kcal: Math.round(g.kcal / port),
        kh: Math.round(g.kh / port * 10) / 10,
        eiweiss: Math.round(g.eiweiss / port * 10) / 10,
        fett: Math.round(g.fett / port * 10) / 10,
        zeit: rezept.zeit || "30 Min",
        schwierigkeit: rezept.schwierigkeit || "Einfach",
        bild: "🧪",
        tags: ["werkstatt", "eigenes-rezept"],
        zutaten: rezept.zutaten.map(z => `${z.menge} ${z.einheit} ${z.name}`),
        zubereitung: rezept.zubereitung,
      };
      const bestehende = JSON.parse(localStorage.getItem("ketome_custom_rezepte") || "[]");
      const ohneAlt = bestehende.filter((r: { id: string }) => r.id !== neues.id);
      localStorage.setItem("ketome_custom_rezepte", JSON.stringify([...ohneAlt, neues]));
      showToast("✅ In deinen Rezepten gespeichert!");
    } catch { showToast("❌ Fehler beim Kopieren"); }
  }

  function inWochenplanEintragen() {
    try {
      const plan = JSON.parse(localStorage.getItem("ketome_mein_plan") || "{}");
      if (!plan[gewTag]) plan[gewTag] = { fruehstueck: { rezeptId: null }, mittagessen: { rezeptId: null }, abendessen: { rezeptId: null }, snack: { rezeptId: null } };
      plan[gewTag][gewSlot] = { rezeptId: `werkstatt_${rezept.id}` };
      localStorage.setItem("ketome_mein_plan", JSON.stringify(plan));

      // Eigenes Rezept auch in ketome_custom_rezepte sichern damit Wochenplan es findet
      inRezepteKopierenStill();

      setWochenplanOffen(false);
      showToast(`✅ ${rezept.name} am ${gewTag} als ${MAHLZEIT_SLOTS.find(s => s.key === gewSlot)?.label} eingetragen`);
    } catch { showToast("❌ Fehler"); }
  }

  function inRezepteKopierenStill() {
    const g = berechneGesamt(rezept.zutaten);
    const port = Math.max(rezept.portionen, 1);
    const neues = {
      id: `werkstatt_${rezept.id}`,
      name: rezept.name,
      kategorie: rezept.kategorie,
      kcal: Math.round(g.kcal / port),
      kh: Math.round(g.kh / port * 10) / 10,
      eiweiss: Math.round(g.eiweiss / port * 10) / 10,
      fett: Math.round(g.fett / port * 10) / 10,
      zeit: rezept.zeit || "30 Min",
      schwierigkeit: rezept.schwierigkeit || "Einfach",
      bild: "🧪",
      tags: ["werkstatt", "eigenes-rezept"],
      zutaten: rezept.zutaten.map(z => `${z.menge} ${z.einheit} ${z.name}`),
      zubereitung: rezept.zubereitung,
    };
    const bestehende = JSON.parse(localStorage.getItem("ketome_custom_rezepte") || "[]");
    const ohneAlt = bestehende.filter((r: { id: string }) => r.id !== neues.id);
    localStorage.setItem("ketome_custom_rezepte", JSON.stringify([...ohneAlt, neues]));
  }

  return (
    <div className="mb-4">
      {toast && (
        <div className="rounded-xl px-4 py-3 mb-3 text-sm text-center font-medium"
          style={{ backgroundColor: toast.startsWith("✅") ? "#0a2a0a" : "#2a0a0a", color: toast.startsWith("✅") ? "#22c55e" : "#ef4444", border: `1px solid ${toast.startsWith("✅") ? "#22c55e33" : "#ef444433"}` }}>
          {toast}
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <button onClick={() => {
          try {
            const g = berechneGesamt(rezept.zutaten);
            const port = Math.max(rezept.portionen, 1);
            const alle = JSON.parse(localStorage.getItem("ketome_naehrwerte") || "[]");
            alle.push({
              id: Date.now().toString(),
              datum: new Date().toLocaleDateString("de-DE"),
              name: rezept.name,
              kcal: Math.round(g.kcal / port),
              kh: Math.round(g.kh / port * 10) / 10,
              eiweiss: Math.round(g.eiweiss / port * 10) / 10,
              fett: Math.round(g.fett / port * 10) / 10,
              ballaststoffe: Math.round(g.ballaststoffe / port * 10) / 10,
            });
            localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
            window.dispatchEvent(new Event("ketome-daten-gespeichert"));
            showToast("✅ Als heute gegessen eingetragen!");
          } catch { showToast("❌ Fehler"); }
        }}
          className="py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-1"
          style={{ backgroundColor: "#0d2018", border: "1px solid #22c55e44", color: "#22c55e" }}>
          🍽️ Heute
        </button>
        <button onClick={inRezepteKopieren}
          className="py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1"
          style={{ backgroundColor: "#1a0a30", border: "1px solid #8b5cf644", color: "#a78bfa" }}>
          ⭐ Zu meinen Rezepten
        </button>
        <button onClick={() => setWochenplanOffen(p => !p)}
          className="py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-1"
          style={{ backgroundColor: "#0d1520", border: "1px solid #3b82f644", color: "#3b82f6" }}>
          📅 Plan
        </button>
      </div>
      {wochenplanOffen && (
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a", border: "1px solid #22c55e33" }}>
          <p className="text-sm font-medium mb-3" style={{ color: "#22c55e" }}>📅 In Wochenplan eintragen</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-xs mb-1" style={{ color: "#555" }}>Tag</p>
              <select value={gewTag} onChange={e => setGewTag(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }}>
                {WOCHENTAGE.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: "#555" }}>Mahlzeit</p>
              <select value={gewSlot} onChange={e => setGewSlot(e.target.value as typeof MAHLZEIT_SLOTS[number]["key"])}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }}>
                {MAHLZEIT_SLOTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <button onClick={inWochenplanEintragen}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-black"
            style={{ backgroundColor: "#22c55e" }}>
            Eintragen
          </button>
        </div>
      )}
    </div>
  );
}

function TestFotos({ fotos, onLoeschen }: { fotos: string[]; onLoeschen?: (idx: number) => void }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [loeschModus, setLoeschModus] = useState(false);
  if (!fotos || fotos.length === 0) return null;
  return (
    <>
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px]" style={{ color: "#555" }}>{fotos.length} Foto{fotos.length !== 1 ? "s" : ""}</span>
          {onLoeschen && (
            <button type="button" onClick={() => setLoeschModus(p => !p)}
              className="text-[10px] px-2 py-0.5 rounded"
              style={{ backgroundColor: loeschModus ? "#ef444422" : "#1a1a1a", color: loeschModus ? "#ef4444" : "#555" }}>
              {loeschModus ? "✓ Fertig" : "✏️ Bearbeiten"}
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {fotos.map((f, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
              <img src={f} alt={`Testfoto ${i + 1}`} className="w-full h-full object-cover cursor-pointer"
                onClick={() => !loeschModus && setLightbox(f)} />
              {loeschModus && onLoeschen && (
                <button type="button" onClick={() => onLoeschen(i)}
                  className="absolute inset-0 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: "#000a" }}>🗑</button>
              )}
            </div>
          ))}
        </div>
      </div>
      {lightbox && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ backgroundColor: "#000d" }} onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Foto" className="max-w-full max-h-full rounded-xl object-contain" />
          <button className="absolute top-4 right-4 text-white text-2xl font-bold">✕</button>
        </div>
      )}
    </>
  );
}

function DetailAnsicht({ rezept, grundrezepte, alle, onBack, onBearbeiten, onLoeschen, onNeueVersion, onToggleFav, onTestHinzufuegen, onNotizSpeichern, onTestBearbeiten, onTestLoeschen, onFotoLoeschen }: {
  rezept: WerkstattRezept;
  grundrezepte: WerkstattRezept[];
  alle: WerkstattRezept[];
  onBack: () => void;
  onBearbeiten: () => void;
  onLoeschen: () => void;
  onNeueVersion: () => void;
  onToggleFav: () => void;
  onTestHinzufuegen: () => void;
  onNotizSpeichern: (n: string) => void;
  onTestBearbeiten: (testId: string) => void;
  onTestLoeschen: (testId: string) => void;
  onFotoLoeschen: (testId: string, fotoIdx: number) => void;
}) {
  const [portionen, setPortionen] = useState(rezept.portionen);
  const [notiz, setNotiz] = useState(rezept.entwicklungsnotizen);
  const [notizBearbeiten, setNotizBearbeiten] = useState(false);

  const gesamt = berechneGesamt(rezept.zutaten);
  const df = portionen / Math.max(rezept.portionen, 1);
  const pp = {
    kcal: Math.round(gesamt.kcal * df),
    kh: Math.round(gesamt.kh * df * 10) / 10,
    eiweiss: Math.round(gesamt.eiweiss * df * 10) / 10,
    fett: Math.round(gesamt.fett * df * 10) / 10,
    ballaststoffe: Math.round(gesamt.ballaststoffe * df * 100) / 100,
  };
  const ppNettoKh = Math.max(0, Math.round((pp.kh - pp.ballaststoffe) * 100) / 100);
  const score = ketoScore(ppNettoKh);
  const verwendetGR = grundrezepte.find(g => g.id === rezept.verwendetGrundrezeptId);
  const verwendetIn = alle.filter(r => r.verwendetGrundrezeptId === rezept.id);
  const letzterTest = rezept.testProtokolle[rezept.testProtokolle.length - 1];

  return (
    <main className="px-4 py-6 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onBack} className="text-sm" style={{ color: "#22c55e" }}>← Zurück</button>
        <div className="flex gap-3 items-center">
          <button onClick={onToggleFav} className="text-xl">{rezept.favorit ? "⭐" : "☆"}</button>
          <button onClick={onBearbeiten} className="text-xl">✏️</button>
        </div>
      </div>

      <div className="flex items-start gap-3 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: rezept.typ === "grundrezept" ? "#22c55e22" : "#3b82f622", color: rezept.typ === "grundrezept" ? "#22c55e" : "#3b82f6" }}>
              {rezept.typ === "grundrezept" ? "🧱 Grundrezept" : "🍽️ Rezept"}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: rezept.status === "getestet" ? "#22c55e22" : "#f59e0b22", color: rezept.status === "getestet" ? "#22c55e" : "#f59e0b" }}>
              {rezept.status === "getestet" ? "✓ Getestet" : "⚗️ In Entwicklung"}
            </span>
          </div>
          <h1 className="text-xl font-bold">{rezept.name}</h1>
          <p className="text-xs mt-0.5" style={{ color: "#555" }}>Version {rezept.version} · {rezept.kategorie} · {rezept.erstellt}</p>
        </div>
      </div>
      {rezept.beschreibung && <p className="text-sm mb-4" style={{ color: "#aaa" }}>{rezept.beschreibung}</p>}

      {/* Grundrezept-Infos */}
      {rezept.typ === "grundrezept" && (
        <>
          {(rezept.ergibtGramm || rezept.chargennummer || rezept.haltbarkeit || rezept.lagerung) && (
            <div className="rounded-2xl p-4 mb-3" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="grid grid-cols-2 gap-3">
                {rezept.ergibtGramm ? <div><div className="text-xs mb-0.5" style={{ color: "#555" }}>Gesamtmenge</div><div className="font-bold" style={{ color: "#22c55e" }}>{rezept.ergibtGramm} g</div></div> : null}
                {rezept.chargennummer ? <div><div className="text-xs mb-0.5" style={{ color: "#555" }}>Charge</div><div className="font-bold">{rezept.chargennummer}</div></div> : null}
                {rezept.haltbarkeit ? <div><div className="text-xs mb-0.5" style={{ color: "#555" }}>Haltbarkeit</div><div className="font-bold">{rezept.haltbarkeit}</div></div> : null}
                {rezept.lagerung ? <div><div className="text-xs mb-0.5" style={{ color: "#555" }}>Lagerort</div><div className="font-bold">{rezept.lagerung}</div></div> : null}
              </div>
            </div>
          )}
          {/* Nährwerte pro 100g */}
          {rezept.ergibtGramm && rezept.ergibtGramm > 0 && (() => {
            const g = berechneGesamt(rezept.zutaten);
            const p100 = {
              kcal: Math.round(g.kcal / rezept.ergibtGramm * 100),
              kh: Math.round(g.kh / rezept.ergibtGramm * 100 * 10) / 10,
              eiweiss: Math.round(g.eiweiss / rezept.ergibtGramm * 100 * 10) / 10,
              fett: Math.round(g.fett / rezept.ergibtGramm * 100 * 10) / 10,
              ballaststoffe: Math.round(g.ballaststoffe / rezept.ergibtGramm * 100 * 10) / 10,
            };
            return (
              <div className="rounded-2xl p-3 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
                <p className="text-xs mb-2 font-medium" style={{ color: "#22c55e" }}>⚡ Nährwerte pro 100g</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {[{ l: "kcal", v: p100.kcal, u: "", f: "#fff" }, { l: "Eiw.", v: p100.eiweiss, u: "g", f: "#3b82f6" }, { l: "Fett", v: p100.fett, u: "g", f: "#f59e0b" }, { l: "Netto-KH", v: Math.max(0, Math.round((p100.kh - p100.ballaststoffe) * 10) / 10), u: "g", f: "#ef4444" }, { l: "Bst.", v: p100.ballaststoffe, u: "g", f: "#22c55e" }].map(({ l, v, u, f }) => (
                    <div key={l} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#111" }}>
                      <div className="text-[9px] mb-0.5" style={{ color: "#555" }}>{l}</div>
                      <div className="text-xs font-bold" style={{ color: f }}>{v}{u}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </>
      )}

      {/* Verknüpfungen */}
      {verwendetGR && (
        <div className="rounded-2xl p-3 mb-3 flex items-center gap-2" style={{ backgroundColor: "#1a1a1a" }}>
          <span style={{ color: "#22c55e" }}>🧱</span>
          <span className="text-sm">Verwendet: <span className="font-medium">{verwendetGR.name} v{verwendetGR.version}</span></span>
        </div>
      )}
      {verwendetIn.length > 0 && (
        <div className="rounded-2xl p-3 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <p className="text-xs mb-2" style={{ color: "#555" }}>Wird verwendet in:</p>
          <div className="flex flex-wrap gap-2">
            {verwendetIn.map(r => <span key={r.id} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "#111", color: "#aaa" }}>🍽️ {r.name} v{r.version}</span>)}
          </div>
        </div>
      )}

      {/* Portionsregler + Makros (nur Rezept) */}
      {rezept.typ === "rezept" && (
        <>
          <div className="rounded-2xl p-4 mb-3" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Portionen</span>
              <span className="font-bold text-sm" style={{ color: "#22c55e" }}>{portionen}</span>
            </div>
            <input type="range" min={1} max={rezept.portionen * 4} value={portionen}
              onChange={e => setPortionen(Number(e.target.value))} className="w-full accent-green-500" />
          </div>
          <div className="rounded-2xl p-3 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-center text-sm font-bold mb-2">{score.emoji} {score.label} <span className="font-normal text-xs" style={{ color: "#555" }}>pro Portion</span></div>
            <div className="grid grid-cols-3 gap-1.5 mb-1">
              {[{ l: "kcal", v: pp.kcal, u: "", f: "#fff" }, { l: "Eiweiß", v: pp.eiweiss, u: "g", f: "#3b82f6" }, { l: "Fett", v: pp.fett, u: "g", f: "#f59e0b" }].map(({ l, v, u, f }) => (
                <div key={l} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#111" }}>
                  <div className="text-[9px] mb-0.5" style={{ color: "#555" }}>{l}</div>
                  <div className="text-xs font-bold" style={{ color: f }}>{v}{u}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[{ l: "KH gesamt", v: pp.kh, u: "g", f: "#f97316" }, { l: "Netto-KH", v: ppNettoKh, u: "g", f: score.farbe }, { l: "Ballaststoffe", v: pp.ballaststoffe, u: "g", f: "#22c55e" }].map(({ l, v, u, f }) => (
                <div key={l} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#111" }}>
                  <div className="text-[9px] mb-0.5" style={{ color: "#555" }}>{l}</div>
                  <div className="text-xs font-bold" style={{ color: f }}>{v}{u}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Zutaten */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>🛒 Zutaten</h2>
        <ul className="space-y-2">
          {rezept.zutaten.map(z => {
            const m = Math.round(z.menge * df * 10) / 10;
            return <li key={z.id} className="flex gap-2 text-sm"><span style={{ color: "#22c55e" }}>•</span><span><span className="font-medium">{m} {z.einheit}</span> {z.name}</span></li>;
          })}
        </ul>
      </div>

      {/* Zubereitung */}
      {rezept.zubereitung.length > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>👩‍🍳 Zubereitung</h2>
          <ol className="space-y-3">
            {rezept.zubereitung.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black" style={{ backgroundColor: "#22c55e" }}>{i + 1}</span>
                <span style={{ color: "#ccc" }}>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Teilen */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            const zutatenText = rezept.zutaten.map(z => `• ${z.menge} ${z.einheit} ${z.name}`).join("\n");
            const text = `🧪 ${rezept.name} (v${rezept.version})\n\n${rezept.beschreibung}\n\nZutaten:\n${zutatenText}\n\n✨ Mehr Keto-Rezepte: https://vitaketo.app/rezepte`;
            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://vitaketo.app/rezepte")}&quote=${encodeURIComponent(text)}`;
            window.open(url, "_blank");
          }}
          className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          style={{ backgroundColor: "#1a2a3a", border: "1px solid #1877F244", color: "#4a9eff" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Auf Facebook teilen
        </button>
      </div>

      {/* Entwicklungsnotizen */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold" style={{ color: "#22c55e" }}>📝 Entwicklungsnotizen</h2>
          <button onClick={() => { if (notizBearbeiten) onNotizSpeichern(notiz); setNotizBearbeiten(p => !p); }}
            className="text-xs px-3 py-1 rounded-lg" style={{ backgroundColor: "#111", color: notizBearbeiten ? "#22c55e" : "#666" }}>
            {notizBearbeiten ? "✅ Speichern" : "✏️ Bearbeiten"}
          </button>
        </div>
        {notizBearbeiten ? (
          <textarea value={notiz} onChange={e => setNotiz(e.target.value)} rows={4} placeholder="Notizen zur Entwicklung…"
            className="w-full rounded-xl px-3 py-2 text-sm outline-none resize-none"
            style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }} />
        ) : (
          <p className="text-sm" style={{ color: notiz ? "#ccc" : "#444" }}>{notiz || "Noch keine Notizen."}</p>
        )}
      </div>

      {/* Testprotokoll */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold" style={{ color: "#22c55e" }}>🧫 Testprotokoll ({rezept.testProtokolle.length})</h2>
          <button onClick={onTestHinzufuegen}
            className="text-xs px-3 py-1.5 rounded-lg font-medium text-black"
            style={{ backgroundColor: "#22c55e" }}>+ Test</button>
        </div>
        {rezept.testProtokolle.length === 0 ? (
          <p className="text-sm" style={{ color: "#444" }}>Noch kein Test durchgeführt.</p>
        ) : (
          <div className="space-y-3">
            {[...rezept.testProtokolle].reverse().map(t => {
              const avg = Math.round((t.geschmack + t.kruste + t.krume + t.lockerheit + t.optik + t.saettigung) / 6 * 10) / 10;
              return (
                <div key={t.id} className="rounded-xl p-3" style={{ backgroundColor: "#111" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: "#555" }}>{t.datum}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: "#f59e0b" }}>⌀ {avg} ★</span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: t.wiederHolen ? "#22c55e22" : "#ef444422", color: t.wiederHolen ? "#22c55e" : "#ef4444" }}>
                        {t.wiederHolen ? "✅" : "❌"}
                      </span>
                      <button type="button" onClick={() => onTestBearbeiten(t.id)}
                        className="text-xs px-1.5 py-0.5 rounded" style={{ color: "#555" }}>✏️</button>
                      <button type="button" onClick={() => { if (confirm("Test löschen?")) onTestLoeschen(t.id); }}
                        className="text-xs px-1.5 py-0.5 rounded" style={{ color: "#555" }}>🗑</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    {TEST_KRITERIEN.map(k => (
                      <div key={k.key} className="text-center">
                        <div className="text-[9px] mb-0.5" style={{ color: "#444" }}>{k.emoji} {k.label}</div>
                        <Sterne wert={t[k.key]} readonly />
                      </div>
                    ))}
                  </div>
                  {t.notiz && <p className="text-xs" style={{ color: "#888" }}>{t.notiz}</p>}
                  <TestFotos fotos={t.fotos || []} onLoeschen={(idx) => onFotoLoeschen(t.id, idx)} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Export-Aktionen */}
      <ExportAktionen rezept={rezept} />

      {/* Aktionen */}
      <button onClick={onNeueVersion}
        className="w-full py-3 rounded-xl font-bold text-black mb-2"
        style={{ backgroundColor: "#22c55e" }}>
        ➡️ Neue Version erstellen (v{naechsteVersion(rezept.version)})
      </button>
      <button onClick={onLoeschen}
        className="w-full py-3 rounded-xl text-sm"
        style={{ backgroundColor: "#1a1a1a", color: "#ef4444" }}>
        🗑 Rezept löschen
      </button>
    </main>
  );
}

// ─── Test-Ansicht ─────────────────────────────────────────────────────────────

function FotoUpload({ fotos, onChange }: { fotos: string[]; onChange: (f: string[]) => void }) {
  const kameraRef = useRef<HTMLInputElement>(null);
  const galerieRef = useRef<HTMLInputElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [laedt, setLaedt] = useState(false);

  async function fotoHinzufuegen(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setLaedt(true);
    const neueUrls: string[] = [];
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append("foto", file);
        const res = await fetch("/api/werkstatt-foto", { method: "POST", body: fd });
        const data = await res.json() as { url?: string; fehler?: string };
        if (data.url) neueUrls.push(data.url);
      } catch { /* einzelnes Foto überspringen */ }
    }
    onChange([...fotos, ...neueUrls]);
    setLaedt(false);
    e.target.value = "";
  }

  async function loeschen(idx: number) {
    const url = fotos[idx];
    // Supabase-URLs beim Löschen auch aus Storage entfernen
    if (url && !url.startsWith("data:")) {
      fetch("/api/werkstatt-foto", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) }).catch(() => {});
    }
    onChange(fotos.filter((_, i) => i !== idx));
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-sm" style={{ color: "#22c55e" }}>📸 Fotos</span>
          <div className="flex gap-2">
            {laedt && <span className="text-xs animate-pulse" style={{ color: "#22c55e" }}>Wird hochgeladen…</span>}
            <button type="button" onClick={() => kameraRef.current?.click()} disabled={laedt}
              className="text-xs px-2.5 py-1.5 rounded-lg font-medium disabled:opacity-40"
              style={{ backgroundColor: "#1a1a1a", color: "#aaa", border: "1px solid #333" }}>
              📷 Kamera
            </button>
            <button type="button" onClick={() => galerieRef.current?.click()} disabled={laedt}
              className="text-xs px-2.5 py-1.5 rounded-lg font-medium disabled:opacity-40"
              style={{ backgroundColor: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e44" }}>
              🖼 Galerie
            </button>
          </div>
          <input ref={kameraRef} type="file" accept="image/*" multiple className="hidden" onChange={fotoHinzufuegen} capture="environment" />
          <input ref={galerieRef} type="file" accept="image/*" multiple className="hidden" onChange={fotoHinzufuegen} />
        </div>
        {fotos.length === 0 ? (
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => kameraRef.current?.click()}
              className="py-6 rounded-xl border-2 border-dashed flex flex-col items-center gap-1"
              style={{ borderColor: "#333", color: "#444" }}>
              <span className="text-2xl">📷</span>
              <span className="text-xs">Kamera</span>
            </button>
            <button type="button" onClick={() => galerieRef.current?.click()}
              className="py-6 rounded-xl border-2 border-dashed flex flex-col items-center gap-1"
              style={{ borderColor: "#333", color: "#444" }}>
              <span className="text-2xl">🖼</span>
              <span className="text-xs">Galerie</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {fotos.map((f, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                <img src={f} alt={`Foto ${i + 1}`} className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setLightbox(f)} />
                <button type="button" onClick={() => loeschen(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "#000c", color: "#fff" }}>✕</button>
              </div>
            ))}
            <button type="button" onClick={() => galerieRef.current?.click()}
              className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1"
              style={{ backgroundColor: "#111", border: "2px dashed #333", color: "#444" }}>
              <span className="text-2xl">+</span>
            </button>
          </div>
        )}
      </div>
      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ backgroundColor: "#000d" }} onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Foto" className="max-w-full max-h-full rounded-xl object-contain" />
          <button className="absolute top-4 right-4 text-white text-2xl font-bold">✕</button>
        </div>
      )}
    </>
  );
}

function TestAnsicht({ rezept, bearbeitenTest, onSave, onBack }: { rezept: WerkstattRezept; bearbeitenTest: TestProtokoll | null; onSave: (t: TestProtokoll) => void; onBack: () => void }) {
  const [werte, setWerte] = useState<Record<string, number>>({
    geschmack: bearbeitenTest?.geschmack ?? 3, kruste: bearbeitenTest?.kruste ?? 3,
    krume: bearbeitenTest?.krume ?? 3, lockerheit: bearbeitenTest?.lockerheit ?? 3,
    optik: bearbeitenTest?.optik ?? 3, saettigung: bearbeitenTest?.saettigung ?? 3,
  });
  const [wiederHolen, setWiederHolen] = useState(bearbeitenTest?.wiederHolen ?? true);
  const [notiz, setNotiz] = useState(bearbeitenTest?.notiz ?? "");
  const [fotos, setFotos] = useState<string[]>(bearbeitenTest?.fotos ?? []);
  const [gespeichert, setGespeichert] = useState(false);

  function speichern() {
    if (gespeichert) return;
    setGespeichert(true);
    onSave({
      id: bearbeitenTest?.id ?? Math.random().toString(36).slice(2),
      datum: bearbeitenTest?.datum ?? new Date().toLocaleDateString("de-DE"),
      geschmack: werte.geschmack, kruste: werte.kruste, krume: werte.krume,
      lockerheit: werte.lockerheit, optik: werte.optik, saettigung: werte.saettigung,
      wiederHolen, notiz, fotos,
    });
  }

  return (
    <main className="px-4 py-6 pb-28">
      <button onClick={onBack} className="flex items-center gap-2 text-sm mb-4" style={{ color: "#22c55e" }}>← Zurück</button>
      <h1 className="text-xl font-bold mb-1">{bearbeitenTest ? "✏️ Test bearbeiten" : "🧫 Test hinzufügen"}</h1>
      <p className="text-xs mb-5" style={{ color: "#555" }}>{rezept.name} · v{rezept.version}</p>

      <div className="rounded-2xl p-4 mb-4 space-y-4" style={{ backgroundColor: "#1a1a1a" }}>
        {TEST_KRITERIEN.map(k => (
          <div key={k.key} className="flex items-center justify-between">
            <span className="text-sm">{k.emoji} {k.label}</span>
            <Sterne wert={werte[k.key]} setze={n => setWerte(p => ({ ...p, [k.key]: n }))} />
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <p className="text-sm font-medium mb-3">Wieder machen?</p>
        <div className="grid grid-cols-2 gap-2">
          {[true, false].map(v => (
            <button key={String(v)} onClick={() => setWiederHolen(v)}
              className="py-3 rounded-xl font-medium text-sm"
              style={{ backgroundColor: wiederHolen === v ? (v ? "#22c55e22" : "#ef444422") : "#111", color: wiederHolen === v ? (v ? "#22c55e" : "#ef4444") : "#555", border: `1px solid ${wiederHolen === v ? (v ? "#22c55e" : "#ef4444") : "#222"}` }}>
              {v ? "✅ Ja" : "❌ Nein"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <textarea value={notiz} onChange={e => setNotiz(e.target.value)} rows={3}
          placeholder="Notizen z.B. etwas trocken, mehr Wasser beim nächsten Mal…"
          className="w-full rounded-xl px-3 py-2 text-sm outline-none resize-none mb-4"
          style={{ backgroundColor: "#111", color: "#fff", border: "1px solid #333" }} />
        <FotoUpload fotos={fotos} onChange={setFotos} />
      </div>

      {gespeichert ? (
        <div className="w-full py-4 rounded-2xl font-bold text-black text-base text-center"
          style={{ backgroundColor: "#22c55e" }}>
          ✅ Gespeichert! Kehre zurück…
        </div>
      ) : (
        <button onClick={speichern}
          className="w-full py-4 rounded-2xl font-bold text-black text-base"
          style={{ backgroundColor: "#22c55e" }}>
          ✅ Test speichern
        </button>
      )}
    </main>
  );
}


