# Beads Solo VS Code Checklist

Muc tieu: van hanh Beads an toan cho solo dev dung VS Code + Copilot + Codex extension, tranh mat du lieu khi xoa local project.

## 1) One-time Setup (da chot cho repo nay)

- Confirm branch chinh dang dung:
  - `git switch main`
- Khoi tao Beads local runtime (neu clone moi):
  - `bd init --skip-agents --skip-hooks -p delivery-app`
- Cai hooks:
  - `bd hooks install`
- Bat warning filter de doctor gon va action-oriented:
  - `bd config set doctor.suppress.dolt-status true`
  - `bd config set doctor.suppress.dolt-locks true`
- Tao backup snapshot branch ngoai code branch:
  - `bd backup export-git --branch beads-backup --remote origin`

## 2) Start-of-Session Policy

- Kiem tra suc khoe:
  - `bd doctor`
- Nap workflow context:
  - `bd prime`
- Neu la may moi hoac local vua bi reset, khoi phuc backup:
  - `bd backup fetch-git --branch beads-backup --remote origin`
- Lay issue san sang:
  - `bd ready --json`

## 3) In-Session Policy (AI-Agent)

- Claim atomically:
  - `bd update <id> --claim --json`
- Tao issue moi khi phat hien viec phat sinh:
  - `bd create "<title>" --description "<context>" -t bug -p 1 --deps discovered-from:<parent-id> --json`
- Chi close issue khi co evidence verification mode:
  - docs-only, current-state, target-state, runtime

## 4) End-of-Session Policy

- Dong issue da xong:
  - `bd close <id> --reason "Completed" --json`
- Dong bo code:
  - `git pull --rebase origin main`
  - `git push origin main`
- Dong bo Beads snapshot de tranh mat du lieu local:
  - `bd backup export-git --branch beads-backup --remote origin`
- Kiem tra lai:
  - `bd doctor`

## 5) Recovery Drill (xoa local project, clone lai)

- Clone code repo nhu binh thuong.
- Re-init Beads local runtime:
  - `bd init --skip-agents --skip-hooks -p delivery-app`
  - `bd hooks install`
- Fetch va restore Beads snapshot:
  - `bd backup fetch-git --branch beads-backup --remote origin`
- Verify:
  - `bd doctor`
  - `bd list --status=open --json`

## 6) Luu y quan trong

- `beads-backup` la backup branch cho du lieu Beads, khong dung cho code review.
- Khong commit `.beads/` vao code branches.
- Neu can cloud backup theo Dolt-native (`bd backup init <path>` + `bd backup sync`) ma gap loi "no store available", tiep tuc dung `backup export-git/fetch-git` la baseline on dinh cho environment hien tai.
