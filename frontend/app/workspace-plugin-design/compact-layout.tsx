'use client'

import { useState } from 'react'
import { CompactHeader } from './compact-header'
import { SideNavigation } from './side-navigation'
import { useLayout } from './layout-context'

export function CompactLayout() {
  const { isRightPanelOpen } = useLayout()
  
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar - full height */}
      <SideNavigation />
      
      {/* Content area with compact header */}
      <div className="flex-1 flex flex-col">
        <CompactHeader />
        
        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div className="max-w-lg bg-muted/20 border border-border/30 rounded-lg p-6 text-center">
            <h2 className="text-xl font-medium mb-3">Compact Design</h2>
            <p className="text-muted-foreground mb-4">
              This layout uses a more compact plugin selector that:
            </p>
            <div className="text-left text-sm space-y-2 mb-4">
              <div className="flex items-center gap-2 bg-accent/5 p-2 rounded">
                <div className="w-6 h-6 flex items-center justify-center bg-muted rounded">1</div>
                <span>Preserves the 3-column layout with workspaces, plugins, and thinking modes</span>
              </div>
              <div className="flex items-center gap-2 bg-accent/5 p-2 rounded">
                <div className="w-6 h-6 flex items-center justify-center bg-muted rounded">2</div>
                <span>Uses a more compact design for workspaces and plugins</span>
              </div>
              <div className="flex items-center gap-2 bg-accent/5 p-2 rounded">
                <div className="w-6 h-6 flex items-center justify-center bg-muted rounded">3</div>
                <span>Keeps the thinking mode column exactly the same</span>
              </div>
              <div className="flex items-center gap-2 bg-accent/5 p-2 rounded">
                <div className="w-6 h-6 flex items-center justify-center bg-muted rounded">4</div>
                <span>Adds search functionality for faster plugin selection</span>
              </div>
            </div>
            <p className="text-muted-foreground">
              Click the selector in the header to explore the interface.
            </p>
            
            <div className="mt-6">
              <a 
                href="/workspace-plugin-design/enhanced" 
                className="inline-block px-4 py-2 bg-accent/80 text-white rounded-md hover:bg-accent/90 transition-colors"
              >
                View Enhanced Design
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}