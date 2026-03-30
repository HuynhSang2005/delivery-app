# Docs-Plan Refactor Program: Spec-Kit + Beads

## Trạng Thái Tài Liệu

Tài liệu này giữ vai trò **lịch sử chương trình refactor**.

Không dùng file này làm runtime contract chính.

Canonical runtime references hiện tại:
- `docs/plan/AGENTS.md`
- `docs/plan/README.md`
- `docs/plan/ai-agent-workflow-playbook.md`
- `docs/plan/governance/phase-task-standard.md`
- `docs/plan/governance/execution-checklist.md`

## Mục Tiêu Ban Đầu

Mục tiêu của chương trình là tách rõ 2 lớp:
- Spec-Kit cho planning artifacts
- Beads cho execution tracking và evidence

## Decision Summary

- Không dùng Beads để thay thế planning artifacts.
- Không dùng Spec-Kit để thay issue lifecycle runtime.
- Mọi conflict phải quay về source docs + ADR.

## Current-State Snapshot (Đã Cập Nhật)

- `docs/plan/be` và `docs/plan/foudation` là execution phases hiện hành.
- Spec-Kit scaffold đã có trong repo (`.specify/`).
- Beads workflow đang dùng cho claim/close/evidence.

### Tool Audit Baseline (2026-03-27, trước DPR-P00)

- `specify`: MISSING
- `bd`: version `0.62.0`
- `uv`: version `0.9.2`
- `bun`: version `1.3.11`

### Tool Audit After DPR-P00 (2026-03-27)

- `specify`: installed qua `uv tool`, package `specify-cli v0.4.3`
- `bd`: version `0.62.0` (đã chạy upgrade, hiện đang ở latest khả dụng)
- `uv`: version `0.9.2`
- `bun`: version `1.3.11`

## Phạm Vi

Bao gồm:
- cập nhật docs-plan governance và workflow map cho Spec-Kit + Beads.
- bổ sung artifact map và traceability protocol.
- giữ nguyên `mark-phase`, `mark-task`, `mark-check` IDs hiện có.

Không bao gồm:
- code runtime trong `apps/*`.
- infra deployment trong `infra/*`.
- thay đổi business rules trong docs gốc `docs/01..14`.

## Invariants

- Source docs gốc luôn là source of truth.
- Foundation layer đi trước app-specific execution.
- Một `mark-task` map 1:1 tới một Beads issue.
- Task close phải có evidence theo verification mode.

---

<!-- mark-phase: DPR-P00 -->
## DPR-P00 Toolchain Preflight

Mục tiêu phase:
- xác nhận tình trạng tool hiện tại.
- cài đặt Spec-Kit.
- cập nhật Beads lên bản ổn định mới.

<!-- mark-task: DPR-P00-T01 -->
### DPR-P00-T01 Audit current tool versions

- Type: `tooling`
- Verification mode: `current-state`
- Depends on: none
- Outputs: báo cáo version cho `specify`, `bd`, `uv`, `bun` trong context repo.
- Touched paths: `docs/plan/spec-kit-beads-refactor-program.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/plan/AGENTS.md`
- Verification: có đủ output command checks và trạng thái installed/missing.
- Tests: n/a
- Beads: `type=task`, `labels=docs-plan,phase:p00,tooling`
- Definition of done: có kết luận rõ tool nào cần install hoặc upgrade.

<!-- mark-task: DPR-P00-T02 -->
### DPR-P00-T02 Install Spec-Kit for Copilot workflow

- Type: `tooling`
- Verification mode: `current-state`
- Depends on: `DPR-P00-T01`
- Outputs: `specify` CLI sẵn sàng sử dụng cho VS Code Copilot.
- Touched paths: `docs/plan/spec-kit-beads-refactor-program.md`
- Docs refs: `https://github.com/github/spec-kit`
- Verification: `uv tool list` có `specify-cli`, và `specify init . --ai copilot --script ps --help` chạy được.
- Tests: n/a
- Beads: `type=task`, `labels=docs-plan,phase:p00,tooling,spec-kit`
- Definition of done: có thể chạy `specify init . --ai copilot --script ps` khi cần.

<!-- mark-task: DPR-P00-T03 -->
### DPR-P00-T03 Upgrade and validate Beads runtime

- Type: `tooling`
- Verification mode: `current-state`
- Depends on: `DPR-P00-T01`
- Outputs: Beads được cập nhật và verify command set có sẵn.
- Touched paths: `docs/plan/spec-kit-beads-refactor-program.md`
- Docs refs: `https://github.com/steveyegge/beads`
- Verification: `bd --version`, `bd --help` và `bd prime` hoạt động.
- Tests: n/a
- Beads: `type=task`, `labels=docs-plan,phase:p00,tooling,beads`
- Definition of done: có kết luận rõ strategy sử dụng Beads cho workflow mới.

### DPR-P00 Execution Evidence (2026-03-27)

- `DPR-P00-T01`: COMPLETED
  - Command: kiểm tra `Get-Command` + `--version` cho `specify`, `bd`, `uv`, `bun`.
  - Result: `specify` missing; `bd 0.62.0`; `uv 0.9.2`; `bun 1.3.11`.
  - Conclusion: cần cài `specify`; `bd` cần kiểm tra upgrade path để xác nhận latest.
- `DPR-P00-T02`: COMPLETED
  - Command: `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git`.
  - Result: install thành công `specify-cli v0.4.3`.
  - Validation: `uv tool list` có `specify-cli v0.4.3`; `specify init . --ai copilot --script ps --help` hiển thị đầy đủ options.
  - Note: CLI hiện tại không hỗ trợ `specify --version`, vì vậy verify chuyển sang `uv tool list` + command help ở subcommand.
- `DPR-P00-T03`: COMPLETED
  - Command: `bun add -g @beads/bd@latest`; `bd --version`; `bd --help`; `bd prime`.
  - Result: `bd` giữ ở `0.62.0` (latest khả dụng tại thời điểm chạy); help hiển thị bình thường; `bd prime` chạy không lỗi.
  - Workspace check: `.beads` chưa được tạo tự động ở repo root sau `bd prime`.
  - Strategy conclusion: workflow mới dùng Beads ở lớp tracking/evidence (`create`/`claim`/`close` theo `mark-task`), không dùng Beads để thay spec artifacts của Spec-Kit.

---

<!-- mark-phase: DPR-P01 -->
## DPR-P01 Governance Refactor

Mục tiêu phase:
- cập nhật contracts để tách rõ vai trò Spec-Kit và Beads.

<!-- mark-task: DPR-P01-T01 -->
### DPR-P01-T01 Update root governance for hybrid workflow

- Type: `docs`
- Verification mode: `docs-only`
- Depends on: `DPR-P00-T02`, `DPR-P00-T03`
- Outputs: root-level protocol quy định trigger khi nào dùng Spec-Kit và khi nào dùng Beads.
- Touched paths: `AGENTS.md`, `docs/AGENTS.md`
- Docs refs: `docs/README.md`, `docs/11-adrs.md`
- Verification: governance sections mới không mâu thuẫn với docs source of truth.
- Tests: docs consistency checks
- Beads: `type=task`, `labels=docs-plan,phase:p01,governance`
- Definition of done: root docs hướng dẫn rõ anti-overlap giữa 2 công cụ.

<!-- mark-task: DPR-P01-T02 -->
### DPR-P01-T02 Update docs-plan local contract

- Type: `docs`
- Verification mode: `docs-only`
- Depends on: `DPR-P01-T01`
- Outputs: `docs/plan/AGENTS.md` bổ sung role matrix, trigger map, close-evidence rule.
- Touched paths: `docs/plan/AGENTS.md`
- Docs refs: `docs/plan/be/README.md`, `docs/plan/foudation/README.md`
- Verification: metadata rules và stable-ID policy vẫn được giữ nguyên.
- Tests: docs consistency checks
- Beads: `type=task`, `labels=docs-plan,phase:p01,governance`
- Definition of done: AI-agent có local contract rõ ràng để thực thi hybrid workflow.

### DPR-P01 Execution Evidence (2026-03-27)

- `DPR-P01-T01`: COMPLETED
  - Touched paths: `AGENTS.md`, `docs/AGENTS.md`.
  - Result:
    - root contract đã bổ sung `Hybrid Workflow Contract (Spec-Kit + Beads)`.
    - docs contract đã bổ sung `Hybrid Workflow Trigger Map` + anti-overlap rules.
  - Verification: không mâu thuẫn với source-of-truth rule, vẫn ưu tiên docs gốc + ADR.
- `DPR-P01-T02`: COMPLETED
  - Touched paths: `docs/plan/AGENTS.md`.
  - Result:
    - bổ sung `Hybrid Workflow Role Matrix`.
    - bổ sung `Trigger Map` để quyết định khi nào dùng Spec-Kit/Beads.
    - bổ sung `close-evidence rule` cho issue map từ `mark-task`.
  - Verification: metadata rules và stable-ID policy vẫn giữ nguyên.

---

<!-- mark-phase: DPR-P02 -->
## DPR-P02 Artifact Mapping Refactor

Mục tiêu phase:
- map `docs/plan` hiện tại với architecture artifacts của Spec-Kit.

<!-- mark-task: DPR-P02-T01 -->
### DPR-P02-T01 Define artifact mapping table

- Type: `docs`
- Verification mode: `docs-only`
- Depends on: `DPR-P01-T02`
- Outputs: bảng map giữa phase docs hiện tại và bộ artifact `constitution/spec/plan/tasks/implement`.
- Touched paths: `docs/plan/spec-kit-beads-refactor-program.md`, `docs/plan/be/README.md`, `docs/plan/foudation/README.md`
- Docs refs: `https://github.com/github/spec-kit`, `docs/plan/AGENTS.md`
- Verification: mapping có thể apply mà không đổi stable IDs.
- Tests: docs-only
- Beads: `type=task`, `labels=docs-plan,phase:p02,artifacts`
- Definition of done: mỗi phase trong be/foundation có đường trace tới artifact model mới.

<!-- mark-task: DPR-P02-T02 -->
### DPR-P02-T02 Define traceability protocol mark-task to Beads

- Type: `docs`
- Verification mode: `docs-only`
- Depends on: `DPR-P02-T01`
- Outputs: protocol 1:1 map `mark-task` -> Beads issue + required close evidence.
- Touched paths: `docs/plan/be/02-beads-seed-runbook.md`, `docs/plan/foudation/02-beads-seed-runbook.md`
- Docs refs: `https://github.com/steveyegge/beads`, `docs/plan/AGENTS.md`
- Verification: runbook có mandatory fields và close rule rõ ràng.
- Tests: docs-only
- Beads: `type=task`, `labels=docs-plan,phase:p02,traceability`
- Definition of done: không còn ambiguity khi seed, claim, close task.

### DPR-P02 Execution Output (2026-03-27)

#### Artifact Mapping Table (Spec-Kit x docs/plan)

| Spec-Kit artifact | Vai trò chuẩn | Mapping trong docs/plan hiện tại | Notes giữ stable IDs |
|---|---|---|---|
| constitution | nguyên tắc bất biến, governance, source of truth | `docs/AGENTS.md`, `docs/plan/AGENTS.md`, `docs/11-adrs.md` | Không đổi `mark-*`; chỉ chuẩn hóa rule và trigger map |
| spec | mô tả feature intent, acceptance criteria theo phase | `phase-*.md` trong `docs/plan/be/` và `docs/plan/foudation/` | `mark-phase` và `mark-task` tiếp tục là khóa trace |
| plan | sequencing, dependency DAG, execution strategy | `01-roadmap-phase-dag.md`, `00-execution-system-va-ai-workflow.md`, file program này | Giữ dependency explicit theo `Depends on` |
| tasks | work items có thể claim/verify độc lập | các block `<!-- mark-task: ... -->` trong phase docs | 1 `mark-task` map 1 Beads issue |
| implement | bằng chứng thực thi, verification, test notes | `03-testing-quality-gates.md`, `04-smoke-contract.md`, issue notes trong Beads | Close task bắt buộc có evidence tối thiểu |

#### Traceability Protocol (mark-task -> Beads)

- Khóa map chuẩn: `<mark-task-id>` là khóa trace duy nhất giữa docs-plan và issue Beads.
- Mỗi `mark-task` tạo đúng một issue `type=task`; không gộp nhiều `mark-task` vào một issue.
- Dependency trong issue chỉ encode dependency trực tiếp theo trường `Depends on` của task docs.
- Trước khi claim: issue phải có đủ mandatory fields ở runbook tương ứng (`be` hoặc `foundation`).
- Khi close: issue phải có đủ evidence theo verification mode (`docs-only`, `current-state`, `target-state`, `runtime`).
- Nếu descoping hoặc split task: cập nhật docs trước, sau đó mới cập nhật issue graph để tránh drift.

#### DPR-P02 Status

- Dependency note: theo DAG gốc, `DPR-P02` phụ thuộc `DPR-P01-T02`; nội dung P02 đã được chuẩn hóa trước để giảm lead-time, nhưng cần re-check consistency ngay sau khi hoàn tất P01.

- `DPR-P02-T01`: COMPLETED
  - Đã bổ sung artifact mapping trong file program này và trong README của `docs/plan/be/` + `docs/plan/foudation/`.
  - Mapping giữ nguyên stable IDs, không đổi `mark-phase`, `mark-task`, `mark-check`.
- `DPR-P02-T02`: COMPLETED
  - Đã chuẩn hóa protocol `mark-task` -> issue trong hai runbook `02-beads-seed-runbook.md`.
  - Đã thêm mandatory fields và close-evidence checklist để loại bỏ ambiguity lúc seed/claim/close.

#### Re-check Sau DPR-P01 (2026-03-27)

- Kết quả: CONSISTENT.
- Điểm đã rà:
  - Trigger map Spec-Kit/Beads trong `AGENTS.md`, `docs/AGENTS.md`, `docs/plan/AGENTS.md` đồng bộ với protocol trong P02.
  - Mapping 1:1 `mark-task` -> issue `type=task` không bị thay đổi.
  - Stable IDs (`mark-phase`, `mark-task`, `mark-check`) không bị đổi.
  - Mandatory fields + close-evidence checklist trong hai runbook vẫn khớp role matrix mới.

---

<!-- mark-phase: DPR-P03 -->
## DPR-P03 Execution Gate Refactor

Mục tiêu phase:
- chuẩn hóa gate verification và evidence recording.

<!-- mark-task: DPR-P03-T01 -->
### DPR-P03-T01 Harmonize verification and smoke evidence model

- Type: `test`
- Verification mode: `docs-only`
- Depends on: `DPR-P02-T02`
- Outputs: model evidence thống nhất cho `docs-only`, `current-state`, `target-state`, `runtime`.
- Touched paths: `docs/plan/be/03-testing-quality-gates.md`, `docs/plan/be/04-smoke-contract.md`, `docs/plan/foudation/03-testing-quality-gates.md`
- Docs refs: `docs/10-testing-roadmap-risk.md`, `docs/09-devops-runbook.md`
- Verification: mỗi verification mode có evidence template tối thiểu.
- Tests: docs-only
- Beads: `type=task`, `labels=docs-plan,phase:p03,verification`
- Definition of done: task close không còn phụ thuộc vào wording mơ hồ.

### DPR-P03 Execution Evidence (2026-03-27)

- `DPR-P03-T01`: COMPLETED
  - Touched paths:
    - `docs/plan/be/03-testing-quality-gates.md`
    - `docs/plan/be/04-smoke-contract.md`
    - `docs/plan/foudation/03-testing-quality-gates.md`
  - Result:
    - đã bổ sung evidence model thống nhất cho 4 verification mode: `docs-only`, `current-state`, `target-state`, `runtime`.
    - smoke contract backend đã chuẩn hóa template evidence theo mode, không còn mơ hồ khi ghi nhận chứng cứ.
    - foundation quality gates đã đồng bộ cùng model evidence với backend quality gates.
  - Verification:
    - mỗi mode có bộ trường evidence tối thiểu.
    - semantics current-state/target-state và fallback note được mô tả rõ.
    - close decision không còn phụ thuộc wording tự do.

---

<!-- mark-phase: DPR-P04 -->
## DPR-P04 Pilot Rollout

Mục tiêu phase:
- chạy pilot workflow trên 1 foundation phase và 1 backend phase trước khi rollout full.

<!-- mark-task: DPR-P04-T01 -->
### DPR-P04-T01 Pilot with one Foundation phase

- Type: `ops`
- Verification mode: `current-state`
- Depends on: `DPR-P03-T01`
- Outputs: pilot report cho một phase trong `docs/plan/foudation`.
- Touched paths: `docs/plan/foudation/README.md`, `docs/plan/spec-kit-beads-refactor-program.md`
- Docs refs: `docs/plan/foudation/phase-00-workspace-bootstrap-governance.md`
- Verification: phase pilot có trace rõ ràng spec -> task -> evidence.
- Tests: smoke docs checks
- Beads: `type=task`, `labels=docs-plan,phase:p04,pilot,foundation`
- Definition of done: framework pilot có thể tái sử dụng cho phase khác.

<!-- mark-task: DPR-P04-T02 -->
### DPR-P04-T02 Pilot with one Backend phase

- Type: `ops`
- Verification mode: `current-state`
- Depends on: `DPR-P04-T01`
- Outputs: pilot report cho một phase trong `docs/plan/be`.
- Touched paths: `docs/plan/be/README.md`, `docs/plan/spec-kit-beads-refactor-program.md`
- Docs refs: `docs/plan/be/phase-00-workspace-api-foundation.md`
- Verification: pilot backend có map đầy đủ mark-task và evidence protocol.
- Tests: smoke docs checks
- Beads: `type=task`, `labels=docs-plan,phase:p04,pilot,backend`
- Definition of done: sẵn sàng rollout workflow cho toàn bộ be-plan và foundation-plan.

### DPR-P04 Execution Evidence (2026-03-27)

- `DPR-P04-T01`: COMPLETED
  - Pilot target: `docs/plan/foudation/phase-00-workspace-bootstrap-governance.md` (`FDN-P00`).
  - Touched paths:
    - `docs/plan/foudation/README.md`
    - `docs/plan/spec-kit-beads-refactor-program.md`
  - Result:
    - đã ghi pilot report Foundation với trace `spec -> task -> evidence`.
    - đã xác nhận metadata/task mapping và evidence template có thể tái sử dụng cho phase Foundation khác.
  - Verification:
    - smoke docs checks PASS cho metadata completeness, dependency coherence, và current-state/target-state wording.

- `DPR-P04-T02`: COMPLETED
  - Pilot target: `docs/plan/be/phase-00-workspace-api-foundation.md` (`BE-P00`).
  - Touched paths:
    - `docs/plan/be/README.md`
    - `docs/plan/spec-kit-beads-refactor-program.md`
  - Result:
    - đã ghi pilot report Backend với trace `spec -> task -> evidence`.
    - đã xác nhận protocol evidence và 1:1 mark-task mapping tương thích với runbook close rules.
  - Verification:
    - smoke docs checks PASS cho metadata fields, dependency coherence, và verification semantics.

#### DPR-P04 Rollout Decision

- Pilot foundation: PASS
- Pilot backend: PASS
- Rollout readiness: READY
- Kết luận: workflow Spec-Kit + Beads đã đủ điều kiện rollout cho toàn bộ `docs/plan/foudation/*` và `docs/plan/be/*`.

#### DPR-P04 Rollout Checklist Artifacts (2026-03-27)

- Status: COMPLETED
- Touched paths:
  - `docs/plan/foudation/README.md`
  - `docs/plan/be/README.md`
  - `docs/plan/spec-kit-beads-refactor-program.md`
- Output summary:
  - đã bổ sung checklist rollout full cho toàn bộ phases của Foundation Plan (`FDN-P00..P02`).
  - đã bổ sung checklist rollout full cho toàn bộ phases của Backend Plan (`BE-P00..P06`).
  - mỗi checklist đều giữ trace model `spec -> task -> evidence` và exit criteria rõ cho rollout.

#### Execution Worksheet Artifact (2026-03-27)

- Status: COMPLETED
- Touched paths:
  - `docs/plan/execution-worksheet-beads.md`
  - `docs/plan/spec-kit-beads-refactor-program.md`
- Output summary:
  - đã tạo worksheet tickable để team dùng trực tiếp khi claim/close issue trong Beads.
  - worksheet bao phủ toàn bộ phases của Foundation Plan và Backend Plan.
  - worksheet có sẵn Claim Gate, Close Gate, phase/task checklist, và KPI snapshot 2-4 tuần.

---

## KPI Để Theo Dõi Sau Refactor (2-4 weeks)

- Task mapping integrity: tỷ lệ mark-task có issue map 1:1.
- Evidence completeness: tỷ lệ issue close có đủ touched paths + verification + test note.
- Reopen do drift: tỷ lệ task đóng xong phải mở lại do sai hướng spec.
- Blocker latency: thời gian từ claim task đến lúc phát hiện blocker cross-phase.

## Command Preflight Reference (PowerShell)

```powershell
# Audit
# specify không có --version ở bản hiện tại
uv tool list
bd --version
uv --version
bun --version

# Install Spec-Kit (official)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Validate Spec-Kit command surface
specify init . --ai copilot --script ps --help

# Upgrade Beads (bun path)
bun add -g @beads/bd@latest

# Beads runtime check
bd --help
bd prime
```

## Next Action

Thực hiện theo thứ tự:
1. rollout workflow cho toàn bộ phase docs trong `docs/plan/foudation/*`
2. rollout workflow cho toàn bộ phase docs trong `docs/plan/be/*`
3. theo dõi KPI 2-4 tuần và cập nhật drift/follow-up tasks nếu phát sinh

`DPR-P04` đã hoàn tất với kết quả PASS cho cả foundation và backend pilot.