'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Workflow, Database, FileText } from 'lucide-react'

// Mock plugin data with compatibility information
const PLUGINS = [
  {
    id: 'rag',
    name: 'Document Search',
    icon: FileText,
    description: 'Search and reference your organization\'s documents',
    compatibleSwitch: true // Can be switched without starting a new chat
  },
  {
    id: 'db',
    name: 'Database Explorer',
    icon: Database,
    description: 'Query and visualize your data warehouse',
    compatibleSwitch: false // Requires a new chat
  },
  {
    id: 'workflow',
    name: 'Workflow Automation',
    icon: Workflow,
    description: 'Create and manage automated workflows',
    compatibleSwitch: false // Requires a new chat
  }
]

export function PluginSelectorDropdown({ 
  selectedPlugin, 
  onSelectPlugin,
  onNewChat
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  // Find the currently selected plugin
  const currentPlugin = selectedPlugin 
    ? PLUGINS.find(p => p.id === selectedPlugin)
    : null
  
  const handlePluginSelect = (plugin) => {
    if (!selectedPlugin || plugin.compatibleSwitch) {
      // If no plugin is selected yet or plugin is compatible for switching
      onSelectPlugin(plugin.id)
      setIsOpen(false)
    } else if (onNewChat) {
      // Handle incompatible plugin switch by starting a new chat
      onNewChat(plugin.id)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 h-8 px-2.5 rounded-md hover:bg-muted/30 transition-colors text-sm"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-1.5">
          {currentPlugin ? (
            <>
              {currentPlugin.icon && <currentPlugin.icon size={16} />}
              <span>{currentPlugin.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Select plugin</span>
          )}
        </div>
        <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-60 bg-background rounded-md shadow-lg border border-border/10 z-50 overflow-hidden">
          <div className="p-1.5 max-h-[320px] overflow-y-auto">
            {PLUGINS.map(plugin => (
              <button
                key={plugin.id}
                onClick={() => handlePluginSelect(plugin)}
                className={`w-full flex items-start gap-2 p-2 hover:bg-muted/30 rounded-md transition-colors text-left ${
                  selectedPlugin === plugin.id ? 'bg-muted/20' : ''
                }`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
                  <plugin.icon size={16} className="text-foreground/80" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{plugin.name}</span>
                    {selectedPlugin === plugin.id && (
                      <Check size={16} className="text-accent" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {plugin.description}
                  </div>
                  {!plugin.compatibleSwitch && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-500">
                      <span>Requires new chat</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}