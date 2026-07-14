import { NextRequest, NextResponse } from "next/server";
import { fsBarcode } from "../_fatsecret";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const barcode = req.nextUrl.searchParams.get("code")?.trim();
  if (!barcode) return NextResponse.json({ produkt: null });

  // 1. Open Food Facts
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,product_name_de,product_name_en,generic_name,generic_name_de,quantity,nutriments`,
      { headers: { "User-Agent": "VitaKeto/1.0 (vitaketo.app; contact@carbbye.de)" }, signal: AbortSignal.timeout(5000) }
    );
    const data = await res.json() as { status: number; product?: Record<string, unknown> };
    if (data.status === 1 && data.product) {
      const p = data.product;
      const n = (p.nutriments ?? {}) as Record<string, number>;
      const kcal = Math.round(
        n["energy-kcal_100g"] ?? n["energy-kcal"] ??
        (n["energy_100g"] ? n["energy_100g"] / 4.184 : 0)
      );
      const kh = Math.round((n["carbohydrates_100g"] ?? n["carbohydrates"] ?? 0) * 10) / 10;
      if (kcal > 0 || kh > 0) {
        return NextResponse.json({
          produkt: {
            name: (p.product_name_de || p.product_name || p.product_name_en || p.generic_name_de || p.generic_name || "Unbekannt") as string,
            menge: (p.quantity || "100g") as string,
            kcal,
            kh,
            eiweiss:       Math.round((n["proteins_100g"] ?? 0) * 10) / 10,
            fett:          Math.round((n["fat_100g"]      ?? 0) * 10) / 10,
            ballaststoffe: Math.round((n["fiber_100g"]    ?? 0) * 10) / 10,
            quelle: "off",
          },
        });
      }
    }
  } catch { /* weiter zu FatSecret */ }

  // 2. FatSecret Fallback
  try {
    const produkt = await fsBarcode(barcode);
    if (produkt) {
      return NextResponse.json({ produkt: { ...produkt, quelle: "fatsecret" } });
    }
  } catch { /* nicht gefunden */ }

  return NextResponse.json({ produkt: null });
}
