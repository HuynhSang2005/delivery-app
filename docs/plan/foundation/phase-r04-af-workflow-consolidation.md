# Phase R04: A-F Workflow Consolidation

<!-- mark-phase: FDN-R04 -->

## Mục Tiêu

Tạo một kế hoạch tổng hợp từ A đến F để đóng toàn bộ khoảng trống QA/QC còn lại sau R02/R03: đồng bộ docs truth, chốt CI gate semantics có thể kiểm chứng, nâng quality gates từ "hình thức" thành "fail-fast", chuẩn hóa contract workflow theo một baseline Hey API rõ ràng, và giảm review noise từ artifact/dependency drift.

R04 không chỉ xử lý contract-client stack. Phase này phải đóng được coverage cho toàn bộ foundation techstack: workspace core (`bun`, `Nx`), app runtimes (`Nest`, `Next`, `Expo`), data/infra (`Prisma`, `PostgreSQL/PostGIS`, Redis profiles, Docker Compose), quality/security (`lint`, `typecheck`, `test`, CI guardrails), và release-readiness (`smoke`, observability, artifact hygiene).

R04 ưu tiên đóng "execution ambiguity" hơn là mở feature mới. Mọi task trong phase này phải cho ra bằng chứng có thể lặp lại theo verification mode đã khai báo.

## In Scope

- đồng bộ trạng thái giữa acceptance docs và quality-gates
- chốt gate semantics trong CI cho e2e (blocking/non-blocking)
- thay placeholder scripts và nâng conformance từ check hình thức sang check thực chất
- chuẩn hóa baseline `@hey-api/openapi-ts` cho contract workflow (`fetch` client baseline, runtime config path, version pin)
- chốt decision matrix cho Hey API plugins: `@tanstack/react-query`, validators (`zod`), `nestjs` plugin (beta), và `~resolvers`
- áp dụng shared `api-client` vào consumer app theo pilot flow
- căn chỉnh release-smoke với runtime observability path thực tế
- chốt artifact hygiene cho mobile web export và pin exact version cho hey-api
- lập full-stack coverage map cho Foundation (workspace, frameworks, data layer, infra, security, testing, release)
- đóng khoảng trống mapping giữa baseline docs (`01/02/03/09/10/11/13/14`) và runtime evidence paths thực tế trong repo

## Dependencies

- `FDN-R02`
- `FDN-R03`
- active docs `08`, `09`, `10`, `12`, `14`

## Out Of Scope

- implement feature business mới
- thay đổi product rules trong `docs/01..07`
- mở rộng scope sang app feature roadmap ngoài nhóm A-F

## Acceptance Gate

- [x] docs status của R02/R03 và quality-gates không còn conflict
- [x] CI gate semantics được chốt rõ ràng và phản ánh đúng trong workflow
- [x] placeholder scripts được thay bằng checks có giá trị runtime hoặc policy fail-fast rõ
- [x] Hey API baseline và plugin decisions được chốt theo source docs + official docs, có rationale và adoption path rõ
- [x] shared `api-client` được consume ít nhất 1 flow thực tế
- [x] release-smoke xác minh đúng runtime observability path
- [x] mobile artifact hygiene và hey-api version pin được chốt theo policy
- [x] không còn foundation-techstack orphan: mọi stack baseline trong `docs/14` + ADR liên quan (`021..026`) đều có owner task, verification path, và risk note

## Task Index

| ID | Type | Verification mode | Depends on | Output |
|---|---|---|---|---|
| `FDN-R04-T01` | `docs` | `docs-only` | `FDN-R03-T05` | Reconcile docs truth cho R02/R03 và quality-gates |
| `FDN-R04-T02` | `test` | `target-state` | `FDN-R04-T01`, `FDN-R03-T01` | CI gate hardening cho e2e + fallback policy |
| `FDN-R04-T03` | `tooling` | `runtime` | `FDN-R04-T02`, `FDN-R02-T03` | Placeholder removal + conformance hardening |
| `FDN-R04-T04` | `contracts` | `docs-only` | `FDN-R04-T03`, `FDN-R02-T02` | Hey API baseline + plugin decision matrix |
| `FDN-R04-T05` | `contracts` | `runtime` | `FDN-R04-T04` | Pilot adoption `api-client` trên consumer app |
| `FDN-R04-T06` | `ops` | `runtime` | `FDN-R04-T05`, `FDN-R03-T03` | Runtime-aligned observability smoke contracts |
| `FDN-R04-T07` | `tooling` | `target-state` | `FDN-R04-T06` | Artifact hygiene + hey-api exact version pin |
| `FDN-R04-T08` | `docs` | `docs-only` | `FDN-R04-T07` | Foundation full-techstack coverage matrix + orphan-gap closure |

## Foundation Techstack Coverage Map (R04 Scope)

| Nhóm | Baseline cần cover | Primary task trong R04 |
|---|---|---|
| Workspace core | `bun`, `Nx`, target contracts, affected execution | `FDN-R04-T02`, `FDN-R04-T03`, `FDN-R04-T08` |
| App runtimes | `Nest`, `Next`, `Expo` shell verification paths | `FDN-R04-T03`, `FDN-R04-T06`, `FDN-R04-T08` |
| Contract + server-state | OpenAPI, `@hey-api/*`, `@tanstack/react-query`, validators, resolver policy | `FDN-R04-T04`, `FDN-R04-T05` |
| Data + infra | PostgreSQL/PostGIS, Redis profiles (`redis`/`debug`/`jobs`), compose governance, backup/restore continuity | `FDN-R04-T02`, `FDN-R04-T06`, `FDN-R04-T08` |
| Quality + security | lint/typecheck/test/build/e2e contracts, dependency review, secret scanning, PR policy | `FDN-R04-T02`, `FDN-R04-T03`, `FDN-R04-T08` |
| Release readiness | release-smoke runtime assertions, artifact hygiene, deterministic reproducibility | `FDN-R04-T06`, `FDN-R04-T07`, `FDN-R04-T08` |

<!-- mark-task: FDN-R04-T01 -->
### FDN-R04-T01 Reconcile docs truth cho R02-R03 va quality-gates

- Type: `docs`
- Verification mode: `docs-only`
- Depends on: `FDN-R03-T05`
- Outputs: trạng thái checklist/acceptance được đồng bộ giữa phase docs và quality-gates
- Touched paths: `docs/plan/foundation/phase-r02-shared-platform-runtime.md`, `docs/plan/foundation/phase-r03-operations-release-readiness.md`, `docs/plan/foundation/03-testing-quality-gates.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`, `docs/plan/AGENTS.md`
- Verification: đối chiếu line-by-line không còn xung đột completion state giữa `Acceptance Gate`, `Task Index`, và `mark-check` quality gates
- Tests: docs consistency checks (`rg "\[x\]|\[ \]" docs/plan/foundation/*.md` + manual drift review)
- Beads: `type=task`, `labels=foundation,phase:r04,docs,reconcile`
- Definition of done: completion signal là duy nhất và không còn double-truth

<!-- mark-task: FDN-R04-T02 -->
### FDN-R04-T02 Chot CI gate semantics cho e2e va fallback

- Type: `test`
- Verification mode: `target-state`
- Depends on: `FDN-R04-T01`, `FDN-R03-T01`
- Outputs: workflow CI và runbook sử dụng cùng một semantic gate cho e2e
- Touched paths: `.github/workflows/ci.yml`, `docs/09-devops-runbook.md`, `AGENTS.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`
- Verification: e2e gate behavior (blocking hoặc non-blocking) được enforce đúng policy đã chốt và có fallback note rõ khi không chạy target-state đầy đủ
- Tests: target-state CI verification (`bun run affected`, `bun run affected:e2e` theo condition matrix)
- Beads: `type=task`, `labels=foundation,phase:r04,testing,ci-gate`
- Definition of done: không còn trường hợp CI xanh sai nghĩa gate

<!-- mark-task: FDN-R04-T03 -->
### FDN-R04-T03 Loai bo quality gate hinh thuc va nang conformance

- Type: `tooling`
- Verification mode: `runtime`
- Depends on: `FDN-R04-T02`, `FDN-R02-T03`
- Outputs: placeholder scripts được thay thế và conformance detect được target fake/placeholder
- Touched paths: `apps/admin-web/package.json`, `apps/mobile/package.json`, `packages/api-client/package.json`, `packages/shared-kernel/package.json`, `tools/workspace-conformance/src/check-workspace-conformance.mjs`
- Docs refs: `docs/10-testing-roadmap-risk.md`, `docs/14-tech-stack-catalog.md`
- Verification: conformance fail-fast nếu scripts vẫn là placeholder (`echo`, `No * yet`) và output chỉ rõ package vi phạm
- Tests: tooling smoke + package-level checks (`bun run workspace:conformance`, `bun run shared:smoke`)
- Beads: `type=task`, `labels=foundation,phase:r04,tooling,quality-gate`
- Definition of done: gate pass phải phản ánh run được checks thực chất

<!-- mark-task: FDN-R04-T04 -->
### FDN-R04-T04 Chot Hey API baseline va plugin decision matrix

- Type: `contracts`
- Verification mode: `docs-only`
- Depends on: `FDN-R04-T03`, `FDN-R02-T02`
- Outputs: decision matrix có rationale + non-goals cho `client-fetch` baseline, `client-next` consideration, `@tanstack/react-query`, validators `zod`, `nestjs` plugin (beta), và `~resolvers`
- Touched paths: `docs/14-tech-stack-catalog.md`, `docs/08-api-realtime-contracts.md`, `docs/plan/foundation/phase-r04-af-workflow-consolidation.md`, `openapi-ts.config.ts`
- Docs refs: `docs/08-api-realtime-contracts.md`, `docs/14-tech-stack-catalog.md`, official docs `@hey-api/openapi-ts` (clients/plugins/resolvers)
- Verification: matrix nêu rõ `adopt now`, `defer`, hoặc `pilot` cho từng plugin và lý do khớp repo invariants (`bun`, single canonical contract workflow, no app-specific SDK divergence)
- Tests: `n/a (docs-only)`
- Beads: `type=task`, `labels=foundation,phase:r04,contracts,hey-api`
- Definition of done: team có baseline codegen rõ, không còn tranh luận mơ hồ về plugin scope trong MVP-1

<!-- mark-task: FDN-R04-T05 -->
### FDN-R04-T05 Pilot shared api-client adoption tren consumer app

- Type: `contracts`
- Verification mode: `runtime`
- Depends on: `FDN-R04-T04`
- Outputs: ít nhất một flow consumer (admin-web hoặc mobile) dùng generated client thay vì nội bộ
- Touched paths: `apps/admin-web/**`, `apps/mobile/**`, `packages/api-client/**`, `docs/08-api-realtime-contracts.md`
- Docs refs: `docs/08-api-realtime-contracts.md`, `docs/12-folder-structure.md`
- Verification: flow pilot build/typecheck pass và không drift với contract sync (`bun run contract:sync`, `bun run --cwd packages/api-client check:generated`)
- Tests: contract smoke + consumer smoke (ít nhất 1 query/mutation path qua generated client)
- Beads: `type=task`, `labels=foundation,phase:r04,contracts,adoption`
- Definition of done: shared contract có giá trị runtime rõ ràng

<!-- mark-task: FDN-R04-T06 -->
### FDN-R04-T06 Align release-smoke voi runtime observability path

- Type: `ops`
- Verification mode: `runtime`
- Depends on: `FDN-R04-T05`, `FDN-R03-T03`
- Outputs: release smoke check đúng path runtime thay vì test thư viện đơn lẻ
- Touched paths: `tools/release-smoke/run-release-smoke.mjs`, `apps/admin-web/app/layout.tsx`, `apps/admin-web/app/observability-provider.tsx`, `apps/mobile/app/_layout.tsx`
- Docs refs: `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`
- Verification: happy/unhappy observability signals được assert trên runtime wiring thực tế
- Tests: release smoke runtime checks (`bun run release:smoke`)
- Beads: `type=task`, `labels=foundation,phase:r04,ops,observability`
- Definition of done: smoke pass đồng nghĩa runtime path pass

<!-- mark-task: FDN-R04-T07 -->
### FDN-R04-T07 Chot artifact hygiene va hey-api version pin

- Type: `tooling`
- Verification mode: `target-state`
- Depends on: `FDN-R04-T06`
- Outputs: mobile web export artifact policy nhất quán và hey-api dependencies được pin exact
- Touched paths: `apps/mobile/.gitignore`, `apps/mobile/package.json`, `package.json`, `packages/api-client/package.json`, `openapi-ts.config.ts`
- Docs refs: `docs/09-devops-runbook.md`, `docs/14-tech-stack-catalog.md`
- Verification: không còn generated artifact noise ngoài policy và codegen reproducible theo version pin
- Tests: shared smoke + release smoke + dependency policy checks (`bun run shared:smoke`, `bun run release:smoke`)
- Beads: `type=task`, `labels=foundation,phase:r04,tooling,hygiene`
- Definition of done: pipeline reproducible hơn và review noise giảm rõ

<!-- mark-task: FDN-R04-T08 -->
### FDN-R04-T08 Chot full-techstack coverage matrix va orphan-gap closure

- Type: `docs`
- Verification mode: `docs-only`
- Depends on: `FDN-R04-T07`
- Outputs: coverage matrix cho toàn bộ foundation stack với cột `baseline tech`, `owner task`, `verification path`, `risk note`, `defer reason` (nếu có)
- Touched paths: `docs/plan/foundation/phase-r04-af-workflow-consolidation.md`, `docs/14-tech-stack-catalog.md`, `docs/11-adrs.md`, `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`, `docs/13-infrastructure-self-hosting.md`
- Docs refs: `docs/02-solution-overview.md`, `docs/03-system-architecture.md`, `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`, `docs/11-adrs.md`, `docs/13-infrastructure-self-hosting.md`, `docs/14-tech-stack-catalog.md`
- Verification: không còn baseline tech nào bị "đề cập nhưng không có verification owner"; mọi mục deferred có non-goal hoặc điều kiện kích hoạt rõ
- Tests: `n/a (docs-only)`
- Beads: `type=task`, `labels=foundation,phase:r04,docs,techstack-coverage`
- Definition of done: Foundation plan phản ánh đầy đủ toàn stack, không còn lệch trọng tâm vào một lib đơn lẻ

#### FDN-R04-T08 Coverage Matrix (Detailed Closure)

| Baseline tech | Owner task | Verification path | Risk note | Defer reason |
| --- | --- | --- | --- | --- |
| `bun` workspace + `nx` core + `@nx/*` plugins | `FDN-R04-T02`, `FDN-R04-T03`, `FDN-R04-T08` | `bun run affected --base=$NX_BASE --head=$NX_HEAD`, `bun run affected:e2e --base=$NX_BASE --head=$NX_HEAD`, `nx graph` | sai base/head khiến `affected` bỏ sót impact thực tế | `Nx Cloud`/distributed execution defer tới khi có nhu cầu scale CI rõ |
| `nestjs` runtime (`@nestjs/swagger`, `@nestjs/terminus`) | `FDN-R03-T03`, `FDN-R04-T06` | `bun run --cwd apps/api lint`, `bun run --cwd apps/api test`, `bun run --cwd apps/api build`, `bun run release:smoke` | OpenAPI/health/log contracts có thể drift nếu smoke không bám runtime wiring | tracing stack đầy đủ defer sau `MVP-1` |
| `next` admin runtime + server-state baseline | `FDN-R04-T05`, `FDN-R04-T06` | `bun run --cwd apps/admin-web lint`, `bun run --cwd apps/admin-web typecheck`, `bun run --cwd apps/admin-web build`, `bun run release:smoke` | app shell có thể pass build nhưng hỏng runtime observability hooks | advanced telemetry defer theo phase hardening |
| `expo`/`react-native` mobile runtime | `FDN-R04-T03`, `FDN-R04-T06`, `FDN-R04-T08` | `bun run --cwd apps/mobile lint`, `bun run --cwd apps/mobile typecheck`, `bun run --cwd apps/mobile build`, `bun run release:smoke` | dễ over-claim background/reconnect capability ngoài runtime thật | background tracking đầy đủ defer theo điều kiện ADR-026 |
| OpenAPI + `@hey-api/openapi-ts` + `@hey-api/client-fetch` | `FDN-R04-T04`, `FDN-R04-T05`, `FDN-R04-T07` | `bun run contract:export`, `bun run contract:generate`, `bun run contract:sync`, `bun run --cwd packages/api-client check:generated` | generated artifact drift hoặc multi-SDK divergence làm mất canonical contract path | plugin beta/multi-client generators defer để giữ scope MVP-1 |
| `prisma` + PostgreSQL/PostGIS | `FDN-R02-T04`, `FDN-R03-T02`, `FDN-R04-T08` | `bun run db:migrate`, `bun run db:seed`, `bun run db:smoke`, `bun run db:drill:backup-restore` | migration/seed/reset drift làm hỏng deterministic demo runtime | managed DB workflows defer tới self-host hardening |
| Redis profile governance (`redis`, `debug`, `jobs`) | `FDN-R02-T04`, `FDN-R04-T08` | `bun run db:up:redis`, `bun run db:up:debug`, `bun run job:db-backup` | Redis bị coi là source-of-truth nếu boundary không rõ | Redis optional ở baseline, bật bắt buộc khi worker/transient path được duyệt |
| Quality/security stack (`eslint`, `typescript`, `jest`, dependency review, gitleaks, PR policy) | `FDN-R03-T01`, `FDN-R03-T04`, `FDN-R04-T03`, `FDN-R04-T08` | `bun run workspace:conformance`, `bun run shared:smoke`, CI guardrails workflows | placeholder gate hoặc policy drift tạo false-green | guardrails nâng cao defer sau khi core flows ổn định |
| Release-readiness (`release:smoke`, observability wiring, artifact hygiene) | `FDN-R03-T05`, `FDN-R04-T06`, `FDN-R04-T07`, `FDN-R04-T08` | `bun run release:smoke` + docs alignment `09/10/13/14` | smoke không assert runtime wiring thật sẽ mất giá trị release gate | synthetic monitoring đầy đủ defer ở phase sau |
| ADR-021..026 continuity | `FDN-R04-T08` (cross-doc ownership) | `docs/11-adrs.md` coverage anchor + linked command paths trong `docs/09`, `docs/10`, `docs/13`, `docs/14` | ADR nói đúng nhưng không map execution owner sẽ tạo orphan governance | mọi defer phải có trigger hoặc non-goal ghi rõ trong source docs |

## Mini Checklist Pass/Fail (Pass 3)

### FDN-R04-T01

- [x] Pass khi R02/R03 acceptance và quality-gates khớp nhau 100%.
- [x] Pass khi không còn check vừa [x] ở phase và [ ] ở quality-gates cho cùng một gate.
- [x] Pass khi docs-only evidence có đủ touched paths + drift note.

### FDN-R04-T02

- [x] Pass khi e2e semantics được chốt một nghĩa duy nhất trong CI và runbook.
- [x] Pass khi fallback có điều kiện + evidence mode rõ ràng.
- [x] Pass khi output CI đủ để debug failure path.

### FDN-R04-T03

- [x] Pass khi placeholder scripts ở 4 project được loại bỏ hoặc thay bằng gate có giá trị.
- [x] Pass khi conformance helper detect được script placeholder.
- [x] Pass khi gate fail-fast trước merge nếu vi phạm.

### FDN-R04-T04

- [x] Pass khi decision matrix phân loại rõ `adopt now/defer/pilot` cho: `client-fetch`, `client-next`, `@tanstack/react-query`, `zod validator`, `nestjs`, `~resolvers`.
- [x] Pass khi rationale bám source docs + official docs và không vi phạm repo invariants (`bun`, canonical contract path, no app-specific SDK split).
- [x] Pass khi có explicit non-goals cho phần deferred (tránh scope creep vào business features).

### FDN-R04-T05

- [x] Pass khi pilot consumer dùng `api-client` thực tế.
- [x] Pass khi contract sync không phát sinh drift generated artifacts.
- [x] Pass khi không tạo client flow duplicate trong app layer.

### FDN-R04-T06

- [x] Pass khi release-smoke verify runtime observability wiring.
- [x] Pass khi có happy/unhappy assertion cho admin + mobile + api.
- [x] Pass khi smoke fail đúng lý do nếu runtime path hư.

### FDN-R04-T07

- [x] Pass khi mobile export artifact policy nhất quán với ignore strategy.
- [x] Pass khi `@hey-api/openapi-ts` và runtime liên quan được pin exact theo policy.
- [x] Pass khi shared/release smoke vẫn ổn định sau hygiene changes.

### FDN-R04-T08

- [x] Pass khi coverage map có đủ 6 nhóm: workspace, runtimes, contract-client, data-infra, quality-security, release.
- [x] Pass khi mọi baseline tech trong `docs/14` và ADR `021..026` đều map được owner task + verification path.
- [x] Pass khi mọi mục deferred có trigger condition hoặc non-goal rõ để tránh scope drift.
