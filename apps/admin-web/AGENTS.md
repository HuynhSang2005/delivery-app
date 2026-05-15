# apps/admin-web Agent Contract

This file applies to admin web work under `apps/admin-web`.

## Source Of Truth

Read before admin-web changes:

- `docs/05-frontend-mobile-architecture.md`
- `docs/06-admin-ops.md`
- `docs/08-api-realtime-contracts.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/11-adrs.md`
- `docs/12-folder-structure.md`
- `docs/14-tech-stack-catalog.md`

If work touches app shell, workspace targets, contract generation, or repo
verification, also read `docs/plan/foundation/`.

## Runtime Rules

- Admin web is an operations surface, not a marketing site.
- Use `packages/api-client` as the canonical HTTP client path.
- HTTP state is authoritative. Realtime may assist UX but must not be the only
  truth.
- Keep pages dense, readable, and operational.
- Do not infer final feature scope from starter code.

## Next.js Rules

- Use Next.js official docs through Next DevTools MCP for Next.js-specific
  implementation questions.
- Local workspace packages that need transpilation must be listed in
  `transpilePackages`.
- Production build mode must be explicit and consistent across Nx and e2e
  paths.

## Verification

Current app commands:

- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:e2e`
- `bun run build`

Rules:

- UI/runtime changes require lint, typecheck, tests, and build.
- User-visible or route-level changes require e2e.
- State `current-state` or `target-state` in evidence.

## Prohibited

- Do not add unauthenticated admin mutation flows without source-doc updates.
- Do not create local-only state as the source of business truth.
- Do not bypass generated API client for typed backend calls.
- Do not introduce npm workflows or `package-lock.json`.
