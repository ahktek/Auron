import { NextResponse } from "next/server";
import { saveSupportMessage } from "@/lib/store/messageStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, topic, orderNumber, message, botField } = body;

    // Honeypot spam defense: If invisible botField is filled, reject
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

    // Save message directly to message store
    const savedMsg = saveSupportMessage({
      name,
      email,
      phone,
      topic,
      orderNumber,
      message,
    });

    console.log(`[Support Ticket Created] ID: ${savedMsg.ticketId} | From: ${name} (${email}) | Topic: ${topic || "General"} | Phone: ${phone || "N/A"}`);

    return NextResponse.json(
      {
        success: true,
        ticketId: savedMsg.ticketId,
        message: "Your message has been received by the Cure-Care concierge team. We will get back to you promptly.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Contact API Error]", error);
    return NextResponse.json(
      { error: "Unable to submit message at this time. Please contact us via WhatsApp." },
      { status: 500 }
    );
  }
}
