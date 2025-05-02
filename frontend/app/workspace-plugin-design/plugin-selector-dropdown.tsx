'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Workflow, Database, FileText, RefreshCw } from 'lucide-react'

// Mock plugin data with compatibility information
const PLUGINS = [
  {
    id: 'basic',
    name: 'Basic Chat',
    icon: ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    description: 'Chat with a general-purpose AI assistant',
    compatibleSwitch: true, // Can be switched without starting a new chat
    isDefault: true
  },
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

interface PluginSelectorDropdownProps {
  selectedPlugin: string | null;
  onSelectPlugin: (pluginId: string) => void;
  onNewChat: (pluginId?: string | null) => void;
}

export function PluginSelectorDropdown({ 
  selectedPlugin, 
  onSelectPlugin,
  onNewChat
}: PluginSelectorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target as Node)) {
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
  
  const [showWarning, setShowWarning] = useState(false)
  const [switchingToPlugin, setSwitchingToPlugin] = useState<typeof PLUGINS[0] | null>(null)
  
  const handlePluginSelect = (plugin: typeof PLUGINS[0]) => {
    if (!selectedPlugin || plugin.compatibleSwitch) {
      // If no plugin is selected yet or plugin is compatible for switching
      onSelectPlugin(plugin.id)
      setIsOpen(false)
    } else {
      // Show warning for incompatible plugin switch
      setSwitchingToPlugin(plugin)
      setShowWarning(true)
    }
  }
  
  const handleConfirmSwitch = () => {
    // Create new chat with selected plugin
    if (onNewChat && switchingToPlugin) {
      onNewChat(switchingToPlugin.id)
    }
    setShowWarning(false)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 h-8 px-3 rounded-md transition-colors text-sm ${
          currentPlugin 
            ? 'bg-accent/10 hover:bg-accent/20 text-accent' 
            : 'bg-accent/5 hover:bg-accent/10 text-muted-foreground hover:text-foreground'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-1.5">
          {currentPlugin ? (
            <>
              {currentPlugin.icon && (
                typeof currentPlugin.icon === 'function' 
                  ? <currentPlugin.icon size={16} />
                  : <currentPlugin.icon size={16} />
              )}
              <span className="font-medium">{currentPlugin.name}</span>
            </>
          ) : (
            <>
              <span className="inline-block w-2 h-2 bg-accent/70 rounded-full animate-pulse mr-1"></span>
              <span>Select plugin</span>
            </>
          )}
        </div>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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
                  {typeof plugin.icon === 'function' 
                    ? <plugin.icon size={16} className="text-foreground/80" />
                    : <plugin.icon size={16} className="text-foreground/80" />
                  }
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
                      <RefreshCw size={10} />
                      <span>Start new chat</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Warning dialog for incompatible switches */}
      {showWarning && switchingToPlugin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg max-w-md w-full p-4 shadow-lg">
            <div className="flex items-center gap-2 text-amber-500 mb-3">
              <RefreshCw size={18} />
              <h3 className="font-medium">Start a new chat?</h3>
            </div>
            
            <p className="text-sm mb-4">
              <strong>{switchingToPlugin.name}</strong> requires starting a new chat. Your current conversation will be saved.
            </p>
            
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowWarning(false)}
                className="px-3 py-1.5 text-sm hover:bg-muted/50 rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmSwitch}
                className="px-3 py-1.5 text-sm bg-accent/10 text-accent hover:bg-accent/20 rounded-md"
              >
                Start New Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}