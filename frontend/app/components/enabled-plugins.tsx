'use client'

import { useState } from 'react'
import { ArrowUpRight, Star, Workflow, Database, FileText, Puzzle, Plus } from 'lucide-react'
import Link from 'next/link'

// Only show enabled plugins from the main plugin list
const ENABLED_PLUGINS = [
  {
    id: 'rag',
    name: 'Document Search',
    description: 'Search across your team knowledge base',
    icon: FileText,
    category: 'Data',
    usageCount: 145,
    isFavorite: true,
    isNew: false,
    accessStatus: 'enabled',
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

export function EnabledPlugins({ onSelect, currentWorkspace = "Marketing Team" }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="text-2xl font-medium mb-1.5">Start a new chat</div>
        <div className="text-muted-foreground mb-6">
          Choose a plugin from your <span className="text-foreground">{currentWorkspace}</span> workspace
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ENABLED_PLUGINS.map(plugin => (
          <button
            key={plugin.id}
            onClick={() => onSelect && onSelect(plugin)}
            className="bg-background hover:bg-muted/30 p-4 rounded-lg transition-colors text-left group h-full flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
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
                <div className="flex items-center gap-2">
                  <span className="font-medium group-hover:text-accent transition-colors">{plugin.name}</span>
                  {plugin.isNew && (
                    <span className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">New</span>
                  )}
                  {plugin.isFavorite && (
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">{plugin.description}</div>
            
            <div className="mt-auto pt-4 flex items-center justify-end">
              <div className="text-sm font-medium group-hover:text-accent transition-colors flex items-center gap-1">
                Start chat <ArrowUpRight size={14} />
              </div>
            </div>
          </button>
        ))}
        
        {/* Explore more plugins card */}
        <Link 
          href="/plugins"
          className="bg-background hover:bg-muted/30 p-4 rounded-lg transition-colors text-left group h-full flex flex-col border-2 border-dashed border-muted"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
              <Plus size={20} className="text-accent" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium group-hover:text-accent transition-colors">Explore More</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Discover and enable more plugins for your workspace
          </div>
          
          <div className="mt-auto pt-4 flex items-center justify-end">
            <div className="text-sm font-medium group-hover:text-accent transition-colors flex items-center gap-1">
              View plugins <ArrowUpRight size={14} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}