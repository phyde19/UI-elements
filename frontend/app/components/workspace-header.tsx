'use client'

import { ChevronDown, Puzzle } from 'lucide-react'
import { useWorkspaceContext } from '../../lib/workspace-context'
import { useState, useRef, useEffect } from 'react'

export function WorkspaceHeader() {
  const { 
    workspaces, 
    selectedWorkspaceId, 
    selectWorkspace, 
    plugins, 
    selectedPluginId, 
    selectPlugin 
  } = useWorkspaceContext()
  
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Get current workspace and plugin
  const currentWorkspace = workspaces.find(w => w.id === selectedWorkspaceId) || workspaces[0]
  const currentPlugin = plugins.find(p => p.id === selectedPluginId)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center gap-2 py-1.5 px-3 rounded-md hover:bg-muted/30 transition-colors"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="flex items-center gap-1.5">
          {currentWorkspace?.icon && <currentWorkspace.icon size={18} />}
          <span className="font-medium">{currentWorkspace?.name}</span>
        </div>
        
        {currentPlugin && (
          <>
            <span className="text-muted-foreground">/</span>
            <div className="flex items-center gap-1.5">
              <Puzzle size={16} />
              <span>{currentPlugin.name}</span>
            </div>
          </>
        )}
        
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown for workspace and plugin selection */}
      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-md shadow-lg z-50">
          <div className="py-1">
            <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Workspaces
            </div>
            
            {workspaces.map(workspace => (
              <button
                key={workspace.id}
                onClick={() => {
                  selectWorkspace(workspace.id)
                  setDropdownOpen(false)
                }}
                className={`flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-muted/30 ${
                  selectedWorkspaceId === workspace.id ? 'bg-accent/10 text-accent' : ''
                }`}
              >
                {workspace.icon && <workspace.icon size={16} />}
                <span>{workspace.name}</span>
              </button>
            ))}
            
            {selectedWorkspaceId && plugins.length > 0 && (
              <>
                <div className="border-t border-border/30 my-1"></div>
                <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  Plugins in {workspaces.find(w => w.id === selectedWorkspaceId)?.name}
                </div>
                
                {plugins.map(plugin => (
                  <button
                    key={plugin.id}
                    onClick={() => {
                      selectPlugin(plugin.id)
                      setDropdownOpen(false)
                    }}
                    className={`flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-muted/30 ${
                      selectedPluginId === plugin.id ? 'bg-accent/5 text-accent' : ''
                    }`}
                  >
                    <Puzzle size={14} />
                    <span>{plugin.name}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}