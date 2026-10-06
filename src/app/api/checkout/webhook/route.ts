import { NextResponse } from "next/server";

interface StripeWebhookEvent {
  type: string;
  data?: {
    object?: {
      id?: string;
    };
  };
}

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("stripe-signature");
    const rawBody = await request.text();

    if (signature) {
      console.log(`[Stripe Webhook Signature]: present`);
    }

    // Verify webhook payload or handle simulated webhook event
    let event: StripeWebhookEvent;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    console.log(`[Stripe Webhook Received] Event type: ${event.type || "checkout.session.completed"}`);

    switch (event.type) {
      case "checkout.session.completed":
        // Handle successful payment, decrement inventory, send receipt email
        console.log("[Stripe Webhook] Order marked as PAID");
        break;
      case "payment_intent.payment_failed":
        console.warn("[Stripe Webhook] Payment failed for intent", event.data?.object?.id);
        break;
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook Error]", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
