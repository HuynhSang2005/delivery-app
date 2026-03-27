# 05. Kiến Trúc Mobile Với React Native + Expo

## Mục Đích

Xác định kiến trúc kỹ thuật cho ứng dụng mobile dùng chung cho cả user và driver, bao gồm cấu trúc route, feature boundaries, state ownership, realtime UX, auth, testing và constraints phù hợp với Expo hiện tại.

## Trạng Thái

Baseline đã chốt cho `CV-ready MVP-1`, có ghi rõ lựa chọn nâng cấp ở phase sau.

## Vai Trò Của Mobile App

`apps/mobile` là mặt tiền chính của sản phẩm.

App phải cùng lúc phục vụ:

- người dùng tạo quote, order và theo dõi đơn
- tài xế nhận offer, accept order, cập nhật trạng thái

Điều đó khiến mobile không chỉ là UI layer, mà là nơi thể hiện rõ nhất `realtime UX`, `capability gating` và `delivery workflow`.

## Vì Sao Không Tách Thành Hai App

- quá nặng với scope hiện tại
- tăng chi phí build, release và bảo trì
- auth, account, order history và session có thể dùng chung
- không tăng portfolio value tương xứng với complexity tăng thêm

## Mô Hình Ứng Dụng

### User mode

- tạo báo giá
- tạo đơn
- theo dõi trạng thái đơn
- đăng ký làm tài xế khi feature được bật

### Driver mode

- nhận dispatch offer
- chấp nhận đơn
- cập nhật trạng thái giao hàng

## Driver Mode Gating

Driver mode chỉ mở khi đồng thời đúng:

- account đã đăng nhập
- account có `driver capability`
- driver profile không bị đình chỉ

Nếu hồ sơ ở trạng thái:

- `PENDING_REVIEW`: chỉ hiển thị trạng thái chờ duyệt
- `NEEDS_UPDATE`: cho phép sửa và nộp lại
- `REJECTED`: không cho vào driver mode

## Mục Tiêu UX Của Mobile

App phải làm rõ ba điều:

- user hiểu order đang ở đâu
- driver biết mình có quyền gì và đang có offer/order nào
- reconnect hoặc background không làm UI giữ state sai quá lâu

## App Shell Và Routing

Sử dụng `expo-router`.

### Cấu trúc route gợi ý

```text
app/
  _layout.tsx
  (auth)/
  (user-tabs)/
    home/
    orders/
    profile/
  driver/
    apply/
    review-status/
  (driver-tabs)/
    jobs/
    activity/
    profile/
  order/
    [orderId]/
      index.tsx
      chat.tsx
```

### Nguyên tắc routing

- `app/` chỉ giữ route tree, layout và guard composition
- route user và driver nằm chung app nhưng tách bằng route groups
- `driver-tabs` được bảo vệ bằng capability guard
- `driver/apply` và `driver/review-status` luôn đi được khi user có quyền mở onboarding

## Feature Boundaries Trong `src/`

```text
src/
  features/
    auth/
      api/
      hooks/
      screens/
      schemas/
    quotes/
    orders/
    dispatch/
    driver-onboarding/
    driver-ops/
    chat/
    maps/
  lib/
    api/
    auth/
    realtime/
    storage/
    forms/
    permissions/
  stores/
  ui/
  components/
```

Quy tắc:

- feature folders giữ logic theo nghiệp vụ
- `lib/` chỉ chứa runtime services dùng nhiều feature
- `stores/` không được thay cho server state cache

## State Ownership

### Server state

- `@tanstack/react-query`

Dùng cho:

- auth profile hiện tại
- quote/order data
- order detail
- admin-independent read models của mobile

### Global/UI state

- `zustand`

Dùng cho:

- session state cục bộ
- mode switch
- reconnect banner
- ephemeral UI workflow state

### Form state

- `react-hook-form`
- `zod`

## Auth Và Session Model

Auth trên mobile là `backend-owned session`.

Điều đó có nghĩa:

- mobile không xem Firebase là session source of truth
- backend phát hành access token và refresh token của hệ thống
- mobile chỉ giữ token và trạng thái đăng nhập

### Baseline auth flow

- `dev login`
- seeded demo accounts

### Firebase trên Expo

Expo docs hiện hành cho phép nhiều hướng tích hợp Firebase, nhưng với repo này:

- `Firebase test-number flow` là lựa chọn có điều kiện, không phải baseline
- nếu cần phone/test auth, ưu tiên `Firebase JS SDK` trước
- line `expo` và `firebase` phải được verify lại tại thời điểm scaffold thật, không hardcode assumption version khi chưa re-check docs chính thức

### OTP-SMS caveat

Phone auth không được mô tả như một flow “rẻ và đơn giản” trong Expo.

Từ docs chính thức:

- web/JS flow của Firebase phone auth dùng `signInWithPhoneNumber` + `reCAPTCHA`
- native iOS/Android phone auth có app-verification riêng và có các nhánh fallback sang `reCAPTCHA`
- `TaskManager` và nhiều background capability có giới hạn trong Expo Go; dev build là baseline thực tế hơn khi cần behavior gần native hơn

Kết luận cho repo này:

- `MVP-1` giữ `dev login`
- nếu bật OTP-SMS, chỉ dùng nó như bước proof-of-phone rồi đổi sang session backend
- không xem Firebase session là session cuối cùng của sản phẩm

## Networking

### HTTP

- generated client từ `@hey-api/openapi-ts`
- `@hey-api/client-fetch`
- mọi request đi qua runtime wrapper chung trong `src/lib/api`

### Realtime

- `socket.io-client`

Quy tắc:

- socket chỉ tăng tốc UX
- state quan trọng vẫn phải refetch qua HTTP sau reconnect hoặc foreground
- UI không được assume một event tới là state chắc chắn đúng

## Realtime UX Rules

### Order screens

- order detail là màn hình authoritative để reconcile state
- socket event chỉ trigger update nhanh hoặc invalidate query
- sau reconnect, app phải refetch active order và order detail đang mở

### Driver offer flow

- offer phải có countdown theo `offerExpiresAt`
- accept đang pending phải có loading state rõ
- nếu thua race, UI phải nhận conflict state rõ ràng
- offer hết hạn phải tự đóng hoặc chuyển sang expired state

### Background/foreground

- khi app quay lại foreground, refetch auth/profile và active order nếu đang có
- nếu socket chưa phục hồi, app không được giả vờ “online realtime”

### Background execution reality

Từ docs chính thức của Expo:

- `expo-task-manager` hỗ trợ background tasks, nhưng khả năng test/background execution bị giới hạn trong Expo Go
- background location thật nên được xem là capability cần dev build và native permission flow rõ ràng

Quyết định:

- `MVP-1` không chạy background location always-on
- background location chỉ xem xét cho `driver duty` hoặc `active order`
- nếu chưa có dev build và permission flow rõ, docs không được giả định tracking nền hoạt động như production

## Driver Operations Trên Mobile

Mobile phải thể hiện được:

- availability state
- pending offer
- active assignment
- pickup/delivery actions theo đúng assignment hiện tại

Không nên làm ở `MVP-1`:

- marketplace list cho driver
- nhận nhiều đơn cùng lúc
- routing tối ưu nhiều chặng

## Styling Và UI System

### Baseline MVP

- UI primitives nội bộ gọn nhẹ
- icon: `@expo/vector-icons`
- animation: `react-native-reanimated`
- gesture: `react-native-gesture-handler`

### NativeWind

Ưu điểm:

- tốc độ dựng UI nhanh
- syntax quen thuộc

Rủi ro hiện tại:

- tính đến ngày `2026-03-25`, NativeWind v5 vẫn đang ở trạng thái `pre-release` theo docs chính thức

Quyết định:

- có thể dùng NativeWind làm hướng styling chính
- nhưng không chốt `v5 preview` làm baseline mặc định trong docs

## Map Và Location

### Baseline

- `react-native-maps`
- `expo-location`

### Khi nào cần `expo-task-manager`

- chỉ cần khi phase sau bật background location updates cho driver
- không bắt buộc cho phần lớn `MVP-1` nếu driver presence chỉ cần foreground updates

### GPS update strategy

Driver tracking nên có hai mức:

- `foreground active`: update dày hơn khi driver đang online nhận đơn hoặc đang có active order
- `background degraded`: update thưa hơn, chỉ khi thật sự cần giữ driver duty

Project defaults khuyến nghị:

- `available + foreground`: khoảng `10-20 giây` hoặc `50-100m` mỗi update
- `active order + foreground`: khoảng `5-10 giây` hoặc `10-25m` mỗi update
- `background + active order`: chỉ là phase sau; cadence nên thưa hơn foreground và phải chấp nhận degrade

Inference:

- Google Fleet coi active vehicles nên được cập nhật đều, và không nên để khoảng cách quá lâu nếu muốn tracking có ý nghĩa
- Expo background execution có giới hạn platform nên cadence nền không nên bị mô tả như “gần real-time tuyệt đối”

Tiêu chí của một location update hữu ích:

- có timestamp
- có accuracy
- không quá cũ
- gắn với trạng thái availability phù hợp

### Battery-first rule

Không tối ưu bằng cách “gửi GPS càng nhiều càng tốt”.

Docs nên phản ánh:

- foreground driver duty mới là lúc ưu tiên accuracy cao hơn
- idle user flow không cần watch vị trí liên tục
- background tracking là cost về pin, permission và complexity, không nên bật để trang trí portfolio

### Quy tắc quan trọng

- map là UI/location support, không phải pricing source
- `MVP-1` dùng internal estimator ở backend
- không mặc định `Google provider` cho mọi platform
- Android cần cân nhắc API key/billing nếu dùng Google Maps provider

## Error, Empty Và Pending States

Tối thiểu mobile phải xử lý:

- token hết hạn
- backend tạm không sẵn sàng
- order không tồn tại
- driver mode không khả dụng
- quote hết hạn
- offer đã hết hạn hoặc đã bị tài xế khác nhận

## Testing Strategy Cho Mobile

### Unit và component test

- `jest-expo`
- `@testing-library/react-native`

### Router integration

- `expo-router/testing-library`
- test files nằm ngoài `app/`

### E2E

- Maestro cho critical flows

Flow phải chứng minh:

- dev login
- create quote
- create order
- mode gating
- driver accept
- status updates

## Những Gì Không Chốt Quá Sớm

- phone auth thật
- push notifications production-grade
- offline-first với local database
- NativeWind preview line cụ thể
- paid map/geocoding providers

## Kết Luận

Kiến trúc mobile của dự án phải được tối ưu cho ba thứ: mode gating rõ, realtime UX đáng tin và feature boundaries đủ sạch để AI-agent có thể phát triển theo flow mà không đẩy business logic vào route files hoặc global store.
