# AGENTS.md

## Vai Trò

File này áp dụng cho mọi công việc trong `docs/`.

Nó tồn tại để giữ repo này đúng nghĩa docs-driven: docs phải usable, nhất quán, và đủ mạnh để dẫn implementation thay vì chạy theo code scaffold.

## Source Of Truth Trong docs/

- `docs/README.md` là entrypoint
- bộ file `00` đến `14` và `references.md` là source-of-truth baseline
- `Foundation Plan (path hiện tại: docs/plan/foudation/)` là execution layer cho setup nền
- `Backend Plan (path: docs/plan/be/)` là backend execution layer sau foundation

Nếu execution plan mâu thuẫn với docs gốc, ưu tiên docs gốc rồi sửa lại execution plan.

## Quy Tắc Khi Sửa Docs

- không đổi business rule mà quên cập nhật các file liên quan
- không đổi phase scope mà quên cập nhật plan, testing, hoặc ADR khi cần
- giữ rõ ranh giới giữa `current-state` và `target-state`
- với thông tin time-sensitive, ghi theo ngày hoặc nhắc rõ cần verify tại thời điểm scaffold thật

## Quy Tắc Riêng Cho docs/plan/*

- giữ nguyên `mark-phase`, `mark-task`, `mark-check` IDs nếu task vẫn còn sống
- nếu đổi dependency, phải rà lại phase DAG, quality gates, và README của plan tương ứng
- foundation không được âm thầm ôm feature logic của app
- app-specific plan không được kéo ngược setup nền ra khỏi foundation
- một task phải có output verify được; không thêm task mơ hồ kiểu “hoàn thiện X”

## Hybrid Workflow Trigger Map (Spec-Kit + Beads)

Trong `docs/` áp dụng tách vai trò như sau:

- Spec-Kit:
	- dùng để cấu trúc planning artifacts (`constitution/spec/plan/tasks/implement`)
	- dùng khi soạn hoặc refactor phase spec, acceptance criteria, dependency narrative
	- không dùng để theo dõi runtime progress theo issue graph
- Beads:
	- dùng để tracking execution state, blocker graph, và close evidence
	- dùng khi claim/close task theo `mark-task` trong `docs/plan/*`
	- không dùng thay cho source docs hoặc thay cho decision record

Anti-overlap rule:
- Chỉ close Beads issue khi có evidence phù hợp verification mode của task docs.
- Mọi thay đổi scope/acceptance phải phản ánh ở docs trước, rồi mới cập nhật Beads graph.
- Nếu execution tracking và source docs lệch nhau, ưu tiên source docs, sau đó repair plan + issue.

## Verification

- search lại các wording drift chính sau khi sửa
- kiểm tra consistency giữa docs gốc, execution plans, và AGENTS liên quan
- nếu task là docs-only, nói rõ đây là docs-only verification

## Không Được Làm

- không viết docs như thể code hiện tại đã phản ánh final architecture
- không để plan đi trước source-of-truth docs
- không đẩy deferred feature thành approved scope chỉ bằng wording
