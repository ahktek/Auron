"use client";

import React, { useState } from "react";
import { Menu, Plus, MoveUp, MoveDown, Check, Eye, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface MegaItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
  sublinks: { title: string; href: string }[];
  promoTitle: string;
  promoSubtitle: string;
}

export default function AdminMegaMenuPage() {
  const [menuItems, setMenuItems] = useState<MegaItem[]>([
    {
      id: "wallets",
      label: "Wallets",
      href: "/products/category/wallets",
      badge: "BESTSELLER",
      sublinks: [
        { title: "Slim Wallets", href: "/products/category/wallets" },
        { title: "Card Holders", href: "/products/category/wallets" },
        { title: "Passport Wallets", href: "/products/category/wallets" },
        { title: "Zip & Coin Wallets", href: "/products/category/wallets" },
      ],
      promoTitle: "Crafted for Less Bulk",
      promoSubtitle: "Explore our patent-pending slim bi-fold series with hidden RFID coin pockets.",
    },
    {
      id: "bags",
      label: "Bags",
      href: "/products/category/bags",
      badge: "NEW",
      sublinks: [
        { title: "Backpacks", href: "/products/category/bags" },
        { title: "Crossbody & Slings", href: "/products/category/bags" },
        { title: "Tote Bags", href: "/products/category/bags" },
        { title: "Briefcases & Work", href: "/products/category/bags" },
      ],
      promoTitle: "Weatherproof Canvas",
      promoSubtitle: "Recycled ripstop woven fibers that shield your commute gear from urban downpours.",
    },
    {
      id: "travel",
      label: "Travel",
      href: "/products/category/travel",
      sublinks: [
        { title: "Carry-On Luggage", href: "/products/category/travel" },
        { title: "Packing Cubes", href: "/products/category/travel" },
        { title: "Toiletry Kits", href: "/products/category/travel" },
        { title: "Passport Covers", href: "/products/category/travel" },
      ],
      promoTitle: "Flight-Ready Carry",
      promoSubtitle: "Engineered to glide into overhead bins and slide over rolling luggage handles.",
    },
    {
      id: "tech",
      label: "Tech & Work",
      href: "/products/category/tech",
      sublinks: [
        { title: "Laptop Sleeves", href: "/products/category/tech" },
        { title: "Cable Organizers", href: "/products/category/tech" },
        { title: "Desk Mats", href: "/products/category/tech" },
        { title: "Phone Cases", href: "/products/category/tech" },
      ],
      promoTitle: "Desk to Transit",
      promoSubtitle: "Magnetic cable loops and magnetic closure shells designed for digital nomads.",
    },
    {
      id: "accessories",
      label: "Accessories",
      href: "/products/category/accessories",
      sublinks: [
        { title: "Key Organizers", href: "/products/category/accessories" },
        { title: "Leather Belts", href: "/products/category/accessories" },
        { title: "Notebook Covers", href: "/products/category/accessories" },
        { title: "Water Bottles", href: "/products/category/accessories" },
      ],
      promoTitle: "Daily Essentials",
      promoSubtitle: "Precision brass hardware paired with vegetable-tanned Scandinavian hides.",
    },
  ]);

  const [selectedId, setSelectedId] = useState<string>("wallets");
  const [notification, setNotification] = useState("");

  const activeItem = menuItems.find((m) => m.id === selectedId) || menuItems[0];

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...menuItems];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setMenuItems(newItems);
    showNotification("Navigation order saved.");
  };

  const updateActivePromo = (field: "promoTitle" | "promoSubtitle" | "badge", value: string) => {
    setMenuItems(
      menuItems.map((m) => (m.id === selectedId ? { ...m, [field]: value } : m))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Menu className="w-6 h-6 text-amber-500" />
            Mega-Menu Navigation Editor
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure header mega-menus, category callouts, promo banners, and badges in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={() => showNotification("Navigation menu changes committed to production cache.")}>
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save Menu Layout
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Menu list */}
        <div className="lg:col-span-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-zinc-800">
            <span className="text-xs font-semibold text-zinc-300">Nav Order</span>
            <Button size="sm" variant="ghost" onClick={() => showNotification("Modal open: Add primary menu tab")}>
              <Plus className="w-3 h-3 mr-1" /> Add
            </Button>
          </div>

          <div className="space-y-2">
            {menuItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedId === item.id
                    ? "bg-amber-500/10 border-amber-500/40 text-white"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs">{item.label}</span>
                  {item.badge && (
                    <Badge variant="accent" size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, "up")}
                    className="p-1 hover:bg-zinc-800 rounded disabled:opacity-20 text-zinc-400"
                  >
                    <MoveUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={idx === menuItems.length - 1}
                    onClick={() => moveItem(idx, "down")}
                    className="p-1 hover:bg-zinc-800 rounded disabled:opacity-20 text-zinc-400"
                  >
                    <MoveDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Item Configuration & Live Preview */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Configuring: {activeItem.label}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Header Label</label>
                <input
                  type="text"
                  value={activeItem.label}
                  readOnly
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Pill Badge Text (optional)</label>
                <input
                  type="text"
                  value={activeItem.badge || ""}
                  onChange={(e) => updateActivePromo("badge", e.target.value)}
                  placeholder="e.g. NEW, BESTSELLER"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-zinc-400 mb-1 font-medium">Mega-Menu Promo Tile Title</label>
                <input
                  type="text"
                  value={activeItem.promoTitle}
                  onChange={(e) => updateActivePromo("promoTitle", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-zinc-400 mb-1 font-medium">Mega-Menu Promo Subtitle</label>
                <textarea
                  rows={2}
                  value={activeItem.promoSubtitle}
                  onChange={(e) => updateActivePromo("promoSubtitle", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Sublinks */}
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Sub-Links in Column ({activeItem.sublinks.length})
              </p>
              <div className="grid grid-cols-2 gap-2">
                {activeItem.sublinks.map((link, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <span className="text-zinc-200 font-medium">{link.title}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{link.href}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Preview Simulator */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5 text-zinc-500" />
                Live Dropdown Visual Simulation
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Desktop Flyout 1100px</span>
            </div>

            <div className="bg-white text-zinc-900 rounded-xl p-6 shadow-2xl grid grid-cols-12 gap-6">
              <div className="col-span-7 space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b pb-2">
                  Featured {activeItem.label} Categories
                </h4>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {activeItem.sublinks.map((sub, i) => (
                    <div key={i} className="text-xs font-medium text-zinc-800 hover:text-amber-700">
                      • {sub.title}
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-5 bg-stone-100 rounded-xl p-4 flex flex-col justify-between border border-stone-200">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase">
                    Curated Spotlight
                  </span>
                  <h5 className="font-bold text-sm text-stone-900">{activeItem.promoTitle}</h5>
                  <p className="text-xs text-stone-600 line-clamp-3 mt-1 leading-relaxed">
                    {activeItem.promoSubtitle}
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-stone-900 underline mt-3">
                  Shop Curated Range &rarr;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
