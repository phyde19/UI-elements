"use client"

import { Compass, LayoutDashboard, MessageSquare, FolderSearch, Settings, Users, BarChart } from 'lucide-react'
import { WorkspaceSwitcher } from './workspace-switcher'
import { Sidebar, SidebarProvider, SidebarSection, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar'

export function WorkspaceDemo() {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar className="flex flex-col">
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
        
        {/* Main content area */}
        <div className="flex-1 p-8 bg-background">
          <h1 className="text-2xl font-semibold mb-4">Workspace Switcher Demo</h1>
          <p className="text-muted-foreground">
            Click on the workspace selector at the bottom of the sidebar to try it out.
          </p>
        </div>
      </div>
    </SidebarProvider>
  )
}