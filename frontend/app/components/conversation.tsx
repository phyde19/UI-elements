'use client'

import { useRef, useEffect } from 'react'
import { useConversationStore } from '../lib/conversation-store'
import { Message } from './message'

export function Conversation() {
  const activeConversation = useConversationStore(state => state.activeConversation)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // Find the scrollable container using its ID
    const scrollContainer = document.getElementById('chat-scroll-container')
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [activeConversation?.messages])
  
  if (!activeConversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">Start a conversation by sending a message</p>
      </div>
    )
  }
  
  return (
    <div 
      ref={containerRef}
      className="flex flex-col w-full mx-auto max-w-[96%] space-y-4 overflow-y-auto"
    >
      {activeConversation.messages.map(message => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  )
}