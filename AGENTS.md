# delivery-app Agent Contract

This file is the repo-level contract for AI agents working in `delivery-app`.
Its job is to keep execution consistent, keep scope controlled, and force
changes to follow source docs instead of scaffold code.

## Authority

Use this precedence order:

1. Source docs in `docs/`: numbered docs `00` through `14`, `references.md`,
   and ADRs.
2. This root `AGENTS.md`.
3. Domain AGENTS files: `docs/AGENTS.md`, `docs/plan/AGENTS.md`,
   `infra/AGENTS.md`, `tools/AGENTS.md`.
4. App AGENTS files: `apps/*/AGENTS.md`.

Lower layers may specialize higher layers, but must not relax or override
approved invariants. If instructions conflict, follow the higher layer and
record the reason in the execution notes.

## Required Reading

Before significant work, read at least:

- `docs/README.md`
- `docs/01-product-requirements.md`
- `docs/02-solution-overview.md`
- `docs/03-system-architecture.md`
- `docs/09-devops-runbook.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/11-adrs.md`
- `docs/12-folder-structure.md`
- `docs/14-tech-stack-catalog.md`

If the task touches product rules, API, data model, auth, dispatch, realtime,
pricing, or self-hosting, read the matching specialist docs before changing
runtime behavior.

## Workflow

1. Classify scope: docs-only, planning, or implementation.
2. Read the nearest AGENTS file for the touched folder.
3. Use the source docs and `docs/plan/` files for planning, acceptance
   criteria, sequencing, and decomposition.
4. Use Beads for execution tracking, blockers, evidence, and closure when the
   work is large enough to need persistent task state.
5. Close only after evidence matches the verification mode.

## Planning And Beads

- Source docs and `docs/plan/` own planning artifacts, acceptance criteria,
  dependency graphs, and task decomposition.
- Beads owns issue lifecycle, claim state, blocker state, evidence, and close
  state.
- Beads never replaces source docs, architecture decisions, or execution plans.
- Markdown plans never replace runtime issue tracking when Beads is in use.

Fast routing:

- "What should we build, with what criteria, and in what order?" -> source docs
  plus `docs/plan/`.
- "What is claimed, blocked, evidenced, or closed?" -> Beads.

## Repo Invariants

- Delivery path is `MVP-1 -> MVP-2 -> MVP-3`.
- `MVP-1` prioritizes the core delivery flow; do not pull side features into
  the baseline.
- Auth baseline is backend-owned session.
- Dev login is valid for `MVP-1`.
- Firebase OTP/SMS, if used later, is identity proofing only, not the auth
  source.
- Dispatch baseline is radius + freshness + KNN.
- Realtime is HTTP-authoritative; socket events are assistive.
- Onboarding comes before chat.
- A separate worker is a later phase and not an `MVP-1` prerequisite.
- Local-first is the baseline; do not default to paid infrastructure.
- The package manager is `bun`; do not introduce npm workflows or
  `package-lock.json`.

## Verification Modes

Always state one verification mode:

- `docs-only`: documentation consistency, links, metadata, and affected source
  docs are checked.
- `current-state`: temporary fallback when target-state is blocked; evidence
  must explain why.
- `target-state`: default after `FDN-R01`; use Nx target contracts.
- `runtime`: live service, Docker, browser, emulator, or other runtime evidence.

Target-state baseline:

- `bun run affected`
- Add `bun run affected:e2e` for important flow changes.
- Add `bun run shared:smoke` for shared contract/client changes.
- Add `bun run release:smoke` for release-readiness or observability changes.

Do not claim complete without evidence, or without explaining why the task is
docs-only or blocked from runtime verification.

## Scope Routing

- Source docs or policy: `docs/AGENTS.md`
- Execution plans and Beads evidence mapping: `docs/plan/AGENTS.md`
- Backend runtime: `apps/api/AGENTS.md`
- Mobile runtime: `apps/mobile/AGENTS.md`
- Admin web runtime: `apps/admin-web/AGENTS.md`
- Shared packages and generated contracts: `packages/*` plus `tools/AGENTS.md`
- Deploy topology, Compose, proxy, DB scripts: `infra/AGENTS.md`
- Generators, codegen, conformance helpers: `tools/AGENTS.md`

## Skill And Plugin Routing

Codex plugins own generic expert workflows. Repo-local skills in
`.agents/skills` own `delivery-app` doctrine, local invariants, and execution
rules. Prefer plugin skills for generic platform work, and combine them with a
repo-local skill only when the task touches repo-specific contracts.

Fast routing:

- Next.js/admin web:
  - Use local `nextjs` for `apps/admin-web`, Next.js 16, Turbopack, and repo
    contract rules.
  - Use Next DevTools MCP and official Next.js docs for all version-sensitive
    facts.
  - Use Browser or Chrome DevTools MCP for rendered UI/runtime verification.
- Web/frontend generic:
  - Use Build Web Apps plugin skills for generic React, shadcn, frontend
    testing/debugging, and UI implementation guidance.
  - Do not keep duplicate local copies of those plugin skills.
- Expo/mobile generic:
  - Use Expo plugin skills for Expo Router, native UI, dev client, deployment,
    Tailwind, API routes, and Expo upgrades.
  - Use Test Android Apps plugin skills for emulator QA and Android
    performance.
  - Use local skills only for delivery-app mobile contracts and verification
    mode decisions.
- Security:
  - Use Codex Security plugin for security scans, threat modeling, finding
    validation, and security fixes.
  - Use local `code-review` when the task is a delivery-app quality/foundation
    review rather than a dedicated security scan.
- Execution workflow:
  - Use Beads for issue state, claim/block/close evidence, and backup.
  - Use local `plan-work`, `execute-work`, and `delivery-app-foundation-review`
    for repo-specific planning and foundation execution.
  - If a Superpowers plugin workflow is used, it must still respect this file,
    Beads, Bun, Nx, and verification modes.
- Backend/API/contracts:
  - Use local `nestjs-backend-runtime`, `backend-testing`,
    `api-design-principles`, and `api-client-contract-generation`.
  - Use Context7/Tavily/official docs for NestJS, OpenAPI, hey-api, Prisma, and
    other version-sensitive APIs.
- Infra/cache/queues/data:
  - Use local `docker-compose-local-infra`, `redis-development`,
    `bullmq-worker-queue`, `postgis-skill`, and
    `postgres-postgis-delivery-data-access`.
  - Redis and BullMQ must remain infrastructure helpers, not canonical business
    state.
- Workspace/CI/governance:
  - Use Nx MCP for Nx workspace questions and changes.
  - Use local `nx-monorepo`, `workspace-conformance`,
    `github-actions-ci-quality-gates`, `shared-kernel-governance`, and
    `observability-logging` for repo-specific rules.
- Documentation and diagrams:
  - Use local `agent-md-refactor`, `create-agentsmd`,
    `mermaid-diagram-specialist`, and `pretty-mermaid` when docs or agent
    contracts change.

Do not add local skills that are exact copies or same-name duplicates of
installed Codex plugin skills. Local skills must add delivery-app-specific
value. `bun run workspace:conformance` enforces this.

## Prohibited

- Do not treat scaffold code as final architecture.
- Do not use websocket events as the only source of truth.
- Do not add paid services to the baseline unless docs approve them.
- Do not change business rules or invariants without updating source docs.
- Do not create `package-lock.json` or npm workflows.
- Do not revert user changes unless explicitly requested.

<!-- BEGIN BEADS INTEGRATION v:1 profile:full hash:f65d5d33 -->
## Issue Tracking With bd (Beads)

This block applies to AI agents running in VS Code, Codex, and similar agent
CLIs. Use Beads for execution work; do not use markdown TODO files as an issue
tracker.

Mandatory rules:

- Run `bd prime` at session start or after context recovery.
- Use `--json` for automation-facing Beads commands.
- Map each execution task to one `type=task` issue.
- Claim work before implementation: `bd update <id> --claim --json`.
- Close only with evidence for the selected verification mode.
- End important sessions by exporting the Beads backup.

Common commands:

- `bd ready --json`
- `bd list --status=open --json`
- `bd create "<title>" -t task -p 2 --json`
- `bd update <id> --claim --json`
- `bd update <id> --notes "<evidence>" --json`
- `bd close <id> --reason "Completed" --json`
- `bd backup export-git --branch beads-backup --remote origin`

Safety policy for solo development:

- Do not track `.beads/` in the code branch.
- Use `origin/beads-backup` as the backup branch.
- If Beads auto-push is rejected, continue local execution and run the backup
  export at the end of the session.

<!-- END BEADS INTEGRATION -->
