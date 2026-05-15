# Phase-Task Standard

Tài liệu này chuẩn hóa cách viết phase/task cho `docs/plan/foundation/` và `docs/plan/be/`.

## 1) Nguyên Tắc Phân Rã Công Việc

Nguyên tắc WBS theo deliverable:
- phase phải là một năng lực/cơ chế lớn được mở khóa
- task phải là work package nhỏ nhất có thể verify rõ ràng
- nếu task không testable thì chưa được claim

Task sizing guardrails:
- `1 task = 1 output verify được`
- touched paths chính: khuyến nghị <= 3-5
- direct dependencies: khuyến nghị <= 4
- một task không được trộn nhiều domain không liên quan

## 2) Phân Biệt AC vs DoD

- Acceptance Criteria (AC): điều kiện feature/task phải đạt theo nghiệp vụ
- Definition of Done (DoD): chất lượng và evidence tối thiểu để được close

Rule:
- task nào cũng phải có AC rõ
- close issue phải dựa trên DoD + verification mode

## 3) Verification Mode Contract

Giá trị hợp lệ:
- `docs-only`
- `current-state`
- `target-state`
- `runtime`

Ý nghĩa:
- `docs-only`: verify consistency docs/links/metadata
- `current-state`: verify theo command/artifact hiện có
- `target-state`: verify theo contract đích đã chốt
- `runtime`: verify bằng test/runtime checks

## 4) Template Cho Phase

```md
<!-- mark-phase: XXX-PNN -->
## XXX-PNN <Tên phase>

### Mục Tiêu
- năng lực được mở khóa sau phase

### In Scope
- ...

### Out Of Scope
- ...

### Dependencies
- phase/task cần có trước

### Acceptance Gate
- [ ] điều kiện 1
- [ ] điều kiện 2

### Task Index
| ID | Type | Verification mode | Depends on | Output |
|---|---|---|---|---|
```

## 5) Template Cho Task

```md
<!-- mark-task: XXX-PNN-TMM -->
### XXX-PNN-TMM <Action-oriented title>

- Type: `<docs|foundation|schema|api|...>`
- Verification mode: `<docs-only|current-state|target-state|runtime>`
- Depends on: `<task ids | none>`
- Outputs: `<single verifiable output>`
- Touched paths: `<main paths>`
- Docs refs: `<source docs links>`
- Verification: `<how to verify>`
- Tests: `<n/a | exact checks>`
- Beads: `type=task`, `labels=...`
- Definition of done: `<explicit close condition>`
```

## 6) Claim Gate (Task DoR)

Trước khi claim:
- output rõ và testable
- dependency rõ
- verification mode rõ
- docs refs đầy đủ
- touched paths expected đã rõ

## 7) Close Gate (Task DoD)

Trước khi close:
- touched paths actual
- verification commands + kết quả
- test note
- drift check
- follow-up issue nếu phát sinh scope mới

## 8) Không Được Làm

- task title mơ hồ
- dependency implicit
- đóng issue khi chưa có evidence
- đổi stable IDs chỉ để format
