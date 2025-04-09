"use client"

import { useState } from 'react'
import { Compass, LayoutDashboard, MessageSquare, FolderSearch, Settings, BarChart, PanelRight, File } from 'lucide-react'
import { WorkspaceSwitcher } from './workspace-switcher'
import { Sidebar, SidebarProvider, SidebarSection, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar'
import { DocumentEditor } from './document-editor'
import { useLayout } from '../../lib/layout-context'

const documentList = [
  {
    id: 'doc1',
    name: 'Q2 Planning Notes.md',
    lastEdited: 'Today, 10:25 AM'
  },
  {
    id: 'doc2',
    name: 'Product Roadmap.md',
    lastEdited: 'Yesterday, 3:15 PM'
  },
  {
    id: 'doc3',
    name: 'Team Goals.md',
    lastEdited: 'Apr 3, 2025'
  }
]

export function WorkspaceDemo() {
  const { isRightPanelOpen, toggleRightPanel } = useLayout();
  const [selectedDocument, setSelectedDocument] = useState(documentList[0]);
  
  const handleSaveDocument = (content) => {
    console.log("Document saved:", content.substring(0, 50) + "...");
    // In a real app, this would save to a backend
  };
  
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
            <h1 className="text-lg font-medium">Documents</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleRightPanel}
                className={`p-1.5 rounded-md transition-colors ${
                  isRightPanelOpen 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                }`}
                aria-label="Toggle document editor"
                title="Toggle document editor"
              >
                <PanelRight size={18} />
              </button>
            </div>
          </div>
          
          {/* Main content area with right panel */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left area - document list */}
            <div className={`${isRightPanelOpen ? 'w-[350px]' : 'flex-1'} flex flex-col overflow-hidden transition-all duration-300`}>
              <div className="flex-1 p-6 overflow-auto">
                <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
                <p className="text-muted-foreground mb-4">
                  Select a document to edit or create a new one.
                </p>
                
                <div className="space-y-2 mb-6">
                  {documentList.map((doc) => (
                    <button
                      key={doc.id}
                      className={`w-full p-3 border ${
                        selectedDocument.id === doc.id 
                          ? 'border-accent/30 bg-accent/5' 
                          : 'border-border/30 hover:bg-muted/20'
                      } rounded-lg text-left transition-colors`}
                      onClick={() => {
                        setSelectedDocument(doc);
                        if (!isRightPanelOpen) {
                          toggleRightPanel();
                        }
                      }}
                    >
                      <div className="flex items-start">
                        <File size={16} className="mr-2 mt-0.5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{doc.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            Last edited: {doc.lastEdited}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <button 
                  className="w-full p-2.5 border border-dashed border-border/50 rounded-lg text-center text-sm text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
                  onClick={() => {
                    // In a real app, this would create a new document
                    const newDoc = {
                      id: `doc${documentList.length + 1}`,
                      name: `New Document.md`,
                      lastEdited: 'Just now'
                    };
                    // setSelectedDocument(newDoc);
                    if (!isRightPanelOpen) {
                      toggleRightPanel();
                    }
                  }}
                >
                  + Create New Document
                </button>
              </div>
              
              {/* Search input at the bottom */}
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
            
            {/* Right panel - document editor */}
            {isRightPanelOpen && (
              <div className="flex-1 h-full bg-background border-l border-border/10">
                <DocumentEditor 
                  documentName={selectedDocument.name}
                  onSave={handleSaveDocument}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}