# Docs Plan Index

`docs/plan/` is the execution planning layer for the repository.

It exists to turn source docs into claimable, verifiable work while keeping
planning separate from issue lifecycle state.

## Reading Order

1. `docs/plan/AGENTS.md`
2. `docs/plan/ai-agent-workflow-playbook.md`
3. `docs/plan/governance/phase-task-standard.md`
4. `docs/plan/governance/execution-checklist.md`
5. `docs/plan/foundation/README.md`
6. `docs/plan/be/README.md`

## Folder Roles

- `docs/plan/foundation/`: repo foundation work such as workspace setup,
  local infra, shared contracts, CI, Docker, and baseline verification.
- `docs/plan/be/`: backend execution after foundation is ready.
- `docs/plan/governance/`: task sizing, metadata, verification, and
  close-evidence standards.
- `docs/plan/archive/`: historical planning artifacts only; archived docs must
  not define active workflow.

## Planning Contract

- Source docs (`docs/00..14`, `docs/references.md`, and ADRs) are the source
  of truth.
- `docs/plan/` decomposes approved source-doc scope into execution plans.
- Beads tracks issue lifecycle (`ready`, `claim`, `close`) and evidence only.
- Beads does not replace source docs or execution plans.
- A task without matching evidence must not be closed.
