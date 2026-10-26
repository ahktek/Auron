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
  Layers,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";

interface ProductGallerySectionProps {
  images: string[];
  onChange: (images: string[]) => void;
  primaryImage: string;
  onSetPrimary: (url: string) => void;
  hoverImage?: string;
  onSetHover?: (url: string) => void;
  maxImages?: number;
}

export const ProductGallerySection: React.FC<ProductGallerySectionProps> = ({
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selected index when images length changes
  useEffect(() => {
    if (images.length === 0) {
      setSelectedIndex(0);
    } else if (selectedIndex >= images.length) {
      setSelectedIndex(images.length - 1);
    }
  }, [images.length, selectedIndex]);

  // Keyboard navigation for zoom lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomOpen) return;
      if (e.key === "Escape") setIsZoomOpen(false);
      if (e.key === "ArrowLeft") handlePrevZoom();
      if (e.key === "ArrowRight") handleNextZoom();
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
      setUploadError(`Maximum gallery limit of ${maxImages} images reached.`);
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
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#FF6857]" />
            <span>Product Media Gallery (Full Storefront Showcase)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage high-resolution multi-angle photos for this product. The gallery supports up to 5 images displayed across the storefront PDP.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              images.length >= maxImages
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                : "bg-zinc-800 text-zinc-300 border border-zinc-700"
            }`}
          >
            {images.length} / {maxImages} Photos
          </span>
        </div>
      </div>

      {/* Main 2-Column Showcase: Large Hero Canvas (Left/Top) & 5-Slot Card Grid */}
      <div className="space-y-4">
        {/* Large Featured Canvas */}
        {activeImage ? (
          <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-700/80 shadow-2xl flex items-center justify-center group">
            {/* Main High-Res Image Display */}
            <img
              src={activeImage}
              alt={`Gallery image ${selectedIndex + 1}`}
              className="w-full h-full object-contain p-4 cursor-zoom-in transition-transform duration-300 group-hover:scale-102"
              onClick={() => setIsZoomOpen(true)}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://placehold.co/600x400/18181b/71717a?text=Image+Load+Error";
              }}
            />

            {/* Badges on Hero View */}
            <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
              {isCurrentPrimary && (
                <span className="bg-[#FF6857] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-white" />
                  <span>Primary Storefront Cover</span>
                </span>
              )}
              {isCurrentHover && (
                <span className="bg-zinc-800/95 text-zinc-200 text-xs font-medium px-2.5 py-1 rounded-lg shadow border border-zinc-700">
                  Hover Angle Image
                </span>
              )}
              <span className="bg-black/70 backdrop-blur-xs text-zinc-300 text-xs font-mono px-2.5 py-1 rounded-lg">
                Slot #{selectedIndex + 1} of {images.length}
              </span>
            </div>

            {/* Quick Action Buttons on Top Right */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-colors cursor-pointer border border-zinc-700 shadow-md"
                title="Open Fullscreen Lightbox Inspection"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleRemoveImage(selectedIndex)}
                className="p-2 rounded-xl bg-red-950/80 hover:bg-red-800 text-red-200 backdrop-blur-xs transition-colors cursor-pointer border border-red-800/60 shadow-md"
                title="Remove this image from gallery"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Bottom Controls Bar on Hero View */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-10">
              <div className="text-xs text-zinc-400 font-mono truncate max-w-sm">
                {activeImage.split("/").pop()}
              </div>

              <div className="flex items-center gap-2">
                {!isCurrentPrimary && (
                  <button
                    type="button"
                    onClick={() => onSetPrimary(activeImage)}
                    className="px-3 py-1.5 rounded-lg bg-[#FF6857] hover:bg-[#e05646] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Star className="h-3.5 w-3.5 fill-white" />
                    <span>Make Primary Cover</span>
                  </button>
                )}

                {onSetHover && !isCurrentHover && !isCurrentPrimary && (
                  <button
                    type="button"
                    onClick={() => onSetHover(activeImage)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors cursor-pointer border border-zinc-700"
                  >
                    Make Hover Angle
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-64 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 bg-zinc-950/40 flex flex-col items-center justify-center gap-2.5 cursor-pointer text-zinc-400 hover:text-zinc-200 transition-all p-8 text-center"
          >
            <Upload className="h-10 w-10 text-[#FF6857]" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">No images in product gallery</p>
              <p className="text-xs text-zinc-500">
                Upload up to 5 high-resolution photos below to build your storefront gallery.
              </p>
            </div>
          </div>
        )}

        {/* 5 Distinct Large Slots Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-300">
              Gallery Slots (Click slot to inspect or change)
            </span>
            <span className="text-[11px] text-zinc-500">
              Slot #1: Cover · Slot #2: Hover Angle · Slots #3-5: Additional Angles
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Array.from({ length: maxImages }).map((_, slotIndex) => {
              const imgUrl = images[slotIndex];
              const isSelected = slotIndex === selectedIndex;
              const isPrimary = imgUrl && imgUrl === primaryImage;
              const isHover = imgUrl && hoverImage && imgUrl === hoverImage && !isPrimary;

              const slotRole =
                slotIndex === 0
                  ? "Primary Cover"
                  : slotIndex === 1
                  ? "Hover Angle"
                  : `Angle #${slotIndex + 1}`;

              if (imgUrl) {
                return (
                  <div
                    key={`slot-card-${slotIndex}`}
                    onClick={() => setSelectedIndex(slotIndex)}
                    className={`group relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-950 border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#FF6857] ring-2 ring-[#FF6857]/40 shadow-xl scale-102"
                        : "border-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Slot ${slotIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Slot Label Badge */}
                    <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-1">
                      {isPrimary ? (
                        <span className="bg-[#FF6857] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 fill-white" />
                          <span>Cover</span>
                        </span>
                      ) : isHover ? (
                        <span className="bg-zinc-800/90 text-zinc-200 text-[9px] font-medium px-1.5 py-0.5 rounded shadow">
                          Hover
                        </span>
                      ) : (
                        <span className="bg-black/60 text-zinc-300 text-[9px] font-mono px-1.5 py-0.5 rounded">
                          #{slotIndex + 1}
                        </span>
                      )}
                    </div>

                    {/* Quick Delete Icon on Hover */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(slotIndex);
                      }}
                      className="absolute top-1.5 right-1.5 z-20 p-1 rounded-md bg-red-950/80 hover:bg-red-800 text-red-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>

                    <div className="absolute bottom-1 left-1 right-1 px-1 py-0.5 bg-black/70 rounded text-[9px] text-zinc-300 truncate text-center">
                      {slotRole}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={`empty-slot-${slotIndex}`}
                  onClick={() => {
                    if (canAddMore) {
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`aspect-square w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all ${
                    canAddMore
                      ? "border-zinc-800 hover:border-zinc-600 bg-zinc-950/40 hover:bg-zinc-900/60 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                      : "border-zinc-900 bg-zinc-950/20 text-zinc-700 cursor-not-allowed"
                  }`}
                  title={canAddMore ? `Add photo for ${slotRole}` : "Gallery full"}
                >
                  <Plus className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400" />
                  <span className="text-[11px] font-medium text-zinc-400">Add Slot #{slotIndex + 1}</span>
                  <span className="text-[9px] text-zinc-600">{slotRole}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upload Zone & Direct Link Adder Banner */}
      {canAddMore ? (
        <div className="space-y-3 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">
              Upload New Images ({remainingSlots} slot{remainingSlots > 1 ? "s" : ""} remaining)
            </span>

            <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setMode("upload")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  mode === "upload" ? "bg-[#FF6857] text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                File Upload
              </button>
              <button
                type="button"
                onClick={() => setMode("url")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  mode === "url" ? "bg-[#FF6857] text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Direct Image URL
              </button>
            </div>
          </div>

          {mode === "upload" ? (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
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
                <div className="py-2 flex items-center justify-center gap-2 text-zinc-200">
                  <Loader2 className="h-5 w-5 animate-spin text-[#FF6857]" />
                  <span className="text-xs font-medium">Uploading high-resolution product photos...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 text-zinc-400">
                  <Upload className="h-6 w-6 text-[#FF6857]" />
                  <p className="text-xs font-semibold text-zinc-200">
                    Click to browse files or drag and drop images here
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Supports high-resolution PNG, JPG, WebP, AVIF up to 10MB per photo
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleAddUrl} className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste direct product image URL (https://...)"
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6857]"
                />
              </div>
              <button
                type="submit"
                disabled={!urlInput.trim() || isUploading}
                className="px-5 h-10 rounded-xl bg-[#FF6857] hover:bg-[#e05646] disabled:opacity-50 text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>Add to Gallery</span>
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-zinc-400">
          <span className="text-xs flex items-center gap-2 text-emerald-400 font-semibold">
            <Check className="h-4 w-4" />
            <span>Maximum 5-image storefront gallery limit reached.</span>
          </span>
          <span className="text-xs text-zinc-500">
            Remove any slot above to replace or upload a new photo.
          </span>
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-400 font-medium bg-red-950/30 p-2.5 rounded-xl border border-red-900/50">
          {uploadError}
        </p>
      )}

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {isZoomOpen && activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[92vh] w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between text-white border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">High-Resolution Photo Preview</span>
                <span className="text-xs text-zinc-400 font-mono">
                  ({selectedIndex + 1} of {images.length})
                </span>
                {isCurrentPrimary && (
                  <span className="bg-[#FF6857] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    ⭐ Primary Cover
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

            {/* Modal Image */}
            <div className="relative w-full max-h-[78vh] flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 p-2">
              <img
                src={activeImage}
                alt="Product High-Res View"
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevZoom}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/80 hover:bg-black text-white border border-zinc-700 transition-colors cursor-pointer"
                    title="Previous (Left Arrow)"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextZoom}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/80 hover:bg-black text-white border border-zinc-700 transition-colors cursor-pointer"
                    title="Next (Right Arrow)"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            <div className="text-xs text-zinc-400 font-mono">
              {activeImage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
