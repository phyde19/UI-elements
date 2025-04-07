'use client'

import { useState } from 'react'
import { Search, Star, Workflow, Database, FileText, Puzzle } from 'lucide-react'

// Mock plugin data
const PLUGINS = [
  {
    id: 'rag',
    name: 'Document Search',
    description: 'Search across your team knowledge base',
    icon: FileText,
    category: 'Data',
    usageCount: 145,
    isFavorite: true,
    isNew: false,
    accessStatus: 'enabled', // 'enabled', 'available', 'locked'
    enabled: true
  },
  {
    id: 'db',
    name: 'Database Explorer',
    description: 'Query and visualize your data warehouse',
    icon: Database,
    category: 'Data',
    usageCount: 87,
    isFavorite: true,
    isNew: false,
    accessStatus: 'enabled',
    enabled: true
  },
  {
    id: 'workflow',
    name: 'Workflow Automation',
    description: 'Create and manage automated workflows',
    icon: Workflow,
    category: 'Automation',
    usageCount: 32,
    isFavorite: false,
    isNew: true,
    accessStatus: 'available',
    enabled: false
  },
  {
    id: 'jira',
    name: 'Jira Assistant',
    description: 'Create and manage Jira tickets',
    iconSrc: '/plugins/jira.svg',
    category: 'Tools',
    usageCount: 62,
    isFavorite: false,
    isNew: false,
    accessStatus: 'locked',
    enabled: false
  },
  {
    id: 'github',
    name: 'GitHub Helper',
    description: 'Review PRs and manage GitHub issues',
    iconSrc: '/plugins/github.svg',
    category: 'Development',
    usageCount: 54,
    isFavorite: false,
    isNew: false,
    accessStatus: 'locked',
    enabled: false
  },
  {
    id: 'slack',
    name: 'Slack Summary',
    description: 'Summarize Slack conversations and extract action items',
    iconSrc: '/plugins/slack.svg',
    category: 'Communication',
    usageCount: 28,
    isFavorite: false,
    isNew: true,
    accessStatus: 'enabled',
    enabled: true
  }
]

// Group plugins by category
const groupByCategory = (plugins) => {
  return plugins.reduce((acc, plugin) => {
    const category = plugin.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(plugin)
    return acc
  }, {})
}

export function PluginSelector({ 
  onSelect, 
  currentWorkspace = "Marketing Team", 
  showAccessStatus = false,
  onlyShowEnabled = false
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedView, setSelectedView] = useState('all') // 'all', 'favorites', 'enabled', 'available'
  
  // Filter plugins based on search and view
  const filteredPlugins = PLUGINS.filter(plugin => {
    // Search filter
    const matchesSearch = 
      searchQuery === '' || 
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Only show enabled plugins if specified
    if (onlyShowEnabled && !plugin.enabled) return false
    
    // View filter
    if (selectedView === 'favorites') return matchesSearch && plugin.isFavorite
    if (selectedView === 'enabled') return matchesSearch && plugin.accessStatus === 'enabled'
    if (selectedView === 'available') return matchesSearch && plugin.accessStatus === 'available'
    
    return matchesSearch
  })
  
  // Group plugins by category
  const organizedPlugins = selectedView === 'all' 
    ? groupByCategory(filteredPlugins)
    : filteredPlugins
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="text-xl font-medium mb-1.5 text-center">What would you like to do?</div>
        <div className="text-muted-foreground mb-6 text-center">
          Choose a plugin from your <span className="text-foreground">{currentWorkspace}</span> workspace
        </div>
        
        <div className="relative max-w-md mx-auto mb-6">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search plugins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/30 py-2.5 pl-10 pr-3 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        
        <div className="flex justify-center mb-8 space-x-3">
          <button
            onClick={() => setSelectedView('all')}
            className={`px-4 py-1.5 rounded-full text-sm transition ${
              selectedView === 'all' 
                ? 'bg-accent/10 text-accent' 
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            All Plugins
          </button>
          {showAccessStatus && (
            <>
              <button
                onClick={() => setSelectedView('enabled')}
                className={`px-4 py-1.5 rounded-full text-sm transition ${
                  selectedView === 'enabled' 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-muted-foreground hover:bg-muted/30'
                }`}
              >
                Enabled
              </button>
              <button
                onClick={() => setSelectedView('available')}
                className={`px-4 py-1.5 rounded-full text-sm transition ${
                  selectedView === 'available' 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-muted-foreground hover:bg-muted/30'
                }`}
              >
                Available
              </button>
            </>
          )}
          <button
            onClick={() => setSelectedView('favorites')}
            className={`px-4 py-1.5 rounded-full text-sm transition flex items-center gap-1.5 ${
              selectedView === 'favorites' 
                ? 'bg-accent/10 text-accent' 
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            <Star size={14} />
            <span>Favorites</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedView === 'all' ? (
          // Grouped by category
          Object.entries(organizedPlugins).map(([category, plugins]) => (
            <div key={category} className="space-y-3 col-span-full">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                {category}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plugins.map(plugin => (
                  <div
                    key={plugin.id}
                    className="bg-background hover:bg-muted/30 p-4 rounded-lg transition-colors flex items-start gap-3 text-left group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                      {plugin.iconSrc ? (
                        <img 
                          src={plugin.iconSrc} 
                          alt={plugin.name} 
                          className="w-6 h-6"
                        />
                      ) : (
                        <plugin.icon size={20} className="text-foreground/80" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium group-hover:text-accent transition-colors">{plugin.name}</span>
                        {plugin.isNew && (
                          <span className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">New</span>
                        )}
                        {plugin.isFavorite && (
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                        )}
                        {showAccessStatus && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            plugin.accessStatus === 'enabled' ? 'bg-green-500/10 text-green-500' :
                            plugin.accessStatus === 'available' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-gray-500/10 text-gray-500'
                          }`}>
                            {plugin.accessStatus === 'enabled' ? 'Enabled' :
                             plugin.accessStatus === 'available' ? 'Available' :
                             'Locked'}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">{plugin.description}</div>
                      
                      <div className="mt-3 flex justify-between items-center">
                        {plugin.accessStatus === 'enabled' ? (
                          <button
                            onClick={() => onSelect && onSelect(plugin)}
                            className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-md hover:bg-accent/20 transition-colors"
                          >
                            Start Chat
                          </button>
                        ) : plugin.accessStatus === 'available' ? (
                          <button 
                            className="text-sm bg-blue-500/10 text-blue-500 px-3 py-1 rounded-md hover:bg-blue-500/20 transition-colors"
                          >
                            Enable
                          </button>
                        ) : (
                          <button
                            className="text-sm bg-gray-500/10 text-gray-500 px-3 py-1 rounded-md hover:bg-gray-500/20 transition-colors"
                          >
                            Request Access
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          // Flat favorites view
          filteredPlugins.map(plugin => (
            <div
              key={plugin.id}
              className="bg-background hover:bg-muted/30 p-4 rounded-lg transition-colors flex items-start gap-3 text-left group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                {plugin.iconSrc ? (
                  <img 
                    src={plugin.iconSrc} 
                    alt={plugin.name} 
                    className="w-6 h-6"
                  />
                ) : (
                  <plugin.icon size={20} className="text-foreground/80" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium group-hover:text-accent transition-colors">{plugin.name}</span>
                  {plugin.isNew && (
                    <span className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">New</span>
                  )}
                  {plugin.isFavorite && (
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                  )}
                  {showAccessStatus && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      plugin.accessStatus === 'enabled' ? 'bg-green-500/10 text-green-500' :
                      plugin.accessStatus === 'available' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                      {plugin.accessStatus === 'enabled' ? 'Enabled' :
                       plugin.accessStatus === 'available' ? 'Available' :
                       'Locked'}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">{plugin.description}</div>
                
                <div className="mt-3 flex justify-between items-center">
                  {plugin.accessStatus === 'enabled' ? (
                    <button
                      onClick={() => onSelect && onSelect(plugin)}
                      className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-md hover:bg-accent/20 transition-colors"
                    >
                      Start Chat
                    </button>
                  ) : plugin.accessStatus === 'available' ? (
                    <button 
                      className="text-sm bg-blue-500/10 text-blue-500 px-3 py-1 rounded-md hover:bg-blue-500/20 transition-colors"
                    >
                      Enable
                    </button>
                  ) : (
                    <button
                      className="text-sm bg-gray-500/10 text-gray-500 px-3 py-1 rounded-md hover:bg-gray-500/20 transition-colors"
                    >
                      Request Access
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {filteredPlugins.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <div className="mb-2">
              <Puzzle size={24} className="mx-auto" />
            </div>
            <p>No plugins found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}