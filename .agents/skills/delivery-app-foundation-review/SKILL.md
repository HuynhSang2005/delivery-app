---
name: delivery-app-foundation-review
description: QA/QC review skill for delivery-app foundation and base setup. Use for audits of monorepo structure, AGENTS contracts, Nx/Bun targets, Docker/local infra, API-client, shared-kernel, testing split, CI quality gates, and plugin/skill coordination.
---

# delivery-app Foundation Review

Use this skill when the task is to audit or improve the repo foundation rather
than implement business logic.

## Scope

- Workspace structure and ownership boundaries.
- Root and folder-level `AGENTS.md` contracts.
- Bun + Nx target consistency.
- Local-first Docker Compose and infra scripts.
- Testing split: unit, integration, e2e, smoke, conformance.
- OpenAPI and generated API client flow.
- Shared-kernel boundaries.
- Agent skill/plugin coordination.

## Non-Scope

- Final database design.
- Final API product design.
- Business workflow design.
- Dispatch/pricing/order logic beyond foundation guardrails.

## Review Rules

- Start from source docs and AGENTS hierarchy.
- Treat scaffold code as provisional.
- Flag over-engineering, duplicate tooling, and unclear ownership.
- Prefer repo-specific skills over copied generic plugin skills.
- Require evidence before closing a task.

## Verification

- `bun run workspace:conformance`
- `bun run affected`
- `bun run shared:smoke`
- `bun run release:smoke` for release-readiness changes.
