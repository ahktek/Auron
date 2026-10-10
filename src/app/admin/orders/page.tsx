"use client";

import React, { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StoredOrder } from "@/lib/store/productStore";
import {
  Package,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  RefreshCw,
  Phone,
  MapPin,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeOrder, setActiveOrder] = useState<StoredOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTracking, setNewTracking] = useState("");
  const [newCourier, setNewCourier] = useState("Steadfast Courier");
  const [notification, setNotification] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.district.toLowerCase().includes(q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
    );
  });

  const handleUpdateStatus = async (id: string, newStatus: StoredOrder["status"]) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
        if (activeOrder && activeOrder.id === id) {
          setActiveOrder({ ...activeOrder, status: newStatus });
        }
        showNotification(`Order ${id} marked as ${newStatus}.`);
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeOrder.id,
          trackingNumber: newTracking,
          courier: newCourier,
          status: "Shipped",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === activeOrder.id
              ? { ...o, trackingNumber: newTracking, courier: newCourier, status: "Shipped" }
              : o
          )
        );
        showNotification(`Tracking saved for ${activeOrder.id}.`);
      }
    } catch (err) {
      console.error("Failed to update tracking:", err);
    }

    setIsModalOpen(false);
  };

  const openOrderModal = (order: StoredOrder) => {
    setActiveOrder(order);
    setNewTracking(order.trackingNumber || "");
    setNewCourier(order.courier || "Steadfast Courier");
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: StoredOrder["status"]) => {
    switch (status) {
      case "Delivered":
        return <Badge variant="success">Delivered</Badge>;
      case "Shipped":
        return <Badge variant="accent">Shipped</Badge>;
      case "Processing":
        return <Badge variant="teal">Processing</Badge>;
      case "Pending":
        return <Badge variant="warning">Pending</Badge>;
      case "Cancelled":
      case "Refunded":
        return <Badge variant="neutral">{status}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Package className="h-6 w-6 text-[#FF6857]" />
            <span>Customer Orders & Cash on Delivery</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track customer deliveries, update courier tracking (Steadfast, Pathao, RedX), and dispatch parcels.
          </p>
        </div>

        <Button
          onClick={fetchOrders}
          variant="outline"
          size="sm"
          className="gap-1.5 text-zinc-300 border-zinc-700 hover:bg-zinc-800 self-start"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sync Orders</span>
        </Button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Total Orders
          </span>
          <div className="text-2xl font-bold text-white">{orders.length}</div>
        </div>

        <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Processing
          </span>
          <div className="text-2xl font-bold text-amber-400">
            {orders.filter((o) => o.status === "Processing" || o.status === "Pending").length}
          </div>
        </div>

        <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            In Transit (Shipped)
          </span>
          <div className="text-2xl font-bold text-teal-400">
            {orders.filter((o) => o.status === "Shipped").length}
          </div>
        </div>

        <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Completed Revenue
          </span>
          <div className="text-2xl font-bold text-emerald-400">
            {formatPrice(
              orders
                .filter((o) => o.status === "Delivered")
                .reduce((acc, curr) => acc + curr.total, 0),
              "BDT"
            )}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, customer, phone, or tracking..."
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF6857]"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Customer & Contact</th>
                <th className="py-3 px-4 font-semibold">Delivery Location</th>
                <th className="py-3 px-4 font-semibold">Items & Total</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Courier & Tracking</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                    {o.id}
                    <span className="block text-[10px] text-zinc-500 font-normal">{o.date}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white block">{o.customerName}</span>
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {o.phone}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-300 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-zinc-500" /> {o.district}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-white text-sm block">
                      {formatPrice(o.total, "BDT")}
                    </span>
                    <span className="text-[10px] text-zinc-400 block line-clamp-1">
                      {o.itemsSummary}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{getStatusBadge(o.status)}</td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {o.trackingNumber ? (
                      <div>
                        <span className="text-emerald-400 font-bold block">{o.trackingNumber}</span>
                        <span className="text-[10px] text-zinc-500">{o.courier}</span>
                      </div>
                    ) : (
                      <span className="text-zinc-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openOrderModal(o)}
                      className="border-zinc-700 text-zinc-300 hover:text-white"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Tracking Modal */}
      {activeOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Order Management: ${activeOrder.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Customer:</span>
                <span className="font-bold text-white">{activeOrder.customerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Phone:</span>
                <span className="font-mono text-zinc-200">{activeOrder.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Address / City:</span>
                <span className="text-zinc-200">{activeOrder.district}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Total COD Amount:</span>
                <span className="text-base font-bold text-emerald-400">
                  {formatPrice(activeOrder.total, "BDT")}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-zinc-800">
                <span className="text-zinc-400">Items Ordered:</span>
                <span className="text-zinc-300 font-medium">{activeOrder.itemsSummary}</span>
              </div>
            </div>

            {/* Change Status Fast Buttons */}
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">
                Update Order Status
              </label>
              <div className="flex flex-wrap gap-2">
                {(["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"] as const).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(activeOrder.id, st)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        activeOrder.status === st
                          ? "bg-[#FF6857] text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Courier Tracking Form */}
            <form onSubmit={handleSaveTracking} className="space-y-3 pt-2 border-t border-zinc-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Courier Partner</label>
                  <select
                    value={newCourier}
                    onChange={(e) => setNewCourier(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
                  >
                    <option value="Steadfast Courier">Steadfast Courier</option>
                    <option value="Pathao Courier">Pathao Courier</option>
                    <option value="RedX Logistics">RedX Logistics</option>
                    <option value="Sundarban Courier">Sundarban Courier</option>
                    <option value="Paperfly">Paperfly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Tracking Number / ID</label>
                  <input
                    value={newTracking}
                    onChange={(e) => setNewTracking(e.target.value)}
                    placeholder="e.g. STDF-1092819"
                    className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white font-mono focus:outline-none focus:border-[#FF6857]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-zinc-700 text-zinc-300"
                >
                  Close
                </Button>
                <Button type="submit" className="bg-[#FF6857] hover:bg-[#e05646] text-white">
                  Save Tracking & Mark Shipped
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
