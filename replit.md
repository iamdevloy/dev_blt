# Wedding Gallery Application

## Overview

This is a modern, Instagram-style wedding gallery application built for couples to share their special moments with guests. The application features a React frontend with TypeScript, Express.js backend, and is designed for deployment on Replit with PostgreSQL database support.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: React hooks and context for local state
- **UI Components**: Radix UI primitives with custom Instagram-style components

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Storage**: In-memory storage with interface for easy database migration
- **API Design**: RESTful endpoints with `/api` prefix

### Database Design
- **Primary Database**: Designed for PostgreSQL using Drizzle ORM
- **Schema**: User management with username/password authentication
- **Migration Strategy**: Drizzle Kit for schema migrations
- **Development Mode**: In-memory storage for rapid prototyping

## Key Components

### Core Features
1. **User Management**: Device-based user identification with username storage
2. **Media Gallery**: Instagram-style photo/video gallery with infinite scroll
3. **Interactive Elements**: Likes, comments, and user-generated content
4. **Real-time Features**: Live user indicators and story functionality
5. **Admin Panel**: Administrative controls for content moderation
6. **Dark Mode**: System-wide dark/light theme support

### Third-party Integrations
1. **Firebase**: Media storage, real-time database, and file hosting
2. **Spotify API**: Music wishlist integration with OAuth 2.0 PKCE flow
3. **External Services**: Various utility services for enhanced functionality

### UI Components
- **InstagramGallery**: Main gallery component with grid/feed views
- **StoriesBar**: Instagram-style stories with 24-hour expiration
- **MediaModal**: Full-screen media viewer with interactions
- **VideoRecorder**: In-app video recording with camera switching
- **Timeline**: Wedding milestone tracking with media attachments

## Data Flow

### Client-Side Data Management
1. **User State**: Device ID generation and username persistence
2. **Media State**: Gallery items with optimistic updates
3. **Real-time Updates**: Firebase listeners for live content
4. **Caching Strategy**: Local storage for user preferences and session data

### Server-Side Processing
1. **API Routes**: Express routes handling CRUD operations
2. **Storage Interface**: Abstracted storage layer for easy database switching
3. **Authentication**: Simple username-based auth with admin controls
4. **File Handling**: Media upload processing and validation

### Database Schema
```typescript
// Users table structure
users: {
  id: serial primary key,
  username: text unique not null,
  password: text not null
}
```

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, TypeScript support
- **UI Framework**: Radix UI components, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Drizzle ORM, Neon Database connector
- **Development**: Vite, TSX for development server, ESBuild for production

### Firebase Services
- **Storage**: Media file hosting and CDN
- **Firestore**: Real-time database for comments, likes, stories
- **Configuration**: Environment-based Firebase project setup

### Spotify Integration
- **OAuth 2.0**: PKCE flow for secure authentication
- **Web API**: Playlist management and track searching
- **Error Handling**: Comprehensive error management and retry logic

## Deployment Strategy

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Build Process**: Vite frontend build + ESBuild backend compilation
- **Runtime**: Production Node.js server with static file serving
- **Environment**: Development with live reload, production with optimized builds

### Database Strategy
- **Development**: In-memory storage for rapid iteration
- **Production**: PostgreSQL with Drizzle migrations
- **Connection**: Neon Database serverless PostgreSQL
- **Environment Variables**: `DATABASE_URL` for database connection

### File Structure
```
├── client/           # React frontend application
├── server/           # Express.js backend server
├── shared/           # Shared TypeScript types and schemas
├── migrations/       # Database migration files
└── dist/            # Production build output
```

### Build and Deployment
1. **Development**: `npm run dev` - Concurrent frontend and backend development
2. **Production Build**: `npm run build` - Optimized frontend and backend bundles
3. **Production Start**: `npm run start` - Production server with static file serving
4. **Database Setup**: `npm run db:push` - Apply schema changes to database

## Changelog

Changelog:
- June 19, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.