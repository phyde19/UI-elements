"use client";

import { ThemeToggle } from "./components/theme-toggle";
import { ChatInput } from "./components/chat-input";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between bg-background text-foreground">
      <div className="fixed top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      
      {/* Empty space for chat messages will go here */}
      <div className="flex-1 w-full"></div>
      
      {/* Bottom chat input */}
      <div className="w-full max-w-3xl mx-auto px-4 pb-8 pt-4">
        <ChatInput />
      </div>
    </div>
  );
}