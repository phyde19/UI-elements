'use client'

import { useState } from 'react'
import { EnhancedHeader } from './enhanced-header'
import { SideNavigation } from './side-navigation'
import { useLayout } from './layout-context'

export function EnhancedLayout() {
  const { isRightPanelOpen } = useLayout()
  
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar - full height */}
      <SideNavigation />
      
      {/* Content area with enhanced header */}
      <div className="flex-1 flex flex-col">
        <EnhancedHeader />
        
        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div className="max-w-lg bg-muted/20 border border-border/30 rounded-lg p-6 text-center">
            <h2 className="text-xl font-medium mb-3">Enhanced Design</h2>
            <p className="text-muted-foreground mb-4">
              This layout uses the enhanced header with a three-column selector for:
            </p>
            <div className="text-left text-sm space-y-2 mb-4">
              <div className="flex items-center gap-2 bg-accent/5 p-2 rounded">
                <div className="w-6 h-6 flex items-center justify-center bg-muted rounded">1</div>
                <span>Selecting a workspace</span>
              </div>
              <div className="flex items-center gap-2 bg-accent/5 p-2 rounded">
                <div className="w-6 h-6 flex items-center justify-center bg-muted rounded">2</div>
                <span>Choosing a plugin within that workspace</span>
              </div>
              <div className="flex items-center gap-2 bg-accent/5 p-2 rounded">
                <div className="w-6 h-6 flex items-center justify-center bg-muted rounded">3</div>
                <span>Setting the thinking vs. speed tradeoff</span>
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