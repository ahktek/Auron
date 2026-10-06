# System Architecture & Entity Relationship Diagram (ARCHITECTURE.md)

This document provides a high-level overview of the **AUREN Carry Goods** architecture, service orchestration, and relational database schema.

---

## 1. High-Level System Architecture

```mermaid
graph TD
    Client[Web Browser / Mobile Client] -->|HTTPS :443| Caddy[Caddy Reverse Proxy]
    Caddy -->|HTTP :3000| NextApp[Next.js 15 App Router]
    
    subgraph NextJS_Core [Next.js Core Architecture]
        RSC[React Server Components / SSR / ISR]
        APIRoutes[Route Handlers / Admin & Storefront API]
        AuthEngine[Jose + Argon2id Auth Engine]
    end

    NextApp --> RSC
    NextApp --> APIRoutes
    NextApp --> AuthEngine

    NextApp -->|Prisma ORM :5432| Postgres[(PostgreSQL 16 Database)]
    NextApp -->|ioredis :6379| Redis[(Redis 7 Cache & Rate Limiter)]
    NextApp -->|S3 SDK :9000| MinIO[(MinIO Object Storage)]
    NextApp -->|SMTP :1025| Mailpit[Mailpit / SMTP Relay]
    NextApp -->|Stripe SDK| StripeAPI[Stripe Payments API]
```

---

## 2. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o{ Address : "has"
    User ||--o{ Order : "places"
    User ||--o{ Review : "writes"
    User ||--o{ WishlistItem : "saves"
    User ||--o{ AdminAuditLog : "generates"

    Category ||--o{ Category : "parent/child"
    Category ||--o{ Product : "classifies"

    Collection ||--o{ ProductCollection : "curates"
    Product ||--o{ ProductCollection : "belongs to"

    Product ||--o{ ProductVariant : "has variants"
    Product ||--o{ ProductImage : "displays"
    Product ||--o{ Review : "receives"
    Product ||--o{ WishlistItem : "saved in"
    Product ||--o{ ComingSoonLead : "notifies"

    Product ||--o{ BundleItem : "is parent of"
    Product ||--o{ BundleItem : "is child of"

    ProductVariant ||--o{ ProductImage : "assigned to"
    ProductVariant ||--o{ CartItem : "in cart"
    ProductVariant ||--o{ OrderItem : "ordered"
    ProductVariant ||--o{ InventoryReservation : "reserved"

    Cart ||--o{ CartItem : "contains"
    Order ||--o{ OrderItem : "contains"
    DiscountCode ||--o{ Order : "applied to"

    CmsPage ||--o{ CmsPageVersion : "versioned as"

    User {
        string id PK
        string email UK
        string name
        string passwordHash
        Role role
        boolean isEmailVerified
        boolean twoFactorEnabled
        datetime createdAt
    }

    Category {
        string id PK
        string name
        string slug UK
        string parentId FK
        int sortOrder
        boolean isFeatured
    }

    Collection {
        string id PK
        string name
        string slug UK
        string title
        boolean isFeatured
        int sortOrder
    }

    Product {
        string id PK
        string name
        string slug UK
        decimal basePrice
        decimal compareAtPrice
        string categoryId FK
        boolean isPublished
        boolean isBestseller
        boolean isNewRelease
        boolean isBundle
        decimal rating
        int reviewCount
    }

    ProductVariant {
        string id PK
        string productId FK
        string sku UK
        string title
        string colorName
        string colorHex
        decimal price
        int inventory
        boolean isDefault
    }

    Cart {
        string id PK
        string userId FK
        string guestSessionId UK
        string currency
    }

    Order {
        string id PK
        string orderNumber UK
        string userId FK
        OrderStatus status
        PaymentStatus paymentStatus
        decimal total
        string stripeSessionId
        json shippingAddress
    }

    Review {
        string id PK
        string productId FK
        string userId FK
        int rating
        string title
        ReviewStatus status
    }

    CmsPage {
        string id PK
        string slug UK
        string title
        boolean isPublished
        json sections
        int version
    }
```

---

## 3. Directory Structure

```
new-ecom/
├── .github/
│   ├── workflows/ci.yml       # Automated GitHub Actions CI
│   └── dependabot.yml         # Automated dependency audits
├── prisma/
│   ├── schema.prisma          # PostgreSQL relational schema
│   └── seed.ts                # 40+ products, categories, collections seed
├── src/
│   ├── app/
│   │   ├── globals.css        # CSS variables, design tokens, typography
│   │   ├── layout.tsx         # Root layout with brand typography & providers
│   │   └── page.tsx           # Storefront root page
│   ├── components/
│   │   ├── brand/
│   │   │   └── Logo.tsx       # Vector SVG brand logo & wordmark
│   │   └── ui/
│   │       ├── Button.tsx     # Reusable button with variants
│   │       ├── Badge.tsx      # Status & promotional pills
│   │       ├── Input.tsx      # Form inputs with accessible labels
│   │       ├── Container.tsx  # Responsive layout wrapper
│   │       ├── Modal.tsx      # Accessible modal dialogue
│   │       └── Drawer.tsx     # Slide-out drawer for cart & mobile nav
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── password.ts    # Argon2id password hashing
│   │   │   ├── jwt.ts         # Jose JWT session tokens
│   │   │   ├── rbac.ts        # Role hierarchy & permissions
│   │   │   └── session.ts     # Cookie-based session extraction
│   │   ├── constants/
│   │   │   └── brand.ts       # Brand identity, currencies, contact
│   │   ├── prisma.ts          # Singleton Prisma client
│   │   ├── redis.ts           # Redis client & rate limiter with fallback
│   │   └── utils.ts           # Formatting & class merging helpers
├── tests/
│   └── phase1.test.ts         # Phase 1 unit & security tests
├── Caddyfile                  # Automatic HTTPS reverse proxy config
├── docker-compose.yml         # Postgres, Redis, MinIO, Mailpit, App, Caddy
├── Dockerfile                 # Multi-stage production container
├── .env.example               # Complete environment variable blueprint
├── DECISIONS.md               # Technical decisions and rationale
├── ARCHITECTURE.md            # Architecture & ERD documentation
└── SECURITY.md                # Security model and mitigations
```
