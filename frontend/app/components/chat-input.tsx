"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUp, Paperclip, Wand2, Settings } from "lucide-react"

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
      <div className={`relative flex flex-col bg-muted/50 ${isFocused ? "ring-2 ring-accent/30" : "ring-1 ring-border"} rounded-3xl p-2.5 transition-all duration-200 overflow-hidden`}>
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
          className="w-full bg-transparent resize-none outline-none p-3 max-h-40 text-foreground placeholder:text-muted-foreground min-h-[60px]"
          rows={1}
        />

        {/* Bottom toolbar with buttons */}
        <div className="flex items-center justify-between py-0.5 pb-1 px-3">
          {/* Left side buttons */}
          <div className="flex items-center gap-1.5">
            <button 
              className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-border"
              aria-label="Attach files"
              type="button"
            >
              <Paperclip size={18} strokeWidth={1.75} />
            </button>
            
            <button 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-muted-foreground hover:bg-secondary hover:text-accent transition-colors border border-border"
              aria-label="Magic features"
              type="button"
            >
              <Wand2 size={18} strokeWidth={1.75} />
              <span className="text-sm font-medium">Calibrate</span>
            </button>
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center gap-1.5">
            <button 
              className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-border"
              aria-label="Settings"
              type="button"
            >
              <Settings size={18} strokeWidth={1.75} />
            </button>

            {/* Send button */}
            <button
              className="p-2.5 rounded-full flex items-center justify-center transition-all duration-300 bg-compass-blue text-compass-blue-foreground hover:bg-compass-blue/90 shadow-sm hover:shadow-md hover:scale-105"
              aria-label="Send message"
              onClick={handleSubmit}
              type="button"
            >
              <ArrowUp size={18} />
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