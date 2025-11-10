export type Plugin = {
  id: string
  name: string
  description: string
}

export type Workspace = {
  id: string
  name: string
  description: string
  plugins: Plugin[]
}

export interface PluginSlice {
  workspaces: Workspace[]
  activeWorkspaceId: string | null
  activePluginId: string | null
  initPluginMenu: (workspaces: Workspace[]) => void
  selectPlugin: (workspaceId: string, pluginId: string) => void
}

export type CombinedSlices = PluginSlice
