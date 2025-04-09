"use client";

import React, { useState } from 'react'
import { Compass } from 'lucide-react'
import { ChatInput } from '../components/chat-input'
import { Header } from '../components/header'
import { useLayout } from '../../lib/layout-context'

// Example prompts that users can click on
const examplePrompts = [
  "Explain the differences between REST and GraphQL",
  "Help me debug a React component that's not rendering correctly",
  "Create a plan for migrating from MongoDB to PostgreSQL",
  "Generate a TypeScript interface for this JSON structure"
]

export default function WelcomePage() {
  const [selectedPlugin, setSelectedPlugin] = useState('basic');
  const { isRightPanelOpen } = useLayout();
  
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
    <div className="h-screen bg-background text-foreground overflow-hidden flex flex-col">
      {/* Fixed header at the top */}
      <div className="z-20">
        <Header 
          selectedPlugin={selectedPlugin}
          onSelectPlugin={handleSelectPlugin}
          onNewChat={handleNewChat}
        />
      </div>
      
      {/* Content area - flex row for main content and right panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left content area - narrow when panel is open */}
        <div className={`${isRightPanelOpen ? 'w-[350px]' : 'flex-1'} flex flex-col transition-all duration-300`}>
          <div className="flex-1 flex flex-col items-center justify-center pt-8 px-4 overflow-auto">
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
        
        {/* Right panel - takes up most of the space when opened */}
        {isRightPanelOpen && (
          <div className="flex-1 h-full bg-muted/10 border-l border-border/10">
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