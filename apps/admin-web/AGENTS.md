# AGENTS.md

## Vai Trò

File này là contract cho mọi công việc trong `apps/admin-web`.

Nếu file này mâu thuẫn với root `AGENTS.md`, ưu tiên file này cho phạm vi admin web. Nếu file này mâu thuẫn với docs gốc, ưu tiên docs gốc rồi cập nhật file này.

## Source Of Truth Cho Admin Web

Đọc tối thiểu trước khi sửa:
- `docs/06-admin-web-architecture.md`
- `docs/08-api-realtime-contracts.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/12-folder-structure.md`
- `docs/14-tech-stack-catalog.md`

Nếu task còn chạm app shell, workspace, contract generation path, hoặc repo verification baseline thì đọc thêm `docs/plan/foudation/`.

## Trạng Thái Hiện Tại

- `apps/admin-web` hiện có thể vẫn là Next starter scaffold
- package manager hiện tại là `bun`
- không được suy diễn feature scope hoặc data flow cuối cùng chỉ từ starter code

## Kiến Trúc Bắt Buộc

- admin web là công cụ vận hành nội bộ, không phải marketing dashboard
- dùng `Next.js App Router`
- HTTP gọi qua generated client là đường chính thức
- server state và cache không phải source of truth cuối cùng; realtime chỉ dùng để refresh hoặc invalidate nhanh
- admin capability phải được enforce ở backend lẫn UI guard
- không che dữ liệu backend còn thiếu bằng cách suy diễn business state ở frontend
- nếu deploy dưới subpath `/admin`, `basePath` phải được phản ánh ở build-time

## Verification

Current-state commands của app:
- `bun run lint`
- `bun run build`
- `bun run dev`

Quy tắc:
- ít nhất chạy `bun run lint` và `bun run build` cho thay đổi không tầm thường
- nếu thay đổi làm lệch data contracts hoặc auth assumptions, đối chiếu lại docs trước khi claim done
- luôn ghi rõ đang verify theo current-state hay target-state

## Không Được Làm

- không đặt business invariants cốt lõi ở admin web thay vì backend
- không để realtime event thành nguồn sự thật cuối cùng
- không thêm admin mutation mới như thể đã approved nếu docs gốc chưa chốt
- không copy logic từ backend sang frontend để “vá” dữ liệu thiếu
