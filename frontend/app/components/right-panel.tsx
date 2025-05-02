'use client'

import { useLayout, PanelType } from '../../lib/layout-context'
import { DocumentEditor } from './document-editor'
import { SearchResultsPanel } from './search-results-panel'
import { WorkspacesPanel } from './workspaces-panel'

export function RightPanel() {
  const { currentPanel, panelProps, isRightPanelOpen } = useLayout()
  
  if (!isRightPanelOpen) return null
  
  console.log('Current panel type:', currentPanel, 'Panel props:', panelProps);
  
  // Render the appropriate panel based on the currentPanel type
  switch (currentPanel) {
    case 'document':
      return (
        <div className="flex-1 h-screen">
          <DocumentEditor 
            documentName={panelProps.documentName || "Untitled Document"}
            initialContent={panelProps.content}
            onSave={panelProps.onSave}
          />
        </div>
      )
      
    case 'search-results':
      return <SearchResultsPanel results={panelProps.results} />
      
    case 'workspaces':
      return <WorkspacesPanel />
      
    default:
      // Default to document editor as fallback
      return (
        <div className="flex-1 h-screen">
          <DocumentEditor 
            documentName="Untitled Document"
            onSave={(content) => console.log("Document saved", content.substring(0, 50) + "...")}
          />
        </div>
      )
  }
}