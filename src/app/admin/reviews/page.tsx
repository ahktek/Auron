"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Star, Check, X, Trash2 } from "lucide-react";

interface ReviewQueueItem {
  id: string;
  productName: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  date: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewQueueItem[]>([
    { id: "rev_1", productName: "Apex Transit Backpack 24L", author: "Alexander Hayes", rating: 5, title: "Superior build quality and magnetic details", body: "I've carried this daily for three months across commuting and two cross-country flights.", status: "APPROVED", date: "2026-10-04" },
    { id: "rev_2", productName: "Apex Slim Bifold Wallet", author: "Hannah Price", rating: 5, title: "Goodbye bulky wallet forever", body: "Fits in my front pocket without any noticeable outline. The leather smell and texture are top shelf.", status: "APPROVED", date: "2026-10-02" },
    { id: "rev_3", productName: "Strata Daypack 18L", author: "Anonymous Buyer", rating: 4, title: "Great pack, wish it had one more pocket", body: "Very comfortable and light, but would love a second external key leash.", status: "PENDING", date: "2026-10-06" },
  ]);

  const updateStatus = (id: string, newStatus: ReviewQueueItem["status"]) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Review Moderation & Trust Desk
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Approve, flag, or remove customer endorsements before live storefront display.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-white block">{r.productName}</span>
                <span className="text-xs text-zinc-400">By {r.author} · {r.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    r.status === "APPROVED"
                      ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/40"
                      : r.status === "PENDING"
                      ? "bg-amber-950/60 text-amber-400 border-amber-800/40"
                      : "bg-red-950/60 text-red-400 border-red-800/40"
                  }`}
                >
                  {r.status}
                </span>
              </div>
            </div>

            <div className="flex text-amber-400">
              {[...Array(r.rating)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>

            <h4 className="font-bold text-xs text-white">{r.title}</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">{r.body}</p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-800/80">
              {r.status !== "APPROVED" && (
                <Button
                  size="sm"
                  onClick={() => updateStatus(r.id, "APPROVED")}
                  className="h-8 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </Button>
              )}
              {r.status !== "REJECTED" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStatus(r.id, "REJECTED")}
                  className="h-8 text-xs gap-1 text-zinc-300 border-zinc-700 hover:bg-zinc-800"
                >
                  <X className="h-3.5 w-3.5" /> Reject
                </Button>
              )}
              <button
                onClick={() => deleteReview(r.id)}
                className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
