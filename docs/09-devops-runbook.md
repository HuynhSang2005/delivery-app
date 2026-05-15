# 09. Runbook DevOps

## Mục Đích

Xác định mô hình vận hành đủ rõ cho monorepo `Nx`, local development, CI, smoke test, deploy demo và xử lý sự cố cơ bản.

## Trạng Thái

Baseline đã chốt cho `CV-ready MVP-1`. `Local-first` là chuẩn mặc định. Hosted demo và worker riêng là phase sau.

## Nguyên Tắc Vận Hành

- ưu tiên `local-first`
- repo vận hành theo package-manager workspace + `Nx`
- mọi lệnh ở cấp workspace ưu tiên đi qua `nx`
- CI chỉ chạy các target bị ảnh hưởng khi có thể
- không giả định `Nx Cloud` hay remote cache ở `MVP-1`
- không đưa Kubernetes, multi-node orchestration hay managed platform phức tạp vào giai đoạn đầu

## Mô Hình Môi Trường

### 1. Local development

- `apps/api` chạy local
- `apps/admin-web` chạy local
- `apps/mobile` chạy bằng Expo dev server
- PostgreSQL + PostGIS chạy bằng Docker Compose
- Redis chỉ bật khi biến thể `MVP-1` thực sự cần transient runtime support hoặc khi worker được bật
- `apps/worker` chưa bắt buộc ở `MVP-1`

### 2. CI

- GitHub Actions chạy quality gates theo `Nx targets`
- CI dùng `nx affected` làm entrypoint mặc định
- chỉ chạy `e2e` trên các project hoặc flow thật sự bị tác động

### Compose profile governance cho worker-readiness

- `redis` profile: bật Redis runtime khi queue/transient path hoặc worker path thực sự cần
- `debug` profile: chỉ bật tooling debug (ví dụ Redis Commander), không coi là runtime dependency bắt buộc
- `jobs` profile: chạy maintenance jobs (ví dụ db-backup), tách khỏi app runtime continuous path

### 3. Hosted demo

- một VPS Ubuntu + Docker Compose + Caddy
- chỉ bật sau khi core flow và smoke test local đã ổn
- nếu deploy admin dưới `/admin`, build của Next.js phải phản ánh `basePath`

## Root Commands Phải Chuẩn Hóa

### Current repo state fallback

- khi root `Nx` workspace chưa executable đầy đủ, verify theo app-level commands hiện có và phải ghi rõ đó là `current-state verification`
- `apps/api`: `bun run lint`, `bun run test`, `bun run build`
- `apps/admin-web`: `bun run lint`, `bun run build`
- `apps/mobile`: `bun run lint`

### Target workspace inspection

- `nx graph`
- `nx show project api`
- `nx show project admin-web`
- `nx show project mobile`

### Target local dev

- `nx run api:serve`
- `nx run admin-web:dev`
- `nx run mobile:start`
- `nx run mobile:android`
- `nx run mobile:ios`
- `nx run worker:serve` khi worker đã được bật

### Target quality gates

- `nx affected -t lint typecheck test build` (base/head lấy từ `NX_BASE` và `NX_HEAD` trong CI)
- `nx affected -t e2e` (blocking gate) khi có thay đổi ảnh hưởng tới flow end-to-end, cùng base/head context với gate chính
- `nx run-many -t lint typecheck test --projects api,admin-web,mobile` khi cần chạy thủ công theo nhóm
- khi repo có project phụ ngoài app scope, dùng `--projects=api,admin-web,mobile` để giữ gate đúng phạm vi delivery runtime

### Mandatory pre-commit gate

- hook pre-commit bắt buộc chạy qua `lint-staged`
- staged files phải pass `nx affected -t lint typecheck test --files`
- không bypass pre-commit gate cho các thay đổi runtime thuộc foundation hoặc backend phases

### Verification matrix (current-state vs target-state)

| Mode | Khi dùng | Command baseline |
| --- | --- | --- |
| `current-state` | root `Nx` workspace chưa executable đầy đủ | app-level commands: `apps/api`, `apps/admin-web`, `apps/mobile` |
| `target-state` | workspace graph/targets đã sẵn sàng | `nx affected -t lint typecheck test build` (+ `e2e` khi flow trọng yếu đổi) |

Rule:

- mọi evidence phải ghi rõ mode đang verify
- không claim `target-state` nếu vẫn đang chạy fallback `current-state`

### CI maintenance

- `nx reset` khi cache local có dấu hiệu lỗi

## Hợp Đồng Target Cấp Workspace

Mọi app hoặc package quan trọng nên có ít nhất:

- `lint`
- `typecheck`
- `test`
- `build`

Target theo điều kiện:

- `e2e`
- `smoke`
- `contract`
- `serve`, `dev`, `start`, `android`, `ios`

Quy tắc:

- `lint`, `typecheck`, `test`, `build` nên cache được
- `serve`, `dev`, `start`, `android`, `ios` là continuous tasks, không được coi như quality gate cacheable
- nếu một project không có `e2e`, docs phải ghi rõ vì sao

## Bootstrap Local

### Local data baseline contract

- PostgreSQL local mặc định: port `5432`
- Redis local (khi bật): port `6379`
- extension bắt buộc cho baseline delivery: `postgis`
- Redis chỉ bật khi có lý do runtime rõ: transient support hoặc worker/queue path

Ownership boundary:

- `infra/*` sở hữu container topology, volumes, networks, bootstrap scripts
- app-level env (`apps/*`) sở hữu runtime vars và feature toggles của app tương ứng
- không đẩy business policy vào compose/service definitions

### Bước 1: Chuẩn bị config

- canonical source cho data-layer local là `docker-compose.yml` tại root repo và root `.env`/`.env.example`
- tạo file env local cho `api`, `admin-web`, `mobile`
- điền tối thiểu `DATABASE_URL`, `JWT_SECRET`, `API_BASE_URL`, `ADMIN_BASE_URL`
- chỉ thêm `REDIS_URL` khi biến thể hiện tại thực sự bật Redis

### Env layout và ownership theo context

| Context | Env scope | Ownership | Secrets policy |
| --- | --- | --- | --- |
| Local dev | root `.env.local` (nếu cần), app-level env tại `apps/api`, `apps/admin-web`, `apps/mobile` | từng app owner chịu trách nhiệm biến runtime của app đó | không commit secret thật; ưu tiên local secret files hoặc shell env |
| CI | repository/environment secrets của GitHub Actions + workflow env mapping | CI/workflow owner + app owner cùng review | dùng GitHub Actions secrets; không echo secrets ra logs |
| Self-host | env files hoặc secret files trên host/VPS cho compose stack | infra owner cho placement và permissions; app owner cho giá trị runtime | secret file/env file phải có permissions rõ và tách khỏi source control |

Rule:

- mỗi biến bắt buộc phải có một owner rõ (`infra` hoặc app cụ thể)
- không mô tả một biến bắt buộc ở nhiều scope nếu chưa chỉ rõ precedence
- khi có trùng tên biến giữa contexts, ưu tiên policy precedence đã chốt của compose hoặc workflow runtime

### Bước 2: Bật data layer

- chạy Docker Compose cho PostgreSQL + PostGIS
- chỉ bật Redis nếu biến thể hiện tại thực sự dùng đến

Command baseline:

- `bun run db:up`
- `bun run db:up:redis` khi cần Redis profile
- `bun run db:up:debug` khi cần bật Redis Commander để debug Redis state
- `bun run db:migrate`
- `bun run db:seed`
- `bun run db:smoke`
- `bun run db:reset`
- `bun run job:db-backup` khi cần chạy backup job theo profile

### Bước 2.5: Migrate và seed deterministic fixtures

- chạy migration path của backend
- seed tối thiểu `user`, `driver`, `admin` accounts
- seed fixed coordinates và dispatch fixtures đủ để smoke test
- phải có reset path để đưa local DB về trạng thái demo lặp lại được

Deterministic sequence contract:

1. `migrate`: cập nhật schema lên trạng thái mong muốn
2. `seed-baseline`: nạp baseline fixtures dùng chung cho mọi app plan
3. `smoke-check`: verify dataset baseline dùng được cho happy-path tối thiểu
4. `reset`: quay về trạng thái sạch và chạy lại `migrate -> seed-baseline`

Fixture boundary:

- baseline fixtures (foundation): identities tối thiểu, coordinates chuẩn, dispatch fixtures cơ bản
- domain fixtures (app-specific phases): dữ liệu nghiệp vụ sâu cho từng bounded context
- app-specific phases chỉ được bổ sung domain fixtures trên cùng reset/seed contract đã chốt

### Bước 3: Chạy app layer

- chạy `api`
- chạy `admin-web`
- chạy `mobile`

### Bước 4: Kiểm tra baseline

- health endpoints hoạt động
- Swagger/OpenAPI sinh được
- admin login vào được
- mobile login dev thành công

## Caching Và Affected Execution

### Baseline đã chốt

- dùng local cache mặc định của Nx
- target-state CI dùng `nx affected -t lint typecheck test build`
- current repo state có thể cần fallback sang app-level verification cho đến khi root `Nx` workspace executable hoàn chỉnh
- dùng project graph để giải thích vì sao một thay đổi kéo theo project khác

### Chưa làm ở `MVP-1`

- không mặc định bật `Nx Cloud`
- không dùng distributed execution
- không dựng pipeline quá tinh vi chỉ để tối ưu vài phút

## Mẫu CI Tối Thiểu

### Pull request

1. checkout repo
2. cài dependencies
3. fetch đủ git history để `affected` có base/head đáng tin
4. xác định rõ base/head SHA trong CI bằng `nrwl/nx-set-shas` (hoặc cơ chế tương đương) để set `NX_BASE`/`NX_HEAD`
5. khởi động service dependencies cần thiết cho test
6. nếu root `Nx` workspace đã sẵn sàng, chạy `nx affected -t lint typecheck test build --base=$NX_BASE --head=$NX_HEAD`
7. nếu root `Nx` workspace chưa sẵn sàng, dùng current-state fallback commands và ghi rõ đó là temporary verification path
8. chạy `nx affected -t e2e --base=$NX_BASE --head=$NX_HEAD` như blocking gate khi graph/targets đủ tin cậy; `affected` sẽ tự giới hạn về các flow thực sự bị tác động

Rule:

- `NX_BASE` nên trỏ tới commit thành công gần nhất của `main` để tránh bỏ sót thay đổi trong chuỗi PR/retry.
- không hardcode `origin/main` làm base duy nhất cho mọi tình huống CI nếu đã có cơ chế lấy last successful SHA.

### Main branch

- có thể chạy thêm smoke hoặc packaging checks
- nếu có hosted demo, mới thêm deploy stage

### Foundation Ownership Anchors (R04-T08)

| Runtime gate | Owner task (foundation) | Command path | Risk note |
| --- | --- | --- | --- |
| Target-state affected gate | `FDN-R03-T01`, `FDN-R04-T02` | `bun run affected --base=$NX_BASE --head=$NX_HEAD` | dùng base/head không chuẩn làm thiếu phạm vi verify |
| Blocking e2e gate | `FDN-R04-T02` | `bun run affected:e2e --base=$NX_BASE --head=$NX_HEAD` | non-blocking e2e tạo CI xanh sai nghĩa release readiness |
| Shared-platform smoke gate | `FDN-R02-T05`, `FDN-R04-T03` | `bun run shared:smoke` | placeholder scripts làm mất fail-fast value |
| Release smoke gate | `FDN-R03-T05`, `FDN-R04-T06`, `FDN-R04-T07` | `bun run release:smoke` | smoke chỉ có giá trị khi assert runtime wiring thật |

## Release Flow Đề Xuất

### Backend và admin web

1. merge `main`
2. CI pass `lint`, `typecheck`, `test`, `build`
3. nếu cần public demo: update source hoặc image trên VPS
4. chạy `docker compose up -d --build`
5. chạy smoke test

### Mobile

- `MVP-1`: Expo dev server là đủ
- khi cần demo build: dùng EAS preview/internal build
- store release không phải baseline

## Smoke Test Sau Deploy

### Bắt buộc cho `MVP-1`

1. `GET /api/v1/health/live` trả về `ok`
2. `GET /api/v1/health/ready` trả về `ok`
3. `dev login` thành công
4. tạo quote thành công
5. tạo order thành công
6. tài xế nhận được offer hoặc order đi vào `SEARCHING_DRIVER`
7. driver accept thành công
8. order status đổi đúng
9. admin thấy order ở board và detail
10. `bun run release:smoke` pass (api/admin/mobile happy + unhappy contracts)

### Giai đoạn sau

- driver application submit/review đúng
- chat gửi/nhận đúng
- worker retry jobs đúng
- reconnect vẫn refetch state đúng

## Logging Và Quan Sát

### Logging conventions (baseline)

- log format chuẩn là JSON line, có tối thiểu: `ts`, `level`, `event`, `meta`
- backend request log phải có thêm `requestId`, `method`, `path`, `statusCode`, `durationMs`
- client logs (admin/mobile) chỉ dùng cho debug có kiểm soát và không được chứa secret

### Backend

- structured logging
- có `requestId`
- log route hoặc job name
- không log secret

Wiring baseline hiện tại:

- HTTP request logging + `x-request-id`: `apps/api/src/main.ts`
- health controllers: `apps/api/src/health.controller.ts`

### Admin web và mobile

- log client-side chỉ phục vụ debug có kiểm soát
- lỗi quan trọng nên có tracking riêng khi bật Sentry

Wiring baseline hiện tại:

- admin provider + error listeners: `apps/admin-web/app/observability-provider.tsx`
- admin logging helpers: `apps/admin-web/lib/observability.ts`
- mobile logging helpers + global error handler attach: `apps/mobile/utils/observability.ts`

### Health

- `live` chỉ kiểm tra tiến trình
- `ready` kiểm tra dependency tối thiểu để phục vụ request

Health-check map (baseline):

- `GET /api/v1/health/live` -> `200 { status: "ok" }`
- `GET /api/v1/health/ready` -> `200 { status: "ok", checks: { api: true } }`

## Sao Lưu Và Khôi Phục

### PostgreSQL

- logical backup bằng `pg_dump`
- backup nằm ngoài container
- restore phải đi kèm kiểm tra migration/schema version
- phải chốt cadence, retention và nơi lưu backup trước khi public demo
- tối thiểu nên có một restore drill định kỳ trên môi trường tách biệt hoặc local clone

Command baseline cho drill:

- `bun run job:db-backup`
- `bun run db:restore`
- `bun run db:drill:backup-restore`

Policy tối thiểu cho `MVP-1` demo path:

- cadence: backup trước mỗi demo quan trọng và ít nhất weekly
- retention: giữ tối thiểu 7 bản gần nhất cho daily/weekly local drill
- location: lưu trong backup volume (`db_backups`) và có bản copy off-volume trước khi public demo

### Redis

- không phải source of truth nghiệp vụ
- khi restore, ưu tiên phục hồi PostgreSQL trước

## Playbook Sự Cố

### 1. `nx affected` chạy nhiều project hơn dự kiến

Kiểm tra:

- project graph
- import boundary có bị phá không
- package shared có bị sửa không

### 2. `api` không sẵn sàng

Kiểm tra:

- env thiếu
- migrate/schema lỗi
- kết nối PostgreSQL/Redis
- health logs

### 3. `admin-web` mở được nhưng không có dữ liệu

Kiểm tra:

- `API_BASE_URL`
- auth token
- reverse proxy `/api`
- `basePath` nếu deploy dưới `/admin`

### 4. mobile không nhận realtime update

Kiểm tra:

- socket handshake token
- socket path
- reconnect state
- client có refetch lại HTTP state sau disconnect không

### 5. worker không xử lý job

Chỉ áp dụng khi worker đã bật:

- Redis connection
- queue names
- processor registration
- project target `worker:serve` hoặc `worker:build`

## Những Gì Không Làm Trong Giai Đoạn Đầu

- Kubernetes
- multi-region
- remote cache trả phí
- managed service phân mảnh chỉ để “trông enterprise”
- deploy automation phức tạp hơn nhu cầu demo

## Kết Luận

Runbook của dự án phải phản ánh đúng mô hình đang build thật: một monorepo `Nx` local-first, có target contracts rõ, quality gates rõ, và deploy demo chỉ là bước sau khi core flow đã chứng minh được giá trị.
