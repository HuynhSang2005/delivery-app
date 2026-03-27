# Tài Liệu Tham Khảo

Ngày xác minh: `2026-03-25`

## Nguồn Chính Thức

### Nx

- https://nx.dev/docs/getting-started/intro
- https://nx.dev/docs/concepts/mental-model
- https://nx.dev/docs/features/explore-graph
- https://nx.dev/docs/features/ci-features/affected
- https://nx.dev/docs/features/enforce-module-boundaries
- https://nx.dev/docs/concepts/inferred-tasks
- https://nx.dev/docs/technologies/node/nest/introduction
- https://nx.dev/docs/technologies/react/next/introduction
- https://nx.dev/docs/technologies/react/expo/introduction
- https://nx.dev/more-concepts/turbo-and-nx

### NestJS

- https://docs.nestjs.com/
- https://docs.nestjs.com/fundamentals/testing
- https://docs.nestjs.com/openapi/introduction
- https://docs.nestjs.com/techniques/queues
- https://docs.nestjs.com/recipes/terminus

### Prisma

- https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7
- https://www.prisma.io/docs/orm/reference/prisma-config-reference
- https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/introduction
- https://www.prisma.io/docs/guides/deployment/bun-workspaces
- https://www.prisma.io/docs/guides/frameworks/nestjs
- https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries
- https://www.prisma.io/docs/orm/prisma-schema/postgresql-extensions

### OpenAPI và API tooling

- https://spec.openapis.org/oas/v3.1.0
- https://heyapi.dev/openapi-ts/
- https://heyapi.dev/openapi-ts/get-started
- https://heyapi.dev/openapi-ts/configuration
- https://heyapi.dev/openapi-ts/migrating
- https://heyapi.dev/openapi-ts/clients/fetch

### Socket.IO

- https://socket.io/docs/v4/
- https://socket.io/docs/v4/emitting-events/
- https://socket.io/docs/v4/connection-state-recovery
- https://socket.io/docs/v4/client-api/
- https://socket.io/docs/v4/server-api/
- https://socket.io/docs/v4/troubleshooting-connection-issues/

### Next.js

- https://nextjs.org/docs/app/guides/testing
- https://nextjs.org/docs/app/guides/testing/jest
- https://nextjs.org/docs/pages/guides/testing/playwright
- https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath

### Expo / React Native

- https://docs.expo.dev/
- https://docs.expo.dev/develop/authentication/
- https://docs.expo.dev/guides/using-firebase/
- https://docs.expo.dev/develop/unit-testing/
- https://docs.expo.dev/router/reference/testing/
- https://docs.expo.dev/eas/workflows/examples/e2e-tests/
- https://docs.expo.dev/eas/workflows/introduction/
- https://docs.expo.dev/build-reference/limitations/
- https://docs.expo.dev/versions/latest/
- https://docs.expo.dev/versions/latest/sdk/location/
- https://docs.expo.dev/versions/latest/sdk/securestore/
- https://docs.expo.dev/versions/latest/sdk/task-manager/

### Mobile UI, state và test

- https://www.nativewind.dev/
- https://www.nativewind.dev/v5
- https://tanstack.com/query/
- https://zustand.docs.pmnd.rs/
- https://react-hook-form.com/
- https://callstack.github.io/react-native-testing-library/
- https://maestro.mobile.dev/platform-support/react-native
- https://docs.maestro.dev/extra-materials/troubleshooting/known-issues

### Web, infra và database

- https://playwright.dev/docs/best-practices
- https://playwright.dev/docs/ci
- https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md
- https://www.postgresql.org/docs/
- https://postgis.net/documentation/
- https://docs.docker.com/reference/compose-file/version-and-name/
- https://caddyserver.com/docs/running
- https://firebase.google.com/docs/auth
- https://firebase.google.com/docs/auth/web/phone-auth
- https://firebase.google.com/docs/auth/android/phone-auth
- https://firebase.google.com/docs/auth/ios/phone-auth
- https://expo.dev/pricing

### Delivery domain tham khảo

- https://developers.google.com/maps/documentation/mobility/fleet-engine/journeys/trips
- https://developers.google.com/maps/documentation/mobility/fleet-engine/journeys/tasks/update-stops
- https://developers.google.com/maps/documentation/mobility/fleet-engine/essentials/vehicles/on-demand-update-vehicle
- https://developers.google.com/maps/documentation/mobility/fleet-engine/essentials/vehicles/on-demand-search-vehicle
- https://developers.google.com/maps/documentation/routes/
- https://developers.google.com/maps/documentation/routes/traffic-model
- https://postgis.net/docs/using_postgis_query.html
- https://postgis.net/docs/geometry_distance_knn.html

### Documentation / Diagram

- https://mermaid.js.org/

## Ghi Chú

- tài liệu chính thức là nguồn ưu tiên
- một số quyết định kiến trúc trong docs là suy luận thiết kế từ nguồn chính thức, không phải trích dẫn nguyên văn
- tính đến ngày `2026-03-25`, NativeWind v5 vẫn đang được docs chính thức đánh dấu là `pre-release`
- Prisma v7 cần được đọc theo hướng config-first và driver-adapter-aware
- EAS có free tier nhưng là quota hữu hạn, không phải chi phí `0` vô hạn
- Socket.IO recovery là best-effort, không phải guarantee
