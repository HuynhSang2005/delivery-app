# Operations Handbook

## Purpose

This handbook defines the lightweight operating model for solo development and
AI-agent execution in `docs/plan`.

Goals:

- keep source docs, execution plans, and issue lifecycle separate
- reduce scope drift
- keep evidence available across sessions

## Responsibility Layers

- Source of truth: numbered docs, `docs/references.md`, ADRs, and AGENTS
  contracts.
- Planning layer: `docs/plan/**` phase docs, task metadata, dependency order,
  and acceptance criteria.
- Execution tracking layer: Beads issue graph (`ready`, `claim`, `close`,
  blocker dependencies, and evidence).

Rules:

- Do not use Beads to replace docs or plans.
- Do not use markdown files as issue lifecycle state when Beads is tracking the
  work.
- Do not add heavyweight planning scaffolds unless source docs explicitly
  approve them.

## Session SOP

1. Read the root AGENTS file, nearest AGENTS file, and source docs for the
   touched scope.
2. Run `bd prime --json` when Beads state is relevant.
3. Check ready work with `bd ready --json` or create one focused task for the
   current execution.
4. Claim before implementation with `bd update <id> --claim --json`.

## Execution Loop

1. Confirm the scope and verification mode.
2. Execute one bounded task at a time.
3. Keep touched paths aligned with the task.
4. Run the verification command for the selected mode.
5. Record touched paths, commands, results, and drift notes in Beads.
6. Close only when evidence matches the task definition of done.

## Decision Matrix

Use source docs and `docs/plan/` when the question is:

- what should be built
- what the acceptance criteria are
- what order work should follow
- what is in or out of scope

Use Beads when the question is:

- which task is ready
- which task is blocked
- who claimed the task
- whether close evidence exists

## Stable ID Rules

- Phase marker: `<!-- mark-phase: XXX -->`
- Task marker: `<!-- mark-task: XXX -->`
- Check marker: `<!-- mark-check: XXX -->`

Do not rename stable IDs for cleanup only. If an ID must change, record the old
to new mapping in the affected plan file.

## Required Task Metadata

Each executable task should state:

- `Type`
- `Verification mode`
- `Depends on`
- `Outputs`
- `Touched paths`
- `Docs refs`
- `Verification`
- `Tests`
- `Beads`
- `Definition of done`

## Verification Modes

- `docs-only`
- `current-state`
- `target-state`
- `runtime`

## Review Checklist

- metadata is complete
- dependency graph has no cycles
- verification mode is explicit
- task title has a concrete output
- Beads close evidence exists for tracked execution

## End-Of-Session SOP

1. Update Beads notes for tasks that were touched.
2. Close only tasks with evidence.
3. Run final verification or record the blocker.
4. Attempt Beads backup export when network access is available.
