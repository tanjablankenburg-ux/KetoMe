"use client";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [sichtbar, setSichtbar] = useState(true);
  const [ausblenden, setAusblenden] = useState(false);

  useEffect(() => {
    // Nur beim allerersten Aufruf in dieser Session zeigen
    if (sessionStorage.getItem("vitaketo_splash_gesehen")) {
      setSichtbar(false);
      return;
    }
    const t1 = setTimeout(() => setAusblenden(true), 2000);
    const t2 = setTimeout(() => {
      setSichtbar(false);
      sessionStorage.setItem("vitaketo_splash_gesehen", "1");
    }, 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!sichtbar) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        backgroundColor: "#0a0a0a",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transition: "opacity 0.6s ease",
        opacity: ausblenden ? 0 : 1,
        pointerEvents: ausblenden ? "none" : "all",
      }}
    >
      {/* Pulsierender Kreis */}
      <div style={{
        position: "absolute",
        width: 200, height: 200,
        borderRadius: "50%",
        backgroundColor: "#22c55e0a",
        animation: "puls 1.5s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        width: 140, height: 140,
        borderRadius: "50%",
        backgroundColor: "#22c55e14",
        animation: "puls 1.5s ease-in-out 0.3s infinite",
      }} />

      {/* Logo */}
      <div style={{
        fontSize: 80,
        lineHeight: 1,
        animation: "reinSchweben 0.7s ease-out forwards",
        marginBottom: 16,
        position: "relative",
      }}>
        🥑
      </div>

      {/* Name */}
      <div style={{
        fontSize: 32, fontWeight: 900,
        color: "#22c55e",
        letterSpacing: -1,
        animation: "reinSchweben 0.7s ease-out 0.2s both",
        position: "relative",
      }}>
        VitaKeto
      </div>
      <div style={{
        fontSize: 13,
        color: "#555",
        marginTop: 4,
        animation: "reinSchweben 0.7s ease-out 0.4s both",
        position: "relative",
      }}>
        by Carbbye
      </div>

      {/* Ladebalken */}
      <div style={{
        position: "absolute", bottom: 60,
        width: 120, height: 2,
        backgroundColor: "#1a1a1a",
        borderRadius: 2, overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          backgroundColor: "#22c55e",
          animation: "laden 2s ease-in-out forwards",
        }} />
      </div>

      <style>{`
        @keyframes puls {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.5; }
        }
        @keyframes reinSchweben {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes laden {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
