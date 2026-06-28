"use client";
import { useState } from "react";

type InfoThema = {
  id: string;
  titel: string;
  icon: string;
  kurz: string;
  kategorie: string;
  inhalt: {
    absatz?: string;
    liste?: { titel: string; text: string }[];
    tipps?: string[];
    fazit?: string;
  }[];
};

const THEMEN: InfoThema[] = [
  {
    id: "was-ist-ketose",
    titel: "Was ist Ketose?",
    icon: "🔥",
    kurz: "Der Stoffwechselzustand, in dem dein Körper Fett als Hauptenergiequelle nutzt",
    kategorie: "Grundlagen",
    inhalt: [
      { absatz: "Ketose ist ein natürlicher Stoffwechselzustand deines Körpers. Normalerweise verbrennt dein Körper Kohlenhydrate (Glukose) als primäre Energiequelle. Wenn du die Kohlenhydratzufuhr stark reduzierst — auf unter 20–50 g pro Tag — wechselt dein Körper in einen alternativen Modus." },
      { absatz: "In der Ketose beginnt die Leber damit, gespeichertes Fett in sogenannte Ketonkörper umzuwandeln: Beta-Hydroxybutyrat (BHB), Acetoacetat und Aceton. Diese Ketone werden dann als Kraftstoff für Gehirn, Muskeln und alle anderen Organe genutzt." },
      {
        liste: [
          { titel: "Glukose-Modus (normal)", text: "Kohlenhydrate → Glukose → Energie. Blutzucker steigt und fällt ständig, Heißhunger entsteht." },
          { titel: "Keto-Modus (Ketose)", text: "Fett → Ketonkörper → stabile, lang anhaltende Energie. Kein Blutzucker-Achterbahn, weniger Hunger." },
        ],
      },
      {
        tipps: [
          "Ketose beginnt typischerweise nach 2–7 Tagen mit unter 20 g KH täglich",
          "Sport beschleunigt den Einstieg in die Ketose deutlich",
          "Intervallfasten kombiniert mit Keto = noch schnellerer Ketose-Einstieg",
          "Ketonkörper kannst du mit Urinteststreifen oder Blutmessgeräten messen",
        ],
      },
      { fazit: "Ketose ist kein gefährlicher Zustand — es ist der Urzustand des menschlichen Körpers, der über Jahrtausende genutzt wurde, wenn Nahrung knapp war." },
    ],
  },
  {
    id: "biohacking",
    titel: "Biohacking",
    icon: "🧬",
    kurz: "Deinen Körper und Geist mit gezielten Techniken auf das nächste Level bringen",
    kategorie: "Lifestyle",
    inhalt: [
      { absatz: "Biohacking bedeutet, deinen Körper wie ein System zu betrachten und gezielt zu optimieren — durch Ernährung, Schlaf, Bewegung, Kälte, Licht und mentale Techniken. Keto ist einer der stärksten Biohacks überhaupt." },
      {
        liste: [
          { titel: "Ernährungs-Hacks", text: "Ketogene Ernährung, Intervallfasten (16:8, OMAD), MCT-Öl, Bulletproof Coffee — alles, um Energie und Klarheit zu maximieren." },
          { titel: "Kälte-Exposition", text: "Kalte Duschen oder Eisbäder aktivieren braunes Fettgewebe, verbessern die Durchblutung und setzen Dopamin frei. 30–90 Sekunden kalt duschen reicht." },
          { titel: "Licht & Schlaf", text: "Morgens Sonnenlicht (10–30 Min) setzt die innere Uhr. Abends blaues Licht meiden → Melatonin-Produktion → tiefer Schlaf." },
          { titel: "Bewegung", text: "Kurze intensive Workouts (HIIT) steigern HGH und verbessern die Insulinsensitivität. Kombiniert mit Keto sehr wirkungsvoll." },
          { titel: "Mentales Training", text: "Meditation, Atemübungen (Wim Hof), Journaling — reduzieren Cortisol, stärken den Fokus." },
          { titel: "Supplementierung", text: "Magnesium, Omega-3, Vitamin D3/K2, Zink — auf Keto besonders relevant." },
        ],
      },
      { fazit: "Du musst nicht alles auf einmal machen. Starte mit Keto + gutem Schlaf + Morgen-Sonnenlicht — das allein verändert schon alles." },
    ],
  },
  {
    id: "ketose-erreichen",
    titel: "Ketose erreichen",
    icon: "🎯",
    kurz: "Schritt für Schritt in die Ketose kommen — was wirklich funktioniert",
    kategorie: "Grundlagen",
    inhalt: [
      { absatz: "In die Ketose zu kommen ist einfacher als gedacht — aber es braucht Konsequenz in den ersten Tagen. Dein Körper muss erst lernen, Fett effizient zu verbrennen (fat adaptation)." },
      {
        liste: [
          { titel: "Schritt 1: KH drastisch reduzieren", text: "Unter 20 g Netto-Kohlenhydrate pro Tag. Kein Brot, kein Zucker, keine Nudeln, kein Reis. Das ist die wichtigste Regel." },
          { titel: "Schritt 2: Fett erhöhen", text: "60–75% der Kalorien sollen aus Fett kommen. Keine Angst vor Fett — es ist jetzt dein Treibstoff." },
          { titel: "Schritt 3: Eiweiß moderat halten", text: "20–25% der Kalorien. Zu viel Eiweiß kann über Gluconeogenese den Ketoseprozess verlangsamen." },
          { titel: "Schritt 4: Elektrolyte auffüllen", text: "Salz, Magnesium, Kalium täglich supplementieren — besonders in der Eingewöhnungsphase." },
          { titel: "Schritt 5: Viel trinken", text: "Mindestens 2,5–3 Liter Wasser täglich. Keto entwässert stark." },
          { titel: "Bonus: Sport + Fasten", text: "Eine Trainingseinheit und/oder 16-stündiges Fasten beschleunigen den Glykogen-Abbau enorm." },
        ],
      },
      {
        tipps: [
          "Glykogen (Glukosespeicher) ist nach 1–3 Tagen leer → Ketose beginnt",
          "Volle fat adaptation (optimale Fettverbrennung) dauert 4–8 Wochen",
          "Meal Prep hilft enorm — wenn gesunde Optionen da sind, schummelt man weniger",
          "Tagebuch/Tracking führen: macht Fortschritte sichtbar und motiviert",
        ],
      },
    ],
  },
  {
    id: "keto-grippe",
    titel: "Keto-Grippe",
    icon: "🤒",
    kurz: "Was es ist, warum es passiert und wie du es schnell überwindest",
    kategorie: "Grundlagen",
    inhalt: [
      { absatz: "Die Keto-Grippe ist eine Sammlung von Symptomen, die in den ersten 3–10 Tagen auftreten können, wenn dein Körper von Glukose auf Fett umstellt. Nicht jeder bekommt sie — aber wenn, dann fühlt sie sich unangenehm an." },
      {
        liste: [
          { titel: "Symptome", text: "Kopfschmerzen, Müdigkeit, Schwindel, Gehirnnebel, Gereiztheit, Muskelkrämpfe, Schlafprobleme, Übelkeit." },
          { titel: "Ursache Nr. 1: Elektrolytmangel", text: "Keto entwässert. Mit dem Wasser gehen Natrium, Kalium und Magnesium verloren. Das verursacht die meisten Symptome." },
          { titel: "Ursache Nr. 2: Umbauphase", text: "Dein Gehirn und deine Zellen lernen gerade, Ketone statt Glukose zu nutzen. Das dauert ein paar Tage." },
        ],
      },
      {
        tipps: [
          "Salz!! — Brühe trinken, Essen salzen, Elektrolytdrinks (zuckerfrei)",
          "Magnesium abends nehmen — 300–400 mg gegen Krämpfe und Schlafprobleme",
          "Viel Wasser trinken — mindestens 2,5–3 Liter täglich",
          "Leichte Bewegung hilft — kein intensives Training in dieser Phase",
          "Geduld: nach 3–5 Tagen ist es bei den meisten vorbei",
          "MCT-Öl hilft dem Gehirn, schneller Ketone zu nutzen",
        ],
      },
      { fazit: "Die Keto-Grippe ist ein Zeichen, dass dein Körper sich verändert — kein Zeichen, dass Keto falsch ist. Elektrolyte sind der Schlüssel." },
    ],
  },
  {
    id: "elektrolyte",
    titel: "Elektrolyte auf Keto",
    icon: "⚡",
    kurz: "Warum Salz, Magnesium und Kalium auf Keto überlebenswichtig sind",
    kategorie: "Ernährung",
    inhalt: [
      { absatz: "Auf ketogener Ernährung scheidet dein Körper deutlich mehr Wasser und Elektrolyte aus als normal — weil Insulin sinkt und die Nieren weniger Natrium zurückhalten. Ohne Ausgleich kommen Krämpfe, Erschöpfung und Gehirnnebel." },
      {
        liste: [
          { titel: "Natrium (Salz)", text: "Wichtigstes Elektrolyt auf Keto. 3.000–5.000 mg täglich. Brühe trinken, Essen großzügig salzen, Himalaya-Salz. Kein Natrium = Kopfschmerzen und Schwindel." },
          { titel: "Magnesium", text: "300–400 mg täglich, am besten abends. Hilft gegen Muskelkrämpfe, fördert Schlaf, unterstützt über 300 Körperprozesse. Magnesiumglycinat oder -citrat sind gut verträglich." },
          { titel: "Kalium", text: "3.500–4.700 mg täglich. Aus Avocados, Blattgemüse, Lachs, Nüssen. Kaliumchlorid als Salzersatz möglich. Wichtig für Herzfunktion und Muskelarbeit." },
        ],
      },
      {
        tipps: [
          "Selbstgemachte Elektrolyt-Brühe: Wasser + Salz + Kaliumchlorid + Magnesium",
          "Avocados täglich: reich an Kalium und gesunden Fetten",
          "Keine zuckerhaltigen Elektrolytdrinks — die werfen dich aus der Ketose",
          "Besonders wichtig an Tagen mit Sport oder viel Schwitzen",
        ],
      },
    ],
  },
  {
    id: "intervallfasten",
    titel: "Intervallfasten (16:8)",
    icon: "⏰",
    kurz: "Wie 16 Stunden Pause die Fettverbrennung und Ketose dramatisch verbessern",
    kategorie: "Lifestyle",
    inhalt: [
      { absatz: "Beim 16:8-Intervallfasten fastest du 16 Stunden und isst in einem 8-Stunden-Fenster — zum Beispiel von 12 bis 20 Uhr. Kombiniert mit Keto ist es eines der wirkungsvollsten Tools für Fettabbau und Zellgesundheit." },
      {
        liste: [
          { titel: "Warum funktioniert es?", text: "In der Fastenzeit sinkt Insulin auf Minimum → maximale Fettverbrennung. Die Leber produziert mehr Ketonkörper. Autophagie (Zellreinigung) wird aktiviert." },
          { titel: "Typischer Tagesablauf", text: "6:00 Aufstehen — schwarzer Kaffee oder Bulletproof Coffee. 12:00 Erste Mahlzeit (groß und sättigend). 18:00–20:00 Letzte Mahlzeit. Danach Fasten bis zum nächsten Mittag." },
          { titel: "Was bricht das Fasten?", text: "Kalorien brechen das Fasten. Wasser, schwarzer Kaffee, ungesüßter Tee und Elektrolyte (ohne Kalorien) sind erlaubt. Bulletproof Coffee ist umstritten — hält metabolisch, bricht formal das Fasten." },
          { titel: "Kombiniert mit Keto", text: "Keto + 16:8 = doppelte Wirkung. Keto sorgt dafür, dass du in der Fastenzeit kaum Hunger hast. Wer auf Keto ist, fastet oft unbewusst länger." },
        ],
      },
      {
        tipps: [
          "Starte sanft: erstmal mit 12:12, dann 14:10, dann 16:8",
          "In der Fastenzeit viel Wasser trinken — hält den Hunger weg",
          "Sport nüchtern (im Fastenfenster) maximiert Fettverbrennung",
          "Auf Schlaf setzen: 8 h Schlaf = 8 h Fasten automatisch",
        ],
      },
    ],
  },
  {
    id: "makros",
    titel: "Makros berechnen",
    icon: "🧮",
    kurz: "Wie viel Fett, Eiweiß und Kohlenhydrate du auf Keto täglich brauchst",
    kategorie: "Ernährung",
    inhalt: [
      { absatz: "Makronährstoffe (kurz: Makros) sind Fett, Eiweiß und Kohlenhydrate. Auf Keto gilt eine spezifische Verteilung, die den Körper in Ketose hält und dabei Muskeln schützt." },
      {
        liste: [
          { titel: "Kohlenhydrate: 5–10 %", text: "Max. 20–50 g Netto-KH täglich. Netto-KH = Gesamt-KH minus Ballaststoffe. Das ist die wichtigste Zahl — halte sie ein." },
          { titel: "Fett: 60–75 %", text: "Fett ist dein primärer Energieträger. Olivenöl, Butter, Avocado, Käse, Nüsse, Fleisch. Keine Angst davor — Fett sättigt und hält die Ketose aufrecht." },
          { titel: "Eiweiß: 20–25 %", text: "Genug um Muskeln zu erhalten, aber nicht zu viel — überschüssiges Eiweiß wird zu Glukose umgewandelt (Gluconeogenese). Ca. 1,2–1,7 g pro kg Körpergewicht." },
        ],
      },
      {
        tipps: [
          "Beispiel 70 kg Person: ~140 g Eiweiß, ~160 g Fett, ~20 g KH täglich",
          "Verwende eine Tracking-App (z.B. Cronometer) für die ersten Wochen",
          "Kalorienzählen ist nicht zwingend nötig — Keto sättigt natürlich",
          "Nach der Eingewöhnung (4–8 Wochen) läuft es meist von selbst",
        ],
      },
      { fazit: "Starte einfach: Unter 20 g KH, viel Fett, moderates Eiweiß. Den Rest passt du mit der Zeit an." },
    ],
  },
  {
    id: "keto-sport",
    titel: "Keto & Sport",
    icon: "🏋️",
    kurz: "Training auf Ketose — was funktioniert, was nicht, und wie du beides maximierst",
    kategorie: "Fitness",
    inhalt: [
      { absatz: "Sport auf Keto ist möglich und sehr effektiv — aber die ersten 2–4 Wochen können sich Kraft und Ausdauer schlechter anfühlen, weil dein Körper noch lernt, Fett effizient zu verbrennen. Danach profitierst du enorm." },
      {
        liste: [
          { titel: "Ausdauertraining", text: "Ideal für Keto. Nach der Anpassungsphase verbrennen Läufer, Radfahrer und Schwimmer auf Keto mehr Fett als je zuvor. Stabiler Energielevel, kein 'Hungerast'." },
          { titel: "Krafttraining", text: "Gut möglich auf Keto. Muskeln können Ketonkörper und Fett als Energie nutzen. Eiweiß moderat erhöhen an Trainingstagen (bis 2 g/kg KG)." },
          { titel: "HIIT", text: "Funktioniert sehr gut — kurze intensive Einheiten verbessern die Insulinsensitivität und beschleunigen die Fettverbrennung." },
          { titel: "Targeted Keto (TKD)", text: "An intensiven Trainingstagen 20–30 g schnelle KH direkt vor dem Training. Nur für sehr intensive Einheiten nötig." },
        ],
      },
      {
        tipps: [
          "Gib deinem Körper 4–8 Wochen zur Anpassung bevor du Leistung beurteilst",
          "Creatine auf Keto ist sehr empfehlenswert — unterstützt Kraftleistung",
          "Nüchterntraining (im Fastenfenster) maximiert Fettverbrennung",
          "Mehr Elektrolyte an Trainingstagen — du schwitzt und verlierst mehr",
          "BCAAs können vor dem Training helfen Muskelabbau zu verhindern",
        ],
      },
    ],
  },
  {
    id: "ketone-messen",
    titel: "Ketone messen",
    icon: "🩸",
    kurz: "Wie du weißt, ob du wirklich in Ketose bist — drei Methoden im Vergleich",
    kategorie: "Grundlagen",
    inhalt: [
      { absatz: "Zu wissen, ob du in Ketose bist, gibt dir Sicherheit und Motivation. Es gibt drei Methoden, jede mit Vor- und Nachteilen." },
      {
        liste: [
          { titel: "1. Urinteststreifen (günstig)", text: "Messen Acetoacetat im Urin. Günstig und einfach (ca. 10–15 € für 100 Stück). Nicht sehr präzise, zeigen nach Wochen weniger an (Körper verwertet Ketone effizienter). Gut für den Einstieg." },
          { titel: "2. Atemtester (mittel)", text: "Messen Aceton in der Ausatemluft. Einmalige Anschaffung (40–80 €). Keine Verbrauchsmaterialien. Mittelgenau, beeinflusst durch Hydration." },
          { titel: "3. Blutmessgerät (präzise)", text: "Messen Beta-Hydroxybutyrat (BHB) direkt im Blut. Genaueste Methode. Gerät ca. 40 €, Teststreifen ca. 1–2 € pro Test. Wie ein Blutzuckermessgerät." },
        ],
      },
      {
        tipps: [
          "Leichte Ketose: 0,5–1,5 mmol/L BHB",
          "Optimale Ketose: 1,5–3,0 mmol/L BHB",
          "Diabetische Ketoazidose (gefährlich): über 10 mmol/L — das ist etwas völlig anderes!",
          "Messe morgens nüchtern für konsistente Werte",
          "Nach Wochen sinken Urinwerte — das bedeutet NICHT, dass du raus bist",
        ],
      },
    ],
  },
  {
    id: "autophagie",
    titel: "Autophagie",
    icon: "♻️",
    kurz: "Wie dein Körper alte und beschädigte Zellen abbaut und sich selbst erneuert",
    kategorie: "Biohacking",
    inhalt: [
      { absatz: "Autophagie (griechisch: 'sich selbst essen') ist der natürliche Selbstreinigungsprozess deiner Zellen. Beschädigte Zellteile, Proteinmüll und sogar Krankheitserreger werden abgebaut und recycelt. Nobel-Preis 2016 für diese Entdeckung." },
      { absatz: "Keto und Fasten sind die stärksten bekannten Auslöser für Autophagie. Wenn Insulin und Glukose niedrig sind, schaltet der Körper auf 'Selbstreparatur-Modus'." },
      {
        liste: [
          { titel: "Wann beginnt Autophagie?", text: "Ab ca. 16–18 Stunden Fasten. Auf Keto wird sie auch tagsüber verstärkt (niedrige Insulinspiegel). Intensiver nach 24–48 h Fasten." },
          { titel: "Vorteile", text: "Zellerneuerung, Anti-Aging-Effekte, verbesserte Gehirnfunktion, Schutz vor Krankheiten (Alzheimer, Krebs), besseres Immunsystem." },
          { titel: "Was blockiert Autophagie?", text: "Insulin! Jedes Mal wenn du isst (besonders KH und Protein), stoppt Autophagie. Deshalb sind Fastenperioden so wertvoll." },
        ],
      },
      {
        tipps: [
          "16:8 Fasten täglich aktiviert leichte Autophagie",
          "Kaffee (schwarz) verlängert und verstärkt Autophagie im Fastenfenster",
          "Sport verstärkt Autophagie in Muskelzellen",
          "Einmal pro Woche 24 h fasten = tiefe Autophagie",
        ],
      },
      { fazit: "Autophagie ist buchstäblich Anti-Aging von innen. Keto + Fasten ist der natürlichste Weg, sie zu aktivieren." },
    ],
  },
  {
    id: "mct-oel",
    titel: "MCT-Öl",
    icon: "🫙",
    kurz: "Der Keto-Turbo — was MCT-Öl ist und warum es so wirkungsvoll ist",
    kategorie: "Ernährung",
    inhalt: [
      { absatz: "MCT steht für 'Medium Chain Triglycerides' — mittelkettige Fettsäuren. Im Gegensatz zu normalen Fetten werden MCTs sofort in der Leber zu Ketonen umgewandelt — ohne Verdauungsumweg. Das macht sie zur schnellsten Ketonquelle überhaupt." },
      {
        liste: [
          { titel: "C8 (Caprylsäure)", text: "Wirkungsvollstes MCT. Wird am schnellsten zu Ketonen. Premium-MCT-Öl enthält hauptsächlich C8." },
          { titel: "C10 (Caprinsäure)", text: "Etwas langsamer als C8, aber ebenfalls sehr effektiv. Günstiger." },
          { titel: "C12 (Laurinsäure)", text: "Häufig in Kokosöl. Wird langsamer verarbeitet, weniger ketogen als C8/C10." },
        ],
      },
      {
        tipps: [
          "Starte mit 1 TL täglich — zu viel auf einmal verursacht Magenprobleme",
          "Steigere langsam auf 1–3 EL täglich",
          "Ideal im Bulletproof Coffee morgens für sofortige mentale Klarheit",
          "Nicht zum Braten — MCT-Öl hat einen niedrigen Rauchpunkt",
          "C8-MCT-Öl ist teurer aber deutlich effektiver als normales Kokosöl",
        ],
      },
      { fazit: "MCT-Öl ist kein Muss, aber ein echter Game-Changer — besonders in der Eingewöhnungsphase und morgens für geistigen Fokus." },
    ],
  },
  {
    id: "bulletproof-coffee",
    titel: "Bulletproof Coffee",
    icon: "☕",
    kurz: "Das Keto-Frühstück: Kaffee mit Butter und MCT-Öl — warum es so gut funktioniert",
    kategorie: "Ernährung",
    inhalt: [
      { absatz: "Bulletproof Coffee ist schwarzer Kaffee, der mit hochwertiger Butter (Ghee) und MCT-Öl gemixt wird. Er ersetzt das Frühstück, hält stundenlang satt, liefert sofortige Energie und kurbelt die Ketonproduktion an." },
      {
        liste: [
          { titel: "Das Rezept", text: "250 ml frisch gebrühter Kaffee + 1 EL Ghee oder Weidebutter + 1 EL MCT-Öl (oder Kokosöl). Alles in einen Mixer — 30 Sekunden. Nicht umrühren — muss schaumig werden." },
          { titel: "Warum Butter?", text: "Weidebutter enthält Omega-3, CLA und fettlösliche Vitamine. Das Fett verlangsamt die Koffein-Aufnahme — längere, gleichmäßigere Energie ohne Absturz." },
          { titel: "Warum MCT-Öl?", text: "Sofortige Ketonproduktion → mentale Klarheit binnen 30 Minuten. Kombiniert mit Koffein ein sehr wirkungsvoller Fokus-Boost." },
          { titel: "Passt es zum Fasten?", text: "Formal bricht es das Fasten (Kalorien). Metabolisch hält es die Ketose und unterdrückt Hunger. Die meisten Keto-Experten erlauben es im Fastenfenster." },
        ],
      },
      {
        tipps: [
          "Unbedingt mixen — nicht nur umrühren, sonst trennt es sich",
          "Ghee statt Butter = haltbarer, reiner Buttergeschmack",
          "Wer keinen MCT-Mag verträgt: mit ½ TL starten",
          "Kollagenpulver dazugeben für Haut, Gelenke und Haare",
          "Mit Zimt oder Vanille (ohne Zucker) verfeinern",
        ],
      },
    ],
  },
  {
    id: "keto-mythen",
    titel: "Keto-Mythen",
    icon: "❌",
    kurz: "Die häufigsten Missverständnisse über Keto — und was wirklich stimmt",
    kategorie: "Grundlagen",
    inhalt: [
      {
        liste: [
          { titel: "❌ Mythos: Fett macht fett", text: "✅ Falsch. Fett in Kombination mit Kohlenhydraten macht fett. Reines Fett ohne KH führt zu Ketose und Fettverbrennung. Dein Körper verbrennt Fett als Energie — es wird nicht einfach gespeichert." },
          { titel: "❌ Mythos: Keto schadet den Nieren", text: "✅ Falsch für gesunde Menschen. Nur bei vorgeschädigten Nieren ist erhöhtes Eiweiß ein Thema — Keto selbst ist kein Problem. Viel trinken ist trotzdem wichtig." },
          { titel: "❌ Mythos: Das Gehirn braucht zwingend Glukose", text: "✅ Falsch. Das Gehirn funktioniert hervorragend mit Ketonkörpern — manche Studien zeigen sogar verbesserte Gehirnleistung auf Keto." },
          { titel: "❌ Mythos: Keto ist nur Fleisch", text: "✅ Falsch. Keto funktioniert auch vegetarisch oder vegan (mit mehr Planung). Eier, Käse, Nüsse, Avocados, Öle und Gemüse sind alle keto-freundlich." },
          { titel: "❌ Mythos: Ketose = diabetische Ketoazidose", text: "✅ Falsch und wichtig! Ernährungsbedingte Ketose (0,5–3 mmol/L) ist völlig sicher. Diabetische Ketoazidose tritt nur bei Typ-1-Diabetikern auf (über 10 mmol/L)." },
          { titel: "❌ Mythos: Keto ist nicht nachhaltig", text: "✅ Kommt auf die Person an. Viele essen seit Jahren keto, fühlen sich besser als je zuvor und haben keine Mangelerscheinungen — wenn Gemüse und Elektrolyte stimmen." },
        ],
      },
      { fazit: "Keto ist eine der am besten erforschten Ernährungsformen überhaupt — ursprünglich in der Medizin entwickelt (Epilepsie), heute für Gewichtsmanagement, Gehirngesundheit und Longevity eingesetzt." },
    ],
  },
  {
    id: "schlaf-keto",
    titel: "Schlaf & Keto",
    icon: "😴",
    kurz: "Wie guter Schlaf Ketose, Fettverbrennung und Hormonhaushalt beeinflusst",
    kategorie: "Biohacking",
    inhalt: [
      { absatz: "Schlaf ist der unterschätzteste Biohack. 7–9 Stunden Tiefschlaf sind für Fettverbrennung, Muskelaufbau, Hormonbalance und mentale Klarheit absolut entscheidend — auch auf Keto." },
      {
        liste: [
          { titel: "Cortisol & Ketose", text: "Schlechter Schlaf erhöht Cortisol. Cortisol erhöht den Blutzucker (auch ohne Essen!) und kann dich aus der Ketose werfen. 7 h Schlaf = bessere Ketose als 5 h Schlaf." },
          { titel: "Wachstumshormon", text: "HGH (Human Growth Hormone) wird hauptsächlich im Tiefschlaf ausgeschüttet. Keto + guter Schlaf = maximale HGH-Produktion = Fettabbau und Muskelschutz." },
          { titel: "Blaues Licht meiden", text: "2 h vor dem Schlafen: kein Handy-Bildschirm ohne Blaulichtfilter. Blaues Licht stoppt Melatonin-Produktion und verschlechtert die Schlafqualität massiv." },
          { titel: "Morgen-Licht", text: "10–30 Minuten Sonnenlicht direkt nach dem Aufwachen setzt die innere Uhr, verbessert Schlafqualität in der folgenden Nacht und steigert Cortisol (morgens gut!) für Energie." },
        ],
      },
      {
        tipps: [
          "Magnesium abends (300–400 mg) verbessert nachweislich die Schlafqualität",
          "Kühleres Schlafzimmer (16–19°C) = tieferer Schlaf",
          "Keto selbst verbessert oft den Schlaf nach der Eingewöhnungsphase",
          "Keine großen Mahlzeiten kurz vor dem Schlafen",
          "Konstante Schlafenszeit ist wichtiger als die Stundenzahl",
        ],
      },
    ],
  },
];

const KATEGORIEN = ["Alle", "Grundlagen", "Ernährung", "Lifestyle", "Biohacking", "Fitness"];

const KAT_FARBEN: Record<string, string> = {
  Grundlagen: "#22c55e",
  Ernährung: "#f59e0b",
  Lifestyle: "#8b5cf6",
  Biohacking: "#06b6d4",
  Fitness: "#ef4444",
};

export default function InfoPage() {
  const [offenId, setOffenId] = useState<string | null>(null);
  const [kategorie, setKategorie] = useState("Alle");

  const offen = THEMEN.find(t => t.id === offenId);

  if (offen) {
    return (
      <main className="px-4 py-6 pb-28">
        <button onClick={() => setOffenId(null)}
          className="flex items-center gap-2 mb-4 text-sm"
          style={{ color: "#22c55e" }}>
          ← Zurück
        </button>

        <div className="text-5xl mb-3 text-center">{offen.icon}</div>
        <h1 className="text-xl font-bold mb-2">{offen.titel}</h1>
        <span className="inline-block text-xs px-2 py-1 rounded-full mb-5 font-medium"
          style={{ backgroundColor: KAT_FARBEN[offen.kategorie] + "22", color: KAT_FARBEN[offen.kategorie] }}>
          {offen.kategorie}
        </span>

        <div className="space-y-5">
          {offen.inhalt.map((block, i) => (
            <div key={i}>
              {block.absatz && (
                <p className="text-sm leading-relaxed" style={{ color: "#ccc" }}>{block.absatz}</p>
              )}
              {block.liste && (
                <div className="space-y-3">
                  {block.liste.map((item, j) => (
                    <div key={j} className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
                      <div className="font-semibold text-sm mb-1">{item.titel}</div>
                      <div className="text-sm" style={{ color: "#888" }}>{item.text}</div>
                    </div>
                  ))}
                </div>
              )}
              {block.tipps && (
                <div className="rounded-2xl p-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
                  <div className="text-xs font-semibold mb-3" style={{ color: "#22c55e" }}>💡 Praktische Tipps</div>
                  <ul className="space-y-2">
                    {block.tipps.map((tipp, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <span style={{ color: "#22c55e" }}>•</span>
                        <span style={{ color: "#ccc" }}>{tipp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {block.fazit && (
                <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1010", border: "1px solid #7f1d1d" }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: "#f87171" }}>📌 Fazit</div>
                  <p className="text-sm" style={{ color: "#fca5a5" }}>{block.fazit}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    );
  }

  const gefiltert = THEMEN.filter(t => kategorie === "Alle" || t.kategorie === kategorie);

  return (
    <main className="px-4 py-6 pb-28">
      <h1 className="text-xl font-bold mb-1">📚 Keto Wissen</h1>
      <p className="text-sm mb-5" style={{ color: "#666" }}>{THEMEN.length} Themen — tippe zum Lesen</p>

      <div className="flex gap-2 overflow-x-auto mb-5 pb-1">
        {KATEGORIEN.map(k => (
          <button key={k} onClick={() => setKategorie(k)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: kategorie === k ? (KAT_FARBEN[k] || "#22c55e") : "#1a1a1a",
              color: kategorie === k ? "#000" : "#888",
            }}>
            {k}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {gefiltert.map(t => (
          <button key={t.id} onClick={() => setOffenId(t.id)}
            className="w-full rounded-2xl p-4 text-left flex items-start gap-4"
            style={{ backgroundColor: "#1a1a1a" }}>
            <span className="text-3xl flex-shrink-0">{t.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-sm">{t.titel}</span>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: KAT_FARBEN[t.kategorie] + "22", color: KAT_FARBEN[t.kategorie] }}>
                  {t.kategorie}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#666" }}>{t.kurz}</p>
            </div>
            <span className="flex-shrink-0 mt-1" style={{ color: "#444" }}>›</span>
          </button>
        ))}
      </div>
    </main>
  );
}
