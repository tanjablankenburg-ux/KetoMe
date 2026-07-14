import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthToken } from "../../sync/auth";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const auth = await getAuthToken(req);
  if (!auth) return NextResponse.json({ fehler: "Nicht eingeloggt" }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("user_data").select("data").eq("user_id", auth.userId).single();
  const daten = (data?.data as Record<string, string>) ?? {};
  const customerId = daten["ketome_stripe_customer"];

  if (!customerId) return NextResponse.json({ fehler: "Kein Stripe-Kunde" }, { status: 404 });

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.vitaketo.app"}/profil`,
  });

  return NextResponse.json({ url: session.url });
}
