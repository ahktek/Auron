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
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Scissors,
  Sparkles,
} from "lucide-react";
import { ImageCropperModal, CropResult } from "./ImageCropperModal";

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

  // Cropper Modal State
  const [cropperState, setCropperState] = useState<{
    isOpen: boolean;
    source: string | File | null;
    targetIndex?: number;
    originalFile?: File;
  }>({
    isOpen: false,
    source: null,
  });

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
  const activeImage = images[selectedIndex] || images[0] || "";

  const uploadFileToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/curecare-internal-8921/media/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.success || !data.url) {
      throw new Error(data.error || "Failed to upload file to server");
    }
    return data.url;
  };

  // Triggered when file(s) are selected from file picker or dropped
  const handleFileSelection = (files: FileList | File[]) => {
    setUploadError("");
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (!canAddMore) {
      setUploadError(`Maximum gallery limit of ${maxImages} images reached.`);
      return;
    }

    const firstFile = fileArray[0];

    // Open cropper immediately for seamless cropping
    setCropperState({
      isOpen: true,
      source: firstFile,
      originalFile: firstFile,
      targetIndex: undefined,
    });
  };

  // Called when user clicks "Crop & Save" in the cropper modal
  const handleCropComplete = async (result: CropResult) => {
    setIsUploading(true);
    setUploadError("");

    try {
      const uploadedUrl = await uploadFileToServer(result.file);

      if (cropperState.targetIndex !== undefined) {
        // Replacing / updating an existing slot
        const updated = [...images];
        const oldUrl = updated[cropperState.targetIndex];
        updated[cropperState.targetIndex] = uploadedUrl;
        onChange(updated);

        // If replaced image was primary or hover, sync them
        if (primaryImage === oldUrl) onSetPrimary(uploadedUrl);
        if (hoverImage === oldUrl && onSetHover) onSetHover(uploadedUrl);
      } else {
        // Adding a new image into the gallery
        const updated = [...images, uploadedUrl].slice(0, maxImages);
        onChange(updated);
        setSelectedIndex(updated.length - 1);

        if (!primaryImage && updated.length > 0) {
          onSetPrimary(updated[0]);
        }
      }
    } catch (err: any) {
      console.error("Crop upload error:", err);
      setUploadError(err.message || "Failed to upload cropped image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Called when user skips cropping and chooses "Use Uncropped Original"
  const handleSkipCrop = async () => {
    if (!cropperState.originalFile) return;
    setIsUploading(true);
    setUploadError("");

    try {
      const uploadedUrl = await uploadFileToServer(cropperState.originalFile);

      if (cropperState.targetIndex !== undefined) {
        const updated = [...images];
        const oldUrl = updated[cropperState.targetIndex];
        updated[cropperState.targetIndex] = uploadedUrl;
        onChange(updated);

        if (primaryImage === oldUrl) onSetPrimary(uploadedUrl);
        if (hoverImage === oldUrl && onSetHover) onSetHover(uploadedUrl);
      } else {
        const updated = [...images, uploadedUrl].slice(0, maxImages);
        onChange(updated);
        setSelectedIndex(updated.length - 1);

        if (!primaryImage && updated.length > 0) {
          onSetPrimary(updated[0]);
        }
      }
    } catch (err: any) {
      console.error("Direct upload error:", err);
      setUploadError(err.message || "Failed to upload original image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Open cropper for an existing image slot
  const handleOpenCropForSlot = (url: string, index: number) => {
    setCropperState({
      isOpen: true,
      source: url,
      targetIndex: index,
    });
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

    const newImages = [...images, trimmed].slice(0, maxImages);
    onChange(newImages);
    setSelectedIndex(newImages.length - 1);
    setUrlInput("");

    if (!primaryImage && newImages.length > 0) {
      onSetPrimary(newImages[0]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const removedUrl = images[indexToRemove];
    const newImages = images.filter((_, idx) => idx !== indexToRemove);
    onChange(newImages);

    if (removedUrl === primaryImage) {
      onSetPrimary(newImages[0] || "");
    }
    if (removedUrl === hoverImage && onSetHover) {
      onSetHover(newImages[1] || "");
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
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files);
    }
  };

  const isCurrentPrimary = activeImage && activeImage === primaryImage;
  const isCurrentHover = activeImage && hoverImage && activeImage === hoverImage && !isCurrentPrimary;

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) {
            handleFileSelection(e.target.files);
          }
        }}
        className="hidden"
      />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">
              Product Media Gallery
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FF6857]/20 text-[#FF6857] border border-[#FF6857]/30">
              {images.length} / {maxImages} Photos
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Seamless upload with integrated interactive cropping so images never randomly cut off on storefront cards.
          </p>
        </div>

        {/* Upload Mode Pill Switcher */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              mode === "upload"
                ? "bg-[#FF6857] text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload & Crop</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              mode === "url"
                ? "bg-[#FF6857] text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            <span>Image Link</span>
          </button>
        </div>
      </div>

      {/* Main Inspection Canvas & Slots */}
      <div className="space-y-4">
        {/* Large Hero Inspection Canvas (280px tall) */}
        {activeImage ? (
          <div className="relative w-full h-72 sm:h-80 rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center p-3 group">
            {/* Background subtle checkerboard for transparency */}
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              }}
            />

            {/* Main High-Resolution Image Preview */}
            <img
              src={activeImage}
              alt="Active Product Preview"
              className="h-full w-auto max-w-full object-contain rounded-xl select-none transition-transform duration-200"
            />

            {/* Badges on Top Left */}
            <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
              {isCurrentPrimary && (
                <span className="bg-[#FF6857] text-white text-xs font-bold px-3 py-1 rounded-lg shadow-lg flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-white" />
                  Primary Cover Photo
                </span>
              )}
              {isCurrentHover && (
                <span className="bg-zinc-800 text-zinc-200 text-xs font-medium px-3 py-1 rounded-lg shadow-lg border border-zinc-700">
                  Hover Angle Image
                </span>
              )}
              <span className="bg-black/70 backdrop-blur-xs text-zinc-300 text-xs font-mono px-2.5 py-1 rounded-lg">
                Slot #{selectedIndex + 1} of {images.length}
              </span>
            </div>

            {/* Quick Action Buttons on Top Right */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              {/* Crop Button for Active Image */}
              <button
                type="button"
                onClick={() => handleOpenCropForSlot(activeImage, selectedIndex)}
                className="px-2.5 py-1.5 rounded-xl bg-black/70 hover:bg-[#FF6857] text-white backdrop-blur-xs transition-all cursor-pointer border border-zinc-700 shadow-md flex items-center gap-1.5 text-xs font-medium"
                title="Crop & Re-frame image to eliminate random cropping"
              >
                <Scissors className="h-3.5 w-3.5" />
                <span>Crop Framing</span>
              </button>

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
                Upload up to 5 photos below. Each photo can be cropped to 1:1 Square or custom ratios.
              </p>
            </div>
          </div>
        )}

        {/* 5 Distinct Large Slots Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-300">
              Gallery Slots (Click slot to view • Hover to crop or remove)
            </span>
            <span className="text-[11px] text-zinc-500">
              Slot #1: Cover · Slot #2: Hover · Slots #3-5: Additional Angles
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

                    {/* Hover Actions: Crop & Delete */}
                    <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCropForSlot(imgUrl, slotIndex);
                        }}
                        className="p-1 rounded-md bg-zinc-900/90 hover:bg-[#FF6857] text-white transition-colors cursor-pointer shadow"
                        title="Crop / Re-frame this slot"
                      >
                        <Scissors className="h-3 w-3" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(slotIndex);
                        }}
                        className="p-1 rounded-md bg-red-950/90 hover:bg-red-800 text-red-200 transition-colors cursor-pointer shadow"
                        title="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>

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
          {mode === "upload" ? (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[#FF6857] bg-[#FF6857]/10"
                  : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-600 hover:bg-zinc-900/60"
              }`}
            >
              {isUploading ? (
                <div className="py-2 flex flex-col items-center justify-center gap-2 text-zinc-400">
                  <Loader2 className="h-6 w-6 animate-spin text-[#FF6857]" />
                  <span className="text-xs font-medium">Processing & uploading cropped image...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="flex items-center gap-2">
                    <Upload className="h-6 w-6 text-[#FF6857]" />
                    <Scissors className="h-4 w-4 text-[#FF6857]" />
                  </div>
                  <p className="text-xs font-semibold text-zinc-200">
                    Click to browse files or drag & drop images here (Crop modal opens automatically)
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
            Hover over any slot above to crop or remove.
          </span>
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-400 font-medium bg-red-950/30 p-2.5 rounded-xl border border-red-900/50">
          {uploadError}
        </p>
      )}

      {/* Interactive Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperState.isOpen}
        imageSource={cropperState.source}
        onClose={() => setCropperState({ isOpen: false, source: null })}
        onCropComplete={handleCropComplete}
        onSkipCrop={cropperState.originalFile ? handleSkipCrop : undefined}
        title={
          cropperState.targetIndex !== undefined
            ? `Crop & Re-frame Slot #${cropperState.targetIndex + 1}`
            : "Crop & Frame Product Image"
        }
      />

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
                <button
                  type="button"
                  onClick={() => {
                    setIsZoomOpen(false);
                    handleOpenCropForSlot(activeImage, selectedIndex);
                  }}
                  className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-[#FF6857] text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Scissors className="h-3.5 w-3.5" />
                  <span>Crop This</span>
                </button>

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
