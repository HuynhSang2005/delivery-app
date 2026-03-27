# Testing Và Quality Gates

File này định nghĩa quality bar tối thiểu cho từng phase của backend.

Nó bổ sung cho `docs/10-testing-roadmap-risk.md` và biến định hướng test thành execution gate thực tế.

Tài liệu này được đọc cùng:
- `docs/plan/be/04-smoke-contract.md`
- `docs/plan/be/05-deterministic-fixtures-catalog.md`

## Quy Tắc Chung

- phase nào cũng phải thêm test, không chỉ thêm implementation
- mỗi core state transition phải có ít nhất một happy-path test và một unhappy-path test
- behavior realtime phải được đối chiếu lại bằng persisted HTTP state
- spatial query phải được verify bằng fixture có tính xác định
- task docs-only có thể không chạy runtime test, nhưng vẫn phải qua content QA

## Các Nhóm Verification Chuẩn

- `lint`
- `typecheck`
- `unit`
- `integration`
- `api`
- `contract`
- `smoke`

## Evidence Model Theo Verification Mode

Mọi task khi close phải ghi evidence theo đúng verification mode đã khai báo.

### `docs-only`

Evidence tối thiểu:
- `touched_paths_actual`
- `consistency_checks`: nêu rõ đã rà dependency, IDs, scope, và source-of-truth alignment
- `decision_note`: kết luận thay đổi docs và non-goals giữ nguyên
- `tests`: `n/a (docs-only)`

### `current-state`

Evidence tối thiểu:
- `commands`: danh sách command chạy theo baseline hiện tại của repo
- `results`: pass/fail theo từng command
- `artifacts`: log ngắn, output tóm tắt, hoặc file chứng cứ
- `tests`: test note tương ứng hoặc `n/a` có lý do

### `target-state`

Evidence tối thiểu:
- `contract_commands`: command theo contract đích (ví dụ `nx affected ...` khi applicable)
- `gap_note`: nếu chưa đạt target-state thì ghi rõ fallback path đã dùng
- `results`: pass/fail và điều kiện để bỏ fallback
- `tests`: test note theo target contract

### `runtime`

Evidence tối thiểu:
- `runtime_checks`: API/integration/e2e/smoke checks đã chạy
- `happy_path` và `unhappy_path` outcomes
- `state_reconciliation`: xác nhận persisted HTTP/DB state đúng với hành vi kỳ vọng
- `tests`: danh sách test hoặc suite đã chạy + kết quả

## Checklist Chung

<!-- mark-check: BE-QG-GLOBAL-C01 -->
- [ ] thay đổi schema có review tác động tới migration và fixture ids trong `05-deterministic-fixtures-catalog.md`

<!-- mark-check: BE-QG-GLOBAL-C02 -->
- [ ] thay đổi API có update OpenAPI contract và generated types workflow nếu cần

<!-- mark-check: BE-QG-GLOBAL-C03 -->
- [ ] state transition có unhappy-path coverage

<!-- mark-check: BE-QG-GLOBAL-C04 -->
- [ ] flow nhạy cảm về quyền có authorization tests

<!-- mark-check: BE-QG-GLOBAL-C05 -->
- [ ] event realtime có kiểm tra reconnect hoặc stale-state reconciliation khi phù hợp

## Gate Theo Phase

### P00

<!-- mark-check: BE-QG-P00-C01 -->
- [ ] foundation phases cho workspace, local infra, và app shells đã đạt acceptance gate trước khi mở backend execution

<!-- mark-check: BE-QG-P00-C02 -->
- [ ] `apps/api` đã được map vào current-state commands và target Nx targets mà không mâu thuẫn docs gốc

<!-- mark-check: BE-QG-P00-C03 -->
- [ ] API test harness boot được app bằng test config

<!-- mark-check: BE-QG-P00-C04 -->
- [ ] Prisma baseline chạy được trong backend test environment

### P01

<!-- mark-check: BE-QG-P01-C01 -->
- [ ] auth session issuance, refresh, logout, và `/auth/me` đã được cover

<!-- mark-check: BE-QG-P01-C02 -->
- [ ] capability checks và admin-only paths đã được cover

<!-- mark-check: BE-QG-P01-C03 -->
- [ ] flow OTP proofing, nếu implement, được tách khỏi canonical session logic

### P02

<!-- mark-check: BE-QG-P02-C01 -->
- [ ] quote calculation có deterministic fixtures và mapping id rõ theo `05-deterministic-fixtures-catalog.md`

<!-- mark-check: BE-QG-P02-C02 -->
- [ ] idempotency khi tạo order đã được cover

<!-- mark-check: BE-QG-P02-C03 -->
- [ ] invalid status transition bị reject đúng cách

### P03

<!-- mark-check: BE-QG-P03-C01 -->
- [ ] freshness của driver presence và các trường hợp payload lỗi đã được cover

<!-- mark-check: BE-QG-P03-C02 -->
- [ ] candidate selection query được test bằng spatial fixtures có bucket near/mid/far và stale case

<!-- mark-check: BE-QG-P03-C03 -->
- [ ] race hoặc conflict khi accept offer đã được cover

<!-- mark-check: BE-QG-P03-C04 -->
- [ ] websocket events reconcile được với persisted state

### P04

<!-- mark-check: BE-QG-P04-C01 -->
- [ ] admin list endpoints có filtering và pagination semantics ổn định

<!-- mark-check: BE-QG-P04-C02 -->
- [ ] investigation endpoints trả dữ liệu đủ cho audit nhưng không rò privilege

### P05

<!-- mark-check: BE-QG-P05-C01 -->
- [ ] state transition của onboarding review đã được cover

<!-- mark-check: BE-QG-P05-C02 -->
- [ ] approval cập nhật capability an toàn và idempotent

### P06

<!-- mark-check: BE-QG-P06-C01 -->
- [ ] chat access control và order membership checks đã được cover

<!-- mark-check: BE-QG-P06-C02 -->
- [ ] các flow được tách sang worker vẫn giữ behavior tương thích với synchronous baseline

<!-- mark-check: BE-QG-P06-C03 -->
- [ ] smoke checks cover health, migrations, và flow seed-to-request tối thiểu theo `04-smoke-contract.md`

## Mẫu Checklist Test Ở Cấp Task

Copy block này vào ghi chú implementation hoặc issue update:

```md
- [ ] đã đọc docs refs
- [ ] dependency đã thỏa
- [ ] verification đã chạy
- [ ] evidence đã ghi đúng verification mode
- [ ] happy path đã test
- [ ] unhappy path đã test
- [ ] case auth hoặc permission đã test
- [ ] contract drift đã được kiểm tra
- [ ] đã tạo follow-up task nếu cần
```
