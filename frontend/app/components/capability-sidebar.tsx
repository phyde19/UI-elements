'use client'

import React, { useState } from 'react'
import { useCapability } from './capability-context'
import { 
  ChevronDown, 
  ChevronRight, 
  Plus,
  Pin,
  Star,
  History,
  Sparkles
} from 'lucide-react'

export function CapabilitySidebar() {
  const { 
    workspaces, 
    activeWorkspaceId, 
    setActiveWorkspaceId, 
    activePlugin,
    setActivePlugin,
    recentPlugins,
    pinnedPlugins
  } = useCapability()
  
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    pinned: true,
    recent: true,
    workspaces: true
  })
  
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<{[key: string]: boolean}>({
    [activeWorkspaceId]: true
  })
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }
  
  // Toggle workspace expansion
  const toggleWorkspace = (workspaceId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }
    
    setExpandedWorkspaces(prev => ({
      ...prev,
      [workspaceId]: !prev[workspaceId]
    }))
  }
  
  // Handle workspace selection
  const handleSelectWorkspace = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId)
    
    // Auto-expand the selected workspace
    if (!expandedWorkspaces[workspaceId]) {
      toggleWorkspace(workspaceId)
    }
  }
  
  // Get active workspace
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId)
  
  return (
    <aside className="w-72 h-full bg-[hsl(var(--sidebar-background))] text-foreground border-r border-border flex flex-col overflow-hidden">
      <div className="h-full flex flex-col overflow-hidden">
        {/* Top section with quick access to pinned plugins */}
        <div className="p-3">
          {/* Pinned plugins section */}
          <div className="mb-4">
            <div 
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => toggleSection('pinned')}
            >
              <div className="flex items-center gap-2">
                <Pin size={16} className="text-amber-400" />
                <span className="text-sm font-medium">Pinned</span>
                <span className="text-xs bg-muted/50 text-muted-foreground px-1.5 rounded-full">
                  {pinnedPlugins.length}
                </span>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-muted-foreground transition-transform ${expandedSections.pinned ? '' : '-rotate-90'}`} 
              />
            </div>
            
            {expandedSections.pinned && (
              <div className="space-y-1 pl-6">
                {pinnedPlugins.length > 0 ? (
                  pinnedPlugins.map(plugin => (
                    <div 
                      key={`pinned-${plugin.id}`}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer ${
                        activePlugin?.id === plugin.id ? 'bg-accent/10 text-accent' : 'hover:bg-background/70'
                      }`}
                      onClick={() => setActivePlugin(plugin)}
                    >
                      <plugin.icon size={14} />
                      <span className="truncate">{plugin.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground py-1.5 px-2">
                    No pinned plugins yet
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Recent plugins section */}
          <div className="mb-4">
            <div 
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => toggleSection('recent')}
            >
              <div className="flex items-center gap-2">
                <History size={16} className="text-blue-400" />
                <span className="text-sm font-medium">Recent</span>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-muted-foreground transition-transform ${expandedSections.recent ? '' : '-rotate-90'}`} 
              />
            </div>
            
            {expandedSections.recent && (
              <div className="space-y-1 pl-6">
                {recentPlugins.map(plugin => (
                  <div 
                    key={`recent-${plugin.id}`}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer ${
                      activePlugin?.id === plugin.id ? 'bg-accent/10 text-accent' : 'hover:bg-background/70'
                    }`}
                    onClick={() => setActivePlugin(plugin)}
                  >
                    <plugin.icon size={14} />
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="truncate">{plugin.name}</span>
                      {plugin.lastUsed && (
                        <span className="text-xs text-muted-foreground">{plugin.lastUsed}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Workspaces section - scrollable */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div 
            className="flex items-center justify-between mb-2 cursor-pointer"
            onClick={() => toggleSection('workspaces')}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Workspaces</span>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-muted-foreground transition-transform ${expandedSections.workspaces ? '' : '-rotate-90'}`} 
            />
          </div>
          
          {expandedSections.workspaces && (
            <div className="space-y-1">
              {workspaces.map(workspace => (
                <div key={workspace.id} className="mb-1">
                  <div 
                    className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer ${
                      activeWorkspaceId === workspace.id 
                        ? 'bg-accent/10 text-accent font-medium' 
                        : 'hover:bg-background/70'
                    }`}
                  >
                    <div 
                      className="flex items-center gap-2 flex-1"
                      onClick={() => handleSelectWorkspace(workspace.id)}
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${workspace.color || 'bg-accent/10'}`}>
                        <workspace.icon size={14} />
                      </div>
                      <span className="text-sm truncate">{workspace.name}</span>
                      {workspace.isNew && (
                        <span className="text-xs bg-blue-500/15 text-blue-500 px-1.5 rounded-full">New</span>
                      )}
                    </div>
                    <button 
                      onClick={(e) => toggleWorkspace(workspace.id, e)}
                      className={`p-1 rounded-sm hover:bg-background/70 transition-colors ${
                        expandedWorkspaces[workspace.id] ? 'rotate-90' : ''
                      }`}
                      aria-label={expandedWorkspaces[workspace.id] ? "Collapse" : "Expand"}
                    >
                      <ChevronRight size={14} className={`transition-transform`} />
                    </button>
                  </div>
                  
                  {/* Plugin list for this workspace */}
                  {expandedWorkspaces[workspace.id] && (
                    <div className="mt-1 pl-8 space-y-0.5">
                      {workspace.plugins.map(plugin => (
                        <div 
                          key={`${workspace.id}-${plugin.id}`}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm cursor-pointer ${
                            activePlugin?.id === plugin.id && activeWorkspaceId === workspace.id
                              ? 'bg-accent/5 text-accent' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                          }`}
                          onClick={() => setActivePlugin(plugin)}
                        >
                          <plugin.icon size={14} />
                          <span className="truncate">{plugin.name}</span>
                          {plugin.isNew && (
                            <span className="text-xs bg-blue-500/10 text-blue-500 px-1.5 rounded-full">New</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Bottom section with workspace discovery */}
        <div className="mt-auto p-3 border-t border-border/30">
          <button className="w-full flex items-center justify-between gap-2 py-2 px-3 rounded-md bg-accent/5 hover:bg-accent/10 text-accent transition-colors">
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Discover Workspaces</span>
            </div>
            <Plus size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}