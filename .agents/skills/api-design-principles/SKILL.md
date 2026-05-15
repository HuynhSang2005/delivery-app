---
name: api-design-principles
description: API design guardrails for delivery-app. Use when reviewing or designing REST/OpenAPI contracts, NestJS controllers, generated clients, errors, pagination, auth/session boundaries, or realtime/API consistency.
---

# API Design Principles

Use this skill after foundation work reaches API design. Do not invent business
workflow in this skill.

## Repo Rules

- Backend-owned session auth is the baseline.
- OpenAPI from `apps/api` is the contract source.
- `packages/api-client` is generated from OpenAPI.
- HTTP responses are authoritative.
- Socket/realtime events must not be the only source of truth.
- Use local-first assumptions unless source docs approve paid services.

## Contract Checklist

- Resource names and paths are consistent.
- Request/response schemas are explicit.
- Error shape is predictable.
- Auth requirements are documented.
- Generated client remains idempotent.
- Mobile and admin-web can consume the same canonical contract path.

## Verification

- `bun run contract:export`
- `bun run contract:generate`
- `bun run --cwd packages/api-client check:generated`
- `bun run shared:smoke`
