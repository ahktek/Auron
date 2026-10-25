import fs from "fs";
import path from "path";
import { PRODUCTS, CATEGORIES, ProductItem, CategoryItem } from "@/lib/store/catalog";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

function ensureDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      // Ignore if directory creation fails in restricted environment
    }
  }
}

function safeReadJSON<T>(filePath: string): T | null {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      // Strip UTF-8 BOM if present
      const clean = raw.replace(/^\uFEFF/, "").trim();
      if (clean) {
        return JSON.parse(clean) as T;
      }
    }
  } catch (err) {
    console.warn(`Failed to parse JSON from ${filePath}:`, err);
  }
  return null;
}

// ==================== PRODUCTS ====================
export function getStoredProducts(): ProductItem[] {
  try {
    ensureDirectory();
    const parsed = safeReadJSON<ProductItem[]>(PRODUCTS_FILE);
    const rawList = Array.isArray(parsed) && parsed.length > 0 ? parsed : PRODUCTS;

    if (!parsed) {
      try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(PRODUCTS, null, 2), "utf-8");
      } catch {}
    }

    // Dynamically synchronize stock status and ensure primaryImage is reflected in images
    return rawList.map((p) => {
      const totalInv = p.variants?.reduce(
        (sum, v) => sum + (typeof v.inventory === "number" ? v.inventory : 0),
        0
      ) ?? 0;
      const isSoldOut =
        p.isSoldOut !== undefined
          ? (p.isSoldOut || (p.variants && p.variants.length > 0 && totalInv <= 0))
          : (p.variants && p.variants.length > 0 ? totalInv <= 0 : false);

      const rawImages = Array.isArray(p.images) ? p.images : [];
      const primary = p.primaryImage || rawImages[0] || "";
      const filtered = rawImages.filter((img) => img && img !== primary);
      const images = primary ? [primary, ...filtered] : rawImages;

      return {
        ...p,
        primaryImage: primary,
        hoverImage: p.hoverImage || primary,
        images,
        isSoldOut,
      };
    });
  } catch (err) {
    console.warn("Failed to read products file, falling back to catalog:", err);
    return PRODUCTS;
  }
}

export function saveStoredProduct(product: ProductItem): ProductItem {
  const current = getStoredProducts();
  const index = current.findIndex((p) => p.id === product.id);

  // Compute stock status & inventory
  const totalInv = product.variants?.reduce(
    (sum, v) => sum + (typeof v.inventory === "number" ? v.inventory : 0),
    0
  ) ?? 0;
  const isSoldOut =
    product.isSoldOut !== undefined
      ? (product.isSoldOut || (product.variants && product.variants.length > 0 && totalInv <= 0))
      : (product.variants && product.variants.length > 0 ? totalInv <= 0 : false);

  // Guarantee primaryImage is leading image
  const rawImages = Array.isArray(product.images) ? product.images : [];
  const primary = product.primaryImage || rawImages[0] || "";
  const filteredImages = rawImages.filter((img) => img && img !== primary);
  const images = primary ? [primary, ...filteredImages] : rawImages;

  const normalizedVariants = (product.variants || []).map((v, i) => ({
    ...v,
    inventory: typeof v.inventory === "number" ? v.inventory : 0,
    inStock: (typeof v.inventory === "number" ? v.inventory : 0) > 0,
    images: primary && (!v.images || v.images.length === 0 || i === 0) ? [primary] : (v.images || []),
  }));

  const normalizedProduct: ProductItem = {
    ...product,
    primaryImage: primary,
    hoverImage: product.hoverImage || primary,
    images,
    variants: normalizedVariants,
    isSoldOut,
  };

  let updated: ProductItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...current[index], ...normalizedProduct };
  } else {
    updated = [normalizedProduct, ...current];
  }

  try {
    ensureDirectory();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write product to file:", err);
  }

  return normalizedProduct;
}

export function getActiveProducts(): ProductItem[] {
  return getStoredProducts().filter((p) => p.isActive !== false);
}

export function toggleProductActive(id: string, activeState?: boolean): ProductItem | null {
  const current = getStoredProducts();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const target = current[index];
  const newActive = typeof activeState === 'boolean' ? activeState : target.isActive === false;
  const updatedItem: ProductItem = { ...target, isActive: newActive };
  current[index] = updatedItem;
  try {
    ensureDirectory();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(current, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write toggled product state:', err);
  }
  return updatedItem;
}

export function deleteStoredProduct(id: string): boolean {
  const current = getStoredProducts();
  const updated = current.filter((p) => p.id !== id);
  try {
    ensureDirectory();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to delete product from file:", err);
    return false;
  }
}

// ==================== CATEGORIES ====================
export function getStoredCategories(): CategoryItem[] {
  try {
    ensureDirectory();
    const parsed = safeReadJSON<CategoryItem[]>(CATEGORIES_FILE);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    try {
      fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(CATEGORIES, null, 2), "utf-8");
    } catch {}
    return CATEGORIES;
  } catch (err) {
    console.warn("Failed to read categories file:", err);
    return CATEGORIES;
  }
}

export function saveStoredCategories(categories: CategoryItem[]): CategoryItem[] {
  try {
    ensureDirectory();
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write categories to file:", err);
  }
  return categories;
}

export function saveStoredCategory(category: CategoryItem): CategoryItem {
  const current = getStoredCategories();
  const index = current.findIndex((c) => c.id === category.id || c.slug === category.slug);

  let updated: CategoryItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...current[index], ...category };
  } else {
    updated = [...current, category];
  }

  saveStoredCategories(updated);
  return category;
}

export function deleteStoredCategory(idOrSlug: string): boolean {
  const current = getStoredCategories();
  const updated = current.filter((c) => c.id !== idOrSlug && c.slug !== idOrSlug);
  saveStoredCategories(updated);
  return true;
}

// ==================== ORDERS ====================
export interface StoredOrder {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  district: string;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
  trackingNumber?: string;
  courier?: string;
  date: string;
  itemsCount: number;
  itemsSummary: string;
}

export function getStoredOrders(): StoredOrder[] {
  try {
    ensureDirectory();
    const parsed = safeReadJSON<StoredOrder[]>(ORDERS_FILE);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.warn("Failed to read orders file:", err);
  }
  return [];
}

export function updateStoredOrder(id: string, updates: Partial<StoredOrder>): StoredOrder | null {
  const current = getStoredOrders();
  const index = current.findIndex((o) => o.id === id);
  if (index === -1) return null;

  const updatedOrder = { ...current[index], ...updates };
  current[index] = updatedOrder;

  try {
    ensureDirectory();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(current, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to update order:", err);
  }

  return updatedOrder;
}

export function createStoredOrder(order: StoredOrder): StoredOrder {
  const current = getStoredOrders();
  const updated = [order, ...current];
  try {
    ensureDirectory();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save new order:", err);
  }
  return order;
}

export function deleteStoredOrder(id: string): boolean {
  const current = getStoredOrders();
  const updated = current.filter((o) => o.id !== id);
  try {
    ensureDirectory();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to delete order:", err);
    return false;
  }
}

// ==================== SETTINGS ====================
export interface StoredSettings {
  storeName: string;
  legalName: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  insideDhakaShipping: number;
  outsideDhakaShipping: number;
  supportEmail: string;
  supportPhone: string;
  announcement: string;
}

export function getStoredSettings(): StoredSettings {
  const defaults: StoredSettings = {
    storeName: "Cure-Care",
    legalName: "Cure-Care Health & Essentials Ltd.",
    currency: "BDT",
    currencySymbol: "৳",
    freeShippingThreshold: 1500,
    insideDhakaShipping: 70,
    outsideDhakaShipping: 130,
    supportEmail: "support@curecarebd.com",
    supportPhone: "+880 1700-000000",
    announcement: "100% Authentic Thai Balms, Pure Scalp Oils & Cold-Pressed Remedies | Nationwide Express Delivery",
  };

  try {
    ensureDirectory();
    const parsed = safeReadJSON<Partial<StoredSettings>>(SETTINGS_FILE);
    if (parsed) {
      return { ...defaults, ...parsed };
    }
  } catch (err) {
    console.warn("Failed to read settings file:", err);
  }
  return defaults;
}

export function saveStoredSettings(newSettings: Partial<StoredSettings>): StoredSettings {
  const current = getStoredSettings();
  const updated = { ...current, ...newSettings };

  try {
    ensureDirectory();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save settings:", err);
  }
  return updated;
}
