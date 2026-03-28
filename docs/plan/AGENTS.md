# AGENTS.md

## Vai Trò

File này là contract cho toàn bộ execution planning trong `docs/plan/`.

`docs/plan/` là lớp chuyển source docs thành kế hoạch thực thi có thể claim/verify, không có quyền ghi đè source docs.

## Scope Và Ownership

- `docs/plan/foudation/`:
	- setup nền dùng chung cho repo (workspace, infra contract, env/tooling baseline, verification baseline).
- `docs/plan/be/`:
	- backend execution sau khi dependency từ foundation đã sẵn sàng.

Rule cứng:
- blocker thuộc workspace/infra/contracts dùng chung -> đưa về foundation.
- blocker thuộc API/domain/backend runtime -> xử lý trong backend plan.

## Naming Strategy

- terminology chuẩn là `Foundation Plan`.
- path vật lý hiện tại vẫn là `docs/plan/foudation/` (typo lịch sử).
- chỉ rename thư mục khi có migration scope riêng và update đồng bộ toàn repo.

## Hybrid Contract: Spec-Kit + Beads

Vai trò tách lớp:
- Spec-Kit:
	- định nghĩa planning artifacts (`constitution/spec/plan/tasks`).
	- dùng cho task decomposition, acceptance criteria, dependency narrative.
- Beads:
	- tracking issue lifecycle, claim/close state, blocker graph, execution evidence.

Không được:
- dùng Beads để thay source docs hoặc thay acceptance criteria.
- close issue khi docs chưa phản ánh scope thực tế.

## Stable ID Policy

Giữ ổn định các marker:
- `<!-- mark-phase: ... -->`
- `<!-- mark-task: ... -->`
- `<!-- mark-check: ... -->`

Không đổi stable IDs chỉ để làm đẹp.

## Metadata Bắt Buộc Cho Mỗi Task

Mỗi `mark-task` phải có đầy đủ:
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

`Verification mode` chỉ dùng 1 trong 4 giá trị:
- `docs-only`
- `current-state`
- `target-state`
- `runtime`

## Task Sizing Rules

Task đạt chuẩn khi:
- đúng nguyên tắc `1 task = 1 output có thể verify`
- title hành động cụ thể, không mơ hồ
- dependency direct, explicit, không cycle
- touched paths chính nên giữ gọn (khuyến nghị tối đa 3-5 path chính)

Không tạo task kiểu:
- “hoàn thiện auth”
- “làm mobile app”
- “tối ưu toàn bộ infra”

## Close-Evidence Rule (Bắt Buộc)

Issue Beads map từ `mark-task` chỉ được close khi có:
1. `mark_task_id` khớp 1:1 với docs
2. `touched_paths_actual`
3. `verification_commands` + kết quả
4. test note (`n/a` hoặc danh sách checks)
5. `drift_check`; nếu drift phải có follow-up issue

## Verification Khi Refactor Plan

1. rà dependency graph
2. rà phase acceptance gates
3. rà current-state vs target-state wording
4. rà touched paths để không lấn scope
5. rà consistency với root/docs AGENTS và source docs

## Không Được Làm

- không để backend plan ôm trách nhiệm foundation
- không để foundation plan ôm feature logic app
- không dùng terminology khác source docs cho cùng một policy
