'use client'

import { useState } from 'react'
import { 
  Compass, 
  ChevronLeft, 
  ChevronRight,
  PlusCircle,
  MessageSquare,
  Puzzle,
  Layers,
  Settings
} from 'lucide-react'
import Link from 'next/link'

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

export function SideNavigation() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeSections, setActiveSections] = useState<string[]>(['saved-chats'])
  
  const toggleSection = (section: string) => {
    setActiveSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    )
  }
  
  const isActive = (section: string) => activeSections.includes(section)
  
  return (
    <aside 
      className={`h-full bg-[hsl(var(--sidebar-background))] text-foreground transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Logo and brand at the top */}
        <div className="h-14 flex items-center px-4">
          <div className="flex items-center gap-2.5">
            <Compass size={22} className="text-compass-blue" />
            {!isCollapsed && <span className="font-medium text-lg">Compass</span>}
          </div>
        </div>
        
        {/* Top action group with compact spacing - added more vertical space */}
        <div className="px-3 mb-5 mt-1">
          {/* New chat button */}
          <button
            className={`flex items-center gap-2 w-full transition-colors bg-accent/10 hover:bg-accent/15 text-accent rounded-md mb-1.5 ${
              isCollapsed ? 'justify-center py-1.5' : 'py-1.5 px-3'
            }`}
          >
            <PlusCircle size={16} />
            {!isCollapsed && <span className="font-medium text-sm">New Chat</span>}
          </button>
          
          {/* Workspaces */}
          <Link
            href="/workspaces"
            className={`flex items-center rounded-md py-1.5 mb-1.5 ${
              isCollapsed
                ? 'justify-center text-muted-foreground hover:text-foreground'
                : 'px-3 hover:bg-background/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers size={16} />
              {!isCollapsed && <span className="text-sm">Workspaces</span>}
            </div>
          </Link>
          
          {/* Plugins */}
          <Link
            href="/plugins"
            className={`flex items-center rounded-md py-1.5 ${
              isCollapsed
                ? 'justify-center text-muted-foreground hover:text-foreground'
                : 'px-3 hover:bg-background/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Puzzle size={16} />
              {!isCollapsed && <span className="text-sm">Plugins</span>}
            </div>
          </Link>
        </div>
        
        {/* Saved chats section - scrollable */}
        <div className="flex-1 overflow-y-auto px-1.5">
          {/* Saved Chats Header */}
          <div className="mb-2">
            <button
              onClick={() => !isCollapsed && toggleSection('saved-chats')}
              className={`flex items-center w-full mb-1 rounded py-1.5 ${
                isCollapsed 
                  ? 'justify-center text-muted-foreground hover:text-foreground' 
                  : 'justify-between px-3 hover:bg-background/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                {!isCollapsed && <span className="font-medium text-sm">Saved Chats</span>}
              </div>
              {!isCollapsed && (
                <ChevronRight 
                  size={14} 
                  className={`transition-transform ${isActive('saved-chats') ? 'rotate-90' : ''}`} 
                />
              )}
            </button>
            
            {/* Chat list - restored original text sizes */}
            {!isCollapsed && isActive('saved-chats') && (
              <div className="mt-0.5 space-y-0.5 mb-2">
                {SAVED_CHATS.map(chat => (
                  <Link 
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className="flex items-center justify-between px-4 py-1.5 rounded text-sm hover:bg-background/50"
                  >
                    <span className="truncate pr-2">{chat.title}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.lastActive}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-auto">
          {/* Settings at the bottom */}
          <div className="px-1.5 mb-1">
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
          </div>
          
          {/* Collapse toggle - restored original styling */}
          <div className="p-3 flex justify-end">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}