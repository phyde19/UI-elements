export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  messages: Message[];
  title?: string;
}

export type ResponseType = 'basic' | 'standard' | 'code' | 'data-table' | 'bullet-points' | 'error' | 'complex';
