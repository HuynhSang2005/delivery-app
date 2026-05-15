---
name: code-review
description: Review delivery-app changes for bugs, regressions, maintainability, security, testing gaps, and foundation contract drift. Use for PR review, local diffs, QA/QC, or architecture-quality review.
---

# Code Review

Default to a review stance: findings first, ordered by severity, with file and
line references when available.

## Review Priorities

1. Bugs and behavioral regressions.
2. Security and data-integrity risks.
3. Contract drift from docs/AGENTS/ADRs.
4. Missing or weak verification.
5. Maintainability and over-engineering.

## delivery-app Invariants

- Bun is the package manager.
- Nx owns target orchestration.
- Local-first is the baseline.
- HTTP/API is authoritative.
- Redis is cache/queue infrastructure, not source of truth.
- Generated API client output must stay generator-owned.
- Do not treat scaffold code as final architecture.

## Output Format

- Findings first.
- Include severity and exact file reference.
- Then open questions or assumptions.
- Then a brief summary only if useful.

If there are no findings, say so and state residual risk or unrun checks.
