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
  Pause,
  ChevronLeft,
  ChevronRight,
  Compass,
  ShieldCheck,
  Feather,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/SocialIcons";

const HERO_SLIDES = [
  {
    id: 1,
    headline: "Considered Carry for Modern Movement",
    subheadline:
      "Architecturally sculpted backpacks and transit essentials engineered with 100% recycled technical fabrics.",
    ctaText: "Explore Backpacks",
    ctaLink: "/products/category/bags-luggage/backpacks",
    secondaryCtaText: "The Apex Series",
    secondaryCtaLink: "/collection/apex-flight",
    desktopImage:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=2000&q=85",
    mobileImage:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    headline: "The Art of the Flat Pocket",
    subheadline:
      "Full-grain, environmentally certified leather wallets that eliminate bulk without sacrificing card capacity.",
    ctaText: "Shop Wallets",
    ctaLink: "/products/category/wallets",
    secondaryCtaText: "Our Leather Story",
    secondaryCtaLink: "/materials",
    desktopImage:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=2000&q=85",
    mobileImage:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    headline: "Flow Through Transit",
    subheadline:
      "Cabin-tested luggage, dopp kits, and compression cubes designed to turn airport checkpoints into smooth rituals.",
    ctaText: "Discover Travel",
    ctaLink: "/products/category/travel",
    secondaryCtaText: "Shop Value Sets",
    secondaryCtaLink: "/bundles",
    desktopImage:
      "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=2000&q=85",
    mobileImage:
      "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=900&q=85",
  },
];

const PROMO_TILES = [
  { label: "New Releases", link: "/products/category/featured?sort=newest", icon: "✨" },
  { label: "Everyday Backpacks", link: "/products/category/bags-luggage/backpacks", icon: "🎒" },
  { label: "Slim Wallets", link: "/products/category/wallets", icon: "💳" },
  { label: "Crossbody Slings", link: "/products/category/bags-luggage/totes-slings", icon: "🧳" },
  { label: "Work & Laptop", link: "/products/category/tech", icon: "💻" },
  { label: "Travel Essentials", link: "/products/category/travel", icon: "✈️" },
  { label: "Value Bundles", link: "/bundles", icon: "🎁" },
  { label: "The Journal", link: "/journal", icon: "📖" },
];

const ACTIVITIES = [
  { title: "Travel", link: "/products/category/travel", image: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=800&q=80", count: "8 Silhouettes" },
  { title: "Work", link: "/collection/work-commute", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80", count: "12 Essentials" },
  { title: "Tech", link: "/products/category/tech", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80", count: "6 Organizers" },
  { title: "Errands", link: "/collection/everyday-carry", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80", count: "10 Slings & Wallets" },
  { title: "Adventure", link: "/collection/coastal-all-weather", image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80", count: "All-Weather Ripstop" },
  { title: "Study", link: "/collection/work-commute", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80", count: "Notebooks & Pouches" },
];

const REELS = [
  { id: 1, title: "Packing the Apex 24L for 48 Hours", productSlug: "apex-transit-backpack-24l", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80", tag: "Pack Guide" },
  { id: 2, title: "The Pull-Tab Card Mechanism", productSlug: "apex-slim-bifold-wallet", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80", tag: "Pocket Test" },
  { id: 3, title: "Self-Compressing Sling In Action", productSlug: "nexus-crossbody-sling-7l", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80", tag: "EDC Walk" },
  { id: 4, title: "Airport Security In Under 60 Seconds", productSlug: "passport-transit-sleeve", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", tag: "Transit" },
  { id: 5, title: "Water Resistance Storm Simulation", productSlug: "vanguard-commuter-rolltop-28l", image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=600&q=80", tag: "Lab Test" },
];

const SOCIAL_GRID = [
  { id: 1, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80", tag: "@aurencarry", link: "https://instagram.com" },
  { id: 2, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80", tag: "@aurencarry", link: "https://instagram.com" },
  { id: 3, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80", tag: "@aurencarry", link: "https://instagram.com" },
  { id: 4, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", tag: "@aurencarry", link: "https://instagram.com" },
  { id: 5, image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80", tag: "@aurencarry", link: "https://instagram.com" },
  { id: 6, image: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=600&q=80", tag: "@aurencarry", link: "https://instagram.com" },
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
        return "/bundles";
      case "recent":
        return "/products/category/bags-luggage";
      case "bestsellers":
      default:
        return "/products/category/featured?sort=bestselling";
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* SECTION 1: HERO BANNER CAROUSEL */}
      <section className="relative w-full overflow-hidden bg-zinc-950 text-white min-h-[580px] lg:min-h-[680px] flex items-center">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Slide Text Content */}
            <div className="relative h-full flex items-center z-20">
              <Container>
                <div className="max-w-2xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Badge variant="accent" size="sm">
                    {BRAND.name} Studio Collection
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
                    currentSlide === idx ? "w-8 bg-[#C25E34] shadow-xs" : "w-2 bg-white/40 hover:bg-white/70 hover:scale-125"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next & Pause Control */}
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/15 shadow-sm">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="p-1 hover:text-[#C25E34] transition-all duration-150 active:scale-75 hover:scale-115 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsAutoplay(!isAutoplay)}
                className="p-1 hover:text-[#C25E34] transition-all duration-150 active:scale-75 hover:scale-115 cursor-pointer"
                aria-label={isAutoplay ? "Pause autoplay" : "Start autoplay"}
              >
                {isAutoplay ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="p-1 hover:text-[#C25E34] transition-all duration-150 active:scale-75 hover:scale-115 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </Container>
        </div>
      </section>

      {/* SECTION 2: PROMO TILE STRIP */}
      <section>
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {PROMO_TILES.map((tile) => (
              <Link
                key={tile.label}
                href={tile.link}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center hover:border-[#C25E34] hover:shadow-xs transition-all duration-200 group"
              >
                <span className="text-xl mb-1.5 group-hover:scale-110 transition-transform">
                  {tile.icon}
                </span>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-[#C25E34]">
                  {tile.label}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 3: "GEAR UP FOR..." ACTIVITY GRID */}
      <section>
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34]">
                Purposeful Design
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
                Gear Up for Every Journey
              </h2>
            </div>
            <p className="text-sm text-zinc-500 max-w-md">
              Silhouettes tailored around the specific movements and rhythms of daily life.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ACTIVITIES.map((act) => (
              <Link
                key={act.title}
                href={act.link}
                className="group relative rounded-xl overflow-hidden aspect-[3/4] bg-zinc-900 flex flex-col justify-end p-4"
              >
                <Image
                  src={act.image}
                  alt={act.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover opacity-75 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="relative z-10 text-white">
                  <h3 className="font-bold text-base group-hover:text-[#C25E34] transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-[11px] text-zinc-300 mt-0.5">{act.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 4: TABBED PRODUCT RAIL */}
      <section className="bg-white dark:bg-zinc-950 py-12 border-y border-zinc-200/80 dark:border-zinc-800">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-8 gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: "bestsellers", label: "Bestsellers" },
                { id: "new", label: "New Releases" },
                { id: "bundles", label: "Value Sets" },
                { id: "recent", label: "Recently Viewed" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "bestsellers" | "new" | "bundles" | "recent")}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-150 active:scale-95 ${
                    activeTab === tab.id
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 hover:scale-105"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Link
              href={getShopAllLink()}
              className="text-xs font-bold text-[#C25E34] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Shop All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getRailProducts().map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 5: "GEAR TO SUIT YOUR STYLE" COLLECTIONS */}
      <section>
        <Container>
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34]">
              Curated Worlds
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
              Gear to Suit Your Style
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLLECTIONS.slice(0, 3).map((col) => (
              <Link
                key={col.id}
                href={`/collection/${col.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-zinc-900 flex flex-col justify-end p-8"
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
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C25E34]">
                    Capsule Edition
                  </span>
                  <h3 className="text-xl font-bold group-hover:text-[#C25E34] transition-colors">
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
      <section className="bg-[#FAF9F5] dark:bg-zinc-900 py-16 border-y border-zinc-200/80 dark:border-zinc-800">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex gap-4">
              <div className="p-3.5 rounded-xl bg-[#FDF5F0] text-[#C25E34] shrink-0 h-fit">
                <Compass className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Considered Engineering
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Every seam, magnet, and zipper pull is calibrated for intuitive tactile efficiency and natural posture.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3.5 rounded-xl bg-[#FDF5F0] text-[#C25E34] shrink-0 h-fit">
                <Feather className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Gold-Rated Environmental Leather
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  100% of our leather is sourced from Leather Working Group environmental awardees using closed-loop water treatment.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3.5 rounded-xl bg-[#FDF5F0] text-[#C25E34] shrink-0 h-fit">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  10-Year Craftsmanship Guarantee
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Built for decades of movement with modular, repairable hardware and reinforced bar-tacks.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 7: VIDEO / REEL-STYLE PRODUCT CARDS (5 cards) */}
      <section>
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34]">
                Field Demonstrations
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
                See How It Carries
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
                  <h4 className="font-semibold text-xs leading-snug line-clamp-2 group-hover:text-[#C25E34] transition-colors">
                    {reel.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 8: INSTAGRAM-STYLE SOCIAL IMAGE GRID */}
      <section>
        <Container>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <InstagramIcon className="h-5 w-5 text-[#C25E34]" />
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                #AurenCarry in the Field
              </h3>
            </div>
            <a
              href={BRAND.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900"
            >
              Follow @aurencarry →
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SOCIAL_GRID.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800"
              >
                <Image
                  src={item.image}
                  alt={item.tag}
                  fill
                  sizes="150px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                  <InstagramIcon className="h-5 w-5" />
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 9: TRUST BAR */}
      <section className="bg-zinc-900 text-white py-8 border-y border-zinc-800">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {BRAND.origin.split(" & ")[0].replace("Designed in ", "")}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">Design & Ergonomics Origin</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {BRAND.metrics.retailPartners}+
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">Global Stockists in 24 Countries</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                ★ {BRAND.metrics.averageRating} / 5
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                From {BRAND.metrics.totalReviews.toLocaleString()} Verified Owners
              </p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#C25E34] tracking-tight">
                B Corp Certified
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">Climate Neutral & 100% Recycled Weaves</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
