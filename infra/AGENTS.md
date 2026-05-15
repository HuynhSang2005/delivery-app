# infra Agent Contract

This file applies to `infra/`, `docker-compose.yml`, DB scripts, local runtime
topology, and self-hosting support.

## Source Of Truth

Read before infra changes:

- `docs/09-devops-runbook.md`
- `docs/13-infrastructure-self-hosting.md`
- `docs/14-tech-stack-catalog.md`
- `docs/11-adrs.md`

## Invariants

- Local-first is the baseline.
- PostgreSQL + PostGIS is the data source of truth.
- Redis is profile-based and optional unless a documented runtime path needs it.
- Worker extraction is deferred and not an `MVP-1` prerequisite.
- Do not introduce paid infrastructure by default.

## Docker Compose Rules

- Keep profiles explicit: baseline DB, optional Redis, debug, jobs.
- Healthchecks must reflect service readiness.
- Do not expose extra ports or debug tools by default.
- Secrets belong in local env or secret stores, not committed files.
- `.env.example` may contain safe local defaults only.

## Verification

State `current-state`, `target-state`, or `runtime`.

Relevant commands:

- `bun run db:ps`
- `bun run db:up`
- `bun run db:smoke`
- `bun run db:drill:backup-restore`
- `bun run db:down`
- `bun run release:smoke`

If Docker is unavailable, state the exact failure and do not claim runtime data
verification.

## Prohibited

- Do not treat Redis as business source of truth.
- Do not add cloud services to the baseline without docs/ADR approval.
- Do not hide Docker startup failures behind passing release checks.
