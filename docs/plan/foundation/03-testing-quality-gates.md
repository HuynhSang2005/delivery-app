# Testing Và Quality Gates

File này định nghĩa quality bar tối thiểu cho từng phase của foundation.

Nó bổ sung cho `docs/10-testing-roadmap-risk.md` và biến định hướng verification thành execution gate thực tế cho phần setup dùng chung.

## Quy Tắc Chung

- phase nào cũng phải nêu rõ verify theo current-state hay target-state
- thay đổi workspace phải review tác động lên mọi app shell
- thay đổi infra phải review tác động lên seed/reset, backup, và local bootstrap
- task docs-only có thể không chạy runtime test, nhưng vẫn phải qua content QA

## Các Nhóm Verification Chuẩn

- `docs-review`
- `workspace-smoke`
- `infra-smoke`
- `contract-smoke`
- `lint`
- `typecheck`
- `build`

## Tooling Baseline Matrix

| Nhóm | current-state fallback | target-state contract |
| --- | --- | --- |
| `lint` | chạy app-level (`apps/api`, `apps/admin-web`, `apps/mobile`) | `nx affected -t lint` |
| `typecheck` | chạy app-level khi app có script khả dụng | `nx affected -t typecheck` |
| `docs QA` | markdown consistency/link checks ở scope docs đã sửa | `nx affected -t lint typecheck test build` + docs checks theo scope |

Rule:

- không claim root-level target command khi workspace chưa executable đầy đủ
- khi dùng fallback app-level phải ghi rõ lý do trong evidence

## Evidence Model Theo Verification Mode

Mọi task close trong Foundation Plan phải có evidence theo verification mode.

### `docs-only`

Evidence tối thiểu:
- `touched_paths_actual`
- `consistency_checks`: scope, dependency, source-of-truth alignment
- `decision_note`: kết luận và non-goals giữ nguyên
- `tests`: `n/a (docs-only)`

### `current-state`

Evidence tối thiểu:
- `commands`: các lệnh khả dụng theo baseline hiện tại
- `results`: pass/fail theo từng lệnh
- `artifacts`: logs hoặc output tóm tắt
- `fallback_note`: lý do dùng fallback app-level (nếu có)

### `target-state`

Evidence tối thiểu:
- `contract_commands`: lệnh theo contract đích
- `results`: pass/fail
- `gap_note`: nếu chưa đạt target-state, nêu rõ gap và điều kiện thoát gap
- `tests`: test note theo target contract

### `runtime`

Evidence tối thiểu:
- `runtime_checks`: smoke hoặc integration checks liên quan setup layer
- `happy_path` và `unhappy_path` outcomes
- `state_note`: xác nhận trạng thái thực tế không lệch contract
- `tests`: danh sách suites/checks đã chạy

## Checklist Chung

<!-- mark-check: FDN-QG-GLOBAL-C01 -->
- [x] current-state verification path và target-state verification path đã được phân biệt rõ

<!-- mark-check: FDN-QG-GLOBAL-C02 -->
- [x] touched paths không lấn sang feature logic của backend, mobile, hoặc admin web

<!-- mark-check: FDN-QG-GLOBAL-C03 -->
- [x] nếu thay đổi env hoặc infra, đã review tác động tới local bootstrap và self-hosting docs

## Gate Theo Phase

### P00

<!-- mark-check: FDN-QG-P00-C01 -->
- [x] root workspace contract, project map, và target naming đã được mô tả rõ

<!-- mark-check: FDN-QG-P00-C02 -->
- [x] current-state fallback commands và target-state Nx commands không mâu thuẫn nhau

<!-- mark-check: FDN-QG-P00-C03 -->
- [x] ownership rules cho `apps/*` và `packages/*` đã đủ rõ để phase sau không phải đoán

### P01

<!-- mark-check: FDN-QG-P01-C01 -->
- [x] local Postgres/PostGIS baseline, compose profile policy (`redis`, `debug`, `jobs`), và env layout đã được chốt

<!-- mark-check: FDN-QG-P01-C02 -->
- [x] migrate, seed, reset, và smoke path đã được mô tả rõ

<!-- mark-check: FDN-QG-P01-C03 -->
- [x] backup, restore, hoặc data reset semantics không mâu thuẫn runbook

### P02

<!-- mark-check: FDN-QG-P02-C01 -->
- [x] app shells và shared packages được map rõ ownership và boundary

<!-- mark-check: FDN-QG-P02-C02 -->
- [x] contract/codegen path dùng chung đã đủ rõ để app plans bám vào

<!-- mark-check: FDN-QG-P02-C03 -->
- [x] verification baseline ở cấp repo và cấp app đã được mô tả theo current-state và target-state

<!-- mark-check: FDN-QG-P02-C05 -->
- [x] shared-platform smoke command (`bun run shared:smoke`) được mô tả và có thể tích hợp vào target-state CI path

<!-- mark-check: FDN-QG-P02-C04 -->
- [x] root và local `AGENTS.md` files đã được chia theo scope đủ sát để agent vào đúng thư mục là có đúng context

### P03

<!-- mark-check: FDN-QG-P03-C01 -->
- [x] observability baseline có runtime evidence cho backend, admin-web, mobile theo contract trong `docs/09`

<!-- mark-check: FDN-QG-P03-C02 -->
- [x] security guardrails trong CI gồm dependency review, secret scanning, và policy check fail-fast trước merge

<!-- mark-check: FDN-QG-P03-C03 -->
- [x] release smoke contracts chạy được bằng `bun run release:smoke` với happy/unhappy tối thiểu cho cả 3 app
