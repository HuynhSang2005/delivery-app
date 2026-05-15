# apps/mobile Agent Contract

This file applies to mobile work under `apps/mobile`.

## Source Of Truth

Read before mobile changes:

- `docs/05-frontend-mobile-architecture.md`
- `docs/08-api-realtime-contracts.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/11-adrs.md`
- `docs/12-folder-structure.md`
- `docs/14-tech-stack-catalog.md`

If work touches app shell, workspace targets, contract generation, or repo
verification, also read `docs/plan/foundation/`.

## Runtime Rules

- Mobile supports user and driver flows; do not reduce the model to one role.
- Use backend-owned session as auth truth.
- Use HTTP-authoritative reconciliation for state.
- Realtime is assistive for UX and freshness.
- Do not infer final architecture from starter routes or sample components.

## Expo Rules

- Use Expo official guidance for native, routing, and test setup questions.
- Device-level e2e is phase-based; current baseline may use web export smoke.
- Keep warnings out of deterministic unit/integration tests where practical.

## Verification

Current app commands:

- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:e2e`
- `bun run build`

Rules:

- App-shell changes require lint, typecheck, tests, and build.
- Navigation or runtime flow changes require e2e/preflight.
- State `current-state` or `target-state` in evidence.

## Prohibited

- Do not make client state authoritative over backend state.
- Do not add background tracking beyond documented phase constraints.
- Do not treat Redis or realtime as business truth.
- Do not introduce npm workflows or `package-lock.json`.
