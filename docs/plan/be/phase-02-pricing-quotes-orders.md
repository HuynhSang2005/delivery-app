# Phase 02: Pricing, Quotes, Orders

<!-- mark-phase: BE-P02 -->

## Mục Tiêu

Implement quote-to-order baseline, gồm pricing rules, quote estimation, order creation, và lifecycle persistence.

## Phụ Thuộc

- `BE-P01-T03`
- `BE-P01-T04`
- `BE-P00-T03`
- `BE-P00-T04`
- `BE-P00-T05`

## Ngoài Phạm Vi

- realtime offer dispatch
- admin board read models
- order chat

## Điều Kiện Đạt Phase

Authenticated user có thể request quote, tạo order từ quote semantics đã chấp nhận, và xem order detail cùng status history ổn định.

<!-- mark-task: BE-P02-T01 -->
## BE-P02-T01 Chốt pricing rule version schema và policy

- Type: `schema`
- Verification mode: `runtime`
- Depends on: `BE-P00-T03`, `BE-P01-T03`
- Outputs: schema và policy cho pricing rule versions, quote inputs, và order pricing snapshots
- Touched paths: `apps/api/prisma/**`, `docs/plan/be/phase-02-pricing-quotes-orders.md`
- Docs refs: `docs/01-product-requirements.md`, `docs/07-data-model.md`
- Verification: pricing source-of-truth đã có version semantics và snapshot persistence rule rõ cho quote/order lifecycle
- Tests: lên plan cho deterministic fixture cases
- Beads: `type=task`, `labels=be,phase:p02,pricing,schema`
- Definition of done: pricing updates phase sau không làm thay đổi historical order snapshot semantics đã chốt

<!-- mark-task: BE-P02-T02 -->
## BE-P02-T02 Implement quote estimation use-case và API

- Type: `api`
- Verification mode: `runtime`
- Depends on: `BE-P02-T01`, `BE-P00-T04`
- Outputs: quote estimation service, request validation, và contract `POST /quotes`
- Touched paths: `apps/api/src/modules/quotes/**`, `apps/api/src/modules/orders/**`
- Docs refs: `docs/01-product-requirements.md`, `docs/08-api-realtime-contracts.md`
- Verification: quote contract đã ràng buộc rõ snapshot fields và validation/unhappy-path behavior cho payload hoặc geography không hợp lệ
- Tests: API và unit tests với deterministic pricing fixtures
- Beads: `type=task`, `labels=be,phase:p02,pricing,api`
- Definition of done: quote API có thể được consumer phases dùng trực tiếp để tạo order mà không cần suy diễn thêm contract

<!-- mark-task: BE-P02-T03 -->
## BE-P02-T03 Chốt order aggregate schema và lifecycle invariants

- Type: `schema`
- Verification mode: `runtime`
- Depends on: `BE-P02-T01`
- Outputs: orders, order status history, idempotency, và lifecycle enum baseline
- Touched paths: `apps/api/prisma/**`, `docs/plan/be/phase-02-pricing-quotes-orders.md`
- Docs refs: `docs/01-product-requirements.md`, `docs/07-data-model.md`, `docs/11-adrs.md`
- Verification: order lifecycle đã map đủ happy/unhappy paths trong docs, gồm cả baseline `NO_DRIVER_FOUND`
- Tests: lên plan cho state transition matrix cases
- Beads: `type=task`, `labels=be,phase:p02,orders,schema`
- Definition of done: dispatch/admin phases có thể dùng order persistence model hiện có mà không phát sinh schema churn nền

<!-- mark-task: BE-P02-T04 -->
## BE-P02-T04 Implement order creation với idempotency và snapshot persistence

- Type: `application`
- Verification mode: `runtime`
- Depends on: `BE-P02-T02`, `BE-P02-T03`, `BE-P01-T03`
- Outputs: order creation use-case, idempotency enforcement, và initial history entries
- Touched paths: `apps/api/src/modules/orders/**`
- Docs refs: `docs/04-backend-architecture.md`, `docs/08-api-realtime-contracts.md`
- Verification: idempotency semantics và snapshot persistence đã được quy định kiểm chứng được cho create-order flow
- Tests: API tests cho happy path, idempotent replay, và invalid quote hoặc order payload cases
- Beads: `type=task`, `labels=be,phase:p02,orders,application`
- Definition of done: phase dispatch có thể kích hoạt trên order creation flow hiện tại mà không cần patch lại semantics tạo order

<!-- mark-task: BE-P02-T05 -->
## BE-P02-T05 Implement order detail và timeline read APIs

- Type: `api`
- Verification mode: `runtime`
- Depends on: `BE-P02-T04`, `BE-P01-T04`
- Outputs: order detail, status timeline, và requester visibility rules
- Touched paths: `apps/api/src/modules/orders/**`
- Docs refs: `docs/08-api-realtime-contracts.md`
- Verification: access policy và timeline semantics cho order detail/list đã rõ ràng và kiểm chứng được theo actor matrix
- Tests: API tests cho requester access, forbidden access, và timeline ordering
- Beads: `type=task`, `labels=be,phase:p02,orders,reads`
- Definition of done: mobile/admin phases có thể dùng order detail contract hiện tại mà không thêm custom mapping layer nền

## Mini Checklist Pass/Fail (Pass 3)

Quy ước đo lường: mỗi dòng là điều kiện pass/fail nhị phân; nếu có số lượng thì ưu tiên ngưỡng dạng >= N.

### BE-P02-T01

- [ ] Pass khi Pricing rules có version semantics rõ và không ghi đè historical snapshot.
- [ ] Pass khi Quote inputs map được sang schema fields cụ thể.
- [ ] Pass khi Có policy cho snapshot persistence khi tạo order.

### BE-P02-T02

- [ ] Pass khi `POST /quotes` có contract rõ cho happy path và invalid/unhappy paths.
- [ ] Pass khi Quote response chứa snapshot fields cần cho order creation.
- [ ] Pass khi Deterministic fixtures đủ để tái lập kết quả ước tính trong test.

### BE-P02-T03

- [ ] Pass khi Order lifecycle liệt kê trạng thái chính và transition hợp lệ.
- [ ] Pass khi Có baseline path cho `NO_DRIVER_FOUND`.
- [ ] Pass khi Idempotency semantics được phản ánh ở schema hoặc unique constraints.

### BE-P02-T04

- [ ] Pass khi Create-order flow xử lý idempotent replay nhất quán.
- [ ] Pass khi Snapshot persistence không lệch so với quote semantics đã chốt.
- [ ] Pass khi Initial history entries được ghi theo thứ tự kiểm chứng được.

### BE-P02-T05

- [ ] Pass khi Order detail/timeline có actor visibility rules rõ ràng.
- [ ] Pass khi Timeline ordering semantics có thể kiểm thử deterministic.
- [ ] Pass khi Contract đủ ổn định cho mobile/admin reuse không cần custom translation.
