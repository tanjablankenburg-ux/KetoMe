import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getSupabase() {
  const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/[﻿​‌‍ ]/g, "").trim();
  const key = (process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").replace(/[﻿​‌‍ ]/g, "").trim();
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("foto") as File | null;
    if (!file) return NextResponse.json({ fehler: "Keine Datei" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.type === "image/png" ? "png" : "jpg";
    const pfad = `werkstatt/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const supabase = getSupabase();
    const { error } = await supabase.storage
      .from("werkstatt-fotos")
      .upload(pfad, buffer, { contentType: file.type, upsert: false });

    if (error) return NextResponse.json({ fehler: error.message }, { status: 500 });

    const { data: { publicUrl } } = supabase.storage
      .from("werkstatt-fotos")
      .getPublicUrl(pfad);

    return NextResponse.json({ url: publicUrl });
  } catch (e) {
    return NextResponse.json({ fehler: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json() as { url: string };
    if (!url || !url.includes("werkstatt-fotos")) return NextResponse.json({ ok: true });

    // Pfad aus URL extrahieren
    const match = url.match(/werkstatt-fotos\/(.+)$/);
    if (!match) return NextResponse.json({ ok: true });

    const supabase = getSupabase();
    await supabase.storage.from("werkstatt-fotos").remove([match[1]]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
