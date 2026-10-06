# AUREN Carry Goods Co. 🎒

A production-ready, self-hostable e-commerce storefront and built-in CMS modeled after the layout, UX, and functionality of a premium carry-goods brand site (wallets, backpacks, travel gear, tech folios).

Built with **Next.js 15 (App Router)**, **TypeScript (Strict)**, **Tailwind CSS v4**, **PostgreSQL 16**, **Prisma ORM**, **Auth.js / Jose / Argon2id**, **Redis**, and **Docker Compose**.

---

## Features
- **Brand Identity**: Original minimalist brand (**AUREN**) with vector SVG logo mark, terracotta accent palette (`#C25E34`), and editorial aesthetic.
- **Relational Architecture**: PostgreSQL 16 schema with 20+ models (Users, Products, Variants, SKUs, Hierarchical Categories, Collections, Bundles, Orders, CMS Pages, Stockists, Reviews, Audit Logs).
- **Dual Authentication & RBAC**:
  - Customer Accounts: Jose JWT with HttpOnly SameSite cookies.
  - Admin Access: Separate role-based access control (`OWNER`, `EDITOR`, `SUPPORT`).
  - Passwords hashed with high-security **Argon2id**.
- **Performance & Caching**: Redis sliding-window rate limiting with graceful in-memory fallback.
- **Self-Hostable Infrastructure**: Docker Compose orchestration for PostgreSQL 16, Redis 7, MinIO (S3), Mailpit (SMTP), App, and Caddy with automatic HTTPS.
- **CI / CD Ready**: GitHub Actions workflow for linting, typechecking, Vitest tests, and production build.

---

## Quickstart (Local Development)

### Prerequisites
- Node.js 20+ or 22+
- npm 10+
- Docker & Docker Compose (optional for local standalone, recommended for full stack)

### 1. Clone & Install
```bash
git clone <repo-url>
cd new-ecom
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Generate Database Client & Run Tests
```bash
# Generate Prisma Client
npm run db:generate

# Run Vitest test suite
npm test
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running with Docker Compose

Spin up the entire stack (PostgreSQL, Redis, MinIO S3, Mailpit, Next.js App, and Caddy reverse proxy) with a single command:

```bash
docker compose up -d
```

- **Storefront & Admin**: `http://localhost` (or `http://localhost:3000`)
- **MinIO S3 Console**: `http://localhost:9001` (User: `minioadmin`, Pass: `minioadmin`)
- **Mailpit Email UI**: `http://localhost:8025`

### Database Migration & Seeding
Once PostgreSQL is running:
```bash
# Apply schema
npm run db:push

# Seed with 40+ products, categories, collections, and admin credentials
npm run db:seed
```

---

## Seed Admin Credentials
After running `npm run db:seed`, the default administrator is available at `/admin`:
- **Email**: `admin@aurencarry.com`
- **Password**: `AurenAdmin2026!SecureKey`
- **Role**: `OWNER`

Customer demo account:
- **Email**: `customer@example.com`
- **Password**: `Customer123!Secure`

---

## Deployment to a VPS

### 1. Provision Server
Deploy an Ubuntu 24.04 or Debian 12 VPS with at least 2GB RAM. Install Docker and Docker Compose:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
```

### 2. Configure Domain & Caddy
Update `Caddyfile` with your domain:
```caddy
yourdomain.com {
    encode gzip zstd
    reverse_proxy app:3000
}
```

### 3. Launch Services
```bash
git clone <your-repo> /opt/auren
cd /opt/auren
cp .env.example .env
# Edit .env with production passwords and Stripe credentials
docker compose -f docker-compose.yml up -d --build
```

---

## Database Backup & Restore

### Automated Daily Backup
```bash
# Backup PostgreSQL database to timestamped file
docker compose exec postgres pg_dump -U postgres -Fc auren_ecom > auren_backup_$(date +%Y%m%d).dump
```

### Restore Database
```bash
docker compose exec -T postgres pg_restore -U postgres -d auren_ecom --clean --if-exists < auren_backup_20261006.dump
```

---

## Project Structure & Documentation
- [ARCHITECTURE.md](file:///d:/Dev%20stuff/Rebel%20mama/new-ecom/ARCHITECTURE.md): Architecture overview and full database ERD.
- [DECISIONS.md](file:///d:/Dev%20stuff/Rebel%20mama/new-ecom/DECISIONS.md): Architectural decisions and trade-offs.
- [SECURITY.md](file:///d:/Dev%20stuff/Rebel%20mama/new-ecom/SECURITY.md): OWASP Top 10 mitigation matrix and security headers.
