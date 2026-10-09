"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/catalog/ProductCard";
import { searchProducts, PRODUCTS, ProductItem } from "@/lib/store/catalog";
import { Search, Sparkles } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<ProductItem[]>([]);

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      setResults(searchProducts(queryParam));
    }
  }, [queryParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setResults(searchProducts(query));
    }
  };

  const trendingProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <Container>
          {/* Big Search Input */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setResults(searchProducts(e.target.value));
                }}
                placeholder="Search carry goods by name, tag, or material..."
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-base shadow-xs focus:outline-none focus:border-[#FF6857] focus:ring-1 focus:ring-[#FF6857]"
              />
            </form>
          </div>

          {/* Results State */}
          {query.trim().length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                <span>
                  {results.length} {results.length === 1 ? "Result" : "Results"} Found for &ldquo;{query}&rdquo;
                </span>
              </div>

              {results.length === 0 ? (
                <div className="py-20 text-center space-y-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    No matching carry goods found
                  </p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Check spelling or browse our recommended bestsellers below.
                  </p>

                  <div className="pt-8 max-w-5xl mx-auto px-4">
                    <div className="flex items-center gap-1.5 justify-center text-xs font-bold uppercase tracking-wider text-[#FF6857] mb-6">
                      <Sparkles className="h-4 w-4" />
                      <span>Recommended Carry Goods</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                      {trendingProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {results.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Blank state: Trending items */
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-500">
                <Sparkles className="h-4 w-4 text-[#FF6857]" />
                <span>Trending Essentials</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
