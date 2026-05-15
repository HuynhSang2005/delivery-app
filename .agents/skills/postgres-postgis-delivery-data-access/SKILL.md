---
name: postgres-postgis-delivery-data-access
description: PostgreSQL/PostGIS data access guidance for delivery-app delivery-domain queries. Use for location columns, radius search, freshness plus distance ordering, KNN indexes, Prisma raw SQL boundaries, and geospatial performance review.
---

# PostgreSQL/PostGIS Delivery Data Access

Use this skill for delivery-location persistence and query design.

## Rules

- PostgreSQL remains the source of truth.
- Redis may cache derived data but must be invalidatable.
- Keep SRID/unit decisions explicit.
- Use spatial indexes for radius/KNN queries.
- Prefer Prisma for normal data access; isolate raw SQL for spatial operations.
- Document any raw SQL assumptions.

## Dispatch Foundation

Baseline dispatch is radius + freshness + KNN. Do not introduce full routing,
ETA engines, or external geocoding into the foundation without source-doc
approval.

## Verification

- Migration applies cleanly.
- Query plans use intended indexes for realistic predicates.
- Integration tests cover representative location filters.
- `bun run db:smoke`
