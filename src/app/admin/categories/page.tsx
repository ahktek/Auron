"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FolderTree, Plus, Edit, Trash2, MoveUp, MoveDown, Check, Layers, RefreshCw } from "lucide-react";
import { CategoryItem } from "@/lib/store/catalog";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const moveCategory = async (index: number, direction: "up" | "down") => {
    const newItems = [...categories];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setCategories(newItems);

    try {
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItems),
      });
      showNotification("Category display order saved.");
    } catch (err) {
      console.error("Failed to save reordered categories:", err);
    }
  };

  const handleOpenCreate = () => {
    setName("");
    setSlug("");
    setDescription("");
    setImage("https://valobazar.com/storage/products/AuXI3nOuJdjMzECowT7hK9yL0sUJWwMQ34iJBzJk.jpg");
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const payload = {
      name,
      slug: finalSlug,
      description,
      image,
    };

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.category) {
        setCategories([...categories, data.category]);
        showNotification(`Category "${name}" created successfully.`);
      }
    } catch (err) {
      console.error("Failed to create category:", err);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCategory = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showNotification(`Category "${catName}" deleted.`);
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-[#FF6857]" />
            <span>Store Categories & Hierarchy</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage category taxonomy, display sorting order, and storefront navigation groups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchCategories}
            variant="outline"
            size="sm"
            className="gap-1.5 text-zinc-300 border-zinc-700 hover:bg-zinc-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="bg-[#FF6857] hover:bg-[#e05646] text-white gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Category</span>
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4 font-semibold w-16 text-center">Order</th>
              <th className="py-3 px-4 font-semibold">Category Details</th>
              <th className="py-3 px-4 font-semibold">URL Slug</th>
              <th className="py-3 px-4 font-semibold">Subcategories</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {categories.map((c, index) => (
              <tr key={c.id || c.slug} className="hover:bg-zinc-800/30 transition-colors">
                <td className="py-3 px-4 text-center font-mono font-bold text-zinc-400">
                  {index + 1}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {c.image && (
                      <div className="relative w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700/60">
                        <Image src={c.image} alt={c.name} fill sizes="40px" className="object-cover" />
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-white block text-sm">{c.name}</span>
                      <p className="text-[11px] text-zinc-400 max-w-md line-clamp-1">
                        {c.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-zinc-400 text-[11px]">
                  /products/category/{c.slug}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {c.subcategories && c.subcategories.length > 0 ? (
                      c.subcategories.map((sub) => (
                        <span
                          key={sub.slug}
                          className="bg-zinc-800 text-zinc-300 text-[10px] px-2 py-0.5 rounded"
                        >
                          {sub.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-500 italic">None</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => moveCategory(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveCategory(index, "down")}
                      disabled={index === categories.length - 1}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Category">
        <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">Category Name</label>
            <input
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                }
              }}
              placeholder="e.g. Traditional Balms"
              className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">URL Slug</label>
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="traditional-balms"
              className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description for category banner..."
              className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Banner Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
            />
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
              Create Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
