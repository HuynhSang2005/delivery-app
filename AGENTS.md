# AGENTS.md

## Phạm Vi Project

Repository này là monorepo Nx cho một delivery product gồm:
- `apps/api`: backend NestJS
- `apps/admin-web`: admin dashboard dùng Next.js
- `apps/mobile`: mobile app dùng Expo

Nguồn planning chính nằm trong `docs/`.

Nguyên tắc áp dụng: `AGENTS.md` nào gần nhất thì ưu tiên file đó. Rule riêng cho backend nằm ở `apps/api/AGENTS.md`.

## Source Of Truth

Trước khi code, phải đọc các docs liên quan trong `docs/`.

Baseline tối thiểu:
- `docs/README.md`
- `docs/01-product-requirements.md`
- `docs/04-backend-architecture.md`
- `docs/08-api-realtime-contracts.md`
- `docs/10-testing-roadmap-risk.md`
- `docs/11-adrs.md`
- `docs/12-folder-structure.md`

Nguồn thực thi riêng cho backend:
- `docs/plan/be/README.md`
- phase file backend đang active

## Quy Tắc Monorepo

- Dùng terminology và target naming nhất quán theo Nx.
- Khi có thể, ưu tiên command theo project hoặc `affected` thay vì chạy cả repo.
- Giữ scope thay đổi nhỏ nhất có thể.
- Không đưa giả định của Turborepo vào repo này.

## Planning Và Execution

- Công việc nên bắt đầu từ task đã map rõ, không bắt đầu từ yêu cầu mơ hồ.
- Với backend work, dùng `docs/plan/be` làm execution system.
- Tôn trọng dependency và phase order.
- Một task phải tạo ra một output rõ và test được.
- Nếu implement làm lộ ra mismatch trong docs, sửa docs trước khi mở rộng code scope.

## Workflow Với Beads

Dùng Beads để track công việc bền vững khi làm theo execution system.

Flow khuyến nghị:
1. xem ready work
2. claim đúng một task
3. chỉ implement task đó
4. ghi evidence
5. close task hoặc tạo follow-up dependency

Không giấu discovered work trong TODO rời rạc nếu nó nên là task thật.

## Quality Bar

- Không claim complete nếu chưa có verification evidence.
- Có thay đổi behavior thì phải cập nhật test tương ứng.
- Giữ contract nhất quán giữa API, data model, và architecture docs.
- Realtime chỉ hỗ trợ UX; persisted backend state vẫn là nguồn sự thật cuối cùng.

## Quy Tắc Chỉnh Sửa

- Giữ docs và implementation luôn khớp nhau.
- Không âm thầm đổi business invariants.
- Ưu tiên patch nhỏ thay vì rewrite rộng, trừ khi task nói rõ phải rewrite.
- Không revert các thay đổi không liên quan của user.

## Hướng Dẫn Theo Subproject

- Nếu làm backend, phải đọc thêm `apps/api/AGENTS.md`.
- Nếu có `AGENTS.md` sâu hơn trong một subproject, file sâu hơn sẽ thắng.
