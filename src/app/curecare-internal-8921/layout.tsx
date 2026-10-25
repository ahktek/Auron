"use client";

import React from "react";
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
  MessageSquare,
  Star,
  Tag,
  BookOpen,
  Image as ImageIcon,
  Sliders,
  History,
  LogOut,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, don't show admin sidebar
  if (pathname === "/curecare-internal-8921/login") {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Dashboard", href: "/curecare-internal-8921", icon: LayoutDashboard },
    { label: "Products & SKUs", href: "/curecare-internal-8921/products", icon: Package },
    { label: "Categories & Curations", href: "/curecare-internal-8921/categories", icon: FolderTree },
    { label: "Page Builder CMS", href: "/curecare-internal-8921/page-builder", icon: FileCode },
    { label: "Mega-Menu Editor", href: "/curecare-internal-8921/mega-menu", icon: Menu },
    { label: "Orders & Fulfillment", href: "/curecare-internal-8921/orders", icon: ShoppingBag },
    { label: "Customer Inquiries", href: "/curecare-internal-8921/messages", icon: MessageSquare },
    { label: "Review Moderation", href: "/curecare-internal-8921/reviews", icon: Star },
    { label: "Discount Codes", href: "/curecare-internal-8921/discounts", icon: Tag },
    { label: "Journal & Content", href: "/curecare-internal-8921/journal", icon: BookOpen },
    { label: "Media Library", href: "/curecare-internal-8921/media", icon: ImageIcon },
    { label: "Store Settings", href: "/curecare-internal-8921/settings", icon: Sliders },
    { label: "Security & Audit Log", href: "/curecare-internal-8921/audit-log", icon: History },
  ];

  return (
    <div className="dark min-h-screen bg-zinc-950 text-zinc-100 flex font-sans">
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
            <span>admin@curecarebd.com</span>
            <button
              onClick={async () => {
                await fetch("/api/curecare-internal-8921/auth/login", { method: "DELETE" });
                router.push("/curecare-internal-8921/login");
              }}
              className="hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Top Header */}
        <header className="md:hidden border-b border-zinc-800 bg-zinc-900 p-4 flex items-center justify-between">
          <Logo size="sm" textColor="text-white" />
          <div className="flex items-center gap-2">
            <Link
              href="/curecare-internal-8921/messages"
              className="p-2 rounded-lg text-zinc-400 hover:text-white"
              title="Customer Messages"
            >
              <MessageSquare className="h-5 w-5" />
            </Link>
            <Link
              href="/curecare-internal-8921/products"
              className="p-2 rounded-lg text-zinc-400 hover:text-white"
              title="Products"
            >
              <Package className="h-5 w-5" />
            </Link>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
