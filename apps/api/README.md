# API App

NestJS runtime for the delivery MVP foundation.

## Scope

- Exposes `/api/v1/health/live` and `/api/v1/health/ready`.
- Exposes root foundation status from `shared-kernel`.
- Owns backend HTTP contracts used by `packages/api-client`.

## Commands

```bash
bun run build
bun run typecheck
bun run lint
bun run test:unit
bun run test:integration
bun run test:e2e
```

Run from the app folder with `bun run <script>` or from the workspace with `bun run --cwd apps/api <script>`.
