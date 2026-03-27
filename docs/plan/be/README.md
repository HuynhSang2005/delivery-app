# Backend Execution System

`docs/plan/be` là execution system cho `apps/api`, nhưng không thay thế product hoặc architecture baseline của bộ docs chính.

Execution system này chỉ được coi là reachable sau khi baseline ở `Foundation Plan (path hiện tại: docs/plan/foudation/)` đã chốt xong cho workspace, local infra, app shells, và verification path dùng chung.

Folder này biến backend docs thành hệ thống công việc mà AI có thể đọc, hiểu và thực thi trực tiếp:
- roadmap theo phase
- mô hình phụ thuộc kiểu DAG
- task `mark-task` đủ nhỏ để AI làm
- quality gate và test checklist
- quy tắc seed issue bằng Beads
- workflow và ràng buộc vận hành cho agent

## Nguồn Sự Thật

Folder này phải đi theo, không được ghi đè, các docs đang là source of truth:
- `docs/01-product-requirements.md`
- `docs/04-backend-architecture.md`
- `docs/07-data-model.md`
- `docs/08-api-realtime-contracts.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/11-adrs.md`
- `docs/12-folder-structure.md`
- `docs/14-tech-stack-catalog.md`

Nếu task trong folder này mâu thuẫn với các docs trên, ưu tiên `docs/01` đến `docs/14` và `docs/11-adrs.md`, rồi sửa folder này trước khi tiếp tục execution.

## Mô Hình Thực Thi

Roadmap backend được chia theo phase. Mỗi phase phải có:
- mục tiêu rõ ràng
- dependency đầu vào
- acceptance gate
- task đủ nhỏ
- checklist verification và testing

Quy tắc: `1 task = 1 output có thể verify được`.

`BE-P00` không còn sở hữu bootstrap của toàn repo. Từ thời điểm có `Foundation Plan (path hiện tại: docs/plan/foudation/)`, `BE-P00` chỉ còn xử lý phần adaptation dành riêng cho `apps/api` trên nền workspace đã được foundation phase dựng sẵn.

Không tạo task mơ hồ kiểu:
- "làm auth"
- "hoàn thiện dispatch"
- "thêm realtime"

Ưu tiên task kiểu:
- "tạo Prisma model `auth_sessions` và migration"
- "implement `POST /api/v1/auth/dev-login` với session issuance"
- "thêm candidate driver query dùng `ST_DWithin` + KNN ordering"

## Marker

Dùng các marker này để AI và con người parse plan ổn định:

- `<!-- mark-phase: BE-P00 -->`
- `<!-- mark-task: BE-P00-T01 -->`
- `<!-- mark-check: BE-QG-P00-C01 -->`

Task ID là stable ID. Không đổi ID cũ trừ khi task bị bỏ hẳn và thay bằng task khác.

## Chuẩn Metadata Cho Task

Mỗi task phải có:
- `Type`
- `Verification mode`
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
- `schema`
- `api`
- `application`
- `realtime`
- `read-model`
- `ops`
- `scope-control`
- `test`
- `docs`

## Mapping Với Beads

Mỗi `mark-task` nên map tới đúng một issue trong Beads.

Shape issue khuyến nghị:
- title: câu ngắn, rõ hành động
- type: `feature`, `task`, `bug`, hoặc `epic`
- labels: `be`, label phase, label bounded context
- deps: chỉ khai báo dependency trực tiếp bằng `mark-task` ID

Tên khuyến nghị:
- epic: `BE-P03 Driver Dispatch And Realtime`
- task: `BE-P03-T04 Accept dispatch offer with conflict-safe transition`

## Mapping Với Spec-Kit Artifacts

| Spec-Kit artifact | Mapping trong backend plan | Trách nhiệm |
|---|---|---|
| constitution | `docs/AGENTS.md`, `docs/plan/AGENTS.md`, ADRs liên quan backend | giữ invariants và source-of-truth rule |
| spec | các file `phase-*.md` trong `docs/plan/be/` | mô tả mục tiêu phase, acceptance criteria, task boundaries |
| plan | `00-execution-system-va-ai-workflow.md`, `01-roadmap-phase-dag.md` | sequencing, dependency, execution order |
| tasks | mọi block `mark-task` trong phase docs | đơn vị công việc nhỏ có thể claim và verify |
| implement | `03-testing-quality-gates.md`, `04-smoke-contract.md`, evidence trong issue Beads | bằng chứng thực thi + kết quả verification |

Quy tắc trace ổn định:
- Không đổi stable IDs `mark-phase`, `mark-task`, `mark-check` khi chỉ refactor wording.
- Mỗi `mark-task` map 1:1 sang một issue `type=task` trong Beads.
- Dependency trong Beads phải phản ánh đúng trường `Depends on` của task docs.

## Workflow Cho Agent

1. Đọc phase file liên quan và dependency phía trước.
2. Đọc source docs được link trước khi đụng code.
3. Nếu dependency đang nằm ở `Foundation Plan (path hiện tại: docs/plan/foudation/)`, xử lý foundation trước khi claim task backend.
4. Claim issue tương ứng trong Beads.
5. Chỉ implement từng task một.
6. Chỉ chạy đúng verification đã liệt kê cho task đó.
7. Nếu quá trình implement lộ ra mismatch thật ở docs, cập nhật docs trước.
8. Chỉ close task khi `Definition of done` đã đạt.

## Ràng Buộc Cứng

- Backend vẫn là source of truth cho auth session.
- Firebase OTP-SMS nếu dùng chỉ là identity proofing, không phải canonical app session.
- Dispatch baseline là `radius + freshness + KNN`, route-aware ranking để phase sau.
- Realtime chỉ hỗ trợ UX. HTTP và persisted state mới là nguồn sự thật cuối cùng.
- Background location không phải always-on cho mọi user; chỉ áp dụng theo policy duty hoặc active order.
- Chat đi sau onboarding và dispatch baseline.
- Worker extraction đi sau baseline synchronous, trừ khi một phase nói rõ khác đi.

## File Map

- `00-execution-system-va-ai-workflow.md`
- `01-roadmap-phase-dag.md`
- `02-beads-seed-runbook.md`
- `03-testing-quality-gates.md`
- `04-smoke-contract.md`
- `05-deterministic-fixtures-catalog.md`
- `phase-00-workspace-api-foundation.md`
- `phase-01-auth-session-accounts.md`
- `phase-02-pricing-quotes-orders.md`
- `phase-03-driver-presence-dispatch-realtime.md`
- `phase-04-admin-ops-read-models.md`
- `phase-05-driver-onboarding-review.md`
- `phase-06-chat-worker-hardening.md`

## Pilot Report (DPR-P04-T02)

Pilot phase được chọn: `BE-P00` trong `phase-00-workspace-api-foundation.md`.

Mục tiêu pilot:
- xác nhận trace `spec -> task -> evidence` cho Backend Plan.
- xác nhận protocol evidence mới hoạt động với task docs-only và readiness cho phase runtime sau đó.

Trace map:
- Spec: mục tiêu phase và acceptance `BE-P00`.
- Tasks: `BE-P00-T01` đến `BE-P00-T05`.
- Evidence: map theo verification mode trong `03-testing-quality-gates.md` và smoke contract trong `04-smoke-contract.md`.

Kết quả pilot:
- Mapping 1:1 `mark-task` -> issue `type=task` vẫn giữ ổn định.
- Metadata task của `BE-P00` tương thích close-evidence rule và mandatory fields đã chuẩn hóa ở runbook.
- Boundary giữa Foundation assumptions và Backend adaptation được giữ rõ, không kéo ngược scope.

Smoke docs checks đã rà:
- danh sách task `BE-P00` giữ đầy đủ trường metadata bắt buộc.
- dependency path của `BE-P00` nhất quán với DAG và không có dependency mơ hồ.
- contract wording cho current-state/target-state và verification mode không mâu thuẫn với quality gates.

Kết luận:
- Pilot Backend PASS.
- Workflow sẵn sàng rollout cho toàn bộ backend phases với cùng protocol evidence.

## Full Rollout Checklist (Sau Pilot)

Checklist này áp dụng cho toàn bộ Backend phases theo khuôn pilot đã chốt.

### A. Checklist chung cho mọi `mark-task`

- [ ] Đã map 1:1 `mark-task` -> Beads issue `type=task`.
- [ ] Issue có đủ mandatory fields theo runbook backend.
- [ ] `Depends on` trong issue khớp dependency docs phase.
- [ ] `verification_mode` của issue khớp task docs.
- [ ] Trước claim đã ghi `touched_paths_expected`.
- [ ] Khi close đã ghi `touched_paths_actual`.
- [ ] Có `verification_commands` và kết quả pass hoặc fail.
- [ ] Có test note (`n/a` hoặc suite/check đã chạy).
- [ ] Có `drift_check` và follow-up issue nếu lệch source docs.

### B. Rollout checklist theo phase

#### `BE-P00` API Baseline Adaptation

- [ ] `BE-P00-T01` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P00-T02` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P00-T03` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P00-T04` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P00-T05` hoàn tất với evidence mode đã khai báo.
- [ ] Pass toàn bộ `BE-QG-P00-*` trong `03-testing-quality-gates.md`.

#### `BE-P01` Auth, Sessions, Accounts

- [ ] `BE-P01-T01` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P01-T02` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P01-T03` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P01-T04` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P01-T05` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P01-T06` hoàn tất với evidence mode đã khai báo.
- [ ] Pass toàn bộ `BE-QG-P01-*` trong `03-testing-quality-gates.md`.

#### `BE-P02` Pricing, Quotes, Orders

- [ ] `BE-P02-T01` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P02-T02` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P02-T03` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P02-T04` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P02-T05` hoàn tất với evidence mode đã khai báo.
- [ ] Pass toàn bộ `BE-QG-P02-*` trong `03-testing-quality-gates.md`.

#### `BE-P03` Presence, Dispatch, Realtime

- [ ] `BE-P03-T01` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P03-T02` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P03-T03` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P03-T04` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P03-T05` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P03-T06` hoàn tất với evidence mode đã khai báo.
- [ ] Pass toàn bộ `BE-QG-P03-*` trong `03-testing-quality-gates.md`.

#### `BE-P04` Admin Ops Read Models

- [ ] `BE-P04-T01` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P04-T02` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P04-T03` hoàn tất với evidence mode đã khai báo.
- [ ] Pass toàn bộ `BE-QG-P04-*` trong `03-testing-quality-gates.md`.

#### `BE-P05` Driver Onboarding Review

- [ ] `BE-P05-T01` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P05-T02` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P05-T03` hoàn tất với evidence mode đã khai báo.
- [ ] Pass toàn bộ `BE-QG-P05-*` trong `03-testing-quality-gates.md`.

#### `BE-P06` Chat, Worker, Hardening

- [ ] `BE-P06-T01` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P06-T02` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P06-T03` hoàn tất với evidence mode đã khai báo.
- [ ] `BE-P06-T04` hoàn tất với evidence mode đã khai báo.
- [ ] Pass toàn bộ `BE-QG-P06-*` trong `03-testing-quality-gates.md`.

### C. Rollout exit criteria cho Backend Plan

- [ ] Tất cả tasks trong `BE-P00..P06` có evidence hợp lệ theo mode.
- [ ] Không còn dependency blocker mở giữa các phase backend.
- [ ] Mọi flow realtime quan trọng có reconciliation note với HTTP hoặc DB state.
- [ ] Có follow-up issues cho mọi deferred scope sau MVP baseline.
