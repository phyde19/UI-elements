"use client";

import React, { useState } from 'react'
import { Compass, PanelRight } from 'lucide-react'
import { ChatInput } from '../components/chat-input'
import { useLayout } from '../../lib/layout-context'
import { ThemeToggle } from '../components/theme-toggle'
import { PluginSelectorDropdown } from '../components/plugin-selector-dropdown'

// Example prompts that users can click on
const examplePrompts = [
  "Explain the differences between REST and GraphQL",
  "Help me debug a React component that's not rendering correctly",
  "Create a plan for migrating from MongoDB to PostgreSQL",
  "Generate a TypeScript interface for this JSON structure"
]

export default function WelcomePage() {
  const [selectedPlugin, setSelectedPlugin] = useState('basic');
  const { isRightPanelOpen, toggleRightPanel } = useLayout();
  
  // Since this is just for UI/UX demonstration, we'll use a dummy handler
  const handleSendMessage = (message: string) => {
    // In a real implementation, this would process the message
    console.log("Message received:", message);
  }

  const handleSelectPlugin = (pluginId: string) => {
    setSelectedPlugin(pluginId);
  };
  
  const handleNewChat = () => {
    // Handle new chat functionality
  };

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex">
      <div className="flex flex-1 overflow-hidden">
        {/* Left content area - fixed width when panel is open */}
        <div className={`${isRightPanelOpen ? 'w-[380px] flex-shrink-0' : 'flex-1'} flex flex-col transition-all duration-300`}>
          {/* Header at the top */}
          <div className="h-[4.5rem] flex items-center justify-between px-4 border-b border-border/20 bg-background z-20">
            <div className="flex-1">
              <PluginSelectorDropdown 
                selectedPlugin={selectedPlugin}
                onSelectPlugin={handleSelectPlugin}
                onNewChat={handleNewChat}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleRightPanel}
                className={`p-1.5 rounded-md transition-colors ${
                  isRightPanelOpen 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                }`}
                aria-label="Toggle welcome panel"
                title="Toggle welcome panel"
              >
                <PanelRight size={18} />
              </button>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Welcome content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center px-4 pt-8 overflow-auto">
              {/* Logo and app name */}
              <div className="flex flex-col items-center mb-12">
                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Compass className="h-10 w-10 text-accent" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-1">Compass</h1>
                <p className="text-muted-foreground text-sm">Your corporate AI assistant</p>
              </div>

              {/* Example prompts */}
              <div className="w-full max-w-[280px] mb-8">
                <h2 className="text-sm font-medium text-muted-foreground mb-3 text-center">Try asking</h2>
                <div className="space-y-2">
                  {examplePrompts.map((prompt, i) => (
                    <button
                      key={i}
                      className="w-full text-left py-3 px-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-sm text-foreground truncate"
                      onClick={() => handleSendMessage(prompt)}
                      title={prompt}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Chat input at the bottom */}
            <div className="p-4 border-t border-border/10">
              <ChatInput onSend={handleSendMessage} autofocus={true} />
            </div>
          </div>
        </div>
        
        {/* Right panel - takes up the remaining space */}
        {isRightPanelOpen && (
          <div className="flex-1 h-screen bg-muted/10 border-l border-border/10">
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p>Welcome Panel Content</p>
                <p className="text-sm mt-2">This area will contain extended application functionality</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}