import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, supabaseClient, setCookies } from "../auth";

export async function GET(req: NextRequest) {
  const auth = await getAuthToken(req);
  if (!auth) return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });

  const supabase = supabaseClient(auth.token);
  const { data, error } = await supabase
    .from("user_data")
    .select("data, updated_at")
    .eq("user_id", auth.userId)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ fehler: error.message }, { status: 500 });
  }

  const res = NextResponse.json({ data: data?.data ?? null, updated_at: data?.updated_at ?? null });
  if (auth.newToken && auth.newRefresh) setCookies(res, auth.newToken, auth.newRefresh);
  return res;
}
