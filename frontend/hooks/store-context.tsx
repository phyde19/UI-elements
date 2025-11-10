'use client'

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { createCompassStore, type CompassStore } from '@/store/store'
import type { CombinedSlices } from '@/store/types'
import { MOCK_WORKSPACES } from '@/lib/workspace-data'

const CompassCtx = createContext<CompassStore | null>(null)

export function CompassStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<CompassStore>()

  if (!storeRef.current) {
    storeRef.current = createCompassStore()
  }

  useEffect(() => {
    const store = storeRef.current
    if (!store) return
    const initPluginMenu = store.getState().initPluginMenu
    initPluginMenu(MOCK_WORKSPACES)
  }, [])

  return <CompassCtx.Provider value={storeRef.current}>{children}</CompassCtx.Provider>
}

export function useCompassStore<T>(selector: (state: CombinedSlices) => T): T {
  const store = useContext(CompassCtx)
  if (!store) {
    throw new Error('useCompassStore must be used within CompassStoreProvider')
  }
  return store(selector)
}
