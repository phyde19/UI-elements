'use client'

import { useLayout, PanelType } from '../../lib/layout-context'
import { DocumentEditor } from './document-editor'
import { Search } from 'lucide-react'

// Simple placeholder for the search results panel we haven't built yet
const SearchResultsPanel = () => (
  <div className="flex-1 h-screen bg-document border-l border-document-border">
    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
      <Search size={48} className="mb-4 text-accent/50" />
      <div className="text-center">
        <h3 className="text-xl mb-2 text-foreground font-medium">Search Results</h3>
        <p className="text-sm max-w-md">
          This panel will display search results, RAG results, citations, and content used to generate responses.
        </p>
      </div>
    </div>
  </div>
)

export function RightPanel() {
  const { currentPanel, panelProps, isRightPanelOpen } = useLayout()
  
  if (!isRightPanelOpen) return null
  
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
      return <SearchResultsPanel />
      
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