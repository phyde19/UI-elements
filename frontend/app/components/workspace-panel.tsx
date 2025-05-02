'use client'

import React, { useState } from 'react'
import { useCapability } from './capability-context'
import { X, Search, PlusCircle, Info } from 'lucide-react'

interface WorkspacePanelProps {
  onClose?: () => void
}

export function WorkspacePanel({ onClose }: WorkspacePanelProps) {
  const { workspaces, activeWorkspaceId, setActiveWorkspaceId } = useCapability()
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter workspaces based on search
  const filteredWorkspaces = searchQuery.trim() === '' 
    ? workspaces 
    : workspaces.filter(workspace => 
        workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workspace.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workspace.plugins.some(plugin => 
          plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
  
  // Handle workspace selection
  const handleSelectWorkspace = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId)
    if (onClose) onClose()
  }
  
  return (
    <div className="h-full flex flex-col bg-background border-l border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-medium">Workspaces</h2>
      </div>
      
      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search workspaces and plugins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/30 py-2.5 pl-10 pr-3 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>
      
      {/* Workspace list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {filteredWorkspaces.map(workspace => (
            <div 
              key={workspace.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                activeWorkspaceId === workspace.id
                  ? 'border-accent/50 bg-accent/5'
                  : 'border-border hover:border-border/80 hover:bg-muted/10'
              }`}
              onClick={() => handleSelectWorkspace(workspace.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center ${workspace.color || 'bg-accent/10'}`}>
                  <workspace.icon size={20} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{workspace.name}</h3>
                    {workspace.isNew && (
                      <span className="text-xs bg-blue-500/15 text-blue-500 px-1.5 rounded-full">New</span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-0.5">{workspace.description}</p>
                  
                  {/* Plugin list preview */}
                  <div className="mt-4 space-y-1">
                    <div className="text-xs text-muted-foreground mb-1">Plugins ({workspace.plugins.length})</div>
                    <div className="flex flex-wrap gap-1.5">
                      {workspace.plugins.slice(0, 3).map(plugin => (
                        <div 
                          key={plugin.id}
                          className="flex items-center gap-1 text-xs bg-muted/30 py-1 px-2 rounded-full"
                        >
                          <plugin.icon size={10} />
                          <span>{plugin.name}</span>
                        </div>
                      ))}
                      {workspace.plugins.length > 3 && (
                        <div className="text-xs bg-muted/30 py-1 px-2 rounded-full">
                          +{workspace.plugins.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Workspace request card */}
          <div className="border border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-muted/10 transition-colors flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
              <PlusCircle size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-medium">Request New Workspace</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-3">Need access to more capabilities?</p>
            <button className="text-sm px-3 py-1.5 rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
              Request Access
            </button>
          </div>
        </div>
        
        {filteredWorkspaces.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Info size={32} className="mb-2" />
            <p className="mb-1">No workspaces found matching your search</p>
            <p className="text-sm">Try a different search term or browse all available workspaces</p>
          </div>
        )}
      </div>
    </div>
  )
}