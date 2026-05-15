---
name: bullmq-worker-queue
description: BullMQ and Redis queue guidance for delivery-app. Use for @nestjs/bullmq, bullmq queues, workers, retries, delayed jobs, QueueEvents, FlowProducer, Redis connection setup, and queue/runtime boundaries.
---

# BullMQ Worker Queue

Use this skill when adding or reviewing queue infrastructure.

## Baseline

- Redis supports cache/queue use cases only.
- BullMQ workers are not an MVP-1 prerequisite unless source docs approve.
- HTTP/API state remains authoritative.
- Jobs must be idempotent or have explicit dedupe/locking semantics.

## Rules

- Use named queues and centralized connection config.
- Keep job payloads small and versionable.
- Set retry/backoff deliberately.
- Use graceful shutdown for workers.
- Use `QueueEvents` only for observability/progress, not canonical state.
- Avoid repeatable/delayed jobs until the phase requires them.

## Verification

- `bun run db:up:redis`
- App-specific queue unit/integration tests.
- Runtime smoke for worker lifecycle when workers exist.
- Official BullMQ docs for version-sensitive APIs.
