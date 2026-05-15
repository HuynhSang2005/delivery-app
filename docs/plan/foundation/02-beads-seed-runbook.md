# Beads Seed Runbook

## Mục Tiêu

Beads là task graph bền vững cho foundation execution.

Dùng Beads cho:
- tracking phase và task lâu dài
- biểu diễn dependency rõ ràng
- tiếp tục công việc qua nhiều session
- nhìn thấy blocker chung sớm

## Chiến Lược Seed

Tạo:
- một epic issue cho mỗi phase
- một task issue cho mỗi `mark-task`

Labels khuyến nghị:
- `foundation`
- `phase:p00` đến `phase:p02`
- label domain như `workspace`, `infra`, `env`, `tooling`, `contracts`

## Trường Nên Có Trong Beads

- title
- type
- priority
- labels
- deps
- tóm tắt acceptance criteria
- tóm tắt verification

## Mandatory Fields Cho Task Issue (Bắt Buộc)

Mọi issue map từ `mark-task` phải có đủ các trường sau:
- `mark_task_id`: ví dụ `FDN-P01-T02`
- `phase_id`: ví dụ `FDN-P01`
- `type=task`
- `labels`: tối thiểu gồm `foundation` và `phase:pxx`
- `depends_on`: danh sách task ID trực tiếp (không include transitive deps)
- `verification_mode`: một trong `docs-only`, `current-state`, `target-state`, `runtime`
- `touched_paths_expected`: path dự kiến sẽ thay đổi
- `docs_refs`: danh sách docs refs từ task gốc
- `definition_of_done`: copy hoặc tóm tắt trung thành từ plan

Nếu thiếu một trường mandatory, không được claim issue để thực thi.

## Thứ Tự Seed

1. Tạo phase epic theo đúng thứ tự roadmap.
2. Tạo task cho `P00` trước.
3. Chỉ seed task ở `P01` và `P02` khi dependency từ `P00` đã rõ.
4. Chỉ mở app-specific plan sau khi foundation phase liên quan đã reachable.

## Ví Dụ Mapping

- epic: `FDN-P01 Local Infra Env And Tooling`
- task: `FDN-P01-T02 Define env file layout and secrets policy`
- deps: `FDN-P00-T01`, `FDN-P00-T02`

## CLI Workflow Gợi Ý

Dùng Beads skill và workflow chính thức. Chuỗi thao tác điển hình:

1. `bd ready`
2. `bd show <issue-id>`
3. `bd update <issue-id> --claim`
4. implement đúng một task
5. `bd close <issue-id> --reason "done"`

## Quy Tắc

- một `mark-task` tương ứng một Beads issue
- không làm setup work nếu chưa map sang issue
- không để dependency ẩn; phải encode vào Beads
- không descoping âm thầm; phải update issue và docs

## Protocol Seed -> Claim -> Close (1:1)

1. Seed issue từ `mark-task` với đầy đủ mandatory fields.
2. Validate dependency edges theo trường `Depends on` trong docs.
3. Claim đúng một issue tại một thời điểm.
4. Thực thi đúng scope của task; nếu phát sinh split thì cập nhật docs trước.
5. Close issue chỉ khi close-evidence checklist đạt đủ.

## Evidence Phải Ghi Trước Khi Close

- touched paths
- tóm tắt verification đã chạy
- test đã thêm hoặc đã update
- follow-up issues đã tạo, nếu có

## Close-Evidence Checklist (Bắt Buộc)

Trước khi close, issue note phải có đủ:
- `mark_task_id` và commit hoặc patch summary tương ứng
- `touched_paths_actual` (thực tế đã đổi)
- `verification_commands` + kết quả pass/fail
- `tests`: nêu rõ `n/a`, hoặc danh sách test/check đã chạy
- `drift_check`: xác nhận không lệch source docs; nếu có lệch phải link issue follow-up
- `handoff_note`: rủi ro còn lại hoặc bước tiếp theo

Nếu thiếu checklist này, task được coi là chưa đủ điều kiện close.
