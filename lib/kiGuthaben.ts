const KI_GUTHABEN_KEY  = "ketome_ki_guthaben";
const KI_MONAT_KEY     = "ketome_ki_monat";
const KI_COACH_HALB    = "ketome_ki_coach_halb"; // "0" oder "1"
const MONATLICH_FREI   = 100;
const TEST_FREI        = 30;
const TEST_TAGE        = 3;

export function premiumArt(): "paid" | "test" | "none" {
  if (typeof window === "undefined") return "none";
  if (localStorage.getItem("ketome_premium") !== "true") return "none";
  const art = localStorage.getItem("ketome_premium_art") || "";
  if (art === "test") {
    // Ablauf prüfen
    const seit = localStorage.getItem("ketome_premium_seit");
    if (seit) {
      const tage = (Date.now() - new Date(seit).getTime()) / 86400000;
      if (tage > TEST_TAGE) {
        localStorage.setItem("ketome_premium", "false");
        localStorage.removeItem("ketome_premium_art");
        return "none";
      }
    }
    return "test";
  }
  return "paid";
}

function aktuellerMonat() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

export function kiGuthabenPruefen(): number {
  if (typeof window === "undefined") return 0;
  const art = premiumArt();
  if (art === "none") return 0;

  if (art === "paid") {
    // Monatliches Frei-Guthaben auffüllen
    const monat = localStorage.getItem(KI_MONAT_KEY);
    if (monat !== aktuellerMonat()) {
      const aktuell = parseInt(localStorage.getItem(KI_GUTHABEN_KEY) || "0");
      localStorage.setItem(KI_GUTHABEN_KEY, String(aktuell + MONATLICH_FREI));
      localStorage.setItem(KI_MONAT_KEY, aktuellerMonat());
    }
  }

  return parseInt(localStorage.getItem(KI_GUTHABEN_KEY) || "0");
}

// typ: "coach" = 0,5 Credit bei paid; "foto" = 1 Credit immer
export function kiGuthabenAbziehen(typ: "coach" | "foto" = "foto"): boolean {
  const art = premiumArt();
  if (art === "none") return false;

  const aktuell = kiGuthabenPruefen();
  if (aktuell <= 0) return false;

  // Coach bei bezahltem Premium = 0,5 Credit
  if (typ === "coach" && art === "paid") {
    const halb = localStorage.getItem(KI_COACH_HALB) || "0";
    if (halb === "0") {
      localStorage.setItem(KI_COACH_HALB, "1");
      // kein Credit abziehen bei erster Hälfte
      window.dispatchEvent(new Event("ketome-daten-gespeichert"));
      return true;
    } else {
      localStorage.setItem(KI_COACH_HALB, "0");
      // zweite Hälfte → 1 Credit abziehen
      localStorage.setItem(KI_GUTHABEN_KEY, String(aktuell - 1));
      window.dispatchEvent(new Event("ketome-daten-gespeichert"));
      return true;
    }
  }

  // Alles andere (oder Test-Modus): 1 Credit
  localStorage.setItem(KI_GUTHABEN_KEY, String(aktuell - 1));
  window.dispatchEvent(new Event("ketome-daten-gespeichert"));
  return true;
}

export function testFreischalten(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem("ketome_trial_genutzt") === "true") return false;
  if (localStorage.getItem("ketome_premium") === "true") return false;

  localStorage.setItem("ketome_premium", "true");
  localStorage.setItem("ketome_premium_art", "test");
  localStorage.setItem("ketome_premium_seit", new Date().toISOString());
  localStorage.setItem(KI_GUTHABEN_KEY, String(TEST_FREI));
  localStorage.setItem(KI_MONAT_KEY, aktuellerMonat());
  localStorage.setItem("ketome_trial_genutzt", "true");
  window.dispatchEvent(new Event("ketome-daten-gespeichert"));
  return true;
}
