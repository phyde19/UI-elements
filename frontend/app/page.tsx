"use client";

import { useState } from "react";
import { Header } from "./components/header";
import { SideNavigation } from "./components/side-navigation";
import { ChatInput } from "./components/chat-input";
import { MessageDisplay } from "./components/message-display";
import { DocumentEditor } from "./components/document-editor";
import { useLayout } from "../lib/layout-context";

export default function Home() {
  const [selectedPlugin, setSelectedPlugin] = useState('basic');
  const { isRightPanelOpen, closeRightPanel } = useLayout();
  
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
      
      {/* Main content area with header and chat */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Fixed header at the top */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <Header 
            selectedPlugin={selectedPlugin}
            onSelectPlugin={handleSelectPlugin}
            onNewChat={handleNewChat}
          />
        </div>
        
        {/* Content area - flex row for main content and right panel */}
        <div className="mt-[4.5rem] flex-1 flex overflow-hidden">
          {/* Left area with chat */}
          <div className={`${isRightPanelOpen ? 'w-[350px]' : 'flex-1'} flex flex-col overflow-hidden transition-all duration-300`}>
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
          
          {/* Right panel - document editor */}
          {isRightPanelOpen && (
            <div className="flex-1 h-full">
              <DocumentEditor 
                documentName="Q2 Planning Notes.md"
                onSave={handleSaveDocument}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}