import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ fehler: "Webhook-Signatur ungültig" }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId  = session.metadata?.user_id;
    const typ     = session.metadata?.typ;
    if (!userId) return NextResponse.json({ ok: true });

    if (typ === "ki_paket") {
      // 100 KI-Anfragen gutschreiben
      const { data } = await supabase
        .from("user_data").select("data").eq("user_id", userId).single();
      const daten = (data?.data as Record<string, string>) ?? {};
      const aktuell = parseInt(daten["ketome_ki_guthaben"] || "0");
      daten["ketome_ki_guthaben"] = String(aktuell + 100);
      await supabase.from("user_data")
        .upsert({ user_id: userId, data: daten, updated_at: new Date().toISOString() });
    } else {
      // Premium aktivieren
      const art = typ === "jaehrlich" ? "premium_jaehrlich" : "premium_monatlich";
      const { data } = await supabase
        .from("user_data").select("data").eq("user_id", userId).single();
      const daten = (data?.data as Record<string, string>) ?? {};
      daten["ketome_premium"]       = "true";
      daten["ketome_premium_art"]   = art;
      daten["ketome_premium_seit"]  = new Date().toISOString();
      daten["ketome_stripe_customer"] = session.customer as string;
      daten["ketome_stripe_sub"]    = session.subscription as string;
      await supabase.from("user_data")
        .upsert({ user_id: userId, data: daten, updated_at: new Date().toISOString() });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub    = event.data.object as Stripe.Subscription;
    const userId = sub.metadata?.user_id;
    if (!userId) return NextResponse.json({ ok: true });

    const { data } = await supabase
      .from("user_data").select("data").eq("user_id", userId).single();
    const daten = (data?.data as Record<string, string>) ?? {};
    daten["ketome_premium"]     = "false";
    daten["ketome_premium_art"] = "";
    await supabase.from("user_data")
      .upsert({ user_id: userId, data: daten, updated_at: new Date().toISOString() });
  }

  return NextResponse.json({ ok: true });
}
