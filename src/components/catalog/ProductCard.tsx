"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductItem } from "@/lib/store/catalog";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cartContext";
import { Badge } from "@/components/ui/Badge";
import { Heart, Plus, Check } from "lucide-react";

interface ProductCardProps {
  product: ProductItem;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = "" }) => {
  const { addToCart, currency, toggleWishlist, isWishlisted } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const activeImage = isHovered && product.hoverImage ? product.hoverImage : product.primaryImage;
  const wishlisted = isWishlisted(product.slug);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedVariant) {
      addToCart(product, selectedVariant, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.slug);
  };

  return (
    <div
      className={`group relative flex flex-col bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 transition-all duration-300 hover:shadow-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Badges & Wishlist Action */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          {product.isBestseller && (
            <Badge variant="accent" size="sm">
              Bestseller
            </Badge>
          )}
          {product.isNewRelease && (
            <Badge variant="neutral" size="sm">
              New
            </Badge>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
            <Badge variant="warning" size="sm">
              Save {Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)}%
            </Badge>
          )}
          {product.isSoldOut && (
            <Badge variant="soldOut" size="sm">
              Sold Out
            </Badge>
          )}
        </div>

        <button
          type="button"
          onClick={handleToggleWishlist}
          className="pointer-events-auto p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xs text-zinc-500 hover:text-red-500 transition-all duration-200 active:scale-75 hover:scale-110 shadow-xs cursor-pointer"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-transform duration-200 ${
              wishlisted ? "fill-red-500 text-red-500 animate-heart-pulse scale-110" : "hover:scale-105"
            }`}
          />
        </button>
      </div>

      {/* Main Image Link */}
      <Link href={`/products/${product.slug}?color=${encodeURIComponent(selectedVariant?.colorName || "")}`} className="relative aspect-square w-full bg-[#F4F3EE] dark:bg-zinc-800 overflow-hidden block">
        <Image
          src={activeImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Quick Add Button overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full py-2.5 px-4 rounded-lg bg-zinc-900/90 hover:bg-zinc-950 text-white text-xs font-semibold backdrop-blur-xs shadow-md flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400 animate-in zoom-in-75" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90 duration-200" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Color Swatches */}
          {product.variants.length > 1 && (
            <div className="flex items-center gap-1.5 mb-2.5">
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`w-3.5 h-3.5 rounded-full border cursor-pointer transition-all duration-200 active:scale-90 ${
                    selectedVariantIndex === idx
                      ? "ring-2 ring-offset-1 ring-zinc-900 dark:ring-white scale-125 shadow-xs"
                      : "border-black/20 hover:scale-115 opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                  title={v.colorName}
                  aria-label={`Select color ${v.colorName}`}
                />
              ))}
              <span className="text-[11px] text-zinc-400 ml-1">
                {product.variants.length} colors
              </span>
            </div>
          )}

          <Link href={`/products/${product.slug}`} className="block group-hover:text-[#FC5A43] transition-colors">
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {formatPrice(selectedVariant?.price || product.basePrice, currency)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
              <span className="text-xs text-zinc-400 line-through">
                {formatPrice(product.compareAtPrice, currency)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
            <span className="text-amber-500">★</span>
            <span>{product.rating}</span>
            <span className="text-zinc-400">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
