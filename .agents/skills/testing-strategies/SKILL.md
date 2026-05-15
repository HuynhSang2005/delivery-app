---
name: testing-strategies
description: Testing strategy for delivery-app foundation. Use when planning or auditing unit, integration, e2e, contract, smoke, runtime, browser, or emulator checks across API, admin-web, mobile, packages, and tooling.
---

# Testing Strategies

Use this skill to select the right verification mode and avoid mixing test
levels.

## Test Types

- Unit: isolated logic and small components.
- Integration: module wiring, adapters, generated clients, environment seams.
- E2E: user-visible or HTTP-visible behavior through real boundaries.
- Contract: OpenAPI export and generated API client sync.
- Smoke: release, database, runtime, and web export readiness checks.
- Conformance: repo invariants and foundation guardrails.

## Repo Verification Modes

- `docs-only`: documentation consistency only.
- `current-state`: temporary fallback when target-state is blocked.
- `target-state`: Nx/script-based verification.
- `runtime`: live service, Docker, browser, emulator, or device evidence.

## Baseline Commands

- `bun run affected`
- `bun run affected:e2e`
- `bun run shared:smoke`
- `bun run release:smoke`
- `bun run workspace:conformance`

Pick checks based on risk and blast radius. Do not claim completion without
fresh output from the relevant command.
