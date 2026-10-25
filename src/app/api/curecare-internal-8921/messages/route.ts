import { NextRequest, NextResponse } from "next/server";
import {
  getStoredMessages,
  updateSupportMessageStatus,
  deleteStoredMessage,
} from "@/lib/store/messageStore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = searchParams.get("query");

    let messages = getStoredMessages();

    if (status && status !== "all") {
      messages = messages.filter((m) => m.status === status);
    }

    if (query) {
      const q = query.toLowerCase().trim();
      messages = messages.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.phone && m.phone.toLowerCase().includes(q)) ||
          m.ticketId.toLowerCase().includes(q) ||
          (m.orderNumber && m.orderNumber.toLowerCase().includes(q)) ||
          m.message.toLowerCase().includes(q) ||
          m.topic.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("GET /api/curecare-internal-8921/messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, adminNotes, replyMethod } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID and status are required" },
        { status: 400 }
      );
    }

    const updated = updateSupportMessageStatus(id, status, adminNotes, replyMethod);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    console.error("PATCH /api/curecare-internal-8921/messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update message" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Message ID is required" },
        { status: 400 }
      );
    }

    const deleted = deleteStoredMessage(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("DELETE /api/curecare-internal-8921/messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
