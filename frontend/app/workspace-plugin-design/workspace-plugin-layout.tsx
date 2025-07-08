'use client'

import { useState } from 'react'
import { Header } from './header'
import { SideNavigation } from './side-navigation'

export function WorkspacePluginLayout() {
  const [selectedPlugin, setSelectedPlugin] = useState('basic')
  
  const handleSelectPlugin = (pluginId: string) => {
    setSelectedPlugin(pluginId)
  }
  
  const handleNewChat = (pluginId?: string | null) => {
    if (pluginId) {
      setSelectedPlugin(pluginId)
    }
    // Reset chat would happen here in a real implementation
  }
  
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar - full height */}
      <SideNavigation />
      
      {/* Content area with header */}
      <div className="flex-1 flex flex-col">
        <Header 
          selectedPlugin={selectedPlugin} 
          onSelectPlugin={handleSelectPlugin}
          onNewChat={handleNewChat}
        />
        
        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div className="max-w-lg bg-muted/20 border border-border/30 rounded-lg p-6 text-center">
            <h2 className="text-xl font-medium mb-3">Design Sandbox</h2>
            <p className="text-muted-foreground mb-4">
              This page focuses exclusively on the sidebar and header components.
              The main content area is intentionally blank to help us concentrate 
              on designing the workspace and plugin selection UI.
            </p>
            <div className="text-sm bg-accent/10 text-accent rounded p-3 mb-4">
              <p>Current plugin: <strong>{selectedPlugin || 'None selected'}</strong></p>
            </div>
            
            <div className="space-y-3">
              <a 
                href="/workspace-plugin-design/enhanced" 
                className="inline-block px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
              >
                View Enhanced Design
              </a>
              
              <div className="block">
                <a 
                  href="/workspace-plugin-design/refined" 
                  className="inline-block px-4 py-2 bg-accent/80 text-white rounded-md hover:bg-accent/90 transition-colors"
                >
                  View Refined Design
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}