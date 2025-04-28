'use client'

import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronRight, Search, ArrowLeft, FileText, Clock, Calendar } from 'lucide-react'
import { cn } from '../../lib/utils'

// Document type icons
import { FileText as DocIcon } from 'lucide-react'
import { FileCode as CodeIcon } from 'lucide-react'
import { Table as SheetIcon } from 'lucide-react'
import { FileImage as PdfIcon } from 'lucide-react'
import { Mail as EmailIcon } from 'lucide-react'
import { FileJson as JsonIcon } from 'lucide-react'
import { FileType as TxtIcon } from 'lucide-react'
import { Globe as HtmlIcon } from 'lucide-react'
import { File as UnknownIcon } from 'lucide-react'

// Type definitions
export interface SearchResult {
  id: string
  title: string
  source: string
  documentType?: 'pdf' | 'markdown' | 'docx' | 'txt' | 'excel' | 'html' | 'email' | 'code' | 'database' | 'unknown'
  preview: string
  content: string
  url?: string
  relevanceScore?: number
  metadata?: Record<string, any>
  lastModified?: string
}

interface SearchResultsProps {
  results?: SearchResult[]
}

// Default demo results for development
const DEMO_RESULTS: SearchResult[] = [
  {
    id: '1',
    title: 'Company Policy on Remote Work',
    source: 'Employee Handbook',
    documentType: 'markdown',
    preview: 'Employees are allowed to work remotely up to 3 days per week with manager approval. Remote work arrangements must be documented...',
    content: `# Remote Work Policy

Employees are allowed to work remotely up to 3 days per week with manager approval. Remote work arrangements must be documented in the HR portal.

## Requirements
- Maintain regular working hours (9am-5pm in your time zone)
- Be available for virtual meetings during core hours
- Secure reliable internet connection
- Complete the home office safety checklist

Remote employees must ensure their home workspace meets security requirements outlined in the IT security policy section 4.2.

## Approval Process
1. Discuss with your direct manager
2. Submit remote work request through HR portal
3. Complete required training
4. Sign remote work agreement

Contact HR@example.com with any questions.`,
    metadata: {
      department: 'Human Resources',
      pageNumber: 42
    },
    lastModified: '2023-08-15',
    relevanceScore: 0.92
  },
  {
    id: '2',
    title: 'Quarterly Financial Report: Q1 2024',
    source: 'Finance Department',
    documentType: 'excel',
    preview: 'Revenue: $4.2M (↑12% YoY), Operating Expenses: $2.8M (↑5% YoY), Net Profit: $1.4M (↑18% YoY)...',
    content: `# Quarterly Financial Report: Q1 2024

## Key Metrics
- Revenue: $4,245,000 (↑12% YoY)  
- Operating Expenses: $2,823,000 (↑5% YoY)
- Net Profit: $1,422,000 (↑18% YoY)
- Cash Reserves: $8.6M
- Customer Acquisition Cost: $420 (↓8% YoY)
- Average Contract Value: $24,500 (↑15% YoY)

## Department Breakdown
| Department | Budget | Actual | Variance |
|------------|--------|--------|----------|
| Sales      | $980K  | $950K  | -3%     |
| Marketing  | $650K  | $675K  | +4%     |
| R&D        | $1.1M  | $1.2M  | +9%     |
| Operations | $700K  | $680K  | -3%     |

## Notes
Strong performance in enterprise sales offset by slower than projected mid-market growth. R&D costs exceeded budget due to accelerated hiring in AI team.

## Projections
Q2 revenue forecast adjusted upward to $4.5M based on current pipeline.`,
    metadata: {
      confidential: true,
      quarter: 'Q1',
      year: 2024
    },
    lastModified: '2024-04-15',
    relevanceScore: 0.87
  },
  {
    id: '3',
    title: 'Customer Authentication API Documentation',
    source: 'Developer Wiki',
    documentType: 'code',
    preview: 'The Authentication API uses JWT tokens for secure customer authentication. All requests must include a valid bearer token...',
    content: `# Customer Authentication API

The Authentication API uses JWT tokens for secure customer authentication. All requests must include a valid bearer token in the Authorization header.

## Authentication Flow

1. Client requests token using credentials:

\`\`\`javascript
fetch('/api/auth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'user@example.com',
    password: 'password123'
  })
})
\`\`\`

2. Server returns JWT token:

\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
\`\`\`

3. Include token in subsequent requests:

\`\`\`javascript
fetch('/api/protected-resource', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
})
\`\`\`

## Error Codes

- 401: Unauthorized - Invalid or expired token
- 403: Forbidden - Valid token but insufficient permissions
- 429: Too Many Requests - Rate limit exceeded

See full documentation at https://api.example.com/docs/auth`,
    url: 'https://api.example.com/docs/auth',
    metadata: {
      version: '2.4.1',
      deprecated: false
    },
    lastModified: '2024-01-10',
    relevanceScore: 0.78
  },
  {
    id: '4',
    title: 'Product Launch Timeline',
    source: 'Project Management',
    documentType: 'docx',
    preview: 'The new product launch is scheduled for July 15th, 2024. Marketing materials should be finalized by June 1st...',
    content: `# Product Launch Timeline

## Key Dates
- **March 15:** Feature freeze
- **April 10:** Beta release to select customers
- **May 20:** Marketing material drafts completed
- **June 1:** Final marketing materials approved
- **June 15:** Press briefings begin
- **July 1:** Documentation and support training completed
- **July 10:** Product available for pre-order
- **July 15:** Public launch event and general availability

## Team Responsibilities

### Product
- Complete beta testing and feedback collection
- Finalize product packaging
- Prepare technical documentation

### Marketing
- Develop launch campaign materials
- Schedule and coordinate press briefings
- Prepare social media campaign

### Sales
- Train sales team on new product features
- Prepare pricing and discount strategies
- Set up pre-order capability

## Success Metrics
- 500+ pre-orders
- 10,000+ website visitors on launch day
- 80%+ positive press coverage
- 25%+ conversion rate from free trial`,
    metadata: {
      project: 'Phoenix',
      owner: 'Sarah Johnson'
    },
    lastModified: '2024-03-20',
    relevanceScore: 0.83
  },
  {
    id: '5',
    title: 'Competitor Analysis: Market Share 2024',
    source: 'Market Research',
    documentType: 'pdf',
    preview: 'Current market share: Our Company (24%), Competitor A (32%), Competitor B (18%), Others (26%). Growing at 2.5% annually...',
    content: `# Competitor Analysis: Market Share 2024

## Current Market Share
- Our Company: 24% (↑2% from 2023)
- Competitor A: 32% (↓1% from 2023)
- Competitor B: 18% (no change from 2023)
- Competitor C: 12% (↑3% from 2023)
- Others: 14% (↓4% from 2023)

## Market Growth
Overall market size is $8.2 billion, growing at 2.5% annually.

## Competitive Advantages

### Our Company
- Superior customer support (96% satisfaction)
- Strong integration ecosystem
- Best-in-class mobile experience

### Competitor A
- Lower pricing (15-20% below industry average)
- Stronger presence in European markets
- Recently acquired AI analytics provider

### Competitor B
- First-to-market with AR features
- Strong enterprise customer base
- Superior on-premise solution

## Recommendations
1. Emphasize our customer support advantage in marketing
2. Consider pricing adjustments in European market
3. Accelerate AR feature development
4. Target Competitor A's customers with migration incentives

Source: MarketInsight Annual Report, February 2024`,
    url: 'https://marketinsight.example.com/reports/2024/competitor-analysis',
    metadata: {
      author: 'MarketInsight Research Team',
      published: '2024-02-15'
    },
    lastModified: '2024-02-15',
    relevanceScore: 0.75
  }
];

export function SearchResultsPanel({ results = DEMO_RESULTS }: SearchResultsProps) {
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  // Format the date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };
  
  // Icon mapping based on document type - all using compass blue
  const getDocumentIcon = (documentType?: string) => {
    switch (documentType) {
      case 'pdf': 
        return <PdfIcon size={16} className="text-compass-blue" />;
      case 'markdown':
      case 'docx': 
        return <DocIcon size={16} className="text-compass-blue" />;
      case 'excel': 
        return <SheetIcon size={16} className="text-compass-blue" />;
      case 'code': 
        return <CodeIcon size={16} className="text-compass-blue" />;
      case 'html': 
        return <HtmlIcon size={16} className="text-compass-blue" />;
      case 'email': 
        return <EmailIcon size={16} className="text-compass-blue" />;
      case 'database': 
        return <JsonIcon size={16} className="text-compass-blue" />;
      case 'txt': 
        return <TxtIcon size={16} className="text-compass-blue" />;
      default: 
        return <UnknownIcon size={16} className="text-compass-blue" />;
    }
  };

  // If a specific result is selected, show detailed view
  if (selectedResult) {
    return (
      <div className="flex-1 h-screen bg-background border-l border-border flex flex-col overflow-hidden">
        {/* Single streamlined header with back button and document info */}
        <div className="border-b border-border py-2.5 sm:py-3 px-3 sm:px-4 flex items-center gap-3 bg-background sticky top-0 z-10">
          <button 
            onClick={() => setSelectedResult(null)}
            className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground flex-shrink-0"
            aria-label="Back to results"
          >
            <ArrowLeft size={16} />
          </button>
          {getDocumentIcon(selectedResult.documentType)}
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-base font-medium text-foreground truncate">{selectedResult.title}</h2>
            <div className="flex items-center text-xs text-muted-foreground mt-0.5">
              <span className="truncate max-w-[120px] sm:max-w-[200px]">{selectedResult.source}</span>
              {selectedResult.lastModified && (
                <>
                  <span className="mx-1.5">•</span>
                  <span>{formatDate(selectedResult.lastModified)}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            {selectedResult.relevanceScore && (
              <div className="px-2 py-0.5 rounded bg-compass-blue/10 text-xs font-medium text-compass-blue whitespace-nowrap">
                {Math.round(selectedResult.relevanceScore * 100)}% relevance
              </div>
            )}
          </div>
          {selectedResult.url && (
            <a 
              href={selectedResult.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-compass-blue hover:text-compass-blue/80 rounded-md hover:bg-muted/30 flex-shrink-0"
              title="Open source"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
        
        {/* Content area with more efficient space usage */}
        <div className="flex-1 overflow-auto">
          {/* Simplified document view with no metadata sidebar */}
          <div className="relative">
            
            {/* Document content with page number overlay */}
            <div className="relative px-4 py-4 prose prose-sm dark:prose-invert max-w-none">
              {/* Subtle page number overlay if available */}
              {selectedResult.metadata?.pageNumber && (
                <div className="absolute top-2 right-2 text-xs text-muted-foreground/70 bg-background/80 px-2 py-0.5 rounded">
                  Page {selectedResult.metadata.pageNumber}
                </div>
              )}
              
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {selectedResult.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main results list view - Google/Perplexity inspired clean UI
  return (
    <div className="flex-1 h-screen bg-background border-l border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-3 sm:px-4 py-2.5 sm:py-3 flex justify-between items-center bg-background sticky top-0 z-10">
        <div className="flex items-center">
          <Search size={16} className="text-compass-blue mr-2" />
          <h2 className="text-sm sm:text-base font-medium">Sources</h2>
        </div>
        <div className="flex items-center gap-2">
          {results.some(result => result.metadata?.citationId) && (
            <div className="text-xs text-compass-blue font-medium px-1.5 py-0.5 rounded-full bg-compass-blue/10 border border-compass-blue/20">
              Cited sources
            </div>
          )}
          <div className="text-xs text-muted-foreground px-1.5 py-0.5 rounded-full bg-muted/30">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </div>
        </div>
      </div>
      
      {/* Results list */}
      <div className="flex-1 overflow-auto">
        {results.length > 0 ? (
          <div className="p-2 sm:p-3 grid gap-2 sm:gap-3 grid-cols-1 lg:grid-cols-2 auto-rows-max">
            {results.map(result => (
              <div 
                key={result.id}
                id={`citation-source-${result.id}`}
                className="bg-background border border-border hover:border-border/80 rounded-lg overflow-hidden shadow-sm hover:shadow transition-all cursor-pointer flex flex-col highlight-citation:ring-2 highlight-citation:ring-accent highlight-citation:ring-offset-2"
                onClick={() => setSelectedResult(result)}
              >
                {/* Card header with title (no icon) */}
                <div className="p-2.5 sm:p-3 border-b border-border/40 flex items-center gap-2">
                  <h3 className="font-medium text-sm text-foreground flex-1 truncate">
                    {result.title}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    {/* Add citation badge if this source is being cited */}
                    {result.metadata?.citationId && (
                      <div className="shrink-0 px-2 py-0.5 rounded-full text-xs bg-compass-blue/10 text-compass-blue font-medium border border-compass-blue/20 flex items-center">
                        <span>Cited</span>
                      </div>
                    )}
                    {result.relevanceScore && (
                      <div className="shrink-0 px-2 py-0.5 rounded text-xs bg-compass-blue/10 text-compass-blue font-medium">
                        {Math.round(result.relevanceScore * 100)}% match
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Card body - flex-grow to push footer to bottom */}
                <div className="p-2.5 sm:p-3 flex-grow">
                  {/* Source and type */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground mb-2">
                    <span className="truncate max-w-[120px] sm:max-w-[150px]">{result.source}</span>
                    {result.documentType && (
                      <span className="uppercase text-[10px] px-1.5 py-0.5 rounded-full bg-muted font-medium">
                        {result.documentType}
                      </span>
                    )}
                    {result.lastModified && (
                      <div className="hidden xs:flex items-center">
                        <Clock size={10} className="mr-1" />
                        <span>{formatDate(result.lastModified)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Preview - line clamp 2 on smallest screens, 3 on larger */}
                  <p className="text-sm text-foreground/80 line-clamp-2 sm:line-clamp-3">
                    {result.preview}
                  </p>
                </div>
                
                {/* Card footer */}
                <div className="px-2.5 sm:px-3 py-2 bg-muted/20 flex justify-between sm:justify-end items-center mt-auto">
                  {/* Show date on smallest screens */}
                  {result.lastModified && (
                    <div className="flex xs:hidden items-center text-[10px] text-muted-foreground">
                      <Clock size={10} className="mr-1" />
                      <span>{formatDate(result.lastModified)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <button className="text-xs text-primary hover:underline flex items-center whitespace-nowrap">
                      <span>View</span>
                      <span className="hidden sm:inline">&nbsp;details</span>
                      <ChevronRight size={12} className="ml-1" />
                    </button>
                    {result.url && (
                      <a 
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 sm:ml-4 text-xs text-primary hover:underline flex items-center"
                        onClick={e => e.stopPropagation()}
                      >
                        <span>Source</span>
                        <ExternalLink size={10} className="ml-0.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            <Search size={32} className="mb-3 text-muted-foreground/40" />
            <h3 className="text-base font-medium mb-1">No results found</h3>
            <p className="text-sm max-w-md text-center">
              No search results are available for this query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}