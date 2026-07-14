// Eingebaute Nährwert-Datenbank für häufige Keto-Grundzutaten (pro 100g)
export type Grundzutat = {
  name: string;
  aliases: string[];
  kcal: number;
  kh: number;
  eiweiss: number;
  fett: number;
  ballaststoffe: number;
};

export const GRUNDZUTATEN: Grundzutat[] = [
  // ── Fleisch & Geflügel ──────────────────────────────────────────────────────
  { name: "Hackfleisch gemischt", aliases: ["hackfleisch", "hack", "mett", "faschiertes"], kcal: 263, kh: 0, eiweiss: 17, fett: 21, ballaststoffe: 0 },
  { name: "Hackfleisch Rind", aliases: ["rinderhack", "rinderhackfleisch", "beef mince"], kcal: 248, kh: 0, eiweiss: 18, fett: 19, ballaststoffe: 0 },
  { name: "Hackfleisch Schwein", aliases: ["schweinehack", "schweinehackfleisch"], kcal: 263, kh: 0, eiweiss: 16, fett: 22, ballaststoffe: 0 },
  { name: "Hühnerbrust", aliases: ["hähnchenbrust", "hühnerbrust", "chicken breast", "hähnchen brust", "haehnchenbrust"], kcal: 120, kh: 0, eiweiss: 23, fett: 2.6, ballaststoffe: 0 },
  { name: "Hähnchenschenkel", aliases: ["hühnerschenkel", "hähnchenschenkel", "chicken thigh"], kcal: 177, kh: 0, eiweiss: 18, fett: 11, ballaststoffe: 0 },
  { name: "Schweinebauch", aliases: ["bauchspeck", "schweinebauch", "belly pork"], kcal: 395, kh: 0, eiweiss: 14, fett: 38, ballaststoffe: 0 },
  { name: "Schweinefilet", aliases: ["schweinefilet", "lende"], kcal: 143, kh: 0, eiweiss: 22, fett: 6, ballaststoffe: 0 },
  { name: "Rinderfilet", aliases: ["rinderfilet", "steak", "beef steak"], kcal: 163, kh: 0, eiweiss: 22, fett: 8, ballaststoffe: 0 },
  { name: "Lachs", aliases: ["lachs", "lachsfilet", "salmon"], kcal: 208, kh: 0, eiweiss: 20, fett: 13, ballaststoffe: 0 },
  { name: "Thunfisch", aliases: ["thunfisch", "tuna"], kcal: 116, kh: 0, eiweiss: 26, fett: 1, ballaststoffe: 0 },
  { name: "Speck", aliases: ["speck", "bacon", "frühstücksspeck"], kcal: 458, kh: 0, eiweiss: 12, fett: 46, ballaststoffe: 0 },
  { name: "Wurst", aliases: ["wurst", "salami", "bratwurst"], kcal: 330, kh: 1, eiweiss: 14, fett: 30, ballaststoffe: 0 },
  { name: "Schinken", aliases: ["schinken", "kochschinken", "ham"], kcal: 109, kh: 1, eiweiss: 18, fett: 4, ballaststoffe: 0 },
  { name: "Lammfleisch", aliases: ["lamm", "lammfleisch", "lamb"], kcal: 200, kh: 0, eiweiss: 20, fett: 13, ballaststoffe: 0 },

  // ── Fisch & Meeresfrüchte ───────────────────────────────────────────────────
  { name: "Garnelen", aliases: ["garnelen", "shrimps", "crevetten", "prawns"], kcal: 71, kh: 0, eiweiss: 16, fett: 0.5, ballaststoffe: 0 },
  { name: "Makrele", aliases: ["makrele", "mackerel"], kcal: 205, kh: 0, eiweiss: 19, fett: 14, ballaststoffe: 0 },
  { name: "Sardinen", aliases: ["sardinen", "sardines"], kcal: 208, kh: 0, eiweiss: 24, fett: 12, ballaststoffe: 0 },
  { name: "Dorsch", aliases: ["dorsch", "kabeljau", "cod"], kcal: 82, kh: 0, eiweiss: 19, fett: 0.7, ballaststoffe: 0 },

  // ── Eier & Milchprodukte ────────────────────────────────────────────────────
  { name: "Ei", aliases: ["ei", "eier", "eggs", "egg"], kcal: 155, kh: 1.1, eiweiss: 13, fett: 11, ballaststoffe: 0 },
  { name: "Sahne", aliases: ["sahne", "schlagsahne", "cream", "schlagobers", "vollrahm"], kcal: 292, kh: 3, eiweiss: 2.4, fett: 30, ballaststoffe: 0 },
  { name: "Saure Sahne", aliases: ["saure sahne", "schmand", "crème fraîche", "creme fraiche", "sauerrahm"], kcal: 125, kh: 3.5, eiweiss: 2.8, fett: 12, ballaststoffe: 0 },
  { name: "Frischkäse", aliases: ["frischkäse", "frischkaese", "cream cheese", "philadelphia"], kcal: 245, kh: 2.7, eiweiss: 6.5, fett: 23, ballaststoffe: 0 },
  { name: "Schmelzkäse", aliases: ["schmelzkäse", "schmelzkaese", "processed cheese", "scheibletten"], kcal: 230, kh: 5, eiweiss: 11, fett: 18, ballaststoffe: 0 },
  { name: "Mozzarella", aliases: ["mozzarella"], kcal: 250, kh: 2, eiweiss: 18, fett: 19, ballaststoffe: 0 },
  { name: "Gouda", aliases: ["gouda", "käse", "kaese"], kcal: 356, kh: 0.5, eiweiss: 25, fett: 28, ballaststoffe: 0 },
  { name: "Parmesan", aliases: ["parmesan", "parmigiano"], kcal: 431, kh: 0, eiweiss: 38, fett: 29, ballaststoffe: 0 },
  { name: "Feta", aliases: ["feta", "schafskäse"], kcal: 264, kh: 0, eiweiss: 14, fett: 21, ballaststoffe: 0 },
  { name: "Butter", aliases: ["butter", "weidebutter", "ghee"], kcal: 741, kh: 0.6, eiweiss: 0.7, fett: 82, ballaststoffe: 0 },
  { name: "Quark", aliases: ["quark", "magerquark", "topfen"], kcal: 67, kh: 4, eiweiss: 12, fett: 0.3, ballaststoffe: 0 },
  { name: "Joghurt", aliases: ["joghurt", "yogurt", "greek yogurt", "griechischer joghurt"], kcal: 97, kh: 5, eiweiss: 9, fett: 5, ballaststoffe: 0 },
  { name: "Milch", aliases: ["milch", "vollmilch", "milk"], kcal: 61, kh: 4.7, eiweiss: 3.2, fett: 3.3, ballaststoffe: 0 },
  { name: "Cheddar", aliases: ["cheddar"], kcal: 403, kh: 0.5, eiweiss: 24, fett: 34, ballaststoffe: 0 },
  { name: "Ricotta", aliases: ["ricotta"], kcal: 174, kh: 3, eiweiss: 11, fett: 13, ballaststoffe: 0 },

  // ── Gemüse ──────────────────────────────────────────────────────────────────
  { name: "Zucchini", aliases: ["zucchini", "zucchinis", "courgette", "zucchetti"], kcal: 17, kh: 2.1, eiweiss: 1.2, fett: 0.4, ballaststoffe: 1 },
  { name: "Spitzkohl", aliases: ["spitzkohl", "spitzkohlkopf", "pointed cabbage"], kcal: 25, kh: 4, eiweiss: 1.5, fett: 0.2, ballaststoffe: 2 },
  { name: "Weißkohl", aliases: ["weißkohl", "weisskohl", "kohl", "white cabbage", "kraut"], kcal: 24, kh: 4.6, eiweiss: 1.3, fett: 0.2, ballaststoffe: 2.3 },
  { name: "Rotkohl", aliases: ["rotkohl", "rotkraut", "red cabbage"], kcal: 27, kh: 5, eiweiss: 1.3, fett: 0.2, ballaststoffe: 2 },
  { name: "Blumenkohl", aliases: ["blumenkohl", "cauliflower", "blumenkohlreis"], kcal: 25, kh: 3, eiweiss: 2, fett: 0.3, ballaststoffe: 2 },
  { name: "Brokkoli", aliases: ["brokkoli", "broccoli"], kcal: 34, kh: 4, eiweiss: 3, fett: 0.4, ballaststoffe: 2.6 },
  { name: "Porree", aliases: ["porree", "lauch", "leek", "lauchstange"], kcal: 29, kh: 4.4, eiweiss: 1.8, fett: 0.3, ballaststoffe: 1.8 },
  { name: "Spinat", aliases: ["spinat", "spinach", "babyspinat"], kcal: 23, kh: 1.4, eiweiss: 2.9, fett: 0.4, ballaststoffe: 2.2 },
  { name: "Paprika", aliases: ["paprika", "bell pepper", "peperoni rot", "peperoni gelb"], kcal: 31, kh: 6, eiweiss: 1, fett: 0.3, ballaststoffe: 2 },
  { name: "Tomate", aliases: ["tomate", "tomaten", "tomato", "tomatoes", "cherrytomaten"], kcal: 18, kh: 3.2, eiweiss: 0.9, fett: 0.2, ballaststoffe: 1.2 },
  { name: "Gurke", aliases: ["gurke", "gurken", "cucumber", "salatgurke"], kcal: 12, kh: 1.7, eiweiss: 0.7, fett: 0.1, ballaststoffe: 0.5 },
  { name: "Avocado", aliases: ["avocado", "avocados"], kcal: 160, kh: 1.8, eiweiss: 2, fett: 15, ballaststoffe: 7 },
  { name: "Zwiebel", aliases: ["zwiebel", "zwiebeln", "onion", "onions", "gemüsezwiebel"], kcal: 40, kh: 8, eiweiss: 1.1, fett: 0.1, ballaststoffe: 1.7 },
  { name: "Knoblauch", aliases: ["knoblauch", "garlic", "knoblauchzehe"], kcal: 149, kh: 29, eiweiss: 6, fett: 0.5, ballaststoffe: 2.1 },
  { name: "Sellerie", aliases: ["sellerie", "staudensellerie", "celery", "knollensellerie"], kcal: 16, kh: 2.1, eiweiss: 0.7, fett: 0.1, ballaststoffe: 1.6 },
  { name: "Champignon", aliases: ["champignon", "champignons", "pilze", "mushroom", "mushrooms"], kcal: 22, kh: 2, eiweiss: 3.1, fett: 0.3, ballaststoffe: 1.3 },
  { name: "Aubergine", aliases: ["aubergine", "eggplant"], kcal: 25, kh: 3.5, eiweiss: 1.1, fett: 0.2, ballaststoffe: 2.5 },
  { name: "Kohlrabi", aliases: ["kohlrabi"], kcal: 27, kh: 4, eiweiss: 1.7, fett: 0.1, ballaststoffe: 1.9 },
  { name: "Feldsalat", aliases: ["feldsalat", "rapunzel", "lamb's lettuce", "rucola", "rukola"], kcal: 19, kh: 0.5, eiweiss: 2, fett: 0.4, ballaststoffe: 1.8 },
  { name: "Eisbergsalat", aliases: ["eisbergsalat", "salat", "lettuce", "kopfsalat"], kcal: 14, kh: 1.9, eiweiss: 0.9, fett: 0.2, ballaststoffe: 1.2 },
  { name: "Frühlingszwiebeln", aliases: ["frühlingszwiebeln", "lauchzwiebeln", "spring onions"], kcal: 32, kh: 4.7, eiweiss: 1.8, fett: 0.2, ballaststoffe: 2.6 },
  { name: "Ingwer", aliases: ["ingwer", "ginger", "ingwerwurzel"], kcal: 80, kh: 15, eiweiss: 1.8, fett: 0.8, ballaststoffe: 2 },
  { name: "Radieschen", aliases: ["radieschen", "radish"], kcal: 16, kh: 2.5, eiweiss: 0.7, fett: 0.1, ballaststoffe: 1.6 },
  { name: "Rosenkohl", aliases: ["rosenkohl", "brussels sprouts"], kcal: 43, kh: 6, eiweiss: 3.4, fett: 0.5, ballaststoffe: 3.8 },
  { name: "Grüne Bohnen", aliases: ["grüne bohnen", "bohnen", "green beans", "buschbohnen"], kcal: 31, kh: 4.5, eiweiss: 1.8, fett: 0.2, ballaststoffe: 3.4 },
  { name: "Spargel", aliases: ["spargel", "asparagus", "grüner spargel"], kcal: 20, kh: 1.9, eiweiss: 2.2, fett: 0.1, ballaststoffe: 2.1 },
  { name: "Kürbis", aliases: ["kürbis", "hokkaido", "pumpkin", "butternut"], kcal: 26, kh: 5, eiweiss: 1, fett: 0.1, ballaststoffe: 1.5 },
  { name: "Chicorée", aliases: ["chicorée", "chicoree", "chicory"], kcal: 17, kh: 2.3, eiweiss: 0.9, fett: 0.2, ballaststoffe: 3.8 },
  { name: "Fenchel", aliases: ["fenchel", "fennel"], kcal: 31, kh: 4.8, eiweiss: 1.2, fett: 0.2, ballaststoffe: 3.1 },

  // ── Öle & Fette ─────────────────────────────────────────────────────────────
  { name: "Olivenöl", aliases: ["olivenöl", "olive oil", "olivenoel"], kcal: 884, kh: 0, eiweiss: 0, fett: 100, ballaststoffe: 0 },
  { name: "Kokosöl", aliases: ["kokosöl", "coconut oil", "kokosoel", "kokosfett"], kcal: 862, kh: 0, eiweiss: 0, fett: 100, ballaststoffe: 0 },
  { name: "MCT-Öl", aliases: ["mct-öl", "mct öl", "mct oil", "mctöl"], kcal: 862, kh: 0, eiweiss: 0, fett: 100, ballaststoffe: 0 },
  { name: "Rapsöl", aliases: ["rapsöl", "rapeseed oil", "canola oil"], kcal: 884, kh: 0, eiweiss: 0, fett: 100, ballaststoffe: 0 },

  // ── Nüsse & Samen ───────────────────────────────────────────────────────────
  { name: "Mandeln", aliases: ["mandeln", "almonds", "mandeln ganz", "mandelkerne"], kcal: 579, kh: 6, eiweiss: 21, fett: 50, ballaststoffe: 12.5 },
  { name: "Mandelmehl", aliases: ["mandelmehl", "almond flour", "gemahlene mandeln"], kcal: 590, kh: 6, eiweiss: 22, fett: 52, ballaststoffe: 12 },
  { name: "Walnüsse", aliases: ["walnüsse", "walnuss", "walnuts"], kcal: 654, kh: 4, eiweiss: 15, fett: 65, ballaststoffe: 6.7 },
  { name: "Chiasamen", aliases: ["chiasamen", "chia seeds", "chia"], kcal: 486, kh: 6, eiweiss: 17, fett: 31, ballaststoffe: 34 },
  { name: "Leinsamen", aliases: ["leinsamen", "flaxseed", "lein"], kcal: 534, kh: 1.5, eiweiss: 18, fett: 42, ballaststoffe: 27 },
  { name: "Flohsamenschalen", aliases: ["flohsamenschalen", "psyllium husk", "flohsamen"], kcal: 200, kh: 1, eiweiss: 2, fett: 1, ballaststoffe: 80 },
  { name: "Kürbiskerne", aliases: ["kürbiskerne", "pumpkin seeds"], kcal: 559, kh: 4, eiweiss: 30, fett: 49, ballaststoffe: 3.9 },
  { name: "Sonnenblumenkerne", aliases: ["sonnenblumenkerne", "sunflower seeds"], kcal: 584, kh: 5, eiweiss: 21, fett: 51, ballaststoffe: 8.6 },
  { name: "Haselnüsse", aliases: ["haselnüsse", "hazelnuts", "haselnuss"], kcal: 628, kh: 4, eiweiss: 15, fett: 61, ballaststoffe: 9.7 },
  { name: "Macadamia", aliases: ["macadamia", "macadamianüsse"], kcal: 718, kh: 4, eiweiss: 8, fett: 76, ballaststoffe: 8.6 },
  { name: "Paranüsse", aliases: ["paranüsse", "brazil nuts"], kcal: 656, kh: 3, eiweiss: 14, fett: 66, ballaststoffe: 7.5 },

  // ── Brühe & Flüssigkeiten ───────────────────────────────────────────────────
  { name: "Gemüsebrühe", aliases: ["gemüsebrühe", "brühe", "vegetable broth", "gemuesebruehe", "bouillon"], kcal: 10, kh: 1.2, eiweiss: 0.5, fett: 0.3, ballaststoffe: 0 },
  { name: "Hühnerbrühe", aliases: ["hühnerbrühe", "hühnerbouillon", "chicken broth", "hühnerbrühe", "geflügelbrühe"], kcal: 15, kh: 0.5, eiweiss: 1.5, fett: 0.5, ballaststoffe: 0 },
  { name: "Rinderbrühe", aliases: ["rinderbrühe", "rinderbouillon", "beef broth", "rindssuppe"], kcal: 15, kh: 0.5, eiweiss: 2, fett: 0.5, ballaststoffe: 0 },
  { name: "Kokosmilch", aliases: ["kokosmilch", "coconut milk", "kokosnussmilch"], kcal: 197, kh: 3, eiweiss: 2, fett: 21, ballaststoffe: 0 },
  { name: "Mandelmilch", aliases: ["mandelmilch", "almond milk"], kcal: 24, kh: 0.5, eiweiss: 0.5, fett: 1.6, ballaststoffe: 0.4 },
  { name: "Wasser", aliases: ["wasser", "water"], kcal: 0, kh: 0, eiweiss: 0, fett: 0, ballaststoffe: 0 },

  // ── Gewürze & Würzmittel ────────────────────────────────────────────────────
  { name: "Salz", aliases: ["salz", "salt", "meersalz"], kcal: 0, kh: 0, eiweiss: 0, fett: 0, ballaststoffe: 0 },
  { name: "Pfeffer", aliases: ["pfeffer", "pepper", "schwarzer pfeffer"], kcal: 255, kh: 38, eiweiss: 10, fett: 3, ballaststoffe: 26 },
  { name: "Paprikapulver", aliases: ["paprikapulver", "paprika pulver", "paprika gewürz"], kcal: 282, kh: 34, eiweiss: 14, fett: 13, ballaststoffe: 21 },
  { name: "Kurkuma", aliases: ["kurkuma", "turmeric", "gelbwurz"], kcal: 312, kh: 60, eiweiss: 10, fett: 3, ballaststoffe: 22 },
  { name: "Zimt", aliases: ["zimt", "cinnamon"], kcal: 261, kh: 56, eiweiss: 4, fett: 1, ballaststoffe: 53 },
  { name: "Senf", aliases: ["senf", "mustard", "dijon"], kcal: 66, kh: 5, eiweiss: 4.5, fett: 3.6, ballaststoffe: 3 },
  { name: "Sojasauce", aliases: ["sojasauce", "soy sauce", "tamari"], kcal: 53, kh: 4.9, eiweiss: 8, fett: 0.1, ballaststoffe: 0 },
  { name: "Worcestershiresauce", aliases: ["worcestershire", "worcestersauce"], kcal: 78, kh: 19, eiweiss: 1.3, fett: 0, ballaststoffe: 0 },
  { name: "Tomatenmark", aliases: ["tomatenmark", "tomato paste", "tomatenkonzentrat"], kcal: 82, kh: 13, eiweiss: 4.3, fett: 0.5, ballaststoffe: 3.3 },
  { name: "Essig", aliases: ["essig", "apfelessig", "wine vinegar", "balsamico", "balsamic"], kcal: 22, kh: 0.9, eiweiss: 0, fett: 0, ballaststoffe: 0 },
  { name: "Zitronensaft", aliases: ["zitronensaft", "lemon juice", "limettensaft"], kcal: 20, kh: 6.9, eiweiss: 0.4, fett: 0.2, ballaststoffe: 0.3 },

  // ── Keto-Spezialprodukte ────────────────────────────────────────────────────
  { name: "Erythrit", aliases: ["erythrit", "erythritol", "süßungsmittel"], kcal: 0, kh: 100, eiweiss: 0, fett: 0, ballaststoffe: 0 },
  { name: "Kokosmehl", aliases: ["kokosmehl", "coconut flour"], kcal: 400, kh: 15, eiweiss: 18, fett: 15, ballaststoffe: 39 },
  { name: "Whey Protein", aliases: ["whey", "protein pulver", "eiweißpulver", "proteinpulver"], kcal: 370, kh: 4, eiweiss: 75, fett: 4, ballaststoffe: 0 },

  // ── Früchte (keto-geeignet) ─────────────────────────────────────────────────
  { name: "Himbeeren", aliases: ["himbeeren", "raspberries"], kcal: 52, kh: 5.4, eiweiss: 1.2, fett: 0.7, ballaststoffe: 6.5 },
  { name: "Erdbeeren", aliases: ["erdbeeren", "strawberries"], kcal: 32, kh: 5.5, eiweiss: 0.7, fett: 0.3, ballaststoffe: 2 },
  { name: "Blaubeeren", aliases: ["blaubeeren", "heidelbeeren", "blueberries"], kcal: 57, kh: 11.5, eiweiss: 0.7, fett: 0.3, ballaststoffe: 2.4 },
  { name: "Zitrone", aliases: ["zitrone", "lemon", "limette", "lime"], kcal: 29, kh: 3.2, eiweiss: 1.1, fett: 0.3, ballaststoffe: 2.8 },
];

export function grundzutatenSuche(q: string): Grundzutat[] {
  const suchbegriff = q.toLowerCase().trim();
  const ergebnisse: { zutat: Grundzutat; score: number }[] = [];

  for (const zutat of GRUNDZUTATEN) {
    const nameLower = zutat.name.toLowerCase();
    // Exakter Treffer im Namen
    if (nameLower === suchbegriff) { ergebnisse.push({ zutat, score: 100 }); continue; }
    // Name beginnt mit Suchbegriff
    if (nameLower.startsWith(suchbegriff)) { ergebnisse.push({ zutat, score: 90 }); continue; }
    // Name enthält Suchbegriff
    if (nameLower.includes(suchbegriff)) { ergebnisse.push({ zutat, score: 80 }); continue; }
    // Alias-Treffer
    for (const alias of zutat.aliases) {
      const aliasLower = alias.toLowerCase();
      if (aliasLower === suchbegriff) { ergebnisse.push({ zutat, score: 85 }); break; }
      if (aliasLower.startsWith(suchbegriff)) { ergebnisse.push({ zutat, score: 75 }); break; }
      if (aliasLower.includes(suchbegriff)) { ergebnisse.push({ zutat, score: 65 }); break; }
      // Suchbegriff enthält Alias (z.B. "hühnerbrühe" findet "brühe")
      if (suchbegriff.includes(aliasLower) && aliasLower.length > 3) { ergebnisse.push({ zutat, score: 55 }); break; }
    }
  }

  return ergebnisse
    .sort((a, b) => b.score - a.score)
    .map(e => e.zutat);
}
