# Phase 00: Workspace Bootstrap Và Governance

<!-- mark-phase: FDN-P00 -->

## Mục Tiêu

Chốt workspace root baseline để repo có chung một contract về package manager, project registration, target naming, và ownership trước khi scaffold hoặc implement từng app.

## Phụ Thuộc

- active docs `02`, `03`, `09`, `11`, `12`, `14`

## Ngoài Phạm Vi

- business logic của backend
- UI flow của mobile hoặc admin web
- local infra chi tiết như Docker compose và env secrets

## Điều Kiện Đạt Phase

Root workspace không còn mơ hồ về current state so với target Nx state, và mọi app plan có thể bám vào cùng một governance model.

<!-- mark-task: FDN-P00-T01 -->
## FDN-P00-T01 Chốt root workspace contract và package manager strategy

- Type: `foundation`
- Verification mode: `docs-only`
- Depends on: none
- Outputs: root workspace contract, package manager rule dùng `bun`, và current-state versus target-state framing
- Touched paths: `docs/plan/foudation/*`, `AGENTS.md`
- Docs refs: `docs/02-solution-overview.md`, `docs/09-devops-runbook.md`, `docs/12-folder-structure.md`
- Verification: `docs/02`, `docs/09`, `docs/12` và `AGENTS.md` đã ghi rõ current-state, target-state, và transition path mà không mâu thuẫn nhau
- Tests: n/a, docs-only
- Beads: `type=task`, `labels=foundation,phase:p00,workspace`
- Definition of done: các task FDN-P01+ có thể trích dẫn package manager rule và root workspace boundary mà không cần định nghĩa lại

<!-- mark-task: FDN-P00-T02 -->
## FDN-P00-T02 Chốt Nx governance cho projects, targets, và boundaries

- Type: `tooling`
- Verification mode: `docs-only`
- Depends on: `FDN-P00-T01`
- Outputs: target naming conventions, project ownership rules, boundary tags, và nguyên tắc `affected`
- Touched paths: `docs/plan/foudation/*`, `AGENTS.md`
- Docs refs: `docs/03-system-architecture.md`, `docs/12-folder-structure.md`, `docs/14-tech-stack-catalog.md`
- Verification: governance map đã nêu rõ target naming cho projects, targets, tags, affected rules và không có biến thể khác trong `docs/plan/*`
- Tests: n/a, docs-only
- Beads: `type=task`, `labels=foundation,phase:p00,tooling`
- Definition of done: FDN-P02-T01 có thể scaffold theo governance map hiện tại mà không phát sinh nguyên tắc mới

<!-- mark-task: FDN-P00-T03 -->
## FDN-P00-T03 Chốt project registry và ownership map cho apps, packages, `infra/`, và `tools/`

- Type: `foundation`
- Verification mode: `docs-only`
- Depends on: `FDN-P00-T02`
- Outputs: project registry cho `apps/api`, `apps/admin-web`, `apps/mobile`, shared packages, `infra/`, và `tools/` với ownership rõ
- Touched paths: `docs/plan/foudation/*`, `docs/12-folder-structure.md`
- Docs refs: `docs/02-solution-overview.md`, `docs/12-folder-structure.md`
- Verification: project registry đã liệt kê tối thiểu `apps/api`, `apps/admin-web`, `apps/mobile`, `infra/`, `tools/` và ownership cho từng nhóm
- Tests: n/a, docs-only
- Beads: `type=task`, `labels=foundation,phase:p00,workspace`
- Definition of done: BE-P00-T01 và FDN-P02-T01 có thể bắt đầu mà không cần hỏi thêm về ownership project hoặc boundary

<!-- mark-task: FDN-P00-T04 -->
## FDN-P00-T04 Chốt current-state verification matrix và target-state repo verification

- Type: `test`
- Verification mode: `docs-only`
- Depends on: `FDN-P00-T01`, `FDN-P00-T02`
- Outputs: verification matrix phân biệt command khả dụng hiện tại với command kỳ vọng sau khi root Nx baseline hoàn tất
- Touched paths: `docs/plan/foudation/*`, `docs/09-devops-runbook.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`
- Verification: verification matrix đã tách rõ current-state fallback commands và target-state `nx affected` commands theo từng điều kiện
- Tests: docs-only
- Beads: `type=task`, `labels=foundation,phase:p00,testing`
- Definition of done: các plan theo app có thể ghi rõ verification mode mà không mâu thuẫn runbook

## Mini Checklist Pass/Fail (Pass 3)

Quy ước đo lường: mỗi dòng là điều kiện pass/fail nhị phân; nếu có số lượng thì ưu tiên ngưỡng dạng >= N.

### FDN-P00-T01

- [ ] Pass khi Nêu tách biệt rõ `current-state` và `target-state` trong tối thiểu 2 câu độc lập.
- [ ] Pass khi Có tối thiểu 3 tham chiếu hợp lệ tới `docs/02`, `docs/09`, `docs/12`, `AGENTS.md`.
- [ ] Pass khi Không có wording cho phép dùng package manager khác `bun` trong baseline.

### FDN-P00-T02

- [ ] Pass khi Nêu đủ 4 nhóm governance: project naming, target naming, tags, `affected` rules.
- [ ] Pass khi Không còn biến thể target names mâu thuẫn với chuẩn `lint|typecheck|test|build|e2e|smoke`.
- [ ] Pass khi Có tiêu chí boundary đủ rõ để app plan không phải tự phát minh thêm rule.

### FDN-P00-T03

- [ ] Pass khi Registry liệt kê tối thiểu 5 scope: `apps/api`, `apps/admin-web`, `apps/mobile`, `infra/`, `tools/`.
- [ ] Pass khi Mỗi scope có một ownership note hoặc execution boundary cụ thể.
- [ ] Pass khi Không còn mô tả registry dựa trên scaffold ngẫu nhiên thay vì docs baseline.

### FDN-P00-T04

- [ ] Pass khi Matrix có cả nhánh `current-state` và `target-state` với điều kiện chuyển trạng thái rõ ràng.
- [ ] Pass khi Có ít nhất 1 command-path fallback theo app-level cho current-state.
- [ ] Pass khi Có ít nhất 1 command-path `nx affected` cho target-state, không claim sớm khi chưa đủ foundation.
