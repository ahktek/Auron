import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PRODUCTS } from "@/lib/store/catalog";
import { Badge } from "@/components/ui/Badge";
import { Sparkles } from "lucide-react";

export default function BundlesPage() {
  const bundles = PRODUCTS.filter((p) => p.isBundle);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <Container>
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="accent">Save 15% Automatically</Badge>
              <span className="text-xs text-zinc-500 font-medium">Curated Combinations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Bundles & Value Sets
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Carefully matched kits that work together seamlessly across commuting, international flights, and workspace organization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bundles.map((bundle) => (
              <ProductCard key={bundle.id} product={bundle} />
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
