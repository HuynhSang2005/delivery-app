# Execution Worksheet (Beads Claim/Close)

## Mục Đích

Worksheet này dùng trực tiếp cho team khi claim và close issue trong Beads.

Phạm vi:
- Foundation Plan: `FDN-P00` đến `FDN-P02`
- Backend Plan: `BE-P00` đến `BE-P06`

Nguồn chuẩn để đối chiếu:
- `docs/plan/foudation/README.md`
- `docs/plan/be/README.md`
- `docs/plan/AGENTS.md`
- `docs/plan/be/02-beads-seed-runbook.md`
- `docs/plan/foudation/02-beads-seed-runbook.md`

## Cách Dùng Nhanh

1. Tick checklist Claim Gate trước khi bắt đầu task.
2. Chạy task theo phase docs tương ứng.
3. Tick checklist Close Gate trước khi đóng issue.
4. Tick task trong phase khi issue đã close hợp lệ.

---

## Claim Gate (Bắt Buộc Trước Khi Làm)

- [ ] `mark-task` đã map 1:1 sang issue `type=task`
- [ ] Issue có `mark_task_id`
- [ ] Issue có `phase_id`
- [ ] Issue có `verification_mode`
- [ ] Issue có `depends_on` khớp docs
- [ ] Issue có `touched_paths_expected`
- [ ] Issue có `docs_refs`
- [ ] Issue có `definition_of_done`
- [ ] Issue đã được claim trong Beads

Thông tin claim:
- Beads issue id:
- Claimed by:
- Claim time:

## Close Gate (Bắt Buộc Trước Khi Đóng)

- [ ] Có `touched_paths_actual`
- [ ] Có `verification_commands` + kết quả
- [ ] Có test note (`n/a` hoặc danh sách checks)
- [ ] Có `drift_check`
- [ ] Có `handoff_note`
- [ ] Nếu có lệch docs: đã tạo follow-up issue
- [ ] Đã close issue trong Beads

Thông tin close:
- Closed by:
- Close time:
- Link evidence/log:

---

## Foundation Plan Checklist

### FDN-P00 Workspace Bootstrap Và Governance

- [ ] `FDN-P00-T01`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `FDN-P00-T02`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `FDN-P00-T03`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `FDN-P00-T04`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `FDN-QG-P00-*` PASS

### FDN-P01 Local Infra, Env, Và Tooling

- [ ] `FDN-P01-T01`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `FDN-P01-T02`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `FDN-P01-T03`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `FDN-P01-T04`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `FDN-QG-P01-*` PASS

### FDN-P02 App Shells, Contracts, CI Baseline

- [ ] `FDN-P02-T01`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `FDN-P02-T02`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `FDN-P02-T03`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `FDN-P02-T04`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `FDN-P02-T05`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `FDN-QG-P02-*` PASS

### Foundation Exit Criteria

- [ ] Tất cả task `FDN-P00..P02` đã close hợp lệ
- [ ] Không còn blocker mở giữa các phase
- [ ] AGENTS layering root -> docs -> plan vẫn nhất quán
- [ ] Follow-up issues cho phần deferred đã được tạo

---

## Backend Plan Checklist

### BE-P00 API Baseline Adaptation

- [ ] `BE-P00-T01`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P00-T02`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P00-T03`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P00-T04`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P00-T05`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-QG-P00-*` PASS

### BE-P01 Auth, Sessions, Accounts

- [ ] `BE-P01-T01`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P01-T02`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P01-T03`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P01-T04`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P01-T05`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P01-T06`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-QG-P01-*` PASS

### BE-P02 Pricing, Quotes, Orders

- [ ] `BE-P02-T01`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P02-T02`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P02-T03`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P02-T04`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P02-T05`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-QG-P02-*` PASS

### BE-P03 Presence, Dispatch, Realtime

- [ ] `BE-P03-T01`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P03-T02`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P03-T03`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P03-T04`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P03-T05`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P03-T06`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-QG-P03-*` PASS

### BE-P04 Admin Ops Read Models

- [ ] `BE-P04-T01`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P04-T02`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P04-T03`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-QG-P04-*` PASS

### BE-P05 Driver Onboarding Review

- [ ] `BE-P05-T01`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P05-T02`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P05-T03`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-QG-P05-*` PASS

### BE-P06 Chat, Worker, Hardening

- [ ] `BE-P06-T01`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P06-T02`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P06-T03`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P06-T04`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-QG-P06-*` PASS

### Backend Exit Criteria

- [ ] Tất cả task `BE-P00..P06` đã close hợp lệ
- [ ] Không còn blocker mở giữa các phase backend
- [ ] Mọi flow realtime quan trọng có reconciliation note với HTTP hoặc DB state
- [ ] Follow-up issues cho phần deferred đã được tạo

---

## Weekly KPI Snapshot (2-4 tuần)

Tuần:

- [ ] Task mapping integrity (1:1) cập nhật
- [ ] Evidence completeness cập nhật
- [ ] Reopen do drift cập nhật
- [ ] Blocker latency cập nhật

Ghi chú tuần:
