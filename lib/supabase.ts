import { createClient } from "@supabase/supabase-js";

function clean(s: string | undefined, fallback: string) {
  return (s ?? fallback).replace(/[﻿​‌‍ ]/g, "").trim();
}

const url = clean(process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL, "https://placeholder.supabase.co");
const key = clean(process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "placeholder");

export const supabase = createClient(url, key);
