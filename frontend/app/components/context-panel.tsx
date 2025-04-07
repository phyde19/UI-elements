'use client'

import { useState } from 'react'
import { PanelRightClose, Search, Book, FileQuestion, ChevronRight, ExternalLink, Clock } from 'lucide-react'

export function ContextPanel({ activePlugins = [], onClose }) {
  const [selectedTab, setSelectedTab] = useState('search')
  const hasDocSearchPlugin = activePlugins.some(p => p.id === 'rag')
  
  if (!hasDocSearchPlugin) {
    return (
      <div className="h-full flex flex-col border-l border-border/10">
        <div className="p-4 flex items-center justify-between border-b border-border/10">
          <h3 className="text-sm font-medium">Context Panel</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted/30">
            <PanelRightClose size={16} />
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-xs">
            <div className="mb-3 flex justify-center">
              <Book size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Enable plugins to see contextual information and tools related to your chat.
            </p>
            <button className="px-3 py-1.5 bg-accent/10 text-accent text-sm rounded-md hover:bg-accent/20 transition-colors">
              Enable Plugins
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col border-l border-border/10">
      <div className="p-4 flex items-center justify-between border-b border-border/10">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium">Document Search</h3>
          <div className="flex">
            <button
              onClick={() => setSelectedTab('search')}
              className={`px-2.5 py-1 text-xs rounded-l-md ${
                selectedTab === 'search' 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
              }`}
            >
              Search
            </button>
            <button
              onClick={() => setSelectedTab('sources')}
              className={`px-2.5 py-1 text-xs rounded-r-md ${
                selectedTab === 'sources' 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
              }`}
            >
              Sources
            </button>
          </div>
        </div>
        
        <button onClick={onClose} className="p-1 rounded-md hover:bg-muted/30">
          <PanelRightClose size={16} />
        </button>
      </div>
      
      {selectedTab === 'search' && (
        <div className="flex-1 flex flex-col">
          <div className="p-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={16} className="text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search knowledge base..."
                className="w-full py-2 pl-10 pr-4 bg-muted/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
            </div>
          </div>
          
          <div className="p-3 flex-1 overflow-auto">
            <div className="text-xs font-medium text-muted-foreground mb-2">RECENT SEARCHES</div>
            
            <div className="space-y-1">
              {['Q4 marketing strategy', 'Product roadmap', 'Customer feedback analysis'].map((search, i) => (
                <button key={i} className="flex items-center gap-1.5 w-full p-2 text-sm hover:bg-muted/30 rounded-md">
                  <Clock size={14} className="text-muted-foreground" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
            
            <div className="text-xs font-medium text-muted-foreground mt-4 mb-2">SUGGESTED DOCUMENTS</div>
            
            <div className="space-y-2">
              {[
                'Marketing Strategy 2025.pdf',
                'Quarterly Report Q1 2025.docx',
                'Brand Guidelines.pptx',
                'Market Research - Competitor Analysis.pdf'
              ].map((doc, i) => (
                <div key={i} className="p-2 hover:bg-muted/30 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{doc}</span>
                    <button className="p-1 rounded-md hover:bg-muted/50">
                      <ExternalLink size={14} className="text-muted-foreground" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated: {['Yesterday', '2 days ago', '1 week ago', '3 weeks ago'][i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {selectedTab === 'sources' && (
        <div className="flex-1 overflow-auto p-3">
          <div className="text-xs font-medium text-muted-foreground mb-2">SOURCES USED IN THIS CHAT</div>
          
          <div className="space-y-2">
            {[
              {
                title: 'Marketing Strategy 2025.pdf',
                citations: ['Strategy goals (p.12)', 'Target demographics (p.17)']
              },
              {
                title: 'Customer Feedback Analysis.docx',
                citations: ['Key findings (p.4)', 'Survey results (p.22)']
              }
            ].map((source, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <FileQuestion size={16} />
                  <span className="text-sm font-medium">{source.title}</span>
                </div>
                
                <div className="pl-6 space-y-1">
                  {source.citations.map((citation, j) => (
                    <div key={j} className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ChevronRight size={12} />
                      <span>{citation}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}