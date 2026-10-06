"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Upload, Search, Trash2, Copy, Check, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  dimensions: string;
  uploadedAt: string;
}

const INITIAL_MEDIA: MediaAsset[] = [
  {
    id: "m-1",
    name: "hero-transit-backpack.jpg",
    url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
    size: "420 KB",
    type: "image/jpeg",
    dimensions: "1920x1080",
    uploadedAt: "Oct 2, 2026",
  },
  {
    id: "m-2",
    name: "slim-sleeve-wallet-caramel.jpg",
    url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    size: "215 KB",
    type: "image/jpeg",
    dimensions: "1200x1200",
    uploadedAt: "Oct 3, 2026",
  },
  {
    id: "m-3",
    name: "work-folio-black-leather.jpg",
    url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    size: "310 KB",
    type: "image/jpeg",
    dimensions: "1200x1200",
    uploadedAt: "Oct 4, 2026",
  },
  {
    id: "m-4",
    name: "tannery-workshop-artisan.jpg",
    url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    size: "540 KB",
    type: "image/jpeg",
    dimensions: "1600x900",
    uploadedAt: "Oct 5, 2026",
  },
  {
    id: "m-5",
    name: "carry-on-luggage-slate.jpg",
    url: "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?auto=format&fit=crop&w=800&q=80",
    size: "380 KB",
    type: "image/jpeg",
    dimensions: "1200x1200",
    uploadedAt: "Oct 6, 2026",
  },
  {
    id: "m-6",
    name: "desk-caddy-tech-pouch.jpg",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    size: "290 KB",
    type: "image/jpeg",
    dimensions: "1200x1200",
    uploadedAt: "Oct 6, 2026",
  },
];

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>(INITIAL_MEDIA);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    showNotification(`Copied link for ${asset.name}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
    showNotification("Asset deleted from S3/MinIO bucket.");
  };

  const handleUploadSimulate = () => {
    const newAsset: MediaAsset = {
      id: `m-${Date.now()}`,
      name: `upload-${Date.now().toString().slice(-4)}.jpg`,
      url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      size: "260 KB",
      type: "image/jpeg",
      dimensions: "1200x1200",
      uploadedAt: "Just now",
    };
    setAssets([newAsset, ...assets]);
    showNotification("Uploaded new asset to storage.");
  };

  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-amber-500" />
            Media Storage & Asset CDN
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            MinIO / S3 connected object store. Upload high-res photography, banners, and lookbook media.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={handleUploadSimulate}>
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Upload File
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          {notification}
        </div>
      )}

      {/* Upload Dropzone Simulator */}
      <div
        onClick={handleUploadSimulate}
        className="border-2 border-dashed border-zinc-800 hover:border-amber-500/50 bg-zinc-900/40 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group"
      >
        <div className="p-3 rounded-full bg-zinc-800 group-hover:bg-amber-500/20 transition-colors">
          <Upload className="w-5 h-5 text-zinc-400 group-hover:text-amber-400" />
        </div>
        <p className="text-xs font-semibold text-zinc-200">
          Click or drag & drop files here to upload to MinIO / S3
        </p>
        <p className="text-[11px] text-zinc-500">
          Supports WebP, AVIF, JPEG, PNG, MP4 up to 50MB. Auto-optimized via Next.js Image pipeline.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter assets by filename..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-all flex flex-col"
          >
            <div className="relative aspect-video bg-zinc-950 overflow-hidden">
              <Image
                src={asset.url}
                alt={asset.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleCopyUrl(asset)}
                  className="p-2 bg-zinc-900/90 hover:bg-white hover:text-black rounded-lg text-white transition-colors"
                  title="Copy URL"
                >
                  {copiedId === asset.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="p-2 bg-zinc-900/90 hover:bg-red-600 rounded-lg text-white transition-colors"
                  title="Delete Asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3 text-xs space-y-1">
              <p className="font-semibold text-zinc-200 truncate" title={asset.name}>
                {asset.name}
              </p>
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>{asset.dimensions}</span>
                <span>{asset.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
