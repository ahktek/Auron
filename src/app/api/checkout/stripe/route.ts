import { NextResponse } from "next/server";

interface CartItemInput {
  name?: string;
  title?: string;
  variantName?: string;
  price: number;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerEmail, shippingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (customerEmail || shippingAddress) {
      console.log(`[Checkout Order Intent] Customer: ${customerEmail || "Guest"}`);
    }

    // Calculate line items and totals
    const lineItems = (items as CartItemInput[]).map((item) => ({
      name: item.title || item.name || "Carry Goods",
      variantName: item.variantName || "",
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
    }));

    const subtotal = lineItems.reduce((acc, item) => acc + item.total, 0);
    const shipping = subtotal >= 75 ? 0 : 12;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const grandTotal = subtotal + shipping + tax;

    // Simulated Stripe Checkout Session ID
    const sessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const orderNumber = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;

    return NextResponse.json({
      success: true,
      sessionId,
      orderNumber,
      amounts: {
        subtotal,
        shipping,
        tax,
        grandTotal,
      },
      // In development or demo mode, direct user to checkout confirmation:
      redirectUrl: `/checkout/success?session_id=${sessionId}&order=${orderNumber}`,
    });
  } catch (error) {
    console.error("[Stripe Checkout Session Error]", error);
    return NextResponse.json(
      { error: "Could not create checkout session." },
      { status: 500 }
    );
  }
}
