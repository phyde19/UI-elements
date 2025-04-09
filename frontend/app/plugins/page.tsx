'use client'

import { useState } from 'react'
import { Header } from "../components/header"
import { SideNavigation } from "../components/side-navigation"
import { PluginSelector } from "../components/plugin-selector"
import { useLayout } from "../../lib/layout-context"

export default function PluginsPage() {
  const [selectedPlugin, setSelectedPlugin] = useState('basic');
  const { isRightPanelOpen } = useLayout();
  
  const handleSelectPlugin = (pluginId) => {
    setSelectedPlugin(pluginId);
  };
  
  const handleNewChat = () => {
    // Handle new chat functionality
  };
  
  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex">
      {/* Side navigation - full height */}
      <SideNavigation />
      
      {/* Main content area with header and plugins catalog */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Fixed header at the top */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <Header 
            selectedPlugin={selectedPlugin}
            onSelectPlugin={handleSelectPlugin}
            onNewChat={handleNewChat}
          />
        </div>
        
        {/* Content area - flex row for main content and right panel */}
        <div className="mt-[4.5rem] flex-1 flex overflow-hidden">
          {/* Left area - narrow when panel is open */}
          <div className={`${isRightPanelOpen ? 'w-[350px]' : 'flex-1'} overflow-y-auto transition-all duration-300`}>
            <div className="px-4 py-8">
              <h1 className="text-2xl font-semibold mb-6">Plugin Catalog</h1>
              <p className="text-muted-foreground mb-8">
                Browse all available plugins for your workspace. Contact your administrator to request access to locked plugins.
              </p>
              
              <PluginSelector showAccessStatus={true} />
            </div>
          </div>
          
          {/* Right panel - blank canvas taking most of the space */}
          {isRightPanelOpen && (
            <div className="flex-1 h-full bg-muted/10 border-l border-border/10">
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
    </div>
  )
}