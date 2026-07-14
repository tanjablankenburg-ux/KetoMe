import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ionos.de",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"VitaKeto App" <${process.env.SMTP_USER}>`,
      to: process.env.BENACHRICHTIGUNG_EMAIL || "hallo@carbbye.de",
      subject: `Neue VitaKeto-Registrierung: ${name}`,
      html: `
        <h2 style="color:#22c55e">Neue Registrierung in VitaKeto 🥑</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Datum:</strong> ${new Date().toLocaleString("de-DE")}</p>
        <hr style="border-color:#eee">
        <p style="color:#999;font-size:12px">VitaKeto by Carbbye</p>
      `,
    });
  } catch (err) {
    console.error("E-Mail Fehler:", err);
  }

  return NextResponse.json({ ok: true });
}

