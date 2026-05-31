# Logistics Insights India

A supply chain and logistics intelligence platform for the Indian market.

## Run & Operate

- `pnpm install` — install all dependencies
- `pnpm dev:api` — run the API server (Port 5000)
- `pnpm dev:app` — run the React dashboard (Port 5173)
- `pnpm dev:sandbox` — run the mockup sandbox (Port 5174)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 22, TypeScript 5.9
- API: Express 5
- DB: SQLite (LibSQL) + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server`: The Express 5 backend.
- `artifacts/data-app`: The main React dashboard.
- `lib/db`: Drizzle ORM schema definitions (Source of truth for data).
- `lib/api-spec`: OpenAPI/Swagger definitions (Source of truth for API).
- `lib/api-zod`: Generated Zod schemas and API clients.

## Architecture decisions

- **Schema-First**: Changes must be made to `lib/db/src/schema` first, then pushed to the DB.
- **Contract-First**: API changes start in `lib/api-spec`, followed by `pnpm run codegen`.
- **SQLite for Local**: Using `libsql` locally to avoid the overhead of a local Postgres instance.

## Product

A logistics intelligence platform for tracking Indian supply chains, featuring real-time shipment monitoring and data-driven insights.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

*   **Blank Charts**: A fresh `local.db` is empty. Use Drizzle Studio (`npx drizzle-kit studio` inside `lib/db`) to add sample rows to the `shipments` and `infrastructure` tables.
*   **Undefined Data**: If the frontend shows `undefined`, run `pnpm --filter @workspace/api-spec run codegen`. This synchronizes the API contracts with the frontend types.
*   **Schema Changes**: After editing `lib/db/src/schema/index.ts`, you **must** run the `db run push` command to update the SQLite file.
*   **Windows Terminal**: If using PowerShell, ensure your `.env` is UTF-8 encoded, or Node 22's native loader may fail to read it.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
