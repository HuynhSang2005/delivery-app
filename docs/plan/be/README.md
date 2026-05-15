# Backend Execution System

`docs/plan/be/` is the execution layer for `apps/api`.

It becomes actionable only after the shared foundation in
`docs/plan/foundation/` is ready enough for workspace, local infra, app shells,
and verification gates.

## Ownership

Backend plan owns:

- backend phase roadmap and dependency order
- task-level planning for `apps/api`
- backend verification and smoke gates

Backend plan does not own:

- repository-wide workspace or infra setup
- product rules outside source docs
- database/API/business redesign that has not been approved in source docs

## Source Of Truth

Prefer these docs before changing backend behavior:

- `docs/01-product-requirements.md`
- `docs/04-backend-architecture.md`
- `docs/07-data-model.md`
- `docs/08-api-realtime-contracts.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/11-adrs.md`
- `docs/12-folder-structure.md`
- `docs/14-tech-stack-catalog.md`

## Phase Inventory

- `phase-00-workspace-api-foundation.md`
- `phase-01-auth-session-accounts.md`
- `phase-02-pricing-quotes-orders.md`
- `phase-03-driver-presence-dispatch-realtime.md`
- `phase-04-admin-ops-read-models.md`
- `phase-05-driver-onboarding-review.md`
- `phase-06-chat-worker-hardening.md`

Supporting files:

- `00-execution-system-va-ai-workflow.md`
- `01-roadmap-phase-dag.md`
- `02-beads-seed-runbook.md`
- `03-testing-quality-gates.md`
- `04-smoke-contract.md`
- `05-deterministic-fixtures-catalog.md`

## Required Standards

- task sizing and metadata: `docs/plan/governance/phase-task-standard.md`
- execution gate: `docs/plan/governance/execution-checklist.md`
- claim/close workflow: `docs/plan/execution-worksheet-beads.md`

## Marker Contract

- `<!-- mark-phase: BE-PNN -->`
- `<!-- mark-task: BE-PNN-TMM -->`
- `<!-- mark-check: BE-QG-PNN-CMM -->`

Stable IDs must not change unless the task meaning changes.

## Beads Mapping

Each executable `mark-task` should map to one Beads issue when execution is
tracked. Beads records claim state, blockers, and close evidence; it does not
replace this plan or the source docs.

## Backend Exit Criteria

- `BE-P00..P06` tasks have valid evidence or explicit deferral notes.
- No open blocker exists between backend phases.
- Main backend flows have clear happy-path, unhappy-path, and reconciliation
  verification notes.
