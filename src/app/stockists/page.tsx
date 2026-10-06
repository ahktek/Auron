"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { MapPin, Phone, Globe, Navigation } from "lucide-react";

interface Stockist {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  countryCode: string;
  phone: string;
  website: string;
  lat: number;
  lng: number;
}

const STOCKISTS: Stockist[] = [
  { id: "1", name: "AUREN Flagship Studio Portland", street: "412 NW 11th Ave", city: "Portland", state: "OR", postalCode: "97209", country: "United States", countryCode: "US", phone: "+1 503-555-0142", website: "https://aurencarry.com", lat: 45.5262, lng: -122.6828 },
  { id: "2", name: "SoHo Outfitters New York", street: "108 Mercer St", city: "New York", state: "NY", postalCode: "10012", country: "United States", countryCode: "US", phone: "+1 212-555-0164", website: "https://example.com", lat: 40.7243, lng: -73.9984 },
  { id: "3", name: "The Standard Goods Seattle", street: "701 E Pike St", city: "Seattle", state: "WA", postalCode: "98122", country: "United States", countryCode: "US", phone: "+1 206-555-0199", website: "https://example.com", lat: 47.614, lng: -122.3228 },
  { id: "4", name: "Nordic Goods Co. Copenhagen", street: "Gothersgade 44", city: "Copenhagen", state: "Hovedstaden", postalCode: "1123", country: "Denmark", countryCode: "DK", phone: "+45 33 12 40 55", website: "https://example.com", lat: 55.6828, lng: 12.5805 },
  { id: "5", name: "Kaufmann & Sons Zurich", street: "Bahnhofstrasse 28", city: "Zurich", state: "ZH", postalCode: "8001", country: "Switzerland", countryCode: "CH", phone: "+41 44 211 40 10", website: "https://example.com", lat: 47.3717, lng: 8.5398 },
  { id: "6", name: "Redchurch Goods London", street: "32 Redchurch St", city: "London", state: "Shoreditch", postalCode: "E2 7DD", country: "United Kingdom", countryCode: "GB", phone: "+44 20 7946 0912", website: "https://example.com", lat: 51.5248, lng: -0.0747 },
  { id: "7", name: "Le Marais Carry Atelier", street: "14 Rue Vieille-du-Temple", city: "Paris", state: "IDF", postalCode: "75004", country: "France", countryCode: "FR", phone: "+33 1 42 68 55 00", website: "https://example.com", lat: 48.8575, lng: 2.3578 },
  { id: "8", name: "Mitte Minimalist Berlin", street: "Torstraße 102", city: "Berlin", state: "Berlin", postalCode: "10119", country: "Germany", countryCode: "DE", phone: "+49 30 2408 8100", website: "https://example.com", lat: 52.5285, lng: 13.4072 },
  { id: "9", name: "Shibuya Carry & Supply", street: "1 Chome-19-10 Jinnan", city: "Tokyo", state: "Tokyo", postalCode: "150-0041", country: "Japan", countryCode: "JP", phone: "+81 3-5555-0188", website: "https://example.com", lat: 35.6628, lng: 139.7013 },
  { id: "10", name: "Fitzroy Provisioners Melbourne", street: "214 Gertrude St", city: "Melbourne", state: "VIC", postalCode: "3065", country: "Australia", countryCode: "AU", phone: "+61 3 9417 8820", website: "https://example.com", lat: -37.8058, lng: 144.9818 },
  { id: "11", name: "Gastown Provision Co. Vancouver", street: "12 Water St", city: "Vancouver", state: "BC", postalCode: "V6B 1A4", country: "Canada", countryCode: "CA", phone: "+1 604-555-0182", website: "https://example.com", lat: 49.2838, lng: -123.1075 },
  { id: "12", name: "Gulshan Artisan Hub Dhaka", street: "Road 11, Block D, Banani", city: "Dhaka", state: "Dhaka", postalCode: "1213", country: "Bangladesh", countryCode: "BD", phone: "+880 2-9884501", website: "https://example.com", lat: 23.7937, lng: 90.4043 },
];

export default function StockistsPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");
  const [selectedStockist, setSelectedStockist] = useState<Stockist>(STOCKISTS[0]);

  const countries = ["ALL", "United States", "United Kingdom", "Denmark", "Switzerland", "France", "Germany", "Japan", "Australia", "Canada", "Bangladesh"];

  const filtered = selectedCountry === "ALL"
    ? STOCKISTS
    : STOCKISTS.filter((s) => s.country === selectedCountry);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <Container>
          <div className="max-w-3xl mb-10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34]">
              Global Presence
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Find an AUREN Stockist
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Experience the tactile weight of our leather, test pocket volumes in person, and meet retail partners who share our passion for considered craftsmanship.
            </p>
          </div>

          {/* Country Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
            {countries.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCountry(c)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCountry === c
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                    : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* List Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4 max-h-[650px] overflow-y-auto pr-2">
              {filtered.map((stockist) => (
                <div
                  key={stockist.id}
                  onClick={() => setSelectedStockist(stockist)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedStockist.id === stockist.id
                      ? "border-[#C25E34] bg-white dark:bg-zinc-900 shadow-md ring-1 ring-[#C25E34]"
                      : "border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 hover:bg-white"
                  }`}
                >
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {stockist.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    {stockist.street}, {stockist.city}, {stockist.state} {stockist.postalCode}
                  </p>
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
                    {stockist.country}
                  </p>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {stockist.phone}
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${stockist.lat},${stockist.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#C25E34] font-medium hover:underline flex items-center gap-1 ml-auto"
                    >
                      <Navigation className="h-3 w-3" /> Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Column (7 cols) - Interactive OSM Map display */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between">
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 mb-6">
                <iframe
                  title="OpenStreetMap Locator"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedStockist.lng - 0.05}%2C${selectedStockist.lat - 0.03}%2C${selectedStockist.lng + 0.05}%2C${selectedStockist.lat + 0.03}&layer=mapnik&marker=${selectedStockist.lat}%2C${selectedStockist.lng}`}
                />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C25E34]">
                  Selected Storefront
                </span>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedStockist.name}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {selectedStockist.street}, {selectedStockist.city}, {selectedStockist.state} {selectedStockist.postalCode}, {selectedStockist.country}
                </p>
                <div className="flex gap-4 pt-2 text-xs">
                  <span className="text-zinc-500">Phone: {selectedStockist.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
