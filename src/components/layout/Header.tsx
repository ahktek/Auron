"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/lib/store/cartContext";
import { BRAND } from "@/lib/constants/brand";
import { SearchModal } from "@/components/search/SearchModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
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
      <div className="bg-zinc-950 text-zinc-300 text-[11px] py-1.5 px-4 font-medium border-b border-zinc-800">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 hidden sm:inline">
              Thoughtfully engineered carry goods
            </span>
            <span className="text-white font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C25E34]" />
              Complimentary carbon-neutral shipping over $100
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/customer-care/shipping"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <HelpCircle className="h-3 w-3" />
              <span>Need help?</span>
            </Link>
            <Link
              href="/accessibility"
              className="hover:text-white transition-colors hidden md:inline"
            >
              Accessibility
            </Link>

            {/* Currency Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-1 text-zinc-300 hover:text-white font-medium uppercase tracking-wider"
              >
                <Globe className="h-3 w-3" />
                <span>{currency}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {isCurrencyOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl py-1 z-50 text-zinc-800 dark:text-zinc-200">
                  {BRAND.currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between ${
                        currency === curr.code ? "font-bold text-[#C25E34]" : ""
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

      {/* 2. Main Sticky Navigation Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-xs border-b border-zinc-200 dark:border-zinc-800"
            : "bg-[#FAF9F5] dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800"
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
            {/* Featured */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("featured")}
            >
              <Link
                href="/products/category/featured"
                className={`py-5 transition-colors border-b-2 ${
                  activeMenu === "featured"
                    ? "border-[#C25E34] text-zinc-950 dark:text-white"
                    : "border-transparent hover:text-zinc-950"
                }`}
              >
                Featured
              </Link>
            </div>

            {/* Bags & Luggage */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("bags")}
            >
              <Link
                href="/products/category/bags-luggage"
                className={`py-5 transition-colors border-b-2 ${
                  activeMenu === "bags"
                    ? "border-[#C25E34] text-zinc-950 dark:text-white"
                    : "border-transparent hover:text-zinc-950"
                }`}
              >
                Bags & Luggage
              </Link>
            </div>

            {/* Travel */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("travel")}
            >
              <Link
                href="/products/category/travel"
                className={`py-5 transition-colors border-b-2 ${
                  activeMenu === "travel"
                    ? "border-[#C25E34] text-zinc-950 dark:text-white"
                    : "border-transparent hover:text-zinc-950"
                }`}
              >
                Travel
              </Link>
            </div>

            {/* Wallets */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("wallets")}
            >
              <Link
                href="/products/category/wallets"
                className={`py-5 transition-colors border-b-2 ${
                  activeMenu === "wallets"
                    ? "border-[#C25E34] text-zinc-950 dark:text-white"
                    : "border-transparent hover:text-zinc-950"
                }`}
              >
                Wallets
              </Link>
            </div>

            {/* Tech */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("tech")}
            >
              <Link
                href="/products/category/tech"
                className={`py-5 transition-colors border-b-2 ${
                  activeMenu === "tech"
                    ? "border-[#C25E34] text-zinc-950 dark:text-white"
                    : "border-transparent hover:text-zinc-950"
                }`}
              >
                Tech
              </Link>
            </div>

            {/* Accessories */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter("accessories")}
            >
              <Link
                href="/products/category/accessories"
                className={`py-5 transition-colors border-b-2 ${
                  activeMenu === "accessories"
                    ? "border-[#C25E34] text-zinc-950 dark:text-white"
                    : "border-transparent hover:text-zinc-950"
                }`}
              >
                Accessories
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
                    ? "border-[#C25E34] text-zinc-950 dark:text-white"
                    : "border-transparent hover:text-zinc-950"
                }`}
              >
                <span>About Us</span>
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
              className="p-2 hover:text-zinc-950 dark:hover:text-white transition-colors"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Stockists */}
            <Link
              href="/stockists"
              className="p-2 hover:text-zinc-950 dark:hover:text-white transition-colors hidden sm:inline"
              aria-label="Find a stockist store"
              title="Store Locator"
            >
              <MapPin className="h-5 w-5" />
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="p-2 hover:text-zinc-950 dark:hover:text-white transition-colors"
              aria-label="Customer account"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Cart Trigger with Dynamic Badge */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 text-zinc-900 dark:text-zinc-100 hover:text-[#C25E34] transition-colors"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C25E34] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-in zoom-in-75">
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
              {/* Featured Dropdown Content */}
              {activeMenu === "featured" && (
                <div className="grid grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Popular
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/category/featured?sort=bestselling"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34] font-medium"
                        >
                          Bestsellers
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/featured?sort=newest"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          New Releases
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/bundles"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34] inline-flex items-center gap-1.5"
                        >
                          <span>Value Sets</span>
                          <span className="text-[10px] font-bold bg-[#FDF5F0] text-[#C25E34] px-1.5 py-0.5 rounded">
                            Save 15%
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/outlet"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Archive & Outlet
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      By Activity
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/category/travel"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Travel & Transit
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/collection/work-commute"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Work & Commute
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/collection/everyday-carry"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Daily Errands & EDC
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/collection/coastal-all-weather"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          All-Weather Expeditions
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      By Collection
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/collection/apex-flight"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          The Apex Flight Series
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/collection/leather-studio"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Minimalist Leather Studio
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/collection/midnight-edition"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          The Midnight Edition
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C25E34]">
                        Curated Spotlight
                      </span>
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                        The Daily Commuter Set
                      </h5>
                      <p className="text-xs text-zinc-500 mt-1">
                        Backpack + Tech Kit + Slim Bifold in coordinated charcoal or saddle tones.
                      </p>
                    </div>
                    <Link
                      href="/bundles"
                      className="text-xs font-semibold text-[#C25E34] hover:underline flex items-center gap-1 mt-4"
                    >
                      Shop Bundle <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Bags & Luggage */}
              {activeMenu === "bags" && (
                <div className="grid grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Backpacks
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/apex-transit-backpack-24l"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Apex Transit 24L
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/strata-daypack-18l"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Strata Daypack 18L
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/vanguard-commuter-rolltop-28l"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Vanguard Roll-Top 28L
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/bags-luggage/backpacks"
                          className="text-xs font-semibold text-[#C25E34] hover:underline"
                        >
                          View All Backpacks →
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Totes & Slings
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/nexus-crossbody-sling-7l"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Nexus Crossbody Sling 7L
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/bags-luggage/totes-slings"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Atelier Canvas Tote 20L
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/bags-luggage/totes-slings"
                          className="text-xs font-semibold text-[#C25E34] hover:underline"
                        >
                          View All Slings →
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Travel & Duffels
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/overland-weekender-duffel-42l"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Overland Weekender 42L
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/bags-luggage/luggage"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Aero Carry-On Spinner 38L
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        10-Year Warranty
                      </span>
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                        Repair Over Replace
                      </h5>
                      <p className="text-xs text-zinc-500 mt-1">
                        Engineered with modular, serviceable hardware and indestructible bar-tacks.
                      </p>
                    </div>
                    <Link
                      href="/customer-care/warranty"
                      className="text-xs font-semibold text-[#C25E34] hover:underline mt-4"
                    >
                      Read our guarantee →
                    </Link>
                  </div>
                </div>
              )}

              {/* Wallets */}
              {activeMenu === "wallets" && (
                <div className="grid grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Bifolds & Cards
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/apex-slim-bifold-wallet"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Apex Slim Bifold
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/card-sleeve-minimalist"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Card Sleeve Minimalist
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/wallets"
                          className="text-xs font-semibold text-[#C25E34] hover:underline"
                        >
                          View All Wallets →
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Travel & Passport
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/passport-transit-sleeve"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Passport Transit Sleeve
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Materials
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/materials"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Gold-Rated Eco Leather
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/materials"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          RFID Protection Layer
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-zinc-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C25E34]">
                        The Pocket Purge
                      </span>
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                        Slim Down Your Carry
                      </h5>
                      <p className="text-xs text-zinc-500 mt-1">
                        See how our pull-tab mechanism holds 11 cards in half the thickness.
                      </p>
                    </div>
                    <Link
                      href="/journal/the-pocket-purge-slimming-down-your-edc"
                      className="text-xs font-semibold text-[#C25E34] hover:underline mt-4"
                    >
                      Read guide →
                    </Link>
                  </div>
                </div>
              )}

              {/* Travel */}
              {activeMenu === "travel" && (
                <div className="grid grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Cabin & Luggage
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/overland-weekender-duffel-42l"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Overland Weekender 42L
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/bags-luggage/luggage"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Aero Carry-On Spinner
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Organizers & Dopps
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/dopp-standing-toiletry-kit"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Dopp Standing Toiletry Kit
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/passport-transit-sleeve"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Passport Transit Sleeve
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Packs & Sets
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/bundles"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Weekend Transit Bundle
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Airport Flow
                      </span>
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                        TSA-Friendly Transit
                      </h5>
                      <p className="text-xs text-zinc-500 mt-1">
                        Zero friction through security checkpoints with quick-draw laptop bays.
                      </p>
                    </div>
                    <Link
                      href="/products/category/travel"
                      className="text-xs font-semibold text-[#C25E34] hover:underline mt-4"
                    >
                      Shop Travel Gear →
                    </Link>
                  </div>
                </div>
              )}

              {/* Tech */}
              {activeMenu === "tech" && (
                <div className="grid grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Sleeves & Organizers
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/venture-tech-portfolio-kit"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Venture Tech Portfolio Kit
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/structured-leather-laptop-sleeve-16"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Structured Laptop Sleeve 16”
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Desk & Mobile Workspace
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/collection/work-commute"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Architect Leather Desk Mat
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Protection
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Neoprene shock dampening and scratch-free microfiber linings.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-zinc-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C25E34]">
                        Office & Remote
                      </span>
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                        The Desk Organization Kit
                      </h5>
                      <p className="text-xs text-zinc-500 mt-1">
                        Sleeve + Mat + Cable organizer.
                      </p>
                    </div>
                    <Link
                      href="/bundles"
                      className="text-xs font-semibold text-[#C25E34] hover:underline mt-4"
                    >
                      View Kit →
                    </Link>
                  </div>
                </div>
              )}

              {/* Accessories */}
              {activeMenu === "accessories" && (
                <div className="grid grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Key & Eyewear
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/orbit-key-folio-organizer"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Orbit Key Folio Organizer
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/category/accessories/eyewear-cases"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Origami Sunglasses Case
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Hardware & Details
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link
                          href="/products/category/accessories"
                          className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]"
                        >
                          Lanyards & Carabiners
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Gifting
                    </h4>
                    <Link
                      href="/corporate-gifting"
                      className="text-xs text-zinc-600 dark:text-zinc-300 hover:text-[#C25E34]"
                    >
                      Corporate & Wedding Gifting →
                    </Link>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Pocket Harmony
                      </span>
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                        Quiet Hardware
                      </h5>
                      <p className="text-xs text-zinc-500 mt-1">
                        Eliminate key clatter and glass scuffs completely.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* About Us */}
              {activeMenu === "about" && (
                <div className="grid grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Brand & Story
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link href="/about" className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]">
                          Our Story & Philosophy
                        </Link>
                      </li>
                      <li>
                        <Link href="/materials" className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]">
                          Responsible Materials
                        </Link>
                      </li>
                      <li>
                        <Link href="/responsible-business" className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]">
                          Certified B Corporation
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Journal & Media
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link href="/journal" className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]">
                          The AUREN Journal
                        </Link>
                      </li>
                      <li>
                        <Link href="/press" className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]">
                          Press & Features
                        </Link>
                      </li>
                      <li>
                        <Link href="/collaborations" className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]">
                          Artist Collaborations
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Visit & Connect
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                      <li>
                        <Link href="/stockists" className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]">
                          Store Locator & Stockists
                        </Link>
                      </li>
                      <li>
                        <Link href="/careers" className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]">
                          Careers
                        </Link>
                      </li>
                      <li>
                        <Link href="/affiliate" className="text-zinc-800 dark:text-zinc-200 hover:text-[#C25E34]">
                          Affiliate Program
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900 text-white flex flex-col justify-between">
                    <div>
                      <Sparkles className="h-4 w-4 text-[#C25E34] mb-2" />
                      <h5 className="font-bold text-sm">B Corp Certified</h5>
                      <p className="text-xs text-zinc-400 mt-1">
                        Meeting the highest verified standards of social and environmental performance.
                      </p>
                    </div>
                    <Link
                      href="/responsible-business"
                      className="text-xs font-semibold text-[#C25E34] hover:underline mt-4"
                    >
                      Our Impact Report →
                    </Link>
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
                  href="/products/category/featured"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold text-[#C25E34]"
                >
                  Featured & Bestsellers
                </Link>
                <Link
                  href="/products/category/bags-luggage"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Bags & Luggage
                </Link>
                <Link
                  href="/products/category/travel"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Travel Gear
                </Link>
                <Link
                  href="/products/category/wallets"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Wallets
                </Link>
                <Link
                  href="/products/category/tech"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Tech Cases & Sleeves
                </Link>
                <Link
                  href="/products/category/accessories"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Accessories
                </Link>
                <Link
                  href="/bundles"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Value Bundles (Save 15%)
                </Link>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-5 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-1.5 px-3 hover:text-zinc-950"
                >
                  Our Story
                </Link>
                <Link
                  href="/journal"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-1.5 px-3 hover:text-zinc-950"
                >
                  Journal
                </Link>
                <Link
                  href="/stockists"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-1.5 px-3 hover:text-zinc-950"
                >
                  Stockist Stores
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
                  className="block py-1.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  Admin Portal
                </Link>
              </div>
            </div>

            <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-[#FAF9F5] dark:bg-zinc-950">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Currency</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {currency}
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
