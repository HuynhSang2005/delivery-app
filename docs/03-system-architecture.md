# 03. Kiến Trúc Hệ Thống

## Mục Đích

Mô tả cách các ứng dụng, data stores và lớp realtime phối hợp ở cấp độ toàn hệ thống, đồng thời làm rõ boundary giữa workspace architecture và runtime architecture.

## Trạng Thái

Baseline đã chốt cho `CV-ready MVP-1`, có mô tả rõ đường nâng cấp ở `MVP-3`.

## Hai Lớp Kiến Trúc Cần Phân Biệt

### 1. Workspace architecture

- repo là monorepo `Nx`
- `apps/*` là deployable runtimes
- `packages/*` là reusable code

### 2. Runtime architecture

- user, driver, admin đi qua mobile/web clients
- backend NestJS là trung tâm nghiệp vụ
- PostgreSQL là source of truth
- Redis hỗ trợ transient runtime và queue khi cần

## Ngữ Cảnh Hệ Thống

```mermaid
flowchart LR
    User["Người dùng"]
    Driver["Tài xế"]
    Admin["Quản trị vận hành"]

    User --> Mobile["Mobile App"]
    Driver --> Mobile
    Admin --> AdminWeb["Admin Web App"]

    Mobile --> Api["NestJS API + Socket.IO"]
    AdminWeb --> Api

    Api --> Pg["PostgreSQL + PostGIS"]
    Api --> Redis["Redis"]
    Api -. optional async extraction .-> Worker["Worker"]
    Worker --> Pg
    Worker --> Redis
```

## Hai Mức Runtime Theo Phase

### `CV-ready MVP-1`

```mermaid
flowchart TB
    Mobile["mobile"] --> Api["api"]
    Admin["admin-web"] --> Api
    Api --> Pg["postgres + postgis"]
    Api -. optional transient runtime .-> Redis["redis"]
```

Đặc điểm:

- dispatch chạy trong API
- realtime đi thẳng từ API tới clients
- worker chưa bắt buộc
- local-first là baseline

### `MVP-3 / public demo`

```mermaid
flowchart TB
    Caddy["Caddy"]
    Admin["admin-web"]
    Api["api"]
    Worker["worker"]
    Pg["postgres + postgis"]
    Redis["redis"]

    Caddy --> Admin
    Caddy --> Api
    Api --> Pg
    Api --> Redis
    Worker --> Pg
    Worker --> Redis
```

Đặc điểm:

- dispatch retry, delayed work hoặc notifications có thể đi qua queue
- worker tách process để boundary runtime rõ hơn
- phù hợp khi cần public demo hoặc hardening

## Các Thành Phần Chạy Chính

### Mobile app

- một app cho cả `user mode` và `driver mode`
- user tạo quote, order, theo dõi đơn
- driver nhận offer, accept và cập nhật trạng thái

### Admin web

- quan sát order board
- điều tra order detail
- review driver applications ở phase sau

### API

- REST API
- auth/session
- OpenAPI
- realtime qua Socket.IO
- orchestration của quote, orders, dispatch, driver ops, onboarding, chat

### Worker

- không bắt buộc ở `MVP-1`
- dùng cho retry, delayed jobs, notifications, dispatch extraction

### PostgreSQL + PostGIS

- nguồn dữ liệu nghiệp vụ chính
- lưu state hiện tại, timeline và geospatial data cần thiết

### Redis

- không phải dependency bắt buộc của mọi biến thể `MVP-1`
- nếu dùng ở `MVP-1`, chỉ dùng cho transient runtime support có lý do rõ
- queue support khi worker được bật

## Luồng Nghiệp Vụ Chính

### Luồng giao hàng cốt lõi

- quote -> order -> dispatch -> assignment -> pickup -> delivery

### Luồng driver onboarding

- submit application -> admin review -> approve/reject -> refresh capability

### Luồng realtime

- order status updated
- dispatch offer received
- accept conflict
- admin board refresh
- chat message nếu feature được bật

## Sequence: Order Create Và Dispatch `MVP-1`

```mermaid
sequenceDiagram
    participant U as User Mobile
    participant A as API
    participant DB as PostgreSQL
    participant D as Driver Mobile

    U->>A: create order
    A->>DB: save order + history
    A->>DB: load candidate drivers
    A-->>U: order in SEARCHING_DRIVER
    A-->>D: dispatch.offer_received
    D->>A: accept order
    A->>DB: create assignment + update order
    A-->>U: order.assigned / order.status_updated
```

## Sequence: Reconnect Và Reconciliation

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Socket Gateway
    participant A as HTTP API

    C-xS: temporary disconnect
    C->>S: reconnect
    alt recovered
        S-->>C: missed packets + recovery state
    else unrecovered
        S-->>C: connected without recovery
    end
    C->>A: refetch critical HTTP state
    A-->>C: current server truth
```

## Trust Boundaries Và Source Of Truth

### Source of truth

- order state: PostgreSQL
- capability state: PostgreSQL
- pricing version: PostgreSQL
- session state: backend + PostgreSQL

### Non-authoritative layers

- Socket.IO events
- client stores
- UI local state
- Redis transient state

## Cross-Cutting Constraints

- backend vẫn là một codebase NestJS duy nhất ở giai đoạn đầu
- mobile chỉ là một app với capability-based flows
- realtime không được thay thế API contract
- worker không được coi là prerequisite của `MVP-1`
- admin không được ôm business logic mà backend phải chịu trách nhiệm

## Những Gì Chưa Làm Ở Phase Đầu

- microservices
- event sourcing
- managed pub/sub riêng
- dedicated chat service
- multi-region runtime

## Kết Luận

Kiến trúc hệ thống phù hợp cho giai đoạn hiện tại là một delivery platform gọn nhưng nghiêm túc: monorepo `Nx`, backend monolith rõ module, một mobile app đa mode, một admin app cho ops, và một runtime ưu tiên local-first nhưng chừa chỗ rõ ràng cho hardening phase sau.
