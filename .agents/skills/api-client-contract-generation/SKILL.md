---
name: api-client-contract-generation
description: OpenAPI and @hey-api/openapi-ts contract generation guidance for delivery-app. Use when changing NestJS OpenAPI export, packages/api-client generated files, client config, contract sync, or admin/mobile API consumption.
---

# API Client Contract Generation

Use this skill whenever API contract or generated client files are involved.

## Source Of Truth

- `apps/api` exports OpenAPI.
- `openapi-ts.config.ts` configures generation.
- `packages/api-client/src/generated` is generated output.
- `packages/api-client/src/index.ts` is the stable import surface.

## Rules

- Do not hand-edit generated files as the real fix.
- Pin and review `@hey-api/openapi-ts` behavior because it changes quickly.
- Keep one canonical client path unless docs approve another.
- Verify admin-web and mobile can consume the generated package.

## Verification

- `bun run contract:export`
- `bun run contract:generate`
- `bun run contract:sync`
- `bun run --cwd packages/api-client check:generated`
- `bun run shared:smoke`
