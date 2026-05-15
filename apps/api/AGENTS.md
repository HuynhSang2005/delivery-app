# apps/api Agent Contract

This file applies to backend work under `apps/api`.

## Source Of Truth

Read before backend changes:

- `docs/04-backend-architecture.md`
- `docs/07-data-model.md`
- `docs/08-api-realtime-contracts.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/11-adrs.md`
- `docs/12-folder-structure.md`
- `docs/14-tech-stack-catalog.md`

If work touches foundation, contracts, infra, or verification baseline, also
read `docs/plan/foundation/`.

## Architecture Rules

- Backend follows a NestJS modular monolith.
- Keep boundaries clear between presentation, application, domain, and
  infrastructure.
- Controllers should not own business rules.
- Realtime is transport/UX support only; HTTP and persisted state are
  authoritative.
- PostgreSQL + PostGIS is the source of truth.

## Hard Invariants

- Auth source is backend-owned session.
- `/auth/me` is the identity truth for clients.
- Dev login is valid for `MVP-1`.
- Firebase phone flow, if added later, is proofing only and must exchange into a
  backend session.
- Quotes use versioned pricing policy.
- Orders snapshot pricing and support idempotent creation.
- Dispatch is offer-based; baseline candidate selection is radius + freshness +
  KNN.
- Concurrent accept must resolve deterministically and leave an audit trail.

## Current Foundation State

Health and runtime-smoke endpoints may exist before full domain modules. Do not
extend starter scaffold as if it were final architecture.

## Verification

Current app commands:

- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:e2e`
- `bun run build`

Rules:

- Non-trivial backend changes require lint, typecheck, test, and build.
- Run e2e when API bootstrap, auth, lifecycle, contracts, or main flows change.
- Contract changes must be checked against docs and `packages/api-client`.
- State `current-state` or `target-state` in evidence.

## Prohibited

- Do not use Firebase session as canonical app session.
- Do not collapse the capability model into a single-role shortcut.
- Do not let clients infer final state without backend confirmation.
- Do not bypass persistence via realtime.
- Do not change enum, lifecycle, or contracts without source-doc updates.
- Do not introduce npm workflows or `package-lock.json`.
