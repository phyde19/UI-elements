'use client'

import React from 'react'
import { useCapability } from './capability-context'
import { ThemeToggle } from './theme-toggle'
import { useLayout } from '../../lib/layout-context'
import {
  PanelRight,
  Search,
  Layers,
  Settings,
  Plus,
  ChevronDown,
  Compass
} from 'lucide-react'

interface CapabilityHeaderProps {
  onOpenWorkspaceSwitcher: () => void
}

export function CapabilityHeader({ onOpenWorkspaceSwitcher }: CapabilityHeaderProps) {
  const { 
    activeWorkspaceId, 
    workspaces, 
    activePlugin, 
    setActivePlugin,
    pinnedPlugins
  } = useCapability()
  
  const { 
    isRightPanelOpen, 
    currentPanel, 
    toggleRightPanel 
  } = useLayout()
  
  // Get active workspace
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId)
  
  return (
    <header className="h-14 border-b border-border/20 bg-background flex items-center px-3">
      {/* Left section with logo and workspace selector */}
      <div className="flex items-center">
        <div className="flex items-center gap-2 mr-4">
          <Compass size={22} className="text-compass-blue" />
          <span className="font-medium">Compass</span>
        </div>
        
        <button 
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted/30 transition-colors text-sm"
          onClick={onOpenWorkspaceSwitcher}
        >
          {activeWorkspace && (
            <>
              <div className={`w-5 h-5 rounded flex items-center justify-center ${activeWorkspace.color || 'bg-accent/10'}`}>
                <activeWorkspace.icon size={14} />
              </div>
              <span>{activeWorkspace.name}</span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </>
          )}
        </button>
      </div>
      
      {/* Center section with active plugin indicator */}
      <div className="flex-1 flex justify-center">
        {activePlugin && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent/10 text-accent text-sm">
            <activePlugin.icon size={16} />
            <span>{activePlugin.name}</span>
          </div>
        )}
      </div>
      
      {/* Right section with actions */}
      <div className="flex items-center gap-2">
        <button 
          className="p-1.5 rounded-md hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="New chat"
          title="New chat"
        >
          <Plus size={18} />
        </button>
        
        <button 
          onClick={() => toggleRightPanel('search-results')}
          className={`p-1.5 rounded-md transition-colors ${
            isRightPanelOpen && currentPanel === 'search-results'
              ? 'bg-accent/10 text-accent' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
          }`}
          aria-label="Toggle search results"
          title="Toggle search results"
        >
          <Search size={18} />
        </button>
        
        <button 
          onClick={() => toggleRightPanel('workspaces')}
          className={`p-1.5 rounded-md transition-colors ${
            isRightPanelOpen && currentPanel === 'workspaces'
              ? 'bg-accent/10 text-accent' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
          }`}
          aria-label="Toggle workspaces panel"
          title="Toggle workspaces panel"
        >
          <Layers size={18} />
        </button>
        
        <button 
          onClick={() => toggleRightPanel('document')}
          className={`p-1.5 rounded-md transition-colors ${
            isRightPanelOpen && currentPanel === 'document'
              ? 'bg-accent/10 text-accent' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
          }`}
          aria-label="Toggle document panel"
          title="Toggle document panel"
        >
          <PanelRight size={18} />
        </button>
        
        <button 
          className="p-1.5 rounded-md hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Settings"
          title="Settings"
        >
          <Settings size={18} />
        </button>
        
        <ThemeToggle />
      </div>
    </header>
  )
}