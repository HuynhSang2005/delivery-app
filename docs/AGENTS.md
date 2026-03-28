# AGENTS.md

## Vai Trò

File này áp dụng cho mọi công việc trong `docs/` (ngoại trừ execution details của `docs/plan/*`).

Mục tiêu: giữ `docs/` là source-of-truth đáng tin cậy cho product, architecture, data, API, testing và vận hành.

## Authority Trong docs/

- Ưu tiên tuyệt đối: `docs/README.md`, bộ `00..14`, `references.md`, ADRs.
- `docs/plan/*` là execution layer bám theo docs gốc, không có quyền ghi đè docs gốc.
- Nếu conflict với code scaffold: docs thắng.

## Scope Của File Này

Trong scope:
- cập nhật product rules, architecture rules, non-goals, trade-off
- chuẩn hóa wording giữa các docs gốc
- cập nhật ADR khi thay đổi quyết định kiến trúc

Ngoài scope:
- runtime issue tracking chi tiết (thuộc Beads)
- metadata task-level cho `mark-task` (thuộc `docs/plan/AGENTS.md`)

## Quy Tắc Khi Sửa Docs

- không đổi business rule mà quên cập nhật các file liên quan
- không đổi phase scope mà quên cập nhật plan/testing/ADR khi cần
- giữ rõ ranh giới `current-state` và `target-state`
- thông tin time-sensitive phải ghi mốc thời gian hoặc yêu cầu verify lại tại lúc scaffold thật

## Kết Nối Với Spec-Kit Và Beads

- ở layer `docs/`:
  - Spec-Kit dùng để chuẩn hóa planning artifacts khi cần refactor kế hoạch.
  - Beads dùng để tracking execution trạng thái, không thay thế source docs.
- rule bắt buộc:
  - thay đổi scope/acceptance phải cập nhật docs trước rồi mới cập nhật issue graph.

## Verification

- rà consistency wording giữa docs gốc và execution plans
- rà các policy quan trọng: auth source, dispatch baseline, realtime authority, MVP scope
- nếu task là docs-only, ghi rõ `docs-only verification`

## Không Được Làm

- không viết docs như thể code hiện tại đã phản ánh final architecture
- không để plan đi trước source-of-truth docs
- không đẩy deferred feature thành approved scope chỉ bằng wording
