"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProductItem, CATEGORIES } from "@/lib/store/catalog";
import { Button } from "@/components/ui/Button";
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
  RefreshCw,
  PackageCheck,
  ExternalLink,
} from "lucide-react";

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState("");

  // Form Fields for Modal Editor
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState(750);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(850);
  const [categorySlug, setCategorySlug] = useState("soothing-balms");
  const [primaryImage, setPrimaryImage] = useState("");
  const [inventory, setInventory] = useState(50);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewRelease, setIsNewRelease] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProductList(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = productList.filter((p) => {
    if (selectedCategory !== "ALL" && p.categorySlug !== selectedCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName("");
    setBasePrice(750);
    setCompareAtPrice(850);
    setCategorySlug("soothing-balms");
    setPrimaryImage("https://valobazar.com/storage/products/AuXI3nOuJdjMzECowT7hK9yL0sUJWwMQ34iJBzJk.jpg");
    setInventory(50);
    setIsBestseller(false);
    setIsNewRelease(true);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setName(p.name);
    setBasePrice(p.basePrice);
    setCompareAtPrice(p.compareAtPrice);
    setCategorySlug(p.categorySlug);
    setPrimaryImage(p.primaryImage);
    setInventory(p.variants?.[0]?.inventory ?? 50);
    setIsBestseller(!!p.isBestseller);
    setIsNewRelease(!!p.isNewRelease);
    setIsFeatured(!!p.isFeatured);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const catName =
      CATEGORIES.find((c) => c.slug === categorySlug)?.name ||
      "Soothing Balms & Pain Relief";

    if (editingProduct) {
      const updated: ProductItem = {
        ...editingProduct,
        name,
        basePrice: Number(basePrice),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        categorySlug,
        categoryName: catName,
        primaryImage,
        hoverImage: primaryImage,
        isBestseller,
        isNewRelease,
        isFeatured,
        variants: editingProduct.variants.map((v, i) =>
          i === 0
            ? { ...v, price: Number(basePrice), compareAtPrice, inventory: Number(inventory) }
            : v
        ),
      };

      try {
        const res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        const data = await res.json();
        if (data.success) {
          setProductList((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? updated : p))
          );
          showNotification(`"${name}" updated successfully.`);
        }
      } catch (err) {
        console.error("Save error:", err);
      }
    } else {
      const newProdPayload = {
        name,
        basePrice: Number(basePrice),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        categorySlug,
        categoryName: catName,
        primaryImage,
        inventory: Number(inventory),
        isBestseller,
        isNewRelease,
        isFeatured,
      };

      try {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProdPayload),
        });
        const data = await res.json();
        if (data.success && data.product) {
          setProductList([data.product, ...productList]);
          showNotification(`"${name}" created successfully.`);
        }
      } catch (err) {
        console.error("Create error:", err);
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${prodName}" from the live store?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProductList((prev) => prev.filter((p) => p.id !== id));
        showNotification(`"${prodName}" deleted.`);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Products & Inventory Catalog</span>
            <span className="text-xs font-normal text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full">
              {productList.length} Items
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time CRUD management for Cure-Care wellness products, BDT pricing, stock, and imagery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchProducts}
            variant="outline"
            size="sm"
            className="gap-1.5 text-zinc-300 border-zinc-700 hover:bg-zinc-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </Button>

          <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 bg-[#FF6857] hover:bg-[#e05646] text-white">
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </Button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or slug..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF6857]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white cursor-pointer focus:outline-none focus:border-[#FF6857]"
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
      <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Base Price</th>
                <th className="py-3 px-4 font-semibold">Stock</th>
                <th className="py-3 px-4 font-semibold">Flags</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filtered.map((p) => {
                const totalInventory =
                  p.variants?.reduce((acc, v) => acc + (v.inventory || 0), 0) ?? 50;
                return (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700/60">
                        {p.primaryImage ? (
                          <Image
                            src={p.primaryImage}
                            alt={p.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-white block truncate max-w-xs">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono block truncate max-w-xs">
                          {p.slug}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                      {p.categoryName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-white text-sm">
                        {formatPrice(p.basePrice, "BDT")}
                      </span>
                      {p.compareAtPrice && (
                        <span className="text-[10px] text-zinc-500 line-through ml-1.5">
                          {formatPrice(p.compareAtPrice, "BDT")}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-mono font-medium ${
                          totalInventory > 10 ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        <PackageCheck className="h-3 w-3" />
                        {totalInventory} units
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex gap-1.5">
                        {p.isBestseller && (
                          <span className="text-[10px] bg-[#FF6857]/20 text-[#FF6857] px-1.5 py-0.5 rounded font-semibold">
                            Bestseller
                          </span>
                        )}
                        {p.isNewRelease && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-semibold">
                            New
                          </span>
                        )}
                        {p.isFeatured && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/products/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="View Live"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Edit: ${editingProduct.name}` : "Create New Product"}
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">Product Title</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Siam Tiger Balm 50g"
              className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Base Price (৳ BDT)</label>
              <input
                type="number"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Compare-at Price (৳ BDT)</label>
              <input
                type="number"
                value={compareAtPrice || ""}
                onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Optional strike-through"
                className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Category</label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Stock Units</label>
              <input
                type="number"
                value={inventory}
                onChange={(e) => setInventory(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Image URL</label>
            <input
              type="url"
              required
              value={primaryImage}
              onChange={(e) => setPrimaryImage(e.target.value)}
              placeholder="https://valobazar.com/storage/products/..."
              className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
                className="rounded accent-[#FF6857]"
              />
              <span>Bestseller Flag</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={isNewRelease}
                onChange={(e) => setIsNewRelease(e.target.checked)}
                className="rounded accent-[#FF6857]"
              />
              <span>New Release</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded accent-[#FF6857]"
              />
              <span>Featured</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-zinc-700 text-zinc-300"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#FF6857] hover:bg-[#e05646] text-white">
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
