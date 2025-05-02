'use client'

import { useWorkspaceContext } from '../../lib/workspace-context'
import { Puzzle, Layers, Plus, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export function WorkspacesPanel() {
  const { 
    workspaces, 
    selectedWorkspaceId, 
    selectWorkspace, 
    plugins, 
    selectedPluginId, 
    selectPlugin 
  } = useWorkspaceContext()
  
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set([selectedWorkspaceId]))
  
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

  // Function to get plugins for a specific workspace
  const getPluginsForWorkspace = (workspaceId: string) => {
    // This is a simplified approach since we're using dummy data
    // In a real app, this would involve a proper data lookup
    const dummyPlugins: Record<string, any[]> = {
      'engineering': [
        { id: 'doc-qa', name: 'Document QA' },
        { id: 'contract-review', name: 'Contract Review' },
      ],
      'legal': [
        { id: 'legal-rag', name: 'Legal RAG' },
        { id: 'compliance-check', name: 'Compliance Check' },
      ],
      'data': [
        { id: 'db-query', name: 'Database Query' },
        { id: 'pipeline-builder', name: 'Pipeline Builder' },
      ],
      'marketing': [
        { id: 'content-analysis', name: 'Content Analysis' },
        { id: 'trend-spotting', name: 'Trend Spotting' },
      ],
    }
    
    return dummyPlugins[workspaceId] || []
  }
  
  return (
    <div className="h-screen border-l border-border p-4 w-80 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Workspaces</h2>
        <button className="p-1.5 rounded-md hover:bg-muted/30 text-muted-foreground hover:text-foreground">
          <Plus size={18} />
        </button>
      </div>
      
      <div className="space-y-2">
        {workspaces.map(workspace => (
          <div key={workspace.id} className="rounded-lg border border-border bg-card">
            {/* Workspace Header */}
            <div 
              className={`p-3 flex items-center justify-between cursor-pointer ${
                selectedWorkspaceId === workspace.id ? 'bg-accent/10 text-accent rounded-t-lg' : 'rounded-lg hover:bg-muted/20'
              }`}
              onClick={() => {
                selectWorkspace(workspace.id)
                if (!isWorkspaceExpanded(workspace.id)) {
                  toggleWorkspacePlugins(workspace.id)
                }
              }}
            >
              <div className="flex items-center gap-2">
                {workspace.icon && <workspace.icon size={18} />}
                <span className="font-medium">{workspace.name}</span>
              </div>
              <button
                onClick={(e) => toggleWorkspacePlugins(workspace.id, e)}
                className={`p-1 rounded-sm hover:bg-muted/30 transition-transform ${
                  isWorkspaceExpanded(workspace.id) ? 'rotate-90' : ''
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            {/* Plugins for this workspace */}
            {isWorkspaceExpanded(workspace.id) && (
              <div className="p-2 border-t border-border/40 bg-card/50">
                <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                  Available Plugins
                </div>
                <div className="space-y-1">
                  {getPluginsForWorkspace(workspace.id).map(plugin => (
                    <button
                      key={plugin.id}
                      onClick={() => {
                        selectWorkspace(workspace.id)
                        selectPlugin(plugin.id)
                      }}
                      className={`flex items-center gap-2 w-full p-2 rounded-md text-sm ${
                        selectedWorkspaceId === workspace.id && selectedPluginId === plugin.id
                          ? 'bg-accent/10 text-accent'
                          : 'hover:bg-muted/30'
                      }`}
                    >
                      <Puzzle size={16} />
                      <span>{plugin.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}