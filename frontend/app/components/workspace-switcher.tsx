'use client'

import { useState, useRef, useEffect } from 'react'
import { Compass, Building2, Database, FileText, Lock, ChevronDown, ChevronRight } from 'lucide-react'

// Types for our workspace model
type Workspace = {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  pluginCount: number
}

// Sample workspaces based on Compass.md description
const defaultWorkspaces: Workspace[] = [
  {
    id: 'engineering',
    name: 'Engineering',
    icon: <Compass className="h-5 w-5" />,
    description: 'Product development and technical resources',
    pluginCount: 8
  },
  {
    id: 'legal',
    name: 'Legal',
    icon: <FileText className="h-5 w-5" />,
    description: 'Compliance and documentation',
    pluginCount: 4
  },
  {
    id: 'data',
    name: 'Data Engineering',
    icon: <Database className="h-5 w-5" />,
    description: 'Database access and analytics',
    pluginCount: 6
  },
  {
    id: 'security',
    name: 'Security',
    icon: <Lock className="h-5 w-5" />,
    description: 'Risk assessment and protection',
    pluginCount: 5
  }
]

export function WorkspaceSwitcher({ 
  workspaces = defaultWorkspaces,
  onSwitch = () => {}
}: { 
  workspaces?: Workspace[]
  onSwitch?: (id: string) => void
}) {
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0])
  const [isExpanded, setIsExpanded] = useState(false)
  const componentRef = useRef<HTMLDivElement>(null)
  
  const handleWorkspaceSwitch = (workspace: Workspace) => {
    setActiveWorkspace(workspace)
    setIsExpanded(false)
    onSwitch(workspace.id)
  }
  
  // Close the expanded view when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={componentRef} className="select-none">
      {/* Active workspace indicator */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-background/50 rounded-md transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-foreground">
            {activeWorkspace.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {activeWorkspace.name}
            </p>
          </div>
        </div>
        <div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
      
      {/* Workspace list */}
      {isExpanded && (
        <div className="mt-1 overflow-hidden rounded-md border border-border bg-background/95 shadow-lg">
          <div className="py-1">
            <p className="px-3 py-1 text-xs font-medium text-muted-foreground">
              Team Workspaces
            </p>
            
            {workspaces.map(workspace => (
              <div 
                key={workspace.id}
                onClick={() => handleWorkspaceSwitch(workspace)}
                className={`px-3 py-2 cursor-pointer transition-colors ${
                  workspace.id === activeWorkspace.id 
                    ? 'bg-muted' 
                    : 'hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    {workspace.icon}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className={`text-sm ${workspace.id === activeWorkspace.id ? 'font-medium' : ''}`}>
                      {workspace.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {workspace.pluginCount} plugins available
                    </p>
                  </div>
                  {workspace.id === activeWorkspace.id && (
                    <div className="ml-2 h-1.5 w-1.5 rounded-full bg-foreground/70"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}