# TypeScript Server Example

A comprehensive educational TypeScript server-side application demonstrating common patterns and best practices for API development.

## Features

- **Clean Architecture**: Layered architecture with controllers, services, and repositories
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Validation**: Request validation using Zod schemas
- **Error Handling**: Centralized error handling with custom error types
- **Logging**: Structured logging with different log levels
- **Repository Pattern**: In-memory data storage with CRUD operations
- **RESTful APIs**: Well-structured REST endpoints with proper HTTP status codes
- **Middleware**: Custom middleware for logging, validation, and error handling

## Project Structure

```
src/
├── controllers/       # HTTP request handlers
├── services/         # Business logic layer
├── repositories/     # Data access layer
├── models/          # Domain models and validation schemas
├── middleware/      # Express middleware
├── routes/          # API route definitions
├── types/           # TypeScript type definitions
├── utils/           # Utility functions and helpers
├── app.ts           # Express app configuration
└── index.ts         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## API Endpoints

### Health Check
- `GET /api/v1/health` - Application health status

### Users
- `GET /api/v1/users` - Get all users (with pagination)
- `GET /api/v1/users/:id` - Get user by ID
- `GET /api/v1/users/search?email=` - Find user by email
- `GET /api/v1/users/active` - Get active users
- `GET /api/v1/users/role/:role` - Get users by role
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `PATCH /api/v1/users/:id/activate` - Activate user
- `PATCH /api/v1/users/:id/deactivate` - Deactivate user
- `DELETE /api/v1/users/:id` - Delete user

### Posts
- `GET /api/v1/posts` - Get all posts (with pagination)
- `GET /api/v1/posts/:id` - Get post by ID
- `GET /api/v1/posts/slug/:slug` - Get post by slug
- `GET /api/v1/posts/published` - Get published posts
- `GET /api/v1/posts/author/:authorId` - Get posts by author
- `GET /api/v1/posts/status/:status` - Get posts by status
- `GET /api/v1/posts/tags?tags=tag1,tag2` - Get posts by tags
- `GET /api/v1/posts/stats` - Get post statistics
- `POST /api/v1/posts` - Create new post
- `PUT /api/v1/posts/:id` - Update post
- `PATCH /api/v1/posts/:id/publish` - Publish post
- `DELETE /api/v1/posts/:id` - Delete post

## Design Patterns

### Repository Pattern
- Abstracts data access logic
- Provides consistent interface for data operations
- Easily testable and mockable

### Service Layer
- Contains business logic
- Coordinates between controllers and repositories
- Handles validation and business rules

### Dependency Injection
- Services receive dependencies through constructor
- Promotes loose coupling and testability

### Error Handling
- Custom error classes for different scenarios
- Centralized error handling middleware
- Consistent error response format

### Logging
- Structured logging with context
- Different log levels (ERROR, WARN, INFO, DEBUG)
- Request/response logging middleware

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (ERROR/WARN/INFO/DEBUG)
- `CORS_ORIGIN` - CORS allowed origins

## Technologies Used

- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing
- **ESLint** - Code linting
- **tsx** - TypeScript execution for development