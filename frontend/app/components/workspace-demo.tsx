"use client"

import { useState } from 'react'
import { Compass, LayoutDashboard, MessageSquare, FolderSearch, Settings, BarChart, PanelRight } from 'lucide-react'
import { WorkspaceSwitcher } from './workspace-switcher'
import { Sidebar, SidebarProvider, SidebarSection, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar'
import { useLayout } from '../../lib/layout-context'

export function WorkspaceDemo() {
  const { isRightPanelOpen, toggleRightPanel } = useLayout();
  
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar className="flex flex-col h-full">
          {/* App logo */}
          <SidebarSection className="py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-compass-blue text-compass-blue-foreground">
                <Compass className="h-5 w-5" />
              </div>
              <div className="font-semibold text-foreground">Compass</div>
            </div>
          </SidebarSection>
          
          {/* Main navigation */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton variant="active">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <MessageSquare className="h-5 w-5" />
                <span>Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FolderSearch className="h-5 w-5" />
                <span>Knowledge Base</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <BarChart className="h-5 w-5" />
                <span>Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          {/* Settings */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          {/* Workspace switcher at the bottom */}
          <div className="mt-auto">
            <WorkspaceSwitcher />
          </div>
        </Sidebar>
        
        <div className="flex-1 flex flex-col relative">
          {/* Header */}
          <div className="h-14 border-b border-border/10 flex items-center justify-between px-4">
            <h1 className="text-lg font-medium">Dashboard</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleRightPanel}
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
            </div>
          </div>
          
          {/* Main content area with right panel */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left area - narrow when panel is open */}
            <div className={`${isRightPanelOpen ? 'w-[350px]' : 'flex-1'} flex flex-col overflow-hidden transition-all duration-300`}>
              <div className="flex-1 p-6 overflow-auto">
                <h2 className="text-xl font-semibold mb-4">Navigation</h2>
                <p className="text-muted-foreground mb-4">
                  Click the panel button in the top right to toggle the editor panel.
                </p>
                <div className="space-y-2">
                  {['Document 1', 'Document 2', 'Document 3'].map((item, i) => (
                    <div key={i} className="p-3 border border-border/30 rounded-lg">
                      <h3 className="font-medium">{item}</h3>
                      <p className="text-sm text-muted-foreground">
                        Click to edit this document
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Input area at the bottom */}
              <div className="p-4 border-t border-border/10">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="w-full py-2 px-3 bg-muted/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent/30"
                  />
                </div>
              </div>
            </div>
            
            {/* Right panel - blank canvas taking most of the space */}
            {isRightPanelOpen && (
              <div className="flex-1 h-full bg-muted/10 border-l border-border/10">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <p>Document Editor Panel</p>
                    <p className="text-sm mt-2">This area will contain document editing functionality</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}