"use client"

import { useState, useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Copy, Check } from 'lucide-react'
import { simulateResponseStream } from '../mocks'
import { useTheme } from 'next-themes'

export function MessageDisplay() {
  const [userMessage, setUserMessage] = useState("")
  const [content, setContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  const startStreaming = () => {
    if (isStreaming) return undefined
    
    setContent("")
    setIsStreaming(true)
    
    return simulateResponseStream(
      'code', // Try with: 'standard', 'code', 'data-table', 'bullet-points', 'error', or 'complex'
      (char) => {
        setContent(prev => prev + char)
      },
      () => setIsStreaming(false)
    )
  }
  
  // Event listener for custom events from parent components
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    const handleStartStreaming = (event: Event) => {
      const customEvent = event as CustomEvent
      // Get the user message from the event
      const message = customEvent.detail?.message || "Can you help me with this?"
      
      // Set the user message
      setUserMessage(message)
      
      // Start the AI response
      startStreaming()
    }
    
    container.addEventListener('start-streaming', handleStartStreaming)
    
    return () => {
      container.removeEventListener('start-streaming', handleStartStreaming)
    }
  }, [])
  
  // Auto-scroll to bottom when content changes
  useEffect(() => {
    // Find the closest scrollable parent container
    // const scrollContainer = document.getElementById('chat-scroll-container')
    // if (scrollContainer) {
    //   scrollContainer.scrollTop = scrollContainer.scrollHeight
    // }
  }, [userMessage, content])
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(text)
      setTimeout(() => setCopiedCode(null), 2000)
    })
  }
  
  return (
    <div ref={containerRef} id="message-display" className="space-y-8">
      {/* User Message (if any) */}
      {userMessage && (
        <div className="flex justify-end mb-8">
          <div className="bg-secondary/80 text-secondary-foreground py-2.5 px-4 rounded-2xl max-w-[80%]">
            {userMessage}
          </div>
        </div>
      )}
      
      {/* Loading indicator */}
      {isStreaming && content.length === 0 && (
        <div className="flex items-center space-x-2 text-muted-foreground my-8">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-150" />
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-300" />
        </div>
      )}
      
      {/* Markdown Content */}
      {content && (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Override pre to avoid the extra wrapper
              pre({node, children}) {
                // Return just the children without the pre wrapper
                return <>{children}</>;
              },
              // Only customize the fenced code blocks (not inline code)
              code({node, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                const codeString = String(children).replace(/\n$/, '')
                
                // Check if this is a code block by:
                // 1. Having multiple lines OR
                // 2. Having a language specified
                const isCodeBlock = codeString.includes('\n') || className?.includes('language-')
                
                // For inline code (single line, no language), use default rendering
                if (!isCodeBlock) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
                
                // For fenced code blocks, add custom styling and functionality
                const language = match ? match[1] : ''
                
                return (
                  <div className="relative not-prose my-4 rounded-md overflow-hidden">
                    {/* Language indicator and copy button header */}
                    <div className="flex items-center justify-between bg-secondary text-secondary-foreground px-4 py-1.5 text-xs font-medium">
                      {/* Language indicator */}
                      <span className="capitalize">
                        {language || 'text'}
                      </span>
                      
                      {/* Copy button */}
                      <button
                        onClick={() => copyToClipboard(codeString)}
                        className="p-1 rounded hover:bg-secondary-foreground/10 transition-colors"
                        aria-label="Copy code"
                      >
                        {copiedCode === codeString ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                    
                    {/* Syntax highlighted code */}
                    {/* 
                      Create a unified styling approach with consistent typography
                      and spacing, changing only color schemes between themes
                    */}
                    <SyntaxHighlighter
                      language={language || 'text'}
                      style={theme === 'dark' ? vscDarkPlus : okaidia}
                      codeTagProps={{
                        style: {
                          fontSize: 'inherit' // Ensure nested code elements match parent size
                        }
                      }}
                      customStyle={
                        theme === 'dark'
                          ? {
                              // Dark mode - original styling only
                              margin: 0,
                              borderRadius: 0,
                              fontSize: '13px'
                            }
                          : {
                              // Light mode - custom dark theme styling
                              margin: 0,
                              borderRadius: 0,
                              fontSize: '13px',
                              backgroundColor: 'hsl(240, 10%, 20%)'
                            }
                      }
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                )
              }
            }}
          >
            {content}
          </Markdown>
        </div>
      )}
    </div>
  )
}