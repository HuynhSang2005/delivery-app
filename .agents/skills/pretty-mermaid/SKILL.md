---
name: pretty-mermaid
description: Render or polish Mermaid diagrams for delivery-app docs. Use when a Mermaid diagram needs formatting, SVG/ASCII rendering, or syntax validation beyond plain Markdown editing.
---

# Pretty Mermaid

Use this skill only when diagram rendering or formatting matters. For ordinary
diagram authoring, prefer `mermaid-diagram-specialist`.

## Workflow

1. Keep the source Mermaid in the owning documentation file.
2. Render only the diagram being changed.
3. Prefer readable labels over decorative styling.
4. Do not add generated assets unless the docs actually need them.
5. Verify rendered output before claiming it is valid.

## Repo Rules

- Diagrams must reflect source docs and ADRs.
- Do not use diagrams to introduce new architecture.
- Keep generated files out of the repo unless explicitly required.
