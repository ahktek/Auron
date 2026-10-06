"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/lib/store/cartContext";
import { PRODUCTS, ProductItem } from "@/lib/store/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  MapPin,
  Heart,
  User,
  Mail,
  ShieldCheck,
  Download,
  Trash2,
  LogOut,
  Plus,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { wishlist, currency } = useCart();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "wishlist" | "profile" | "privacy">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState("customer@example.com");

  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem("auren_orders");
      if (storedOrders) setOrders(JSON.parse(storedOrders));
      else {
        // Sample order for demo
        setOrders([
          {
            orderNumber: "AUR-928104",
            createdAt: "2026-09-24",
            finalTotal: 199.0,
            status: "Delivered",
            items: [
              { productName: "Apex Transit Backpack 24L", variantTitle: "Charcoal Ink", quantity: 1, price: 199.0 },
            ],
          },
        ]);
      }
      const email = localStorage.getItem("auren_customer_email");
      if (email) setUserEmail(email);
    } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auren_customer_logged_in");
    router.push("/");
  };

  const handleExportData = () => {
    const data = {
      user: { email: userEmail, name: "Marcus Vance" },
      orders,
      wishlist,
      exportTimestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auren_customer_data_${Date.now()}.json`;
    a.click();
  };

  const handleDeleteData = () => {
    if (confirm("Are you sure you wish to permanently delete your account and personal records under GDPR/CCPA regulations?")) {
      localStorage.removeItem("auren_orders");
      localStorage.removeItem("auren_wishlist");
      localStorage.removeItem("auren_customer_logged_in");
      alert("All records permanently deleted.");
      router.push("/");
    }
  };

  const wishlistedProducts = wishlist
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter(Boolean) as ProductItem[];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <Container>
          {/* Account Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-zinc-200 dark:border-zinc-800 mb-8 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C25E34]">
                Customer Membership
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Welcome back, {userEmail.split("@")[0]}
              </h1>
              <p className="text-xs text-zinc-500">{userEmail}</p>
            </div>

            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-1.5 self-start">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation (3 cols) */}
            <div className="lg:col-span-3 space-y-1">
              {[
                { id: "orders", label: "Order History", icon: Package },
                { id: "wishlist", label: `Wishlist (${wishlist.length})`, icon: Heart },
                { id: "addresses", label: "Address Book", icon: MapPin },
                { id: "profile", label: "Email Preferences", icon: Mail },
                { id: "privacy", label: "GDPR Data & Privacy", icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area (9 cols) */}
            <div className="lg:col-span-9 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              {/* Tab 1: Orders */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    Order History ({orders.length})
                  </h3>

                  {orders.length === 0 ? (
                    <div className="py-12 text-center text-zinc-500 text-sm">
                      No previous orders found.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, idx) => (
                        <div
                          key={idx}
                          className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 gap-2">
                            <div>
                              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                                {order.orderNumber}
                              </span>
                              <p className="text-xs text-zinc-400">
                                Placed on {order.createdAt?.split("T")[0] || "Recent"}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="success" size="sm">
                                {order.status || "Paid & Dispatched"}
                              </Badge>
                              <Link href={`/orders/${order.orderNumber}`}>
                                <Button variant="outline" size="sm">
                                  Track
                                </Button>
                              </Link>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs">
                            {order.items?.map((item: any, iIdx: number) => (
                              <div key={iIdx} className="flex justify-between text-zinc-600 dark:text-zinc-400">
                                <span>
                                  {item.productName} ({item.variantTitle}) x{item.quantity}
                                </span>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                  {formatPrice(item.price * item.quantity, currency)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between font-bold text-sm">
                            <span>Total Paid</span>
                            <span>{formatPrice(order.finalTotal, currency)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Wishlist */}
              {activeTab === "wishlist" && (
                <div className="space-y-6">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    Saved Carry Items ({wishlistedProducts.length})
                  </h3>

                  {wishlistedProducts.length === 0 ? (
                    <div className="py-12 text-center text-zinc-500 text-sm">
                      Your wishlist is empty. Click the heart icon on any product to save it.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistedProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Addresses */}
              {activeTab === "addresses" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                      Saved Shipping Addresses
                    </h3>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Address</span>
                    </Button>
                  </div>

                  <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2 max-w-md">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">Primary Residence</span>
                      <Badge variant="accent" size="sm">Default</Badge>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Marcus Vance
                      <br />
                      742 Evergreen Terrace
                      <br />
                      Portland, OR 97201
                      <br />
                      United States
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 4: Profile & Preferences */}
              {activeTab === "profile" && (
                <div className="space-y-6 max-w-lg">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    Email Subscriptions & Dispatch Alerts
                  </h3>
                  <div className="space-y-3 text-xs">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#C25E34]" />
                      <span>Transactional courier shipment status notifications</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#C25E34]" />
                      <span>Early access to limited studio collaborations</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-[#C25E34]" />
                      <span>The AUREN Journal monthly editorial digest</span>
                    </label>
                  </div>
                  <Button size="sm">Save Preferences</Button>
                </div>
              )}

              {/* Tab 5: GDPR Data Privacy */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    GDPR & CCPA Data Governance
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-xl">
                    Under GDPR Article 15 (Right of Access) and Article 17 (Right to Erasure), you can export your entire purchase history, address records, and cookie activity in JSON format, or request permanent cryptographic erasure.
                  </p>

                  <div className="pt-4 flex flex-wrap gap-4">
                    <Button onClick={handleExportData} variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      <span>Export All My Data (JSON)</span>
                    </Button>
                    <Button onClick={handleDeleteData} variant="danger" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete My Account Permanently</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
