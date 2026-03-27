# 02. Tổng Quan Giải Pháp

## Mục Đích

Tóm tắt hướng giải pháp đã chọn ở mức tổng quan để các tài liệu chi tiết phía sau bám cùng một baseline về sản phẩm, workspace, runtime và quality model.

## Trạng Thái

Baseline đã chốt cho `CV-ready MVP-1`, có tách rõ đường nâng cấp ở `MVP-2` và `MVP-3`.

## Bối Cảnh Giải Pháp

Dự án là một delivery product ở quy mô nhỏ nhưng phải đủ thực tế để:

- đưa vào CV/portfolio
- thể hiện được full-stack engineering
- thể hiện năng lực làm product thay vì chỉ ghép CRUD
- vẫn khả thi với nguồn lực một người và chi phí gần `0`

## Các Trụ Cột Sản Phẩm

Giải pháp này được xây quanh bốn trụ cột:

- `business realism`: order, dispatch, driver capability, admin ops phải giống sản phẩm thật ở mức hợp lý
- `realtime UX`: user, driver, admin thấy được trạng thái thay đổi nhanh và nhất quán
- `operational visibility`: admin phải điều tra được flow, không chỉ xem list cho có
- `pragmatic build path`: có đường đi rõ từ local-first MVP đến hardening phase sau

## Mô Hình Vận Hành Workspace

Repo được tổ chức thành monorepo dùng package-manager workspace + `Nx`.

Ý nghĩa:

- `Nx Project Graph` là cách nhìn dependency thật giữa `api`, `admin-web`, `mobile`, `worker`, `packages/*`
- `Nx targets` là hợp đồng để AI-agent build, test và verify thống nhất
- `nx affected -t ...` là baseline cho CI
- tags và module boundaries là cơ chế bảo vệ kiến trúc, không chỉ là guideline

## Hình Dạng Sản Phẩm

Nhóm người dùng chính:

- người dùng đặt đơn
- tài xế nhận đơn
- quản trị vận hành

Thành phần chính:

- `apps/api`: backend NestJS + HTTP API + realtime gateway
- `apps/admin-web`: công cụ vận hành nội bộ bằng Next.js
- `apps/mobile`: một app Expo cho cả `user mode` và `driver mode`
- `apps/worker`: chỉ bật khi cần async runtime tách riêng
- `packages/api-client`: generated HTTP client
- `packages/shared-kernel`: types/constants dùng chung thật sự

## Build Path Theo Phase

### `CV-ready MVP-1`

`MVP-1` nên được execute theo hai checkpoint:

1. `portfolio slice`: user tạo quote
2. `portfolio slice`: user tạo order
3. `portfolio slice`: backend chạy một dispatch path tất định với seeded driver
4. `portfolio slice`: driver accept order
5. `portfolio slice`: order đi tới `DELIVERED`
6. `portfolio slice`: admin theo dõi order board và order detail read-only
7. `full CV-ready baseline`: mở rộng từ flow trên sang dispatch offer-based đúng policy, realtime reconciliation và unhappy paths cốt lõi

### `MVP-2`

- driver onboarding + admin review
- board và playbook vận hành đầy đủ hơn

### `MVP-3`

- order chat
- worker riêng với BullMQ
- hosted demo
- CI/CD mobile và hardening sâu hơn

## Bảng Quyết Định Ở Mức Tổng Quan

| Chủ đề | Quyết định baseline | Ghi chú |
| --- | --- | --- |
| Monorepo | `Nx` | không dùng Turborepo làm core |
| Backend | NestJS modular monolith | feature-first, layered modules |
| ORM | Prisma v7 + PostgreSQL driver adapter | raw SQL chỉ cho geo/read nâng cao |
| Dispatch runtime | chạy trong API ở `MVP-1` | worker là phase sau |
| Mobile | Expo + React Native | một app, hai mode |
| Auth demo | `dev login` | Firebase test auth chỉ có điều kiện |
| HTTP client | hey-api + Fetch | contract-first |
| Server state | TanStack Query | zustand chỉ cho global/UI state |
| Map | `react-native-maps` + `expo-location` | map không phải pricing engine |
| Quote/pricing | internal estimator versioned | tránh phụ thuộc paid provider sớm |
| Hạ tầng | local-first | VPS + Caddy là đường public demo |
| Testing orchestration | `Nx targets` | `affected` là baseline CI |

## Những Quy Tắc Xuyên Suốt

### 1. Capability-based access

- không dùng `role đơn` làm nguồn sự thật
- `/auth/me` phải trả capability rõ

### 2. HTTP-authoritative realtime

- socket tăng tốc UX
- final state phải đọc lại được qua HTTP/API

### 3. Offer-based dispatch

- driver không “tự lướt marketplace”
- backend chủ động offer theo candidate ranking

### 4. Admin là công cụ điều tra

- admin không phải nơi vá logic backend
- admin phải nhìn thấy timeline, assignment, dispatch summary

### 5. Pricing snapshot

- quote và order phải cùng bám một version pricing cụ thể

## Tại Sao Hướng Này Phù Hợp Cho Portfolio

- đủ rộng để thể hiện backend, mobile, web, DB, realtime, infra
- đủ thật để nói về business rules thay vì chỉ nói library choices
- đủ gọn để một người hoàn thành nếu bám đúng phase
- dễ giải thích trade-off với recruiter hoặc reviewer

## Ràng Buộc Kiến Trúc

- không over-engineer để chạy theo xu hướng
- không đưa vào quá nhiều dịch vụ ngoài khi chưa cần
- mọi quyết định phải giúp hoàn thành `MVP-1` trước
- docs phải đủ rõ để agent không phải tự phát minh policy

## Kết Luận

Giải pháp phù hợp cho dự án hiện tại là một delivery product monorepo dùng `Nx`, lấy NestJS làm trung tâm, có một mobile app đa mode, một admin app cho ops, và một core flow đủ thực tế để chứng minh năng lực xây product chứ không chỉ dựng demo UI.
