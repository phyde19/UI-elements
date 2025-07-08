'use client'

import { useState } from 'react'
import { RefinedLayout } from '../refined-layout'
import { WorkspaceProvider } from '../workspace-context'
import { LayoutProvider } from '../layout-context'

export default function RefinedDesignPage() {
  return (
    <WorkspaceProvider>
      <LayoutProvider>
        <div className="h-screen bg-background text-foreground">
          <RefinedLayout />
        </div>
      </LayoutProvider>
    </WorkspaceProvider>
  )
}