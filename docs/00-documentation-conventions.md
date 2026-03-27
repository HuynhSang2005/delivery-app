# 00. Quy Ước Tài Liệu

## Mục Đích

Thiết lập quy ước chung cho toàn bộ hệ tài liệu của dự án để bảo đảm:

- các file được viết theo cùng một chuẩn
- quyết định kỹ thuật được phân loại rõ
- người đọc biết đâu là baseline build ngay, đâu là phần cho phase sau

## Đối Tượng Đọc

Tài liệu này hướng tới:

- người phát triển chính của dự án
- người review kỹ thuật
- người đọc portfolio hoặc reviewer tuyển dụng cần xem cách ra quyết định

## Quy Ước Trạng Thái

Mỗi file nên có mục `Trạng Thái`.

Các giá trị nên dùng:

- `Baseline đã chốt cho MVP-1`: có thể dùng ngay để bắt đầu scaffold và build core flow
- `Đã chốt cho phase sau`: đã có quyết định, nhưng chưa phải baseline build đầu tiên
- `Cần xác minh thêm`: có hướng đi nhưng chưa đủ dữ kiện để chốt
- `Đã thay thế`: không còn là baseline hiện hành

## Quy Ước Phase

Khi một tính năng không thuộc `MVP-1`, file phải ghi rõ nó thuộc:

- `MVP-2`
- `MVP-3`

Không mô tả một tính năng phase sau theo giọng văn khiến người đọc hiểu nhầm rằng đó là prerequisite của day-one build.

## Quy Ước Mức Độ Quyết Định

Trong nội dung tài liệu, mọi lựa chọn nên được phân thành một trong ba nhóm sau:

### Baseline

Là lựa chọn đã chốt và được xem là chuẩn triển khai hiện tại.

Ví dụ:

- backend dùng NestJS modular monolith
- auth baseline là backend-owned session
- quote `MVP-1` dùng công thức giá đơn giản

### Lựa chọn có điều kiện

Là lựa chọn chỉ nên dùng nếu xuất hiện nhu cầu cụ thể hoặc sau khi POC thành công.

Ví dụ:

- bật Firebase test-number login sau khi POC auth ổn định
- thêm generated query hooks khi contract API đã ổn định

### Deferred

Là hạng mục chủ động để sau, không nên làm trong `MVP-1`.

Ví dụ:

- order chat
- worker riêng
- public hosted demo

## Cấu Trúc Khuyến Nghị Cho Mỗi File

Không phải file nào cũng cần giống hệt nhau, nhưng nên ưu tiên các phần sau khi phù hợp:

- `Mục Đích`
- `Trạng Thái`
- `Bối cảnh` hoặc `Phạm vi`
- `Quyết định được chọn`
- `Policy`, `Invariant` hoặc `Lifecycle` nếu file đụng business logic
- `Ví dụ payload`, `Ví dụ flow` hoặc `Ví dụ cấu trúc` nếu file sẽ được dùng làm baseline triển khai
- `Những gì để sau` hoặc `Theo phase`
- `Trade-off` hoặc `Rủi ro`
- `Kết Luận`

## Quy Ước Ngôn Ngữ

- ưu tiên tiếng Việt rõ ràng, nghiêm túc
- thuật ngữ tiếng Anh chuyên ngành được giữ lại khi cần, nhưng phải đặt trong ngữ cảnh giúp dev Việt đọc dễ
- không dùng giọng hội thoại trong nội dung docs
- không dùng icon trang trí

## Quy Ước Về Nguồn

- ưu tiên nguồn chính thức
- nếu một kết luận là suy luận kỹ thuật từ nguồn chính thức, cần thể hiện rõ đó là kết luận kiến trúc của dự án
- thông tin có tính biến động theo thời gian cần có mốc xác minh
- không đưa note theo session làm việc vào persistent docs

## Quy Ước Về Diagram

- diagram phải hỗ trợ giải thích, không phải để trang trí
- ưu tiên Mermaid để lưu được ngay trong repo
- mỗi diagram nên phục vụ một mục đích rõ ràng:
  - context
  - container
  - sequence
  - state
  - ERD

## Quy Ước Về Tính Nhất Quán

Khi thay đổi một quyết định kỹ thuật lớn, cần rà tối thiểu các file sau:

- `01-product-requirements.md`
- `02-solution-overview.md`
- `03-system-architecture.md`
- `04-backend-architecture.md`
- `05-mobile-architecture-expo.md`
- `06-admin-web-architecture.md`
- `07-data-model.md`
- `08-api-realtime-contracts.md`
- `09-devops-runbook.md`
- `11-adrs.md`
- `12-folder-structure.md`
- `13-infrastructure-self-hosting.md`
- `14-tech-stack-catalog.md`
- `references.md`

`Foundation Plan (path hiện tại: docs/plan/foudation/)` và `Backend Plan (path: docs/plan/be/)` chỉ được cập nhật sau khi baseline gốc ở các file trên đã ổn định.

## Quy Ước Cho Workspace Và Testing

- nếu một quyết định làm thay đổi cách vận hành monorepo, phải cập nhật `README`, `09`, `10`, `11`, `12`, `14`
- nếu một file định nghĩa feature hoặc flow, nên chỉ rõ `definition of done` hoặc quality criteria tối thiểu
- các target cấp workspace như `lint`, `typecheck`, `test`, `build`, `e2e`, `smoke` phải được gọi tên nhất quán giữa docs

## Kết Luận

Toàn bộ docs của dự án phải được xem là một hệ tài liệu thống nhất. Điều quan trọng nhất là phân biệt rõ:

- cái gì build ngay trong `MVP-1`
- cái gì đã chốt nhưng chỉ làm ở phase sau
- cái gì vẫn cần xác minh thêm
