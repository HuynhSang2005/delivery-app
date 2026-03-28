# AGENTS.md

## Vai Trò

File này là contract cho mọi công việc trong `apps/mobile`.

File này chỉ được specialize root/domain contracts cho phạm vi mobile, không được override source docs hoặc repo invariants.

## Source Of Truth Cho Mobile

Đọc tối thiểu trước khi sửa:
- `docs/05-mobile-architecture-expo.md`
- `docs/08-api-realtime-contracts.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/12-folder-structure.md`
- `docs/14-tech-stack-catalog.md`

Nếu task còn chạm app shell, workspace, contract generation path, hoặc repo verification baseline thì đọc thêm `docs/plan/foudation/`.

## Trạng Thái Hiện Tại

- `apps/mobile` hiện có thể vẫn là Expo starter scaffold
- package manager hiện tại là `bun`
- không được suy diễn final architecture chỉ từ starter routes hoặc sample components

## Kiến Trúc Bắt Buộc

- đây là một app mobile duy nhất cho cả `user mode` và `driver mode`
- route baseline là `expo-router`
- generated client là đường gọi HTTP chính thức
- server state phải được reconcile lại qua HTTP sau reconnect hoặc foreground
- local UI state không được trở thành source of truth cho auth, order, dispatch, hoặc capability state
- order detail và auth/profile refetch là authoritative reconciliation points
- mobile không xem Firebase là auth source; backend session mới là canonical app session
- background behavior trong Expo có giới hạn platform; không được mô tả như always-on realtime tuyệt đối nếu docs chưa chốt

## Cannot Relax

- mobile dùng một app cho cả user mode và driver mode
- backend session là canonical auth source
- socket/realtime không thay thế HTTP reconciliation
- local state không được coi là authoritative cho order/auth/capability
- không mô tả khả năng background vượt quá giới hạn runtime thực tế

## Verification

Current-state commands của app:
- `bun run lint`
- `bun run start`
- `bun run android`
- `bun run ios`
- `bun run web`

Quy tắc:
- ít nhất chạy `bun run lint` cho thay đổi code
- chạy manual smoke phù hợp nếu thay đổi route, auth UX, order state, driver mode, hoặc realtime UX
- luôn ghi rõ đang verify theo current-state hay target-state

Nếu task chạm foundation assumptions (contract generation path, workspace baseline), phải xác nhận dependency đã thỏa trước khi close.

## Không Được Làm

- không xem Firebase session là final app session
- không dùng local store như authoritative server state cache
- không assume socket event đến là final truth
- không mô tả background execution như thể Expo Go hoặc runtime hiện tại hỗ trợ đầy đủ native behavior
