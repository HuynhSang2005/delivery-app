---
name: nestjs-backend-runtime
description: NestJS runtime guidance for delivery-app API. Use for apps/api modules, providers, controllers, config, health checks, OpenAPI export, sessions, testing, and local runtime wiring.
---

# NestJS Backend Runtime

Use this skill for `apps/api` runtime changes.

## Baseline

- NestJS owns the backend runtime.
- Backend-owned session auth is the baseline.
- OpenAPI export is the contract source for generated clients.
- Health endpoints must remain meaningful for local and release smoke checks.
- Redis/BullMQ are infrastructure dependencies, not business source of truth.

## Rules

- Keep modules/providers/controllers clear and boring.
- Use config/env through approved Nest config paths.
- Do not put business state in socket events or queue payloads alone.
- Keep Swagger/OpenAPI decorators aligned with runtime responses.
- Separate unit, integration, and e2e tests.

## Verification

- `bun run --cwd apps/api lint`
- `bun run --cwd apps/api typecheck`
- `bun run --cwd apps/api test`
- `bun run --cwd apps/api build`
- `bun run contract:export`
