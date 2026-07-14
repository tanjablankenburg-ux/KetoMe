"use client";
import { useEffect } from "react";

export default function FotoReset() {
  useEffect(() => {
    const jetzt = new Date();
    const aktuellerMonat = `${jetzt.getFullYear()}-${jetzt.getMonth() + 1}`;
    const letzterReset = localStorage.getItem("ketome_foto_reset_monat");
    if (letzterReset !== aktuellerMonat) {
      localStorage.setItem("ketome_foto_count", "0");
      localStorage.setItem("ketome_foto_reset_monat", aktuellerMonat);
    }
  }, []);
  return null;
}
