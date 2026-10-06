"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Plus, Tag, Trash2 } from "lucide-react";

interface DiscountRule {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED" | "FREE_SHIPPING";
  value: number;
  minSubtotal: number;
  usedCount: number;
  isActive: boolean;
}

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountRule[]>([
    { id: "d1", code: "WELCOME10", type: "PERCENT", value: 10, minSubtotal: 50, usedCount: 142, isActive: true },
    { id: "d2", code: "FREESHIP", type: "FREE_SHIPPING", value: 0, minSubtotal: 100, usedCount: 89, isActive: true },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newValue, setNewValue] = useState(15);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;
    setDiscounts([
      ...discounts,
      {
        id: `d_${Date.now()}`,
        code: newCode.toUpperCase(),
        type: "PERCENT",
        value: newValue,
        minSubtotal: 50,
        usedCount: 0,
        isActive: true,
      },
    ]);
    setIsModalOpen(false);
    setNewCode("");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Promotional & Discount Engine
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Percentage discounts, fixed coupons, and free delivery thresholds.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span>New Discount Code</span>
        </Button>
      </div>

      <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950/60 text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Coupon Code</th>
              <th className="py-3 px-4 font-semibold">Type & Value</th>
              <th className="py-3 px-4 font-semibold">Min Subtotal</th>
              <th className="py-3 px-4 font-semibold">Total Uses</th>
              <th className="py-3 px-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {discounts.map((d) => (
              <tr key={d.id} className="hover:bg-zinc-800/30">
                <td className="py-3 px-4 font-mono font-bold text-white flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-[#C25E34]" />
                  <span>{d.code}</span>
                </td>
                <td className="py-3 px-4 font-semibold">
                  {d.type === "PERCENT"
                    ? `${d.value}% Off`
                    : d.type === "FREE_SHIPPING"
                    ? "Free Shipping"
                    : `$${d.value} Off`}
                </td>
                <td className="py-3 px-4 text-zinc-400">${d.minSubtotal}.00</td>
                <td className="py-3 px-4 font-bold text-white">{d.usedCount}</td>
                <td className="py-3 px-4 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 text-[10px] font-bold border border-emerald-800/40">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Promotional Discount Code"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Discount Code"
            required
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="SUMMER20"
          />
          <Input
            label="Percentage Off (%)"
            type="number"
            min={1}
            max={100}
            required
            value={newValue}
            onChange={(e) => setNewValue(Number(e.target.value))}
          />
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Code
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
