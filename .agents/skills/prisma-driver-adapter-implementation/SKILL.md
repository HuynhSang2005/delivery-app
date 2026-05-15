---
name: prisma-driver-adapter-implementation
description: Prisma driver adapter guidance for delivery-app. Use only when Prisma adapter configuration, @prisma/adapter-pg, connection wiring, or runtime compatibility is being changed. Verify current Prisma docs before implementation.
---

# Prisma Driver Adapter Implementation

This skill is intentionally narrow. It should not be used for generic schema
design or business data modeling.

## Rules

- Prefer the repo-approved Prisma/PostgreSQL adapter path.
- Do not hand-roll SQL adapter behavior unless official Prisma docs require it.
- Keep connection configuration centralized and environment-driven.
- Do not mix cache/queue Redis concerns into Prisma data access.
- Verify version-sensitive adapter APIs with official Prisma docs before edits.

## Checks

- Prisma client generation remains deterministic.
- API tests cover database-dependent wiring at the right layer.
- Local migrations and smoke checks still work.
- Generated code is not patched manually.

## Verification

- `bun run --cwd apps/api typecheck`
- `bun run --cwd apps/api test:integration`
- `bun run db:migrate`
- `bun run db:smoke`
