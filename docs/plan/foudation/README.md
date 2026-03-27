# Foundation Execution System

`Foundation Plan (path hiện tại: docs/plan/foudation/)` là execution system cho phần setup dùng chung của project trước khi vào backend, mobile, hoặc admin web.

Folder này sở hữu những việc mà mọi app đều cần nhưng không nên bị ôm bởi riêng `docs/plan/be`:
- bootstrap workspace root và governance
- local infra và env contract
- app shells, shared package boundaries, và verification baseline
- ownership ban đầu cho `infra/` và `tools/`
- instruction layering cho `AGENTS.md` ở root và các scope chính

## Nguồn Sự Thật

Folder này phải đi theo, không được ghi đè, các docs đang là source of truth:
- `docs/README.md`
- `docs/01-product-requirements.md`
- `docs/02-solution-overview.md`
- `docs/03-system-architecture.md`
- `docs/04-backend-architecture.md`
- `docs/09-devops-runbook.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/11-adrs.md`
- `docs/12-folder-structure.md`
- `docs/13-infrastructure-self-hosting.md`
- `docs/14-tech-stack-catalog.md`

Nếu task trong folder này mâu thuẫn với các docs trên, ưu tiên bộ docs chính trước, rồi sửa folder này trước khi tiếp tục execution.

## Mô Hình Thực Thi

Roadmap foundation được chia theo phase. Mỗi phase phải có:
- mục tiêu rõ ràng
- dependency đầu vào
- acceptance gate
- task đủ nhỏ
- checklist verification và testing

Quy tắc: `1 task = 1 output có thể verify được`.

Foundation Plan phải được thực hiện trước các execution plan theo app như backend, mobile, hoặc admin web.

## Marker

Dùng các marker này để AI và con người parse plan ổn định:

- `<!-- mark-phase: FDN-P00 -->`
- `<!-- mark-task: FDN-P00-T01 -->`
- `<!-- mark-check: FDN-QG-P00-C01 -->`

Task ID là stable ID. Không đổi ID cũ trừ khi task bị bỏ hẳn và thay bằng task khác.

## Chuẩn Metadata Cho Task

Mỗi task phải có:
- `Type`
- `Depends on`
- `Outputs`
- `Touched paths`
- `Docs refs`
- `Verification`
- `Tests`
- `Beads`
- `Definition of done`

Các loại task nên dùng:
- `foundation`
- `infra`
- `tooling`
- `contracts`
- `test`
- `docs`

## Mapping Với Beads

Mỗi `mark-task` nên map tới đúng một issue trong Beads.

Shape issue khuyến nghị:
- title: câu ngắn, rõ hành động
- type: `feature`, `task`, `bug`, hoặc `epic`
- labels: `foundation`, label phase, và label domain như `workspace`, `infra`, `tooling`, `contracts`
- deps: chỉ khai báo dependency trực tiếp bằng `mark-task` ID

## Mapping Với Spec-Kit Artifacts

| Spec-Kit artifact | Mapping trong Foundation Plan | Trách nhiệm |
|---|---|---|
| constitution | `docs/AGENTS.md`, `docs/plan/AGENTS.md`, ADRs và docs gốc | giữ nguyên tắc governance và source-of-truth |
| spec | các file `phase-*.md` trong `docs/plan/foudation/` | mô tả baseline setup, acceptance criteria và scope |
| plan | `00-execution-system-va-ai-workflow.md`, `01-roadmap-phase-dag.md` | điều phối thứ tự phase và dependency dùng chung |
| tasks | mọi block `mark-task` trong phase docs | đơn vị setup work có thể claim/verify độc lập |
| implement | `03-testing-quality-gates.md` và evidence trong issue Beads | ghi nhận verification evidence và outcome |

Quy tắc trace ổn định:
- Không đổi stable IDs `mark-phase`, `mark-task`, `mark-check` khi không thay đổi bản chất task.
- Mỗi `mark-task` map 1:1 sang một issue `type=task` trong Beads.
- Dependency trong Beads phải khớp với trường `Depends on` ở docs phase.

## Workflow Cho Agent

1. Đọc phase file liên quan và dependency phía trước.
2. Đọc source docs được link trước khi đụng code hoặc scaffold.
3. Claim issue tương ứng trong Beads.
4. Chỉ implement từng task một.
5. Nếu blocker thuộc một app-specific plan, không nhét ngược vào foundation.
6. Chỉ close task khi `Definition of done` đã đạt.

## Ràng Buộc Cứng

- Foundation không được tự đổi business rule của product.
- Foundation không được ép paid infra vào baseline nếu docs gốc chưa chốt.
- Root workspace phải tôn trọng `Bun` làm package manager chuẩn.
- Verification phải phân biệt rõ current-state commands với target-state Nx commands.
- Foundation chỉ scaffold app shells và shared boundaries; feature logic thuộc app-specific plans.

## File Map

- `00-execution-system-va-ai-workflow.md`
- `01-roadmap-phase-dag.md`
- `02-beads-seed-runbook.md`
- `03-testing-quality-gates.md`
- `phase-00-workspace-bootstrap-governance.md`
- `phase-01-local-infra-env-tooling.md`
- `phase-02-app-shells-contract-ci-baseline.md`

## Pilot Report (DPR-P04-T01)

Pilot phase được chọn: `FDN-P00` trong `phase-00-workspace-bootstrap-governance.md`.

Mục tiêu pilot:
- xác nhận trace `spec -> task -> evidence` cho Foundation Plan.
- xác nhận protocol close-evidence mới có thể tái sử dụng cho các phase khác.

Trace map:
- Spec: mục tiêu và acceptance của `FDN-P00`.
- Tasks: `FDN-P00-T01` đến `FDN-P00-T04`.
- Evidence: theo model đã chuẩn hóa ở `03-testing-quality-gates.md`.

Kết quả pilot:
- Có thể map 1:1 từ `mark-task` sang issue `type=task` mà không đổi stable IDs.
- Verification mode của từng task có evidence fields tối thiểu tương ứng (`docs-only`, `current-state`, `target-state`, `runtime`).
- Rule source-of-truth và anti-overlap giữa Spec-Kit/Beads vẫn nhất quán với `docs/plan/AGENTS.md`.

Smoke docs checks đã rà:
- metadata task trong `FDN-P00` giữ đủ trường bắt buộc.
- dependency chain trong `FDN-P00` không tạo vòng lặp.
- wording current-state/target-state không mâu thuẫn quality gates.

Kết luận:
- Pilot Foundation PASS.
- Khung pilot có thể tái sử dụng cho `FDN-P01` và `FDN-P02` mà không cần đổi template evidence.

## Full Rollout Checklist (Sau Pilot)

Checklist này áp dụng cho toàn bộ Foundation phases theo khuôn pilot đã chốt.

### A. Checklist chung cho mọi `mark-task`

- [ ] Đã map 1:1 `mark-task` -> Beads issue `type=task`.
- [ ] Issue có đủ mandatory fields theo runbook.
- [ ] Đã xác nhận `Depends on` trong issue khớp docs phase.
- [ ] Đã chọn đúng `verification_mode` cho task.
- [ ] Đã ghi `touched_paths_expected` trước khi claim.
- [ ] Khi close đã có `touched_paths_actual`.
- [ ] Khi close đã có `verification_commands` và kết quả.
- [ ] Khi close đã có test note (`n/a` hoặc danh sách checks).
- [ ] Khi close đã có `drift_check` và follow-up issue nếu lệch docs.

### B. Rollout checklist theo phase

#### `FDN-P00` Workspace Bootstrap Và Governance

- [ ] `FDN-P00-T01` hoàn tất với evidence mode `docs-only`.
- [ ] `FDN-P00-T02` hoàn tất với evidence mode `docs-only`.
- [ ] `FDN-P00-T03` hoàn tất với evidence mode `docs-only`.
- [ ] `FDN-P00-T04` hoàn tất với evidence mode `docs-only`.
- [ ] Pass toàn bộ `FDN-QG-P00-*` trong `03-testing-quality-gates.md`.

#### `FDN-P01` Local Infra, Env, Và Tooling

- [ ] `FDN-P01-T01` hoàn tất với evidence mode đã khai báo.
- [ ] `FDN-P01-T02` hoàn tất với evidence mode đã khai báo.
- [ ] `FDN-P01-T03` hoàn tất với evidence mode đã khai báo.
- [ ] `FDN-P01-T04` hoàn tất với evidence mode đã khai báo.
- [ ] Pass toàn bộ `FDN-QG-P01-*` trong `03-testing-quality-gates.md`.

#### `FDN-P02` App Shells, Contracts, CI Baseline

- [ ] `FDN-P02-T01` hoàn tất với evidence mode đã khai báo.
- [ ] `FDN-P02-T02` hoàn tất với evidence mode đã khai báo.
- [ ] `FDN-P02-T03` hoàn tất với evidence mode đã khai báo.
- [ ] `FDN-P02-T04` hoàn tất với evidence mode đã khai báo.
- [ ] `FDN-P02-T05` hoàn tất với evidence mode đã khai báo.
- [ ] Pass toàn bộ `FDN-QG-P02-*` trong `03-testing-quality-gates.md`.

### C. Rollout exit criteria cho Foundation Plan

- [ ] Tất cả tasks trong `FDN-P00..P02` có evidence hợp lệ theo mode.
- [ ] Không còn dependency blocker mở giữa Foundation phases.
- [ ] AGENTS layering vẫn nhất quán root -> docs -> plan.
- [ ] Có danh sách follow-up issues cho mọi phần deferred.
