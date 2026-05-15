---
name: observability-logging
description: Observability and logging guidance for delivery-app. Use for API/admin/mobile logging, health/readiness, error reporting, release smoke evidence, and future telemetry boundaries.
---

# Observability Logging

Use this skill when adding diagnostics or reviewing runtime evidence.

## Baseline

- Foundation observability should be lightweight and local-first.
- Health/readiness endpoints must reflect useful runtime state.
- Logs should help debug without exposing secrets.
- Advanced managed telemetry is conditional, not baseline.

## Rules

- Log structured events where the runtime supports it.
- Do not log tokens, secrets, credentials, or raw PII.
- Keep user-facing errors separate from developer diagnostics.
- Record release-smoke evidence for readiness-sensitive changes.
- Do not add paid observability services without docs/ADR approval.

## Verification

- App-specific tests for health/error behavior.
- `bun run release:smoke` for release-readiness changes.
- Runtime/browser evidence when UI telemetry is touched.
