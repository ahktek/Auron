"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Badge } from "@/components/ui/Badge";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileCode,
  Menu,
  ShoppingBag,
  Star,
  Tag,
  BookOpen,
  Image as ImageIcon,
  Sliders,
  History,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, don't show admin sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products & SKUs", href: "/admin/products", icon: Package },
    { label: "Categories & Curations", href: "/admin/categories", icon: FolderTree },
    { label: "Page Builder CMS", href: "/admin/page-builder", icon: FileCode },
    { label: "Mega-Menu Editor", href: "/admin/mega-menu", icon: Menu },
    { label: "Orders & Fulfillment", href: "/admin/orders", icon: ShoppingBag },
    { label: "Review Moderation", href: "/admin/reviews", icon: Star },
    { label: "Discount Codes", href: "/admin/discounts", icon: Tag },
    { label: "Journal & Content", href: "/admin/journal", icon: BookOpen },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    { label: "Store Settings", href: "/admin/settings", icon: Sliders },
    { label: "Security & Audit Log", href: "/admin/audit-log", icon: History },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/70 p-5 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Logo size="sm" textColor="text-white" />
            <Badge variant="accent" size="sm">
              OWNER
            </Badge>
          </div>

          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                    isActive
                      ? "bg-[#FF6857] text-white font-semibold shadow-xs"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-zinc-800 space-y-3 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-zinc-400 hover:text-white px-3 py-1.5 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Live Storefront</span>
          </Link>
          <div className="flex items-center justify-between px-3 text-zinc-500">
            <span>admin@curecare.com</span>
            <button
              onClick={() => router.push("/admin/login")}
              className="hover:text-red-400"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0C]">
        {/* Top Minimal Admin Bar */}
        <header className="h-16 border-b border-zinc-800/80 px-8 flex items-center justify-between bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
              Admin CMS Control Center
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Production Store Active</span>
            </div>
          </div>
        </header>

        {/* Subpage Content */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
