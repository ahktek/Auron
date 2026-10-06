"use client";

import React, { useState } from "react";
import { FolderTree, Plus, Edit, Trash2, MoveUp, MoveDown, Check, Layers } from "lucide-react";
import { CATEGORIES, COLLECTIONS } from "@/lib/store/catalog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(
    CATEGORIES.map((c, i) => ({ ...c, order: i + 1, active: true }))
  );
  const [collections, setCollections] = useState(
    COLLECTIONS.map((c, i) => ({ ...c, order: i + 1, active: true }))
  );
  const [activeTab, setActiveTab] = useState<"categories" | "collections">("categories");
  const [notification, setNotification] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const moveItem = (index: number, direction: "up" | "down", type: "categories" | "collections") => {
    if (type === "categories") {
      const newItems = [...categories];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newItems.length) return;
      const temp = newItems[index];
      newItems[index] = newItems[targetIndex];
      newItems[targetIndex] = temp;
      setCategories(newItems);
      showNotification("Category order updated.");
    } else {
      const newItems = [...collections];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newItems.length) return;
      const temp = newItems[index];
      newItems[index] = newItems[targetIndex];
      newItems[targetIndex] = temp;
      setCollections(newItems);
      showNotification("Collection order updated.");
    }
  };

  const toggleActive = (id: string, type: "categories" | "collections") => {
    if (type === "categories") {
      setCategories(categories.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
    } else {
      setCollections(collections.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
    }
    showNotification("Visibility toggled.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-amber-500" />
            Taxonomy & Curations
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage category hierarchy, sub-category groupings, collections, and catalog navigation ordering.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={() => showNotification("Modal open: Create new taxonomy entry")}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New {activeTab === "categories" ? "Category" : "Collection"}
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          {notification}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === "categories"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          Product Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab("collections")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === "collections"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Curated Collections ({collections.length})
        </button>
      </div>

      {/* Categories View */}
      {activeTab === "categories" ? (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden divide-y divide-zinc-800/80">
          <div className="grid grid-cols-12 px-6 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-900">
            <span className="col-span-1">Sort</span>
            <span className="col-span-4">Category Name & Slug</span>
            <span className="col-span-4">Description</span>
            <span className="col-span-1 text-center">Status</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="grid grid-cols-12 px-6 py-4 items-center text-xs hover:bg-zinc-800/30 transition-colors"
            >
              <div className="col-span-1 flex items-center gap-1">
                <button
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, "up", "categories")}
                  className="p-1 hover:bg-zinc-800 rounded disabled:opacity-20 text-zinc-400 hover:text-white"
                  title="Move up"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={idx === categories.length - 1}
                  onClick={() => moveItem(idx, "down", "categories")}
                  className="p-1 hover:bg-zinc-800 rounded disabled:opacity-20 text-zinc-400 hover:text-white"
                  title="Move down"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="col-span-4 space-y-0.5">
                <p className="font-semibold text-zinc-100">{cat.name}</p>
                <p className="text-[11px] font-mono text-zinc-500">/products/category/{cat.slug}</p>
              </div>

              <div className="col-span-4 text-zinc-400 truncate pr-4">
                {cat.description}
              </div>

              <div className="col-span-1 text-center">
                <button
                  onClick={() => toggleActive(cat.id, "categories")}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                    cat.active
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {cat.active ? "Active" : "Hidden"}
                </button>
              </div>

              <div className="col-span-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => showNotification(`Editing ${cat.name}`)}
                  className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => showNotification(`Deleted ${cat.name}`)}
                  className="p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Collections View */
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden divide-y divide-zinc-800/80">
          <div className="grid grid-cols-12 px-6 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-900">
            <span className="col-span-1">Sort</span>
            <span className="col-span-4">Collection Title & Slug</span>
            <span className="col-span-4">Description</span>
            <span className="col-span-1 text-center">Status</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {collections.map((col, idx) => (
            <div
              key={col.id}
              className="grid grid-cols-12 px-6 py-4 items-center text-xs hover:bg-zinc-800/30 transition-colors"
            >
              <div className="col-span-1 flex items-center gap-1">
                <button
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, "up", "collections")}
                  className="p-1 hover:bg-zinc-800 rounded disabled:opacity-20 text-zinc-400 hover:text-white"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={idx === collections.length - 1}
                  onClick={() => moveItem(idx, "down", "collections")}
                  className="p-1 hover:bg-zinc-800 rounded disabled:opacity-20 text-zinc-400 hover:text-white"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="col-span-4 space-y-0.5">
                <p className="font-semibold text-zinc-100">{col.name}</p>
                <p className="text-[11px] font-mono text-zinc-500">/collection/{col.slug}</p>
              </div>

              <div className="col-span-4 text-zinc-400 truncate pr-4">
                {col.subtitle}
              </div>

              <div className="col-span-1 text-center">
                <button
                  onClick={() => toggleActive(col.id, "collections")}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                    col.active
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {col.active ? "Active" : "Hidden"}
                </button>
              </div>

              <div className="col-span-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => showNotification(`Editing ${col.name}`)}
                  className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => showNotification(`Deleted ${col.name}`)}
                  className="p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
