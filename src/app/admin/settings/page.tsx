"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BRAND } from "@/lib/constants/brand";
import { Sliders, Save, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState<string>(BRAND.name);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(100);
  const [taxRate, setTaxRate] = useState(7.0);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sliders className="h-6 w-6 text-[#FF6857]" />
            <span>Storefront Global Settings</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Shipping zones, tax jurisdiction configurations, multi-currency display rates.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-bold text-sm text-white">General Store Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Brand Display Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="bg-zinc-950 border-zinc-700 text-white"
            />
            <Input
              label="Base Currency"
              disabled
              value="USD ($)"
              className="bg-zinc-950 border-zinc-700 text-zinc-400"
            />
          </div>
        </div>

        <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-bold text-sm text-white">Shipping & Tax Rules</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Free Shipping Minimum ($ USD)"
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="bg-zinc-950 border-zinc-700 text-white"
            />
            <Input
              label="Default US Tax Jurisdiction (%)"
              type="number"
              step="0.1"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="bg-zinc-950 border-zinc-700 text-white"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="gap-2">
            <Save className="h-4 w-4" />
            <span>{saved ? "Settings Saved" : "Save Store Configuration"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
