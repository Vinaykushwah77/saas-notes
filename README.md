# SaaS Notes — Multi-tenant

Approach: Shared schema with `tenantId` column on `User` and `Note`. (All tenants stored in same DB; strict row-level isolation enforced in API queries)

Run locally:
1. copy .env (DATABASE_URL, JWT_SECRET, NEXT_PUBLIC_API_BASE)
2. npm install
3. npx prisma migrate dev
4. npm run seed
5. npm run dev

Predefined test accounts (password: password):
- admin@acme.test (ADMIN, tenant: Acme)
- user@acme.test (MEMBER, tenant: Acme)
- admin@globex.test (ADMIN, tenant: Globex)
- user@globex.test (MEMBER, tenant: Globex)

API endpoints:
- GET /api/health -> { status: "ok" }
- POST /api/auth/login -> { token, user }
- GET/POST /api/notes
- GET/PUT/DELETE /api/notes/:id
- POST /api/tenants/:slug/upgrade (ADMIN only)
- POST /api/users/invite (ADMIN only)

Notes limit:
- FREE plan: max 3 notes per tenant
- PRO plan: unlimited
