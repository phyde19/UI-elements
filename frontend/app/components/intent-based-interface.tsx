'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Compass, 
  Sparkles, 
  Search, 
  Layers, 
  FileText, 
  Database, 
  Code2, 
  GitMerge, 
  TrendingUp, 
  X, 
  Plus, 
  Command, 
  Zap
} from 'lucide-react'

// Simplified capability model that combines workspaces and plugins
interface Capability {
  id: string
  name: string
  description: string
  icon: React.ElementType
  tags: string[]
  category: string
  contextTriggers: string[] // Words or phrases that might trigger this capability
}

// Sample capabilities catalog
const CAPABILITIES: Capability[] = [
  {
    id: 'doc-search',
    name: 'Document Search',
    description: 'Find answers in your team documents',
    icon: FileText,
    tags: ['search', 'documents', 'knowledge base', 'files'],
    category: 'Knowledge',
    contextTriggers: ['file', 'document', 'find', 'search', 'look up']
  },
  {
    id: 'data-query',
    name: 'Data Explorer',
    description: 'Analyze and visualize data from databases',
    icon: Database,
    tags: ['data', 'database', 'analytics', 'SQL', 'query'],
    category: 'Data',
    contextTriggers: ['data', 'analyze', 'database', 'report', 'metrics', 'numbers']
  },
  {
    id: 'code-helper',
    name: 'Code Assistant',
    description: 'Get help with coding problems and review',
    icon: Code2,
    tags: ['code', 'development', 'programming', 'debugging'],
    category: 'Engineering',
    contextTriggers: ['code', 'function', 'error', 'bug', 'implementation', 'API']
  },
  {
    id: 'workflow-builder',
    name: 'Workflow Automation',
    description: 'Create and manage automated workflows',
    icon: GitMerge,
    tags: ['automation', 'workflows', 'processes', 'integration'],
    category: 'Automation',
    contextTriggers: ['workflow', 'automate', 'process', 'steps', 'sequence']
  },
  {
    id: 'market-insights',
    name: 'Market Intelligence',
    description: 'Analyze market trends and competitor data',
    icon: TrendingUp,
    tags: ['market', 'analytics', 'trends', 'competitors', 'business'],
    category: 'Marketing',
    contextTriggers: ['market', 'trend', 'competitor', 'industry', 'analysis']
  }
]

export function IntentBasedInterface() {
  const [inputValue, setInputValue] = useState('')
  const [activeCapabilities, setActiveCapabilities] = useState<Capability[]>([])
  const [suggestedCapabilities, setSuggestedCapabilities] = useState<Capability[]>([])
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null)
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Simulate command palette hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Analyze input to suggest relevant capabilities
  useEffect(() => {
    if (!inputValue) {
      setSuggestedCapabilities([])
      return
    }
    
    // Simple algorithm to detect intent from text
    const matchedCapabilities = CAPABILITIES.filter(capability => {
      const inputLower = inputValue.toLowerCase()
      
      // Check if any trigger words are in the input
      return capability.contextTriggers.some(trigger => 
        inputLower.includes(trigger.toLowerCase())
      )
    })
    
    // Sort by relevance (more advanced algorithms would be used in production)
    const sortedCapabilities = matchedCapabilities.sort((a, b) => {
      const aRelevance = a.contextTriggers.filter(t => 
        inputValue.toLowerCase().includes(t.toLowerCase())
      ).length
      
      const bRelevance = b.contextTriggers.filter(t => 
        inputValue.toLowerCase().includes(t.toLowerCase())
      ).length
      
      return bRelevance - aRelevance
    })
    
    setSuggestedCapabilities(sortedCapabilities.slice(0, 3))
  }, [inputValue])

  // Sample conversation for demonstration
  const simulatedConversation = [
    { text: "I need to analyze our Q4 sales data", user: true },
    { text: "I can help you analyze your Q4 sales data. What specific metrics are you interested in?", user: false },
    { text: "Can you show me the trend in customer acquisition cost?", user: true },
    { text: "I'll analyze that for you. Based on your data source, here's the CAC trend for Q4:", user: false, hasVisualization: true }
  ]

  // Handle capability activation
  const activateCapability = (capability: Capability) => {
    setSelectedCapability(capability)
    setActiveCapabilities(prev => {
      if (!prev.some(c => c.id === capability.id)) {
        return [...prev, capability]
      }
      return prev
    })
    setIsCommandPaletteOpen(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Remove capability
  const removeCapability = (capabilityId: string) => {
    setActiveCapabilities(prev => prev.filter(c => c.id !== capabilityId))
    if (selectedCapability?.id === capabilityId) {
      setSelectedCapability(null)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Minimal header with context awareness */}
      <header className="h-14 border-b border-border/20 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass size={24} className="text-accent" />
          <span className="font-medium text-lg">Compass</span>
          
          {selectedCapability && (
            <div className="ml-4 flex items-center text-sm">
              <span className="text-muted-foreground mx-2">•</span>
              <div className="flex items-center gap-1.5 bg-accent/10 text-accent rounded-md py-0.5 px-2">
                <selectedCapability.icon size={14} />
                <span>{selectedCapability.name}</span>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted/30 transition-colors"
          >
            <Command size={14} />
            <span>Find capabilities</span>
            <kbd className="ml-1 px-1.5 py-0.5 bg-muted/50 rounded text-xs">⌘K</kbd>
          </button>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat window */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Conversation */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {simulatedConversation.map((message, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${message.user ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`rounded-lg px-4 py-3 max-w-lg ${
                    message.user 
                      ? 'bg-accent/10 text-accent rounded-br-none' 
                      : 'bg-muted/30 rounded-bl-none'
                  }`}>
                    <p>{message.text}</p>
                    
                    {message.hasVisualization && (
                      <div className="mt-3 bg-background rounded-md border border-border p-4">
                        <div className="text-xs text-muted-foreground mb-1.5">
                          <Zap size={12} className="inline mr-1 text-accent" />
                          Using Data Explorer
                        </div>
                        
                        {/* Simulated data visualization */}
                        <div className="h-32 flex items-end gap-1.5">
                          <div className="bg-red-500/70 w-6 h-40%" title="Oct: $42"></div>
                          <div className="bg-red-500/70 w-6 h-35%" title="Nov: $38"></div>
                          <div className="bg-green-500/70 w-6 h-30%" title="Dec: $32"></div>
                        </div>
                        
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>October</span>
                          <span>November</span>
                          <span>December</span>
                        </div>
                        
                        <div className="mt-3 text-sm">
                          <p>CAC decreased by 24% over Q4, from $42 to $32 per customer.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Context-aware input area */}
          <div className="border-t border-border/10 bg-background">
            <div className="max-w-3xl mx-auto p-4">
              {/* Ambient capability suggestion based on context */}
              {suggestedCapabilities.length > 0 && (
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Sparkles size={12} className="text-amber-400" />
                    <span>I can help with:</span>
                  </div>
                  
                  <div className="flex gap-1.5">
                    {suggestedCapabilities.map(capability => (
                      <button
                        key={capability.id}
                        onClick={() => activateCapability(capability)}
                        className="flex items-center gap-1 text-xs rounded-full py-1 px-2 bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                      >
                        <capability.icon size={12} />
                        <span>{capability.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Active capabilities */}
              {activeCapabilities.length > 0 && (
                <div className="mb-2 flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Zap size={12} />
                    <span>Active:</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {activeCapabilities.map(capability => (
                      <button
                        key={capability.id}
                        onClick={() => setSelectedCapability(capability)}
                        className={`flex items-center gap-1 text-xs rounded-full py-1 px-2 ${
                          selectedCapability?.id === capability.id
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted/30 hover:bg-muted/50'
                        } transition-colors group`}
                      >
                        <capability.icon size={12} />
                        <span>{capability.name}</span>
                        <X 
                          size={12} 
                          className="opacity-0 group-hover:opacity-100 ml-1 hover:text-red-400" 
                          onClick={(e) => {
                            e.stopPropagation()
                            removeCapability(capability.id)
                          }} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Input with contextual awareness */}
              <div className={`flex items-center gap-2 p-2 rounded-lg border ${
                selectedCapability 
                  ? 'border-accent/30 bg-accent/5' 
                  : 'border-border/30 bg-muted/10'
              }`}>
                {selectedCapability && (
                  <div className="flex-shrink-0">
                    <selectedCapability.icon 
                      size={18} 
                      className="text-accent" 
                    />
                  </div>
                )}
                
                <input
                  type="text"
                  ref={inputRef}
                  placeholder={selectedCapability 
                    ? `Ask about ${selectedCapability.name.toLowerCase()}...` 
                    : "What do you need help with today?"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
                
                <button className="bg-accent text-accent-foreground rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent/90 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Command palette overlay */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-xl overflow-hidden">
            <div className="p-4 border-b border-border/30">
              <div className="flex items-center gap-2">
                <Search size={18} className="text-muted-foreground" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search capabilities..."
                  className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-foreground placeholder:text-muted-foreground"
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-xs text-muted-foreground">ESC</kbd>
              </div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
              {/* Group capabilities by category */}
              {Object.entries(CAPABILITIES.reduce<Record<string, Capability[]>>((acc, capability) => {
                if (!acc[capability.category]) {
                  acc[capability.category] = []
                }
                acc[capability.category].push(capability)
                return acc
              }, {})).map(([category, capabilities]) => (
                <div key={category}>
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/5">
                    {category}
                  </div>
                  
                  <div>
                    {capabilities
                      .filter(cap => 
                        !inputValue || 
                        cap.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                        cap.tags.some(tag => tag.toLowerCase().includes(inputValue.toLowerCase()))
                      )
                      .map(capability => (
                        <button
                          key={capability.id}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/20 transition-colors text-left"
                          onClick={() => activateCapability(capability)}
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
                            <capability.icon size={18} className="text-accent" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{capability.name}</div>
                            <div className="text-sm text-muted-foreground">{capability.description}</div>
                          </div>
                        </button>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t border-border/30 bg-muted/5">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Pro tip:</span> Type what you're trying to do, and I'll suggest relevant capabilities
                </div>
                
                <button 
                  onClick={() => setIsCommandPaletteOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}