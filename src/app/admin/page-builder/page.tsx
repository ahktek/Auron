"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  GripVertical,
  Plus,
  Eye,
  Save,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
} from "lucide-react";

interface SectionBlock {
  id: string;
  type: "hero_carousel" | "promo_tiles" | "activity_grid" | "product_rail" | "brand_values" | "video_reels" | "faq" | "newsletter";
  title: string;
  isEnabled: boolean;
}

export default function AdminPageBuilderPage() {
  const [blocks, setBlocks] = useState<SectionBlock[]>([
    { id: "b1", type: "hero_carousel", title: "Rotating Hero Banner Carousel (3 Slides)", isEnabled: true },
    { id: "b2", type: "promo_tiles", title: "Promo Tile Quick-Strip (8 Links)", isEnabled: true },
    { id: "b3", type: "activity_grid", title: "'Gear Up For...' Activity Grid (6 Journeys)", isEnabled: true },
    { id: "b4", type: "product_rail", title: "Tabbed Product Rail (Bestsellers, New, Value Sets)", isEnabled: true },
    { id: "b5", type: "brand_values", title: "Brand Values & B Corp Certification Badges", isEnabled: true },
    { id: "b6", type: "video_reels", title: "Video/Reel Feature Cards (5 Silhouettes)", isEnabled: true },
    { id: "b7", type: "newsletter", title: "Inline Newsletter & Consent Capture", isEnabled: true },
  ]);

  const [savedNotice, setSavedNotice] = useState(false);

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setBlocks(newBlocks);
  };

  const toggleBlock = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isEnabled: !b.isEnabled } : b))
    );
  };

  const handlePublish = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Homepage CMS Page Builder
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Visual modular section reordering, block configuration, and on-demand ISR publishing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handlePublish} size="sm" className="gap-1.5">
            <Save className="h-4 w-4" />
            <span>{savedNotice ? "Published to Edge!" : "Publish Changes"}</span>
          </Button>
        </div>
      </div>

      <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs text-zinc-400 font-semibold">
          <span>Active Layout Sections (Drag & Reorder)</span>
          <span>Status</span>
        </div>

        <div className="space-y-3">
          {blocks.map((block, idx) => (
            <div
              key={block.id}
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                block.isEnabled
                  ? "bg-zinc-950/80 border-zinc-800 text-white"
                  : "bg-zinc-950/30 border-zinc-900 text-zinc-600 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-zinc-600" />
                <span className="text-xs font-mono text-zinc-500 w-5">#{idx + 1}</span>
                <span className="font-semibold text-xs">{block.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveBlock(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => moveBlock(idx, "down")}
                  disabled={idx === blocks.length - 1}
                  className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => toggleBlock(block.id)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                    block.isEnabled
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/50"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700"
                  }`}
                >
                  {block.isEnabled ? "Visible" : "Hidden"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
