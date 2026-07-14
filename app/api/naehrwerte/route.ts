import { NextRequest, NextResponse } from "next/server";
import { fsSuche } from "../_fatsecret";
import { grundzutatenSuche } from "../_grundzutaten";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const suche = req.nextUrl.searchParams.get("q")?.trim();
  if (!suche || suche.length < 2) {
    return NextResponse.json({ ergebnisse: [] });
  }

  const fields = "product_name,product_name_de,product_name_en,generic_name_de,generic_name,quantity,nutriments";

  const [offResult, fsResult] = await Promise.allSettled([
    fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(suche)}&search_simple=1&action=process&json=1&page_size=20&fields=${fields}`,
      { headers: { "User-Agent": "VitaKeto/1.0 (vitaketo.app; contact@carbbye.de)" }, signal: AbortSignal.timeout(5000) }
    ).then(r => r.json()),
    fsSuche(suche, 10),
  ]);

  const ergebnisse: { name: string; kcal: number; kh: number; eiweiss: number; fett: number; ballaststoffe: number }[] = [];

  // 1. Eingebaute Grundzutaten — immer verfügbar, sofort, keine API nötig
  for (const z of grundzutatenSuche(suche).slice(0, 5)) {
    ergebnisse.push({ name: z.name, kcal: z.kcal, kh: z.kh, eiweiss: z.eiweiss, fett: z.fett, ballaststoffe: z.ballaststoffe });
  }

  // 2. FatSecret — hat sauberere Zutaten-Namen (z.B. "Zucchini" statt "Veggi Mix Zucchini Bulgur")
  if (fsResult.status === "fulfilled") {
    for (const p of fsResult.value) {
      ergebnisse.push(p);
    }
  }

  if (offResult.status === "fulfilled") {
    const daten = offResult.value as { products?: Record<string, unknown>[] };
    for (const p of daten.products ?? []) {
      const n = (p.nutriments ?? {}) as Record<string, number>;
      const name =
        (p.product_name_de as string) ||
        (p.product_name as string) ||
        (p.product_name_en as string) ||
        (p.generic_name_de as string) ||
        (p.generic_name as string) || "";
      if (!name) continue;
      const kcal = n["energy-kcal_100g"] != null
        ? Math.round(n["energy-kcal_100g"])
        : n["energy_100g"] != null
        ? Math.round(n["energy_100g"] / 4.184)
        : 0;
      const kh = Math.round((n["carbohydrates_100g"] ?? 0) * 10) / 10;
      if (kcal === 0 && kh === 0) continue;
      ergebnisse.push({
        name: name.trim(),
        kcal,
        kh,
        eiweiss:       Math.round((n["proteins_100g"] ?? 0) * 10) / 10,
        fett:          Math.round((n["fat_100g"]      ?? 0) * 10) / 10,
        ballaststoffe: Math.round((n["fiber_100g"]    ?? 0) * 10) / 10,
      });
    }
  }

  // Deduplizieren und auf 8 begrenzen
  const seen = new Set<string>();
  const final = ergebnisse.filter(p => {
    const key = p.name.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 8);

  return NextResponse.json({ ergebnisse: final });
}
