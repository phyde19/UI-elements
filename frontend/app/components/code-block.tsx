'use client'

import { useState, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'
import { useTheme } from 'next-themes'
import { toHtml } from 'hast-util-to-html'
import { common, createStarryNight } from '@wooorm/starry-night'

// Import starry-night styles
import '@wooorm/starry-night/style/both'

// Cached instances of starry-night for better performance
let starryNightInstance: any = null

// Initialize starry-night (this is async)
const getStarryNight = async () => {
  if (!starryNightInstance) {
    starryNightInstance = await createStarryNight(common)
  }
  return starryNightInstance
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'text' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [html, setHtml] = useState<string>('')
  const { theme } = useTheme()
  
  // Handle copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Highlight the code with starry-night
  useEffect(() => {
    const highlight = async () => {
      try {
        const starryNight = await getStarryNight()
        const scope = starryNight.flagToScope(language) || 'text.plain'
        
        if (scope) {
          const tree = starryNight.highlight(code, scope)
          setHtml(toHtml(tree))
        } else {
          // Fallback for unknown languages
          setHtml(code.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
        }
      } catch (error) {
        console.error('Failed to highlight:', error)
        // Simple fallback
        setHtml(code.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
      }
    }
    
    highlight()
  }, [code, language])
  
  // Custom styling to match the original appearance exactly
  const codeStyle = theme === 'dark'
    ? {
        margin: 0,
        padding: '1rem',
        backgroundColor: '#171615',
        color: '#e1eaf4',
        fontSize: '13px',
        fontFamily: 'var(--font-geist-mono), monospace',
        overflow: 'auto'
      }
    : {
        margin: 0,
        padding: '1rem',
        backgroundColor: 'hsl(240, 10%, 20%)',
        color: '#e1eaf4',
        fontSize: '13px',
        fontFamily: 'var(--font-geist-mono), monospace',
        overflow: 'auto'
      }

  return (
    <div className="relative not-prose my-4 rounded-md overflow-hidden">
      {/* Header - identical to original */}
      <div className="flex items-center justify-between bg-secondary text-secondary-foreground px-4 py-1.5 text-xs font-medium">
        <span className="capitalize">{language || 'text'}</span>
        <button
          onClick={copyToClipboard}
          className="p-1 rounded hover:bg-secondary-foreground/10 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
      
      {/* Code block */}
      <div style={codeStyle}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  )
}