import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthToken } from "../../sync/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const auth = await getAuthToken(req);
  if (!auth) return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });

  const { typ } = await req.json(); // "monatlich" | "jaehrlich" | "ki_paket"

  const preisMap: Record<string, string> = {
    monatlich:   process.env.STRIPE_PRICE_MONATLICH!,
    jaehrlich:   process.env.STRIPE_PRICE_JAEHRLICH!,
    ki_paket:    process.env.STRIPE_PRICE_KI_PAKET!,
  };

  const priceId = preisMap[typ];
  if (!priceId) return NextResponse.json({ fehler: "Unbekannter Typ" }, { status: 400 });

  const isEinmalig = typ === "ki_paket";

  const session = await stripe.checkout.sessions.create({
    mode: isEinmalig ? "payment" : "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.vitaketo.app"}/premium/erfolg?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL || "https://www.vitaketo.app"}/premium`,
    metadata: { user_id: auth.userId, typ },
    allow_promotion_codes: true,
    locale: "de",
  });

  return NextResponse.json({ url: session.url });
}
