# 14. Danh Mục Tech Stack

## Mục Đích

Liệt kê rõ công cụ và thư viện dự kiến dùng, đồng thời phân biệt:

- baseline đã chốt
- lựa chọn có điều kiện
- deferred

## Trạng Thái

Baseline đã chốt cho `CV-ready MVP-1`, có ghi rõ phần nào chỉ phù hợp ở `MVP-2/MVP-3`.

## Nguyên Tắc Chọn Stack

- ưu tiên nguồn chính thức mạnh và ecosystem ổn định
- ưu tiên stack giúp repo có structure rõ cho AI-agent và cho reviewer
- tránh thêm thư viện chỉ để “cho hiện đại”
- tách rõ stack phục vụ `MVP-1` với stack hardening phase sau

## Workspace Và Monorepo Core

### Baseline đã chốt

- `nx`
- `@nx/js`
- `@nx/nest`
- `@nx/next`
- `@nx/expo`
- `bun` workspaces

### Lựa chọn có điều kiện

- `@nx/eslint`
- `@nx/workspace`
- local generators trong `tools/`

### Deferred

- `Nx Cloud`
- distributed task execution

Ghi chú:

- `Nx` là monorepo core đã chốt
- package manager baseline là `bun` (`package.json` workspaces + `bun.lock`)
- target naming contract dùng thống nhất: `lint`, `typecheck`, `test`, `build`, `e2e`, `smoke`
- target-state CI baseline đi theo `nx affected -t ...`
- không chọn `Turborepo` làm baseline
- plugins và `nx` versions phải giữ cùng line chính

## Backend: `apps/api`

### Baseline đã chốt

- `nestjs`
- `@nestjs/config`
- `@nestjs/swagger`
- `@nestjs/websockets`
- `@nestjs/platform-socket.io`
- `@nestjs/throttler`
- `@nestjs/terminus`
- `class-validator`
- `class-transformer`
- `helmet`
- `socket.io`
- `pino`
- `nestjs-pino`
- `@prisma/client`
- `prisma`
- `@prisma/adapter-pg`

### Lựa chọn có điều kiện

- `@nestjs/bullmq`
- `bullmq`
- `ioredis`
- `firebase-admin`
- `@sentry/node`

### Deferred

- Kafka
- full CQRS framework
- OpenTelemetry stack hoàn chỉnh

## Worker: `apps/worker`

### Baseline đã chốt

- chưa bắt buộc cho `MVP-1`

### Lựa chọn có điều kiện

- `nestjs`
- `@nestjs/config`
- `@nestjs/bullmq`
- `bullmq`
- `ioredis`
- `pino`
- `nestjs-pino`
- `@prisma/client`

## Admin Web: `apps/admin-web`

### Baseline đã chốt

- `next`
- `react`
- `react-dom`
- `typescript`
- `@tanstack/react-query`
- generated client từ `@hey-api/openapi-ts`
- `@hey-api/client-fetch`
- `socket.io-client`
- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `tailwindcss`

### Lựa chọn có điều kiện

- `shadcn/ui`
- `@sentry/nextjs`

## Mobile: `apps/mobile`

### Baseline đã chốt

- `expo`
- `react-native`
- `expo-router`
- `typescript`
- `@tanstack/react-query`
- `zustand`
- generated client từ `@hey-api/openapi-ts`
- `@hey-api/client-fetch`
- `socket.io-client`
- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `expo-secure-store`
- `@react-native-async-storage/async-storage`
- `react-native-maps`
- `expo-location`
- `@expo/vector-icons`
- `react-native-reanimated`
- `react-native-gesture-handler`

### Lựa chọn có điều kiện

- `firebase`
- `expo-task-manager`
- `nativewind`
- `react-native-paper`
- `@sentry/react-native`
- `expo-notifications`

### Deferred

- `expo-sqlite`
- Tamagui
- `axios + @hey-api/client-axios`
- `@rnmapbox/maps`

Ghi chú:

- compatibility của `expo`, `firebase` và các native modules phải được verify lại tại thời điểm scaffold thật, không hardcode assumption version quá lâu
- `nativewind` chỉ chốt theo line stable tương thích với Expo SDK tại thời điểm scaffold thật

## Dữ Liệu, Geo Và Realtime

### Baseline đã chốt

- PostgreSQL
- PostGIS
- Socket.IO

### Lựa chọn có điều kiện

- Redis
- Google Routes API hoặc route provider tương đương

Ghi chú:

- Redis là transient runtime support và queue layer, không phải business source of truth
- `MVP-1` có thể ship mà chưa cần Redis nếu presence và dispatch baseline chưa dùng đến transient cache hoặc queue
- khi worker hoặc transient runtime path thật sự được bật, Redis trở thành dependency bắt buộc của biến thể đó
- profile governance đi kèm: `redis` cho runtime dependency, `debug` cho debug tooling, `jobs` cho maintenance jobs
- `pricing_rule_versions` là source of truth cho quote/pricing ở `MVP-1`
- route provider hoặc geocoding provider thật để sau nếu product đòi hỏi
- nearest-driver search baseline ở `MVP-1` đi theo PostGIS radius filter + KNN + freshness

## Hợp Đồng API Và Code Generation

### Baseline đã chốt

- NestJS Swagger phát OpenAPI
- `@hey-api/openapi-ts`
- `@hey-api/client-fetch`

### Lựa chọn có điều kiện

- plugin sinh schema validators
- plugin `@tanstack/react-query`

### Hey API plugin decision matrix (FDN-R04-T04)

| Plugin/client | Decision | Rationale | Trigger để đổi decision |
| --- | --- | --- | --- |
| `@hey-api/client-fetch` | `adopt now` | baseline chung cho admin/mobile, đơn giản, không tạo SDK divergence giữa apps | n/a (giữ làm baseline) |
| `@hey-api/client-next` | `defer` | chưa cần tách runtime adapter riêng cho Next ở `MVP-1`; ưu tiên một canonical client path | chỉ xem xét khi có nhu cầu bắt buộc cho Next server runtime và không thể tái dùng `client-fetch` |
| `@tanstack/react-query` plugin | `pilot` | phù hợp hướng server-state hiện tại nhưng cần đo chi phí generated hooks và ownership trước khi bật rộng | pilot thành công ở ít nhất 1 flow consumer, không tăng drift/code noise |
| validator plugin (`zod`) | `pilot` | có lợi cho type/runtime parity nhưng tăng generated surface; chưa bắt buộc cho mọi endpoint | bật khi có nhóm endpoint cần runtime validation contract nghiêm ngặt |
| `@hey-api/nestjs` plugin (beta) | `defer` | trạng thái beta, rủi ro thay đổi cao; không phù hợp baseline ổn định `MVP-1` | chỉ cân nhắc sau `MVP-1` và khi plugin ổn định hơn |
| `~resolvers` | `defer` | tăng độ phức tạp config/workflow, chưa cần cho canonical flow hiện tại | chỉ bật khi có use-case rõ ràng cho multi-runtime resolution |

Non-goals cho `MVP-1`:

- không bật đồng thời nhiều client generators cho cùng contract
- không tạo SDK riêng theo từng app (`admin-web`/`mobile`) khi chưa có decision đã duyệt
- không dùng plugin beta để thay thế baseline stable path

Ghi chú:

- generated artifacts phụ thuộc plugin đã bật
- config phải khai báo `client` rõ ràng
- generated API client cho backend, admin-web, mobile phải đi qua một workflow canonical và publish tại `packages/api-client`
- không tạo biến thể SDK riêng theo từng app nếu không có thay đổi contract đã được duyệt ở source docs
- nên pin exact version cho `@hey-api/openapi-ts` tại thời điểm scaffold thật vì tool này ra breaking changes khá nhanh

Canonical command path cho workflow contract:

- `bun run contract:export`
- `bun run contract:generate`
- `bun run contract:sync`

## Kiểm Thử

### Baseline đã chốt

- `jest`
- `@nestjs/testing`
- `next/jest`
- `supertest`
- `@testing-library/react`
- `@testing-library/react-native`
- `jest-expo`
- `expo-router/testing-library`
- `@playwright/test`
- Maestro

### Lựa chọn có điều kiện

- test database container strategy
- MSW cho client-side isolated tests

Ghi chú:

- admin web cần E2E đủ tốt vì Next App Router và async pages
- mobile cần cả router tests lẫn Maestro flows
- socket flows phải được verify lại bằng HTTP state

## Chất Lượng Mã Nguồn

### Baseline đã chốt

- `eslint`
- `prettier`
- `typescript`
- `lint-staged`
- `husky`

### Lựa chọn có điều kiện

- stricter commit policies theo phase hoặc branch protection
- workspace conformance helper trong `tools/workspace-conformance`

### Foundation guardrails đã bật ở phase R03

- `actions/dependency-review-action`
- `gitleaks/gitleaks-action`
- `amannn/action-semantic-pull-request`

## Hạ Tầng Và Triển Khai

### Baseline đã chốt

- Docker
- Docker Compose
- GitHub Actions
- Caddy cho self-host demo khi cần

### Lựa chọn có điều kiện

- GHCR
- EAS Build
- EAS Workflows
- EAS Submit
- EAS Update

### Deferred

- Kubernetes
- Terraform
- managed container platform

## Logging Và Giám Sát

### Baseline đã chốt

- `pino`
- `nestjs-pino`
- health endpoints

### Lựa chọn có điều kiện

- Sentry cho backend, admin web và mobile

### Foundation observability wiring (R03 baseline)

- backend request logging với `requestId` tại `apps/api/src/main.ts`
- health map baseline tại `apps/api/src/health.controller.ts`
- admin logging provider/helpers tại `apps/admin-web/app/observability-provider.tsx` và `apps/admin-web/lib/observability.ts`
- mobile logging/global error handler tại `apps/mobile/utils/observability.ts`

### Deferred

- ELK
- Loki + Grafana
- full tracing platform

## Foundation Coverage Map (Techstack-Wide)

Mục này dùng để tránh lệch trọng tâm vào một thư viện đơn lẻ. Mỗi nhóm stack baseline phải có verification path và ownership scope rõ.

| Nhóm stack | Baseline chính | Owner task (foundation) | Verification path baseline | Ownership scope | Risk note | Defer reason |
| --- | --- | --- | --- | --- | --- | --- |
| Workspace core | `bun`, `nx`, `@nx/*` plugins | `FDN-R04-T02`, `FDN-R04-T03`, `FDN-R04-T08` | `bun run affected --base=$NX_BASE --head=$NX_HEAD`, `bun run affected:e2e --base=$NX_BASE --head=$NX_HEAD`, `nx graph`, `nx show project <name>` | root workspace + `tools/` | chọn sai base/head có thể làm `affected` bỏ sót project bị ảnh hưởng | remote cache/distributed execution defer đến khi có nhu cầu CI scale (`Nx Cloud`) |
| Backend runtime | `nestjs`, `@nestjs/swagger`, `@nestjs/terminus`, `prisma` | `FDN-R03-T03`, `FDN-R04-T06`, `FDN-R04-T08` | `bun run --cwd apps/api lint`, `bun run --cwd apps/api typecheck`, `bun run --cwd apps/api test`, `bun run --cwd apps/api build`, `bun run release:smoke` | `apps/api` | drift giữa OpenAPI/runtime wiring và health/log contracts làm smoke thiếu ý nghĩa | tracing stack đầy đủ defer đến phase hardening sau `MVP-1` |
| Admin runtime | `next`, `react`, `@tanstack/react-query` | `FDN-R04-T05`, `FDN-R04-T06`, `FDN-R04-T08` | `bun run --cwd apps/admin-web lint`, `bun run --cwd apps/admin-web typecheck`, `bun run --cwd apps/admin-web build`, `bun run release:smoke` | `apps/admin-web` | dùng local state hoặc realtime sai vai trò có thể lệch khỏi HTTP-authoritative rule | Sentry/advanced UI telemetry là conditional, không phải baseline bắt buộc |
| Mobile runtime | `expo`, `react-native`, `expo-router`, `zustand` | `FDN-R04-T03`, `FDN-R04-T06`, `FDN-R04-T08` | `bun run --cwd apps/mobile lint`, `bun run --cwd apps/mobile typecheck`, `bun run --cwd apps/mobile build`, `bun run release:smoke` | `apps/mobile` | background/reconnect behavior dễ bị hiểu quá mức capability runtime thật | background tracking đầy đủ chỉ bật khi điều kiện ADR-026 được kích hoạt |
| Contract + client | OpenAPI (Nest Swagger), `@hey-api/openapi-ts`, `@hey-api/client-fetch` | `FDN-R04-T04`, `FDN-R04-T05`, `FDN-R04-T07` | `bun run contract:export`, `bun run contract:generate`, `bun run contract:sync`, `bun run --cwd packages/api-client check:generated` | `apps/api` + `packages/api-client` | generated artifacts dễ drift nếu version/codegen path không pin rõ | plugin beta hoặc multi-client generators defer để tránh scope creep MVP-1 |
| Data + infra | PostgreSQL, PostGIS, Redis (profile-based), Docker Compose | `FDN-R02-T04`, `FDN-R03-T02`, `FDN-R04-T08` | `bun run db:up`, `bun run db:up:redis`, `bun run db:migrate`, `bun run db:seed`, `bun run db:smoke`, `bun run db:drill:backup-restore` | `infra/` + app env owners | Redis có nguy cơ bị dùng sai thành source of truth nếu boundary không được enforce | managed services/multi-node orchestration defer theo `docs/13` |
| Quality + security | `eslint`, `typescript`, `jest`, dependency review, secret scanning, PR policy | `FDN-R03-T01`, `FDN-R03-T04`, `FDN-R04-T03`, `FDN-R04-T08` | `bun run workspace:conformance`, `bun run shared:smoke`, CI workflows (`dependency-review`, `gitleaks`, semantic PR`) | root workspace + `.github/workflows` | placeholder gates hoặc policy drift có thể tạo false-green trước merge | guardrails nâng cao beyond baseline defer sau khi core flows ổn định |
| Release readiness | release smoke contracts + observability wiring | `FDN-R03-T05`, `FDN-R04-T06`, `FDN-R04-T07`, `FDN-R04-T08` | `bun run release:smoke` | `tools/release-smoke` + `apps/*` | smoke chỉ hữu ích khi assert runtime wiring thật, không chỉ assert helper | full synthetic monitoring defer đến phase self-host hardening |

Rule:

- nếu một baseline tech không map được vào một verification path ở bảng trên, coi là governance gap và phải được xử lý trong Foundation plan trước khi claim release-ready.
- nếu một dòng có `defer`, phải có trigger condition hoặc non-goal đã nêu trong `docs/09`, `docs/11`, hoặc `docs/13`.

## Kết Luận

Tech stack của dự án được chốt theo hướng đủ mạnh để làm một portfolio project nghiêm túc, nhưng vẫn giữ chi phí và độ phức tạp trong giới hạn mà một người có thể hoàn thành đẹp. `Nx` hiện là phần bổ sung quan trọng để biến bộ docs này thành execution-ready workspace chứ không chỉ là ý tưởng rời rạc.
