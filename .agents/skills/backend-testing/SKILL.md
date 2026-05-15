---
name: backend-testing
description: Backend testing guidance for delivery-app NestJS API. Use for apps/api unit, integration, e2e, contract, health, and runtime verification. Prefer repo scripts and Nx targets over generic framework commands.
---

# Backend Testing

Use this skill when testing `apps/api` or reviewing backend test coverage.

## Test Layers

- Unit: isolated providers/controllers with mocks for external boundaries.
- Integration: Nest testing module with real module wiring where useful.
- E2E: HTTP-level behavior through the Nest application boundary.
- Contract: OpenAPI export and generated API client sync.
- Runtime smoke: health/readiness and release smoke checks.

## Repo Commands

- `bun run --cwd apps/api test:unit`
- `bun run --cwd apps/api test:integration`
- `bun run --cwd apps/api test:e2e`
- `bun run --cwd apps/api test`
- `bun run contract:export`
- `bun run shared:smoke`

## Rules

- Do not introduce npm/yarn/pnpm workflows.
- Keep test names tied to observable behavior.
- Do not use Redis, BullMQ, or database state as hidden test coupling.
- For foundation work, prefer explicit unit/integration/e2e folders and scripts.
- If changing OpenAPI behavior, verify generated client idempotency.

## Review Checklist

- Tests map clearly to unit, integration, or e2e.
- Setup/teardown is local to the test layer.
- Assertions cover failure paths and health/readiness behavior.
- Contract changes run through `contract:export`, `contract:generate`, and
  `check:generated`.
- Evidence is recorded before closing the task.
