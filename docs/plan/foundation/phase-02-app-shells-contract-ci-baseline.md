# Phase 02: App Shells, Shared Packages, Và Verification Baseline

<!-- mark-phase: FDN-P02 -->

## Mục Tiêu

Scaffold baseline cho app shells, shared package boundaries, cùng ownership ban đầu của `infra/` và `tools/`, đồng thời chốt contract path và verification baseline để backend, mobile, và admin web có thể bắt đầu execution trên cùng một nền.

## In Scope

- scaffold baseline cho apps và scope dùng chung
- shared package map + ownership rules
- contract generation và client consumption baseline
- CI/verification baseline theo current-state và target-state
- layering contract cho AGENTS ở các level

## Dependencies

- `FDN-P00-T02`
- `FDN-P00-T03`
- `FDN-P00-T04`
- `FDN-P01-T02`
- `FDN-P01-T03`
- `FDN-P01-T04`
- active docs `02`, `03`, `08`, `09`, `12`, `14`

## Out Of Scope

- feature implementation của từng app
- screen flow của mobile hoặc admin web
- domain schema chi tiết của backend

## Acceptance Gate

- [x] app shell contract đủ rõ cho `apps/api`, `apps/admin-web`, `apps/mobile`
- [x] contract và shared boundary rules nhất quán toàn repo
- [x] CI/verification baseline tách rõ current-state và target-state
- [x] AGENTS layering đủ rõ để mở app execution plans

## Execution Status

- [x] `FDN-P02-T01` (Beads: `delivery-app-dr2`) - closed
- [x] `FDN-P02-T02` (Beads: `delivery-app-qbo`) - closed
- [x] `FDN-P02-T03` (Beads: `delivery-app-f7w`) - closed
- [x] `FDN-P02-T04` (Beads: `delivery-app-v21`) - closed
- [x] `FDN-P02-T05` (Beads: `delivery-app-0l5`) - closed
- [x] `FDN-P02` phase epic (Beads: `delivery-app-3f4`) - closed

## Handoff Note

- P02 close theo `docs-only` verification mode.
- Runtime bootstrap de xuong `FDN-R01` de dong bo workspace Nx executable, local Docker baseline, va pre-commit tooling mandatory gate truoc BE implementation.

## Task Index

| ID | Type | Verification mode | Depends on | Output |
|---|---|---|---|---|
| `FDN-P02-T01` | `foundation` | `docs-only` | `FDN-P00-T03`, `FDN-P01-T02` | Scaffold baseline cho apps/infra/tools |
| `FDN-P02-T02` | `contracts` | `docs-only` | `FDN-P00-T03`, `FDN-P02-T01` | Shared package map + ownership rules |
| `FDN-P02-T03` | `contracts` | `docs-only` | `FDN-P02-T01`, `FDN-P02-T02` | Contract generation + client consumption baseline |
| `FDN-P02-T04` | `test` | `docs-only` | `FDN-P00-T04`, `FDN-P01-T04`, `FDN-P02-T01` | Repo-level CI/verification baseline |
| `FDN-P02-T05` | `docs` | `docs-only` | `FDN-P02-T01`, `FDN-P02-T02`, `FDN-P02-T04` | AGENTS layering contract |

<!-- mark-task: FDN-P02-T01 -->
### FDN-P02-T01 Chốt scaffold baseline cho `apps/api`, `apps/admin-web`, `apps/mobile`, `infra/`, và `tools/`

- Type: `foundation`
- Verification mode: `docs-only`
- Depends on: `FDN-P00-T03`, `FDN-P01-T02`
- Outputs: scaffold expectations cho từng app, root ownership, initial conventions cho `infra/` và `tools/`, và các path tối thiểu cần tồn tại trước feature work
- Touched paths: `docs/plan/foundation/*`, `docs/12-folder-structure.md`
- Docs refs: `docs/02-solution-overview.md`, `docs/12-folder-structure.md`, `docs/14-tech-stack-catalog.md`
- Verification: shell contract đã liệt kê tối thiểu paths cần có cho `apps/api`, `apps/admin-web`, `apps/mobile`, `infra/`, `tools/` và không chứa feature logic
- Tests: n/a (docs-only)
- Beads: `type=task`, `labels=foundation,phase:p02,workspace`
- Definition of done: app-specific plans có thể bắt đầu mà không phát sinh câu hỏi về scaffold structure hoặc ownership nền

<!-- mark-task: FDN-P02-T02 -->
### FDN-P02-T02 Chốt shared package map và ownership rules cho contract dùng chung

- Type: `contracts`
- Verification mode: `docs-only`
- Depends on: `FDN-P00-T03`, `FDN-P02-T01`
- Outputs: shared package map, ownership rules, và nguyên tắc khi nào được tách logic sang package dùng chung
- Touched paths: `docs/plan/foundation/*`, `docs/12-folder-structure.md`
- Docs refs: `docs/03-system-architecture.md`, `docs/12-folder-structure.md`
- Verification: shared package map có rule rõ về điều kiện tách package và không có package dùng chung giả tạo cho một consumer
- Tests: n/a (docs-only)
- Beads: `type=task`, `labels=foundation,phase:p02,contracts`
- Definition of done: app plans có tiêu chí quyết định rõ giữa giữ logic trong app và tách sang package chung

<!-- mark-task: FDN-P02-T03 -->
### FDN-P02-T03 Chốt contract generation và client consumption baseline dùng chung

- Type: `contracts`
- Verification mode: `docs-only`
- Depends on: `FDN-P02-T01`, `FDN-P02-T02`
- Outputs: source-of-truth path cho contracts, generated artifact expectations, và rule tiêu thụ contract giữa backend, mobile, và admin
- Touched paths: `docs/plan/foundation/*`, `docs/08-api-realtime-contracts.md`
- Docs refs: `docs/08-api-realtime-contracts.md`, `docs/14-tech-stack-catalog.md`
- Verification: contract pipeline đã chỉ rõ source-of-truth, generator flow, output artifacts và rule không chỉnh tay generated files
- Tests: n/a (docs-only)
- Beads: `type=task`, `labels=foundation,phase:p02,contracts`
- Definition of done: backend/mobile/admin plans dùng chung một contract workflow mà không tạo thêm biến thể riêng

<!-- mark-task: FDN-P02-T04 -->
### FDN-P02-T04 Chốt repo-level CI và verification baseline sau scaffold

- Type: `test`
- Verification mode: `docs-only`
- Depends on: `FDN-P00-T04`, `FDN-P01-T04`, `FDN-P02-T01`
- Outputs: current-state CI fallback, target-state `nx affected` path, và repo-level verification expectations
- Touched paths: `docs/plan/foundation/*`, `docs/09-devops-runbook.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`
- Verification: CI baseline đã mô tả current-state fallback và target-state `nx affected` theo điều kiện activation rõ
- Tests: n/a (docs-only)
- Beads: `type=task`, `labels=foundation,phase:p02,testing`
- Definition of done: app plans tham chiếu được canonical verification path mà không tranh cãi command set theo từng giai đoạn

<!-- mark-task: FDN-P02-T05 -->
### FDN-P02-T05 Chốt `AGENTS.md` layering cho root, docs, apps, infra, và tools

- Type: `docs`
- Verification mode: `docs-only`
- Depends on: `FDN-P02-T01`, `FDN-P02-T02`, `FDN-P02-T04`
- Outputs: root `AGENTS.md` ngắn và mang tính shared, cùng các local `AGENTS.md` đủ sát cho `docs`, `apps/api`, `apps/mobile`, `apps/admin-web`, `infra`, và `tools`
- Touched paths: `AGENTS.md`, `docs/AGENTS.md`, `docs/plan/AGENTS.md`, `apps/api/AGENTS.md`, `apps/mobile/AGENTS.md`, `apps/admin-web/AGENTS.md`, `infra/AGENTS.md`, `tools/AGENTS.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/12-folder-structure.md`, `docs/14-tech-stack-catalog.md`
- Verification: root/local AGENTS layering đã có ranh giới ownership rõ và không mâu thuẫn current-state/target-state guidance
- Tests: n/a (docs-only)
- Beads: `type=task`, `labels=foundation,phase:p02,docs`
- Definition of done: agent vào từng scope chính có thể thực thi theo local context mà không phải quay lại root để suy luận lại scope

## Mini Checklist Pass/Fail (Pass 3)

Quy ước đo lường: mỗi dòng là điều kiện pass/fail nhị phân; nếu có số lượng thì ưu tiên ngưỡng dạng >= N.

### FDN-P02-T01

- [x] Pass khi Shell contract liệt kê tối thiểu paths baseline cho `apps/api`, `apps/admin-web`, `apps/mobile`, `infra/`, `tools/`.
- [x] Pass khi Không có feature logic chen vào scaffold baseline.
- [x] Pass khi Có ownership note đủ để app-specific plans khởi động độc lập.

### FDN-P02-T02

- [x] Pass khi Shared package map có tiêu chí tách package rõ ràng, không tách theo cảm tính.
- [x] Pass khi Có rule chống shared package giả tạo chỉ phục vụ 1 consumer.
- [x] Pass khi Có ownership boundary cho package lifecycle.

### FDN-P02-T03

- [x] Pass khi Nêu rõ source-of-truth path cho contract và generated artifacts.
- [x] Pass khi Có rule cấm chỉnh tay generated files.
- [x] Pass khi Có mô tả consumer workflow chung cho backend, mobile, admin.

### FDN-P02-T04

- [x] Pass khi CI baseline có cả fallback path (`current-state`) và `nx affected` path (`target-state`).
- [x] Pass khi Có điều kiện activation rõ ràng để chuyển từ fallback sang target.
- [x] Pass khi Không có command nào mâu thuẫn `docs/09` hoặc `docs/10`.

### FDN-P02-T05

- [x] Pass khi Root và local `AGENTS.md` có boundary ownership rõ theo scope.
- [x] Pass khi Không có mâu thuẫn `current-state`/`target-state` giữa root và local guides.
- [x] Pass khi Agent có thể xác định scope thực thi từ local AGENTS mà không cần suy diễn thêm.
