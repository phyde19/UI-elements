"use client"

import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Copy, Check } from 'lucide-react'
import { simulateResponseStream } from '../mocks'

export function MessageDisplay() {
  const [content, setContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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
    
    const handleStartStreaming = () => {
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
    const scrollContainer = document.querySelector('.overflow-y-auto')
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [content])
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(text)
      setTimeout(() => setCopiedCode(null), 2000)
    })
  }
  
  return (
    <div ref={containerRef} id="message-display" className="w-full">
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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Only customize the fenced code blocks (not inline code)
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                
                // For inline code, use default rendering
                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
                
                // For fenced code blocks, add custom styling and functionality
                const language = match ? match[1] : ''
                const codeString = String(children).replace(/\n$/, '')
                
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
                    <SyntaxHighlighter
                      language={language || 'text'}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: 0
                      }}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                )
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}