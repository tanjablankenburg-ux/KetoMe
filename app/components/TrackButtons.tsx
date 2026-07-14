"use client";
import { useState } from "react";

type Makros = { name: string; kcal: number; kh: number; eiweiss: number; fett: number; ballaststoffe?: number };

const WOCHENTAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const SLOTS = [
  { key: "fruehstueck", label: "Frühstück" },
  { key: "mittagessen", label: "Mittagessen" },
  { key: "abendessen", label: "Abendessen" },
  { key: "snack", label: "Snack" },
] as const;

export default function TrackButtons({ makros, rezeptId }: { makros: Makros; rezeptId?: string }) {
  const [toast, setToast] = useState<string | null>(null);
  const [planOffen, setPlanOffen] = useState(false);
  const [tag, setTag] = useState("Montag");
  const [slot, setSlot] = useState<typeof SLOTS[number]["key"]>("mittagessen");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function heuteGegessen() {
    try {
      const heute = new Date().toLocaleDateString("de-DE");
      const alle = JSON.parse(localStorage.getItem("ketome_naehrwerte") || "[]");
      alle.push({
        id: Date.now().toString(),
        datum: heute,
        name: makros.name,
        kcal: makros.kcal,
        kh: makros.kh,
        eiweiss: makros.eiweiss,
        fett: makros.fett,
        ballaststoffe: makros.ballaststoffe ?? 0,
      });
      localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
      window.dispatchEvent(new Event("ketome-daten-gespeichert"));
      showToast(`✅ ${makros.name} als heute gegessen eingetragen`);
    } catch { showToast("❌ Fehler"); }
  }

  function wochenplanEintragen() {
    try {
      const plan = JSON.parse(localStorage.getItem("ketome_mein_plan") || "{}");
      if (!plan[tag]) plan[tag] = { fruehstueck: { rezeptId: null }, mittagessen: { rezeptId: null }, abendessen: { rezeptId: null }, snack: { rezeptId: null } };
      const id = rezeptId || `custom_${Date.now()}`;
      plan[tag][slot] = { rezeptId: id };
      localStorage.setItem("ketome_mein_plan", JSON.stringify(plan));
      window.dispatchEvent(new Event("ketome-daten-gespeichert"));
      setPlanOffen(false);
      showToast(`✅ ${tag} · ${SLOTS.find(s => s.key === slot)?.label} eingetragen`);
    } catch { showToast("❌ Fehler"); }
  }

  return (
    <div className="mt-3">
      {toast && (
        <div className="rounded-xl px-3 py-2 mb-2 text-xs text-center font-medium"
          style={{ backgroundColor: toast.startsWith("✅") ? "#0a2a0a" : "#2a0a0a", color: toast.startsWith("✅") ? "#22c55e" : "#ef4444", border: `1px solid ${toast.startsWith("✅") ? "#22c55e33" : "#ef444433"}` }}>
          {toast}
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={heuteGegessen}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold"
          style={{ backgroundColor: "#0d2018", border: "1px solid #22c55e44", color: "#22c55e" }}>
          🍽️ Heute gegessen
        </button>
        <button onClick={() => setPlanOffen(p => !p)}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold"
          style={{ backgroundColor: "#0d1520", border: "1px solid #3b82f644", color: "#3b82f6" }}>
          📅 Wochenplan
        </button>
      </div>

      {planOffen && (
        <div className="rounded-2xl p-4 mt-2" style={{ backgroundColor: "#101410", border: "1px solid #22c55e22" }}>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-xs mb-1" style={{ color: "#3a5a3a" }}>Tag</p>
              <select value={tag} onChange={e => setTag(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: "#151a15", color: "#fff", border: "1px solid #1a2a1a" }}>
                {WOCHENTAGE.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: "#3a5a3a" }}>Mahlzeit</p>
              <select value={slot} onChange={e => setSlot(e.target.value as typeof SLOTS[number]["key"])}
                className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: "#151a15", color: "#fff", border: "1px solid #1a2a1a" }}>
                {SLOTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <button onClick={wochenplanEintragen}
            className="w-full py-2.5 rounded-xl text-sm font-black text-black"
            style={{ backgroundColor: "#22c55e" }}>
            Eintragen ✓
          </button>
        </div>
      )}
    </div>
  );
}
