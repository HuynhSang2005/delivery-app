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
