# Beads Seed Runbook

## Mục Tiêu

Beads là task graph bền vững cho backend execution.

Dùng Beads cho:
- tracking phase và task lâu dài
- biểu diễn dependency rõ ràng
- tiếp tục công việc qua nhiều session
- nhìn thấy blocker sớm

## Chiến Lược Seed

Tạo:
- một epic issue cho mỗi phase
- một task issue cho mỗi `mark-task`

Labels khuyến nghị:
- `be`
- `phase:p00` đến `phase:p06`
- label bounded context như `auth`, `orders`, `dispatch`, `admin`, `onboarding`, `chat`

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
- `mark_task_id`: ví dụ `BE-P03-T03`
- `phase_id`: ví dụ `BE-P03`
- `type=task`
- `labels`: tối thiểu gồm `be` và `phase:pxx`
- `depends_on`: danh sách task ID trực tiếp (không include transitive deps)
- `verification_mode`: một trong `docs-only`, `current-state`, `target-state`, `runtime`
- `touched_paths_expected`: path dự kiến sẽ thay đổi
- `docs_refs`: danh sách docs refs từ task gốc
- `definition_of_done`: copy hoặc tóm tắt trung thành từ plan

Nếu thiếu một trường mandatory, không được claim issue để thực thi.

## Thứ Tự Seed

1. Tạo phase epic theo đúng thứ tự roadmap.
2. Tạo task cho `P00` trước.
3. Với các phase sau, chỉ seed sâu tới những task đã thật sự reachable.
4. Task ở phase sâu hơn có thể tạo sẵn nhưng chưa claim cho tới khi dependency sẵn sàng.

## Ví Dụ Mapping

- epic: `BE-P03 Driver Presence Dispatch Realtime`
- task: `BE-P03-T03 Query candidate drivers by radius freshness and KNN`
- deps: `BE-P03-T01`, `BE-P03-T02`, `BE-P02-T04`

## CLI Workflow Gợi Ý

Dùng Beads skill và workflow chính thức. Chuỗi thao tác điển hình:

1. `bd ready`
2. `bd show <issue-id>`
3. `bd update <issue-id> --claim`
4. implement đúng một task
5. `bd close <issue-id> --reason "done"`

Nếu graph dependency lớn, prime graph trước khi chạy sâu.

## Quy Tắc

- một `mark-task` tương ứng một Beads issue
- không làm code work nếu chưa map sang issue
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
