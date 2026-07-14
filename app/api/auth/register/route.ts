import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { name, email, passwort } = await req.json();

  const clean = (s?: string) => (s ?? "").replace(/[﻿​‌‍ ]/g, "").trim();
  const supabase = createClient(
    clean(process.env.SUPABASE_URL),
    clean(process.env.SUPABASE_ANON_KEY)
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password: passwort,
    options: { data: { name } },
  });

  if (error) {
    return NextResponse.json({ fehler: error.message }, { status: 400 });
  }

  // E-Mail-Benachrichtigung
  if (data.user) {
    try {
      const { default: nodemailer } = await import("nodemailer");
      const t = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.ionos.de",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await t.sendMail({
        from: `"VitaKeto App" <${process.env.SMTP_USER}>`,
        to: process.env.BENACHRICHTIGUNG_EMAIL || "hallo@carbbye.de",
        subject: `Neue VitaKeto-Registrierung: ${name}`,
        html: `<h2 style="color:#22c55e">Neue Registrierung 🥑</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>E-Mail:</strong> ${email}</p>
          <p><strong>Datum:</strong> ${new Date().toLocaleString("de-DE")}</p>`,
      });
    } catch (e) {
      console.error("E-Mail Fehler:", e);
    }
  }

  // FluentCRM: Kontakt automatisch anlegen
  if (data.user) {
    try {
      const fcUser = process.env.FLUENTCRM_USER;
      const fcPass = process.env.FLUENTCRM_PASS;
      const fcList = process.env.FLUENTCRM_LIST_ID || "1";
      if (fcUser && fcPass) {
        const auth = Buffer.from(`${fcUser}:${fcPass}`).toString("base64");
        await fetch("https://carbbye.de/wp-json/fluentcrm/v2/contacts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${auth}`,
          },
          body: JSON.stringify({
            email,
            first_name: name,
            status: "subscribed",
            lists: [parseInt(fcList)],
          }),
        });
      }
    } catch (e) {
      console.error("FluentCRM Fehler:", e);
    }
  }

  // Wenn keine E-Mail-Bestätigung nötig → Cookie setzen
  if (data.session) {
    const res = NextResponse.json({ ok: true, weiter: true });
    res.cookies.set("ketome_token", data.session.access_token, {
      httpOnly: true, secure: true, sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, path: "/",
    });
    res.cookies.set("ketome_name", name, {
      httpOnly: false, secure: true, sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, path: "/",
    });
    return res;
  }

  return NextResponse.json({ ok: true, emailBestaetigung: true });
}


