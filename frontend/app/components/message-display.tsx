"use client"

import { useState, useEffect } from 'react'
import { simulateResponseStream } from '../mocks'

export function MessageDisplay() {
  const [content, setContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)

  const startStreaming = () => {
    if (isStreaming) return undefined
    
    setContent("")
    setIsStreaming(true)
    
    // Stream the 'standard' response
    // To use a different response, change 'standard' to:
    // 'code', 'data-table', 'bullet-points', 'error', or 'complex'
    return simulateResponseStream(
      'code',
      (char) => {
        setContent(prev => prev + char)
      },
      () => setIsStreaming(false)
    )
  }
  
  // Start streaming when component mounts
  useEffect(() => {
    const stopStreaming = startStreaming()
    return () => stopStreaming && stopStreaming()
  }, [])
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Message container */}
      <div className="bg-card rounded-xl p-6 shadow-md border border-border min-h-[200px]">
        {/* Loading indicator */}
        {isStreaming && content.length === 0 && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-150" />
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-300" />
            <span className="ml-2">AI is thinking...</span>
          </div>
        )}
        
        {/* Content */}
        <pre className="whitespace-pre-wrap font-sans text-sm">{content}</pre>
      </div>
      
      {/* Reset button */}
      {!isStreaming && content && (
        <div className="mt-4 flex justify-center">
          <button 
            onClick={startStreaming}
            className="px-4 py-2 bg-compass-blue text-compass-blue-foreground rounded-lg"
          >
            Stream Again
          </button>
        </div>
      )}
    </div>
  )
}