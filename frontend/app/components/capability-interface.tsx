'use client'

import React, { useState, useEffect } from 'react'
import { CapabilitySidebar } from './capability-sidebar'
import { CapabilityHeader } from './capability-header'
import { CapabilityChatContainer } from './capability-chat-container'
import { CapabilityProvider } from './capability-context'
import { WorkspaceSwitcherModal } from './workspace-switcher-modal'
import { WorkspacePanel } from './workspace-panel'
import { RightPanel } from './right-panel'
import { useLayout } from '../../lib/layout-context'

export function CapabilityInterface() {
  const [isWorkspaceSwitcherOpen, setIsWorkspaceSwitcherOpen] = useState(false)
  const { isRightPanelOpen } = useLayout()

  return (
    <CapabilityProvider>
      <div className="h-screen overflow-hidden flex flex-col">
        <CapabilityHeader onOpenWorkspaceSwitcher={() => setIsWorkspaceSwitcherOpen(true)} />
        
        <div className="flex-1 flex overflow-hidden">
          <CapabilitySidebar />
          
          <main className={`flex-1 flex flex-col ${isRightPanelOpen ? 'mr-[400px]' : ''}`}>
            <div className="flex-1 overflow-auto">
              <CapabilityChatContainer />
            </div>
          </main>
          
          {isRightPanelOpen && <RightPanel />}
        </div>
      </div>
      
      {/* Workspace switcher modal */}
      {isWorkspaceSwitcherOpen && (
        <WorkspaceSwitcherModal onClose={() => setIsWorkspaceSwitcherOpen(false)} />
      )}
    </CapabilityProvider>
  )
}