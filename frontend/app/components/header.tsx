'use client'

import { useState, useEffect } from 'react'
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
    <div className="sticky top-0 z-20">
      {/* Main header */}
      <header 
        className={`w-full h-12 transition-all duration-300 ${
          scrolled ? 'bg-background/95 backdrop-blur-md' : 'bg-background'
        }`}
      >
        <div className="w-full h-full flex items-center justify-end px-8">
          <ThemeToggle />
        </div>
      </header>
      
      {/* Gradient fade-out at the bottom - works in both light and dark modes */}
      <div className="w-full h-4 bg-gradient-to-b from-background to-transparent"></div>
    </div>
  )
}