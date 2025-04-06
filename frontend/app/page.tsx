"use client";

import { ThemeToggle } from "./components/theme-toggle";
import { ChatInput } from "./components/chat-input";
import { MessageDisplay } from "./components/message-display";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between bg-background text-foreground">
      <div className="fixed top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      
      {/* Message display area in the center */}
      <div className="flex-1 w-full flex items-center justify-center p-4">
        <MessageDisplay />
      </div>
      
      {/* Bottom chat input */}
      <div className="w-full max-w-3xl mx-auto px-4 pb-8 pt-4">
        <ChatInput />
      </div>
    </div>
  );
}