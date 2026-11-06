import { NextResponse } from "next/server";
import { getStoredProducts } from "@/lib/store/productStore";

export const dynamic = "force-dynamic";

export interface SocialProductItem {
  id: string;
  name: string;
  name_bn: string;
  price: number;
  discount_price: number | null;
  image_url: string;
  in_stock: boolean;
  hashtag: string;
}

function generateHashtag(name: string): string {
  if (!name) return "";
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const pascal = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return pascal ? `#${pascal}` : "";
}

function formatImageUrl(image?: string): string {
  if (!image) return "";
  const trimmed = image.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return `https://curecarebd.com${trimmed}`;
  }
  return `https://curecarebd.com/${trimmed}`;
}

export async function GET() {
  try {
    const products = getStoredProducts();

    const socialProducts: SocialProductItem[] = products.map((product) => {
      const rawProduct = product as unknown as Record<string, unknown>;

      const id = String(product.id || product.slug || "");
      const name = String(product.name || "");
      const name_bn =
        typeof rawProduct.name_bn === "string"
          ? rawProduct.name_bn
          : typeof rawProduct.nameBn === "string"
            ? rawProduct.nameBn
            : "";

      const price =
        typeof product.basePrice === "number"
          ? product.basePrice
          : typeof rawProduct.price === "number"
            ? (rawProduct.price as number)
            : 0;

      const discount_price =
        typeof product.compareAtPrice === "number"
          ? product.compareAtPrice
          : typeof rawProduct.discountPrice === "number"
            ? (rawProduct.discountPrice as number)
            : null;

      const rawImage =
        product.primaryImage ||
        (Array.isArray(product.images) && product.images[0]) ||
        "";
      const image_url = formatImageUrl(rawImage);

      const isActive = product.isActive !== false;
      const isSoldOut = Boolean(product.isSoldOut);
      const variants = Array.isArray(product.variants) ? product.variants : [];
      const totalInventory = variants.reduce(
        (sum, v) => sum + (typeof v.inventory === "number" ? v.inventory : 0),
        0
      );
      const hasVariantStock = variants.length > 0 ? totalInventory > 0 : true;
      const in_stock = isActive && !isSoldOut && hasVariantStock;

      const hashtag = generateHashtag(name);

      return {
        id,
        name,
        name_bn,
        price,
        discount_price,
        image_url,
        in_stock,
        hashtag,
      };
    });

    return NextResponse.json(socialProducts, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("GET /api/social/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
