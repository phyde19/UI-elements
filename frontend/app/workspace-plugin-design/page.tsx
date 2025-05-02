'use client'

import { useState } from 'react'
import { WorkspacePluginLayout } from './workspace-plugin-layout'
import { WorkspaceProvider } from './workspace-context'
import { LayoutProvider } from './layout-context'

export default function WorkspacePluginDesignPage() {
  return (
    <WorkspaceProvider>
      <LayoutProvider>
        <div className="h-screen bg-background text-foreground">
          <WorkspacePluginLayout />
        </div>
      </LayoutProvider>
    </WorkspaceProvider>
  )
}