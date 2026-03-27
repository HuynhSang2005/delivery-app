# Phase 06: Chat, Worker Extraction, Hardening

<!-- mark-phase: BE-P06 -->

## Mục Tiêu

Thêm order chat, tách những phần async phù hợp sang worker boundary, và hoàn thiện backend hardening cùng smoke coverage.

## Phụ Thuộc

- `BE-P03-T06`
- `BE-P04-T03`
- `BE-P05-T03`
- `BE-P00-T05`

## Ngoài Phạm Vi

- nền tảng route optimization trả phí
- marketplace optimization đầy đủ vượt ngoài scope hiện tại

## Điều Kiện Đạt Phase

Backend hỗ trợ chat, có thể offload các async jobs minh định một cách an toàn, và có mức smoke coverage đủ tốt để demo portfolio.

<!-- mark-task: BE-P06-T01 -->
## BE-P06-T01 Chốt order chat schema và access policy

- Type: `schema`
- Verification mode: `runtime`
- Depends on: `BE-P03-T05`, `BE-P00-T03`
- Outputs: chat room và message schema, participant policy, và baseline cho unread hoặc read-model
- Touched paths: `apps/api/prisma/**`, `docs/plan/be/phase-06-chat-worker-hardening.md`
- Docs refs: `docs/01-product-requirements.md`, `docs/07-data-model.md`, `docs/08-api-realtime-contracts.md`
- Verification: chat access model đã nêu rõ membership/auth constraints theo order context và không bypass auth rules
- Tests: lên plan cho schema và access-case fixtures
- Beads: `type=task`, `labels=be,phase:p06,chat,schema`
- Definition of done: chat implementation phase sau có thể bám vào schema/access model hiện tại mà không mở lại auth hoặc order semantics cốt lõi

<!-- mark-task: BE-P06-T02 -->
## BE-P06-T02 Implement order chat APIs và realtime messaging baseline

- Type: `realtime`
- Verification mode: `runtime`
- Depends on: `BE-P06-T01`, `BE-P03-T06`
- Outputs: message send và list APIs, websocket event flow, và HTTP reconciliation baseline cho chat
- Touched paths: `apps/api/src/modules/chat/**`, `apps/api/src/modules/orders/**`
- Docs refs: `docs/08-api-realtime-contracts.md`
- Verification: chat API/realtime contract đã mô tả rõ participant validity và HTTP recovery path cho missed messages
- Tests: API và gateway tests cho access control, send, list, và reconnect cases
- Beads: `type=task`, `labels=be,phase:p06,chat,realtime`
- Definition of done: chat flows giữ nguyên nguyên tắc HTTP-authoritative realtime và không tạo state divergence với server truth

<!-- mark-task: BE-P06-T03 -->
## BE-P06-T03 Tách các async jobs minh định sang worker boundary

- Type: `ops`
- Verification mode: `runtime`
- Depends on: `BE-P03-T04`, `BE-P04-T03`
- Outputs: quyết định job nào rời request path, queue contract, và worker ownership boundary
- Touched paths: `apps/api/src/modules/**`, `docs/plan/be/phase-06-chat-worker-hardening.md`
- Docs refs: `docs/03-system-architecture.md`, `docs/04-backend-architecture.md`, `docs/11-adrs.md`
- Verification: worker extraction plan đã chỉ rõ handoff boundaries và yêu cầu giữ behavior tương thích với synchronous baseline
- Tests: integration hoặc contract tests cho request-to-job handoff nếu implement
- Beads: `type=task`, `labels=be,phase:p06,worker,ops`
- Definition of done: danh sách job được tách, lý do tách, và tiêu chí tương thích hành vi đã được mô tả đủ cho phase thực thi

<!-- mark-task: BE-P06-T04 -->
## BE-P06-T04 Bổ sung backend smoke runbook và production-readiness checklist

- Type: `test`
- Verification mode: `target-state`
- Depends on: `BE-P06-T02`, `BE-P06-T03`
- Outputs: smoke route set, flow seed-to-happy-path để verify, và ops checklist cho demo portfolio
- Touched paths: `docs/plan/be/03-testing-quality-gates.md`, `apps/api/AGENTS.md`
- Docs refs: `docs/09-devops-runbook.md`, `docs/10-testing-roadmap-risk.md`
- Verification: smoke checklist đã map tối thiểu health, migrations, auth, quote, order, dispatch, admin reads theo `04-smoke-contract.md`
- Tests: smoke checklist và định nghĩa minimal automated smoke target
- Beads: `type=task`, `labels=be,phase:p06,testing,ops`
- Definition of done: backend có smoke contract rõ để demo/re-verify nhanh theo cùng critical-path checklist sau mỗi đợt thay đổi

## Mini Checklist Pass/Fail (Pass 3)

Quy ước đo lường: mỗi dòng là điều kiện pass/fail nhị phân; nếu có số lượng thì ưu tiên ngưỡng dạng >= N.

### BE-P06-T01

- [ ] Pass khi Chat schema ràng buộc participant membership theo order context.
- [ ] Pass khi Access policy không bypass auth/capability model hiện có.
- [ ] Pass khi Có baseline cho read-model hoặc unread semantics.

### BE-P06-T02

- [ ] Pass khi Chat APIs có access control rõ cho send/list operations.
- [ ] Pass khi Realtime messaging được mô tả theo nguyên tắc HTTP-authoritative.
- [ ] Pass khi Có reconciliation path cho missed messages sau reconnect.

### BE-P06-T03

- [ ] Pass khi Danh sách async jobs được tách có tiêu chí chọn rõ ràng.
- [ ] Pass khi Queue/handoff contract nêu rõ ownership boundary giữa request path và worker.
- [ ] Pass khi Có yêu cầu giữ tương thích hành vi với synchronous baseline.

### BE-P06-T04

- [ ] Pass khi Smoke checklist map tối thiểu health, migrations, auth, quote, order, dispatch, admin reads.
- [ ] Pass khi Có tiêu chí pass/fail rõ cho smoke runbook.
- [ ] Pass khi Có định nghĩa minimal automated smoke target cho vòng verify lặp lại.
