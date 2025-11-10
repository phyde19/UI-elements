import type { StateCreator } from 'zustand'
import type { CombinedSlices, PluginSlice, Workspace } from './types'

export const createPluginSlice: StateCreator<
  CombinedSlices,
  [],
  [],
  PluginSlice
> = (set) => ({
  workspaces: [],
  activeWorkspaceId: null,
  activePluginId: null,
  initPluginMenu: (workspaces: Workspace[]) => {
    const firstWorkspace = workspaces.length > 0 ? workspaces[0] : null
    const firstPlugin =
      firstWorkspace && firstWorkspace.plugins.length > 0
        ? firstWorkspace.plugins[0]
        : null

    set({
      workspaces,
      activeWorkspaceId: firstWorkspace ? firstWorkspace.id : null,
      activePluginId: firstPlugin ? firstPlugin.id : null,
    })
  },
  selectPlugin: (workspaceId: string, pluginId: string) => {
    set({
      activeWorkspaceId: workspaceId,
      activePluginId: pluginId,
    })
  },
})
