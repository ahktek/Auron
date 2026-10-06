import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // In a production setup, this sends a confirmation email through Mailpit/SMTP and saves to DB.
    // Console log for audit trail:
    console.log(`[Newsletter] Subscribed email: ${email} at ${new Date().toISOString()}`);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for subscribing! Check your inbox to confirm your subscription.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Newsletter Error]", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
