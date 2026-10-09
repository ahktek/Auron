import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { CATEGORIES, COLLECTIONS, PRODUCTS } from "@/lib/store/catalog";

export default function HTMLSitemapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container>
          <div className="max-w-3xl mb-12 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Cure-Care Site Directory
            </h1>
            <p className="text-sm text-zinc-500">
              Complete index of all catalog sections, collections, stories, and customer support pages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Catalog Categories */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#FF6857]">
                Categories
              </h3>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/products/category/${c.slug}`} className="hover:text-zinc-950 font-medium">
                      {c.name}
                    </Link>
                    {c.subcategories.length > 0 && (
                      <ul className="pl-4 mt-1 space-y-1 text-xs text-zinc-500">
                        {c.subcategories.map((sub) => (
                          <li key={sub.slug}>
                            <Link href={`/products/category/${c.slug}/${sub.slug}`} className="hover:underline">
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Collections & Bundles */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#FF6857]">
                Collections & Special
              </h3>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                {COLLECTIONS.map((col) => (
                  <li key={col.slug}>
                    <Link href={`/collection/${col.slug}`} className="hover:text-zinc-950">
                      {col.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/bundles" className="hover:text-zinc-950 font-medium text-[#FF6857]">
                    Value Sets & Bundles
                  </Link>
                </li>
                <li>
                  <Link href="/outlet" className="hover:text-zinc-950">
                    Outlet & Archive
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-zinc-950">
                    Coming Soon
                  </Link>
                </li>
                <li>
                  <Link href="/stockists" className="hover:text-zinc-950">
                    Stockists Locator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Content & Care */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#FF6857]">
                Company & Care
              </h3>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li><Link href="/about" className="hover:text-zinc-950">About Us</Link></li>
                <li><Link href="/materials" className="hover:text-zinc-950">Materials</Link></li>
                <li><Link href="/responsible-business" className="hover:text-zinc-950">Responsible Business</Link></li>
                <li><Link href="/journal" className="hover:text-zinc-950">Journal</Link></li>
                <li><Link href="/customer-care/shipping" className="hover:text-zinc-950">Shipping & Delivery</Link></li>
                <li><Link href="/customer-care/warranty" className="hover:text-zinc-950">Warranty</Link></li>
                <li><Link href="/customer-care/repairs" className="hover:text-zinc-950">Repairs</Link></li>
                <li><Link href="/customer-care/contact" className="hover:text-zinc-950">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-zinc-950">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-zinc-950">Terms</Link></li>
                <li><Link href="/accessibility" className="hover:text-zinc-950">Accessibility Statement</Link></li>
              </ul>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
