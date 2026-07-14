import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("ketome_token")?.value;
  if (!token) return NextResponse.json({ fehler: "kein_token", cookies: req.cookies.getAll().map(c => c.name) });

  // JWT payload dekodieren (ohne Netzwerkaufruf)
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    const ablauf = new Date(payload.exp * 1000).toISOString();
    const abgelaufen = Date.now() > payload.exp * 1000;

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data, error } = await supabase.from("user_data").select("updated_at").eq("user_id", payload.sub).single();

    return NextResponse.json({
      user_id: payload.sub,
      email: payload.email,
      token_ablauf: ablauf,
      token_abgelaufen: abgelaufen,
      db_eintrag: data ? "vorhanden" : "fehlt",
      db_fehler: error?.message ?? null,
    });
  } catch (e) {
    return NextResponse.json({ fehler: String(e) });
  }
}
