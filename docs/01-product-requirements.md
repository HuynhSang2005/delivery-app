# 01. Yêu Cầu Sản Phẩm

## Mục Đích

Xác định rõ phạm vi sản phẩm, nhóm người dùng, luồng nghiệp vụ cốt lõi, tiêu chí thành công và các policy quan trọng để toàn bộ quá trình thiết kế và phát triển đi cùng một hướng.

## Trạng Thái

Baseline đã chốt cho `CV-ready MVP-1`, có ghi rõ các hướng nâng cấp ở `MVP-2/MVP-3`.

## Bối Cảnh

Dự án hướng tới một nền tảng giao hàng theo yêu cầu ở quy mô nhỏ nhưng đủ thực tế để đưa vào CV và portfolio. Mục tiêu không phải xây một sản phẩm thương mại đầy đủ ngay từ đầu, mà là tạo ra một baseline có:

- luồng nghiệp vụ rõ ràng
- kiến trúc nghiêm túc
- dữ liệu và API có tính thực tế
- realtime UX đủ thuyết phục
- chi phí phát triển và vận hành đủ thấp để một người có thể theo đuổi

## Mục Tiêu Chính

- xây được một hệ thống có luồng giao hàng sát thực tế
- thể hiện được năng lực full-stack: mobile, web admin, backend, database, realtime và hạ tầng
- giữ chi phí gần `0` ở giai đoạn đầu
- giữ phạm vi đủ gọn để một người có thể hoàn thành đẹp

## Các Trụ Cột Sản Phẩm

- `delivery business logic`: không chỉ CRUD, mà phải có lifecycle, dispatch, capability và ops semantics
- `realtime UX`: user, driver, admin đều thấy được trạng thái thay đổi nhanh và đúng
- `operational visibility`: admin phải điều tra được flow và failure mode
- `pragmatic scope`: có build path rõ, không đốt thời gian vào hạ tầng hoặc feature quá sớm

## Đối Tượng Sử Dụng

### Người dùng

- tạo báo giá
- tạo đơn hàng
- theo dõi trạng thái đơn
- đăng ký trở thành tài xế trong cùng app

### Tài xế

- dùng cùng một app mobile nhưng ở `driver mode`
- nhận đề xuất đơn
- chấp nhận đơn
- cập nhật các mốc giao hàng

### Quản trị vận hành

- theo dõi bảng đơn hàng
- mở trang detail để điều tra
- review hồ sơ đăng ký tài xế khi feature này được bật

## Nguyên Tắc Phạm Vi

- `MVP-1` phải ưu tiên luồng giao hàng cốt lõi
- không bắt buộc gom tất cả differentiator vào bản đầu tiên
- mọi tính năng làm tăng mạnh độ phức tạp vận hành hoặc chi phí ngoài phải được cân nhắc lại
- nếu phải chọn một differentiator sau core flow, ưu tiên `driver onboarding` trước `chat`

## Product Vision So Với Build Path

### Product vision đầy đủ

Product vision của repo này vẫn bao gồm:

- quote -> order -> dispatch -> delivery
- mobile một app hai mode
- admin web vận hành
- driver onboarding + admin review
- chat theo order

### Build path khuyến nghị

#### `CV-ready MVP-1`

`MVP-1` nên được execute theo hai checkpoint bên trong cùng một phase:

Checkpoint `portfolio slice`:

- `dev login` với seeded accounts
- một app mobile cho cả user và driver, nhưng chỉ cần flow đủ để chứng minh capability gating và order flow cốt lõi
- tạo báo giá cho `1 pickup + 1 dropoff`
- tạo đơn hàng từ báo giá còn hiệu lực
- một dispatch path tất định với seeded near-driver để ship được demo sớm
- tài xế chấp nhận đơn
- cập nhật trạng thái đơn đến `DELIVERED`
- admin order board + order detail ở read-side

Checkpoint `full CV-ready baseline`:

- dispatch offer-based cơ bản với freshness, shortlist và conflict-safety đúng policy
- realtime UX đủ tin cậy cho user, driver và admin
- reconnect/refetch không làm client giữ state sai
- unhappy paths tối thiểu như `QUOTE_EXPIRED`, `NO_DRIVER_FOUND` và accept conflict có evidence rõ

#### `MVP-2`

- `driver onboarding + admin review`

#### `MVP-3`

- `chat theo order`
- worker riêng với BullMQ
- Firebase test phone auth nếu thật sự cần
- public hosted demo bằng VPS + Caddy
- EAS build/release workflow

## Auth Solution Policy

### Baseline đã chốt

- backend-owned session là mô hình auth chính thức
- `dev login` là baseline của `MVP-1`
- capability luôn được backend trả qua `/auth/me`

### Firebase OTP-SMS

Firebase OTP-SMS không phải baseline của `MVP-1`. Nó chỉ là lựa chọn có điều kiện cho phase sau, và chỉ hợp lệ nếu đi theo mô hình:

1. mobile thực hiện bước proof-of-phone với Firebase
2. mobile lấy Firebase credential hoặc ID token
3. backend xác minh token đó
4. backend phát hành session/token của hệ thống

### Quy tắc kiến trúc

- Firebase không được trở thành session source of truth
- OTP-SMS chỉ là lớp identity proofing
- docs không được mô tả phone auth như “bật lên là xong” trong Expo-managed workflow

## Ngoài Phạm Vi Của `MVP-1`

- thanh toán thật
- hoàn tiền
- scheduled delivery phức tạp
- multi-stop delivery đầy đủ
- proof of delivery bằng ảnh/video
- analytics sản phẩm mức sâu
- microservices
- tối ưu production-scale

## Luồng Nghiệp Vụ Cốt Lõi

1. người dùng nhập thông tin pickup và dropoff
2. hệ thống tạo báo giá
3. người dùng xác nhận và tạo đơn
4. backend bắt đầu dispatch
5. tài xế phù hợp chấp nhận đơn
6. tài xế cập nhật các mốc giao hàng
7. admin có thể theo dõi quá trình ở mức vận hành

## Chính Sách Quote Và Pricing Của `MVP-1`

Để giữ chi phí gần `0`, `MVP-1` không phụ thuộc route provider trả phí để tính giá.

### Quy tắc baseline

- quote nhận `1 pickup + 1 dropoff`
- dùng khoảng cách thẳng theo tọa độ làm đầu vào
- cho phép nhân thêm `distance_multiplier` để tạo estimated distance dùng cho pricing
- giá ước tính theo công thức `base_fee + per_km * estimated_distance`
- quote có `expires_at`
- order tạo từ quote phải lưu pricing snapshot/version tương ứng

### Business rules

- quote hết hạn không được dùng để create order
- quote không phải voucher chung; nó gắn với account đã yêu cầu
- `estimated_price_minor` là giá ước tính đã chốt tại thời điểm quote
- `final_price_minor` chỉ khác khi phase sau thật sự có rule cho điều đó

## Routing Và ETA Policy

### Baseline `MVP-1`

- không tuyên bố đang tính “shortest path” thật nếu chưa có routing engine hoặc route provider
- pricing và candidate search dùng distance estimator rẻ và ổn định
- map trên mobile chỉ đóng vai trò hiển thị, không phải route source of truth

### Cách diễn giải đúng trong docs

- `estimatedDistanceMeters` ở `MVP-1` là estimated operational distance, không phải road-network shortest path chính xác
- nếu cần route polyline hoặc ETA theo traffic thật, đó là phase sau với route provider hoặc self-host routing stack riêng

### Quy tắc nâng cấp

- prefilter theo khoảng cách thẳng là hợp lý cho `MVP-1`
- route-aware ETA chỉ nên bật khi product thật sự cần và chấp nhận cost/ops tăng thêm

## Order Lifecycle Policy

### Trạng thái chính

- `CREATED`
- `SEARCHING_DRIVER`
- `NO_DRIVER_FOUND`
- `DRIVER_ASSIGNED`
- `DRIVER_ARRIVING`
- `PICKED_UP`
- `DELIVERED`
- `CANCELLED`

### Mô tả outcome

- `NO_DRIVER_FOUND` là outcome hợp lệ của dispatch, không phải exception kỹ thuật
- `DELIVERED` và `CANCELLED` là terminal states

### Bảng chuyển trạng thái baseline

| Từ trạng thái | Sang trạng thái | Actor chính | Ý nghĩa |
| --- | --- | --- | --- |
| `CREATED` | `SEARCHING_DRIVER` | hệ thống | order đã được lưu và bắt đầu dispatch |
| `SEARCHING_DRIVER` | `NO_DRIVER_FOUND` | hệ thống | đã cạn candidate hợp lệ |
| `SEARCHING_DRIVER` | `DRIVER_ASSIGNED` | hệ thống | có assignment hợp lệ sau accept |
| `DRIVER_ASSIGNED` | `DRIVER_ARRIVING` | tài xế | tài xế đang tới pickup |
| `DRIVER_ARRIVING` | `PICKED_UP` | tài xế | đã nhận hàng |
| `PICKED_UP` | `DELIVERED` | tài xế | đã giao xong |
| `CREATED`/`SEARCHING_DRIVER`/`DRIVER_ASSIGNED`/`DRIVER_ARRIVING` | `CANCELLED` | user hoặc hệ thống theo policy | đơn bị hủy theo rule cho phép |

### Quy tắc baseline

- chỉ actor hợp lệ mới được kích hoạt transition tương ứng
- transition phải để lại timeline/history
- admin không được sửa tay state machine ngoài flow đã chốt

## Dispatch Policy

### Baseline đã chốt

- dispatch đi theo `offer-based flow`
- backend chủ động chọn candidate và gửi offer
- driver không nhận đơn từ marketplace list công khai

### Candidate eligibility tối thiểu

- có driver profile active
- đang ở trạng thái nhận đơn
- không có active order khác
- vị trí còn mới trong freshness window
- nằm trong search radius của order

### Project defaults khuyến nghị cho `MVP-1`

Đây là baseline của repo, không phải tiêu chuẩn chung cho mọi hệ thống:

- pickup radius ban đầu: khoảng `2-5 km` tùy loại phương tiện và khu vực hoạt động
- candidate shortlist ban đầu: `5-10` tài xế gần nhất
- offer batch ban đầu: `1-3` tài xế mỗi nhịp
- offer TTL ban đầu: khoảng `15-20 giây`
- presence staleness cho dispatch: không nên quá `30-60 giây`

Inference:

- Google Fleet cho phép search theo `pickup_radius_meters`, `count`, `maximum_staleness`
- Google Fleet mặc định `maximum_staleness` server-side có thể rộng hơn nhu cầu delivery UX của repo này, nên baseline project cần chặt hơn

### Ranking inputs tối thiểu

- khoảng cách tới pickup
- freshness của location
- trạng thái rảnh

### Offer semantics

- mỗi offer có `offer_expires_at`
- decline, timeout hoặc stale driver phải được ghi lại
- nhiều driver có thể accept gần như cùng lúc
- backend phải giải quyết conflict và chỉ cho một người thắng
- nếu hết candidate hợp lệ, order chuyển `NO_DRIVER_FOUND`

### Nearest-driver selection baseline

Candidate selection ở `MVP-1` phải đi theo pipeline:

1. lọc theo capability và availability
2. loại driver có presence stale hoặc đang bận
3. giới hạn trong pickup radius
4. lấy top-N gần nhất
5. áp thêm fairness/capacity rule đơn giản nếu cần

Quy tắc:

- “gần nhất” không chỉ là khoảng cách nhỏ nhất, mà là khoảng cách + freshness + trạng thái rảnh
- không dùng vị trí quá cũ để dispatch
- nếu sau này có route-aware ETA, nó chỉ thay lớp ranking, không phá API contract

## Driver Operations Policy

### Driver capability

- chỉ account có driver profile active mới vào được `driver mode`
- account đang `PENDING_REVIEW`, `NEEDS_UPDATE`, `REJECTED` vẫn có thể dùng `user mode`

### Presence và availability

Driver-side system phải thể hiện được:

- online/offline
- available/unavailable
- active order hiện tại
- vị trí mới nhất và timestamp tương ứng

### Rule baseline

- driver không được nhận nhiều order active cùng lúc
- driver không được update trạng thái cho order không thuộc assignment của mình
- reconnect hoặc foreground phải refetch active order nếu có

## Background Tracking Và GPS Policy

### Baseline `MVP-1`

- user app không chạy background location liên tục
- driver chỉ cần foreground updates cho phần lớn flow demo
- background location chỉ được xem xét cho `driver duty` hoặc `active order` phase sau

### Nguyên tắc

- không bật background GPS always-on cho mọi account
- location updates phải mang theo timestamp và accuracy khi có thể
- driver presence dùng để dispatch phải có freshness window rõ
- app foreground/reconnect phải refetch active order và presence state quan trọng

### Mục tiêu

- đủ realtime để demo được delivery flow
- không hi sinh pin và complexity quá sớm chỉ để “trông production”

## Driver Onboarding Policy

Driver onboarding thuộc `MVP-2`.

Quy tắc:

- mỗi account chỉ có một hồ sơ đang hoạt động tại một thời điểm
- hồ sơ có các trạng thái `PENDING_REVIEW`, `NEEDS_UPDATE`, `APPROVED`, `REJECTED`
- chỉ khi `APPROVED` thì mới tạo hoặc kích hoạt driver profile
- account vẫn có thể đặt đơn như user trong lúc hồ sơ chờ duyệt

## Admin Ops Goals

`MVP-1` cần tối thiểu:

- order board
- order detail
- `MVP-1` không mặc định có admin mutation như cancel hoặc resolve action; nếu thêm, phải cập nhật product docs, API contract và ADR trước

Admin phải nhìn được:

- status timeline
- assignment summary
- dispatch outcome cơ bản
- các trạng thái lỗi như `NO_DRIVER_FOUND`

Khi mở rộng thêm feature:

- driver board
- dispatch attempts board
- driver application review
- chat transcript

## Realtime Và UX Requirements

### User

- nhìn thấy order status thay đổi nhanh
- sau reconnect vẫn thấy lại trạng thái đúng qua refetch

### Driver

- nhận offer trong UI với thời hạn rõ
- thấy pending/conflict/expired states rõ ràng

### Admin

- board và detail được cập nhật đủ nhanh để điều tra flow

### Source of truth rule

- socket tăng tốc UX
- HTTP/API và database vẫn là nguồn sự thật cuối cùng

## Feature Catalog Ở Mức Sản Phẩm

### 1. Auth

- baseline: `dev login`
- capability được trả rõ qua `/auth/me`
- Firebase test auth chỉ là lựa chọn có điều kiện

### 2. Quotes

- nhận pickup/dropoff
- trả estimated distance, estimated price, pricing version

### 3. Orders

- create từ quote còn hiệu lực
- có status timeline
- có cancel policy có kiểm soát

### 4. Dispatch

- backend chọn candidate
- gửi offer
- ghi lại attempts
- xử lý conflict và exhaustion

### 5. Driver ops

- presence update
- accept order
- update delivery status

### 6. Admin

- order board
- order detail
- phase sau mới mở rộng ops dashboards khác

### 7. Driver onboarding

- `MVP-2`

### 8. Order chat

- `MVP-3`

## Yêu Cầu Phi Chức Năng

### Tính khả thi

- có thể triển khai bởi một người
- local demo phải chạy được mà không cần hạ tầng phức tạp

### Demo-quality performance

- quote và order phải phản hồi đủ nhanh cho demo
- admin board và mobile phải cập nhật lại state trong vài giây
- reconnect ngắn không làm UI stale quá lâu

### Tính dễ bảo trì

- kiến trúc phải đủ rõ để mở rộng dần
- docs phải dùng được như implementation baseline

### Tính tiết kiệm chi phí

- ưu tiên công nghệ có free tier, tự host được hoặc không bắt buộc dùng từ ngày đầu
- tách rõ `local/CV demo path` và `public demo path`

## Tiêu Chí Thành Công

- demo trọn vẹn được luồng `quote -> order -> dispatch -> accept -> delivered`
- admin xem được order board và order detail có dữ liệu thật
- docs đủ rõ để bắt đầu scaffold mà không phải đoán lại policy
- codebase và docs đủ nghiêm túc để đưa vào CV/portfolio

## Anti-Goals

Các mục sau không phải tiêu chí thành công của `MVP-1`:

- giao diện quá cầu kỳ
- độ phủ tính năng ngang sản phẩm thương mại thật
- tối ưu cực sâu cho scale production
- tích hợp cùng lúc quá nhiều dịch vụ ngoài

## Kết Luận

Baseline của dự án phải tập trung vào một delivery workflow ngắn gọn nhưng thực tế, có lifecycle rõ, dispatch rõ, realtime rõ và admin visibility đủ tốt. Nếu ba phần đó không chặt, project sẽ rất dễ trôi thành demo CRUD thay vì một product portfolio đáng tin.
