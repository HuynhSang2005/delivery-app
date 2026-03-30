# Operations Handbook (Spec-Kit + Beads)

## 1) Mục đích

Tài liệu này là handbook vận hành chính cho solo dev và AI-agent trong phạm vi docs/plan.
Mục tiêu:
- giữ planning và execution tracking tách rõ ràng
- giảm scope drift
- đảm bảo context và memory được giữ qua nhiều session

## 2) Trách nhiệm theo lớp

- Source of truth: docs gốc, ADRs, và AGENTS contracts.
- Planning layer: Spec-Kit artifacts (`spec`, `plan`, `tasks`).
- Execution tracking layer: Beads issue graph (`ready`, `claim`, `close`, blocker deps).

Quy tắc bắt buộc:
- Không dùng Beads để thay docs hoặc Spec-Kit artifacts.
- Không dùng Spec-Kit để thay issue lifecycle runtime.

## 3) SOP đầu phiên làm việc

1. Đọc context theo scope:
   - root AGENTS
   - AGENTS local gần file đang sửa
   - source-of-truth docs liên quan
2. Chạy health check và nạp context Beads:
   - `bd doctor`
   - `bd prime`
3. Nếu cần restore state trên máy mới:
   - `bd backup fetch-git --branch beads-backup --remote origin`
4. Lấy task sẵn sàng:
   - `bd ready --json`

## 4) Vòng lặp thực thi chuẩn

1. Làm rõ cần build gì:
   - dùng Spec-Kit (`specify -> plan -> tasks`) hoặc cập nhật docs/plan tương ứng
2. Xác nhận task đủ điều kiện:
   - metadata đầy đủ
   - dependency rõ ràng
   - verification mode rõ ràng
3. Claim task 1:1:
   - `bd update <id> --claim --json`
4. Thực thi một task tại một thời điểm:
   - giữ touched paths đúng scope task
5. Verify đúng mode:
   - `docs-only`, `current-state`, `target-state`, `runtime`
6. Ghi evidence vào issue:
   - touched paths actual
   - verification commands + kết quả
   - test notes
   - drift check
7. Close issue:
   - `bd close <id> --reason "Completed" --json`

## 5) Ma trận quyết định: Spec-Kit hay Beads

Dùng Spec-Kit khi câu hỏi là:
- cần build cái gì
- acceptance criteria nào
- tách task ra sao
- dependency graph planning như thế nào

Dùng Beads khi câu hỏi là:
- task nào ready để làm
- task nào đang block
- đã claim chưa
- close đã đủ evidence chưa

## 6) Stable ID rules

- Phase marker: `<!-- mark-phase: XXX -->`
- Task marker: `<!-- mark-task: XXX -->`
- Check marker: `<!-- mark-check: XXX -->`

Không đổi stable IDs chỉ để làm đẹp.
Nếu bắt buộc đổi, phải có migration note và mapping cũ -> mới.

## 7) Metadata bắt buộc cho task

Mỗi task phải có đủ:
- `Type`
- `Verification mode`
- `Depends on`
- `Outputs`
- `Touched paths`
- `Docs refs`
- `Verification`
- `Tests`
- `Beads`
- `Definition of done`

Không đủ metadata thì chưa đủ điều kiện claim.

## 8) Verification mode hợp lệ

- `docs-only`
- `current-state`
- `target-state`
- `runtime`

## 9) Task granularity guardrails

Task đạt chuẩn khi:
- đúng nguyên tắc `1 task = 1 output verify được`
- title là hành động cụ thể
- touched paths không trải rộng không liên quan

Heuristic khuyến nghị:
- touched paths chính: tối đa 3-5
- direct dependencies: tối đa 4
- không gộp nhiều domain trong một task

Nếu vượt ngưỡng, tách task thành các task con.

## 10) Forbidden vague task titles

Không dùng title mơ hồ:
- "hoàn thiện X"
- "tối ưu toàn bộ Y"
- "dựng hệ thống Z"

Nên dùng title có output rõ:
- "Add session issuance for dev login endpoint"
- "Define deterministic geo fixtures for dispatch smoke"

## 11) Dependency rules

- Chỉ khai báo direct dependency.
- Không để dependency implicit.
- Không để dependency cycle.

Nếu task bị block bởi việc mới:
- tạo issue mới với `discovered-from:<parent-id>`
- cập nhật docs nếu có scope drift

## 12) Beads mapping rules

- Mỗi `mark-task` map 1:1 sang issue `type=task`.
- Issue cần fields:
  - `mark_task_id`
  - `verification_mode`
  - `depends_on`
  - `touched_paths_expected`
  - `docs_refs`
  - `definition_of_done`

Close issue chỉ khi có:
- `touched_paths_actual`
- `verification_commands` + kết quả
- test notes
- drift check (và follow-up issue nếu cần)

## 13) Discovered-work protocol

Nếu phát sinh việc mới ngoài scope task đang claim:
1. Không nhét vào issue hiện tại.
2. Tạo issue mới với dependency: `discovered-from:<parent-id>`.
3. Nếu việc mới đổi scope hoặc acceptance docs, cập nhật docs trước.
4. Tiếp tục issue hiện tại đúng với DoD ban đầu.

## 14) Claim/Close gate tối thiểu

Trước khi claim:
- đã map đúng `mark-task` -> issue `type=task`
- issue có `verification_mode`, `depends_on`, `touched_paths_expected`, `docs_refs`, `definition_of_done`

Trước khi close:
- có `touched_paths_actual`
- có `verification_commands` + kết quả
- có test note (`n/a` hoặc danh sách checks)
- có drift check; nếu drift thì có follow-up issue

## 15) Phase authoring template

Dùng khung tối thiểu sau:
1. Mục tiêu
2. Phụ thuộc
3. Ngoài phạm vi
4. Điều kiện đạt phase
5. danh sách mark-task
6. mini checklist pass/fail cho từng task

## 16) Task template

```md
<!-- mark-task: XXX-T01 -->
## XXX-T01 <Action-oriented title>

- Type: `<type>`
- Verification mode: `<docs-only|current-state|target-state|runtime>`
- Depends on: `<task ids | none>`
- Outputs: `<single verifyable output>`
- Touched paths: `<main paths>`
- Docs refs: `<source docs>`
- Verification: `<how to verify>`
- Tests: `<n/a | checks>`
- Beads: `type=task`, `labels=...`
- Definition of done: `<explicit close condition>`
```

## 17) Review checklist trước khi merge

- metadata đủ 100%
- granularity đạt guardrails
- dependency không cycle
- verification mode hợp lệ
- map 1:1 với Beads issue
- không có wording mơ hồ gây scope drift

## 18) SOP cuối phiên

1. Close các task đã đạt DoD.
2. Đồng bộ code:
   - `git pull --rebase origin main`
   - `git push origin main`
3. Backup Beads snapshot:
   - `bd backup export-git --branch beads-backup --remote origin`
4. Health check cuối:
   - `bd doctor`

## 19) SOP khôi phục (xóa local và clone lại)

1. Clone repo.
2. Re-init Beads:
   - `bd init --skip-agents --skip-hooks -p delivery-app`
   - `bd hooks install`
3. Restore backup snapshot:
   - `bd backup fetch-git --branch beads-backup --remote origin`
4. Verify:
   - `bd doctor`
   - `bd list --status=open --json`

## 20) Quality anti-patterns cần tránh

- issue đã close nhưng không có evidence theo verification mode
- task title mơ hồ kiểu "hoàn thiện", "tối ưu toàn bộ"
- task gom nhiều output độc lập trong cùng một issue
- cập nhật issue graph trước khi cập nhật docs khi có scope drift

## 21) IDE-safe terminal profile

Để tránh treo VS Code khi chạy agent trên repo docs lớn:

- Ưu tiên query có scope hẹp theo thư mục hoặc file cụ thể; tránh quét recursive toàn repo nếu không cần.
- Tránh command tạo output quá lớn trong một lần chạy; chia nhỏ theo cụm file và giới hạn số dòng kết quả.
- Ưu tiên công cụ search có include pattern rõ ràng thay vì dump nội dung toàn bộ.
- Khi cần kiểm tra diện rộng, chạy theo lô nhỏ và xác nhận từng lô trước khi tiếp tục.

## 22) Tài liệu liên quan

- `docs/plan/AGENTS.md`
- `docs/plan/governance/execution-checklist.md`
- `docs/plan/archive/spec-kit-beads-refactor-program.md`
