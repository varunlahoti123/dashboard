# Medical Records Dashboard

## Architecture & Development Patterns

### Data Flow

### Layer Responsibilities

#### 1. UI Layer (`/app/(authenticated)/**/page.tsx`)
- Renders components and handles user interactions
- Uses server components for data fetching
- Implements client components for interactivity

#### 2. Server Actions (`/app/_actions/*.ts`)
- Handles authentication and authorization
- Validates input data using Zod schemas
- Provides type-safe interfaces to database operations

#### 3. Database Queries (`/server/db/queries.ts`)
- Implements database operations
- Handles data relationships and joins
- Returns typed data using Drizzle ORM

### Implementing New Features

1. Define types and schemas in `/types/*.ts`
2. Add database queries in `/server/db/queries.ts`
3. Create server actions in `/app/_actions/*.ts`
4. Implement UI components using the server actions

This pattern ensures:
- Type safety across the stack
- Clear separation of concerns
- Centralized authentication
- Proper error handling

## TO DO
- [ ] Deploy to Vercel
- [ ] Add authentication
