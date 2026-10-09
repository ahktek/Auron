"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/brand/Logo";
import { useCart } from "@/lib/store/cartContext";
import { formatPrice } from "@/lib/utils";
import { BRAND } from "@/lib/constants/brand";
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  Truck,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, currency, clearCart } = useCart();

  const [step, setStep] = useState<"details" | "shipping" | "payment">("details");
  const [isGuest, setIsGuest] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street1, setStreet1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [shippingMethod, setShippingMethod] = useState("standard"); // standard ($0 or $12) vs express ($24)
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");

  const shippingCost = subtotal >= 100 || shippingMethod === "free" ? 0 : shippingMethod === "express" ? 24 : 12;
  const taxRate = country === "United States" ? 0.07 : 0.0;
  const taxTotal = subtotal * taxRate;
  const finalTotal = subtotal + shippingCost + taxTotal;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const orderData = {
      orderNumber: `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
      email,
      customerName: `${firstName} ${lastName}`,
      items: items.map((i) => ({
        productName: i.product.name,
        variantTitle: i.variant.title,
        sku: i.variant.sku,
        quantity: i.quantity,
        price: i.variant.price,
        image: i.product.primaryImage,
      })),
      subtotal,
      shippingCost,
      taxTotal,
      finalTotal,
      currency,
      shippingAddress: {
        street1,
        city,
        state,
        postalCode,
        country,
      },
      createdAt: new Date().toISOString(),
    };

    try {
      // Save order in localStorage for instant tracking
      const storedOrders = JSON.parse(localStorage.getItem("auren_orders") || "[]");
      storedOrders.unshift(orderData);
      localStorage.setItem("auren_orders", JSON.stringify(storedOrders));
      localStorage.setItem("auren_last_order", JSON.stringify(orderData));

      // Simulate Stripe processing delay
      setTimeout(() => {
        clearCart();
        router.push(`/checkout/success?orderNumber=${orderData.orderNumber}`);
      }, 1200);
    } catch {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAF9F5] text-center">
        <div className="space-y-4 max-w-md">
          <Logo size="lg" className="justify-center" />
          <h2 className="text-xl font-bold">Your bag is empty</h2>
          <p className="text-sm text-zinc-500">
            Please add carry goods to your shopping bag before checking out.
          </p>
          <Link href="/">
            <Button>Return to Storefront</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-zinc-950">
      {/* Checkout Minimal Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4">
        <Container className="flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
            <Lock className="h-4 w-4 text-[#FF6857]" />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </Container>
      </header>

      <main className="py-10 lg:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Checkout Form Column (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Account Toggle */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    Contact Information
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsGuest(!isGuest)}
                    className="text-xs font-semibold text-[#FF6857] hover:underline"
                  >
                    {isGuest ? "Have an account? Sign In" : "Checkout as guest"}
                  </button>
                </div>

                <Input
                  label="Email Address for Order Confirmation"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alexander@example.com"
                />
              </div>

              {/* Shipping Address */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Shipping Destination
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Marcus"
                  />
                  <Input
                    label="Last Name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Vance"
                  />
                </div>

                <Input
                  label="Street Address"
                  required
                  value={street1}
                  onChange={(e) => setStreet1(e.target.value)}
                  placeholder="742 Evergreen Terrace"
                />

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="City"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Portland"
                  />
                  <Input
                    label="State / Province"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="OR"
                  />
                  <Input
                    label="Postal Code"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="97201"
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Delivery Method
                </h3>

                <div className="space-y-2 pt-1">
                  <label
                    onClick={() => setShippingMethod("standard")}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                      shippingMethod === "standard"
                        ? "border-[#FF6857] bg-[#FEF3F0]/60 dark:bg-zinc-800"
                        : "border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-[#FF6857]" />
                      <div>
                        <p className="font-semibold text-sm">Carbon-Neutral Standard</p>
                        <p className="text-xs text-zinc-500">3–5 business days</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm">
                      {subtotal >= 100 ? "FREE" : formatPrice(12, currency)}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod("express")}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                      shippingMethod === "express"
                        ? "border-[#FF6857] bg-[#FEF3F0]/60 dark:bg-zinc-800"
                        : "border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-[#FF6857]" />
                      <div>
                        <p className="font-semibold text-sm">Priority Express Air</p>
                        <p className="text-xs text-zinc-500">1–2 business days</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm">{formatPrice(24, currency)}</span>
                  </label>
                </div>
              </div>

              {/* Payment Section (Stripe Element Simulator) */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-[#FF6857]" />
                    <span>Payment Details (Stripe Integration)</span>
                  </h3>
                  <span className="text-xs text-zinc-500">Test Mode Enabled</span>
                </div>

                <div className="space-y-3 pt-2">
                  <Input
                    label="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiration"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                    />
                    <Input
                      label="CVC / Security Code"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  isLoading={isLoading}
                  size="lg"
                  className="w-full font-bold text-base mt-4"
                >
                  Pay {formatPrice(finalTotal, currency)} & Place Order
                </Button>
              </div>
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  In Your Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </h3>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-80 overflow-y-auto pr-2">
                  {items.map(({ id, product, variant, quantity }) => (
                    <div key={id} className="py-3.5 flex gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                        <Image
                          src={product.primaryImage}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          {variant.colorName} · Qty {quantity}
                        </p>
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                          {formatPrice(variant.price * quantity, currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(subtotal, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Shipping</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {shippingCost === 0 ? "Free" : formatPrice(shippingCost, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Estimated Tax</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(taxTotal, currency)}
                    </span>
                  </div>
                  <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 flex justify-between font-bold text-base text-zinc-900 dark:text-zinc-100">
                    <span>Total Due</span>
                    <span>{formatPrice(finalTotal, currency)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200">
                  <ShieldCheck className="h-4 w-4 text-[#FF6857]" />
                  <span>The {BRAND.name} Guarantee</span>
                </div>
                <p>
                  Every order includes 30-day worldwide trial coverage and our 10-year repair-or-replace warranty.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
