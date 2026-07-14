"use client";
import { useEffect, useRef } from "react";

const SYNC_KEYS = [
  // Profil & Ziele
  "ketome_profil","ketome_ziele","ketome_ziel","ketome_mein_plan",
  "ketome_gewichtsziel","ketome_groesse","ketome_startdatum","ketome_registriert_am",
  // Gewicht & Körper
  "ketome_gewicht","ketome_masse","ketome_ketone",
  // Ernährung & Mahlzeiten
  "ketome_naehrwerte","ketome_mahlzeiten","ketome_gegessen","ketome_wasser",
  "ketome_ausschluesse",
  // Rezepte & Planung
  "ketome_werkstatt2","ketome_custom_rezepte","ketome_bookmarks",
  "ketome_wochenplan","ketome_einkaufsliste",
  // Fasten
  "ketome_fasten_verlauf","ketome_fasten_modus","ketome_fasten_start",
  "ketome_fastet","ketome_fasting",
  // Energie & Tracking
  "ketome_energie_check","ketome_badges_freigeschaltet","ketome_startplan_erledigte",
  // Premium & System
  "ketome_onboarding_done","ketome_premium","ketome_premium_art","ketome_premium_seit",
  "ketome_trial_genutzt","ketome_foto_count","ketome_ki_guthaben","ketome_ki_monat",
];

function istEingeloggt() {
  return document.cookie.includes("ketome_name=");
}

function lokaleDaten(): Record<string, string> {
  const r: Record<string, string> = {};
  for (const k of SYNC_KEYS) {
    const v = localStorage.getItem(k);
    if (v !== null) r[k] = v;
  }
  return r;
}

async function speichern() {
  if (!istEingeloggt()) return;
  const daten = lokaleDaten();
  if (Object.keys(daten).length === 0) return;
  try {
    await fetch("/api/sync/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(daten),
    });
  } catch {}
}

export default function CloudSync() {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bereitsFuerDiesenLogin = "ketome_sync_done";

  function speichernDebounced() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(speichern, 3000);
  }

  useEffect(() => {
    if (!istEingeloggt()) return;

    async function laden() {
      // Bereits in dieser Login-Session geladen?
      if (sessionStorage.getItem(bereitsFuerDiesenLogin)) {
        // Nur hochladen
        setTimeout(speichern, 2000);
        return;
      }

      try {
        const res = await fetch("/api/sync/load");
        if (!res.ok) {
          sessionStorage.setItem(bereitsFuerDiesenLogin, "1");
          setTimeout(speichern, 2000);
          return;
        }
        const { data } = await res.json();
        sessionStorage.setItem(bereitsFuerDiesenLogin, "1");

        if (data && typeof data === "object" && Object.keys(data).length > 0) {
          let etwasGeschrieben = false;
          for (const [k, v] of Object.entries(data as Record<string, string>)) {
            if (!SYNC_KEYS.includes(k)) continue;
            const lokal = localStorage.getItem(k);
            // Nie lokale Daten mit leeren Server-Daten überschreiben
            if (!v || v === "null" || v === "[]" || v === "{}") continue;
            // Bei Arrays: nur überschreiben wenn Server-Array länger ist
            if (lokal && lokal.startsWith("[")) {
              try {
                const lokalArr = JSON.parse(lokal);
                const serverArr = JSON.parse(v);
                if (Array.isArray(lokalArr) && Array.isArray(serverArr)) {
                  if (serverArr.length <= lokalArr.length) continue; // lokal hat mehr → behalten
                }
              } catch {}
            }
            // Lokal schon vorhanden und Server leer → behalten
            if (lokal && !v) continue;
            localStorage.setItem(k, v);
            etwasGeschrieben = true;
          }
          if (etwasGeschrieben) {
            window.location.reload();
          } else {
            // Lokale Daten sind vollständiger → hochladen
            setTimeout(speichern, 2000);
          }
        } else {
          setTimeout(speichern, 2000);
        }
      } catch {
        sessionStorage.setItem(bereitsFuerDiesenLogin, "1");
        setTimeout(speichern, 2000);
      }
    }

    laden();

    // Bei Tab-Wechsel sofort speichern
    const onHide = () => { if (document.visibilityState === "hidden") speichern(); };
    document.addEventListener("visibilitychange", onHide);

    // Auf Custom-Events von anderen Komponenten reagieren
    window.addEventListener("ketome-daten-gespeichert", speichernDebounced);

    // Alle 60 Sekunden speichern
    const interval = setInterval(speichern, 60_000);

    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("ketome-daten-gespeichert", speichernDebounced);
      clearInterval(interval);
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  return null;
}
