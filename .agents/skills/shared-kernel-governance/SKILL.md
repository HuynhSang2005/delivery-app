---
name: shared-kernel-governance
description: Shared-kernel governance for delivery-app. Use when adding or reviewing packages/shared-kernel exports, cross-app constants, shared types, foundation capabilities, or app/package dependency boundaries.
---

# Shared Kernel Governance

`packages/shared-kernel` should stay small and stable. It is not a dumping
ground for app logic.

## Allowed Content

- Cross-app constants.
- Stable shared types.
- Foundation capability markers.
- Small pure helpers with no runtime side effects.

## Not Allowed

- Business workflow orchestration.
- App-specific UI or backend logic.
- Database, Redis, or HTTP client dependencies.
- Generated OpenAPI client code.

## Verification

- `bun run --cwd packages/shared-kernel typecheck`
- `bun run --cwd packages/shared-kernel test`
- `bun run shared:smoke`
- `bun run workspace:conformance`
