"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PRODUCTS, COLLECTIONS, ProductItem } from "@/lib/store/catalog";
import { BRAND } from "@/lib/constants/brand";
import {
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Truck,
  HeartPulse,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/SocialIcons";

const HERO_SLIDES = [
  {
    id: 1,
    headline: "Authentic Thai Balms & Rapid Pain Relief",
    subheadline:
      "Original imported Thai Crocodile, Siam Tiger, and Lemongrass herbal balms formulated for deep muscle aches, back stiffness, and joint mobility.",
    ctaText: "Shop Soothing Balms",
    ctaLink: "/products/category/soothing-balms",
    secondaryCtaText: "Thai Balm Trio (Save à§³500)",
    secondaryCtaLink: "/products/thai-herbal-balm-combo-3pack",
    desktopImage:
      "https://valobazar.com/storage/products/AuXI3nOuJdjMzECowT7hK9yL0sUJWwMQ34iJBzJk.jpg",
    mobileImage:
      "https://valobazar.com/storage/products/AuXI3nOuJdjMzECowT7hK9yL0sUJWwMQ34iJBzJk.jpg",
  },
  {
    id: 2,
    headline: "Pure Scalp Therapy & Natural Hair Growth",
    subheadline:
      "100% pure roasted Jamaican Black Castor Oil, organic Ceylon virgin coconut, and restorative Ayurvedic hair treatment oils.",
    ctaText: "Explore Hair Oils",
    ctaLink: "/products/category/hair-oils",
    secondaryCtaText: "Jamaican Castor Oil",
    secondaryCtaLink: "/products/jamaican-black-castor-oil-177ml-usa",
    desktopImage:
      "https://valobazar.com/storage/products/a8oLSJS01bzqqhs49M96cwCqrLorPfxEDw9bfdw9.jpg",
    mobileImage:
      "https://valobazar.com/storage/products/a8oLSJS01bzqqhs49M96cwCqrLorPfxEDw9bfdw9.jpg",
  },
  {
    id: 3,
    headline: "Spanish First Cold-Pressed Extra Virgin Olive Oil",
    subheadline:
      "Direct from Andalusian groves in Spain. Unfiltered cold extraction in culinary protective tins for diet, vitality, and deep hair/skin conditioning.",
    ctaText: "Discover Pure Oils",
    ctaLink: "/products/category/essential-oils",
    secondaryCtaText: "Royal EVOO 4L Tin",
    secondaryCtaLink: "/products/royal-extra-virgin-olive-oil-4l",
    desktopImage:
      "https://valobazar.com/storage/products/pK1LvLffIYWkiaqjmWQ5HotveXgBGWnH0c1JrOsU.jpg",
    mobileImage:
      "https://valobazar.com/storage/products/pK1LvLffIYWkiaqjmWQ5HotveXgBGWnH0c1JrOsU.jpg",
  },
  {
    id: 4,
    headline: "Herbal Skincare & Deep Winter Hydration",
    subheadline:
      "Original Dr. Alvin Kojic soap, intense Cocoa Glow body lotions, and protective jellies to keep your skin glowing, soft, and protected.",
    ctaText: "Shop Skin Care",
    ctaLink: "/products/category/herbal-skincare",
    secondaryCtaText: "Dr. Alvin Kojic Bar",
    secondaryCtaLink: "/products/dr-alvin-kojic-acid-soap",
    desktopImage:
      "https://valobazar.com/storage/products/AiogpNfDBLHrfbtAIhneEOPJd5UGyw2UIRmbJYqX.jpg",
    mobileImage:
      "https://valobazar.com/storage/products/AiogpNfDBLHrfbtAIhneEOPJd5UGyw2UIRmbJYqX.jpg",
  },
];

const PROMO_TILES = [
  { label: "Soothing Balms", link: "/products/category/soothing-balms", icon: "ðŸŒ¿" },
  { label: "Jamaican Castor Oil", link: "/products/jamaican-black-castor-oil-177ml-usa", icon: "âœ¨" },
  { label: "Ceylon Virgin Coconut", link: "/products/ceylon-extra-virgin-coconut-oil", icon: "ðŸ¥¥" },
  { label: "Spanish Olive Oils", link: "/products/category/essential-oils", icon: "ðŸ«’" },
  { label: "Dr. Alvin Kojic Bar", link: "/products/dr-alvin-kojic-acid-soap", icon: "ðŸ§¼" },
  { label: "Hong Thai Inhalers", link: "/products/hong-thai-herbal-inhaler-thailand", icon: "ðŸ’¨" },
  { label: "Winter Body Lotions", link: "/products/category/herbal-skincare", icon: "ðŸ§´" },
  { label: "Value Bundles", link: "/products/category/featured", icon: "ðŸŽ" },
];

const ACTIVITIES = [
  {
    title: "Pain Relief",
    link: "/products/category/soothing-balms",
    image: "https://valobazar.com/storage/products/AuXI3nOuJdjMzECowT7hK9yL0sUJWwMQ34iJBzJk.jpg",
    count: "10 Balms & Rubs",
  },
  {
    title: "Hair Growth",
    link: "/products/category/hair-oils",
    image: "https://valobazar.com/storage/products/a8oLSJS01bzqqhs49M96cwCqrLorPfxEDw9bfdw9.jpg",
    count: "8 Hair Essentials",
  },
  {
    title: "Cold-Pressed Oils",
    link: "/products/category/essential-oils",
    image: "https://valobazar.com/storage/products/IPtpJty2TlYmwuE0zKImon5ALBWLFl5Y2Dp2Psde.jpg",
    count: "6 Pure Oils",
  },
  {
    title: "Winter Skin Glow",
    link: "/products/category/herbal-skincare",
    image: "https://valobazar.com/storage/products/AiogpNfDBLHrfbtAIhneEOPJd5UGyw2UIRmbJYqX.jpg",
    count: "12 Skin Remedies",
  },
  {
    title: "Herbal Inhalers",
    link: "/products/category/soothing-balms/inhalers",
    image: "https://valobazar.com/storage/products/2d7nUIPN8MdLxK9OsUmJAikfYm8SoqIEh7M4o1EP.webp",
    count: "Sinus & Focus",
  },
  {
    title: "Curated Combos",
    link: "/products/category/featured",
    image: "https://valobazar.com/storage/products/3ItSe2xMumQrnmEl6nndtHfd7WBrwCgSUdz8ZdBf.jpg",
    count: "Value Sets (Save BDT)",
  },
];

const REELS = [
  {
    id: 1,
    title: "How to Apply Crocodile Balm for Knee Stiffness",
    productSlug: "crocodile-balm-50g-thailand",
    image: "https://valobazar.com/storage/products/AuXI3nOuJdjMzECowT7hK9yL0sUJWwMQ34iJBzJk.jpg",
    tag: "Balm Guide",
  },
  {
    id: 2,
    title: "30-Day Scalp Regrowth with Jamaican Castor Oil",
    productSlug: "jamaican-black-castor-oil-177ml-usa",
    image: "https://valobazar.com/storage/products/a8oLSJS01bzqqhs49M96cwCqrLorPfxEDw9bfdw9.jpg",
    tag: "Scalp Routine",
  },
  {
    id: 3,
    title: "Why Hong Thai Inhaler is Thailand's #1 Secret",
    productSlug: "hong-thai-herbal-inhaler-thailand",
    image: "https://valobazar.com/storage/products/2d7nUIPN8MdLxK9OsUmJAikfYm8SoqIEh7M4o1EP.webp",
    tag: "Aromatherapy",
  },
  {
    id: 4,
    title: "Dr. Alvin Kojic Acid Whitening Soap Routine",
    productSlug: "dr-alvin-kojic-acid-soap",
    image: "https://valobazar.com/storage/products/AiogpNfDBLHrfbtAIhneEOPJd5UGyw2UIRmbJYqX.jpg",
    tag: "Skincare",
  },
  {
    id: 5,
    title: "Cold-Pressed Spanish Olive Oil Purity Test",
    productSlug: "royal-extra-virgin-olive-oil-4l",
    image: "https://valobazar.com/storage/products/pK1LvLffIYWkiaqjmWQ5HotveXgBGWnH0c1JrOsU.jpg",
    tag: "Quality Test",
  },
];

const SOCIAL_GRID = [
  {
    id: 1,
    image: "https://valobazar.com/storage/products/AuXI3nOuJdjMzECowT7hK9yL0sUJWwMQ34iJBzJk.jpg",
    tag: "@curecarebd",
    link: "https://instagram.com",
  },
  {
    id: 2,
    image: "https://valobazar.com/storage/products/a8oLSJS01bzqqhs49M96cwCqrLorPfxEDw9bfdw9.jpg",
    tag: "@curecarebd",
    link: "https://instagram.com",
  },
  {
    id: 3,
    image: "https://valobazar.com/storage/products/2d7nUIPN8MdLxK9OsUmJAikfYm8SoqIEh7M4o1EP.webp",
    tag: "@curecarebd",
    link: "https://instagram.com",
  },
  {
    id: 4,
    image: "https://valobazar.com/storage/products/AiogpNfDBLHrfbtAIhneEOPJd5UGyw2UIRmbJYqX.jpg",
    tag: "@curecarebd",
    link: "https://instagram.com",
  },
  {
    id: 5,
    image: "https://valobazar.com/storage/products/pK1LvLffIYWkiaqjmWQ5HotveXgBGWnH0c1JrOsU.jpg",
    tag: "@curecarebd",
    link: "https://instagram.com",
  },
  {
    id: 6,
    image: "https://valobazar.com/storage/products/3ItSe2xMumQrnmEl6nndtHfd7WBrwCgSUdz8ZdBf.jpg",
    tag: "@curecarebd",
    link: "https://instagram.com",
  },
];

export const HomeClient: React.FC = () => {
  // 1. Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  // 2. Tabbed Product Rail State
  const [activeTab, setActiveTab] = useState<"bestsellers" | "new" | "bundles" | "recent">("bestsellers");
  const [recentlyViewed, setRecentlyViewed] = useState<ProductItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("auren_recent_slugs");
      if (stored) {
        const slugs: string[] = JSON.parse(stored);
        const matches = slugs
          .map((s) => PRODUCTS.find((p) => p.slug === s))
          .filter(Boolean) as ProductItem[];
        setRecentlyViewed(matches.slice(0, 4));
      }
    } catch {}
  }, []);

  const getRailProducts = () => {
    switch (activeTab) {
      case "recent":
        return recentlyViewed.length > 0 ? recentlyViewed : PRODUCTS.slice(0, 4);
      case "new":
        return PRODUCTS.filter((p) => p.isNewRelease).slice(0, 4);
      case "bundles":
        return PRODUCTS.filter((p) => p.isBundle).slice(0, 4);
      case "bestsellers":
      default:
        return PRODUCTS.filter((p) => p.isBestseller).slice(0, 4);
    }
  };

  const getShopAllLink = () => {
    switch (activeTab) {
      case "new":
        return "/products/category/featured?sort=newest";
      case "bundles":
        return "/products/category/featured";
      case "recent":
        return "/products/category/soothing-balms";
      case "bestsellers":
      default:
        return "/products/category/featured?sort=bestselling";
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* SECTION 1: HERO BANNER CAROUSEL */}
      <section className="relative w-full overflow-hidden bg-[#01262B] dark:bg-[#031316] text-white min-h-[580px] lg:min-h-[680px] flex items-center">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
            }`}
          >
            {/* Desktop and Mobile Images */}
            <div className="absolute inset-0">
              <Image
                src={slide.desktopImage}
                alt={slide.headline}
                fill
                priority={index === 0}
                className="object-cover hidden sm:block opacity-65"
              />
              <Image
                src={slide.mobileImage}
                alt={slide.headline}
                fill
                priority={index === 0}
                className="object-cover sm:hidden opacity-65"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#01262B]/95 via-[#005A64]/35 to-transparent" />
            </div>

            {/* Slide Text Content */}
            <div className="relative h-full flex items-center z-20">
              <Container>
                <div className="max-w-2xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Badge variant="accent" size="sm">
                    {BRAND.name} Pure Wellness
                  </Badge>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                    {slide.headline}
                  </h1>
                  <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
                    {slide.subheadline}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-3">
                    <Link href={slide.ctaLink}>
                      <Button size="lg" className="group">
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Link href={slide.secondaryCtaLink}>
                      <Button variant="outline" size="lg" className="text-white border-white/40 hover:bg-white/10">
                        {slide.secondaryCtaText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Container>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-6 left-0 right-0 z-30">
          <Container className="flex items-center justify-between">
            {/* Slide Indicator Dots */}
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full cursor-pointer transition-all duration-300 active:scale-90 ${
                    currentSlide === idx ? "w-8 bg-[#FF6857] shadow-xs" : "w-2 bg-white/40 hover:bg-white/70 hover:scale-125"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Control */}
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/15 shadow-sm">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="p-1 hover:text-[#FF6857] transition-all duration-150 active:scale-75 hover:scale-115 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="p-1 hover:text-[#FF6857] transition-all duration-150 active:scale-75 hover:scale-115 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </Container>
        </div>
      </section>

      {/* SECTION 2: PROMO PILL CAROUSEL */}
      <section>
        <Container>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {PROMO_TILES.map((tile, i) => (
              <Link
                key={i}
                href={tile.link}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap shadow-xs hover:border-[#005A64] hover:text-[#005A64] dark:hover:border-[#FF6857] dark:hover:text-[#FF6857] transition-colors"
              >
                <span>{tile.icon}</span>
                <span>{tile.label}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 3: TABBED PRODUCT RAIL */}
      <section>
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF6857]">
                Curated Remedies
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
                Featured Wellness Catalog
              </h2>
            </div>

            {/* Tab Switches */}
            <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab("bestsellers")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === "bestsellers"
                    ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                Bestsellers
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === "new"
                    ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                New Releases
              </button>
              <button
                onClick={() => setActiveTab("bundles")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === "bundles"
                    ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                Value Bundles
              </button>
            </div>
          </div>

          {/* Product Grid (4 items) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {getRailProducts().map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href={getShopAllLink()}>
              <Button variant="outline" className="w-full">
                <span>View Entire Category</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* SECTION 4: SHOP BY CONCERN / CATEGORY */}
      <section>
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF6857]">
                Tailored Solutions
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
                Shop By Care Need
              </h2>
            </div>
            <Link
              href="/products/category/soothing-balms"
              className="text-xs font-semibold text-[#005A64] dark:text-[#FF6857] hover:underline hidden sm:inline"
            >
              Browse All Categories â†’
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {ACTIVITIES.map((act, index) => (
              <Link
                key={index}
                href={act.link}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-900 flex flex-col justify-end p-4 shadow-sm hover:shadow-lg transition-all"
              >
                <Image
                  src={act.image}
                  alt={act.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="relative z-10 text-white space-y-0.5">
                  <h3 className="font-bold text-sm group-hover:text-[#FF6857] transition-colors">
                    {act.title}
                  </h3>
                  <span className="text-[11px] text-zinc-300 block">
                    {act.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 5: CURATED CAPSULES */}
      <section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLLECTIONS.map((col) => (
              <Link
                key={col.id}
                href={`/collection/${col.slug}`}
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-zinc-900 p-8 flex flex-col justify-end shadow-md hover:shadow-xl transition-all"
              >
                <Image
                  src={col.heroImage}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="relative z-10 text-white space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6857]">
                    Therapeutic Capsule
                  </span>
                  <h3 className="text-xl font-bold group-hover:text-[#FF6857] transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-zinc-300 line-clamp-2">
                    {col.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-white pt-2 group-hover:translate-x-1 transition-transform">
                    Explore Series <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 6: BRAND VALUES SECTION */}
      <section className="bg-[#F0F6F7] dark:bg-[#081B1F] py-16 border-y border-[#DFEBED] dark:border-[#13353D]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex gap-4">
              <div className="p-3.5 rounded-xl bg-[#EAF4F5] dark:bg-[#0D292F] text-[#005A64] dark:text-[#14A0B1] border border-[#D1E5E8] dark:border-[#133F48] shrink-0 h-fit">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Pure Botanical Formulations
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Every herbal balm, essential oil, and restorative tincture is authenticated and imported directly from verified certified origin producers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3.5 rounded-xl bg-[#EAF4F5] dark:bg-[#0D292F] text-[#005A64] dark:text-[#14A0B1] border border-[#D1E5E8] dark:border-[#133F48] shrink-0 h-fit">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  100% Genuine Quality Guarantee
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Zero counterfeit risk. Every batch features authentic security seals, batch lot tracking, and verified expiry dates.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3.5 rounded-xl bg-[#EAF4F5] dark:bg-[#0D292F] text-[#005A64] dark:text-[#14A0B1] border border-[#D1E5E8] dark:border-[#133F48] shrink-0 h-fit">
                <Truck className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Fast Nationwide Cash on Delivery
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Reliable express home delivery across all 64 districts in Bangladesh with easy Cash on Delivery and inspection upon arrival.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 7: VIDEO / REEL-STYLE DEMOS */}
      <section>
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF6857]">
                Product Demonstrations
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
                Authentic Wellness in Action
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {REELS.map((reel) => (
              <Link
                key={reel.id}
                href={`/products/${reel.productSlug}`}
                className="group relative rounded-xl overflow-hidden aspect-[9/16] bg-zinc-950 flex flex-col justify-between p-3.5 shadow-md hover:shadow-xl transition-all"
              >
                <Image
                  src={reel.image}
                  alt={reel.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded">
                    {reel.tag}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                    <Play className="h-3 w-3 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="relative z-10 text-white">
                  <h4 className="font-semibold text-xs leading-snug line-clamp-2 group-hover:text-[#FF6857] transition-colors">
                    {reel.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 8: INSTAGRAM SOCIAL GRID */}
      <section>
        <Container>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <InstagramIcon className="h-5 w-5 text-[#FF6857]" />
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                #CureCareBD Community
              </h3>
            </div>
            <a
              href={BRAND.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
            >
              Follow @curecarebd â†’
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SOCIAL_GRID.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="group relative rounded-xl overflow-hidden aspect-square bg-zinc-900 shadow-xs"
              >
                <Image
                  src={item.image}
                  alt={item.tag}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                  <span>{item.tag}</span>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};