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
  RefreshCw,
  AppWindow,
  Users,
  Mountain,
  Wallet,
  ServerCog,
  SearchCode,
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
  MoveRight,
  Scales
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

// Icon mapping for workspaces and plugins
const getIcon = (iconName) => {
  const iconMap = {
    app_window: AppWindow,
    users: Users,
    mountain: Mountain,
    wallet: Wallet,
    compass: Compass,
    server_cog: ServerCog,
    rocket: Rocket,
    search_code: SearchCode,
    code: Code2,
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
    gavel: Scales,
    database: Database,
    move_right: MoveRight,
    scales: Scales,
  };
  
  return iconMap[iconName] || AppWindow;
};

// Enhanced data for workspaces with descriptions
const ENHANCED_WORKSPACES = [
  {
    id: "general",
    name: "General",
    icon: getIcon("app_window"),
    description: "Common AI capabilities for general use",
    plugins: [
      { 
        id: "general", 
        name: "General", 
        icon: getIcon("app_window"),
        description: "Basic AI assistance for general inquiries",
        compatibleSwitch: true 
      },
      { 
        id: "hr_assistant", 
        name: "HR assistant", 
        icon: getIcon("users"),
        description: "Help with HR-related questions and policies",
        compatibleSwitch: true 
      },
      { 
        id: "career_development", 
        name: "Career development", 
        icon: getIcon("mountain"),
        description: "Career growth and development assistance",
        compatibleSwitch: true 
      },
      { 
        id: "my_benefits", 
        name: "My Benefits", 
        icon: getIcon("wallet"),
        description: "Information about employee benefits",
        compatibleSwitch: true 
      },
      { 
        id: "compass_assistant", 
        name: "Compass Assistant", 
        icon: getIcon("compass"),
        description: "Help with using the Compass platform",
        compatibleSwitch: true 
      }
    ]
  },
  {
    id: "dscoe",
    name: "DSCOE",
    icon: getIcon("server_cog"),
    description: "Data Science Center of Excellence tools",
    plugins: [
      { 
        id: "databricks_onboarding", 
        name: "Databricks Onboarding", 
        icon: getIcon("rocket"),
        description: "Get started with Databricks platform",
        compatibleSwitch: false 
      },
      { 
        id: "dscoe_search_assistant", 
        name: "DSCOE Search assistant", 
        icon: getIcon("search_code"),
        description: "Search through DSCOE documentation",
        compatibleSwitch: true 
      },
      { 
        id: "code_writing_assistant", 
        name: "Code writing assistant", 
        icon: getIcon("code"),
        description: "Help with writing and debugging code",
        compatibleSwitch: true 
      },
      { 
        id: "sri_assistant", 
        name: "SRI assistant", 
        icon: getIcon("flask_conical"),
        description: "Support for scientific research initiatives",
        compatibleSwitch: false 
      }
    ]
  },
  {
    id: "bluecard_its",
    name: "BlueCard ITS",
    icon: getIcon("badge_info"),
    description: "BlueCard Information Technology Services",
    plugins: [
      { 
        id: "onboarding", 
        name: "Onboarding", 
        icon: getIcon("log_in"),
        description: "Onboarding process for new employees",
        compatibleSwitch: false 
      },
      { 
        id: "bluecard_search_assistant", 
        name: "BlueCard Search assistant", 
        icon: getIcon("search"),
        description: "Search through BlueCard documentation",
        compatibleSwitch: true 
      },
      { 
        id: "bcbsa_assistant", 
        name: "BCBSA assistant", 
        icon: getIcon("handshake"),
        description: "Help with BCBSA-related inquiries",
        compatibleSwitch: true 
      }
    ]
  },
  {
    id: "corporate_compliance",
    name: "Corporate Compliance",
    icon: getIcon("shield_check"),
    description: "Compliance and regulatory resources",
    plugins: [
      { 
        id: "compliance_search_assistant", 
        name: "Compliance Search assistant", 
        icon: getIcon("search_check"),
        description: "Search through compliance documentation",
        compatibleSwitch: true 
      },
      { 
        id: "contract_doc_compare", 
        name: "Contract/Doc compare", 
        icon: getIcon("file_diff"),
        description: "Compare and analyze contract documents",
        compatibleSwitch: false 
      },
      { 
        id: "compliance_quiz_training", 
        name: "Compliance quiz/training", 
        icon: getIcon("graduation_cap"),
        description: "Interactive compliance training and quizzes",
        compatibleSwitch: false 
      },
      { 
        id: "vendor_report", 
        name: "Vendor report", 
        icon: getIcon("file_bar_chart"),
        description: "Generate and analyze vendor reports",
        compatibleSwitch: false 
      }
    ]
  },
  {
    id: "marketing_research",
    name: "Marketing Research",
    icon: getIcon("bar_chart_3"),
    description: "Marketing analysis and research tools",
    plugins: [
      { 
        id: "marketing_search_assistant", 
        name: "Marketing Search assistant", 
        icon: getIcon("search"),
        description: "Search through marketing resources",
        compatibleSwitch: true 
      },
      { 
        id: "nps_topic_modeling", 
        name: "NPS topic modeling", 
        icon: getIcon("brain"),
        description: "Analyze Net Promoter Score feedback",
        compatibleSwitch: false 
      }
    ]
  },
  {
    id: "subrogation",
    name: "Subrogation",
    icon: getIcon("scales"),
    description: "Subrogation claims and processing",
    plugins: [
      { 
        id: "subrogation_assistant", 
        name: "Subrogation assistant", 
        icon: getIcon("gavel"),
        description: "Help with subrogation processes",
        compatibleSwitch: true 
      }
    ]
  },
  {
    id: "data_management",
    name: "Data Management",
    icon: getIcon("database"),
    description: "Data management and migration tools",
    plugins: [
      { 
        id: "data_management_assistant", 
        name: "Data Management assistant", 
        icon: getIcon("database"),
        description: "Help with data management tasks",
        compatibleSwitch: true 
      },
      { 
        id: "big_query_migration_assistant", 
        name: "Big Query migration assistant (SAS to GCP)", 
        icon: getIcon("move_right"),
        description: "Assist with SAS to GCP BigQuery migrations",
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
    // Find the plugin
    const workspace = ENHANCED_WORKSPACES.find(w => w.id === workspaceId);
    const plugin = workspace?.plugins.find(p => p.id === pluginId);
    
    // Only allow switching to compatible plugins
    if (plugin && plugin.compatibleSwitch) {
      onWorkspacePluginChange(workspaceId, pluginId)
      setIsDropdownOpen(false)
    }
    // For incompatible plugins, just close the dropdown without doing anything
    else {
      setIsDropdownOpen(false)
    }
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