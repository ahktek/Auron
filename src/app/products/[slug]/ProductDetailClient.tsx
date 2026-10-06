"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductItem, Variant, PRODUCTS } from "@/lib/store/catalog";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useCart } from "@/lib/store/cartContext";
import { formatPrice } from "@/lib/utils";
import { BRAND } from "@/lib/constants/brand";
import {
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Plus,
  Minus,
  Check,
  ChevronDown,
  Sparkles,
  Layers,
  Maximize2,
  Star,
} from "lucide-react";

interface ProductDetailClientProps {
  product: ProductItem;
  relatedProducts: ProductItem[];
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  relatedProducts,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, currency, toggleWishlist, isWishlisted } = useCart();

  // Color from query parameter or default
  const colorQuery = searchParams.get("color");
  const initialVariant =
    product.variants.find(
      (v) => v.colorName.toLowerCase() === colorQuery?.toLowerCase()
    ) ||
    product.variants[0];

  const [selectedVariant, setSelectedVariant] = useState<Variant>(initialVariant);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string>("details");
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Sync recently viewed into localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("auren_recent_slugs");
      const list: string[] = stored ? JSON.parse(stored) : [];
      const updated = [product.slug, ...list.filter((s) => s !== product.slug)].slice(0, 8);
      localStorage.setItem("auren_recent_slugs", JSON.stringify(updated));
    } catch {}
  }, [product.slug]);

  // Update URL on variant selection
  const handleSelectVariant = (v: Variant) => {
    setSelectedVariant(v);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("color", v.colorName);
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const images = product.images.length > 0 ? product.images : [product.primaryImage];
  const activeImage = images[selectedImageIndex] || images[0];
  const wishlisted = isWishlisted(product.slug);

  return (
    <div className="py-8 lg:py-14">
      <Container>
        {/* Breadcrumbs */}
        <nav className="text-xs text-zinc-500 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-900">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/products/category/${product.categorySlug}`}
            className="hover:text-zinc-900"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Top Product Section: Gallery & Purchase Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image with Zoom Trigger */}
            <div
              className={`relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F4F3EE] dark:bg-zinc-800 transition-all cursor-zoom-in ${
                isZoomed ? "scale-110" : ""
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <Image
                src={activeImage}
                alt={`${product.name} - ${selectedVariant.colorName}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-300"
              />
              <button
                type="button"
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xs text-zinc-700 dark:text-zinc-300 shadow-xs"
                aria-label="Toggle image zoom"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setIsZoomed(false);
                    }}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? "border-[#C25E34] ring-1 ring-[#C25E34]"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchase Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Badges & Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {product.isBestseller && <Badge variant="accent">Bestseller</Badge>}
                  {product.isNewRelease && <Badge variant="neutral">New Release</Badge>}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold">{product.rating}</span>
                  <span>({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {product.name}
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {product.subtitle}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {formatPrice(selectedVariant.price, currency)}
                </span>
                {selectedVariant.compareAtPrice &&
                  selectedVariant.compareAtPrice > selectedVariant.price && (
                    <span className="text-base text-zinc-400 line-through">
                      {formatPrice(selectedVariant.compareAtPrice, currency)}
                    </span>
                  )}
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  In Stock · Ready to ship
                </span>
              </div>

              {/* Color Variant Selector */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                    Color: <span className="font-normal text-zinc-600">{selectedVariant.colorName}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleSelectVariant(v)}
                      className={`relative w-8 h-8 rounded-full border cursor-pointer transition-all duration-200 active:scale-90 flex items-center justify-center ${
                        selectedVariant.id === v.id
                          ? "ring-2 ring-offset-2 ring-zinc-950 dark:ring-white scale-115 shadow-sm"
                          : "border-black/20 hover:scale-110 opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: v.colorHex }}
                      title={v.colorName}
                    >
                      {selectedVariant.id === v.id && (
                        <Check className="h-4 w-4 text-white drop-shadow-sm animate-in zoom-in-75" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Add to Cart */}
              <div className="space-y-3 pt-4">
                <div className="flex gap-3">
                  <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 px-2 overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-zinc-600 hover:text-zinc-900 transition-all active:scale-80 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 text-sm font-bold min-w-8 text-center tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-zinc-600 hover:text-zinc-900 transition-all active:scale-80 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="flex-1 text-base font-semibold"
                  >
                    {isAdded ? (
                      <span className="flex items-center gap-2">
                        <Check className="h-5 w-5" /> Added to Bag
                      </span>
                    ) : (
                      <span>Add to Bag — {formatPrice(selectedVariant.price * quantity, currency)}</span>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.slug)}
                    className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 transition-all duration-200 active:scale-75 hover:scale-105 cursor-pointer shadow-2xs"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`h-5 w-5 transition-transform duration-200 ${
                        wishlisted ? "fill-red-500 text-red-500 animate-heart-pulse scale-110" : "text-zinc-700 hover:scale-105"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Reassurances Strip */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-[#C25E34] shrink-0" />
                  <span>Free carbon-neutral delivery on orders over $100</span>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-4 w-4 text-[#C25E34] shrink-0" />
                  <span>30-day global trial with hassle-free returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-[#C25E34] shrink-0" />
                  <span>Backed by our 10-year craftsmanship guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* "What Fits Inside" / Capacity Spotlight */}
        {product.capacityInfo && (
          <div className="mt-16 p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C25E34]">
                Capacity & Layout
              </span>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                What Fits Inside
              </h3>
            </div>
            <div className="md:col-span-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
              {product.capacityInfo}
            </div>
          </div>
        )}

        {/* Accordions: Details, Materials, Dimensions, Care */}
        <div className="mt-12 space-y-3 max-w-4xl mx-auto">
          {[
            { id: "details", title: "Design Details & Features", content: product.details },
            { id: "materials", title: "Materials & Sustainability", content: product.materialsInfo },
            { id: "dimensions", title: "Dimensions & Capacity", content: product.dimensionsInfo },
            { id: "care", title: "Care Instructions & Cleaning", content: product.careInfo },
            {
              id: "shipping",
              title: "Shipping & 10-Year Guarantee",
              content:
                "Standard dispatch within 24 hours. Delivered in 100% recyclable FSC certified kraft packaging. Every AUREN carry piece is covered under our 10-year repair-or-replace guarantee against material or manufacturing defects.",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() =>
                  setActiveAccordion(activeAccordion === item.id ? "" : item.id)
                }
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:text-[#C25E34] transition-all duration-200 cursor-pointer active:scale-[0.99]"
              >
                <span>{item.title}</span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ease-out ${
                    activeAccordion === item.id ? "rotate-180 text-[#C25E34]" : ""
                  }`}
                />
              </button>
              {activeAccordion === item.id && (
                <div className="px-5 pb-5 pt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 animate-in fade-in slide-in-from-top-1 duration-200">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Verified Owner Reviews */}
        <div className="mt-20 border-t border-zinc-200 dark:border-zinc-800 pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C25E34]">
                Customer Endorsements
              </span>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                Owner Reviews ({product.reviewCount})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {product.rating}
              </span>
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-zinc-500">· 100% Verified</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.length > 0 ? (
              product.reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-500">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-zinc-400">{r.createdAt}</span>
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {r.title}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {r.body}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-1">
                    <span className="font-semibold">{r.authorName}</span>
                    <span>·</span>
                    <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <Check className="h-3 w-3" /> Verified Owner
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500 col-span-2">
                Be the first to review this carry item.
              </p>
            )}
          </div>
        </div>

        {/* Related Products Rail */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-zinc-200 dark:border-zinc-800 pt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C25E34]">
                  Complementary Carry
                </span>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  You Might Also Like
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
