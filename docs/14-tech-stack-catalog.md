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

Ghi chú:

- generated artifacts phụ thuộc plugin đã bật
- config phải khai báo `client` rõ ràng
- generated API client cho backend, admin-web, mobile phải đi qua một workflow canonical và publish tại `packages/api-client`
- không tạo biến thể SDK riêng theo từng app nếu không có thay đổi contract đã được duyệt ở source docs
- nên pin exact version cho `@hey-api/openapi-ts` tại thời điểm scaffold thật vì tool này ra breaking changes khá nhanh

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

### Deferred

- ELK
- Loki + Grafana
- full tracing platform

## Kết Luận

Tech stack của dự án được chốt theo hướng đủ mạnh để làm một portfolio project nghiêm túc, nhưng vẫn giữ chi phí và độ phức tạp trong giới hạn mà một người có thể hoàn thành đẹp. `Nx` hiện là phần bổ sung quan trọng để biến bộ docs này thành execution-ready workspace chứ không chỉ là ý tưởng rời rạc.
