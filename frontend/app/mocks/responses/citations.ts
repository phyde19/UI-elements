export const citationsResponse = `Based on the company's remote work policy, employees can work remotely up to 3 days per week with manager approval [1](cite://1). Before starting remote work, you'll need to complete the required training and sign the remote work agreement [1](cite://1).

The Q1 2024 financial report shows strong performance with a 12% year-over-year increase in revenue, reaching $4.2M [2](cite://2). Net profit increased by 18% compared to the same period last year [2](cite://2).

For the upcoming product launch scheduled for July 15th, 2024 [4](cite://4), the marketing team needs to finalize all materials by June 1st [4](cite://4). This timeline aligns with the press briefings that begin on June 15th [4](cite://4).

Our market share currently stands at 24%, which is a 2% increase from 2023 [5](cite://5). Our main competitor (Competitor A) holds 32% of the market share but has seen a 1% decrease from last year [5](cite://5).

When implementing the customer authentication API, remember that all requests must include a valid bearer token in the Authorization header [3](cite://3). This helps maintain secure access to protected resources [3](cite://3).`;

// Array of citation content that corresponds to the citations in the response
export const citationSources = [
  {
    id: "1",
    title: "Company Policy on Remote Work",
    source: "Employee Handbook",
    content: "Employees are allowed to work remotely up to 3 days per week with manager approval. Remote work arrangements must be documented in the HR portal. The approval process includes discussing with your direct manager, submitting a remote work request through the HR portal, completing required training, and signing a remote work agreement.",
    documentType: "markdown",
    relevanceScore: 0.92
  },
  {
    id: "2",
    title: "Quarterly Financial Report: Q1 2024",
    source: "Finance Department",
    content: "Revenue: $4,245,000 (↑12% YoY), Operating Expenses: $2,823,000 (↑5% YoY), Net Profit: $1,422,000 (↑18% YoY). Strong performance in enterprise sales offset by slower than projected mid-market growth.",
    documentType: "excel",
    relevanceScore: 0.87
  },
  {
    id: "3",
    title: "Customer Authentication API Documentation",
    source: "Developer Wiki",
    content: "The Authentication API uses JWT tokens for secure customer authentication. All requests must include a valid bearer token in the Authorization header. Server returns JWT token that expires in 3600 seconds.",
    documentType: "code",
    relevanceScore: 0.78
  },
  {
    id: "4",
    title: "Product Launch Timeline",
    source: "Project Management",
    content: "The new product launch is scheduled for July 15th, 2024. Marketing materials should be finalized by June 1st. Press briefings begin on June 15th.",
    documentType: "docx",
    relevanceScore: 0.83
  },
  {
    id: "5",
    title: "Competitor Analysis: Market Share 2024",
    source: "Market Research",
    content: "Current market share: Our Company (24%, ↑2% from 2023), Competitor A (32%, ↓1% from 2023), Competitor B (18%, no change from 2023), Competitor C (12%, ↑3% from 2023), Others (14%, ↓4% from 2023).",
    documentType: "pdf",
    relevanceScore: 0.75
  }
];