/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Check,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Square,
  Smartphone,
  Tv,
  Move,
  RefreshCw,
  Loader2,
  Sparkles,
  Scissors,
} from "lucide-react";

export interface CropResult {
  file: File;
  previewUrl: string;
}

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSource: string | File | null;
  onClose: () => void;
  onCropComplete: (result: CropResult) => Promise<void> | void;
  onSkipCrop?: () => Promise<void> | void;
  initialAspectRatio?: number; // 1 = 1:1, 0.8 = 4:5, 0.75 = 3:4, 1.777 = 16:9, 0 = free/original
  title?: string;
}

interface AspectPreset {
  id: string;
  label: string;
  sublabel: string;
  ratio: number;
  icon: React.ReactNode;
  recommended?: boolean;
}

const ASPECT_PRESETS: AspectPreset[] = [
  {
    id: "1:1",
    label: "1:1 Square",
    sublabel: "Storefront Standard",
    ratio: 1,
    icon: <Square className="h-3.5 w-3.5" />,
    recommended: true,
  },
  {
    id: "4:5",
    label: "4:5 Portrait",
    sublabel: "Packaging & Bottles",
    ratio: 4 / 5,
    icon: <Smartphone className="h-3.5 w-3.5" />,
  },
  {
    id: "3:4",
    label: "3:4 Standard",
    sublabel: "Tall Angle",
    ratio: 3 / 4,
    icon: <Smartphone className="h-3.5 w-3.5" />,
  },
  {
    id: "16:9",
    label: "16:9 Banner",
    sublabel: "Wide Hero",
    ratio: 16 / 9,
    icon: <Tv className="h-3.5 w-3.5" />,
  },
  {
    id: "original",
    label: "Original",
    sublabel: "Natural Shape",
    ratio: 0,
    icon: <Maximize className="h-3.5 w-3.5" />,
  },
];

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSource,
  onClose,
  onCropComplete,
  onSkipCrop,
  initialAspectRatio = 1,
  title = "Crop & Frame Product Image",
}) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [aspectRatio, setAspectRatio] = useState<number>(initialAspectRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Load and prepare image source
  useEffect(() => {
    if (!isOpen || !imageSource) {
      setImageUrl("");
      return;
    }

    setErrorMessage("");
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
    setAspectRatio(initialAspectRatio);

    let activeUrl = "";
    if (typeof imageSource === "string") {
      activeUrl = imageSource;
      setImageUrl(imageSource);
    } else if (imageSource instanceof File) {
      activeUrl = URL.createObjectURL(imageSource);
      setImageUrl(activeUrl);
    }

    // Pre-measure natural dimensions
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      setErrorMessage("Could not load image for cropping. You can skip cropping or use original.");
    };
    img.src = activeUrl;

    return () => {
      if (imageSource instanceof File && activeUrl) {
        URL.revokeObjectURL(activeUrl);
      }
    };
  }, [isOpen, imageSource, initialAspectRatio]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  // Compute crop box dimensions based on viewport size and chosen aspect ratio
  const getCropBoxDimensions = useCallback(() => {
    // Default fallback viewport size
    const vpW = viewportRef.current?.clientWidth || 540;
    const vpH = viewportRef.current?.clientHeight || 400;

    const pad = 36;
    const maxW = Math.max(160, vpW - pad * 2);
    const maxH = Math.max(160, vpH - pad * 2);

    let effectiveRatio = aspectRatio;
    if (effectiveRatio === 0) {
      // Original ratio
      effectiveRatio =
        naturalSize.width && naturalSize.height
          ? naturalSize.width / naturalSize.height
          : 1;
    }

    let cropW: number;
    let cropH: number;

    if (maxW / maxH > effectiveRatio) {
      cropH = maxH;
      cropW = cropH * effectiveRatio;
    } else {
      cropW = maxW;
      cropH = cropW / effectiveRatio;
    }

    return {
      cropW: Math.round(cropW),
      cropH: Math.round(cropH),
      cropLeft: Math.round((vpW - cropW) / 2),
      cropTop: Math.round((vpH - cropH) / 2),
      vpW,
      vpH,
      effectiveRatio,
    };
  }, [aspectRatio, naturalSize]);

  const { cropW, cropH, cropLeft, cropTop, vpW, vpH, effectiveRatio } =
    getCropBoxDimensions();

  // Calculate base scale so image covers the crop frame comfortably
  const isRotatedQuarter = rotation % 180 !== 0;
  const effectiveNatW = isRotatedQuarter ? naturalSize.height : naturalSize.width;
  const effectiveNatH = isRotatedQuarter ? naturalSize.width : naturalSize.height;

  const baseScale =
    effectiveNatW && effectiveNatH
      ? Math.max(cropW / effectiveNatW, cropH / effectiveNatH)
      : 1;

  const currentScale = baseScale * zoom;

  // Dragging event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStartRef.current.x,
      y: e.touches[0].clientY - dragStartRef.current.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(3.5, Math.max(0.6, Number((prev + zoomDelta).toFixed(2)))));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  // Generate cropped image on canvas and export
  const handleApplyCrop = async () => {
    if (!imageUrl || !naturalSize.width || !naturalSize.height) {
      setErrorMessage("Image is not fully loaded yet.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      await new Promise<void>((resolve, reject) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load source image for canvas"));
        }
      });

      // Target high-definition output size (e.g. 1200px or natural resolution)
      const targetCanvasW = Math.round(
        Math.min(2400, Math.max(900, cropW * (window.devicePixelRatio || 2)))
      );
      const targetCanvasH = Math.round(targetCanvasW / effectiveRatio);

      const canvas = document.createElement("canvas");
      canvas.width = targetCanvasW;
      canvas.height = targetCanvasH;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not acquire 2D canvas context");
      }

      // Smooth resampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Background fill (white default for crisp clean e-commerce products)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, targetCanvasW, targetCanvasH);

      // Scale multiplier between screen crop frame and output canvas
      const scaleMultiplier = targetCanvasW / cropW;

      // Center the transformation at canvas center
      ctx.translate(targetCanvasW / 2, targetCanvasH / 2);

      // Pan shift relative to canvas
      ctx.translate(pan.x * scaleMultiplier, pan.y * scaleMultiplier);

      // Rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // Render image centered
      const drawW = naturalSize.width * currentScale * scaleMultiplier;
      const drawH = naturalSize.height * currentScale * scaleMultiplier;

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

      // Convert to high-quality JPEG Blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b),
          "image/jpeg",
          0.92
        );
      });

      if (!blob) {
        throw new Error("Canvas export failed");
      }

      const originalName =
        imageSource instanceof File
          ? imageSource.name.replace(/\.[^/.]+$/, "")
          : "product-cropped";
      const fileName = `${originalName}-cropped-${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });
      const previewUrl = URL.createObjectURL(blob);

      await onCropComplete({ file, previewUrl });
      onClose();
    } catch (err: any) {
      console.error("Crop error:", err);
      setErrorMessage(
        err?.message ||
          "Could not crop image. You can skip cropping and upload original instead."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseOriginal = async () => {
    if (onSkipCrop) {
      setIsProcessing(true);
      try {
        await onSkipCrop();
        onClose();
      } catch (err: any) {
        setErrorMessage(err?.message || "Failed to process original image.");
      } finally {
        setIsProcessing(false);
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#FF6857]/15 text-[#FF6857]">
              <Scissors className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] bg-[#FF6857]/20 text-[#FF6857] px-2 py-0.5 rounded-full font-medium">
                  Prevents Random Storefront Cropping
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Drag to reposition • Scroll or use slider to zoom • Pick aspect ratio
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Aspect Ratio Toolbar */}
        <div className="px-5 py-2.5 bg-zinc-950 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 mr-1 uppercase tracking-wider">
              Ratio:
            </span>
            {ASPECT_PRESETS.map((preset) => {
              const isSelected =
                (preset.ratio === 0 && aspectRatio === 0) ||
                (preset.ratio !== 0 && Math.abs(aspectRatio - preset.ratio) < 0.01);

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setAspectRatio(preset.ratio);
                    setPan({ x: 0, y: 0 });
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FF6857] text-white shadow-sm ring-1 ring-[#FF6857]/50"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800"
                  }`}
                >
                  {preset.icon}
                  <span>{preset.label}</span>
                  {preset.recommended && (
                    <span className="text-[9px] bg-black/40 px-1 py-0.2 rounded font-bold uppercase tracking-wider">
                      Card
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleRotate}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
              title="Rotate 90 degrees clockwise"
            >
              <RotateCw className="h-3.5 w-3.5 text-[#FF6857]" />
              <span>Rotate 90°</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
              title="Reset zoom, rotation, and position"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Interactive Viewport */}
        <div
          ref={viewportRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className="relative w-full h-[380px] sm:h-[420px] bg-zinc-950 overflow-hidden select-none cursor-grab active:cursor-grabbing flex items-center justify-center"
        >
          {imageUrl ? (
            <>
              {/* Scaled & Panned Image */}
              <div
                className="absolute transition-transform duration-75 pointer-events-none"
                style={{
                  width: naturalSize.width ? `${naturalSize.width * currentScale}px` : "auto",
                  height: naturalSize.height ? `${naturalSize.height * currentScale}px` : "auto",
                  transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                }}
              >
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Crop preview"
                  className="w-full h-full object-contain pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Crop Frame Box with Box-Shadow Mask */}
              <div
                className="absolute pointer-events-none transition-all duration-150"
                style={{
                  width: `${cropW}px`,
                  height: `${cropH}px`,
                  left: `${cropLeft}px`,
                  top: `${cropTop}px`,
                  boxShadow: "0 0 0 9999px rgba(9, 9, 11, 0.78)",
                  border: "2px solid #FF6857",
                  borderRadius: "8px",
                }}
              >
                {/* 3x3 Rule of Thirds Grid */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                  <div className="border-r border-b border-dashed border-[#FF6857]/60" />
                  <div className="border-r border-b border-dashed border-[#FF6857]/60" />
                  <div className="border-b border-dashed border-[#FF6857]/60" />
                  <div className="border-r border-b border-dashed border-[#FF6857]/60" />
                  <div className="border-r border-b border-dashed border-[#FF6857]/60" />
                  <div className="border-b border-dashed border-[#FF6857]/60" />
                  <div className="border-r border-dashed border-[#FF6857]/60" />
                  <div className="border-r border-dashed border-[#FF6857]/60" />
                  <div />
                </div>

                {/* Corner Accents */}
                <span className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-white rounded-tl" />
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-white rounded-tr" />
                <span className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-white rounded-bl" />
                <span className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-white rounded-br" />

                {/* Live Size & Ratio Tag */}
                <div className="absolute -top-6 left-0 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300">
                  <span>Frame: {cropW} × {cropH}px</span>
                  <span className="text-[#FF6857]">({effectiveRatio === 1 ? "1:1 Square" : effectiveRatio.toFixed(2)})</span>
                </div>
              </div>

              {/* Floating Pan Hint */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] text-zinc-300 flex items-center gap-1.5 border border-zinc-800">
                <Move className="h-3 w-3 text-[#FF6857]" />
                <span>Click & drag image to align inside the coral frame</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-zinc-500">
              <Loader2 className="h-8 w-8 animate-spin text-[#FF6857]" />
              <p className="text-xs">Loading image asset...</p>
            </div>
          )}
        </div>

        {/* Zoom Controls & Slider */}
        <div className="px-5 py-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-sm">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(0.6, Number((prev - 0.1).toFixed(2))))}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            <input
              type="range"
              min="0.6"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF6857]"
            />

            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(3, Number((prev + 0.1).toFixed(2))))}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <span className="text-xs font-mono text-zinc-400 w-12 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {naturalSize.width > 0 && (
            <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline-block">
              Source: {naturalSize.width} × {naturalSize.height}px
            </span>
          )}
        </div>

        {errorMessage && (
          <div className="px-5 py-2 bg-red-950/40 border-t border-red-900/60 text-xs text-red-400 flex items-center justify-between">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between gap-3">
          <div>
            {onSkipCrop && (
              <button
                type="button"
                onClick={handleUseOriginal}
                disabled={isProcessing}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Use Uncropped Original
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={isProcessing || !imageUrl}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#FF6857] hover:bg-[#e05646] text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Processing Crop...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Crop & Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
