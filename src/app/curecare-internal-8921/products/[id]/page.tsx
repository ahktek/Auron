"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductItem, CATEGORIES, Variant } from "@/lib/store/catalog";
import { ProductImageUpload } from "@/components/admin/ProductImageUpload";
import { ProductGallerySection } from "@/components/admin/ProductGallerySection";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Save,
  ExternalLink,
  Eye,
  EyeOff,
  Check,
  Package,
  Layers,
  Sparkles,
  Search,
  DollarSign,
  AlertCircle,
  Trash2,
  X,
} from "lucide-react";

export default function ProductDetailsEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Editable Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [usageInstructions, setUsageInstructions] = useState("");
  const [basePrice, setBasePrice] = useState(750);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(850);
  const [categorySlug, setCategorySlug] = useState("soothing-balms");
  const [primaryImage, setPrimaryImage] = useState("");
  const [hoverImage, setHoverImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [inventory, setInventory] = useState(50);
  const [isActive, setIsActive] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewRelease, setIsNewRelease] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/curecare-internal-8921/products");
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          const found = data.products.find((p: ProductItem) => p.id === id);
          if (found) {
            setProduct(found);
            setName(found.name || "");
            setSlug(found.slug || "");
            setSubtitle(found.subtitle || "");
            setDescription(found.description || "");
            setBenefits(found.benefits || ["100% Herbal & Authentic", "Fast Soothing Comfort", "Safe for Daily Use"]);
            setIngredients(found.ingredients || found.materialsInfo || "Pure Herbal Extracts & Essential Oils");
            setUsageInstructions(found.usageInstructions || found.careInfo || "Apply gently to affected area 2-3 times daily.");
            setBasePrice(found.basePrice || 750);
            setCompareAtPrice(found.compareAtPrice);
            setCategorySlug(found.categorySlug || "soothing-balms");
            setPrimaryImage(found.primaryImage || "");
            setHoverImage(found.hoverImage || found.primaryImage || "");

            // Populate gallery images (up to 5 max)
            const initialGallery = Array.from(
              new Set([
                found.primaryImage,
                found.hoverImage,
                ...(found.images || []),
              ].filter(Boolean) as string[])
            ).slice(0, 5);
            setGalleryImages(initialGallery);

            setInventory(found.variants?.[0]?.inventory ?? 50);
            setIsActive(found.isActive !== false);
            setIsBestseller(!!found.isBestseller);
            setIsNewRelease(!!found.isNewRelease);
            setIsFeatured(!!found.isFeatured);
            setSeoTitle(found.seoTitle || `${found.name} | Authentic Cure-Care BD`);
            setSeoDescription(found.seoDescription || found.subtitle || found.description || "");
          } else {
            setErrorMessage("Product SKU not found.");
          }
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
        setErrorMessage("Network error loading product details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!product) return;

    setIsSaving(true);
    setErrorMessage("");

    const catName =
      CATEGORIES.find((c) => c.slug === categorySlug)?.name ||
      "Soothing Balms & Pain Relief";

    const existingVariants: Variant[] = product.variants && product.variants.length > 0
      ? product.variants
      : [
          {
            id: `${product.id}-default`,
            sku: `${product.id}-001`,
            title: "Standard",
            colorName: "Natural",
            colorHex: "#005A64",
            price: Number(basePrice),
            compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
            inventory: Number(inventory),
            isDefault: true,
            images: [primaryImage],
          },
        ];

    // Clean and synchronize gallery images (enforcing 5 image limit)
    const validGallery = galleryImages.filter(Boolean).slice(0, 5);
    const finalPrimary = primaryImage || validGallery[0] || "";
    const finalHover = hoverImage || validGallery[1] || finalPrimary || "";

    // Ensure finalPrimary is included in the gallery array
    let finalGallery = [...validGallery];
    if (finalPrimary && !finalGallery.includes(finalPrimary)) {
      finalGallery = [finalPrimary, ...finalGallery].slice(0, 5);
    }

    const updatedProduct: ProductItem = {
      ...product,
      name,
      slug,
      subtitle,
      description,
      details: description,
      benefits,
      ingredients,
      materialsInfo: ingredients,
      usageInstructions,
      careInfo: usageInstructions,
      basePrice: Number(basePrice),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      categorySlug,
      categoryName: catName,
      primaryImage: finalPrimary,
      hoverImage: finalHover,
      images: finalGallery,
      isActive,
      isBestseller,
      isNewRelease,
      isFeatured,
      isSoldOut: Number(inventory) <= 0,
      seoTitle,
      seoDescription,
      variants: existingVariants.map((v, i) =>
        i === 0
          ? {
              ...v,
              price: Number(basePrice),
              compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
              inventory: Number(inventory),
              inStock: Number(inventory) > 0,
              images: finalGallery.length > 0 ? finalGallery : [finalPrimary],
            }
          : v
      ),
    };

    try {
      const res = await fetch("/api/curecare-internal-8921/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      const data = await res.json();
      if (data.success) {
        setProduct(updatedProduct);
        showNotification("All product details and SEO changes saved successfully.");
      } else {
        setErrorMessage(data.error || "Failed to save product details.");
      }
    } catch (err) {
      console.error("Save error:", err);
      setErrorMessage("Network error saving changes. Please retry.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    if (confirm(`Permanently delete "${product.name}" from the live store?`)) {
      try {
        const res = await fetch(`/api/curecare-internal-8921/products?id=${product.id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          router.push("/curecare-internal-8921/products");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete product.");
      }
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-400 text-xs">
        Loading product specification matrix...
      </div>
    );
  }

  if (errorMessage && !product) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-red-400 text-sm font-semibold">{errorMessage}</p>
        <Link
          href="/curecare-internal-8921/products"
          className="inline-flex items-center gap-2 text-xs text-zinc-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl pb-24 text-zinc-100 font-sans">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/curecare-internal-8921/products"
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Back to Catalog"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight truncate max-w-md">
                {name || "Edit Product"}
              </h1>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  isActive
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : "bg-zinc-900 text-zinc-400 border border-zinc-700"
                }`}
              >
                {isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                {isActive ? "Active on Site" : "Draft / Hidden"}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              SKU: {product?.id} · URL Slug: /{slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/products/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Live Product</span>
          </a>

          <Button
            onClick={() => handleSave()}
            isLoading={isSaving}
            className="gap-2 bg-[#FF6857] hover:bg-[#e05646] text-white shadow-lg shadow-[#FF6857]/20 text-xs px-5 py-2"
          >
            <Save className="h-4 w-4" />
            <span>Save All Details</span>
          </Button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Core Info & Descriptions (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Core Titles & Tagline */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800/80 pb-3">
              <Package className="h-4 w-4 text-[#FF6857]" />
              <span>Core Information & Identification</span>
            </h2>

            <div>
              <label className="block text-zinc-300 font-medium text-xs mb-1">
                Product Title (Storefront Display)
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#FF6857]"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium text-xs mb-1">
                Subtitle / Secondary Tagline
              </label>
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Authentic Herbal Balm with Camphor & Menthol"
                className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#FF6857]"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium text-xs mb-1">
                Detailed Product Description & Story
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write detailed therapeutic effects, sourcing tradition, and application advantages..."
                className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs leading-relaxed focus:outline-none focus:border-[#FF6857]"
              />
            </div>
          </div>

          {/* Section 2: Therapeutic Benefits & Ingredients */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800/80 pb-3">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Key Benefits, Ingredients & Directions</span>
            </h2>

            {/* Key Benefits List */}
            <div className="space-y-2">
              <label className="block text-zinc-300 font-medium text-xs">
                Key Benefits (Bullet points displayed on Product Page)
              </label>
              <div className="flex gap-2">
                <input
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddBenefit();
                    }
                  }}
                  placeholder="e.g. Relieves joint stiffness in 10 minutes"
                  className="flex-1 h-8 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#FF6857]"
                />
                <Button
                  type="button"
                  onClick={handleAddBenefit}
                  size="sm"
                  className="h-8 text-xs bg-zinc-800 hover:bg-zinc-700 text-white"
                >
                  Add Benefit
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {benefits.map((b, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-200 border border-zinc-700"
                  >
                    <span>{b}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(idx)}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-zinc-300 font-medium text-xs mb-1">
                  Active Ingredients / Formulation
                </label>
                <textarea
                  rows={3}
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g. Camphor, Menthol, Methyl Salicylate, Clove Oil"
                  className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#FF6857]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium text-xs mb-1">
                  Directions & Usage Guidelines
                </label>
                <textarea
                  rows={3}
                  value={usageInstructions}
                  onChange={(e) => setUsageInstructions(e.target.value)}
                  placeholder="e.g. Gently massage onto temples, neck, or muscles 2-3 times daily."
                  className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#FF6857]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: SEO & Canonical URL */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800/80 pb-3">
              <Search className="h-4 w-4 text-amber-400" />
              <span>Search Engine Optimization (SEO) & URL</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">SEO Title Tag</label>
                <input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">URL Handle (Slug)</label>
                <div className="flex items-center rounded-lg bg-zinc-950 border border-zinc-700 overflow-hidden">
                  <span className="px-3 text-zinc-500 font-mono text-xs border-r border-zinc-800">
                    curecarebd.com/products/
                  </span>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                    className="flex-1 h-9 px-3 text-white text-xs font-mono bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Google Search Preview Snippet */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1 mt-3">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                  Google SERP Preview
                </span>
                <p className="text-sm font-medium text-[#FF6857] hover:underline cursor-pointer">
                  {seoTitle || name}
                </p>
                <p className="text-[11px] text-emerald-400 font-mono">
                  https://curecarebd.com/products/{slug}
                </p>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  {seoDescription || subtitle || description}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Robust Full-Width Product Media Gallery (5 Images Maximum) */}
          <ProductGallerySection
            images={galleryImages}
            onChange={(imgs) => {
              setGalleryImages(imgs);
              if (imgs.length > 0 && (!primaryImage || !imgs.includes(primaryImage))) {
                setPrimaryImage(imgs[0]);
              }
              if (imgs.length > 1 && (!hoverImage || !imgs.includes(hoverImage))) {
                setHoverImage(imgs[1]);
              }
            }}
            primaryImage={primaryImage}
            onSetPrimary={(url) => setPrimaryImage(url)}
            hoverImage={hoverImage}
            onSetHover={(url) => setHoverImage(url)}
            maxImages={5}
          />
        </div>

        {/* Right Column: Pricing, Images, Inventory, Status (1 span) */}
        <div className="space-y-6">
          {/* Status & Publication Box */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-semibold text-white flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span>Visibility & Publication</span>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isActive ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"
                }`}
              />
            </h2>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div>
                <span className="text-xs font-semibold text-white block">
                  {isActive ? "Product is Live" : "Product is Hidden"}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {isActive ? "Visible in collections and search" : "Hidden from customers on storefront"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  isActive ? "bg-emerald-500" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Badges & Merchandising */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-medium text-zinc-400 block">Promotional Flags</span>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-zinc-800/50">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="rounded accent-[#FF6857]"
                  />
                  <span>Bestseller Badge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-zinc-800/50">
                  <input
                    type="checkbox"
                    checked={isNewRelease}
                    onChange={(e) => setIsNewRelease(e.target.checked)}
                    className="rounded accent-[#FF6857]"
                  />
                  <span>New Release Badge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-zinc-800/50">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded accent-[#FF6857]"
                  />
                  <span>Homepage Featured Highlight</span>
                </label>
              </div>
            </div>
          </div>

          {/* Pricing & Stock Box */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800/80 pb-3">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span>Pricing & Inventory</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Base Retail Price (৳ BDT)
                </label>
                <input
                  type="number"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white font-bold text-sm focus:outline-none focus:border-[#FF6857]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Compare-at Strike Price (৳ BDT)
                </label>
                <input
                  type="number"
                  value={compareAtPrice || ""}
                  onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Optional regular price"
                  className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Available Warehouse Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={inventory}
                  onChange={(e) => setInventory(Number(e.target.value))}
                  className={`w-full h-9 px-3 rounded-lg bg-zinc-950 border text-white font-mono focus:outline-none ${
                    Number(inventory) <= 0
                      ? "border-rose-500/80 focus:border-rose-500"
                      : "border-zinc-700 focus:border-[#FF6857]"
                  }`}
                />
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  {Number(inventory) <= 0 ? (
                    <span className="text-rose-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                      Marked as Out of Stock (Disabled on Storefront)
                    </span>
                  ) : Number(inventory) <= 10 ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      Low stock warning active
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      Normal available stock
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Store Category</label>
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
            </div>
          </div>

          {/* Media & Imagery Box */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800/80 pb-3">
              <Layers className="h-4 w-4 text-[#FF6857]" />
              <span>Product Imagery & Media</span>
            </h2>

            <ProductImageUpload
              label="Primary Cover Image"
              value={primaryImage}
              onChange={(url) => {
                setPrimaryImage(url);
                if (url && !galleryImages.includes(url)) {
                  setGalleryImages((prev) => [url, ...prev].slice(0, 5));
                }
              }}
            />

            <ProductImageUpload
              label="Hover / Angle Image"
              value={hoverImage}
              onChange={(url) => {
                setHoverImage(url);
                if (url && !galleryImages.includes(url)) {
                  setGalleryImages((prev) => [...prev, url].slice(0, 5));
                }
              }}
            />
          </div>

          {/* Danger Zone: Delete */}
          <div className="p-4 rounded-2xl border border-red-900/40 bg-red-950/10 space-y-2">
            <span className="text-xs font-semibold text-red-400 block">Danger Zone</span>
            <p className="text-[11px] text-zinc-400">
              Permanently purge this SKU and inventory record from the live production store.
            </p>
            <button
              type="button"
              onClick={handleDelete}
              className="mt-2 w-full py-2 px-3 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-medium border border-red-800/50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete This Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 flex items-center justify-between max-w-5xl mx-auto rounded-t-2xl shadow-2xl">
        <div className="text-xs text-zinc-400 hidden sm:block">
          Modifying: <span className="text-white font-semibold">{name}</span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Link
            href="/curecare-internal-8921/products"
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </Link>
          <Button
            onClick={() => handleSave()}
            isLoading={isSaving}
            className="gap-2 bg-[#FF6857] hover:bg-[#e05646] text-white shadow-lg shadow-[#FF6857]/20 text-xs px-6 py-2.5"
          >
            <Save className="h-4 w-4" />
            <span>Save All Details</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
