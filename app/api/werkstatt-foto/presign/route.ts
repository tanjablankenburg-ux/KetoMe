import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

function getSupabase() {
  const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/[﻿​‌‍ ]/g, "").trim();
  const key = (process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").replace(/[﻿​‌‍ ]/g, "").trim();
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const { ext, contentType } = await req.json() as { ext: string; contentType: string };
    const safeExt = ext === "png" ? "png" : "jpg";
    const pfad = `werkstatt/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;

    const supabase = getSupabase();
    const { data, error } = await supabase.storage
      .from("werkstatt-fotos")
      .createSignedUploadUrl(pfad);

    if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });

    const { data: { publicUrl } } = supabase.storage
      .from("werkstatt-fotos")
      .getPublicUrl(pfad);

    return NextResponse.json({ signedUrl: data.signedUrl, token: data.token, path: pfad, publicUrl, contentType });
  } catch (e) {
    return NextResponse.json({ fehler: String(e) }, { status: 500 });
  }
}
