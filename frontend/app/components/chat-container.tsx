'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Sliders } from 'lucide-react'
import { PluginSelector } from './plugin-selector'
import { ChatInput } from './chat-input'
import { MessageDisplay } from './message-display'

export function ChatContainer({ initialPlugin = null, onBack }) {
  const [selectedPlugin, setSelectedPlugin] = useState(initialPlugin)
  const [showPluginSelection, setShowPluginSelection] = useState(!initialPlugin)
  
  // Update if initialPlugin changes
  useEffect(() => {
    if (initialPlugin) {
      setSelectedPlugin(initialPlugin)
      setShowPluginSelection(false)
    }
  }, [initialPlugin])
  
  const handlePluginSelect = (plugin) => {
    setSelectedPlugin(plugin)
    setShowPluginSelection(false)
  }
  
  const handleSendMessage = (message) => {
    // Reference to the message display component to start streaming
    const messageDisplayElement = document.getElementById('message-display')
    if (messageDisplayElement) {
      // This is a temporary solution - in a real app, you'd use React refs or state management
      const event = new CustomEvent('start-streaming', {
        detail: { message }
      })
      messageDisplayElement.dispatchEvent(event)
    }
  }
  
  const handleBackToPlugins = () => {
    if (onBack) {
      onBack()
    } else {
      setShowPluginSelection(true)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {showPluginSelection ? (
        // Plugin selection screen
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <PluginSelector onSelect={handlePluginSelect} />
          </div>
        </div>
      ) : (
        // Chat interface
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Minimal plugin context bar */}
          {selectedPlugin && (
            <div className="bg-background/90 backdrop-blur-sm py-3 px-4 sticky top-0 z-10">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleBackToPlugins}
                    className="p-1.5 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
                      {selectedPlugin.iconSrc ? (
                        <img 
                          src={selectedPlugin.iconSrc} 
                          alt={selectedPlugin.name} 
                          className="w-5 h-5"
                        />
                      ) : (
                        <selectedPlugin.icon size={18} className="text-foreground/80" />
                      )}
                    </div>
                    <span className="font-medium">{selectedPlugin.name}</span>
                  </div>
                </div>
                
                <button className="p-1.5 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                  <Sliders size={16} />
                </button>
              </div>
            </div>
          )}
          
          {/* Scrollable message area */}
          <div id="chat-scroll-container" className="flex-1 overflow-y-auto scrollbar-stable">
            <div className="max-w-3xl mx-auto px-4 py-6">
              <MessageDisplay />
            </div>
          </div>
          
          {/* Chat input at the bottom */}
          <div className="py-4 bg-background/90 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto px-4">
              <ChatInput onSend={handleSendMessage} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}