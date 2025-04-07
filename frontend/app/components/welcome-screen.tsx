'use client'

import React from 'react'
import { ChatInput } from './chat-input'
import { Compass } from 'lucide-react'

// Common example prompts that users can click on
const examplePrompts = [
  "Explain the differences between REST and GraphQL",
  "Help me debug a React component that's not rendering correctly",
  "Create a plan for migrating from MongoDB to PostgreSQL",
  "Generate a TypeScript interface for this JSON structure"
]

interface WelcomeScreenProps {
  onSend: (message: string) => void
}

export function WelcomeScreen({ onSend }: WelcomeScreenProps) {
  // Handle clicking on an example prompt
  const handlePromptClick = (prompt: string) => {
    onSend(prompt)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full px-4">
      {/* Logo and app name */}
      <div className="mb-12 flex flex-col items-center">
        <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
          <Compass className="h-10 w-10 text-accent" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-1">Compass</h1>
        <p className="text-muted-foreground text-sm">Your corporate AI assistant</p>
      </div>

      {/* Chat input centered in welcome screen */}
      <div className="w-full max-w-2xl mb-8">
        <ChatInput onSend={onSend} autofocus={true} />
      </div>

      {/* Example prompts */}
      <div className="w-full max-w-2xl">
        <h2 className="text-sm font-medium text-muted-foreground mb-3 text-center">Try asking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handlePromptClick(prompt)}
              className="text-left py-3 px-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-sm text-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}