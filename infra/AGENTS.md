# AGENTS.md

## Vai Trò

File này áp dụng cho mọi artifact trong `infra/`.

`infra/` sở hữu topology, deployment artifacts, proxy config, compose files, và scripts vận hành. Nó không sở hữu business logic của backend, mobile, hoặc admin web.

File này chỉ được specialize rules từ root AGENTS, không được override source docs hoặc repo invariants.

## Source Of Truth

Đọc tối thiểu trước khi sửa:
- `docs/03-system-architecture.md`
- `docs/09-devops-runbook.md`
- `docs/13-infrastructure-self-hosting.md`
- `docs/14-tech-stack-catalog.md`
- `docs/plan/foudation/`

## Invariants

- `PostgreSQL + PostGIS` là source of truth chính
- Redis là optional ở `MVP-1` cho tới khi biến thể hoặc phase bật transient runtime hoặc worker path
- local-first là baseline; không kéo paid infra vào mặc định
- public demo self-host phải có backup, restore, rollback, và hardening tối thiểu được mô tả rõ
- nếu admin web deploy dưới `/admin`, build-time `basePath` phải khớp; reverse proxy không phải nơi “chữa” cấu hình sai

## Cannot Relax

- không được hạ chuẩn auth/session source-of-truth từ backend
- không được hạ chuẩn `HTTP-authoritative` cho realtime flow
- không được thêm paid managed service vào baseline nếu source docs chưa chốt
- không được biến Redis thành business source of truth

## Verification

- luôn ghi rõ current-state hay target-state
- thay đổi infra docs hoặc artifacts phải đối chiếu lại local bootstrap, env layout, backup or restore semantics, và self-hosting notes
- không claim readiness nếu topology hoặc env contract còn mâu thuẫn giữa `docs/09` và `docs/13`

Khi task chạm cả `infra/` và `docs/plan/foudation/`, phải verify dependency từ foundation trước rồi mới close issue infra.

## Không Được Làm

- không để infra artifact trở thành nơi cất app business config mơ hồ
- không dùng Redis làm business source of truth
- không coi worker là prerequisite của baseline khi docs chưa chốt
