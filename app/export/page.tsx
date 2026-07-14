"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type GewichtEintrag = { datum: string; wert: number };
type NaehrwertEintrag = { id: string; datum: string; name: string; kcal: number; kh: number; eiweiss: number; fett: number; ballaststoffe?: number };
type KetonMessung = { id: string; datum: string; zeit: string; wert: number; methode: string; glukose?: number; notiz?: string };
type MasseEintrag = { datum: string; taille: number; huefte: number; oberschenkel: number };

export default function ExportPage() {
  const [gewicht, setGewicht] = useState<GewichtEintrag[]>([]);
  const [naehrwerte, setNaehrwerte] = useState<NaehrwertEintrag[]>([]);
  const [ketone, setKetone] = useState<KetonMessung[]>([]);
  const [masse, setMasse] = useState<MasseEintrag[]>([]);
  const [profilName, setProfilName] = useState("");
  const [exportiert, setExportiert] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "erfolg" | "fehler">("idle");
  const [importMsg, setImportMsg] = useState("");

  useEffect(() => {
    try {
      const g = localStorage.getItem("ketome_gewicht");
      if (g) setGewicht(JSON.parse(g));
      const n = localStorage.getItem("ketome_naehrwerte");
      if (n) setNaehrwerte(JSON.parse(n));
      const k = localStorage.getItem("ketome_ketone");
      if (k) setKetone(JSON.parse(k));
      const m = localStorage.getItem("ketome_masse");
      if (m) setMasse(JSON.parse(m));
      const p = localStorage.getItem("ketome_profil");
      if (p) { const pp = JSON.parse(p); setProfilName(pp.name || ""); }
    } catch {}
  }, []);

  // ─── CSV Export ───────────────────────────────────────────────────────────────
  function csvDownload(filename: string, rows: string[][], headers: string[]) {
    const bom = "﻿";
    const content = bom + [headers, ...rows].map(r => r.map(v => `"${v}"`).join(";")).join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setExportiert(true);
    setTimeout(() => setExportiert(false), 2000);
  }

  function exportGewichtCSV() {
    const sorted = [...gewicht].sort((a, b) => a.datum.localeCompare(b.datum));
    csvDownload(
      `ketome_Gewicht_${today()}.csv`,
      sorted.map(e => [e.datum, String(e.wert), "kg"]),
      ["Datum", "Gewicht", "Einheit"]
    );
  }

  function exportNaehrwerteCSV() {
    const sorted = [...naehrwerte].sort((a, b) => a.datum.localeCompare(b.datum));
    csvDownload(
      `ketome_Ernaehrung_${today()}.csv`,
      sorted.map(e => [
        e.datum, e.name,
        String(e.kcal), String(e.kh), String(e.ballaststoffe ?? 0),
        String(Math.max(0, e.kh - (e.ballaststoffe ?? 0))),
        String(e.eiweiss), String(e.fett)
      ]),
      ["Datum", "Lebensmittel", "kcal", "KH gesamt (g)", "Ballaststoffe (g)", "Netto-KH (g)", "Eiweiß (g)", "Fett (g)"]
    );
  }

  function exportKetoneCSV() {
    const sorted = [...ketone].sort((a, b) => a.datum.localeCompare(b.datum));
    csvDownload(
      `ketome_Ketone_${today()}.csv`,
      sorted.map(e => [
        e.datum, e.zeit, String(e.wert), e.methode,
        e.glukose ? String(e.glukose) : "-",
        e.glukose ? String(Math.round((e.glukose / e.wert) * 10) / 10) : "-",
        e.notiz ?? ""
      ]),
      ["Datum", "Uhrzeit", "Ketone (mmol/L)", "Methode", "Glukose (mg/dL)", "GKI", "Notiz"]
    );
  }

  // ─── JSON Vollbackup ──────────────────────────────────────────────────────────
  function exportAllesJSON() {
    const backup: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("ketome_")) {
        backup[key] = localStorage.getItem(key) ?? "";
      }
    }
    backup["_vitaketo_backup_datum"] = new Date().toISOString();
    backup["_vitaketo_backup_version"] = "1";
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vitaketo_backup_${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportiert(true);
    setTimeout(() => setExportiert(false), 2000);
  }

  function importAusJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (typeof data !== "object" || data === null) throw new Error("Ungültiges Format");
        let count = 0;
        for (const [key, value] of Object.entries(data)) {
          if (key.startsWith("ketome_") && typeof value === "string") {
            localStorage.setItem(key, value);
            count++;
          }
        }
        setImportMsg(`${count} Datensätze erfolgreich wiederhergestellt. Seite wird neu geladen...`);
        setImportStatus("erfolg");
        setTimeout(() => window.location.reload(), 2000);
      } catch {
        setImportMsg("Datei konnte nicht gelesen werden. Bitte eine gültige VitaKeto-Backup-Datei wählen.");
        setImportStatus("fehler");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function exportAllesCSV() {
    exportGewichtCSV();
    setTimeout(() => exportNaehrwerteCSV(), 300);
    if (ketone.length > 0) setTimeout(() => exportKetoneCSV(), 600);
  }

  // ─── PDF / Druckansicht ────────────────────────────────────────────────────────
  function druckenPDF() {
    window.print();
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  // ─── Statistiken ──────────────────────────────────────────────────────────────
  const gewichtSorted = [...gewicht].sort((a, b) => a.datum.localeCompare(b.datum));
  const startGewicht = gewichtSorted[0]?.wert ?? null;
  const aktGewicht = gewichtSorted[gewichtSorted.length - 1]?.wert ?? null;
  const gewichtVerlust = startGewicht && aktGewicht ? Math.round((startGewicht - aktGewicht) * 10) / 10 : 0;
  const tageDabei = gewichtSorted.length > 0
    ? Math.floor((Date.now() - (() => { const [d, m, y] = gewichtSorted[0].datum.split(".").map(Number); return new Date(y, m - 1, d).getTime(); })()) / 86400000) + 1
    : 0;

  const naehrWoche = naehrwerte.slice(-70);
  const avgKcal = naehrWoche.length > 0 ? Math.round(naehrWoche.reduce((s, n) => s + n.kcal, 0) / Math.max(1, [...new Set(naehrWoche.map(n => n.datum))].length)) : 0;
  const avgNettoKh = naehrWoche.length > 0 ? Math.round(naehrWoche.reduce((s, n) => s + Math.max(0, n.kh - (n.ballaststoffe ?? 0)), 0) / Math.max(1, [...new Set(naehrWoche.map(n => n.datum))].length)) : 0;

  const letzteKetone = ketone.length > 0 ? [...ketone].sort((a, b) => b.datum.localeCompare(a.datum))[0] : null;

  return (
    <>
      {/* ─── Print-Styles (nur beim Drucken aktiv) ─────────────────────────────── */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; font-family: Arial, sans-serif; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .print-card { background: white !important; border: 1px solid #ddd !important; color: black !important; padding: 12px; margin-bottom: 8px; border-radius: 8px; }
          .print-value { color: #16a34a !important; font-weight: bold; }
          main { padding: 20px !important; }
          h1, h2 { color: black !important; }
        }
        .print-only { display: none; }
      `}</style>

      <main className="px-4 py-6 pb-28">
        <Link href="/" className="text-xs mb-4 inline-block no-print" style={{ color: "#555" }}>← Zurück</Link>

        {/* Print-Header (nur beim Drucken sichtbar) */}
        <div className="print-only mb-6">
          <h1 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>VitaKeto — Datenbericht</h1>
          <p style={{ color: "#555", fontSize: 12 }}>
            {profilName && `Nutzer: ${profilName} · `}Erstellt am: {new Date().toLocaleDateString("de-DE")}
          </p>
          <hr style={{ margin: "12px 0", borderColor: "#ddd" }} />
        </div>

        {/* Hero */}
        <div className="mb-5 no-print">
          <h1 className="text-2xl font-black mb-1">📊 Daten-Export</h1>
          <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
            Exportiere deine Keto-Daten als CSV für Excel oder als PDF für den Arzttermin.
          </p>
        </div>

        {/* Zusammenfassung */}
        <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>DEINE ZUSAMMENFASSUNG</div>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { label: "Tage dabei", wert: tageDabei > 0 ? `${tageDabei} Tage` : "–", emoji: "🗓" },
            { label: "Gewichtsverlust", wert: gewichtVerlust > 0 ? `${gewichtVerlust} kg` : "–", emoji: "⚖️" },
            { label: "Akt. Gewicht", wert: aktGewicht ? `${aktGewicht} kg` : "–", emoji: "📉" },
            { label: "Startgewicht", wert: startGewicht ? `${startGewicht} kg` : "–", emoji: "🏁" },
            { label: "Ø kcal/Tag", wert: avgKcal > 0 ? `${avgKcal} kcal` : "–", emoji: "🔥" },
            { label: "Ø Netto-KH/Tag", wert: avgNettoKh > 0 ? `${avgNettoKh}g` : "–", emoji: "🍞" },
            { label: "Letzte Ketone", wert: letzteKetone ? `${letzteKetone.wert} mmol/L` : "–", emoji: "⚗️" },
            { label: "Mahlzeiten", wert: naehrwerte.length > 0 ? `${naehrwerte.length}` : "–", emoji: "🍽" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3 print-card" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg">{s.emoji}</span>
                <span className="text-xs" style={{ color: "#555" }}>{s.label}</span>
              </div>
              <div className="font-bold text-sm print-value" style={{ color: "#22c55e" }}>{s.wert}</div>
            </div>
          ))}
        </div>

        {/* Gewichtsverlauf Tabelle */}
        {gewichtSorted.length > 0 && (
          <div className="mb-5">
            <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>GEWICHTSVERLAUF ({gewichtSorted.length} Einträge)</div>
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="grid grid-cols-3 px-4 py-2 text-xs font-semibold" style={{ backgroundColor: "#2a2a2a", color: "#555" }}>
                <span>Datum</span><span>Gewicht</span><span>Veränderung</span>
              </div>
              <div className="max-h-48 overflow-y-auto no-print">
                {gewichtSorted.slice(-10).reverse().map((e, i, arr) => {
                  const prev = arr[i + 1];
                  const diff = prev ? Math.round((e.wert - prev.wert) * 10) / 10 : null;
                  return (
                    <div key={i} className="grid grid-cols-3 px-4 py-2 text-xs border-t" style={{ borderColor: "#2a2a2a" }}>
                      <span style={{ color: "#888" }}>{e.datum}</span>
                      <span className="font-semibold">{e.wert} kg</span>
                      <span style={{ color: diff === null ? "#555" : diff < 0 ? "#22c55e" : diff > 0 ? "#ef4444" : "#555" }}>
                        {diff === null ? "–" : diff < 0 ? `${diff} kg` : diff > 0 ? `+${diff} kg` : "±0"}
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Print-Vollversion */}
              <div className="print-only">
                {gewichtSorted.map((e, i, arr) => {
                  const prev = arr[i - 1];
                  const diff = prev ? Math.round((e.wert - prev.wert) * 10) / 10 : null;
                  return (
                    <div key={i} className="grid grid-cols-3 px-4 py-1.5 text-xs border-t print-card" style={{ borderColor: "#eee" }}>
                      <span>{e.datum}</span>
                      <span>{e.wert} kg</span>
                      <span>{diff === null ? "–" : diff < 0 ? `${diff} kg` : diff > 0 ? `+${diff} kg` : "±0"}</span>
                    </div>
                  );
                })}
              </div>
              {gewichtSorted.length > 10 && (
                <div className="px-4 py-2 text-xs text-center no-print" style={{ color: "#444" }}>
                  Zeigt letzte 10 von {gewichtSorted.length} Einträgen · Im Export alle enthalten
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ketone Tabelle */}
        {ketone.length > 0 && (
          <div className="mb-5">
            <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>KETON-MESSUNGEN ({ketone.length} Einträge)</div>
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="grid grid-cols-4 px-4 py-2 text-xs font-semibold" style={{ backgroundColor: "#2a2a2a", color: "#555" }}>
                <span>Datum</span><span>Ketone</span><span>Methode</span><span>GKI</span>
              </div>
              {[...ketone].sort((a, b) => b.datum.localeCompare(a.datum)).slice(0, 8).map((e, i) => {
                const gki = e.glukose ? Math.round((e.glukose / e.wert) * 10) / 10 : null;
                return (
                  <div key={i} className="grid grid-cols-4 px-4 py-2 text-xs border-t" style={{ borderColor: "#2a2a2a" }}>
                    <span style={{ color: "#888" }}>{e.datum}</span>
                    <span className="font-semibold" style={{ color: "#3b82f6" }}>{e.wert}</span>
                    <span style={{ color: "#555" }}>{e.methode}</span>
                    <span style={{ color: "#8b5cf6" }}>{gki ?? "–"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Export-Buttons */}
        {/* ─── Backup & Restore ─────────────────────────────────────────────────── */}
        <div className="text-xs font-semibold mb-3 no-print" style={{ color: "#555" }}>BACKUP & GERÄTEWECHSEL</div>
        <div className="rounded-2xl p-4 mb-5 no-print" style={{ background: "linear-gradient(135deg, #0d1a2e, #0a0d1a)", border: "1px solid #3b82f644" }}>
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">💾</span>
            <div>
              <div className="font-bold text-sm mb-0.5" style={{ color: "#60a5fa" }}>Gerätewechsel / PWA neu installieren</div>
              <div className="text-xs leading-relaxed" style={{ color: "#888" }}>
                Exportiere zuerst alle Daten vom alten Gerät, dann importiere sie auf dem neuen.
                So gehen Rezept-Werkstatt, Gewichtsverlauf und alle Einstellungen nicht verloren.
              </div>
            </div>
          </div>

          <button onClick={exportAllesJSON}
            className="w-full rounded-xl py-3 flex items-center justify-center gap-2 mb-2"
            style={{ backgroundColor: "#1e3a5f", border: "1px solid #3b82f644", color: "#60a5fa" }}>
            <span>⬇️</span>
            <span className="font-semibold text-sm">Alle Daten sichern (JSON)</span>
          </button>

          <label className="w-full rounded-xl py-3 flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: "#1a2a1a", border: "1px solid #22c55e44", color: "#22c55e" }}>
            <span>⬆️</span>
            <span className="font-semibold text-sm">Backup wiederherstellen (JSON)</span>
            <input type="file" accept=".json" className="hidden" onChange={importAusJSON} />
          </label>

          {importStatus !== "idle" && (
            <div className="mt-3 rounded-xl p-3 text-xs text-center"
              style={{
                backgroundColor: importStatus === "erfolg" ? "#0d2018" : "#1a0a0a",
                color: importStatus === "erfolg" ? "#22c55e" : "#ef4444"
              }}>
              {importMsg}
            </div>
          )}
        </div>

        <div className="text-xs font-semibold mb-3 no-print" style={{ color: "#555" }}>EXPORTIEREN</div>

        <div className="space-y-2 no-print">
          {/* PDF */}
          <button onClick={druckenPDF}
            className="w-full rounded-2xl p-4 flex items-center gap-3"
            style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
            <span className="text-2xl">📄</span>
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm" style={{ color: "#22c55e" }}>PDF für den Arzt</div>
              <div className="text-xs mt-0.5" style={{ color: "#555" }}>Übersicht mit Gewichtsverlauf und Statistiken · Drucken oder als PDF speichern</div>
            </div>
            <span className="text-xs font-bold" style={{ color: "#22c55e" }}>→</span>
          </button>

          {/* Gewicht CSV */}
          <button onClick={exportGewichtCSV}
            className="w-full rounded-2xl p-4 flex items-center gap-3"
            style={{ backgroundColor: "#1a1a1a" }}>
            <span className="text-2xl">⚖️</span>
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm">Gewichtsverlauf CSV</div>
              <div className="text-xs mt-0.5" style={{ color: "#555" }}>{gewicht.length} Einträge · Datum, Gewicht, Einheit</div>
            </div>
            <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "#2a2a2a", color: "#888" }}>CSV</span>
          </button>

          {/* Ernährung CSV */}
          <button onClick={exportNaehrwerteCSV}
            className="w-full rounded-2xl p-4 flex items-center gap-3"
            style={{ backgroundColor: "#1a1a1a" }}>
            <span className="text-2xl">🍽</span>
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm">Ernährungstagebuch CSV</div>
              <div className="text-xs mt-0.5" style={{ color: "#555" }}>{naehrwerte.length} Einträge · kcal, KH, Netto-KH, Eiweiß, Fett</div>
            </div>
            <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "#2a2a2a", color: "#888" }}>CSV</span>
          </button>

          {/* Ketone CSV */}
          {ketone.length > 0 && (
            <button onClick={exportKetoneCSV}
              className="w-full rounded-2xl p-4 flex items-center gap-3"
              style={{ backgroundColor: "#1a1a1a" }}>
              <span className="text-2xl">⚗️</span>
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm">Keton-Messungen CSV</div>
                <div className="text-xs mt-0.5" style={{ color: "#555" }}>{ketone.length} Messungen · Ketone, Glukose, GKI, Methode</div>
              </div>
              <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "#2a2a2a", color: "#888" }}>CSV</span>
            </button>
          )}

          {/* Alles exportieren */}
          <button onClick={exportAllesCSV}
            className="w-full rounded-2xl p-4 flex items-center gap-3"
            style={{ background: "linear-gradient(135deg, #1a0a2e, #0d1520)", border: "1px solid #8b5cf644" }}>
            <span className="text-2xl">📦</span>
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm" style={{ color: "#c4b5fd" }}>Alles auf einmal exportieren</div>
              <div className="text-xs mt-0.5" style={{ color: "#555" }}>Alle CSV-Dateien werden nacheinander heruntergeladen</div>
            </div>
            <span className="text-xs font-bold" style={{ color: "#8b5cf6" }}>→</span>
          </button>
        </div>

        {exportiert && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-semibold z-50"
            style={{ backgroundColor: "#22c55e", color: "#000" }}>
            ✓ Export gestartet
          </div>
        )}

        {/* Info */}
        <div className="mt-4 rounded-2xl p-4 no-print" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-xs font-semibold mb-2" style={{ color: "#555" }}>💡 HINWEISE</div>
          <div className="space-y-1.5">
            {[
              "JSON-Backup enthält alle Daten: Rezept-Werkstatt, Gewicht, Ernährung, Einstellungen",
              "CSV-Dateien lassen sich in Excel, Numbers oder Google Sheets öffnen",
              "PDF: Im Druckdialog 'Als PDF speichern' wählen",
              "Alle Daten bleiben auf deinem Gerät — kein Upload",
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs mt-0.5" style={{ color: "#22c55e" }}>✓</span>
                <span className="text-xs" style={{ color: "#888" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}


