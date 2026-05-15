# tools Agent Contract

This file applies to workspace tooling, code generation, conformance helpers,
release smoke helpers, and scripts under `tools/`.

## Source Of Truth

Read before tooling changes:

- `docs/09-devops-runbook.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/12-folder-structure.md`
- `docs/14-tech-stack-catalog.md`
- `docs/11-adrs.md`

## Tooling Rules

- Tooling must make drift visible, not hide it.
- Conformance checks should fail fast on placeholder scripts, nested lockfiles,
  invalid project metadata, and workspace boundary violations.
- Codegen helpers must be deterministic and idempotent.
- Release smoke must assert runtime wiring and must not pass required runtime
  dependencies silently.
- Do not hardcode starter paths that contradict target architecture.

## Generated Code

- Generated API client artifacts belong under `packages/api-client/src/generated`.
- Do not hand-edit generated artifacts except as an output of the generator.
- `bun run shared:smoke` must prove export/generate/idempotency/conformance.

## Verification

State `current-state`, `target-state`, or `runtime`.

Relevant commands:

- `bun run workspace:conformance`
- `bun run shared:smoke`
- `bun run release:smoke`
- `bun run affected`

## Prohibited

- Do not add placeholder checks that always pass.
- Do not make lint/test/build commands mutate source files.
- Do not introduce npm workflows or nested lockfiles.
