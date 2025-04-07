'use client'

import { useState, useEffect } from 'react'
import { ThemeToggle } from './theme-toggle'
import { PluginSelectorDropdown } from './plugin-selector-dropdown'

interface HeaderProps {
  selectedPlugin: string | null;
  onSelectPlugin: (pluginId: string) => void;
  onNewChat: (pluginId?: string | null) => void;
}

export function Header({ selectedPlugin, onSelectPlugin, onNewChat }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])
  
  return (
    <div>
      {/* Solid header */}
      <header className="w-full h-12 bg-background">
        <div className="w-full h-full flex items-center justify-between px-4">
          {/* Left side with plugin selector */}
          <div className="flex items-center">
            <PluginSelectorDropdown 
              selectedPlugin={selectedPlugin}
              onSelectPlugin={onSelectPlugin}
              onNewChat={onNewChat}
            />
          </div>
          
          {/* Right side with theme toggle */}
          <ThemeToggle />
        </div>
      </header>
      
      {/* Gradient fade-out with conditional blur effect */}
      <div 
        className={`w-full h-6 bg-gradient-to-b from-background to-transparent transition-all duration-300 ${
          scrolled ? 'backdrop-blur-sm' : ''
        }`}
      ></div>
    </div>
  )
}