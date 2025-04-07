'use client'

import { useState, useEffect } from 'react'
import { Compass } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

export function Header() {
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
    <div className="fixed top-0 left-0 right-0 w-full z-10">
      {/* Main header */}
      <header 
        className="w-full h-12 transition-all duration-300 bg-background"
      >
        <div className="w-full h-full flex items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <Compass size={22} className="text-compass-blue" />
            <span className="font-medium">Compass</span>
          </div>
          
          <ThemeToggle />
        </div>
      </header>
      
      {/* Gradient fade-out at the bottom - works in both light and dark modes */}
      <div className="w-full h-4 bg-gradient-to-b from-background to-transparent"></div>
    </div>
  )
}