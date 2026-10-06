import Link from "next/link";
import { BRAND } from "@/lib/constants/brand";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { ArrowRight, ShieldCheck, Sparkles, Compass } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Announcement Bar */}
      <div className="bg-zinc-900 text-white text-xs py-2 px-4 text-center font-medium">
        <span>Complimentary worldwide shipping on orders over $100 · 30-day trial guarantee</span>
      </div>

      {/* Temporary Hero Navigation Header */}
      <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <Container className="h-16 flex items-center justify-between">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-700">
            <Link href="/products/category/bags-luggage" className="hover:text-zinc-950 transition-colors">
              Bags & Luggage
            </Link>
            <Link href="/products/category/wallets" className="hover:text-zinc-950 transition-colors">
              Wallets
            </Link>
            <Link href="/products/category/travel" className="hover:text-zinc-950 transition-colors">
              Travel
            </Link>
            <Link href="/products/category/tech" className="hover:text-zinc-950 transition-colors">
              Tech
            </Link>
            <Link href="/journal" className="hover:text-zinc-950 transition-colors">
              Journal
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="outline" size="sm">Admin Portal</Button>
            </Link>
          </div>
        </Container>
      </header>

      {/* Hero Section Preview */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#FAF9F5] py-20 lg:py-28">
          <Container>
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-2">
                <Badge variant="accent">New Architecture & Design System</Badge>
                <span className="text-xs text-zinc-500 font-medium">Phase 1 Complete</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                Considered Carry for <br />
                <span className="font-editorial italic font-normal text-[#C25E34]">Modern Movement</span>
              </h1>
              <p className="text-lg sm:text-xl text-zinc-600 leading-relaxed max-w-2xl">
                Thoughtfully engineered backpacks, flat-pocket wallets, and travel folios crafted with gold-rated leather and recycled technical fabrics.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/products/category/bags-luggage">
                  <Button size="lg" className="group">
                    Explore Catalog
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline" size="lg">
                    Admin Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Brand Values / Value Props */}
        <section className="border-y border-zinc-200/80 bg-white py-16">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#FDF5F0] text-[#C25E34]">
                  <Compass className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-zinc-900">Architectural Precision</h3>
                  <p className="text-sm text-zinc-500">
                    Engineered to reduce daily transit friction through magnetic closures and intuitive volume distribution.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#FDF5F0] text-[#C25E34]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-zinc-900">Gold-Rated Eco Leather</h3>
                  <p className="text-sm text-zinc-500">
                    Supple, durable hides sourced exclusively from Leather Working Group environmental awardees.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#FDF5F0] text-[#C25E34]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-zinc-900">10-Year Craftsmanship</h3>
                  <p className="text-sm text-zinc-500">
                    Modular components and reinforced stress points designed to be repaired, never discarded.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-900 text-zinc-400 py-12">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo size="md" textColor="text-white" />
              <span className="text-xs text-zinc-500">· {BRAND.origin}</span>
            </div>
            <p className="text-xs text-zinc-500">
              © {new Date().getFullYear()} {BRAND.legalName}. All rights reserved. {BRAND.metrics.certification}.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
