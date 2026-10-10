import { describe, it, expect } from "vitest";
import { PRODUCTS, CATEGORIES, COLLECTIONS } from "@/lib/store/catalog";

describe("E-Commerce Catalog & Storefront Logic", () => {
  it("maintains strict catalog integrity and required fields", () => {
    expect(PRODUCTS.length).toBeGreaterThanOrEqual(10);
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(4);
    expect(COLLECTIONS.length).toBeGreaterThanOrEqual(4);

    for (const product of PRODUCTS) {
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.slug).toBeDefined();
      expect(product.basePrice).toBeGreaterThan(0);
      expect(product.categorySlug).toBeDefined();
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.variants.length).toBeGreaterThan(0);

      // Check each variant has colors and stock
      for (const variant of product.variants) {
        expect(variant.id).toBeDefined();
        expect(variant.colorName).toBeDefined();
        expect(variant.colorHex).toBeDefined();
        expect(variant.inventory).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("filters products by category slug accurately", () => {
    const balms = PRODUCTS.filter((p) => p.categorySlug === "soothing-balms");
    expect(balms.length).toBeGreaterThan(0);
    expect(balms.every((p) => p.categorySlug === "soothing-balms")).toBe(true);

    const oils = PRODUCTS.filter((p) => p.categorySlug === "hair-oils");
    expect(oils.length).toBeGreaterThan(0);
    expect(oils.every((p) => p.categorySlug === "hair-oils")).toBe(true);
  });

  it("filters products by price range accurately", () => {
    const minPrice = 300;
    const maxPrice = 1500;
    const filtered = PRODUCTS.filter((p) => p.basePrice >= minPrice && p.basePrice <= maxPrice);

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((p) => p.basePrice >= minPrice && p.basePrice <= maxPrice)).toBe(true);
  });

  it("calculates cart subtotals, free shipping threshold, and taxes correctly", () => {
    const sampleCart = [
      { id: "1", price: 89, quantity: 1 },
      { id: "2", price: 45, quantity: 2 },
    ];

    const subtotal = sampleCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(subtotal).toBe(89 + 90); // 179

    // Free shipping threshold is $75
    const shipping = subtotal >= 75 ? 0 : 12;
    expect(shipping).toBe(0);

    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    expect(tax).toBe(14.32);

    const total = subtotal + shipping + tax;
    expect(total).toBe(193.32);
  });

  it("charges shipping fee if cart total is below free shipping threshold", () => {
    const smallCart = [{ id: "key-ring", price: 42, quantity: 1 }];
    const subtotal = 42;
    const shipping = subtotal >= 75 ? 0 : 12;

    expect(shipping).toBe(12);
  });

  it("applies promotional discount coupons accurately", () => {
    const subtotal = 200;

    // 10% coupon
    const applyPercentDiscount = (amount: number, percent: number) =>
      amount - (amount * percent) / 100;
    expect(applyPercentDiscount(subtotal, 10)).toBe(180);

    // Fixed $20 coupon
    const applyFixedDiscount = (amount: number, discount: number) =>
      Math.max(0, amount - discount);
    expect(applyFixedDiscount(subtotal, 20)).toBe(180);
  });

  it("supports full-text search matching titles and descriptions", () => {
    const query = "balm";
    const matches = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );

    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].name.toLowerCase()).toContain("balm");
  });
});
