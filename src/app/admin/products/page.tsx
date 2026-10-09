"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PRODUCTS, ProductItem, CATEGORIES } from "@/lib/store/catalog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/utils";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  Eye,
  ArrowUpDown,
  Filter,
} from "lucide-react";

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<ProductItem[]>(PRODUCTS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields for Modal Editor
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState(199);
  const [categorySlug, setCategorySlug] = useState("bags-luggage");
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewRelease, setIsNewRelease] = useState(false);

  const filtered = productList.filter((p) => {
    if (selectedCategory !== "ALL" && p.categorySlug !== selectedCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName("");
    setBasePrice(149);
    setCategorySlug("bags-luggage");
    setIsBestseller(false);
    setIsNewRelease(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setName(p.name);
    setBasePrice(p.basePrice);
    setCategorySlug(p.categorySlug);
    setIsBestseller(!!p.isBestseller);
    setIsNewRelease(!!p.isNewRelease);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, name, basePrice, categorySlug, isBestseller, isNewRelease }
            : p
        )
      );
    } else {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const newProduct: ProductItem = {
        id: `prod_${Date.now()}`,
        slug,
        name,
        subtitle: `Engineered ${name} for daily movement and transit efficiency`,
        description: `Full description of ${name}`,
        details: "Reinforced bar-tacks and magnetic closure.",
        materialsInfo: "Constructed with gold-rated environmental leather and recycled ripstop.",
        dimensionsInfo: "Ergonomic engineered profile.",
        capacityInfo: "Tailored to carry essential gear cleanly.",
        careInfo: "Spot clean with damp cloth.",
        basePrice,
        currency: "USD",
        categorySlug,
        categoryName: CATEGORIES.find((c) => c.slug === categorySlug)?.name || "Bags & Luggage",
        collections: ["everyday-carry"],
        tags: ["carry", "new"],
        rating: 5.0,
        reviewCount: 0,
        isNewRelease,
        isBestseller,
        primaryImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
        hoverImage: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80"],
        variants: [
          {
            id: `v_${Date.now()}`,
            sku: `${slug.substring(0, 8).toUpperCase()}-BLK`,
            title: `${name} - Charcoal`,
            colorName: "Charcoal Ink",
            colorHex: "#27272A",
            price: basePrice,
            inventory: 50,
            isDefault: true,
            images: [],
          },
        ],
        reviews: [],
      };
      setProductList([newProduct, ...productList]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this product from the live catalog?")) {
      setProductList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Products & Inventory Catalog
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            CRUD product silhouettes, variant SKUs, pricing models, and stock limits.
          </p>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 self-start">
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF6857]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white cursor-pointer"
          >
            <option value="ALL">All Categories ({productList.length})</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950/60 text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Product</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Base Price</th>
              <th className="py-3 px-4 font-semibold">Variants / Total Stock</th>
              <th className="py-3 px-4 font-semibold">Flags</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {filtered.map((p) => {
              const totalInventory = p.variants.reduce((acc, v) => acc + v.inventory, 0);
              return (
                <tr key={p.id} className="hover:bg-zinc-800/30">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                      <Image src={p.primaryImage} alt={p.name} fill sizes="40px" className="object-cover" />
                    </div>
                    <div>
                      <span className="font-semibold text-white block">{p.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">{p.slug}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-zinc-400">{p.categoryName}</td>
                  <td className="py-3 px-4 font-bold text-white">{formatPrice(p.basePrice)}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white">{p.variants.length} colors</span>
                    <span className="text-zinc-500 ml-1">({totalInventory} units)</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {p.isBestseller && <Badge variant="accent" size="sm">Bestseller</Badge>}
                      {p.isNewRelease && <Badge variant="neutral" size="sm">New</Badge>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
                      title="Edit Product"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-400 rounded hover:bg-zinc-800"
                      title="Delete Product"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Editor */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product Silhouette" : "Create New Product Silhouette"}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <Input
            label="Product Title"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Apex Modular Tech Sling 10L"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Base Retail Price (USD)"
              type="number"
              required
              min={1}
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Category
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full h-10 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-6 pt-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
                className="rounded text-[#FF6857]"
              />
              <span>Mark as Bestseller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNewRelease}
                onChange={(e) => setIsNewRelease(e.target.checked)}
                className="rounded text-[#FF6857]"
              />
              <span>Mark as New Release</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
