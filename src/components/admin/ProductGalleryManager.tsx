/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Link2,
  X,
  Check,
  Loader2,
  Star,
  Plus,
  Image as ImageIcon,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Eye,
} from "lucide-react";

interface ProductGalleryManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  primaryImage: string;
  onSetPrimary: (url: string) => void;
  hoverImage?: string;
  onSetHover?: (url: string) => void;
  maxImages?: number;
}

export const ProductGalleryManager: React.FC<ProductGalleryManagerProps> = ({
  images,
  onChange,
  primaryImage,
  onSetPrimary,
  hoverImage,
  onSetHover,
  maxImages = 5,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [viewMode, setViewMode] = useState<"featured" | "grid">("featured");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep selectedIndex valid when images length changes
  useEffect(() => {
    if (images.length === 0) {
      setSelectedIndex(0);
    } else if (selectedIndex >= images.length) {
      setSelectedIndex(images.length - 1);
    }
  }, [images.length, selectedIndex]);

  // Handle ESC key to close zoom modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomOpen) {
        setIsZoomOpen(false);
      } else if (e.key === "ArrowLeft" && isZoomOpen) {
        handlePrevZoom();
      } else if (e.key === "ArrowRight" && isZoomOpen) {
        handleNextZoom();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen, selectedIndex, images.length]);

  const canAddMore = images.length < maxImages;
  const remainingSlots = Math.max(0, maxImages - images.length);
  const activeImage = images[selectedIndex] || images[0] || "";

  const handleFileUpload = async (files: FileList | File[]) => {
    setUploadError("");
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (!canAddMore) {
      setUploadError(`Gallery limit of ${maxImages} images already reached.`);
      return;
    }

    const filesToUpload = fileArray.slice(0, remainingSlots);
    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/curecare-internal-8921/media/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        } else {
          setUploadError(data.error || `Failed to upload ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        const newImages = [...images, ...uploadedUrls].slice(0, maxImages);
        onChange(newImages);

        // Focus newly uploaded image in the big viewer
        setSelectedIndex(images.length);

        if (!primaryImage && newImages.length > 0) {
          onSetPrimary(newImages[0]);
        }
      }
    } catch (err) {
      console.error("Gallery upload error:", err);
      setUploadError("Network connection error during file upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setUploadError("");
    const trimmed = urlInput.trim();

    if (!trimmed) {
      setUploadError("Please enter a valid image URL.");
      return;
    }

    if (!canAddMore) {
      setUploadError(`Maximum gallery limit of ${maxImages} images reached.`);
      return;
    }

    if (images.includes(trimmed)) {
      setUploadError("This image is already in the gallery.");
      return;
    }

    const newImages = [...images, trimmed].slice(0, maxImages);
    onChange(newImages);
    setSelectedIndex(images.length);
    setUrlInput("");

    if (!primaryImage) {
      onSetPrimary(trimmed);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const removedUrl = images[indexToRemove];
    const newImages = images.filter((_, i) => i !== indexToRemove);
    onChange(newImages);

    if (removedUrl === primaryImage) {
      onSetPrimary(newImages[0] || "");
    }

    if (onSetHover && removedUrl === hoverImage) {
      onSetHover(newImages[1] || newImages[0] || "");
    }

    if (selectedIndex >= newImages.length) {
      setSelectedIndex(Math.max(0, newImages.length - 1));
    }
  };

  const handlePrevZoom = () => {
    if (images.length <= 1) return;
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextZoom = () => {
    if (images.length <= 1) return;
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (canAddMore) setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (canAddMore && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const isCurrentPrimary = activeImage && activeImage === primaryImage;
  const isCurrentHover = activeImage && hoverImage && activeImage === hoverImage && !isCurrentPrimary;

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-800 text-xs">
      {/* Header & Controls Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-[#FF6857]" />
          <span className="font-semibold text-zinc-100 text-sm">
            Product Gallery
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              images.length >= maxImages
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                : "bg-zinc-800 text-zinc-300"
            }`}
          >
            {images.length} / {maxImages} Images
          </span>
        </div>

        {/* View Layout Switcher */}
        <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
          <button
            type="button"
            onClick={() => setViewMode("featured")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === "featured"
                ? "bg-zinc-800 text-white shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
            title="Featured Big Inspector View"
          >
            <Eye className="h-3 w-3" />
            <span className="hidden sm:inline">Big Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === "grid"
                ? "bg-zinc-800 text-white shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
            title="2-Column Grid View"
          >
            <LayoutGrid className="h-3 w-3" />
            <span className="hidden sm:inline">Grid</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW MODE 1: FEATURED BIG INSPECTOR (Default & Recommended)    */}
      {/* ============================================================== */}
      {viewMode === "featured" && (
        <div className="space-y-3">
          {activeImage ? (
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-700/80 shadow-2xl flex items-center justify-center group">
              {/* Main Crisp Large Image */}
              <img
                src={activeImage}
                alt={`Product image ${selectedIndex + 1}`}
                className="w-full h-full object-contain p-2 transition-transform duration-300 cursor-zoom-in"
                onClick={() => setIsZoomOpen(true)}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://placehold.co/400x400/18181b/71717a?text=Error+Loading";
                }}
              />

              {/* Status Badges on Big Preview */}
              <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5">
                {isCurrentPrimary && (
                  <span className="bg-[#FF6857] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white" />
                    <span>Primary Cover</span>
                  </span>
                )}
                {isCurrentHover && (
                  <span className="bg-zinc-800/95 text-zinc-200 text-[10px] font-medium px-2 py-0.5 rounded-md shadow border border-zinc-700">
                    Hover Angle
                  </span>
                )}
                <span className="bg-black/60 backdrop-blur-xs text-zinc-300 text-[10px] font-mono px-2 py-0.5 rounded-md">
                  Slot #{selectedIndex + 1}
                </span>
              </div>

              {/* Top-Right Quick Actions */}
              <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-colors cursor-pointer border border-zinc-700/60"
                  title="Expand to Fullscreen Lightbox"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(selectedIndex)}
                  className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-800 text-red-200 backdrop-blur-xs transition-colors cursor-pointer border border-red-800/60"
                  title="Delete this image from gallery"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Bottom Quick-Action Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex items-center justify-between gap-2 z-10">
                <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[120px] sm:max-w-[150px]">
                  {activeImage.split("/").pop()}
                </span>

                <div className="flex items-center gap-1.5">
                  {!isCurrentPrimary && (
                    <button
                      type="button"
                      onClick={() => onSetPrimary(activeImage)}
                      className="px-2.5 py-1 rounded-md bg-[#FF6857] hover:bg-[#e05646] text-white text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                      title="Set as Primary Cover Image for store"
                    >
                      <Star className="h-3 w-3" />
                      <span>Set Cover</span>
                    </button>
                  )}

                  {onSetHover && !isCurrentHover && !isCurrentPrimary && (
                    <button
                      type="button"
                      onClick={() => onSetHover(activeImage)}
                      className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium transition-colors cursor-pointer"
                      title="Set as Secondary Hover Image"
                    >
                      Set Hover
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-52 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 bg-zinc-950/50 flex flex-col items-center justify-center gap-2 cursor-pointer text-zinc-500 hover:text-zinc-300 transition-all p-6 text-center"
            >
              <Upload className="h-8 w-8 text-zinc-600" />
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-zinc-200">No gallery images uploaded yet</p>
                <p className="text-xs text-zinc-500">Click or drop image files here to start (up to 5 photos)</p>
              </div>
            </div>
          )}

          {/* 5-Slot Thumbnail Selector Bar */}
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: maxImages }).map((_, slotIndex) => {
              const imgUrl = images[slotIndex];
              const isSelected = slotIndex === selectedIndex;
              const isPrimary = imgUrl && imgUrl === primaryImage;

              if (imgUrl) {
                return (
                  <button
                    key={`thumb-slot-${slotIndex}`}
                    type="button"
                    onClick={() => setSelectedIndex(slotIndex)}
                    className={`relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-950 border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#FF6857] ring-2 ring-[#FF6857]/40 shadow-md scale-102"
                        : "border-zinc-800 hover:border-zinc-600 opacity-80 hover:opacity-100"
                    }`}
                    title={`View Slot #${slotIndex + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumb ${slotIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isPrimary && (
                      <div className="absolute top-0.5 left-0.5 bg-[#FF6857] p-0.5 rounded-sm shadow">
                        <Star className="h-2 w-2 fill-white text-white" />
                      </div>
                    )}
                    <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-[9px] font-mono text-zinc-300 px-1 rounded">
                      #{slotIndex + 1}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={`empty-thumb-${slotIndex}`}
                  type="button"
                  onClick={() => {
                    if (canAddMore) {
                      if (mode === "upload") {
                        fileInputRef.current?.click();
                      } else {
                        document.getElementById("galleryUrlInput")?.focus();
                      }
                    }
                  }}
                  disabled={!canAddMore}
                  className={`relative aspect-square w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-0.5 transition-all ${
                    canAddMore
                      ? "border-zinc-800 hover:border-zinc-600 bg-zinc-950/40 hover:bg-zinc-900/60 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                      : "border-zinc-900 bg-zinc-950/20 text-zinc-700 cursor-not-allowed"
                  }`}
                  title={canAddMore ? `Add to slot ${slotIndex + 1}` : "Gallery full"}
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-[9px] font-medium font-mono">#{slotIndex + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW MODE 2: 2-COLUMN LARGE CARDS GRID                         */}
      {/* ============================================================== */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: maxImages }).map((_, slotIndex) => {
            const imgUrl = images[slotIndex];
            const isPrimary = imgUrl && imgUrl === primaryImage;
            const isHover = imgUrl && hoverImage && imgUrl === hoverImage && !isPrimary;

            if (imgUrl) {
              return (
                <div
                  key={`grid-card-${slotIndex}`}
                  className={`group relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-950 border transition-all ${
                    isPrimary
                      ? "border-[#FF6857] ring-2 ring-[#FF6857]/40 shadow-lg"
                      : "border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Product slot ${slotIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-1">
                    {isPrimary && (
                      <span className="bg-[#FF6857] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5 fill-white" />
                        <span>Cover</span>
                      </span>
                    )}
                    {isHover && (
                      <span className="bg-zinc-800/90 text-zinc-300 text-[9px] font-medium px-1.5 py-0.5 rounded shadow">
                        Hover
                      </span>
                    )}
                  </div>

                  {/* Slot Number */}
                  <span className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-zinc-300 text-[10px] font-mono px-1.5 py-0.5 rounded">
                    #{slotIndex + 1}
                  </span>

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-black/65 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIndex(slotIndex);
                          setIsZoomOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
                        title="Zoom full image"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(slotIndex)}
                        className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-800 text-red-200 transition-colors cursor-pointer"
                        title="Remove from gallery"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => onSetPrimary(imgUrl)}
                          className="w-full py-1 px-2 rounded-lg bg-[#FF6857] hover:bg-[#e05646] text-white text-[10px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Star className="h-3 w-3" />
                          <span>Set Cover</span>
                        </button>
                      )}

                      {onSetHover && !isHover && !isPrimary && (
                        <button
                          type="button"
                          onClick={() => onSetHover(imgUrl)}
                          className="w-full py-1 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium transition-colors cursor-pointer"
                        >
                          Set Hover
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={`grid-empty-${slotIndex}`}
                onClick={() => {
                  if (canAddMore) {
                    if (mode === "upload") {
                      fileInputRef.current?.click();
                    } else {
                      document.getElementById("galleryUrlInput")?.focus();
                    }
                  }
                }}
                className={`aspect-square w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all ${
                  canAddMore
                    ? "border-zinc-800 hover:border-zinc-600 bg-zinc-950/40 hover:bg-zinc-900/60 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    : "border-zinc-900 bg-zinc-950/20 text-zinc-700 cursor-not-allowed"
                }`}
                title={canAddMore ? `Add to slot ${slotIndex + 1}` : "Gallery full"}
              >
                <Plus className="h-6 w-6" />
                <span className="text-xs font-medium">Add Photo #{slotIndex + 1}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* MULTI-IMAGE UPLOAD / LINK ADDER SECTION                        */}
      {/* ============================================================== */}
      {canAddMore ? (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-zinc-400">
              Add new image ({remainingSlots} slot{remainingSlots > 1 ? "s" : ""} open)
            </span>
            <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setMode("upload")}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  mode === "upload" ? "bg-[#FF6857] text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                File Upload
              </button>
              <button
                type="button"
                onClick={() => setMode("url")}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  mode === "url" ? "bg-[#FF6857] text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Image URL
              </button>
            </div>
          </div>

          {mode === "upload" ? (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[#FF6857] bg-[#FF6857]/10"
                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files);
                  }
                }}
              />

              {isUploading ? (
                <div className="py-2 flex items-center justify-center gap-2 text-zinc-300">
                  <Loader2 className="h-4 w-4 animate-spin text-[#FF6857]" />
                  <span className="text-xs font-medium">Uploading high-res product asset...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-zinc-400 py-1">
                  <Upload className="h-4 w-4 text-[#FF6857]" />
                  <span className="text-xs text-zinc-200 font-medium">
                    Click or drag photos to add
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    (PNG, JPG, WebP)
                  </span>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleAddUrl} className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <input
                  id="galleryUrlInput"
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste direct image link (https://...)"
                  className="w-full h-8.5 pl-8 pr-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6857]"
                />
              </div>
              <button
                type="submit"
                disabled={!urlInput.trim() || isUploading}
                className="px-3 h-8.5 rounded-lg bg-[#FF6857] hover:bg-[#e05646] disabled:opacity-50 text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-zinc-400">
          <span className="text-[11px] flex items-center gap-1.5 text-emerald-400 font-medium">
            <Check className="h-3.5 w-3.5" />
            <span>Full 5-image gallery limit reached.</span>
          </span>
          <span className="text-[10px] text-zinc-500">Remove any image to add another.</span>
        </div>
      )}

      {uploadError && (
        <p className="text-[11px] text-red-400 font-medium bg-red-950/20 p-2 rounded-lg border border-red-900/40">
          {uploadError}
        </p>
      )}

      {/* ============================================================== */}
      {/* HIGH-RES LIGHTBOX MODAL (Crystal Clear Inspection)             */}
      {/* ============================================================== */}
      {isZoomOpen && activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar inside Modal */}
            <div className="w-full flex items-center justify-between text-white border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  Product Image Preview
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  ({selectedIndex + 1} of {images.length})
                </span>
                {isCurrentPrimary && (
                  <span className="bg-[#FF6857] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    ⭐ Cover
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!isCurrentPrimary && (
                  <button
                    type="button"
                    onClick={() => onSetPrimary(activeImage)}
                    className="px-3 py-1 rounded-lg bg-[#FF6857] hover:bg-[#e05646] text-white text-xs font-semibold cursor-pointer"
                  >
                    Set as Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Big Zoomed Image */}
            <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 p-2">
              <img
                src={activeImage}
                alt="Zoomed Product View"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
              />

              {/* Prev / Next Controls */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevZoom}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/75 hover:bg-black text-white border border-zinc-700 transition-colors cursor-pointer"
                    title="Previous Image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextZoom}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/75 hover:bg-black text-white border border-zinc-700 transition-colors cursor-pointer"
                    title="Next Image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Filename */}
            <div className="text-xs text-zinc-400 font-mono">
              {activeImage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
