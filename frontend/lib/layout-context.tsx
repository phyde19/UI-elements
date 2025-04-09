'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LayoutContextType {
  isRightPanelOpen: boolean
  openRightPanel: () => void
  closeRightPanel: () => void
  toggleRightPanel: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false)

  const openRightPanel = () => setIsRightPanelOpen(true)
  const closeRightPanel = () => setIsRightPanelOpen(false)
  const toggleRightPanel = () => setIsRightPanelOpen(prev => !prev)

  return (
    <LayoutContext.Provider 
      value={{
        isRightPanelOpen,
        openRightPanel,
        closeRightPanel,
        toggleRightPanel
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}