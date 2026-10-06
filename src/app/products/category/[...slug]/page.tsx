import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CATEGORIES, getProductsByCategory } from "@/lib/store/catalog";
import { CategoryListingClient } from "./CategoryListingClient";

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const categorySlug = resolvedParams.slug[0];
  const subcategorySlug = resolvedParams.slug[1];

  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category && categorySlug !== "featured") {
    notFound();
  }

  const categoryName = category ? category.name : "Featured Collection";
  const categoryDesc = category ? category.description : "Curated highlights, bestsellers, and newly released silhouettes.";
  const subcategories = category ? category.subcategories : [];

  const products = getProductsByCategory(categorySlug, subcategorySlug);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1">
        <Suspense fallback={null}>
          <CategoryListingClient
            categorySlug={categorySlug}
            categoryName={categoryName}
            categoryDescription={categoryDesc}
            subcategories={subcategories}
            currentSubcategorySlug={subcategorySlug}
            initialProducts={products}
            searchParams={resolvedSearchParams}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
