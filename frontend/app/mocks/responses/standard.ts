export const standardResponse = `To set up Drizzle ORM in your Next.js project, follow these straightforward steps:

### 1. Install Dependencies

First, install Drizzle ORM and related packages:

\`\`\`bash
npm install drizzle-orm drizzle-kit @drizzle-orm/postgres postgres
\`\`\`

(Adjust the database driver based on your chosen DB, e.g., MySQL or SQLite.)

### 2. Configure Environment Variables

Create a \`.env.local\` file to store your database credentials:

\`\`\`env
DATABASE_URL="postgres://user:password@localhost:5432/mydb"
\`\`\`

### 3. Create Drizzle Schema

In your Next.js project, create a \`schema.ts\` file, typically inside a \`db\` folder:

\`\`\`typescript
// db/schema.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
\`\`\`

### 4. Configure Drizzle

Create a \`db.ts\` file to initialize Drizzle:

\`\`\`typescript
// db/db.ts
import { drizzle } from 'drizzle-orm/postgres';
import { Pool } from 'postgres';
import * as schema from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });
\`\`\`

### 5. Drizzle Migration

Configure drizzle-kit for migrations:

\`\`\`bash
npm install drizzle-kit -D
\`\`\`

Add a drizzle.config.ts file:

\`\`\`typescript
// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: { connectionString: process.env.DATABASE_URL },
} satisfies Config;
\`\`\`

Generate migrations:

\`\`\`bash
npx drizzle-kit generate
\`\`\`

Apply migrations:

\`\`\`bash
npx drizzle-kit migrate
\`\`\`

### 6. Using Drizzle in Next.js

Inside your Next.js pages or API routes, import your \`db\` instance:

\`\`\`typescript
// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../db/db';
import { users } from '../../db/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const data = await db.select().from(users);
    res.status(200).json(data);
  }
}
\`\`\`

Now your Next.js application is ready to efficiently utilize Drizzle ORM!`;