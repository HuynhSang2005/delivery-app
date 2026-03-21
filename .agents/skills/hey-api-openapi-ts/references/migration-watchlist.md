# Migration Watchlist

Always review official migration notes before version upgrades:

- https://heyapi.dev/openapi-ts/migrating

## High-Risk Upgrade Areas

## 1) Runtime and Module System

- ESM-only changes can break CJS setup.
- Minimum Node version changes can break CI/build images.

## 2) Plugin API and Option Renames

- Plugin-first model introduced breaking config shifts.
- Option names and option nesting can change across releases.
- TanStack option naming has changed in earlier releases.

## 3) Output Shape Changes

- `client.gen.ts` ownership and import paths changed in prior releases.
- Re-export behavior (`index.ts`) has changed over time.
- Output defaults (clean/format/lint/export behavior) may change.

## 4) SDK Feature Wiring

- `sdk.transformer` and `sdk.validator` behavior evolved.
- Validation request/response granularity changed across releases.
- Class/flat output and structure APIs can alter generated call shape.

## 5) Parser and Transform Behavior

- Parser defaults and option locations have changed.
- Read/write transforms and naming may shift generated types.

## Upgrade Procedure

1. Pin and bump `@hey-api/openapi-ts` intentionally.
2. Read migration notes for every version jump in range.
3. Regenerate in a branch.
4. Review generated diff for:
   - import path changes
   - type name changes
   - sdk signature changes
   - validator output changes
5. Run full verification matrix.
6. If breakage is large, split migration into staged commits.

## Repo-Specific Hint

In repositories already using generated SDK + fetch + TanStack, prioritize checks for:

- bootstrap client config compatibility
- interceptor behavior and error mapping
- generated TanStack option function names
