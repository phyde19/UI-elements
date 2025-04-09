"use client";

import { useState } from "react";
import { SideNavigation } from "./components/side-navigation";
import { ChatInput } from "./components/chat-input";
import { MessageDisplay } from "./components/message-display";
import { DocumentEditor } from "./components/document-editor";
import { useLayout } from "../lib/layout-context";
import { ThemeToggle } from "./components/theme-toggle";
import { PluginSelectorDropdown } from "./components/plugin-selector-dropdown";
import { PanelRight } from "lucide-react";

export default function Home() {
  const [selectedPlugin, setSelectedPlugin] = useState('basic');
  const { isRightPanelOpen, closeRightPanel, toggleRightPanel } = useLayout();
  
  const handleSendMessage = (message) => {
    // Reference to the message display component to start streaming
    const messageDisplayRef = document.getElementById('message-display');
    if (messageDisplayRef) {
      // This is a temporary solution - in a real app, you'd use React refs or state management
      const event = new CustomEvent('start-streaming', { 
        detail: { message }
      });
      messageDisplayRef.dispatchEvent(event);
    }
  };
  
  const handleSelectPlugin = (pluginId) => {
    setSelectedPlugin(pluginId);
  };
  
  const handleNewChat = (pluginId = null) => {
    // Start a new chat, optionally with a specific plugin
    if (pluginId) {
      setSelectedPlugin(pluginId);
    }
    
    // Reset message display (simplified for demo purposes)
    const messageDisplayRef = document.getElementById('message-display');
    if (messageDisplayRef) {
      const event = new CustomEvent('reset-chat');
      messageDisplayRef.dispatchEvent(event);
    }
  };
  
  const handleSaveDocument = (content) => {
    console.log("Document saved:", content.substring(0, 50) + "...");
    // In a real app, this would save to a backend
  };

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex">
      {/* Side navigation - full height */}
      <SideNavigation />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left side with header and chat - fixed width when panel is open */}
        <div className={`${isRightPanelOpen ? 'w-[380px] flex-shrink-0' : 'flex-1'} flex flex-col overflow-hidden relative transition-all duration-300`}>
          {/* Fixed header at the top */}
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
                aria-label="Toggle document panel"
                title="Toggle document panel"
              >
                <PanelRight size={18} />
              </button>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Chat content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable message area */}
            <div id="chat-scroll-container" className="flex-1 scrollbar-stable overflow-y-auto">
              <div className="px-4 py-4">
                <MessageDisplay />
              </div>
            </div>
            
            {/* Chat input area */}
            <div className="bg-background py-2">
              <div className="px-4 pb-4">
                <ChatInput onSend={handleSendMessage} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right panel - document editor */}
        {isRightPanelOpen && (
          <div className="flex-1 h-screen">
            <DocumentEditor 
              documentName="Q2 Planning Notes.md"
              onSave={handleSaveDocument}
            />
          </div>
        )}
      </div>
    </div>
  );
}