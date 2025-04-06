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
      
      {/* Main scrollable content area - full width with scrollbar at edge */}
      <div className="flex-1 overflow-y-auto pt-16 pb-4">
        {/* Content width constraint */}
        <div className="w-full max-w-3xl mx-auto px-4">
          <MessageDisplay />
        </div>
      </div>
      
      {/* Chat input fixed at bottom - full width */}
      <div className="border-t border-transparent py-2">
        <div className="w-full max-w-3xl mx-auto px-4 pb-4">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}