# 10. Testing, Roadmap Và Risk

## Mục Đích

Xác định chiến lược kiểm thử đủ sâu cho một delivery product thiên về realtime, UX và business logic, đồng thời ràng buộc testing vào `Nx targets` để AI-agent và người điều phối có cùng một chuẩn hoàn thành công việc.

## Trạng Thái

Baseline đã chốt cho `CV-ready MVP-1`, có mở rộng rõ cho `MVP-2` và `MVP-3`.

## Mục Tiêu Chất Lượng

Testing của dự án này không chỉ nhằm “có test”, mà phải chứng minh được:

- business rules đúng
- API contract không drift
- realtime không làm sai state khi reconnect hoặc race
- admin và mobile phản ánh đúng trạng thái nghiệp vụ
- mỗi feature mới có evidence rõ trước khi được coi là hoàn thành

## Triết Lý Kiểm Thử

- database và HTTP response là nguồn sự thật cuối cùng
- realtime là lớp tăng trải nghiệm, không phải đường duy nhất để dữ liệu đúng
- test phải bám vào luồng nghiệp vụ và failure mode thật của delivery domain
- `happy path`, `sad path`, `race path`, `reconnect path` đều phải được xem là first-class
- feature chưa có testing plan và acceptance criteria thì chưa đủ điều kiện để giao cho AI-agent build

## Test Pyramid Của Dự Án

Tỷ lệ mục tiêu:

- unit: khoảng `60-70%`
- integration: khoảng `20-30%`
- e2e và smoke: khoảng `10%`

Diễn giải:

- unit test chứng minh rule, policy, state machine và helper
- integration test chứng minh module và dependency thật hoạt động cùng nhau
- e2e chứng minh product flow chạy được theo góc nhìn user/admin/driver

## Hợp Đồng Target Cho Testing Trong Nx

### Bắt buộc

- `lint`
- `typecheck`
- `test`
- `build`

### Theo điều kiện nhưng nên có sớm

- `e2e`
- `smoke`
- `contract`

### Cách dùng

- PR mặc định chạy `nx affected -t lint typecheck test build`
- thay đổi chạm vào flow quan trọng thì chạy thêm `nx affected -t e2e`
- hosted demo thì có thêm `smoke`
- pre-commit bắt buộc chạy `lint-staged` với `nx affected -t lint typecheck test --files` trên staged files

### Verification mode theo giai đoạn

- `current-state`: khi root Nx workspace chưa executable đầy đủ, dùng app-level verification commands theo runbook và ghi rõ đây là fallback tạm thời
- `target-state`: khi workspace graph và target contracts đã sẵn sàng, dùng canonical path `nx affected -t lint typecheck test build` và bổ sung `e2e` khi flow trọng yếu đổi
- không được báo cáo `target-state` nếu evidence vẫn dùng command set của `current-state`
- sau khi hoàn tất `FDN-R01`, verification mặc định phải ưu tiên `target-state`; `current-state` chỉ là fallback có ghi rõ lý do

## Ma Trận Kiểm Thử Theo Ứng Dụng

| Ứng dụng | `test` | `e2e` | Trọng tâm |
| --- | --- | --- | --- |
| `apps/api` | unit + integration | có, ở mức flow hệ thống hoặc API E2E | business rules, transaction, contract, realtime |
| `apps/admin-web` | component + query-state tests | có | ops flows, async pages, empty/error states |
| `apps/mobile` | component + integration tests | có | UX flow, navigation, mode gating, reconnect behavior |
| `packages/api-client` | generation/contract checks | không bắt buộc | contract sync |
| `packages/shared-kernel` | unit tests | không | shared invariants |

## Bộ Tiêu Chí “Hoàn Thành” Cho Mỗi Feature

Một feature chỉ được coi là done khi đủ bốn lớp sau:

1. docs đã mô tả rõ scope, policy và non-goals
2. business rule quan trọng có unit hoặc integration test
3. contract và state transitions đã được kiểm chứng
4. có ít nhất một evidence theo góc nhìn người dùng hoặc vận hành nếu flow là flow quan trọng

## Backend Testing

### 1. Unit tests bắt buộc

Các vùng phải có unit tests ngay từ sớm:

- quote estimator
- pricing version selection
- order state transition policy
- dispatch candidate filtering
- dispatch offer expiry policy
- driver accept conflict handling
- driver capability gating
- refresh token/session lifecycle
- chat idempotency nếu chat được bật

### 2. Integration tests bắt buộc

Integration tests phải dùng app/module thật và DB test riêng, không chỉ mock:

- `POST /quotes`
- `POST /orders` với `Idempotency-Key`
- driver accept cùng lúc từ nhiều request
- `NO_DRIVER_FOUND` sau khi dispatch cạn candidate
- admin review hồ sơ và chỉ tạo một driver profile
- session refresh rotation + logout

### 3. Contract tests

Contract tests phải kiểm tra:

- Swagger/OpenAPI sinh ra được
- operation ids ổn định
- success/error envelopes đúng shape
- generated client không drift khỏi spec

## Realtime Testing

Đây là vùng không được làm sơ sài, vì sản phẩm đánh mạnh về realtime UX.

### Phải kiểm tra

- subscribe room đúng
- event quan trọng có ack
- reconnect không làm client nghĩ state vẫn mới dù đã stale
- `socket.recovered` chỉ là tối ưu, không được thay thế HTTP refetch
- event dispatch offer đến đúng driver
- accept conflict báo đúng cho driver thua race
- admin board invalidate đúng khi order status đổi

### Quy tắc xác minh

- socket event luôn được đối chiếu lại bằng HTTP state hoặc DB state
- không chấp nhận test chỉ assert “đã nhận event” mà không xác minh final state

## Admin Web Testing

### Component và interaction tests

Phải kiểm tra:

- filters và query params
- empty state
- error state
- capability guard ở UI
- query invalidation sau mutation ops

### E2E

Admin web cần E2E vì App Router và async data flow dễ sai ở runtime hơn là ở unit test.

Flow tối thiểu:

- admin login
- mở orders board
- mở order detail
- thấy timeline đổi sau khi driver update trạng thái

Khi onboarding được bật:

- mở driver applications board
- review application
- thấy trạng thái mới ở board và detail

## Mobile Testing

### Unit và integration

Phải kiểm tra:

- mode gating giữa user và driver
- route protection
- form validation cho auth, quote, onboarding
- optimistic/pending UI states
- socket reconnect banner hoặc state refresh logic

### Router tests

- dùng `expo-router/testing-library`
- test deep link vào các route quan trọng
- test redirect nếu không có capability

### E2E với Maestro

Flow `MVP-1`:

- dev login
- tạo quote
- tạo order
- chuyển sang driver account
- accept đơn
- cập nhật trạng thái

Ghi chú:

- test data mặc định nên có đường ASCII-safe vì Maestro Android có known issue với non-ASCII ở một số flow nhập liệu

## Cross-App Scenario Tests

Đây là lớp chứng minh portfolio value.

### Golden path `MVP-1`

1. user login
2. tạo quote
3. tạo order
4. order sang `SEARCHING_DRIVER`
5. driver nhận offer
6. driver accept
7. admin thấy assignment
8. driver update `DRIVER_ARRIVING -> PICKED_UP -> DELIVERED`
9. user và admin thấy trạng thái cuối đúng

### Failure scenarios bắt buộc

- quote hết hạn trước khi create order
- create order gửi trùng `Idempotency-Key`
- hai driver accept cùng lúc
- dispatch cạn candidate
- socket disconnect rồi reconnect
- token hết hạn và refresh thất bại

## Tiêu Chí Chất Lượng Theo Phase

### `CV-ready MVP-1`

Nên chia execution thành hai checkpoint trong cùng `MVP-1`.

Checkpoint `portfolio slice`:

- một happy path backend đủ thật cho `quote -> order -> driver accept -> delivered`
- admin order board và order detail dùng dữ liệu thật
- một mobile E2E happy path hoặc manual demo evidence có thể lặp lại
- một admin E2E hoặc smoke evidence tối thiểu cho investigation flow

Checkpoint `full CV-ready baseline`:

- `quote -> order -> dispatch -> accept -> delivered`
- admin order board và order detail dùng dữ liệu thật
- realtime order status hoạt động
- reconnect không làm client giữ state sai

### `MVP-2`

Bắt buộc thêm:

- driver application lifecycle
- capability refresh sau approve
- admin review không tạo duplicate profile

### `MVP-3`

Bắt buộc thêm:

- chat transcript đúng thứ tự
- worker jobs xử lý retry/delay đúng
- smoke test hosted demo

## Tiêu Chí Phi Chức Năng Có Thể Kiểm Chứng

Đây không phải SLA production, mà là mục tiêu demo-quality:

- quote phản hồi đủ nhanh để không tạo cảm giác lag trong local demo
- order status đổi và hiện lại ở admin trong vài giây
- reconnect ngắn không làm user phải kill app để thấy state mới
- logs đủ để debug một order lỗi từ đầu đến cuối

## Test Data Strategy

- seeded demo accounts cho `user`, `driver`, `admin`
- fixed coordinates mẫu để test pricing và dispatch
- driver presence fixtures có near/far/offline/busy
- fake clocks hoặc controllable timestamps cho offer expiry khi cần
- mọi ID và test payload quan trọng phải deterministic

## Quality Gates Cho Pull Request

### Mặc định

- `nx affected -t lint typecheck test build`

### Khi thay đổi chạm vào flow trọng yếu

- `nx affected -t e2e`

### Khi thay đổi contract

- regenerate client
- verify operation ids
- review breaking changes

## Rủi Ro Chính

| Rủi ro | Mô tả | Hướng giảm thiểu |
| --- | --- | --- |
| Docs không đủ sâu | agent build theo suy đoán | chốt ADR, testing criteria, folder rules trước |
| Dispatch race condition | nhiều driver nhận cùng đơn | transaction + conflict test + realtime conflict handling |
| Realtime ảo tưởng đúng | UI nhận event nhưng state thật sai | HTTP-authoritative verification |
| Contract drift | backend, mobile, admin lệch DTO | OpenAPI-first + generated client + contract check |
| Scope phình quá nhanh | chat, onboarding, worker cùng thành blocker | phase gating chặt |
| Nx chỉ dùng như task runner | vẫn thiếu boundaries | tags + module-boundary rules + project graph review |
| E2E flaky | flow phụ thuộc timeout | ưu tiên ack, deterministic seed và explicit polling |

## Kết Luận

Testing của dự án này phải được xem là một phần của architecture, không phải phụ lục. Nếu docs không chốt được quality criteria, target contracts và evidence cần có, thì mọi plan/phase giao cho AI-agent đều sẽ kém tin cậy.
