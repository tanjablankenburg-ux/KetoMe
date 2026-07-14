import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const clean = (s?: string) => (s ?? "").replace(/[﻿​‌‍ ]/g, "").trim();

function tokenAbgelaufen(token: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    return Date.now() > payload.exp * 1000;
  } catch { return true; }
}

function userId(token: string): string | null {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString()).sub;
  } catch { return null; }
}

export async function getAuthToken(req: NextRequest): Promise<
  { token: string; userId: string; newToken?: string; newRefresh?: string } | null
> {
  const token = req.cookies.get("ketome_token")?.value;
  if (!token) return null;

  if (!tokenAbgelaufen(token)) {
    const uid = userId(token);
    return uid ? { token, userId: uid } : null;
  }

  // Token abgelaufen → mit Refresh erneuern
  const refreshToken = req.cookies.get("ketome_refresh")?.value;
  if (!refreshToken) return null;

  const supabase = createClient(clean(process.env.SUPABASE_URL), clean(process.env.SUPABASE_ANON_KEY));
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data.session) return null;

  const uid = userId(data.session.access_token);
  return uid ? {
    token: data.session.access_token,
    userId: uid,
    newToken: data.session.access_token,
    newRefresh: data.session.refresh_token,
  } : null;
}

export function supabaseClient(token: string) {
  return createClient(
    clean(process.env.SUPABASE_URL),
    clean(process.env.SUPABASE_ANON_KEY),
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

export function setCookies(res: NextResponse, newToken: string, newRefresh: string) {
  res.cookies.set("ketome_token", newToken, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
  res.cookies.set("ketome_refresh", newRefresh, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
}
