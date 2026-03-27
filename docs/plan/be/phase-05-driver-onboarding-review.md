# Phase 05: Driver Onboarding Và Review

<!-- mark-phase: BE-P05 -->

## Mục Tiêu

Implement flow driver onboarding application và admin review mà không làm yếu đi auth model hoặc capability model hiện tại.

## Phụ Thuộc

- `BE-P01-T06`
- `BE-P01-T04`
- `BE-P04-T02`

## Ngoài Phạm Vi

- chat
- worker extraction

## Điều Kiện Đạt Phase

Driver application submission và admin review chạy end-to-end, có audit cho quyết định, và cập nhật capability an toàn.

<!-- mark-task: BE-P05-T01 -->
## BE-P05-T01 Chốt driver onboarding schema và review states

- Type: `schema`
- Verification mode: `runtime`
- Depends on: `BE-P01-T06`, `BE-P00-T03`
- Outputs: onboarding application schema, review status enum, và evidence metadata model
- Touched paths: `apps/api/prisma/**`, `docs/plan/be/phase-05-driver-onboarding-review.md`
- Docs refs: `docs/01-product-requirements.md`, `docs/07-data-model.md`
- Verification: onboarding schema đã nêu rõ state transitions và audit semantics, không để transition ẩn hoặc mơ hồ
- Tests: lên plan cho schema và state-transition fixtures
- Beads: `type=task`, `labels=be,phase:p05,onboarding,schema`
- Definition of done: submission/review tasks kế tiếp có thể dùng onboarding persistence semantics hiện tại mà không cần đổi schema nền

<!-- mark-task: BE-P05-T02 -->
## BE-P05-T02 Implement driver onboarding submission API

- Type: `api`
- Verification mode: `runtime`
- Depends on: `BE-P05-T01`, `BE-P01-T03`
- Outputs: authenticated application submit hoặc update endpoint cho account đủ điều kiện
- Touched paths: `apps/api/src/modules/onboarding/**`
- Docs refs: `docs/01-product-requirements.md`, `docs/08-api-realtime-contracts.md`
- Verification: submission contract đã mô tả rõ rules cho create/update/resubmit và duplicate/ineligible cases
- Tests: API tests cho submit, update, invalid input, và ineligible account case
- Beads: `type=task`, `labels=be,phase:p05,onboarding,api`
- Definition of done: onboarding flow có thể chạy qua API contract hiện tại mà không cần thao tác DB thủ công

<!-- mark-task: BE-P05-T03 -->
## BE-P05-T03 Implement admin review approve và reject flow

- Type: `application`
- Verification mode: `runtime`
- Depends on: `BE-P05-T02`, `BE-P01-T04`
- Outputs: admin review actions, audit entries, và safe capability update khi approve
- Touched paths: `apps/api/src/modules/onboarding/**`, `apps/api/src/modules/auth/**`
- Docs refs: `docs/01-product-requirements.md`, `docs/11-adrs.md`
- Verification: review decision contract đã ràng buộc approve/reject idempotency, authorization, capability update và audit trail
- Tests: integration tests cho approve, reject, repeated decision, và authorization failure
- Beads: `type=task`, `labels=be,phase:p05,onboarding,review`
- Definition of done: downstream driver flows có thể dựa vào identity state sau review mà không cần bypass auth/capability model

## Mini Checklist Pass/Fail (Pass 3)

Quy ước đo lường: mỗi dòng là điều kiện pass/fail nhị phân; nếu có số lượng thì ưu tiên ngưỡng dạng >= N.

### BE-P05-T01

- [ ] Pass khi Onboarding schema có states và transition rules rõ ràng.
- [ ] Pass khi Evidence metadata đủ cho audit review decisions.
- [ ] Pass khi Không có transition ẩn hoặc mơ hồ ngoài state model.

### BE-P05-T02

- [ ] Pass khi Submission API xử lý create/update/resubmit semantics nhất quán.
- [ ] Pass khi Có nhánh lỗi cho ineligible account và invalid payload.
- [ ] Pass khi Contract không cho phép bypass auth/session checks.

### BE-P05-T03

- [ ] Pass khi Approve/reject flow có idempotency behavior rõ cho repeated decisions.
- [ ] Pass khi Capability update khi approve được ràng buộc authorization.
- [ ] Pass khi Audit trail được ghi nhận đầy đủ cho mỗi review action.
