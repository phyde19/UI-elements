# Compass Plugin Studio Migration Pack

This directory contains copy‑paste ready files for transplanting the Plugin Studio UI (catalog + editor + selector) into the Compass production app. All data is driven from a single hard-coded object so you can wire the UI before backend APIs are available.

## Included Files

```
migration/
├── README.md                      # This guide
├── app/
│   ├── components/
│   │   ├── plugin-detail-panel.tsx
│   │   └── plugin-selector-dropdown.tsx
│   └── plugins/
│       ├── page.tsx
│       └── [workspaceId]/
│           └── [pluginId]/page.tsx
└── lib/
    └── workspace-context.tsx      # Provider + hard-coded workspace/plugin data
```

## How To Transplant

1. **Copy the provider**
   - Drop `lib/workspace-context.tsx` into your prod repo (e.g., `src/lib/plugin-studio-context.tsx`).
   - Wrap the catalog and detail routes with `WorkspaceProvider`.

2. **Copy the pages/components**
   - `app/plugins/page.tsx` → catalog route (`/plugins`).
   - `app/plugins/[workspaceId]/[pluginId]/page.tsx` → editor route.
   - `app/components/plugin-detail-panel.tsx` and `plugin-selector-dropdown.tsx` → reuse or merge with existing components.

3. **Hook up shared data**
   - The provider exports `workspaces`, `pluginsByWorkspace`, `updatePluginConfig`, etc. No backend calls required.

4. **Reconnect app-specific chrome**
   - Replace imports marked “Replace these imports…” with your real navigation, theme toggle, etc.

5. **Run through your lint/build**
   - Update paths/aliases as needed.
   - Ensure Lucide icons are available (`lucide-react`).

## Notes

- The provider currently sets `isAdmin: true` so inline editing is enabled. Plug your auth logic in `WorkspaceProvider`.
- To swap in live data later, load your API response and feed it into the same structure used by `INITIAL_PLUGIN_CONFIG`.
- The catalog grid uses responsive breakpoints (`md:grid-cols-2`, `xl:grid-cols-3`). Adjust to match prod design tokens if necessary.
