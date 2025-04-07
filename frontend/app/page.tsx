"use client";

import { useState } from "react";
import { ChatInput } from "./components/chat-input";
import { MessageDisplay } from "./components/message-display";
import { Header } from "./components/header";
import { SideNavigation } from "./components/side-navigation";

export default function Home() {
  const handleSendMessage = () => {
    // Reference to the message display component to start streaming
    const messageDisplayRef = document.getElementById('message-display');
    if (messageDisplayRef) {
      // This is a temporary solution - in a real app, you'd use React refs or state management
      const event = new CustomEvent('start-streaming');
      messageDisplayRef.dispatchEvent(event);
    }
  };

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex">
      {/* Side navigation - full height */}
      <SideNavigation />
      
      {/* Main content area with header and chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed header */}
        <Header />
        
        {/* Chat content area - no padding needed for sticky header */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable message area */}
          <div id="chat-scroll-container" className="flex-1 scrollbar-stable overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <MessageDisplay />
            </div>
          </div>
          
          {/* Chat input area (NO BORDER!) */}
          <div className="bg-background py-2">
            <div className="max-w-3xl mx-auto px-4 pb-4 pr-[calc(1rem+8px)]">
              <ChatInput onSend={handleSendMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}