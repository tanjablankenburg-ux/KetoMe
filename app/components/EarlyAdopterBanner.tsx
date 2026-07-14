"use client";
import { useEffect, useState } from "react";

const LAUNCH_DATUM = new Date("2026-07-12T00:00:00");
const EARLY_ADOPTER_TAGE = 14; // 14 Tage nach Launch = Early Adopter

export default function EarlyAdopterBanner() {
  const [zeigen, setZeigen] = useState(false);
  const [weggeklickt, setWeggeklickt] = useState(false);

  useEffect(() => {
    const jetzt = new Date();
    const nachLaunch = jetzt >= LAUNCH_DATUM;
    if (!nachLaunch) return;

    // Registrierungsdatum setzen (beim ersten Aufruf nach Launch)
    const regDatum = localStorage.getItem("ketome_registriert_am");
    if (!regDatum) {
      localStorage.setItem("ketome_registriert_am", jetzt.toISOString());
    }

    const regDate = new Date(localStorage.getItem("ketome_registriert_am") || jetzt.toISOString());
    const tageSeitReg = (jetzt.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24);

    // Early Adopter = registriert innerhalb 14 Tage nach Launch
    const earlyAdopter = tageSeitReg <= EARLY_ADOPTER_TAGE;
    const hatPremium = localStorage.getItem("ketome_premium") === "true";
    const bannerWeggeklickt = localStorage.getItem("ketome_early_banner_weg") === "true";

    if (earlyAdopter && !hatPremium && !bannerWeggeklickt) {
      setZeigen(true);
    }
  }, []);

  function premiumAktivieren() {
    localStorage.setItem("ketome_premium", "true");
    localStorage.setItem("ketome_premium_art", "early_adopter");
    localStorage.setItem("ketome_premium_seit", new Date().toISOString());
    localStorage.setItem("ketome_early_banner_weg", "true");
    setZeigen(false);
  }

  function spaeter() {
    localStorage.setItem("ketome_early_banner_weg", "true");
    setWeggeklickt(true);
    setZeigen(false);
  }

  if (!zeigen || weggeklickt) return null;

  return (
    <div className="mx-4 mb-4 rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a0d2e, #0d1a2e)", border: "1px solid #8b5cf644" }}>
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="text-2xl">🎉</div>
          <div>
            <div className="font-black text-sm mb-0.5" style={{ color: "#a78bfa" }}>
              Du bist dabei von Anfang an!
            </div>
            <div className="text-xs leading-relaxed" style={{ color: "#aaa" }}>
              Als Early Adopter bekommst du Premium jetzt kostenlos zum Testen.
              Keine automatische Verlängerung. Keine Kündigung nötig.
            </div>
          </div>
        </div>

        <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: "#ffffff08" }}>
          {[
            "KI-Foto-Rezepte (10 pro Monat)",
            "Alle Premium-Features freigeschaltet",
            "Kein Abo, keine Falle",
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
              <span className="text-xs flex-shrink-0" style={{ color: "#a78bfa" }}>✓</span>
              <span className="text-xs" style={{ color: "#ccc" }}>{p}</span>
            </div>
          ))}
        </div>

        <button onClick={premiumAktivieren}
          className="w-full rounded-xl py-2.5 text-sm font-bold mb-2"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff" }}>
          Jetzt kostenlos testen
        </button>
        <button onClick={spaeter}
          className="w-full text-xs py-1"
          style={{ color: "#444" }}>
          Später
        </button>
      </div>
    </div>
  );
}
