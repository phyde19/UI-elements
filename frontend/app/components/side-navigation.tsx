'use client'

import { useState } from 'react'
import { Compass, ChevronLeft, ChevronRight } from 'lucide-react'

export function SideNavigation() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  return (
    <aside 
      className={`h-full bg-[hsl(var(--sidebar-background))] text-foreground transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Basic sidebar shell - will be populated with content later */}
      <div className="h-full flex flex-col">
        {/* Logo and brand at the top */}
        <div className="h-16 flex items-center px-4">
          <div className="flex items-center gap-3">
            <Compass size={24} className="text-compass-blue" />
            {!isCollapsed && <span className="font-medium text-lg">Compass</span>}
          </div>
        </div>
        
        {/* Main navigation content */}
        <div className="flex-1">
          {/* Navigation items will go here */}
        </div>
        
        {/* Collapse toggle at the bottom */}
        <div className="p-4 flex justify-end">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>
    </aside>
  )
}