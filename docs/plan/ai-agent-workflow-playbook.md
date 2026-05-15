# AI-Agent Workflow Playbook

This playbook is for coordinating AI-agent work in `delivery-app`.

## 1. Before Assigning Work

Define:

- scope: `docs-only`, planning, or implementation
- folder ownership: docs, docs/plan, infra, tools, apps, or packages
- verification mode: `docs-only`, `current-state`, `target-state`, or `runtime`
- expected output at file or task level

Good prompts include business goal, in-scope/out-of-scope boundaries, done
criteria, and source docs that must be followed.

## 2. During Execution

Agents should:

- read source docs before changing behavior
- create or claim a Beads issue before large implementation work
- keep task size close to `1 task = 1 verifiable output`
- report blockers early
- avoid expanding scope silently

Recommended checkpoints:

1. proposed model and workflow
2. file map and impact map
3. patch plus verification evidence

## 3. Beads Claim/Close Protocol

1. `bd prime --json`
2. `bd ready --json`
3. `bd update <id> --claim --json`
4. execute the issue scope
5. record evidence
6. `bd close <id> --reason "Completed" --json`

Close evidence must include touched paths, verification commands and results,
test notes, and drift notes.

## 4. Planning Vs Tracking

Use source docs plus `docs/plan/` when deciding:

- what to build
- acceptance criteria
- dependency order
- task decomposition

Use Beads when deciding:

- what is ready
- what is claimed
- what is blocked
- whether a task has enough evidence to close

Do not use Beads as source docs. Do not skip source-doc updates when scope or
acceptance criteria change.

## 5. Anti-Vague Task Rule

Avoid vague tasks:

- "finish auth"
- "optimize all dispatch"
- "fix the whole foundation"

Prefer concrete outputs:

- "define mark-task metadata template in docs/plan"
- "add close-evidence checklist for backend workflow"
- "verify Redis profile healthcheck in Docker Compose"

## 6. IDE-Safe Search

- Prefer scoped searches.
- Avoid dumping recursive full-repo output when a file or folder scope is enough.
- Split broad checks into smaller batches.
- Stop and narrow scope when output is too large to review accurately.

## 7. End Session

Before closing:

- verify changed files
- close only issues with evidence
- summarize changes, residual risks, and follow-up work
- attempt Beads backup when network access is available
