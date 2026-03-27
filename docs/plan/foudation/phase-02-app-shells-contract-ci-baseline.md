# Phase 02: App Shells, Shared Packages, Và Verification Baseline

<!-- mark-phase: FDN-P02 -->

## Mục Tiêu

Scaffold baseline cho app shells, shared package boundaries, cùng ownership ban đầu của `infra/` và `tools/`, đồng thời chốt contract path và verification baseline để backend, mobile, và admin web có thể bắt đầu execution trên cùng một nền.

## Phụ Thuộc

- `FDN-P00-T02`
- `FDN-P00-T03`
- `FDN-P00-T04`
- `FDN-P01-T02`
- `FDN-P01-T03`
- `FDN-P01-T04`
- active docs `02`, `03`, `08`, `09`, `12`, `14`

## Ngoài Phạm Vi

- feature implementation của từng app
- screen flow của mobile hoặc admin web
- domain schema chi tiết của backend

## Điều Kiện Đạt Phase

Project shells, shared package boundaries, contract path, verification baseline, và `AGENTS.md` layering đã đủ rõ để mở execution plan theo app mà không phải quay lại quyết định nền.

<!-- mark-task: FDN-P02-T01 -->
## FDN-P02-T01 Chốt scaffold baseline cho `apps/api`, `apps/admin-web`, `apps/mobile`, `infra/`, và `tools/`

- Type: `foundation`
- Verification mode: `docs-only`
- Depends on: `FDN-P00-T03`, `FDN-P01-T02`
- Outputs: scaffold expectations cho từng app, root ownership, initial conventions cho `infra/` và `tools/`, và các path tối thiểu cần tồn tại trước feature work
- Touched paths: `docs/plan/foudation/*`, `docs/12-folder-structure.md`
- Docs refs: `docs/02-solution-overview.md`, `docs/12-folder-structure.md`, `docs/14-tech-stack-catalog.md`
- Verification: shell contract đã liệt kê tối thiểu paths cần có cho `apps/api`, `apps/admin-web`, `apps/mobile`, `infra/`, `tools/` và không chứa feature logic
- Tests: docs-only
- Beads: `type=task`, `labels=foundation,phase:p02,workspace`
- Definition of done: app-specific plans có thể bắt đầu mà không phát sinh câu hỏi về scaffold structure hoặc ownership nền

<!-- mark-task: FDN-P02-T02 -->
## FDN-P02-T02 Chốt shared package map và ownership rules cho contract dùng chung

- Type: `contracts`
- Verification mode: `docs-only`
- Depends on: `FDN-P00-T03`, `FDN-P02-T01`
- Outputs: shared package map, ownership rules, và nguyên tắc khi nào được tách logic sang package dùng chung
- Touched paths: `docs/plan/foudation/*`, `docs/12-folder-structure.md`
- Docs refs: `docs/03-system-architecture.md`, `docs/12-folder-structure.md`
- Verification: shared package map có rule rõ về điều kiện tách package và không có package dùng chung giả tạo cho một consumer
- Tests: docs-only
- Beads: `type=task`, `labels=foundation,phase:p02,contracts`
- Definition of done: app plans có tiêu chí quyết định rõ giữa giữ logic trong app và tách sang package chung

<!-- mark-task: FDN-P02-T03 -->
## FDN-P02-T03 Chốt contract generation và client consumption baseline dùng chung

- Type: `contracts`
- Verification mode: `docs-only`
- Depends on: `FDN-P02-T01`, `FDN-P02-T02`
- Outputs: source-of-truth path cho contracts, generated artifact expectations, và rule tiêu thụ contract giữa backend, mobile, và admin
- Touched paths: `docs/plan/foudation/*`, `docs/08-api-realtime-contracts.md`
- Docs refs: `docs/08-api-realtime-contracts.md`, `docs/14-tech-stack-catalog.md`
- Verification: contract pipeline đã chỉ rõ source-of-truth, generator flow, output artifacts và rule không chỉnh tay generated files
- Tests: docs-only
- Beads: `type=task`, `labels=foundation,phase:p02,contracts`
- Definition of done: backend/mobile/admin plans dùng chung một contract workflow mà không tạo thêm biến thể riêng

<!-- mark-task: FDN-P02-T04 -->
## FDN-P02-T04 Chốt repo-level CI và verification baseline sau scaffold

- Type: `test`
- Verification mode: `docs-only`
- Depends on: `FDN-P00-T04`, `FDN-P01-T04`, `FDN-P02-T01`
- Outputs: current-state CI fallback, target-state `nx affected` path, và repo-level verification expectations
- Touched paths: `docs/plan/foudation/*`, `docs/09-devops-runbook.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`
- Verification: CI baseline đã mô tả current-state fallback và target-state `nx affected` theo điều kiện activation rõ
- Tests: docs-only
- Beads: `type=task`, `labels=foundation,phase:p02,testing`
- Definition of done: app plans tham chiếu được canonical verification path mà không tranh cãi command set theo từng giai đoạn

<!-- mark-task: FDN-P02-T05 -->
## FDN-P02-T05 Chốt `AGENTS.md` layering cho root, docs, apps, infra, và tools

- Type: `docs`
- Verification mode: `docs-only`
- Depends on: `FDN-P02-T01`, `FDN-P02-T02`, `FDN-P02-T04`
- Outputs: root `AGENTS.md` ngắn và mang tính shared, cùng các local `AGENTS.md` đủ sát cho `docs`, `apps/api`, `apps/mobile`, `apps/admin-web`, `infra`, và `tools`
- Touched paths: `AGENTS.md`, `docs/AGENTS.md`, `docs/plan/AGENTS.md`, `apps/api/AGENTS.md`, `apps/mobile/AGENTS.md`, `apps/admin-web/AGENTS.md`, `infra/AGENTS.md`, `tools/AGENTS.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/12-folder-structure.md`, `docs/14-tech-stack-catalog.md`
- Verification: root/local AGENTS layering đã có ranh giới ownership rõ và không mâu thuẫn current-state/target-state guidance
- Tests: docs-only
- Beads: `type=task`, `labels=foundation,phase:p02,docs`
- Definition of done: agent vào từng scope chính có thể thực thi theo local context mà không phải quay lại root để suy luận lại scope

## Mini Checklist Pass/Fail (Pass 3)

Quy ước đo lường: mỗi dòng là điều kiện pass/fail nhị phân; nếu có số lượng thì ưu tiên ngưỡng dạng >= N.

### FDN-P02-T01

- [ ] Pass khi Shell contract liệt kê tối thiểu paths baseline cho `apps/api`, `apps/admin-web`, `apps/mobile`, `infra/`, `tools/`.
- [ ] Pass khi Không có feature logic chen vào scaffold baseline.
- [ ] Pass khi Có ownership note đủ để app-specific plans khởi động độc lập.

### FDN-P02-T02

- [ ] Pass khi Shared package map có tiêu chí tách package rõ ràng, không tách theo cảm tính.
- [ ] Pass khi Có rule chống shared package giả tạo chỉ phục vụ 1 consumer.
- [ ] Pass khi Có ownership boundary cho package lifecycle.

### FDN-P02-T03

- [ ] Pass khi Nêu rõ source-of-truth path cho contract và generated artifacts.
- [ ] Pass khi Có rule cấm chỉnh tay generated files.
- [ ] Pass khi Có mô tả consumer workflow chung cho backend, mobile, admin.

### FDN-P02-T04

- [ ] Pass khi CI baseline có cả fallback path (`current-state`) và `nx affected` path (`target-state`).
- [ ] Pass khi Có điều kiện activation rõ ràng để chuyển từ fallback sang target.
- [ ] Pass khi Không có command nào mâu thuẫn `docs/09` hoặc `docs/10`.

### FDN-P02-T05

- [ ] Pass khi Root và local `AGENTS.md` có boundary ownership rõ theo scope.
- [ ] Pass khi Không có mâu thuẫn `current-state`/`target-state` giữa root và local guides.
- [ ] Pass khi Agent có thể xác định scope thực thi từ local AGENTS mà không cần suy diễn thêm.
