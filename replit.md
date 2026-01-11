# AutoConcession - Internal Dealership Management System

## Overview
Internal application for an automotive dealership that automates email and call management via AI agents, manages vehicle inventory, customer waitlist, and provides performance statistics.

## Tech Stack
- **Frontend**: React + TypeScript + Vite + TailwindCSS + shadcn/ui
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter (client-side)
- **State Management**: TanStack Query

## Project Structure
```
client/
├── src/
│   ├── components/     # UI components (shadcn + custom)
│   ├── pages/          # Page components (inbox, waitlist, knowledge, statistics, settings)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── App.tsx         # Main app with routing
server/
├── db.ts               # Database connection
├── routes.ts           # API endpoints
├── storage.ts          # Data access layer
├── seed.ts             # Demo data seeder
└── index.ts            # Express server
shared/
└── schema.ts           # Drizzle schema + TypeScript types
```

## Main Features
1. **À répondre (Inbox)** - Email cases requiring human response
2. **Liste d'attente** - Customer waitlist for vehicles
3. **Base IA** - Knowledge base + vehicle inventory
4. **Statistiques** - Performance dashboard

## API Endpoints
- `GET/POST/PATCH/DELETE /api/emails` - Email case management
- `GET/POST/PATCH/DELETE /api/vehicles` - Vehicle inventory
- `GET/POST/PATCH/DELETE /api/waitlist` - Waitlist requests
- `GET/POST/PATCH/DELETE /api/knowledge` - Knowledge base items
- `GET/POST/PATCH/DELETE /api/clients` - Client management
- `GET/POST/PATCH/DELETE /api/users` - User management
- `GET /api/statistics` - Performance statistics

## Database Models
- **users** - System users (admin, seller, readonly roles)
- **clients** - Customer information
- **emailCases** - Email cases requiring human intervention
- **vehicles** - Vehicle inventory
- **waitlistRequests** - Customer vehicle requests
- **knowledgeItems** - Knowledge base data
- **dailyStats** - Aggregated statistics

## Running the Project
```bash
npm run dev          # Start development server
npm run db:push      # Push schema to database
npx tsx server/seed.ts  # Seed database with demo data
```

## Design System
- Professional enterprise theme
- Blue primary colors (210 hue)
- Inter font family
- Light/dark mode support
- Responsive sidebar navigation

## Recent Changes (January 2026)
- Full database schema implemented with 7 tables
- All CRUD API endpoints operational
- Frontend pages completed: Inbox, Waitlist, Knowledge Base, Statistics, Settings
- Dynamic sidebar badge counts from API
- Vehicle creation form with proper validation
- Email and waitlist status updates via mutations
- French language UI throughout

## Security Notes
- Passwords not exposed in user API responses
- User PATCH endpoint strips password from request body
- Demo data uses plaintext passwords (for development only)
