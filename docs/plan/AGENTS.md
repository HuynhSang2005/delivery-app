# docs/plan Agent Contract

This file applies to planning and execution artifacts under `docs/plan`.

## Authority

Planning files must follow:

1. Source docs in `docs/`.
2. Root `AGENTS.md`.
3. This file.

Plans may decompose approved work, but must not approve new product or
architecture scope by themselves.

## Planning And Beads Boundary

Use source docs plus `docs/plan/` for:

- Plans, tasks, acceptance criteria, and dependency order.
- Clarifying what should be built and how completion is judged.

Use Beads for:

- Issue lifecycle, claim/close state, blockers, evidence, and follow-up tasks.

Do not:

- Use Beads as source docs.
- Use markdown plans as issue lifecycle state when Beads is tracking execution.
- Close Beads issues without evidence that matches the verification mode.

## Required Task Metadata

Every executable plan task should make these fields obvious:

- Scope
- Inputs
- Outputs
- Acceptance criteria
- Dependencies
- Verification mode
- Verification commands or docs QA checks
- Beads mapping when execution is tracked

Allowed verification modes:

- `docs-only`
- `current-state`
- `target-state`
- `runtime`

## Refactoring Plans

When refactoring plans:

1. Preserve approved phase order and MVP boundaries.
2. Keep task IDs and Beads mappings stable when possible.
3. Remove duplicated or superseded planning text.
4. Recheck `current-state` vs `target-state` wording.
5. Update source docs first if scope or acceptance changes.

## Verification

For plan-only changes:

- Run docs QA for affected files.
- Check source-doc consistency.
- Check Beads mapping if task IDs or task boundaries changed.

## Prohibited

- Do not move runtime decisions into plans without ADR/source-doc support.
- Do not create untracked TODO lists as execution state.
- Do not change MVP scope by editing plan text only.
