# AGENTS.md

## Vai Trò

File này là repo-level contract cho mọi AI-agent làm việc trong project `delivery-app`.

Mục tiêu: giữ execution nhất quán, kiểm soát scope, và đảm bảo mọi thay đổi bám source docs thay vì bám scaffold code.

## Authority Model (Bắt Buộc)

Áp dụng theo thứ tự ưu tiên từ cao xuống thấp:

1. Source docs trong `docs/` (`00` đến `14`, `references.md`, ADRs).
2. File `AGENTS.md` ở root repo (file này).
3. AGENTS theo domain: `docs/AGENTS.md`, `docs/plan/AGENTS.md`, `infra/AGENTS.md`, `tools/AGENTS.md`.
4. AGENTS theo app: `apps/*/AGENTS.md`.

Rule cứng:
- Layer dưới chỉ được **specialize** layer trên, không được relax hoặc override invariant đã chốt.
- Nếu conflict, chọn layer cao hơn và ghi rõ lý do trong note thực thi.

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

Nếu task chạm product rules, API, data model, auth, dispatch, realtime, pricing, hoặc self-hosting thì đọc thêm docs chuyên biệt tương ứng.

## Workflow Chuẩn Cho AI-Agent

1. Intake + scope classification:
   - xác định task thuộc docs-only, planning, hay implementation.
   - xác định scope folder để chọn AGENTS gần nhất.
2. DoR gate trước khi claim:
   - output cần tạo rõ ràng, testable.
   - dependency rõ ràng.
   - verification mode rõ ràng.
3. Planning layer:
   - dùng Spec-Kit để định nghĩa `constitution/spec/plan/tasks`.
4. Execution tracking layer:
   - dùng Beads để claim, cập nhật blocker, ghi evidence, close task.
5. Verification + close:
   - close chỉ khi đủ evidence theo mode (`docs-only`, `current-state`, `target-state`, `runtime`).

## Hybrid Contract: Spec-Kit + Beads

- Spec-Kit:
  - dùng cho planning artifacts, acceptance criteria, dependency graph, task decomposition.
  - không dùng để tracking runtime issue lifecycle.
- Beads:
  - dùng cho issue graph, claim/close state, blocker state, evidence.
  - không dùng để thay source docs hoặc thay thế spec artifacts.

Trigger nhanh:
- Câu hỏi “build cái gì, tiêu chí gì, thứ tự gì” -> Spec-Kit.
- Câu hỏi “đang làm đến đâu, blocked gì, close chưa” -> Beads.

## Invariants Cấp Repo

- delivery path là `MVP-1 -> MVP-2 -> MVP-3`
- `MVP-1` ưu tiên core delivery flow, không kéo feature phụ vào baseline
- auth baseline là `backend-owned session`
- `dev login` là baseline hợp lệ cho `MVP-1`
- Firebase OTP-SMS (nếu có) chỉ là identity proofing, không phải auth source
- dispatch baseline là `radius + freshness + KNN`
- realtime là `HTTP-authoritative`
- onboarding đi trước chat
- worker riêng là phase sau, không là prerequisite của `MVP-1`
- local-first là baseline; không mặc định kéo paid infra
- package manager chuẩn là `bun`; không quay lại `npm`

## Verification

- luôn ghi rõ mode: `docs-only`, `current-state`, `target-state`, `runtime`
- target-state là baseline mặc định sau khi hoàn tất `FDN-R01`
- current-state chỉ dùng như fallback tạm thời khi target-state bị chặn và phải có evidence lý do
- app-level commands hiện có:
  - `apps/api`: `bun run build`, `bun run start:dev`, `bun run lint`, `bun run test`, `bun run test:e2e`
  - `apps/admin-web`: `bun run dev`, `bun run build`, `bun run lint`
  - `apps/mobile`: `bun run start`, `bun run lint`
- target-state verification sau `FDN-R01` runtime bootstrap: `nx affected -t lint typecheck test build`; khi đổi flow quan trọng chạy thêm `nx affected -t e2e`
- docs-only work bắt buộc có docs QA theo scope đã sửa (consistency, links, metadata) trước khi close

Không claim complete nếu chưa có verification evidence hoặc chưa nêu rõ vì sao task là docs-only.

## Routing Theo Scope

- source docs hoặc policy: `docs/AGENTS.md`
- execution plan, phase/task, beads/spec-kit mapping: `docs/plan/AGENTS.md`
- backend runtime: `apps/api/AGENTS.md`
- mobile runtime: `apps/mobile/AGENTS.md`
- admin web runtime: `apps/admin-web/AGENTS.md`
- deploy topology, compose, proxy: `infra/AGENTS.md`
- generators, codegen, conformance helpers: `tools/AGENTS.md`

## Không Được Làm

- không coi code scaffold hiện tại là kiến trúc cuối cùng
- không dùng websocket event như source of truth duy nhất
- không thêm paid service vào baseline nếu docs chưa chốt
- không đổi business rule hoặc invariant mà không cập nhật docs
- không tạo `package-lock.json` hoặc workflow `npm`
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
