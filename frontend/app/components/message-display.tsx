"use client"

import { useState, useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Copy, Check, FileText, FileText as DocIcon, FileCode as CodeIcon, Table as SheetIcon, 
         FileImage as PdfIcon, Mail as EmailIcon, FileJson as JsonIcon, 
         FileType as TxtIcon, Globe as HtmlIcon, File as UnknownIcon, Clock, Calendar } from 'lucide-react'
import { simulateResponseStream } from '../mocks'
import { citationSources } from '../mocks/responses/citations'
import { useTheme } from 'next-themes'

// Import useLayout to control the right panel
import { useLayout } from '../../lib/layout-context';

export function MessageDisplay() {
  const [userMessage, setUserMessage] = useState("")
  const [content, setContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'compass' | 'sources'>('compass')
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const { openRightPanel } = useLayout()

  const startStreaming = () => {
    if (isStreaming) return undefined
    
    setContent("")
    setIsStreaming(true)
    
    return simulateResponseStream(
      'citations', // Use our new citations response with inline citation links
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
  
  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };
  
  // Icon mapping based on document type - all using compass blue for uniformity
  const getDocumentIcon = (documentType?: string) => {
    switch (documentType) {
      case 'pdf': 
        return <PdfIcon size={16} className="text-compass-blue" />;
      case 'markdown':
      case 'docx': 
        return <DocIcon size={16} className="text-compass-blue" />;
      case 'excel': 
        return <SheetIcon size={16} className="text-compass-blue" />;
      case 'code': 
        return <CodeIcon size={16} className="text-compass-blue" />;
      case 'html': 
        return <HtmlIcon size={16} className="text-compass-blue" />;
      case 'email': 
        return <EmailIcon size={16} className="text-compass-blue" />;
      case 'database': 
        return <JsonIcon size={16} className="text-compass-blue" />;
      case 'txt': 
        return <TxtIcon size={16} className="text-compass-blue" />;
      default: 
        return <UnknownIcon size={16} className="text-compass-blue" />;
    }
  };
  
  return (
    <div ref={containerRef} id="message-display" className="space-y-6">
      {/* User Message (if any) */}
      {userMessage && (
        <div className="flex justify-end mb-8">
          <div className="bg-secondary/80 text-secondary-foreground py-2.5 px-4 rounded-2xl max-w-[80%]">
            {userMessage}
          </div>
        </div>
      )}
      
      {/* AI Response with Tabs */}
      {(isStreaming || content) && (
        <div className="max-w-3xl overflow-hidden bg-background">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              className={`px-4 py-3 text-sm font-medium relative flex items-center gap-2 transition-colors
                ${activeTab === 'compass' 
                  ? 'text-foreground border-b-2 border-compass-blue' 
                  : 'text-muted-foreground hover:text-foreground/80'}`}
              onClick={() => setActiveTab('compass')}
            >
              Compass
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium relative flex items-center gap-2 transition-colors
                ${activeTab === 'sources' 
                  ? 'text-foreground border-b-2 border-compass-blue' 
                  : 'text-muted-foreground hover:text-foreground/80'}`}
              onClick={() => setActiveTab('sources')}
            >
              Sources ({citationSources.length})
            </button>
          </div>
          
          {/* Loading indicator */}
          {isStreaming && content.length === 0 && (
            <div className="flex items-center space-x-2 text-muted-foreground my-8 justify-center p-8">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-150" />
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-300" />
            </div>
          )}
          
          {/* Tab Content */}
          <div className="pt-6 px-1">
            {/* Compass Tab - Shows the AI response with citations */}
            {activeTab === 'compass' && content && (
              <>
                {/* Minimal source summary header */}
                <div className="mb-5 pb-4 border-b border-border/40">
                  {/* Minimal text-only indicator */}
                  <div className="text-xs text-muted-foreground mb-3">
                    Showing results from {citationSources.length} sources
                  </div>
                  
                  {/* Source samples with +m more indicator */}
                  <div className="flex flex-row gap-2 w-full">
                    {/* First two sources and "more" chip spread across the width */}
                    {[...citationSources]
                      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
                      .slice(0, 2)
                      .map((source, index) => (
                        <div 
                          key={source.id}
                          className="flex items-start gap-2 bg-muted/30 rounded p-2 text-xs cursor-pointer hover:bg-muted/50 transition-colors flex-1"
                          onClick={() => {
                            openRightPanel('document', {
                              documentName: source.title,
                              content: source.content,
                              source: source
                            });
                          }}
                        >
                          {getDocumentIcon(source.documentType)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium mb-0.5 truncate">{source.title}</div>
                            <div className="text-muted-foreground line-clamp-1">{source.source}</div>
                          </div>
                        </div>
                      ))
                    }
                    
                    {/* +m more sources indicator */}
                    {citationSources.length > 2 && (
                      <div 
                        className="flex items-center justify-center bg-muted/30 rounded p-2 text-xs cursor-pointer hover:bg-muted/50 transition-colors text-muted-foreground font-medium flex-1"
                        onClick={() => setActiveTab('sources')}
                      >
                        +{citationSources.length - 2} more sources
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Main response content */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Override pre to avoid the extra wrapper
                    pre({node, children}) {
                      // Return just the children without the pre wrapper
                      return <>{children}</>;
                    },
                    // Handle links, including our custom citation protocol
                    a({node, href, children, ...props}) {
                      // Check if this is a citation link (using our custom protocol)
                      if (href && href.startsWith('cite://') || true) {
                        // Get citation ID for potential lookup
                        const citationId = href?.replace('cite://', '') || '1';
                        
                        // Find the source data for this citation
                        const sourceData = citationSources.find(source => source.id === citationId);
                        
                        // Neutral default with compass blue hover effect
                        return (
                          <span 
                            className="inline-flex items-center justify-center bg-muted/80 hover:bg-compass-blue hover:text-compass-blue-foreground
                                    text-muted-foreground text-xs font-medium px-1.5 py-0.5 rounded-sm mx-0.5 cursor-pointer 
                                    transition-all duration-150 align-baseline"
                            onClick={(e) => {
                              // If shift key is pressed, open the source in the right panel
                              // Otherwise, switch to the sources tab
                              if (e.shiftKey && sourceData) {
                                openRightPanel('document', {
                                  documentName: sourceData.title,
                                  content: sourceData.content,
                                  source: sourceData
                                });
                              } else {
                                setActiveTab('sources');
                              }
                            }}
                            title="Click to view sources, Shift+Click to open in side panel"
                          >
                            {children}
                          </span>
                        );
                      }
                      
                      // Regular links
                      return (
                        <a href={href} target="_blank" rel="noopener noreferrer" {...props} className="text-primary hover:underline">
                          {children}
                        </a>
                      );
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
                                    fontSize: '13px',
                                    backgroundColor: '#171615'
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
              </>
            )}
            
            {/* Sources Tab - Shows the citation sources in a Google-like search results format */}
            {activeTab === 'sources' && (
              <div className="space-y-6">
                <div className="text-sm text-muted-foreground">
                  Sources cited in this response:
                </div>
                
                {/* Source Results - Google-like presentation */}
                <div className="space-y-4">
                  {citationSources.map((source) => (
                    <div key={source.id} className="border-b border-border/30 pb-4 last:border-0">
                      <div className="flex items-start gap-3">
                        {/* Document icon */}
                        <div className="mt-1">
                          {getDocumentIcon(source.documentType)}
                        </div>
                        
                        {/* Source content */}
                        <div className="flex-1 min-w-0">
                          {/* Title and type */}
                          <div className="flex items-center gap-2 mb-1">
                            <h3 
                              className="font-medium text-foreground hover:text-primary cursor-pointer" 
                              onClick={() => {
                                // Open the document in the right panel
                                openRightPanel('document', {
                                  documentName: source.title,
                                  content: source.content,
                                  source: source
                                });
                              }}
                            >
                              {source.title}
                            </h3>
                            <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full uppercase font-medium text-muted-foreground">
                              {source.documentType || 'document'}
                            </span>
                          </div>
                          
                          {/* Source and date info */}
                          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                            <span>{source.source}</span>
                            {source.relevanceScore && (
                              <>
                                <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/60"></span>
                                <span className="text-compass-blue">{Math.round(source.relevanceScore * 100)}% relevance</span>
                              </>
                            )}
                          </div>
                          
                          {/* Content preview */}
                          <p className="text-sm text-foreground/80 line-clamp-2 mb-2">
                            {source.content}
                          </p>
                          
                          {/* View full source link */}
                          <button 
                            className="text-xs text-compass-blue flex items-center gap-1 hover:underline"
                            onClick={() => {
                              openRightPanel('document', {
                                documentName: source.title,
                                content: source.content,
                                source: source
                              });
                            }}
                          >
                            <FileText size={12} className="text-compass-blue" />
                            <span>View full source</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}