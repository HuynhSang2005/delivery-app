# Foundation Execution System

`Foundation Plan (path: docs/plan/foundation/)` là execution layer cho setup dùng chung của project trước khi vào backend, mobile, admin web.

## Ownership

Foundation sở hữu:
- workspace bootstrap và governance baseline
- local infra + env contracts dùng chung
- app shell baselines và shared boundary contracts
- current-state vs target-state verification baseline

Foundation không sở hữu:
- business logic backend/mobile/admin
- feature lifecycle của app-specific plans

## Source Of Truth

Luôn ưu tiên source docs:
- `docs/README.md`
- `docs/01-product-requirements.md`
- `docs/02-solution-overview.md`
- `docs/03-system-architecture.md`
- `docs/09-devops-runbook.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/11-adrs.md`
- `docs/12-folder-structure.md`
- `docs/13-infrastructure-self-hosting.md`
- `docs/14-tech-stack-catalog.md`

Nếu conflict với source docs, sửa foundation plan trước khi tiếp tục execution.

## Phase Inventory

- `phase-00-workspace-bootstrap-governance.md`
- `phase-01-local-infra-env-tooling.md`
- `phase-02-app-shells-contract-ci-baseline.md`
- `phase-r01-runtime-bootstrap-enablement.md`
- `phase-r02-shared-platform-runtime.md`
- `phase-r03-operations-release-readiness.md`
- `phase-r04-af-workflow-consolidation.md`

Metadata hỗ trợ:
- `00-execution-system-va-ai-workflow.md`
- `01-roadmap-phase-dag.md`
- `02-beads-seed-runbook.md`
- `03-testing-quality-gates.md`

## Standards Bắt Buộc

- task sizing/metadata: `docs/plan/governance/phase-task-standard.md`
- execution gate: `docs/plan/governance/execution-checklist.md`
- claim/close workflow: `docs/plan/execution-worksheet-beads.md`

## Marker Contract

- `<!-- mark-phase: FDN-PNN -->`
- `<!-- mark-task: FDN-PNN-TMM -->`
- `<!-- mark-check: FDN-QG-PNN-CMM -->`

Stable IDs không đổi nếu bản chất task chưa đổi.

## Rule Khi Thực Thi

1. claim đúng task 1:1 trong Beads.
2. chỉ làm trong touched paths của task.
3. nếu phát sinh việc mới ngoài scope, tạo issue mới kiểu discovered work.
4. chỉ close khi đủ evidence theo verification mode.

## Foundation Exit Criteria

- tất cả task `FDN-P00..P02` có evidence hợp lệ theo docs-only contract
- task runtime trong `FDN-R01` đạt evidence cho workspace, infra, tooling, và CI target-state
- task shared-platform trong `FDN-R02` đạt evidence cho packages/contracts/tooling runtime
- task operations trong `FDN-R03` đạt evidence cho CI hardening, backup/restore, observability, security, release smoke
- task consolidation trong `FDN-R04` đạt evidence cho docs reconciliation, CI gate semantics, conformance hardening, api-client adoption, observability smoke alignment, và artifact hygiene
- không còn blocker mở giữa các phase foundation
- dependency cho backend plan đã sẵn sàng ở cả docs-level và runtime-level

Mốc readiness theo lớp:

- implementation-ready: `FDN-P00..P02` + `FDN-R01`
- scale-ready: thêm `FDN-R02`
- release-ready: thêm `FDN-R03`
