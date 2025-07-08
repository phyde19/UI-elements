'use client'

import { useState } from 'react'
import { CompactLayout } from '../compact-layout'
import { WorkspaceProvider } from '../workspace-context'
import { LayoutProvider } from '../layout-context'

export default function CompactDesignPage() {
  return (
    <WorkspaceProvider>
      <LayoutProvider>
        <div className="h-screen bg-background text-foreground">
          <CompactLayout />
        </div>
      </LayoutProvider>
    </WorkspaceProvider>
  )
}