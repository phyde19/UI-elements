'use client'

import { useState } from 'react'
import { Workflow, Database, FileText, Zap, Pin, Star, ChevronDown, Search } from 'lucide-react'

// Mock plugin data
const PLUGINS = [
  {
    id: 'rag',
    name: 'Document Search',
    description: 'Search across your team knowledge base',
    icon: FileText,
    category: 'Data',
    isActive: true,
    isPinned: true
  },
  {
    id: 'db',
    name: 'Database Explorer',
    description: 'Query and visualize your data warehouse',
    icon: Database,
    category: 'Data',
    isActive: false,
    isPinned: true
  },
  {
    id: 'workflow',
    name: 'Workflow Automation',
    description: 'Create and manage automated workflows',
    icon: Workflow,
    category: 'Automation',
    isActive: false,
    isPinned: false
  },
  {
    id: 'jira',
    name: 'Jira Assistant',
    description: 'Create and manage Jira tickets',
    iconSrc: '/plugins/jira.svg',
    category: 'Tools',
    isActive: false,
    isPinned: false
  },
  {
    id: 'github',
    name: 'GitHub Helper',
    description: 'Review PRs and manage GitHub issues',
    iconSrc: '/plugins/github.svg',
    category: 'Development',
    isActive: false,
    isPinned: false
  }
]

export function ActivePlugins({ onPluginToggle, plugins = PLUGINS }) {
  const [expandedView, setExpandedView] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Use provided plugins if available
  const activePlugins = (plugins || PLUGINS).filter(p => p.isActive)
  const pinnedPlugins = (plugins || PLUGINS).filter(p => p.isPinned)
  
  // Filter plugins by search
  const filteredPlugins = searchQuery.trim() === '' 
    ? (plugins || PLUGINS)
    : (plugins || PLUGINS).filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
  
  // Handle toggle
  const handleToggle = (pluginId) => {
    if (onPluginToggle) {
      onPluginToggle(pluginId)
    }
  }

  return (
    <div className={`bg-background transition-all duration-300 ${expandedView ? 'h-60 overflow-y-auto' : 'h-auto'}`}>
      <div className="flex items-center justify-between px-1 py-2 border-b border-border/10">
        <div className="flex items-center gap-1">
          <Zap size={16} className={activePlugins.length > 0 ? "text-amber-400" : "text-muted-foreground"} />
          <span className="text-sm font-medium">Plugins</span>
          <span className="text-xs bg-accent/10 text-accent rounded-full px-1.5">
            {activePlugins.length} active
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setExpandedView(!expandedView)}
            className="p-1 rounded-md hover:bg-muted transition-colors"
            aria-label={expandedView ? "Collapse plugins panel" : "Expand plugins panel"}
          >
            <ChevronDown 
              size={16} 
              className={`text-muted-foreground transition-transform ${expandedView ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
      </div>
      
      {/* Plugin toggles and list */}
      <div className={`overflow-hidden transition-all duration-300 ${expandedView ? 'max-h-full' : 'max-h-14'}`}>
        {/* Quick toggle section always visible */}
        <div className="flex flex-wrap gap-1 p-1.5">
          {pinnedPlugins.map(plugin => (
            <button
              key={plugin.id}
              onClick={() => handleToggle(plugin.id)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-colors ${
                plugin.isActive 
                  ? 'bg-accent/20 text-accent' 
                  : 'bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {plugin.iconSrc ? (
                <img src={plugin.iconSrc} alt="" className="w-3.5 h-3.5" />
              ) : (
                <plugin.icon size={14} />
              )}
              <span>{plugin.name}</span>
            </button>
          ))}
        </div>
        
        {/* Extended view with search and all plugins */}
        {expandedView && (
          <div className="pt-2">
            {/* Search input */}
            <div className="px-2 pb-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <Search size={14} className="text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search plugins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-1.5 pl-7 pr-3 text-sm bg-muted/30 border-none rounded-md focus:ring-1 focus:ring-accent/30 focus:outline-none"
                />
              </div>
            </div>
            
            {/* All plugins list */}
            <div className="grid grid-cols-2 gap-1 px-1 pt-1">
              {filteredPlugins.map(plugin => (
                <div 
                  key={plugin.id} 
                  className="flex flex-col p-2 rounded-md hover:bg-muted/20 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
                        {plugin.iconSrc ? (
                          <img src={plugin.iconSrc} alt="" className="w-4 h-4" />
                        ) : (
                          <plugin.icon size={14} className="text-foreground/80" />
                        )}
                      </div>
                      <span className="text-sm font-medium truncate">{plugin.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button 
                        className={`p-1 rounded-md transition-colors ${
                          plugin.isPinned ? 'text-amber-400' : 'text-muted-foreground hover:text-foreground'
                        }`}
                        aria-label={plugin.isPinned ? "Unpin from quick access" : "Pin to quick access"}
                      >
                        <Pin size={12} className={plugin.isPinned ? 'fill-amber-400' : ''} />
                      </button>
                      
                      {/* Toggle switch */}
                      <button 
                        onClick={() => handleToggle(plugin.id)}
                        className={`relative rounded-full w-8 h-4 transition-colors flex items-center ${
                          plugin.isActive ? 'bg-accent' : 'bg-muted'
                        }`}
                      >
                        <span 
                          className={`absolute h-3 w-3 rounded-full bg-background transition-transform ${
                            plugin.isActive ? 'translate-x-4' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {plugin.description}
                  </div>
                </div>
              ))}
              
              {filteredPlugins.length === 0 && (
                <div className="col-span-2 py-4 text-center text-sm text-muted-foreground">
                  No plugins match your search
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}