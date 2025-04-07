'use client'

import { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Message as MessageType } from '../types'

interface MessageProps {
  message: MessageType
}

export function Message({ message }: MessageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const { theme } = useTheme()
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(text)
      setTimeout(() => setCopiedCode(null), 2000)
    })
  }
  
  // User messages are simple text in a styled bubble
  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-secondary/95 text-secondary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] shadow-sm">
          {message.content}
        </div>
      </div>
    )
  }
  
  // Assistant messages can contain Markdown with code blocks
  return (
    <div className="mb-8 w-full">
      {/* Assistant indicator (optional) */}
      
      {/* Loading indicator */}
      {message.isStreaming && message.content.length === 0 && (
        <div className="flex items-center space-x-2 text-muted-foreground my-8">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-150" />
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-300" />
        </div>
      )}
      
      {/* Streaming cursor */}
      {message.isStreaming && message.content.length > 0 && (
        <div className="inline-block w-2 h-4 ml-1 bg-accent animate-pulse" />
      )}
      
      {/* Markdown Content */}
      {message.content && (
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
            {message.content}
          </Markdown>
        </div>
      )}
    </div>
  )
}