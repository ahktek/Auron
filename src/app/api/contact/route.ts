import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, topic, orderNumber, message, botField } = body;

    // Honeypot spam defense: If invisible botField is filled, reject silently or 400
    if (botField) {
      return NextResponse.json(
        { error: "Spam detected." },
        { status: 400 }
      );
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields (name, email, message)." },
        { status: 400 }
      );
    }

    console.log(`[Support Ticket Created] From: ${name} (${email}) | Topic: ${topic || "General"} | Order: ${orderNumber || "N/A"}`);

    return NextResponse.json(
      {
        success: true,
        ticketId: `TCK-${Math.floor(100000 + Math.random() * 900000)}`,
        message: "Your message has been received. Our concierge team typically replies within 24 hours.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Contact API Error]", error);
    return NextResponse.json(
      { error: "Unable to submit message at this time." },
      { status: 500 }
    );
  }
}
