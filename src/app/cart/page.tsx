"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/store/cartContext";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck, Tag } from "lucide-react";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    currency,
    freeShippingProgress,
    shippingThreshold,
  } = useCart();

  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState<number | null>(null);
  const [discountError, setDiscountError] = useState("");

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountError("");
    const code = discountCode.trim().toUpperCase();
    if (code === "WELCOME10") {
      setDiscountApplied(subtotal * 0.1);
    } else if (code === "FREESHIP") {
      setDiscountApplied(0); // Free shipping handled
    } else {
      setDiscountError("Invalid promo code. Try WELCOME10 for 10% off.");
    }
  };

  const finalTotal = Math.max(0, subtotal - (discountApplied || 0));
  const amountNeeded = Math.max(0, shippingThreshold - subtotal);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <Container>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
            Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
          </h1>

          {items.length === 0 ? (
            <div className="py-24 text-center space-y-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Your bag is currently empty
                </h2>
                <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                  Find engineered backpacks, slim leather wallets, and travel folios.
                </p>
              </div>
              <Link href="/products/category/bags-luggage">
                <Button size="lg" className="mt-2">
                  Explore Carry Goods
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Items */}
              <div className="lg:col-span-8 space-y-4">
                {/* Free Shipping Notice */}
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <Truck className="h-4 w-4 text-[#C25E34]" />
                    {amountNeeded === 0 ? (
                      <span className="text-emerald-700 dark:text-emerald-400">
                        Unlocked free carbon-neutral shipping!
                      </span>
                    ) : (
                      <span>
                        Add{" "}
                        <strong>{formatPrice(amountNeeded, currency)}</strong>{" "}
                        more to qualify for free shipping.
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#C25E34] h-1.5 transition-all duration-300 rounded-full"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 p-6">
                  {items.map(({ id, product, variant, quantity }) => (
                    <div key={id} className="py-6 first:pt-0 last:pb-0 flex gap-6">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                        <Image
                          src={product.primaryImage}
                          alt={product.name}
                          fill
                          sizes="100px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <Link
                              href={`/products/${product.slug}`}
                              className="font-bold text-base text-zinc-900 dark:text-zinc-100 hover:text-[#C25E34]"
                            >
                              {product.name}
                            </Link>
                            <button
                              onClick={() => removeFromCart(variant.id)}
                              className="text-zinc-400 hover:text-red-500 p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            Color: {variant.colorName} · SKU: {variant.sku}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg">
                            <button
                              onClick={() => updateQuantity(variant.id, quantity - 1)}
                              className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-100"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 text-xs font-bold">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(variant.id, quantity + 1)}
                              className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-100"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                            {formatPrice(variant.price * quantity, currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    Order Summary
                  </h3>

                  {/* Promo Code Form */}
                  <form onSubmit={handleApplyDiscount} className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          placeholder="Promo code (WELCOME10)"
                          className="w-full h-10 pl-9 pr-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#C25E34]"
                        />
                      </div>
                      <Button type="submit" variant="outline" size="sm" className="h-10">
                        Apply
                      </Button>
                    </div>
                    {discountError && (
                      <p className="text-xs text-red-500">{discountError}</p>
                    )}
                    {discountApplied !== null && (
                      <p className="text-xs text-emerald-600 font-medium">
                        Promo code applied!
                      </p>
                    )}
                  </form>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 text-sm border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Subtotal</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {formatPrice(subtotal, currency)}
                      </span>
                    </div>

                    {discountApplied !== null && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount</span>
                        <span>-{formatPrice(discountApplied, currency)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Shipping</span>
                      <span className="text-zinc-900 dark:text-zinc-100">
                        {amountNeeded === 0 ? "Free" : "Calculated at checkout"}
                      </span>
                    </div>

                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between font-bold text-lg text-zinc-900 dark:text-zinc-100">
                      <span>Estimated Total</span>
                      <span>{formatPrice(finalTotal, currency)}</span>
                    </div>
                  </div>

                  <Link href="/checkout" className="block">
                    <Button size="lg" className="w-full justify-between font-bold">
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-zinc-500 justify-center">
                  <ShieldCheck className="h-4 w-4 text-[#C25E34]" />
                  <span>256-bit encrypted checkout with Stripe</span>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
