import { create } from 'zustand'
import type { CombinedSlices } from './types'
import { createPluginSlice } from './pluginSlice'

export const createCompassStore = () => {
  return create<CombinedSlices>()((set, get, api) => ({
    ...createPluginSlice(set, get, api),
  }))
}

export type CompassStore = ReturnType<typeof createCompassStore>
