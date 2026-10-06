"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductItem } from "@/lib/store/catalog";
import { Button } from "@/components/ui/Button";
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  ArrowUpDown,
  Check,
} from "lucide-react";

interface CategoryListingClientProps {
  categorySlug: string;
  categoryName: string;
  categoryDescription: string;
  subcategories: { name: string; slug: string }[];
  currentSubcategorySlug?: string;
  initialProducts: ProductItem[];
  searchParams: { [key: string]: string | string[] | undefined };
}

export const CategoryListingClient: React.FC<CategoryListingClientProps> = ({
  categorySlug,
  categoryName,
  categoryDescription,
  subcategories,
  currentSubcategorySlug,
  initialProducts,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filter States
  const [selectedColor, setSelectedColor] = useState<string>(
    searchParams.get("color") || ""
  );
  const [selectedMaterial, setSelectedMaterial] = useState<string>(
    searchParams.get("material") || ""
  );
  const [selectedPriceMax, setSelectedPriceMax] = useState<number>(
    Number(searchParams.get("maxPrice")) || 400
  );
  const [inStockOnly, setInStockOnly] = useState<boolean>(
    searchParams.get("inStock") === "true"
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sort") || "bestselling"
  );
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Available unique colors across products
  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    initialProducts.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.colorName && !map.has(v.colorName)) {
          map.set(v.colorName, v.colorHex);
        }
      });
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [initialProducts]);

  // Available materials
  const availableMaterials = ["Recycled Polyester", "Full-Grain Leather", "Ripstop Nylon", "Polycarbonate"];

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Price
        if (p.basePrice > selectedPriceMax) return false;
        // In Stock
        if (inStockOnly && p.isSoldOut) return false;
        // Color
        if (selectedColor && !p.variants.some((v) => v.colorName.toLowerCase() === selectedColor.toLowerCase())) {
          return false;
        }
        // Material
        if (selectedMaterial && !p.materialsInfo.toLowerCase().includes(selectedMaterial.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.basePrice - b.basePrice;
        if (sortBy === "price_desc") return b.basePrice - a.basePrice;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "newest") return (b.isNewRelease ? 1 : 0) - (a.isNewRelease ? 1 : 0);
        // Default bestselling
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [initialProducts, selectedColor, selectedMaterial, selectedPriceMax, inStockOnly, sortBy]);

  const clearAllFilters = () => {
    setSelectedColor("");
    setSelectedMaterial("");
    setSelectedPriceMax(400);
    setInStockOnly(false);
  };

  const activeFilterCount =
    (selectedColor ? 1 : 0) +
    (selectedMaterial ? 1 : 0) +
    (selectedPriceMax < 400 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <div className="py-8 lg:py-12">
      <Container>
        {/* Breadcrumb */}
        <nav className="text-xs text-zinc-500 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-900">
            Home
          </Link>
          <span>/</span>
          <Link href={`/products/category/${categorySlug}`} className="hover:text-zinc-900 font-medium text-zinc-800 dark:text-zinc-200">
            {categoryName}
          </Link>
          {currentSubcategorySlug && (
            <>
              <span>/</span>
              <span className="text-[#FC5A43] font-semibold capitalize">
                {currentSubcategorySlug.replace("-", " ")}
              </span>
            </>
          )}
        </nav>

        {/* Editorial Page Header */}
        <div className="max-w-3xl mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {currentSubcategorySlug
              ? subcategories.find((s) => s.slug === currentSubcategorySlug)?.name || categoryName
              : categoryName}
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {categoryDescription}
          </p>
        </div>

        {/* Subcategories Pills Strip */}
        {subcategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
            <Link
              href={`/products/category/${categorySlug}`}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                !currentSubcategorySlug
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                  : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
              }`}
            >
              All {categoryName}
            </Link>
            {subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/products/category/${categorySlug}/${sub.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  currentSubcategorySlug === sub.slug
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                    : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {/* Filter & Sort Bar */}
        <div className="flex items-center justify-between border-y border-zinc-200 dark:border-zinc-800 py-3.5 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#FC5A43] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-zinc-500 hover:text-[#FC5A43] font-medium underline"
              >
                Clear all ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold bg-transparent border-0 text-zinc-900 dark:text-zinc-100 focus:ring-0 cursor-pointer"
            >
              <option value="bestselling">Bestselling</option>
              <option value="newest">New Releases</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {isFilterDrawerOpen && (
          <div className="p-6 mb-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-1 duration-200 shadow-sm">
            {/* Color Filter */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Color
              </span>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() =>
                      setSelectedColor(selectedColor === c.name ? "" : c.name)
                    }
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border cursor-pointer transition-all duration-150 active:scale-90 ${
                      selectedColor === c.name
                        ? "border-[#FC5A43] bg-[#FEF3F0] text-[#FC5A43] font-semibold scale-105 shadow-2xs"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 hover:scale-105"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Material Filter */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Material
              </span>
              <div className="flex flex-wrap gap-2">
                {availableMaterials.map((mat) => (
                  <button
                    key={mat}
                    type="button"
                    onClick={() =>
                      setSelectedMaterial(selectedMaterial === mat ? "" : mat)
                    }
                    className={`px-3 py-1 rounded-full text-xs border cursor-pointer transition-all duration-150 active:scale-90 ${
                      selectedMaterial === mat
                        ? "border-[#FC5A43] bg-[#FEF3F0] text-[#FC5A43] font-semibold scale-105 shadow-2xs"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 hover:scale-105"
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max Slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-zinc-500">
                  Max Price
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  ${selectedPriceMax}
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="400"
                step="10"
                value={selectedPriceMax}
                onChange={(e) => setSelectedPriceMax(Number(e.target.value))}
                className="w-full accent-[#FC5A43] cursor-pointer"
              />
            </div>

            {/* Availability */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Availability
              </span>
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-zinc-300 text-[#FC5A43] focus:ring-[#FC5A43]"
                />
                <span>In Stock only</span>
              </label>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>
              Showing {filteredProducts.length} of {initialProducts.length} carry goods
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <p className="font-semibold text-lg text-zinc-800 dark:text-zinc-200">
                No carry goods matched your active filters
              </p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Try widening your price range or clearing color and material filters.
              </p>
              <Button onClick={clearAllFilters} variant="outline" size="sm">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
