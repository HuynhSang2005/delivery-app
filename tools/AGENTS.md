# AGENTS.md

## Vai Trò

File này áp dụng cho mọi generator, codegen helper, conformance script, và workspace tooling trong `tools/`.

`tools/` chỉ nên chứa tooling phục vụ repo. Nó không được trở thành nơi cất business logic của app.

## Source Of Truth

Đọc tối thiểu trước khi sửa:
- `docs/08-api-realtime-contracts.md`
- `docs/09-devops-runbook.md`
- `docs/12-folder-structure.md`
- `docs/14-tech-stack-catalog.md`
- `docs/plan/foudation/`

## Invariants

- tooling phải tôn trọng `bun` và target `Nx` workspace
- generated HTTP contract chỉ đi qua path dùng chung đã chốt, đặc biệt `packages/api-client`
- generated output không phải source of truth; docs và canonical contracts mới là nguồn đúng
- tooling phải deterministic và idempotent ở mức hợp lý
- không hardcode starter paths nếu chúng mâu thuẫn target architecture

## Verification

- luôn ghi rõ current-state hay target-state
- nếu tooling ảnh hưởng contract, verification baseline, hoặc package boundaries thì rà lại foundation plan và docs gốc tương ứng
- script hoặc generator mới phải có ownership rõ: phục vụ app nào, output ở đâu, và ai tiêu thụ

## Không Được Làm

- không giấu business rule vào tooling script
- không sinh artifact vào path chưa được docs hoặc plan chốt
- không tạo workflow `npm` hoặc lockfile trái với chuẩn `bun`
