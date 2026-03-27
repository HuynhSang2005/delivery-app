# AGENTS.md

## Mục Đích

File này là local contract cho mọi công việc trong `docs/plan/`.

`docs/plan/` biến source docs thành execution system. Nó không được tự ý ghi đè docs gốc.

## Phạm Vi Sprint Refactor (docs/plan only)

Sprint refactor hiện tại chỉ xử lý trong phạm vi `docs/plan/**`.

Bao gồm:
- chuẩn hóa wording cho execution system
- chốt naming strategy của Foundation Plan
- tăng tính kiểm chứng được cho metadata và quality gates

Không bao gồm:
- chỉnh code runtime trong `apps/*`
- chỉnh infra artifacts trong `infra/*`
- xử lý các thay đổi ngoài `docs/plan/**`

## Success Criteria Cấp Sprint

Một đợt refactor trong `docs/plan/**` được coi là đạt khi:
- mọi thay đổi nằm trong phạm vi `docs/plan/**`
- không đổi stable IDs (`mark-phase`, `mark-task`, `mark-check`) nếu không có lý do bắt buộc
- terminology và cross-reference trong plan nhất quán với source docs
- mỗi task vẫn giữ đủ metadata bắt buộc và không tạo scope mơ hồ

## Naming Strategy Cho Foundation Plan

Terminology chuẩn trong plan docs là `Foundation Plan`.

Quy ước chuyển tiếp cho path:
- path hiện tại trong repo vẫn là `docs/plan/foudation/`
- trong nội dung docs, khi nhắc rõ path thì ghi theo dạng: `Foundation Plan (path hiện tại: docs/plan/foudation/)`
- việc rename vật lý thư mục sang `foundation` là một migration riêng, chỉ thực hiện khi có scope cập nhật đồng bộ toàn repo

## Nguyên Tắc Cứng

- source docs gốc luôn thắng plan files
- foundation plan phải đi trước app-specific plans
- một task phải có đúng một output có thể verify
- dependency phải explicit, không để implicit
- phase, task, và check IDs là stable IDs; không đổi nếu không có lý do rất rõ

## Khi Sửa Plan

Phân biệt rõ:
- `Foundation Plan (path hiện tại: docs/plan/foudation/)` lo shared setup baseline của toàn repo
- `docs/plan/be/` lo backend execution sau foundation

Không được:
- để backend plan ôm responsibility của foundation
- tạo plan app-specific mới nếu user chưa yêu cầu
- descoping hoặc mở rộng phase âm thầm chỉ bằng wording mơ hồ

## Layering Và Ownership Matrix

- `docs/plan/AGENTS.md`: contract chung cho execution system layer
- `docs/plan/foudation/*`: ownership cho setup nền dùng chung (workspace, infra contract, env, scaffold contract, verification baseline)
- `docs/plan/be/*`: ownership cho backend execution sau khi dependency từ Foundation Plan đã sẵn sàng

Quy tắc chuyển blocker:
- blocker liên quan workspace/infra/contracts dùng chung -> đưa về Foundation Plan
- blocker liên quan API/domain/backend runtime -> xử lý trong Backend Plan

## Hybrid Workflow Role Matrix

| Lớp | Công cụ chính | Output chính | Không được dùng để |
|---|---|---|---|
| Planning/Spec | Spec-Kit | `constitution/spec/plan/tasks/implement` mapping trong docs-plan | tracking runtime issue state |
| Execution Tracking | Beads | issue graph, claim state, blocker state, close evidence | thay source docs hoặc thay acceptance criteria |
| Source Of Truth | Docs gốc + ADR | business rules, architecture invariants, policy | bị ghi đè bởi plan wording hoặc issue notes |

## Trigger Map Khi Nào Dùng Gì

- Dùng Spec-Kit khi cần:
	- xác định “cần build gì”, acceptance criteria, task breakdown
	- chuẩn hóa dependency graph hoặc artifact map trong `docs/plan/*`
- Dùng Beads khi cần:
	- trả lời “đang làm đến đâu”, “task nào ready”, “blocker nằm ở đâu”
	- claim task, cập nhật trạng thái, đóng task với evidence

Quy tắc anti-overlap:
- Không dùng Beads để sửa hoặc quyết định source docs.
- Không close task trong Beads nếu docs chưa phản ánh scope thực tế.
- Khi conflict, ưu tiên docs gốc và cập nhật lại plan/issue cho đồng bộ.

## Metadata Mỗi Task

Mỗi `mark-task` phải có:
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

`Verification mode` dùng một trong bốn giá trị:
- `docs-only`: chỉ kiểm chứng tài liệu
- `current-state`: verify theo commands hoặc artifacts hiện có của repo
- `target-state`: verify theo contract đích đã chốt
- `runtime`: bắt buộc có chạy test hoặc runtime checks

## Verification

Khi sửa plan:
1. rà dependency graph
2. rà phase acceptance gates
3. rà current-state vs target-state wording
4. rà touched paths và ownership để không lấn scope
5. rà consistency với root docs và local `AGENTS.md`

Close-evidence rule (bắt buộc với Beads issue map từ `mark-task`):
1. `mark_task_id` phải khớp 1:1 với task trong docs
2. có `touched_paths_actual`
3. có `verification_commands` + kết quả
4. có test note (`n/a` hoặc danh sách checks)
5. có drift check (nếu lệch phải có follow-up issue)

## Không Được Làm

- Không đổi stable IDs chỉ để “đẹp hơn”
- Không để plan dùng terminology khác source docs
- Không thêm task quá to kiểu “làm auth”, “làm mobile app”, “hoàn thiện infra”
