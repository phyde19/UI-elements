'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { 
  FileText, Database, Code, BarChart, LineChart, Mail, 
  FileSearch, MessageSquare, Users, FolderSearch, NetworkIcon,
  Github, PieChart, Share2, CalendarClock, Rocket
} from 'lucide-react'

// Types
export interface Plugin {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  isPinned?: boolean
  isNew?: boolean
  usageCount?: number
  lastUsed?: string
}

export interface Workspace {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  plugins: Plugin[]
  color?: string
  isNew?: boolean
  isDefault?: boolean
}

// Mock data
export const MOCK_WORKSPACES: Workspace[] = [
  {
    id: 'data-analytics',
    name: 'Data Analytics',
    description: 'Tools for analyzing and visualizing data',
    icon: BarChart,
    color: 'bg-blue-500/10 text-blue-500',
    isDefault: true,
    plugins: [
      {
        id: 'data-query',
        name: 'Database Query Assistant',
        description: 'Build and run database queries with natural language',
        icon: Database,
        isPinned: true,
        usageCount: 28,
        lastUsed: '2h ago'
      },
      {
        id: 'data-viz',
        name: 'Data Visualization',
        description: 'Generate and customize data visualizations',
        icon: PieChart,
        isPinned: true,
        usageCount: 42,
        lastUsed: '1d ago'
      },
      {
        id: 'data-analysis',
        name: 'Data Analysis',
        description: 'Statistical analysis and data exploration',
        icon: LineChart,
        usageCount: 15,
        lastUsed: '3d ago'
      }
    ]
  },
  {
    id: 'document-processing',
    name: 'Document Processing',
    description: 'Work with documents and knowledge sources',
    icon: FileText,
    color: 'bg-green-500/10 text-green-500',
    plugins: [
      {
        id: 'doc-search',
        name: 'Document Search',
        description: 'Semantic search across your organization\'s documents',
        icon: FileSearch,
        isPinned: true,
        usageCount: 56,
        lastUsed: '5h ago'
      },
      {
        id: 'doc-qa',
        name: 'Document Q&A',
        description: 'Ask questions about your documents',
        icon: MessageSquare,
        isPinned: false,
        usageCount: 37,
        lastUsed: '1d ago'
      },
      {
        id: 'doc-summarize',
        name: 'Document Summarization',
        description: 'Generate summaries of reports and documents',
        icon: FolderSearch,
        usageCount: 23,
        lastUsed: '2d ago'
      }
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering',
    description: 'Software development and engineering tools',
    icon: Code,
    color: 'bg-purple-500/10 text-purple-500',
    plugins: [
      {
        id: 'code-assist',
        name: 'Code Assistant',
        description: 'AI-assisted code generation and review',
        icon: Code,
        isPinned: true,
        usageCount: 78,
        lastUsed: '1h ago'
      },
      {
        id: 'github-helper',
        name: 'GitHub Helper',
        description: 'Manage GitHub issues and PRs',
        icon: Github,
        isPinned: false,
        usageCount: 45,
        lastUsed: '6h ago'
      },
      {
        id: 'tech-docs',
        name: 'Technical Documentation',
        description: 'Generate and search technical documentation',
        icon: FolderSearch,
        usageCount: 12,
        lastUsed: '3d ago'
      }
    ]
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    description: 'Team collaboration and communication tools',
    icon: Users,
    color: 'bg-amber-500/10 text-amber-500',
    isNew: true,
    plugins: [
      {
        id: 'meeting-assistant',
        name: 'Meeting Assistant',
        description: 'Schedule, prepare for, and summarize meetings',
        icon: CalendarClock,
        isPinned: false,
        isNew: true,
        usageCount: 8,
        lastUsed: '2d ago'
      },
      {
        id: 'email-helper',
        name: 'Email Helper',
        description: 'Draft, summarize, and organize emails',
        icon: Mail,
        isPinned: false,
        isNew: true,
        usageCount: 14,
        lastUsed: '1d ago'
      },
      {
        id: 'knowledge-share',
        name: 'Knowledge Sharing',
        description: 'Create and share knowledge bases',
        icon: Share2,
        isNew: true,
        usageCount: 5,
        lastUsed: '4d ago'
      }
    ]
  },
  {
    id: 'network-admin',
    name: 'Network Administration',
    description: 'Network monitoring and administration tools',
    icon: NetworkIcon,
    color: 'bg-cyan-500/10 text-cyan-500',
    plugins: [
      {
        id: 'network-monitor',
        name: 'Network Monitor',
        description: 'Monitor network performance and health',
        icon: NetworkIcon,
        isPinned: false,
        usageCount: 18,
        lastUsed: '1d ago'
      },
      {
        id: 'deployment-helper',
        name: 'Deployment Helper',
        description: 'Assist with deployment and infrastructure',
        icon: Rocket,
        isPinned: false,
        usageCount: 9,
        lastUsed: '3d ago'
      }
    ]
  }
]

// Context type
interface CapabilityContextType {
  workspaces: Workspace[]
  activeWorkspaceId: string
  setActiveWorkspaceId: (id: string) => void
  activePlugin: Plugin | null
  setActivePlugin: (plugin: Plugin | null) => void
  recentPlugins: Plugin[]
  pinnedPlugins: Plugin[]
}

// Create context
const CapabilityContext = createContext<CapabilityContextType | undefined>(undefined)

// Provider component
export function CapabilityProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(MOCK_WORKSPACES)
  
  // Find default workspace or use first one
  const defaultWorkspace = workspaces.find(w => w.isDefault) || workspaces[0]
  
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(defaultWorkspace.id)
  const [activePlugin, setActivePlugin] = useState<Plugin | null>(null)

  // Computed properties
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0]
  
  // Get all pinned plugins across workspaces
  const pinnedPlugins = workspaces
    .flatMap(w => w.plugins.filter(p => p.isPinned))
    .slice(0, 5) // Limit to top 5
  
  // Recent plugins (would normally be tracked by usage)
  const recentPlugins = workspaces
    .flatMap(w => w.plugins)
    .sort((a, b) => {
      const aHours = a.lastUsed ? parseInt(a.lastUsed.replace('h ago', '')) : 1000
      const bHours = b.lastUsed ? parseInt(b.lastUsed.replace('h ago', '')) : 1000
      return aHours - bHours
    })
    .slice(0, 5) // Top 5 most recent
  
  // Effect to reset active plugin when workspace changes
  useEffect(() => {
    setActivePlugin(null)
  }, [activeWorkspaceId])
  
  const value = {
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    activePlugin,
    setActivePlugin,
    recentPlugins,
    pinnedPlugins
  }
  
  return (
    <CapabilityContext.Provider value={value}>
      {children}
    </CapabilityContext.Provider>
  )
}

// Hook for using the context
export function useCapability() {
  const context = useContext(CapabilityContext)
  if (context === undefined) {
    throw new Error('useCapability must be used within a CapabilityProvider')
  }
  return context
}