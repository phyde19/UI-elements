"use client";

import { useState } from "react";
import { Header } from "./components/header";
import { SideNavigation } from "./components/side-navigation";
import { ChatInput } from "./components/chat-input";
import { MessageDisplay } from "./components/message-display";

export default function Home() {
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  
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
        
        {/* Chat content area that scrolls under the header */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable message area */}
          <div id="chat-scroll-container" className="flex-1 scrollbar-stable overflow-y-auto">
            {/* Top padding to push content below header + gradient (18px header + 6px gradient) */}
            <div className="pt-[4.5rem] mt-1">
              <div className="max-w-3xl mx-auto px-4 py-4">
                <MessageDisplay />
              </div>
            </div>
          </div>
          
          {/* Chat input area */}
          <div className="bg-background py-2">
            <div className="max-w-3xl mx-auto px-4 pb-4">
              <ChatInput onSend={handleSendMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}