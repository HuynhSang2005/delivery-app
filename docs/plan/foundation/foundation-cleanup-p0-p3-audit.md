# Foundation Cleanup P0-P3 Audit

Date: 2026-05-14

## Scope

This audit covers foundation-level setup only:

- planning/tooling overhead
- Nx workspace shape
- Next.js build mode
- CI and verification commands
- Docker Compose baseline
- API client generation
- shared-kernel boundary
- Redis and BullMQ readiness

It intentionally does not redesign database schema, API design, business logic,
or product workflows.

## P0 Result: Spec-Kit Removed

Spec-Kit was removed from the active repository foundation:

- `.specify/` was deleted
- local `speckit-*` skills were removed from `.agents/skills`
- active docs and AGENTS references were rewritten to use source docs plus
  `docs/plan/`
- historical Spec-Kit rollout docs were deleted
- workspace conformance now rejects `.specify` and `speckit-*` skill
  directories if they return

Decision: removing Spec-Kit is correct for the current stage. The project
already has numbered source docs, ADRs, AGENTS files, Nx targets, and Beads.
Adding a second planning framework made the foundation harder to reason about.

## Beads Decision

Beads is kept for now.

Reason:

- it tracks claim/close/evidence separately from source docs
- it is useful for long foundation work across sessions
- there are no open Beads issues blocking this cleanup at the time of audit
- removing Spec-Kit and Beads in the same change would remove both the planning
  scaffold and the execution trace

Reassessment trigger:

- remove Beads later if it stops being used for evidence, creates frequent
  sync failures, or becomes another mandatory process without value

Known limitation:

- Beads remote backup/push may fail when GitHub is unreachable from the local
  environment. Local issue tracking still works.

## Next.js 16 And Turbopack

`apps/admin-web` is suitable for Turbopack:

- `next.config.ts` has no custom `webpack()` override
- it already uses `transpilePackages` for workspace packages
- it defines `turbopack.root` for the monorepo root
- the app shell is small and uses App Router

Change made:

- `next dev` is now explicit `next dev --turbopack`
- `next build --webpack` was replaced with `next build --turbopack`
- `next` and `eslint-config-next` were updated to `16.2.6`
- `nx` was updated to `22.7.1`

Reference:

- Next.js 16 CLI docs describe Turbopack as the default for `next dev` and
  `next build`; `--webpack` opts into Webpack.

## Nx Workspace

Current shape is acceptable for the foundation stage:

- apps: `api`, `admin-web`, `mobile`
- packages: `api-client`, `shared-kernel`
- tooling: `workspace-conformance`
- critical projects expose `build`, `typecheck`, `lint`, and `test`
- `affected`, `affected:e2e`, `shared:smoke`, and `release:smoke` exist at root

Risk:

- the worktree is already heavily modified, so final verification must be read
  as current-state evidence for this branch, not proof of a clean baseline.

## Testing Foundation

The test split is now visible at project level:

- API: unit, integration, e2e Jest configs
- Admin web: unit/integration Bun tests plus Playwright e2e
- Mobile: unit/integration/e2e scripts through Jest/Expo setup
- Shared packages: build/typecheck as smoke-level package verification

Remaining improvement:

- CI should keep the same split but avoid running e2e/runtime gates for docs-only
  changes where possible.
- `release:smoke` requires Docker DB bootstrap. In this local environment Docker
  Desktop starts but the Linux engine returns HTTP 500 for `docker info`, so
  release smoke cannot complete until Docker Desktop is healthy.

## Docker Compose

Current root Compose is an infra baseline:

- PostgreSQL/PostGIS is default
- Redis is profile-based
- Redis Commander is debug-only
- backup job is profile-based

This is acceptable for local-first foundation. Redis should stay optional until
a runtime path actually requires it.

## Redis And BullMQ

Redis exists only as Docker Compose infrastructure and root scripts.

BullMQ is not currently installed or wired in the runtime codebase. There are no
BullMQ modules, processors, queues, or worker targets in the current `apps/api`
source tree.

Conclusion:

- Redis infra is present but optional
- BullMQ setup is not complete because it does not exist yet in runtime code
- this is not a bug for the current foundation if worker/queue execution remains
  deferred
- when BullMQ is introduced, it needs queue registration, worker process,
  graceful shutdown, retry/backoff policy, and runtime smoke tests

## Version Audit

Checked with `bun outdated --recursive` after dependency update.

Foundation updates completed:

- Next.js: `16.2.6`
- `eslint-config-next`: `16.2.6`
- Nx: `22.7.1`

Known remaining non-latest packages:

- NestJS packages have patch/minor updates available.
- Expo SDK packages have SDK-compatible patch updates available.
- React Native has newer releases, but direct latest upgrade must follow Expo
  SDK compatibility instead of raw npm latest.
- ESLint 10 and Node 25 type packages are available but are not safe foundation
  upgrades without a dedicated compatibility pass.

## API Client

`packages/api-client` uses `@hey-api/openapi-ts` with:

- `@hey-api/typescript`
- `@hey-api/sdk`
- `@hey-api/client-fetch`

Generated code must remain generated-only. The correct gate is:

- export OpenAPI from API
- generate client
- check generated output idempotence
- typecheck consumers

## Shared Kernel

`shared-kernel` is acceptable as a small foundation package for constants,
primitive shared types, and cross-app contracts.

Boundary rule:

- keep business workflows, app services, and test-only helpers out of
  `shared-kernel`
- move test-only helpers to `packages/testing` when they become reusable
- prefer explicit domain folders over dumping unrelated utilities into root
  exports

## Close Criteria

This cleanup can close only when:

- Spec-Kit references are absent from active docs/tooling
- `admin-web` no longer opts into Webpack
- conformance rejects Spec-Kit artifacts returning
- verification commands have been run and results recorded in Beads
