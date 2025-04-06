"use client";

import { useState } from "react";
import { ThemeToggle } from "./components/theme-toggle";
import { ChatInput } from "./components/chat-input";
import { MessageDisplay } from "./components/message-display";

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
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      
      {/* Content container with same width constraints for both message display and input */}
      <div className="flex flex-col flex-1 w-full max-w-3xl mx-auto">
        {/* Message display area - takes available space and scrolls */}
        <div className="flex-1 overflow-y-auto pb-4 px-4">
          <div className="py-6">
            <MessageDisplay />
          </div>
        </div>
        
        {/* Chat input fixed at bottom */}
        <div className="px-4 pb-6 bg-background">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}