---
name: plan-work
description: Create actionable implementation plans for feature delivery and multi-file refactors. Use when the user has requirements/specs and needs a step-by-step plan before coding, including file mapping, sequencing, verification, and rollback.
---

# Plan Work

Use this skill to create execution-ready plans before implementation.

## When to use

- User asks for a plan before coding.
- Work spans multiple files or subsystems.
- You need explicit sequencing, verification, and rollback.

## Modes

Choose one mode explicitly at the start.

### Mode A: feature-plan

Use for new features or behavior changes.

1. Capture goal, scope, constraints, and acceptance criteria.
2. Map files to create/modify/test (exact paths).
3. Break into bite-sized checklist steps with verification after each step.
4. Include test strategy (unit/integration/manual where relevant).
5. Include commit boundaries and risk notes.
6. Include execution handoff instructions to `execute-work`.

### Mode B: refactor-plan

Use for behavior-preserving structural changes.

1. Document current state and target state.
2. List affected files with dependencies.
3. Sequence safely: types/contracts -> implementation -> tests -> cleanup.
4. Add rollback steps for each phase.
5. Add verification gates between phases.

## Legacy guidance migrated

This skill consolidates key behavior previously spread across `writing-plans` and `refactor-plan`:

- multi-step, bite-sized planning before coding,
- explicit file-level impact mapping,
- safe sequencing for refactors,
- rollback-first thinking for risky changes.

## Feature-plan checklist details

- Include exact file paths to create/modify.
- For each task, include at least one verification step.
- Keep tasks independent and reviewable.
- Add a short "critical assumptions" section if scope depends on unknowns.

## Refactor-plan checklist details

- Include current-state summary and target-state summary.
- Specify dependency ordering (what blocks what).
- Include explicit rollback action per phase.
- Do not include placeholders or pseudo-variables in final output.

## Required output template

```markdown
# <Plan title>

> For implementation: use execute-work to run this plan task-by-task.

## Goal
<one sentence>

## Scope
- In scope: ...
- Out of scope: ...

## File map
- Create: path
- Modify: path
- Test: path

## Execution checklist
- [ ] Task 1: ...
  - [ ] Step 1.1 ...
  - [ ] Verify: <exact command/check>
- [ ] Task 2: ...

## Risks and rollback
- Risk: ...
  - Mitigation: ...
  - Rollback: ...
```

## Quality rules

- Do not mix planning with coding.
- Keep steps atomic and verifiable.
- Prefer exact commands and expected outcomes.
- Avoid placeholders like `{{...}}`; output concrete instructions.
- If requirements are ambiguous, ask clarifying questions before finalizing.

## Handoff

After plan is approved, route execution to `execute-work`.

## Suggested opening line

"I am using plan-work to produce an execution-ready plan before coding."
