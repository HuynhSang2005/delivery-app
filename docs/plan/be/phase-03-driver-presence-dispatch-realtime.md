# Phase 03: Driver Presence, Dispatch, Realtime

<!-- mark-phase: BE-P03 -->

## Mục Tiêu

Implement dispatch baseline đầu tiên chạy được: driver presence ingestion, candidate search, offer flow, accept flow, và assistive realtime updates.

## In Scope

- chốt presence schema và freshness policy
- implement presence ingest API
- implement candidate query theo radius + freshness + KNN
- implement offer lifecycle persistence
- implement accept flow conflict-safe + reconciliation path
- implement assistive realtime events

## Dependencies

- `BE-P01-T06`
- `BE-P02-T04`
- `BE-P02-T05`
- `BE-P00-T03`
- `BE-P00-T04`
- `BE-P00-T05`

## Out Of Scope

- route-aware shortest-path ranking với provider trả phí
- background tracking always-on policy
- worker extraction

## Acceptance Gate

- [ ] presence ingest và candidate selection chạy theo baseline đã chốt
- [ ] offer/accept lifecycle được persist với conflict safety rõ ràng
- [ ] realtime events giữ vai trò assistive và có HTTP reconciliation path

## Task Index

| ID | Type | Verification mode | Depends on | Output |
|---|---|---|---|---|
| `BE-P03-T01` | `schema` | `runtime` | `BE-P01-T06`, `BE-P00-T03` | Presence schema + freshness policy |
| `BE-P03-T02` | `api` | `runtime` | `BE-P03-T01`, `BE-P01-T04` | Driver presence ingest API |
| `BE-P03-T03` | `application` | `runtime` | `BE-P03-T01`, `BE-P02-T04` | Candidate query by radius/freshness/KNN |
| `BE-P03-T04` | `application` | `runtime` | `BE-P03-T03`, `BE-P02-T03` | Dispatch attempt + offer lifecycle persistence |
| `BE-P03-T05` | `api` | `runtime` | `BE-P03-T04`, `BE-P01-T04` | Accept flow conflict safety + reconciliation |
| `BE-P03-T06` | `realtime` | `runtime` | `BE-P03-T02`, `BE-P03-T05`, `BE-P00-T04` | Assistive websocket events + HTTP reconciliation |

<!-- mark-task: BE-P03-T01 -->
### BE-P03-T01 Chốt driver presence schema và freshness policy

- Type: `schema`
- Verification mode: `runtime`
- Depends on: `BE-P01-T06`, `BE-P00-T03`
- Outputs: current-state storage cho presence, freshness policy, và payload invariants
- Touched paths: `apps/api/prisma/**`, `docs/plan/be/phase-03-driver-presence-dispatch-realtime.md`
- Docs refs: `docs/01-product-requirements.md`, `docs/07-data-model.md`, `docs/11-adrs.md`
- Verification: presence schema đã mô tả đủ fields location/accuracy/heading/speed/status và freshness rule dùng cho dispatch eligibility
- Tests: lên plan cho stale, invalid, và active presence fixtures
- Beads: `type=task`, `labels=be,phase:p03,presence,schema`
- Definition of done: BE-P03-T02/T03 có thể dùng presence persistence surface hiện tại mà không cần bổ sung schema nền

<!-- mark-task: BE-P03-T02 -->
### BE-P03-T02 Implement driver presence ingest API

- Type: `api`
- Verification mode: `runtime`
- Depends on: `BE-P03-T01`, `BE-P01-T04`
- Outputs: authenticated presence update endpoint với validation và freshness semantics
- Touched paths: `apps/api/src/modules/dispatch/**`, `apps/api/src/modules/drivers/**`
- Docs refs: `docs/05-mobile-architecture-expo.md`, `docs/08-api-realtime-contracts.md`
- Verification: presence ingest contract đã nêu rõ validation cho payload hợp lệ, stale update, và unauthorized access
- Tests: API tests cho happy path, validation failure, forbidden access, và stale payload behavior
- Beads: `type=task`, `labels=be,phase:p03,presence,api`
- Definition of done: mobile phases dùng được presence API contract hiện tại cho availability/tracking mà không thêm endpoint phụ

<!-- mark-task: BE-P03-T03 -->
### BE-P03-T03 Implement candidate driver query bằng radius, freshness, và KNN

- Type: `application`
- Verification mode: `runtime`
- Depends on: `BE-P03-T01`, `BE-P02-T04`
- Outputs: candidate selection query dùng PostGIS với `ST_DWithin` filtering, KNN ordering, và shortlist policy
- Touched paths: `apps/api/src/modules/dispatch/**`, `apps/api/src/infrastructure/**`
- Docs refs: `docs/01-product-requirements.md`, `docs/04-backend-architecture.md`, `docs/11-adrs.md`
- Verification: candidate query semantics đã kiểm chứng được theo tiêu chí radius + freshness + availability + KNN ordering
- Tests: integration tests với deterministic spatial fixtures và stale-presence exclusion cases
- Beads: `type=task`, `labels=be,phase:p03,dispatch,geo`
- Definition of done: dispatch candidate selection hoạt động theo baseline hiện tại mà không phụ thuộc route provider phase sau

<!-- mark-task: BE-P03-T04 -->
### BE-P03-T04 Implement dispatch attempt và offer lifecycle persistence

- Type: `application`
- Verification mode: `runtime`
- Depends on: `BE-P03-T03`, `BE-P02-T03`
- Outputs: dispatch attempt records, offer TTL policy, response tracking, và baseline handling cho `NO_DRIVER_FOUND`
- Touched paths: `apps/api/src/modules/dispatch/**`, `apps/api/prisma/**`
- Docs refs: `docs/01-product-requirements.md`, `docs/07-data-model.md`
- Verification: offer lifecycle đã có persistence semantics cho accepted/expired/rejected/unmatched và reason tracking phục vụ audit
- Tests: integration tests cho expiry, reject, timeout, và no-driver-found paths
- Beads: `type=task`, `labels=be,phase:p03,dispatch,lifecycle`
- Definition of done: admin/ops read models có thể dựa vào dispatch persistence state mà không cần log parsing ad-hoc

<!-- mark-task: BE-P03-T05 -->
### BE-P03-T05 Implement driver offer accept flow có conflict safety và HTTP reconciliation path rõ

- Type: `api`
- Verification mode: `runtime`
- Depends on: `BE-P03-T04`, `BE-P01-T04`
- Outputs: accept endpoint và reconciliation path rõ qua order hoặc active-order reads, với conflict-safe order transition logic
- Touched paths: `apps/api/src/modules/dispatch/**`, `apps/api/src/modules/orders/**`
- Docs refs: `docs/08-api-realtime-contracts.md`, `docs/11-adrs.md`
- Verification: accept flow đã có conflict-safe semantics một-người-thắng và deterministic response cho race losers
- Tests: API và integration tests cho accept success, expired offer, duplicate accept, và concurrent accept conflict
- Beads: `type=task`, `labels=be,phase:p03,dispatch,api`
- Definition of done: order assignment semantics ổn định để các phase vận hành và admin reads dùng trực tiếp

<!-- mark-task: BE-P03-T06 -->
### BE-P03-T06 Implement assistive websocket events với HTTP reconciliation

- Type: `realtime`
- Verification mode: `runtime`
- Depends on: `BE-P03-T02`, `BE-P03-T05`, `BE-P00-T04`
- Outputs: websocket rooms, outbound events cho order và dispatch updates, cùng reconnect reconciliation policy
- Touched paths: `apps/api/src/modules/dispatch/**`, `apps/api/src/modules/orders/**`
- Docs refs: `docs/04-backend-architecture.md`, `docs/08-api-realtime-contracts.md`
- Verification: realtime events đã gắn với persisted state và có HTTP reconciliation path rõ khi reconnect/disconnect
- Tests: gateway tests cộng với API reconciliation checks sau simulated disconnect
- Beads: `type=task`, `labels=be,phase:p03,realtime`
- Definition of done: client flows có thể khôi phục state bằng HTTP ngay cả khi realtime events bị trễ hoặc mất

## Mini Checklist Pass/Fail (Pass 3)

Quy ước đo lường: mỗi dòng là điều kiện pass/fail nhị phân; nếu có số lượng thì ưu tiên ngưỡng dạng >= N.

### BE-P03-T01

- [ ] Pass khi Presence schema có đủ fields location, accuracy, heading, speed, status.
- [ ] Pass khi Freshness policy có ngưỡng rõ để xác định stale presence.
- [ ] Pass khi Eligibility semantics cho dispatch được nêu rõ từ schema/policy.

### BE-P03-T02

- [ ] Pass khi Presence ingest yêu cầu auth hợp lệ và kiểm tra payload invariants.
- [ ] Pass khi Hành vi với stale payload được mô tả và kiểm chứng được.
- [ ] Pass khi Có coverage cho forbidden và validation failure paths.

### BE-P03-T03

- [ ] Pass khi Candidate query dùng đầy đủ radius + freshness + availability + KNN.
- [ ] Pass khi Có deterministic spatial fixtures cho integration tests.
- [ ] Pass khi Không phụ thuộc route-aware provider trong baseline.

### BE-P03-T04

- [ ] Pass khi Offer lifecycle có trạng thái accepted/rejected/expired/unmatched.
- [ ] Pass khi `NO_DRIVER_FOUND` được xử lý như first-class outcome.
- [ ] Pass khi Persistence data đủ cho audit hoặc admin investigation.

### BE-P03-T05

- [ ] Pass khi Accept flow đảm bảo một-người-thắng trong race conditions.
- [ ] Pass khi Có deterministic response cho loser hoặc duplicate accept.
- [ ] Pass khi HTTP reconciliation path cho assignment state được nêu rõ.

### BE-P03-T06

- [ ] Pass khi Websocket events được định nghĩa là assistive, không phải source of truth.
- [ ] Pass khi Có HTTP reconciliation path cho reconnect/disconnect scenarios.
- [ ] Pass khi Coverage gồm simulated disconnect và state recovery checks.
