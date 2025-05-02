'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Compass, 
  ChevronRight,
  Layers,
  Puzzle,
  Search,
  Command,
  PanelRight,
  X,
  Plus,
  FileText,
  Database,
  Code2,
  GitMerge,
  PanelLeftClose,
  ChevronDown,
  Sparkles
} from 'lucide-react'

// Types for our data model
interface Workspace {
  id: string
  name: string
  icon: React.ElementType
  description: string
  color?: string
}

interface Plugin {
  id: string
  name: string
  icon: React.ElementType
  description: string
  workspaceId: string
  isPinned?: boolean
  isRecent?: boolean
}

// Sample data
const WORKSPACES: Workspace[] = [
  { 
    id: 'engineering',
    name: 'Engineering',
    icon: Code2,
    description: 'Software development and technical resources',
    color: 'blue'
  },
  { 
    id: 'legal', 
    name: 'Legal', 
    icon: FileText,
    description: 'Legal documents and compliance information',
    color: 'amber'
  },
  { 
    id: 'data', 
    name: 'Data Engineering', 
    icon: Database,
    description: 'Data pipelines and analytics tools',
    color: 'green'
  }
]

const PLUGINS: Plugin[] = [
  // Engineering plugins
  { 
    id: 'code-review', 
    name: 'Code Review', 
    icon: Code2,
    description: 'Get feedback on code and pull requests',
    workspaceId: 'engineering',
    isPinned: true
  },
  { 
    id: 'api-docs', 
    name: 'API Documentation', 
    icon: FileText,
    description: 'Search and browse API documentation',
    workspaceId: 'engineering'
  },
  { 
    id: 'git-helper', 
    name: 'Git Helper', 
    icon: GitMerge,
    description: 'Assistance with Git operations and workflows',
    workspaceId: 'engineering',
    isRecent: true
  },
  
  // Legal plugins
  { 
    id: 'contract-review', 
    name: 'Contract Review', 
    icon: FileText,
    description: 'Analyze and summarize legal contracts',
    workspaceId: 'legal',
    isPinned: true
  },
  { 
    id: 'compliance', 
    name: 'Compliance Check', 
    icon: FileText,
    description: 'Check documents for regulatory compliance',
    workspaceId: 'legal',
    isRecent: true
  },
  
  // Data plugins
  { 
    id: 'data-query', 
    name: 'Data Query', 
    icon: Database,
    description: 'Query and analyze data from various sources',
    workspaceId: 'data',
    isPinned: true,
    isRecent: true
  },
  { 
    id: 'pipeline-monitor', 
    name: 'Pipeline Monitor', 
    icon: GitMerge,
    description: 'Monitor and debug data pipelines',
    workspaceId: 'data'
  }
]

export function HybridInterface() {
  // State
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('engineering')
  const [selectedPluginId, setSelectedPluginId] = useState<string>('code-review')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set(['engineering']))
  const commandInputRef = useRef<HTMLInputElement>(null)

  // Derived state
  const selectedWorkspace = WORKSPACES.find(w => w.id === selectedWorkspaceId) || WORKSPACES[0]
  const selectedPlugin = PLUGINS.find(p => p.id === selectedPluginId) || PLUGINS[0]
  const workspacePlugins = PLUGINS.filter(p => p.workspaceId === selectedWorkspaceId)
  const pinnedPlugins = PLUGINS.filter(p => p.isPinned)
  const recentPlugins = PLUGINS.filter(p => p.isRecent)

  // Toggle workspace expansion
  const toggleWorkspace = (workspaceId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation()
    
    setExpandedWorkspaces(prev => {
      const newSet = new Set(prev)
      if (newSet.has(workspaceId)) {
        newSet.delete(workspaceId)
      } else {
        newSet.add(workspaceId)
      }
      return newSet
    })
  }
  
  // Check if workspace is expanded
  const isWorkspaceExpanded = (workspaceId: string) => expandedWorkspaces.has(workspaceId)

  // Command palette hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when command palette opens
  useEffect(() => {
    if (isCommandPaletteOpen && commandInputRef.current) {
      setTimeout(() => {
        commandInputRef.current?.focus()
      }, 50)
    }
  }, [isCommandPaletteOpen])

  // Filtered plugins and workspaces for command palette
  const filteredWorkspaces = WORKSPACES.filter(workspace => 
    !searchQuery || 
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workspace.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const filteredPlugins = PLUGINS.filter(plugin => 
    !searchQuery || 
    plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Select a workspace and plugin
  const selectWorkspaceAndPlugin = (workspaceId: string, pluginId: string) => {
    setSelectedWorkspaceId(workspaceId)
    setSelectedPluginId(pluginId)
    setIsCommandPaletteOpen(false)
    
    // Ensure the workspace is expanded in the sidebar
    setExpandedWorkspaces(prev => {
      const newSet = new Set(prev)
      newSet.add(workspaceId)
      return newSet
    })
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <div className={`border-r border-border/20 h-full transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-[60px]' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-14 flex items-center px-4 border-b border-border/20">
            <div className="flex items-center gap-2.5">
              <Compass size={22} className="text-accent" />
              {!sidebarCollapsed && <span className="font-medium text-lg">Compass</span>}
            </div>
          </div>
          
          {/* Command palette button - always visible */}
          <div className="p-2">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className={`w-full rounded-md transition-colors ${
                sidebarCollapsed 
                  ? 'flex justify-center py-2 bg-accent/10 text-accent hover:bg-accent/20' 
                  : 'flex items-center gap-2 py-1.5 px-3 bg-accent/10 text-accent hover:bg-accent/20'
              }`}
            >
              <Command size={16} />
              {!sidebarCollapsed && (
                <>
                  <span className="text-sm font-medium">Find workspaces & plugins</span>
                  <span className="ml-auto text-xs bg-muted/40 px-1.5 py-0.5 rounded">⌘K</span>
                </>
              )}
            </button>
          </div>
          
          {/* Recent and pinned shortcuts */}
          {!sidebarCollapsed && (
            <div className="px-3 py-2 border-b border-border/20">
              <div className="flex items-center mb-2">
                <span className="text-xs font-medium text-muted-foreground">RECENT & PINNED</span>
              </div>
              <div className="space-y-1">
                {[...new Set([...pinnedPlugins, ...recentPlugins].map(p => p.id))].map(pluginId => {
                  const plugin = PLUGINS.find(p => p.id === pluginId)!
                  const workspace = WORKSPACES.find(w => w.id === plugin.workspaceId)!
                  
                  return (
                    <button
                      key={plugin.id}
                      onClick={() => selectWorkspaceAndPlugin(plugin.workspaceId, plugin.id)}
                      className={`flex items-center w-full rounded-md py-1 px-2 text-sm ${
                        selectedPluginId === plugin.id
                          ? 'bg-accent/10 text-accent'
                          : 'hover:bg-muted/20'
                      }`}
                    >
                      <plugin.icon size={14} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{plugin.name}</span>
                      {plugin.isPinned && (
                        <div className="ml-auto">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-400"></div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          
          {/* Workspace list */}
          <div className="flex-1 overflow-y-auto">
            {!sidebarCollapsed ? (
              <div className="px-3 py-2">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium text-muted-foreground">WORKSPACES</span>
                </div>
                <div className="space-y-1">
                  {WORKSPACES.map(workspace => (
                    <div key={workspace.id}>
                      <button
                        onClick={() => {
                          setSelectedWorkspaceId(workspace.id)
                          
                          // Select the first plugin of this workspace if current plugin is not in this workspace
                          const currentBelongsToSelected = PLUGINS.some(
                            p => p.id === selectedPluginId && p.workspaceId === workspace.id
                          )
                          
                          if (!currentBelongsToSelected) {
                            const firstPluginInWorkspace = PLUGINS.find(p => p.workspaceId === workspace.id)
                            if (firstPluginInWorkspace) {
                              setSelectedPluginId(firstPluginInWorkspace.id)
                            }
                          }
                          
                          if (!isWorkspaceExpanded(workspace.id)) {
                            toggleWorkspace(workspace.id)
                          }
                        }}
                        className={`flex items-center justify-between w-full rounded-md py-1.5 px-2 ${
                          selectedWorkspaceId === workspace.id
                            ? 'bg-accent/10 text-accent font-medium'
                            : 'hover:bg-muted/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <workspace.icon size={16} />
                          <span className="text-sm">{workspace.name}</span>
                        </div>
                        <button
                          onClick={(e) => toggleWorkspace(workspace.id, e)}
                          className={`p-0.5 rounded transition-transform ${
                            isWorkspaceExpanded(workspace.id) ? 'rotate-90' : ''
                          }`}
                        >
                          <ChevronRight size={14} className="text-muted-foreground" />
                        </button>
                      </button>
                      
                      {/* Plugins under expanded workspace */}
                      {isWorkspaceExpanded(workspace.id) && (
                        <div className="ml-6 pl-2 border-l border-border/30 mt-1 space-y-1 py-1">
                          {PLUGINS.filter(p => p.workspaceId === workspace.id).map(plugin => (
                            <button
                              key={plugin.id}
                              onClick={() => {
                                setSelectedWorkspaceId(workspace.id)
                                setSelectedPluginId(plugin.id)
                              }}
                              className={`flex items-center w-full rounded-md py-1 px-2 text-sm ${
                                selectedPluginId === plugin.id
                                  ? 'bg-accent/5 text-accent'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'
                              }`}
                            >
                              <Puzzle size={14} className="mr-2" />
                              <span>{plugin.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Collapsed view just shows icons
              <div className="py-4">
                {WORKSPACES.map(workspace => (
                  <button
                    key={workspace.id}
                    onClick={() => setSelectedWorkspaceId(workspace.id)}
                    className={`flex justify-center items-center w-full py-2 mb-1 ${
                      selectedWorkspaceId === workspace.id
                        ? 'text-accent'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title={workspace.name}
                  >
                    <workspace.icon size={20} />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Collapse toggle */}
          <div className="p-2 border-t border-border/20">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex justify-center items-center w-full py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/20"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <PanelLeftClose size={16} className={sidebarCollapsed ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with breadcrumb navigation */}
        <header className="h-14 border-b border-border/20 flex items-center px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 py-1.5 px-3 rounded-md bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center">
                <selectedWorkspace.icon size={16} className="text-accent" />
                <ChevronRight size={14} className="mx-1 text-muted-foreground" />
                <Puzzle size={14} />
              </div>
              <span className="font-medium">{selectedPlugin.name}</span>
              <Command size={14} className="ml-1 text-muted-foreground" />
            </button>
            
            <div className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full">
              {selectedWorkspace.name}
            </div>
          </div>
          
          <div className="ml-auto">
            {/* Additional header controls can go here */}
          </div>
        </header>
        
        {/* Content area with active workspace and plugin details */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6 gap-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center bg-accent/10`}>
                <selectedPlugin.icon size={32} className="text-accent" />
              </div>
              
              <div>
                <h1 className="text-2xl font-semibold">{selectedPlugin.name}</h1>
                <p className="text-muted-foreground">{selectedPlugin.description}</p>
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium mb-2">Start a conversation</h2>
              <p className="text-muted-foreground mb-4">What would you like to do with {selectedPlugin.name}?</p>
              
              <div className="bg-muted/20 p-4 rounded-md">
                <div className="border-b border-border/20 pb-3 mb-3">
                  <div className="text-sm font-medium mb-2">Suggested prompts:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button className="text-left p-2 rounded-md bg-accent/5 hover:bg-accent/10 text-accent border border-accent/20">
                      "Help me with {selectedPlugin.name.toLowerCase()}"
                    </button>
                    <button className="text-left p-2 rounded-md hover:bg-muted/30 border border-border/30">
                      "What can I do with {selectedPlugin.name.toLowerCase()}?"
                    </button>
                  </div>
                </div>
                
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder={`Ask about ${selectedPlugin.name.toLowerCase()}...`}
                    className="flex-1 bg-background border border-border/30 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent/30"
                  />
                  <button className="bg-accent text-white px-4 py-2 rounded-r-md hover:bg-accent/90">
                    Send
                  </button>
                </div>
              </div>
            </div>
            
            {/* Other plugins in the workspace */}
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Other {selectedWorkspace.name} plugins</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {workspacePlugins
                  .filter(p => p.id !== selectedPluginId)
                  .map(plugin => (
                    <button
                      key={plugin.id}
                      onClick={() => setSelectedPluginId(plugin.id)}
                      className="flex flex-col items-center p-4 rounded-lg border border-border/50 hover:border-accent/30 hover:bg-accent/5 transition-colors text-center"
                    >
                      <plugin.icon size={24} className="mb-2" />
                      <span className="font-medium">{plugin.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">{plugin.description}</span>
                    </button>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Command palette overlay */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div 
            className="bg-background border border-border rounded-lg shadow-lg w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-border/30">
              <div className="flex items-center gap-2">
                <Search size={18} className="text-muted-foreground" />
                <input
                  ref={commandInputRef}
                  type="text"
                  autoFocus
                  placeholder="Search workspaces and plugins..."
                  className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-xs text-muted-foreground">ESC</kbd>
              </div>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto">
              {/* Always-visible Quick Access section */}
              {!searchQuery && (
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/5 flex justify-between items-center">
                    <span>QUICK ACCESS</span>
                    <Sparkles size={12} className="text-amber-400" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {pinnedPlugins.slice(0, 4).map(plugin => {
                      const workspace = WORKSPACES.find(w => w.id === plugin.workspaceId)!
                      return (
                        <button
                          key={plugin.id}
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/20 transition-colors text-left"
                          onClick={() => selectWorkspaceAndPlugin(plugin.workspaceId, plugin.id)}
                        >
                          <div className={`w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center`}>
                            <plugin.icon size={16} className="text-accent" />
                          </div>
                          <div>
                            <div className="font-medium">{plugin.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center">
                              <workspace.icon size={10} className="mr-1" />
                              {workspace.name}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {/* Workspaces section */}
              {filteredWorkspaces.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/5 flex items-center">
                    <Layers size={12} className="mr-1" />
                    <span>WORKSPACES</span>
                  </div>
                  
                  <div className="p-1">
                    {filteredWorkspaces.map(workspace => (
                      <div key={workspace.id} className="mb-1">
                        <button
                          className={`flex items-center gap-3 w-full p-2 rounded-md hover:bg-muted/20 transition-colors text-left ${
                            selectedWorkspaceId === workspace.id ? 'bg-accent/5' : ''
                          }`}
                          onClick={() => {
                            setSelectedWorkspaceId(workspace.id)
                            const firstPlugin = PLUGINS.find(p => p.workspaceId === workspace.id)
                            if (firstPlugin) {
                              setSelectedPluginId(firstPlugin.id)
                            }
                            setIsCommandPaletteOpen(false)
                          }}
                        >
                          <div className="w-8 h-8 rounded-md bg-muted/30 flex items-center justify-center">
                            <workspace.icon size={18} />
                          </div>
                          <div>
                            <div className="font-medium">{workspace.name}</div>
                            <div className="text-xs text-muted-foreground">{workspace.description}</div>
                          </div>
                          <ChevronRight size={16} className="ml-auto text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Plugins section */}
              {filteredPlugins.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/5 flex items-center">
                    <Puzzle size={12} className="mr-1" />
                    <span>PLUGINS</span>
                  </div>
                  
                  <div className="p-1">
                    {filteredPlugins.map(plugin => {
                      const workspace = WORKSPACES.find(w => w.id === plugin.workspaceId)!
                      return (
                        <button
                          key={plugin.id}
                          className={`flex items-center gap-3 w-full p-2 rounded-md hover:bg-muted/20 transition-colors text-left ${
                            selectedPluginId === plugin.id ? 'bg-accent/5' : ''
                          }`}
                          onClick={() => selectWorkspaceAndPlugin(plugin.workspaceId, plugin.id)}
                        >
                          <div className="w-8 h-8 rounded-md bg-muted/30 flex items-center justify-center">
                            <plugin.icon size={18} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{plugin.name}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <workspace.icon size={10} className="mr-1" />
                              {workspace.name} • {plugin.description}
                            </div>
                          </div>
                          {plugin.isPinned && (
                            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {/* No results */}
              {searchQuery && filteredWorkspaces.length === 0 && filteredPlugins.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No workspaces or plugins match your search</p>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-border/30 bg-muted/5 flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Pro tip:</span> Use arrow keys to navigate, Enter to select
              </div>
              <button
                onClick={() => setIsCommandPaletteOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}