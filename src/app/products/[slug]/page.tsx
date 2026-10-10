import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getStoredProducts } from "@/lib/store/productStore";
import { ProductDetailClient } from "./ProductDetailClient";
import { BRAND } from "@/lib/constants/brand";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const products = getStoredProducts();
  const product = products.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | ${BRAND.name}`,
    description: product.subtitle,
    openGraph: {
      title: `${product.name} | ${BRAND.name}`,
      description: product.subtitle,
      images: [{ url: product.primaryImage }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const products = getStoredProducts();
  const product = products.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  // Generate JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.variants[0]?.sku,
    brand: {
      "@type": "Brand",
      name: BRAND.name,
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://curecarebd.com"}/products/${product.slug}`,
      priceCurrency: "BDT",
      price: product.basePrice,
      availability:
        product.variants.reduce((acc, v) => acc + (v.inventory || 0), 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: BRAND.name,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <Suspense fallback={null}>
          <ProductDetailClient
            product={product}
            relatedProducts={relatedProducts}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
