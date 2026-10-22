import { NextRequest, NextResponse } from "next/server";
import {
  getStoredProducts,
  saveStoredProduct,
  deleteStoredProduct,
} from "@/lib/store/productStore";
import { ProductItem } from "@/lib/store/catalog";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("query");

    let products = getStoredProducts();

    if (category && category !== "ALL") {
      products = products.filter((p) => p.categorySlug === category);
    }

    if (query) {
      const q = query.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Product name is required" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const newProduct: ProductItem = {
      id: body.id || `prod_${Date.now()}`,
      slug,
      name: body.name,
      subtitle: body.subtitle || `Authentic ${body.name}`,
      description: body.description || `${body.name} for wellness & daily care.`,
      details: body.details || "Genuine authentic import.",
      materialsInfo: body.materialsInfo || "Pure active natural ingredients.",
      dimensionsInfo: body.dimensionsInfo || "Standard packaging.",
      capacityInfo: body.capacityInfo || "Net weight specified on pack.",
      careInfo: body.careInfo || "Store in cool dry place.",
      basePrice: Number(body.basePrice) || 500,
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : undefined,
      currency: "BDT",
      categorySlug: body.categorySlug || "soothing-balms",
      categoryName: body.categoryName || "Soothing Balms & Pain Relief",
      subcategorySlug: body.subcategorySlug || "herbal-balms",
      collections: body.collections || [],
      tags: body.tags || ["wellness", "authentic"],
      rating: 5.0,
      reviewCount: 0,
      isBestseller: !!body.isBestseller,
      isNewRelease: !!body.isNewRelease,
      isFeatured: !!body.isFeatured,
      primaryImage:
        body.primaryImage ||
        "https://valobazar.com/storage/products/AuXI3nOuJdjMzECowT7hK9yL0sUJWwMQ34iJBzJk.jpg",
      hoverImage:
        body.hoverImage ||
        body.primaryImage ||
        "https://valobazar.com/storage/products/AuXI3nOuJdjMzECowT7hK9yL0sUJWwMQ34iJBzJk.jpg",
      images: body.images || [body.primaryImage],
      variants: body.variants || [
        {
          id: `v_${Date.now()}`,
          sku: `${slug.substring(0, 8).toUpperCase()}-STD`,
          title: "Standard",
          colorName: "Standard",
          colorHex: "#005A64",
          price: Number(body.basePrice) || 500,
          inventory: Number(body.inventory) || 50,
          isDefault: true,
          images: [],
        },
      ],
      reviews: [],
    };

    const saved = saveStoredProduct(newProduct);
    return NextResponse.json({ success: true, product: saved });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const saved = saveStoredProduct(body);
    return NextResponse.json({ success: true, product: saved });
  } catch (error) {
    console.error("PUT /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const deleted = deleteStoredProduct(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("DELETE /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
