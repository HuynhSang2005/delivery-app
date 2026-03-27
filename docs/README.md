# Chỉ Mục Tài Liệu Dự Án

Thư mục này chứa source of truth cho phần sản phẩm, kiến trúc, dữ liệu, API, testing và vận hành của dự án nền tảng giao hàng.

Tính đến ngày `2026-03-25`, source-of-truth baseline hiện hành là bộ file `00` đến `14` và `references.md`.

`Foundation Plan (path hiện tại: docs/plan/foudation/)` là repo-level execution layer cho phần setup nền trước khi bắt đầu dev theo app. `Backend Plan (path: docs/plan/be/)` là backend execution layer nằm phía sau foundation, không thay thế product hoặc architecture baseline ở bộ file chính. Nếu các execution plans mâu thuẫn với `00` đến `14` hoặc `11-adrs.md`, ưu tiên bộ docs chính trước, rồi sửa lại execution plan tương ứng trước khi tiếp tục execution.

## Định Hướng Hiện Tại

- một `apps/mobile` duy nhất cho cả `user mode` và `driver mode`
- có `apps/admin-web` cho vận hành nội bộ
- backend dùng NestJS modular monolith
- dữ liệu chính dùng PostgreSQL + PostGIS
- realtime là điểm nhấn trải nghiệm, nhưng HTTP và database vẫn là nguồn sự thật cuối cùng
- build path đi theo `MVP-1 -> MVP-2 -> MVP-3`
- target architecture của repo là monorepo dùng package-manager workspace + `Nx`
- current repo state chưa nên được giả định là đã có root-level `Nx` executable baseline hoàn chỉnh

## Mô Hình Vận Hành Monorepo

Repo này không chỉ cần “chạy script nhanh”, mà cần một workspace có ranh giới đủ rõ để AI-agent và người điều phối có thể build theo phase mà không phá kiến trúc.

Baseline đã chốt:

- dùng `Nx` làm monorepo core
- tận dụng first-party plugins cho `Nest`, `Next.js`, `Expo`
- dùng `Nx Project Graph` để nhìn dependency thật giữa `api`, `admin-web`, `mobile`, `worker`, `packages/*`
- chuẩn hóa workspace target theo `lint`, `typecheck`, `test`, `build`, `e2e`, `smoke` khi phù hợp
- dùng `nx affected -t ...` làm entrypoint mặc định cho CI
- áp dụng tags và module-boundary rules từ đầu, không để boundary chỉ là “quy ước miệng”

Không giả định `Nx Cloud` hay remote cache ở `MVP-1`. Local cache của Nx là đủ cho baseline chi phí gần `0`.

## Mốc Scope

### MVP-1: CV-ready core

- `dev login` và seeded demo accounts
- quote cho `1 pickup + 1 dropoff`
- order lifecycle cơ bản
- dispatch offer-based trong `apps/api`
- driver accept order
- realtime cho trạng thái order và dispatch offer
- admin order board + order detail đủ để điều tra flow

### MVP-2: business differentiation

- driver onboarding + admin review
- driver board và dispatch attempts board
- capability refresh và mode switch ổn định

### MVP-3: runtime hardening và public demo

- order chat
- `apps/worker` + BullMQ + Redis queues
- Firebase test-number login sau khi auth POC ổn định
- hosted demo trên VPS
- EAS workflows, smoke test và hardening vận hành

## Danh Mục Tài Liệu

0. `00-documentation-conventions.md`
1. `01-product-requirements.md`
2. `02-solution-overview.md`
3. `03-system-architecture.md`
4. `04-backend-architecture.md`
5. `05-mobile-architecture-expo.md`
6. `06-admin-web-architecture.md`
7. `07-data-model.md`
8. `08-api-realtime-contracts.md`
9. `09-devops-runbook.md`
10. `10-testing-roadmap-risk.md`
11. `11-adrs.md`
12. `12-folder-structure.md`
13. `13-infrastructure-self-hosting.md`
14. `14-tech-stack-catalog.md`
15. `references.md`

## Thứ Tự Nên Đọc Khi Chuẩn Bị Build

1. `00-documentation-conventions.md`
2. `01-product-requirements.md`
3. `02-solution-overview.md`
4. `10-testing-roadmap-risk.md`
5. `11-adrs.md`
6. `12-folder-structure.md`
7. `04`, `05`, `06`, `07`, `08`
8. `09`, `13`, `14`

## Thứ Tự Nên Đọc Khi Giao Việc Cho AI-Agent

1. yêu cầu sản phẩm và scope phase
2. solution overview và ADR
3. folder structure + Nx workspace rules
4. `Foundation Plan (path hiện tại: docs/plan/foudation/)` nếu task chạm setup nền, workspace, infra, CI hoặc shared boundaries
5. testing strategy và definition of done
6. API/data docs liên quan trực tiếp tới task

## Mục Tiêu Của Bộ Docs

Bộ docs này phải đủ rõ để:

- bắt đầu scaffold mà không phải đoán lại quyết định nền
- giải thích được trade-off kỹ thuật với reviewer
- điều phối nhiều AI-agent mà vẫn giữ boundary giữa các app và package
- chứng minh được đây là một product portfolio có scope thực tế, chi phí thực tế và đường build thực tế
