import { NextRequest, NextResponse } from "next/server";
import {
  getStoredCategories,
  saveStoredCategory,
  saveStoredCategories,
  deleteStoredCategory,
} from "@/lib/store/productStore";
import { CategoryItem } from "@/lib/store/catalog";

export async function GET() {
  try {
    const categories = getStoredCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("GET /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // If an array is passed, save entire ordered list
    if (Array.isArray(body)) {
      const saved = saveStoredCategories(body);
      return NextResponse.json({ success: true, categories: saved });
    }

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const newCategory: CategoryItem = {
      id: body.id || `cat_${Date.now()}`,
      name: body.name,
      slug,
      description: body.description || `Explore ${body.name} products`,
      image: body.image,
      subcategories: body.subcategories || [],
    };

    const saved = saveStoredCategory(newCategory);
    return NextResponse.json({ success: true, category: saved });
  } catch (error) {
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save category" },
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
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    const deleted = deleteStoredCategory(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("DELETE /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
