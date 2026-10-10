"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/store/cartContext";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    itemCount,
    subtotal,
    currency,
    freeShippingProgress,
    shippingThreshold,
  } = useCart();

  const amountNeededForFreeShipping = Math.max(0, shippingThreshold - subtotal);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeCart}
      title={
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-[#FF6857]" />
          <span>Your Bag ({itemCount})</span>
        </div>
      }
      position="right"
      className="max-w-md"
    >
      <div className="flex flex-col h-full -mx-6 -my-6">
        {/* Free Shipping Tier Banner */}
        <div className="bg-[#EAF4F5]/60 dark:bg-[#0C242A]/60 p-4 border-b border-[#005A64]/15 dark:border-[#133A42]">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 mb-2">
            <Truck className="h-4 w-4 text-[#FF6857]" />
            {amountNeededForFreeShipping === 0 ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                You’ve unlocked complimentary delivery across Bangladesh!
              </span>
            ) : (
              <span>
                Add{" "}
                <strong className="text-zinc-950 dark:text-white font-bold">
                  {formatPrice(amountNeededForFreeShipping, currency)}
                </strong>{" "}
                more to qualify for free shipping.
              </span>
            )}
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#FF6857] h-1.5 transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Item List / Empty State */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Your bag is empty
                </p>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Explore our carefully engineered carry goods and find your daily companion.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={closeCart}
                className="mt-2"
              >
                Start Browsing
              </Button>
            </div>
          ) : (
            items.map(({ id, product, variant, quantity }) => (
              <div
                key={id}
                className="flex gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800"
              >
                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-zinc-100 shrink-0">
                  <Image
                    src={product.primaryImage}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={closeCart}
                        className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-[#FF6857] line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(variant.id)}
                        className="text-zinc-400 hover:text-red-500 transition-all duration-150 active:scale-75 hover:scale-110 p-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block border border-black/10"
                        style={{ backgroundColor: variant.colorHex }}
                      />
                      <span>{variant.colorName}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(variant.id, quantity - 1)}
                        className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-85 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold tabular-nums">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(variant.id, quantity + 1)}
                        className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-85 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(variant.price * quantity, currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Subtotal & CTAs */}
        {items.length > 0 && (
          <div className="p-6 bg-[#FAF9F5] dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Subtotal</span>
              <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                {formatPrice(subtotal, currency)}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Cash on Delivery supported across all 64 districts in Bangladesh. Express dispatch.
            </p>
            <div className="space-y-2 pt-1">
              <Link href="/checkout" onClick={closeCart} className="block">
                <Button className="w-full justify-between" size="lg">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/cart" onClick={closeCart} className="block">
                <Button variant="outline" size="sm" className="w-full">
                  View Full Bag
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
