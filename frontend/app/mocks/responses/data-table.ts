export const dataTableResponse = `# Web Framework Performance Analysis 2023

Here's a detailed comparison of popular web frameworks based on our latest benchmarks:

### Performance Metrics

| Framework | Requests/sec | Latency (ms) | Memory (MB) | Startup Time (ms) |
|-----------|--------------|--------------|-------------|-------------------|
| Next.js   | 12,500       | 8.2          | 78          | 320               |
| Express   | 18,200       | 5.5          | 42          | 180               |
| Django    | 8,400        | 11.9         | 86          | 450               |
| Laravel   | 9,100        | 11.0         | 72          | 410               |
| Flask     | 11,300       | 8.8          | 58          | 240               |
| FastAPI   | 14,800       | 6.7          | 46          | 210               |
| Spring    | 13,600       | 7.3          | 110         | 620               |

### Key Findings

1. **Express.js** continues to dominate in raw throughput with the lowest resource requirements
2. **FastAPI** shows impressive performance for Python developers, outperforming Flask
3. **Next.js** provides excellent SSR capabilities while maintaining competitive performance
4. **Spring Boot** offers robust features but requires significantly more memory

### Recommendations by Use Case

- **High-traffic APIs**: Express or FastAPI
- **Full-stack applications**: Next.js or Nuxt.js
- **Enterprise systems**: Spring Boot or Django
- **Rapid development**: Laravel or Ruby on Rails

### Methodology

Tests conducted on AWS t3.large instances with equivalent configurations:
- 100 concurrent connections
- 30-second test duration
- HTTPS with TLS 1.3
- Database operations excluded

These results should guide your framework selection, but remember that team expertise and specific project requirements are equally important factors.

Would you like me to provide more detailed metrics for any specific framework?`;