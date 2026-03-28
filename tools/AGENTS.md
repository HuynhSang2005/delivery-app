# AGENTS.md

## Vai Trò

File này áp dụng cho mọi generator, codegen helper, conformance script, và workspace tooling trong `tools/`.

`tools/` chỉ nên chứa tooling phục vụ repo. Nó không được trở thành nơi cất business logic của app.

File này chỉ được specialize rules từ root AGENTS, không được override source docs hoặc repo invariants.

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

## Cannot Relax

- không được đưa business rule/domain policy vào generator script
- không được sinh artifact vào path chưa có ownership rõ trong `docs/12`
- không được tạo workflow `npm` hoặc lockfile trái chuẩn `bun`
- không được coi generated artifact là canonical truth khi conflict với docs

## Verification

- luôn ghi rõ current-state hay target-state
- nếu tooling ảnh hưởng contract, verification baseline, hoặc package boundaries thì rà lại foundation plan và docs gốc tương ứng
- script hoặc generator mới phải có ownership rõ: phục vụ app nào, output ở đâu, và ai tiêu thụ

Nếu tool output mâu thuẫn source docs, phải sửa docs-plan/tooling contract hoặc rollback tool output trước khi close.

## Không Được Làm

- không giấu business rule vào tooling script
- không sinh artifact vào path chưa được docs hoặc plan chốt
- không tạo workflow `npm` hoặc lockfile trái với chuẩn `bun`
