"use client";

import React from 'react'
import Link from 'next/link'
import { Compass } from 'lucide-react'
import { ChatInput } from '../components/chat-input'

// Example prompts that users can click on
const examplePrompts = [
  "Explain the differences between REST and GraphQL",
  "Help me debug a React component that's not rendering correctly",
  "Create a plan for migrating from MongoDB to PostgreSQL",
  "Generate a TypeScript interface for this JSON structure"
]

export default function WelcomePage() {
  // Since this is just for UI/UX demonstration, we'll use a dummy handler
  const handleSendMessage = (message: string) => {
    // In a real implementation, this would process the message
    console.log("Message received:", message);
  }

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex">
      {/* Main content area (centered) */}
      <div className="flex-1 flex flex-col items-center justify-center pt-8">
        <div className="w-full max-w-3xl px-4">
          <div className="flex flex-col items-center mb-12">
            {/* Logo and app name */}
            <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Compass className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Compass</h1>
            <p className="text-muted-foreground text-sm">Your corporate AI assistant</p>
          </div>

          {/* Chat input centered in welcome screen */}
          <div className="w-full max-w-2xl mx-auto mb-10">
            <ChatInput onSend={handleSendMessage} autofocus={true} />
          </div>

          {/* Example prompts */}
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-sm font-medium text-muted-foreground mb-3 text-center">Try asking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {examplePrompts.map((prompt, i) => (
                <Link href="/" key={i}>
                  <button
                    className="w-full text-left py-3 px-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-sm text-foreground"
                  >
                    {prompt}
                  </button>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}