'use client'

import { useState, useEffect } from 'react'
import { ThemeToggle } from './theme-toggle'
import { RefinedPluginSelector } from './refined-plugin-selector'
import { PanelRight, RefreshCw, Info } from 'lucide-react'
import { useLayout } from './layout-context'
import { useWorkspaceContext } from './workspace-context'

export function RefinedHeader() {
  const [scrolled, setScrolled] = useState(false)
  const { isRightPanelOpen, toggleRightPanel } = useLayout()
  const { selectWorkspace, selectPlugin } = useWorkspaceContext()
  const [thinkingMode, setThinkingMode] = useState('normal')
  const [showInfo, setShowInfo] = useState(false)
  
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
  
  // Handle thinking mode change
  const handleThinkingModeChange = (modeId: string) => {
    setThinkingMode(modeId)
    // Show info modal when thinking mode changes
    setShowInfo(true)
    // Auto-hide after 3 seconds
    setTimeout(() => setShowInfo(false), 3000)
  }
  
  return (
    <div>
      {/* Solid header */}
      <header className="w-full h-12 bg-background border-b border-border/30">
        <div className="w-full h-full flex items-center justify-between px-4">
          {/* Left side with refined selector */}
          <div className="flex items-center">
            <RefinedPluginSelector 
              selectedThinkingMode={thinkingMode}
              onThinkingModeChange={handleThinkingModeChange}
              onWorkspacePluginChange={handleWorkspacePluginChange}
            />
            
            {/* Show thinking mode change notification */}
            {showInfo && (
              <div className="ml-4 flex items-center gap-2 text-sm text-accent bg-accent/5 px-3 py-1.5 rounded-md">
                <Info size={14} />
                <span>Thinking mode changed to <strong>{thinkingMode}</strong></span>
              </div>
            )}
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