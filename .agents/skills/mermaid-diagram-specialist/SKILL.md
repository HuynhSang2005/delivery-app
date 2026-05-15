---
name: mermaid-diagram-specialist
description: Create and review Mermaid diagrams for delivery-app docs. Use for architecture, dependency, sequence, state, ERD, and workflow diagrams that need to stay readable and aligned with source docs.
---

# Mermaid Diagram Specialist

Use Mermaid only when a diagram makes relationships clearer than prose.

## Rules

- Keep diagrams small enough to review in Markdown.
- Quote node labels when they contain punctuation.
- Prefer flowcharts for architecture/workflows, sequence diagrams for request
  flows, state diagrams for lifecycles, and ERDs for data modeling.
- Do not encode unapproved architecture in diagrams.
- Update nearby prose when a diagram changes an interpretation.

## delivery-app Context

- MVP sequence: `MVP-1 -> MVP-2 -> MVP-3`.
- HTTP/API is authoritative; realtime events are assistive.
- Local-first infra is the baseline.
- Worker separation is later-phase unless docs approve it.

## Verification

- Render mentally for syntax sanity.
- If possible, run a Mermaid renderer for docs-heavy changes.
- Check links and labels against source docs.
