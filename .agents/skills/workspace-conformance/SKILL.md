---
name: workspace-conformance
description: Workspace conformance guidance for delivery-app. Use when adding or changing repo invariant checks, Nx target checks, forbidden artifacts, skill quality gates, package manager policy, or foundation guardrails.
---

# Workspace Conformance

Use this skill for `tools/workspace-conformance`.

## Purpose

Conformance checks should catch foundation drift early and cheaply. They must be
deterministic, local-first, and easy to understand from the error message.

## Current Guardrails

- Required targets/scripts for critical projects.
- Project tags and roots.
- Bun/Nx baseline.
- Nested lockfile prevention.
- Removed spec-kit artifacts.
- Admin-web Turbopack baseline.
- Agent skill quality and plugin duplicate checks.

## Rules

- Add checks for invariants, not preferences.
- Error messages must include the violated rule and path.
- Keep self-tests for checker logic.
- Do not make conformance depend on network access.

## Verification

- `bun run --cwd tools/workspace-conformance test`
- `bun run workspace:conformance`
