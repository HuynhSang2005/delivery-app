# Docs Plan Index

`docs/plan/` là execution planning layer của project.

Mục tiêu:
- biến source docs thành backlog/task có thể claim-verify-close
- giữ planning layer và execution tracking layer tách rõ
- giảm scope drift khi làm việc với AI-agent

## Reading Order

1. `docs/plan/AGENTS.md`
2. `docs/plan/ai-agent-workflow-playbook.md`
3. `docs/plan/governance/phase-task-standard.md`
4. `docs/plan/governance/execution-checklist.md`
5. `docs/plan/foudation/README.md`
6. `docs/plan/be/README.md`

## Folder Roles

- `docs/plan/foudation/`: setup nền dùng chung (workspace, infra contract, baseline verification)
- `docs/plan/be/`: backend execution sau foundation
- `docs/plan/governance/`: chuẩn hóa task sizing, metadata, close-evidence

## Hybrid Contract

- Spec-Kit: planning artifacts (`constitution/spec/plan/tasks`)
- Beads: issue lifecycle (`ready/claim/close` + evidence)

Rule bắt buộc:
- docs gốc (`docs/00..14`, ADR) là source of truth
- Beads không thay source docs
- task không có evidence thì không được close
