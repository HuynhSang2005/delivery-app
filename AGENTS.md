# AGENTS.md

## Vai Trò

File này là repo-level contract cho mọi coding agent làm việc trong `delivery-app`.

Nguyên tắc precedence:
- file `AGENTS.md` gần file đang sửa hơn sẽ thắng cho phạm vi đó
- nếu `AGENTS.md` mâu thuẫn với docs gốc, ưu tiên docs gốc rồi cập nhật lại `AGENTS.md`

## Snapshot Repo

- đây là docs-driven delivery product portfolio, không phải demo UI
- target architecture đã chốt: `Nx` monorepo, `NestJS` backend, `Next.js` admin web, `Expo` mobile, `PostgreSQL + PostGIS`
- current code có thể vẫn là starter scaffold; không được suy diễn kiến trúc cuối cùng chỉ từ code hiện có
- package manager chuẩn là `bun`; không quay lại `npm`

## Source Of Truth

Trước khi làm việc đáng kể, đọc tối thiểu:
- `docs/README.md`
- `docs/01-product-requirements.md`
- `docs/02-solution-overview.md`
- `docs/03-system-architecture.md`
- `docs/09-devops-runbook.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/11-adrs.md`
- `docs/12-folder-structure.md`
- `docs/14-tech-stack-catalog.md`

Nếu task chạm product rules, API, data model, auth, dispatch, realtime, hoặc self-hosting thì đọc thêm docs chuyên biệt tương ứng trong `docs/`.

## Thứ Tự Execution

1. Nếu task chạm workspace, local infra, CI, shared boundaries, `infra/`, hoặc `tools/`, đọc `docs/plan/foudation/` trước.
2. Chỉ bắt đầu app-specific execution sau khi foundation assumptions đã thỏa.
3. Backend work phải bám `docs/plan/be/` và đọc thêm `apps/api/AGENTS.md`.
4. Nếu code scaffold và docs đã chốt mâu thuẫn nhau, tin docs trước và sửa plan hoặc docs trước khi mở rộng implementation.

## Hybrid Workflow Contract (Spec-Kit + Beads)

Mục tiêu: tách rõ planning artifacts và execution tracking để tránh overlap trách nhiệm.

- Spec-Kit là lớp spec-driven planning:
  - dùng khi cần chuẩn hóa `constitution/spec/plan/tasks/implement` artifacts
  - dùng khi tạo hoặc refactor execution blueprint, acceptance criteria, dependency graph
  - không dùng để thay issue runtime tracking
- Beads là lớp execution tracking và memory:
  - dùng khi claim work, theo dõi deps/blocker, ghi evidence, handoff qua nhiều session
  - mỗi `mark-task` phải map 1:1 sang một issue `type=task`
  - không dùng để định nghĩa hoặc thay thế source docs/spec artifacts

Trigger nhanh:
- Nếu câu hỏi là “cần build cái gì, tiêu chí gì, thứ tự gì”: đi theo Spec-Kit artifacts.
- Nếu câu hỏi là “đang làm đến đâu, bị block gì, đóng task chưa”: đi theo Beads workflow.

Quy tắc anti-overlap:
- Không close issue Beads khi chưa có evidence theo verification mode.
- Không chỉnh Spec/Plan artifacts trực tiếp trong issue tracking mà không cập nhật docs trước.
- Khi conflict, source docs + ADR vẫn là điểm quyết định cuối cùng.

## Spec-Kit Runtime Status (Post-Init)

- Spec-Kit đã được scaffold trong repo: `.specify/` và `speckit-*` skills trong `.agents/skills/`.
- Canonical workflow commands cho AI-agent: `speckit-constitution`, `speckit-specify`, `speckit-clarify`, `speckit-plan`, `speckit-tasks`, `speckit-analyze`, `speckit-implement`.
- Feature artifacts hiện tại được tạo theo script trong `.specify/scripts/powershell/` và nằm dưới `specs/<feature-branch>/`.
- Không dùng external/third-party Spec-Kit wrappers nếu chúng mâu thuẫn path hoặc flow với scaffold hiện tại.

## Invariants Cấp Repo

- delivery path là `MVP-1 -> MVP-2 -> MVP-3`
- `MVP-1` ưu tiên core delivery flow, không kéo feature phụ vào baseline
- auth baseline là `backend-owned session`
- `dev login` là baseline hợp lệ cho `MVP-1`
- Firebase OTP-SMS, nếu có, chỉ là identity proofing chứ không phải auth source
- dispatch baseline là `radius + freshness + KNN`
- realtime là `HTTP-authoritative realtime`
- onboarding đi trước chat
- worker riêng là phase sau, không phải prerequisite của `MVP-1`
- local-first là baseline; không mặc định kéo paid infra

## Verification

- luôn ghi rõ đang verify theo `current-state` hay `target-state`
- current-state hiện chưa có root-level `nx` executable baseline hoàn chỉnh
- app-level commands hiện có:
  - `apps/api`: `bun run build`, `bun run start:dev`, `bun run lint`, `bun run test`, `bun run test:e2e`
  - `apps/admin-web`: `bun run dev`, `bun run build`, `bun run lint`
  - `apps/mobile`: `bun run start`, `bun run lint`
- target-state repo verification sau foundation là `nx affected -t lint typecheck test build` và `nx affected -t e2e` khi thay đổi chạm flow quan trọng

Không claim complete nếu chưa có verification evidence hoặc chưa nêu rõ vì sao task là docs-only.

## Đọc Sâu Hơn Ở Đâu

- `docs/AGENTS.md` cho docs gốc, roadmap, ADR
- `docs/plan/AGENTS.md` cho execution plans
- `apps/api/AGENTS.md` cho backend
- `apps/mobile/AGENTS.md` cho mobile
- `apps/admin-web/AGENTS.md` cho admin web
- `infra/AGENTS.md` cho topology, deploy, proxy, compose, scripts vận hành
- `tools/AGENTS.md` cho generators, codegen, conformance helpers

## Không Được Làm

- không coi code scaffold hiện tại là kiến trúc cuối cùng
- không dùng websocket event như source of truth duy nhất
- không thêm paid service vào baseline nếu docs chưa chốt
- không đổi business rule hoặc invariant mà không cập nhật docs
- không tạo `package-lock.json` hoặc chuyển workflow sang `npm`
- không revert thay đổi của người dùng nếu không được yêu cầu


<!-- BEGIN BEADS INTEGRATION v:1 profile:full hash:f65d5d33 -->
## Issue Tracking with bd (beads)

Block này áp dụng cho AI agents chạy trong VS Code (Copilot chat, Codex extension, và agent CLI tương tự), không phụ thuộc Codex app riêng.

Nguyên tắc bắt buộc:
- Track toàn bộ execution work bằng bd; không dùng markdown TODO làm issue tracker.
- Luôn dùng `--json` cho command automation của agent.
- Mỗi task thực thi map 1:1 với issue `type=task`.
- Chỉ close issue khi đã có evidence đúng verification mode (docs-only, current-state, target-state, runtime).

Workflow tối thiểu:
1. `bd prime` để nạp workflow context chuẩn.
2. `bd ready --json` để lấy issue unblocked.
3. `bd update <id> --claim --json` để claim atomically.
4. Thực thi + ghi evidence theo runbook/docs plan.
5. `bd close <id> --reason "Completed" --json` khi đạt acceptance.
6. Cuối session: `bd dolt push`.

Lệnh thường dùng:
- `bd ready --json`
- `bd list --status=open --json`
- `bd create "<title>" -t task -p 2 --json`
- `bd create "<title>" --description "<context>" -t bug -p 1 --deps discovered-from:<parent-id> --json`
- `bd update <id> --claim --json`
- `bd close <id> --reason "Completed" --json`

Lưu ý tích hợp:
- `bd setup codex` có thể overwrite block Beads trong AGENTS; chỉ chạy lại khi thực sự cần regenerate template.
- Nguồn điều hành ưu tiên vẫn là docs/ADR + contract Spec-Kit/Beads ở file này.

Policy an toàn dữ liệu cho solo dev:
- Không track `.beads/` trong git code branch; dùng backup branch riêng cho Beads snapshot.
- Baseline backup remote: `origin/beads-backup` qua lệnh `bd backup export-git --branch beads-backup --remote origin`.
- Đầu session: chạy `bd backup fetch-git --branch beads-backup --remote origin` khi cần khôi phục state mới nhất trên máy mới.
- Cuối session: sau khi close issue quan trọng, chạy `bd backup export-git --branch beads-backup --remote origin` để chống mất dữ liệu local.
- Checklist chuẩn: xem `docs/plan/be/beads-solo-vscode-checklist.md`.

<!-- END BEADS INTEGRATION -->
