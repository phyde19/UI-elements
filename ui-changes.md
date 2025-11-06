// workspace plugin menu
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
  X,
  Scale,
  ZapIcon,
  BrainCogIcon,
  ChevronRight,
  LucideIcon,
  CompassIcon,
  Notebook,
  NotebookPen,
  CodeXml
} from 'lucide-react'
import { useCompassStore } from '@/hooks/store-context';
import useChatSession from '@/hooks/useChatSession';

/** ----------------------------------------------------------------
 *  Workspace‑level icons
 *  ---------------------------------------------------------------- */
const workspaceIcons: Record<string, LucideIcon> = {
  general: AppWindow,
  dscoe: ServerCog,
  bluecard_its: BadgeInfo,
  corporate_compliance: ShieldCheck,
  marketing_research: BarChart3,
  subrogation: Scale,
  data_management: Database,
  development: CodeXml
};

/** ----------------------------------------------------------------
 *  Plugin‑level icons (keyed by `workspaceId → pluginId`)
 *  ---------------------------------------------------------------- */
const pluginIcons: Record<
  string,
  Record<string, LucideIcon>
> = {
  general: {
    hr_assistant: Users,
    career_development: Mountain,
    my_benefits: Wallet,
    compass_assistant: Compass,
    compass_assistant_gemini: Compass,
    journal: NotebookPen
  },
  dscoe: {
    databricks_onboarding: Rocket,
    dscoe_search_assistant: SearchCode,
    code_writing_assistant: Code2,
    sri_assistant: FlaskConical,
  },
  bluecard_its: {
    onboarding: LogIn,
    bluecard_search_assistant: Search,
    bcbsa_assistant: Handshake,
  },
  corporate_compliance: {
    compliance_search_assistant: SearchCheck,
    contract_doc_compare: FileDiff,
    compliance_quiz_training: GraduationCap,
    vendor_report: FileBarChart,
  },
  marketing_research: {
    marketing_search_assistant: Search,
    nps_topic_modeling: BrainCogIcon,
  },
  subrogation: {
    subrogation_assistant: Scale, // “gavel” → scale glyph
  },
  data_management: {
    data_management_assistant: Database,
    big_query_migration_assistant: MoveRight,
  },
};

export function getPluginIcon(workspaceId: string, pluginId: string): LucideIcon {
  return pluginIcons[workspaceId]?.[pluginId]  ?? AppWindow
}

export function getWorkspaceIcon(workspaceId: string): LucideIcon {
  return workspaceIcons[workspaceId] ?? AppWindow;
}

// Types
interface ThinkingMode {
  id: string
  internalName: string
  label: string
  icon: string
  description: string
}

// Mock data for thinking modes
const THINKING_MODES: ThinkingMode[] = [
  {
    id: 'fast',
    internalName: 'fast',
    label: 'Instant',
    icon: "zap",
    description: 'Blazing fast, minimal processing'
  },
  {
    id: 'normal',
    internalName: 'normal',
    label: 'Standard',
    icon: "rocket",
    description: 'Good speed, general-purpose model'
  },
  {
    id: 'thinking',
    internalName: 'thinking',
    label: 'Deep Thinker',
    icon: "brain",
    description: 'Slower but with richer reasoning'
  }
]

export function WorkspacePluginMenu() {
  const workspaces = useCompassStore(s => s.workspaces)
  return !workspaces.length ? (
    <MenuTrigger isOpen={false} />
  ) : (
    <ActivePluginMenu />
  )
}

type MenuTriggerProps = {
  isOpen: boolean;
  workspaceIcon?: LucideIcon;
  workspaceName?: string;
  pluginIcon?: LucideIcon;
  pluginName?: string;
}

function MenuTrigger({ workspaceIcon, workspaceName, pluginIcon, pluginName, isOpen }: MenuTriggerProps) {
  return (
    <button
        onClick={() => {}}
        className="flex items-center gap-2 h-9 px-3 rounded-md transition-colors bg-background border border-border/50 hover:bg-muted/30 text-sm"
      >
      <div className="flex items-center gap-1.5">
        <Compass size={20} className="text-accent" aria-hidden />
        Loading...
        {/* {React.createElement(AppWindow, { size: 14, className: "text-muted-foreground" })}
        <span className="font-medium text-sm">{activeWorkspace.name}</span>
        <span className="text-muted-foreground">/</span>
        {React.createElement(getIcon(activePlugin.icon), { size: 14, className: "text-accent" })}
        <span className="text-accent font-medium">{activePlugin.name}</span> */}
        
        {/* <div className="h-4 w-px bg-border/50 mx-1"></div>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-base leading-none">{React.createElement(getIcon(selectedMode.icon), { size: 15 })}</span>
          <span>{selectedMode.label}</span>
        </div> */}
      </div>
      <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  )
}

function ActivePluginMenu() {

  // const { workspaces, activeWorkspaceId, activePluginId, selectPlugin } = useCompassStore()
  const workspaces = useCompassStore(s => s.workspaces)
  const activeWorkspaceId = useCompassStore(s => s.activeWorkspaceId)
  const activePluginId = useCompassStore(s => s.activePluginId)
  const selectPlugin = useCompassStore(s => s.selectPlugin)

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(activeWorkspaceId)
  
  // References
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Find currently selected workspace, plugin, and thinking mode
  const selectedWorkspace = workspaces.find(w => w.id === selectedWorkspaceId) || workspaces[0]
    
  const selectedPlugin = selectedWorkspace.plugins.find((p: any) => p.id === activePluginId) || selectedWorkspace.plugins[0]
  
  // Close dropdown when clicking outside
  useEffect(() => {
    console.log('effect mounted')
    const handleClickOutside = (event: MouseEvent) => {
      console.log('hereeeeeeeee <<<<<<<')
      if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Reset active workspace when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setSelectedWorkspaceId(activeWorkspaceId)
    }
  }, [isOpen, activeWorkspaceId])
  
  // Filter workspaces and plugins based on search
  const filteredWorkspaces = workspaces.filter(workspace => {
    if (!searchQuery) return true;
    
    const matchWorkspace = 
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchPlugins = workspace.plugins.some((plugin: any) => 
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return matchWorkspace || matchPlugins;
  });
  
  // Get active workspace
  const activeWorkspace = activeWorkspaceId 
    ? workspaces.find(w => w.id === activeWorkspaceId) 
    : null

  // Get active plugin
  const activePlugin = activePluginId 
  ? activeWorkspace!.plugins.find((w: any) => w.id === activePluginId) 
  : null
  // Handle plugin selection
  const handlePluginSelect = (workspaceId: string, pluginId: string) => {
    // onWorkspacePluginChange(workspaceId, pluginId)
    // setIsOpen(false)
    selectPlugin(workspaceId, pluginId)
  }

  console.log(activeWorkspaceId)
  console.log(activePluginId)

  if (!activePlugin) {
    return <></>
  }

  const onThinkingModeChange = (s: string) => {}

  // const selectedWorkspace = WORKSPACES[0]
  // const selectedPlugin = selectedWorkspace.plugins[0]
  // const selectedMode = THINKING_MODES[1]

  return (
    <div className="relative"  ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-9 px-3 rounded-md transition-colors bg-background border border-border/50 hover:bg-muted/30 text-sm"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5">
          {React.createElement(getWorkspaceIcon(activeWorkspace!.id), { size: 14, className: "text-muted-foreground" })}
          <span className="font-medium text-sm">{activeWorkspace!.name}</span>
          <span className="text-muted-foreground">/</span>
          {React.createElement(getPluginIcon(activeWorkspace!.id, activePlugin.id), { size: 14, className: "text-accent" })}
          <span className="text-accent font-medium">{activePlugin.name}</span>
          {/* <div className="h-4 w-px bg-border/50 mx-1"></div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-base leading-none">{React.createElement(getIcon(selectedMode.icon), { size: 15 })}</span>
            <span>{selectedMode.label}</span>
          </div> */}
        </div>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {/* Compact dropdown with three columns */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-h-64 rounded-md shadow-lg border border-border/10 z-50 overflow-hidden w-[480px]" style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}>
          {/* Header with search */}
          <div className="border-b border-border/10 p-2 flex items-center">
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
          
          <div className="grid grid-cols-2 divide-x divide-border/10" style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}>
            {/* Column 1: Workspaces - MORE COMPACT */}
            <div className="overflow-hidden">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/10">
                Select AI Plugin
              </div>
              <div className="max-h-[320px] overflow-y-auto p-1">
                {filteredWorkspaces.map(workspace => (
                  <button
                    key={workspace.id}
                    className={`w-full flex justify-between items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted/30 rounded-md transition-colors text-left ${
                      selectedWorkspaceId === workspace.id ? 'bg-muted/ text-foreground' : 'text-foreground/70'
                    }`}
                    onClick={() => setSelectedWorkspaceId(workspace.id)}
                  >
                    <div className="flex justify-between items-center gap-2">
                      {React.createElement(getWorkspaceIcon(workspace.id), { 
                        size: 15, 
                        className: selectedWorkspaceId === workspace.id ? "text-accent" : "text-muted-foreground" 
                      })}
                      <span className="truncate">{workspace.name}</span>
                    </div>
                    {selectedWorkspaceId === workspace.id && <ChevronRight size={15}/>}
                  </button>
                ))}
                
                {filteredWorkspaces.length === 0 && (
                  <div className="text-center text-muted-foreground text-xs p-4">
                    No workspaces found
                  </div>
                )}
              </div>
            </div>
            
            {/* Column 2: Plugins for selected workspace - MORE COMPACT */}
            <div className="overflow-hidden">
              <div className="px-3 py-2 h-8 text-xs font-medium text-muted-foreground border-b border-border/10">
                
              </div>
              {activeWorkspace ? (
                <div className="max-h-[320px] overflow-y-auto p-1">
                  {selectedWorkspace.plugins
                    .filter((plugin: any) => searchQuery
                      ? plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
                      : true
                    )
                    .map((plugin: any) => (
                      <button
                        key={plugin.id}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted/30 rounded-md transition-colors text-left ${
                          activePluginId === plugin.id ? 'bg-muted/20' : ''
                        }`}
                        onClick={() => handlePluginSelect(selectedWorkspace.id, plugin.id)}
                      >
                        {React.createElement(getPluginIcon(selectedWorkspace.id, plugin.id), { 
                          size: 15,
                          className: activePluginId === plugin.id
                            ? "text-accent" 
                            : "text-muted-foreground" 
                        })}
                        <span className="truncate">{plugin.name}</span>
                      </button>
                    ))
                  }
                  
                  {activeWorkspace.plugins.filter((plugin: any) => 
                    searchQuery 
                      ? plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
                      : true
                  ).length === 0 && (
                    <div className="text-center text-muted-foreground text-xs p-4">
                      No plugins found
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[320px] text-muted-foreground text-xs">
                  Select a workspace
                </div>
              )}
            </div>
            
            {/* Column 3: Thinking Mode - UNCHANGED FROM ENHANCED VERSION */}
            {/* <div className="p-1">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/10 mb-1">
                Thinking Mode
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {THINKING_MODES.map(mode => (
                  <button
                    key={mode.id}
                    className={`w-full flex items-start gap-2 p-2 hover:bg-muted/30 rounded-md transition-colors text-left ${
                      selectedThinkingMode === mode.id ? 'bg-muted/20' : ''
                    }`}
                    onClick={() => onThinkingModeChange(mode.id)}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted/40 flex items-center justify-center text-xl">
                      {React.createElement(getIcon(mode.icon), { size: 15 })}
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
            </div> */}
          </div>
        </div>
      )}
    </div>
  )
}

// function PluginsPopover() {
//   return (
//     <div className="absolute top-full left-0 mt-1 rounded-md shadow-lg border border-border/10 z-50 overflow-hidden w-[480px]" style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}>
//           {/* Header with search */}
//           <div className="border-b border-border/10 p-2 flex items-center">
//             <div className="relative flex-1">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search workspaces and plugins..."
//                 className="w-full h-8 text-xs pl-8 pr-3 py-2 rounded border border-border/20 bg-muted/10 focus:outline-none focus:ring-1 focus:ring-accent/30"
//               />
//               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//               {searchQuery && (
//                 <button 
//                   onClick={() => setSearchQuery('')}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                 >
//                   <X size={12} />
//                 </button>
//               )}
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 divide-x divide-border/10" style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}>
//             {/* Column 1: Workspaces - MORE COMPACT */}
//             <div className="overflow-hidden">
//               <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/10">
//                 Select AI Plugin
//               </div>
//               <div className="max-h-[320px] overflow-y-auto p-1">
//                 {filteredWorkspaces.map(workspace => (
//                   <button
//                     key={workspace.id}
//                     className={`w-full flex justify-between items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted/30 rounded-md transition-colors text-left ${
//                       selectedWorkspaceId === workspace.id ? 'bg-muted/ text-foreground' : 'text-foreground/70'
//                     }`}
//                     onClick={() => setSelectedWorkspaceId(workspace.id)}
//                   >
//                     <div className="flex justify-between items-center gap-2">
//                       {React.createElement(getWorkspaceIcon(workspace.id), { 
//                         size: 15, 
//                         className: selectedWorkspaceId === workspace.id ? "text-accent" : "text-muted-foreground" 
//                       })}
//                       <span className="truncate">{workspace.name}</span>
//                     </div>
//                     {selectedWorkspaceId === workspace.id && <ChevronRight size={15}/>}
//                   </button>
//                 ))}
                
//                 {filteredWorkspaces.length === 0 && (
//                   <div className="text-center text-muted-foreground text-xs p-4">
//                     No workspaces found
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             {/* Column 2: Plugins for selected workspace - MORE COMPACT */}
//             <div className="overflow-hidden">
//               <div className="px-3 py-2 h-8 text-xs font-medium text-muted-foreground border-b border-border/10">
                
//               </div>
//               {activeWorkspace ? (
//                 <div className="max-h-[320px] overflow-y-auto p-1">
//                   {selectedWorkspace.plugins
//                     .filter((plugin: any) => searchQuery
//                       ? plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
//                       : true
//                     )
//                     .map((plugin: any) => (
//                       <button
//                         key={plugin.id}
//                         className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted/30 rounded-md transition-colors text-left ${
//                           activePluginId === plugin.id ? 'bg-muted/20' : ''
//                         }`}
//                         onClick={() => handlePluginSelect(selectedWorkspace.id, plugin.id)}
//                       >
//                         {React.createElement(getPluginIcon(plugin.icon), { 
//                           size: 15,
//                           className: activePluginId === plugin.id
//                             ? "text-accent" 
//                             : "text-muted-foreground" 
//                         })}
//                         <span className="truncate">{plugin.name}</span>
//                       </button>
//                     ))
//                   }
                  
//                   {activeWorkspace.plugins.filter((plugin: any) => 
//                     searchQuery 
//                       ? plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
//                       : true
//                   ).length === 0 && (
//                     <div className="text-center text-muted-foreground text-xs p-4">
//                       No plugins found
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center h-[320px] text-muted-foreground text-xs">
//                   Select a workspace
//                 </div>
//               )}
//             </div>
            
//             {/* Column 3: Thinking Mode - UNCHANGED FROM ENHANCED VERSION */}
//             {/* <div className="p-1">
//               <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/10 mb-1">
//                 Thinking Mode
//               </div>
//               <div className="max-h-[320px] overflow-y-auto">
//                 {THINKING_MODES.map(mode => (
//                   <button
//                     key={mode.id}
//                     className={`w-full flex items-start gap-2 p-2 hover:bg-muted/30 rounded-md transition-colors text-left ${
//                       selectedThinkingMode === mode.id ? 'bg-muted/20' : ''
//                     }`}
//                     onClick={() => onThinkingModeChange(mode.id)}
//                   >
//                     <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted/40 flex items-center justify-center text-xl">
//                       {React.createElement(getIcon(mode.icon), { size: 15 })}
//                     </div>
                    
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between">
//                         <span className="font-medium text-sm">{mode.label}</span>
//                         {selectedThinkingMode === mode.id && (
//                           <Check size={14} className="text-accent" />
//                         )}
//                       </div>
//                       <div className="text-xs text-muted-foreground mt-0.5">
//                         {mode.description}
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div> */}
//           </div>
//         </div>
//   )
// }

// function CompactPluginSelector({
//   selectedThinkingMode = 'normal',
//   onThinkingModeChange,
//   onWorkspacePluginChange
// }: CompactPluginSelectorProps) {
//   // States
//   const [isOpen, setIsOpen] = useState(false)
//   const [searchQuery, setSearchQuery] = useState('')
//   const [activeWorkspaceId, setActiveWorkspaceId] = useState('')
//   const { selectedWorkspaceId, selectedPluginId } = useWorkspaceContext()
  
//   // References
//   const dropdownRef = useRef<HTMLDivElement>(null)
  
//   // Find currently selected workspace, plugin, and thinking mode
//   const selectedWorkspace = WORKSPACES.find(w => w.id === selectedWorkspaceId) 
//     || WORKSPACES[0]
    
//   const selectedPlugin = selectedWorkspace.plugins.find(p => p.id === selectedPluginId)
//     || selectedWorkspace.plugins[0]
    
//   const selectedMode = THINKING_MODES.find(m => m.id === selectedThinkingMode)
//     || THINKING_MODES[1]
  
//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false)
//       }
//     }
    
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])
  
//   // Reset active workspace when dropdown opens
//   useEffect(() => {
//     if (isOpen) {
//       setActiveWorkspaceId(selectedWorkspaceId)
//     }
//   }, [isOpen, selectedWorkspaceId])
  
//   // Filter workspaces and plugins based on search
//   const filteredWorkspaces = WORKSPACES.filter(workspace => {
//     if (!searchQuery) return true;
    
//     const matchWorkspace = 
//       workspace.name.toLowerCase().includes(searchQuery.toLowerCase());
      
//     const matchPlugins = workspace.plugins.some(plugin => 
//       plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
    
//     return matchWorkspace || matchPlugins;
//   });
  
//   // Get active workspace
//   const activeWorkspace = activeWorkspaceId 
//     ? WORKSPACES.find(w => w.id === activeWorkspaceId) 
//     : null
  
//   // Handle plugin selection
//   const handlePluginSelect = (workspaceId: string, pluginId: string) => {
//     onWorkspacePluginChange(workspaceId, pluginId)
//     setIsOpen(false)
//   }
  
//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Button to toggle dropdown - UNCHANGED FROM ENHANCED VERSION */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center gap-2 h-9 px-3 rounded-md transition-colors bg-background border border-border/50 hover:bg-muted/30 text-sm"
//         aria-expanded={isOpen}
//       >
//         <div className="flex items-center gap-1.5">
//           {React.createElement(getIcon(selectedWorkspace.icon), { size: 14, className: "text-muted-foreground" })}
//           <span className="font-medium text-sm">{selectedWorkspace.name}</span>
//           <span className="text-muted-foreground">/</span>
//           {React.createElement(getIcon(selectedPlugin.icon), { size: 14, className: "text-accent" })}
//           <span className="text-accent font-medium">{selectedPlugin.name}</span>
//           <div className="h-4 w-px bg-border/50 mx-1"></div>
//           <div className="flex items-center gap-1 text-xs">
//             <span className="text-base leading-none">{selectedMode.icon}</span>
//             <span>{selectedMode.label}</span>
//           </div>
//         </div>
//         <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
//       </button>
      
//       {/* Compact dropdown with three columns */}
//       {isOpen && (
//         <div className="absolute top-full left-0 mt-1 rounded-md shadow-lg border border-border/10 z-50 overflow-hidden w-[760px]" style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}>
//           {/* Header with search */}
//           <div className="border-b border-border/10 p-2 flex items-center">
//             <div className="relative flex-1">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search workspaces and plugins..."
//                 className="w-full h-8 text-xs pl-8 pr-3 py-2 rounded border border-border/20 bg-muted/10 focus:outline-none focus:ring-1 focus:ring-accent/30"
//               />
//               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//               {searchQuery && (
//                 <button 
//                   onClick={() => setSearchQuery('')}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                 >
//                   <X size={12} />
//                 </button>
//               )}
//             </div>
//           </div>
          
//           <div className="grid grid-cols-3 divide-x divide-border/10" style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}>
//             {/* Column 1: Workspaces - MORE COMPACT */}
//             <div className="overflow-hidden">
//               <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/10">
//                 Workspace
//               </div>
//               <div className="max-h-[320px] overflow-y-auto p-1">
//                 {filteredWorkspaces.map(workspace => (
//                   <button
//                     key={workspace.id}
//                     className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted/30 rounded-md transition-colors text-left ${
//                       activeWorkspaceId === workspace.id ? 'bg-muted/20' : ''
//                     }`}
//                     onClick={() => setActiveWorkspaceId(workspace.id)}
//                   >
//                     {React.createElement(getWorkspaceIcon(workspace.id), { 
//                       size: 15, 
//                       className: activeWorkspaceId === workspace.id ? "text-accent" : "text-muted-foreground" 
//                     })}
//                     <span className="truncate">{workspace.name}</span>
//                   </button>
//                 ))}
                
//                 {filteredWorkspaces.length === 0 && (
//                   <div className="text-center text-muted-foreground text-xs p-4">
//                     No workspaces found
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             {/* Column 2: Plugins for selected workspace - MORE COMPACT */}
//             <div className="overflow-hidden">
//               <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/10">
//                 Plugin
//               </div>
//               {activeWorkspace ? (
//                 <div className="max-h-[320px] overflow-y-auto p-1">
//                   {activeWorkspace.plugins
//                     .filter((plugin: any) => searchQuery
//                       ? plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
//                       : true
//                     )
//                     .map(plugin => (
//                       <button
//                         key={plugin.id}
//                         className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted/30 rounded-md transition-colors text-left ${
//                           selectedPluginId === plugin.id && selectedWorkspaceId === activeWorkspace.id ? 'bg-muted/20' : ''
//                         }`}
//                         onClick={() => handlePluginSelect(activeWorkspace.id, plugin.id)}
//                       >
//                         {React.createElement(getPluginIcon(plugin.icon), { 
//                           size: 15,
//                           className: selectedPluginId === plugin.id && selectedWorkspaceId === activeWorkspace.id 
//                             ? "text-accent" 
//                             : "text-muted-foreground" 
//                         })}
//                         <span className="truncate">{plugin.name}</span>
//                       </button>
//                     ))
//                   }
                  
//                   {activeWorkspace.plugins.filter((plugin: any) => 
//                     searchQuery 
//                       ? plugin.name.toLowerCase().includes(searchQuery.toLowerCase())
//                       : true
//                   ).length === 0 && (
//                     <div className="text-center text-muted-foreground text-xs p-4">
//                       No plugins found
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center h-[320px] text-muted-foreground text-xs">
//                   Select a workspace
//                 </div>
//               )}
//             </div>
            
//             {/* Column 3: Thinking Mode - UNCHANGED FROM ENHANCED VERSION */}
//             <div className="p-1">
//               <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/10 mb-1">
//                 Thinking Mode
//               </div>
//               <div className="max-h-[320px] overflow-y-auto">
//                 {THINKING_MODES.map(mode => (
//                   <button
//                     key={mode.id}
//                     className={`w-full flex items-start gap-2 p-2 hover:bg-muted/30 rounded-md transition-colors text-left ${
//                       selectedThinkingMode === mode.id ? 'bg-muted/20' : ''
//                     }`}
//                     onClick={() => onThinkingModeChange(mode.id)}
//                   >
//                     <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted/40 flex items-center justify-center text-xl">
//                       {mode.icon}
//                     </div>
                    
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between">
//                         <span className="font-medium text-sm">{mode.label}</span>
//                         {selectedThinkingMode === mode.id && (
//                           <Check size={14} className="text-accent" />
//                         )}
//                       </div>
//                       <div className="text-xs text-muted-foreground mt-0.5">
//                         {mode.description}
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// } 

// sidebar
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "288px"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "54px"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden text-sidebar-foreground md:block"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}



'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Compass,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  MessageSquare,
  Puzzle,
  Layers,
  Settings,
  ChartBar,
  Computer,
  CompassIcon,
  Ellipsis,
  Pin,
  Trash,
  LucideIcon,
  PinIcon
} from 'lucide-react'
import Link from 'next/link'
import { Sidebar, SidebarTrigger, useSidebar } from '../ui/sidebar'
import { cn, timestampToReadableDiff } from '@/lib/utils'
import { WorkspaceSelect } from './WorkSpaceSelect'
import { Conversation, ConversationHistoryItem } from '@/store/types'
import { ApiClient } from '@/api/api-client'
import useChatSession from '@/hooks/useChatSession'
import { useCompassStore } from '@/hooks/store-context'
import AccountMenu from './account-menu'

// Dummy data for saved chats
const SAVED_CHATS = [
  { id: 'chat1', title: 'Q4 Marketing Strategy', lastActive: '2h ago' },
  { id: 'chat2', title: 'Product Roadmap 2026', lastActive: '4h ago' },
  { id: 'chat3', title: 'Customer Feedback Analysis', lastActive: '1d ago' },
  { id: 'chat4', title: 'Quarterly Report Draft', lastActive: '2d ago' },
  { id: 'chat5', title: 'API Documentation Review', lastActive: '3d ago' },
  { id: 'chat6', title: 'New Feature Research', lastActive: '1w ago' },
  { id: 'chat7', title: 'Team Onboarding Resources', lastActive: '2w ago' },
]

const WORKSPACES = [
  {
    name: 'DSCOE',
    logo: ChartBar,
    area: 'Information Delivery'
  },
  {
    name: 'BlueCard ITS',
    logo: Computer,
    area: 'EIT'
  }
]

const USER = {
  name: 'compass',
  email: 'compass@bcbst.com',
  avatar: ''
}

export function SideNavigation() {

  const { conversationHistory, fetchConversationHistory } = useCompassStore()

  console.log(conversationHistory)

  const [activeSections, setActiveSections] = useState<string[]>(['saved-chats'])

  useEffect(() => {
    fetchConversationHistory()
  }, [])

  const toggleSection = (section: string) => {
    setActiveSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const { state, open, setOpen } = useSidebar();

  const isCollapsed = state === 'collapsed';

  const pinned  = conversationHistory.filter(c => c.is_pinned)
  const recents = conversationHistory.filter(c => !c.is_pinned)

  return (
    <Sidebar className="overflow-hidden border-none" collapsible="icon">
      <aside
        className={cn(
          'flex flex-col h-screen bg-[hsl(var(--sidebar-background))] text-foreground',
          'transition-all duration-300 overflow-hidden px-2',
          '!w-[18rem]' // always keep 18rem
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo and brand at the top */}
          <div className="h-14 flex items-center">
            <div className="flex items-center gap-2.5 pl-2">
              <Compass size={22} className="text-compass-blue" />
              <span
                className={cn(
                  "font-medium text-lg transition-opacity duration-100",
                  isCollapsed && "opacity-0"
                )}>
                Compass
              </span>
            </div>
          </div>

          {/* Top action group with compact spacing - added more vertical space */}
          <div className="mb-5 mt-1">
            {/* New chat button */}
            <Link
              href={"/"}
              className={cn(
                'flex transitiion-all duration-150 items-center gap-2 w-full h-8 transition-colors text-accent rounded-md mb-1.5 pl-2.5 py-1.5',
                !isCollapsed && 'bg-accent/10 hover:bg-accent/15'
              )}
            >
              <PlusCircle size={16} />
              <span className={cn(
                "font-medium text-sm",
                isCollapsed && 'opacity-0'
              )}>
                New Chat
              </span>
            </Link>

            {/* Workspaces */}
            <Link
              href="/workspaces"
              className={'flex items-center rounded-md h-8 py-1.5 mb-1.5 hover:bg-background/50 pl-2.5'}
            >
              <div className="flex items-center gap-2">
                <Layers size={16} />
                {!isCollapsed && <span className="text-sm">Workspaces</span>}
              </div>
            </Link>

            {/* Plugins */}
            <Link
              href="/plugins"
              className={'flex items-center rounded-md h-8 py-1.5 hover:bg-background/50 pl-2.5'}
            >
              <div className="flex items-center gap-2">
                <Puzzle size={16} />
                {!isCollapsed && <span className="text-sm">Plugins</span>}
              </div>
            </Link>
          </div>

          {/* Recent chats section - scrollable */}
          <div className="flex-1 overflow-y-auto">
            {/* Recent Chats Header */}
            <div className="mb-2">
              {!!pinned.length && (
                <ConversationGroup
                  type="pinned"
                  conversations={pinned}
                  isSidebarOpen={!isCollapsed}
                  allowToggle={true}
                />
              )}
              <ConversationGroup
                type="recents"
                conversations={recents}
                isSidebarOpen={!isCollapsed}
                allowToggle={true}
              />
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-auto">
            {/* Settings at the bottom */}
            {/* <div className="px-1.5 mb-1">
              <Link
                href="/settings"
                className={`flex items-center rounded-md py-1.5 ${
                  isCollapsed
                    ? 'justify-center text-muted-foreground hover:text-foreground'
                    : 'px-3 hover:bg-background/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings size={16} />
                  {!isCollapsed && <span className="text-sm">Settings</span>}
                </div>
              </Link>
            </div> */}
            {/* <WorkspaceSelect workspaces={WORKSPACES} user={USER} /> */}
          </div>
        </div>
      </aside>
      <AccountMenu />
      {/* Collapse toggle - restored original styling */}
      {/* <div className={cn(
        "px-1 pb-3 flex justify-end absolute bottom-2 right-2",
      )}>
        <button
          onClick={() => setOpen(!open)}
          className="transition-all duration-200 p-1.5 rounded-full bg-accent/10 text-accent hover:bg-accent/20"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft size={16} className={isCollapsed ? 'rotate-180' : ''} />
        </button>
      </div> */}
    </Sidebar>
  )
}

type ConversationGroupProps = {
  type: 'recents' | 'pinned'
  conversations: ConversationHistoryItem[];
  isSidebarOpen: boolean;
  allowToggle?: boolean;
}
function ConversationGroup({ type, conversations, isSidebarOpen, allowToggle }: ConversationGroupProps) {

  const groupName = type === 'pinned' ? 'Pinned' : 'Recents'
  const Icon      = type === 'pinned' ? PinIcon  : MessageSquare

  const [isOpen, setIsOpen] = useState<boolean>(true);
  
  const toggleOpen = () => {
    if (!allowToggle) return;
    setIsOpen(prev => !prev);
  }

  return (
    <>
      <button
        onClick={toggleOpen}
        className={'flex items-center w-full mb-1 rounded py-1.5 justify-between hover:bg-background/50 px-2.5 h-8'}
      >
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-foreground/80" />
          {isSidebarOpen && <span className="font-medium text-sm text-foreground/80">{groupName}</span>}
        </div>
        {isSidebarOpen && allowToggle && false && (
          <ChevronRight
            size={14}
            className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}
          />
        )}
      </button>

      {/* Chat list - restored original text sizes */}
      {isOpen && isSidebarOpen && (
        <div className="mt-0.5 space-y-0.5 mb-2">
          {conversations.map(conversation => (
            <ConversationLink key={conversation.id} conversation={conversation} isPinned={type === 'pinned'} />
          ))}
        </div>
      )}
    </>
  )
}


function ConversationLink({ conversation, isPinned }: { conversation: ConversationHistoryItem, isPinned: boolean }) {

  const { activeConversation } = useCompassStore()
  const { pinConversation, deleteConversation } = useChatSession()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const popoverRef = useRef<HTMLDivElement>(null)

  const handleToggleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsOpen(prev => !prev)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);  // close the dropdown or modal
      }
    };
  
    // Add event listener to document
    document.addEventListener('mousedown', handleClickOutside);
  
    // Cleanup on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [])

  return (
    <Link
      href={`/chat/${conversation.id}`}
      className={cn(
        'relative group/link flex items-center justify-between px-3 pr-4 py-1.5 rounded text-sm hover:bg-foreground/10',
        activeConversation && conversation.id === activeConversation.id && 'bg-foreground/10'
      )}
    >
      <span className="truncate pr-2">{conversation.title}</span>
      <span className="text-xs text-muted-foreground whitespace-nowrap group-hover/link:hidden">
        {timestampToReadableDiff(conversation.updated_at)}
      </span>
      <span className="text-xs text-muted-foreground whitespace-nowrap hidden group-hover/link:block">
        <button 
          className="flex justify-end items-center w-10"
          onClick={handleToggleOpen}
        >
          <Ellipsis className="size-5" />
        </button>
      </span>
      {isOpen && (
        <div 
          className="absolute bottom-[-75px] right-0 bg-[#fafafa] dark:bg-muted p-3 z-50 rounded-lg"
          ref={popoverRef}
        >
          <button 
            className="flex items-center gap-2 text-sm text-accent hover:text-accent/80"
            onClick={() => pinConversation(conversation.id, !isPinned)}
          >
            <Pin size={14} /> {isPinned ? 'Unpin' : 'Pin' }
        </button>
          <button 
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 mt-2"
            onClick={() => deleteConversation(conversation.id)}
          >
            <Trash size={14} /> Delete
          </button>
        </div>
   
      )}
    </Link>
  )
}

import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/authprovider";

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1)

export default function AccountMenu() {

  const [open, setOpen] = useState<boolean>(false)

  const { user, logoutTester } = useAuth()

  if (!user) {
    return <>error</>
  }

  const username = capitalize(user.username)

  const handleLogout = () => {
    logoutTester()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="bg-[hsl(var(--sidebar-background))] cursor-pointer">
          <div className="flex justify-between items-center border-t border-foreground/5 h-14 mx-2 my-1 px-1 hover:bg-foreground/5 rounded-md">
            <div className="flex items-center space-x-4">
              <button
                aria-label="Open account menu"
                className="bg-cyan-700/70 text-white rounded-full size-[28px] flex items-center justify-center text-sm font-medium focus:outline-none focus-visible:ring"
              >
                <div>
                  <div className="p-2">{user.username.charAt(0).toUpperCase()}</div>
                </div>
              </button>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-sm select-none">{username}</span>
                <span className="text-[12px] text-foreground/50 select-none">{user.group}</span>
              </div>
            </div>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent side="top" align="start" className="w-[18rem] p-4 grid gap-3 outline-none ring-0 border-none cursor-pointer shadow-none">
        <div className="text-sm px-1">
          <p className="font-medium">{username}</p>
          <p className="text-muted-foreground">{user.group}</p>
        </div>
        <button
          className="text-black dark:text-foreground outline-none flex items-center gap-3 px-1 py-2 text-sm rounded-md hover:bg-foreground/10 transition-colors"
          onClick={() => {
            setOpen(false);
            // Navigate to settings
          }}
        >
          <Settings className="size-4 text-muted-foreground flex-shrink-0" />
          <span className="flex-1 text-left">Settings</span>
        </button>
        <button
          className="text-black dark:text-foreground flex items-center gap-3 px-1 py-2 text-sm rounded-md hover:bg-foreground/10 transition-colors"
          onClick={() => {
            setOpen(false)
            handleLogout()
          }}
        >
          <LogOut className="size-4 text-muted-foreground flex-shrink-0" />
          <span className="flex-1 text-left">Log out</span>
        </button>
      </PopoverContent>
    </Popover>
  );
}

function MenuBtn({ name, onSelect }: { name: string, onSelect: () => void }) {
  return (
    <Button
      variant="destructive"
      size="sm"
      className="w-full"
      onClick={() => alert("Logged out")}
    >
      Log out
    </Button>
  )
}
