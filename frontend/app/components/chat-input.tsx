"use client"

import { useState, useRef, useEffect } from "react"

interface ChatInputProps {
  onSend?: (message: string) => void
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isComposing, setIsComposing] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto"
    // Set new height based on scrollHeight (with a min of 40px)
    textarea.style.height = `${Math.max(textarea.scrollHeight, 40)}px`
  }, [message])

  // Focus textarea when component mounts
  useEffect(() => {
    const timeout = setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
    return () => clearTimeout(timeout)
  }, [])

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const handleSubmit = () => {
    if (message.trim() === "" || isComposing) return
    
    // Send message to parent component if provided
    if (onSend) {
      onSend(message.trim())
    } else {
      console.log("Sending message:", message)
    }
    
    // Clear input after sending
    setMessage("")
    
    // Return focus to textarea
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit()
    }
  }
  
  return (
    <div className="w-full">
      <div className={`relative flex flex-col bg-muted/50 ${isFocused ? "ring-2 ring-accent/30" : "ring-1 ring-border"} rounded-2xl p-2 transition-all duration-200 overflow-hidden`}>
        {/* Textarea for input area */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Message Compass..."
          className="w-full bg-transparent resize-none outline-none p-2 max-h-40 text-foreground placeholder:text-muted-foreground min-h-[60px]"
          rows={1}
        />

        {/* Bottom toolbar with buttons */}
        <div className="flex items-center justify-between py-2 px-2">
          {/* Left side buttons */}
          <div className="flex items-center gap-2">
            <button 
              className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Attach files"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.49-8.49a4 4 0 0 1 5.66 5.66l-8.49 8.49a2 2 0 0 1-2.83-2.83l8.49-8.49" />
              </svg>
            </button>
            
            <button 
              className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-accent transition-colors"
              aria-label="Magic features"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 4V2"/>
                <path d="M15 16v-2"/>
                <path d="M8 9h2"/>
                <path d="M20 9h2"/>
                <path d="M17.8 11.8 19 13"/>
                <path d="M15 9h0"/>
                <path d="M17.8 6.2 19 5"/>
                <path d="m3 21 9-9"/>
                <path d="M12.2 6.2 11 5"/>
              </svg>
            </button>
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <button 
              className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Settings"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>

            {/* Send button */}
            <button
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                message.trim() 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary cursor-not-allowed"
              }`}
              aria-label="Send message"
              disabled={!message.trim()}
              onClick={handleSubmit}
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m15 5 7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Optional info text */}
      <div className="text-xs text-muted-foreground text-center mt-2">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  )
}