# Backend Smoke Contract

## Mục Tiêu

Tài liệu này chốt một smoke contract duy nhất cho backend plan, để mỗi phase verify theo cùng một baseline thay vì diễn giải tùy ý.

## Phạm Vi

- chỉ dành cho `docs/plan/be`
- không thay thế testing roadmap gốc
- dùng cho cả `current-state`, `target-state`, `runtime`, và `docs-only`

## Verification Mode

- `docs-only`: cập nhật checklist, contract, và consistency evidence
- `current-state`: verify bằng app-level commands hiện có
- `target-state`: verify bằng Nx contract đã chốt
- `runtime`: cần có test hoặc runtime evidence

## Evidence Template Theo Verification Mode

### `docs-only`

- phase
- verification mode
- touched paths
- consistency checks
- decision note
- tests: `n/a (docs-only)`

### `current-state`

- phase
- verification mode
- commands đã chạy
- kết quả pass/fail
- artifacts hoặc logs
- blockers (nếu có)

### `target-state`

- phase
- verification mode
- contract commands
- fallback path (nếu target chưa chạy được)
- gap note và điều kiện thoát fallback
- kết quả pass/fail

### `runtime`

- phase
- verification mode
- runtime checks hoặc test suites
- happy-path outcome
- unhappy-path outcome
- reconciliation note (HTTP hoặc DB state)

## Smoke Baseline Theo Phase

### BE-P00

Mục tiêu: xác nhận API shell và test harness có thể boot.

Checklist:
- health route có contract rõ ràng trong docs
- app có thể build và start theo current-state command matrix
- test harness không vỡ ngay khi boot

### BE-P01

Mục tiêu: xác nhận auth lifecycle tối thiểu.

Checklist:
- dev-login thành công
- `/auth/me` trả capability truth model
- refresh/logout có unhappy-path evidence

### BE-P02

Mục tiêu: xác nhận quote -> order baseline.

Checklist:
- tạo quote thành công với fixture deterministic
- tạo order từ quote hợp lệ
- idempotency-key replay không tạo duplicate order

### BE-P03

Mục tiêu: xác nhận dispatch baseline và realtime reconciliation.

Checklist:
- presence ingest hợp lệ
- candidate selection từ fixture không stale
- accept conflict có outcome tất định
- event realtime đối chiếu được bằng HTTP state

### BE-P04

Mục tiêu: xác nhận admin read models cho investigation.

Checklist:
- board list có filtering/pagination semantics
- detail trả đủ timeline/dispatch context
- không mở mutation ngoài scope MVP-1

### BE-P05

Mục tiêu: xác nhận onboarding review flow an toàn.

Checklist:
- submit/update hồ sơ hoạt động đúng policy
- approve/reject có audit trail
- capability update an toàn và idempotent

### BE-P06

Mục tiêu: xác nhận chat + worker extraction không vỡ contract cũ.

Checklist:
- chat access control đúng membership
- worker handoff không phá HTTP contracts cũ
- smoke route set vẫn cover health/auth/quote/order/dispatch/admin reads
