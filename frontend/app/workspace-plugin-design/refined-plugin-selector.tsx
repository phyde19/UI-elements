'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  ChevronDown, 
  Check, 
  Zap, 
  Rocket, 
  Brain,
  AppWindow,
  Users,
  Mountain,
  Wallet,
  Compass,
  ServerCog,
  SearchCode,
  Code,
  FlaskConical,
  BadgeInfo,
  LogIn,
  Search,
  Handshake,
  ShieldCheck,
  SearchCheck,
  FileDiff,
  GraduationCap,
  FileBarChart,
  BarChart3,
  Gavel, 
  Database,
  MoveRight,
  Scales,
  RefreshCw,
  X
} from 'lucide-react'
import { useWorkspaceContext } from './workspace-context'

// Map icon names to Lucide components
const iconMap = {
  app_window: AppWindow,
  users: Users,
  mountain: Mountain,
  wallet: Wallet,
  compass: Compass,
  server_cog: ServerCog,
  rocket: Rocket,
  search_code: SearchCode,
  code: Code,
  flask_conical: FlaskConical,
  badge_info: BadgeInfo,
  log_in: LogIn,
  search: Search,
  handshake: Handshake,
  shield_check: ShieldCheck,
  search_check: SearchCheck,
  file_diff: FileDiff,
  graduation_cap: GraduationCap,
  file_bar_chart: FileBarChart,
  bar_chart_3: BarChart3,
  gavel: Gavel,
  database: Database,
  move_right: MoveRight,
  scales: Scales
}

// Get icon component by name
const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || AppWindow
}

// Types
interface ThinkingMode {
  id: string
  internalName: string
  label: string
  icon: React.ReactNode
  description: string
}

interface Plugin {
  name: string
  displayName: string
  icon: string
  compatibleSwitch?: boolean
}

interface Workspace {
  name: string
  displayName: string
  icon: string
  plugins: Plugin[]
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

// Workspaces and plugins data
const WORKSPACES: Workspace[] = [
  {
    name: "general",
    displayName: "General",
    icon: "app_window",
    plugins: [
      { name: "general", displayName: "General", icon: "app_window", compatibleSwitch: true },
      { name: "hr_assistant", displayName: "HR assistant", icon: "users", compatibleSwitch: true },
      { name: "career_development", displayName: "Career development", icon: "mountain", compatibleSwitch: true },
      { name: "my_benefits", displayName: "My Benefits", icon: "wallet", compatibleSwitch: true },
      { name: "compass_assistant", displayName: "Compass Assistant", icon: "compass", compatibleSwitch: true }
    ]
  },
  {
    name: "dscoe",
    displayName: "DSCOE",
    icon: "server_cog",
    plugins: [
      { name: "databricks_onboarding", displayName: "Databricks Onboarding", icon: "rocket", compatibleSwitch: false },
      { name: "dscoe_search_assistant", displayName: "DSCOE Search assistant", icon: "search_code", compatibleSwitch: true },
      { name: "code_writing_assistant", displayName: "Code writing assistant", icon: "code", compatibleSwitch: true },
      { name: "sri_assistant", displayName: "SRI assistant", icon: "flask_conical", compatibleSwitch: false }
    ]
  },
  {
    name: "bluecard_its",
    displayName: "BlueCard ITS",
    icon: "badge_info",
    plugins: [
      { name: "onboarding", displayName: "Onboarding", icon: "log_in", compatibleSwitch: false },
      { name: "bluecard_search_assistant", displayName: "BlueCard Search assistant", icon: "search", compatibleSwitch: true },
      { name: "bcbsa_assistant", displayName: "BCBSA assistant", icon: "handshake", compatibleSwitch: true }
    ]
  },
  {
    name: "corporate_compliance",
    displayName: "Corporate Compliance",
    icon: "shield_check",
    plugins: [
      { name: "compliance_search_assistant", displayName: "Compliance Search assistant", icon: "search_check", compatibleSwitch: true },
      { name: "contract_doc_compare", displayName: "Contract/Doc compare", icon: "file_diff", compatibleSwitch: false },
      { name: "compliance_quiz_training", displayName: "Compliance quiz/training", icon: "graduation_cap", compatibleSwitch: false },
      { name: "vendor_report", displayName: "Vendor report", icon: "file_bar_chart", compatibleSwitch: false }
    ]
  },
  {
    name: "marketing_research",
    displayName: "Marketing Research",
    icon: "bar_chart_3",
    plugins: [
      { name: "marketing_search_assistant", displayName: "Marketing Search assistant", icon: "search", compatibleSwitch: true },
      { name: "nps_topic_modeling", displayName: "NPS topic modeling", icon: "brain", compatibleSwitch: false }
    ]
  },
  {
    name: "subrogation",
    displayName: "Subrogation",
    icon: "scales",
    plugins: [
      { name: "subrogation_assistant", displayName: "Subrogation assistant", icon: "gavel", compatibleSwitch: true }
    ]
  },
  {
    name: "data_management",
    displayName: "Data Management",
    icon: "database",
    plugins: [
      { name: "data_management_assistant", displayName: "DataManagement assistant", icon: "database", compatibleSwitch: true },
      { name: "big_query_migration_assistant", displayName: "Big Query migration assistant (SAS to GCP)", icon: "move_right", compatibleSwitch: false }
    ]
  }
]

interface RefinedPluginSelectorProps {
  selectedThinkingMode: string;
  onThinkingModeChange: (modeId: string) => void;
  onWorkspacePluginChange: (workspaceId: string, pluginId: string) => void;
}

export function RefinedPluginSelector({
  selectedThinkingMode = 'normal',
  onThinkingModeChange,
  onWorkspacePluginChange
}: RefinedPluginSelectorProps) {
  // States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'workspaces' | 'thinking'>('workspaces')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeWorkspaceName, setActiveWorkspaceName] = useState(WORKSPACES[0].name)
  
  // References
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Get currently selected workspace and plugin
  const selectedWorkspace = WORKSPACES.find(w => w.name === activeWorkspaceName) || WORKSPACES[0]
  const activeWorkspace = WORKSPACES.find(w => w.name === activeWorkspaceName) || WORKSPACES[0]
  const selectedMode = THINKING_MODES.find(m => m.id === selectedThinkingMode) || THINKING_MODES[1]
  
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
  
  // Filter workspaces and plugins based on search
  const filteredWorkspaces = WORKSPACES.filter(workspace => {
    if (!searchQuery) return true;
    
    const matchWorkspace = 
      workspace.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchPlugins = workspace.plugins.some(plugin => 
      plugin.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return matchWorkspace || matchPlugins;
  });
  
  // Handle plugin selection
  const handlePluginSelect = (workspaceName: string, pluginName: string) => {
    onWorkspacePluginChange(workspaceName, pluginName)
    setIsDropdownOpen(false)
  }
  
  // Handle thinking mode change
  const handleThinkingModeChange = (modeId: string) => {
    onThinkingModeChange(modeId)
    setIsDropdownOpen(false)
  }
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button to toggle dropdown - NOT CHANGING THIS */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 h-9 px-3 rounded-md transition-colors bg-background border border-border/50 hover:bg-muted/30 text-sm"
        aria-expanded={isDropdownOpen}
      >
        <div className="flex items-center gap-1.5">
          {/* Display selected workspace icon */}
          {selectedWorkspace && (
            <>
              {React.createElement(getIconComponent(selectedWorkspace.icon), { size: 14, className: "text-muted-foreground" })}
              <span className="font-medium text-sm">{selectedWorkspace.displayName}</span>
              <span className="text-muted-foreground">/</span>
            </>
          )}
          
          {/* This would be the selected plugin */}
          <Code size={14} className="text-accent" />
          <span className="text-accent font-medium">Code Assistant</span>
          
          <div className="h-4 w-px bg-border/50 mx-1"></div>
          
          {/* Selected thinking mode */}
          <div className="flex items-center gap-1 text-xs">
            {selectedMode.icon}
            <span>{selectedMode.label}</span>
          </div>
        </div>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Refined, more compact dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 bg-background rounded-md shadow-lg border border-border/10 z-50 overflow-hidden w-[680px]">
          {/* Header with tabs and search */}
          <div className="border-b border-border/10 p-2 flex items-center gap-2">
            {/* Tabs */}
            <div className="flex rounded-md overflow-hidden border border-border/20">
              <button 
                className={`px-3 py-1 text-xs font-medium ${activeTab === 'workspaces' ? 'bg-accent/10 text-accent' : 'bg-muted/10 text-muted-foreground hover:bg-muted/20'}`}
                onClick={() => setActiveTab('workspaces')}
              >
                Workspaces & Plugins
              </button>
              <button 
                className={`px-3 py-1 text-xs font-medium ${activeTab === 'thinking' ? 'bg-accent/10 text-accent' : 'bg-muted/10 text-muted-foreground hover:bg-muted/20'}`}
                onClick={() => setActiveTab('thinking')}
              >
                Thinking Mode
              </button>
            </div>
            
            {/* Search input */}
            {activeTab === 'workspaces' && (
              <div className="flex-1 flex">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search workspaces and plugins..."
                    className="w-full h-7 text-xs pl-7 pr-2 rounded border border-border/20 bg-muted/10 focus:outline-none focus:ring-1 focus:ring-accent/30"
                  />
                  <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Content based on active tab */}
          {activeTab === 'workspaces' && (
            <div className="flex h-[320px]">
              {/* Workspace list */}
              <div className="w-56 border-r border-border/10 p-1 overflow-y-auto">
                {filteredWorkspaces.map(workspace => (
                  <button
                    key={workspace.name}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted/30 rounded-md transition-colors text-left ${
                      activeWorkspaceName === workspace.name ? 'bg-muted/20' : ''
                    }`}
                    onClick={() => setActiveWorkspaceName(workspace.name)}
                  >
                    {React.createElement(getIconComponent(workspace.icon), { 
                      size: 15, 
                      className: activeWorkspaceName === workspace.name ? "text-accent" : "text-muted-foreground" 
                    })}
                    <span className="truncate">{workspace.displayName}</span>
                  </button>
                ))}
                
                {filteredWorkspaces.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm p-4">
                    No workspaces found matching your search
                  </div>
                )}
              </div>
              
              {/* Plugins for selected workspace */}
              <div className="flex-1 p-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-1">
                  {activeWorkspace.plugins
                    .filter(plugin => searchQuery
                      ? plugin.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
                      : true
                    )
                    .map(plugin => (
                    <button
                      key={plugin.name}
                      className="flex items-start gap-2 p-2 hover:bg-muted/30 rounded-md transition-colors text-left"
                      onClick={() => handlePluginSelect(activeWorkspace.name, plugin.name)}
                    >
                      <div className="flex-shrink-0 w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center">
                        {React.createElement(getIconComponent(plugin.icon), { size: 14 })}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{plugin.displayName}</div>
                        {plugin.compatibleSwitch === false && (
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-amber-500">
                            <RefreshCw size={10} />
                            <span>Start new chat</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                  
                  {activeWorkspace.plugins.filter(plugin => 
                    searchQuery 
                      ? plugin.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
                      : true
                  ).length === 0 && (
                    <div className="col-span-2 text-center text-muted-foreground text-sm p-4">
                      No plugins found matching your search
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Thinking modes tab */}
          {activeTab === 'thinking' && (
            <div className="p-2">
              <div className="grid grid-cols-3 gap-2">
                {THINKING_MODES.map(mode => (
                  <button
                    key={mode.id}
                    className={`flex items-start gap-2 p-2 hover:bg-muted/30 rounded-md transition-colors text-left ${
                      selectedThinkingMode === mode.id ? 'bg-muted/20 ring-1 ring-accent/30' : ''
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
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}