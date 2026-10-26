/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef } from "react";
import { Upload, Link2, X, Check, Loader2, Scissors } from "lucide-react";
import { ImageCropperModal, CropResult } from "./ImageCropperModal";

interface ProductImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  value,
  onChange,
  label = "Product Image",
}) => {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper state
  const [cropperState, setCropperState] = useState<{
    isOpen: boolean;
    source: string | File | null;
    originalFile?: File;
  }>({
    isOpen: false,
    source: null,
  });

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

  const handleFilePicked = (file: File) => {
    setUploadError("");
    // Open cropper immediately
    setCropperState({
      isOpen: true,
      source: file,
      originalFile: file,
    });
  };

  const handleCropComplete = async (result: CropResult) => {
    setIsUploading(true);
    setUploadError("");

    try {
      const url = await uploadFileToServer(result.file);
      onChange(url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to upload cropped file.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSkipCrop = async () => {
    if (!cropperState.originalFile) return;
    setIsUploading(true);
    setUploadError("");

    try {
      const url = await uploadFileToServer(cropperState.originalFile);
      onChange(url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to upload file.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleOpenCropForCurrent = () => {
    if (!value) return;
    setCropperState({
      isOpen: true,
      source: value,
    });
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
      handleFilePicked(files[0]);
    }
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="text-zinc-300 font-medium">{label}</label>
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
            Upload File
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
            Image Link
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-[#FF6857] bg-[#FF6857]/10"
              : "border-zinc-700 bg-zinc-950 hover:border-zinc-500 hover:bg-zinc-900/60"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFilePicked(e.target.files[0]);
              }
            }}
          />

          {isUploading ? (
            <div className="py-4 flex flex-col items-center justify-center gap-2 text-zinc-400">
              <Loader2 className="h-6 w-6 animate-spin text-[#FF6857]" />
              <span>Uploading asset to server...</span>
            </div>
          ) : value ? (
            <div className="flex items-center justify-between gap-3 text-left">
              <div className="relative w-14 h-14 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700 flex items-center justify-center">
                <img
                  src={value}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-white block truncate text-xs">
                  {value.split("/").pop()}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Check className="h-3 w-3" /> Image Active
                </span>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Click to replace or use crop button
                </p>
              </div>

              <div className="flex items-center gap-1">
                {/* Crop button for existing image */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCropForCurrent();
                  }}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Crop / Re-frame this image"
                >
                  <Scissors className="h-3.5 w-3.5 text-[#FF6857]" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-3 flex flex-col items-center justify-center gap-1 text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Upload className="h-5 w-5 text-zinc-500" />
                <Scissors className="h-3.5 w-3.5 text-[#FF6857]" />
              </div>
              <p className="font-medium text-white">Click or drag image here to crop & upload</p>
              <p className="text-[10px] text-zinc-500">Supports PNG, JPG, WebP, AVIF up to 10MB</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://valobazar.com/storage/products/..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6857]"
            />
          </div>
          {value && (
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-zinc-950 border border-zinc-800">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="relative w-8 h-8 rounded bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={value} alt="Preview" className="w-full h-full object-cover rounded" />
                </div>
                <span className="text-[11px] text-zinc-400 truncate flex-1">{value}</span>
              </div>
              <button
                type="button"
                onClick={handleOpenCropForCurrent}
                className="px-2 py-1 rounded bg-zinc-800 hover:bg-[#FF6857] text-white text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="Crop image from link"
              >
                <Scissors className="h-3 w-3" />
                <span>Crop</span>
              </button>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-[11px] text-red-400">{uploadError}</p>
      )}

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperState.isOpen}
        imageSource={cropperState.source}
        onClose={() => setCropperState({ isOpen: false, source: null })}
        onCropComplete={handleCropComplete}
        onSkipCrop={cropperState.originalFile ? handleSkipCrop : undefined}
        title={`Crop & Frame ${label}`}
      />
    </div>
  );
};
