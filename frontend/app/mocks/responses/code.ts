export const codeResponse = `Here's how to implement a basic REST API in Node.js with Express:

### 1. Project Setup

First, create a new project and install dependencies:

\`\`\`bash
mkdir my-api
cd my-api
npm init -y
npm install express cors body-parser
\`\`\`

### 2. Create Server File

Create an \`index.js\` file with the following code:

\`\`\`javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sample data
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Routes
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Start server
app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
\`\`\`

### 3. Run Your API

Start the server with:

\`\`\`bash
node index.js
\`\`\`

### 4. API Endpoints

Your API now supports these endpoints:

- **GET all users**: \`GET /api/users\`
- **GET a specific user**: \`GET /api/users/1\`
- **Create a new user**: \`POST /api/users\` with JSON body

### 5. Testing with cURL

Test your API with these commands:

\`\`\`bash
# Get all users
curl http://localhost:3000/api/users

# Get a specific user
curl http://localhost:3000/api/users/1

# Create a new user
curl -X POST -H "Content-Type: application/json" -d '{"name":"Bob Johnson","email":"bob@example.com"}' http://localhost:3000/api/users
\`\`\`

This is a simple implementation that you can expand with additional routes, validation, and database integration as needed.`;