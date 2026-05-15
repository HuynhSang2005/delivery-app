---
name: postgis-skill
description: PostGIS guidance for delivery-app. Use for PostgreSQL/PostGIS delivery-location queries, spatial indexes, distance/radius filtering, KNN ordering, and geospatial migration review. Prefer official PostGIS docs for exact function semantics.
---

# PostGIS Skill

This skill is intentionally small. Do not vendor the PostGIS manual or generated
translation assets into `.agents/skills`.

## delivery-app Use Cases

- Radius search for dispatch candidates.
- Freshness plus distance ordering.
- KNN-style nearest-neighbor queries.
- Spatial indexes for delivery and driver location tables.
- Migration review for geospatial columns and constraints.

## Rules

- Keep canonical state in PostgreSQL, not Redis.
- Use geography/geometry deliberately; document the chosen SRID.
- Use spatial indexes for production-sized location queries.
- Verify distance semantics and units with official PostGIS docs.
- Avoid premature routing/ETA/geocoder complexity in MVP-1 foundation.

## Verification

- `bun run db:migrate`
- `bun run db:smoke`
- Query-plan inspection for performance-sensitive spatial queries.
