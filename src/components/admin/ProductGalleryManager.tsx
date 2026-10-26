/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef } from "react";
import { Upload, Link2, X, Check, Loader2, Star, Plus, Image as ImageIcon, Trash2 } from "lucide-react";

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
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAddMore = images.length < maxImages;
  const remainingSlots = Math.max(0, maxImages - images.length);

  const handleFileUpload = async (files: FileList | File[]) => {
    setUploadError("");
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (!canAddMore) {
      setUploadError(`Gallery limit of ${maxImages} images already reached.`);
      return;
    }

    // Limit to remaining available slots
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

        // If no primary image yet, set first one as primary
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
    setUrlInput("");

    if (!primaryImage) {
      onSetPrimary(trimmed);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const removedUrl = images[indexToRemove];
    const newImages = images.filter((_, i) => i !== indexToRemove);
    onChange(newImages);

    // If removed image was primary cover, switch primary to first remaining
    if (removedUrl === primaryImage) {
      onSetPrimary(newImages[0] || "");
    }

    // If removed image was hover image, switch or clear
    if (onSetHover && removedUrl === hoverImage) {
      onSetHover(newImages[1] || newImages[0] || "");
    }
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

  return (
    <div className="space-y-3 pt-3 border-t border-zinc-800/80 text-xs">
      {/* Header & Mode Switch */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-[#FF6857]" />
          <span className="font-semibold text-zinc-200">
            Product Gallery
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              images.length >= maxImages
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {images.length} / {maxImages} Images
          </span>
        </div>

        {canAddMore && (
          <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                mode === "upload"
                  ? "bg-[#FF6857] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                mode === "url"
                  ? "bg-[#FF6857] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Link
            </button>
          </div>
        )}
      </div>

      {/* 5-Slot Interactive Gallery Grid */}
      <div className="grid grid-cols-5 gap-2.5">
        {Array.from({ length: maxImages }).map((_, slotIndex) => {
          const imgUrl = images[slotIndex];
          const isPrimary = imgUrl && imgUrl === primaryImage;
          const isHover = imgUrl && hoverImage && imgUrl === hoverImage && !isPrimary;

          if (imgUrl) {
            return (
              <div
                key={`gallery-${slotIndex}`}
                className={`group relative aspect-square rounded-xl overflow-hidden bg-zinc-950 border transition-all ${
                  isPrimary
                    ? "border-[#FF6857] ring-1 ring-[#FF6857]/50 shadow-md shadow-[#FF6857]/10"
                    : "border-zinc-800 hover:border-zinc-600"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Gallery slot ${slotIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://placehold.co/100x100/18181b/71717a?text=Error";
                  }}
                />

                {/* Primary Cover Badge */}
                {isPrimary && (
                  <div className="absolute top-1 left-1 z-10 bg-[#FF6857] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5 fill-white" />
                    <span>Cover</span>
                  </div>
                )}

                {/* Hover Badge */}
                {isHover && (
                  <div className="absolute top-1 left-1 z-10 bg-zinc-800/90 text-zinc-300 text-[9px] font-medium px-1.5 py-0.5 rounded shadow">
                    Hover
                  </div>
                )}

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 z-20">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-300 font-semibold px-1 rounded bg-black/50">
                      #{slotIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(slotIndex);
                      }}
                      className="p-1 rounded-md bg-red-950/80 hover:bg-red-800 text-red-300 transition-colors cursor-pointer"
                      title="Remove image from gallery"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetPrimary(imgUrl);
                        }}
                        className="w-full py-0.5 px-1 rounded bg-zinc-800/90 hover:bg-[#FF6857] text-white text-[9px] font-medium transition-colors text-center cursor-pointer flex items-center justify-center gap-0.5"
                        title="Set as Primary Cover Image"
                      >
                        <Star className="h-2.5 w-2.5" />
                        <span>Set Cover</span>
                      </button>
                    )}

                    {onSetHover && !isHover && !isPrimary && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetHover(imgUrl);
                        }}
                        className="w-full py-0.5 px-1 rounded bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 text-[9px] font-medium transition-colors text-center cursor-pointer"
                        title="Set as Hover / Secondary Angle Image"
                      >
                        Set Hover
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Empty Slot
          return (
            <div
              key={`empty-slot-${slotIndex}`}
              onClick={() => {
                if (canAddMore) {
                  if (mode === "upload") {
                    fileInputRef.current?.click();
                  } else {
                    document.getElementById("galleryUrlInput")?.focus();
                  }
                }
              }}
              className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all ${
                canAddMore
                  ? "border-zinc-800 hover:border-zinc-600 bg-zinc-950/50 hover:bg-zinc-900/60 cursor-pointer text-zinc-500 hover:text-zinc-300"
                  : "border-zinc-900 bg-zinc-950/20 text-zinc-700 cursor-not-allowed"
              }`}
              title={canAddMore ? `Add image to slot ${slotIndex + 1}` : "Gallery full"}
            >
              <Plus className="h-4 w-4" />
              <span className="text-[10px] font-medium">Slot {slotIndex + 1}</span>
            </div>
          );
        })}
      </div>

      {/* Upload & Add Controls */}
      {canAddMore ? (
        mode === "upload" ? (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
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
              <div className="py-2 flex items-center justify-center gap-2 text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin text-[#FF6857]" />
                <span className="text-[11px]">Uploading image(s) to gallery...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-zinc-400 py-1">
                <Upload className="h-4 w-4 text-zinc-500" />
                <span className="text-[11px] text-zinc-300 font-medium">
                  Click or drag images to add to gallery
                </span>
                <span className="text-[10px] text-zinc-500">
                  ({remainingSlots} slot{remainingSlots > 1 ? "s" : ""} left)
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
                placeholder="Paste image URL (https://...)"
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6857]"
              />
            </div>
            <button
              type="submit"
              disabled={!urlInput.trim() || isUploading}
              className="px-3 h-8 rounded-lg bg-[#FF6857] hover:bg-[#e05646] disabled:opacity-50 text-white text-xs font-medium transition-colors shrink-0 cursor-pointer flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add to Gallery</span>
            </button>
          </form>
        )
      ) : (
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-zinc-400">
          <span className="text-[11px] flex items-center gap-1.5 text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            <span>Maximum gallery limit of {maxImages} images reached.</span>
          </span>
          <span className="text-[10px] text-zinc-500">
            Remove any slot to upload another.
          </span>
        </div>
      )}

      {uploadError && (
        <p className="text-[11px] text-red-400 font-medium">{uploadError}</p>
      )}
    </div>
  );
};
