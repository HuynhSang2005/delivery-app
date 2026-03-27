# Execution System Và AI Workflow

## Mục Tiêu

Tài liệu này mô tả cách foundation work được tổ chức để AI agent có thể dựng baseline của toàn project mà không trộn lẫn với feature work của từng app.

Hệ thống này tối ưu cho:
- monorepo Nx
- docs-driven execution
- iteration ít rủi ro
- verification rõ giữa current state và target state

## Nguyên Tắc Vận Hành

1. Foundation chỉ xử lý những thứ dùng chung cho nhiều app hoặc block mọi app.
2. Mỗi task phải tạo ra output quan sát được.
3. Mỗi task phải nêu rõ path nào được phép sửa.
4. Mỗi task phải mô tả rõ cách verify thành công.
5. App-specific concerns phải được đẩy về execution plan của app tương ứng.

## Các Lớp Thực Thi

Khi lên plan hoặc implement foundation, dùng cách chia lớp này:
- `workspace`
- `infra`
- `tooling`
- `contracts`
- `tests`
- `docs`

## Quy Tắc Viết Task Cho AI

### Task Tốt

- có đúng một outcome chính
- giải quyết một blocker dùng chung
- dependency rõ ràng
- validation rõ ràng

### Task Tệ

- vừa bootstrap workspace vừa implement auth module
- trộn Docker infra, Prisma schema, và admin UI vào cùng một task
- không nói rõ verify bằng current-state hay target-state

## Quy Tắc Escalation

Dừng implement và update docs trước nếu xảy ra một trong các trường hợp:
- docs gốc mâu thuẫn nhau về workspace, infra, hoặc stack
- task đòi thêm paid service mới vào baseline
- verification path hiện tại không còn khớp giữa AGENTS, runbook, và plan
- một app-specific plan đòi foundation responsibility mới chưa được mô tả

## Workflow Cho AI

1. Đọc goal của phase và metadata của task.
2. Đọc toàn bộ `Docs refs` đã liệt kê.
3. Nếu có dependency, đọc output của task upstream.
4. Claim issue trong Beads.
5. Implement trong đúng path scope đã chỉ ra.
6. Chạy verification và test đã liệt kê.
7. Update issue bằng evidence thực tế.
8. Close task hoặc tạo dependency task mới cho discovered work.

## Chính Sách Với Discovered Work

Tạo task mới trong Beads khi:
- phần việc thiếu đó là có thật và block nhiều app
- có thể mô tả nó thành output rõ ràng
- nó nên nằm trong foundation thay vì app-specific plan

Không được giấu discovered work trong:
- commit message
- TODO comment không có task
- note kiểu "để app đó xử lý sau" nếu thực ra nó là blocker chung

## Chính Sách Definition Of Done

Một foundation task chỉ được coi là done khi:
- docs, config, hoặc scaffold đã tồn tại trong đúng path được nêu
- docs liên quan vẫn còn đúng
- verification pass hoặc có ghi chú rõ đây là exception docs-only
- không có scope ẩn bị thêm vào
