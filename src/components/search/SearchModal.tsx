"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { searchProducts, ProductItem, PRODUCTS } from "@/lib/store/catalog";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cartContext";
import { Search, X, ArrowRight, History, Sparkles } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { currency } = useCart();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("auren_recent_searches");
      if (stored) setRecentSearches(JSON.parse(stored));
      else setRecentSearches(["Backpack", "Slim Wallet", "Laptop 16", "Sling"]);
    } catch {
      setRecentSearches(["Backpack", "Slim Wallet", "Laptop 16", "Sling"]);
    }
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setResults(searchProducts(query));
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectSearch = (term: string) => {
    setQuery(term);
    setResults(searchProducts(term));
    saveRecentSearch(term);
  };

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("auren_recent_searches", JSON.stringify(updated));
    } catch {}
  };

  const trendingProducts = PRODUCTS.slice(0, 3);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg" className="p-0 overflow-hidden">
      {/* Search Bar Input */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <Search className="h-5 w-5 text-zinc-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              saveRecentSearch(query.trim());
            }
          }}
          placeholder="Search products, materials, collections (e.g. Apex, Leather, Sling)..."
          className="w-full bg-transparent text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full"
            aria-label="Clear query"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
        {/* Results Found */}
        {query.trim().length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                {results.length} {results.length === 1 ? "Result" : "Results"} Found
              </span>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => {
                  saveRecentSearch(query);
                  onClose();
                }}
                className="text-xs font-semibold text-[#C25E34] hover:underline inline-flex items-center gap-1"
              >
                View all in search page <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {results.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                  No matching carry goods found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try checking for typos or explore our most sought-after silhouettes below.
                </p>
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  {trendingProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      onClick={onClose}
                      className="group border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 hover:border-zinc-400 transition-colors"
                    >
                      <div className="relative aspect-square w-full rounded bg-zinc-100 mb-2 overflow-hidden">
                        <Image src={p.primaryImage} alt={p.name} fill sizes="150px" className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">{p.name}</p>
                      <p className="text-[11px] text-zinc-500">{formatPrice(p.basePrice, currency)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    onClick={() => {
                      saveRecentSearch(query);
                      onClose();
                    }}
                    className="flex items-center gap-3.5 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                  >
                    <div className="relative w-14 h-14 rounded overflow-hidden bg-zinc-100 shrink-0">
                      <Image src={p.primaryImage} alt={p.name} fill sizes="60px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{p.name}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{p.categoryName}</p>
                      <p className="text-xs font-medium text-[#C25E34] mt-0.5">{formatPrice(p.basePrice, currency)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Empty Search Default: Recent Searches & Trending */
          <div className="space-y-6">
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
                  <History className="h-3.5 w-3.5" />
                  <span>Recent Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSelectSearch(term)}
                      className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-[#FDF5F0] hover:text-[#C25E34] transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Trending Essentials</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {trendingProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    onClick={onClose}
                    className="group border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 hover:border-[#C25E34] transition-colors bg-white dark:bg-zinc-900"
                  >
                    <div className="relative aspect-square w-full rounded bg-zinc-100 mb-2 overflow-hidden">
                      <Image src={p.primaryImage} alt={p.name} fill sizes="150px" className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">{p.name}</p>
                    <p className="text-[11px] text-zinc-500">{formatPrice(p.basePrice, currency)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
