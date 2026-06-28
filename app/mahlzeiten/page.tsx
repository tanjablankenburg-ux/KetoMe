"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { REZEPTE } from "../rezepte/page";
import type { Rezept } from "../rezepte/page";

type Mahlzeit = {
  id: string;
  name: string;
  zutaten: string;
  kcal?: number;
  kh?: number;
  notiz?: string;
};

export default function MahlzeitenPage() {
  const router = useRouter();
  const [mahlzeiten, setMahlzeiten] = useState<Mahlzeit[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [customRezepte, setCustomRezepte] = useState<Rezept[]>([]);
  const [tab, setTab] = useState<"rezepte" | "eigene">("rezepte");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [zutaten, setZutaten] = useState("");
  const [kcal, setKcal] = useState("");
  const [kh, setKh] = useState("");
  const [notiz, setNotiz] = useState("");

  useEffect(() => {
    const d = localStorage.getItem("ketome_mahlzeiten");
    if (d) setMahlzeiten(JSON.parse(d));
    const b = localStorage.getItem("ketome_bookmarks");
    if (b) setBookmarks(JSON.parse(b));
    const c = localStorage.getItem("ketome_custom_rezepte");
    if (c) setCustomRezepte(JSON.parse(c));
  }, []);

  function speichern() {
    if (!name || !zutaten) return;
    const neu: Mahlzeit = {
      id: Date.now().toString(),
      name, zutaten,
      kcal: kcal ? parseInt(kcal) : undefined,
      kh: kh ? parseFloat(kh) : undefined,
      notiz,
    };
    const alle = [...mahlzeiten, neu];
    setMahlzeiten(alle);
    localStorage.setItem("ketome_mahlzeiten", JSON.stringify(alle));
    setName(""); setZutaten(""); setKcal(""); setKh(""); setNotiz("");
    setShowForm(false);
  }

  function loeschen(id: string) {
    const alle = mahlzeiten.filter(m => m.id !== id);
    setMahlzeiten(alle);
    localStorage.setItem("ketome_mahlzeiten", JSON.stringify(alle));
  }

  const alleRezepte = [...REZEPTE, ...customRezepte];
  const favoritenRezepte = alleRezepte.filter(r => bookmarks.includes(r.id));

  return (
    <main className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">⭐ Favoriten</h1>
          <p className="text-sm" style={{ color: "#666" }}>Meine Lieblingsmahlzeiten</p>
        </div>
        {tab === "eigene" && (
          <button onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl font-semibold text-sm text-black"
            style={{ backgroundColor: "#22c55e" }}>
            + Neu
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => setTab("rezepte")}
          className="flex-1 py-2 rounded-xl text-sm font-medium"
          style={{ backgroundColor: tab === "rezepte" ? "#22c55e" : "#1a1a1a", color: tab === "rezepte" ? "#000" : "#888" }}>
          ⭐ Rezept-Favoriten ({favoritenRezepte.length})
        </button>
        <button onClick={() => setTab("eigene")}
          className="flex-1 py-2 rounded-xl text-sm font-medium"
          style={{ backgroundColor: tab === "eigene" ? "#22c55e" : "#1a1a1a", color: tab === "eigene" ? "#000" : "#888" }}>
          📝 Eigene ({mahlzeiten.length})
        </button>
      </div>

      {/* Rezept-Favoriten Tab */}
      {tab === "rezepte" && (
        <>
          {favoritenRezepte.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">⭐</div>
              <p style={{ color: "#666" }}>Noch keine Rezept-Favoriten.</p>
              <p className="text-sm mt-2" style={{ color: "#444" }}>Tippe auf ☆ Favorit in einem Rezept, um es hier zu speichern.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {favoritenRezepte.map(r => (
                <button key={r.id} onClick={() => router.push(`/rezepte?id=${r.id}`)}
                  className="w-full rounded-2xl p-4 text-left flex items-center gap-4"
                  style={{ backgroundColor: "#1a1a1a" }}>
                  <span className="text-3xl">{r.bild}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-0.5 truncate">{r.name}</div>
                    <div className="text-xs" style={{ color: "#555" }}>{r.kategorie} · {r.zeit}</div>
                    <div className="flex gap-3 text-xs mt-1">
                      <span style={{ color: r.kh <= 5 ? "#22c55e" : r.kh <= 10 ? "#f59e0b" : "#ef4444" }}>{r.kh}g KH</span>
                      <span style={{ color: "#555" }}>{r.kcal} kcal</span>
                    </div>
                  </div>
                  <span style={{ color: "#444" }}>›</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Eigene Mahlzeiten Tab */}
      {tab === "eigene" && (
        <>
          {showForm && (
            <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-sm font-semibold mb-4" style={{ color: "#22c55e" }}>Neue Mahlzeit speichern</div>
              <div className="space-y-3">
                {[
                  { label: "Name *", value: name, set: setName, placeholder: "z.B. Lachs mit Avocado" },
                  { label: "Zutaten *", value: zutaten, set: setZutaten, placeholder: "z.B. Lachs, Avocado, Olivenöl, Salz" },
                  { label: "Kalorien (kcal)", value: kcal, set: setKcal, placeholder: "z.B. 450" },
                  { label: "Kohlenhydrate (g)", value: kh, set: setKh, placeholder: "z.B. 3" },
                  { label: "Notiz / Zubereitung", value: notiz, set: setNotiz, placeholder: "z.B. 15 Min bei 180° backen" },
                ].map(({ label, value, set, placeholder }) => (
                  <div key={label}>
                    <div className="text-xs mb-1" style={{ color: "#888" }}>{label}</div>
                    <input value={value} onChange={e => set(e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-4 py-2 rounded-xl outline-none text-white text-sm"
                      style={{ backgroundColor: "#2a2a2a" }} />
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-xl text-sm"
                    style={{ backgroundColor: "#2a2a2a", color: "#888" }}>
                    Abbrechen
                  </button>
                  <button onClick={speichern} disabled={!name || !zutaten}
                    className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
                    style={{ backgroundColor: name && zutaten ? "#22c55e" : "#333", color: name && zutaten ? "#000" : "#666" }}>
                    Speichern
                  </button>
                </div>
              </div>
            </div>
          )}

          {mahlzeiten.length === 0 && !showForm ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📝</div>
              <p style={{ color: "#666" }}>Noch keine eigenen Mahlzeiten.</p>
              <p className="text-sm mt-2" style={{ color: "#444" }}>Tippe auf + Neu um eine Mahlzeit zu speichern.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mahlzeiten.map(m => (
                <div key={m.id} className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold">{m.name}</div>
                    <button onClick={() => loeschen(m.id)} className="text-lg" style={{ color: "#444" }}>✕</button>
                  </div>
                  <div className="text-sm mb-2" style={{ color: "#888" }}>{m.zutaten}</div>
                  {(m.kcal || m.kh !== undefined) && (
                    <div className="flex gap-3 text-xs">
                      {m.kcal && <span style={{ color: "#666" }}>{m.kcal} kcal</span>}
                      {m.kh !== undefined && (
                        <span style={{ color: m.kh <= 5 ? "#22c55e" : m.kh <= 10 ? "#f59e0b" : "#ef4444" }}>
                          {m.kh}g KH
                        </span>
                      )}
                    </div>
                  )}
                  {m.notiz && (
                    <div className="text-xs mt-2 p-2 rounded-lg" style={{ backgroundColor: "#2a2a2a", color: "#888" }}>
                      {m.notiz}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
