'use client'

import { useState } from 'react'
import { ChevronRight, Puzzle } from 'lucide-react'
import { useWorkspaceContext } from '../../lib/workspace-context'

export function WorkspaceSelector() {
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set())
  const {
    workspaces,
    selectedWorkspaceId,
    selectWorkspace,
    pluginsByWorkspace,
    selectedPluginId,
    selectPlugin,
  } = useWorkspaceContext()
  
  const toggleWorkspacePlugins = (workspaceId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }
    setExpandedWorkspaces(prev => {
      const newSet = new Set(prev)
      if (newSet.has(workspaceId)) {
        newSet.delete(workspaceId)
      } else {
        newSet.add(workspaceId)
      }
      return newSet
    })
  }
  
  const isWorkspaceExpanded = (workspaceId: string) => expandedWorkspaces.has(workspaceId)

  const getPluginsForWorkspace = (workspaceId: string) =>
    pluginsByWorkspace[workspaceId] ?? []
  
  return (
    <div className="mb-2">
      <div className="mb-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground">
        Workspaces
      </div>
      
      <div className="space-y-0.5">
        {workspaces.map(workspace => (
          <div key={workspace.id} className="flex flex-col">
            {/* Workspace Item */}
            <div
              className={`flex items-center justify-between w-full px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
                selectedWorkspaceId === workspace.id
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'hover:bg-background/50'
              }`}
            >
              <div 
                className="flex items-center gap-2 flex-1"
                onClick={() => {
                  selectWorkspace(workspace.id)
                  if (!isWorkspaceExpanded(workspace.id)) {
                    toggleWorkspacePlugins(workspace.id)
                  }
                }}
              >
                {workspace.icon && <workspace.icon size={16} />}
                <span>{workspace.name}</span>
              </div>
              <button
                onClick={(e) => toggleWorkspacePlugins(workspace.id, e)}
                className={`p-0.5 rounded-sm hover:bg-background/70 transition-colors ${
                  isWorkspaceExpanded(workspace.id) ? 'rotate-90' : ''
                }`}
                aria-label={isWorkspaceExpanded(workspace.id) ? "Collapse" : "Expand"}
              >
                <ChevronRight size={14} className="transition-transform" />
              </button>
            </div>
            
            {/* Plugins List */}
            {isWorkspaceExpanded(workspace.id) && (
              <div className="ml-7 mt-0.5 space-y-0.5 mb-1">
                {getPluginsForWorkspace(workspace.id).map(plugin => (
                  <button
                    key={plugin.id}
                    onClick={() => {
                      selectWorkspace(workspace.id)
                      selectPlugin(plugin.id)
                    }}
                    className={`flex items-center w-full px-3 py-1.5 rounded-md text-sm transition-colors ${
                      selectedWorkspaceId === workspace.id && selectedPluginId === plugin.id
                        ? 'bg-accent/5 text-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Puzzle size={14} />
                      <span>{plugin.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
