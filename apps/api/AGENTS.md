# AGENTS.md

## Vai Trò

File này là backend contract cho mọi công việc trong `apps/api`.

File này chỉ được specialize root/domain contracts cho phạm vi backend, không được override source docs hoặc repo invariants.

## Source Of Truth Cho Backend

Đọc tối thiểu trước khi sửa backend:
- `docs/04-backend-architecture.md`
- `docs/07-data-model.md`
- `docs/08-api-realtime-contracts.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/11-adrs.md`
- `docs/12-folder-structure.md`
- `docs/14-tech-stack-catalog.md`

Nếu task thuộc execution plan:
- đọc `docs/plan/foudation/` trước nếu task còn chạm workspace, infra, contracts baseline, hoặc verification baseline
- đọc `docs/plan/be/README.md` và phase file tương ứng trước khi implement

## Trạng Thái Hiện Tại

- `apps/api` hiện có thể vẫn là Nest starter scaffold
- package manager hiện tại là `bun`
- không được phát triển sâu theo scaffold nếu nó đi ngược docs hoặc execution plan

## Kiến Trúc Bắt Buộc

- backend đi theo `NestJS modular monolith`
- giữ boundary rõ giữa `presentation`, `application`, `domain`, `infrastructure`
- không nhét business logic vào controller, gateway, guard kỹ thuật, hoặc Prisma query rải rác

Core backend contexts phải bám docs:
- `auth`
- `quotes`
- `orders`
- `dispatch`
- `admin`
- `onboarding`
- `chat`
- identity hoặc capability concerns liên quan accounts hoặc drivers

`realtime` là transport và UX support path, không phải business source of truth riêng.

## Cannot Relax

- auth source là backend-owned session
- `/auth/me` là identity truth cho client
- realtime chỉ assistive; HTTP và persisted state là authoritative
- dispatch baseline là `radius + freshness + KNN`
- onboarding đi trước chat trong delivery path
- không đổi business enum/lifecycle/contract khi chưa cập nhật docs

## Invariants Cứng

- auth source là `backend-owned session`
- `/auth/me` là identity truth cho client
- `dev login` là baseline hợp lệ cho `MVP-1`
- Firebase phone flow, nếu có sau này, chỉ là proofing rồi exchange sang backend session
- quote phải dựa trên pricing policy có version
- order phải snapshot pricing và hỗ trợ idempotency khi tạo
- dispatch là offer-based, baseline candidate selection là `radius + freshness + KNN`
- concurrent accept phải resolve tất định và có audit trail
- realtime là assistive; HTTP và persisted state mới là authoritative
- `PostgreSQL + PostGIS` là source of truth
- `Prisma` là persistence path mặc định; raw SQL chỉ dùng khi có lý do rõ cho geospatial, read model, hoặc performance path

## Verification

Current-state commands của app:
- `bun run lint`
- `bun run build`
- `bun run test`
- `bun run test:e2e`

Quy tắc:
- thay đổi BE không tầm thường phải chạy `lint`, `build`, `test`
- chạy `test:e2e` nếu thay đổi ảnh hưởng API flow, bootstrap app, auth, hoặc lifecycle chính
- nếu thay đổi contract, DTO, status transition, auth, pricing, dispatch, hoặc realtime thì phải đối chiếu docs trước khi kết luận done
- luôn ghi rõ đang verify theo current-state hay target-state

Khi task backend phụ thuộc foundation, phải nêu rõ dependency đã thỏa trước khi claim runtime completion.

## Không Được Làm

- không coi Firebase session là canonical app session
- không đơn giản hóa capability model thành single-role shortcut
- không để client tự suy diễn quyền hoặc final state mà thiếu backend confirmation
- không biến realtime thành shortcut bỏ qua persistence
- không đổi enum, lifecycle, hoặc contract mà không cập nhật docs
- không kéo worker extraction sớm khi phase chưa yêu cầu
- không sinh `package-lock.json` hoặc workflow `npm`
