# Fullstack Sample — Pokémon Manager

Small fullstack sample app demonstrating a GraphQL-backed manager:
- Frontend: React + Vite (TypeScript)
- Backend: Node + Express + Apollo GraphQL
- DB: MongoDB
- Auth: JWT (basic login/register)
- Workspace: npm workspaces

Project layout
- frontend/ — React app (entry: frontend/src/main.tsx)
- backend/ — Apollo Server + resolvers (entry: backend/src/index.ts)
- Root package.json uses npm workspaces

Quick start
1. Prereqs
   - Node.js (includes npm/npx). Verify:
     npx -v
     npm -v
   - MongoDB running locally or a remote URI.

2. Install deps (root)
   npm install

3. Seed sample data (optional)
   npm run seed --prefix backend

4. Run in dev (starts both services via workspace scripts)
   npm run dev

5. Build
   npm run build

Environment
- Create a .env in backend/ or set env vars:
  - MONGODB_URI (default: mongodb://localhost:27017/pokemon-db)
  - PORT (default: 4000)
  - JWT_SECRET (set to a secure value)
- Example backend/.env:
  MONGODB_URI=mongodb://localhost:27017/pokemon-db
  PORT=4000
  JWT_SECRET=secret

Authentication (JWT)
- Backend issues JWTs on register/login
- Frontend stores the token in localStorage and attaches it as:
  Authorization: Bearer <token>
- Ensure JWT_SECRET is set in backend before issuing tokens.

Seeding & Migrations
- Seed:
  npm run seed --prefix backend
- This repo has no built-in migration framework. Recommended options:
  - migrate-mongo (simple CLI for MongoDB migrations)
    npx migrate-mongo init
    npx migrate-mongo create <name>
    npx migrate-mongo up
  - Or add JS/TS migration scripts under backend/migrations and run from npm scripts/CI.
- Back up production data before migrations:
  mongodump --uri="your-mongodb-uri" --out=backup-YYYYMMDD

GraphQL endpoint
- Backend default: http://localhost:4000/graphql
- Frontend dev: Vite default (e.g. http://localhost:5173) — see frontend config.

License / Credits
- Learning/sample project — see repo for author info.



