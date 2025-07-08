'use client'

import { useState } from 'react'
import { RefinedHeader } from './refined-header'
import { SideNavigation } from './side-navigation'
import { useLayout } from './layout-context'

export function RefinedLayout() {
  const { isRightPanelOpen } = useLayout()
  
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar - full height */}
      <SideNavigation />
      
      {/* Content area with refined header */}
      <div className="flex-1 flex flex-col">
        <RefinedHeader />
        
        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div className="max-w-lg bg-muted/20 border border-border/30 rounded-lg p-6 text-center">
            <h2 className="text-xl font-medium mb-3">Refined Design</h2>
            <p className="text-muted-foreground mb-4">
              This layout uses the refined, more compact plugin selector with:
            </p>
            <div className="text-left text-sm space-y-2 mb-4">
              <div className="flex items-center gap-2 bg-accent/5 p-2 rounded">
                <div className="w-6 h-6 flex items-center justify-center bg-muted rounded">1</div>
                <span>Tabbed navigation for workspaces/plugins and thinking mode</span>
              </div>
              <div className="flex items-center gap-2 bg-accent/5 p-2 rounded">
                <div className="w-6 h-6 flex items-center justify-center bg-muted rounded">2</div>
                <span>Compact workspace list with plugin grid view</span>
              </div>
              <div className="flex items-center gap-2 bg-accent/5 p-2 rounded">
                <div className="w-6 h-6 flex items-center justify-center bg-muted rounded">3</div>
                <span>Search functionality for quick access</span>
              </div>
            </div>
            <p className="text-muted-foreground">
              Click the selector in the header to explore the interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}