# STEP 3 Data Model and Train/Test Boundaries Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the raw/core/analytics model and create database-owned forecast train/test boundaries that prevent data leakage.

**Architecture:** Additive PostgreSQL migration only. Raw ingestion tables carry common provenance fields, operational policy and forecast windows live in `core`, and consumers read `core.v_train_demand` or `core.v_test_actual` instead of `raw.usage_history`. Analytics coverage is exposed through a read-only view for future admin settings UI.

**Tech Stack:** Supabase PostgreSQL, Next.js App Router, TypeScript, server-side Supabase client, Node static acceptance checks.

**Spec:** STEP 3 data-model/learning-validation isolation request in the user message; `Design.md` for UI conventions.

## Global Constraints

- Do not drop or recreate existing tables or calculation logic.
- Train/test dates must live in `core.forecast_setting`, never in TypeScript or SQL consumer code.
- Forecast and demand-profile consumers must use `core.v_train_demand`; backtest scoring must use `core.v_test_actual`.
- Never turn null or calculation-unavailable values into zero.
- `anon` access remains blocked; policy changes are ADMIN-only.

### Task 1: Write failing acceptance checks

**Files:** `scripts/step3-check.mjs`, `package.json`

- [ ] Check required raw/core/analytics objects, provenance columns, boundary views, RLS, and absence of direct `raw.usage_history` reads in forecast consumers.
- [ ] Run `npm test` and observe failure before implementation.

### Task 2: Add additive data-model migration

**Files:** `supabase/migrations/202608280002_data_model_boundaries.sql`

- [ ] Create raw tables and usage-history compatibility table only when absent.
- [ ] Add nullable/default provenance columns with `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.
- [ ] Create policy, outlier, item policy, and forecast setting tables.
- [ ] Add train/test views and analytics coverage/settings views.
- [ ] Add authenticated select and ADMIN-only mutation policies.

### Task 3: Add view-only data access and admin settings page

**Files:** `lib/forecast-data.ts`, `app/(admin)/forecast-settings/page.tsx`, `lib/menu.ts`

- [ ] Make forecast consumers call view-backed helpers.
- [ ] Make the admin page read only `analytics.v_forecast_settings` after `requireAdmin()`.
- [ ] Add `/admin/forecast-settings` to ADMIN menu.

### Task 4: Verify

- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Report that SQL execution against the actual Supabase project remains a manual operation if no project credentials are configured.
