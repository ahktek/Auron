import { NextRequest, NextResponse } from "next/server";
import {
  getStoredSettings,
  saveStoredSettings,
} from "@/lib/store/productStore";

export async function GET() {
  try {
    const settings = getStoredSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = saveStoredSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("PUT /api/admin/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
