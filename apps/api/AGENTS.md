# AGENTS.md

## Phạm Vi

File này áp dụng cho mọi công việc bên trong `apps/api`.

Dùng nó cùng với:
- `docs/04-backend-architecture.md`
- `docs/07-data-model.md`
- `docs/08-api-realtime-contracts.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/11-adrs.md`
- `docs/plan/be/*`

## Quy Tắc Kiến Trúc

Backend code nên bám theo các layer sau:
- `presentation`
- `application`
- `domain`
- `infrastructure`

Không nhét business logic vào controller, gateway, hoặc Prisma calls.

## Bounded Contexts

Các module backend chính:
- `auth`
- `drivers`
- `pricing`
- `orders`
- `dispatch`
- `realtime`
- `admin`
- `onboarding`
- `chat`
- shared infrastructure và shared kernel

Giữ boundary minh định. Việc gọi qua lại giữa các context nên đi qua application services hoặc shared abstractions rõ ràng, không import ad hoc.

## Auth Và Identity

- Backend-owned session là canonical.
- Firebase OTP-SMS, nếu có implement, chỉ là proofing input.
- Capability-based access là bắt buộc; không quay lại mô hình single-role đơn giản.
- `/auth/me` phải phản ánh đúng persisted backend session truth.

## Data Và Persistence

- Prisma là đường persistence mặc định.
- Các giả định về Prisma v7 driver-adapter phải luôn tương thích với docs hiện tại.
- Raw SQL chỉ chấp nhận khi có lý do rõ ràng cho geo queries, read models, hoặc đường performance-sensitive.
- Historical truth phải snapshot-safe cho pricing, orders, và audits.

## Dispatch Và Realtime

- Dispatch baseline là `radius + freshness + KNN`, không phải route-optimized shortest-path dispatch.
- Dispatch attempts và outcomes phải được persist; không giữ assignment logic quan trọng chỉ trong memory.
- Realtime chỉ hỗ trợ UX. HTTP reads và persisted state mới là authoritative.
- Giả định về background location phải khớp mobile policy đã chốt trong docs.

## Testing

Với backend task không tầm thường, cần cân nhắc:
- unit tests cho policy hoặc domain logic thuần
- integration tests cho persistence và transactions
- API tests cho contracts, auth, và permissions
- gateway tests cho realtime behavior
- spatial fixture tests cho geo candidate selection

Một task chưa thể coi là done nếu đã đổi behavior mà chưa cập nhật verification coverage hoặc chưa tạo tracked follow-up task.

## Execution System

Khi implement backend work:
1. đọc phase file tương ứng trong `docs/plan/be`
2. xác nhận dependencies đã thỏa
3. map sang Beads task tương ứng
4. giữ file edits trong đúng task scope
5. chạy verification đã liệt kê trước khi claim complete

## Guardrails

- Không tự mở rộng scope âm thầm.
- Không đưa giả định paid service vào baseline nếu docs chưa chốt.
- Không biến websocket events thành nguồn sự thật duy nhất.
- Không đổi lifecycle enums hoặc invariants nếu chưa update docs và tests.
