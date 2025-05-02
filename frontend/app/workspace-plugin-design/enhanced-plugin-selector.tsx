'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  ChevronDown, 
  Check, 
  Zap, 
  Rocket, 
  Brain, 
  FileText, 
  Database, 
  BarChart,
  Code2, 
  Building2, 
  Compass,
  MessageSquare,
  RefreshCw
} from 'lucide-react'
import { useWorkspaceContext } from './workspace-context'

// Types
interface ThinkingMode {
  id: string
  internalName: string
  label: string
  icon: React.ReactNode
  description: string
}

// Mock data for thinking modes
const THINKING_MODES: ThinkingMode[] = [
  {
    id: 'fast',
    internalName: 'fast',
    label: '⚡ Instant',
    icon: <Zap className="w-4 h-4" />,
    description: 'Blazing fast, minimal processing'
  },
  {
    id: 'normal',
    internalName: 'normal',
    label: '🚀 Standard',
    icon: <Rocket className="w-4 h-4" />,
    description: 'Good speed, general-purpose model'
  },
  {
    id: 'thinking',
    internalName: 'thinking',
    label: '🧠 Deep Thinker',
    icon: <Brain className="w-4 h-4" />,
    description: 'Slower but with richer reasoning'
  }
]

// Enhanced mock data for workspaces
const ENHANCED_WORKSPACES = [
  {
    id: 'engineering',
    name: 'Engineering',
    icon: Compass,
    description: 'Software development tools and resources',
    plugins: [
      {
        id: 'code-assistant',
        name: 'Code Assistant',
        icon: Code2,
        description: 'AI-powered coding help and suggestions',
        compatibleSwitch: true
      },
      {
        id: 'doc-qa',
        name: 'Technical Docs',
        icon: FileText,
        description: 'Ask questions about technical documentation',
        compatibleSwitch: true
      }
    ]
  },
  {
    id: 'data',
    name: 'Data Engineering',
    icon: Database,
    description: 'Data processing and analytics tools',
    plugins: [
      {
        id: 'db-query',
        name: 'Database Query',
        icon: Database,
        description: 'Query databases using natural language',
        compatibleSwitch: false
      },
      {
        id: 'data-viz',
        name: 'Data Visualization',
        icon: BarChart,
        description: 'Create charts and visualizations from data',
        compatibleSwitch: false
      }
    ]
  },
  {
    id: 'general',
    name: 'General',
    icon: MessageSquare,
    description: 'General-purpose assistance',
    plugins: [
      {
        id: 'chat',
        name: 'Basic Chat',
        icon: MessageSquare,
        description: 'General conversational assistant',
        compatibleSwitch: true
      }
    ]
  },
  {
    id: 'corporate',
    name: 'Corporate',
    icon: Building2,
    description: 'Business and corporate resources',
    plugins: [
      {
        id: 'market-analysis',
        name: 'Market Analysis',
        icon: BarChart,
        description: 'Analyze market trends and data',
        compatibleSwitch: false
      }
    ]
  }
]

interface EnhancedPluginSelectorProps {
  selectedThinkingMode: string;
  onThinkingModeChange: (modeId: string) => void;
  onWorkspacePluginChange: (workspaceId: string, pluginId: string) => void;
}

export function EnhancedPluginSelector({
  selectedThinkingMode = 'normal',
  onThinkingModeChange,
  onWorkspacePluginChange
}: EnhancedPluginSelectorProps) {
  const { 
    selectedWorkspaceId, 
    selectedPluginId
  } = useWorkspaceContext()
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(selectedWorkspaceId)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Find currently selected workspace, plugin, and thinking mode
  const selectedWorkspace = ENHANCED_WORKSPACES.find(w => w.id === selectedWorkspaceId) 
    || ENHANCED_WORKSPACES[0]
    
  const selectedPlugin = selectedWorkspace.plugins.find(p => p.id === selectedPluginId)
    || selectedWorkspace.plugins[0]
    
  const selectedMode = THINKING_MODES.find(m => m.id === selectedThinkingMode)
    || THINKING_MODES[1]
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Reset active workspace when dropdown opens
  useEffect(() => {
    if (isDropdownOpen) {
      setActiveWorkspaceId(selectedWorkspaceId)
    }
  }, [isDropdownOpen, selectedWorkspaceId])
  
  // Handle workspace change
  const handleWorkspaceChange = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId)
  }
  
  // Handle plugin selection
  const handlePluginSelect = (workspaceId: string, pluginId: string) => {
    onWorkspacePluginChange(workspaceId, pluginId)
    setIsDropdownOpen(false)
  }
  
  // Handle thinking mode change
  const handleThinkingModeChange = (modeId: string) => {
    onThinkingModeChange(modeId)
  }
  
  // Get active workspace
  const activeWorkspace = ENHANCED_WORKSPACES.find(w => w.id === activeWorkspaceId) 
    || ENHANCED_WORKSPACES[0]
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button to toggle the dropdown */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 h-9 px-3 rounded-md transition-colors bg-background border border-border/50 hover:bg-muted/30 text-sm"
        aria-expanded={isDropdownOpen}
      >
        <div className="flex items-center gap-1.5">
          {selectedWorkspace.icon && <selectedWorkspace.icon size={14} className="text-muted-foreground" />}
          <span className="font-medium text-sm">{selectedWorkspace.name}</span>
          <span className="text-muted-foreground">/</span>
          {selectedPlugin.icon && <selectedPlugin.icon size={14} className="text-accent" />}
          <span className="text-accent font-medium">{selectedPlugin.name}</span>
          <div className="h-4 w-px bg-border/50 mx-1"></div>
          <div className="flex items-center gap-1 text-xs">
            {selectedMode.icon}
            <span>{selectedMode.label}</span>
          </div>
        </div>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Enhanced dropdown with three columns */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 bg-background rounded-md shadow-lg border border-border/10 z-50 overflow-hidden w-[760px]">
          <div className="grid grid-cols-3 divide-x divide-border/10">
            {/* Column 1: Workspaces */}
            <div className="p-1">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground">Workspace</div>
              <div className="max-h-[320px] overflow-y-auto">
                {ENHANCED_WORKSPACES.map(workspace => (
                  <button
                    key={workspace.id}
                    className={`w-full flex items-start gap-2 p-2 hover:bg-muted/30 rounded-md transition-colors text-left ${
                      activeWorkspaceId === workspace.id ? 'bg-muted/20' : ''
                    }`}
                    onClick={() => handleWorkspaceChange(workspace.id)}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted/40 flex items-center justify-center">
                      <workspace.icon size={16} className="text-foreground/80" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{workspace.name}</span>
                        {activeWorkspaceId === workspace.id && (
                          <Check size={14} className="text-accent" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {workspace.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Column 2: Plugins for selected workspace */}
            <div className="p-1">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground">Plugin</div>
              <div className="max-h-[320px] overflow-y-auto">
                {activeWorkspace.plugins.map(plugin => (
                  <button
                    key={plugin.id}
                    className={`w-full flex items-start gap-2 p-2 hover:bg-muted/30 rounded-md transition-colors text-left ${
                      selectedPluginId === plugin.id && selectedWorkspaceId === activeWorkspaceId ? 'bg-muted/20' : ''
                    }`}
                    onClick={() => handlePluginSelect(activeWorkspace.id, plugin.id)}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
                      <plugin.icon size={16} className="text-foreground/80" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{plugin.name}</span>
                        {selectedPluginId === plugin.id && selectedWorkspaceId === activeWorkspaceId && (
                          <Check size={14} className="text-accent" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {plugin.description}
                      </div>
                      {!plugin.compatibleSwitch && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-amber-500">
                          <RefreshCw size={10} />
                          <span>Start new chat</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Column 3: Thinking Mode */}
            <div className="p-1">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground">Thinking Mode</div>
              <div className="max-h-[320px] overflow-y-auto">
                {THINKING_MODES.map(mode => (
                  <button
                    key={mode.id}
                    className={`w-full flex items-start gap-2 p-2 hover:bg-muted/30 rounded-md transition-colors text-left ${
                      selectedThinkingMode === mode.id ? 'bg-muted/20' : ''
                    }`}
                    onClick={() => handleThinkingModeChange(mode.id)}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted/40 flex items-center justify-center">
                      {mode.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{mode.label}</span>
                        {selectedThinkingMode === mode.id && (
                          <Check size={14} className="text-accent" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {mode.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Internal name: <span className="font-mono">{mode.internalName}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}