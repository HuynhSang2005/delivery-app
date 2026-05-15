# Phase 04: Admin Operations Và Read Models

<!-- mark-phase: BE-P04 -->

## Mục Tiêu

Hỗ trợ workflow vận hành của admin bằng read models và investigation-oriented endpoints rõ ràng.

## In Scope

- chốt order board query model cho admin
- implement order detail investigation API
- giữ scope-control cho admin mutations ngoài baseline MVP-1

## Dependencies

- `BE-P02-T05`
- `BE-P03-T04`
- `BE-P03-T05`
- `BE-P03-T06`

## Out Of Scope

- driver onboarding review
- chat
- worker extraction

## Acceptance Gate

- [ ] admin board/detail reads phục vụ triage và investigation ổn định
- [ ] capability policy cho admin access rõ và testable
- [ ] mutation scope vẫn được khóa đúng baseline `MVP-1`

## Task Index

| ID | Type | Verification mode | Depends on | Output |
|---|---|---|---|---|
| `BE-P04-T01` | `read-model` | `runtime` | `BE-P02-T05`, `BE-P03-T04` | Admin order board query model |
| `BE-P04-T02` | `api` | `runtime` | `BE-P04-T01`, `BE-P03-T04`, `BE-P03-T05` | Admin order detail investigation API |
| `BE-P04-T03` | `scope-control` | `docs-only` | `BE-P04-T02` | Scope lock cho admin mutations ngoài MVP-1 |

<!-- mark-task: BE-P04-T01 -->
### BE-P04-T01 Chốt admin order board query model

- Type: `read-model`
- Verification mode: `runtime`
- Depends on: `BE-P02-T05`, `BE-P03-T04`
- Outputs: admin list filters, pagination semantics, và summary fields cho operational board view
- Touched paths: `apps/api/src/modules/admin/**`, `docs/plan/be/phase-04-admin-ops-read-models.md`
- Docs refs: `docs/06-admin-web-architecture.md`, `docs/08-api-realtime-contracts.md`
- Verification: board query contract đã nêu rõ filter/pagination/summary fields phục vụ triage và tránh N+1 semantics ở mức thiết kế
- Tests: integration tests cho filters, sorting, pagination, và privilege checks
- Beads: `type=task`, `labels=be,phase:p04,admin,reads`
- Definition of done: admin-web phase có thể dùng admin board contract hiện tại mà không phải phát minh fields hoặc query semantics mới

<!-- mark-task: BE-P04-T02 -->
### BE-P04-T02 Implement admin order detail investigation API

- Type: `api`
- Verification mode: `runtime`
- Depends on: `BE-P04-T01`, `BE-P03-T04`, `BE-P03-T05`
- Outputs: detailed admin order view gồm dispatch history, timeline, và các actor liên quan chính
- Touched paths: `apps/api/src/modules/admin/**`
- Docs refs: `docs/06-admin-web-architecture.md`, `docs/08-api-realtime-contracts.md`
- Verification: admin detail contract đã bao phủ investigation data chính và nêu rõ capability policy cho truy cập
- Tests: API tests cho admin access, forbidden access, và timeline consistency
- Beads: `type=task`, `labels=be,phase:p04,admin,api`
- Definition of done: ops investigation flow có thể hoàn thành qua API read models mà không cần DB shell truy vấn ad hoc

<!-- mark-task: BE-P04-T03 -->
### BE-P04-T03 Giữ admin operational actions ngoài baseline `MVP-1` cho đến khi docs gốc chấp thuận

- Type: `scope-control`
- Verification mode: `docs-only`
- Depends on: `BE-P04-T02`
- Outputs: non-goal note rõ cho `MVP-1`, và checklist yêu cầu update product docs, API contract, ADR trước khi thêm admin mutation
- Touched paths: `docs/plan/be/phase-04-admin-ops-read-models.md`, `docs/01-product-requirements.md`, `docs/08-api-realtime-contracts.md`
- Docs refs: `docs/01-product-requirements.md`, `docs/08-api-realtime-contracts.md`, `docs/11-adrs.md`
- Verification: phase file giữ rõ read-only scope cho admin ops trong MVP-1 và không thêm mutation endpoint ngoài docs gốc
- Tests: không áp dụng ngoài docs consistency checks
- Beads: `type=task`, `labels=be,phase:p04,admin,scope`
- Definition of done: các phase sau chỉ mở admin mutation khi đã có update tương ứng ở product docs, API contracts và ADR

## Mini Checklist Pass/Fail (Pass 3)

Quy ước đo lường: mỗi dòng là điều kiện pass/fail nhị phân; nếu có số lượng thì ưu tiên ngưỡng dạng >= N.

### BE-P04-T01

- [ ] Pass khi Board query model có filters, sorting, pagination semantics rõ.
- [ ] Pass khi Summary fields đủ phục vụ triage mà không cần raw DB query.
- [ ] Pass khi Có capability/privilege checks cho admin read access.

### BE-P04-T02

- [ ] Pass khi Admin detail API bao phủ timeline, dispatch history và actor context chính.
- [ ] Pass khi Access policy cho admin-only được mô tả và testable.
- [ ] Pass khi Timeline consistency có tiêu chí kiểm chứng rõ.

### BE-P04-T03

- [ ] Pass khi Scope note nêu rõ admin operations read-only trong MVP-1.
- [ ] Pass khi Có checklist yêu cầu cập nhật docs gốc trước khi mở mutation.
- [ ] Pass khi Không xuất hiện endpoint mutation mới trong phase baseline.
