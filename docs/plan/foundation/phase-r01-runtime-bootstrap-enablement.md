# Phase R01: Runtime Bootstrap Enablement

<!-- mark-phase: FDN-R01 -->

## Mục Tiêu

Chuyển Foundation từ docs-ready sang runtime-ready để backend phase có thể thực thi trên một workspace Nx monorepo executable, local infra có thể khởi động được, và quality gate có enforcement thực tế.

## In Scope

- scaffold root workspace runtime files cho Nx + bun workspaces
- kích hoạt target-state command path (`nx graph`, `nx affected`)
- setup local Docker Compose baseline cho Postgres/PostGIS + profile `redis` (optional), profile `debug` (Redis Commander), và profile `jobs` (db-backup)
- thêm deterministic migrate/seed/reset scripts baseline
- bắt buộc pre-commit quality gate với Husky + lint-staged trước khi vào BE phase
- cập nhật CI entrypoint từ current-state fallback sang target-state (có gate điều kiện rõ ràng)

## Dependencies

- `FDN-P00`
- `FDN-P01`
- `FDN-P02`
- active docs `09`, `10`, `12`, `13`, `14`

## Out Of Scope

- implement business logic backend
- implement API/domain feature mới
- setup production infra hoàn chỉnh

## Acceptance Gate

- [x] root workspace Nx monorepo đã executable với `package.json`, `bun.lock`, `nx.json`, `tsconfig.base.json`
- [x] local data layer bootstrap được bằng Docker Compose (Postgres/PostGIS mandatory; profiles `redis`, `debug`, `jobs` hoạt động đúng vai trò)
- [x] migrate/seed/reset baseline có command và artifacts runtime rõ ràng
- [x] Husky + lint-staged được bắt buộc ở root và chạy được trên staged files
- [x] CI verification path có thể chạy target-state `nx affected -t lint typecheck test build`

## Task Index

| ID | Type | Verification mode | Depends on | Output |
|---|---|---|---|---|
| `FDN-R01-T01` | `foundation` | `runtime` | `FDN-P00-T01`, `FDN-P00-T02`, `FDN-P02-T01` | Root Nx workspace scaffold runtime |
| `FDN-R01-T02` | `tooling` | `target-state` | `FDN-R01-T01`, `FDN-P00-T04`, `FDN-P02-T04` | Target graph + affected command path chạy được |
| `FDN-R01-T03` | `infra` | `runtime` | `FDN-P01-T01`, `FDN-P01-T02` | Docker Compose baseline cho Postgres/PostGIS + profiles `redis`/`debug`/`jobs` |
| `FDN-R01-T04` | `infra` | `runtime` | `FDN-P01-T03`, `FDN-R01-T03` | Deterministic migrate/seed/reset scripts baseline |
| `FDN-R01-T05` | `tooling` | `runtime` | `FDN-R01-T01` | Husky + lint-staged mandatory pre-commit baseline |
| `FDN-R01-T06` | `test` | `target-state` | `FDN-R01-T02`, `FDN-R01-T04`, `FDN-R01-T05` | CI switch-over gate current-state -> target-state |

<!-- mark-task: FDN-R01-T01 -->
### FDN-R01-T01 Scaffold root workspace runtime cho Nx monorepo

- Type: `foundation`
- Verification mode: `runtime`
- Depends on: `FDN-P00-T01`, `FDN-P00-T02`, `FDN-P02-T01`
- Outputs: root `package.json` (workspaces), `bun.lock`, `nx.json`, `tsconfig.base.json`, và project discovery path chạy được
- Touched paths: `package.json`, `bun.lock`, `nx.json`, `tsconfig.base.json`, `docs/12-folder-structure.md`
- Docs refs: `docs/12-folder-structure.md`, `docs/14-tech-stack-catalog.md`
- Verification: `nx graph` và `nx show project api|admin-web|mobile --json` chạy thành công
- Tests: workspace smoke (runtime)
- Beads: `type=task`, `labels=foundation,phase:r01,workspace`
- Definition of done: root workspace không còn ở trạng thái docs-only, command Nx có thể execute trên repo hiện tại

<!-- mark-task: FDN-R01-T02 -->
### FDN-R01-T02 Chốt target-state command path của Nx

- Type: `tooling`
- Verification mode: `target-state`
- Depends on: `FDN-R01-T01`, `FDN-P00-T04`, `FDN-P02-T04`
- Outputs: command matrix target-state executable cho lint/typecheck/test/build và gate `e2e`
- Touched paths: `nx.json`, `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`
- Verification: `nx affected -t lint typecheck test build` chạy được với base/head hợp lệ; fallback rule được giữ cho trường hợp bất khả kháng
- Tests: n/a (target-state command verification)
- Beads: `type=task`, `labels=foundation,phase:r01,tooling`
- Definition of done: verification mode cho app plans không còn ambiguity giữa docs và runtime

<!-- mark-task: FDN-R01-T03 -->
### FDN-R01-T03 Setup local Docker Compose baseline cho data layer

- Type: `infra`
- Verification mode: `runtime`
- Depends on: `FDN-P01-T01`, `FDN-P01-T02`
- Outputs: compose stack cho Postgres/PostGIS và profiles `redis` (optional runtime), `debug` (Redis Commander), `jobs` (db-backup), env mapping baseline, health checks
- Touched paths: `docker-compose.yml`, `.env.example`, `docs/09-devops-runbook.md`, `docs/13-infrastructure-self-hosting.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/13-infrastructure-self-hosting.md`
- Verification: `bun run db:up` khởi động Postgres/PostGIS; `bun run db:up:redis` bật profile `redis`; `bun run db:up:debug` bật profile `debug`; `bun run job:db-backup` chạy được profile `jobs`
- Tests: infra smoke
- Beads: `type=task`, `labels=foundation,phase:r01,infra`
- Definition of done: local bootstrap data services có thể dùng lại, được, và không cần suy diễn thêm

<!-- mark-task: FDN-R01-T04 -->
### FDN-R01-T04 Implement deterministic migrate-seed-reset baseline

- Type: `infra`
- Verification mode: `runtime`
- Depends on: `FDN-P01-T03`, `FDN-R01-T03`
- Outputs: scripts/commands cho `migrate -> seed-baseline -> smoke-check -> reset` và fixture boundary rõ ràng
- Touched paths: `infra/scripts/*`, `apps/api/*`, `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`
- Verification: chạy được sequence deterministic ít nhất 2 lần liên tiếp với kết quả giống nhau theo smoke criteria
- Tests: runtime smoke + data reset checks
- Beads: `type=task`, `labels=foundation,phase:r01,infra`
- Definition of done: BE phases có thể tái sử dụng fixture/reset contract thay vì tự tạo script riêng

<!-- mark-task: FDN-R01-T05 -->
### FDN-R01-T05 Bắt buộc Husky + lint-staged trước BE phase

- Type: `tooling`
- Verification mode: `runtime`
- Depends on: `FDN-R01-T01`
- Outputs: root Husky hooks, lint-staged config cho staged files, và policy pre-commit mandatory
- Touched paths: `.husky/*`, `.lintstagedrc.*|lint-staged config trong package.json`, `package.json`, `docs/14-tech-stack-catalog.md`
- Docs refs: `docs/14-tech-stack-catalog.md`
- Verification: pre-commit hook chạy được trên staged files và fail-fast khi lint/test gate thất bại
- Tests: hook smoke (runtime)
- Beads: `type=task`, `labels=foundation,phase:r01,tooling`
- Definition of done: không merge BE work mà bỏ qua pre-commit quality gate

<!-- mark-task: FDN-R01-T06 -->
### FDN-R01-T06 Chuyển CI sang target-state làm baseline

- Type: `test`
- Verification mode: `target-state`
- Depends on: `FDN-R01-T02`, `FDN-R01-T04`, `FDN-R01-T05`
- Outputs: CI path ưu tiên `nx affected`, fallback governance chỉ dùng khi có sự cố và phải có evidence
- Touched paths: `.github/workflows/*`, `docs/09-devops-runbook.md`, `AGENTS.md`
- Docs refs: `docs/09-devops-runbook.md`, `AGENTS.md`
- Verification: CI run pass theo `nx affected -t lint typecheck test build`; policy fallback được gate rõ
- Tests: target-state CI verification
- Beads: `type=task`, `labels=foundation,phase:r01,testing`
- Definition of done: BE-P00 chỉ được kick-off khi gate target-state đã pass và evidence đã ghi

## Mini Checklist Pass/Fail (Pass 3)

Quy ước đo lường: mỗi dòng là điều kiện pass/fail nhị phân; nếu có số lượng thì ưu tiên ngưỡng dạng >= N.

### FDN-R01-T01

- [x] Pass khi 4 root files (`package.json`, `bun.lock`, `nx.json`, `tsconfig.base.json`) tồn tại và hợp lệ.
- [x] Pass khi `nx graph` chạy thành công.
- [x] Pass khi `nx show project api|admin-web|mobile --json` trả dữ liệu dự án hợp lệ.

### FDN-R01-T03

- [x] Pass khi Postgres/PostGIS chạy được bằng Docker Compose.
- [x] Pass khi profile `redis` chỉ bật theo điều kiện, không ép buộc mặc định.
- [x] Pass khi profile `debug` (Redis Commander) chỉ bật khi cần debug runtime state.
- [x] Pass khi profile `jobs` chạy được db-backup theo command chuẩn.
- [x] Pass khi env ownership và compose mapping không mâu thuẫn runbook.

### FDN-R01-T05

- [x] Pass khi Husky được cài đặt tại root workspace và hook pre-commit được kích hoạt.
- [x] Pass khi lint-staged chỉ xử lý staged files, không chạy full repo trong hook.
- [x] Pass khi quality gate thất bại thì commit bị chặn.

### FDN-R01-T06

- [x] Pass khi CI default chạy `nx affected -t lint typecheck test build`.
- [x] Pass khi fallback path có điều kiện sử dụng và evidence mode rõ ràng.
- [x] Pass khi policy gate target-state được cập nhật nhất quán ở docs + AGENTS.
