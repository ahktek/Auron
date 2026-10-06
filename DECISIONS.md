# Architectural & Technical Decisions (DECISIONS.md)

This log documents key technical choices, trade-offs, and design decisions made throughout the engineering of **AUREN Carry Goods**.

---

## 1. Brand Identity & Creative Direction
- **Brand Name**: **AUREN** (Auren Carry Goods Co.)
- **Aesthetic**: Minimalist architectural carry goods inspired by Scandinavian and Pacific Northwest design traditions.
- **Color Palette**:
  - Primary Accent: Terracotta Clay (`#C25E34`)
  - Accent Dark: Deep Rust (`#A84E29`)
  - Neutrals: Warm Canvas (`#FAF9F5`), Clean Surface (`#FFFFFF`), Charcoal Ink (`#18181B`), Muted Slate (`#71717A`)
- **Typography**: Clean, high-legibility geometric sans-serif for UI and pricing; refined serif for editorial storytelling headings.
- **Logo Mark**: Vector SVG geometric folded leather silhouette forming an architectural 'A' and soaring falcon wing apex.

---

## 2. Framework & Runtime
- **Next.js 15 (App Router)** with React 19.
- **TypeScript 5 (Strict Mode)**: Strict null checks, explicit return types where beneficial, zero `any` policy.
- **Tailwind CSS v4**: Utilizes CSS theme variables and `@import "tailwindcss"` for lightning-fast compilation, zero runtime CSS overhead, and native container query support.

---

## 3. Database & ORM
- **PostgreSQL 16**: Chosen for relational integrity, JSONB support for dynamic block builders and addresses, and native full-text search indexing (`tsvector` & `pg_trgm`).
- **Prisma ORM (v6.4)**:
  - Standardized on stable Prisma 6.4 (rather than the experimental 8.0 RC) to guarantee migration reliability, type generation stability, and battle-tested production readiness.
  - Comprehensive schema covering:
    - Customer & Admin Users, RBAC permissions, Addresses
    - Products, Product Variants, Images, Collections, Hierarchical Categories
    - Value Bundles & Composite Sets
    - Cart, Order, Order Items, Inventory Reservations
    - Block-based CMS Pages with version history
    - Journal posts, Stockists, Reviews with moderation, Discounts
    - Audit logging, Redirects, and Store settings.

---

## 4. Authentication & RBAC
- **Argon2id Hashing**: Uses `@node-rs/argon2` with OWASP-recommended parameters (19 MiB memory cost, 2 iterations, 1 parallelism).
- **Dual Session Model**:
  - Customer Session: 30-day HttpOnly, SameSite=Lax cookie (`auren_customer_session`) signed via JOSE HS256.
  - Admin Session: 8-hour HttpOnly, SameSite=Strict cookie (`auren_admin_session`) signed with an independent key (`ADMIN_JWT_SECRET`) and validated against role permissions.
- **Role-Based Access Control (RBAC)**:
  - `OWNER`: Unrestricted access across store settings, user management, order refunds, and catalog.
  - `EDITOR`: Full control over products, collections, media library, and CMS page builder.
  - `SUPPORT`: Access to customer orders, fulfillment workflows, and review moderation without write access to settings or catalog.
  - `CUSTOMER`: Standard customer account area (orders, wishlist, addresses).

---

## 5. Caching & Rate Limiting
- **Redis 7**: Used for sliding-window rate limiting on sensitive routes (auth, checkout, search) and cached catalog responses.
- **Resilient Fallback**: Designed an in-memory fallback layer in `src/lib/redis.ts` so unit tests and containerless local environments function seamlessly without throwing connection exceptions when Redis is offline.

---

## 6. Containerization & Production Deployment
- **Docker Compose**: Orchestrates 6 production services:
  - `app`: Multi-stage production build running as unprivileged `nextjs:nodejs` user.
  - `postgres`: PostgreSQL 16 Alpine with healthcheck and persistent volume.
  - `redis`: Redis 7 Alpine with append-only persistence.
  - `minio`: S3-compatible object storage with API port 9000 and console port 9001.
  - `mailpit`: High-efficiency SMTP testing server with web dashboard on port 8025.
  - `caddy`: Automatic HTTPS reverse proxy with zstd/gzip compression and header security.

---

## 7. Multi-Currency & Pricing Authority
- Server-side price calculation with USD base authority. Supported currencies: USD, EUR, GBP, AUD, BDT.
- `formatPrice` helper handles integer round numbers cleanly (e.g., `$199`) while preserving cents when present (e.g., `$199.50`).

---

## 8. Storefront Experience & UX Patterns
- **Mega-Menu Navigation**: 7 top-level navigation categories with custom curations, quick sub-links, and promotional highlight banners.
- **Product Experience**:
  - PDP features multi-angle image gallery with zoom, variant selector synced to URL search parameters (`?color=`), capacity indicator, accordion specifications, verified reviews, and recommended pairings.
  - Category Listing pages provide real-time faceted filtering by price slider, color swatches, materials, and in-stock toggles with URL preservation.
- **Cart & Simulated Checkout**:
  - Global reactive cart slide-out with free shipping threshold progress bar ($75 indicator), quantity stepper, and coupon code entry.
  - Multi-step checkout simulator calculating dynamic shipping, state tax, and order confirmation receipt generation.
- **Editorial & Utility Ecosystem**:
  - Stockist interactive locator with OpenStreetMap integration.
  - Editorial Journal with category filters and dynamic `/journal/feed.xml` RSS feed.
  - Complete customer care and legal suite (Shipping, Warranty, Care Guides, Repairs, Contact Concierge with honeypot spam protection, Privacy, Terms, Accessibility).

---

## 9. Built-in CMS & Administration Suite
- **12 Dedicated Admin Modules**:
  1. `/admin` Dashboard: Key business KPIs, revenue charts, live orders, top-performing SKUs.
  2. `/admin/products`: Full catalog table, stock indicators, SKU management.
  3. `/admin/categories`: Hierarchical category and collection ordering.
  4. `/admin/page-builder`: Dynamic drag/reorder block CMS.
  5. `/admin/mega-menu`: Header menu configuration and live dropdown simulator.
  6. `/admin/orders`: Order lifecycle fulfillment, tracking updates, and refunds.
  7. `/admin/reviews`: Customer review moderation with approval/rejection workflows.
  8. `/admin/discounts`: Coupon code creation with percentage or fixed deductions.
  9. `/admin/journal`: Story and editorial content publishing with auto-RSS sync.
  10. `/admin/media`: S3/MinIO media manager with upload and CDN link copy.
  11. `/admin/settings`: Global shipping thresholds, tax rates, and brand identity.
  12. `/admin/audit-log`: Security audit trail of all staff and system operations.
- **Quality Assurance**: 100% passing Vitest test suite (`tests/phase1.test.ts`, `tests/commerce.test.ts`), zero TypeScript errors (`npx tsc --noEmit`), and verified HTTP 200 responses across all routes.

