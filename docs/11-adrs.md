# 11. Biên Bản Quyết Định Kiến Trúc

## Mục Đích

Lưu lại các quyết định kiến trúc quan trọng, lý do chọn và hệ quả vận hành để toàn bộ docs khác bám cùng một baseline.

## Trạng Thái

ADR trong file này phản ánh baseline đang có hiệu lực sau vòng cập nhật ngày `2026-03-25`.

## Bảng Tóm Tắt ADR

| Mã | Tiêu đề | Trạng thái |
| --- | --- | --- |
| ADR-001 | Backend dùng Modular Monolith | Đã chấp thuận |
| ADR-002 | Giữ NestJS làm trung tâm, chỉ mượn chọn lọc từ Spring | Đã chấp thuận |
| ADR-003 | Admin web dùng Next.js App Router | Đã chấp thuận |
| ADR-004 | Mobile dùng React Native + Expo | Đã chấp thuận |
| ADR-005 | Chỉ có một mobile app với hai mode user và driver | Đã chấp thuận |
| ADR-006 | Driver mode chỉ mở khi account có driver capability hợp lệ | Đã chấp thuận |
| ADR-007 | Map MVP dùng `react-native-maps` + `expo-location` | Đã chấp thuận |
| ADR-008 | Dữ liệu chính dùng PostgreSQL + PostGIS | Đã chấp thuận |
| ADR-009 | ORM chính là Prisma v7 với PostgreSQL driver adapter | Đã chấp thuận |
| ADR-010 | Chỉ dùng raw SQL cho geo query và read query nâng cao | Đã chấp thuận |
| ADR-011 | Dispatch bắt đầu trong API, worker/BullMQ là bước nâng cấp | Đã chấp thuận có điều kiện |
| ADR-012 | Auth baseline dùng dev login, Firebase test auth là tùy chọn | Đã chấp thuận có điều kiện |
| ADR-013 | OpenAPI do NestJS Swagger phát ra, hey-api sinh client | Đã chấp thuận |
| ADR-014 | HTTP client baseline cho mobile và admin là hey-api + Fetch | Đã chấp thuận |
| ADR-015 | Driver onboarding là differentiator ưu tiên trước chat | Đã chấp thuận |
| ADR-016 | `local-first` là baseline, một VPS là đường public demo | Đã chấp thuận có điều kiện |
| ADR-017 | Dùng một domain với `/admin` và `/api`, có `basePath` khi deploy subpath | Đã chấp thuận có điều kiện |
| ADR-018 | CI dùng GitHub Actions, mobile release có thể dùng EAS | Đã chấp thuận có điều kiện |
| ADR-019 | Access control của hệ thống là capability-based | Đã chấp thuận |
| ADR-020 | Quote v1 dùng internal estimator và pricing snapshot | Đã chấp thuận |
| ADR-021 | Monorepo core dùng Nx thay vì Turborepo | Đã chấp thuận |
| ADR-022 | Realtime là socket-assisted nhưng state vẫn HTTP-authoritative | Đã chấp thuận |
| ADR-023 | Quality gates và testing contracts chuẩn hóa theo Nx targets | Đã chấp thuận |
| ADR-024 | Firebase OTP-SMS chỉ là identity proofing, backend session vẫn là auth source | Đã chấp thuận có điều kiện |
| ADR-025 | Driver search dùng radius + KNN + freshness; route-aware ranking để phase sau | Đã chấp thuận |
| ADR-026 | Background location chỉ bật cho driver duty hoặc active order | Đã chấp thuận có điều kiện |

## ADR-001: Backend Dùng Modular Monolith

Quyết định:

- backend là một ứng dụng NestJS modular monolith

Lý do:

- phù hợp nhất với nguồn lực một người và scope hiện tại

Hệ quả:

- boundary giữa module phải đủ chặt để không biến monolith thành “big ball of mud”

## ADR-002: Giữ NestJS Làm Trung Tâm, Chỉ Mượn Chọn Lọc Từ Spring

Quyết định:

- dùng NestJS-first architecture

Lý do:

- tận dụng đúng thế mạnh của NestJS, không bê ceremony của Java sang TypeScript

Hệ quả:

- controller, DTO, guard, service, gateway vẫn theo idiom tự nhiên của NestJS

## ADR-003: Admin Web Dùng Next.js App Router

Quyết định:

- `apps/admin-web` dùng Next.js App Router

Lý do:

- phù hợp với dashboard nội bộ, route grouping và async data flow

Hệ quả:

- testing phải xem App Router và async pages là concern thật, không chỉ test từng component rời

## ADR-004: Mobile Dùng React Native + Expo

Quyết định:

- `apps/mobile` dùng Expo

Lý do:

- nhanh để build, đủ thực tế cho portfolio, phù hợp với scope

Hệ quả:

- chọn native module phải cân nhắc compatibility với Expo trước

## ADR-005: Chỉ Có Một Mobile App Với Hai Mode User Và Driver

Quyết định:

- chỉ có một app mobile

Lý do:

- tránh tăng gấp đôi chi phí build, navigation, release và auth handling

Hệ quả:

- mode switch, capability refresh và route protection trở thành phần kiến trúc bắt buộc

## ADR-006: Driver Mode Chỉ Mở Khi Account Có Driver Capability Hợp Lệ

Quyết định:

- driver mode dựa trên capability thật

Lý do:

- phản ánh đúng nghiệp vụ, không để UI tự bịa quyền

Hệ quả:

- `/auth/me`, guard, data model và mobile router phải cùng một cách diễn giải

## ADR-007: MVP Map Dùng `react-native-maps` + `expo-location`

Quyết định:

- map và location theo stack này ở `MVP`

Lý do:

- thực tế hơn với Expo so với các hướng nặng hơn

Hệ quả:

- map là UI/location support, không phải pricing engine

## ADR-008: Dữ Liệu Chính Dùng PostgreSQL + PostGIS

Quyết định:

- PostgreSQL là source of truth
- PostGIS phục vụ geo queries

Lý do:

- phù hợp với domain delivery

Hệ quả:

- geospatial query cần tách riêng thay vì ép ORM xử lý mọi thứ

## ADR-009: ORM Chính Là Prisma v7 Với PostgreSQL Driver Adapter

Quyết định:

- Prisma v7 là data-access baseline

Lý do:

- type-safety tốt, docs hiện hành đi theo hướng driver-adapter-aware

Hệ quả:

- docs và scaffold phải phản ánh setup config-first của Prisma v7
- Prisma ownership hiện tại thuộc `apps/api`: schema, migrations, seed, SQL và `prisma.config.ts` đi cùng backend app
- không đưa Prisma lên `packages/database` trước khi có ít nhất hai consumer server-side thật sự; `packages/*` chỉ dành cho reusable code đã được chứng minh là cần dùng chung

## ADR-010: Chỉ Dùng Raw SQL Cho Geo Query Và Read Query Nâng Cao

Quyết định:

- raw SQL chỉ dùng có chủ đích trong domain sở hữu query đó

Lý do:

- giữ CRUD và transaction chính ở mức Prisma Client dễ bảo trì

Hệ quả:

- các query geospatial và ranking phải được cô lập rõ

## ADR-011: Dispatch Bắt Đầu Trong API, Worker/BullMQ Là Bước Nâng Cấp

Quyết định:

- `MVP-1` cho phép dispatch chạy trong API
- worker riêng chỉ bật khi cần async runtime rõ hơn

Lý do:

- tránh over-engineer sớm

Hệ quả:

- public API contract không được phụ thuộc chuyện runtime nội bộ có queue hay không

## ADR-012: Auth Baseline Dùng Dev Login, Firebase Test Auth Là Tùy Chọn

Quyết định:

- `dev login` là baseline
- Firebase test auth là lựa chọn có điều kiện

Lý do:

- ưu tiên delivery of product flow trước phone auth complexity

Hệ quả:

- backend phải sở hữu session và token lifecycle
- transport baseline hiện tại là bearer token cho mobile và admin web, kèm socket handshake auth
- cookie-based web session không phải baseline hiện tại; nếu muốn dùng phải có ADR hoặc update docs riêng

## ADR-013: OpenAPI Do NestJS Swagger Phát Ra, hey-api Sinh Client

Quyết định:

- OpenAPI là contract artifact chính thức

Lý do:

- giảm drift giữa backend, admin, mobile

Hệ quả:

- thay đổi DTO/operation id phải được xem là thay đổi contract

## ADR-014: HTTP Client Baseline Cho Mobile Và Admin Là hey-api + Fetch

Quyết định:

- generated client dùng `@hey-api/client-fetch`

Lý do:

- gọn, đủ mạnh cho use case hiện tại

Hệ quả:

- không thêm axios mặc định nếu chưa có nhu cầu rõ ràng

## ADR-015: Driver Onboarding Là Differentiator Ưu Tiên Trước Chat

Quyết định:

- nếu phải chọn một differentiator tiếp theo sau core flow, ưu tiên driver onboarding trước chat

Lý do:

- onboarding làm rõ business model, capability transitions, admin workflow và data model tốt hơn

Hệ quả:

- chat vẫn có chỗ trong data model và contracts, nhưng không đi trước onboarding

## ADR-016: `Local-first` Là Baseline, Một VPS Là Đường Public Demo

Quyết định:

- build local trước
- public demo trên một VPS là hướng phù hợp khi đã sẵn sàng

Lý do:

- phù hợp ràng buộc chi phí gần `0`

Hệ quả:

- docs phải luôn tách rõ `local demo path` và `public demo path`

## ADR-017: Dùng Một Domain Với `/admin` Và `/api`, Có `basePath` Khi Deploy Subpath

Quyết định:

- admin qua `/admin`, API qua `/api` khi cùng domain

Lý do:

- routing và TLS đơn giản hơn cho self-host demo

Hệ quả:

- reverse proxy không thể “tự sửa” việc build thiếu `basePath`

## ADR-018: CI Dùng GitHub Actions, Mobile Release Có Thể Dùng EAS

Quyết định:

- GitHub Actions là quality gate chính
- EAS chỉ dùng khi thật sự cần mobile build hoặc release

Lý do:

- tránh biến pipeline thành blocker từ ngày đầu

Hệ quả:

- docs không được mô tả EAS free tier như chi phí `0` vô hạn

## ADR-019: Access Control Của Hệ Thống Là Capability-Based

Quyết định:

- dùng `capabilities.user`, `capabilities.driver`, `capabilities.admin`

Lý do:

- một account có thể vừa là user vừa được mở driver mode

Hệ quả:

- role đơn không còn là mô hình diễn giải đủ cho toàn hệ thống

## ADR-020: Quote v1 Dùng Internal Estimator Và Pricing Snapshot

Quyết định:

- quote v1 dùng internal estimator
- lưu pricing snapshot bằng `pricing_rule_versions`

Lý do:

- tránh khóa kiến trúc vào provider trả phí quá sớm

Hệ quả:

- estimator và pricing versioning là domain quan trọng phải được test riêng

## ADR-021: Monorepo Core Dùng Nx Thay Vì Turborepo

Quyết định:

- repo dùng package-manager workspace + `Nx`
- không chọn `Turborepo` làm monorepo core

Lý do:

- cần `Project Graph` và `Task Graph` rõ cho `api`, `admin-web`, `mobile`, `worker`, `packages/*`
- cần first-party support cho `Nest`, `Next.js`, `Expo`
- cần tags, module-boundary enforcement và `affected` execution
- phù hợp hơn cho AI-agent workflows so với một task runner nhẹ nhưng ít governance hơn

Hệ quả:

- docs phải chuẩn hóa root files như `nx.json`, `tsconfig.base.json`
- commands, CI và testing phải đi theo `Nx targets`

## ADR-022: Realtime Là Socket-Assisted Nhưng State Vẫn HTTP-Authoritative

Quyết định:

- dùng Socket.IO để tăng tốc UX
- vẫn coi HTTP + database là nguồn sự thật cuối cùng

Lý do:

- Socket.IO có hỗ trợ recovery nhưng không đảm bảo recovery luôn thành công
- delivery product dễ gặp reconnect, app background, đổi mạng và race conditions

Hệ quả:

- client phải refetch state quan trọng sau reconnect
- test realtime không được chỉ assert event, mà phải assert final state

## ADR-023: Quality Gates Và Testing Contracts Chuẩn Hóa Theo Nx Targets

Quyết định:

- mọi project quan trọng phải có `lint`, `typecheck`, `test`, `build`
- `e2e`, `smoke`, `contract` được thêm khi phù hợp

Lý do:

- AI-agent cần target naming ổn định để build và verify
- `nx affected -t ...` chỉ hữu ích khi target contracts nhất quán

Hệ quả:

- testing strategy trở thành một phần của workspace architecture, không phải tài liệu phụ

## ADR-024: Firebase OTP-SMS Chỉ Là Identity Proofing, Backend Session Vẫn Là Auth Source

Quyết định:

- Firebase phone auth không thay thế session của hệ thống
- nếu dùng OTP-SMS, backend vẫn phát hành access/refresh token riêng

Lý do:

- repo đã chốt backend-owned session
- Firebase phone auth trong mobile mang theo reCAPTCHA/app-verification và native caveats, không nên bị nhầm là auth model trung tâm của sản phẩm

Hệ quả:

- contract phase sau nên là `Firebase proof -> backend session`
- `dev login` vẫn là baseline hợp lý cho `MVP-1`

## ADR-025: Driver Search Dùng Radius + KNN + Freshness; Route-Aware Ranking Để Phase Sau

Quyết định:

- `MVP-1` dùng geo prefilter và nearest-neighbor ranking
- chưa tuyên bố dùng road-network shortest path hay traffic-aware ETA thật

Lý do:

- phù hợp mục tiêu chi phí gần `0`
- PostGIS đã đủ mạnh để làm search radius + nearest candidates
- route-aware ranking là bài toán phase sau nếu product thật sự cần

Hệ quả:

- docs phải mô tả đúng `estimatedDistance` và `nearest-driver` semantics
- không được marketing `MVP-1` như một dispatch engine đã tối ưu bằng real routing

## ADR-026: Background Location Chỉ Bật Cho Driver Duty Hoặc Active Order

Quyết định:

- không bật background GPS always-on cho mọi user
- background location chỉ được xem xét khi driver đang duty hoặc đang có active order

Lý do:

- background execution và permission trên mobile có cost về pin, UX và native setup
- không cần complexity đó cho phần lớn `MVP-1`

Hệ quả:

- foreground presence đủ cho phần lớn demo flow đầu tiên
- nếu phase sau bật background tracking, docs phải ghi rõ dev build, permission flow và degradation rules

## Coverage Anchor Cho ADR-021..026 (R04-T08)

| ADR | Owner task (foundation) | Verification path | Risk note | Defer trigger hoặc non-goal |
| --- | --- | --- | --- | --- |
| `ADR-021` (`Nx` monorepo core) | `FDN-R04-T02`, `FDN-R04-T03`, `FDN-R04-T08` | `bun run affected --base=$NX_BASE --head=$NX_HEAD`, `bun run affected:e2e --base=$NX_BASE --head=$NX_HEAD`, `nx graph` | nếu base/head sai, `affected` có thể bỏ sót regression | `Nx Cloud` vẫn defer cho tới khi có nhu cầu scale CI rõ ràng |
| `ADR-022` (HTTP-authoritative realtime) | `FDN-R03-T03`, `FDN-R03-T05`, `FDN-R04-T06` | `bun run release:smoke` + realtime checks bám HTTP reconciliation theo `docs/10` | false confidence nếu chỉ assert event mà không assert final HTTP state | không có defer cho invariant này |
| `ADR-023` (Nx target contracts) | `FDN-R03-T01`, `FDN-R04-T03`, `FDN-R04-T08` | `bun run affected`, `bun run affected:e2e`, `bun run workspace:conformance`, `bun run shared:smoke` | placeholder scripts hoặc target drift tạo false-green | không bypass target contracts cho runtime tasks |
| `ADR-024` (Firebase proofing only) | `FDN-R04-T08` (docs governance), backend phases kế tiếp | docs verification trong `docs/01`, `docs/08`, `docs/14`; runtime auth baseline theo `dev login` | dễ nhầm Firebase OTP là auth source chính | chỉ bật khi flow `Firebase proof -> backend session` được chốt trong phase sau |
| `ADR-025` (radius + KNN + freshness) | `FDN-R02-T04`, `FDN-R04-T08` | docs/runtime alignment trong `docs/02`, `docs/03`, `docs/14` + dispatch tests theo `docs/10` | over-claim route-aware ranking làm sai phạm vi MVP-1 | route-aware ranking defer đến khi product chấp nhận cost/ops tăng |
| `ADR-026` (conditional background location) | `FDN-R04-T08` + mobile phases sau | mobile runtime checks + policy alignment `docs/05`, `docs/10`, `docs/14` | overstate capability background gây mismatch giữa docs và runtime | chỉ kích hoạt khi driver duty/active-order policy và permission flow đã được phê duyệt |

## Kết Luận

ADR là lớp quyết định gốc của repo. Nếu một docs khác mâu thuẫn với ADR, ADR là nơi phải được kiểm tra trước để xác định baseline nào còn hiệu lực.
