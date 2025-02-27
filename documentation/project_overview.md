# Partner Portal Project Overview

## Introduction

The Partner Portal is a Next.js-based web application designed to provide developers with tools for integrating with our platform. It functions as a comprehensive developer portal with authentication, API documentation, embedding capabilities, and webhook management. Built on top of a professional SaaS starter kit, it follows modern web development practices and design patterns.

## Tech Stack

The project leverages a robust technology stack including:

- **Core Framework**: Next.js 14.2.23 with React 18 and TypeScript
- **Authentication**: Clerk for user management and authentication
- **Database**: Supabase for data storage with Row Level Security
- **UI Components**: shadcn/ui with Tailwind CSS and Radix UI components
- **Form Handling**: React Hook Form with Zod for validation
- **State Management**: React Context API with custom providers
- **Animations**: Framer Motion and Tailwind CSS animations
- **UI Elements**: Lucide React icons, Sonner for toast notifications
- **Development Tools**: ESLint, Prettier, TypeScript

## Project Structure

```
/
├── app/ - Next.js app directory (main application code)
│   ├── layout.tsx - Root layout component
│   ├── page.tsx - Home page component
│   ├── globals.css - Global CSS styles
│   ├── developer/ - Developer portal functionality
│   │   ├── components/ - Developer-specific UI components
│   │   ├── utils/ - Utility functions for the developer portal
│   │   ├── layout.tsx - Developer portal layout
│   │   └── page.tsx - Developer portal main page
├── components/ - Reusable UI components
│   ├── ui/ - shadcn/ui components (accordion, buttons, cards, etc.)
│   └── providers/ - Context providers for app-wide state
├── public/ - Static assets
├── documentation/ - Project documentation
├── hooks/ - Custom React hooks
├── lib/ - Utility libraries
├── supabase/ - Supabase configuration and migrations
├── types/ - TypeScript type definitions
├── utils/ - Utility functions
├── middleware.ts - Next.js middleware for authentication and routing
├── next.config.mjs - Next.js configuration
├── tailwind.config.ts - Tailwind CSS configuration
└── package.json - Project dependencies and scripts
```

## Authentication System

The portal uses Clerk for authentication with the following features:

1. User sign-up and login functionality
2. JWT token generation for API access
3. Protected routes via middleware
4. Authentication state management via context providers

Authentication is configurable through middleware.ts, which can be customized to protect specific routes. The ClerkProvider wrapper in components/providers/clerk-client-provider.tsx provides authentication context throughout the application.

## Key Features

### Developer Portal

The developer portal (`/app/developer/`) serves as the main interface for partners and includes:

1. **Welcome Page**: Introduction to the platform capabilities
2. **Authentication**: Secure login system with token management
3. **API Reference**: Documentation for available APIs
4. **Embedding**: Tools for embedding dashboard components in partner applications
5. **Webhooks**: Configuration and management of webhook endpoints

### Embedding Functionality

A core feature of the portal is the ability to embed dashboards in external applications:

- Uses iframe-based embedding with secure token authentication
- Provides code examples for different frameworks
- Handles cross-origin communication securely
- Configured via environment variables (NEXT_PUBLIC_DASHBOARD_EMBED_URL)

### UI Components

The application uses a comprehensive set of UI components from shadcn/ui, which are built on top of Radix UI and styled with Tailwind CSS. These include:

- Layout components (Accordion, Tabs, Cards)
- Form elements (Input, Select, Checkbox)
- Navigation components (Sidebar, Dropdown menus)
- Feedback components (Toast notifications, Alerts)
- Data visualization (Charts, Tables)

## Environment Variables

The portal requires several environment variables:

```
NEXT_PUBLIC_DASHBOARD_EMBED_URL=http://localhost:3001  # URL for embedded dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_****              # Clerk public key
CLERK_SECRET_KEY=sk_****                               # Clerk secret key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in                 # Custom sign-in URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up                 # Custom sign-up URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/                  # Redirect after sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/                  # Redirect after sign-up
NEXT_PUBLIC_SUPABASE_URL=https://****.supabase.co      # Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=****                     # Supabase anonymous key
```

## Database Schema

The Supabase database includes tables for:

1. **customers**: User information and metadata
2. **products**: Available product information
3. **prices**: Product pricing tiers
4. **subscriptions**: User subscription information

Row Level Security (RLS) is enabled to ensure data protection and proper access control.

## Development Guidelines

### Design Pattern

The application follows these design patterns:

1. **Component-Based Architecture**: UI elements are broken down into reusable components
2. **Context-Based State Management**: Global state is managed via React Context
3. **Server Components vs. Client Components**: Proper use of Next.js server and client components
4. **Typed Interfaces**: TypeScript interfaces for all data structures
5. **Utility-First CSS**: Tailwind CSS for styling components

### Best Practices

When making changes to the codebase:

1. **Component Reuse**: Always check for existing components before creating new ones
2. **Consistent Styling**: Use the established Tailwind classes and design tokens
3. **Type Safety**: Maintain proper TypeScript typing across the codebase
4. **Responsive Design**: Ensure all UI components work across different screen sizes
5. **Accessibility**: Maintain ARIA attributes and keyboard navigation
6. **Error Handling**: Implement proper error boundaries and user feedback
7. **Performance**: Optimize rendering and data fetching

### Adding New Features

When adding new features:

1. Create components in the appropriate directory structure
2. Follow the established naming conventions
3. Implement proper TypeScript types
4. Add necessary tests
5. Update documentation

## Build and Deployment

The application uses standard Next.js build processes:

- **Development**: `npm run dev` - Starts the development server
- **Build**: `npm run build` - Creates a production build
- **Start**: `npm run start` - Runs the production server
- **Lint**: `npm run lint` - Runs ESLint for code quality

## Conclusion

The Partner Portal provides a robust, secure, and user-friendly interface for developers to integrate with our platform. Built with modern technologies and following best practices, it offers a scalable foundation for developer-focused features and integrations. Any modifications should maintain the established architecture, design patterns, and code quality standards. 