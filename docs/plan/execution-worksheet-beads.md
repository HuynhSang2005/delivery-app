# Execution Worksheet (Beads Claim/Close)

Worksheet này là template vận hành cho dev + AI-agent khi làm việc với task trong `docs/plan`.

## References

- `docs/plan/AGENTS.md`
- `docs/plan/governance/phase-task-standard.md`
- `docs/plan/governance/execution-checklist.md`
- `docs/plan/foudation/README.md`
- `docs/plan/be/README.md`

## Quick Flow

1. `bd prime --json`
2. `bd ready --json`
3. `bd update <id> --claim --json`
4. thực thi theo metadata trong `mark-task`
5. close khi đủ close-evidence gate

## Claim Gate (Bắt Buộc)

- [ ] `mark-task` map 1:1 sang issue `type=task`
- [ ] issue có `mark_task_id`
- [ ] issue có `verification_mode`
- [ ] issue có `depends_on` khớp docs
- [ ] issue có `touched_paths_expected`
- [ ] issue có `docs_refs`
- [ ] issue có `definition_of_done`
- [ ] issue đã claim

## Close Gate (Bắt Buộc)

- [ ] `touched_paths_actual`
- [ ] `verification_commands` + kết quả
- [ ] test note (`n/a` hoặc danh sách checks)
- [ ] `drift_check`
- [ ] follow-up issue nếu có scope drift/discovered work
- [ ] issue đã close với reason rõ ràng

## Evidence Template

```md
- mark_task_id: <PHASE-TASK-ID>
- touched_paths_actual:
  - <path>
- verification_commands:
  - <command>
  - result: <pass|fail + note>
- tests: <n/a | test list>
- drift_check: <no drift | drift + follow-up id>
- handoff_note: <optional>
```

## Execution Notes

- Foundation phase: luôn chạy trước backend phase khi có dependency.
- Không close task nếu thiếu evidence theo verification mode.
- Không nhồi discovered work vào issue hiện tại; tách issue mới.
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P05-T02`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P05-T03`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-QG-P05-*` PASS

### BE-P06 Chat, Worker, Hardening

- [ ] `BE-P06-T01`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P06-T02`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P06-T03`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-P06-T04`
  - Issue id:
  - Verification mode:
  - Status note:
- [ ] `BE-QG-P06-*` PASS

### Backend Exit Criteria

- [ ] Tất cả task `BE-P00..P06` đã close hợp lệ
- [ ] Không còn blocker mở giữa các phase backend
- [ ] Mọi flow realtime quan trọng có reconciliation note với HTTP hoặc DB state
- [ ] Follow-up issues cho phần deferred đã được tạo

---

## Weekly KPI Snapshot (2-4 tuần)

Tuần:

- [ ] Task mapping integrity (1:1) cập nhật
- [ ] Evidence completeness cập nhật
- [ ] Reopen do drift cập nhật
- [ ] Blocker latency cập nhật

Ghi chú tuần:
