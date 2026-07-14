import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, supabaseClient, setCookies } from "../auth";

function mergeArrayById(server: unknown[], incoming: unknown[]): unknown[] {
  if (!Array.isArray(server)) return incoming;
  if (!Array.isArray(incoming)) return server;
  const merged = [...server];
  for (const item of incoming) {
    if (item && typeof item === "object") {
      const id = (item as Record<string, unknown>).id;
      if (id && merged.some((s) => (s as Record<string, unknown>).id === id)) continue;
    }
    merged.push(item);
  }
  return merged;
}

function mergeWert(key: string, serverVal: string | undefined, incomingVal: string): string {
  if (!incomingVal || incomingVal === "null" || incomingVal === "[]" || incomingVal === "{}") {
    return serverVal ?? incomingVal;
  }
  if (!serverVal || serverVal === "null" || serverVal === "[]" || serverVal === "{}") {
    return incomingVal;
  }

  // Arrays: zusammenführen
  if (incomingVal.startsWith("[")) {
    try {
      const s = JSON.parse(serverVal);
      const i = JSON.parse(incomingVal);
      if (Array.isArray(s) && Array.isArray(i)) {
        return JSON.stringify(mergeArrayById(s, i));
      }
    } catch {}
  }

  // Startdatum: das frühere behalten
  if (key === "ketome_start_datum") {
    return incomingVal < serverVal ? incomingVal : serverVal;
  }

  // Standardfall: das längere / neuere nehmen
  return incomingVal.length >= serverVal.length ? incomingVal : serverVal;
}

export async function POST(req: NextRequest) {
  const auth = await getAuthToken(req);
  if (!auth) return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ fehler: "Kein Body" }, { status: 400 });

  const supabase = supabaseClient(auth.token);

  // Bestehende Server-Daten laden und mergen
  const { data: existing } = await supabase
    .from("user_data")
    .select("data")
    .eq("user_id", auth.userId)
    .single();

  const serverData: Record<string, string> = (existing?.data as Record<string, string>) ?? {};
  const merged: Record<string, string> = { ...serverData };

  for (const [k, v] of Object.entries(body as Record<string, string>)) {
    merged[k] = mergeWert(k, serverData[k], v);
  }

  const { error } = await supabase
    .from("user_data")
    .upsert({ user_id: auth.userId, data: merged, updated_at: new Date().toISOString() });

  if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });

  const res = NextResponse.json({ ok: true });
  if (auth.newToken && auth.newRefresh) setCookies(res, auth.newToken, auth.newRefresh);
  return res;
}
