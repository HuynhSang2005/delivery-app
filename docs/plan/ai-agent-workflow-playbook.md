# Playbook Làm Việc Với AI-Agent

Playbook này dành cho dev khi phối hợp với AI-agent trong `delivery-app`.

## 1) Trước Khi Giao Việc

Checklist:
- xác định scope: docs-only, planning, hay implementation
- xác định folder ownership: docs, docs/plan, infra, tools, apps
- xác định verification mode: `docs-only`, `current-state`, `target-state`, `runtime`
- xác định output mong muốn ở mức file/task (không mơ hồ)

Prompt nên có:
- mục tiêu business
- phạm vi in-scope/out-of-scope
- tiêu chí done
- ràng buộc docs cần bám

## 2) Trong Lúc AI-Agent Làm Việc

Yêu cầu agent:
- đọc source docs trước khi sửa
- tạo hoặc claim issue Beads trước khi sửa lớn
- chia task nhỏ theo nguyên tắc `1 task = 1 output verify được`
- cập nhật blocker sớm, không ôm việc lớn trong 1 issue

Nên review theo checkpoint:
- checkpoint 1: model/workflow đề xuất
- checkpoint 2: file map + impact map
- checkpoint 3: patch + verification evidence

## 3) Claim/Close Protocol (Beads)

1. `bd prime --json`
2. `bd ready --json`
3. `bd update <id> --claim --json`
4. thực thi theo scope issue
5. `bd close <id> --reason "Completed" --json` khi đủ evidence

Close gate bắt buộc:
- có touched paths actual
- có verification commands + kết quả
- có test note (`n/a` nếu docs-only)
- có drift check, nếu lệch thì tạo follow-up issue

## 4) Spec-Kit Protocol

Dùng Spec-Kit khi cần trả lời:
- cần build cái gì
- acceptance criteria nào
- task decomposition như thế nào

Dùng Beads khi cần trả lời:
- đang làm đến đâu
- blocked bởi gì
- close đủ điều kiện chưa

Không overlap:
- không dùng Beads để thay source docs
- không bỏ qua update docs khi đổi scope/acceptance

## 5) Rule Chống Mơ Hồ

Không giao task mơ hồ:
- "hoàn thiện auth"
- "tối ưu toàn bộ dispatch"

Nên giao task có output rõ:
- "chốt metadata template cho mark-task trong docs/plan"
- "thêm close-evidence checklist cho workflow backend"

## 6) Rule Chống Crash VS Code

- ưu tiên search có scope hẹp, không dump recursive toàn repo
- chia query thành lô nhỏ
- giới hạn output
- nếu thấy dấu hiệu encoding lỗi, dừng lại và khôi phục scope bị ảnh hưởng trước khi sửa tiếp

## 7) Kết Thúc Session

Checklist:
- verify lại file đã sửa
- close issue đã đủ evidence
- tổng kết thay đổi + rủi ro còn lại
- nếu cần, `bd dolt push`

Dev handoff note nên có:
- đã làm gì
- chưa làm gì
- blocker/follow-up
- lệnh verify chính
