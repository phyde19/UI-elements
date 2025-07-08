'use client'

import { useState, useEffect } from 'react'
import { ThemeToggle } from './theme-toggle'
import { CompactPluginSelector } from './compact-plugin-selector'
import { PanelRight, RefreshCw } from 'lucide-react'
import { useLayout } from './layout-context'
import { useWorkspaceContext } from './workspace-context'

export function CompactHeader() {
  const [scrolled, setScrolled] = useState(false)
  const { isRightPanelOpen, toggleRightPanel } = useLayout()
  const { selectWorkspace, selectPlugin } = useWorkspaceContext()
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])
  
  // Handle workspace and plugin change
  const handleWorkspacePluginChange = (workspaceId: string, pluginId: string) => {
    selectWorkspace(workspaceId)
    selectPlugin(pluginId)
  }
  
  return (
    <div>
      {/* Solid header */}
      <header className="w-full h-12 bg-background border-b border-border/30">
        <div className="w-full h-full flex items-center justify-between px-4">
          {/* Left side with compact selector */}
          <div className="flex items-center">
            <CompactPluginSelector 
              onWorkspacePluginChange={handleWorkspacePluginChange}
            />
          </div>
          
          {/* Right side with actions */}
          <div className="flex items-center gap-2">
            <button 
              className="flex items-center gap-1 text-sm bg-accent/10 text-accent hover:bg-accent/20 px-3 py-1.5 rounded-md transition-colors"
            >
              <RefreshCw size={14} />
              <span>New Chat</span>
            </button>
            <button 
              onClick={() => toggleRightPanel()}
              className={`p-1.5 rounded-md transition-colors ${
                isRightPanelOpen 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
              }`}
              aria-label="Toggle right panel"
              title="Toggle right panel"
            >
              <PanelRight size={18} />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Gradient fade-out with conditional blur effect */}
      <div 
        className={`w-full h-6 bg-gradient-to-b from-background to-transparent transition-all duration-300 ${
          scrolled ? 'backdrop-blur-sm' : ''
        }`}
      ></div>
    </div>
  )
}