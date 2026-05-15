# docs Agent Contract

This file applies to work inside `docs/`, except execution details under
`docs/plan/*`.

## Authority

- Highest authority in this scope: `docs/README.md`, numbered docs `00..14`,
  `references.md`, and ADRs.
- `docs/plan/*` must follow source docs and cannot override them.
- If runtime scaffold conflicts with source docs, source docs win.

## Scope

In scope:

- Product rules, architecture rules, non-goals, and trade-offs.
- Cross-doc wording consistency.
- ADR updates when architecture decisions change.

Out of scope:

- Runtime issue lifecycle. Use Beads.
- Task-level execution metadata. Use `docs/plan/AGENTS.md`.

## Editing Rules

- Do not change business rules without updating related docs.
- Do not change phase scope without updating plan, testing, and ADR references
  when needed.
- Keep `current-state` and `target-state` wording explicit.
- Time-sensitive claims need a timestamp or an instruction to verify again at
  implementation time.

## Planning And Beads

- Use source docs plus `docs/plan/` to normalize planning artifacts when
  planning docs change.
- Use Beads to track execution state only.
- Source docs remain the decision record.

## Verification

For docs-only work:

- Check consistency across source docs and execution plans.
- Check important policies: auth source, dispatch baseline, realtime authority,
  MVP scope, package manager, and local-first baseline.
- State `docs-only` verification evidence.

## Prohibited

- Do not write docs as if scaffold code is final architecture.
- Do not let execution plans outrank source docs.
- Do not promote deferred features into approved scope by wording alone.
