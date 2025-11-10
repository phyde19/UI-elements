## Workflow Overview

This repo is a UI-first sandbox for Compass. We design and preview UX here, then transplant focused pieces into the production app (which has the backend and production React/TS code). The goals are:

- Iterate quickly on interaction and visual design with hard-coded or mocked data.
- Keep the mocked data contract aligned with the production backend to minimize rework.
- Provide transplant-ready bundles you can copy into prod with minimal path changes.

## Repo Roles

- `frontend/` – The active mock UI, wired for demos and iteration. Pages and components here are what you run locally.
- `migration/` – A transplant bundle (catalog + editor + shared pieces) shaped to match the prod backend response. Copy into prod when you want the full experience.
- `quick-fix/` – A minimal, drop-in editor route (`/plugins/[workspaceId]/[pluginId]`) that reads from the prod Zustand store API (`useCompassStore((s) => s.workspaces)`), for fast integration without touching the rest of the UI.
- `ui-changes.md`, `ui-examples/` – Design notes and scratch space during exploration.
- `frontend/hooks/store-context.tsx` + `frontend/store/` – Local Zustand store + provider that mirrors production. We seed it with the mocked payload so catalog/detail pages here share the same data contract and hook signatures as prod.

## Data Contract (aligned to prod)

Backend returns an array of workspaces grouped with plugins:

```ts
type PluginBasics = { id: string; name: string; description: string }
type Workspace = { id: string; name: string; description: string; plugins: PluginBasics[] }
```

The UI here also displays optional metadata when available:

```ts
type PluginMeta = { instructions?: string; updatedAt?: string; updatedBy?: string }
type PluginDetail = PluginBasics & PluginMeta
```

- In prod, `instructions/updatedAt/updatedBy` may come from a separate endpoint or extended API. The UI tolerates them being absent.
- In this repo, we enrich with a local map keyed by `"<workspaceId>:<pluginId>"` to preview full states.

## Icons

In prod, icons are mapped by stable IDs (not sent over the wire):

- `getWorkspaceIcon(workspaceId)` → returns a `LucideIcon`.
- `getPluginIcon(workspaceId, pluginId)` → returns a `LucideIcon`.

This repo mirrors that approach in the migration provider so UI and prod stay in sync. If desired, prod can switch to an `iconKey` string in the API and keep the map client-side.

## State Sources Used Here

- `frontend/` and `migration/` demonstrate a local provider (`workspace-context.tsx`) that hydrates from a backend-shaped payload and applies icon + metadata enrichment.
- `quick-fix/` reads the real prod contract via `useCompassStore((s) => s.workspaces)` (Zustand), so you can drop just the editor page into prod without changing your store.

## Routes and Responsibilities

- Catalog: `/plugins` – Workspace sections with filter pills, search, and responsive card grid.
- Detail/Editor: `/plugins/[workspaceId]/[pluginId]` – Single-plugin page with field-level editing affordances (name/description/instructions). Editing is local in this repo but the handler is isolated so you can wire it to a real mutation.

UI details preserved here:

- Filter pills: single-row horizontal scroll with a subtle right-edge gradient to hint overflow (scrollbars hidden).
- Cards: consistent padding/typography; active icon tile with accent tint; uniform metadata area; grid uses `md:grid-cols-2` and `xl:grid-cols-3` defaults.
- Kept the “New chat” primary button style from the broader app while removing duplicate contextual “Chat” buttons where requested.

## Transplant Paths

Option A – Full bundle (catalog + editor):
- Copy from `migration/` into prod.
- Swap chrome imports (navigation, theme toggle) to your app shell.
- Replace the local payload with the real API response; keep icon/metadata enrichment helpers.

Option B – Quick editor route only:
- Copy `quick-fix/app/plugins/[workspaceId]/[pluginId]/page.tsx` and `quick-fix/app/components/plugin-detail-panel.tsx`.
- Ensure `useCompassStore((s) => s.workspaces)` resolves in prod and that workspaces/plugins match the contract above.
- Use `quick-fix/lib/plugin-metadata.ts` temporarily for instructions/updated labels if the backend/meta isn’t ready.

## Checklist When Moving to Prod

- Data: `workspaces[]` use the prod payload; verify IDs match icon mapping and routes.
- Icons: ensure `workspaceIcons`/`pluginIcons` are present or replace with an `iconKey` pattern.
- Metadata: if not in API yet, keep UI fallbacks; wire mutations later to persist edits.
- Chrome: update imports to the app’s layout components.
- QA: verify catalog renders, filters/scroll affordance looks clean, details page edits and timestamps display correctly.

## Files to Know

- Catalog page: `migration/app/plugins/page.tsx`, `frontend/app/plugins/page.tsx`
- Detail page: `migration/app/plugins/[workspaceId]/[pluginId]/page.tsx`, `frontend/app/plugins/[workspaceId]/[pluginId]/page.tsx`
- Editor panel: `migration/app/components/plugin-detail-panel.tsx`, `frontend/app/components/plugin-detail-panel.tsx`, `quick-fix/app/components/plugin-detail-panel.tsx`
- Provider (mock): `migration/lib/workspace-context.tsx`, `frontend/lib/workspace-context.tsx`
- Quick-fix route: `quick-fix/app/plugins/[workspaceId]/[pluginId]/page.tsx`
