'use client'

import { useState } from 'react'
import { EnhancedLayout } from '../enhanced-layout'
import { WorkspaceProvider } from '../workspace-context'
import { LayoutProvider } from '../layout-context'

export default function EnhancedDesignPage() {
  return (
    <WorkspaceProvider>
      <LayoutProvider>
        <div className="h-screen bg-background text-foreground">
          <EnhancedLayout />
        </div>
      </LayoutProvider>
    </WorkspaceProvider>
  )
}