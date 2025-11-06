'use client'

import React, { useState } from 'react'
import { X, MessageSquare, User, Mail } from 'lucide-react'

interface FeedbackModalProps {
  onClose: () => void
  onSubmit: (feedback: string, username?: string, email?: string) => void
}

export function FeedbackModal({ onClose, onSubmit }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim()) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(feedback, username.trim() || undefined, email.trim() || undefined)
      onClose()
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
              <MessageSquare size={16} className="text-accent" />
            </div>
            <h2 className="text-lg font-medium">Tell us more</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="p-4 flex-1">
            <p className="text-sm text-muted-foreground mb-4">
              Help us improve by sharing your thoughts about this response. Your feedback helps us build better AI experiences.
            </p>
            
            {/* Feedback textarea */}
            <div className="mb-4">
              <label htmlFor="feedback" className="block text-sm font-medium mb-2">
                Your feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What did you think about this response? Was it helpful? Could it be improved?"
                className="w-full bg-muted/30 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none min-h-[120px] placeholder:text-muted-foreground/70"
                required
              />
            </div>
            
            {/* Username field */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span>Username (optional)</span>
                </div>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name or handle"
                className="w-full bg-muted/30 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 placeholder:text-muted-foreground/70"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional - helps us attribute your feedback
              </p>
            </div>

            {/* Email field */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <span>BCBST Email (optional)</span>
                </div>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@bcbst.com"
                className="w-full bg-muted/30 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 placeholder:text-muted-foreground/70"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional - for follow-up questions or clarifications
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md hover:bg-muted text-sm transition-colors text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!feedback.trim() || isSubmitting}
              className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm transition-colors hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}