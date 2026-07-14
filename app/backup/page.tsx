"use client";
import { useState } from "react";
import Link from "next/link";

export default function BackupPage() {
  const [importStatus, setImportStatus] = useState<"idle" | "erfolg" | "fehler">("idle");
  const [importMsg, setImportMsg] = useState("");
  const [exportiert, setExportiert] = useState(false);

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

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

    const anzahl = Object.keys(backup).filter(k => k.startsWith("ketome_")).length;

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vitaketo_backup_${today()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportiert(true);
    setImportMsg(`✓ ${anzahl} Datensätze gespeichert in vitaketo_backup_${today()}.json`);
    setImportStatus("erfolg");
    setTimeout(() => { setExportiert(false); setImportStatus("idle"); }, 4000);
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
        setImportMsg(`✓ ${count} Datensätze wiederhergestellt! Seite wird neu geladen...`);
        setImportStatus("erfolg");
        setTimeout(() => window.location.href = "/", 2500);
      } catch {
        setImportMsg("Fehler: Keine gültige VitaKeto-Backup-Datei.");
        setImportStatus("fehler");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <main className="min-h-screen px-4 py-6 pb-28" style={{ backgroundColor: "#0a0a0a" }}>
      <Link href="/" className="text-xs mb-6 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      <div className="text-5xl text-center mb-3">💾</div>
      <h1 className="text-2xl font-black text-center mb-1">Backup & Restore</h1>
      <p className="text-sm text-center mb-8" style={{ color: "#555" }}>
        Daten sichern oder auf neuem Gerät / neuer PWA wiederherstellen
      </p>

      {/* Schritt 1: Export */}
      <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="text-xs font-semibold mb-3 tracking-widest" style={{ color: "#555" }}>
          SCHRITT 1 — ALTES GERÄT / ALTE PWA
        </div>
        <p className="text-sm mb-4" style={{ color: "#ccc" }}>
          Tippe auf den Button und speichere die Datei. Die Datei enthält alle deine Daten: Rezept-Werkstatt, Gewichtsverlauf, Ernährung, Einstellungen.
        </p>
        <button
          onClick={exportAllesJSON}
          className="w-full rounded-2xl py-5 text-center font-bold text-lg"
          style={{ background: "linear-gradient(135deg, #1e3a5f, #0d2040)", border: "2px solid #3b82f6", color: "#60a5fa" }}
        >
          ⬇️ Alle Daten herunterladen
        </button>
      </div>

      {/* Schritt 2: Import */}
      <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="text-xs font-semibold mb-3 tracking-widest" style={{ color: "#555" }}>
          SCHRITT 2 — NEUES GERÄT / NEUE PWA
        </div>
        <p className="text-sm mb-4" style={{ color: "#ccc" }}>
          Öffne die gespeicherte Backup-Datei. Alle Daten werden sofort wiederhergestellt.
        </p>
        <label
          className="w-full rounded-2xl py-5 flex items-center justify-center font-bold text-lg cursor-pointer"
          style={{ background: "linear-gradient(135deg, #0d2018, #082010)", border: "2px solid #22c55e", color: "#22c55e" }}
        >
          ⬆️ Backup-Datei öffnen
          <input type="file" accept=".json" className="hidden" onChange={importAusJSON} />
        </label>
      </div>

      {/* Status */}
      {importStatus !== "idle" && (
        <div className="rounded-2xl p-4 text-sm text-center font-semibold"
          style={{
            backgroundColor: importStatus === "erfolg" ? "#0d2018" : "#1a0a0a",
            color: importStatus === "erfolg" ? "#22c55e" : "#ef4444",
            border: `1px solid ${importStatus === "erfolg" ? "#22c55e44" : "#ef444444"}`
          }}>
          {importMsg}
        </div>
      )}

      {/* Info */}
      <div className="mt-6 rounded-2xl p-4" style={{ backgroundColor: "#111" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "#444" }}>💡 HINWEIS</div>
        <div className="space-y-2 text-xs" style={{ color: "#666" }}>
          <p>• Die Datei wird nur auf deinem Gerät gespeichert — nichts geht in die Cloud</p>
          <p>• Wenn du die PWA neu installierst, gehen alle lokalen Daten verloren — immer zuerst sichern!</p>
          <p>• Das Backup enthält auch deine Rezept-Werkstatt-Einträge und deinen kompletten Gewichtsverlauf</p>
        </div>
      </div>
    </main>
  );
}
