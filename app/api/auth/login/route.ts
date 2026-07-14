import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { email, passwort } = await req.json();

  const clean = (s?: string) => (s ?? "").replace(/[﻿​‌‍ ]/g, "").trim();
  const supabase = createClient(
    clean(process.env.SUPABASE_URL),
    clean(process.env.SUPABASE_ANON_KEY)
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: passwort,
  });

  if (error) {
    return NextResponse.json({ fehler: error.message }, { status: 400 });
  }

  const name = data.user.user_metadata?.name || data.user.email?.split("@")[0] || "";
  const res = NextResponse.json({ ok: true });
  res.cookies.set("ketome_token", data.session.access_token, {
    httpOnly: true, secure: true, sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, path: "/",
  });
  res.cookies.set("ketome_refresh", data.session.refresh_token, {
    httpOnly: true, secure: true, sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, path: "/",
  });
  res.cookies.set("ketome_name", name, {
    httpOnly: false, secure: true, sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, path: "/",
  });
  return res;
}
