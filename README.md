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

## Development Checklist

### Before Committing
- [ ] Run `pnpm typecheck` to check for type errors
- [ ] Run `pnpm lint` to check for code style issues
- [ ] Test dynamic routes with `dynamic = 'force-dynamic'` config
- [ ] Check for null/undefined handling in components

### Before Deployment
- [ ] Run `pnpm build` locally to catch build-time errors
- [ ] Test authentication flows
- [ ] Verify environment variables are set in production
- [ ] Check for client/server component boundaries
- [ ] Verify API routes and server actions work locally

### Common Issues to Watch
1. Static/Dynamic Route Conflicts
   - Add `dynamic = 'force-dynamic'` for authenticated routes
   - Check for usage of headers, cookies, dynamic data

2. Type Safety
   - Handle null/undefined cases
   - Use proper type guards
   - Verify API response types

3. Authentication
   - Test auth middleware
   - Verify protected routes
   - Check token handling

## TO DO
- [ ] Deploy to Vercel
- [ ] Add authentication
