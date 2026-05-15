# Phase R02: Shared Platform Runtime

<!-- mark-phase: FDN-R02 -->

## Mục Tiêu

Thiết lập nền tảng runtime dùng chung cho toàn workspace sau khi R01 hoàn tất, bao gồm shared packages, contract codegen pipeline, tooling conformance, và worker-readiness boundaries để backend, admin web, mobile cùng vận hành trên một chuẩn kỹ thuật thống nhất.

## In Scope

- scaffold runtime cho `packages/api-client` và `packages/shared-kernel`
- chuẩn hóa OpenAPI codegen flow dùng chung cho backend/admin/mobile
- thiết lập tooling helpers trong `tools/` (generator, conformance checks)
- chốt worker-readiness boundaries (queue/Redis coupling rules) bám compose profiles `redis` (runtime), `debug` (debug tools), `jobs` (maintenance jobs)
- bổ sung cross-app smoke checks cho shared contracts

## Dependencies

- `FDN-R01`
- active docs `03`, `08`, `10`, `12`, `14`

## Out Of Scope

- business feature implementation
- production auto-scaling
- platform-level SRE automation chuyên sâu

## Acceptance Gate

- [x] `packages/api-client` và `packages/shared-kernel` có runtime scaffold tối thiểu, ownership rõ
- [x] OpenAPI generation pipeline chạy được end-to-end và không tạo biến thể SDK riêng theo app
- [x] `tools/` có tối thiểu một generator/conformance helper phục vụ workspace governance
- [x] worker-readiness boundary rõ giữa `apps/api`, `apps/worker`, và policy dùng compose profiles `redis`/`debug`/`jobs`
- [x] shared-platform smoke checks chạy được trong current CI path

## Task Index

| ID | Type | Verification mode | Depends on | Output |
|---|---|---|---|---|
| `FDN-R02-T01` | `foundation` | `runtime` | `FDN-R01-T01` | Runtime scaffold cho `packages/api-client` và `packages/shared-kernel` |
| `FDN-R02-T02` | `contracts` | `runtime` | `FDN-R02-T01`, `FDN-R01-T02` | OpenAPI codegen pipeline dùng chung toàn repo |
| `FDN-R02-T03` | `tooling` | `runtime` | `FDN-R01-T01` | `tools/` generators + conformance helpers baseline |
| `FDN-R02-T04` | `infra` | `target-state` | `FDN-R01-T03`, `FDN-R01-T04` | Worker-readiness boundaries và governance cho compose profiles `redis`/`debug`/`jobs` |
| `FDN-R02-T05` | `test` | `target-state` | `FDN-R02-T02`, `FDN-R02-T03` | Shared-platform smoke + contract checks |

<!-- mark-task: FDN-R02-T01 -->
### FDN-R02-T01 Scaffold runtime cho shared packages

- Type: `foundation`
- Verification mode: `runtime`
- Depends on: `FDN-R01-T01`
- Outputs: tạo được skeleton `packages/api-client`, `packages/shared-kernel` với ownership/tags rõ
- Touched paths: `packages/*`, `docs/12-folder-structure.md`, `AGENTS.md`
- Docs refs: `docs/12-folder-structure.md`, `docs/14-tech-stack-catalog.md`
- Verification: workspace graph nhận diện được shared packages và không vi phạm boundary rules
- Tests: package smoke (runtime)
- Beads: `type=task`, `labels=foundation,phase:r02,workspace`
- Definition of done: app plans có thể consume shared packages mà không tạo duplicate logic trong app layer

<!-- mark-task: FDN-R02-T02 -->
### FDN-R02-T02 Chuẩn hóa contract codegen pipeline

- Type: `contracts`
- Verification mode: `runtime`
- Depends on: `FDN-R02-T01`, `FDN-R01-T02`
- Outputs: OpenAPI source-of-truth + codegen artifacts pipeline tại `packages/api-client`
- Touched paths: `apps/api/*`, `packages/api-client/*`, `docs/08-api-realtime-contracts.md`, `docs/14-tech-stack-catalog.md`
- Docs refs: `docs/08-api-realtime-contracts.md`, `docs/14-tech-stack-catalog.md`
- Verification: codegen chạy được, artifacts ổn định, không chỉnh tay generated files
- Tests: contract smoke
- Beads: `type=task`, `labels=foundation,phase:r02,contracts`
- Definition of done: backend/admin/mobile dùng chung một workflow contract có thể lặp lại

<!-- mark-task: FDN-R02-T03 -->
### FDN-R02-T03 Thiết lập tooling conformance cho workspace

- Type: `tooling`
- Verification mode: `runtime`
- Depends on: `FDN-R01-T01`
- Outputs: ít nhất một generator hoặc conformance helper enforce naming/tags/targets
- Touched paths: `tools/*`, `docs/12-folder-structure.md`, `docs/14-tech-stack-catalog.md`
- Docs refs: `docs/12-folder-structure.md`, `docs/14-tech-stack-catalog.md`
- Verification: helper chạy được và phát hiện lệch chuẩn tối thiểu một rule
- Tests: tooling smoke
- Beads: `type=task`, `labels=foundation,phase:r02,tooling`
- Definition of done: quy tắc workspace không còn chỉ là docs policy mà có kiểm tra tự động

<!-- mark-task: FDN-R02-T04 -->
### FDN-R02-T04 Chốt worker-readiness boundaries

- Type: `infra`
- Verification mode: `target-state`
- Depends on: `FDN-R01-T03`, `FDN-R01-T04`
- Outputs: boundary rõ giữa API runtime, worker runtime, và Redis/queue activation policy bám compose profiles `redis`/`debug`/`jobs`
- Touched paths: `docs/02-solution-overview.md`, `docs/09-devops-runbook.md`, `docs/12-folder-structure.md`, `docs/14-tech-stack-catalog.md`
- Docs refs: `docs/02-solution-overview.md`, `docs/09-devops-runbook.md`, `docs/12-folder-structure.md`
- Verification: docs + runtime toggles không mâu thuẫn về việc bật worker/Redis và sử dụng đúng profile `redis`/`debug`/`jobs`
- Tests: n/a (target-state governance checks)
- Beads: `type=task`, `labels=foundation,phase:r02,infra`
- Definition of done: khi mở worker phase không cần sửa lại nền tảng ownership/boundary

<!-- mark-task: FDN-R02-T05 -->
### FDN-R02-T05 Thiết lập shared-platform smoke checks

- Type: `test`
- Verification mode: `target-state`
- Depends on: `FDN-R02-T02`, `FDN-R02-T03`
- Outputs: smoke checks cho contract sync, package import boundaries, tooling conformance
- Touched paths: `docs/10-testing-roadmap-risk.md`, `docs/plan/foundation/03-testing-quality-gates.md`, `.github/workflows/*`
- Docs refs: `docs/10-testing-roadmap-risk.md`, `docs/09-devops-runbook.md`
- Verification: CI có thể chạy shared-platform checks theo target-state path
- Tests: target-state shared smoke
- Beads: `type=task`, `labels=foundation,phase:r02,testing`
- Definition of done: regression ở shared platform được phát hiện sớm trước khi lan sang app phases

## Mini Checklist Pass/Fail (Pass 3)

Reconciliation note (R04-T01): trạng thái completion ở phase này đã được đối chiếu với `docs/plan/foundation/03-testing-quality-gates.md` để tránh double-truth giữa phase acceptance và quality-gates.

### FDN-R02-T01

- [x] Pass khi `packages/api-client` và `packages/shared-kernel` được scaffold và map rõ ownership.
- [x] Pass khi boundary tags/rules ngăn app import chéo sai lớp.
- [x] Pass khi shared code không kéo runtime không phù hợp.

### FDN-R02-T02

- [x] Pass khi codegen pipeline chạy được từ OpenAPI source-of-truth.
- [x] Pass khi artifacts được tạo ở `packages/api-client` và được app consumers dùng lại.
- [x] Pass khi có rule cấm chỉnh tay generated files.

### FDN-R02-T03

- [x] Pass khi có ít nhất 1 conformance helper hoạt động thực tế.
- [x] Pass khi helper kiểm tra được naming/tags/targets.
- [x] Pass khi helper tích hợp được vào CI path.

### FDN-R02-T04

- [x] Pass khi boundary giữa `apps/api` và `apps/worker` được mô tả rõ, không mâu thuẫn source docs.
- [x] Pass khi policy dùng compose profiles `redis`/`debug`/`jobs` nhất quán giữa docs runtime và docs architecture.
- [x] Pass khi worker-enable path không làm thay đổi source-of-truth (`HTTP/API` + database authoritative).

### FDN-R02-T05

- [x] Pass khi shared-platform smoke checks chạy được trong CI.
- [x] Pass khi checks có output fail-fast rõ cho contract/boundary drift.
- [x] Pass khi quality gates không mâu thuẫn runbook/testing roadmap.
