// Lebensmittelsuche: FatSecret (primär) + Open Food Facts (Fallback)

let tokenCache: { token: string; expires: number } | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expires) return tokenCache.token;

  const creds = Buffer.from(
    `${process.env.FATSECRET_CLIENT_ID}:${process.env.FATSECRET_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://oauth.fatsecret.com/connect/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=basic",
    signal: AbortSignal.timeout(5000),
  });

  const data = await res.json() as { access_token: string; expires_in: number };
  tokenCache = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 };
  return tokenCache.token;
}

export type FsProdukt = {
  name: string;
  menge: string;
  kcal: number;
  kh: number;
  eiweiss: number;
  fett: number;
  ballaststoffe: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseServings(food: any): FsProdukt | null {
  const servings = food.servings?.serving;
  const list = Array.isArray(servings) ? servings : servings ? [servings] : [];
  const s = list.find((x: { serving_description?: string }) =>
    x.serving_description?.includes("100")
  ) ?? list[0];
  if (!s) return null;

  return {
    name: food.food_name ?? "",
    menge: s.serving_description ?? "100g",
    kcal:          Math.round(parseFloat(s.calories)      || 0),
    kh:            Math.round((parseFloat(s.carbohydrate)  || 0) * 10) / 10,
    eiweiss:       Math.round((parseFloat(s.protein)       || 0) * 10) / 10,
    fett:          Math.round((parseFloat(s.fat)           || 0) * 10) / 10,
    ballaststoffe: Math.round((parseFloat(s.fiber)         || 0) * 10) / 10,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseFsResults(list: any[]): FsProdukt[] {
  return list.map((f: any) => {
    const desc: string = f.food_description ?? "";
    const num = (label: string) => {
      const m = desc.match(new RegExp(`${label}:\\s*([\\d.]+)`));
      return m ? Math.round(parseFloat(m[1]) * 10) / 10 : 0;
    };
    return {
      name:          f.food_name ?? "",
      menge:         "100g",
      kcal:          Math.round(num("Calories")),
      kh:            num("Carbs"),
      eiweiss:       num("Protein"),
      fett:          num("Fat"),
      ballaststoffe: 0,
    };
  }).filter(p => p.name && (p.kcal > 0 || p.kh > 0));
}

async function fsSearch(token: string, q: string, maxResults: number, lang?: string): Promise<FsProdukt[]> {
  try {
    const langParam = lang ? `&language=${lang}&region=DE` : "";
    const url = `https://platform.fatsecret.com/rest/foods/search/v1?search_expression=${encodeURIComponent(q)}&format=json&max_results=${maxResults}&include_food_sub_categories=true${langParam}`;
    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json() as { foods?: { food?: unknown[] | unknown } };
    const foods = data.foods?.food;
    const list = Array.isArray(foods) ? foods : foods ? [foods] : [];
    return parseFsResults(list as any[]);
  } catch {
    return [];
  }
}

async function offSearch(q: string, maxResults: number): Promise<FsProdukt[]> {
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&lc=de&cc=de&page_size=${maxResults}&fields=product_name,nutriments`;
    const res = await fetch(url, {
      headers: { "User-Agent": "VitaKeto-App/1.0 (hallo@carbbye.de)" },
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json() as { products?: any[] };
    return (data.products ?? [])
      .map((p: any) => {
        const n = p.nutriments ?? {};
        const kcal = Math.round(parseFloat(n["energy-kcal_100g"] ?? n["energy-kcal"] ?? 0) || 0);
        const kh   = Math.round((parseFloat(n["carbohydrates_100g"] ?? 0) || 0) * 10) / 10;
        const name = (p.product_name ?? "").trim();
        if (!name || (kcal === 0 && kh === 0)) return null;
        return {
          name, menge: "100g", kcal, kh,
          eiweiss:       Math.round((parseFloat(n["proteins_100g"]    ?? 0) || 0) * 10) / 10,
          fett:          Math.round((parseFloat(n["fat_100g"]          ?? 0) || 0) * 10) / 10,
          ballaststoffe: Math.round((parseFloat(n["fiber_100g"]        ?? 0) || 0) * 10) / 10,
        } as FsProdukt;
      })
      .filter(Boolean) as FsProdukt[];
  } catch {
    return [];
  }
}

function merge(primary: FsProdukt[], secondary: FsProdukt[], max: number): FsProdukt[] {
  const seen = new Set(primary.map(p => p.name.toLowerCase()));
  return [...primary, ...secondary.filter(p => !seen.has(p.name.toLowerCase()))].slice(0, max);
}

export async function fsSuche(q: string, maxResults = 10): Promise<FsProdukt[]> {
  const token = await getToken();
  const [deResults, offResults] = await Promise.all([
    fsSearch(token, q, maxResults, "de"),
    offSearch(q, maxResults),
  ]);
  const combined = merge(deResults, offResults, maxResults);
  if (deResults.length === 0) {
    const intlResults = await fsSearch(token, q, maxResults);
    return merge(combined, intlResults, maxResults);
  }
  return combined;
}

export async function fsBarcode(barcode: string): Promise<FsProdukt | null> {
  const token = await getToken();
  const url = `https://platform.fatsecret.com/rest/food/barcode/find-by-barcode/v1?barcode=${barcode}&format=json`;
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` },
    signal: AbortSignal.timeout(5000),
  });
  const data = await res.json() as { food?: unknown; error?: unknown };
  if (!data.food || data.error) return null;
  return parseServings(data.food);
}
