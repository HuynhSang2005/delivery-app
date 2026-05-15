---
name: refactor
description: Surgical refactoring for delivery-app. Use when improving structure without changing behavior across apps, packages, tools, docs, or agent skills. Requires small scope, preserved contracts, and fresh verification.
---

# Refactor

Refactoring in this repo must reduce maintenance cost without changing approved
runtime behavior or source-doc invariants.

## Workflow

1. Identify the behavior contract before editing.
2. Keep the change scoped to the touched module or skill.
3. Prefer existing patterns over new abstractions.
4. Update docs only when the contract or workflow changes.
5. Run focused verification, then broader verification when shared contracts are
   touched.

## Guardrails

- Do not revert unrelated user changes.
- Do not introduce new package managers or lockfiles.
- Do not move business behavior across boundaries without docs/ADR support.
- Do not hide complexity in generic helpers unless it removes real duplication.
- For generated code, change the generator/config, not only generated output.

## Verification

- App/package local lint/typecheck/test.
- `bun run affected` for cross-project changes.
- `bun run shared:smoke` for API client/shared-kernel changes.
- `bun run workspace:conformance` for workspace/foundation changes.
