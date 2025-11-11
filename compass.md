# Compass

## What is Compass. What are we prototyping?

We are going to iterate on a design for an AI chat application called Compass. It will eventually be implemented
likey as a fullstack typescript app using some mix of technologies like:

- tRPC
- Vite or Next.js (app router)
- zustand
- zod 
- drizzle
- and more...

> **Backend note:** The real Compass backend (in the prod repo) now runs entirely on FastAPI with Pydantic models; we no longer generate anything via Drizzle. Whenever this UI lab references backend behavior (e.g., `/plugins` endpoint, `WorkspaceResponse`, `PluginResponse`), it is describing that FastAPI code path.


The vision is to create a corporate "compass" that gives individual teams within an enterprize organization a powerful AI interface to their unique data and systems. 
Stated with less corporate jargon, this is an application that provides an AI chat
interface with agentic and workflow access to tool and resource connectors to a teams data, software, and systems. 

At a high level, we're planning to implement this with two data model primitives
1. Workspaces - Each team gets a workspace. Users may belong to multiple workspaces but this will be rare. Workspaces are like namespaces that defined the AI functionality available for a team.
2. Plugins - Plugins define specific mutually exclusive (one plugin at a time) AI features or chat contexts that are available in a particualar workspace. Plugins are grouped into plugin groups called "Workspaces". At the moment we have 2 primary workspaces (i.e. plugin groups)
(1) BlueCard / ITS - a software engineering team stakeholder
(2) Subrogation - a legal team stakeholder 


Every plugin will have a running chat interface that works exactly as you expect from precedant set by apps like ChatGPT, Anthropic Claude, etc. 

Crucially some plugins will also require a right hand side expandable panel for working with certain artifacts. This could contain everything from a document that the user can iterate on alongs side the AI (left hand main chat would have to collapse/narror) to some input fields that a plugin requires. 

-----------------------------------------------------

## So what are we going to work on?

I want us to relax any requirement to attempt a functionally robust working prototype. For this session, our goal is to reach into creative design mental spaces, and craft a compelling and modern UX visual interface. We are *designing in code*. 

To optimize this workflow, I think we should build in a framework that you know well. Something that will most naturally allow you to express your ideas. 
For this reason I suggest we use Next.js 14, typescript, tailwind. 

IMPORTANT: we won't need to be concerned with UI state solutions or tanstack query or anything. We are completely focused on frontend UI design. 

Note: See `workflow.md` for the current UI workflow, data contract, and migration/transplant guidelines. Read that first in future sessions.

## Backend contract reference (so the UI stays compatible)

The Delta table discussion in `production.md` is grounded in the actual backend models defined in `schemas.plugins` and the `/plugins` FastAPI router:

- `PluginResponse`  
  ```python
  class PluginResponse(BaseModel):
      id: str
      name: str
      description: str
  ```

- `WorkspaceResponse`  
  ```python
  class WorkspaceResponse(BaseModel):
      id: str
      name: str
      description: str
      plugins: list[PluginResponse]
  ```

- `/plugins` route (abridged)  
  ```python
  @router.get("/", response_model=list[WorkspaceResponse])
  async def get_all_plugins(...):
      user_workspaces = get_workspace_info(groups)
      return [info_to_response(w) for w in user_workspaces]
  ```

`info_to_response` strips out the `enabled` flag before serialising, so the UI always receives a list of workspaces where each workspace contains an array of `{id, name, description}` plugins. That is the only contract the frontend can rely on. Everything else (instructions, icons, isActive, updatedBy/updatedAt) is additional enrichment we do client-side.

### How we mirror that contract in this repo

To reduce friction when copying code into prod:

1. In `frontend/app/plugins/page.tsx` and `frontend/app/plugins/[workspaceId]/[pluginId]/page.tsx` we keep the workspace payload inline, matching exactly the shape produced by `WorkspaceResponse`.  
2. We enrich that payload locally with `instructions`, `updatedAt`, `updatedBy`, and icon components. Those fields are **not** part of the backend response; they are deterministic transforms on the client so we can display richer metadata.  
3. When you paste these files into prod, simply delete the inline payload and keep the enrichment step pointed at the real `/plugins` response (or move the enrichment into the Zustand provider—either way the UI code doesn’t change).

For clarity, the mock payload is declared as:

```ts
const WORKSPACE_PAYLOAD: WorkspacePayload[] = [
  {
    id: 'general',
    name: 'General',
    description: 'Common AI capabilities for general use',
    plugins: [
      { id: 'compass_assistant', name: 'Compass (GPT-4.1)', description: '...' },
      ...
    ],
  },
  ...
]
```

This mirrors the backend contract exactly and allows the UI to work with either mock data or live data with no structural changes.

## Why we only work on UI elements (and why they still align to backend data)

Compass UI work happens here for velocity—we experiment with layout, interactions, and state orchestration **without** waiting on backend releases. The guiding principle is:

- **Everything we build is mocked but contract-compatible.**  
  If the backend payload is `{workspaces: [{id, name, description, plugins: [...] }]}`, we mirror that structure 1:1, inject the mock data, and keep the same hook names (`useCompassStore`). That means the minute `/plugins` returns real data, you remove the mock payload and the UI still works.

- **Enrichment stays deterministic.**  
  Icons, status pills, `updatedAt`, and instructions are provided as pure transforms on top of the backend contract. No surprises if the backend adds fields later.

- **Files are self-contained.**  
  The production-aligned catalog (`app/plugins/page.tsx`) and editor (`app/plugins/[workspaceId]/[pluginId]/page.tsx`) require no other files when you paste them into prod—only wrapper imports (navigation/theme) change. This keeps the migration diff tiny.

- **State shape matches prod.**  
  We continue to import `useCompassStore((s) => s.workspaces)` exactly like prod. In this repo we seed that store with mocks; in prod it already points at the real Zustand provider.

In short: although this repo only deals with UI, every layout, component, and data transform is written against the same contract the backend enforces. Swapping mock data for `/plugins` is mechanical, not a rewrite.
