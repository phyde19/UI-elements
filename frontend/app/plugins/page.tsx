'use client'

import { SideNavigation } from "../components/side-navigation"
import { PluginSelector } from "../components/plugin-selector"
import { useLayout } from "../../lib/layout-context"
import { ThemeToggle } from "../components/theme-toggle"
import { PluginSelectorDropdown } from "../components/plugin-selector-dropdown"
import { PanelRight } from "lucide-react"
import { useWorkspaceContext } from "../../lib/workspace-context"

export default function PluginsPage() {
  const { selectedPluginId, selectPlugin } = useWorkspaceContext();
  const { isRightPanelOpen, toggleRightPanel } = useLayout();
  
  const handleSelectPlugin = (pluginId) => {
    selectPlugin(pluginId);
  };
  
  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex">
      {/* Side navigation - full height */}
      <SideNavigation />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left area with header and plugin catalog - fixed width when panel is open */}
        <div className={`${isRightPanelOpen ? 'w-[380px] flex-shrink-0' : 'flex-1'} flex flex-col transition-all duration-300`}>
          {/* Header at the top */}
          <div className="h-[4.5rem] flex items-center justify-between px-4 border-b border-border/20 bg-background z-20">
            <div className="flex-1 flex items-center">
              <PluginSelectorDropdown 
                selectedPlugin={selectedPluginId}
                onSelectPlugin={handleSelectPlugin}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleRightPanel}
                className={`p-1.5 rounded-md transition-colors ${
                  isRightPanelOpen 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                }`}
                aria-label="Toggle plugin configuration panel"
                title="Toggle plugin configuration panel"
              >
                <PanelRight size={18} />
              </button>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Plugin catalog */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-8">
              <h1 className="text-2xl font-semibold mb-6">Plugin Catalog</h1>
              <p className="text-muted-foreground mb-8">
                Browse all available plugins for your workspace. Contact your administrator to request access to locked plugins.
              </p>
              
              <PluginSelector showAccessStatus={true} />
            </div>
          </div>
        </div>
        
        {/* Right panel - takes up remaining space */}
        {isRightPanelOpen && (
          <div className="flex-1 h-screen bg-muted/10 border-l border-border/10">
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p>Plugin Configuration Panel</p>
                <p className="text-sm mt-2">This area will contain plugin configuration controls</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
