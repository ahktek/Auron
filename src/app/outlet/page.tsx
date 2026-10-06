import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PRODUCTS } from "@/lib/store/catalog";
import { Badge } from "@/components/ui/Badge";

export default function OutletPage() {
  const saleProducts = PRODUCTS.filter((p) => p.compareAtPrice && p.compareAtPrice > p.basePrice);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <Container>
          <div className="max-w-3xl mb-12 space-y-3">
            <Badge variant="warning">Archive Pricing</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              The Cure-Care Outlet & Archive
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Discontinued colorways, seasonal archive editions, and final runs. Crafted to the exact same uncompromising standard, backed by our 10-year warranty.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
