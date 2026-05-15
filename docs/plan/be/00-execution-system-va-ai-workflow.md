# Execution System Và AI Workflow

## Mục Tiêu

Tài liệu này mô tả cách backend work được tổ chức để AI agent có thể làm việc mà không làm mất ý đồ kiến trúc.

Hệ thống này tối ưu cho:
- monorepo Nx
- delivery theo chiều dọc, backend-first
- task scope rõ ràng
- iteration ít rủi ro
- verification chặt theo từng task

Tiền đề mặc định: Foundation Plan (path hiện tại: `docs/plan/foundation/`) đã hoàn tất các phase cần thiết để workspace root, local infra, app shells, và quality path dùng chung không còn là blocker cho backend.

## Nguyên Tắc Vận Hành

1. Task graph là nguồn sự thật cho thứ tự thực thi.
2. Mỗi task phải tự hiểu được nếu đọc độc lập.
3. Mỗi task phải tạo ra output quan sát được.
4. Mỗi task phải nêu rõ path nào được phép sửa.
5. Mỗi task phải mô tả rõ cách verify thành công.
6. Nếu blocker thuộc foundation layer, phải đẩy về Foundation Plan (path hiện tại: `docs/plan/foundation/`) thay vì âm thầm mở rộng backend phase.
7. Task có thể sinh thêm follow-up task, nhưng không được tự mở rộng scope âm thầm.

## Các Lớp Thực Thi

Khi lên plan hoặc implement backend, dùng cách chia lớp này:
- `presentation`
- `application`
- `domain`
- `infrastructure`
- `contracts`
- `tests`

## Quy Tắc Viết Task Cho AI

### Task Tốt

- có đúng một outcome chính
- tập trung vào một bounded context chính
- dependency rõ ràng
- validation rõ ràng

### Task Tệ

- trộn schema, API, admin UI và websocket vào cùng một task
- phụ thuộc vào quyết định kiến trúc chưa chốt
- không có acceptance test
- để kiểu "tới đó tính tiếp"

## Quy Tắc Escalation

Dừng implement và update docs trước nếu xảy ra một trong các trường hợp:
- các active docs mâu thuẫn nhau
- phase cần thêm enum hoặc state transition mới
- task làm lộ ra API contract còn thiếu
- business rule làm thay đổi lifecycle semantics
- task cần thêm dependency ngoài hoặc paid service mới

## Workflow Cho AI

1. Đọc goal của phase và metadata của task.
2. Đọc toàn bộ `Docs refs` đã liệt kê.
3. Nếu có dependency, đọc output của task upstream.
4. Claim issue trong Beads.
5. Implement trong đúng path scope đã chỉ ra.
6. Chạy verification và test đã liệt kê.
7. Update Beads issue bằng evidence thực tế.
8. Close task hoặc tạo dependency task mới cho discovered work.

## Chính Sách Với Discovered Work

Tạo task mới trong Beads khi:
- phần việc thiếu đó là có thật và không phải optional
- có thể mô tả nó thành output rõ ràng
- nó nên block hoặc follow sau một task hiện tại

Không được giấu discovered work trong:
- commit message
- TODO comment không có task
- note kiểu "để phase sau" nhưng không tạo issue

## Chính Sách Definition Of Done

Một backend task chỉ được coi là done khi:
- code và config đã tồn tại trong đúng path được nêu
- docs liên quan vẫn còn đúng
- verification pass hoặc có ghi chú rõ đây là exception docs-only
- test bắt buộc cho task đó đã có, hoặc đã tạo follow-up task rõ ràng để defer
- không có scope ẩn bị thêm vào

## Checklist Review Kiểu AI-Native

- Task còn giữ đúng nguyên tắc một output chính không?
- Path scope có bị vượt quá không?
- Implementation có khớp contract docs không?
- Failure path và unhappy path đã được cover chưa?
- Verification có thật sự chứng minh behavior chính không?
- Có follow-up task nào cần tạo thêm không?
