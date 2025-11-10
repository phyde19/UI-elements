export type PluginBasics = {
  id: string
  name: string
  description: string
}

export type Workspace = {
  id: string
  name: string
  description: string
  plugins: PluginBasics[]
}

export type PluginDetailData = PluginBasics & {
  instructions?: string
  updatedAt?: string
  updatedBy?: string
}
