"use client";
import { useRouter } from "next/navigation";

export default function AgbPage() {
  const router = useRouter();

  return (
    <main className="px-4 py-6 pb-28 max-w-xl mx-auto">
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-sm mb-6"
        style={{ color: "#555" }}>
        ← Zurück
      </button>

      <h1 className="text-xl font-bold mb-1">AGB & Datenschutz</h1>
      <p className="text-xs mb-8" style={{ color: "#444" }}>VitaKeto by Carbbye · Stand: Juli 2026</p>

      <div className="space-y-6 text-sm leading-relaxed" style={{ color: "#aaa" }}>

        <section>
          <h2 className="font-bold mb-2" style={{ color: "#f5f5f5" }}>1. Anbieter</h2>
          <p>VitaKeto ist ein Angebot von Carbbye, Inhaberin Tanja Fanelli. Die App dient der persönlichen Ernährungsunterstützung im Rahmen einer ketogenen Ernährung.</p>
        </section>

        <section>
          <h2 className="font-bold mb-2" style={{ color: "#f5f5f5" }}>2. Nutzung der App</h2>
          <p>VitaKeto ist ausschließlich für den persönlichen Gebrauch bestimmt. Die in der App enthaltenen Informationen ersetzen keine medizinische oder ernährungswissenschaftliche Beratung. Bei gesundheitlichen Fragen wende dich an eine Ärztin oder einen Arzt.</p>
        </section>

        <section>
          <h2 className="font-bold mb-2" style={{ color: "#f5f5f5" }}>3. Datenschutz</h2>
          <p className="mb-2">Mit der Registrierung werden deine E-Mail-Adresse und dein Name gespeichert. Diese Daten werden ausschließlich zur Bereitstellung der App-Funktionen genutzt.</p>
          <p className="mb-2">Deine persönlichen Daten (Gewicht, Ernährungstagebuch, etc.) werden lokal auf deinem Gerät gespeichert und nicht an Dritte weitergegeben.</p>
          <p>Wir können dich per E-Mail zu relevanten Themen rund um die App kontaktieren — zum Beispiel bei wichtigen Updates oder Angeboten von Carbbye.</p>
        </section>

        <section>
          <h2 className="font-bold mb-2" style={{ color: "#f5f5f5" }}>4. KI-Funktionen</h2>
          <p>Die Funktion "Rezept per Foto" nutzt eine externe KI-Schnittstelle zur Bildanalyse. Dabei werden Fotos temporär verarbeitet, aber nicht dauerhaft gespeichert. Die Ergebnisse sind als Orientierung gedacht und können Fehler enthalten.</p>
        </section>

        <section>
          <h2 className="font-bold mb-2" style={{ color: "#f5f5f5" }}>5. Deine Rechte</h2>
          <p>Du hast das Recht auf Auskunft, Berichtigung und Löschung deiner gespeicherten Daten. Wende dich dazu an: <span style={{ color: "#22c55e" }}>hallo@carbbye.de</span></p>
        </section>

        <section>
          <h2 className="font-bold mb-2" style={{ color: "#f5f5f5" }}>6. Kontakt</h2>
          <p className="mb-2">Carbbye · <span style={{ color: "#22c55e" }}>hallo@carbbye.de</span></p>
          <p className="mb-1">Community & Direktkontakt:</p>
          <a href="https://telegram.me/vitaketo_carbbye_community" style={{ color: "#2aabee" }}>
            💬 Telegram-Gruppe: t.me/vitaketo_carbbye_community
          </a>
        </section>

      </div>
    </main>
  );
}

