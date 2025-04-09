import { SearchResult } from '../../components/search-results-panel';

export const searchResultsResponse: SearchResult[] = [
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