# Compass UI Prototype Routes

Welcome! This doc is here to spare you from spelunking the entire repo just to answer “where does this screen live?” or “why is this component everywhere?”. Think of it as the tour you would get from the teammate who has been living in the Compass playground for months.

All routes live under `frontend/app`. Unless called out, they inherit the providers registered in `frontend/app/layout.tsx`, which means dark mode, right-panel plumbing, and dummy workspace data are already wired up.

---

## Quick Route Map (read this first)

- `/` – Main chat workspace. If someone says “the primary Compass shell,” this is it.
- `/workspace-plugin-design` (+ variants) – Focused sandboxes for header and selector ideas.
- `/capability-selector` – Capability-first chat frame with its own sidebar cadence.
- `/plugins` – Plugin discovery catalog inside the familiar chrome.
- `/workspace-demo` – Dashboard + document editor mashup showing multi-pane interactions.
- `/intent-demo` – Intent detection overlays on the chat transcript.
- `/hybrid-demo` – Wild-card experiment mixing tree nav, palette, and chat.
- `/welcome` – Onboarding launcher that still reuses core chat bits.
- `/uat-landing` – Marketing/auth landing for testers; no chat here.
- `/demo-nav` – The index page you can share when walking stakeholders through experiments.

If you only remember one thing: `/` and `/plugins` share most structure, `/capability-selector` and `/workspace-demo` lean on the same right-panel plumbing, and the workspace-plugin-design suite is intentionally isolated so you can break things there without touching the main shell.

---

## Shared Mental Model

- **LayoutProvider (`frontend/lib/layout-context.tsx`)** controls whether the right-side panel is open and which “mode” it shows (`document`, `search-results`, `workspaces`). Any route that imports `RightPanel` is subscribing to this.
- **WorkspaceProvider (`frontend/lib/workspace-context.tsx`)** ships dummy workspaces, plugins, and chat lists. The big benefit: the plugin dropdown and workspace switchers all stay in sync in routes that rely on it.
- **ThemeProvider + ThemeToggle** are global; you don’t need to reimplement color-mode handling unless you fork a standalone page (like the UAT landing) on purpose.
- **Component reuse** lives in `frontend/app/components`. When something feels “app-wide,” it’s probably there. When it feels experimental, check the route folder first.

---

## Route Reference (deep dive)

### `/` – Main Chat Workspace
- **What you’re looking at**: This is the baseline Compass conversation interface with left nav, adaptive header, streaming transcript, and contextual right panel.
- **Open these files**: `frontend/app/page.tsx`; supporting pieces in `frontend/app/components/side-navigation.tsx`, `workspace-header.tsx`, `message-display.tsx`, `chat-input.tsx`, `right-panel.tsx`.
- **How it behaves**: Sending a message dispatches a fake streaming event and opens the `search-results` panel populated with citation mocks from `frontend/app/mocks`. Header buttons also flip the panel between “Document” and “Workspaces”.
- **Why it matters**: Any layout work meant for production should start here. It already exercises most of the shared primitives, so visual tweaks propagate across other routes.

### `/workspace-plugin-design` + `/enhanced`, `/refined`, `/compact`
- **Goal**: Rapidly iterate on workspace + plugin selection UX without breaking the primary shell.
- **Files to know**: `frontend/app/workspace-plugin-design/page.tsx` and sibling pages wire up local contexts defined in `layout-context.tsx` and `workspace-context.tsx` within the same folder. Layout/header variants live alongside: `*-layout.tsx`, `*-header.tsx`, `*-plugin-selector.tsx`.
- **Key nuance**: These routes reimplement context providers locally. That’s intentional; you can reshape APIs or break data contracts here while keeping `/` stable.
- **When to use**: Whenever you want to test density, navigation hierarchy, or affordances for workspace selection before merging ideas into the main shell.

### `/capability-selector`
- **Concept**: Capabilities (think tools or modes) drive the experience. The sidebar lists them, the header opens a workspace switcher modal, and the right panel shows context for whichever capability is active.
- **Entry points**: `frontend/app/capability-selector/page.tsx` delegates almost everything to `frontend/app/components/capability-interface.tsx`.
- **Supporting cast**: `capability-header.tsx`, `capability-sidebar.tsx`, `capability-chat-container.tsx`, `workspace-switcher-modal.tsx`, plus the shared `RightPanel`.
- **Ambiguity solved**: If you see code referencing `CapabilityProvider`, that state is scoped to this route; it’s not reused elsewhere.

### `/plugins`
- **The experience**: Same outer frame as `/`, but the main content column becomes a plugin catalog. The right panel is treated as future configuration space.
- **Files**: `frontend/app/plugins/page.tsx` plus shared pieces `components/side-navigation.tsx`, `plugin-selector-dropdown.tsx`, `plugin-selector.tsx`.
- **Reuse tips**: Because it leans on the same providers as `/`, adding a new plugin list item here will reflect in the dropdown elsewhere when the mock data is shared.

### `/workspace-demo`
- **What it demonstrates**: A dashboard-like layout with a collapsible left panel, document list, and an editor that can live either in the middle column or right panel.
- **Open**: `frontend/app/workspace-demo/page.tsx` and `frontend/app/components/workspace-demo.tsx`.
- **Important dependencies**: The UI sidebar primitives (`components/ui/sidebar.tsx`), `document-editor.tsx`, `workspace-switcher.tsx`, and the global `useLayout` hook for panel toggles.
- **Pro tip**: If you’re debugging right-panel width or animation issues, start here. It exercises the “panel pushes layout” code paths heavily.

### `/intent-demo`
- **Story**: Adds intent chips and suggested actions into the chat flow.
- **Files**: `frontend/app/intent-demo/page.tsx` ↔ `frontend/app/components/intent-based-interface.tsx`.
- **What might surprise you**: Intent badges and context cards use the same `Message` component underneath, so styling changes cascade back to `/` unless you scope them.

### `/hybrid-demo`
- **Pitch**: “What if Compass had a tree of knowledge assets, a palette for power users, and chat?” This route answers that question.
- **Files**: `frontend/app/hybrid-demo/page.tsx`, delegating to `frontend/app/components/hybrid-interface.tsx`.
- **Shared pieces**: Uses the global right panel just like `/`, so any panel type added here should be registered in `frontend/lib/layout-context.tsx`.

### `/welcome`
- **Purpose**: Provide a softer landing page that still demonstrates how the chat input, plugin dropdown, and panel toggles feel.
- **Files**: `frontend/app/welcome/page.tsx` plus shared `plugin-selector-dropdown.tsx`, `chat-input.tsx`, `theme-toggle.tsx`.
- **Getting oriented**: This route keeps most logic inline for readability. If you’re looking for a minimal reproduction of the chat input + panel toggle combo, start here.

### `/uat-landing`
- **Audience**: External testers. No chat mechanics—just branding, instructions, and an access-code form.
- **Files**: `frontend/app/uat-landing/page.tsx`.
- **Integration callout**: This page does not mount the global layout/workspace providers on purpose, so it’s safe to customize branding without dragging in chat scaffolding.

### `/demo-nav`
- **Use case**: Orientation page that links to everything above.
- **Files**: `frontend/app/demo-nav/page.tsx`. It’s intentionally simple: a `next/link` grid with Tailwind classes.
- **Tip**: When you add a new experiment, adding it here is the easiest way to keep teammates in the loop.

---

## Shared Building Blocks (what you’ll keep bumping into)

- **`frontend/lib/layout-context.tsx`** – Manages `isRightPanelOpen`, `currentPanel`, and any props those panels need. Extend the `PanelType` union here whenever you invent a new panel.
- **`frontend/lib/workspace-context.tsx`** – Mock workspaces, plugins, and chats. Since the data is hard-coded, update it when demo storytelling needs new names.
- **`frontend/app/components/right-panel.tsx`** – Renders the actual panel content. It expects props shaped by `layout-context`; keep the two in sync.
- **`frontend/app/components/side-navigation.tsx`** & **`components/ui/sidebar.tsx`** – Left-rail primitives for different experiences. The former is compact (used in `/`), the latter supports sectioned dashboards (`/workspace-demo`).
- **`frontend/app/components/plugin-selector-dropdown.tsx`** – Headline dropdown used across `/`, `/welcome`, `/plugins`; you’ll also see specialized copies in the workspace-plugin-design sandbox.
- **`frontend/app/components/theme-toggle.tsx`** – Tiny but vital. Every route that renders a header ends up importing it.
- **Chat primitives** – `chat-input.tsx`, `message-display.tsx`, `message.tsx`, `code-block.tsx`. Tread carefully when tweaking styles—multiple routes piggyback on them.

---

## Working With the Repo

- When building a new route, ask: “Do I need the real layout/workspace providers?” If you do, piggyback on `frontend/app/layout.tsx`. If you need isolation (breaking API contracts, experimenting with drastically different state), copy the pattern used in `workspace-plugin-design`.
- Need a new right-panel experience? Update `PanelType` in `frontend/lib/layout-context.tsx`, add rendering logic in `frontend/app/components/right-panel.tsx`, and then trigger it via `toggleRightPanel('your-type', props)`.
- Mock data lives either in `frontend/app/mocks` or directly alongside the component consuming it. Prefer colocating—future you will thank present you when hunting down placeholder content.
- Share this doc with anyone onboarding to the repo. It should answer the “where is X?” question quickly. If it doesn’t, add the missing note right here.

---

**Last updated**: 2025. Keep it fresh; add a short blurb whenever a new experiment appears or an existing one graduates to production.
