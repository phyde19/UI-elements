'use client'

import { Header } from "../components/header"
import { SideNavigation } from "../components/side-navigation"
import { PluginSelector } from "../components/plugin-selector"

export default function PluginsPage() {
  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex">
      {/* Side navigation - full height */}
      <SideNavigation />
      
      {/* Main content area with header and plugins catalog */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Fixed header at the top */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <Header />
        </div>
        
        {/* Top padding to push content below header + gradient */}
        <div className="pt-[4.5rem] flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Plugin Catalog</h1>
            <p className="text-muted-foreground mb-8">
              Browse all available plugins for your workspace. Contact your administrator to request access to locked plugins.
            </p>
            
            <PluginSelector showAccessStatus={true} />
          </div>
        </div>
      </div>
    </div>
  )
}