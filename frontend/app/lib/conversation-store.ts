import { create } from 'zustand'
import { Conversation, Message, MessageRole, ResponseType } from '../types'
import { simulateResponseStream } from '../mocks/stream'

// Unique ID generator
const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`

interface ConversationState {
  conversations: Conversation[]
  activeConversationId: string | null
  isStreaming: boolean
  
  // Getters
  activeConversation: Conversation | null
  
  // Actions
  createConversation: () => string
  sendMessage: (content: string) => void
  addMessage: (role: MessageRole, content: string, isStreaming?: boolean) => void
  updateMessageContent: (messageId: string, content: string) => void
  finishStreaming: (messageId: string) => void
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  isStreaming: false,
  
  // Getter for active conversation
  get activeConversation() {
    const { conversations, activeConversationId } = get()
    if (!activeConversationId) return null
    return conversations.find(c => c.id === activeConversationId) || null
  },
  
  // Create a new conversation
  createConversation: () => {
    const id = generateId()
    set(state => ({
      conversations: [...state.conversations, { id, messages: [] }],
      activeConversationId: id
    }))
    return id
  },
  
  // Add a message to the active conversation
  addMessage: (role, content, isStreaming = false) => {
    const state = get()
    let conversationId = state.activeConversationId
    
    // Create a conversation if none exists
    if (!conversationId) {
      conversationId = state.createConversation()
    }
    
    const message: Message = {
      id: generateId(),
      role,
      content,
      timestamp: Date.now(),
      isStreaming
    }
    
    set(state => ({
      conversations: state.conversations.map(convo => 
        convo.id === conversationId 
          ? {
              ...convo,
              messages: [...convo.messages, message]
            }
          : convo
      ),
      isStreaming: role === 'assistant' && isStreaming ? true : state.isStreaming
    }))
    
    return message.id
  },
  
  // Send a message and get a response
  sendMessage: (content: string) => {
    const state = get()
    
    // Don't send if already streaming
    if (state.isStreaming) return
    
    // Add user message
    state.addMessage('user', content)
    
    // Add initial empty assistant message
    const assistantMessageId = state.addMessage('assistant', '', true)
    
    // Select a random response type for demonstration
    const responseTypes: ResponseType[] = ['basic', 'standard', 'code', 'data-table', 'bullet-points', 'error', 'complex']
    const randomType = responseTypes[Math.floor(Math.random() * responseTypes.length)]
    
    // Start streaming the AI response
    simulateResponseStream(
      randomType, 
      (char) => {
        const state = get()
        const activeConvo = state.activeConversation
        if (!activeConvo) return
        
        const message = activeConvo.messages.find(m => m.id === assistantMessageId)
        if (!message) return
        
        state.updateMessageContent(assistantMessageId, message.content + char)
      },
      () => {
        get().finishStreaming(assistantMessageId)
      }
    )
  },
  
  // Update a message's content
  updateMessageContent: (messageId, content) => {
    set(state => ({
      conversations: state.conversations.map(convo => 
        convo.id === state.activeConversationId 
          ? {
              ...convo,
              messages: convo.messages.map(msg => 
                msg.id === messageId 
                  ? { ...msg, content }
                  : msg
              )
            }
          : convo
      )
    }))
  },
  
  // Mark a streaming message as complete
  finishStreaming: (messageId) => {
    set(state => ({
      conversations: state.conversations.map(convo => 
        convo.id === state.activeConversationId 
          ? {
              ...convo,
              messages: convo.messages.map(msg => 
                msg.id === messageId 
                  ? { ...msg, isStreaming: false }
                  : msg
              )
            }
          : convo
      ),
      isStreaming: false
    }))
  }
}))