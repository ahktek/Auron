"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { StoredSettings } from "@/lib/store/productStore";
import { Sliders, Save, CheckCircle2, RefreshCw } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoredSettings>({
    storeName: "Cure-Care",
    legalName: "Cure-Care Health & Essentials Ltd.",
    currency: "BDT",
    currencySymbol: "৳",
    freeShippingThreshold: 1500,
    insideDhakaShipping: 70,
    outsideDhakaShipping: 130,
    supportEmail: "support@curecarebd.com",
    supportPhone: "+880 1700-000000",
    announcement: "100% Authentic Thai Balms, Pure Scalp Oils & Cold-Pressed Remedies | Nationwide Delivery",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
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
            Shipping thresholds, delivery fees, brand credentials, and header banner management.
          </p>
        </div>

        <Button
          onClick={fetchSettings}
          variant="outline"
          size="sm"
          className="gap-1.5 text-zinc-300 border-zinc-700 hover:bg-zinc-800"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sync</span>
        </Button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Store configurations saved and applied across live website!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* General Store Information */}
        <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-bold text-sm text-white">General Brand Identity</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Store Display Name</label>
              <input
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Legal Entity Name</label>
              <input
                value={settings.legalName}
                onChange={(e) => setSettings({ ...settings, legalName: e.target.value })}
                className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Base Currency</label>
              <input
                disabled
                value="Bangladeshi Taka (৳ BDT)"
                className="w-full h-9 px-3 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Support Phone (Bangladesh)</label>
            <input
              value={settings.supportPhone}
              onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
            />
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-bold text-sm text-white">Nationwide Shipping Rates (BDT)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">
                Free Delivery Threshold (৳)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">
                Inside Dhaka Shipping (৳)
              </label>
              <input
                type="number"
                value={settings.insideDhakaShipping}
                onChange={(e) =>
                  setSettings({ ...settings, insideDhakaShipping: Number(e.target.value) })
                }
                className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-medium mb-1">
                Outside Dhaka Shipping (৳)
              </label>
              <input
                type="number"
                value={settings.outsideDhakaShipping}
                onChange={(e) =>
                  setSettings({ ...settings, outsideDhakaShipping: Number(e.target.value) })
                }
                className="w-full h-9 px-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
              />
            </div>
          </div>
        </div>

        {/* Header Announcement */}
        <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-bold text-sm text-white">Top Utility Bar Announcement</h3>
          <div>
            <textarea
              rows={2}
              value={settings.announcement}
              onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
              className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-[#FF6857]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#FF6857] hover:bg-[#e05646] text-white gap-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
