## Quick Fix – Plugin Detail Route

This folder contains copy/paste ready files so you can drop the refreshed plugin editor into the production repo without dragging over the rest of the mock playground.

### Files

```
quick-fix/
├── app/
│   ├── components/
│   │   └── plugin-detail-panel.tsx        # Reusable editor panel
│   └── plugins/
│       └── [workspaceId]/
│           └── [pluginId]/page.tsx        # Plugin detail route
├── lib/
│   └── plugin-metadata.ts                 # Instructions + updated-at stubs
└── types.ts                               # Workspace + plugin type helpers
```

### How to integrate

1. **Wire to your store**
   - The page reads workspace/plugin data from `useCompassStore((s) => s.workspaces)`. Update the import path if your store lives somewhere else.
   - `pluginMetadata` only seeds instructions/updated info. You can swap it for live API data whenever that is available.

2. **Swap shared chrome**
   - Replace the placeholder `SideNavigation` and `ThemeToggle` imports with the production components you use in `/plugins`.

3. **Keep editing local**
   - `PluginDetailPanel` fires `onUpdate` with field-level changes. In this quick-fix version updates are kept locally, but you can hook `handleUpdate` to a mutation endpoint or store setter without touching the panel.

Drop the files into your `app` directory (or equivalent), update the import paths, and the route will work immediately as long as the Compass store is providing the grouped workspace payload.
