"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export type Portionierung = {
  art: "gramm" | "scheiben" | "stueck" | "portionen";
  gesamtgewicht: number;  // Gesamtgewicht des fertigen Rezepts in g
  anzahl: number;         // Anzahl Scheiben/Stück/Portionen
};

export type Rezept = {
  id: string;
  name: string;
  kategorie: "Frühstück" | "Mittagessen" | "Abendessen" | "Snack" | "Dessert" | "Salat";
  kcal: number;
  kh: number;
  eiweiss: number;
  fett: number;
  zeit: string;
  schwierigkeit: "Einfach" | "Mittel" | "Aufwendig";
  zutaten: string[];
  zubereitung: string[];
  bild: string;
  tags: string[];
  portionierung?: Portionierung;
};

export const REZEPTE: Rezept[] = [

  // ─── FRÜHSTÜCK ────────────────────────────────────────────────────────────
  {
    id: "bulletproof-coffee",
    name: "Bulletproof Coffee",
    kategorie: "Frühstück",
    kcal: 230, kh: 0, eiweiss: 1, fett: 26,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "☕",
    tags: ["keto", "fasten", "energie"],
    zutaten: ["250 ml starker Kaffee", "1 EL Ghee oder Weidebutter", "1 EL MCT-Öl", "optional: Zimt"],
    zubereitung: ["Kaffee frisch brühen.", "Alle Zutaten in einen Mixer geben.", "30 Sekunden auf höchster Stufe mixen bis cremig-schaumig.", "Sofort trinken — hält stundenlang satt."],
  },
  {
    id: "keto-omelette",
    name: "Käse-Kräuter-Omelett",
    kategorie: "Frühstück",
    kcal: 380, kh: 2, eiweiss: 24, fett: 30,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["keto", "eier", "frühstück"],
    zutaten: ["3 Eier", "50 g Gouda gerieben", "2 EL Butter", "1 Handvoll Spinat", "Salz, Pfeffer", "frische Kräuter nach Wahl"],
    zubereitung: ["Eier mit Salz und Pfeffer verquirlen.", "Butter in Pfanne bei mittlerer Hitze schmelzen.", "Eimasse eingießen und stocken lassen.", "Käse und Spinat auf eine Hälfte geben.", "Omelett zusammenfalten und servieren."],
  },
  {
    id: "avocado-ei",
    name: "Avocado mit Spiegelei",
    kategorie: "Frühstück",
    kcal: 350, kh: 4, eiweiss: 14, fett: 30,
    zeit: "8 Min", schwierigkeit: "Einfach",
    bild: "🥑",
    tags: ["keto", "schnell", "avocado"],
    zutaten: ["1 reife Avocado", "2 Eier", "1 EL Olivenöl", "Salz, Pfeffer", "Chiliflocken optional", "Zitronensaft"],
    zubereitung: ["Avocado halbieren, Kern entfernen und in Scheiben schneiden.", "Eier in Olivenöl als Spiegeleier braten.", "Avocado mit Zitrone, Salz und Pfeffer würzen.", "Eier daneben anrichten."],
  },
  {
    id: "chia-pudding",
    name: "Keto Chia-Pudding",
    kategorie: "Frühstück",
    kcal: 290, kh: 6, eiweiss: 9, fett: 22,
    zeit: "5 Min + 8 h", schwierigkeit: "Einfach",
    bild: "🥛",
    tags: ["keto", "vorbereitung", "süß"],
    zutaten: ["4 EL Chiasamen", "250 ml Kokosmilch (vollfett)", "1 TL Vanilleextrakt", "Stevia nach Geschmack", "Himbeeren zum Garnieren"],
    zubereitung: ["Chiasamen mit Kokosmilch, Vanille und Stevia mischen.", "15 Minuten stehen lassen, dann nochmal rühren.", "Über Nacht im Kühlschrank quellen lassen.", "Morgens mit Himbeeren servieren."],
  },
  {
    id: "keto-pancakes",
    name: "Keto Pancakes (Mandelmehl)",
    kategorie: "Frühstück",
    kcal: 340, kh: 5, eiweiss: 16, fett: 28,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥞",
    tags: ["keto", "süß", "wochenende"],
    zutaten: ["100 g Mandelmehl", "2 Eier", "50 g Frischkäse", "1 TL Backpulver", "Stevia", "Butter zum Braten", "Beeren + Sahne zum Garnieren"],
    zubereitung: ["Alle Zutaten zu einem glatten Teig mischen.", "Butter in Pfanne bei mittlerer Hitze schmelzen.", "Kleine Häufchen Teig einlöffeln.", "2–3 Min je Seite backen bis goldbraun.", "Mit Beeren und Sahne servieren."],
  },
  {
    id: "ruehrei-speck",
    name: "Cremiges Rührei mit Speck",
    kategorie: "Frühstück",
    kcal: 420, kh: 1, eiweiss: 26, fett: 35,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥚",
    tags: ["keto", "speck", "eier"],
    zutaten: ["4 Eier", "100 g Speck/Bacon", "2 EL Butter", "2 EL Sahne", "Salz, Pfeffer", "Schnittlauch"],
    zubereitung: ["Speck knusprig braten, beiseitelegen.", "Eier mit Sahne, Salz und Pfeffer verquirlen.", "Butter bei niedriger Hitze schmelzen, Eimasse eingießen.", "Langsam von außen nach innen schieben bis cremig gestockt.", "Mit Speck und Schnittlauch servieren."],
  },
  {
    id: "lachs-frischkaese-rolle",
    name: "Räucherlachs-Frischkäse-Röllchen",
    kategorie: "Frühstück",
    kcal: 280, kh: 2, eiweiss: 22, fett: 21,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "kalt", "schnell"],
    zutaten: ["150 g Räucherlachs", "100 g Frischkäse", "Dill", "Zitronensaft", "Gurke in Scheiben", "Kapern optional"],
    zubereitung: ["Frischkäse mit Dill und Zitronensaft verrühren.", "Je einen EL Frischkäse auf eine Lachsscheibe geben.", "Fest aufrollen.", "Mit Gurkenscheiben anrichten."],
  },
  {
    id: "kokosmilch-porridge",
    name: "Keto-Porridge mit Kokosmehl",
    kategorie: "Frühstück",
    kcal: 310, kh: 5, eiweiss: 12, fett: 26,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥣",
    tags: ["keto", "warm", "winter"],
    zutaten: ["3 EL Kokosmehl", "200 ml Kokosmilch", "1 Ei", "1 EL Butter", "Stevia", "Zimt", "Himbeeren"],
    zubereitung: ["Kokosmilch in kleinem Topf leicht erhitzen.", "Kokosmehl einrühren und 2 Min quellen lassen.", "Ei einrühren und bei niedriger Hitze dicklich rühren.", "Butter, Stevia und Zimt unterrühren.", "Mit Himbeeren servieren."],
  },
  {
    id: "griechischer-joghurt-beeren",
    name: "Griechischer Joghurt mit Nüssen & Beeren",
    kategorie: "Frühstück",
    kcal: 260, kh: 8, eiweiss: 14, fett: 18,
    zeit: "3 Min", schwierigkeit: "Einfach",
    bild: "🫐",
    tags: ["keto", "schnell", "einfach"],
    zutaten: ["200 g griechischer Joghurt (10 % Fett)", "30 g Walnüsse", "50 g Himbeeren oder Brombeeren", "1 EL Chiasamen", "Stevia optional"],
    zubereitung: ["Joghurt in Schüssel geben.", "Walnüsse grob hacken und drüber streuen.", "Beeren und Chiasamen obenauf.", "Mit Stevia süßen nach Wunsch."],
  },
  {
    id: "spinat-feta-omelett",
    name: "Spinat-Feta-Omelett",
    kategorie: "Frühstück",
    kcal: 370, kh: 3, eiweiss: 22, fett: 29,
    zeit: "12 Min", schwierigkeit: "Einfach",
    bild: "🥬",
    tags: ["keto", "spinat", "feta"],
    zutaten: ["3 Eier", "80 g Feta", "1 Handvoll Babyspinat", "2 EL Olivenöl", "Salz, Pfeffer", "Muskatnuss"],
    zubereitung: ["Eier verquirlen, würzen.", "Olivenöl erhitzen, Spinat kurz zusammenfallen lassen.", "Eimasse drübergießen, bei mittlerer Hitze stocken.", "Feta drüber krümeln, zusammenfalten."],
  },
  {
    id: "avocado-speck-schiffchen",
    name: "Avocado-Speck-Schiffchen",
    kategorie: "Frühstück",
    kcal: 400, kh: 3, eiweiss: 16, fett: 36,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥑",
    tags: ["keto", "ofen", "avocado"],
    zutaten: ["1 Avocado", "2 Eier", "4 Scheiben Bacon", "Salz, Pfeffer", "Paprika", "Chili optional"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Avocado halbieren, Kern entfernen — Mulde etwas vergrößern.", "Je ein Ei in die Mulde geben, würzen.", "Bacon rundherum legen.", "15–18 Min backen bis Ei gestockt."],
  },
  {
    id: "kokosmilch-smoothie",
    name: "Keto Green Smoothie",
    kategorie: "Frühstück",
    kcal: 270, kh: 5, eiweiss: 6, fett: 24,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🥤",
    tags: ["keto", "smoothie", "grün"],
    zutaten: ["200 ml Kokosmilch", "1 Handvoll Spinat", "½ Avocado", "1 EL MCT-Öl", "Stevia", "Eis"],
    zubereitung: ["Alle Zutaten in den Mixer geben.", "Ca. 30 Sekunden mixen bis cremig.", "Mit Eis servieren."],
  },
  {
    id: "ei-muffins",
    name: "Keto Ei-Muffins (Meal Prep)",
    kategorie: "Frühstück",
    kcal: 180, kh: 1, eiweiss: 14, fett: 14,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🧁",
    tags: ["keto", "meal-prep", "ofen"],
    zutaten: ["6 Eier", "100 g Speck gewürfelt", "50 g Gouda gerieben", "Paprika gewürfelt", "Salz, Pfeffer", "Schnittlauch"],
    zubereitung: ["Ofen auf 180 °C vorheizen.", "Muffinform fetten oder Silikonform verwenden.", "Speck, Paprika und Käse auf die Mulden verteilen.", "Eier darüber aufschlagen oder verquirlt eingießen.", "20 Min backen. Hält 4 Tage im Kühlschrank."],
  },
  {
    id: "mandelmehl-waffeln",
    name: "Keto-Waffeln aus Mandelmehl",
    kategorie: "Frühstück",
    kcal: 360, kh: 4, eiweiss: 14, fett: 30,
    zeit: "20 Min", schwierigkeit: "Mittel",
    bild: "🧇",
    tags: ["keto", "waffeln", "süß"],
    zutaten: ["120 g Mandelmehl", "3 Eier", "60 g Butter (geschmolzen)", "1 TL Backpulver", "Stevia", "Vanille", "Prise Salz"],
    zubereitung: ["Waffeleisen vorheizen und fetten.", "Alle Zutaten zu glattem Teig verrühren.", "Teig ins Waffeleisen geben, 4–5 Min backen.", "Mit Sahne und Beeren servieren."],
  },
  {
    id: "quark-nuss-bowl",
    name: "Quark-Nuss-Bowl",
    kategorie: "Frühstück",
    kcal: 320, kh: 6, eiweiss: 20, fett: 22,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🥜",
    tags: ["keto", "quark", "schnell"],
    zutaten: ["200 g Magerquark", "2 EL Sahne", "30 g Mandeln gehackt", "20 g Walnüsse", "Stevia", "Zimt", "Himbeeren"],
    zubereitung: ["Quark mit Sahne cremig rühren.", "Mit Stevia und Zimt abschmecken.", "Nüsse und Beeren drüber geben."],
  },
  {
    id: "kokos-ei-pfannkuchen",
    name: "Kokos-Ei-Pfannkuchen (2-Zutaten)",
    kategorie: "Frühstück",
    kcal: 180, kh: 2, eiweiss: 10, fett: 15,
    zeit: "8 Min", schwierigkeit: "Einfach",
    bild: "🫓",
    tags: ["keto", "einfach", "2-zutaten"],
    zutaten: ["2 Eier", "30 g Frischkäse", "Butter zum Braten", "optional: Zimt oder Vanille"],
    zubereitung: ["Eier und Frischkäse cremig mixen.", "Butter in Pfanne schmelzen.", "Dünne Pfannkuchen bei kleiner Hitze backen (je 2 Min).", "Mit Beeren oder Frischkäse füllen."],
  },
  {
    id: "schinken-ei-wrap",
    name: "Schinken-Ei-Wrap (Low Carb)",
    kategorie: "Frühstück",
    kcal: 310, kh: 2, eiweiss: 26, fett: 22,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🌯",
    tags: ["keto", "wrap", "schinken"],
    zutaten: ["3 Scheiben gekochter Schinken", "2 Eier (Rührei)", "30 g Gouda", "Senf (zuckerfrei)", "Rucola"],
    zubereitung: ["Rührei mit Käse zubereiten.", "Schinkenscheiben überlappend auslegen.", "Rührei, Senf und Rucola darauf verteilen.", "Fest aufrollen und halbieren."],
  },
  {
    id: "lachsrolle-gurke",
    name: "Lachs-Gurken-Röllchen",
    kategorie: "Frühstück",
    kcal: 240, kh: 2, eiweiss: 20, fett: 16,
    zeit: "8 Min", schwierigkeit: "Einfach",
    bild: "🥒",
    tags: ["keto", "kalt", "lachs"],
    zutaten: ["1 Gurke", "150 g Räucherlachs", "100 g Frischkäse", "Dill", "Zitrone", "Salz, Pfeffer"],
    zubereitung: ["Gurke mit Sparschäler in lange Streifen schneiden.", "Frischkäse mit Dill und Zitrone würzen.", "Frischkäse und Lachs auf Gurkenstreifen legen.", "Aufrollen und mit Zahnstocher fixieren."],
  },
  {
    id: "keto-granola",
    name: "Keto-Granola (selbst gemacht)",
    kategorie: "Frühstück",
    kcal: 340, kh: 5, eiweiss: 10, fett: 29,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🌰",
    tags: ["keto", "meal-prep", "knusprig"],
    zutaten: ["100 g Mandelblättchen", "80 g Kokoschips", "50 g Kürbiskerne", "50 g Chiasamen", "2 EL Kokosöl", "Zimt", "Stevia"],
    zubereitung: ["Ofen auf 160 °C vorheizen.", "Alle Zutaten mit Kokosöl und Stevia mischen.", "Auf Backblech verteilen, 15–18 Min goldbraun rösten.", "Auskühlen lassen — wird beim Abkühlen knusprig.", "In Glas füllen, hält 2 Wochen."],
  },
  {
    id: "halloumi-speck-pfanne",
    name: "Halloumi-Speck-Pfanne",
    kategorie: "Frühstück",
    kcal: 450, kh: 2, eiweiss: 26, fett: 38,
    zeit: "12 Min", schwierigkeit: "Einfach",
    bild: "🧀",
    tags: ["keto", "halloumi", "herzhaft"],
    zutaten: ["200 g Halloumi", "100 g Speck", "Olivenöl", "Paprikapulver", "frischer Thymian"],
    zubereitung: ["Halloumi in dicke Scheiben schneiden.", "Speck knusprig braten.", "Halloumi im Speckfett je 2 Min braten bis goldbraun.", "Mit Paprika und Thymian servieren."],
  },
  {
    id: "eier-im-nest",
    name: "Eier im Speck-Nest",
    kategorie: "Frühstück",
    kcal: 350, kh: 1, eiweiss: 20, fett: 30,
    zeit: "18 Min", schwierigkeit: "Einfach",
    bild: "🥓",
    tags: ["keto", "ofen", "speck"],
    zutaten: ["6 Scheiben Bacon/Speck", "2 Eier", "30 g Gouda", "Schnittlauch", "Muffinform"],
    zubereitung: ["Ofen auf 190 °C vorheizen.", "Speckscheiben in Muffinmulden zu Nestern formen.", "Je ein Ei hineinschlagen, Käse drüber.", "12–15 Min backen bis Ei gestockt."],
  },
  {
    id: "zucchini-frischkaese-brot",
    name: "Keto-Zucchini-Frischkäsebrot",
    kategorie: "Frühstück",
    kcal: 240, kh: 3, eiweiss: 11, fett: 19,
    zeit: "45 Min", schwierigkeit: "Mittel",
    bild: "🍞",
    tags: ["keto", "backen", "gemüse"],
    zutaten: ["1 Zucchini gerieben", "150 g Frischkäse", "3 Eier", "100 g Mandelmehl", "1 TL Backpulver", "Salz", "Sonnenblumenkerne"],
    zubereitung: ["Ofen auf 175 °C vorheizen.", "Zucchini reiben, kräftig ausdrücken.", "Mit Frischkäse, Eiern, Mandelmehl und Backpulver mischen.", "In Kastenform füllen, Kerne obenauf.", "40 Min backen, komplett auskühlen."],
  },
  {
    id: "keto-ruehrei-pilze",
    name: "Rührei mit Pilzen und Parmesan",
    kategorie: "Frühstück",
    kcal: 390, kh: 2, eiweiss: 24, fett: 30,
    zeit: "12 Min", schwierigkeit: "Einfach",
    bild: "🍄",
    tags: ["keto", "pilze", "parmesan"],
    zutaten: ["3 Eier", "150 g Champions", "30 g Parmesan", "2 EL Butter", "Thymian", "Salz, Pfeffer"],
    zubereitung: ["Pilze in Scheiben in Butter 4 Min braten.", "Eier verquirlen, drübergießen.", "Sanft rühren bis cremig gestockt.", "Parmesan drüber hobeln, mit Thymian servieren."],
  },
  {
    id: "creme-fraiche-beeren",
    name: "Crème fraîche mit Beeren und Nüssen",
    kategorie: "Frühstück",
    kcal: 300, kh: 5, eiweiss: 4, fett: 28,
    zeit: "3 Min", schwierigkeit: "Einfach",
    bild: "🍓",
    tags: ["keto", "schnell", "frisch"],
    zutaten: ["150 g Crème fraîche", "50 g Himbeeren", "30 g Pecannüsse", "Stevia", "Zimt"],
    zubereitung: ["Crème fraîche mit Stevia verrühren.", "Beeren drüber geben.", "Pecannüsse grob hacken und darüber streuen.", "Mit Zimt abschließen."],
  },
  {
    id: "kokos-chia-nacht",
    name: "Kokos-Chia über Nacht mit Mandeln",
    kategorie: "Frühstück",
    kcal: 320, kh: 6, eiweiss: 10, fett: 26,
    zeit: "5 Min + 8 h", schwierigkeit: "Einfach",
    bild: "🥥",
    tags: ["keto", "vorbereitung", "kokos"],
    zutaten: ["4 EL Chiasamen", "200 ml Kokosmilch", "50 ml Mandeldrink (ungesüßt)", "1 EL Mandelblättchen", "Stevia", "Vanille", "Himbeeren"],
    zubereitung: ["Chiasamen mit Kokosmilch, Mandeldrink, Stevia und Vanille mischen.", "Abgedeckt über Nacht kühlen.", "Morgens mit Mandelblättchen und Beeren toppen."],
  },
  {
    id: "thunfisch-fruehstueckssalat",
    name: "Thunfisch-Frühstücks-Salat",
    kategorie: "Frühstück",
    kcal: 300, kh: 2, eiweiss: 28, fett: 20,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["keto", "kalt", "protein"],
    zutaten: ["1 Dose Thunfisch", "2 EL Mayonnaise", "½ Gurke gewürfelt", "1 EL Kapern", "Dill", "Zitronensaft", "Salat"],
    zubereitung: ["Thunfisch abtropfen und mit Mayo vermengen.", "Gurke, Kapern und Dill unterheben.", "Mit Zitronensaft abschmecken.", "Auf Salat anrichten."],
  },
  {
    id: "keto-muesliriegel",
    name: "Keto-Müsliriegel (No-Bake)",
    kategorie: "Frühstück",
    kcal: 290, kh: 4, eiweiss: 8, fett: 25,
    zeit: "10 Min + 1 h", schwierigkeit: "Einfach",
    bild: "🍫",
    tags: ["keto", "meal-prep", "riegel"],
    zutaten: ["100 g Mandelblättchen", "80 g Kokosbutter", "3 EL Chiasamen", "2 EL Erythrit", "1 TL Vanille", "Prise Salz", "30 g dunkle Schokolade 85 %"],
    zubereitung: ["Kokosbutter schmelzen, alle Zutaten vermischen.", "In rechteckige Form pressen.", "Geschmolzene Schokolade drüber träufeln.", "1 h kühlen, dann in Riegel schneiden."],
  },
  {
    id: "mandelbutter-sellerie",
    name: "Mandelbutter mit Selleriestangen",
    kategorie: "Frühstück",
    kcal: 220, kh: 3, eiweiss: 7, fett: 18,
    zeit: "3 Min", schwierigkeit: "Einfach",
    bild: "🥜",
    tags: ["keto", "kalt", "einfach"],
    zutaten: ["3 Stangen Sellerie", "3 EL Mandelbutter (ohne Zusätze)", "Meersalz", "optional: Zimt"],
    zubereitung: ["Sellerie waschen und in handliche Stücke schneiden.", "Mandelbutter drauflöffeln.", "Mit Meersalz bestreuen."],
  },

  // ─── MITTAGESSEN ─────────────────────────────────────────────────────────
  {
    id: "haehnchen-brokkoli",
    name: "Hähnchenbrust mit Brokkoli in Knoblauchbutter",
    kategorie: "Mittagessen",
    kcal: 420, kh: 8, eiweiss: 52, fett: 20,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "hähnchen", "meal-prep"],
    zutaten: ["200 g Hähnchenbrust", "300 g Brokkoli", "3 EL Butter", "3 Zehen Knoblauch", "Paprikapulver", "Salz, Pfeffer"],
    zubereitung: ["Hähnchen in Stücke schneiden und würzen.", "In Butter von beiden Seiten goldbraun braten (8 Min).", "Knoblauch und Brokkoli dazugeben.", "5 Minuten mitbraten bis Brokkoli bissfest.", "Mit Paprikapulver abschmecken."],
  },
  {
    id: "thunfisch-avocado-bowl",
    name: "Thunfisch-Avocado Bowl",
    kategorie: "Mittagessen",
    kcal: 440, kh: 4, eiweiss: 35, fett: 32,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["keto", "schnell", "kalt"],
    zutaten: ["1 Dose Thunfisch (im Wasser)", "1 Avocado", "1 EL Mayonnaise (keto)", "Salz, Pfeffer", "Zitronensaft", "Rucola", "Kapern optional"],
    zubereitung: ["Thunfisch abtropfen lassen.", "Avocado würfeln.", "Thunfisch mit Mayo, Zitrone, Salz und Pfeffer mischen.", "Auf Rucola anrichten, Avocado dazu."],
  },
  {
    id: "caesar-salad-keto",
    name: "Caesar Salad (Keto, ohne Croutons)",
    kategorie: "Mittagessen",
    kcal: 380, kh: 4, eiweiss: 35, fett: 24,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥬",
    tags: ["keto", "salat", "hähnchen"],
    zutaten: ["1 Hähnchenbrust", "1 Römersalat", "50 g Parmesan", "Mayonnaise", "Zitrone", "Knoblauch", "Speck optional"],
    zubereitung: ["Hähnchen würzen und goldbraun braten.", "Caesar-Dressing: Mayonnaise, Zitrone, Knoblauch, Parmesan mischen.", "Salat zerreißen, Hähnchen in Streifen schneiden.", "Alles mischen, Parmesan drüber hobeln."],
  },
  {
    id: "blumenkohl-reis",
    name: "Blumenkohl-Fried Rice (Keto)",
    kategorie: "Mittagessen",
    kcal: 310, kh: 9, eiweiss: 16, fett: 22,
    zeit: "20 Min", schwierigkeit: "Mittel",
    bild: "🥦",
    tags: ["keto", "vegetarisch", "sattmacher"],
    zutaten: ["1 kleiner Blumenkohl", "3 Eier", "100 g Champions", "2 EL Sojasoße", "2 EL Sesamöl", "Frühlingszwiebeln", "Ingwer"],
    zubereitung: ["Blumenkohl im Mixer zu Reis-Größe zerkleinern.", "Sesamöl erhitzen, Blumenkohlreis 5 Min braten.", "Champions und Ingwer dazu.", "Eier unterrühren und stocken lassen.", "Mit Sojasoße und Frühlingszwiebeln abschmecken."],
  },
  {
    id: "griechischer-salat",
    name: "Griechischer Salat mit extra Feta",
    kategorie: "Mittagessen",
    kcal: 320, kh: 7, eiweiss: 12, fett: 26,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🫑",
    tags: ["keto", "vegetarisch", "sommer"],
    zutaten: ["200 g Feta", "Kirschtomaten", "Gurke", "rote Paprika", "Oliven", "rote Zwiebel", "Olivenöl", "Oregano"],
    zubereitung: ["Gemüse in grobe Stücke schneiden.", "Feta in Würfel schneiden.", "Alles in Schale geben, Oliven dazu.", "Großzügig Olivenöl, Oregano und Salz."],
  },
  {
    id: "hackfleisch-paprika-pfanne",
    name: "Hackfleisch-Paprika-Pfanne",
    kategorie: "Mittagessen",
    kcal: 430, kh: 7, eiweiss: 30, fett: 32,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🫑",
    tags: ["keto", "hack", "schnell"],
    zutaten: ["400 g Rinderhack", "2 Paprika (rot, gelb)", "1 Zwiebel", "2 Zehen Knoblauch", "1 EL Tomatenmark", "Paprikapulver geräuchert", "Olivenöl"],
    zubereitung: ["Zwiebel und Knoblauch in Öl anschwitzen.", "Hack dazugeben und krümelig braten.", "Paprika in Streifen dazu, 5 Min mitbraten.", "Tomatenmark und Gewürze einrühren."],
  },
  {
    id: "lachs-avocado-salat",
    name: "Lachs-Avocado-Salat",
    kategorie: "Mittagessen",
    kcal: 490, kh: 4, eiweiss: 30, fett: 38,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "lachs", "sommer"],
    zutaten: ["150 g Lachsfilet oder Räucherlachs", "1 Avocado", "Feldsalat", "Kirschtomaten", "Zitronenvinaigrette", "Dill"],
    zubereitung: ["Lachs würzen und 4 Min je Seite braten.", "Avocado in Scheiben schneiden.", "Salat mit Zitronenvinaigrette anmachen.", "Lachs und Avocado drauflegen."],
  },
  {
    id: "zucchini-suppe",
    name: "Cremige Zucchini-Suppe",
    kategorie: "Mittagessen",
    kcal: 220, kh: 6, eiweiss: 6, fett: 18,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥣",
    tags: ["keto", "suppe", "vegetarisch"],
    zutaten: ["3 Zucchini", "1 Zwiebel", "500 ml Gemüsebrühe", "100 ml Sahne", "2 EL Butter", "Knoblauch", "Basilikum"],
    zubereitung: ["Zwiebel und Knoblauch in Butter anschwitzen.", "Zucchini in Stücke, dazu.", "Mit Brühe aufgießen, 10 Min köcheln.", "Pürieren, Sahne einrühren, abschmecken."],
  },
  {
    id: "puten-gurkensalat",
    name: "Putenstreifen auf Gurkensalat",
    kategorie: "Mittagessen",
    kcal: 340, kh: 3, eiweiss: 40, fett: 18,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥒",
    tags: ["keto", "pute", "leicht"],
    zutaten: ["250 g Putenbrust", "1 Salatgurke", "2 EL griechischer Joghurt", "Dill", "Zitrone", "Salz, Pfeffer", "Olivenöl"],
    zubereitung: ["Gurke in Scheiben, mit Dill, Joghurt, Zitrone verrühren.", "Pute in Streifen würzen und scharf anbraten.", "Heiß auf kaltem Gurkensalat servieren."],
  },
  {
    id: "garnelen-avocado-bowl",
    name: "Garnelen-Avocado-Bowl",
    kategorie: "Mittagessen",
    kcal: 420, kh: 4, eiweiss: 26, fett: 32,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🦐",
    tags: ["keto", "garnelen", "bowl"],
    zutaten: ["200 g Garnelen", "1 Avocado", "Rucola", "Kirschtomaten", "2 EL Olivenöl", "Zitrone", "Knoblauch", "Chili"],
    zubereitung: ["Garnelen mit Knoblauch, Chili in Öl 3 Min braten.", "Avocado in Scheiben schneiden.", "Rucola und Tomaten in Schüssel legen.", "Garnelen und Avocado drauflegen."],
  },
  {
    id: "spinat-pilz-pfanne",
    name: "Spinat-Pilz-Pfanne mit Ei",
    kategorie: "Mittagessen",
    kcal: 320, kh: 4, eiweiss: 20, fett: 24,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🍄",
    tags: ["keto", "vegetarisch", "spinat"],
    zutaten: ["200 g Champions", "150 g Babyspinat", "3 Eier", "2 EL Butter", "Knoblauch", "Muskat", "Parmesan"],
    zubereitung: ["Pilze in Scheiben in Butter braten.", "Knoblauch dazu, Spinat zusammenfallen lassen.", "Mulden formen, Eier hineinschlagen.", "Deckel drauf, 5 Min pochieren.", "Mit Parmesan und Muskat servieren."],
  },
  {
    id: "blumenkohl-suppe",
    name: "Blumenkohlsuppe mit Sahne",
    kategorie: "Mittagessen",
    kcal: 240, kh: 7, eiweiss: 6, fett: 20,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥣",
    tags: ["keto", "suppe", "winter"],
    zutaten: ["1 Blumenkohl", "1 Zwiebel", "600 ml Hühnerbrühe", "150 ml Sahne", "2 EL Butter", "Muskat", "Schnittlauch"],
    zubereitung: ["Zwiebel in Butter anschwitzen.", "Blumenkohl in Röschen dazu.", "Brühe angießen, 15 Min kochen.", "Pürieren, Sahne einrühren.", "Mit Muskat und Schnittlauch abschmecken."],
  },
  {
    id: "rinderhack-zucchini-boat",
    name: "Gefüllte Zucchini-Boote mit Hack",
    kategorie: "Mittagessen",
    kcal: 380, kh: 5, eiweiss: 28, fett: 26,
    zeit: "35 Min", schwierigkeit: "Mittel",
    bild: "🥒",
    tags: ["keto", "ofen", "hack"],
    zutaten: ["2 Zucchini", "300 g Rinderhack", "1 Zwiebel", "2 EL Tomatenmark", "50 g Gouda gerieben", "Knoblauch", "Oregano"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Zucchini halbieren, Fruchtfleisch aushöhlen.", "Hack mit Zwiebel, Knoblauch, Tomatenmark braten.", "Zucchini füllen, Käse drüber.", "20 Min überbacken."],
  },
  {
    id: "haehnchen-kraeuterquark",
    name: "Hähnchen-Streifen mit Kräuterquark",
    kategorie: "Mittagessen",
    kcal: 370, kh: 3, eiweiss: 46, fett: 18,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "hähnchen", "quark"],
    zutaten: ["300 g Hähnchenbrust", "150 g Quark", "2 EL Sahne", "Kräuter (Dill, Petersilie, Schnittlauch)", "Zitrone", "Salat"],
    zubereitung: ["Hähnchen in Streifen würzen und braten.", "Quark mit Sahne, Kräutern und Zitrone verrühren.", "Auf Salat anrichten, Quark dazu."],
  },
  {
    id: "eiersalat-keto",
    name: "Keto Eiersalat",
    kategorie: "Mittagessen",
    kcal: 350, kh: 2, eiweiss: 18, fett: 29,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥚",
    tags: ["keto", "eier", "kalt"],
    zutaten: ["4 Eier (hartgekocht)", "3 EL Mayonnaise", "1 TL Senf", "Schnittlauch", "Salz, Pfeffer", "Paprikapulver"],
    zubereitung: ["Eier 8 Min kochen, schälen und hacken.", "Mit Mayo, Senf und Gewürzen mischen.", "Auf Salat oder Gurkenscheiben servieren."],
  },
  {
    id: "makrele-salat",
    name: "Makrelen-Salat mit Avocado",
    kategorie: "Mittagessen",
    kcal: 420, kh: 3, eiweiss: 24, fett: 34,
    zeit: "8 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "fisch", "omega3"],
    zutaten: ["1 Dose Makrele in Öl", "1 Avocado", "Feldsalat", "rote Zwiebel", "Zitronenvinaigrette", "Dill"],
    zubereitung: ["Makrele abtropfen, grob zerpflücken.", "Avocado würfeln, Zwiebel in Ringe.", "Salat mit Vinaigrette anmachen.", "Makrele und Avocado drauflegen."],
  },
  {
    id: "wrap-salatblatt",
    name: "Salatblatt-Wraps mit Hähnchen",
    kategorie: "Mittagessen",
    kcal: 320, kh: 3, eiweiss: 38, fett: 16,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🌯",
    tags: ["keto", "hähnchen", "leicht"],
    zutaten: ["200 g Hähnchenbrust", "8 große Salatblätter", "½ Avocado", "Kirschtomaten", "Senf (zuckerfrei)", "Sesam"],
    zubereitung: ["Hähnchen würzen, braten und in Streifen schneiden.", "Avocado und Tomaten vorbereiten.", "Alles in Salatblätter wickeln.", "Mit Sauce und Sesam toppen."],
  },
  {
    id: "sardinen-salat",
    name: "Sardinen-Tomaten-Salat",
    kategorie: "Mittagessen",
    kcal: 290, kh: 3, eiweiss: 22, fett: 22,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "dose", "omega3"],
    zutaten: ["1 Dose Sardinen in Olivenöl", "Kirschtomaten", "Rucola", "rote Zwiebel", "Kapern", "Zitrone", "Olivenöl"],
    zubereitung: ["Sardinen abtropfen.", "Tomaten halbieren, Zwiebel in Ringe.", "Alles auf Rucola anrichten.", "Mit Kapern, Zitrone und Olivenöl fertigstellen."],
  },
  {
    id: "keto-burger-bowl",
    name: "Keto-Burger-Bowl (ohne Brötchen)",
    kategorie: "Mittagessen",
    kcal: 490, kh: 5, eiweiss: 34, fett: 38,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍔",
    tags: ["keto", "hack", "bowl"],
    zutaten: ["300 g Rinderhack", "Eisbergsalat", "Kirschtomaten", "Cheddar", "Gurken", "Mayo", "Senf (zuckerfrei)", "rote Zwiebel"],
    zubereitung: ["Hackfleischpattys formen, würzen und braten.", "Käse auf Patty schmelzen.", "Salat, Tomaten, Gurken in Schale.", "Patty drauf, Mayo und Senf drüber."],
  },
  {
    id: "gurkensalat-lachs-creme",
    name: "Gurkensalat mit Lachscreme",
    kategorie: "Mittagessen",
    kcal: 280, kh: 3, eiweiss: 18, fett: 22,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥒",
    tags: ["keto", "lachs", "kalt"],
    zutaten: ["1 Salatgurke", "100 g Räucherlachs", "150 g Frischkäse", "Dill", "Zitrone", "Salz, Pfeffer"],
    zubereitung: ["Lachs fein hacken, mit Frischkäse, Dill, Zitrone vermischen.", "Gurke in Scheiben schneiden.", "Lachscreme auf Gurken löffeln."],
  },
  {
    id: "spargel-schinken-salat",
    name: "Spargel-Schinken-Salat",
    kategorie: "Mittagessen",
    kcal: 290, kh: 4, eiweiss: 22, fett: 20,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🌿",
    tags: ["keto", "spargel", "leicht"],
    zutaten: ["400 g grüner Spargel", "150 g Rohschinken/Prosciutto", "Feldsalat", "Parmesan", "Zitronenvinaigrette"],
    zubereitung: ["Spargel in Salzwasser 5 Min kochen.", "Abschrecken, in Stücke schneiden.", "Mit Salat und Schinken anrichten.", "Parmesan darüberhobeln, Vinaigrette drüber."],
  },
  {
    id: "haehnchensalat-senf-dressing",
    name: "Hähnchensalat mit Senf-Dressing",
    kategorie: "Mittagessen",
    kcal: 380, kh: 4, eiweiss: 40, fett: 20,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["keto", "hähnchen", "dressing"],
    zutaten: ["2 Hähnchenbrüste", "Feldsalat", "Gurke", "3 EL Olivenöl", "1 EL Dijonsenf", "1 EL Zitronensaft"],
    zubereitung: ["Hähnchen würzen, 8 Min je Seite braten.", "Dressing: Olivenöl, Senf, Zitrone, Salz mischen.", "Salat und Gurken mit Dressing anmachen.", "Hähnchen in Scheiben drauflegen."],
  },
  {
    id: "lauchsuppe",
    name: "Cremige Lauchsuppe mit Speck",
    kategorie: "Mittagessen",
    kcal: 310, kh: 7, eiweiss: 10, fett: 26,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🥣",
    tags: ["keto", "suppe", "warm"],
    zutaten: ["2 Lauchstangen", "100 g Speck", "500 ml Hühnerbrühe", "150 ml Sahne", "2 EL Butter", "Muskat"],
    zubereitung: ["Speck würfeln und knusprig braten.", "Lauch in Ringe, in Butter anschwitzen.", "Brühe angießen, 15 Min köcheln.", "Sahne einrühren, würzen.", "Mit Speck toppen."],
  },
  {
    id: "halloumi-salat",
    name: "Gegrillter Halloumi-Salat",
    kategorie: "Mittagessen",
    kcal: 390, kh: 5, eiweiss: 22, fett: 30,
    zeit: "12 Min", schwierigkeit: "Einfach",
    bild: "🧀",
    tags: ["keto", "vegetarisch", "halloumi"],
    zutaten: ["200 g Halloumi", "Rucola", "Kirschtomaten", "Gurke", "Oliven", "Olivenöl", "Zitrone"],
    zubereitung: ["Halloumi in Scheiben ohne Fett je 2 Min braten.", "Gemüse und Salat anrichten.", "Halloumi drauflegen.", "Mit Olivenöl und Zitrone beträufeln."],
  },
  {
    id: "keto-taco-bowl",
    name: "Keto Taco Bowl",
    kategorie: "Mittagessen",
    kcal: 480, kh: 6, eiweiss: 32, fett: 36,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🌮",
    tags: ["keto", "mexikanisch", "bowl"],
    zutaten: ["300 g Rinderhack", "Eisbergsalat", "1 Avocado", "50 g Cheddar", "Saure Sahne", "Salsa (zuckerfrei)", "Kreuzkümmel"],
    zubereitung: ["Hack mit Kreuzkümmel, Paprika, Salz braten.", "Salat als Boden in Schale legen.", "Hack, Avocado und Käse drauf.", "Saure Sahne und Salsa obenauf."],
  },
  {
    id: "brokkoli-cheddar-suppe",
    name: "Brokkoli-Cheddar-Suppe",
    kategorie: "Mittagessen",
    kcal: 350, kh: 8, eiweiss: 14, fett: 28,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🥣",
    tags: ["keto", "suppe", "käse"],
    zutaten: ["400 g Brokkoli", "150 g Cheddar gerieben", "500 ml Hühnerbrühe", "200 ml Sahne", "1 Zwiebel", "2 EL Butter"],
    zubereitung: ["Zwiebel in Butter anschwitzen.", "Brokkoli dazu, 3 Min mitbraten.", "Brühe und Sahne angießen, 12 Min köcheln.", "Hälfte pürieren, Cheddar einrühren."],
  },
  {
    id: "putenbrust-zucchini",
    name: "Putenbrust mit Zucchini-Gemüse",
    kategorie: "Mittagessen",
    kcal: 350, kh: 5, eiweiss: 44, fett: 16,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🫑",
    tags: ["keto", "pute", "leicht"],
    zutaten: ["300 g Putenbrust", "2 Zucchini", "1 Paprika", "Olivenöl", "Provencéer Kräuter", "Knoblauch"],
    zubereitung: ["Pute würzen, 6 Min je Seite braten.", "Zucchini und Paprika in Streifen 5 Min mitbraten.", "Mit Kräutern und Knoblauch abschmecken."],
  },
  {
    id: "keto-pizza-fladen",
    name: "Keto-Pizza-Fladen (Mandelmehl)",
    kategorie: "Mittagessen",
    kcal: 460, kh: 6, eiweiss: 24, fett: 36,
    zeit: "30 Min", schwierigkeit: "Mittel",
    bild: "🍕",
    tags: ["keto", "pizza", "backen"],
    zutaten: ["150 g Mandelmehl", "2 Eier", "50 g Parmesan gerieben", "Tomatenmark (zuckerfrei)", "Mozzarella", "Belag nach Wahl", "Oregano"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Mandelmehl, Eier und Parmesan zu Teig vermengen.", "Auf Backpapier rund ausrollen.", "15 Min vorbacken.", "Mit Tomatenmark, Mozzarella und Belag 10 Min überbacken."],
  },
  {
    id: "brokkoli-mandel-salat",
    name: "Brokkoli-Mandel-Salat (kalt)",
    kategorie: "Mittagessen",
    kcal: 310, kh: 6, eiweiss: 12, fett: 24,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥦",
    tags: ["keto", "vegetarisch", "meal-prep"],
    zutaten: ["400 g Brokkoli", "50 g Mandelblättchen", "100 g Speck", "3 EL Mayo", "1 EL Apfelessig", "Stevia", "rote Zwiebel"],
    zubereitung: ["Brokkoli in kleine Röschen, kurz blanchieren.", "Speck knusprig braten.", "Mayo, Essig, Stevia zu Dressing verrühren.", "Alles mischen, 30 Min ziehen lassen."],
  },

  // ─── ABENDESSEN ───────────────────────────────────────────────────────────
  {
    id: "lachs-zucchini",
    name: "Lachs mit Zucchini-Nudeln",
    kategorie: "Abendessen",
    kcal: 490, kh: 5, eiweiss: 42, fett: 32,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "lachs", "lowcarb"],
    zutaten: ["200 g Lachsfilet", "2 Zucchini", "2 EL Olivenöl", "2 Zehen Knoblauch", "Salz, Pfeffer", "Zitrone", "Dill"],
    zubereitung: ["Zucchini mit Spiralschneider zu Nudeln schneiden.", "Lachs würzen und 4 Min je Seite braten.", "Knoblauch in Öl anschwitzen, Zucchini 2 Min mitbraten.", "Zitronensaft und Dill dazu, servieren."],
  },
  {
    id: "ribeye-kraeuterbutter",
    name: "Ribeye Steak mit Kräuterbutter",
    kategorie: "Abendessen",
    kcal: 580, kh: 0, eiweiss: 45, fett: 45,
    zeit: "15 Min", schwierigkeit: "Mittel",
    bild: "🥩",
    tags: ["keto", "steak", "premium"],
    zutaten: ["300 g Ribeye Steak", "2 EL Butter", "Thymian, Rosmarin", "1 Zehe Knoblauch", "Meersalz, schwarzer Pfeffer"],
    zubereitung: ["Steak 30 Min vorher aus dem Kühlschrank nehmen.", "Pfanne sehr heiß erhitzen.", "Steak würzen, 3 Min je Seite braten.", "Butter, Kräuter und Knoblauch dazu.", "5 Min ruhen lassen."],
  },
  {
    id: "garnelen-knoblauch",
    name: "Knoblauch-Garnelen mit Salat",
    kategorie: "Abendessen",
    kcal: 350, kh: 3, eiweiss: 28, fett: 24,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🦐",
    tags: ["keto", "garnelen", "schnell"],
    zutaten: ["250 g Garnelen (geschält)", "3 EL Butter", "4 Zehen Knoblauch", "Zitrone", "Petersilie", "Kopfsalat"],
    zubereitung: ["Knoblauch fein hacken.", "Butter schmelzen, Knoblauch anschwitzen.", "Garnelen 2–3 Min je Seite braten.", "Zitronensaft und Petersilie dazu."],
  },
  {
    id: "keto-curry",
    name: "Hähnchen-Kokos-Curry (ohne Reis)",
    kategorie: "Abendessen",
    kcal: 520, kh: 8, eiweiss: 40, fett: 38,
    zeit: "30 Min", schwierigkeit: "Mittel",
    bild: "🍛",
    tags: ["keto", "curry", "sattmacher"],
    zutaten: ["400 g Hähnchen", "400 ml Kokosmilch (vollfett)", "1 Zwiebel", "2 EL Currypulver", "1 TL Kurkuma", "Knoblauch", "Ingwer", "Spinat", "Kokosöl"],
    zubereitung: ["Zwiebel, Knoblauch, Ingwer in Kokosöl anschwitzen.", "Gewürze kurz mitrösten.", "Hähnchen anbraten.", "Kokosmilch angießen, 15 Min köcheln.", "Spinat unterrühren, abschmecken."],
  },
  {
    id: "lammkoteletts-rosenkohl",
    name: "Lammkoteletts mit Rosenkohl",
    kategorie: "Abendessen",
    kcal: 560, kh: 6, eiweiss: 42, fett: 40,
    zeit: "35 Min", schwierigkeit: "Mittel",
    bild: "🍖",
    tags: ["keto", "lamm", "premium"],
    zutaten: ["4 Lammkoteletts", "400 g Rosenkohl", "3 EL Butter", "Rosmarin, Thymian", "Knoblauch", "Salz, Pfeffer"],
    zubereitung: ["Koteletts würzen, mit Kräutern einreiben.", "In heißer Pfanne je 3 Min braten.", "Rosenkohl halbieren, in Butter 10 Min braten.", "Knoblauch kurz vor Ende dazugeben."],
  },
  {
    id: "rinderhack-pilze",
    name: "Rinderhack-Pfanne mit Pilzen",
    kategorie: "Abendessen",
    kcal: 480, kh: 4, eiweiss: 34, fett: 36,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍄",
    tags: ["keto", "hack", "schnell"],
    zutaten: ["400 g Rinderhack", "300 g Champions", "1 Zwiebel", "2 EL Butter", "Sahne optional", "Petersilie", "Gewürze"],
    zubereitung: ["Zwiebel in Butter anschwitzen.", "Hack krümelig braten.", "Pilze dazu, 5 Min mitbraten.", "Würzen, optional Sahne einkochen.", "Mit Petersilie servieren."],
  },
  {
    id: "spargel-schweinefilet",
    name: "Schweinefilet mit Spargel",
    kategorie: "Abendessen",
    kcal: 420, kh: 4, eiweiss: 38, fett: 27,
    zeit: "30 Min", schwierigkeit: "Mittel",
    bild: "🌿",
    tags: ["keto", "spargel", "elegant"],
    zutaten: ["300 g Schweinefilet", "500 g grüner Spargel", "3 EL Butter", "Zitrone", "Salz, Pfeffer"],
    zubereitung: ["Filet würzen, rundum anbraten.", "Bei 180 °C ca. 15 Min im Ofen garen.", "Spargel 5–7 Min kochen.", "Mit Butter und Zitrone schwenken."],
  },
  {
    id: "zucchini-lasagne",
    name: "Zucchini-Lasagne mit Ricotta",
    kategorie: "Abendessen",
    kcal: 450, kh: 7, eiweiss: 30, fett: 33,
    zeit: "50 Min", schwierigkeit: "Aufwendig",
    bild: "🫙",
    tags: ["keto", "vegetarisch", "ofengericht"],
    zutaten: ["3 Zucchini", "400 g Ricotta", "2 Eier", "Tomatensoße (zuckerfrei)", "Parmesan", "Mozzarella", "Basilikum"],
    zubereitung: ["Ofen auf 180 °C vorheizen.", "Zucchini längs in Scheiben, kurz anrösten.", "Ricotta mit Eiern und Gewürzen mischen.", "Schichten: Soße, Zucchini, Ricotta, Käse.", "30 Min backen."],
  },
  {
    id: "schweinekotelett-gruene-bohnen",
    name: "Schweinekotelett mit grünen Bohnen",
    kategorie: "Abendessen",
    kcal: 480, kh: 7, eiweiss: 38, fett: 32,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🥩",
    tags: ["keto", "schwein", "einfach"],
    zutaten: ["2 Schweinekoteletts", "300 g grüne Bohnen", "3 EL Butter", "Knoblauch", "Thymian"],
    zubereitung: ["Koteletts würzen, je 5 Min braten.", "Bohnen in Salzwasser 5 Min kochen.", "In Butter mit Knoblauch und Thymian schwenken."],
  },
  {
    id: "lachs-spargel-ofen",
    name: "Lachs und Spargel aus dem Ofen",
    kategorie: "Abendessen",
    kcal: 440, kh: 4, eiweiss: 38, fett: 30,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "ofen", "lachs"],
    zutaten: ["200 g Lachsfilet", "400 g grüner Spargel", "3 EL Olivenöl", "Zitronenscheiben", "Dill", "Knoblauch"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Spargel auf Backblech, Lachs daneben.", "Olivenöl, Knoblauch und Zitrone drüber.", "20 Min backen."],
  },
  {
    id: "entenbrust-rotkohlsalat",
    name: "Entenbrust mit Rotkohlsalat",
    kategorie: "Abendessen",
    kcal: 520, kh: 6, eiweiss: 36, fett: 38,
    zeit: "35 Min", schwierigkeit: "Mittel",
    bild: "🦆",
    tags: ["keto", "ente", "premium"],
    zutaten: ["1 Entenbrust", "300 g Rotkohl", "2 EL Apfelessig", "1 EL Olivenöl", "Stevia", "Kümmel"],
    zubereitung: ["Entenbrust Haut einritzen, würzen.", "Hautseite unten in kalte Pfanne, 12 Min braten.", "Wenden, 5 Min weiter, 5 Min ruhen.", "Rotkohl fein hobeln, mit Essig, Öl, Stevia, Kümmel marinieren."],
  },
  {
    id: "puten-sahne-pilze",
    name: "Putenbrust in Sahne-Pilz-Soße",
    kategorie: "Abendessen",
    kcal: 460, kh: 4, eiweiss: 44, fett: 28,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍄",
    tags: ["keto", "pute", "sahne"],
    zutaten: ["300 g Putenbrust", "300 g Champions", "200 ml Sahne", "1 Schalotte", "2 EL Butter", "Thymian", "Petersilie"],
    zubereitung: ["Pute würzen, braten, beiseitelegen.", "Schalotte und Pilze in Butter braten.", "Sahne angießen, einkochen.", "Pute zurück, Thymian und Petersilie dazu."],
  },
  {
    id: "keto-bolognese-zucchini",
    name: "Keto-Bolognese mit Zucchini-Nudeln",
    kategorie: "Abendessen",
    kcal: 470, kh: 7, eiweiss: 32, fett: 34,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🍝",
    tags: ["keto", "hack", "pasta-ersatz"],
    zutaten: ["400 g Rinderhack", "3 Zucchini", "1 Dose Tomaten (400 g)", "1 Zwiebel", "2 Zehen Knoblauch", "Olivenöl", "Oregano, Basilikum", "Parmesan"],
    zubereitung: ["Zwiebel und Knoblauch in Öl anschwitzen.", "Hack anbraten, Tomaten dazugeben.", "20 Min köcheln lassen, würzen.", "Zucchini-Nudeln kurz braten.", "Mit Parmesan servieren."],
  },
  {
    id: "schweinebauch-brokkoli",
    name: "Knuspriger Schweinebauch mit Brokkoli",
    kategorie: "Abendessen",
    kcal: 640, kh: 5, eiweiss: 28, fett: 56,
    zeit: "2 h", schwierigkeit: "Aufwendig",
    bild: "🥓",
    tags: ["keto", "schwein", "knusprig"],
    zutaten: ["500 g Schweinebauch", "300 g Brokkoli", "Meersalz", "Kümmel", "Knoblauch", "2 EL Butter"],
    zubereitung: ["Ofen auf 220 °C vorheizen.", "Schweinebauch-Haut einritzen, salzen.", "1,5 h bei 160 °C garen, dann 15 Min bei 240 °C knusprig.", "Brokkoli in Butter mit Knoblauch braten."],
  },
  {
    id: "fisch-kraeuterkruste",
    name: "Kabeljau mit Kräuterkruste",
    kategorie: "Abendessen",
    kcal: 360, kh: 3, eiweiss: 38, fett: 20,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "fisch", "ofen"],
    zutaten: ["300 g Kabeljau-Filet", "30 g Mandelmehl", "Kräuter (Petersilie, Dill, Thymian)", "2 EL Butter", "Zitrone", "Salz, Pfeffer"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Kräuter, Mandelmehl und Butter zu Paste mischen.", "Fisch würzen, Paste obendrauf.", "15 Min backen bis goldbraun."],
  },
  {
    id: "keto-auflauf",
    name: "Hähnchen-Gemüse-Auflauf",
    kategorie: "Abendessen",
    kcal: 430, kh: 7, eiweiss: 42, fett: 24,
    zeit: "45 Min", schwierigkeit: "Mittel",
    bild: "🍳",
    tags: ["keto", "ofen", "hähnchen"],
    zutaten: ["400 g Hähnchenbrust", "2 Zucchini", "1 Paprika", "200 ml Sahne", "100 g Gouda", "Knoblauch", "Provencéer Kräuter"],
    zubereitung: ["Ofen auf 180 °C vorheizen.", "Hähnchen und Gemüse in Auflaufform.", "Sahne mit Knoblauch und Kräutern drübergießen.", "Käse drüber, 35 Min backen."],
  },
  {
    id: "garnelen-kokos-curry",
    name: "Garnelen-Kokos-Curry",
    kategorie: "Abendessen",
    kcal: 420, kh: 7, eiweiss: 26, fett: 32,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🦐",
    tags: ["keto", "curry", "thai"],
    zutaten: ["250 g Garnelen", "400 ml Kokosmilch", "2 EL rote Currypaste", "Spinat", "Knoblauch", "Ingwer", "Limette", "Koriander"],
    zubereitung: ["Knoblauch und Ingwer in Öl anschwitzen.", "Currypaste kurz mitrösten.", "Kokosmilch eingießen, 5 Min köcheln.", "Garnelen und Spinat dazu, 3 Min garen.", "Mit Limette und Koriander servieren."],
  },
  {
    id: "keto-schnitzel",
    name: "Keto-Schnitzel (Mandelmehl-Panade)",
    kategorie: "Abendessen",
    kcal: 490, kh: 4, eiweiss: 40, fett: 34,
    zeit: "20 Min", schwierigkeit: "Mittel",
    bild: "🥩",
    tags: ["keto", "schnitzel", "panade"],
    zutaten: ["2 Schweineschnitzel", "80 g Mandelmehl", "2 Eier", "Salz, Pfeffer", "Paprikapulver", "Kokosöl zum Braten"],
    zubereitung: ["Schnitzel dünn klopfen, würzen.", "In verquirltem Ei wenden.", "In Mandelmehl wenden, andrücken.", "In heißem Öl 3 Min je Seite braten."],
  },
  {
    id: "rindfleisch-brokkoli-wok",
    name: "Rindfleisch-Brokkoli-Wok",
    kategorie: "Abendessen",
    kcal: 440, kh: 8, eiweiss: 36, fett: 28,
    zeit: "20 Min", schwierigkeit: "Mittel",
    bild: "🥦",
    tags: ["keto", "wok", "asiatisch"],
    zutaten: ["300 g Rinderstreifen", "300 g Brokkoli", "3 EL Sojasoße", "1 EL Sesamöl", "Knoblauch", "Ingwer", "Sesam"],
    zubereitung: ["Rinderstreifen scharf 2 Min braten, beiseitelegen.", "Brokkoli, Knoblauch, Ingwer im Wok 4 Min braten.", "Fleisch zurück, Sojasoße drüber.", "Mit Sesam servieren."],
  },
  {
    id: "keto-meatballs",
    name: "Keto-Hackbällchen in Tomaten-Soße",
    kategorie: "Abendessen",
    kcal: 450, kh: 6, eiweiss: 32, fett: 34,
    zeit: "30 Min", schwierigkeit: "Mittel",
    bild: "🍖",
    tags: ["keto", "hack", "tomaten"],
    zutaten: ["400 g gemischtes Hack", "1 Ei", "30 g Parmesan", "Knoblauch", "Oregano", "1 Dose Tomaten", "Olivenöl", "Basilikum"],
    zubereitung: ["Hack mit Ei, Parmesan, Knoblauch, Oregano zu Bällchen formen.", "In Öl rundum braten.", "Tomaten dazugeben, 15 Min köcheln.", "Mit Basilikum und Parmesan servieren."],
  },
  {
    id: "forelle-zitrone-butter",
    name: "Forelle in Zitronenbutter",
    kategorie: "Abendessen",
    kcal: 380, kh: 1, eiweiss: 34, fett: 26,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🐠",
    tags: ["keto", "fisch", "elegant"],
    zutaten: ["2 Forellenfilets", "3 EL Butter", "1 Zitrone", "Kapern", "Petersilie", "Salz, Pfeffer"],
    zubereitung: ["Forelle würzen, in 2 EL Butter 4 Min je Seite braten.", "Restliche Butter bräunen, Zitronensaft und Kapern dazu.", "Butter-Soße über Fisch gießen.", "Mit Petersilie garnieren."],
  },
  {
    id: "haehnchen-feta-ofen",
    name: "Hähnchen-Feta-Tomaten aus dem Ofen",
    kategorie: "Abendessen",
    kcal: 480, kh: 5, eiweiss: 48, fett: 28,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🍅",
    tags: ["keto", "ofen", "mediterran"],
    zutaten: ["2 Hähnchenbrüste", "200 g Feta", "Kirschtomaten", "Olivenöl", "Knoblauch", "Oregano", "Basilikum"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Hähnchen in Auflaufform legen.", "Tomaten und Feta-Stücke drumherum.", "Mit Olivenöl, Knoblauch und Kräutern übergießen.", "25–30 Min backen."],
  },
  {
    id: "lamm-spinat-pfanne",
    name: "Lammhackfleisch mit Spinat und Feta",
    kategorie: "Abendessen",
    kcal: 490, kh: 4, eiweiss: 34, fett: 38,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🌿",
    tags: ["keto", "lamm", "spinat"],
    zutaten: ["400 g Lammhack", "200 g Spinat", "150 g Feta", "1 Zwiebel", "Knoblauch", "Kreuzkümmel", "Olivenöl"],
    zubereitung: ["Zwiebel und Knoblauch in Öl anschwitzen.", "Lammhack braten, mit Kreuzkümmel würzen.", "Spinat unterrühren, zusammenfallen lassen.", "Feta drüber krümeln."],
  },
  {
    id: "keto-stir-fry-haehnchen",
    name: "Hähnchen-Stir-Fry mit Gemüse",
    kategorie: "Abendessen",
    kcal: 390, kh: 7, eiweiss: 40, fett: 20,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["keto", "wok", "hähnchen"],
    zutaten: ["300 g Hähnchenbrust", "1 Paprika", "Zucchini", "Champignons", "Sojasoße", "Sesamöl", "Ingwer", "Knoblauch", "Sesam"],
    zubereitung: ["Hähnchen in Streifen scharf anbraten.", "Gemüse dazu, alles scharf braten.", "Sojasoße, Ingwer und Knoblauch einrühren.", "Mit Sesam bestreuen."],
  },
  {
    id: "keto-frittata",
    name: "Gemüse-Frittata",
    kategorie: "Abendessen",
    kcal: 360, kh: 5, eiweiss: 22, fett: 28,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["keto", "vegetarisch", "eier"],
    zutaten: ["6 Eier", "1 Zucchini", "1 Paprika", "50 g Feta", "50 g Parmesan", "Olivenöl", "Kräuter nach Wahl"],
    zubereitung: ["Ofen auf 180 °C vorheizen.", "Gemüse in ofenfester Pfanne 5 Min anbraten.", "Verquirlte Eier drübergießen, Käse drüber.", "Auf Herd stocken lassen, dann 10 Min im Ofen fertigbacken."],
  },
  {
    id: "keto-saltimbocca",
    name: "Keto-Saltimbocca",
    kategorie: "Abendessen",
    kcal: 420, kh: 1, eiweiss: 44, fett: 26,
    zeit: "20 Min", schwierigkeit: "Mittel",
    bild: "🍗",
    tags: ["keto", "italienisch", "elegant"],
    zutaten: ["2 Hähnchenbrüste", "8 Scheiben Prosciutto", "Salbei", "3 EL Butter", "50 ml Weißwein (trocken)", "Salz, Pfeffer"],
    zubereitung: ["Hähnchen dünn klopfen, mit Salbei und Prosciutto belegen.", "In Butter von beiden Seiten 4 Min braten.", "Weißwein angießen, kurz einkochen."],
  },
  {
    id: "thunfisch-brokkoli-auflauf",
    name: "Thunfisch-Brokkoli-Auflauf",
    kategorie: "Abendessen",
    kcal: 400, kh: 6, eiweiss: 36, fett: 26,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🥦",
    tags: ["keto", "dose", "ofen"],
    zutaten: ["2 Dosen Thunfisch", "400 g Brokkoli", "200 ml Sahne", "100 g Gouda", "2 Eier", "Knoblauch", "Salz, Pfeffer", "Muskat"],
    zubereitung: ["Ofen auf 190 °C vorheizen.", "Brokkoli 5 Min blanchieren.", "Thunfisch, Sahne, Eier, Knoblauch verrühren.", "Brokkoli und Masse in Auflaufform, Käse drüber.", "25 Min überbacken."],
  },

  // ─── SNACKS ───────────────────────────────────────────────────────────────
  {
    id: "keto-schokomousse",
    name: "Keto Schoko-Mousse",
    kategorie: "Snack",
    kcal: 280, kh: 4, eiweiss: 4, fett: 28,
    zeit: "10 Min + 1 h", schwierigkeit: "Einfach",
    bild: "🍫",
    tags: ["keto", "dessert", "süß"],
    zutaten: ["200 ml Schlagsahne", "2 EL Kakaopulver (ungesüßt)", "Stevia", "1 TL Vanille"],
    zubereitung: ["Sahne steif schlagen.", "Kakao, Stevia und Vanille unterfalten.", "In Gläser füllen, 1 h kühlen."],
  },
  {
    id: "keto-brot",
    name: "Keto-Brot (Mandelmehl)",
    kategorie: "Snack",
    kcal: 180, kh: 3, eiweiss: 8, fett: 15,
    zeit: "50 Min", schwierigkeit: "Mittel",
    bild: "🍞",
    tags: ["keto", "backen", "brot"],
    zutaten: ["200 g Mandelmehl", "4 Eier", "50 g Butter geschmolzen", "1 Päckchen Backpulver", "Salz", "Sesam"],
    zubereitung: ["Ofen auf 180 °C vorheizen.", "Alle Zutaten gut vermengen.", "In gefettete Kastenform füllen.", "40–45 Min backen, auskühlen lassen."],
  },
  {
    id: "kaese-chips",
    name: "Käse-Chips (Parmesan oder Cheddar)",
    kategorie: "Snack",
    kcal: 220, kh: 1, eiweiss: 18, fett: 16,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🧀",
    tags: ["keto", "knusprig", "chips"],
    zutaten: ["150 g Parmesan oder Cheddar gerieben", "optional: Paprikapulver, Rosmarin"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Kleine Häufchen Käse auf Backpapier.", "7–8 Min backen bis goldbraun.", "Auskühlen lassen — werden knusprig."],
  },
  {
    id: "avocado-dip",
    name: "Guacamole mit Sellerie-Sticks",
    kategorie: "Snack",
    kcal: 200, kh: 4, eiweiss: 3, fett: 18,
    zeit: "8 Min", schwierigkeit: "Einfach",
    bild: "🥑",
    tags: ["keto", "dip", "avocado"],
    zutaten: ["2 Avocados", "1 Limette", "½ rote Zwiebel", "Chili", "Koriander", "Salz", "Sellerie zum Dippen"],
    zubereitung: ["Avocados zerdrücken.", "Limettensaft, Zwiebel, Chili und Koriander untermengen.", "Mit Salz abschmecken.", "Mit Sellerie-Sticks servieren."],
  },
  {
    id: "beef-jerky",
    name: "Keto Beef Jerky",
    kategorie: "Snack",
    kcal: 200, kh: 2, eiweiss: 28, fett: 9,
    zeit: "6 h", schwierigkeit: "Mittel",
    bild: "🥩",
    tags: ["keto", "protein", "haltbar"],
    zutaten: ["500 g mageres Rindfleisch", "3 EL Sojasoße", "1 EL Worcestersoße (zuckerfrei)", "Knoblauchpulver", "Paprikapulver", "Pfeffer"],
    zubereitung: ["Fleisch in 5 mm dünne Streifen schneiden.", "In Marinade mind. 4 h einlegen.", "Im Ofen bei 70 °C (Umluft) auf Rost 5–6 h trocknen.", "Hält im Kühlschrank 2 Wochen."],
  },
  {
    id: "deviled-eggs",
    name: "Deviled Eggs (gefüllte Eier)",
    kategorie: "Snack",
    kcal: 220, kh: 1, eiweiss: 14, fett: 18,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥚",
    tags: ["keto", "eier", "party"],
    zutaten: ["6 Eier", "3 EL Mayonnaise", "1 TL Senf", "Paprikapulver", "Schnittlauch", "Salz, Pfeffer"],
    zubereitung: ["Eier 10 Min hartkochen, schälen.", "Halbieren, Dotter herauslösen.", "Dotter mit Mayo, Senf, Salz, Pfeffer cremig rühren.", "In Eiweiß-Hälften spritzen.", "Mit Paprika und Schnittlauch garnieren."],
  },
  {
    id: "speck-pilz-bissen",
    name: "Speck-Pilz-Bissen",
    kategorie: "Snack",
    kcal: 180, kh: 1, eiweiss: 12, fett: 14,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🍄",
    tags: ["keto", "speck", "fingerfood"],
    zutaten: ["12 mittelgroße Champions", "6 Scheiben Bacon", "Frischkäse", "Schnittlauch", "Salz, Pfeffer"],
    zubereitung: ["Pilzstiele entfernen, Frischkäse einfüllen.", "Jeden Pilz mit halbem Bacon-Streifen umwickeln.", "Im Ofen bei 200 °C 15 Min backen."],
  },
  {
    id: "nut-mix-keto",
    name: "Gewürzter Keto-Nuss-Mix",
    kategorie: "Snack",
    kcal: 350, kh: 5, eiweiss: 10, fett: 32,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥜",
    tags: ["keto", "nüsse", "snack"],
    zutaten: ["100 g Macadamia", "80 g Pecannüsse", "50 g Kürbiskerne", "1 EL Butter", "Rosmarin", "Meersalz", "Cayennepfeffer"],
    zubereitung: ["Butter schmelzen, Nüsse dazu.", "Mit Rosmarin, Salz und Cayenne mischen.", "In Pfanne 5 Min rösten.", "Auskühlen lassen."],
  },
  {
    id: "kokosballs",
    name: "Keto-Kokos-Balls",
    kategorie: "Snack",
    kcal: 120, kh: 2, eiweiss: 2, fett: 11,
    zeit: "15 Min + 1 h", schwierigkeit: "Einfach",
    bild: "🥥",
    tags: ["keto", "süß", "meal-prep"],
    zutaten: ["100 g Kokosraspeln (+ extra zum Wälzen)", "50 g Mandelmehl", "3 EL Kokosöl", "Stevia", "Vanille"],
    zubereitung: ["Alle Zutaten vermengen.", "Zu Bällchen formen.", "In Kokosraspeln wälzen.", "1 h kühlen."],
  },
  {
    id: "keto-pralinen",
    name: "Dunkle Keto-Schokoladen-Pralinen",
    kategorie: "Snack",
    kcal: 100, kh: 2, eiweiss: 2, fett: 9,
    zeit: "20 Min + 1 h", schwierigkeit: "Einfach",
    bild: "🍫",
    tags: ["keto", "schokolade", "süß"],
    zutaten: ["100 g dunkle Schokolade 90 %", "2 EL Kokosöl", "Stevia", "optional: Meersalz, Nüsse"],
    zubereitung: ["Schokolade mit Kokosöl im Wasserbad schmelzen.", "Stevia einrühren.", "In Pralinenform gießen.", "Optional Nüsse oder Meersalz drüber.", "1 h kühlen."],
  },
  {
    id: "chiasamen-pudding-snack",
    name: "Schokoladen-Chia-Pudding",
    kategorie: "Snack",
    kcal: 240, kh: 5, eiweiss: 7, fett: 19,
    zeit: "5 Min + 4 h", schwierigkeit: "Einfach",
    bild: "🍫",
    tags: ["keto", "schokolade", "vorbereitung"],
    zutaten: ["3 EL Chiasamen", "200 ml Kokosmilch", "2 EL Kakaopulver", "Stevia", "Himbeeren"],
    zubereitung: ["Alle Zutaten außer Beeren mischen.", "4 h oder über Nacht kühlen.", "Mit Himbeeren servieren."],
  },
  {
    id: "keto-protein-balls",
    name: "Keto Protein-Balls",
    kategorie: "Snack",
    kcal: 150, kh: 3, eiweiss: 8, fett: 12,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "⚡",
    tags: ["keto", "protein", "meal-prep"],
    zutaten: ["80 g Mandelmehl", "50 g Mandelbutter", "2 EL Chiasamen", "1 EL Kokosöl", "Stevia", "Vanille", "Prise Salz"],
    zubereitung: ["Alle Zutaten vermengen bis knetbar.", "Bei Bedarf mehr Mandelmehl.", "Zu Bällchen formen.", "Im Kühlschrank aufbewahren."],
  },
  {
    id: "oliven-antipasti",
    name: "Oliven-Antipasti-Platte",
    kategorie: "Snack",
    kcal: 280, kh: 3, eiweiss: 10, fett: 24,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🫒",
    tags: ["keto", "kalt", "mediterran"],
    zutaten: ["100 g gemischte Oliven", "80 g Salami", "60 g Prosciutto", "100 g Feta", "Kirschtomaten", "Basilikum"],
    zubereitung: ["Alles auf einem Brett oder Teller anrichten.", "Mit Olivenöl beträufeln."],
  },
  {
    id: "gurken-frischkaese",
    name: "Gurken-Scheiben mit Frischkäse",
    kategorie: "Snack",
    kcal: 130, kh: 2, eiweiss: 5, fett: 10,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🥒",
    tags: ["keto", "einfach", "schnell"],
    zutaten: ["1 Salatgurke", "100 g Kräuterfrischkäse", "Dill", "Paprikapulver"],
    zubereitung: ["Gurke in Scheiben schneiden.", "Frischkäse draufstreichen.", "Mit Dill und Paprika garnieren."],
  },
  {
    id: "keto-zimt-mandeln",
    name: "Zimt-Mandeln (Keto)",
    kategorie: "Snack",
    kcal: 290, kh: 4, eiweiss: 9, fett: 26,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🌰",
    tags: ["keto", "nüsse", "süß"],
    zutaten: ["150 g Mandeln", "1 EL Kokosöl", "2 TL Zimt", "Stevia", "Prise Meersalz"],
    zubereitung: ["Ofen auf 180 °C vorheizen.", "Mandeln mit Kokosöl, Zimt und Stevia mischen.", "10 Min rösten, abkühlen lassen."],
  },
  {
    id: "keto-kaesekuchen-biss",
    name: "Keto-Käsekuchen-Bissen",
    kategorie: "Snack",
    kcal: 160, kh: 3, eiweiss: 6, fett: 14,
    zeit: "30 Min + 1 h", schwierigkeit: "Mittel",
    bild: "🧁",
    tags: ["keto", "süß", "käsekuchen"],
    zutaten: ["200 g Frischkäse", "2 Eier", "50 g Mandelmehl", "2 EL Erythrit", "Vanille", "Zitronenabrieb"],
    zubereitung: ["Ofen auf 160 °C vorheizen.", "Alle Zutaten cremig verrühren.", "In Mini-Muffinform füllen.", "20 Min backen, dann 1 h kühlen."],
  },
  {
    id: "speck-avocado-happen",
    name: "Speck-Avocado-Happen",
    kategorie: "Snack",
    kcal: 210, kh: 2, eiweiss: 8, fett: 19,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥑",
    tags: ["keto", "avocado", "speck"],
    zutaten: ["1 Avocado", "8 Scheiben Bacon", "Meersalz", "Limette"],
    zubereitung: ["Avocado in Würfel schneiden.", "Bacon knusprig braten.", "Avocadowürfel in Speck einrollen.", "Mit Meersalz und Limette servieren."],
  },
  {
    id: "keto-cookies",
    name: "Keto-Cookies (Mandelmehl)",
    kategorie: "Snack",
    kcal: 170, kh: 3, eiweiss: 5, fett: 15,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍪",
    tags: ["keto", "backen", "süß"],
    zutaten: ["150 g Mandelmehl", "1 Ei", "3 EL Kokosöl", "Stevia", "1 TL Vanille", "Prise Salz", "optional: Schokodrops 85 %"],
    zubereitung: ["Ofen auf 175 °C vorheizen.", "Alle Zutaten verkneten.", "Zu Bällchen formen, flach drücken.", "12–14 Min goldbraun backen."],
  },
  {
    id: "walnuss-frischkaese",
    name: "Walnuss-Frischkäse-Bissen",
    kategorie: "Snack",
    kcal: 190, kh: 2, eiweiss: 5, fett: 18,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🥜",
    tags: ["keto", "einfach", "schnell"],
    zutaten: ["12 Walnusshälften", "80 g Frischkäse", "Stevia + Vanille", "Meersalz"],
    zubereitung: ["Frischkäse mit Stevia und Vanille verrühren.", "Je ein TL Frischkäse zwischen zwei Walnusshälften setzen.", "Mit Meersalz bestreuen."],
  },
  {
    id: "keto-beeren-sahne",
    name: "Beeren mit Mascarpone-Creme",
    kategorie: "Snack",
    kcal: 250, kh: 6, eiweiss: 4, fett: 22,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🍓",
    tags: ["keto", "süß", "beeren"],
    zutaten: ["100 g gemischte Beeren", "100 g Mascarpone", "1 EL Sahne", "Stevia", "Vanille", "Minze"],
    zubereitung: ["Mascarpone mit Sahne, Stevia und Vanille cremig rühren.", "Beeren in Glas geben, Creme drüber.", "Mit Minze garnieren."],
  },
  {
    id: "keto-smoothie-beeren",
    name: "Keto Beeren-Smoothie",
    kategorie: "Snack",
    kcal: 220, kh: 6, eiweiss: 5, fett: 19,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🫐",
    tags: ["keto", "smoothie", "beeren"],
    zutaten: ["100 g Himbeeren (TK)", "200 ml Kokosmilch", "1 EL MCT-Öl", "1 EL Chiasamen", "Stevia", "Eis"],
    zubereitung: ["Alle Zutaten in Mixer geben.", "30 Sekunden mixen.", "Sofort servieren."],
  },

  // ─── TANJA'S REZEPTE ──────────────────────────────────────────────────────
  {
    id: "fruehstuecksteller",
    name: "Frühstücksteller: Salami, Käse & Eier",
    kategorie: "Frühstück",
    kcal: 420, kh: 2, eiweiss: 28, fett: 34,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥚",
    tags: ["keto", "salami", "käse", "eier", "favorit"],
    zutaten: ["3 Eier (hartgekocht)", "80 g Salami in Scheiben", "80 g Gouda oder Cheddar", "Gürkchen/Cornichons", "Senf (zuckerfrei)", "Salz, Pfeffer"],
    zubereitung: ["Eier 8 Min kochen, schälen und halbieren.", "Salami und Käse auf Teller legen.", "Eier daneben, mit Senf und Gürkchen servieren.", "Mit Salz und Pfeffer würzen."],
  },
  {
    id: "gulaschsuppe",
    name: "Keto Gulaschsuppe",
    kategorie: "Mittagessen",
    kcal: 380, kh: 8, eiweiss: 28, fett: 24,
    zeit: "60 Min", schwierigkeit: "Mittel",
    bild: "🥣",
    tags: ["keto", "gulasch", "suppe", "favorit"],
    zutaten: ["500 g Rindfleisch (Gulasch)", "2 Zwiebeln", "2 Paprika (rot)", "2 EL Tomatenmark", "1 L Rinderbrühe", "2 EL Paprikapulver (edelsüß)", "1 TL Kümmel", "Knoblauch", "2 EL Schmalz oder Kokosöl", "Salz, Pfeffer"],
    zubereitung: ["Fleisch in Würfel schneiden, in Schmalz scharf anbraten.", "Zwiebeln und Knoblauch zugeben, anschwitzen.", "Paprikapulver kurz mitrösten (nicht verbrennen lassen!).", "Tomatenmark einrühren, kurz anbraten.", "Brühe angießen, Paprika in Streifen dazu.", "45 Min bei niedriger Hitze köcheln bis Fleisch weich.", "Mit Kümmel, Salz und Pfeffer abschmecken."],
  },
  {
    id: "kaese-lauch-suppe",
    name: "Käse-Lauch-Suppe mit Hackfleisch",
    kategorie: "Mittagessen",
    kcal: 490, kh: 7, eiweiss: 28, fett: 38,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🧀",
    tags: ["keto", "suppe", "lauch", "käse", "hack", "favorit"],
    zutaten: ["400 g Rinderhack", "3 Stangen Lauch", "200 g Schmelzkäse (Kräuter)", "500 ml Hühnerbrühe", "200 ml Sahne", "1 Zwiebel", "2 EL Butter", "Salz, Pfeffer", "Paprikapulver"],
    zubereitung: ["Zwiebel in Butter anschwitzen.", "Hack zugeben, krümelig braten.", "Lauch in Ringe schneiden, 3 Min mitbraten.", "Brühe und Sahne angießen, aufkochen.", "Schmelzkäse einrühren bis aufgelöst.", "Mit Paprika, Salz und Pfeffer abschmecken."],
  },
  {
    id: "huehnersuppe-sojasauce",
    name: "Hühnersuppe mit Gemüse & Sojasauce",
    kategorie: "Mittagessen",
    kcal: 310, kh: 6, eiweiss: 34, fett: 14,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🍲",
    tags: ["keto", "suppe", "hähnchen", "favorit"],
    zutaten: ["2 Hähnchenbrüste", "2 Karotten", "2 Stangen Sellerie", "1 L Hühnerbrühe", "3 EL Sojasoße (oder Kokosaminosäuren)", "Knoblauch", "Ingwer", "Zucchini", "Frühlingszwiebeln", "Sesamöl (1 TL)"],
    zubereitung: ["Hähnchen in Stücke schneiden, in Brühe 15 Min kochen.", "Karotten, Sellerie und Zucchini in Stücke schneiden, dazugeben.", "Knoblauch und Ingwer einrühren.", "10 Min köcheln bis Gemüse gar.", "Mit Sojasoße und Sesamöl abschmecken.", "Mit Frühlingszwiebeln garnieren."],
  },
  {
    id: "gruene-bohnen-hack",
    name: "Grüne Bohnen mit Hackfleisch",
    kategorie: "Abendessen",
    kcal: 380, kh: 8, eiweiss: 28, fett: 26,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🫘",
    tags: ["keto", "grüne bohnen", "hack", "favorit"],
    zutaten: ["400 g Rinderhack", "500 g grüne Bohnen (frisch oder TK)", "1 Zwiebel", "2 EL Butter", "Knoblauch", "Tomatenmark (1 EL)", "Paprikapulver", "Salz, Pfeffer"],
    zubereitung: ["Bohnen in Salzwasser 8 Min kochen, abgießen.", "Zwiebel und Knoblauch in Butter anschwitzen.", "Hack dazugeben, krümelig braten.", "Tomatenmark und Paprikapulver einrühren.", "Grüne Bohnen unterheben, 5 Min mitbraten.", "Mit Salz und Pfeffer abschmecken."],
  },
  {
    id: "gruene-bohnen-butter",
    name: "Grüne Bohnen in Knoblauchbutter",
    kategorie: "Mittagessen",
    kcal: 180, kh: 6, eiweiss: 4, fett: 14,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🫘",
    tags: ["keto", "grüne bohnen", "beilage", "favorit"],
    zutaten: ["500 g grüne Bohnen", "3 EL Butter", "3 Zehen Knoblauch", "Speck optional", "Salz, Pfeffer", "Mandelblättchen optional"],
    zubereitung: ["Bohnen in Salzwasser 7 Min kochen, abgießen.", "Butter in Pfanne schmelzen, Knoblauch anschwitzen.", "Optional: Speck knusprig braten.", "Bohnen dazugeben und 3 Min schwenken.", "Mit Mandelblättchen und Salz servieren."],
  },
  {
    id: "haehnchen-gruene-bohnen",
    name: "Hähnchen mit grünen Bohnen und Sahne",
    kategorie: "Abendessen",
    kcal: 440, kh: 7, eiweiss: 44, fett: 26,
    zeit: "30 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "hähnchen", "grüne bohnen", "favorit"],
    zutaten: ["2 Hähnchenbrüste", "400 g grüne Bohnen", "200 ml Sahne", "1 Zwiebel", "2 EL Butter", "Knoblauch", "Dijonsenf (1 TL)", "Salz, Pfeffer"],
    zubereitung: ["Hähnchen würzen und in Butter braten (je 6 Min).", "Beiseitelegen, Zwiebel und Knoblauch anschwitzen.", "Grüne Bohnen dazu, 3 Min mitbraten.", "Sahne und Senf einrühren, 5 Min einkochen.", "Hähnchen zurück, alles zusammen warm ziehen."],
  },
  {
    id: "keto-kaesekuchen",
    name: "Keto Käsekuchen (ohne Boden)",
    kategorie: "Snack",
    kcal: 220, kh: 4, eiweiss: 10, fett: 18,
    zeit: "60 Min + 2 h", schwierigkeit: "Mittel",
    bild: "🍰",
    tags: ["keto", "käsekuchen", "süß", "backen", "favorit"],
    zutaten: ["500 g Frischkäse (Doppelrahm)", "3 Eier", "100 g Erythrit", "1 TL Vanilleextrakt", "Abrieb ½ Zitrone", "200 g saure Sahne", "1 EL Stärke (Tapioka oder Kokosmehl)"],
    zubereitung: ["Ofen auf 160 °C vorheizen.", "Frischkäse mit Erythrit cremig rühren.", "Eier einzeln unterrühren.", "Vanille, Zitronenabrieb und Mehl dazu.", "Saure Sahne unterheben.", "In gefettete Springform (18 cm) füllen.", "50–55 Min backen, dann im ausgeschalteten Ofen abkühlen lassen.", "Mindestens 2 h kühlen vor dem Servieren."],
  },
  {
    id: "eiweissbrot-flohsamen",
    name: "Eiweißbrot mit Flohsamenschalen",
    kategorie: "Snack",
    kcal: 140, kh: 2, eiweiss: 10, fett: 9,
    zeit: "55 Min", schwierigkeit: "Mittel",
    bild: "🍞",
    tags: ["keto", "brot", "eiweißbrot", "favorit"],
    zutaten: ["200 g Mandelmehl", "4 EL Flohsamenschalen", "5 Eier", "2 TL Backpulver", "1 TL Salz", "2 EL Apfelessig", "120 ml warmes Wasser", "2 EL Olivenöl"],
    zubereitung: ["Ofen auf 180 °C vorheizen.", "Trockene Zutaten mischen.", "Eier, Essig, Öl und Wasser dazu, gut verrühren.", "Teig 2 Min quellen lassen (Flohsamen bindet).", "In Kastenform füllen, Oberfläche glätten.", "45–50 Min backen, Stäbchenprobe.", "Vollständig auskühlen lassen."],
  },
  {
    id: "eiweissbrot-sonnenkerne",
    name: "Sonnenblumenkern-Eiweißbrot",
    kategorie: "Snack",
    kcal: 160, kh: 3, eiweiss: 9, fett: 12,
    zeit: "60 Min", schwierigkeit: "Mittel",
    bild: "🌻",
    tags: ["keto", "brot", "eiweißbrot", "favorit"],
    zutaten: ["150 g Sonnenblumenkerne (gemahlen)", "100 g Mandelmehl", "4 EL Flohsamenschalen", "5 Eier", "2 TL Backpulver", "1 TL Salz", "1 EL Apfelessig", "100 ml Wasser"],
    zubereitung: ["Sonnenblumenkerne im Mixer fein mahlen.", "Mit Mandelmehl, Flohsamen, Backpulver und Salz mischen.", "Eier, Essig und Wasser einrühren.", "3 Min quellen lassen.", "In Kastenform, glattstreichen, optional Kerne obenauf.", "Bei 175 °C 50 Min backen."],
  },
  {
    id: "eiweissbrot-kuestenfrische",
    name: "Eiweißbrot mit Käse und Kräutern",
    kategorie: "Snack",
    kcal: 190, kh: 2, eiweiss: 13, fett: 14,
    zeit: "50 Min", schwierigkeit: "Einfach",
    bild: "🧀",
    tags: ["keto", "brot", "eiweißbrot", "käse", "favorit"],
    zutaten: ["180 g Mandelmehl", "100 g Gouda gerieben", "5 Eier", "1 TL Backpulver", "1 TL Salz", "Kräuter der Provence", "2 EL Butter (geschmolzen)"],
    zubereitung: ["Ofen auf 180 °C vorheizen.", "Mandelmehl, Backpulver, Salz und Kräuter mischen.", "Eier und geschmolzene Butter einrühren.", "Käse unterheben.", "In Kastenform füllen.", "40–45 Min goldbraun backen."],
  },
  {
    id: "linsensuppe-keto",
    name: "Rote Linsensuppe (keto-light)",
    kategorie: "Mittagessen",
    kcal: 290, kh: 18, eiweiss: 14, fett: 12,
    zeit: "30 Min", schwierigkeit: "Einfach",
    bild: "🍲",
    tags: ["lowcarb", "linsen", "suppe", "favorit"],
    zutaten: ["150 g rote Linsen", "1 Zwiebel", "2 Karotten", "1 L Gemüsebrühe", "2 EL Olivenöl", "Kreuzkümmel", "Kurkuma", "Knoblauch", "Zitronensaft", "Salz, Pfeffer"],
    zubereitung: ["Zwiebel und Knoblauch in Öl anschwitzen.", "Gewürze kurz mitrösten.", "Linsen und Karotten dazu.", "Brühe angießen, 20 Min köcheln bis Linsen weich.", "Teilweise pürieren für cremige Konsistenz.", "Mit Zitronensaft abschmecken."],
  },

  // ─── SALATE ───────────────────────────────────────────────────────────────
  {
    id: "falscher-kartoffelsalat",
    name: "Falscher Kartoffelsalat mit Rettich",
    kategorie: "Salat",
    kcal: 210, kh: 5, eiweiss: 6, fett: 18,
    zeit: "20 Min + 30 Min kühlen", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["keto", "salat", "falscher kartoffelsalat", "rettich"],
    zutaten: [
      "1 großer Rettich (ca. 500 g) oder Kohlrabi",
      "4 Eier (hartgekocht)",
      "4 Scheiben Bacon (knusprig gebraten)",
      "3 EL Mayonnaise",
      "2 EL saure Sahne",
      "1 TL Senf (mittelscharf)",
      "½ rote Zwiebel (fein gewürfelt)",
      "Schnittlauch",
      "Salz, Pfeffer, Essig",
    ],
    zubereitung: [
      "Rettich schälen und in mundgerechte Würfel schneiden (ähnlich wie Kartoffelwürfel).",
      "Rettich 5 Min in Salzwasser blanchieren — er wird weicher und milder.",
      "Abgießen, abkühlen lassen.",
      "Eier schälen und würfeln, Bacon in Stücke brechen.",
      "Mayo, saure Sahne, Senf, Essig, Salz und Pfeffer zu einem Dressing verrühren.",
      "Alles mit Zwiebel und Schnittlauch vermengen.",
      "Mindestens 30 Min im Kühlschrank ziehen lassen.",
    ],
  },
  {
    id: "falscher-nudelsalat",
    name: "Falscher Nudelsalat mit Zucchini",
    kategorie: "Salat",
    kcal: 190, kh: 6, eiweiss: 8, fett: 14,
    zeit: "20 Min + 20 Min kühlen", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["keto", "salat", "zucchini", "falscher nudelsalat"],
    zutaten: [
      "2 Zucchini (spiralisiert oder in Streifen)",
      "100 g Schinken (gewürfelt)",
      "100 g Gouda (gewürfelt)",
      "½ rote Paprika",
      "3 EL Mayonnaise",
      "2 EL Joghurt (3,5 %)",
      "1 TL Senf",
      "Salz, Pfeffer, Paprikapulver",
      "Schnittlauch oder Petersilie",
    ],
    zubereitung: [
      "Zucchini mit Spiralschneider in Nudeln schneiden oder mit Sparschäler in breite Streifen.",
      "Optional: Zucchininudeln kurz in Salzwasser blanchieren (2 Min) — für weichere Textur.",
      "Kalt abspülen und gut abtropfen lassen.",
      "Paprika würfeln.",
      "Dressing aus Mayo, Joghurt, Senf, Salz und Pfeffer rühren.",
      "Alle Zutaten vermengen, Kräuter drüber.",
      "20 Min kühlen — dann servieren.",
    ],
  },
  {
    id: "griechischer-salat-keto",
    name: "Griechischer Salat mit Feta",
    kategorie: "Salat",
    kcal: 280, kh: 7, eiweiss: 10, fett: 22,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🫒",
    tags: ["keto", "salat", "feta", "griechisch"],
    zutaten: [
      "200 g Feta (in Würfeln)",
      "1 Gurke",
      "2 Tomaten (oder 200 g Cherrytomaten)",
      "½ rote Zwiebel",
      "80 g schwarze Oliven",
      "4 EL Olivenöl",
      "2 EL Rotweinessig",
      "Oregano, Salz, Pfeffer",
    ],
    zubereitung: [
      "Gurke, Tomaten und Zwiebel in grobe Stücke schneiden.",
      "Mit Oliven und Feta in eine Schüssel geben.",
      "Olivenöl, Essig, Oregano, Salz und Pfeffer als Dressing drüber.",
      "Kurz vermengen und sofort servieren — kein Ziehen nötig.",
    ],
  },
  {
    id: "haehnchen-avocado-salat",
    name: "Hähnchen-Avocado-Salat",
    kategorie: "Salat",
    kcal: 430, kh: 5, eiweiss: 36, fett: 28,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥑",
    tags: ["keto", "salat", "hähnchen", "avocado"],
    zutaten: [
      "2 Hähnchenbrüste (gegrillt oder gebraten)",
      "2 Avocados",
      "1 Handvoll Rucola oder Feldsalat",
      "½ rote Zwiebel",
      "Cherrytomaten (optional, wenige)",
      "3 EL Olivenöl",
      "Saft von ½ Zitrone",
      "Salz, Pfeffer, Knoblauchpulver",
    ],
    zubereitung: [
      "Hähnchen in Streifen schneiden.",
      "Avocado würfeln, sofort mit Zitronensaft beträufeln.",
      "Zwiebel in feine Ringe schneiden.",
      "Olivenöl, Zitrone, Salz und Pfeffer als Dressing mischen.",
      "Alles auf Salatbett anrichten und Dressing drüber.",
    ],
  },
  {
    id: "eier-speck-salat",
    name: "Eier-Speck-Salat mit Senfdressing",
    kategorie: "Salat",
    kcal: 360, kh: 3, eiweiss: 20, fett: 28,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥚",
    tags: ["keto", "salat", "eier", "speck"],
    zutaten: [
      "4 Eier (hartgekocht)",
      "150 g Speck (knusprig gebraten)",
      "1 Kopf Romana- oder Eisbergsalat",
      "3 EL Olivenöl",
      "1 EL Dijonsenf",
      "1 EL Weißweinessig",
      "Salz, Pfeffer",
      "Optional: geriebener Parmesan",
    ],
    zubereitung: [
      "Speck knusprig braten, auf Küchenpapier abtropfen.",
      "Eier schälen und vierteln.",
      "Salat in Stücke reißen.",
      "Senf, Essig, Öl, Salz und Pfeffer zu einem Dressing verrühren.",
      "Salat mit Dressing schwenken, Eier und Speck drauf.",
      "Optional mit Parmesan bestreuen.",
    ],
  },
  {
    id: "kohlrabi-salat",
    name: "Kohlrabi-Salat mit Schnittlauch",
    kategorie: "Salat",
    kcal: 120, kh: 5, eiweiss: 3, fett: 8,
    zeit: "10 Min + 15 Min ziehen", schwierigkeit: "Einfach",
    bild: "🥦",
    tags: ["keto", "salat", "kohlrabi", "beilage"],
    zutaten: [
      "2 Kohlrabi (roh, geschält)",
      "3 EL Olivenöl",
      "2 EL Weißweinessig",
      "1 TL Senf",
      "Schnittlauch (reichlich)",
      "Salz, Pfeffer, 1 Prise Zucker-Ersatz (Erythrit)",
    ],
    zubereitung: [
      "Kohlrabi schälen und in dünne Stifte oder Scheiben hobeln/schneiden.",
      "Olivenöl, Essig, Senf und Gewürze zu Dressing verrühren.",
      "Dressing über Kohlrabi geben.",
      "Schnittlauch in Röllchen schneiden und dazugeben.",
      "15 Min ziehen lassen — dann servieren.",
    ],
  },
  {
    id: "thunfisch-salat-keto",
    name: "Thunfischsalat im Salatblatt",
    kategorie: "Salat",
    kcal: 250, kh: 2, eiweiss: 26, fett: 14,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥬",
    tags: ["keto", "salat", "thunfisch", "schnell"],
    zutaten: [
      "2 Dosen Thunfisch (im eigenen Saft)",
      "3 EL Mayonnaise",
      "½ rote Zwiebel (fein gewürfelt)",
      "Cornichons oder Gürkchen (gewürfelt)",
      "Salz, Pfeffer, Zitronensaft",
      "Große Salatblätter (Romana oder Eisberg) zum Befüllen",
    ],
    zubereitung: [
      "Thunfisch abtropfen und in Schüssel geben.",
      "Mayo, Zwiebel, Cornichons, Zitrone, Salz und Pfeffer unterrühren.",
      "Salatblätter als Schale ausbreiten.",
      "Thunfischmasse in die Blätter füllen.",
      "Sofort servieren.",
    ],
  },
  {
    id: "gurken-dill-salat",
    name: "Gurkensalat mit Dill und saurer Sahne",
    kategorie: "Salat",
    kcal: 90, kh: 4, eiweiss: 2, fett: 6,
    zeit: "10 Min + 20 Min ziehen", schwierigkeit: "Einfach",
    bild: "🥒",
    tags: ["keto", "salat", "gurke", "dill", "beilage"],
    zutaten: [
      "2 Salatgurken",
      "150 g saure Sahne",
      "2 EL Weißweinessig",
      "1 TL Dill (frisch oder TK)",
      "½ TL Knoblauchpulver",
      "Salz, Pfeffer, Prise Erythrit",
    ],
    zubereitung: [
      "Gurken dünn hobeln oder in dünne Scheiben schneiden.",
      "Mit 1 TL Salz bestreuen, 10 Min ziehen lassen — dann ausdrücken.",
      "Saure Sahne, Essig, Dill und Gewürze verrühren.",
      "Über Gurken geben, vermengen.",
      "Mindestens 20 Min im Kühlschrank ziehen lassen.",
    ],
  },
  {
    id: "rucola-parmesan-salat",
    name: "Rucola-Parmesan mit Balsamico",
    kategorie: "Salat",
    kcal: 220, kh: 4, eiweiss: 8, fett: 18,
    zeit: "8 Min", schwierigkeit: "Einfach",
    bild: "🌿",
    tags: ["keto", "salat", "rucola", "parmesan"],
    zutaten: [
      "100 g Rucola",
      "60 g Parmesan (gehobelt)",
      "50 g Pinienkerne (leicht geröstet)",
      "4 EL Olivenöl",
      "2 EL Balsamico-Essig (wenig = wenig KH)",
      "Salz, Pfeffer",
      "Optional: Parmaschinken",
    ],
    zubereitung: [
      "Pinienkerne ohne Öl in Pfanne goldbraun rösten.",
      "Rucola auf Teller verteilen.",
      "Parmesan darüberhobeln.",
      "Pinienkerne drüber, optional Parmaschinken.",
      "Olivenöl und Balsamico als Dressing drüber.",
      "Salzen und pfeffern, sofort servieren.",
    ],
  },

  // ─── NEUE HAUPTGERICHTE ───────────────────────────────────────────────────
  {
    id: "gans-gruenkohl-speck",
    name: "Gans mit Grünkohl & Speck",
    kategorie: "Abendessen",
    kcal: 820, kh: 5, eiweiss: 58, fett: 62,
    zeit: "3 Std", schwierigkeit: "Aufwendig",
    bild: "🪿",
    tags: ["keto", "festlich", "gans", "grünkohl", "special"],
    zutaten: ["1 Gänsebrust (ca. 800 g)", "400 g Grünkohl (frisch oder TK)", "150 g Speck gewürfelt", "2 Knoblauchzehen", "1 Zwiebel", "200 ml Geflügelfond", "2 EL Gänseschmalz", "Majoran, Salz, Pfeffer"],
    zubereitung: ["Gänsebrust salzen, pfeffern und mit Majoran einreiben.", "Im Ofen bei 160 °C ca. 2,5 Std braten, zwischendurch mit Bratensaft begießen.", "Speck in Schmalz knusprig ausbraten, Zwiebel und Knoblauch dazugeben.", "Grünkohl zugeben, mit Fond ablöschen, 20 Min schmoren.", "Gänsebrust in Scheiben schneiden, auf Grünkohl anrichten."],
  },
  {
    id: "entenbrust-rotkohl",
    name: "Entenbrust mit Rotkohlgemüse",
    kategorie: "Abendessen",
    kcal: 680, kh: 8, eiweiss: 42, fett: 52,
    zeit: "45 Min", schwierigkeit: "Mittel",
    bild: "🦆",
    tags: ["keto", "ente", "festlich", "special"],
    zutaten: ["2 Entenbrustfilets", "300 g Rotkohl (fein geschnitten)", "1 Apfel (klein, säuerlich)", "50 g Butter", "100 ml Rotwein", "Zimt, Nelken, Salz, Pfeffer", "1 EL Erythrit"],
    zubereitung: ["Entenhaut rautenförmig einschneiden, salzen, pfeffern.", "Entenbrust kalt in Pfanne legen, Hitze langsam erhöhen — Fett ausbraten.", "Bei 180 °C Ofen 12–15 Min fertig garen, 5 Min ruhen lassen.", "Rotkohl mit Butter anschwitzen, Apfelwürfel, Wein, Erythrit und Gewürze dazugeben, 20 Min schmoren.", "Entenbrust aufschneiden, auf Rotkohl anrichten."],
  },
  {
    id: "lammkeule-rosmarin-knoblauch",
    name: "Lammkeule mit Rosmarin-Knoblauch",
    kategorie: "Abendessen",
    kcal: 720, kh: 3, eiweiss: 55, fett: 54,
    zeit: "2,5 Std", schwierigkeit: "Mittel",
    bild: "🍖",
    tags: ["keto", "lamm", "festlich", "special"],
    zutaten: ["800 g Lammkeule (ohne Knochen)", "6 Knoblauchzehen", "3 Zweige Rosmarin", "3 EL Olivenöl", "100 ml Lammfond", "Salz, Pfeffer, Zitrone"],
    zubereitung: ["Lammkeule mit Knoblauchzehen spicken, mit Öl, Rosmarin, Salz und Pfeffer einreiben.", "Im Ofen bei 160 °C ca. 2 Std braten.", "Bratensatz mit Fond ablöschen, zu Sauce einkochen.", "10 Min ruhen lassen, aufschneiden und mit Sauce servieren."],
  },
  {
    id: "rinderbaeckchen-geschmort",
    name: "Geschmorte Rinderbäckchen",
    kategorie: "Abendessen",
    kcal: 640, kh: 4, eiweiss: 48, fett: 46,
    zeit: "3 Std", schwierigkeit: "Mittel",
    bild: "🥩",
    tags: ["keto", "rind", "schmorbraten", "special"],
    zutaten: ["600 g Rinderbäckchen", "2 Möhren", "1 Stange Sellerie", "1 Zwiebel", "200 ml Rotwein", "300 ml Rinderfond", "2 EL Tomatenmark", "Thymian, Lorbeer, Salz, Pfeffer", "2 EL Schmalz"],
    zubereitung: ["Rinderbäckchen von allen Seiten scharf anbraten.", "Gemüse würfeln und anschwitzen, Tomatenmark kurz mitrösten.", "Mit Rotwein ablöschen, Fond dazugeben, Kräuter hinein.", "Alles in Schmortopf bei 150 °C im Ofen 2,5 Std schmoren.", "Fleisch herausnehmen, Sauce pürieren und einkochen."],
  },
  {
    id: "schweinebauch-kruste-ofen",
    name: "Schweinebauch mit Kruste",
    kategorie: "Mittagessen",
    kcal: 780, kh: 2, eiweiss: 38, fett: 68,
    zeit: "2 Std", schwierigkeit: "Mittel",
    bild: "🥓",
    tags: ["keto", "schwein", "kruste", "special"],
    zutaten: ["800 g Schweinebauch mit Schwarte", "2 TL Salz", "1 TL Kümmel", "1 TL Paprika", "Knoblauch", "200 ml Fleischbrühe"],
    zubereitung: ["Schwarte rautenförmig einschneiden, salzen, mit Kümmel einreiben.", "Im Ofen bei 180 °C 1,5 Std braten.", "Temperatur auf 230 °C erhöhen, Schwarte knusprig braten (ca. 15 Min).", "Mit Brühe begießen, Sauce aus dem Bratensatz ziehen."],
  },
  {
    id: "kalbsschnitzel-buttersauce",
    name: "Kalbsschnitzel in Buttersoße",
    kategorie: "Mittagessen",
    kcal: 520, kh: 2, eiweiss: 42, fett: 38,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍽️",
    tags: ["keto", "kalb", "schnitzel", "butter"],
    zutaten: ["2 Kalbsschnitzel (je 160 g)", "3 EL Butter", "Saft ½ Zitrone", "Kapern optional", "Salz, Pfeffer", "frische Petersilie"],
    zubereitung: ["Schnitzel dünn klopfen, salzen und pfeffern.", "In Butter bei mittlerer Hitze je 2–3 Min braten.", "Schnitzel herausnehmen, Butter leicht bräunen lassen.", "Zitronensaft einrühren, Kapern zugeben.", "Sauce über Schnitzel geben, mit Petersilie servieren."],
  },
  {
    id: "rinderfilet-kraeuterbutter",
    name: "Rinderfilet mit Kräuterbutter",
    kategorie: "Abendessen",
    kcal: 580, kh: 1, eiweiss: 48, fett: 42,
    zeit: "25 Min", schwierigkeit: "Mittel",
    bild: "🥩",
    tags: ["keto", "rind", "filet", "special"],
    zutaten: ["2 Rinderfiletsteaks (je 180 g)", "60 g Butter", "2 Knoblauchzehen", "Thymian, Rosmarin", "Salz, Pfeffer", "1 EL Olivenöl"],
    zubereitung: ["Steaks 30 Min vor dem Braten auf Raumtemperatur bringen.", "In Olivenöl sehr scharf anbraten, je 2 Min pro Seite.", "Butter, Knoblauch und Kräuter zugeben, übergießen (Arrosieren).", "Im Ofen bei 120 °C 10 Min auf Kerntemperatur 54 °C ziehen.", "5 Min ruhen lassen."],
  },
  {
    id: "hasenruecken-sahnesauce",
    name: "Hasenrücken in Sahnesauce",
    kategorie: "Abendessen",
    kcal: 560, kh: 3, eiweiss: 44, fett: 40,
    zeit: "50 Min", schwierigkeit: "Mittel",
    bild: "🐇",
    tags: ["keto", "hase", "wild", "special"],
    zutaten: ["600 g Hasenrücken", "200 ml Sahne", "1 Zwiebel", "100 ml Weißwein", "Thymian, Lorbeer", "2 EL Butter", "Salz, Pfeffer", "Senf"],
    zubereitung: ["Hasenrücken salzen, pfeffern, in Butter von allen Seiten anbraten.", "Zwiebel glasig anschwitzen, mit Weißwein ablöschen.", "Sahne und Kräuter zugeben, 30 Min bei kleiner Hitze schmoren.", "Hasenrücken herausnehmen, Sauce mit etwas Senf abschmecken.", "Fleisch in Scheiben schneiden und in der Sauce servieren."],
  },
  {
    id: "hirschgulasch-preiselbeeren",
    name: "Hirschgulasch mit Preiselbeeren",
    kategorie: "Abendessen",
    kcal: 610, kh: 6, eiweiss: 50, fett: 38,
    zeit: "2 Std", schwierigkeit: "Mittel",
    bild: "🦌",
    tags: ["keto", "wild", "hirsch", "special"],
    zutaten: ["700 g Hirschgulasch", "2 Zwiebeln", "200 ml Rotwein", "200 ml Wildfond", "2 EL Preiselbeeren (zuckerarm)", "Wacholderbeeren, Lorbeer", "2 EL Schmalz", "Salz, Pfeffer"],
    zubereitung: ["Hirschfleisch würfeln, scharf anbraten.", "Zwiebeln anschwitzen, Wacholderbeeren und Lorbeer zugeben.", "Mit Rotwein ablöschen, Fond dazugeben.", "1,5 Std bei kleiner Hitze schmoren.", "Preiselbeeren einrühren und abschmecken."],
  },
  {
    id: "coq-au-vin-keto-neu",
    name: "Keto Coq au Vin",
    kategorie: "Abendessen",
    kcal: 580, kh: 5, eiweiss: 46, fett: 36,
    zeit: "1 Std 20 Min", schwierigkeit: "Mittel",
    bild: "🍷",
    tags: ["keto", "hähnchen", "rotwein", "special"],
    zutaten: ["4 Hähnchenschenkel", "150 g Speck gewürfelt", "2 Knoblauchzehen", "1 Zwiebel", "200 ml Rotwein (trocken)", "200 ml Hühnerfond", "Thymian, Lorbeer", "2 EL Butter"],
    zubereitung: ["Hähnchenschenkel salzen, pfeffern, in Butter braun anbraten.", "Speck und Zwiebel anschwitzen.", "Mit Rotwein ablöschen, Fond und Kräuter zugeben.", "1 Std bei kleiner Hitze geschlossen schmoren.", "Hähnchen herausnehmen, Sauce einkochen."],
  },
  {
    id: "hackbraten-speckmantel",
    name: "Hackbraten im Speckmantel",
    kategorie: "Mittagessen",
    kcal: 620, kh: 3, eiweiss: 44, fett: 48,
    zeit: "1 Std", schwierigkeit: "Einfach",
    bild: "🥩",
    tags: ["keto", "hack", "speck"],
    zutaten: ["600 g gemischtes Hackfleisch", "150 g Bacon-Streifen", "1 Ei", "1 Zwiebel", "1 TL Senf", "1 TL Paprika", "Salz, Pfeffer", "Petersilie"],
    zubereitung: ["Hackfleisch mit Ei, Zwiebel, Senf und Gewürzen vermengen.", "Zur Rolle formen, in Bacon-Streifen wickeln.", "Im Ofen bei 180 °C ca. 45 Min backen.", "Aufschneiden und heiß servieren."],
  },
  {
    id: "putenbrust-parmesankruste",
    name: "Putenbrust mit Parmesan-Kruste",
    kategorie: "Mittagessen",
    kcal: 480, kh: 2, eiweiss: 52, fett: 28,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "pute", "parmesan"],
    zutaten: ["2 Putenbrustfilets", "60 g Parmesan gerieben", "1 TL Paprikapulver", "Knoblauchpulver", "2 EL Olivenöl", "Salz, Pfeffer"],
    zubereitung: ["Putenbrustfilets mit Öl einreiben.", "Parmesan mit Paprika, Knoblauch, Salz und Pfeffer mischen.", "Filets in Parmesanmischung wälzen.", "Im Ofen bei 200 °C 25 Min goldbraun backen."],
  },
  {
    id: "rinderrouladen-klassisch",
    name: "Rinderrouladen",
    kategorie: "Mittagessen",
    kcal: 560, kh: 3, eiweiss: 46, fett: 38,
    zeit: "2 Std", schwierigkeit: "Mittel",
    bild: "🥩",
    tags: ["keto", "rind", "roulade", "klassiker"],
    zutaten: ["4 dünne Rinderscheiben (Rouladenfleisch)", "4 TL Senf", "100 g Speckstreifen", "1 Zwiebel", "2 EL Schmalz", "300 ml Rinderfond", "Thymian, Salz, Pfeffer"],
    zubereitung: ["Fleisch mit Senf bestreichen, Speck und Zwiebelringe drauflegen.", "Fest aufrollen und mit Zahnstocher fixieren.", "In Schmalz von allen Seiten scharf anbraten.", "Mit Fond ablöschen, 1,5 Std schmoren.", "Sauce einkochen und abschmecken."],
  },
  {
    id: "haehnchen-zitrone-kapern",
    name: "Hähnchen mit Zitrone & Kapern",
    kategorie: "Mittagessen",
    kcal: 420, kh: 2, eiweiss: 44, fett: 26,
    zeit: "30 Min", schwierigkeit: "Einfach",
    bild: "🍋",
    tags: ["keto", "hähnchen", "zitrone", "mediterran"],
    zutaten: ["2 Hähnchenbrustfilets", "Saft und Schale 1 Zitrone", "2 EL Kapern", "3 EL Olivenöl", "2 Knoblauchzehen", "frischer Thymian", "Salz, Pfeffer"],
    zubereitung: ["Hähnchenfilets flach klopfen, salzen und pfeffern.", "In Olivenöl goldbraun braten, herausnehmen.", "Knoblauch anbraten, Zitronensaft, Kapern und Thymian zugeben.", "Hähnchen zurücklegen, 5 Min ziehen lassen."],
  },
  {
    id: "kotelett-kraeutermarinade",
    name: "Schweinekotelett in Kräutermarinade",
    kategorie: "Mittagessen",
    kcal: 480, kh: 1, eiweiss: 38, fett: 35,
    zeit: "30 Min + 2 Std marinieren", schwierigkeit: "Einfach",
    bild: "🍖",
    tags: ["keto", "schwein", "kotelett", "grill"],
    zutaten: ["2 Schweinekoteletts", "3 EL Olivenöl", "Rosmarin, Thymian, Oregano", "2 Knoblauchzehen gepresst", "1 TL Paprika", "Salz, Pfeffer"],
    zubereitung: ["Öl mit Kräutern, Knoblauch und Paprika vermischen.", "Koteletts in Marinade mindestens 2 Std einlegen.", "In Grillpfanne je 4–5 Min pro Seite braten.", "5 Min ruhen lassen."],
  },
  {
    id: "buletten-senfsauce",
    name: "Buletten in Senfsauce",
    kategorie: "Mittagessen",
    kcal: 520, kh: 4, eiweiss: 36, fett: 38,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🫕",
    tags: ["keto", "hack", "buletten", "senf"],
    zutaten: ["500 g gemischtes Hackfleisch", "1 Ei", "1 Zwiebel", "150 ml Sahne", "2 EL Senf", "100 ml Hühnerbrühe", "Butter", "Salz, Pfeffer"],
    zubereitung: ["Hackfleisch mit Ei, Zwiebel, Salz und Pfeffer vermengen, Buletten formen.", "In Butter goldbraun braten, herausnehmen.", "Brühe und Sahne in die Pfanne, aufkochen.", "Senf einrühren, Buletten zurück in die Sauce, 5 Min ziehen lassen."],
  },
  {
    id: "blumenkohl-speck-gratin",
    name: "Blumenkohl-Speck-Gratin",
    kategorie: "Mittagessen",
    kcal: 480, kh: 8, eiweiss: 22, fett: 38,
    zeit: "45 Min", schwierigkeit: "Einfach",
    bild: "🧀",
    tags: ["keto", "blumenkohl", "gratin", "käse"],
    zutaten: ["1 Blumenkohl", "150 g Speck gewürfelt", "200 ml Sahne", "100 g Gouda gerieben", "50 g Parmesan", "Muskat, Salz, Pfeffer", "Butter"],
    zubereitung: ["Blumenkohl in Röschen teilen, 5 Min blanchieren.", "Speck knusprig anbraten.", "Sahne mit Muskat, Salz und Pfeffer würzen.", "Alles in Auflaufform schichten, Käse drüber.", "Bei 200 °C 25 Min überbacken."],
  },
  {
    id: "haehnchenkeulen-paprikagemüse",
    name: "Hähnchenkeulen mit Paprikagemüse",
    kategorie: "Mittagessen",
    kcal: 540, kh: 6, eiweiss: 48, fett: 34,
    zeit: "55 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "hähnchen", "paprika"],
    zutaten: ["4 Hähnchenkeulen", "3 Paprika (verschiedene Farben)", "1 Zwiebel", "2 Knoblauchzehen", "200 ml Hühnerfond", "1 TL Paprika edelsüß", "Olivenöl", "Salz, Pfeffer"],
    zubereitung: ["Hähnchenkeulen würzen, in Olivenöl scharf anbraten.", "Paprika und Zwiebel würfeln, anschwitzen.", "Knoblauch und Paprikapulver zugeben.", "Fond angießen, Keulen drauflegen, 40 Min bei 180 °C schmoren."],
  },
  {
    id: "tafelspitz-meerrettichbutter",
    name: "Tafelspitz mit Meerrettich-Butter",
    kategorie: "Mittagessen",
    kcal: 580, kh: 2, eiweiss: 50, fett: 40,
    zeit: "2,5 Std", schwierigkeit: "Mittel",
    bild: "🍲",
    tags: ["keto", "rind", "tafelspitz", "klassiker", "special"],
    zutaten: ["600 g Tafelspitz", "1 Bund Suppengrün", "50 g Butter", "2 EL frischer Meerrettich (gerieben)", "Brühwürfel, Pfefferkörner", "Salz", "Schnittlauch"],
    zubereitung: ["Tafelspitz in Salzwasser mit Suppengrün 2 Std köcheln.", "Butter schmelzen, Meerrettich einrühren.", "Fleisch dünn aufschneiden.", "Meerrettichbutter drüber, Schnittlauch garnieren."],
  },
  {
    id: "wursttopf-sauerkraut",
    name: "Wursttopf mit Sauerkraut",
    kategorie: "Abendessen",
    kcal: 540, kh: 4, eiweiss: 28, fett: 44,
    zeit: "30 Min", schwierigkeit: "Einfach",
    bild: "🌭",
    tags: ["keto", "wurst", "sauerkraut", "schnell"],
    zutaten: ["300 g Bratwurst oder Mettwurst", "300 g Sauerkraut", "100 g Speck", "1 Zwiebel", "Kümmel", "100 ml Brühe", "Schmalz"],
    zubereitung: ["Speck und Zwiebel in Schmalz anbraten.", "Sauerkraut und Kümmel zugeben.", "Brühe angießen, 15 Min schmoren.", "Bratwurst anbraten, auf dem Sauerkraut servieren."],
  },
  {
    id: "haehnchen-sahne-senf",
    name: "Hähnchen in Sahne-Senf-Sauce",
    kategorie: "Abendessen",
    kcal: 490, kh: 3, eiweiss: 44, fett: 32,
    zeit: "30 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "hähnchen", "sahne", "senf"],
    zutaten: ["2 Hähnchenbrustfilets", "200 ml Sahne", "2 EL Dijonsenf", "1 Schalotte", "100 ml Hühnerfond", "Butter", "Estragon", "Salz, Pfeffer"],
    zubereitung: ["Hähnchen salzen, pfeffern, in Butter goldbraun braten.", "Schalotte anschwitzen, mit Fond ablöschen.", "Sahne und Senf einrühren, 10 Min einköcheln.", "Estragon zugeben, Hähnchen zurücklegen und durchziehen lassen."],
  },
  {
    id: "rindersteak-pfeffersauce",
    name: "Rindersteak mit Pfeffersauce",
    kategorie: "Abendessen",
    kcal: 620, kh: 2, eiweiss: 46, fett: 46,
    zeit: "25 Min", schwierigkeit: "Mittel",
    bild: "🥩",
    tags: ["keto", "steak", "pfeffer", "special"],
    zutaten: ["2 Rindersteaks (Entrecôte)", "1 EL grüner Pfeffer (Glas)", "100 ml Sahne", "50 ml Cognac oder Weinbrand", "1 Schalotte", "Butter", "Salz"],
    zubereitung: ["Steaks scharf in Butter braten (je nach gewünschtem Gargrad).", "Herausnehmen, ruhen lassen.", "Schalotte anschwitzen, Cognac zugeben und flambieren.", "Sahne und Pfeffer einrühren, einköcheln.", "Sauce über Steaks servieren."],
  },
  {
    id: "leber-berliner-art",
    name: "Leber Berliner Art",
    kategorie: "Mittagessen",
    kcal: 390, kh: 6, eiweiss: 32, fett: 24,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["keto", "leber", "zwiebeln", "klassiker"],
    zutaten: ["400 g Kalbsleber in Scheiben", "3 Zwiebeln", "3 EL Schmalz oder Butter", "Majoran", "Salz, Pfeffer", "Zitronensaft"],
    zubereitung: ["Zwiebeln in Ringe schneiden, in Schmalz goldbraun karamellisieren.", "Leber leicht salzen, pfeffern.", "In Schmalz bei starker Hitze je 1–2 Min pro Seite braten.", "Zwiebelringe drauflegen, Majoran und Zitronensaft drüber."],
  },
  {
    id: "spareribs-dry-rub",
    name: "Spareribs mit Keto Dry Rub",
    kategorie: "Abendessen",
    kcal: 680, kh: 2, eiweiss: 40, fett: 56,
    zeit: "3 Std", schwierigkeit: "Mittel",
    bild: "🍖",
    tags: ["keto", "spareribs", "bbq", "special"],
    zutaten: ["1 kg Spareribs", "2 TL Paprika", "1 TL Knoblauchpulver", "1 TL Zwiebelpulver", "1 TL Kümmel", "½ TL Cayenne", "1 TL Salz", "Erythrit 1 TL"],
    zubereitung: ["Alle Gewürze mischen, Ribs damit einreiben.", "In Alufolie wickeln, 2 Std bei 150 °C im Ofen garen.", "Folie öffnen, 30 Min bei 200 °C karamellisieren.", "In Stücke schneiden und sofort servieren."],
  },
  {
    id: "kalbsgulasch-paprika",
    name: "Kalbsgulasch mit Paprika",
    kategorie: "Mittagessen",
    kcal: 520, kh: 6, eiweiss: 44, fett: 32,
    zeit: "1,5 Std", schwierigkeit: "Mittel",
    bild: "🫕",
    tags: ["keto", "kalb", "gulasch", "paprika"],
    zutaten: ["600 g Kalbsgulasch", "2 Paprika", "2 Zwiebeln", "200 ml Kalbsfond", "1 TL Paprika edelsüß", "100 ml Sahne", "Schmalz", "Salz, Pfeffer"],
    zubereitung: ["Kalbsfleisch in Schmalz anbraten.", "Zwiebeln und Paprika anschwitzen, Paprikapulver zugeben.", "Mit Fond ablöschen, 1 Std schmoren.", "Sahne einrühren, weitere 10 Min köcheln."],
  },
  {
    id: "lammchops-minz-chimichurri",
    name: "Lammchops mit Minz-Chimichurri",
    kategorie: "Abendessen",
    kcal: 560, kh: 2, eiweiss: 38, fett: 44,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍖",
    tags: ["keto", "lamm", "chimichurri", "special"],
    zutaten: ["6 Lammchops", "1 Bund Petersilie", "1 Bund Minze", "3 EL Olivenöl", "1 EL Rotweinessig", "Knoblauch", "Salz, Chili"],
    zubereitung: ["Kräuter, Olivenöl, Essig, Knoblauch und Chili zum Chimichurri mixen.", "Lammchops salzen, pfeffern.", "In Grillpfanne je 3 Min pro Seite braten.", "Chimichurri drüber servieren."],
  },
  {
    id: "haehnchen-oliven-tomaten",
    name: "Hähnchenschenkel mit Oliven & Tomaten",
    kategorie: "Abendessen",
    kcal: 490, kh: 4, eiweiss: 46, fett: 31,
    zeit: "50 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "hähnchen", "mediterran", "oliven"],
    zutaten: ["4 Hähnchenschenkel", "100 g schwarze Oliven", "200 g Cocktailtomaten", "3 Knoblauchzehen", "100 ml Weißwein", "Olivenöl", "Thymian, Rosmarin", "Salz, Pfeffer"],
    zubereitung: ["Hähnchenschenkel in Olivenöl anbraten.", "Knoblauch, Tomaten und Oliven zugeben.", "Mit Wein ablöschen, Kräuter zugeben.", "Im Ofen bei 180 °C 35 Min schmoren."],
  },
  {
    id: "rind-kokosmilch-curry",
    name: "Rindfleisch-Kokoscurry",
    kategorie: "Mittagessen",
    kcal: 580, kh: 7, eiweiss: 40, fett: 42,
    zeit: "45 Min", schwierigkeit: "Einfach",
    bild: "🍛",
    tags: ["keto", "rind", "curry", "kokos"],
    zutaten: ["500 g Rindfleisch (Stücke)", "400 ml Kokosmilch", "2 EL rote Currypaste", "Ingwer", "Knoblauch", "1 Paprika", "Kokosöl", "Koriander", "Salz"],
    zubereitung: ["Rindfleisch in Kokosöl anbraten.", "Currypaste, Ingwer und Knoblauch zugeben und rösten.", "Kokosmilch angießen, 30 Min schmoren.", "Paprika zugeben, 10 Min mitköcheln.", "Mit Koriander garnieren."],
  },
  {
    id: "frikadellen-zwiebelsauce",
    name: "Frikadellen in Zwiebelsauce",
    kategorie: "Mittagessen",
    kcal: 530, kh: 4, eiweiss: 38, fett: 39,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["keto", "hack", "frikadellen", "zwiebel"],
    zutaten: ["500 g Hackfleisch (gemischt)", "1 Ei", "2 große Zwiebeln", "150 ml Brühe", "50 ml Sahne", "Schmalz", "Senf", "Salz, Pfeffer, Majoran"],
    zubereitung: ["Hackfleisch mit Ei, Salz, Pfeffer und Majoran vermengen, Frikadellen formen.", "In Schmalz goldbraun braten, herausnehmen.", "Zwiebeln karamellisieren, mit Brühe ablöschen.", "Sahne einrühren, Frikadellen zurück in die Sauce."],
  },
  {
    id: "pulled-pork-keto",
    name: "Keto Pulled Pork",
    kategorie: "Mittagessen",
    kcal: 560, kh: 2, eiweiss: 44, fett: 40,
    zeit: "5 Std", schwierigkeit: "Mittel",
    bild: "🐷",
    tags: ["keto", "schwein", "pulled pork", "special"],
    zutaten: ["1 kg Schweinenacken", "2 TL Paprika", "1 TL Knoblauchpulver", "1 TL Salz", "½ TL Cayenne", "½ TL Kümmel", "Erythrit 1 TL", "150 ml Apfelessig"],
    zubereitung: ["Fleisch mit Gewürzen einreiben, über Nacht marinieren.", "Im Ofen bei 120 °C 4–5 Std braten.", "Wenn Kerntemperatur 90 °C, mit zwei Gabeln zupfen.", "Mit Apfelessig und restlichem Bratensaft abschmecken."],
  },
  {
    id: "cevapcici-tzatziki",
    name: "Ćevapčići mit Keto-Tzatziki",
    kategorie: "Abendessen",
    kcal: 510, kh: 3, eiweiss: 36, fett: 38,
    zeit: "30 Min", schwierigkeit: "Einfach",
    bild: "🫕",
    tags: ["keto", "hack", "grill", "balkan"],
    zutaten: ["400 g Rinderhackfleisch", "100 g Lammhack", "Knoblauch", "Paprikapulver", "Natron", "1 EL Olivenöl", "200 g griechischer Joghurt (Vollfett)", "½ Gurke", "Dill", "Salz, Pfeffer"],
    zubereitung: ["Hackfleisch mit Gewürzen und Knoblauch gut kneten, 1 Std kalt stellen.", "Zu Röllchen formen, in Pfanne oder auf Grill braten.", "Gurke raspeln, ausdrücken, mit Joghurt, Knoblauch und Dill mischen.", "Ćevapčići mit Tzatziki servieren."],
  },
  {
    id: "haehnchen-bacon-wrap",
    name: "Hähnchen im Bacon-Mantel",
    kategorie: "Abendessen",
    kcal: 480, kh: 1, eiweiss: 48, fett: 31,
    zeit: "30 Min", schwierigkeit: "Einfach",
    bild: "🥓",
    tags: ["keto", "hähnchen", "bacon", "schnell"],
    zutaten: ["2 Hähnchenbrustfilets", "6 Streifen Bacon", "1 TL Paprika", "Knoblauchpulver", "Olivenöl", "Salz, Pfeffer"],
    zubereitung: ["Hähnchenfilets würzen.", "Jeweils mit 3 Baconstreifen umwickeln.", "In Pfanne von allen Seiten knusprig braten.", "Im Ofen bei 180 °C 15 Min fertig garen."],
  },
  {
    id: "auberginen-lasagne-hack",
    name: "Auberginen-Lasagne mit Hackfleisch",
    kategorie: "Abendessen",
    kcal: 540, kh: 8, eiweiss: 34, fett: 38,
    zeit: "1 Std", schwierigkeit: "Mittel",
    bild: "🍆",
    tags: ["keto", "aubergine", "hack", "lasagne"],
    zutaten: ["2 große Auberginen", "400 g Rinderhack", "1 Dose gehackte Tomaten", "200 g Ricotta", "100 g Mozzarella", "Knoblauch", "Oregano", "Olivenöl", "Salz, Pfeffer"],
    zubereitung: ["Auberginen längs in 5 mm Scheiben schneiden, salzen, 10 Min ziehen lassen.", "Hack mit Knoblauch, Tomaten und Oregano 15 Min köcheln.", "Auberginenscheiben in Olivenöl kurz braten.", "Abwechselnd Auberginen, Hackfleisch und Ricotta schichten.", "Mozzarella drüber, bei 180 °C 25 Min backen."],
  },
  {
    id: "kassler-sauerkraut",
    name: "Kassler mit Sauerkraut",
    kategorie: "Mittagessen",
    kcal: 520, kh: 3, eiweiss: 38, fett: 38,
    zeit: "40 Min", schwierigkeit: "Einfach",
    bild: "🍖",
    tags: ["keto", "kassler", "sauerkraut", "klassiker"],
    zutaten: ["2 Kasslerscheiben", "400 g Sauerkraut", "100 g Speck", "1 Zwiebel", "Kümmel", "100 ml Fleischbrühe", "Schmalz"],
    zubereitung: ["Speck und Zwiebel anschwitzen.", "Sauerkraut und Kümmel zugeben, mit Brühe aufgießen.", "20 Min schmoren.", "Kassler in Schmalz anbraten, auf Sauerkraut servieren."],
  },
  {
    id: "shakshuka-keto",
    name: "Keto Shakshuka",
    kategorie: "Mittagessen",
    kcal: 360, kh: 7, eiweiss: 22, fett: 26,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["keto", "eier", "tomaten", "schnell"],
    zutaten: ["4 Eier", "400 g gehackte Tomaten", "1 rote Paprika", "1 Zwiebel", "2 Knoblauchzehen", "Kreuzkümmel", "Paprika", "Chili", "Olivenöl", "Feta", "Petersilie"],
    zubereitung: ["Zwiebel, Paprika und Knoblauch in Olivenöl anschwitzen.", "Tomaten und Gewürze zugeben, 10 Min köcheln.", "Mulden formen, Eier hineinschlagen.", "Deckel drauf, Eier stocken lassen.", "Mit Feta und Petersilie servieren."],
  },
  {
    id: "gefuellte-paprika-hack",
    name: "Gefüllte Paprika mit Hackfleisch",
    kategorie: "Abendessen",
    kcal: 490, kh: 8, eiweiss: 36, fett: 32,
    zeit: "50 Min", schwierigkeit: "Einfach",
    bild: "🫑",
    tags: ["keto", "paprika", "hack", "gefüllt"],
    zutaten: ["4 Paprika", "400 g Rinderhack", "1 Dose Tomaten (gewürfelt)", "1 Zwiebel", "100 g Gouda gerieben", "Oregano", "Knoblauch", "Olivenöl", "Salz, Pfeffer"],
    zubereitung: ["Paprika Deckel abschneiden, entkernen.", "Hack mit Zwiebeln und Knoblauch anbraten.", "Tomaten und Oregano zugeben, 5 Min köcheln.", "Paprika füllen, in Auflaufform stellen.", "Käse drüber, bei 180 °C 30 Min backen."],
  },
  {
    id: "putensteak-senf-sahne",
    name: "Putensteak in Senf-Sahne",
    kategorie: "Abendessen",
    kcal: 440, kh: 2, eiweiss: 46, fett: 26,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "pute", "senf", "schnell"],
    zutaten: ["2 Putensteaks", "150 ml Sahne", "2 EL körniger Senf", "1 Schalotte", "100 ml Geflügelfond", "Butter", "Salz, Pfeffer", "Schnittlauch"],
    zubereitung: ["Putensteaks salzen, pfeffern, in Butter anbraten.", "Schalotte anschwitzen, mit Fond ablöschen.", "Sahne und Senf einrühren, einköcheln.", "Steaks zurücklegen, mit Schnittlauch servieren."],
  },
  {
    id: "zucchini-bolognese",
    name: "Bolognese auf Zucchini-Nudeln",
    kategorie: "Abendessen",
    kcal: 480, kh: 7, eiweiss: 34, fett: 34,
    zeit: "40 Min", schwierigkeit: "Einfach",
    bild: "🍝",
    tags: ["keto", "hack", "zucchini", "bolognese"],
    zutaten: ["400 g Rinderhack", "2 Zucchini (mittelgroß)", "1 Dose Tomaten", "1 Zwiebel", "2 Knoblauchzehen", "50 ml Rotwein", "Oregano, Basilikum", "Olivenöl", "Parmesan", "Salz, Pfeffer"],
    zubereitung: ["Hack in Olivenöl anbraten, Zwiebeln und Knoblauch zugeben.", "Mit Wein ablöschen, Tomaten und Kräuter zugeben, 20 Min köcheln.", "Zucchini spiralförmig schneiden (Zoodler).", "Zucchini kurz in Pfanne schwenken (2 Min).", "Bolognese auf Zoodeln, Parmesan drüber."],
  },
  {
    id: "wildschweingulasch",
    name: "Wildschweingulasch",
    kategorie: "Abendessen",
    kcal: 590, kh: 5, eiweiss: 46, fett: 40,
    zeit: "2 Std", schwierigkeit: "Mittel",
    bild: "🐗",
    tags: ["keto", "wildschwein", "wild", "special"],
    zutaten: ["700 g Wildschweinfleisch", "2 Zwiebeln", "200 ml Rotwein", "200 ml Wildfond", "Wacholderbeeren", "Lorbeer", "Thymian", "2 EL Schmalz", "Salz, Pfeffer"],
    zubereitung: ["Fleisch würfeln und scharf anbraten.", "Zwiebeln anschwitzen, Wacholderbeeren andrücken.", "Mit Rotwein ablöschen, Fond zugeben.", "Lorbeer und Thymian zugeben, 1,5 Std schmoren.", "Sauce einkochen, abschmecken."],
  },
  {
    id: "rindergulasch-ungarisch",
    name: "Rindergulasch Ungarisch",
    kategorie: "Mittagessen",
    kcal: 560, kh: 6, eiweiss: 44, fett: 36,
    zeit: "2 Std", schwierigkeit: "Mittel",
    bild: "🫕",
    tags: ["keto", "rind", "gulasch", "ungarisch"],
    zutaten: ["700 g Rindergulasch", "3 Zwiebeln", "2 EL Paprikapulver (edelsüß)", "1 TL scharfes Paprika", "2 Knoblauchzehen", "200 ml Rinderfond", "Schmalz", "Salz, Kümmel"],
    zubereitung: ["Rind in Schmalz anbraten, herausnehmen.", "Zwiebeln glasig dünsten, Paprikapulver rösten.", "Fleisch zurück, Fond zugeben.", "1,5 Std bei kleiner Hitze schmoren.", "Kümmel und Knoblauch abschmecken."],
  },
  {
    id: "schweinehaxe-ofen",
    name: "Schweinehaxe aus dem Ofen",
    kategorie: "Abendessen",
    kcal: 720, kh: 2, eiweiss: 48, fett: 56,
    zeit: "2,5 Std", schwierigkeit: "Einfach",
    bild: "🍖",
    tags: ["keto", "haxe", "schwein", "special"],
    zutaten: ["1 Schweinehaxe (ca. 800 g)", "Salz, Kümmel, Knoblauch", "1 Zwiebel", "200 ml Dunkelbier oder Brühe", "Schmalz"],
    zubereitung: ["Haxe einschneiden, mit Salz, Kümmel und Knoblauch einreiben.", "Auf Zwiebeln im Bräter bei 160 °C 2 Std braten.", "Mit Bier oder Brühe begießen.", "Temperatur auf 220 °C erhöhen, Schwarte 20 Min aufknuspern."],
  },
  {
    id: "keto-burger-salatbun",
    name: "Keto Burger im Salatblatt",
    kategorie: "Mittagessen",
    kcal: 560, kh: 4, eiweiss: 38, fett: 42,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍔",
    tags: ["keto", "hack", "burger", "schnell"],
    zutaten: ["400 g Rinderhack (80/20)", "4 große Salatblätter (Eisberg)", "4 Cheddar-Scheiben", "4 Bacon-Streifen", "Tomaten", "Gurke", "Mayo", "Senf", "Salz, Pfeffer"],
    zubereitung: ["Hackfleisch zu Patties formen, gut würzen.", "In heißer Pfanne je 3 Min pro Seite braten, Käse schmelzen.", "Bacon knusprig braten.", "Alles im Salatblatt stapeln, Mayo und Senf drüber."],
  },
  {
    id: "pute-ueberbacken-mozzarella",
    name: "Überbackene Putensteaks",
    kategorie: "Abendessen",
    kcal: 460, kh: 3, eiweiss: 50, fett: 26,
    zeit: "30 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "pute", "käse", "überbacken"],
    zutaten: ["2 Putensteaks", "2 Tomaten", "100 g Mozzarella", "Basilikum", "Olivenöl", "Knoblauch", "Salz, Pfeffer"],
    zubereitung: ["Putensteaks würzen, kurz anbraten.", "In Auflaufform legen.", "Tomaten und Mozzarella drauflegen.", "Mit Basilikum und Knoblauch-Öl beträufeln.", "Bei 200 °C 15 Min überbacken."],
  },
  {
    id: "taco-bowl-neu",
    name: "Keto Taco-Bowl",
    kategorie: "Mittagessen",
    kcal: 520, kh: 7, eiweiss: 36, fett: 36,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🌮",
    tags: ["keto", "hack", "mexiko", "bowl"],
    zutaten: ["400 g Rinderhack", "1 Avocado", "100 g Cheddar gerieben", "Saure Sahne", "Tomatensalsa (zuckerarm)", "Eisbergsalat", "Kreuzkümmel", "Paprika", "Chili", "Salz"],
    zubereitung: ["Hack mit Kreuzkümmel, Paprika und Chili anbraten.", "Salat als Basis in Bowl legen.", "Hackfleisch drauf, Avocadowürfel, Käse, Salsa.", "Mit saurer Sahne toppen."],
  },
  {
    id: "haehnchen-kokos-koriander",
    name: "Hähnchen in Kokosmilch",
    kategorie: "Abendessen",
    kcal: 480, kh: 5, eiweiss: 42, fett: 31,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🥥",
    tags: ["keto", "hähnchen", "kokos", "asiatisch"],
    zutaten: ["2 Hähnchenbrustfilets", "400 ml Kokosmilch", "2 Knoblauchzehen", "1 Stück Ingwer", "1 TL Kurkuma", "Chili", "Kokosöl", "frischer Koriander", "Salz"],
    zubereitung: ["Hähnchen würfeln, in Kokosöl anbraten.", "Knoblauch, Ingwer und Kurkuma zugeben.", "Kokosmilch angießen, 20 Min köcheln.", "Mit Chili abschmecken, Koriander drüber."],
  },
  {
    id: "schweinefilet-kraeuterspeck",
    name: "Schweinefilet im Kräuter-Speckmantel",
    kategorie: "Abendessen",
    kcal: 520, kh: 1, eiweiss: 44, fett: 36,
    zeit: "40 Min", schwierigkeit: "Mittel",
    bild: "🥩",
    tags: ["keto", "schwein", "filet", "special"],
    zutaten: ["500 g Schweinefilet", "8 Baconstreifen", "Rosmarin", "Thymian", "Knoblauch", "Senf", "Olivenöl", "Salz, Pfeffer"],
    zubereitung: ["Filet mit Senf, Knoblauch und Kräutern einreiben.", "In Baconstreifen fest einwickeln.", "In Pfanne scharf anbraten.", "Im Ofen bei 180 °C 20 Min fertig garen.", "5 Min ruhen lassen, aufschneiden."],
  },
  {
    id: "koenigsberger-klopse",
    name: "Königsberger Klopse (Keto)",
    kategorie: "Mittagessen",
    kcal: 510, kh: 3, eiweiss: 36, fett: 38,
    zeit: "40 Min", schwierigkeit: "Mittel",
    bild: "🍲",
    tags: ["keto", "hack", "klopse", "klassiker", "special"],
    zutaten: ["500 g gemischtes Hackfleisch", "1 Ei", "Sardellen (2 Stück)", "Kapern", "1 Zwiebel", "500 ml Brühe", "100 ml Sahne", "1 EL Butter", "Zitronensaft", "Salz, Pfeffer"],
    zubereitung: ["Hack mit Ei, Sardellen und Zwiebel vermengen, Klopse formen.", "In Brühe 15 Min gar ziehen lassen.", "Butter schmelzen, Sahne zugeben, einköcheln.", "Kapern und Zitronensaft einrühren.", "Klopse in Sauce servieren."],
  },
  {
    id: "sauerbraten-keto",
    name: "Keto Sauerbraten",
    kategorie: "Mittagessen",
    kcal: 540, kh: 5, eiweiss: 44, fett: 36,
    zeit: "3 Std + 2 Tage einlegen", schwierigkeit: "Aufwendig",
    bild: "🥩",
    tags: ["keto", "rind", "sauerbraten", "klassiker", "special"],
    zutaten: ["800 g Rinderbraten", "250 ml Rotweinessig", "250 ml Wasser", "1 Zwiebel", "Lorbeer", "Pfefferkörner", "Nelken", "Thymian", "Erythrit 1 EL", "Schmalz", "100 ml Sahne"],
    zubereitung: ["Fleisch in Marinade aus Essig, Wasser und Gewürzen 2 Tage einlegen.", "Fleisch herausnehmen, trocken tupfen, in Schmalz anbraten.", "Marinade zugeben, 2 Std schmoren.", "Sauce passieren, mit Sahne und Erythrit abschmecken."],
  },
  {
    id: "schweinebraten-klassisch",
    name: "Klassischer Schweinebraten",
    kategorie: "Mittagessen",
    kcal: 620, kh: 2, eiweiss: 46, fett: 46,
    zeit: "2 Std", schwierigkeit: "Einfach",
    bild: "🥩",
    tags: ["keto", "schwein", "braten", "klassiker"],
    zutaten: ["1 kg Schweineschulter", "Knoblauch", "Kümmel", "Senf", "Salz, Pfeffer", "200 ml Fleischbrühe", "1 Zwiebel", "2 EL Schmalz"],
    zubereitung: ["Braten mit Senf, Knoblauch, Kümmel, Salz und Pfeffer einreiben.", "In Schmalz rundum anbraten.", "Im Bräter mit Zwiebeln bei 160 °C 1,5 Std schmoren.", "Brühe nach und nach zugeben.", "Bratensatz mit etwas Wasser lösen und als Sauce servieren."],
  },

  // ─── NEUE SALATE ─────────────────────────────────────────────────────────
  {
    id: "caesarsalat-haehnchen",
    name: "Caesar Salat mit Hähnchen",
    kategorie: "Salat",
    kcal: 420, kh: 4, eiweiss: 36, fett: 28,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["keto", "salat", "hähnchen", "caesar"],
    zutaten: ["2 Hähnchenbrustfilets", "1 Kopf Romanasalat", "60 g Parmesan gehobelt", "4 EL Caesar-Dressing (zuckerarm)", "1 TL Worcestersauce", "Zitrone", "Olivenöl"],
    zubereitung: ["Hähnchen würzen, in Olivenöl goldbraun braten.", "Salat in Stücke reißen.", "Dressing aus Mayo, Worcestersauce, Parmesan und Zitrone mischen.", "Alles vermengen, Parmesan drüber."],
  },
  {
    id: "griechischer-salat-feta",
    name: "Griechischer Salat mit Feta",
    kategorie: "Salat",
    kcal: 320, kh: 6, eiweiss: 10, fett: 26,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🫒",
    tags: ["keto", "salat", "feta", "mediterran"],
    zutaten: ["1 Gurke", "2 Tomaten", "100 g Feta", "50 g Kalamata-Oliven", "½ rote Zwiebel", "Oregano", "3 EL Olivenöl", "1 EL Rotweinessig", "Salz, Pfeffer"],
    zubereitung: ["Gemüse grob würfeln.", "Feta in Stücke brechen.", "Alles mit Oliven und Zwiebeln vermengen.", "Mit Olivenöl, Essig, Oregano, Salz und Pfeffer abschmecken."],
  },
  {
    id: "rindfleischsalat-senfvinaigrette",
    name: "Rindfleischsalat mit Senfvinaigrette",
    kategorie: "Salat",
    kcal: 380, kh: 4, eiweiss: 32, fett: 26,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["keto", "salat", "rind", "senf"],
    zutaten: ["300 g gekochtes Rindfleisch (Reste)", "½ rote Zwiebel", "Cornichons (3 Stück)", "2 EL Senf", "3 EL Olivenöl", "1 EL Essig", "Schnittlauch", "Salz, Pfeffer"],
    zubereitung: ["Rindfleisch in Streifen schneiden.", "Zwiebel und Cornichons fein hacken.", "Dressing aus Senf, Öl und Essig rühren.", "Alles vermengen, mit Schnittlauch garnieren."],
  },
  {
    id: "bacon-ei-salat",
    name: "Bacon-Ei-Salat",
    kategorie: "Salat",
    kcal: 390, kh: 2, eiweiss: 22, fett: 32,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥚",
    tags: ["keto", "salat", "bacon", "eier"],
    zutaten: ["4 Eier (hartgekocht)", "100 g Bacon", "Eisbergsalat", "2 EL Mayonnaise", "1 TL Senf", "Schnittlauch", "Paprika", "Salz, Pfeffer"],
    zubereitung: ["Bacon knusprig braten.", "Eier würfeln.", "Mayo mit Senf zu Dressing rühren.", "Alles auf Eisbergsalat anrichten, Schnittlauch drüber."],
  },
  {
    id: "thunfisch-avocado-salat",
    name: "Thunfisch-Avocado-Salat",
    kategorie: "Salat",
    kcal: 360, kh: 3, eiweiss: 28, fett: 26,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥑",
    tags: ["keto", "salat", "thunfisch", "avocado"],
    zutaten: ["1 Dose Thunfisch (im eigenen Saft)", "1 Avocado", "½ rote Zwiebel", "2 EL Mayonnaise", "Zitronensaft", "Chili", "Salz, Pfeffer", "Feldsalat"],
    zubereitung: ["Thunfisch abtropfen lassen.", "Avocado würfeln, mit Zitrone beträufeln.", "Zwiebel fein hacken.", "Alles mit Mayo und Gewürzen vermengen.", "Auf Feldsalat servieren."],
  },
  {
    id: "lammhack-salat-warm",
    name: "Warmer Lammhack-Salat",
    kategorie: "Salat",
    kcal: 420, kh: 5, eiweiss: 28, fett: 32,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["keto", "salat", "lamm", "warm"],
    zutaten: ["300 g Lammhack", "Rucola", "Cocktailtomaten", "Feta", "Knoblauch", "Kreuzkümmel", "Olivenöl", "Zitrone", "Salz, Pfeffer"],
    zubereitung: ["Lammhack mit Knoblauch und Kreuzkümmel scharf anbraten.", "Rucola und Tomaten auf Teller anrichten.", "Heißen Lammhack drüber geben.", "Feta bröseln, mit Olivenöl und Zitrone beträufeln."],
  },
  {
    id: "haehnchen-avocado-limette",
    name: "Hähnchen-Avocado-Limetten-Salat",
    kategorie: "Salat",
    kcal: 400, kh: 4, eiweiss: 34, fett: 26,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["keto", "salat", "hähnchen", "avocado"],
    zutaten: ["1 Hähnchenbrustfilet (gegrillt)", "1 Avocado", "Feldsalat", "Kirschtomaten", "Limettensaft", "2 EL Olivenöl", "Chili", "Koriander", "Salz"],
    zubereitung: ["Hähnchen in Streifen schneiden.", "Avocado würfeln, mit Limettensaft beträufeln.", "Alles auf Feldsalat anrichten.", "Mit Olivenöl, Chili und Koriander abschmecken."],
  },
  {
    id: "brokkoli-speck-cheddar-salat",
    name: "Brokkoli-Speck-Salat mit Cheddar",
    kategorie: "Salat",
    kcal: 380, kh: 6, eiweiss: 18, fett: 30,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥦",
    tags: ["keto", "salat", "brokkoli", "speck", "käse"],
    zutaten: ["300 g Brokkoli-Röschen", "100 g Speck gewürfelt", "80 g Cheddar gewürfelt", "3 EL Mayonnaise", "1 EL Apfelessig", "½ rote Zwiebel", "Salz, Pfeffer"],
    zubereitung: ["Brokkoli bissfest blanchieren, kalt abschrecken.", "Speck knusprig braten.", "Dressing aus Mayo und Essig rühren.", "Alles vermengen, Cheddar drüber streuen."],
  },
  {
    id: "salami-antipasto-salat",
    name: "Salami-Käse-Antipasto-Salat",
    kategorie: "Salat",
    kcal: 460, kh: 3, eiweiss: 22, fett: 40,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["keto", "salat", "salami", "käse", "schnell"],
    zutaten: ["100 g Salami", "100 g Hartkäse (Gouda/Emmentaler)", "Rucola", "50 g Oliven", "Cocktailtomaten", "3 EL Olivenöl", "1 EL Balsamico", "Oregano"],
    zubereitung: ["Salami und Käse in Stücke schneiden.", "Rucola als Basis, Salami und Käse drüber.", "Oliven und Tomaten verteilen.", "Mit Olivenöl, Balsamico und Oregano dressieren."],
  },
  {
    id: "roastbeef-meerrettich-salat",
    name: "Roastbeef-Salat mit Meerrettich",
    kategorie: "Salat",
    kcal: 340, kh: 3, eiweiss: 28, fett: 23,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["keto", "salat", "roastbeef", "meerrettich", "special"],
    zutaten: ["200 g Roastbeef (dünn aufgeschnitten)", "Blattsalat", "2 EL frischer Meerrettich", "3 EL saure Sahne", "Zitronensaft", "Schnittlauch", "Salz, Pfeffer"],
    zubereitung: ["Saure Sahne mit Meerrettich und Zitronensaft verrühren.", "Salat als Basis.", "Roastbeef-Scheiben drapieren.", "Meerrettich-Dressing drüber, Schnittlauch garnieren."],
  },

  // ─── NEUES FRÜHSTÜCK ──────────────────────────────────────────────────────
  {
    id: "ruehreier-speck-kaese",
    name: "Cremige Rühreier mit Speck & Käse",
    kategorie: "Frühstück",
    kcal: 480, kh: 1, eiweiss: 28, fett: 40,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["keto", "eier", "speck", "käse"],
    zutaten: ["4 Eier", "50 g Speck gewürfelt", "50 g Gouda gerieben", "2 EL Butter", "2 EL Sahne", "Schnittlauch", "Salz, Pfeffer"],
    zubereitung: ["Speck in Butter anbraten, herausnehmen.", "Eier mit Sahne, Salz und Pfeffer verquirlen.", "Bei kleinster Hitze in Butter langsam stocken lassen — immer rühren.", "Käse und Speck unterheben.", "Mit Schnittlauch servieren."],
  },
  {
    id: "fruehstueckswraps-keto",
    name: "Keto Frühstücks-Wraps",
    kategorie: "Frühstück",
    kcal: 520, kh: 3, eiweiss: 30, fett: 42,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🌯",
    tags: ["keto", "eier", "bacon", "wrap"],
    zutaten: ["4 Eier", "4 Baconstreifen", "50 g Cheddar gerieben", "Salatblätter", "Tomate", "Mayonnaise", "Salz, Pfeffer"],
    zubereitung: ["Eier zu dünnen Omeletts braten (je 1 Ei pro Wrap).", "Bacon knusprig braten.", "Omeletts mit Käse, Bacon, Salat, Tomate und Mayo belegen.", "Fest einrollen."],
  },
  {
    id: "ricotta-pfannkuchen",
    name: "Keto Ricotta-Pfannkuchen",
    kategorie: "Frühstück",
    kcal: 380, kh: 4, eiweiss: 22, fett: 30,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥞",
    tags: ["keto", "pfannkuchen", "ricotta", "süß"],
    zutaten: ["150 g Ricotta", "3 Eier", "50 g Mandelmehl", "1 TL Vanille", "Stevia nach Geschmack", "Butter zum Braten", "Beeren zum Servieren"],
    zubereitung: ["Ricotta, Eier, Mandelmehl, Vanille und Stevia verrühren.", "Kleine Portionen in Butter ausbacken (je 2–3 Min).", "Mit frischen Beeren servieren."],
  },
  {
    id: "spiegeleier-chorizo",
    name: "Spiegeleier auf Chorizo",
    kategorie: "Frühstück",
    kcal: 500, kh: 1, eiweiss: 26, fett: 43,
    zeit: "12 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["keto", "eier", "chorizo", "würzig"],
    zutaten: ["3 Eier", "80 g Chorizo in Scheiben", "1 EL Olivenöl", "Paprikapulver", "Salz, Pfeffer", "frische Petersilie"],
    zubereitung: ["Chorizo in Olivenöl knusprig braten, herausnehmen.", "In gleichem Öl Spiegeleier braten.", "Chorizo zurück, mit Paprika würzen.", "Petersilie drüber."],
  },
  {
    id: "avocado-ei-cup",
    name: "Avocado Ei-Cup aus dem Ofen",
    kategorie: "Frühstück",
    kcal: 340, kh: 3, eiweiss: 14, fett: 30,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥑",
    tags: ["keto", "avocado", "eier", "ofen"],
    zutaten: ["2 reife Avocados", "4 Eier", "50 g Cheddar gerieben", "Chiliflocken", "Salz, Pfeffer", "Schnittlauch"],
    zubereitung: ["Avocados halbieren, Kern herausnehmen, Mulde etwas vergrößern.", "Jeweils ein Ei in die Mulde schlagen.", "Käse drüber, mit Chili und Salz würzen.", "Bei 200 °C 12–15 Min backen bis Eiweiß gestockt."],
  },
  {
    id: "kaese-schinken-muffins",
    name: "Käse-Schinken-Frühstücksmuffins",
    kategorie: "Frühstück",
    kcal: 280, kh: 2, eiweiss: 18, fett: 22,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🧁",
    tags: ["keto", "muffin", "käse", "schinken", "vorbereiten"],
    zutaten: ["6 Eier", "100 g Kochschinken gewürfelt", "80 g Gouda gerieben", "2 EL Sahne", "Schnittlauch", "Salz, Pfeffer"],
    zubereitung: ["Eier mit Sahne, Salz und Pfeffer verquirlen.", "Schinken und Käse unterheben.", "In gefettete Muffinform füllen.", "Bei 180 °C 18 Min backen."],
  },
  {
    id: "frischkaese-raeucherlachs",
    name: "Frischkäse-Röllchen mit Räucherlachs",
    kategorie: "Frühstück",
    kcal: 320, kh: 2, eiweiss: 20, fett: 26,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🧀",
    tags: ["keto", "frischkäse", "lachs", "schnell"],
    zutaten: ["150 g Frischkäse (Vollfett)", "100 g Räucherlachs", "Kapern", "½ rote Zwiebel", "Dill", "Zitronensaft", "Salatblätter", "Gurke"],
    zubereitung: ["Frischkäse mit Dill, Kapern und Zitronensaft verrühren.", "Räucherlachs auf Salatblatt legen.", "Frischkäse drauf streichen.", "Gurke und Zwiebel drauf, fest aufrollen."],
  },
  {
    id: "nuss-granola-joghurt",
    name: "Keto Nuss-Granola mit Joghurt",
    kategorie: "Frühstück",
    kcal: 420, kh: 6, eiweiss: 16, fett: 36,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥣",
    tags: ["keto", "nüsse", "granola", "joghurt"],
    zutaten: ["50 g Mandelblättchen", "50 g Walnüsse grob gehackt", "30 g Chiasamen", "30 g Kokosraspeln", "2 EL Butter", "Stevia", "200 g griechischer Joghurt (Vollfett)", "frische Beeren"],
    zubereitung: ["Nüsse, Kokosraspeln und Chiasamen in Butter mit Stevia anrösten.", "Auf Backpapier abkühlen lassen.", "Joghurt in Schüssel, Granola drüber.", "Mit Beeren garnieren."],
  },
  {
    id: "kaese-ei-taler",
    name: "Käse-Ei-Taler",
    kategorie: "Frühstück",
    kcal: 360, kh: 1, eiweiss: 24, fett: 30,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🧀",
    tags: ["keto", "käse", "eier", "schnell"],
    zutaten: ["4 Eier", "100 g geriebener Käse (Emmentaler/Gouda)", "1 EL Butter", "Kräuter nach Wahl", "Salz, Pfeffer"],
    zubereitung: ["Käse in Häufchen in Pfanne geben, schmelzen lassen.", "Ei drüber aufschlagen, mit Deckel stocken lassen.", "Mit Kräutern, Salz und Pfeffer würzen.", "Mit Pfannenwender herausnehmen."],
  },
  {
    id: "fruehstuecksbowl-beeren",
    name: "Keto Frühstücksbowl mit Beeren",
    kategorie: "Frühstück",
    kcal: 380, kh: 7, eiweiss: 14, fett: 32,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🫐",
    tags: ["keto", "bowl", "beeren", "mandeln"],
    zutaten: ["150 g Mascarpone", "50 g Frischkäse", "100 g gemischte Beeren (TK auftauen)", "30 g Mandelblättchen geröstet", "1 EL MCT-Öl", "Stevia", "Vanille"],
    zubereitung: ["Mascarpone mit Frischkäse, MCT-Öl, Stevia und Vanille cremig rühren.", "In Schüssel geben.", "Beeren drüber.", "Mit gerösteten Mandeln toppen."],
  },

  // ─── NEU: FRÜHSTÜCK ──────────────────────────────────────────────────────────
  {
    id: "feta-spinat-muffin",
    name: "Feta-Spinat-Frühstücksmuffin",
    kategorie: "Frühstück",
    kcal: 210, kh: 2, eiweiss: 13, fett: 17,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🧆",
    tags: ["keto", "muffin", "feta", "meal-prep"],
    zutaten: ["6 Eier", "100 g Feta zerkrümelt", "80 g Babyspinat", "2 EL Olivenöl", "Salz, Pfeffer", "Muskatnuss", "Silikonmuffinform"],
    zubereitung: ["Ofen auf 180 °C vorheizen.", "Spinat kurz in Olivenöl zusammenfallen lassen.", "Eier verquirlen, würzen.", "Spinat und Feta in Muffinform geben.", "Eimasse draufgießen.", "20 Min backen. Hält 4 Tage im Kühlschrank."],
  },
  {
    id: "speck-brokkoli-frittata",
    name: "Speck-Brokkoli-Frittata",
    kategorie: "Frühstück",
    kcal: 390, kh: 3, eiweiss: 25, fett: 31,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["keto", "frittata", "brokkoli", "speck"],
    zutaten: ["5 Eier", "100 g Speck gewürfelt", "150 g Brokkoli in Röschen", "50 g Cheddar gerieben", "2 EL Sahne", "Salz, Pfeffer"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Speck knusprig anbraten.", "Brokkoli kurz dazugeben und anbraten.", "Eier mit Sahne verquirlen, würzen.", "Eimasse über Speck und Brokkoli gießen.", "Käse drüber, 12 Min im Ofen backen."],
  },
  {
    id: "mandelbutter-sellerie",
    name: "Mandelmus mit Selleriestangen",
    kategorie: "Frühstück",
    kcal: 220, kh: 4, eiweiss: 7, fett: 19,
    zeit: "3 Min", schwierigkeit: "Einfach",
    bild: "🥜",
    tags: ["keto", "schnell", "vegan", "rohkost"],
    zutaten: ["3 EL Mandelmus (ohne Zucker)", "3 Stangen Sellerie", "Prise Meersalz", "optional: Zimt"],
    zubereitung: ["Sellerie waschen und in mundgerechte Stucke schneiden.", "Mandelmus mit Salz und Zimt verrühren.", "Als Dip servieren."],
  },
  {
    id: "kokos-matcha-smoothie",
    name: "Kokos-Matcha-Smoothie",
    kategorie: "Frühstück",
    kcal: 250, kh: 5, eiweiss: 5, fett: 22,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🍵",
    tags: ["keto", "smoothie", "matcha", "vegan"],
    zutaten: ["200 ml Kokosmilch (vollfett)", "1 TL Matcha-Pulver", "1 EL MCT-Öl", "Stevia", "Eis", "optional: Vanilleextrakt"],
    zubereitung: ["Alle Zutaten in Mixer geben.", "30 Sekunden mixen.", "Mit Eis servieren."],
  },
  {
    id: "sardinen-eier-teller",
    name: "Sardinen-Ei-Frühstücksteller",
    kategorie: "Frühstück",
    kcal: 360, kh: 1, eiweiss: 32, fett: 25,
    zeit: "8 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "fisch", "schnell", "eiweiss"],
    zutaten: ["1 Dose Sardinen in Olivenöl", "2 hartgekochte Eier", "Gurke in Scheiben", "Zitronensaft", "Salz, Pfeffer", "frische Petersilie"],
    zubereitung: ["Eier pellen und halbieren.", "Sardinen abgießen und anrichten.", "Mit Gurke, Zitrone und Petersilie servieren."],
  },
  {
    id: "zucchini-ei-pancakes",
    name: "Zucchini-Ei-Pancakes",
    kategorie: "Frühstück",
    kcal: 280, kh: 4, eiweiss: 17, fett: 22,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥞",
    tags: ["keto", "zucchini", "herzhaft", "pancakes"],
    zutaten: ["1 kleine Zucchini gerieben", "3 Eier", "40 g Parmesan gerieben", "Knoblauchpulver", "Salz, Pfeffer", "Butter zum Braten"],
    zubereitung: ["Zucchini reiben und gut ausdrücken (Küchentuch).", "Mit Eiern, Parmesan und Gewürzen vermischen.", "Kleine Häufchen in Butter bei mittlerer Hitze braten.", "Je 3 Min je Seite bis goldbraun."],
  },
  {
    id: "kakaobutter-kaffee",
    name: "Kakao-Bulletproof-Kaffee",
    kategorie: "Frühstück",
    kcal: 260, kh: 1, eiweiss: 1, fett: 28,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "☕",
    tags: ["keto", "kaffee", "kakao", "energie"],
    zutaten: ["250 ml starker Kaffee", "1 EL Butter", "1 EL MCT-Öl", "1 TL Kakaopulver (ungesüßt)", "Stevia", "Prise Zimt"],
    zubereitung: ["Kaffee brühen.", "Alle Zutaten in Mixer geben.", "30 Sekunden mixen bis cremig-schaumig.", "Sofort trinken."],
  },
  {
    id: "ricotta-himbeer-bowl",
    name: "Ricotta-Himbeer-Bowl",
    kategorie: "Frühstück",
    kcal: 320, kh: 6, eiweiss: 14, fett: 25,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🍓",
    tags: ["keto", "ricotta", "beeren", "schnell"],
    zutaten: ["200 g Ricotta", "80 g Himbeeren frisch oder TK", "2 EL Sahne", "Stevia", "Vanilleextrakt", "20 g gehackte Pistazien"],
    zubereitung: ["Ricotta mit Sahne, Stevia und Vanille glatt rühren.", "In Schüssel geben.", "Himbeeren drüber geben.", "Mit Pistazien toppen."],
  },
  {
    id: "thunfisch-avocado-toast-keto",
    name: "Thunfisch-Avocado auf Eiweißbrot",
    kategorie: "Frühstück",
    kcal: 410, kh: 4, eiweiss: 30, fett: 30,
    zeit: "8 Min", schwierigkeit: "Einfach",
    bild: "🥪",
    tags: ["keto", "thunfisch", "avocado", "brot"],
    zutaten: ["2 Scheiben Keto-Eiweißbrot", "1 Dose Thunfisch abgetropft", "1 halbe Avocado", "Zitronensaft", "Salz, Pfeffer", "Chiliflocken", "Kapern optional"],
    zubereitung: ["Brot toasten.", "Avocado mit Gabel zerdrücken, mit Zitrone würzen.", "Auf Brot streichen.", "Thunfisch drauflegen.", "Mit Pfeffer, Chili und Kapern würzen."],
  },
  {
    id: "cashew-joghurt-granola",
    name: "Kokosjoghurt mit Keto-Granola",
    kategorie: "Frühstück",
    kcal: 340, kh: 6, eiweiss: 8, fett: 30,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🥥",
    tags: ["keto", "vegan", "kokos", "granola"],
    zutaten: ["150 g Kokosjoghurt (ungesüßt)", "3 EL Keto-Granola (Mandeln, Kokos, Kürbiskerne geröstet)", "50 g Heidelbeeren", "1 EL Kokosöl", "Zimt"],
    zubereitung: ["Kokosjoghurt in Schüssel geben.", "Granola drüber streuen.", "Heidelbeeren und Zimt drauf.", "Mit Kokosöl beträufeln."],
  },

  // ─── NEU: MITTAGESSEN ────────────────────────────────────────────────────────
  {
    id: "huehner-zitrone-kapern",
    name: "Hähnchen mit Zitrone, Kapern & Spinat",
    kategorie: "Mittagessen",
    kcal: 420, kh: 4, eiweiss: 38, fett: 27,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍋",
    tags: ["keto", "hähnchen", "zitrone", "spinat"],
    zutaten: ["300 g Hähnchenbrust", "2 EL Butter", "100 g Babyspinat", "2 EL Kapern", "Saft 1 Zitrone", "2 Knoblauchzehen", "Salz, Pfeffer"],
    zubereitung: ["Hähnchen flach klopfen, würzen.", "In Butter goldbraun braten (je 4 Min), beiseitelegen.", "Knoblauch kurz anbraten.", "Spinat zugeben, zusammenfallen lassen.", "Kapern und Zitronensaft dazu.", "Hähnchen zurück in die Pfanne, kurz durchziehen lassen."],
  },
  {
    id: "eiersalat-senf-speck",
    name: "Cremiger Eiersalat mit Senf & Speck",
    kategorie: "Mittagessen",
    kcal: 380, kh: 2, eiweiss: 22, fett: 32,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥚",
    tags: ["keto", "eiersalat", "senf", "speck"],
    zutaten: ["4 hartgekochte Eier", "3 EL Mayonnaise", "1 TL Dijonsenf", "80 g Speck knusprig gebraten", "Schnittlauch", "Salz, Pfeffer", "Salatblätter"],
    zubereitung: ["Eier pellen und würfeln.", "Mit Mayo, Senf, Salz und Pfeffer mischen.", "Speck knusprig braten und drüber bröckeln.", "Auf Salatblättern servieren, mit Schnittlauch toppen."],
  },
  {
    id: "lachs-avocado-gurken-bowl",
    name: "Lachs-Avocado-Gurken-Bowl",
    kategorie: "Mittagessen",
    kcal: 450, kh: 5, eiweiss: 28, fett: 35,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥣",
    tags: ["keto", "lachs", "avocado", "bowl", "fisch"],
    zutaten: ["150 g Räucherlachs", "1 Avocado gewürfelt", "1 halbe Gurke gewürfelt", "2 EL Olivenöl", "1 EL Sojasoße (glutenfrei)", "Sesam", "Ingwer gerieben", "Limettensaft"],
    zubereitung: ["Lachs in Streifen schneiden.", "Gurke und Avocado würfeln.", "Dressing aus Olivenöl, Sojasoße, Ingwer und Limette mischen.", "Alles in Bowl anrichten, mit Sesam bestreuen."],
  },
  {
    id: "brokkoli-hack-pfanne",
    name: "Hackfleisch-Brokkoli-Pfanne mit Käse",
    kategorie: "Mittagessen",
    kcal: 480, kh: 6, eiweiss: 34, fett: 35,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥦",
    tags: ["keto", "hack", "brokkoli", "käse"],
    zutaten: ["400 g Rinderhack", "300 g Brokkoli", "80 g Cheddar gerieben", "1 Zwiebel", "2 Knoblauchzehen", "Paprikapulver", "Salz, Pfeffer", "Olivenöl"],
    zubereitung: ["Zwiebel und Knoblauch anbraten.", "Hack dazu, krümelig braten.", "Brokkoli dazu, 5 Min mitbraten.", "Würzen.", "Käse drüber, kurz schmelzen lassen."],
  },
  {
    id: "garnelen-avocado-zucchini",
    name: "Garnelen mit Zucchini und Avocadodip",
    kategorie: "Mittagessen",
    kcal: 390, kh: 5, eiweiss: 26, fett: 29,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🦐",
    tags: ["keto", "garnelen", "zucchini", "fisch"],
    zutaten: ["300 g Garnelen roh", "2 Zucchini in Scheiben", "1 Avocado", "Knoblauch", "Olivenöl", "Limette", "Koriander oder Petersilie", "Chiliflocken"],
    zubereitung: ["Zucchini in Olivenöl anbraten, beiseitelegen.", "Garnelen mit Knoblauch und Chili 3 Min braten.", "Avocado mit Limette, Salz und Koriander stampfen.", "Alles anrichten."],
  },
  {
    id: "putenstreifen-paprika-pfanne",
    name: "Putenstreifen-Paprika-Pfanne",
    kategorie: "Mittagessen",
    kcal: 360, kh: 6, eiweiss: 34, fett: 21,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🫑",
    tags: ["keto", "pute", "paprika", "pfanne"],
    zutaten: ["350 g Putenbrust in Streifen", "2 Paprika (rot, gelb)", "1 Zwiebel", "2 EL Olivenöl", "Kreuzkümmel", "Paprikapulver", "Salz, Pfeffer", "frische Petersilie"],
    zubereitung: ["Zwiebel und Paprika in Streifen schneiden.", "Pute in heißem Öl anbraten.", "Paprika und Zwiebeln dazu, 8 Min mitbraten.", "Kräftig würzen, Petersilie drüber."],
  },
  {
    id: "blumenkohl-tuerkisch",
    name: "Orientalischer Blumenkohl aus dem Ofen",
    kategorie: "Mittagessen",
    kcal: 260, kh: 7, eiweiss: 8, fett: 20,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🌸",
    tags: ["keto", "vegan", "blumenkohl", "ofen"],
    zutaten: ["1 kleiner Blumenkohl", "3 EL Olivenöl", "Kreuzkümmel", "Kurkuma", "Paprika", "Knoblauchpulver", "Salz", "Tahini zum Servieren", "Zitronensaft"],
    zubereitung: ["Ofen auf 220 °C vorheizen.", "Blumenkohl in Röschen teilen.", "Mit Öl und Gewürzen gut vermengen.", "30 Min rösten bis goldbraun.", "Mit Tahini und Zitrone servieren."],
  },
  {
    id: "speck-lauch-suppe-schnell",
    name: "Schnelle Speck-Lauch-Suppe",
    kategorie: "Mittagessen",
    kcal: 340, kh: 5, eiweiss: 14, fett: 28,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🫕",
    tags: ["keto", "suppe", "lauch", "speck"],
    zutaten: ["200 g Speck gewürfelt", "2 Stangen Lauch", "400 ml Brühe", "200 ml Sahne", "1 EL Butter", "Salz, Pfeffer", "Muskat"],
    zubereitung: ["Speck in Butter knusprig braten.", "Lauch in Ringe schneiden, dazu geben.", "5 Min mitdünsten.", "Brühe und Sahne dazu, 10 Min köcheln.", "Würzen und servieren."],
  },
  {
    id: "rindfleisch-pilz-salat",
    name: "Warmer Rindfleisch-Pilz-Salat",
    kategorie: "Mittagessen",
    kcal: 430, kh: 4, eiweiss: 30, fett: 33,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["keto", "rindfleisch", "pilze", "salat"],
    zutaten: ["250 g Rindersteak", "150 g Champignons", "50 g Rucola", "2 EL Olivenöl", "1 EL Balsamico", "Knoblauch", "Rosmarin", "Salz, Pfeffer", "Parmesan"],
    zubereitung: ["Steak in Öl mit Knoblauch und Rosmarin braten (medium).", "Ruhen lassen und in Streifen schneiden.", "Champignons im gleichen Fett anbraten.", "Auf Rucola anrichten.", "Mit Balsamico, Olivenöl und Parmesan servieren."],
  },
  {
    id: "thunfisch-kapern-salat",
    name: "Thunfisch-Kapern-Salat mit Ei",
    kategorie: "Mittagessen",
    kcal: 350, kh: 2, eiweiss: 30, fett: 24,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "thunfisch", "kapern", "fisch"],
    zutaten: ["2 Dosen Thunfisch", "3 hartgekochte Eier", "2 EL Kapern", "3 EL Mayonnaise", "1 EL Senf", "Zitronensaft", "Petersilie", "Salatblätter"],
    zubereitung: ["Thunfisch abgießen.", "Eier pellen und würfeln.", "Alles mit Mayo, Senf, Kapern und Zitrone mischen.", "Auf Salatblättern anrichten."],
  },
  {
    id: "keto-bowl-falafel",
    name: "Keto-Falafel-Bowl (Blumenkohl)",
    kategorie: "Mittagessen",
    kcal: 370, kh: 7, eiweiss: 14, fett: 30,
    zeit: "30 Min", schwierigkeit: "Mittel",
    bild: "🧆",
    tags: ["keto", "vegetarisch", "falafel", "blumenkohl"],
    zutaten: ["300 g Blumenkohl geraspelt", "2 Eier", "50 g Mandelmehl", "Kreuzkümmel", "Koriander", "Knoblauch", "Salz", "Olivenöl", "Tahini-Dip"],
    zubereitung: ["Blumenkohl raspeln und 5 Min dämpfen, gut ausdrücken.", "Mit Eiern, Mandelmehl und Gewürzen mischen.", "Bällchen formen.", "In Olivenöl von allen Seiten anbraten.", "Mit Tahini servieren."],
  },
  {
    id: "avocado-ziegenkase-salat",
    name: "Avocado-Ziegenkäse-Salat",
    kategorie: "Mittagessen",
    kcal: 420, kh: 5, eiweiss: 12, fett: 38,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥑",
    tags: ["keto", "vegetarisch", "avocado", "salat"],
    zutaten: ["1 Avocado", "80 g Ziegenkäse", "50 g Walnüsse", "Rucola", "2 EL Olivenöl", "1 EL Apfelessig", "Honigsenf (zuckerfrei)", "Salz, Pfeffer"],
    zubereitung: ["Avocado in Scheiben schneiden.", "Ziegenkäse in Scheiben, kurz in Pfanne anbraten.", "Rucola auf Teller, Avocado und Ziegenkäse drauf.", "Walnüsse drüber.", "Mit Dressing beträufeln."],
  },
  {
    id: "spinat-sahne-lachs-pasta",
    name: "Zucchini-Pasta mit Lachs & Spinat-Sahne",
    kategorie: "Mittagessen",
    kcal: 490, kh: 6, eiweiss: 30, fett: 38,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍝",
    tags: ["keto", "zucchini", "lachs", "sahne", "fisch"],
    zutaten: ["2 Zucchini (Zoodles)", "200 g Lachsfilet", "100 g Babyspinat", "150 ml Sahne", "1 Knoblauchzehe", "Zitronenabrieb", "Salz, Pfeffer", "Dill"],
    zubereitung: ["Zucchini spiralisieren oder mit Sparschäler in Streifen.", "Lachs in Stücke schneiden, in Butter braten.", "Knoblauch und Spinat dazu.", "Sahne zugießen, einkochen lassen.", "Zoodles kurz dazugeben.", "Mit Zitrone und Dill würzen."],
  },
  {
    id: "keto-gyros-salat",
    name: "Gyros-Salat mit Tzatziki",
    kategorie: "Mittagessen",
    kcal: 460, kh: 5, eiweiss: 30, fett: 35,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥙",
    tags: ["keto", "hähnchen", "gyros", "griechisch"],
    zutaten: ["300 g Hähnchenbrust", "Gyros-Gewürz", "Olivenöl", "Eisbergsalat", "Tomate", "Gurke", "rote Zwiebel", "150 g Tzatziki (aus Gurke, Joghurt, Knoblauch, Dill)"],
    zubereitung: ["Hähnchen in Streifen schneiden, mit Gewürz marinieren.", "In Olivenöl knusprig braten.", "Salat und Gemüse anrichten.", "Hähnchen drauf.", "Mit Tzatziki servieren."],
  },
  {
    id: "blumenkohl-steak",
    name: "Blumenkohl-Steak mit Kräuterbutter",
    kategorie: "Mittagessen",
    kcal: 280, kh: 6, eiweiss: 7, fett: 24,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🥦",
    tags: ["keto", "vegetarisch", "blumenkohl", "vegan"],
    zutaten: ["1 Blumenkohl", "3 EL Olivenöl", "2 EL Butter", "Knoblauch", "frischer Thymian", "Rosmarin", "Salz, Pfeffer"],
    zubereitung: ["Blumenkohl in 2–3 cm dicke Scheiben schneiden.", "In Olivenöl von beiden Seiten goldbraun braten.", "Butter, Knoblauch und Kräuter dazu.", "Unter Basting (Begießen) fertig garen."],
  },
  {
    id: "haehnchen-kokosmilch-suppe",
    name: "Thai-Hähnchensuppe mit Kokosmilch",
    kategorie: "Mittagessen",
    kcal: 420, kh: 6, eiweiss: 28, fett: 32,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍲",
    tags: ["keto", "hähnchen", "kokosmilch", "suppe"],
    zutaten: ["300 g Hähnchenbrust in Würfeln", "400 ml Kokosmilch", "300 ml Hühnerbrühe", "Ingwer", "Zitronengras", "Limettensaft", "Fischsauce", "Chili", "Koriander"],
    zubereitung: ["Ingwer und Zitronengras kurz anbraten.", "Hähnchen dazu, anbraten.", "Kokosmilch und Brühe zugießen.", "15 Min köcheln.", "Mit Limette, Fischsauce und Chili abschmecken.", "Mit Koriander servieren."],
  },
  {
    id: "hackfleisch-zucchini-auflauf",
    name: "Hackfleisch-Zucchini-Auflauf",
    kategorie: "Mittagessen",
    kcal: 470, kh: 6, eiweiss: 33, fett: 35,
    zeit: "40 Min", schwierigkeit: "Einfach",
    bild: "🫕",
    tags: ["keto", "hack", "zucchini", "ofen"],
    zutaten: ["500 g Hackfleisch", "2 Zucchini", "200 ml Sahne", "100 g Parmesan gerieben", "1 Dose Tomaten (stückig)", "Oregano", "Basilikum", "Knoblauch", "Salz, Pfeffer"],
    zubereitung: ["Ofen auf 180 °C vorheizen.", "Hack mit Knoblauch anbraten.", "Tomaten dazu, würzen.", "Zucchini in Scheiben auf Hack legen.", "Sahne drüber, Parmesan drauf.", "25 Min backen."],
  },
  {
    id: "makrelen-radieschen-salat",
    name: "Makrelen-Radieschen-Salat",
    kategorie: "Mittagessen",
    kcal: 380, kh: 3, eiweiss: 24, fett: 30,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "makrele", "fisch", "salat"],
    zutaten: ["2 Makrelenfilets geräuchert", "1 Bund Radieschen", "Frühlingszwiebeln", "3 EL Saure Sahne", "1 EL Zitronensaft", "Meerrettich", "Dill", "Salat"],
    zubereitung: ["Makrele in Stücke zupfen.", "Radieschen und Frühlingszwiebeln in Scheiben.", "Dressing aus saurer Sahne, Zitrone, Meerrettich und Dill.", "Alles mischen, auf Salat anrichten."],
  },
  {
    id: "rucola-pesto-hähnchen",
    name: "Hähnchen mit Rucola-Pesto",
    kategorie: "Mittagessen",
    kcal: 450, kh: 3, eiweiss: 36, fett: 33,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🌿",
    tags: ["keto", "hähnchen", "pesto", "rucola"],
    zutaten: ["300 g Hähnchenbrust", "50 g Rucola", "30 g Parmesan", "30 g Pinienkerne", "4 EL Olivenöl", "Knoblauch", "Zitronensaft", "Salz, Pfeffer"],
    zubereitung: ["Rucola, Parmesan, Pinienkerne, Knoblauch und Olivenöl zu Pesto mixen.", "Hähnchen würzen und goldbraun braten.", "Mit Rucola-Pesto servieren."],
  },
  {
    id: "ei-avocado-wrap-salat",
    name: "Ei-Avocado-Wrap in Salatblatt",
    kategorie: "Mittagessen",
    kcal: 350, kh: 3, eiweiss: 16, fett: 30,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🌯",
    tags: ["keto", "ei", "avocado", "wrap", "vegetarisch"],
    zutaten: ["4 große Salatblätter (Eisberg)", "3 hartgekochte Eier", "1 Avocado", "2 EL Mayo", "Senf", "Salz, Pfeffer", "Schnittlauch"],
    zubereitung: ["Eier würfeln, mit Mayo und Senf mischen.", "Avocado mit Gabel grob zerdrücken.", "Auf Salatblätter verteilen.", "Rollen und sofort essen."],
  },
  {
    id: "linsen-hack-suppe-keto",
    name: "Rote Linsen-Hack-Suppe (Keto-light)",
    kategorie: "Mittagessen",
    kcal: 410, kh: 8, eiweiss: 28, fett: 28,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🫕",
    tags: ["keto", "hack", "suppe", "linsen"],
    zutaten: ["250 g Hackfleisch", "80 g rote Linsen", "1 Dose Tomaten", "600 ml Brühe", "Zwiebel", "Knoblauch", "Kreuzkümmel", "Kurkuma", "Paprika", "Olivenöl"],
    zubereitung: ["Zwiebel und Knoblauch anbraten.", "Hack dazu, krümelig braten.", "Gewürze kurz mitrösten.", "Linsen, Tomaten und Brühe dazu.", "20 Min köcheln."],
  },
  {
    id: "fisch-tacos-salat",
    name: "Fisch-Taco-Bowl (ohne Tortilla)",
    kategorie: "Mittagessen",
    kcal: 430, kh: 6, eiweiss: 28, fett: 32,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🌮",
    tags: ["keto", "fisch", "taco", "bowl"],
    zutaten: ["300 g weißer Fisch (Kabeljau oder Tilapia)", "Taco-Gewürz", "Kohlsalat gerieben", "1 Avocado", "Saure Sahne", "Limette", "Koriander", "Jalapeños", "Olivenöl"],
    zubereitung: ["Fisch würzen und in Öl braten.", "Kohl und Avocado vorbereiten.", "Saure Sahne mit Limette und Koriander mischen.", "Alles in Bowl anrichten."],
  },
  {
    id: "caprese-hähnchen",
    name: "Hähnchen-Caprese",
    kategorie: "Mittagessen",
    kcal: 460, kh: 4, eiweiss: 38, fett: 32,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍅",
    tags: ["keto", "hähnchen", "mozzarella", "caprese"],
    zutaten: ["2 Hähnchenbrüste", "125 g Mozzarella", "2 Tomaten", "frisches Basilikum", "Olivenöl", "Balsamico-Creme (zuckerfrei)", "Salz, Pfeffer"],
    zubereitung: ["Hähnchen goldbraun braten.", "Mozzarella und Tomaten drauflegen.", "Mit Deckel kurz schmelzen lassen.", "Mit Basilikum, Olivenöl und Balsamico anrichten."],
  },
  {
    id: "keto-shakshuka-feta",
    name: "Shakshuka mit Feta",
    kategorie: "Mittagessen",
    kcal: 340, kh: 7, eiweiss: 18, fett: 26,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["keto", "vegetarisch", "ei", "tomaten"],
    zutaten: ["4 Eier", "1 Dose stückige Tomaten", "80 g Feta", "1 Paprika", "Knoblauch", "Kreuzkümmel", "Paprikapulver", "Olivenöl", "frische Petersilie"],
    zubereitung: ["Paprika und Knoblauch in Olivenöl anbraten.", "Tomaten und Gewürze dazu, 5 Min köcheln.", "Mulden drücken, Eier hineingeben.", "Mit Deckel 5–7 Min stocken lassen.", "Feta drüber bröckeln, mit Petersilie servieren."],
  },
  {
    id: "schweinefilet-pilz-senf",
    name: "Schweinefilet in Pilz-Senfsauce",
    kategorie: "Mittagessen",
    kcal: 440, kh: 4, eiweiss: 32, fett: 33,
    zeit: "25 Min", schwierigkeit: "Mittel",
    bild: "🍄",
    tags: ["keto", "schwein", "pilze", "senf"],
    zutaten: ["400 g Schweinefilet", "200 g Champignons", "150 ml Sahne", "1 EL Dijonsenf", "Knoblauch", "Butter", "Thymian", "Salz, Pfeffer"],
    zubereitung: ["Filet in Medaillons schneiden, würzen.", "In Butter anbraten, ruhen lassen.", "Champignons und Knoblauch im gleichen Fett anbraten.", "Sahne und Senf dazu, einkochen.", "Fleisch zurück in die Sauce."],
  },
  {
    id: "keto-nioise-salat",
    name: "Keto Nicoise-Salat",
    kategorie: "Mittagessen",
    kcal: 410, kh: 5, eiweiss: 26, fett: 32,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["keto", "thunfisch", "fisch", "ei", "salat"],
    zutaten: ["2 Dosen Thunfisch", "3 Eier hartgekocht", "grüne Bohnen blanchiert", "Oliven", "Tomaten", "Sardellen", "Kapern", "Olivenöl", "Zitronensaft", "Senf"],
    zubereitung: ["Dressing aus Olivenöl, Zitrone, Senf und Kapern.", "Grüne Bohnen blanchieren.", "Alles auf Teller anrichten.", "Dressing drüber."],
  },

  // ─── NEU: ABENDESSEN ─────────────────────────────────────────────────────────
  {
    id: "keto-rinder-burger-pilze",
    name: "Keto-Burger mit Portobello-Bun",
    kategorie: "Abendessen",
    kcal: 520, kh: 5, eiweiss: 36, fett: 40,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍔",
    tags: ["keto", "burger", "rind", "pilze"],
    zutaten: ["300 g Rinderhack", "2 große Portobello-Pilze", "Cheddar", "Salat", "Tomate", "rote Zwiebel", "Mayo", "Senf", "Salz, Pfeffer"],
    zubereitung: ["Hack würzen, 2 Patties formen.", "Portobellos von beiden Seiten grillen.", "Patties braten, Käse drauf schmelzen.", "Mit Salat, Tomate, Zwiebel, Mayo zusammenbauen."],
  },
  {
    id: "lachs-zitronenbutter-spargel",
    name: "Lachs in Zitronenbutter mit Spargel",
    kategorie: "Abendessen",
    kcal: 480, kh: 4, eiweiss: 34, fett: 36,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "lachs", "spargel", "fisch"],
    zutaten: ["2 Lachsfilets", "500 g grüner Spargel", "3 EL Butter", "Zitronenabrieb", "Knoblauch", "Salz, Pfeffer", "Dill"],
    zubereitung: ["Spargel im Ofen bei 200 °C 15 Min rösten.", "Lachs in Butter auf Hautseite 4 Min braten, wenden, weitere 3 Min.", "Zitronenabrieb, Knoblauch und Dill zur Butter.", "Über Lachs und Spargel gießen."],
  },
  {
    id: "hähnchen-parmesan-ofen",
    name: "Hähnchen-Parmesan aus dem Ofen",
    kategorie: "Abendessen",
    kcal: 490, kh: 4, eiweiss: 42, fett: 34,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "hähnchen", "parmesan", "ofen"],
    zutaten: ["4 Hähnchenbrüste", "100 g Parmesan gerieben", "50 g Mandelmehl", "2 Eier", "Paprikapulver", "Knoblauchpulver", "Olivenöl", "Salz, Pfeffer"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Parmesan mit Mandelmehl und Gewürzen mischen.", "Hähnchen durch Ei ziehen, dann durch Parmesanmischung.", "Auf Blech mit Olivenöl, 25 Min backen."],
  },
  {
    id: "lammhack-aubergine",
    name: "Lammhack-gefüllte Aubergine",
    kategorie: "Abendessen",
    kcal: 460, kh: 7, eiweiss: 28, fett: 34,
    zeit: "40 Min", schwierigkeit: "Mittel",
    bild: "🍆",
    tags: ["keto", "lamm", "aubergine", "ofen"],
    zutaten: ["2 Auberginen", "400 g Lammhack", "1 Dose Tomaten", "Feta", "Knoblauch", "Zimtstange", "Kreuzkümmel", "Olivenöl", "Petersilie"],
    zubereitung: ["Auberginen halbieren, aushöhlen, bei 180 °C 15 Min vorbacken.", "Hack mit Knoblauch, Gewürzen und Tomaten anbraten.", "In Auberginen füllen.", "Feta drüber, 20 Min backen.", "Mit Petersilie servieren."],
  },
  {
    id: "garnelen-kokos-zucchini",
    name: "Garnelen-Kokos-Curry mit Zucchini",
    kategorie: "Abendessen",
    kcal: 420, kh: 7, eiweiss: 25, fett: 32,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🦐",
    tags: ["keto", "garnelen", "kokos", "curry", "fisch"],
    zutaten: ["400 g Garnelen", "2 Zucchini", "400 ml Kokosmilch", "Rote Currypaste", "Knoblauch", "Ingwer", "Limette", "Fischsauce", "Koriander"],
    zubereitung: ["Currypaste, Knoblauch und Ingwer anbraten.", "Kokosmilch zugießen.", "Zucchini und Garnelen dazu, 5 Min garen.", "Mit Limette und Fischsauce abschmecken.", "Mit Koriander servieren."],
  },
  {
    id: "entenbrust-blaukraut",
    name: "Entenbrust mit Blaukraut",
    kategorie: "Abendessen",
    kcal: 540, kh: 8, eiweiss: 30, fett: 44,
    zeit: "35 Min", schwierigkeit: "Mittel",
    bild: "🦆",
    tags: ["keto", "ente", "blaukraut", "festlich"],
    zutaten: ["2 Entenbrustfilets", "300 g Rotkohl", "1 Apfel (grün, klein)", "Essig", "Butter", "Nelken", "Lorbeer", "Salz, Pfeffer"],
    zubereitung: ["Entenbrust auf Fettseite einschneiden, würzen.", "Auf Fettseite in kalter Pfanne erhitzen, 8 Min braten.", "Wenden, 5 Min weiter.", "Im Ofen bei 180 °C 8 Min ruhen.", "Rotkohl mit Apfel, Essig und Gewürzen dünsten."],
  },
  {
    id: "zucchini-ricotta-auflauf",
    name: "Zucchini-Ricotta-Auflauf",
    kategorie: "Abendessen",
    kcal: 380, kh: 6, eiweiss: 18, fett: 30,
    zeit: "40 Min", schwierigkeit: "Einfach",
    bild: "🫕",
    tags: ["keto", "vegetarisch", "zucchini", "ricotta"],
    zutaten: ["3 Zucchini", "250 g Ricotta", "3 Eier", "100 g Parmesan", "Knoblauch", "Basilikum", "Olivenöl", "Salz, Pfeffer", "Muskat"],
    zubereitung: ["Ofen auf 180 °C vorheizen.", "Zucchini in Scheiben braten.", "Ricotta mit Eiern, Knoblauch und Gewürzen mischen.", "Lagen: Zucchini, Ricotta-Mix, Parmesan.", "30 Min backen."],
  },
  {
    id: "rinderfilet-grüne-pfeffersauce",
    name: "Rinderfilet mit grüner Pfeffersauce",
    kategorie: "Abendessen",
    kcal: 520, kh: 2, eiweiss: 38, fett: 40,
    zeit: "25 Min", schwierigkeit: "Mittel",
    bild: "🥩",
    tags: ["keto", "rindfleisch", "steak", "festlich"],
    zutaten: ["400 g Rinderfilet", "2 EL Butter", "150 ml Sahne", "1 EL grüne Pfefferkörner", "Cognac (optional)", "Salz", "Rosmarin"],
    zubereitung: ["Filet bei starker Hitze in Butter von beiden Seiten anbraten.", "Im Ofen bei 160 °C auf Kerntemperatur 55 °C bringen.", "Im gleichen Fett Pfefferkörner andrücken, ablöschen.", "Sahne zugießen, einkochen.", "Filet aufschneiden, mit Sauce servieren."],
  },
  {
    id: "keto-moussaka",
    name: "Keto-Moussaka (mit Aubergine)",
    kategorie: "Abendessen",
    kcal: 480, kh: 8, eiweiss: 28, fett: 36,
    zeit: "55 Min", schwierigkeit: "Mittel",
    bild: "🍆",
    tags: ["keto", "hackfleisch", "aubergine", "griechisch"],
    zutaten: ["2 Auberginen", "400 g Lammhack", "1 Dose Tomaten", "3 Eier", "200 ml Sahne", "100 g Parmesan", "Zimt", "Knoblauch", "Olivenöl"],
    zubereitung: ["Auberginen in Scheiben braten.", "Hack mit Tomaten, Zimt und Knoblauch anbraten.", "Lagen in Auflaufform: Aubergine, Hack, Aubergine.", "Sahne mit Eiern und Parmesan mischen, drüber.", "45 Min bei 180 °C backen."],
  },
  {
    id: "pute-zucchini-noodle",
    name: "Pute mit Zitronen-Kräuter-Zoodles",
    kategorie: "Abendessen",
    kcal: 390, kh: 5, eiweiss: 34, fett: 26,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍝",
    tags: ["keto", "pute", "zucchini", "zitrone"],
    zutaten: ["300 g Putenbrust", "3 Zucchini (Zoodles)", "3 EL Olivenöl", "Knoblauch", "Zitronenabrieb", "frische Kräuter (Thymian, Petersilie)", "Parmesan", "Salz, Pfeffer"],
    zubereitung: ["Pute in Streifen braten.", "Knoblauch und Zoodles kurz anbraten (2 Min).", "Pute dazu.", "Mit Zitrone, Kräutern würzen.", "Parmesan drüber servieren."],
  },
  {
    id: "keto-rouladen",
    name: "Keto-Rinderrouladen",
    kategorie: "Abendessen",
    kcal: 490, kh: 3, eiweiss: 38, fett: 36,
    zeit: "90 Min", schwierigkeit: "Aufwendig",
    bild: "🥩",
    tags: ["keto", "rindfleisch", "rouladen", "klassisch"],
    zutaten: ["4 Rinderrouladen", "Senf", "100 g Speck", "2 Gewürzgurken", "1 Zwiebel", "400 ml Brühe", "Butter", "Salz, Pfeffer", "Lorbeer"],
    zubereitung: ["Rouladen mit Senf bestreichen, Speck, Gurke und Zwiebel drauf.", "Fest aufrollen und fixieren.", "In Butter von allen Seiten anbraten.", "Mit Brühe und Lorbeer aufgießen.", "75 Min bei 160 °C schmoren."],
  },
  {
    id: "heilbutt-ratatouille",
    name: "Heilbutt auf Keto-Ratatouille",
    kategorie: "Abendessen",
    kcal: 420, kh: 7, eiweiss: 30, fett: 30,
    zeit: "30 Min", schwierigkeit: "Mittel",
    bild: "🐟",
    tags: ["keto", "fisch", "gemüse", "ratatouille"],
    zutaten: ["2 Heilbuttfilets", "1 Zucchini", "1 Aubergine", "1 Paprika", "Tomaten", "Knoblauch", "Olivenöl", "Thymian", "Rosmarin", "Salz, Pfeffer"],
    zubereitung: ["Gemüse würfeln und in Olivenöl mit Kräutern 15 Min schmoren.", "Heilbutt würzen, in Butter 3 Min je Seite braten.", "Auf Ratatouille anrichten."],
  },
  {
    id: "keto-ossobuco",
    name: "Keto Ossobuco",
    kategorie: "Abendessen",
    kcal: 510, kh: 5, eiweiss: 36, fett: 38,
    zeit: "120 Min", schwierigkeit: "Aufwendig",
    bild: "🍖",
    tags: ["keto", "kalb", "festlich", "geschmort"],
    zutaten: ["4 Kalbshaxenscheiben", "400 ml Brühe", "1 Dose Tomaten", "1 Zwiebel", "Karotte", "Sellerie", "Olivenöl", "Rosmarin", "Lorbeer", "Zitronenabrieb", "Petersilie"],
    zubereitung: ["Fleisch würzen, in Öl anbraten.", "Gemüse anbraten.", "Tomaten und Brühe dazu.", "2 Stunden bei 160 °C schmoren.", "Gremolata aus Zitrone und Petersilie drüber."],
  },
  {
    id: "haehnchen-pesto-ofen",
    name: "Hähnchen-Pesto-Päckchen aus dem Ofen",
    kategorie: "Abendessen",
    kcal: 460, kh: 3, eiweiss: 38, fett: 33,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "hähnchen", "pesto", "ofen"],
    zutaten: ["4 Hähnchenbrüste", "4 EL Basilikum-Pesto", "125 g Mozzarella", "Cherrytomaten", "Olivenöl", "Salz, Pfeffer"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Hähnchen in Backpapier einwickeln.", "Je 1 EL Pesto, Mozzarella und Tomaten dazu.", "Päckchen verschließen.", "28 Min backen."],
  },
  {
    id: "schweinehals-chimichurri",
    name: "Schweinehals mit Chimichurri",
    kategorie: "Abendessen",
    kcal: 500, kh: 2, eiweiss: 32, fett: 40,
    zeit: "30 Min", schwierigkeit: "Einfach",
    bild: "🥩",
    tags: ["keto", "schwein", "grill", "argentinisch"],
    zutaten: ["500 g Schweinehalssteaks", "1 Bund Petersilie", "4 EL Olivenöl", "2 EL Rotweinessig", "Knoblauch", "Chiliflocken", "Oregano", "Salz, Pfeffer"],
    zubereitung: ["Petersilie, Knoblauch, Öl, Essig und Gewürze zu Chimichurri mixen.", "Steaks kräftig würzen.", "Je 4 Min je Seite grillen oder braten.", "Mit Chimichurri servieren."],
  },
  {
    id: "forelle-mandel",
    name: "Forelle in Mandelbutter",
    kategorie: "Abendessen",
    kcal: 450, kh: 2, eiweiss: 36, fett: 34,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "forelle", "fisch", "mandeln"],
    zutaten: ["2 Forellen (küchenfertig)", "40 g Mandelblättchen", "3 EL Butter", "Zitronensaft", "Knoblauch", "frischer Thymian", "Salz, Pfeffer"],
    zubereitung: ["Forellen innen und außen würzen.", "In Butter von beiden Seiten je 5 Min braten.", "Mandelblättchen im gleichen Fett goldbraun rösten.", "Mit Zitrone und Thymian über Forelle geben."],
  },
  {
    id: "keto-kohlrabi-auflauf",
    name: "Kohlrabi-Schinken-Gratin",
    kategorie: "Abendessen",
    kcal: 380, kh: 6, eiweiss: 20, fett: 30,
    zeit: "45 Min", schwierigkeit: "Einfach",
    bild: "🥬",
    tags: ["keto", "kohlrabi", "schinken", "gratin"],
    zutaten: ["3 Kohlrabi", "200 g Kochschinken", "200 ml Sahne", "100 g Emmentaler gerieben", "Butter", "Muskat", "Salz, Pfeffer"],
    zubereitung: ["Kohlrabi schälen und in Scheiben schneiden.", "5 Min blanchieren.", "Mit Schinken in gebutterte Form schichten.", "Sahne und Käse drüber.", "35 Min bei 180 °C backen."],
  },
  {
    id: "wildschwein-ragout",
    name: "Wildschwein-Ragout mit Rotkohl",
    kategorie: "Abendessen",
    kcal: 530, kh: 7, eiweiss: 38, fett: 38,
    zeit: "120 Min", schwierigkeit: "Aufwendig",
    bild: "🍖",
    tags: ["keto", "wild", "wildschwein", "herbst"],
    zutaten: ["600 g Wildschweinschulter", "300 ml Rotwein", "300 ml Brühe", "Rotkohl", "Wacholderbeeren", "Lorbeer", "Thymian", "Zwiebeln", "Butter"],
    zubereitung: ["Fleisch würfeln, anbraten.", "Zwiebeln dazu.", "Mit Wein ablöschen, Brühe und Gewürze dazu.", "90 Min schmoren.", "Rotkohl separat mit Butter garen.", "Servieren."],
  },
  {
    id: "kabeljau-tomaten-oliven",
    name: "Kabeljau mit Tomaten und Oliven",
    kategorie: "Abendessen",
    kcal: 380, kh: 6, eiweiss: 30, fett: 26,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "kabeljau", "fisch", "mediterran"],
    zutaten: ["4 Kabeljaufilets", "250 g Cherrytomaten", "80 g Oliven", "Kapern", "Knoblauch", "Olivenöl", "Basilikum", "Salz, Pfeffer"],
    zubereitung: ["Tomaten, Oliven, Kapern und Knoblauch in Öl anbraten.", "Kabeljau würzen, auf Gemüse legen.", "Mit Deckel bei mittlerer Hitze 10 Min garen.", "Mit Basilikum servieren."],
  },
  {
    id: "hähnchenkeule-ratatouille",
    name: "Hähnchenkeulen auf Provençal-Gemüse",
    kategorie: "Abendessen",
    kcal: 510, kh: 7, eiweiss: 36, fett: 37,
    zeit: "60 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "hähnchen", "ofen", "provençal"],
    zutaten: ["4 Hähnchenkeulen", "1 Zucchini", "1 Paprika", "Cherrytomaten", "Knoblauch", "Olivenöl", "Herbes de Provence", "Salz, Pfeffer"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Gemüse grob würfeln, in Auflaufform.", "Hähnchenkeulen würzen und draufsetzen.", "Mit Olivenöl beträufeln.", "55 Min backen bis Haut knusprig."],
  },
  {
    id: "rindfleisch-wok",
    name: "Asia-Rindfleisch-Wok",
    kategorie: "Abendessen",
    kcal: 440, kh: 6, eiweiss: 34, fett: 30,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥢",
    tags: ["keto", "rindfleisch", "wok", "asia"],
    zutaten: ["400 g Rindfleisch in Streifen", "Brokkoli", "Paprika", "Frühlingszwiebeln", "Knoblauch", "Ingwer", "Sojasoße (glutenfrei)", "Sesamöl", "Chiliflocken", "Sesam"],
    zubereitung: ["Öl im Wok stark erhitzen.", "Fleisch portionsweise scharf anbraten.", "Gemüse dazu, kurz mitbraten.", "Knoblauch, Ingwer und Sojasoße dazu.", "Mit Sesamöl und Sesam abschmecken."],
  },

  // ─── NEU: SNACKS ──────────────────────────────────────────────────────────────
  {
    id: "parmesan-crisps",
    name: "Parmesan-Crisps",
    kategorie: "Snack",
    kcal: 140, kh: 0, eiweiss: 12, fett: 10,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🧀",
    tags: ["keto", "knusprig", "käse", "vegan"],
    zutaten: ["80 g Parmesan frisch gerieben", "Rosmarin oder Chiliflocken optional"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Parmesan in kleinen Häufchen auf Backpapier setzen.", "5–7 Min backen bis goldbraun.", "Auskühlen lassen — werden knusprig beim Abkühlen."],
  },
  {
    id: "avocado-limetten-dip",
    name: "Avocado-Limetten-Dip mit Gemüsesticks",
    kategorie: "Snack",
    kcal: 200, kh: 5, eiweiss: 3, fett: 18,
    zeit: "8 Min", schwierigkeit: "Einfach",
    bild: "🥑",
    tags: ["keto", "vegan", "dip", "rohkost"],
    zutaten: ["1 Avocado", "Saft 1 Limette", "Knoblauchpulver", "Salz", "Chiliflocken", "Sellerie", "Paprika", "Gurke"],
    zubereitung: ["Avocado zerdrücken.", "Mit Limette, Knoblauch, Salz und Chili würzen.", "Gemüse in Sticks schneiden.", "Dip mit Gemüse servieren."],
  },
  {
    id: "speck-käse-rolle",
    name: "Speck-Käse-Röllchen",
    kategorie: "Snack",
    kcal: 220, kh: 1, eiweiss: 14, fett: 18,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🌯",
    tags: ["keto", "speck", "käse", "schnell"],
    zutaten: ["6 Scheiben Bacon", "6 Scheiben Gouda", "Senf optional"],
    zubereitung: ["Je eine Käsescheibe auf Bacon legen.", "Optional etwas Senf drauf.", "Fest aufrollen.", "Sofort essen oder kurz in Pfanne anbraten."],
  },
  {
    id: "keto-nuss-energie-kugeln",
    name: "Keto-Energie-Kugeln",
    kategorie: "Snack",
    kcal: 180, kh: 3, eiweiss: 6, fett: 16,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "⚡",
    tags: ["keto", "snack", "meal-prep", "nüsse"],
    zutaten: ["100 g Mandelmus", "40 g Kokosraspeln", "2 EL Kakaopulver", "Stevia", "Prise Salz", "optional: Chiasamen"],
    zubereitung: ["Alle Zutaten gut vermengen.", "Wenn zu weich: 15 Min in Kühlschrank.", "Kleine Kugeln formen.", "In Kokosraspeln wälzen.", "Hält 1 Woche im Kühlschrank."],
  },
  {
    id: "geraeuscherte-mandeln",
    name: "Geröstete Gewürzmandeln",
    kategorie: "Snack",
    kcal: 190, kh: 4, eiweiss: 6, fett: 17,
    zeit: "12 Min", schwierigkeit: "Einfach",
    bild: "🌰",
    tags: ["keto", "vegan", "nüsse", "meal-prep"],
    zutaten: ["150 g Mandeln", "1 EL Olivenöl", "1 TL Paprikapulver", "Prise Cayennepfeffer", "1 TL Rosmarin getrocknet", "Meersalz"],
    zubereitung: ["Ofen auf 180 °C vorheizen.", "Mandeln mit Öl und Gewürzen mischen.", "Auf Backblech verteilen.", "10 Min rösten, dabei einmal wenden.", "Abkühlen lassen."],
  },
  {
    id: "cottage-cheese-beeren",
    name: "Hüttenkäse mit Beeren & Nüssen",
    kategorie: "Snack",
    kcal: 170, kh: 6, eiweiss: 14, fett: 8,
    zeit: "3 Min", schwierigkeit: "Einfach",
    bild: "🫙",
    tags: ["keto", "schnell", "eiweiß", "beeren"],
    zutaten: ["150 g Hüttenkäse", "50 g Himbeeren", "20 g Walnüsse", "Stevia", "Vanille", "Zimt"],
    zubereitung: ["Hüttenkäse mit Stevia und Vanille verrühren.", "Beeren und Walnüsse drauf.", "Mit Zimt bestreuen."],
  },
  {
    id: "gurken-thunfisch-happen",
    name: "Gurken-Thunfisch-Häppchen",
    kategorie: "Snack",
    kcal: 120, kh: 2, eiweiss: 14, fett: 6,
    zeit: "8 Min", schwierigkeit: "Einfach",
    bild: "🥒",
    tags: ["keto", "fisch", "thunfisch", "schnell"],
    zutaten: ["1 Gurke", "1 Dose Thunfisch", "2 EL Mayo", "Kapern", "Dill", "Zitronensaft", "Salz, Pfeffer"],
    zubereitung: ["Gurke in dicke Scheiben schneiden.", "Thunfisch mit Mayo, Kapern und Dill mischen.", "Je 1 TL auf Gurkenscheiben setzen.", "Mit Dill garnieren."],
  },
  {
    id: "keto-brownies",
    name: "Keto-Brownies (Mandelmehl)",
    kategorie: "Snack",
    kcal: 210, kh: 4, eiweiss: 6, fett: 19,
    zeit: "30 Min", schwierigkeit: "Mittel",
    bild: "🍫",
    tags: ["keto", "süß", "schokolade", "backen"],
    zutaten: ["100 g dunkle Schokolade 85%", "80 g Butter", "3 Eier", "60 g Mandelmehl", "Stevia", "Prise Salz", "Vanille"],
    zubereitung: ["Schokolade und Butter schmelzen.", "Eier einrühren.", "Mandelmehl, Stevia, Salz und Vanille dazu.", "In gefettete Form füllen.", "25 Min bei 170 °C backen.", "Vollständig abkühlen lassen."],
  },
  {
    id: "prosciutto-melone-keto",
    name: "Prosciutto mit Melone (Keto-Portion)",
    kategorie: "Snack",
    kcal: 150, kh: 5, eiweiss: 10, fett: 9,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🍈",
    tags: ["keto", "schinken", "schnell", "sommer"],
    zutaten: ["6 Scheiben Prosciutto", "100 g Cantaloupe-Melone (kleine Portion)", "frische Minze", "schwarzer Pfeffer"],
    zubereitung: ["Melone in kleine Stücke schneiden.", "Prosciutto locker um Melone wickeln.", "Mit Minze und Pfeffer garnieren."],
  },
  {
    id: "keto-kaese-cracker",
    name: "Keto-Käse-Cracker",
    kategorie: "Snack",
    kcal: 160, kh: 2, eiweiss: 8, fett: 13,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍪",
    tags: ["keto", "cracker", "käse", "knusprig"],
    zutaten: ["80 g Mandelmehl", "60 g geriebener Cheddar", "1 Ei", "Rosmarinnadeln", "Salz", "Prise Cayenne"],
    zubereitung: ["Alle Zutaten zu Teig kneten.", "Dünn ausrollen zwischen Backpapier.", "In Cracker-Größe schneiden.", "Bei 180 °C 12–15 Min backen.", "Auskühlen — werden knusprig."],
  },

  // ─── KETO-KLASSIKER ──────────────────────────────────────────────────────────
  {
    id: "klassiker-kartoffelsalat",
    name: "Keto-Kartoffelsalat (Blumenkohl)",
    kategorie: "Salat",
    kcal: 280, kh: 7, eiweiss: 9, fett: 22,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["klassiker", "keto", "blumenkohl", "salat"],
    zutaten: ["1 kleiner Blumenkohl", "4 Scheiben Speck", "3 EL Mayonnaise", "1 EL Senf", "2 EL Apfelessig", "1 TL Zwiebelpulver", "Schnittlauch", "Salz, Pfeffer"],
    zubereitung: ["Blumenkohl in kleine Röschen teilen und in Salzwasser 8 Min bissfest garen.", "Speck knusprig braten und klein hacken.", "Abgetropften Blumenkohl etwas abkühlen lassen.", "Mayo, Senf, Essig, Zwiebelpulver verrühren.", "Alles mischen, mit Schnittlauch garnieren.", "Mindestens 30 Min ziehen lassen."],
  },
  {
    id: "klassiker-lasagne",
    name: "Keto-Lasagne (Zucchini-Platten)",
    kategorie: "Abendessen",
    kcal: 420, kh: 9, eiweiss: 32, fett: 28,
    zeit: "50 Min", schwierigkeit: "Mittel",
    bild: "🫕",
    tags: ["klassiker", "keto", "lasagne", "zucchini"],
    zutaten: ["2 große Zucchini", "400 g Rinderhackfleisch", "1 Dose Tomaten (400g)", "200 g Ricotta", "150 g Mozzarella", "50 g Parmesan", "1 Zwiebel", "2 Knoblauchzehen", "Oregano", "Salz, Pfeffer", "Olivenöl"],
    zubereitung: ["Zucchini längs in 3–4 mm dünne Scheiben schneiden, salzen, 10 Min ziehen lassen, trocken tupfen.", "Hackfleisch mit Zwiebel und Knoblauch anbraten.", "Tomaten dazugeben, würzen, 15 Min einköcheln.", "Auflaufform schichten: Hacksoße – Zucchini – Ricotta – wiederholen.", "Mit Mozzarella und Parmesan abschließen.", "Bei 180 °C 30 Min backen."],
  },
  {
    id: "klassiker-pizza",
    name: "Keto-Pizza (Blumenkohl-Boden)",
    kategorie: "Abendessen",
    kcal: 380, kh: 8, eiweiss: 28, fett: 26,
    zeit: "45 Min", schwierigkeit: "Mittel",
    bild: "🍕",
    tags: ["klassiker", "keto", "pizza", "blumenkohl"],
    zutaten: ["1 mittelgroßer Blumenkohl", "2 Eier", "100 g Mozzarella gerieben", "50 g Parmesan", "Oregano", "Salz", "Tomatenmark", "Belag nach Wahl (Schinken, Paprika, Oliven)"],
    zubereitung: ["Blumenkohl roh im Mixer fein hacken.", "5 Min in Mikrowelle garen, in Küchentuch ausdrücken — sehr trocken machen!", "Mit Eiern, Mozzarella, Parmesan, Oregano, Salz mischen.", "Dünn auf Backpapier ausstreichen.", "Bei 220 °C 15 Min vorbacken.", "Belag drauf, weitere 10 Min backen."],
  },
  {
    id: "klassiker-nudeln",
    name: "Keto-Nudeln (Zucchini-Spaghetti)",
    kategorie: "Mittagessen",
    kcal: 320, kh: 8, eiweiss: 26, fett: 20,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍝",
    tags: ["klassiker", "keto", "nudeln", "zucchini"],
    zutaten: ["2 Zucchini", "200 g Hackfleisch", "1 Dose Tomaten", "2 Knoblauchzehen", "1 EL Olivenöl", "Basilikum", "Parmesan", "Salz, Pfeffer"],
    zubereitung: ["Zucchini mit Spiralschneider oder Sparschäler in Spaghetti-Form schneiden.", "Hackfleisch mit Knoblauch anbraten.", "Tomaten dazugeben, 10 Min einkochen, würzen.", "Zucchini-Spaghetti 2–3 Min in der Pfanne schwenken (nicht zu lang!).", "Mit Soße anrichten, Parmesan drüber."],
  },
  {
    id: "klassiker-burger",
    name: "Keto-Burger (Salatblatt-Bun)",
    kategorie: "Mittagessen",
    kcal: 520, kh: 5, eiweiss: 38, fett: 38,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍔",
    tags: ["klassiker", "keto", "burger", "schnell"],
    zutaten: ["200 g Rinderhackfleisch (20% Fett)", "2 große Romana-Salatblätter", "2 Scheiben Cheddar", "2 Scheiben Bacon", "Tomate", "Rote Zwiebel", "Gurke", "Senf, Mayo"],
    zubereitung: ["Hackfleisch mit Salz und Pfeffer würzen, zu Patty formen.", "Bacon knusprig braten, beiseite legen.", "Patty 3–4 Min je Seite braten.", "Käse drauflegen, schmelzen lassen.", "Salatblatt als Bun verwenden, alles schichten."],
  },
  {
    id: "klassiker-reis",
    name: "Blumenkohl-Reis",
    kategorie: "Mittagessen",
    kcal: 120, kh: 5, eiweiss: 5, fett: 7,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🍚",
    tags: ["klassiker", "keto", "reis", "blumenkohl", "beilage"],
    zutaten: ["1 Blumenkohl", "2 EL Butter oder Ghee", "Salz, Pfeffer", "optional: Knoblauch, Kräuter"],
    zubereitung: ["Blumenkohl in Röschen teilen und roh im Mixer oder mit Reibe zu reiskorngroßen Stücken verarbeiten.", "Butter in großer Pfanne erhitzen.", "Blumenkohlreis bei mittlerer Hitze 5–7 Min unter Rühren anbraten.", "Würzen — fertig!", "Passt zu Curry, Fleisch oder als Basis für Bowls."],
  },
  {
    id: "klassiker-pommes",
    name: "Keto-Pommes (Knollensellerie)",
    kategorie: "Snack",
    kcal: 190, kh: 8, eiweiss: 4, fett: 14,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🍟",
    tags: ["klassiker", "keto", "pommes", "sellerie"],
    zutaten: ["400 g Knollensellerie", "2 EL Olivenöl", "Salz", "Paprikapulver", "Knoblauchpulver", "optional: Parmesan"],
    zubereitung: ["Sellerie schälen und in Pommes-Form schneiden.", "Mit Öl und Gewürzen vermengen.", "Auf Backpapier verteilen — nicht übereinander!", "Bei 200 °C (Umluft) 25–30 Min backen, halbzeit wenden.", "Optional: die letzten 5 Min Parmesan drüber."],
  },
  {
    id: "klassiker-gulasch",
    name: "Keto-Gulasch",
    kategorie: "Abendessen",
    kcal: 450, kh: 8, eiweiss: 38, fett: 28,
    zeit: "90 Min", schwierigkeit: "Mittel",
    bild: "🍲",
    tags: ["klassiker", "keto", "gulasch", "rind"],
    zutaten: ["600 g Rindergulasch", "2 Zwiebeln", "2 Paprika (rot)", "2 EL Tomatenmark", "200 ml Rinderbrühe", "2 TL Paprikapulver edelsüß", "1 TL Paprikapulver scharf", "Kümmel", "Knoblauch", "Schmalz oder Butterschmalz"],
    zubereitung: ["Fleisch trocken tupfen, in Schmalz scharf anbraten, beiseite stellen.", "Zwiebeln und Knoblauch glasig dünsten.", "Paprikapulver kurz mitrösten.", "Fleisch zurück, Tomatenmark und Brühe dazu.", "Bei kleiner Hitze 60–75 Min schmoren bis zart.", "Mit Blumenkohlreis oder Zucchini-Nudeln servieren."],
  },
  {
    id: "klassiker-kaesekuchen",
    name: "Keto-Käsekuchen",
    kategorie: "Dessert",
    kcal: 290, kh: 5, eiweiss: 12, fett: 24,
    zeit: "60 Min + Kühlzeit", schwierigkeit: "Mittel",
    bild: "🍰",
    tags: ["klassiker", "keto", "käsekuchen", "dessert", "backen"],
    zutaten: ["500 g Magerquark", "200 g Frischkäse", "3 Eier", "100 g Erythrit", "1 TL Vanilleextrakt", "Zitronenschale", "Für den Boden: 150 g Mandelmehl, 50 g Butter, 1 EL Erythrit"],
    zubereitung: ["Boden: Mandelmehl, Butter, Erythrit kneten, in Form drücken.", "Quark, Frischkäse, Eier, Erythrit, Vanille und Zitronenschale glatt rühren.", "Masse auf Boden geben.", "Bei 160 °C (Ober-/Unterhitze) 45–50 Min backen.", "Im Ofen abkühlen lassen — nicht rausnehmen!", "Mindestens 4 h kühlen."],
  },
  {
    id: "klassiker-schnitzel",
    name: "Keto-Schnitzel (Mandelpanade)",
    kategorie: "Abendessen",
    kcal: 480, kh: 4, eiweiss: 42, fett: 32,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍖",
    tags: ["klassiker", "keto", "schnitzel", "hähnchen"],
    zutaten: ["2 Hähnchenbrust oder Schweineschnitzel", "80 g Mandelmehl", "2 Eier", "50 g Parmesan gerieben", "Salz, Pfeffer", "Paprikapulver", "Butterschmalz zum Braten"],
    zubereitung: ["Fleisch dünn klopfen, salzen und pfeffern.", "Eier verquirlen.", "Mandelmehl mit Parmesan und Paprika mischen.", "Fleisch durch Ei ziehen, dann in Mandel-Parmesan-Mischung wenden.", "In Butterschmalz bei mittlerer Hitze 3–4 Min je Seite goldbraun braten."],
  },
  {
    id: "klassiker-suppe",
    name: "Keto-Tomatensuppe",
    kategorie: "Mittagessen",
    kcal: 220, kh: 9, eiweiss: 6, fett: 16,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍅",
    tags: ["klassiker", "keto", "suppe", "tomate"],
    zutaten: ["800 g Tomaten (oder 2 Dosen)", "1 Zwiebel", "3 Knoblauchzehen", "200 ml Sahne", "2 EL Butter", "Basilikum", "Salz, Pfeffer", "Prise Zucker (Erythrit)"],
    zubereitung: ["Zwiebel und Knoblauch in Butter anschwitzen.", "Tomaten dazugeben, 15 Min köcheln.", "Mit Stabmixer pürieren.", "Sahne einrühren, abschmecken.", "Mit frischem Basilikum servieren."],
  },
  {
    id: "klassiker-coleslaw",
    name: "Keto-Coleslaw",
    kategorie: "Salat",
    kcal: 160, kh: 6, eiweiss: 3, fett: 13,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥬",
    tags: ["klassiker", "keto", "coleslaw", "beilage"],
    zutaten: ["400 g Weißkohl", "2 Möhren", "4 EL Mayonnaise", "1 EL Apfelessig", "1 TL Senf", "Salz, Pfeffer", "Stevia nach Geschmack"],
    zubereitung: ["Weißkohl fein hobeln oder schneiden.", "Möhren grob raspeln.", "Mayo, Essig, Senf, Salz, Stevia zur Soße verrühren.", "Alles vermischen.", "Mindestens 30 Min ziehen lassen — wird besser je länger."],
  },
  {
    id: "klassiker-pfannkuchen",
    name: "Keto-Pfannkuchen",
    kategorie: "Frühstück",
    kcal: 310, kh: 4, eiweiss: 18, fett: 24,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥞",
    tags: ["klassiker", "keto", "pfannkuchen", "frühstück"],
    zutaten: ["3 Eier", "100 g Frischkäse", "1 EL Kokosmehl", "Prise Salz", "Butter zum Braten", "Beeren + Sahne zum Servieren"],
    zubereitung: ["Eier und Frischkäse glatt mixen.", "Kokosmehl und Salz einrühren.", "Butter in Pfanne bei mittlerer Hitze erhitzen.", "Kleine Pfannkuchen portionsweise backen, 2 Min je Seite.", "Mit Beeren und Schlagsahne servieren."],
  },
  {
    id: "klassiker-nudelauflauf",
    name: "Keto-Nudelauflauf (Konjak)",
    kategorie: "Abendessen",
    kcal: 390, kh: 6, eiweiss: 30, fett: 26,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🫙",
    tags: ["klassiker", "keto", "auflauf", "konjak"],
    zutaten: ["200 g Konjak-Nudeln (Shirataki)", "300 g Hackfleisch", "1 Paprika", "200 ml Sahne", "150 g geriebener Käse", "1 Dose Tomaten", "Knoblauch", "Oregano", "Salz, Pfeffer"],
    zubereitung: ["Konjak-Nudeln abspülen, trocken braten bis das Wasser verdampft.", "Hackfleisch mit Knoblauch und Paprika anbraten.", "Tomaten und Sahne dazugeben, würzen.", "Nudeln untermischen.", "In Auflaufform füllen, Käse drüber.", "Bei 200 °C 15–20 Min überbacken."],
  },
  {
    id: "klassiker-reibekuchen",
    name: "Keto-Reibekuchen (Zucchini)",
    kategorie: "Snack",
    kcal: 240, kh: 5, eiweiss: 12, fett: 18,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥞",
    tags: ["klassiker", "keto", "reibekuchen", "zucchini"],
    zutaten: ["2 Zucchini", "2 Eier", "50 g Parmesan gerieben", "2 EL Mandelmehl", "Knoblauch", "Salz", "Öl zum Braten", "Sauerrahm zum Servieren"],
    zubereitung: ["Zucchini grob raspeln, salzen, 10 Min ziehen lassen, gut ausdrücken.", "Mit Eiern, Parmesan, Mandelmehl und Knoblauch vermischen.", "Kleine Fladen in Öl bei mittlerer Hitze 3 Min je Seite braten.", "Mit Sauerrahm servieren."],
  },
  {
    id: "klassiker-geschnetzeltes",
    name: "Züricher Geschnetzeltes (Keto)",
    kategorie: "Abendessen",
    kcal: 460, kh: 5, eiweiss: 36, fett: 32,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["klassiker", "keto", "geschnetzeltes", "hähnchen"],
    zutaten: ["400 g Hähnchenbrust", "200 g Champignons", "200 ml Sahne", "100 ml Hühnerbrühe", "1 Zwiebel", "2 EL Butter", "Thymian", "Salz, Pfeffer", "Zitronensaft"],
    zubereitung: ["Hähnchen in dünne Streifen schneiden.", "In Butter scharf anbraten, beiseite stellen.", "Zwiebeln und Champignons anbraten.", "Brühe ablöschen, Sahne dazu, einkochen lassen.", "Hähnchen zurück, mit Thymian und Zitrone würzen.", "Mit Blumenkohlreis servieren."],
  },
  {
    id: "klassiker-mozzarellasticks",
    name: "Keto-Mozzarella-Sticks",
    kategorie: "Snack",
    kcal: 320, kh: 3, eiweiss: 22, fett: 24,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🧀",
    tags: ["klassiker", "keto", "mozzarella", "snack", "fingerfood"],
    zutaten: ["2 Mozzarella-Kugeln", "2 Eier", "60 g Mandelmehl", "30 g Parmesan gerieben", "Paprika, Knoblauchpulver", "Öl zum Braten"],
    zubereitung: ["Mozzarella in Sticks schneiden, kurz einfrieren (15 Min).", "Eier verquirlen.", "Mandelmehl mit Parmesan und Gewürzen mischen.", "Sticks durch Ei, dann Panade — zweimal wiederholen.", "In Öl bei mittlerer Hitze goldbraun braten."],
  },
  {
    id: "klassiker-shakshuka",
    name: "Shakshuka (Keto)",
    kategorie: "Frühstück",
    kcal: 320, kh: 9, eiweiss: 18, fett: 22,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["klassiker", "keto", "shakshuka", "eier"],
    zutaten: ["4 Eier", "1 Dose Tomaten", "1 Paprika", "1 Zwiebel", "2 Knoblauchzehen", "1 TL Kreuzkümmel", "1 TL Paprikapulver", "Chiliflocken", "Olivenöl", "Feta zum Garnieren"],
    zubereitung: ["Zwiebel, Knoblauch und Paprika in Olivenöl anbraten.", "Gewürze dazugeben, kurz rösten.", "Tomaten dazu, 10 Min einköcheln.", "Mulden formen, Eier hineingeben.", "Zugedeckt 5–7 Min pochieren.", "Mit Feta und frischen Kräutern servieren."],
  },
  {
    id: "klassiker-brokkolicreme",
    name: "Brokkoli-Creme-Suppe",
    kategorie: "Mittagessen",
    kcal: 250, kh: 7, eiweiss: 10, fett: 18,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🥦",
    tags: ["klassiker", "keto", "suppe", "brokkoli"],
    zutaten: ["1 Brokkoli", "1 Zwiebel", "2 Knoblauchzehen", "400 ml Gemüsebrühe", "150 ml Sahne", "50 g Cheddar gerieben", "Muskat", "Butter", "Salz, Pfeffer"],
    zubereitung: ["Zwiebel und Knoblauch in Butter anschwitzen.", "Brokkoli in Röschen dazu, kurz mitbraten.", "Brühe auffüllen, 10 Min köcheln.", "Pürieren, Sahne und Käse einrühren.", "Mit Muskat abschmecken."],
  },
  {
    id: "klassiker-tiramisu",
    name: "Keto-Tiramisu",
    kategorie: "Dessert",
    kcal: 340, kh: 5, eiweiss: 10, fett: 30,
    zeit: "30 Min + 4h Kühlung", schwierigkeit: "Mittel",
    bild: "☕",
    tags: ["klassiker", "keto", "tiramisu", "dessert"],
    zutaten: ["250 g Mascarpone", "200 ml Schlagsahne", "3 EL Erythrit", "1 TL Vanilleextrakt", "200 ml starker Espresso (kalt)", "Kakaopulver", "Für die 'Löffelbiskuits': 100 g Mandelmehl, 2 Eier, 2 EL Erythrit"],
    zubereitung: ["Biskuit: Eier mit Erythrit schaumig schlagen, Mandelmehl falten, auf Backpapier streichen, bei 160 °C 12 Min backen.", "Sahne steif schlagen, mit Mascarpone, Erythrit und Vanille vermischen.", "Biskuitstreifen kurz in Espresso tauchen.", "Schichten: Biskuit – Creme – Biskuit – Creme.", "4 h kühlen, mit Kakao bestäuben."],
  },

  // ─── 💰 GÜNSTIGE REZEPTE ─────────────────────────────────────────────────
  {
    id: "guenstig-ruehrei-speck",
    name: "Speck-Rührei mit Käse",
    kategorie: "Frühstück",
    kcal: 430, kh: 1, eiweiss: 28, fett: 36,
    zeit: "8 Min", schwierigkeit: "Einfach",
    bild: "🥚",
    tags: ["günstig", "keto", "eier", "speck"],
    zutaten: ["4 Eier (~0,80 €)", "100 g Speck (~0,75 €)", "40 g Gouda gerieben (~0,30 €)", "1 EL Butter", "Salz, Pfeffer", "Schnittlauch"],
    zubereitung: ["Speck in der Pfanne knusprig braten, beiseitelegen.", "Eier mit Salz und Pfeffer verquirlen.", "Im Speckfett bei niedriger Hitze langsam rühren bis cremig.", "Käse unterrühren, mit Speck und Schnittlauch servieren."],
  },
  {
    id: "guenstig-hack-zucchini-pfanne",
    name: "Hack-Zucchini-Pfanne",
    kategorie: "Mittagessen",
    kcal: 440, kh: 6, eiweiss: 30, fett: 34,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🫑",
    tags: ["günstig", "keto", "hack", "schnell"],
    zutaten: ["300 g Rinderhack (~1,70 €)", "2 Zucchini (~0,80 €)", "1 Zwiebel (~0,15 €)", "2 Zehen Knoblauch", "1 EL Tomatenmark (~0,10 €)", "Paprikapulver, Salz, Pfeffer", "Olivenöl"],
    zubereitung: ["Zwiebel und Knoblauch in Öl anschwitzen.", "Hack krümelig braten, würzen.", "Zucchini in Würfel dazu, 5 Min mitbraten.", "Tomatenmark einrühren, abschmecken.", "Pro Portion ca. 1,40 € — unschlagbar günstig."],
  },
  {
    id: "guenstig-haehnchenschenkel-brokkoli",
    name: "Hähnchenschenkel mit Brokkoli",
    kategorie: "Abendessen",
    kcal: 520, kh: 7, eiweiss: 42, fett: 34,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["günstig", "keto", "hähnchen", "ofen"],
    zutaten: ["2 Hähnchenschenkel (~1,50 €)", "500 g Brokkoli tiefgekühlt (~0,80 €)", "3 EL Butter (~0,20 €)", "Knoblauch", "Paprikapulver", "Salz, Pfeffer"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Schenkel würzen, in Auflaufform.", "25–30 Min backen bis Haut knusprig.", "Brokkoli in Butter mit Knoblauch 5 Min braten.", "Mit Paprikapulver abschmecken.", "Kosten: ca. 1,30 € pro Person."],
  },
  {
    id: "guenstig-eierauflauf",
    name: "Käse-Ei-Auflauf",
    kategorie: "Abendessen",
    kcal: 380, kh: 3, eiweiss: 26, fett: 30,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["günstig", "keto", "eier", "ofen"],
    zutaten: ["6 Eier (~1,20 €)", "100 g Gouda gerieben (~0,75 €)", "100 g Speck gewürfelt (~0,75 €)", "100 ml Sahne (~0,30 €)", "Schnittlauch", "Salz, Pfeffer", "Butter für die Form"],
    zubereitung: ["Ofen auf 180 °C vorheizen.", "Auflaufform buttern.", "Speck auf dem Boden verteilen.", "Eier mit Sahne und Gewürzen verquirlen, drübergießen.", "Käse obendrauf.", "20 Min backen bis goldbraun.", "Ergibt 4 Portionen für ca. 0,75 € pro Stück."],
  },
  {
    id: "guenstig-thunfisch-eiersalat",
    name: "Thunfisch-Eiersalat",
    kategorie: "Mittagessen",
    kcal: 340, kh: 2, eiweiss: 30, fett: 24,
    zeit: "12 Min", schwierigkeit: "Einfach",
    bild: "🥗",
    tags: ["günstig", "keto", "thunfisch", "kalt"],
    zutaten: ["1 Dose Thunfisch in Öl (~0,89 €)", "3 Eier hartgekocht (~0,60 €)", "3 EL Mayonnaise (~0,20 €)", "½ Gurke (~0,25 €)", "Schnittlauch", "Senf", "Salz, Pfeffer"],
    zubereitung: ["Eier 8 Min kochen, schälen und grob hacken.", "Thunfisch abtropfen.", "Mit Mayo, Senf, Salz und Pfeffer verrühren.", "Gurke würfeln und unterrühren.", "Mit Schnittlauch servieren — fertig für ca. 1,00 € pro Person."],
  },
  {
    id: "guenstig-speck-spinat-pfanne",
    name: "Speck-Spinat-Pfanne mit Ei",
    kategorie: "Abendessen",
    kcal: 390, kh: 3, eiweiss: 24, fett: 32,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥬",
    tags: ["günstig", "keto", "speck", "spinat"],
    zutaten: ["150 g Speck (~1,10 €)", "300 g Spinat tiefgekühlt (~0,45 €)", "3 Eier (~0,60 €)", "1 Knoblauchzehe", "Muskatnuss", "Salz, Pfeffer"],
    zubereitung: ["Speck knusprig braten.", "Knoblauch kurz mitbraten.", "Gefrorenen Spinat dazugeben, auftauen und Wasser verdampfen.", "Mulden formen, Eier hineinschlagen.", "Zudecken, 4–5 Min pochieren.", "Für ca. 1,05 € pro Person — herzhaft und satt."],
  },
  {
    id: "guenstig-hackbällchen-sahnesauce",
    name: "Hackbällchen in Sahnesauce",
    kategorie: "Abendessen",
    kcal: 480, kh: 3, eiweiss: 30, fett: 38,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍖",
    tags: ["günstig", "keto", "hack", "sahne"],
    zutaten: ["400 g Rinderhack (~2,25 €)", "1 Ei (~0,20 €)", "200 ml Sahne (~0,60 €)", "1 Zwiebel (~0,15 €)", "Senf", "Salz, Pfeffer", "Butter", "Petersilie"],
    zubereitung: ["Hack mit Ei, Salz, Pfeffer und etwas Senf zu Bällchen formen.", "In Butter rundum anbraten.", "Zwiebel fein würfeln, kurz mitbraten.", "Sahne angießen, 10 Min einköcheln.", "Mit Petersilie servieren.", "Für 2 Personen ca. 1,60 € pro Teller."],
  },
  {
    id: "guenstig-haehnchen-brokkoli-auflauf",
    name: "Hähnchen-Brokkoli-Auflauf",
    kategorie: "Abendessen",
    kcal: 460, kh: 6, eiweiss: 44, fett: 28,
    zeit: "40 Min", schwierigkeit: "Einfach",
    bild: "🥦",
    tags: ["günstig", "keto", "hähnchen", "ofen"],
    zutaten: ["2 Hähnchenbrüste (~2,00 €)", "400 g Brokkoli tiefgekühlt (~0,65 €)", "200 ml Sahne (~0,60 €)", "80 g Gouda gerieben (~0,60 €)", "Knoblauch", "Kräuter nach Wahl", "Salz, Pfeffer"],
    zubereitung: ["Ofen auf 180 °C vorheizen.", "Hähnchen würfeln, Brokkoli auftauen.", "In Auflaufform schichten.", "Sahne mit Knoblauch und Kräutern verquirlen, drübergießen.", "Käse drüber.", "30 Min backen.", "4 Portionen für ca. 1,00 € pro Person."],
  },
  {
    id: "guenstig-makrele-krautsalat",
    name: "Makrele mit Krautsalat",
    kategorie: "Mittagessen",
    kcal: 410, kh: 5, eiweiss: 22, fett: 32,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["günstig", "keto", "fisch", "dose"],
    zutaten: ["1 Dose Makrele in Öl (~1,29 €)", "300 g Weißkohl (~0,45 €)", "2 EL Mayonnaise (~0,15 €)", "1 EL Apfelessig", "Salz, Pfeffer", "Kümmel optional"],
    zubereitung: ["Weißkohl fein hobeln oder reiben.", "Mit Mayo, Essig, Salz, Pfeffer und Kümmel mischen.", "15 Min ziehen lassen.", "Makrele drüber zerpflücken.", "Fertig — für unter 1,00 € pro Teller."],
  },
  {
    id: "guenstig-keto-eierpfannkuchen",
    name: "Ei-Pfannkuchen mit Frischkäse",
    kategorie: "Frühstück",
    kcal: 310, kh: 3, eiweiss: 20, fett: 24,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🫓",
    tags: ["günstig", "keto", "eier", "frühstück"],
    zutaten: ["3 Eier (~0,60 €)", "50 g Frischkäse (~0,30 €)", "1 EL Butter (~0,05 €)", "Salz", "optional: Schnittlauch oder Zimt"],
    zubereitung: ["Eier und Frischkäse cremig schlagen.", "Butter in Pfanne schmelzen.", "Teig portionsweise eingießen.", "Je 2 Min je Seite bei mittlerer Hitze backen.", "Mit Schnittlauch (herzhaft) oder Zimt (süß) servieren.", "Unter 0,50 € pro Person — unschlagbar."],
  },

  // ─── NEUE REZEPTE 2025 ───────────────────────────────────────────────────────
  {
    id: "bueffelmozzarella-speck",
    name: "Büffelmozzarella mit Rucola & Speck",
    kategorie: "Vorspeise" as any,
    kcal: 380, kh: 2, eiweiss: 22, fett: 32,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🧀",
    tags: ["keto", "käse", "schnell", "salat"],
    zutaten: ["200 g Büffelmozzarella", "80 g Rucola", "6 Scheiben Parmaschinken", "3 EL Olivenöl", "1 EL Balsamico (zuckerfrei)", "Schwarzer Pfeffer", "Pinienkerne"],
    zubereitung: ["Mozzarella in Scheiben schneiden.", "Rucola auf Teller anrichten.", "Mozzarella und Parmaschinken drauflegen.", "Pinienkerne kurz trocken rösten.", "Mit Olivenöl, Balsamico und Pfeffer würzen."],
  },
  {
    id: "keto-omelette-pilze-ziegenkase",
    name: "Pilz-Ziegenkäse-Omelett",
    kategorie: "Frühstück",
    kcal: 420, kh: 3, eiweiss: 26, fett: 34,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["keto", "eier", "pilze", "ziegenkäse", "vegetarisch"],
    zutaten: ["4 Eier", "100 g Champignons", "60 g Ziegenkäse", "2 EL Butter", "frischer Thymian", "Salz, Pfeffer", "Schnittlauch"],
    zubereitung: ["Champignons in Butter anbraten, würzen, beiseitelegen.", "Eier verquirlen, würzen.", "In frischer Butter stocken lassen.", "Pilze auf eine Hälfte, Ziegenkäse drüber.", "Zuklappen, mit Schnittlauch und Thymian servieren."],
  },
  {
    id: "lachsforelle-kraeuterbutter",
    name: "Lachsforelle mit Kräuterbutter",
    kategorie: "Abendessen",
    kcal: 440, kh: 1, eiweiss: 36, fett: 33,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "fisch", "forelle", "festlich"],
    zutaten: ["2 Lachsforellenfilets", "80 g Butter", "Knoblauch", "Zitronenabrieb", "frische Petersilie", "Dill", "Schnittlauch", "Salz, Pfeffer"],
    zubereitung: ["Butter mit Kräutern, Knoblauch und Zitronenabrieb vermengen.", "Filets würzen, in etwas Butter je 3 Min braten.", "Kräuterbutter auf heißen Filets schmelzen lassen.", "Mit Zitronenscheiben servieren."],
  },
  {
    id: "spinat-frischkäse-hühnchen",
    name: "Hähnchen mit Spinat-Frischkäse-Füllung",
    kategorie: "Abendessen",
    kcal: 460, kh: 4, eiweiss: 44, fett: 30,
    zeit: "35 Min", schwierigkeit: "Mittel",
    bild: "🍗",
    tags: ["keto", "hähnchen", "spinat", "frischkäse", "ofen"],
    zutaten: ["4 Hähnchenbrüste", "150 g Frischkäse", "100 g Babyspinat", "2 Knoblauchzehen", "50 g Parmesan", "Salz, Pfeffer", "Paprikapulver", "Olivenöl"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Spinat kurz zusammenfallen lassen, mit Frischkäse, Knoblauch und Parmesan mischen.", "Hähnchen seitlich einschneiden (Tasche), füllen.", "Außen würzen, mit Öl bestreichen.", "25 Min backen bis goldbraun."],
  },
  {
    id: "keto-egg-drop-suppe",
    name: "Keto Egg-Drop-Suppe",
    kategorie: "Mittagessen",
    kcal: 180, kh: 2, eiweiss: 14, fett: 13,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🥣",
    tags: ["keto", "suppe", "eier", "schnell", "asia"],
    zutaten: ["800 ml Hühnerbrühe", "3 Eier", "2 Frühlingszwiebeln", "1 TL Sesamöl", "1 TL Sojasoße (glutenfrei)", "Ingwer gerieben", "weißer Pfeffer"],
    zubereitung: ["Brühe mit Ingwer, Sojasoße und Sesamöl erhitzen.", "Eier in Tasse verquirlen.", "Brühe langsam rühren, Eier in dünnem Strahl eingießen — Fäden entstehen.", "Mit Frühlingszwiebeln und weißem Pfeffer servieren."],
  },
  {
    id: "rinderhack-paprikatopf",
    name: "Rinderhack-Paprika-Topf",
    kategorie: "Mittagessen",
    kcal: 430, kh: 8, eiweiss: 32, fett: 28,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🫕",
    tags: ["keto", "hack", "paprika", "one-pot"],
    zutaten: ["400 g Rinderhack", "2 Paprika (bunt)", "1 Dose Tomaten", "1 Zwiebel", "Knoblauch", "2 EL Olivenöl", "Kreuzkümmel", "Oregano", "Paprikapulver", "Salz, Pfeffer"],
    zubereitung: ["Zwiebel und Knoblauch in Öl anbraten.", "Hack krümelig braten.", "Paprika dazu, 3 Min mitbraten.", "Tomaten und Gewürze dazu.", "15 Min bei mittlerer Hitze köcheln."],
  },
  {
    id: "keto-hühnchen-marsala",
    name: "Hähnchen Marsala (Keto)",
    kategorie: "Abendessen",
    kcal: 490, kh: 4, eiweiss: 40, fett: 34,
    zeit: "30 Min", schwierigkeit: "Mittel",
    bild: "🍄",
    tags: ["keto", "hähnchen", "pilze", "sahne", "festlich"],
    zutaten: ["4 Hähnchenbrüste", "200 g Champignons", "150 ml trockener Marsala oder Rotwein", "150 ml Sahne", "Knoblauch", "3 EL Butter", "Thymian", "Salz, Pfeffer"],
    zubereitung: ["Hähnchen flach klopfen, würzen, in Butter goldbraun braten.", "Beiseitelegen.", "Pilze und Knoblauch anbraten.", "Mit Marsala ablöschen, kurz einkochen.", "Sahne dazu, Hähnchen zurück, 8 Min fertig garen."],
  },
  {
    id: "keto-mett-radieschen",
    name: "Frühstücksteller: Mett & Radieschen",
    kategorie: "Frühstück",
    kcal: 360, kh: 2, eiweiss: 22, fett: 30,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🥩",
    tags: ["keto", "mett", "schnell", "proteinreich"],
    zutaten: ["150 g frisches Mett", "1 Bund Radieschen", "½ rote Zwiebel", "Salatblätter", "Schnittlauch", "Salz, Pfeffer", "Paprikapulver"],
    zubereitung: ["Mett mit Zwiebeln, Salz und Paprika würzen.", "Salatblätter auf Teller anrichten.", "Mett draufgeben.", "Radieschen in Scheiben dazu.", "Mit Schnittlauch garnieren."],
  },
  {
    id: "keto-pulled-hühnchen",
    name: "Pulled Chicken (Low-Carb)",
    kategorie: "Mittagessen",
    kcal: 390, kh: 3, eiweiss: 46, fett: 21,
    zeit: "30 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "hähnchen", "meal-prep", "pulled"],
    zutaten: ["600 g Hähnchenbrustfilets", "2 EL Olivenöl", "Paprikapulver", "Knoblauchpulver", "Kreuzkümmel", "Chipotle-Gewürz", "Salz, Pfeffer", "200 ml Hühnerbrühe"],
    zubereitung: ["Hähnchen würzen, in Öl anbraten.", "Brühe angießen.", "Zugedeckt 20 Min gar köcheln.", "Aus Flüssigkeit nehmen, mit zwei Gabeln zupfen.", "Zurück in Sauce geben.", "Mit Salat, Avocado oder pur servieren."],
  },
  {
    id: "keto-matjesfilet-gurke",
    name: "Matjesfilet mit Gurkensalat",
    kategorie: "Mittagessen",
    kcal: 340, kh: 4, eiweiss: 20, fett: 26,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "fisch", "matjes", "schnell"],
    zutaten: ["4 Matjesfilets", "1 große Gurke", "1 rote Zwiebel", "150 g saure Sahne", "Dill", "Zitronensaft", "Salz, Pfeffer"],
    zubereitung: ["Gurke in dünne Scheiben hobeln.", "Zwiebel in Ringe schneiden.", "Saure Sahne mit Dill und Zitrone verrühren.", "Alles vermengen.", "Matjes drauflegen."],
  },
  {
    id: "paprika-hack-schiffchen",
    name: "Hackfleisch-Paprika-Schiffchen",
    kategorie: "Abendessen",
    kcal: 440, kh: 8, eiweiss: 30, fett: 30,
    zeit: "35 Min", schwierigkeit: "Einfach",
    bild: "🫑",
    tags: ["keto", "hack", "paprika", "ofen"],
    zutaten: ["4 Paprika (bunt, groß)", "400 g gemischtes Hack", "1 Zwiebel", "1 Dose Tomaten", "100 g Mozzarella gerieben", "Knoblauch", "Oregano", "Salz, Pfeffer"],
    zubereitung: ["Paprika halbieren, Kerne entfernen.", "Hack mit Zwiebeln, Tomaten und Gewürzen braten.", "In Paprikaschiffchen füllen.", "Mozzarella drüber.", "Bei 200 °C 20 Min backen."],
  },
  {
    id: "kokosmilch-blumenkohl-suppe",
    name: "Blumenkohl-Kokos-Suppe",
    kategorie: "Mittagessen",
    kcal: 290, kh: 8, eiweiss: 7, fett: 24,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🥥",
    tags: ["keto", "vegan", "suppe", "kokos", "blumenkohl"],
    zutaten: ["1 Blumenkohl", "400 ml Kokosmilch", "400 ml Gemüsebrühe", "1 Zwiebel", "Knoblauch", "2 cm Ingwer", "Kurkuma", "Kreuzkümmel", "Kokosöl", "Koriander"],
    zubereitung: ["Zwiebel, Knoblauch und Ingwer in Kokosöl anbraten.", "Blumenkohl in Röschen dazu.", "Brühe und Kokosmilch auffüllen.", "Gewürze dazu, 15 Min köcheln.", "Pürieren, mit Koriander servieren."],
  },
  {
    id: "schweinebauch-ofen-knusprig",
    name: "Knuspriger Schweinebauch aus dem Ofen",
    kategorie: "Abendessen",
    kcal: 680, kh: 1, eiweiss: 34, fett: 60,
    zeit: "2 Std", schwierigkeit: "Einfach",
    bild: "🥩",
    tags: ["keto", "schwein", "knusprig", "meal-prep"],
    zutaten: ["1 kg Schweinebauch (mit Schwarte)", "Salz (großzügig)", "Kümmel", "Knoblauch", "Olivenöl", "Pfeffer"],
    zubereitung: ["Schwarte rautenförmig einschneiden.", "Großzügig mit Salz einreiben, auch in die Schnitte.", "Knoblauch, Kümmel und Pfeffer aufstreuen.", "Bei 150 °C 90 Min garen.", "Dann auf 220 °C erhöhen, Schwarte 15–20 Min aufknuspern.", "Ruhen lassen, aufschneiden."],
  },
  {
    id: "lachs-senf-dill-pfanne",
    name: "Lachs in Senf-Dill-Sauce",
    kategorie: "Abendessen",
    kcal: 470, kh: 3, eiweiss: 36, fett: 35,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🐟",
    tags: ["keto", "lachs", "fisch", "senf"],
    zutaten: ["2 Lachsfilets", "2 EL Dijonsenf", "150 ml Sahne", "Dill frisch", "Zitronensaft", "Knoblauch", "Butter", "Salz, Pfeffer"],
    zubereitung: ["Lachs würzen, in Butter je 3–4 Min je Seite braten.", "Herausnehmen.", "Knoblauch kurz anbraten.", "Senf und Sahne einrühren, einkochen.", "Dill und Zitronensaft dazu.", "Lachs zurück in die Sauce."],
  },
  {
    id: "keto-beef-jerky",
    name: "Keto Beef Jerky (Ofen)",
    kategorie: "Snack",
    kcal: 150, kh: 1, eiweiss: 24, fett: 6,
    zeit: "4 Std", schwierigkeit: "Mittel",
    bild: "🥩",
    tags: ["keto", "rindfleisch", "meal-prep", "proteinreich"],
    zutaten: ["500 g Rinderhüfte sehr dünn aufgeschnitten", "3 EL Sojasoße (glutenfrei)", "1 TL Worcestersauce", "Knoblauchpulver", "Chiliflocken", "Pfeffer", "Rauchpaprika"],
    zubereitung: ["Fleisch in dünne Streifen schneiden oder schneiden lassen.", "Mit Sojasoße, Worcestersauce und Gewürzen marinieren (min. 1 Std).", "Auf Rost im Ofen bei 70 °C (Umluft) 3–4 Std trocknen.", "Ofen leicht offen lassen damit Feuchtigkeit entweicht.", "Vollständig abkühlen — hält 2 Wochen."],
  },
  {
    id: "keto-käsesuppe-speck",
    name: "Deftige Käsesuppe mit Speck",
    kategorie: "Mittagessen",
    kcal: 420, kh: 4, eiweiss: 18, fett: 36,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🫕",
    tags: ["keto", "suppe", "käse", "speck"],
    zutaten: ["150 g Speck gewürfelt", "200 g Schmelzkäse (naturell)", "500 ml Hühnerbrühe", "200 ml Sahne", "1 Zwiebel", "Knoblauch", "Butter", "Muskat", "Schnittlauch"],
    zubereitung: ["Speck in Butter anbraten, Zwiebel und Knoblauch dazu.", "Brühe angießen.", "Schmelzkäse einrühren bis aufgelöst.", "Sahne dazu, würzen.", "Mit Schnittlauch und knusprigem Speck servieren."],
  },
  {
    id: "keto-wurst-käse-auflauf",
    name: "Bratwurst-Käse-Auflauf",
    kategorie: "Abendessen",
    kcal: 510, kh: 3, eiweiss: 26, fett: 44,
    zeit: "30 Min", schwierigkeit: "Einfach",
    bild: "🌭",
    tags: ["keto", "wurst", "käse", "ofen"],
    zutaten: ["4 Bratwürste", "3 Eier", "200 ml Sahne", "100 g Cheddar gerieben", "1 Zwiebel", "Senf", "Paprikapulver", "Salz, Pfeffer"],
    zubereitung: ["Würste in Scheiben schneiden, in Pfanne anbraten.", "In Auflaufform geben, Zwiebeln dazu.", "Eier mit Sahne, Senf und Gewürzen verquirlen.", "Drübergießen.", "Käse drüber.", "Bei 180 °C 20 Min backen."],
  },
  {
    id: "zucchini-feta-frittata",
    name: "Zucchini-Feta-Frittata",
    kategorie: "Frühstück",
    kcal: 320, kh: 4, eiweiss: 18, fett: 25,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍳",
    tags: ["keto", "vegetarisch", "feta", "zucchini", "frittata"],
    zutaten: ["6 Eier", "1 Zucchini", "100 g Feta", "1 rote Zwiebel", "2 EL Olivenöl", "frischer Oregano", "Salz, Pfeffer"],
    zubereitung: ["Ofen auf 200 °C vorheizen.", "Zucchini und Zwiebel in ovensafe Pfanne anbraten.", "Eier verquirlen, würzen, drübergießen.", "Feta drüber bröckeln.", "5 Min auf dem Herd, dann 10 Min im Ofen backen."],
  },
  {
    id: "keto-rindfleisch-tacos-salat",
    name: "Low-Carb Beef-Tacos in Salatblatt",
    kategorie: "Abendessen",
    kcal: 480, kh: 5, eiweiss: 34, fett: 36,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🌮",
    tags: ["keto", "rindfleisch", "taco", "schnell"],
    zutaten: ["400 g Rinderhack", "Taco-Gewürz (selbst gemacht: Kreuzkümmel, Paprika, Chili, Knoblauch)", "8 Eisbergsalatblätter", "1 Avocado", "100 g Cheddar gerieben", "Saure Sahne", "Limette"],
    zubereitung: ["Hack mit Gewürzen krümelig braten.", "Salatblätter als Schalen nutzen.", "Hack reinfüllen.", "Mit Avocado, Käse und saurer Sahne toppen.", "Mit Limette beträufeln."],
  },
  {
    id: "keto-spargel-hollandaise",
    name: "Grüner Spargel mit Hollandaise",
    kategorie: "Mittagessen",
    kcal: 350, kh: 4, eiweiss: 8, fett: 32,
    zeit: "20 Min", schwierigkeit: "Mittel",
    bild: "🌿",
    tags: ["keto", "vegetarisch", "spargel", "festlich"],
    zutaten: ["500 g grüner Spargel", "2 Eigelb", "100 g Butter", "Zitronensaft", "Salz", "weißer Pfeffer", "Cayenne"],
    zubereitung: ["Spargel in Salzwasser oder im Ofen garen.", "Eigelb mit Zitronensaft über Wasserbad schaumig schlagen.", "Geschmolzene Butter tröpfchenweise einrühren.", "Mit Salz, Pfeffer und Cayenne abschmecken.", "Über Spargel servieren."],
  },
  {
    id: "keto-hähnchen-satay",
    name: "Hähnchen-Satay-Spieße mit Erdnuss-Dip",
    kategorie: "Snack",
    kcal: 310, kh: 4, eiweiss: 26, fett: 21,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍢",
    tags: ["keto", "hähnchen", "asia", "fingerfood"],
    zutaten: ["300 g Hähnchenbrust in Streifen", "3 EL Sojasoße", "Kurkuma", "Knoblauch", "Ingwer", "Für Dip: 3 EL Erdnussmus, Kokosmilch, Limette, Chili"],
    zubereitung: ["Hähnchen in Sojasoße, Kurkuma, Knoblauch marinieren.", "Auf Spieße stecken.", "Grillen oder in Grillpfanne je 2–3 Min je Seite.", "Dip aus Erdnussmus, Kokosmilch, Limette und Chili rühren.", "Warm mit Dip servieren."],
  },
  {
    id: "keto-chorizo-spinat-pfanne",
    name: "Chorizo-Spinat-Pfanne mit Ei",
    kategorie: "Frühstück",
    kcal: 460, kh: 3, eiweiss: 28, fett: 38,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🌶️",
    tags: ["keto", "chorizo", "spinat", "herzhaft"],
    zutaten: ["150 g Chorizo in Scheiben", "200 g Babyspinat", "3 Eier", "2 Knoblauchzehen", "Olivenöl", "Chiliflocken", "Salz"],
    zubereitung: ["Chorizo ohne Öl knusprig anbraten.", "Knoblauch kurz mitbraten.", "Spinat dazu, zusammenfallen lassen.", "Mulden formen, Eier hineingeben.", "Mit Deckel 4 Min stocken lassen."],
  },
  {
    id: "keto-avocado-thunfisch-melts",
    name: "Thunfisch-Avocado-Melts",
    kategorie: "Mittagessen",
    kcal: 400, kh: 3, eiweiss: 28, fett: 32,
    zeit: "15 Min", schwierigkeit: "Einfach",
    bild: "🥑",
    tags: ["keto", "thunfisch", "avocado", "käse"],
    zutaten: ["1 Avocado", "2 Dosen Thunfisch", "2 EL Mayo", "Zitronensaft", "Salz, Pfeffer", "4 Scheiben Cheddar", "Chiliflocken"],
    zubereitung: ["Thunfisch mit Mayo, Zitrone und Gewürzen mischen.", "Avocado halbieren, Kern entfernen.", "Thunfisch in die Mulde häufen.", "Cheddar drüber.", "Unter Grillhitze 3–4 Min schmelzen lassen."],
  },
  {
    id: "keto-hähnchen-tikka",
    name: "Hähnchen Tikka Masala (Keto)",
    kategorie: "Abendessen",
    kcal: 450, kh: 7, eiweiss: 40, fett: 28,
    zeit: "35 Min", schwierigkeit: "Mittel",
    bild: "🍛",
    tags: ["keto", "hähnchen", "india", "curry"],
    zutaten: ["500 g Hähnchenbrust", "200 g Vollfett-Joghurt", "1 Dose Tomaten", "200 ml Sahne", "Tikka Masala Gewürzmischung", "Knoblauch", "Ingwer", "Butter", "Koriander"],
    zubereitung: ["Hähnchen würfeln, mit Joghurt und Tikka-Gewürz 30 Min marinieren.", "In Butter kräftig anbraten.", "Tomaten, Knoblauch und Ingwer dazu.", "10 Min köcheln.", "Sahne einrühren, weitere 5 Min.", "Mit Koriander und Blumenkohlreis servieren."],
  },
  {
    id: "keto-rindfleisch-pho",
    name: "Keto-Pho (Rindfleisch-Suppe)",
    kategorie: "Mittagessen",
    kcal: 310, kh: 5, eiweiss: 26, fett: 20,
    zeit: "30 Min", schwierigkeit: "Mittel",
    bild: "🍜",
    tags: ["keto", "rindfleisch", "suppe", "asia"],
    zutaten: ["800 ml Rinderbrühe", "200 g Rindfleisch (Rumpsteak)", "Zitronengras", "Sternanis", "Zimt", "Ingwer", "Frühlingszwiebeln", "Mungobohnenkeimlinge (wenig)", "Limette", "Chili", "frischer Koriander"],
    zubereitung: ["Brühe mit Sternanis, Zimt, Zitronengras und Ingwer 20 Min köcheln.", "Abseihen.", "Fleisch hauchdünn aufschneiden.", "Heiße Brühe über rohes Fleisch gießen — gart durch.", "Mit Keimlinge, Frühlingszwiebeln, Limette und Chili servieren."],
  },
  {
    id: "keto-camembert-gebraten",
    name: "Gebratener Camembert mit Preiselbeeren",
    kategorie: "Snack",
    kcal: 350, kh: 3, eiweiss: 18, fett: 30,
    zeit: "10 Min", schwierigkeit: "Einfach",
    bild: "🧀",
    tags: ["keto", "käse", "vegetarisch", "fingerfood"],
    zutaten: ["1 Camembert (250 g)", "2 Eier", "50 g Mandelmehl", "Öl zum Braten", "2 EL Preiselbeeren (zuckerarm)", "Rucola"],
    zubereitung: ["Camembert halbieren oder ganz lassen.", "Durch Ei ziehen, dann in Mandelmehl wenden.", "In Öl bei mittlerer Hitze 2–3 Min je Seite goldbraun braten.", "Mit Preiselbeeren und Rucola servieren."],
  },
  {
    id: "keto-schinken-käse-soufflé",
    name: "Schinken-Käse-Soufflé",
    kategorie: "Abendessen",
    kcal: 340, kh: 3, eiweiss: 22, fett: 27,
    zeit: "30 Min", schwierigkeit: "Mittel",
    bild: "🧁",
    tags: ["keto", "eier", "schinken", "käse", "ofen"],
    zutaten: ["4 Eier (getrennt)", "100 g Kochschinken gewürfelt", "80 g Gruyère gerieben", "2 EL Sahne", "Butter für Förmchen", "Muskat", "Salz, Pfeffer"],
    zubereitung: ["Ofen auf 190 °C vorheizen, Förmchen buttern.", "Eigelb mit Sahne, Schinken, Käse und Gewürzen mischen.", "Eiweiß steif schlagen.", "Behutsam unterheben.", "Sofort in Förmchen füllen.", "18–20 Min backen — nicht öffnen!", "Sofort servieren."],
  },
  {
    id: "keto-konjak-ramen",
    name: "Keto Ramen mit Konjak-Nudeln",
    kategorie: "Abendessen",
    kcal: 360, kh: 4, eiweiss: 26, fett: 25,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🍜",
    tags: ["keto", "suppe", "asia", "konjak"],
    zutaten: ["200 g Konjak-Nudeln (Shirataki)", "800 ml Hühner- oder Rinderbrühe", "2 weichgekochte Eier", "100 g Hähnchen oder Schweinebauch (gar)", "Frühlingszwiebeln", "Sojasoße", "Sesamöl", "Nori-Blatt", "Sesam"],
    zubereitung: ["Konjak-Nudeln abspülen, trocken braten.", "Brühe mit Sojasoße und Sesamöl erhitzen.", "Nudeln in tiefe Schale.", "Heiße Brühe drüber.", "Ei halbieren, drauflegen.", "Mit Frühlingszwiebeln, Nori und Sesam garnieren."],
  },
  {
    id: "keto-hüttenkäse-bowl",
    name: "Herzhafter Hüttenkäse-Bowl",
    kategorie: "Frühstück",
    kcal: 290, kh: 4, eiweiss: 26, fett: 18,
    zeit: "5 Min", schwierigkeit: "Einfach",
    bild: "🫙",
    tags: ["keto", "frühstück", "schnell", "proteinreich"],
    zutaten: ["200 g Hüttenkäse (Vollfett)", "3 Radieschen", "½ Gurke", "Schnittlauch", "Olivenöl", "Paprikapulver", "Salz, Pfeffer"],
    zubereitung: ["Hüttenkäse in Schüssel geben.", "Gurke und Radieschen würfeln.", "Draufgeben.", "Mit Olivenöl beträufeln.", "Paprikapulver und Schnittlauch drüber."],
  },
  {
    id: "keto-würzige-hühnchenschenkel",
    name: "Würzige Hähnchenschenkel aus der Pfanne",
    kategorie: "Abendessen",
    kcal: 530, kh: 2, eiweiss: 42, fett: 40,
    zeit: "30 Min", schwierigkeit: "Einfach",
    bild: "🍗",
    tags: ["keto", "hähnchen", "knusprig", "schnell"],
    zutaten: ["4 Hähnchenschenkel", "Paprikapulver", "Knoblauchpulver", "Zwiebelpulver", "Cayenne", "Kümmel", "Olivenöl", "Salz"],
    zubereitung: ["Schenkel trocken tupfen.", "Alle Gewürze mischen, Schenkel damit einreiben.", "In Öl Hautseite zuerst bei mittlerer-hoher Hitze 12 Min anbraten.", "Wenden, weitere 15 Min bei niedrigerer Hitze garen.", "Innentemperatur 75 °C prüfen."],
  },
  {
    id: "keto-grillgemüse-halloumi",
    name: "Gegrilltes Halloumi mit Gemüse",
    kategorie: "Mittagessen",
    kcal: 380, kh: 5, eiweiss: 22, fett: 30,
    zeit: "20 Min", schwierigkeit: "Einfach",
    bild: "🧀",
    tags: ["keto", "vegetarisch", "halloumi", "grill"],
    zutaten: ["200 g Halloumi", "1 Zucchini", "1 Paprika", "100 g Champignons", "3 EL Olivenöl", "Oregano", "Zitronensaft", "Schwarzer Pfeffer"],
    zubereitung: ["Gemüse und Halloumi in Scheiben schneiden.", "Mit Olivenöl und Oregano mischen.", "In Grillpfanne je 2–3 Min je Seite grillen.", "Mit Zitronensaft und Pfeffer abschmecken."],
  },
  {
    id: "keto-gebratener-blumenkohl-steak",
    name: "Gebratener Blumenkohl-Steak mit Tahini",
    kategorie: "Abendessen",
    kcal: 310, kh: 7, eiweiss: 9, fett: 26,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🌸",
    tags: ["keto", "vegan", "blumenkohl", "orientalisch"],
    zutaten: ["1 großer Blumenkohl", "4 EL Olivenöl", "Ras-el-Hanout", "Knoblauch", "Tahini", "Zitronensaft", "Wasser", "Petersilie", "Granatapfelkerne (wenig)"],
    zubereitung: ["Blumenkohl in 2 cm Scheiben schneiden.", "Mit Öl und Ras-el-Hanout würzen.", "In gusseiserner Pfanne bei hoher Hitze 4 Min je Seite braten.", "Tahini mit Zitrone, Knoblauch und Wasser zu Sauce rühren.", "Drüber träufeln, mit Petersilie garnieren."],
  },
  {
    id: "keto-hackfleisch-pilz-suppe",
    name: "Hackfleisch-Pilz-Suppe",
    kategorie: "Mittagessen",
    kcal: 380, kh: 5, eiweiss: 28, fett: 27,
    zeit: "25 Min", schwierigkeit: "Einfach",
    bild: "🍲",
    tags: ["keto", "suppe", "hack", "pilze"],
    zutaten: ["300 g Hackfleisch", "300 g gemischte Pilze", "800 ml Rinderbrühe", "200 ml Sahne", "1 Zwiebel", "Knoblauch", "Thymian", "Butter", "Salz, Pfeffer"],
    zubereitung: ["Zwiebeln und Knoblauch in Butter anschwitzen.", "Hack anbraten.", "Pilze dazu, 5 Min mitbraten.", "Brühe auffüllen.", "10 Min köcheln.", "Sahne einrühren, abschmecken."],
  },
];

// ─── Typen für "Mein Plan" ────────────────────────────────────────────────────

export type MeinPlanSlot = {
  rezeptId: string | null;
};
export type MeinPlanTag = {
  fruehstueck: MeinPlanSlot;
  mittagessen: MeinPlanSlot;
  abendessen: MeinPlanSlot;
  snack: MeinPlanSlot;
};
export type MeinPlan = Record<string, MeinPlanTag>;

const TAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const SLOTS = [
  { key: "fruehstueck" as const, label: "Frühstück", icon: "🌅" },
  { key: "mittagessen" as const, label: "Mittagessen", icon: "☀️" },
  { key: "abendessen" as const, label: "Abendessen", icon: "🌙" },
  { key: "snack" as const, label: "Snack", icon: "🥜" },
];
const KATEGORIEN = ["Alle", "Frühstück", "Mittagessen", "Abendessen", "Snack", "Salat"];

function leerePlan(): MeinPlan {
  const plan: MeinPlan = {};
  TAGE.forEach(t => {
    plan[t] = {
      fruehstueck: { rezeptId: null },
      mittagessen: { rezeptId: null },
      abendessen: { rezeptId: null },
      snack: { rezeptId: null },
    };
  });
  return plan;
}

function ladePlan(): MeinPlan {
  try {
    const d = localStorage.getItem("ketome_mein_plan");
    return d ? JSON.parse(d) : leerePlan();
  } catch {
    return leerePlan();
  }
}

function speicherePlan(plan: MeinPlan) {
  localStorage.setItem("ketome_mein_plan", JSON.stringify(plan));
}

// ─── Personalisierte Rezepte (automatisch Favorit) ───────────────────────────
const TANJAS_IDS = [
  "fruehstuecksteller", "gulaschsuppe", "kaese-lauch-suppe", "huehnersuppe-sojasauce",
  "gruene-bohnen-hack", "gruene-bohnen-butter", "haehnchen-gruene-bohnen",
  "keto-kaesekuchen", "eiweissbrot-flohsamen", "eiweissbrot-sonnenkerne",
  "eiweissbrot-kuestenfrische", "linsensuppe-keto",
];

const AUSSCHLUSS_OPTIONEN = [
  { key: "pilze", label: "Ohne Pilze", begriffe: ["pilz", "champignon", "shiitake", "pfifferlinge"] },
  { key: "fisch", label: "Ohne Fisch", begriffe: ["fisch", "lachs", "thunfisch", "garnele", "shrimp", "forelle", "kabeljau", "hering", "makrele"] },
  { key: "spargel", label: "Ohne Spargel", begriffe: ["spargel"] },
  { key: "spinat", label: "Ohne Spinat", begriffe: ["spinat"] },
  { key: "brokkoli", label: "Ohne Brokkoli", begriffe: ["brokkoli", "broccoli"] },
];

function hatZutat(rezept: Rezept, begriffe: string[]): boolean {
  const text = [...rezept.zutaten, rezept.name, ...rezept.tags].join(" ").toLowerCase();
  return begriffe.some(b => text.includes(b));
}

// ─── Diät-Erkennung per Zutaten-Keywords ─────────────────────────────────────

const FLEISCH_W = ["rind", "schwein", "hack", "steak", "lamm", "wurst", "speck", "bacon", "schinken", "salami", "kassler", "haxe", "gulasch", "rouladen", "schnitzel", "kotelett", "spareribs", "pulled pork", "bolognese", "frikadelle", "buletten", "hackbraten", "klopse", "sauerbraten", "schweinebraten", "wild", "hirsch", "wildschwein", "hase", "chorizo", "leberwurst", "blutwurst", "cervelat", "mortadella", "coppa", "pancetta", "prosciutto"];
const GEFLUEGEL_W = ["hähnchen", "haehnchen", "huhn", "pute", "putenbrust", "putenstreifen", "entenbrust", "gans", "ente", "truthahn"];
const FISCH_W = ["lachs", "thunfisch", "garnele", "shrimp", "forelle", "kabeljau", "hering", "makrele", "sardine", "garnelen", "scampi", "crevetten", "seelachs", "tilapia", "dorade", "wolfsbarsch", "muschel", "oktopus", "tintenfisch"];
const TIER_W = ["ei", "eier", "käse", "quark", "sahne", "butter", "milch", "joghurt", "feta", "frischkäse", "parmesan", "mozzarella", "ricotta", "mascarpone", "ghee", "halloumi", "cheddar", "gouda", "molke", "skyr", "schmand", "creme fraiche", "crème fraîche"];

function diaetTypen(rezept: Rezept): string[] {
  const text = [...rezept.zutaten, rezept.name, ...rezept.tags].join(" ").toLowerCase();
  const hatFleisch = FLEISCH_W.some(b => text.includes(b));
  const hatGefluegel = GEFLUEGEL_W.some(b => text.includes(b));
  const hatFisch = FISCH_W.some(b => text.includes(b));
  const hatTier = TIER_W.some(b => text.includes(b));
  const typen: string[] = [];
  if (hatFleisch || hatGefluegel) typen.push("fleisch");
  if (hatFisch && !hatFleisch && !hatGefluegel) typen.push("fisch");
  if (!hatFleisch && !hatGefluegel && !hatFisch) {
    typen.push("vegetarisch");
    if (!hatTier) typen.push("vegan");
  }
  return typen;
}

const DIAET_FILTER = [
  { key: "fleisch", label: "Fleisch & Geflügel", emoji: "🥩" },
  { key: "fisch", label: "Fisch & Meeresfrüchte", emoji: "🐟" },
  { key: "vegetarisch", label: "Vegetarisch", emoji: "🥗" },
  { key: "vegan", label: "Vegan", emoji: "🌱" },
];

// ─── Haupt-Seite ──────────────────────────────────────────────────────────────

function RezepteInner() {
  const searchParams = useSearchParams();
  const [kategorie, setKategorie] = useState("Alle");
  const [suche, setSuche] = useState("");
  const [offenId, setOffenId] = useState<string | null>(null);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Ingredient exclusions
  const [ausschluesse, setAusschluesse] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  // Diät-Filter
  const [diaetFilter, setDiaetFilter] = useState<string[]>([]);
  const [nurKlassiker, setNurKlassiker] = useState(false);
  const [nurGuenstig, setNurGuenstig] = useState(false);

  function toggleDiaet(key: string) {
    setDiaetFilter(prev => prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]);
  }

  // Custom recipes
  const [customRezepte, setCustomRezepte] = useState<Rezept[]>([]);
  const [showNeuForm, setShowNeuForm] = useState(false);
  const [editCustomId, setEditCustomId] = useState<string | null>(null);

  // New/Edit form state
  const [formName, setFormName] = useState("");
  const [formKat, setFormKat] = useState("Mittagessen");
  const [formKcal, setFormKcal] = useState("");
  const [formKh, setFormKh] = useState("");
  const [formEiweiss, setFormEiweiss] = useState("");
  const [formFett, setFormFett] = useState("");
  const [formZeit, setFormZeit] = useState("30 Min");
  const [formZutaten, setFormZutaten] = useState("");
  const [formZubereitung, setFormZubereitung] = useState("");
  // Portionierung
  const [portArt, setPortArt] = useState<"gramm" | "scheiben" | "stueck" | "portionen">("portionen");
  const [portGesamt, setPortGesamt] = useState("");
  const [portAnzahl, setPortAnzahl] = useState("");

  // Portions-Picker
  const [portionsAnzahl, setPortionsAnzahl] = useState(1);

  // Plan modal
  const [planModal, setPlanModal] = useState<{ rezeptId: string } | null>(null);
  const [planTag, setPlanTag] = useState("Montag");
  const [planSlot, setPlanSlot] = useState<"fruehstueck" | "mittagessen" | "abendessen" | "snack">("fruehstueck");
  const [planToast, setPlanToast] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const b = localStorage.getItem("ketome_bookmarks");
    if (b) {
      const parsed: string[] = JSON.parse(b);
      // Ensure Tanja's recipes are included
      const merged = Array.from(new Set([...TANJAS_IDS, ...parsed]));
      setBookmarks(merged);
      localStorage.setItem("ketome_bookmarks", JSON.stringify(merged));
    } else {
      setBookmarks(TANJAS_IDS);
      localStorage.setItem("ketome_bookmarks", JSON.stringify(TANJAS_IDS));
    }
    const a = localStorage.getItem("ketome_ausschluesse");
    if (a) setAusschluesse(JSON.parse(a));
    const c = localStorage.getItem("ketome_custom_rezepte");
    if (c) setCustomRezepte(JSON.parse(c));
  }, []);

  // URL-Parameter reaktiv auslesen
  useEffect(() => {
    const alleRezepte = [...REZEPTE, ...customRezepte];
    const id = searchParams.get("id");
    if (id && alleRezepte.find(r => r.id === id)) {
      setOffenId(id);
    } else if (!id) {
      setOffenId(null);
    }
  }, [searchParams, customRezepte]);

  const alleRezepte = [...REZEPTE, ...customRezepte];

  function saveBookmarks(ids: string[]) {
    setBookmarks(ids);
    localStorage.setItem("ketome_bookmarks", JSON.stringify(ids));
  }

  function toggleBookmark(id: string) {
    const neu = bookmarks.includes(id) ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
    saveBookmarks(neu);
  }

  function toggleAusschluss(key: string) {
    const neu = ausschluesse.includes(key) ? ausschluesse.filter(a => a !== key) : [...ausschluesse, key];
    setAusschluesse(neu);
    localStorage.setItem("ketome_ausschluesse", JSON.stringify(neu));
  }

  function saveCustomRezepte(liste: Rezept[]) {
    setCustomRezepte(liste);
    localStorage.setItem("ketome_custom_rezepte", JSON.stringify(liste));
  }

  function formReset() {
    setFormName(""); setFormKat("Mittagessen"); setFormKcal(""); setFormKh("");
    setFormEiweiss(""); setFormFett(""); setFormZeit("30 Min"); setFormZutaten(""); setFormZubereitung("");
    setPortArt("portionen"); setPortGesamt(""); setPortAnzahl("");
  }

  function oeffneNeuForm() { formReset(); setShowNeuForm(true); setEditCustomId(null); }

  function oeffneEditForm(r: Rezept) {
    setFormName(r.name); setFormKat(r.kategorie); setFormKcal(String(r.kcal));
    setFormKh(String(r.kh)); setFormEiweiss(String(r.eiweiss)); setFormFett(String(r.fett));
    setFormZeit(r.zeit); setFormZutaten(r.zutaten.join("\n")); setFormZubereitung(r.zubereitung.join("\n"));
    if (r.portionierung) {
      setPortArt(r.portionierung.art);
      setPortGesamt(String(r.portionierung.gesamtgewicht));
      setPortAnzahl(String(r.portionierung.anzahl));
    }
    setEditCustomId(r.id); setShowNeuForm(true);
  }

  function rezeptSpeichern() {
    if (!formName.trim()) return;
    const id = editCustomId || `custom-${Date.now()}`;
    const port: Portionierung | undefined = portAnzahl && parseInt(portAnzahl) > 0 ? {
      art: portArt,
      gesamtgewicht: parseInt(portGesamt) || 0,
      anzahl: parseInt(portAnzahl),
    } : undefined;
    const rezept: Rezept = {
      id, name: formName.trim(), kategorie: formKat as Rezept["kategorie"],
      kcal: parseInt(formKcal) || 0, kh: parseInt(formKh) || 0,
      eiweiss: parseInt(formEiweiss) || 0, fett: parseInt(formFett) || 0,
      zeit: formZeit, schwierigkeit: "Einfach", bild: "📝",
      tags: ["eigenes rezept"],
      zutaten: formZutaten.split("\n").map(s => s.trim()).filter(Boolean),
      zubereitung: formZubereitung.split("\n").map(s => s.trim()).filter(Boolean),
      portionierung: port,
    };
    if (editCustomId) {
      saveCustomRezepte(customRezepte.map(r => r.id === editCustomId ? rezept : r));
    } else {
      saveCustomRezepte([...customRezepte, rezept]);
      saveBookmarks([...bookmarks, id]);
    }
    setShowNeuForm(false); formReset(); setEditCustomId(null);
    setOffenId(id);
  }

  function customLoeschen(id: string) {
    saveCustomRezepte(customRezepte.filter(r => r.id !== id));
    saveBookmarks(bookmarks.filter(b => b !== id));
    setOffenId(null);
  }

  const aktiveAusschluesse = AUSSCHLUSS_OPTIONEN.filter(a => ausschluesse.includes(a.key));

  const gefiltert = alleRezepte.filter(r => {
    const matchKat = kategorie === "Alle" || r.kategorie === kategorie;
    const matchSuche =
      r.name.toLowerCase().includes(suche.toLowerCase()) ||
      r.tags.some(t => t.includes(suche.toLowerCase()));
    const matchAusschluss = !aktiveAusschluesse.some(a => hatZutat(r, a.begriffe));
    const matchDiaet = diaetFilter.length === 0 || diaetFilter.some(d => diaetTypen(r).includes(d));
    const matchKlassiker = !nurKlassiker || r.tags.includes("klassiker");
    const matchGuenstig = !nurGuenstig || r.tags.includes("günstig");
    return matchKat && matchSuche && matchAusschluss && matchDiaet && matchKlassiker && matchGuenstig;
  });

  function inPlanSpeichern() {
    if (!planModal) return;
    const plan = ladePlan();
    plan[planTag][planSlot].rezeptId = planModal.rezeptId;
    speicherePlan(plan);
    setPlanModal(null);
    const rezept = alleRezepte.find(r => r.id === planModal.rezeptId);
    setPlanToast(`${rezept?.bild} "${rezept?.name}" → ${planTag}, ${SLOTS.find(s => s.key === planSlot)?.label}`);
    setTimeout(() => setPlanToast(null), 3000);
  }

  const offenRezept = alleRezepte.find(r => r.id === offenId);
  const isCustom = offenId ? customRezepte.some(r => r.id === offenId) : false;

  // ─── Neu/Edit Form Modal ──────────────────────────────────────────────────
  if (showNeuForm) {
    return (
      <main className="px-4 py-6 pb-28">
        <button onClick={() => { setShowNeuForm(false); formReset(); }}
          className="flex items-center gap-2 mb-4 text-sm"
          style={{ color: "#22c55e" }}>
          ← Zurück
        </button>
        <h1 className="text-xl font-bold mb-4">{editCustomId ? "✏️ Rezept bearbeiten" : "➕ Eigenes Rezept"}</h1>

        <div className="space-y-3">
          <input value={formName} onChange={e => setFormName(e.target.value)}
            placeholder="Rezeptname *"
            className="w-full px-4 py-3 rounded-xl outline-none text-white text-sm"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />

          <div className="flex gap-2 flex-wrap">
            {KATEGORIEN.filter(k => k !== "Alle").map(k => (
              <button key={k} onClick={() => setFormKat(k)}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: formKat === k ? "#22c55e" : "#1a1a1a", color: formKat === k ? "#000" : "#888" }}>
                {k}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "kcal", val: formKcal, set: setFormKcal },
              { label: "KH (g)", val: formKh, set: setFormKh },
              { label: "Eiweiß", val: formEiweiss, set: setFormEiweiss },
              { label: "Fett (g)", val: formFett, set: setFormFett },
            ].map(({ label, val, set }) => (
              <div key={label}>
                <div className="text-xs mb-1" style={{ color: "#666" }}>{label}</div>
                <input value={val} onChange={e => set(e.target.value)} type="number"
                  className="w-full px-2 py-2 rounded-xl outline-none text-white text-sm text-center"
                  style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              </div>
            ))}
          </div>

          <input value={formZeit} onChange={e => setFormZeit(e.target.value)}
            placeholder="Zubereitungszeit (z.B. 30 Min)"
            className="w-full px-4 py-3 rounded-xl outline-none text-white text-sm"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />

          <div>
            <div className="text-xs mb-1" style={{ color: "#666" }}>Zutaten (eine pro Zeile)</div>
            <textarea value={formZutaten} onChange={e => setFormZutaten(e.target.value)}
              placeholder={"500 g Hähnchenbrust\n2 EL Olivenöl\nSalz, Pfeffer"}
              rows={5}
              className="w-full px-4 py-3 rounded-xl outline-none text-white text-sm resize-none"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
          </div>

          <div>
            <div className="text-xs mb-1" style={{ color: "#666" }}>Zubereitung (ein Schritt pro Zeile)</div>
            <textarea value={formZubereitung} onChange={e => setFormZubereitung(e.target.value)}
              placeholder={"Hähnchen würzen.\nIn Öl braten.\nServieren."}
              rows={5}
              className="w-full px-4 py-3 rounded-xl outline-none text-white text-sm resize-none"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
          </div>

          {/* Portionierung */}
          <div className="rounded-xl p-4" style={{ backgroundColor: "#0d150d", border: "1px solid #1a3a1a" }}>
            <div className="text-xs font-bold mb-3" style={{ color: "#4ade80" }}>🍽️ Wie möchtest du portionieren?</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {([
                { key: "portionen", label: "🥄 Portionen" },
                { key: "scheiben",  label: "🍞 Scheiben" },
                { key: "stueck",    label: "🔢 Stück" },
                { key: "gramm",     label: "⚖️ nur Gramm" },
              ] as const).map(({ key, label }) => (
                <button key={key} type="button" onClick={() => setPortArt(key)}
                  className="py-2.5 rounded-xl text-xs font-semibold"
                  style={{ backgroundColor: portArt === key ? "#22c55e" : "#1a2a1a", color: portArt === key ? "#000" : "#3a7a3a" }}>
                  {label}
                </button>
              ))}
            </div>
            {portArt !== "gramm" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs mb-1" style={{ color: "#3a5a3a" }}>Gesamtgewicht (g)</div>
                  <input value={portGesamt} onChange={e => setPortGesamt(e.target.value)} type="number"
                    placeholder="z.B. 620"
                    className="w-full px-3 py-2 rounded-xl outline-none text-white text-sm text-center"
                    style={{ backgroundColor: "#151a15" }} />
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: "#3a5a3a" }}>
                    Anzahl {portArt === "scheiben" ? "Scheiben" : portArt === "stueck" ? "Stück" : "Portionen"}
                  </div>
                  <input value={portAnzahl} onChange={e => setPortAnzahl(e.target.value)} type="number"
                    placeholder="z.B. 14"
                    className="w-full px-3 py-2 rounded-xl outline-none text-white text-sm text-center"
                    style={{ backgroundColor: "#151a15" }} />
                </div>
              </div>
            )}
            {portArt !== "gramm" && portGesamt && portAnzahl && parseInt(portAnzahl) > 0 && (
              <div className="mt-2 text-xs text-center" style={{ color: "#22c55e" }}>
                1 {portArt === "scheiben" ? "Scheibe" : portArt === "stueck" ? "Stück" : "Portion"} =&nbsp;
                {Math.round((parseInt(portGesamt) / parseInt(portAnzahl)) * 10) / 10} g
              </div>
            )}
          </div>

          <button onClick={rezeptSpeichern} disabled={!formName.trim()}
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{ backgroundColor: formName.trim() ? "#22c55e" : "#333", color: formName.trim() ? "#000" : "#666" }}>
            {editCustomId ? "Änderungen speichern" : "Rezept hinzufügen"}
          </button>
        </div>
      </main>
    );
  }

  // ─── Detailansicht ─────────────────────────────────────────────────────────
  if (offenRezept) {
    const isFav = bookmarks.includes(offenRezept.id);
    return (
      <main className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setOffenId(null)}
            className="flex items-center gap-2 text-sm"
            style={{ color: "#22c55e" }}>
            ← Zurück
          </button>
          <div className="flex gap-2">
            {isCustom && (
              <button onClick={() => oeffneEditForm(offenRezept)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium"
                style={{ backgroundColor: "#1a1a1a", color: "#888" }}>
                ✏️ Bearbeiten
              </button>
            )}
            <button onClick={() => toggleBookmark(offenRezept.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{ backgroundColor: isFav ? "#22c55e22" : "#1a1a1a", color: isFav ? "#22c55e" : "#888" }}>
              {isFav ? "⭐ Favorit" : "☆ Favorit"}
            </button>
          </div>
        </div>

        <div className="text-5xl mb-3 text-center">{offenRezept.bild}</div>
        <h1 className="text-xl font-bold mb-1">{offenRezept.name}</h1>
        <div className="flex gap-2 flex-wrap mb-4">
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#1a1a1a", color: "#888" }}>{offenRezept.kategorie}</span>
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#1a1a1a", color: "#888" }}>⏱ {offenRezept.zeit}</span>
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#1a1a1a", color: "#888" }}>{offenRezept.schwierigkeit}</span>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            { label: "Kalorien", wert: offenRezept.kcal, einheit: "" },
            { label: "Eiweiß", wert: offenRezept.eiweiss, einheit: "g" },
            { label: "Fett", wert: offenRezept.fett, einheit: "g" },
            { label: "Netto-KH", wert: offenRezept.kh, einheit: "g" },
          ].map(({ label, wert, einheit }) => (
            <div key={label} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-xs mb-0.5" style={{ color: "#555" }}>{label}</div>
              <div className="text-sm font-bold" style={{
                color: label === "Netto-KH" ? (wert <= 5 ? "#22c55e" : wert <= 10 ? "#f59e0b" : "#ef4444") : "#fff"
              }}>
                {wert}{einheit}
              </div>
            </div>
          ))}
        </div>

        {/* Portions-Picker */}
        {(() => {
          const p = offenRezept.portionierung;
          const einheit = p ? (p.art === "scheiben" ? "Scheibe" : p.art === "stueck" ? "Stück" : p.art === "portionen" ? "Portion" : "") : "";
          const gramProEinheit = p && p.anzahl > 0 ? Math.round((p.gesamtgewicht / p.anzahl) * 10) / 10 : 0;
          const faktor = p && p.art !== "gramm" ? (portionsAnzahl * gramProEinheit / 100) : portionsAnzahl;
          return (
            <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#0d150d", border: "1px solid #1a3a1a" }}>
              <div className="text-xs font-semibold mb-2" style={{ color: "#4ade80" }}>
                🍽️ Wie viel hast du gegessen?
              </div>
              {p && p.art !== "gramm" ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => setPortionsAnzahl(Math.max(0.5, portionsAnzahl - (portionsAnzahl <= 1 ? 0.5 : 1)))}
                      className="w-9 h-9 rounded-xl text-lg font-black flex items-center justify-center"
                      style={{ backgroundColor: "#1a2a1a", color: "#22c55e" }}>−</button>
                    <div className="flex-1 text-center">
                      <div className="text-xl font-black" style={{ color: "#22c55e" }}>{portionsAnzahl}</div>
                      <div className="text-xs" style={{ color: "#3a5a3a" }}>
                        {einheit}{portionsAnzahl !== 1 ? "n" : ""} = {Math.round(portionsAnzahl * gramProEinheit)} g
                      </div>
                    </div>
                    <button onClick={() => setPortionsAnzahl(portionsAnzahl + (portionsAnzahl < 1 ? 0.5 : 1))}
                      className="w-9 h-9 rounded-xl text-lg font-black flex items-center justify-center"
                      style={{ backgroundColor: "#1a2a1a", color: "#22c55e" }}>+</button>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center text-xs mb-3" style={{ color: "#3a5a3a" }}>
                    <div>{Math.round(offenRezept.kcal * faktor)} kcal</div>
                    <div>{Math.round(offenRezept.kh * faktor * 10) / 10}g KH</div>
                    <div>{Math.round(offenRezept.eiweiss * faktor * 10) / 10}g E</div>
                    <div>{Math.round(offenRezept.fett * faktor * 10) / 10}g F</div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 mb-3">
                  <button onClick={() => setPortionsAnzahl(Math.max(1, portionsAnzahl - 1))}
                    className="w-9 h-9 rounded-xl text-lg font-black flex items-center justify-center"
                    style={{ backgroundColor: "#1a2a1a", color: "#22c55e" }}>−</button>
                  <div className="flex-1 text-center">
                    <div className="text-xl font-black" style={{ color: "#22c55e" }}>{portionsAnzahl}×</div>
                    <div className="text-xs" style={{ color: "#3a5a3a" }}>Portion</div>
                  </div>
                  <button onClick={() => setPortionsAnzahl(portionsAnzahl + 1)}
                    className="w-9 h-9 rounded-xl text-lg font-black flex items-center justify-center"
                    style={{ backgroundColor: "#1a2a1a", color: "#22c55e" }}>+</button>
                </div>
              )}
              <button onClick={() => {
                const alle = JSON.parse(localStorage.getItem("ketome_naehrwerte") || "[]");
                alle.push({
                  id: Date.now().toString(),
                  datum: new Date().toLocaleDateString("de-DE"),
                  name: `${offenRezept.name}${portionsAnzahl !== 1 ? ` (${portionsAnzahl}×)` : ""}`,
                  kcal: Math.round(offenRezept.kcal * faktor),
                  kh: Math.round(offenRezept.kh * faktor * 10) / 10,
                  eiweiss: Math.round(offenRezept.eiweiss * faktor * 10) / 10,
                  fett: Math.round(offenRezept.fett * faktor * 10) / 10,
                  ballaststoffe: 0,
                });
                localStorage.setItem("ketome_naehrwerte", JSON.stringify(alle));
                window.dispatchEvent(new Event("ketome-daten-gespeichert"));
                setPortionsAnzahl(1);
                setPlanToast(`✅ Eingetragen!`);
                setTimeout(() => setPlanToast(null), 2500);
              }}
                className="w-full py-3 rounded-xl font-bold text-sm"
                style={{ backgroundColor: "#22c55e", color: "#000" }}>
                ✓ Heute gegessen eintragen
              </button>
            </div>
          );
        })()}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setPlanModal({ rezeptId: offenRezept.id })}
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{ backgroundColor: "#0d2018", border: "1px solid #22c55e44", color: "#22c55e" }}>
            📅 Zum Wochenplan hinzufügen
          </button>
        </div>

        {/* Teilen */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              const text = `${offenRezept.bild} ${offenRezept.name}\n\n🥗 Nur ${offenRezept.kh}g Kohlenhydrate | ${offenRezept.kcal} kcal\n⏱ ${offenRezept.zeit} | ${offenRezept.schwierigkeit}\n\nZutaten:\n${offenRezept.zutaten.map(z => `• ${z}`).join("\n")}\n\n✨ Mehr Keto-Rezepte: https://vitaketo.app/rezepte`;
              const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://vitaketo.app/rezepte")}&quote=${encodeURIComponent(text)}`;
              window.open(url, "_blank");
            }}
            className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            style={{ backgroundColor: "#1a2a3a", border: "1px solid #1877F244", color: "#4a9eff" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Auf Facebook teilen
          </button>
        </div>

        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>🛒 Zutaten</h2>
          <ul className="space-y-2">
            {offenRezept.zutaten.map((z, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span style={{ color: "#22c55e" }}>•</span> {z}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <h2 className="font-bold mb-3" style={{ color: "#22c55e" }}>👩‍🍳 Zubereitung</h2>
          <ol className="space-y-3">
            {offenRezept.zubereitung.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
                  style={{ backgroundColor: "#22c55e" }}>
                  {i + 1}
                </span>
                <span style={{ color: "#ccc" }}>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        {isCustom && (
          <button onClick={() => { if (confirm("Rezept wirklich löschen?")) customLoeschen(offenRezept.id); }}
            className="w-full py-3 rounded-xl text-sm mb-4"
            style={{ backgroundColor: "#1a1a1a", color: "#ef4444" }}>
            🗑 Rezept löschen
          </button>
        )}

        {planModal && (
          <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
            <div className="w-full rounded-t-3xl p-6 pb-28" style={{ backgroundColor: "#111" }}>
              <h2 className="font-bold text-lg mb-4">📅 Wann möchtest du das essen?</h2>
              <div className="mb-4">
                <div className="text-xs mb-2" style={{ color: "#666" }}>TAG</div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {TAGE.map(t => (
                    <button key={t} onClick={() => setPlanTag(t)}
                      className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium"
                      style={{ backgroundColor: planTag === t ? "#22c55e" : "#222", color: planTag === t ? "#000" : "#888" }}>
                      {t.slice(0, 2)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <div className="text-xs mb-2" style={{ color: "#666" }}>MAHLZEIT</div>
                <div className="grid grid-cols-2 gap-2">
                  {SLOTS.map(s => (
                    <button key={s.key} onClick={() => setPlanSlot(s.key)}
                      className="py-3 rounded-xl text-sm font-medium"
                      style={{ backgroundColor: planSlot === s.key ? "#22c55e" : "#222", color: planSlot === s.key ? "#000" : "#888" }}>
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setPlanModal(null)}
                  className="flex-1 py-3 rounded-xl text-sm"
                  style={{ backgroundColor: "#222", color: "#888" }}>
                  Abbrechen
                </button>
                <button onClick={inPlanSpeichern}
                  className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
                  style={{ backgroundColor: "#22c55e" }}>
                  Speichern
                </button>
              </div>
            </div>
          </div>
        )}

        {planToast && (
          <div className="fixed bottom-24 left-4 right-4 z-50 py-3 px-4 rounded-2xl text-center text-sm font-semibold"
            style={{ backgroundColor: "#22c55e", color: "#000" }}>
            ✓ {planToast}
          </div>
        )}
      </main>
    );
  }

  // ─── Listenansicht ─────────────────────────────────────────────────────────
  const anzahl = {
    Frühstück: alleRezepte.filter(r => r.kategorie === "Frühstück").length,
    Mittagessen: alleRezepte.filter(r => r.kategorie === "Mittagessen").length,
    Abendessen: alleRezepte.filter(r => r.kategorie === "Abendessen").length,
    Snack: alleRezepte.filter(r => r.kategorie === "Snack").length,
    Salat: alleRezepte.filter(r => r.kategorie === "Salat").length,
  };

  return (
    <main className="px-4 py-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold">📖 Rezepte</h1>
        <div className="flex gap-2">
          <a href="/werkstatt"
            className="px-3 py-1.5 rounded-xl text-xs font-medium"
            style={{ backgroundColor: "#1a1a1a", color: "#22c55e", border: "1px solid #22c55e33" }}>
            🧪 Werkstatt
          </a>
          <button onClick={oeffneNeuForm}
            className="px-3 py-1.5 rounded-xl text-xs font-medium"
            style={{ backgroundColor: "#22c55e", color: "#000" }}>
            ➕ Eigenes
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm" style={{ color: "#666" }}>{alleRezepte.length} Rezepte</p>
        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#0d1a0d", color: "#3a7a3a", border: "1px solid #1a3a1a" }}>
          ✨ Wird laufend erweitert
        </span>
      </div>

      <input value={suche} onChange={e => setSuche(e.target.value)}
        placeholder="🔍 Rezept oder Zutat suchen..."
        className="w-full px-4 py-3 rounded-xl outline-none text-white text-sm mb-3"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />

      {/* Filter-Toggle */}
      <button onClick={() => setShowFilter(!showFilter)}
        className="flex items-center gap-2 mb-3 text-xs"
        style={{ color: ausschluesse.length > 0 ? "#22c55e" : "#666" }}>
        🚫 Zutaten ausschließen {ausschluesse.length > 0 ? `(${ausschluesse.length} aktiv)` : ""}
      </button>
      {showFilter && (
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="flex gap-2 flex-wrap">
            {AUSSCHLUSS_OPTIONEN.map(a => (
              <button key={a.key} onClick={() => toggleAusschluss(a.key)}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: ausschluesse.includes(a.key) ? "#ef4444" : "#2a2a2a", color: ausschluesse.includes(a.key) ? "#fff" : "#888" }}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Kategorie-Filter */}
      <div className="flex gap-2 overflow-x-auto mb-3 pb-1">
        {KATEGORIEN.map(k => {
          const count = k === "Alle" ? alleRezepte.length : anzahl[k as keyof typeof anzahl];
          return (
            <button key={k} onClick={() => setKategorie(k)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: kategorie === k ? "#22c55e" : "#1a1a1a", color: kategorie === k ? "#000" : "#888" }}>
              {k} <span style={{ opacity: 0.7 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Diät-Filter */}
      <div className="flex gap-2 overflow-x-auto mb-5 pb-1">
        <button onClick={() => setNurKlassiker(!nurKlassiker)}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: nurKlassiker ? "#2a1a0a" : "#1a1a1a",
            color: nurKlassiker ? "#f59e0b" : "#666",
            border: `1px solid ${nurKlassiker ? "#f59e0b55" : "transparent"}`,
          }}>
          <span>⭐</span>
          <span>Klassiker</span>
        </button>
        <button onClick={() => setNurGuenstig(!nurGuenstig)}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: nurGuenstig ? "#0d2010" : "#1a1a1a",
            color: nurGuenstig ? "#4ade80" : "#666",
            border: `1px solid ${nurGuenstig ? "#22c55e55" : "transparent"}`,
          }}>
          <span>💰</span>
          <span>Günstig</span>
        </button>
        {DIAET_FILTER.map(d => (
          <button key={d.key} onClick={() => toggleDiaet(d.key)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: diaetFilter.includes(d.key) ? "#1a2a1a" : "#1a1a1a",
              color: diaetFilter.includes(d.key) ? "#22c55e" : "#666",
              border: `1px solid ${diaetFilter.includes(d.key) ? "#22c55e55" : "transparent"}`,
            }}>
            <span>{d.emoji}</span>
            <span>{d.label}</span>
          </button>
        ))}
        {diaetFilter.length > 0 && (
          <button onClick={() => setDiaetFilter([])}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs"
            style={{ color: "#555", backgroundColor: "#111" }}>
            ✕ Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {gefiltert.map(r => {
          const farbMap: Record<string, { von: string; bis: string }> = {
            "Frühstück":   { von: "#1a1200", bis: "#2a1a00" },
            "Mittagessen": { von: "#0d1a0d", bis: "#0a1a10" },
            "Abendessen":  { von: "#0d0d1a", bis: "#0a0a2a" },
            "Snack":       { von: "#1a0d0d", bis: "#2a0d0d" },
            "Salat":       { von: "#0a1a0a", bis: "#0d2018" },
            "Dessert":     { von: "#1a0d1a", bis: "#1a0a1a" },
          };
          const farbe = farbMap[r.kategorie] ?? { von: "#1a1a1a", bis: "#111" };

          return (
            <button key={r.id} onClick={() => setOffenId(r.id)}
              className="rounded-2xl text-left relative overflow-hidden"
              style={{ backgroundColor: "#1a1a1a" }}>

              {/* Bild-Bereich */}
              <div className="relative flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${farbe.von}, ${farbe.bis})`,
                  height: 90,
                }}>
                <span style={{ fontSize: 52, lineHeight: 1, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}>
                  {r.bild}
                </span>
                {bookmarks.includes(r.id) && (
                  <span className="absolute top-2 right-2 text-sm">⭐</span>
                )}
                <span className="absolute bottom-2 left-2 text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: "#00000066", color: "#aaa" }}>
                  {r.kategorie}
                </span>
              </div>

              {/* Info-Bereich */}
              <div className="p-3">
                <div className="text-sm font-semibold mb-1 leading-tight">{r.name}</div>
                <div className="text-xs mb-1.5" style={{ color: "#555" }}>{r.zeit} · {r.schwierigkeit}</div>
                <div className="flex gap-2 text-xs">
                  <span style={{ color: r.kh <= 5 ? "#22c55e" : r.kh <= 10 ? "#f59e0b" : "#ef4444" }}>
                    {r.kh}g KH
                  </span>
                  <span style={{ color: "#444" }}>{r.kcal} kcal</span>
                </div>
              </div>
            </button>
          );
        })}
        {gefiltert.length === 0 && (
          <div className="col-span-2 text-center py-8" style={{ color: "#555" }}>Keine Rezepte gefunden.</div>
        )}
      </div>

      {/* Community Banner */}
      <div className="mt-6 mb-28 rounded-2xl p-4" style={{ backgroundColor: "#0d1a0d", border: "1px solid #1a3a1a" }}>
        <div className="text-sm font-semibold mb-1" style={{ color: "#4ade80" }}>💬 Hast du ein Rezept-Wunsch?</div>
        <p className="text-xs mb-3" style={{ color: "#3a5a3a" }}>
          Die Rezeptsammlung wächst ständig. Neue Funktionen und Verbesserungen kommen regelmäßig —
          deine Ideen sind dabei willkommen!
        </p>
        <a href="https://telegram.me/vitaketo_carbbye_community" target="_blank" rel="noopener noreferrer"
          className="inline-block text-xs px-4 py-2 rounded-xl font-semibold"
          style={{ backgroundColor: "#1a3a1a", color: "#4ade80", border: "1px solid #2a5a2a" }}>
          💬 Zur Community
        </a>
      </div>

      {planToast && (
        <div className="fixed bottom-24 left-4 right-4 z-50 py-3 px-4 rounded-2xl text-center text-sm font-semibold"
          style={{ backgroundColor: "#22c55e", color: "#000" }}>
          ✓ {planToast}
        </div>
      )}
    </main>
  );
}

export default function RezeptePage() {
  return (
    <Suspense fallback={<div className="px-4 py-6 text-center" style={{ color: "#666" }}>Laden…</div>}>
      <RezepteInner />
    </Suspense>
  );
}
