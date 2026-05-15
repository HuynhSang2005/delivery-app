---
name: docker-compose-local-infra
description: Docker Compose local infrastructure guidance for delivery-app. Use for infra/ Compose services, profiles, PostgreSQL, Redis, debug tools, healthchecks, volumes, ports, and local-first runtime scripts.
---

# Docker Compose Local Infra

Use this skill when touching `infra/`, `docker-compose.yml`, or root `db:*`
scripts.

## Baseline

- Local-first infrastructure is the default.
- PostgreSQL is always explicit.
- Redis is profile-gated unless a runtime check requires it.
- Debug tools must stay behind debug profiles.
- Do not expose extra ports by default.

## Rules

- Prefer profiles for optional services.
- Use healthchecks for dependencies that need readiness.
- Keep volumes named and intentional.
- Keep scripts readable from root `package.json`.
- Do not introduce managed services into the baseline.

## Verification

- `docker compose config`
- `bun run db:up`
- `bun run db:up:redis`
- `bun run db:ps`
- `bun run db:smoke`
