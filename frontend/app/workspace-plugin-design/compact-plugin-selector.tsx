'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  ChevronDown, 
  ChevronRight,
  AppWindow,
  Users,
  Mountain,
  Wallet,
  Compass,
  ServerCog,
  SearchCode,
  Code2,
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
  X,
  Rocket,
  Brain
} from 'lucide-react'
import { useWorkspaceContext } from './workspace-context'

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

// Workspaces and plugins data
const ENHANCED_WORKSPACES = [
  {
    id: "general",
    name: "General",
    icon: "app_window",
    description: "Common AI capabilities for general use",
    plugins: [
      { 
        id: "general", 
        name: "General", 
        icon: "app_window",
        description: "Basic AI assistance for general inquiries"
      },
      { 
        id: "hr_assistant", 
        name: "HR assistant", 
        icon: "users",
        description: "Help with HR-related questions and policies"
      },
      { 
        id: "career_development", 
        name: "Career development", 
        icon: "mountain",
        description: "Career growth and development assistance"
      },
      { 
        id: "my_benefits", 
        name: "My Benefits", 
        icon: "wallet",
        description: "Information about employee benefits"
      },
      { 
        id: "compass_assistant", 
        name: "Compass Assistant", 
        icon: "compass",
        description: "Help with using the Compass platform"
      }
    ]
  },
  {
    id: "dscoe",
    name: "DSCOE",
    icon: "server_cog",
    description: "Data Science Center of Excellence tools",
    plugins: [
      { 
        id: "databricks_onboarding", 
        name: "Databricks Onboarding", 
        icon: "rocket",
        description: "Get started with Databricks platform"
      },
      { 
        id: "dscoe_search_assistant", 
        name: "DSCOE Search assistant", 
        icon: "search_code",
        description: "Search through DSCOE documentation"
      },
      { 
        id: "code_writing_assistant", 
        name: "Code writing assistant", 
        icon: "code",
        description: "Help with writing and debugging code"
      },
      { 
        id: "sri_assistant", 
        name: "SRI assistant", 
        icon: "flask_conical",
        description: "Support for scientific research initiatives"
      }
    ]
  },
  {
    id: "bluecard_its",
    name: "BlueCard ITS",
    icon: "badge_info",
    description: "BlueCard Information Technology Services",
    plugins: [
      { 
        id: "onboarding", 
        name: "Onboarding", 
        icon: "log_in",
        description: "Onboarding process for new employees"
      },
      { 
        id: "bluecard_search_assistant", 
        name: "BlueCard Search assistant", 
        icon: "search",
        description: "Search through BlueCard documentation"
      },
      { 
        id: "bcbsa_assistant", 
        name: "BCBSA assistant", 
        icon: "handshake",
        description: "Help with BCBSA-related inquiries"
      }
    ]
  },
  {
    id: "corporate_compliance",
    name: "Corporate Compliance",
    icon: "shield_check",
    description: "Compliance and regulatory resources",
    plugins: [
      { 
        id: "compliance_search_assistant", 
        name: "Compliance Search assistant", 
        icon: "search_check",
        description: "Search through compliance documentation"
      },
      { 
        id: "contract_doc_compare", 
        name: "Contract/Doc compare", 
        icon: "file_diff",
        description: "Compare and analyze contract documents"
      },
      { 
        id: "compliance_quiz_training", 
        name: "Compliance quiz/training", 
        icon: "graduation_cap",
        description: "Interactive compliance training and quizzes"
      },
      { 
        id: "vendor_report", 
        name: "Vendor report", 
        icon: "file_bar_chart",
        description: "Generate and analyze vendor reports"
      }
    ]
  },
  {
    id: "marketing_research",
    name: "Marketing Research",
    icon: "bar_chart_3",
    description: "Marketing analysis and research tools",
    plugins: [
      { 
        id: "marketing_search_assistant", 
        name: "Marketing Search assistant", 
        icon: "search",
        description: "Search through marketing resources"
      },
      { 
        id: "nps_topic_modeling", 
        name: "NPS topic modeling", 
        icon: "brain",
        description: "Analyze Net Promoter Score feedback"
      }
    ]
  },
  {
    id: "subrogation",
    name: "Subrogation",
    icon: "scales",
    description: "Subrogation claims and processing",
    plugins: [
      { 
        id: "subrogation_assistant", 
        name: "Subrogation assistant", 
        icon: "gavel",
        description: "Help with subrogation processes"
      }
    ]
  },
  {
    id: "data_management",
    name: "Data Management",
    icon: "database",
    description: "Data management and migration tools",
    plugins: [
      { 
        id: "data_management_assistant", 
        name: "Data Management assistant", 
        icon: "database",
        description: "Help with data management tasks"
      },
      { 
        id: "big_query_migration_assistant", 
        name: "Big Query migration assistant (SAS to GCP)", 
        icon: "move_right",
        description: "Assist with SAS to GCP BigQuery migrations"
      }
    ]
  }
]

interface CompactPluginSelectorProps {
  onWorkspacePluginChange: (workspaceId: string, pluginId: string) => void;
}

export function CompactPluginSelector({
  onWorkspacePluginChange
}: CompactPluginSelectorProps) {
  // States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredWorkspaceId, setHoveredWorkspaceId] = useState<string | null>(null)
  const { selectedWorkspaceId, selectedPluginId } = useWorkspaceContext()
  
  // References
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Find currently selected workspace and plugin
  const selectedWorkspace = ENHANCED_WORKSPACES.find(w => w.id === selectedWorkspaceId) 
    || ENHANCED_WORKSPACES[0]
    
  const selectedPlugin = selectedWorkspace.plugins.find(p => p.id === selectedPluginId)
    || selectedWorkspace.plugins[0]
  
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
  const filteredWorkspaces = ENHANCED_WORKSPACES.filter(workspace => {
    if (!searchQuery) return true;
    
    const matchWorkspace = 
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchPlugins = workspace.plugins.some(plugin => 
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return matchWorkspace || matchPlugins;
  });
  
  // Get hovered workspace
  const hoveredWorkspace = hoveredWorkspaceId 
    ? ENHANCED_WORKSPACES.find(w => w.id === hoveredWorkspaceId) 
    : null
  
  // Handle plugin selection
  const handlePluginSelect = (workspaceId: string, pluginId: string) => {
    onWorkspacePluginChange(workspaceId, pluginId)
    setIsDropdownOpen(false)
  }
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button to toggle dropdown */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 h-9 px-3 rounded-md transition-colors bg-background border border-border/50 hover:bg-muted/30 text-sm"
        aria-expanded={isDropdownOpen}
      >
        <div className="flex items-center gap-1.5">
          {React.createElement(getIcon(selectedWorkspace.icon), { size: 14, className: "text-muted-foreground" })}
          <span className="font-medium text-sm">{selectedWorkspace.name}</span>
          <span className="text-muted-foreground">/</span>
          {React.createElement(getIcon(selectedPlugin.icon), { size: 14, className: "text-accent" })}
          <span className="text-accent font-medium">{selectedPlugin.name}</span>
        </div>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Redesigned dropdown with hover submenu */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 rounded-md shadow-lg border border-border/10 z-50 overflow-visible" style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}>
          {/* Header with search */}
          <div className="border-b border-border/10 p-2 flex items-center w-[280px]">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workspaces and plugins..."
                className="w-full h-8 text-xs pl-8 pr-3 py-2 rounded border border-border/20 bg-muted/10 focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
          
          {/* Single column for workspaces with hover functionality */}
          <div className="w-[280px]">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/10">
              Workspaces
            </div>
            <div className="max-h-[320px] overflow-y-auto p-1">
              {filteredWorkspaces.map(workspace => (
                <div 
                  key={workspace.id}
                  className="relative"
                  onMouseEnter={() => setHoveredWorkspaceId(workspace.id)}
                  onMouseLeave={() => setHoveredWorkspaceId(null)}
                >
                  <div 
                    id={`workspace-item-${workspace.id}`}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-sm hover:bg-muted/30 rounded-md transition-colors text-left ${
                      hoveredWorkspaceId === workspace.id ? 'bg-muted/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {React.createElement(getIcon(workspace.icon), { 
                        size: 15, 
                        className: selectedWorkspaceId === workspace.id ? "text-accent" : "text-muted-foreground" 
                      })}
                      <span className="truncate">{workspace.name}</span>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </div>
                  
                  {/* Plugins submenu (shown on hover) */}
                  {hoveredWorkspaceId === workspace.id && (
                    <div 
                      className="fixed rounded-md shadow-lg border border-border/10 z-50 overflow-hidden w-[240px]"
                      style={{ 
                        backgroundColor: 'hsl(var(--sidebar-background))',
                        left: '280px', // Position to the right of the main menu
                        top: (() => {
                          // Get the parent element's position
                          const parentEl = document.getElementById(`workspace-item-${workspace.id}`);
                          if (parentEl) {
                            const rect = parentEl.getBoundingClientRect();
                            return `${rect.top}px`;
                          }
                          return 'auto';
                        })()
                      }}
                    >
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/10">
                        {workspace.name} Plugins
                      </div>
                      <div className="max-h-[320px] overflow-y-auto p-1">
                        {workspace.plugins
                          .filter(plugin => searchQuery
                            ? plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
                            : true
                          )
                          .map(plugin => (
                            <button
                              key={plugin.id}
                              className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted/30 rounded-md transition-colors text-left ${
                                selectedPluginId === plugin.id && selectedWorkspaceId === workspace.id ? 'bg-muted/20' : ''
                              }`}
                              onClick={() => handlePluginSelect(workspace.id, plugin.id)}
                            >
                              {React.createElement(getIcon(plugin.icon), { 
                                size: 15,
                                className: selectedPluginId === plugin.id && selectedWorkspaceId === workspace.id 
                                  ? "text-accent" 
                                  : "text-muted-foreground" 
                              })}
                              <span className="truncate">{plugin.name}</span>
                            </button>
                          ))
                        }
                        
                        {workspace.plugins.filter(plugin => 
                          searchQuery 
                            ? plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
                            : true
                        ).length === 0 && (
                          <div className="text-center text-muted-foreground text-xs p-4">
                            No plugins found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredWorkspaces.length === 0 && (
                <div className="text-center text-muted-foreground text-xs p-4">
                  No workspaces found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}