import { BRAND } from "@/lib/constants/brand";

export interface Variant {
  id: string;
  sku: string;
  title: string;
  colorName: string;
  colorHex: string;
  materialName?: string;
  sizeName?: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  isDefault: boolean;
  images: string[];
}

export interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  verified: boolean;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  details: string;
  materialsInfo: string;
  dimensionsInfo: string;
  capacityInfo: string;
  careInfo: string;
  basePrice: number;
  compareAtPrice?: number;
  currency: string;
  categorySlug: string;
  categoryName: string;
  subcategorySlug?: string;
  collections: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  isNewRelease?: boolean;
  isFeatured?: boolean;
  isBundle?: boolean;
  isComingSoon?: boolean;
  isSoldOut?: boolean;
  primaryImage: string;
  hoverImage: string;
  images: string[];
  variants: Variant[];
  reviews: ReviewItem[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  subcategories: { name: string; slug: string }[];
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  title: string;
  subtitle: string;
  editorialHeader: string;
  heroImage: string;
  productSlugs: string[];
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: "cat_bags",
    name: "Bags & Luggage",
    slug: "bags-luggage",
    description: "Engineered backpacks, weekender duffels, and lightweight carry-ons built for seamless transit.",
    subcategories: [
      { name: "Backpacks", slug: "backpacks" },
      { name: "Totes & Slings", slug: "totes-slings" },
      { name: "Weekenders & Duffels", slug: "weekenders" },
      { name: "Luggage", slug: "luggage" },
    ],
  },
  {
    id: "cat_travel",
    name: "Travel",
    slug: "travel",
    description: "Smart organizers, passport sleeves, and dopp kits to eliminate airport friction.",
    subcategories: [
      { name: "Toiletry Kits", slug: "toiletry-kits" },
      { name: "Passport Wallets", slug: "passport-wallets" },
      { name: "Packing Cubes", slug: "packing-cubes" },
      { name: "Luggage Tags", slug: "luggage-tags" },
    ],
  },
  {
    id: "cat_wallets",
    name: "Wallets",
    slug: "wallets",
    description: "Sculpted slim profiles, RFID protection, and premium vegetable-tanned leather.",
    subcategories: [
      { name: "Slim Bifolds", slug: "slim-bifolds" },
      { name: "Card Holders", slug: "card-holders" },
      { name: "Zip Wallets", slug: "zip-wallets" },
      { name: "Travel Wallets", slug: "travel-wallets" },
    ],
  },
  {
    id: "cat_tech",
    name: "Tech",
    slug: "tech",
    description: "Padded device sleeves, cable portfolios, and desk accessories for mobile workflows.",
    subcategories: [
      { name: "Laptop Sleeves", slug: "laptop-sleeves" },
      { name: "Tech Kits", slug: "tech-kits" },
      { name: "Desk Mats", slug: "desk-mats" },
      { name: "Phone Cases", slug: "phone-cases" },
    ],
  },
  {
    id: "cat_accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Refined key organizers, sunglasses folios, and everyday hardware.",
    subcategories: [
      { name: "Key Covers", slug: "key-covers" },
      { name: "Eyewear Cases", slug: "eyewear-cases" },
      { name: "Notebook Covers", slug: "notebook-covers" },
      { name: "Lanyards & Straps", slug: "lanyards-straps" },
    ],
  },
  {
    id: "cat_featured",
    name: "Featured",
    slug: "featured",
    description: "Seasonal highlights, award-winning silhouettes, and limited capsule releases.",
    subcategories: [
      { name: "Popular", slug: "popular" },
      { name: "By Activity", slug: "by-activity" },
      { name: "By Collection", slug: "by-collection" },
    ],
  },
];

export const COLLECTIONS: CollectionItem[] = [
  {
    id: "col_edc",
    name: "Everyday Carry",
    slug: "everyday-carry",
    title: "The Everyday Carry Collection",
    subtitle: "Streamlined silhouettes refined for daily movement.",
    editorialHeader: "Designed to strip away the unnecessary, keeping your core essentials right at hand.",
    heroImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1600&q=80",
    productSlugs: ["apex-transit-backpack-24l", "nexus-crossbody-sling-7l", "apex-slim-bifold-wallet", "orbit-key-folio-organizer"],
  },
  {
    id: "col_apex",
    name: "The Apex Flight Series",
    slug: "apex-flight",
    title: "The Apex Flight Series",
    subtitle: "Ultra-durable, weather-resistant ballistic nylon carry goods.",
    editorialHeader: "Engineered in partnership with transcontinental travelers for supreme transit efficiency.",
    heroImage: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=1600&q=80",
    productSlugs: ["aeris-flight-pack-35l", "aero-carry-on-spinner-38l", "apex-transit-backpack-24l", "passport-transit-sleeve"],
  },
  {
    id: "col_weather",
    name: "Coastal All-Weather",
    slug: "coastal-all-weather",
    title: "Coastal All-Weather Series",
    subtitle: "Sealed seams, YKK AquaGuard zips, and recycled ripstop.",
    editorialHeader: "Unwavering protection against downpours, sea mist, and spontaneous expeditions.",
    heroImage: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=1600&q=80",
    productSlugs: ["vanguard-commuter-rolltop-28l", "nexus-crossbody-sling-7l", "dopp-standing-toiletry-kit"],
  },
  {
    id: "col_leather",
    name: "Minimalist Leather Studio",
    slug: "leather-studio",
    title: "Minimalist Leather Studio",
    subtitle: "Gold-rated environmental tannery leather that patinas gracefully.",
    editorialHeader: "Tactile, supple, and timeless. Each piece develops a rich luster unique to your life.",
    heroImage: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1600&q=80",
    productSlugs: ["apex-slim-bifold-wallet", "card-sleeve-minimalist", "zip-folio-wallet", "structured-leather-laptop-sleeve-16", "architect-leather-desk-mat"],
  },
  {
    id: "col_work",
    name: "Work & Commute Essentials",
    slug: "work-commute",
    title: "Work & Commute Essentials",
    subtitle: "Organized storage for laptops, cables, chargers, and documents.",
    editorialHeader: "Maintain effortless focus on your transit between home, office, and creative studio.",
    heroImage: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1600&q=80",
    productSlugs: ["apex-transit-backpack-24l", "strata-daypack-18l", "atelier-canvas-tote-20l", "venture-tech-portfolio-kit", "structured-leather-laptop-sleeve-16"],
  },
  {
    id: "col_midnight",
    name: "The Midnight Edition",
    slug: "midnight-edition",
    title: "The Midnight Black Edition",
    subtitle: "Monochromatic matte-black hardware and stealth technical fabrics.",
    editorialHeader: "A nocturnal aesthetic focused on understated silhouette, shadow, and tactical precision.",
    heroImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=80",
    productSlugs: ["vanguard-commuter-rolltop-28l", "card-sleeve-minimalist", "venture-tech-portfolio-kit"],
  },
];

export const PRODUCTS: ProductItem[] = [
  {
    id: "prod_apex_24",
    slug: "apex-transit-backpack-24l",
    name: "Apex Transit Backpack 24L",
    subtitle: "All-day commuter backpack with dedicated 16-inch laptop chamber",
    description: "The Apex Transit Backpack 24L is engineered for seamless daily commuting and weekend exploration. Featuring a lie-flat clamshell opening, magnetic quick-snap sternum strap, and a concealed lumbar passport pocket.",
    details: "Clamshell full-perimeter opening for effortless packing. Magnetic Fidlock sternum latch. Concealed passport security slot behind breathable lumbar padding. Dual side stretch water bottle pockets.",
    materialsInfo: "Constructed from 100% recycled 600D polyester with water-repellent coating and premium eco-tanned leather accents.",
    dimensionsInfo: "510 x 330 x 180 mm (20 x 13 x 7 inches) · Weight: 1.1kg (2.4 lbs) · Capacity: 24 Liters",
    capacityInfo: "Fits 16” MacBook Pro, water bottle up to 750ml, jacket, headphones, notebook, and power bank.",
    careInfo: "Spot clean with damp cloth and mild soap. Air dry away from direct sunlight.",
    basePrice: 199.0,
    compareAtPrice: 229.0,
    currency: "USD",
    categorySlug: "bags-luggage",
    categoryName: "Bags & Luggage",
    subcategorySlug: "backpacks",
    collections: ["apex-flight", "work-commute", "everyday-carry"],
    tags: ["backpack", "travel", "commute", "water-resistant"],
    rating: 4.9,
    reviewCount: 94,
    isBestseller: true,
    isFeatured: true,
    primaryImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
    hoverImage: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85",
    ],
    variants: [
      { id: "v_1", sku: "ATB-24-BLK", title: "Charcoal Ink", colorName: "Charcoal Ink", colorHex: "#27272A", price: 199.0, compareAtPrice: 229.0, inventory: 45, isDefault: true, images: [] },
      { id: "v_2", sku: "ATB-24-TAN", title: "Saddle Tan", colorName: "Saddle Tan", colorHex: "#A05A2C", price: 199.0, compareAtPrice: 229.0, inventory: 32, isDefault: false, images: [] },
      { id: "v_3", sku: "ATB-24-OLV", title: "Olive Forest", colorName: "Olive Forest", colorHex: "#3C4836", price: 199.0, compareAtPrice: 229.0, inventory: 20, isDefault: false, images: [] },
    ],
    reviews: [
      { id: "r_1", authorName: "Marcus Vance", rating: 5, title: "Best commuter backpack I've ever owned", body: "The magnetic sternum strap and the separate laptop chamber make this unbeatable on public transit. Excellent craftsmanship.", createdAt: "2026-09-14", verified: true },
      { id: "r_2", authorName: "Karin Lindqvist", rating: 5, title: "Streamlined aesthetic, holds a ton", body: "Fits my 16 inch MacBook, lunch, headphones, and gym clothes effortlessly. The silhouette remains slim.", createdAt: "2026-08-28", verified: true },
    ],
  },
  {
    id: "prod_strata_18",
    slug: "strata-daypack-18l",
    name: "Strata Daypack 18L",
    subtitle: "Featherlight everyday backpack for agile city movement",
    description: "Designed for minimalist daily carry, the Strata Daypack combines featherlight recycled ripstop nylon with clean geometric patterning.",
    details: "Ultra-clean profile with concealed front vertical pocket. Suspended neoprene padded sleeve fits 14-inch laptops and iPads.",
    materialsInfo: "High-density 420D recycled ripstop nylon with polyurethane water-resistant backing.",
    dimensionsInfo: "450 x 290 x 140 mm · Weight: 720g · Capacity: 18 Liters",
    capacityInfo: "Fits 14” laptop, daily essentials, light sweater, keys, and water bottle.",
    careInfo: "Wipe with damp cloth. Do not machine wash.",
    basePrice: 149.0,
    currency: "USD",
    categorySlug: "bags-luggage",
    categoryName: "Bags & Luggage",
    subcategorySlug: "backpacks",
    collections: ["everyday-carry", "work-commute"],
    tags: ["backpack", "commute", "lightweight"],
    rating: 4.8,
    reviewCount: 48,
    isBestseller: true,
    isNewRelease: true,
    primaryImage: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80",
    hoverImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
    ],
    variants: [
      { id: "v_4", sku: "STDP-18-OBS", title: "Obsidian", colorName: "Obsidian", colorHex: "#18181B", price: 149.0, inventory: 50, isDefault: true, images: [] },
      { id: "v_5", sku: "STDP-18-TER", title: "Terracotta", colorName: "Terracotta", colorHex: "#FF6857", price: 149.0, inventory: 28, isDefault: false, images: [] },
      { id: "v_6", sku: "STDP-18-SND", title: "Sandstone", colorName: "Sandstone", colorHex: "#D8D2C2", price: 149.0, inventory: 15, isDefault: false, images: [] },
    ],
    reviews: [
      { id: "r_3", authorName: "Julian Reed", rating: 5, title: "Super comfortable straps", body: "Lightweight and doesn't pull on shoulders even when fully loaded with books and tech.", createdAt: "2026-09-02", verified: true },
    ],
  },
  {
    id: "prod_vanguard_28",
    slug: "vanguard-commuter-rolltop-28l",
    name: "Vanguard Commuter Roll-Top 28L",
    subtitle: "Expandable roll-top weather fortress for cycling and storm commuting",
    description: "Built to conquer harsh weather, the Vanguard features technical X-Pac waterproof laminate, magnetic Fidlock buckle closures, and an expandable 22-28L capacity.",
    details: "Fidlock V-buckle magnetic closure. Side waterproof zip provides quick direct entry to main cargo area.",
    materialsInfo: "X-Pac VX21 waterproof laminate exterior with coated YKK AquaGuard zips.",
    dimensionsInfo: "540 x 320 x 190 mm (expandable to 660 mm height) · Capacity: 22-28L",
    capacityInfo: "Holds cycling helmet, change of clothes, 16” laptop, shoes, and hydration reservoir.",
    careInfo: "Clean with soft cloth and warm water.",
    basePrice: 239.0,
    compareAtPrice: 269.0,
    currency: "USD",
    categorySlug: "bags-luggage",
    categoryName: "Bags & Luggage",
    subcategorySlug: "backpacks",
    collections: ["coastal-all-weather", "midnight-edition"],
    tags: ["backpack", "cycling", "weatherproof", "rolltop"],
    rating: 4.9,
    reviewCount: 37,
    isFeatured: true,
    isNewRelease: true,
    primaryImage: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=1000&q=80",
    hoverImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
    ],
    variants: [
      { id: "v_7", sku: "VCR-28-BLK", title: "Matte Black", colorName: "Matte Black", colorHex: "#121214", price: 239.0, compareAtPrice: 269.0, inventory: 24, isDefault: true, images: [] },
      { id: "v_8", sku: "VCR-28-GRY", title: "Storm Grey", colorName: "Storm Grey", colorHex: "#64748B", price: 239.0, compareAtPrice: 269.0, inventory: 19, isDefault: false, images: [] },
    ],
    reviews: [],
  },
  {
    id: "prod_nexus_7",
    slug: "nexus-crossbody-sling-7l",
    name: "Nexus Crossbody Sling 7L",
    subtitle: "Self-compressing crossbody sling with expandable central gusset",
    description: "The Nexus 7L automatically expands when filled and cinches flat when carry is light. Designed with ambidextrous dual-zipper sliders and an integrated magnetic key leash.",
    details: "Expandable gusset design. Padded sunglasses chamber. Magnetic quick-snap key tether.",
    materialsInfo: "Recycled Baida nylon exterior with DWR finish.",
    dimensionsInfo: "320 x 180 x 100 mm · Weight: 380g · Capacity: 7 Liters",
    capacityInfo: "Fits iPad Mini / Kindle, water bottle, point-and-shoot camera, phone, and sunglasses.",
    careInfo: "Wipe clean with a wet microfiber towel.",
    basePrice: 99.0,
    currency: "USD",
    categorySlug: "bags-luggage",
    categoryName: "Bags & Luggage",
    subcategorySlug: "totes-slings",
    collections: ["everyday-carry", "coastal-all-weather"],
    tags: ["sling", "crossbody", "everyday"],
    rating: 4.9,
    reviewCount: 112,
    isBestseller: true,
    isFeatured: true,
    primaryImage: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80",
    hoverImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
    ],
    variants: [
      { id: "v_9", sku: "NCS-7-BLK", title: "Basalt Black", colorName: "Basalt Black", colorHex: "#27272A", price: 99.0, inventory: 60, isDefault: true, images: [] },
      { id: "v_10", sku: "NCS-7-CLY", title: "Clay Orange", colorName: "Clay Orange", colorHex: "#FF6857", price: 99.0, inventory: 40, isDefault: false, images: [] },
      { id: "v_11", sku: "NCS-7-BLU", title: "Slate Blue", colorName: "Slate Blue", colorHex: "#475569", price: 99.0, inventory: 25, isDefault: false, images: [] },
    ],
    reviews: [
      { id: "r_4", authorName: "Oliver Berg", rating: 5, title: "The self-compressing gusset is pure genius", body: "Flattens completely against your chest when you only have your phone and keys, but fits an entire jacket and water bottle when needed.", createdAt: "2026-09-20", verified: true },
    ],
  },
  {
    id: "prod_apex_bifold",
    slug: "apex-slim-bifold-wallet",
    name: "Apex Slim Bifold Wallet",
    subtitle: "Engineered ultra-flat bifold with quick-draw primary card slots",
    description: "The Apex Slim Bifold holds 4 to 11 cards and full-size unfolded banknotes with zero excess pocket thickness. Crafted from Gold-rated vegetable-tanned leather that develops rich personal patina.",
    details: "RFID blocking inner lining. Pull-tab access for backup cards. Flat bill pocket fits international currencies.",
    materialsInfo: "Full-grain, environmentally certified vegetable-tanned leather from Gold-rated tannery.",
    dimensionsInfo: "85 x 102 x 10 mm · Weight: 46g",
    capacityInfo: "Holds 4 to 12 credit cards, flat banknotes (USD, EUR, GBP), and micro business cards.",
    careInfo: "Condition with natural beeswax leather cream periodically.",
    basePrice: 79.0,
    compareAtPrice: 89.0,
    currency: "USD",
    categorySlug: "wallets",
    categoryName: "Wallets",
    subcategorySlug: "slim-bifolds",
    collections: ["everyday-carry", "leather-studio"],
    tags: ["wallet", "bifold", "leather", "rfid"],
    rating: 4.95,
    reviewCount: 240,
    isBestseller: true,
    isFeatured: true,
    primaryImage: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80",
    hoverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85",
    ],
    variants: [
      { id: "v_12", sku: "ASB-CRM", title: "Caramel Tan", colorName: "Caramel Tan", colorHex: "#A05A2C", price: 79.0, compareAtPrice: 89.0, inventory: 85, isDefault: true, images: [] },
      { id: "v_13", sku: "ASB-ESP", title: "Espresso Brown", colorName: "Espresso Brown", colorHex: "#3E2723", price: 79.0, compareAtPrice: 89.0, inventory: 60, isDefault: false, images: [] },
      { id: "v_14", sku: "ASB-BLK", title: "Black Onyx", colorName: "Black Onyx", colorHex: "#18181B", price: 79.0, compareAtPrice: 89.0, inventory: 90, isDefault: false, images: [] },
      { id: "v_15", sku: "ASB-GRN", title: "Forest Green", colorName: "Forest Green", colorHex: "#1E3A2F", price: 79.0, compareAtPrice: 89.0, inventory: 35, isDefault: false, images: [] },
    ],
    reviews: [
      { id: "r_5", authorName: "Hannah Price", rating: 5, title: "Goodbye bulky wallet forever", body: "Fits in my front pocket without any noticeable outline. The leather smell and texture are top shelf.", createdAt: "2026-09-18", verified: true },
    ],
  },
  {
    id: "prod_card_sleeve",
    slug: "card-sleeve-minimalist",
    name: "Card Sleeve Minimalist",
    subtitle: "Our slimmest leather silhouette for true front-pocket essentials",
    description: "A masterclass in restraint. 2 quick-draw card slots outside and a central pull-tab chamber for folded cash and lesser-used ID cards.",
    details: "Two exterior quick-access slots. Leather pull-tab for effortless ejection of central cards.",
    materialsInfo: "Full-grain semi-vegetable tanned cowhide leather.",
    dimensionsInfo: "70 x 103 x 5 mm · Weight: 24g",
    capacityInfo: "Accommodates 2 to 8 cards and folded cash.",
    careInfo: "Wipe gently with soft cloth.",
    basePrice: 49.0,
    currency: "USD",
    categorySlug: "wallets",
    categoryName: "Wallets",
    subcategorySlug: "card-holders",
    collections: ["everyday-carry", "leather-studio"],
    tags: ["wallet", "card-holder", "leather", "minimal"],
    rating: 4.85,
    reviewCount: 180,
    isBestseller: true,
    isFeatured: true,
    primaryImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80",
    hoverImage: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=85",
    ],
    variants: [
      { id: "v_16", sku: "CSM-TAN", title: "Saddle Tan", colorName: "Saddle Tan", colorHex: "#A05A2C", price: 49.0, inventory: 110, isDefault: true, images: [] },
      { id: "v_17", sku: "CSM-INK", title: "Ink Charcoal", colorName: "Ink Charcoal", colorHex: "#27272A", price: 49.0, inventory: 95, isDefault: false, images: [] },
      { id: "v_18", sku: "CSM-OCH", title: "Terracotta Ochre", colorName: "Terracotta Ochre", colorHex: "#FF6857", price: 49.0, inventory: 65, isDefault: false, images: [] },
    ],
    reviews: [],
  },
  {
    id: "prod_tech_kit",
    slug: "venture-tech-portfolio-kit",
    name: "Venture Tech Portfolio Kit",
    subtitle: "Origami-style fold-out organizer for cables, chargers, dongles, and mouse",
    description: "Open flat on any desk for instant access to chargers, dongles, and styluses. Elastic loops and magnetic dividers eliminate cable tangles forever.",
    details: "Accordion clamshell layout. Stretch elastic organizers. Padded outer shell absorbs drops.",
    materialsInfo: "Recycled woven polyester exterior with waterproof zipper and ripstop lining.",
    dimensionsInfo: "230 x 130 x 70 mm · Weight: 210g",
    capacityInfo: "Holds MacBook charger, Magic Mouse, USB-C cables, stylus, flash drives, and AirPods.",
    careInfo: "Wipe with damp cloth.",
    basePrice: 65.0,
    compareAtPrice: 75.0,
    currency: "USD",
    categorySlug: "tech",
    categoryName: "Tech",
    subcategorySlug: "tech-kits",
    collections: ["work-commute", "everyday-carry"],
    tags: ["tech", "organizer", "cables", "commute"],
    rating: 4.9,
    reviewCount: 78,
    isBestseller: true,
    isFeatured: true,
    primaryImage: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80",
    hoverImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85",
    ],
    variants: [
      { id: "v_19", sku: "VTP-GRY", title: "Slate Charcoal", colorName: "Slate Charcoal", colorHex: "#334155", price: 65.0, compareAtPrice: 75.0, inventory: 70, isDefault: true, images: [] },
      { id: "v_20", sku: "VTP-OCH", title: "Desert Ochre", colorName: "Desert Ochre", colorHex: "#FF6857", price: 65.0, compareAtPrice: 75.0, inventory: 45, isDefault: false, images: [] },
      { id: "v_21", sku: "VTP-BLK", title: "Pitch Black", colorName: "Pitch Black", colorHex: "#18181B", price: 65.0, compareAtPrice: 75.0, inventory: 60, isDefault: false, images: [] },
    ],
    reviews: [],
  },
  {
    id: "prod_laptop_16",
    slug: "structured-leather-laptop-sleeve-16",
    name: "Structured Leather Laptop Sleeve 16”",
    subtitle: "Magnetic closure padded sleeve with plush microfiber scratch defense",
    description: "Slimline envelope sleeve sculpted from natural eco-leather with invisible magnetic closure flap and pass-through in-sleeve charging port.",
    details: "Zero-scratch magnetic clasp. Rear charging cable access notch. Microfiber interior buffing lining.",
    materialsInfo: "Smooth environmental leather with dense shock-absorbent neoprene core.",
    dimensionsInfo: "385 x 265 x 18 mm · Weight: 310g",
    capacityInfo: "Tailored for 16-inch MacBook Pro M1/M2/M3/M4 or similar ultrabooks.",
    careInfo: "Leather care balm recommended once yearly.",
    basePrice: 109.0,
    currency: "USD",
    categorySlug: "tech",
    categoryName: "Tech",
    subcategorySlug: "laptop-sleeves",
    collections: ["work-commute", "leather-studio"],
    tags: ["tech", "laptop-sleeve", "leather", "work"],
    rating: 4.88,
    reviewCount: 34,
    isFeatured: true,
    isNewRelease: true,
    primaryImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80",
    hoverImage: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=85",
    ],
    variants: [
      { id: "v_22", sku: "SLS-16-BLK", title: "Obsidian Black", colorName: "Obsidian Black", colorHex: "#18181B", price: 109.0, inventory: 42, isDefault: true, images: [] },
      { id: "v_23", sku: "SLS-16-COG", title: "Tan Cognac", colorName: "Tan Cognac", colorHex: "#9A3412", price: 109.0, inventory: 34, isDefault: false, images: [] },
    ],
    reviews: [],
  },
  {
    id: "prod_overland_42",
    slug: "overland-weekender-duffel-42l",
    name: "Overland Weekender Duffel 42L",
    subtitle: "Refined travel duffel with separate ventilated shoe garage",
    description: "Engineered for 3 to 5 day journeys, the Overland features an expansive wide-mouth doctor bag opening, dedicated exterior shoe portal, and luggage trolley sleeve pass-through.",
    details: "Ventilated bottom shoe tunnel. Trolley sleeve anchors to rolling suitcases. Padded shoulder strap with quick-release carabiners.",
    materialsInfo: "Water-resistant 900D coated recycled canvas with leather handle wrap.",
    dimensionsInfo: "530 x 340 x 250 mm · Weight: 1.3kg · Capacity: 42 Liters",
    capacityInfo: "Fits 3-4 days of clothing, pair of boots/sneakers in isolated compartment, toiletry dopp, and tech gear.",
    careInfo: "Spot clean with damp sponge.",
    basePrice: 229.0,
    currency: "USD",
    categorySlug: "bags-luggage",
    categoryName: "Bags & Luggage",
    subcategorySlug: "weekenders",
    collections: ["travel-transit", "coastal-all-weather"],
    tags: ["duffel", "travel", "weekender"],
    rating: 4.92,
    reviewCount: 65,
    isBestseller: true,
    isFeatured: true,
    primaryImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
    hoverImage: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=1200&q=85",
    ],
    variants: [
      { id: "v_24", sku: "OWD-42-OLV", title: "Olive Drab", colorName: "Olive Drab", colorHex: "#3C4836", price: 229.0, inventory: 35, isDefault: true, images: [] },
      { id: "v_25", sku: "OWD-42-NVY", title: "Midnight Navy", colorName: "Midnight Navy", colorHex: "#1E293B", price: 229.0, inventory: 28, isDefault: false, images: [] },
      { id: "v_26", sku: "OWD-42-ANT", title: "Anthracite", colorName: "Anthracite", colorHex: "#27272A", price: 229.0, inventory: 40, isDefault: false, images: [] },
    ],
    reviews: [],
  },
  {
    id: "prod_dopp_kit",
    slug: "dopp-standing-toiletry-kit",
    name: "Dopp Standing Toiletry Kit",
    subtitle: "Water-resistant standing wash pouch with wipe-clean internal dividers",
    description: "Engineered to stand upright on narrow hotel wash basins. Includes a magnetic fold-out toothbrush shelf and water-resistant wipeable lining.",
    details: "Self-standing geometry. Elevated magnetic toothbrush dock keeps bristles dry. Spill-proof inner compartments.",
    materialsInfo: "Coated waterproof nylon shell with antibacterial wipe-clean interior lining.",
    dimensionsInfo: "240 x 140 x 110 mm · Weight: 220g · Capacity: 3.5 Liters",
    capacityInfo: "Holds full travel-size shampoo, deodorant, electric toothbrush, razor, and cologne.",
    careInfo: "Rinse inside under faucet; air dry.",
    basePrice: 65.0,
    currency: "USD",
    categorySlug: "travel",
    categoryName: "Travel",
    subcategorySlug: "toiletry-kits",
    collections: ["travel-transit", "coastal-all-weather"],
    tags: ["travel", "toiletry", "dopp", "waterproof"],
    rating: 4.9,
    reviewCount: 88,
    isBestseller: true,
    isFeatured: true,
    primaryImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80",
    hoverImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
    ],
    variants: [
      { id: "v_27", sku: "DTK-GRY", title: "Shadow Slate", colorName: "Shadow Slate", colorHex: "#334155", price: 65.0, inventory: 60, isDefault: true, images: [] },
      { id: "v_28", sku: "DTK-TER", title: "Terracotta Clay", colorName: "Terracotta Clay", colorHex: "#FF6857", price: 65.0, inventory: 40, isDefault: false, images: [] },
    ],
    reviews: [],
  },
  {
    id: "prod_passport_sleeve",
    slug: "passport-transit-sleeve",
    name: "Passport Transit Sleeve",
    subtitle: "Sleek boarding companion with micro travel pen and boarding pass fold",
    description: "Travel without airport stress. Includes a hidden micro ballpoint pen for customs forms, 4 card slots, and an easy-access boarding pass wing.",
    details: "Includes custom micro travel pen. RFID protection. Slim profile slips into any breast pocket.",
    materialsInfo: "Vegetable-tanned leather with gold foil embossed transit icon.",
    dimensionsInfo: "140 x 100 x 9 mm · Weight: 60g",
    capacityInfo: "Standard international passport, folded boarding pass, 4 cards, pen.",
    careInfo: "Keep dry.",
    basePrice: 89.0,
    currency: "USD",
    categorySlug: "travel",
    categoryName: "Travel",
    subcategorySlug: "passport-wallets",
    collections: ["travel-transit", "leather-studio"],
    tags: ["passport", "travel", "leather"],
    rating: 4.87,
    reviewCount: 42,
    isBestseller: true,
    isFeatured: true,
    primaryImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80",
    hoverImage: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=85",
    ],
    variants: [
      { id: "v_29", sku: "PTS-NVY", title: "Midnight Blue", colorName: "Midnight Blue", colorHex: "#1E293B", price: 89.0, inventory: 50, isDefault: true, images: [] },
      { id: "v_30", sku: "PTS-CRM", title: "Caramel Tan", colorName: "Caramel Tan", colorHex: "#A05A2C", price: 89.0, inventory: 45, isDefault: false, images: [] },
    ],
    reviews: [],
  },
  {
    id: "prod_key_folio",
    slug: "orbit-key-folio-organizer",
    name: "Orbit Key Folio Organizer",
    subtitle: "Silent, pocket-protecting leather sheath for 2 to 8 keys with D-ring",
    description: "Stops key jingles and stops phone scratches. Secure locking pin houses standard keys neatly inside a fold of vegetable-tanned leather.",
    details: "Stainless steel hardware locking pin. Accommodates 2-8 keys plus car fob on exterior D-ring.",
    materialsInfo: "Full-grain leather with stainless steel locking hardware pin.",
    dimensionsInfo: "82 x 20 x 20 mm · Weight: 35g",
    capacityInfo: "Houses 2-8 standard keys plus car key fob attached to D-ring.",
    careInfo: "Wipe with damp cloth.",
    basePrice: 42.0,
    currency: "USD",
    categorySlug: "accessories",
    categoryName: "Accessories",
    subcategorySlug: "key-covers",
    collections: ["everyday-carry", "leather-studio"],
    tags: ["accessories", "keys", "leather"],
    rating: 4.8,
    reviewCount: 95,
    isBestseller: true,
    isFeatured: false,
    primaryImage: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80",
    hoverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=85",
    ],
    variants: [
      { id: "v_31", sku: "OKF-COG", title: "Cognac Tan", colorName: "Cognac Tan", colorHex: "#B45309", price: 42.0, inventory: 90, isDefault: true, images: [] },
      { id: "v_32", sku: "OKF-BLK", title: "Matte Black", colorName: "Matte Black", colorHex: "#18181B", price: 42.0, inventory: 80, isDefault: false, images: [] },
    ],
    reviews: [],
  },
  {
    id: "prod_bundle_commuter",
    slug: "daily-commuter-value-set",
    name: "The Daily Commuter Value Set",
    subtitle: "Apex Transit Backpack + Tech Portfolio Kit + Slim Bifold",
    description: "The complete daily transit trifecta. Save over 15% with this curated bundle combining our award-winning Apex Backpack, Venture Tech Kit, and Slim Bifold Wallet.",
    details: "Includes 1x Apex Transit Backpack 24L, 1x Venture Tech Kit, and 1x Apex Slim Bifold Wallet in matching tones.",
    materialsInfo: "Coordinated recycled ballistic fabrics and certified vegetable-tanned leather.",
    dimensionsInfo: "Complete travel bundle package.",
    capacityInfo: "Full commute workflow gear.",
    careInfo: "See individual product instructions.",
    basePrice: 299.0,
    compareAtPrice: 343.0,
    currency: "USD",
    categorySlug: "featured",
    categoryName: "Featured",
    subcategorySlug: "popular",
    collections: ["work-commute", "everyday-carry"],
    tags: ["bundle", "value-set", "gift", "commute"],
    rating: 5.0,
    reviewCount: 41,
    isBestseller: true,
    isBundle: true,
    isFeatured: true,
    primaryImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
    hoverImage: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=85",
    ],
    variants: [
      { id: "v_33", sku: "SET-COMMUTER-BLK", title: "Complete Set (Charcoal / Ink)", colorName: "Charcoal Ink", colorHex: "#27272A", price: 299.0, compareAtPrice: 343.0, inventory: 25, isDefault: true, images: [] },
      { id: "v_34", sku: "SET-COMMUTER-TAN", title: "Complete Set (Saddle Tan)", colorName: "Saddle Tan", colorHex: "#A05A2C", price: 299.0, compareAtPrice: 343.0, inventory: 18, isDefault: false, images: [] },
    ],
    reviews: [],
  },
];

// Helper queries
export function getAllProducts(): ProductItem[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): ProductItem | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string, subcategorySlug?: string): ProductItem[] {
  return PRODUCTS.filter((p) => {
    if (categorySlug === "featured") return true;
    if (p.categorySlug !== categorySlug) return false;
    if (subcategorySlug && p.subcategorySlug !== subcategorySlug) return false;
    return true;
  });
}

export function getProductsByCollection(collectionSlug: string): ProductItem[] {
  const col = COLLECTIONS.find((c) => c.slug === collectionSlug);
  if (!col) return [];
  return PRODUCTS.filter((p) => col.productSlugs.includes(p.slug) || p.collections.includes(collectionSlug));
}

export function searchProducts(query: string): ProductItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.categoryName.toLowerCase().includes(q)
  );
}
