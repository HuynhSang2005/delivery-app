# 08. Hợp Đồng API Và Realtime

## Mục Đích

Xác định baseline cho HTTP API và realtime contract để backend, admin web và mobile cùng dùng chung một giao diện tích hợp, tránh drift trong quá trình phát triển.

## Trạng Thái

Baseline đã chốt cho `CV-ready MVP-1`, có đánh dấu rõ endpoint và event nào thuộc phase sau.

## Triết Lý Thiết Kế Contract

- `NestJS-first`: controller và DTO là lớp hiện thực nguồn
- `OpenAPI-first`: Swagger/OpenAPI là artifact contract chính thức
- `generated-client-first`: mobile và admin dùng generated client thay vì tự viết SDK rời
- `HTTP-authoritative realtime`: socket event hỗ trợ UX, HTTP/API vẫn là nơi reconcile final state

## Quy Ước Chung

### Base path

- toàn bộ HTTP API đi qua `/api/v1`

### Authentication

- baseline hiện tại dùng bearer access token cho cả mobile và admin web
- Socket.IO dùng token trong handshake auth
- nếu sau này web-only flow cần HTTP-only cookie, đó là decision riêng và không phải baseline hiện tại

Ghi chú:

- backend session luôn là source of truth
- nếu phase sau bật Firebase phone auth, contract public nên là “đổi Firebase proof sang backend session”, không phải “client dùng thẳng Firebase session cho toàn hệ thống”

### Versioning

- breaking change mới được tạo version API mới
- thay đổi không phá client hiện tại phải ưu tiên giữ trong `v1`

## Cấu Trúc Response

### Single-resource success envelope

```json
{
  "data": {},
  "meta": {
    "requestId": "req_123"
  }
}
```

### List success envelope

```json
{
  "items": [],
  "meta": {
    "requestId": "req_123",
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 120
    }
  }
}
```

### Error envelope

```json
{
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Không tìm thấy đơn hàng",
    "details": {}
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

## Quy Ước Idempotency Và Concurrency

- `POST /api/v1/orders` phải hỗ trợ `Idempotency-Key`
- `POST /api/v1/orders/{orderId}/chat-messages` phải có `clientMessageId`
- driver accept order phải xử lý race condition
- admin review hồ sơ tài xế phải bảo đảm không tạo nhiều `driver profile` cho cùng account
- `Idempotency-Key` phải được persist server-side trong một persistence path riêng, không chỉ giữ ở memory

## Capability Model Trên API

`GET /api/v1/auth/me` phải trả capability rõ ràng, không trả một `role đơn` rồi để client tự suy luận.

Payload tối thiểu:

- account id
- display name
- `capabilities.user`
- `capabilities.driver`
- `capabilities.admin`
- trạng thái driver profile nếu có
- trạng thái driver application hiện tại nếu có

## Phạm Vi Contract Theo Phase

### `CV-ready MVP-1`

- auth
- quotes
- orders
- driver ops cơ bản
- admin order endpoints
- health endpoints
- realtime order + dispatch events cơ bản

### Giai đoạn sau

- order chat
- driver onboarding
- admin review driver application
- realtime room và event đầy đủ hơn

## Danh Mục Endpoint HTTP

## 1. Auth

| Endpoint | Operation | Mục đích |
| --- | --- | --- |
| `POST /api/v1/auth/dev-login` | `authDevLogin` | đăng nhập local/demo |
| `POST /api/v1/auth/firebase-test-login` | `authFirebaseTestLogin` | lựa chọn có điều kiện cho test auth |
| `POST /api/v1/auth/firebase-id-token-login` | `authFirebaseIdTokenLogin` | phase sau: đổi Firebase ID token sang backend session |
| `POST /api/v1/auth/refresh` | `authRefresh` | xoay access token |
| `POST /api/v1/auth/logout` | `authLogout` | revoke session hiện tại |
| `GET /api/v1/auth/me` | `authGetMe` | lấy capability và trạng thái hiện tại |

## 2. Quotes

| Endpoint | Operation | Mục đích |
| --- | --- | --- |
| `POST /api/v1/quotes` | `quotesCreate` | tạo báo giá từ pickup và dropoff |

Quote response tối thiểu phải có:

- `estimatedDistanceMeters`
- `estimatedPriceMinor`
- `pricingVersion`
- `expiresAt`

Ví dụ rút gọn:

```json
{
  "data": {
    "quoteId": "q_123",
    "estimatedDistanceMeters": 3200,
    "estimatedPriceMinor": 28000,
    "pricingVersion": "bike_v1",
    "expiresAt": "2026-03-25T08:05:00Z"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

## 3. Orders

| Endpoint | Operation | Mục đích |
| --- | --- | --- |
| `POST /api/v1/orders` | `ordersCreate` | tạo order từ quote |
| `GET /api/v1/orders` | `ordersList` | lấy danh sách order của account |
| `GET /api/v1/orders/{orderId}` | `ordersGetById` | lấy chi tiết order |
| `POST /api/v1/orders/{orderId}/cancel` | `ordersCancel` | hủy order khi còn hợp lệ |

Quy tắc:

- `POST /api/v1/orders` phải hỗ trợ `Idempotency-Key`
- create order phải đổi sang `SEARCHING_DRIVER`
- nếu dispatch cạn candidate, order phải đi về `NO_DRIVER_FOUND`
- order detail phải đủ dữ liệu để user và admin reconcile state

## 4. Driver Ops

| Endpoint | Operation | Mục đích |
| --- | --- | --- |
| `POST /api/v1/driver/orders/{orderId}/accept` | `driverOrdersAccept` | tài xế chấp nhận đơn đã được offer |
| `POST /api/v1/driver/orders/{orderId}/status` | `driverOrdersUpdateStatus` | cập nhật trạng thái thực thi |
| `POST /api/v1/driver/presence` | `driverPresenceUpdate` | cập nhật availability/vị trí |

Policy:

- chỉ account có driver profile active mới truy cập được
- driver bị `SUSPENDED` hoặc `DEACTIVATED` không được accept đơn
- không dùng endpoint `orders available` kiểu marketplace nếu dispatch đi theo offer-based flow

Presence payload tối thiểu nên có:

- `presenceStatus`
- `latitude`
- `longitude`
- `accuracyMeters`
- `headingDegrees` nếu có
- `speedMps` nếu có
- `capturedAt`

## 5. Admin Ops

| Endpoint | Operation | Mục đích |
| --- | --- | --- |
| `GET /api/v1/admin/orders` | `adminOrdersList` | lấy board orders |
| `GET /api/v1/admin/orders/{orderId}` | `adminOrdersGetById` | lấy order detail |

Giai đoạn sau có thể thêm:

- `GET /api/v1/admin/drivers`
- `GET /api/v1/admin/dispatch-attempts`
- `GET /api/v1/admin/driver-applications`
- `POST /api/v1/admin/driver-applications/{applicationId}/review`

## 6. Driver Onboarding

Các endpoint này thuộc `MVP-2`:

| Endpoint | Operation | Mục đích |
| --- | --- | --- |
| `GET /api/v1/driver-applications/me` | `driverApplicationsGetCurrent` | lấy trạng thái hồ sơ hiện tại |
| `POST /api/v1/driver-applications` | `driverApplicationsCreate` | nộp hồ sơ tài xế |
| `PATCH /api/v1/driver-applications/me` | `driverApplicationsUpdateCurrent` | cập nhật hồ sơ |
| `POST /api/v1/driver-applications/me/resubmit` | `driverApplicationsResubmit` | nộp lại hồ sơ sau khi sửa |

## 7. Order Chat

Các endpoint này thuộc phase chat:

| Endpoint | Operation | Mục đích |
| --- | --- | --- |
| `GET /api/v1/orders/{orderId}/chat-session` | `orderChatGetSession` | lấy metadata session chat |
| `GET /api/v1/orders/{orderId}/chat-messages` | `orderChatListMessages` | lấy danh sách tin nhắn |
| `POST /api/v1/orders/{orderId}/chat-messages` | `orderChatCreateMessage` | gửi tin nhắn |
| `POST /api/v1/orders/{orderId}/chat-read` | `orderChatMarkRead` | cập nhật trạng thái đã đọc |

Quy tắc:

- `clientMessageId` chống duplicate khi retry
- HTTP là đường ghi có kiểm soát; realtime là lớp tăng trải nghiệm

## 8. Health

| Endpoint | Operation | Mục đích |
| --- | --- | --- |
| `GET /api/v1/health/live` | `healthLive` | kiểm tra tiến trình còn sống |
| `GET /api/v1/health/ready` | `healthReady` | kiểm tra service sẵn sàng phục vụ |

## Error Codes Tối Thiểu

| Code | Ý nghĩa |
| --- | --- |
| `UNAUTHORIZED` | chưa xác thực hoặc token không hợp lệ |
| `FORBIDDEN` | không có capability phù hợp |
| `VALIDATION_ERROR` | dữ liệu gửi lên không hợp lệ |
| `ORDER_NOT_FOUND` | không tìm thấy order |
| `QUOTE_NOT_FOUND` | không tìm thấy quote |
| `QUOTE_EXPIRED` | quote đã hết hiệu lực |
| `NO_DRIVER_FOUND` | hệ thống không tìm thấy tài xế phù hợp |
| `DRIVER_APPLICATION_NOT_FOUND` | không tìm thấy hồ sơ tài xế |
| `DRIVER_APPLICATION_INVALID_STATE` | trạng thái hồ sơ không cho phép thao tác |
| `ORDER_ALREADY_ACCEPTED` | order đã bị tài xế khác nhận |
| `CHAT_DUPLICATE_MESSAGE` | `clientMessageId` bị trùng |
| `RATE_LIMITED` | vượt quá giới hạn tần suất |

## Naming Rule Cho DTO Và Operation

- request DTO dùng hậu tố `RequestDto`
- response DTO dùng hậu tố `ResponseDto`
- list response dùng `items` và `meta.pagination`
- operation id theo dạng `{resource}{Action}` và phải ổn định

## Mô Hình Room Realtime

- `account:{accountId}`
- `order:{orderId}`
- `chat:{orderId}`
- `admin:ops`

## Client Event Và Server Event

### Client emit

- `order.subscribe`
- `chat.send_message`
- `chat.mark_read`
- `driver.presence_update`

### Server emit

- `order.status_updated`
- `order.assigned`
- `dispatch.offer_received`
- `dispatch.accept_conflict`
- `dispatch.exhausted`
- `chat.message_received`
- `chat.system_message`
- `driver.application_reviewed`

## Realtime Payload Semantics

### `order.status_updated`

Payload tối thiểu:

- `orderId`
- `status`
- `changedAt`
- `changedBy`

### `dispatch.offer_received`

Payload tối thiểu:

- `orderId`
- `attemptId`
- `offerExpiresAt`
- `pickupSummary`
- `priceSummary`
- `serverNow`

### `dispatch.exhausted`

Payload tối thiểu:

- `orderId`
- `finalStatus`
- `attemptCount`

## Quy Ước Socket.IO

- token được gửi trong handshake auth
- event tạo side effect phải có ack
- reconnect có thể `recovered` hoặc không
- dù `recovered` hay không, client vẫn phải refetch critical state khi cần

### Background/mobile notes

- server không được giả định client mobile luôn online hoặc luôn gửi location đều
- presence và offer logic phải chịu được reconnect, app background và delayed updates

## Reconciliation Rules

- user order detail refetch sau reconnect
- driver active order refetch sau foreground/reconnect
- admin order detail và board refetch khi event quan trọng tới
- test realtime không được chỉ assert event, mà phải assert lại final HTTP state

## Kết Luận

API contract của dự án này phải phục vụ trước hết cho `MVP-1`: auth, quote, order, dispatch, admin order board và realtime order/dispatch cơ bản. Giá trị của docs này là làm rõ cả contract HTTP lẫn sync contract, để agent không phải tự suy luận cách client nên hội tụ về server truth.
