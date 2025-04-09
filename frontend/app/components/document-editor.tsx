'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Code, 
  Eye, 
  Save, 
  FileText, 
  ChevronDown, 
  FileDown, 
  Copy, 
  Check, 
  History, 
  RotateCcw,
  PencilLine
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../../lib/utils'

interface DocumentEditorProps {
  initialContent?: string
  documentName?: string
  onSave?: (content: string) => void
}

// Example initial content
const DEFAULT_CONTENT = `# Meeting Notes - Q2 Planning

## Agenda

- Review Q1 performance
- Discuss product roadmap for Q2
- Assign action items for the quarter

## Attendees

- Sarah Johnson (Product)
- Mike Chen (Engineering)
- Priya Patel (Design)
- David Kim (Marketing)

## Discussion Points

### Q1 Performance Review

Our team exceeded expectations in Q1 with a 15% increase in user engagement. Key metrics:

- New user acquisition: +22%
- User retention: 78% (up from 65%)
- Feature adoption: 45% of users using new analytics dashboard

### Q2 Priorities

1. Launch mobile application (iOS first, then Android)
2. Implement single sign-on functionality
3. Redesign reporting dashboard
4. Improve onboarding flow

## Action Items

| Task | Owner | Deadline |
|------|-------|----------|
| Complete mobile app wireframes | Priya | April 15 |
| Set up SSO authentication | Mike | May 1 |
| Draft onboarding survey | David | April 10 |
| Schedule user testing | Sarah | April 20 |

## Next Meeting

The next planning meeting is scheduled for **May 5th at 10:00 AM**.
`

// Custom components for rendering markdown
const MarkdownComponents = {
  h1: ({ children }: any) => <h1 className="text-2xl font-semibold mt-6 mb-4">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-xl font-semibold mt-5 mb-3">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-lg font-medium mt-4 mb-3">{children}</h3>,
  h4: ({ children }: any) => <h4 className="text-base font-medium mt-4 mb-2">{children}</h4>,
  p: ({ children }: any) => <p className="my-3 leading-relaxed">{children}</p>,
  ul: ({ children }: any) => <ul className="my-3 pl-6 list-disc">{children}</ul>,
  ol: ({ children }: any) => <ol className="my-3 pl-6 list-decimal">{children}</ol>,
  li: ({ children }: any) => <li className="my-1">{children}</li>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-2 border-muted-foreground pl-4 italic my-4">{children}</blockquote>
  ),
  a: ({ href, children }: any) => (
    <a href={href} className="text-primary underline underline-offset-2 hover:text-primary/80" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  table: ({ children }: any) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => <thead className="bg-muted/50">{children}</thead>,
  th: ({ children }: any) => (
    <th className="border border-border p-2 font-medium text-left">{children}</th>
  ),
  td: ({ children }: any) => <td className="border border-border p-2">{children}</td>,
  pre: ({ children }: any) => (
    <pre className="bg-muted/40 dark:bg-muted/20 rounded-md p-3 my-4 overflow-x-auto">{children}</pre>
  ),
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline ? (
      <code className={className} {...props}>
        {children}
      </code>
    ) : (
      <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  },
  img: ({ src, alt }: any) => (
    <img src={src} alt={alt} className="max-w-full h-auto rounded-md my-4" />
  ),
  hr: () => <hr className="my-6 border-border" />,
  strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }: any) => <em className="italic">{children}</em>,
};

export function DocumentEditor({ 
  initialContent = DEFAULT_CONTENT, 
  documentName = "Untitled Document",
  onSave 
}: DocumentEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isPreviewMode, setIsPreviewMode] = useState(true)
  const [isDirty, setIsDirty] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  useEffect(() => {
    // Auto-adjust textarea height in edit mode
    if (!isPreviewMode && textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [content, isPreviewMode])
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setIsDirty(true)
  }
  
  const handleSave = () => {
    if (onSave) {
      onSave(content)
    }
    setIsDirty(false)
    setLastSaved(new Date())
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border/20 px-4 py-2 bg-background/60 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <FileText size={16} className="mr-2 text-muted-foreground" />
            <span className="font-medium text-sm truncate max-w-[200px]">
              {documentName}
            </span>
          </div>
          
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          
          {isDirty && (
            <span className="text-xs text-amber-500 dark:text-amber-400">
              Unsaved changes
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            className={cn(
              "p-1.5 rounded-md text-sm font-medium flex items-center",
              isPreviewMode
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
            )}
            onClick={() => setIsPreviewMode(true)}
            title="Preview mode"
          >
            <Eye size={16} className="mr-1" />
            <span className="hidden sm:inline">Preview</span>
          </button>
          
          <button
            className={cn(
              "p-1.5 rounded-md text-sm font-medium flex items-center",
              !isPreviewMode
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
            )}
            onClick={() => setIsPreviewMode(false)}
            title="Edit mode"
          >
            <PencilLine size={16} className="mr-1" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          
          <div className="w-px h-5 bg-border/20 mx-1"></div>
          
          <button
            className={cn(
              "p-1.5 rounded-md text-sm font-medium flex items-center",
              isDirty
                ? "text-primary hover:bg-primary/10"
                : "text-muted-foreground/50 cursor-not-allowed"
            )}
            onClick={handleSave}
            disabled={!isDirty}
            title="Save document"
          >
            <Save size={16} className="mr-1" />
            <span className="hidden sm:inline">Save</span>
          </button>
          
          <button
            className="p-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/20 flex items-center"
            onClick={handleCopy}
            title="Copy content"
          >
            {isCopied ? (
              <Check size={16} className="mr-1 text-green-500" />
            ) : (
              <Copy size={16} className="mr-1" />
            )}
            <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
          
          <div className="relative group">
            <button
              className="p-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/20 flex items-center"
              title="More options"
            >
              <ChevronDown size={16} />
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-popover shadow-lg rounded-md border border-border/30 hidden group-hover:block z-10">
              <div className="py-1">
                <button className="px-4 py-2 text-sm text-foreground hover:bg-muted/40 w-full text-left flex items-center">
                  <FileDown size={14} className="mr-2" />
                  Download Markdown
                </button>
                <button className="px-4 py-2 text-sm text-foreground hover:bg-muted/40 w-full text-left flex items-center">
                  <History size={14} className="mr-2" />
                  Version History
                </button>
                <button className="px-4 py-2 text-sm text-foreground hover:bg-muted/40 w-full text-left flex items-center">
                  <RotateCcw size={14} className="mr-2" />
                  Revert Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Editor/Preview area */}
      <div className="flex-1 overflow-hidden">
        {isPreviewMode ? (
          <div className="h-full overflow-auto text-foreground p-6">
            <ReactMarkdown
              components={MarkdownComponents}
              remarkPlugins={[remarkGfm]}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              className="w-full h-full p-6 bg-background border-none focus:outline-none focus:ring-0 resize-none font-mono text-sm"
              spellCheck="false"
            />
          </div>
        )}
      </div>
    </div>
  )
}