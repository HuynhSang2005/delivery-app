# Phase 01: Local Infra, Env, Và Tooling

<!-- mark-phase: FDN-P01 -->

## Mục Tiêu

Chốt baseline cho local infra, env files, data bootstrap, và tooling dùng chung để backend, mobile, và admin web không phải tự nghĩ contract vận hành riêng.

## Phụ Thuộc

- `FDN-P00-T01`
- `FDN-P00-T02`
- `FDN-P00-T04`
- active docs `03`, `09`, `13`, `14`

## Ngoài Phạm Vi

- schema business của backend
- feature-specific seed data
- CI/CD production rollout chi tiết

## Điều Kiện Đạt Phase

Local bootstrap cho Postgres/PostGIS và optional Redis đã rõ, env contract đủ chặt, và các app sau này có thể boot trên cùng một infra baseline.

<!-- mark-task: FDN-P01-T01 -->
## FDN-P01-T01 Chốt local database baseline cho Postgres, PostGIS, optional Redis, và ownership của `infra/`

- Type: `infra`
- Verification mode: `docs-only`
- Depends on: `FDN-P00-T01`, `FDN-P00-T02`
- Outputs: local infra contract cho database, extensions, cổng mặc định, policy bật Redis khi thật sự cần, và ranh giới giữa `infra/` artifacts với app-level runtime config
- Touched paths: `docs/plan/foudation/*`, `docs/09-devops-runbook.md`, `docs/13-infrastructure-self-hosting.md`
- Docs refs: `docs/03-system-architecture.md`, `docs/09-devops-runbook.md`, `docs/13-infrastructure-self-hosting.md`
- Verification: tài liệu đã ghi rõ Postgres/PostGIS là bắt buộc, Redis theo điều kiện, và ownership giữa `infra/*` với app-level config
- Tests: docs-only
- Beads: `type=task`, `labels=foundation,phase:p01,infra`
- Definition of done: các plan theo app có thể khai báo dependency local data services mà không cần đoán lại bootstrap contract

<!-- mark-task: FDN-P01-T02 -->
## FDN-P01-T02 Chốt env file layout, secrets policy, và ownership của biến môi trường

- Type: `tooling`
- Verification mode: `docs-only`
- Depends on: `FDN-P01-T01`
- Outputs: env layout cho root và app-level files, ownership rules, và policy cho secrets trong local, CI, và self-host
- Touched paths: `docs/plan/foudation/*`, `docs/09-devops-runbook.md`, `docs/13-infrastructure-self-hosting.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/13-infrastructure-self-hosting.md`, `docs/14-tech-stack-catalog.md`
- Verification: env layout đã nêu rõ file ownership theo app và không có biến bắt buộc bị định nghĩa trùng giữa nhiều scope
- Tests: docs-only
- Beads: `type=task`, `labels=foundation,phase:p01,env`
- Definition of done: task ở phase sau có thể chỉ ra đúng file env cần sửa theo từng app hoặc scope

<!-- mark-task: FDN-P01-T03 -->
## FDN-P01-T03 Chốt migrate, seed, reset, và demo data baseline

- Type: `infra`
- Verification mode: `docs-only`
- Depends on: `FDN-P01-T01`, `FDN-P01-T02`
- Outputs: workflow cho migrate, seed, reset, demo fixtures, và data ownership trước khi có business seed chi tiết
- Touched paths: `docs/plan/foudation/*`, `docs/09-devops-runbook.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`
- Verification: migrate, seed, reset flow đã được mô tả theo thứ tự chạy và có deterministic semantics để backend plan kế thừa
- Tests: docs-only
- Beads: `type=task`, `labels=foundation,phase:p01,infra`
- Definition of done: app-specific plan chỉ bổ sung domain fixtures trên cùng reset/seed contract hiện có

<!-- mark-task: FDN-P01-T04 -->
## FDN-P01-T04 Chốt tooling baseline cho format, lint, typecheck, và docs QA

- Type: `tooling`
- Verification mode: `docs-only`
- Depends on: `FDN-P00-T04`, `FDN-P01-T02`
- Outputs: tooling expectations ở cấp repo cho lint, typecheck, docs QA, và khi nào fallback sang app-level commands
- Touched paths: `docs/plan/foudation/*`, `AGENTS.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`
- Verification: tooling baseline đã tách rõ command path cho current-state và target-state, không claim root command trước khi scaffold sẵn sàng
- Tests: docs-only
- Beads: `type=task`, `labels=foundation,phase:p01,tooling`
- Definition of done: các plan theo app có thể chọn quality path đúng theo giai đoạn scaffold hoặc target-state mà không mâu thuẫn

## Mini Checklist Pass/Fail (Pass 3)

Quy ước đo lường: mỗi dòng là điều kiện pass/fail nhị phân; nếu có số lượng thì ưu tiên ngưỡng dạng >= N.

### FDN-P01-T01

- [ ] Pass khi Nêu rõ Postgres/PostGIS là bắt buộc và Redis là optional có điều kiện.
- [ ] Pass khi Có mô tả ownership rành mạch giữa `infra/*` và app-level runtime config.
- [ ] Pass khi Có ít nhất 1 tiêu chí readiness để app plans không phải đoán local data baseline.

### FDN-P01-T02

- [ ] Pass khi Env layout nêu tách scope root và từng app, không chồng chéo ownership.
- [ ] Pass khi Secrets policy có ít nhất 3 bối cảnh: local, CI, self-host.
- [ ] Pass khi Không còn biến bắt buộc bị mô tả trùng nhiều scope mà thiếu chủ sở hữu.

### FDN-P01-T03

- [ ] Pass khi Luồng `migrate -> seed -> reset` được mô tả theo thứ tự deterministic.
- [ ] Pass khi Có tối thiểu 1 quy tắc fixture baseline để backend phases kế thừa.
- [ ] Pass khi Có điều kiện để phân biệt domain fixtures phase sau và baseline fixtures.

### FDN-P01-T04

- [ ] Pass khi Có mapping command rõ cho `lint`, `typecheck`, `docs QA` theo `current-state` và `target-state`.
- [ ] Pass khi Không claim root-level command khi nền tảng chưa sẵn sàng.
- [ ] Pass khi Có tiêu chí fallback app-level commands để tránh block execution.
