"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export type Rezept = {
  id: string;
  name: string;
  kategorie: "Frühstück" | "Mittagessen" | "Abendessen" | "Snack" | "Dessert";
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
const KATEGORIEN = ["Alle", "Frühstück", "Mittagessen", "Abendessen", "Snack"];

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

// ─── Haupt-Seite ──────────────────────────────────────────────────────────────

function RezepteInner() {
  const searchParams = useSearchParams();
  const [kategorie, setKategorie] = useState("Alle");
  const [suche, setSuche] = useState("");
  const [offenId, setOffenId] = useState<string | null>(null);

  // URL-Parameter reaktiv auslesen
  useEffect(() => {
    const id = searchParams.get("id");
    if (id && REZEPTE.find(r => r.id === id)) {
      setOffenId(id);
    } else if (!id) {
      setOffenId(null);
    }
  }, [searchParams]);

  // Zum-Plan-hinzufügen Modal
  const [planModal, setPlanModal] = useState<{ rezeptId: string } | null>(null);
  const [planTag, setPlanTag] = useState("Montag");
  const [planSlot, setPlanSlot] = useState<"fruehstueck" | "mittagessen" | "abendessen" | "snack">("fruehstueck");
  const [planToast, setPlanToast] = useState<string | null>(null);

  const gefiltert = REZEPTE.filter(r => {
    const matchKat = kategorie === "Alle" || r.kategorie === kategorie;
    const matchSuche =
      r.name.toLowerCase().includes(suche.toLowerCase()) ||
      r.tags.some(t => t.includes(suche.toLowerCase()));
    return matchKat && matchSuche;
  });

  function inPlanSpeichern() {
    if (!planModal) return;
    const plan = ladePlan();
    plan[planTag][planSlot].rezeptId = planModal.rezeptId;
    speicherePlan(plan);
    setPlanModal(null);
    const rezept = REZEPTE.find(r => r.id === planModal.rezeptId);
    setPlanToast(`${rezept?.bild} "${rezept?.name}" → ${planTag}, ${SLOTS.find(s => s.key === planSlot)?.label}`);
    setTimeout(() => setPlanToast(null), 3000);
  }

  const offenRezept = REZEPTE.find(r => r.id === offenId);

  if (offenRezept) {
    return (
      <main className="px-4 py-6">
        <button onClick={() => setOffenId(null)}
          className="flex items-center gap-2 mb-4 text-sm"
          style={{ color: "#22c55e" }}>
          ← Zurück
        </button>

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
            { label: "KH", wert: offenRezept.kh, einheit: "g" },
          ].map(({ label, wert, einheit }) => (
            <div key={label} className="rounded-xl p-2 text-center" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="text-xs mb-0.5" style={{ color: "#555" }}>{label}</div>
              <div className="text-sm font-bold" style={{
                color: label === "KH" ? (wert <= 5 ? "#22c55e" : wert <= 10 ? "#f59e0b" : "#ef4444") : "#fff"
              }}>
                {wert}{einheit}
              </div>
            </div>
          ))}
        </div>

        {/* Zu Mein Plan hinzufügen Button */}
        <button onClick={() => setPlanModal({ rezeptId: offenRezept.id })}
          className="w-full py-3 rounded-xl font-bold text-black mb-4"
          style={{ backgroundColor: "#22c55e" }}>
          📅 Zu meinem Wochenplan hinzufügen
        </button>

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

        {/* Modal: Tag & Slot wählen */}
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

        {/* Toast */}
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
    Frühstück: REZEPTE.filter(r => r.kategorie === "Frühstück").length,
    Mittagessen: REZEPTE.filter(r => r.kategorie === "Mittagessen").length,
    Abendessen: REZEPTE.filter(r => r.kategorie === "Abendessen").length,
    Snack: REZEPTE.filter(r => r.kategorie === "Snack").length,
  };

  return (
    <main className="px-4 py-6">
      <h1 className="text-xl font-bold mb-1">📖 Rezepte</h1>
      <p className="text-sm mb-4" style={{ color: "#666" }}>{REZEPTE.length} Keto-Rezepte</p>

      <input value={suche} onChange={e => setSuche(e.target.value)}
        placeholder="🔍 Rezept oder Zutat suchen..."
        className="w-full px-4 py-3 rounded-xl outline-none text-white text-sm mb-4"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />

      <div className="flex gap-2 overflow-x-auto mb-5 pb-1">
        {KATEGORIEN.map(k => {
          const count = k === "Alle" ? REZEPTE.length : anzahl[k as keyof typeof anzahl];
          return (
            <button key={k} onClick={() => setKategorie(k)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: kategorie === k ? "#22c55e" : "#1a1a1a", color: kategorie === k ? "#000" : "#888" }}>
              {k} <span style={{ opacity: 0.7 }}>({count})</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {gefiltert.map(r => (
          <button key={r.id} onClick={() => setOffenId(r.id)}
            className="rounded-2xl p-4 text-left"
            style={{ backgroundColor: "#1a1a1a" }}>
            <div className="text-3xl mb-2">{r.bild}</div>
            <div className="text-sm font-semibold mb-1 leading-tight">{r.name}</div>
            <div className="text-xs mb-2" style={{ color: "#555" }}>{r.zeit} · {r.schwierigkeit}</div>
            <div className="flex gap-2 text-xs">
              <span style={{ color: r.kh <= 5 ? "#22c55e" : r.kh <= 10 ? "#f59e0b" : "#ef4444" }}>{r.kh}g KH</span>
              <span style={{ color: "#555" }}>{r.kcal} kcal</span>
            </div>
          </button>
        ))}
        {gefiltert.length === 0 && (
          <div className="col-span-2 text-center py-8" style={{ color: "#555" }}>Keine Rezepte gefunden.</div>
        )}
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
