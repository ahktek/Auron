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
