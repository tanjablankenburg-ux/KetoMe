import { NextRequest, NextResponse } from "next/server";
import { fsSuche } from "../_fatsecret";

// Edge runtime unterstützt kein Buffer — Node runtime nötig für FatSecret OAuth
export const runtime = "nodejs";

interface OFFProduct {
  product_name?: string;
  product_name_de?: string;
  product_name_en?: string;
  generic_name_de?: string;
  generic_name?: string;
  quantity?: string;
  nutriments?: Record<string, number>;
}

function parseOFF(p: OFFProduct) {
  const n = p.nutriments ?? {};
  const name =
    p.product_name_de ||
    p.product_name ||
    p.product_name_en ||
    p.generic_name_de ||
    p.generic_name ||
    "";
  if (!name) return null;
  const kcal = Math.round(
    n["energy-kcal_100g"] ??
    n["energy-kcal"] ??
    (n["energy_100g"] ? n["energy_100g"] / 4.184 : 0)
  );
  const kh = Math.round((n["carbohydrates_100g"] ?? n["carbohydrates"] ?? 0) * 10) / 10;
  if (kcal === 0 && kh === 0) return null;
  return {
    name: name.trim(),
    menge: p.quantity || "100g",
    kcal,
    kh,
    ballaststoffe: Math.round((n["fiber_100g"]    ?? n["fiber"]    ?? 0) * 10) / 10,
    eiweiss:       Math.round((n["proteins_100g"] ?? n["proteins"] ?? 0) * 10) / 10,
    fett:          Math.round((n["fat_100g"]      ?? n["fat"]      ?? 0) * 10) / 10,
  };
}

function deduplizieren<T extends { name: string }>(arr: T[]): T[] {
  const seen = new Set<string>();
  return arr.filter(p => {
    const key = p.name.toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ produkte: [] });

  const fields = "product_name,product_name_de,product_name_en,generic_name_de,generic_name,quantity,nutriments";

  // OFF + FatSecret parallel
  const [offResult, fsResult] = await Promise.allSettled([
    // Open Food Facts — zwei Endpunkte parallel
    Promise.allSettled([
      fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&json=1&page_size=30&fields=${fields}&search_simple=1&action=process`,
        { headers: { "User-Agent": "VitaKeto/1.0 (vitaketo.app; contact@carbbye.de)" }, signal: AbortSignal.timeout(5000) }
      ).then(r => r.json()),
      fetch(
        `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(q)}&page_size=20&fields=${fields}`,
        { headers: { "User-Agent": "VitaKeto/1.0 (vitaketo.app; contact@carbbye.de)" }, signal: AbortSignal.timeout(5000) }
      ).then(r => r.json()),
    ]),
    // FatSecret
    fsSuche(q, 15),
  ]);

  const produkte: ReturnType<typeof parseOFF>[] = [];

  // OFF-Ergebnisse verarbeiten
  if (offResult.status === "fulfilled") {
    for (const r of offResult.value) {
      if (r.status !== "fulfilled") continue;
      const data = r.value as { products?: OFFProduct[] };
      (data.products ?? []).map(parseOFF).filter(Boolean).forEach(p => produkte.push(p));
    }
  }

  // FatSecret-Ergebnisse anhängen
  if (fsResult.status === "fulfilled") {
    fsResult.value.forEach(p => produkte.push(p));
  }

  const final = deduplizieren(produkte.filter(Boolean) as NonNullable<ReturnType<typeof parseOFF>>[]);

  return NextResponse.json({ produkte: final.slice(0, 40) }, {
    headers: { "Cache-Control": "public, max-age=1800" },
  });
}
