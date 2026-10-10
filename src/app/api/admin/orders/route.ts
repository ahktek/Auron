import { NextRequest, NextResponse } from "next/server";
import {
  getStoredOrders,
  updateStoredOrder,
  createStoredOrder,
  StoredOrder,
} from "@/lib/store/productStore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let orders = getStoredOrders();

    if (search) {
      const q = search.toLowerCase().trim();
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.email.toLowerCase().includes(q) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    const updated = updateStoredOrder(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("PUT /api/admin/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newOrder: StoredOrder = {
      id: body.id || `ORD-BD-${Date.now().toString().slice(-6)}`,
      customerName: body.customerName || "Customer",
      email: body.email || "customer@curecarebd.com",
      phone: body.phone || "+880 1700-000000",
      district: body.district || "Dhaka",
      total: Number(body.total) || 1000,
      status: body.status || "Pending",
      trackingNumber: body.trackingNumber,
      courier: body.courier || "Steadfast Courier",
      date: new Date().toISOString().split("T")[0],
      itemsCount: Number(body.itemsCount) || 1,
      itemsSummary: body.itemsSummary || "Cure-Care Essentials",
    };

    const saved = createStoredOrder(newOrder);
    return NextResponse.json({ success: true, order: saved });
  } catch (error) {
    console.error("POST /api/admin/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
