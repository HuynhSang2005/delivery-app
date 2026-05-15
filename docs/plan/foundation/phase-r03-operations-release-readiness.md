# Phase R03: Operations And Release Readiness

<!-- mark-phase: FDN-R03 -->

## Mục Tiêu

Hoàn thiện nền vận hành release-ready cho toàn project: CI/CD governance ổn định, backup/restore drill thực thi được, observability baseline đủ dùng cho demo-production path, và security guardrails tối thiểu trước khi mở rộng quy mô implementation.

## In Scope

- chuẩn hóa CI workflows theo target-state command contracts
- thiết lập backup/restore drill cho data layer
- bổ sung observability baseline (logging, error tracking, health checks)
- bổ sung security/supply-chain guardrails ở mức foundation
- chốt release smoke contracts cho backend, admin web, mobile

## Dependencies

- `FDN-R01`
- `FDN-R02`
- active docs `09`, `10`, `13`, `14`

## Out Of Scope

- SLO/SLA production cấp enterprise
- distributed tracing/synthetic monitoring phức tạp
- multi-region deployment

## Acceptance Gate

- [x] CI workflows bám target-state và có fallback policy được kiểm soát
- [x] backup/restore drill có bằng chứng thực thi định kỳ
- [x] observability baseline có thể hỗ trợ debug nhanh cho backend/admin/mobile
- [x] security guardrails tối thiểu chạy được trong CI
- [x] release smoke contracts được chuẩn hóa theo từng app

## Task Index

| ID | Type | Verification mode | Depends on | Output |
|---|---|---|---|---|
| `FDN-R03-T01` | `test` | `target-state` | `FDN-R01-T06`, `FDN-R02-T05` | CI workflow hardening + controlled fallback |
| `FDN-R03-T02` | `infra` | `runtime` | `FDN-R01-T03`, `FDN-R01-T04` | Backup/restore drill baseline |
| `FDN-R03-T03` | `ops` | `runtime` | `FDN-R02-T05` | Observability baseline cho backend/admin/mobile |
| `FDN-R03-T04` | `tooling` | `target-state` | `FDN-R01-T05` | Security/supply-chain guardrails |
| `FDN-R03-T05` | `test` | `runtime` | `FDN-R03-T01`, `FDN-R03-T03`, `FDN-R03-T04` | Release smoke contracts |

<!-- mark-task: FDN-R03-T01 -->
### FDN-R03-T01 Hardening CI workflow target-state

- Type: `test`
- Verification mode: `target-state`
- Depends on: `FDN-R01-T06`, `FDN-R02-T05`
- Outputs: CI workflows ổn định cho lint/typecheck/test/build/e2e theo policy
- Touched paths: `.github/workflows/*`, `docs/09-devops-runbook.md`, `AGENTS.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`
- Verification: CI chạy target-state mặc định, fallback chỉ hoạt động khi đúng điều kiện đã chốt
- Tests: target-state CI checks
- Beads: `type=task`, `labels=foundation,phase:r03,testing`
- Definition of done: pipeline không còn ambiguity giữa command contracts và execution reality

<!-- mark-task: FDN-R03-T02 -->
### FDN-R03-T02 Thiết lập backup/restore drill

- Type: `infra`
- Verification mode: `runtime`
- Depends on: `FDN-R01-T03`, `FDN-R01-T04`
- Outputs: backup script/policy + restore drill checklist + cadence/retention note
- Touched paths: `infra/*`, `docs/09-devops-runbook.md`, `docs/13-infrastructure-self-hosting.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/13-infrastructure-self-hosting.md`
- Verification: thực hiện ít nhất một vòng backup và restore có log/evidence
- Tests: infra drill
- Beads: `type=task`, `labels=foundation,phase:r03,infra`
- Definition of done: data recovery path được chứng minh, không chỉ mô tả lý thuyết

<!-- mark-task: FDN-R03-T03 -->
### FDN-R03-T03 Chốt observability baseline

- Type: `ops`
- Verification mode: `runtime`
- Depends on: `FDN-R02-T05`
- Outputs: logging conventions, error tracking wiring baseline, health-check map
- Touched paths: `apps/*`, `docs/09-devops-runbook.md`, `docs/14-tech-stack-catalog.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/14-tech-stack-catalog.md`
- Verification: có thể truy vết lỗi tối thiểu cho 1 flow backend, 1 flow admin, 1 flow mobile
- Tests: observability smoke
- Beads: `type=task`, `labels=foundation,phase:r03,ops`
- Definition of done: khi có lỗi runtime, team có signal đủ để triage trong thời gian ngắn

<!-- mark-task: FDN-R03-T04 -->
### FDN-R03-T04 Thiết lập security/supply-chain guardrails

- Type: `tooling`
- Verification mode: `target-state`
- Depends on: `FDN-R01-T05`
- Outputs: dependency audit gate, secret scanning baseline, commit policy checks
- Touched paths: `.github/workflows/*`, `package.json`, `docs/14-tech-stack-catalog.md`, `AGENTS.md`
- Docs refs: `docs/14-tech-stack-catalog.md`, `docs/09-devops-runbook.md`
- Verification: CI fail khi vi phạm guardrails tối thiểu
- Tests: security smoke
- Beads: `type=task`, `labels=foundation,phase:r03,security`
- Definition of done: foundation có hàng rào an toàn tối thiểu trước khi scale implementation

<!-- mark-task: FDN-R03-T05 -->
### FDN-R03-T05 Chuẩn hóa release smoke contracts

- Type: `test`
- Verification mode: `runtime`
- Depends on: `FDN-R03-T01`, `FDN-R03-T03`, `FDN-R03-T04`
- Outputs: smoke contracts cho backend/admin/mobile với happy-path và unhappy-path tối thiểu
- Touched paths: `docs/10-testing-roadmap-risk.md`, `docs/plan/foundation/03-testing-quality-gates.md`, `.github/workflows/*`
- Docs refs: `docs/10-testing-roadmap-risk.md`, `docs/09-devops-runbook.md`
- Verification: smoke suite chạy được sau build/deploy path theo runbook
- Tests: runtime smoke
- Beads: `type=task`, `labels=foundation,phase:r03,testing`
- Definition of done: release confidence tăng bằng evidence thay vì ước lượng

## Mini Checklist Pass/Fail (Pass 3)

Reconciliation note (R04-T01): trạng thái completion ở phase này đã được đối chiếu với `docs/plan/foundation/03-testing-quality-gates.md` để giữ một nguồn truth nhất quán cho QA/QC gates.

### FDN-R03-T01

- [x] Pass khi CI target-state là default execution path.
- [x] Pass khi fallback path có điều kiện, có note, có evidence.
- [x] Pass khi workflow outputs đủ để debug failures.

### FDN-R03-T02

- [x] Pass khi có ít nhất 1 backup + 1 restore drill thành công.
- [x] Pass khi có cadence/retention/location policy rõ.
- [x] Pass khi restore check không mâu thuẫn migration/schema version.

### FDN-R03-T04

- [x] Pass khi dependency audit guard chạy trong CI.
- [x] Pass khi secret scanning baseline hoạt động.
- [x] Pass khi policy vi phạm bị fail-fast trước merge.

### FDN-R03-T05

- [x] Pass khi smoke contracts có cho backend/admin/mobile.
- [x] Pass khi có ít nhất 1 unhappy-path check mỗi app.
- [x] Pass khi release gate bám đúng docs/runbook/testing roadmap.
