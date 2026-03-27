# Phase 01: Auth, Sessions, Accounts, Driver Identity

<!-- mark-phase: BE-P01 -->

## Mục Tiêu

Implement baseline auth và identity chuẩn của backend: accounts, capabilities, sessions, và các primitive identity cho driver.

## Phụ Thuộc

- `BE-P00-T01`
- `BE-P00-T03`
- `BE-P00-T04`
- `BE-P00-T05`

## Ngoài Phạm Vi

- route-aware dispatch ranking
- chat
- worker extraction

## Điều Kiện Đạt Phase

Session lifecycle cho authenticated user chạy end-to-end và identity semantics đủ ổn định cho order cùng dispatch ở các phase sau.

<!-- mark-task: BE-P01-T01 -->
## BE-P01-T01 Chốt auth và account schema baseline

- Type: `schema`
- Verification mode: `runtime`
- Depends on: `BE-P00-T03`
- Outputs: schema cho accounts, account capabilities, auth sessions, driver profiles, và các enum bắt buộc
- Touched paths: `apps/api/prisma/**`, `docs/plan/be/phase-01-auth-session-accounts.md`
- Docs refs: `docs/07-data-model.md`, `docs/11-adrs.md`
- Verification: schema đã phản ánh capability-based access và backend-owned session semantics theo docs gốc, không quay về single-role model
- Tests: lên plan cho schema migration smoke case
- Beads: `type=task`, `labels=be,phase:p01,auth,schema`
- Definition of done: BE-P01-T02/T03/T04 có thể dùng schema hiện tại cho `/auth/me`, capability checks và refresh/logout flows mà không cần đổi schema

<!-- mark-task: BE-P01-T02 -->
## BE-P01-T02 Implement dev-login và session issuance flow

- Type: `api`
- Verification mode: `runtime`
- Depends on: `BE-P01-T01`, `BE-P00-T04`
- Outputs: dev-login endpoint, session issuance service, bearer-token transport baseline cho mobile/admin, socket handshake auth contract, và response contract
- Touched paths: `apps/api/src/modules/auth/**`
- Docs refs: `docs/01-product-requirements.md`, `docs/08-api-realtime-contracts.md`
- Verification: contract và test plan đã ràng buộc login tạo canonical backend session state, không dùng session source ngoài backend
- Tests: API tests cho happy path, invalid payload, và disabled-account case
- Beads: `type=task`, `labels=be,phase:p01,auth,api`
- Definition of done: seeded account có thể hoàn tất dev-login flow theo contract đã chốt và dùng session cho bước verify kế tiếp

<!-- mark-task: BE-P01-T03 -->
## BE-P01-T03 Implement refresh, logout, và auth-me truth endpoints

- Type: `api`
- Verification mode: `runtime`
- Depends on: `BE-P01-T02`
- Outputs: refresh, logout, và `/auth/me` endpoints với session semantics ổn định
- Touched paths: `apps/api/src/modules/auth/**`
- Docs refs: `docs/08-api-realtime-contracts.md`, `docs/11-adrs.md`
- Verification: `/auth/me`, refresh, logout đã có semantics rõ và đối chiếu được với backend session state trong verification plan
- Tests: API tests cho refresh rotation, logout invalidation, expired session, và unauthenticated access
- Beads: `type=task`, `labels=be,phase:p01,auth,session`
- Definition of done: BE-P02+ authenticated flows có thể dựa vào session lifecycle hiện tại mà không phải mở lại auth foundation

<!-- mark-task: BE-P01-T04 -->
## BE-P01-T04 Implement capability guard và admin authorization guards

- Type: `application`
- Verification mode: `runtime`
- Depends on: `BE-P01-T01`, `BE-P01-T03`
- Outputs: shared auth context, capability guard, admin guard, và route-level authorization policy
- Touched paths: `apps/api/src/modules/auth/**`, `apps/api/src/shared/**`
- Docs refs: `docs/04-backend-architecture.md`, `docs/11-adrs.md`
- Verification: verification matrix đã chỉ rõ guard behavior cho user/driver/admin theo capability semantics, không fallback về single-role
- Tests: authorization matrix tests cho user, driver-capable user, và admin
- Beads: `type=task`, `labels=be,phase:p01,authz`
- Definition of done: downstream modules dùng được capability guard contract hiện tại mà không cần custom authorization workaround

<!-- mark-task: BE-P01-T05 -->
## BE-P01-T05 Chốt boundary cho OTP proofing mà không thay canonical session

- Type: `foundation`
- Verification mode: `target-state`
- Depends on: `BE-P01-T03`
- Outputs: interface và docs baseline cho flow exchange từ Firebase OTP proofing nếu cần
- Touched paths: `apps/api/src/modules/auth/**`, `docs/plan/be/phase-01-auth-session-accounts.md`
- Docs refs: `docs/01-product-requirements.md`, `docs/04-backend-architecture.md`, `docs/08-api-realtime-contracts.md`, `docs/11-adrs.md`
- Verification: OTP boundary đã ghi rõ là optional input proofing layer và không thay thế canonical backend session model
- Tests: contract và unit tests cho token-exchange boundary nếu implement
- Beads: `type=task`, `labels=be,phase:p01,auth,otp`
- Definition of done: OTP work phase sau có thể tích hợp thêm mà vẫn giữ nguyên session/source-of-truth semantics của backend

<!-- mark-task: BE-P01-T06 -->
## BE-P01-T06 Implement baseline đọc và cập nhật driver identity

- Type: `api`
- Verification mode: `runtime`
- Depends on: `BE-P01-T01`, `BE-P01-T04`
- Outputs: driver profile fetch và update baseline cho account đã có driver capability
- Touched paths: `apps/api/src/modules/drivers/**`
- Docs refs: `docs/07-data-model.md`, `docs/08-api-realtime-contracts.md`
- Verification: driver identity contract đã tách rõ profile concerns với session concerns và áp dụng capability checks nhất quán
- Tests: API tests cho own-profile update, forbidden update, và validation failure
- Beads: `type=task`, `labels=be,phase:p01,drivers`
- Definition of done: BE-P03 và BE-P05 có thể tái sử dụng driver identity surface hiện có mà không cần đổi contract nền

## Mini Checklist Pass/Fail (Pass 3)

Quy ước đo lường: mỗi dòng là điều kiện pass/fail nhị phân; nếu có số lượng thì ưu tiên ngưỡng dạng >= N.

### BE-P01-T01

- [ ] Pass khi Schema phản ánh capability model, không thu gọn về single-role.
- [ ] Pass khi Session entities đủ để hỗ trợ `/auth/me`, refresh, logout.
- [ ] Pass khi Enum và quan hệ chính có thể map trực tiếp từ `docs/07`.

### BE-P01-T02

- [ ] Pass khi Dev-login tạo canonical backend session state, không phụ thuộc auth source ngoài backend.
- [ ] Pass khi Contract có nhánh lỗi cho payload sai và account disabled.
- [ ] Pass khi Có mapping bearer-token usage cho HTTP và socket handshake.

### BE-P01-T03

- [ ] Pass khi Refresh/logout có semantics invalidation rõ ràng và kiểm chứng được.
- [ ] Pass khi `/auth/me` phản ánh session truth sau các thao tác refresh/logout.
- [ ] Pass khi Có coverage cho expired-session và unauthenticated access.

### BE-P01-T04

- [ ] Pass khi Capability guard có actor matrix tối thiểu: user, driver-capable user, admin.
- [ ] Pass khi Không fallback về single-role decision path.
- [ ] Pass khi Route-level policy có thể tái sử dụng cho modules downstream.

### BE-P01-T05

- [ ] Pass khi OTP được mô tả là proofing input optional, không phải canonical auth source.
- [ ] Pass khi Token-exchange boundary có hợp đồng rõ cho success và failure.
- [ ] Pass khi Không xuất hiện wording thay thế backend-owned session model.

### BE-P01-T06

- [ ] Pass khi Driver profile read/update có capability checks nhất quán.
- [ ] Pass khi Profile concerns tách biệt khỏi session concerns.
- [ ] Pass khi Có coverage cho forbidden và validation failure cases.
