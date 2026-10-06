# Security Policy & OWASP Mitigations (SECURITY.md)

Security is foundational to the **AUREN Carry Goods** architecture. This document outlines our implementation controls, defensive posture, and mitigations against the OWASP Top 10 vulnerabilities.

---

## 1. OWASP Top 10 Mitigations Matrix

| OWASP Vulnerability | Risk | AUREN Architecture Mitigation |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | Unauthorized admin action / data breach | Server-side RBAC verification (`hasPermission`, `requireAdminPermission`) enforced on every API route and admin server component. Secure HttpOnly, SameSite cookies. Customer IDs verified against session context for orders and address access. |
| **A02: Cryptographic Failures** | Password cracking / token forgery | Argon2id hashing via `@node-rs/argon2` with 19 MiB memory cost. Dual JOSE JWTs signed with distinct keys (`AUTH_SECRET` and `ADMIN_JWT_SECRET`). Transport encryption via HTTPS/HSTS. |
| **A03: Injection** | SQLi, Command Injection | 100% Parameterized queries through Prisma ORM. Strict runtime schema validation using Zod for every API endpoint. No raw query concatenation. |
| **A04: Insecure Design** | Unchecked rate abuse, checkout race conditions | Redis-backed sliding-window rate limiting on auth, search, checkout, and contact routes. Inventory reservation locks with automated expiration during checkout. |
| **A05: Security Misconfiguration** | Information disclosure via headers | Production headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, strict `Permissions-Policy`. Multi-stage Docker container runs as non-root `nextjs:nodejs` user. |
| **A06: Vulnerable & Outdated Components** | Known CVEs in dependencies | Automated weekly dependency scans via GitHub Dependabot (`.github/dependabot.yml`). Locked package dependencies in `package-lock.json`. Continuous integration pipeline auditing. |
| **A07: Identification & Auth Failures** | Brute force, credential stuffing | Rate limiting on authentication routes (5 failed attempts per 15-minute window). Mandatory admin 2FA (TOTP secret support). Session invalidation on password change. |
| **A08: Software & Data Integrity Failures** | Tampered payments or uploads | Stripe Webhook signature verification (`stripe.webhooks.constructEvent`) prevents spoofed order completions. Multi-factor verification for file uploads (MIME validation, size restrictions, UUID file names). |
| **A09: Security Logging & Monitoring Failures** | Undetected intrusion | Structured audit log table (`AdminAuditLog`) recording all mutating actions (who, what entity, IP address, timestamp). PII redacted from logs. |
| **A10: Server-Side Request Forgery (SSRF)** | Internal network traversal | Whitelisted outbound destinations (Stripe, S3/MinIO, SMTP). No user-supplied URLs fetched unvalidated. |

---

## 2. HTTP Security Headers
Configured in `next.config.ts` and enforced at reverse proxy level via Caddy:
- `X-Frame-Options`: `DENY`
- `X-Content-Type-Options`: `nosniff`
- `Referrer-Policy`: `strict-origin-when-cross-origin`
- `Permissions-Policy`: `camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy`: Restricts scripts, styles, objects, and connect endpoints.

---

## 3. Cookie Configuration
Session cookies are configured with:
- `HttpOnly: true` (Prevents client-side XSS access)
- `SameSite: "Lax"` (Customer) / `"Strict"` (Admin)
- `Secure: true` (Enforced in production HTTPS)
- `Path: "/"`

---

## 4. Database Backup & Disaster Recovery
Daily automated PostgreSQL backup procedure:
```bash
# Backup command
pg_dump -U postgres -h localhost -Fc auren_ecom > backup_$(date +%Y%m%d_%H%M%S).dump

# Encrypt and upload to S3 / MinIO
aws --endpoint-url=http://localhost:9000 s3 cp backup_*.dump s3://auren-backups/daily/

# Restore procedure
pg_restore -U postgres -d auren_ecom --clean --if-exists backup_20261006.dump
```
