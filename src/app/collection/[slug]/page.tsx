import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/catalog/ProductCard";
import { COLLECTIONS, getProductsByCollection } from "@/lib/store/catalog";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: PageProps) {
  const resolvedParams = await params;
  const collection = COLLECTIONS.find((c) => c.slug === resolvedParams.slug);

  if (!collection) {
    notFound();
  }

  const products = getProductsByCollection(collection.slug);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1">
        {/* Editorial Hero Header */}
        <section className="relative w-full overflow-hidden bg-zinc-950 text-white py-20 lg:py-28">
          <div className="absolute inset-0">
            <Image
              src={collection.heroImage}
              alt={collection.title}
              fill
              priority
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          <Container className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>

            <div className="max-w-2xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FC5A43]">
                Curated Capsule Collection
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                {collection.title}
              </h1>
              <p className="text-lg text-zinc-200 leading-relaxed font-editorial italic">
                &ldquo;{collection.editorialHeader}&rdquo;
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed pt-1">
                {collection.subtitle}
              </p>
            </div>
          </Container>
        </section>

        {/* Curated Grid */}
        <section className="py-12 lg:py-16">
          <Container>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                {products.length} Curated Silhouettes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
