"use client"

import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { simulateResponseStream } from '../mocks'

export function MessageDisplay() {
  const [content, setContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const startStreaming = () => {
    if (isStreaming) return undefined
    
    setContent("")
    setIsStreaming(true)
    
    return simulateResponseStream(
      'standard', // Replace with 'code', 'data-table', 'bullet-points', 'error', or 'complex'
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
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [content])
  
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
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      )}
      
      {/* No more visible button, will be triggered by chat input */}
    </div>
  )
}