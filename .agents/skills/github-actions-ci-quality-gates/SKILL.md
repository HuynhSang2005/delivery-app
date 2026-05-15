---
name: github-actions-ci-quality-gates
description: GitHub Actions CI quality gate guidance for delivery-app. Use for workflow review or implementation involving Bun, Nx affected, tests, build, conformance, shared smoke, release smoke, caching, and PR status checks.
---

# GitHub Actions CI Quality Gates

Use this skill when changing CI/CD. Keep CI aligned with local commands.

## Baseline Gates

- Install with Bun.
- Use Nx affected where possible.
- Run lint, typecheck, test, and build.
- Run workspace conformance.
- Run shared smoke for contract/client changes.
- Run e2e/release smoke only when scope requires it or in release workflows.

## Rules

- Do not introduce npm workflow or `package-lock.json`.
- Prefer explicit cache keys for Bun/Nx artifacts.
- Keep jobs readable and debuggable.
- Avoid paid infrastructure assumptions unless source docs approve them.

## Verification

- Local equivalent command passes.
- Workflow syntax is valid.
- PR checks map to documented verification modes.
