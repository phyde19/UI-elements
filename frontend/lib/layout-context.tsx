'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define the possible panel types
export type PanelType = 'document' | 'search-results' | 'workspaces' | null;

interface LayoutContextType {
  isRightPanelOpen: boolean
  currentPanel: PanelType
  panelProps: Record<string, any>
  openRightPanel: (panelType: PanelType, props?: Record<string, any>) => void
  closeRightPanel: () => void
  toggleRightPanel: (panelType?: PanelType, props?: Record<string, any>) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false)
  const [currentPanel, setCurrentPanel] = useState<PanelType>(null)
  const [panelProps, setPanelProps] = useState<Record<string, any>>({})

  const openRightPanel = (panelType: PanelType, props = {}) => {
    setCurrentPanel(panelType)
    setPanelProps(props)
    setIsRightPanelOpen(true)
  }

  const closeRightPanel = () => {
    setIsRightPanelOpen(false)
  }

  const toggleRightPanel = (panelType?: PanelType, props = {}) => {
    if (!isRightPanelOpen && panelType) {
      openRightPanel(panelType, props)
    } else if (isRightPanelOpen && panelType && panelType !== currentPanel) {
      // Switch panel type without closing
      setCurrentPanel(panelType)
      setPanelProps(props)
    } else {
      setIsRightPanelOpen(prev => !prev)
    }
  }

  return (
    <LayoutContext.Provider 
      value={{
        isRightPanelOpen,
        currentPanel,
        panelProps,
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
