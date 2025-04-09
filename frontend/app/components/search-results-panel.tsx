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
  
  // Icon mapping based on document type
  const getDocumentIcon = (documentType?: string) => {
    switch (documentType) {
      case 'pdf': 
        return <PdfIcon size={16} className="text-red-500" />;
      case 'markdown':
      case 'docx': 
        return <DocIcon size={16} className="text-blue-500" />;
      case 'excel': 
        return <SheetIcon size={16} className="text-green-500" />;
      case 'code': 
        return <CodeIcon size={16} className="text-purple-500" />;
      case 'html': 
        return <HtmlIcon size={16} className="text-orange-500" />;
      case 'email': 
        return <EmailIcon size={16} className="text-sky-500" />;
      case 'database': 
        return <JsonIcon size={16} className="text-emerald-500" />;
      case 'txt': 
        return <TxtIcon size={16} className="text-gray-500" />;
      default: 
        return <UnknownIcon size={16} className="text-gray-400" />;
    }
  };

  // If a specific result is selected, show detailed view
  if (selectedResult) {
    return (
      <div className="flex-1 h-screen bg-background border-l border-border flex flex-col overflow-hidden">
        {/* Header with back button and title */}
        <div className="border-b border-border py-2.5 sm:py-3 px-3 sm:px-4 flex items-center bg-background sticky top-0 z-10">
          <button 
            onClick={() => setSelectedResult(null)}
            className="p-1.5 rounded-md hover:bg-muted/50 mr-2 sm:mr-3 text-muted-foreground hover:text-foreground"
            aria-label="Back to results"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1 min-w-0"> {/* min-w-0 for better text truncation */}
            <h2 className="text-sm sm:text-base font-medium text-foreground truncate">{selectedResult.title}</h2>
            <div className="flex items-center text-muted-foreground text-xs mt-0.5">
              <span className="truncate max-w-[120px] sm:max-w-none">{selectedResult.source}</span>
              {selectedResult.documentType && (
                <span className="uppercase text-[10px] px-1.5 py-0.5 rounded-full bg-muted font-medium ml-2">
                  {selectedResult.documentType}
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 gap-1">
            {selectedResult.relevanceScore && (
              <div className="hidden xs:flex items-center justify-center w-8 h-8 rounded-full text-xs bg-accent/10 text-accent font-medium">
                {Math.round(selectedResult.relevanceScore * 100)}%
              </div>
            )}
            {selectedResult.url && (
              <a 
                href={selectedResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-primary hover:text-primary/80 rounded-md hover:bg-muted/30"
                title="Open source"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
        
        {/* Content wrapper with metadata sidebar on larger screens */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto p-2 xs:p-3 sm:p-4 md:p-6 md:flex gap-4 lg:gap-6">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Document info card */}
              <div className="bg-background border border-border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm">
                <div className="flex flex-wrap xs:flex-nowrap justify-between items-start gap-2">
                  <div className="flex items-start xs:items-center">
                    <div className="shrink-0 pt-0.5 xs:pt-0">
                      {getDocumentIcon(selectedResult.documentType)}
                    </div>
                    <div className="ml-2 min-w-0"> {/* min-w-0 helps with truncation */}
                      <h3 className="font-medium text-sm sm:text-base text-foreground truncate">{selectedResult.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{selectedResult.source}</p>
                    </div>
                  </div>
                  
                  {selectedResult.relevanceScore && (
                    <div className="shrink-0 px-2 py-1 rounded-md text-xs bg-accent/10 text-accent font-medium">
                      {Math.round(selectedResult.relevanceScore * 100)}% relevance
                    </div>
                  )}
                </div>
                
                {/* Date and source info */}
                <div className="flex flex-wrap gap-y-2 gap-x-3 mt-3 text-xs text-muted-foreground">
                  {selectedResult.lastModified && (
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      <span>Last modified: {formatDate(selectedResult.lastModified)}</span>
                    </div>
                  )}
                  
                  {selectedResult.url && (
                    <a 
                      href={selectedResult.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      <span className="whitespace-nowrap">View source</span>
                      <span className="hidden xs:inline">&nbsp;document</span>
                      <ExternalLink size={10} className="ml-0.5" />
                    </a>
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="prose prose-sm dark:prose-invert max-w-none bg-background border border-border rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {selectedResult.content}
                </pre>
              </div>
            </div>
            
            {/* Metadata sidebar for larger screens, bottom card for mobile */}
            {selectedResult.metadata && Object.keys(selectedResult.metadata).length > 0 && (
              <div className="md:w-64 shrink-0 mt-3 sm:mt-4 md:mt-0">
                <div className="bg-background border border-border rounded-lg shadow-sm p-3 sm:p-4 md:sticky md:top-20">
                  <h3 className="text-sm font-medium mb-2 sm:mb-3">Document Metadata</h3>
                  
                  {/* Grid on mobile, stack on desktop */}
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-2">
                    {Object.entries(selectedResult.metadata).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <div className="text-muted-foreground text-xs capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="font-medium text-foreground text-xs sm:text-sm truncate">
                          {value.toString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
          <Search size={16} className="text-accent mr-2" />
          <h2 className="text-sm sm:text-base font-medium">Sources</h2>
        </div>
        <div className="text-xs text-muted-foreground px-1.5 py-0.5 rounded-full bg-muted/30">
          {results.length} {results.length === 1 ? 'result' : 'results'}
        </div>
      </div>
      
      {/* Results list */}
      <div className="flex-1 overflow-auto">
        {results.length > 0 ? (
          <div className="p-2 sm:p-3 grid gap-2 sm:gap-3 grid-cols-1 lg:grid-cols-2 auto-rows-max">
            {results.map(result => (
              <div 
                key={result.id} 
                className="bg-background border border-border hover:border-border/80 rounded-lg overflow-hidden shadow-sm hover:shadow transition-all cursor-pointer flex flex-col"
                onClick={() => setSelectedResult(result)}
              >
                {/* Card header with title and icon */}
                <div className="p-2.5 sm:p-3 border-b border-border/40 flex items-center gap-2">
                  <div className="shrink-0">
                    {getDocumentIcon(result.documentType)}
                  </div>
                  <h3 className="font-medium text-sm text-foreground flex-1 truncate">
                    {result.title}
                  </h3>
                  {result.relevanceScore && (
                    <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs bg-accent/10 text-accent font-medium">
                      {Math.round(result.relevanceScore * 100)}%
                    </div>
                  )}
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
                    <button className="text-xs text-primary font-medium hover:underline flex items-center whitespace-nowrap">
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