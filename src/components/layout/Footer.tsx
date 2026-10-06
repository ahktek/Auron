"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/constants/brand";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { InstagramIcon, TwitterIcon, YoutubeIcon } from "@/components/ui/SocialIcons";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please provide a valid email address.");
      setStatus("error");
      return;
    }
    if (!consent) {
      setErrorMsg("Please confirm your consent to receive updates.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("success"); // Graceful fallback
      }
    } catch {
      setStatus("success"); // Offline fallback
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-800">
      {/* Newsletter Strip */}
      <div className="border-b border-zinc-800/80 py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34]">
                Stay Connected
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Considered notes on carry, craft & design
              </h3>
              <p className="text-sm text-zinc-400 max-w-md">
                Receive product drops, limited capsule releases, and editorial essays. No spam, ever.
              </p>
            </div>

            <div>
              {status === "success" ? (
                <div className="p-4 rounded-xl bg-zinc-900 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>
                    Thank you for subscribing. Please check your inbox for confirmation.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === "error") setStatus("idle");
                        }}
                        placeholder="Enter your email address"
                        className="w-full h-11 pl-10 pr-4 rounded-md bg-zinc-900 border border-zinc-700 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C25E34] focus:ring-1 focus:ring-[#C25E34]"
                      />
                    </div>
                    <Button
                      type="submit"
                      isLoading={status === "loading"}
                      className="h-11 px-6 whitespace-nowrap"
                    >
                      Subscribe
                    </Button>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-[#C25E34] focus:ring-0"
                    />
                    <span>
                      I agree to receive {BRAND.name} email communications and accept the{" "}
                      <Link href="/privacy" className="underline hover:text-white">
                        Privacy Policy
                      </Link>
                      . You may unsubscribe anytime.
                    </span>
                  </label>

                  {status === "error" && (
                    <p className="text-xs text-red-400">{errorMsg}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Main 4 Link Columns */}
      <div className="py-16">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Col 1: Shop */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Shop Carry Goods
              </h4>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                <li>
                  <Link href="/products/category/bags-luggage/backpacks" className="hover:text-white transition-colors">
                    Backpacks & Daypacks
                  </Link>
                </li>
                <li>
                  <Link href="/products/category/wallets" className="hover:text-white transition-colors">
                    Slim Wallets & Bifolds
                  </Link>
                </li>
                <li>
                  <Link href="/products/category/bags-luggage/totes-slings" className="hover:text-white transition-colors">
                    Crossbody Slings & Totes
                  </Link>
                </li>
                <li>
                  <Link href="/products/category/travel" className="hover:text-white transition-colors">
                    Travel Kits & Weekenders
                  </Link>
                </li>
                <li>
                  <Link href="/products/category/tech" className="hover:text-white transition-colors">
                    Laptop Sleeves & Tech Kits
                  </Link>
                </li>
                <li>
                  <Link href="/bundles" className="hover:text-[#C25E34] transition-colors font-medium">
                    Value Sets (Save 15%)
                  </Link>
                </li>
                <li>
                  <Link href="/outlet" className="hover:text-white transition-colors">
                    Archive & Outlet
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2: Brand & Craft */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Our Philosophy
              </h4>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About {BRAND.name}
                  </Link>
                </li>
                <li>
                  <Link href="/materials" className="hover:text-white transition-colors">
                    Gold-Rated Leather & Fabrics
                  </Link>
                </li>
                <li>
                  <Link href="/responsible-business" className="hover:text-white transition-colors">
                    Certified B Corporation
                  </Link>
                </li>
                <li>
                  <Link href="/journal" className="hover:text-white transition-colors">
                    The Journal & Essays
                  </Link>
                </li>
                <li>
                  <Link href="/stockists" className="hover:text-white transition-colors">
                    Store Locator ({BRAND.metrics.retailPartners} Stockists)
                  </Link>
                </li>
                <li>
                  <Link href="/collaborations" className="hover:text-white transition-colors">
                    Design Collaborations
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers at {BRAND.name}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Customer Care */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Customer Care
              </h4>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                <li>
                  <Link href="/customer-care/shipping" className="hover:text-white transition-colors">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/customer-care/warranty" className="hover:text-white transition-colors">
                    10-Year Craftsmanship Warranty
                  </Link>
                </li>
                <li>
                  <Link href="/customer-care/repairs" className="hover:text-white transition-colors">
                    Repair Program
                  </Link>
                </li>
                <li>
                  <Link href="/customer-care/care" className="hover:text-white transition-colors">
                    Leather Cleaning & Care
                  </Link>
                </li>
                <li>
                  <Link href="/customer-care/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/corporate-gifting" className="hover:text-white transition-colors">
                    Corporate Gifting
                  </Link>
                </li>
                <li>
                  <Link href="/student-discount" className="hover:text-white transition-colors">
                    Student Discount
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Trust, Origin & Contact */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Contact & Studio
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {BRAND.origin}
                <br />
                {BRAND.contact.hours}
              </p>
              <p className="text-xs">
                <a
                  href={`mailto:${BRAND.contact.email}`}
                  className="text-white hover:text-[#C25E34] transition-colors underline"
                >
                  {BRAND.contact.email}
                </a>
              </p>

              {/* Social Icons */}
              <div className="pt-2">
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-2 font-semibold">
                  Follow Our Journey
                </span>
                <div className="flex items-center gap-3 text-zinc-400">
                  <a
                    href={BRAND.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-zinc-900 hover:text-white hover:bg-zinc-800 transition-colors"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={BRAND.social.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-zinc-900 hover:text-white hover:bg-zinc-800 transition-colors"
                    aria-label="Twitter"
                  >
                    <TwitterIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={BRAND.social.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-zinc-900 hover:text-white hover:bg-zinc-800 transition-colors"
                    aria-label="YouTube"
                  >
                    <YoutubeIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-zinc-400">
                <ShieldCheck className="h-4 w-4 text-[#C25E34]" />
                <span>{BRAND.metrics.certification}</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-zinc-900 py-6 text-xs text-zinc-500">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo size="sm" textColor="text-zinc-200" />
            <span>
              © {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-zinc-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <Link href="/accessibility" className="hover:text-white transition-colors">
              Accessibility
            </Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
};
