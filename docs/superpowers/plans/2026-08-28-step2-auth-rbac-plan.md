# STEP 2 Authentication Role RBAC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Supabase SSR authentication, ADMIN/USER role enforcement, protected route groups, audit logging, and admin user management across UI, server, and database layers.

**Architecture:** Use `@supabase/ssr` cookie-backed clients in browser/server/middleware contexts. Store application roles in `core.app_user`, expose only server-validated role helpers, and enforce data access through PostgreSQL RLS with `core.is_admin()`. Keep service-role access in a server-only module and never import it from client components.

**Tech Stack:** Next.js App Router, React Server Components, Supabase Auth, `@supabase/ssr`, PostgreSQL SQL migrations, TypeScript, Node-based static security checks.

**Spec:** STEP 2 authentication/role/RBAC request in the user message; design baseline in `Design.md`.

## Global Constraints

- ADMIN and USER permissions must be enforced in frontend, server, and DB layers.
- `anon` must not write core data; broad `using(true)` policies must not remain.
- Service-role keys must never be exposed to browser code.
- Admin mutations must call `requireAdmin()` and write `core.audit_log`.
- Existing calculation SQL/data logic must not be changed.
- Calculation-unavailable values must not be converted to zero.

### Task 1: Security acceptance checks

**Files:**
- Create: `scripts/step2-check.mjs`
- Modify: `package.json`

- [ ] Write checks for required files, SQL objects, protected routes, server-only service-role module, and absence of service-role imports in client components.
- [ ] Run `npm test` and confirm the new checks fail because the implementation is absent.

### Task 2: Supabase dependencies and clients

**Files:**
- Modify: `package.json`, `package-lock.json`
- Create: `lib/supabase/browser.ts`, `lib/supabase/server.ts`, `lib/supabase/service-role.ts`

- [ ] Install `@supabase/ssr` and `@supabase/supabase-js`.
- [ ] Implement cookie session server client and browser client.
- [ ] Guard the service-role client with `server-only` and environment validation.

### Task 3: Database migration and RLS

**Files:**
- Create: `supabase/migrations/202608280001_auth_rbac.sql`

- [ ] Create `core.app_user`, `core.audit_log`, role trigger, `core.is_admin()`, restrictive policies, and audit trigger function.
- [ ] Ensure self-role escalation and self-deactivation are rejected in DB functions/policies.

### Task 4: Auth helpers and middleware

**Files:**
- Create: `lib/auth.ts`, `middleware.ts`
- Modify: `next.config.ts` only if required by server-only imports

- [ ] Implement `getRole()`, `requireUser()`, and `requireAdmin()` with server-side session lookup.
- [ ] Redirect unauthenticated protected requests to `/login?next=...`.
- [ ] Return 403 for USER requests to `/admin/*`.

### Task 5: Login/logout flow

**Files:**
- Create: `app/(auth)/login/login-form.tsx`, `app/(auth)/login/actions.ts`, `app/(auth)/logout/route.ts`
- Modify: `app/(auth)/login/page.tsx`

- [ ] Add email/password sign-in, failure message, logout, and validated `next` return.

### Task 6: Admin user management

**Files:**
- Create: `app/(admin)/users/page.tsx`, `app/(admin)/users/actions.ts`
- Modify: `lib/menu.ts`, `app/(admin)/layout.tsx`

- [ ] Load users server-side after `requireAdmin()`.
- [ ] Add role and active-state mutations with self-protection and audit logging.
- [ ] Keep menu filtering as UX only; server actions remain authoritative.

### Task 7: Verification

- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Inspect routes and static checks for protected paths, RLS, audit logging, and secret isolation.
- [ ] Report manual Supabase migration and environment setup requirements.
