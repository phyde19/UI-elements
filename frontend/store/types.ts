export type PluginInput =
  | {
      id: string
      label: string
      type: 'text' | 'number' | 'date'
      placeholder?: string
      helper?: string
      required?: boolean
      defaultValue?: string
    }
  | {
      id: string
      label: string
      type: 'select'
      options: { value: string; label: string }[]
      placeholder?: string
      helper?: string
      required?: boolean
      defaultValue?: string
    }
  | {
      id: string
      label: string
      type: 'textarea'
      placeholder?: string
      helper?: string
      required?: boolean
      defaultValue?: string
    }
  | {
      id: string
      label: string
      type: 'toggle'
      helper?: string
      defaultValue?: boolean
    }

export type Plugin = {
  id: string
  name: string
  description: string
  inputs?: PluginInput[]
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
