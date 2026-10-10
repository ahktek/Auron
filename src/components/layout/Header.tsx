"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/lib/store/cartContext";
import { BRAND } from "@/lib/constants/brand";
import { SearchModal } from "@/components/search/SearchModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  Search,
  ShoppingBag,
  User,
  MapPin,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  Globe,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Header: React.FC = () => {
  const { itemCount, openCart, currency, setCurrency } = useCart();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (menuName: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 120);
  };

  return (
    <>
      {/* 1. Utility & Announcement Bar */}
      <div className="bg-[#005A64] dark:bg-[#041A1E] text-teal-50 dark:text-teal-100 text-[11px] py-1.5 px-4 font-medium border-b border-[#01454D] dark:border-[#092B31]">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-teal-200/80 dark:text-teal-300/70 hidden sm:inline">
              100% Authentic Thai Balms, Pure Scalp Oils & Cold-Pressed Remedies
            </span>
            <span className="text-white font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6857] shadow-xs" />
              Complimentary nationwide shipping across Bangladesh on orders over à§³1,500
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/customer-care/shipping"
              className="text-teal-100/90 hover:text-white transition-colors flex items-center gap-1"
            >
              <HelpCircle className="h-3 w-3" />
              <span>Need help?</span>
            </Link>
            <Link
              href="/accessibility"
              className="text-teal-100/90 hover:text-white transition-colors hidden md:inline"
            >
              Accessibility
            </Link>

            {/* Currency Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-1 text-teal-100/90 hover:text-white font-medium uppercase tracking-wider"
              >
                <Globe className="h-3 w-3" />
                <span>{currency}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {isCurrencyOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-32 bg-white dark:bg-[#0B2024] border border-[#DFEBED] dark:border-[#13353D] rounded-lg shadow-xl py-1 z-50 text-zinc-800 dark:text-zinc-200">
                  {BRAND.currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#EEF6F7] dark:hover:bg-[#13353D] flex items-center justify-between ${
                        currency === curr.code ? "font-bold text-[#005A64] dark:text-[#FF6857]" : ""
                      }`}
                    >
                      <span>{curr.code}</span>
                      <span className="text-zinc-400">{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Primary Navigation Bar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? "bg-white/95 dark:bg-[#07191D]/95 backdrop-blur-md shadow-xs border-b border-[#DFEBED] dark:border-[#13353D]"
            : "bg-white/90 dark:bg-[#051316]/90 backdrop-blur-xs border-b border-[#DFEBED]/80 dark:border-[#13353D]/80"
        }`}
      >
        <Container className="h-16 flex items-center justify-between">
          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Logo size="sm" />
          </div>

          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center">
            <Logo size="md" />
          </div>

          {/* Desktop Mega-Menu Links */}
          <nav
            className="hidden lg:flex items-center gap-7 h-full text-[13px] font-medium text-zinc-700 dark:text-zinc-300"
            onMouseLeave={handleMouseLeave}
          >
            {/* Soothing Balms */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("balms")}
            >
              <Link
                href="/products/category/soothing-balms"
                className={`py-5 transition-colors border-b-2 ${
                  activeMenu === "balms"
                    ? "border-[#FF6857] text-zinc-950 dark:text-white"
                    : "border-transparent hover:text-zinc-950"
                }`}
              >
                Soothing Balms
              </Link>
            </div>

            {/* Hair Oils */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("hairoils")}
            >
              <Link
                href="/products/category/hair-oils"
                className={`py-5 transition-colors border-b-2 ${
                  activeMenu === "hairoils"
                    ? "border-[#FF6857] text-zinc-950 dark:text-white"
                    : "border-transparent hover:text-zinc-950"
                }`}
              >
                Hair Oils
              </Link>
            </div>

            {/* Essential Oils */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("essential")}
            >
              <Link
                href="/products/category/essential-oils"
                className={`py-5 transition-colors border-b-2 ${
                  activeMenu === "essential"
                    ? "border-[#FF6857] text-zinc-950 dark:text-white"
                    : "border-transparent hover:text-zinc-950"
                }`}
              >
                Essential Oils
              </Link>
            </div>

            {/* Skin & Body Care */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("skincare")}
            >
              <Link
                href="/products/category/herbal-skincare"
                className={`py-5 transition-colors border-b-2 ${
                  activeMenu === "skincare"
                    ? "border-[#FF6857] text-zinc-950 dark:text-white"
                    : "border-transparent hover:text-zinc-950"
                }`}
              >
                Skin & Body Care
              </Link>
            </div>

            {/* Combos & Bundles */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("featured")}
            >
              <Link
                href="/products/category/featured"
                className={`py-5 transition-colors border-b-2 ${
                  activeMenu === "featured"
                    ? "border-[#FF6857] text-zinc-950 dark:text-white"
                    : "border-transparent hover:text-zinc-950"
                }`}
              >
                Combos & Sets
              </Link>
            </div>

            {/* About Us */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("about")}
            >
              <Link
                href="/about"
                className={`py-5 transition-colors border-b-2 flex items-center gap-1 ${
                  activeMenu === "about"
                    ? "border-[#FF6857] text-zinc-950 dark:text-white"
                    : "border-transparent hover:text-zinc-950"
                }`}
              >
                <span>About Cure-Care</span>
                <ChevronDown className="h-3 w-3" />
              </Link>
            </div>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4 text-zinc-700 dark:text-zinc-300">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:text-zinc-950 dark:hover:text-white transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Day / Night Theme Toggle */}
            <ThemeToggle />

            {/* Account / Admin Portal */}
            <Link
              href="/admin"
              className="p-2 hover:text-[#005A64] dark:hover:text-[#FF6857] transition-all duration-150 active:scale-90 hover:scale-105"
              aria-label="Admin Portal"
              title="Admin CMS Portal"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Cart Trigger with Dynamic Badge */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 text-zinc-900 dark:text-zinc-100 hover:text-[#FF6857] transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6857] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-in zoom-in-75 shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </Container>

        {/* 3. Mega-Menu Dropdown Panel */}
        {activeMenu && (
          <div
            className="hidden lg:block absolute top-full left-0 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200"
            onMouseEnter={() => handleMouseEnter(activeMenu)}
            onMouseLeave={handleMouseLeave}
          >
            <Container className="py-8">
              {/* Soothing Balms Dropdown */}
              {activeMenu === "balms" && (
                <div className="grid grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Herbal Balms & Rubs
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/crocodile-balm-50g-thailand"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857] font-medium"
                        >
                          Crocodile Herbal Balm 50g
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/siam-tiger-balm-50g"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Siam Tiger Balm 50g
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/green-seven-lemongrass-balm-50g"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Lemongrass Aroma Balm 50g
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/vicks-vaporub-100g"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Vicks VapoRub 100g
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Liniments & Inhalers
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/hong-thai-herbal-inhaler-thailand"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857] font-medium"
                        >
                          Hong Thai Herbal Inhaler
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/axe-brand-universal-oil-56ml"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Axe Brand Universal Oil 56ml
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/omega-pain-killer-liniment-60ml"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Omega Pain Killer Liniment 60ml
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/pim-saen-balm-oil-8ml-poysian"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Pim-Saen Roll-On 8ml
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Curations & Quick Links
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/thai-herbal-balm-combo-3pack"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857] inline-flex items-center gap-1.5"
                        >
                          <span>Thai Balm Trio Pack</span>
                          <span className="text-[10px] font-bold bg-[#FEF3F0] text-[#FF6857] px-1.5 py-0.5 rounded">
                            Save à§³500
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/soothing-balms"
                          className="text-xs font-semibold text-[#005A64] dark:text-[#FF6857] hover:underline"
                        >
                          Explore All Soothing Balms â†’
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6857]">
                        Customer Favorite
                      </span>
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                        Hong Thai Botanical Inhaler
                      </h5>
                      <p className="text-xs text-zinc-500 mt-1">
                        Authentic dry fermented Thai herbs for clear sinuses, stress relief, and instant refreshment.
                      </p>
                    </div>
                    <Link
                      href="/products/hong-thai-herbal-inhaler-thailand"
                      className="text-xs font-semibold text-[#FF6857] hover:underline flex items-center gap-1 mt-4"
                    >
                      Shop Now (à§³450) <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Hair Oils Dropdown */}
              {activeMenu === "hairoils" && (
                <div className="grid grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Pure Scalp & Growth Oils
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/jamaican-black-castor-oil-177ml-usa"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857] font-medium"
                        >
                          Jamaican Black Castor Oil 177ml
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/ceylon-extra-virgin-coconut-oil"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Ceylon Extra Virgin Coconut Oil
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/vatika-naturals-coconut-hair-oil-400ml"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Vatika Naturals Coconut Oil 400ml
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/parachute-sampoorna-coconut-oil-300ml"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Parachute Sampoorna 300ml
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Botanical Shampoos
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/tresemme-keratin-smooth-shampoo-700ml"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857] font-medium"
                        >
                          TRESemme Keratin Smooth 700ml
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/herbal-essences-hydrate-coconut-milk-600ml"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Herbal Essences Coconut Milk 600ml
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/hair-oils"
                          className="text-xs font-semibold text-[#005A64] dark:text-[#FF6857] hover:underline"
                        >
                          View Full Hair Care Line â†’
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Key Hair Benefits
                    </h4>
                    <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        <span>Stimulates dormant follicles</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        <span>Eliminates winter dandruff & itch</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        <span>Restores natural density & shine</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6857]">
                        Growth Specialist
                      </span>
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                        Jamaican Black Castor Oil
                      </h5>
                      <p className="text-xs text-zinc-500 mt-1">
                        100% pure extra dark roasted formula imported from the USA.
                      </p>
                    </div>
                    <Link
                      href="/products/jamaican-black-castor-oil-177ml-usa"
                      className="text-xs font-semibold text-[#FF6857] hover:underline flex items-center gap-1 mt-4"
                    >
                      Shop Castor Oil (à§³2,000) <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Essential Oils Dropdown */}
              {activeMenu === "essential" && (
                <div className="grid grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Spanish Olive Oils
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/royal-extra-virgin-olive-oil-4l"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857] font-medium"
                        >
                          Royal Extra Virgin Olive Oil 4L
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/span-oliva-extra-virgin-olive-oil-1l"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Span Oliva EVOO 1L
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/extra-virgin-olive-oil-coldpress-4l-spain"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Cold-Pressed Gourmet EVOO 4L
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Cold-Pressed Seed Oils
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/bonlife-sunflower-seed-oil-5000ml"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857] font-medium"
                        >
                          Bonlife Sunflower Seed Oil 5L
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/essential-oils"
                          className="text-xs font-semibold text-[#005A64] dark:text-[#FF6857] hover:underline"
                        >
                          View All Pure Wellness Oils â†’
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Purity Guarantee
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      First cold-press extraction with zero trans-fats, ensuring raw antioxidants, heart-healthy polyphenols, and full therapeutic integrity.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6857]">
                        Direct from Spain
                      </span>
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                        Royal EVOO 4 Liters
                      </h5>
                      <p className="text-xs text-zinc-500 mt-1">
                        Authentic gourmet olive oil in heavy protective culinary tin.
                      </p>
                    </div>
                    <Link
                      href="/products/royal-extra-virgin-olive-oil-4l"
                      className="text-xs font-semibold text-[#FF6857] hover:underline flex items-center gap-1 mt-4"
                    >
                      Shop 4L Tin (à§³4,450) <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Skin & Body Care Dropdown */}
              {activeMenu === "skincare" && (
                <div className="grid grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Soaps & Cleansers
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/dr-alvin-kojic-acid-soap"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857] font-medium"
                        >
                          Dr. Alvin Kojic Soap 135g
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/kojie-san-soap"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Kojie San Skin Soap 135g
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/himalaya-purifying-neem-face-wash"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Himalaya Neem Face Wash 150ml
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/neutrogena-hydro-boost-cleanser"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Neutrogena Hydro Boost 200ml
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Lotions & Jellies
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/vaseline-intensive-care-cocoa-glow-400ml"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857] font-medium"
                        >
                          Vaseline Cocoa Glow 400ml
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/nivea-soft-moisturizer-cream-200ml"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Nivea Soft Cream 200ml
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/vaseline-moisturizing-pure-jelly-100ml"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Vaseline Pure Jelly 100ml
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Winter Protection
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Fight winter dryness and chapped skin with deep moisturizing emollients, pure cocoa butters, and gentle herbal cleansers.
                    </p>
                    <Link
                      href="/products/category/herbal-skincare"
                      className="text-xs font-semibold text-[#005A64] dark:text-[#FF6857] hover:underline block pt-2"
                    >
                      Browse Entire Skin Care â†’
                    </Link>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6857]">
                        Brightening Classic
                      </span>
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                        Dr. Alvin Kojic Soap
                      </h5>
                      <p className="text-xs text-zinc-500 mt-1">
                        Dermatologist formulated in Philippines for fading dark spots and clear radiant complexion.
                      </p>
                    </div>
                    <Link
                      href="/products/dr-alvin-kojic-acid-soap"
                      className="text-xs font-semibold text-[#FF6857] hover:underline flex items-center gap-1 mt-4"
                    >
                      Shop Kojic Bar (à§³700) <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Featured Dropdown Content */}
              {activeMenu === "featured" && (
                <div className="grid grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Popular Curations
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/category/featured?sort=bestselling"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857] font-medium"
                        >
                          Customer Bestsellers
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/featured?sort=newest"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          New Arrivals
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/thai-herbal-balm-combo-3pack"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857] inline-flex items-center gap-1.5"
                        >
                          <span>Thai Balm Trio Pack</span>
                          <span className="text-[10px] font-bold bg-[#FEF3F0] text-[#FF6857] px-1.5 py-0.5 rounded">
                            Save à§³500
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      By Category
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/category/soothing-balms"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Soothing Balms & Rubs
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/hair-oils"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Hair Oils & Scalp Care
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/essential-oils"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Spanish Extra Virgin Olive Oils
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/herbal-skincare"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]"
                        >
                          Herbal & Winter Skin Care
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Why Choose Cure-Care
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-500">
                      <li>âœ“ 100% Guaranteed Authentic Imports</li>
                      <li>âœ“ Express Cash on Delivery Across Bangladesh</li>
                      <li>âœ“ Verified Expiry Dates on All Items</li>
                      <li>âœ“ Temperature-Controlled Storage</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6857]">
                        Value Combo
                      </span>
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                        Thai Herbal Balm Trio Set
                      </h5>
                      <p className="text-xs text-zinc-500 mt-1">
                        Crocodile + Siam Tiger + Lemongrass 3-in-1 pack for complete family pain relief.
                      </p>
                    </div>
                    <Link
                      href="/products/thai-herbal-balm-combo-3pack"
                      className="text-xs font-semibold text-[#FF6857] hover:underline flex items-center gap-1 mt-4"
                    >
                      Shop Trio (à§³1,750) <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* About Dropdown Content */}
              {activeMenu === "about" && (
                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Our Philosophy
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Cure-Care brings verified authentic international health remedies, soothing balms, and pure oils directly to households across Bangladesh with full transparency and reliability.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Company
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/about" className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]">
                          About Cure-Care
                        </Link>
                      </li>
                      <li>
                        <Link href="/customer-care/contact" className="text-zinc-800 dark:text-zinc-200 hover:text-[#FF6857]">
                          Contact & Support
                        </Link>
                      </li>
                      <li>
                        <Link href="/admin" className="text-[#005A64] dark:text-[#FF6857] font-semibold hover:underline">
                          Admin Management Portal â†’
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Authenticity Promise
                      </span>
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                        Quality You Can Trust
                      </h5>
                      <p className="text-xs text-zinc-500 mt-1">
                        Direct importer partnerships ensure you never receive counterfeit formulations.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Container>
          </div>
        )}
      </header>

      {/* 4. Full Mobile Navigation Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white dark:bg-zinc-900 shadow-2xl flex flex-col h-full animate-in slide-in-from-left">
            <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
              <Logo size="md" />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-zinc-500 hover:text-zinc-900"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div className="space-y-1 font-medium text-base">
                <Link
                  href="/products/category/soothing-balms"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold text-[#005A64] dark:text-teal-300"
                >
                  Soothing Balms & Pain Relief
                </Link>
                <Link
                  href="/products/category/hair-oils"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Hair Oils & Scalp Care
                </Link>
                <Link
                  href="/products/category/essential-oils"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Essential Oils & Wellness
                </Link>
                <Link
                  href="/products/category/herbal-skincare"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Skin & Body Care
                </Link>
                <Link
                  href="/products/category/featured"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold text-[#FF6857]"
                >
                  Combos & Sets
                </Link>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-5 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-1.5 px-3 hover:text-zinc-950"
                >
                  About Cure-Care
                </Link>
                <Link
                  href="/customer-care/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-1.5 px-3 hover:text-zinc-950"
                >
                  Customer Support
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-1.5 px-3 font-semibold text-[#FF6857]"
                >
                  Admin Portal
                </Link>
              </div>
            </div>

            <div className="p-5 border-t border-[var(--border)] bg-[var(--surface-elevated)] space-y-3">
              <ThemeToggle variant="pill" />
              <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                <span>Currency</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {currency} (à§³)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Interactive Drawers */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
    </>
  );
};