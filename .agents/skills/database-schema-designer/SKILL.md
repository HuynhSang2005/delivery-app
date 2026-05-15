---
name: database-schema-designer
description: Database schema design guardrails for delivery-app. Use when evaluating PostgreSQL, PostGIS, Prisma, migrations, indexes, constraints, or schema boundaries, especially after foundation work moves into data design.
---

# Database Schema Designer

This repo is not ready for final business-schema design until the foundation is
stable. Use this skill to keep schema work bounded and evidence-based.

## Baseline

- PostgreSQL is the local-first relational store.
- PostGIS is available for geospatial needs.
- Prisma is the application data access layer.
- Redis is cache/queue infrastructure, not source of truth.
- Migrations must be reproducible from the repo.

## Design Rules

- Model business invariants in constraints where practical.
- Use explicit primary keys, foreign keys, unique constraints, and indexes.
- Keep PostGIS usage focused on delivery/location queries, not generic geometry
  experimentation.
- Avoid premature multi-tenant, sharding, or managed-service assumptions.
- Do not change product/business rules without updating source docs.

## Verification

- `bun run db:migrate`
- `bun run db:seed`
- `bun run db:smoke`
- `bun run db:drill:backup-restore` for backup/restore-sensitive changes.

When exact PostgreSQL/PostGIS syntax matters, use official docs or the relevant
database MCP/docs before editing migrations.
