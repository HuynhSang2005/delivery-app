# Phase 00: API Baseline Adaptation Sau Foundation

<!-- mark-phase: BE-P00 -->

## Mục Tiêu

Map `apps/api` vào foundation baseline đã có sẵn để các phase sau có thể implement trong một setup Nx, NestJS, Prisma, và OpenAPI nhất quán mà không phải bootstrap lại workspace toàn repo.

## Phụ Thuộc

- `FDN-P00`
- `FDN-P01`
- `FDN-P02`
- active docs `01`, `04`, `10`, `11`, `12`, `14`

## Ngoài Phạm Vi

- auth flow cho end-user
- pricing hoặc order business logic
- dispatch hoặc chat

## Điều Kiện Đạt Phase

API project có thể boot ở mức baseline đủ test trên workspace đã scaffold, có boundary, Prisma baseline, OpenAPI baseline, và verification targets rõ ràng.

<!-- mark-task: BE-P00-T01 -->
## BE-P00-T01 Map execution baseline của API vào workspace đã được foundation scaffold

- Type: `foundation`
- Verification mode: `docs-only`
- Depends on: `FDN-P00-T02`, `FDN-P00-T04`, `FDN-P02-T01`, `FDN-P02-T04`
- Outputs: execution notes cho `apps/api`, current-state fallback commands, target naming, environment contract, và command matrix theo Nx
- Touched paths: `docs/plan/be/*`, `docs/plan/foudation/*`, `AGENTS.md`, `apps/api/AGENTS.md`
- Docs refs: `docs/12-folder-structure.md`, `docs/14-tech-stack-catalog.md`
- Verification: `apps/api/AGENTS.md`, runbook và plan docs đã ghi rõ command matrix current-state/target-state cho backend mà không mâu thuẫn
- Tests: n/a, docs-only
- Beads: `type=task`, `labels=be,phase:p00,foundation`
- Definition of done: BE-P00-T02+ có thể bắt đầu mà không cần định nghĩa lại execution commands hoặc workspace assumptions cho `apps/api`

<!-- mark-task: BE-P00-T02 -->
## BE-P00-T02 Chốt module map và boundary skeleton cho backend

- Type: `foundation`
- Verification mode: `docs-only`
- Depends on: `BE-P00-T01`
- Outputs: module map cho auth, orders, dispatch, admin, onboarding, chat, shared kernel, và infrastructure boundaries
- Touched paths: `docs/plan/be/phase-00-workspace-api-foundation.md`, `apps/api/AGENTS.md`
- Docs refs: `docs/04-backend-architecture.md`, `docs/12-folder-structure.md`
- Verification: module map đã liệt kê bounded contexts chính và layer boundaries nhất quán với `docs/04-backend-architecture.md`
- Tests: n/a, docs-only
- Beads: `type=task`, `labels=be,phase:p00,architecture`
- Definition of done: BE-P01 tasks có thể scaffold module structure theo map hiện có mà không phát sinh rule kiến trúc mới

<!-- mark-task: BE-P00-T03 -->
## BE-P00-T03 Khóa Prisma baseline và migration policy

- Type: `schema`
- Verification mode: `docs-only`
- Depends on: `FDN-P01-T01`, `FDN-P01-T02`, `FDN-P01-T03`, `BE-P00-T01`
- Outputs: Prisma rules cho driver adapter, ownership của migration, test database policy, và raw SQL exceptions
- Touched paths: `docs/plan/be/phase-00-workspace-api-foundation.md`, `apps/api/AGENTS.md`
- Docs refs: `docs/07-data-model.md`, `docs/11-adrs.md`, `docs/14-tech-stack-catalog.md`
- Verification: Prisma policy đã map rõ migration ownership, driver-adapter assumptions và raw SQL exceptions nhất quán ADR/data model
- Tests: seed checklist cho `schema smoke`
- Beads: `type=task`, `labels=be,phase:p00,schema`
- Definition of done: BE-P01/BE-P02 schema tasks có thể dùng cùng migration/query policy mà không phải mở policy task mới

<!-- mark-task: BE-P00-T04 -->
## BE-P00-T04 Chốt baseline cho OpenAPI và contract generation

- Type: `api`
- Verification mode: `docs-only`
- Depends on: `FDN-P02-T03`, `BE-P00-T01`
- Outputs: source-of-truth rule cho OpenAPI generation, contract review flow, và kỳ vọng về generated artifacts
- Touched paths: `docs/plan/be/phase-00-workspace-api-foundation.md`, `apps/api/AGENTS.md`
- Docs refs: `docs/08-api-realtime-contracts.md`, `docs/14-tech-stack-catalog.md`
- Verification: contract flow đã nêu rõ source-of-truth, generation flow và artifact ownership cho backend và consumers
- Tests: tạo checklist chống contract drift
- Beads: `type=task`, `labels=be,phase:p00,contracts`
- Definition of done: API tasks BE-P01+ có thể tham chiếu cùng contract workflow mà không tạo biến thể generation riêng

<!-- mark-task: BE-P00-T05 -->
## BE-P00-T05 Chốt backend testing harness baseline

- Type: `test`
- Verification mode: `docs-only`
- Depends on: `FDN-P00-T04`, `FDN-P02-T04`, `BE-P00-T01`, `BE-P00-T03`, `BE-P00-T04`
- Outputs: backend test pyramid, fixture policy, geo fixture policy, và command targets cho unit, integration, api, contract, smoke
- Touched paths: `docs/plan/be/03-testing-quality-gates.md`, `apps/api/AGENTS.md`
- Docs refs: `docs/10-testing-roadmap-risk.md`
- Verification: testing plan đã map rõ nhóm test (unit/integration/api/contract/smoke) theo roadmap phases và bounded contexts
- Tests: docs-only
- Beads: `type=task`, `labels=be,phase:p00,testing`
- Definition of done: BE-P01+ tasks có thể khai báo test strategy từ baseline hiện có mà không cần định nghĩa quality model mới

## Mini Checklist Pass/Fail (Pass 3)

Quy ước đo lường: mỗi dòng là điều kiện pass/fail nhị phân; nếu có số lượng thì ưu tiên ngưỡng dạng >= N.

### BE-P00-T01

- [ ] Pass khi `apps/api` command matrix có đủ `current-state` fallback và `target-state` expectations.
- [ ] Pass khi Không còn assumptions vượt quá foundation readiness.
- [ ] Pass khi `apps/api/AGENTS.md` và plan wording nhất quán về execution baseline.

### BE-P00-T02

- [ ] Pass khi Module map liệt kê đủ tối thiểu 7 bounded contexts đã nêu trong output.
- [ ] Pass khi Có layer boundary rõ để hạn chế coupling giữa modules.
- [ ] Pass khi Không có module naming mâu thuẫn với `docs/04` và `docs/12`.

### BE-P00-T03

- [ ] Pass khi Prisma policy nêu rõ migration ownership và raw SQL exception conditions.
- [ ] Pass khi Có ràng buộc driver-adapter assumptions nhất quán ADR/data model.
- [ ] Pass khi Có đường kiểm chứng schema smoke baseline cho phase kế tiếp.

### BE-P00-T04

- [ ] Pass khi OpenAPI source-of-truth path và generation flow được nêu rõ theo bước.
- [ ] Pass khi Artifact ownership giữa backend và consumers được mô tả không mơ hồ.
- [ ] Pass khi Có ít nhất 1 rule chống contract drift.

### BE-P00-T05

- [ ] Pass khi Test pyramid nêu đủ 5 nhóm: unit, integration, api, contract, smoke.
- [ ] Pass khi Có mapping tối thiểu một command/entrypoint cho mỗi nhóm test.
- [ ] Pass khi Fixture policy có note deterministic để phase sau kế thừa.
