---
name: execute-work
description: Execute an approved implementation plan with strict checkpoints, blocker handling, verification, and end-of-branch completion options (merge, PR, keep, or discard).
---

# Execute Work

Use this skill to run an existing plan from start to completion.

## When to use

- User already has a written plan and wants implementation.
- Work should be executed task-by-task with visible progress.
- Branch completion decision is needed after implementation.

## Execution protocol

1. Announce you are using execute-work.
2. Load and critically review the plan before touching code.
3. If unclear instructions or blockers exist, stop and ask.
4. Execute tasks in order, one checklist item at a time.
5. Run verification exactly as specified after each task.
6. Track progress by marking completed tasks in the plan.

## Legacy guidance migrated

This skill consolidates key behavior previously spread across `executing-plans` and `finishing-a-development-branch`:

- critical plan review before execution,
- strict stop-on-blocker behavior,
- verification-gated execution,
- explicit branch-completion decision tree.

## Blocker rules

Stop immediately and request guidance when:

- required dependency/tool is missing,
- plan instruction is ambiguous,
- verification repeatedly fails,
- unexpected architectural conflict appears.

Do not guess through blockers.

## Verification rules

- Never claim completion without running verification commands.
- Prefer focused tests first, then broader suite if needed.
- Record what passed/failed in concise summary.

## Completion workflow (after all tasks pass)

Run final test verification, then present exactly these options:

1. Merge back to base branch locally.
2. Push branch and create Pull Request.
3. Keep branch as-is.
4. Discard branch/work.

Use concise prompt format:

```text
Implementation complete. What would you like to do?
1. Merge back to base branch locally
2. Push and create a Pull Request
3. Keep the branch as-is
4. Discard this work
```

### Option handling

- If tests fail, do not offer completion options; fix first.
- If discard is chosen, require explicit confirmation text before deleting.
- Clean up worktree only when workflow calls for it.
- Never perform destructive branch deletion without explicit user confirmation.

## Base branch determination

Detect base branch from repository conventions (`main`/`master`) or ask user if unclear.

## Minimal completion output

```markdown
## Execution Result
- Plan executed: <path>
- Tasks completed: <N>/<N>
- Verification: <passed/failed summary>
- Branch completion choice: <1|2|3|4>
- Final state: <merged/pr-open/kept/discarded>
```

## Integration

- Upstream planning skill: `plan-work`
- Technical restructuring skill: `refactor`
