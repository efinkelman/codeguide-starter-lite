## Leveraging Existing Starter Kit Components

The starter kit already includes many components and utilities that should be used in the implementation:

### UI Components (shadcn/ui)
- **Dialog**: Use for the login modal instead of creating a custom dialog
- **Tabs**: Use for the content navigation instead of custom tab implementation
- **Form components**: Use for all form inputs in the login form
- **Button**: Use for all button elements
- **Card/Paper**: Use for content sections and information cards
- **Avatar**: Use for token display
- **Toast**: Use Sonner for success/error notifications

### Form Handling
- **React Hook Form**: Use for login form state management
- **Zod**: Use for form validation

### Styling
- **Tailwind CSS**: Use for all styling instead of custom CSS
- **class-variance-authority**: Use for component variants
- **clsx/tailwind-merge**: Use for conditional class management

### Icons
- **Lucide React**: Use for all icons in the portal

### Animation
- **Framer Motion**: Use for any required animations
- **tailwindcss-animate**: Use for simpler animations

### Theme Management
- **next-themes**: Use for theme switching functionality# Vanguard Parking Developer Portal Implementation Guide

## System Prompt for Implementation

You are an expert Next.js developer tasked with implementing the Vanguard Parking Developer Portal into a Next.js 14 application. Your goal is to create a professional, responsive portal that provides documentation and tools for developers integrating with Vanguard Parking services. 

You should leverage the existing components and utilities from the starter kit wherever possible, only implementing custom functionality when necessary. The starter kit already includes shadcn/ui components, React Hook Form, Zod validation, Tailwind CSS, and other utilities that should be used instead of creating custom implementations.

Your task is to implement the Developer Portal functionality by adapting the provided code to use the existing component library and utilities.

## Core Application Structure

The Developer Portal consists of:

1. A sidebar navigation component
2. A main content area with multiple tab sections
3. Authentication system with custom API integration
4. Responsive layout for both mobile and desktop

## Key Components and Their Functionality

### Main Components

#### 1. DeveloperPortal Component

This is the root component that orchestrates the entire portal. Utilize the existing components from shadcn/ui:

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query"; // Use existing hook if available

export default function DeveloperPortal() {
  // State declarations
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Media query hook for responsive design
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Side effects for initialization
  
  // Authentication handlers (login, logout, token copying)
  
  // Main component JSX structure with context providers
}
```

#### 2. Context Providers

Two context providers are used to manage state throughout the application:

- **SidebarContext**: Manages sidebar visibility and active tab navigation
- **DeveloperContext**: Manages authentication and token functionality

#### 3. DeveloperSidebar Component

A responsive sidebar navigation that:
- Shows different navigation options
- Displays authentication status and token
- Adapts to screen size

#### 4. Content Section Components

- **WelcomePage**: Landing page with features overview and getting started button
- **AuthenticationContent**: API authentication documentation and token management
- **EmbeddingContent**: Documentation for embedding Vanguard dashboards
- **ApiReferenceContent**: API reference documentation (marked as "Coming Soon")
- **WebhooksContent**: Webhooks documentation (marked as "Coming Soon")

#### 5. Authentication Components

Replace the custom LoginDialog with shadcn/ui components:

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Form schema using Zod
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function LoginDialog({ open, onClose, onLogin, loading, error }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    onLogin(data.email, data.password);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Developer Login</DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Form fields using shadcn/ui components */}
        </form>
      </DialogContent>
    </Dialog>
  );
}

### Utility Functions
```

#### 1. Sidebar Management

```typescript
// Hide application sidebar when in developer portal mode
export function hideSidebar() {
  if (typeof window === 'undefined') return;
  
  // Select all sidebar/navigation elements
  const sidebarElements = document.querySelectorAll(
    '[class*="sidebar"], [class*="Sidebar"], nav, aside, [class*="Navigation"], [class*="navigation"]'
  );
  
  // Hide all matched elements
  sidebarElements.forEach(el => {
    el.classList.add('hide-sidebar');
    (el as HTMLElement).style.display = 'none';
  });
  
  // Return cleanup function
}

// Create observer for dynamically added navigation elements
export function createSidebarObserver() {
  if (typeof window === 'undefined') return null;
  
  const observer = new MutationObserver((mutations) => {
    // Check for and hide newly added navigation elements
  });
  
  // Observe document for changes
  observer.observe(document.body, { childList: true, subtree: true });
  
  return observer;
}
```

## Authentication Implementation

The portal uses a custom authentication flow, but we can leverage React Hook Form and Zod for validation:

1. **User Authentication Flow**:
   - User clicks "Log in" button in sidebar or content area
   - Login modal opens (using shadcn/ui Dialog) with email/password fields
   - Form validation handled by React Hook Form with Zod
   - On submission, API call is made to `https://qapi.vparking.co/auth/login`
   - Success: Token is stored in localStorage, UI updates to show authenticated state
   - Failure: Error message is displayed in the login dialog (using shadcn/ui Alert)
   - Success/error notifications can use Sonner's toast functionality

2. **Authentication API Integration**:
```typescript
const handleLogin = async (email: string, password: string) => {
  setLoginLoading(true);
  
  try {
    // Real API call to authentication endpoint
    const response = await fetch('https://qapi.vparking.co/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed');
    }
    
    // Save the JWT token
    const accessToken = data.access_token;
    setToken(accessToken);
    setIsAuthenticated(true);
    localStorage.setItem('dev_portal_token', accessToken);
    setIsAuthModalOpen(false);
    
    // Show success toast
    toast.success("Successfully logged in");
  } catch (error) {
    console.error('Login error:', error);
    setLoginError('Authentication failed. Please check your credentials and try again.');
    
    // Show error toast
    toast.error("Login failed");
  } finally {
    setLoginLoading(false);
  }
};
```

3. **Token Management**:
   - Display token in the sidebar using shadcn/ui components (Card, Button)
   - Provide copy-to-clipboard functionality and show success toast with Sonner
   - Support logout with confirmation using shadcn/ui Alerts

## Theming Integration

The portal will use the starter kit's built-in theming capabilities:

1. **Using next-themes**:
   - Leverage the existing `next-themes` package for theme switching
   - Use the `ThemeProvider` at the layout level
   - Access theme state and toggle functions through the `useTheme` hook

## Responsive Design

The portal adapts to different screen sizes:

1. **Desktop View**:
   - Sidebar is always visible by default
   - Content area spans the remaining width

2. **Mobile View**:
   - Sidebar is hidden by default
   - Menu button in header toggles sidebar visibility
   - Clicking outside sidebar closes it
   - Content area takes full width

## Implementation Requirements

### Required API Endpoints

- Authentication API: `https://qapi.vparking.co/auth/login`
  - Request: POST with JSON body containing email and password
  - Response: JSON with access_token property on success

### Local Storage Keys

- `dev_portal_token`: JWT token string for authentication

### CSS Classes and DOM Manipulation

- `.hide-sidebar`: Applied to hide main application sidebar elements

## Implementation Strategy

1. **Create Route Files**:
   - Create a route for the developer portal in the app directory
   - Implement the layout, page, and metadata files using Next.js App Router conventions

2. **Component Architecture**:
   - Use shadcn/ui components for all UI elements
   - Implement context providers for state management
   - Create the main DeveloperPortal component
   - Implement sidebar and content section components
   - Create utility functions for sidebar management

3. **Authentication Integration**:
   - Use React Hook Form with Zod for form validation
   - Use shadcn/ui Dialog, Input, and Button components for the login form
   - Implement toast notifications using Sonner
   - Set up token storage and management

4. **Theming System**:
   - Use the existing next-themes provider
   - Apply appropriate Tailwind classes for theme-aware styling

5. **Responsive Behavior**:
   - Use existing useMediaQuery hook or create a simple one
   - Implement conditional rendering based on screen size
   - Use Tailwind's responsive classes for adaptive styling

## Critical Implementation Details

1. **Sidebar Management**:
   - Hide existing application sidebar elements
   - Create observer to handle dynamically added elements
   - Ensure proper cleanup on unmount

2. **Authentication Flow**:
   - Store token in localStorage for persistence
   - Check for existing token during initialization
   - Handle authentication errors with user feedback

3. **Content Navigation**:
   - Use tab-based navigation for content sections
   - Ensure proper tab panel updating on navigation
   - Apply specific styling to welcome page tab

## Technical Considerations

1. **Performance Optimization**:
   - Minimize re-renders with React.memo and useCallback
   - Use memoized theme creation to prevent unnecessary recalculations
   - Apply transitioning classes to prevent layout thrashing

2. **Error Handling**:
   - Implement try/catch blocks for API calls
   - Provide fallback mechanisms for localStorage access
   - Display user-friendly error messages

3. **Accessibility**:
   - Ensure proper ARIA roles for tab panels
   - Maintain focus management during modal interactions
   - Support keyboard navigation throughout the portal

4. **Browser Compatibility**:
   - Use feature detection for advanced DOM APIs
   - Provide fallbacks for older browsers
   - Test across multiple browsers and devices

## Implementation Code Structure

Organize your implementation with the following file structure:

```
app/
  developer/
    layout.tsx         # Portal layout with theme initialization
    page.tsx           # Main DeveloperPortal component
    metadata.ts        # Portal metadata
    
    components/
      DeveloperSidebar.tsx          # Sidebar navigation
      WelcomePage.tsx               # Welcome page content
      AuthenticationContent.tsx     # Authentication documentation
      EmbeddingContent.tsx          # Embedding documentation
      ApiReferenceContent.tsx       # API reference (future)
      WebhooksContent.tsx           # Webhooks documentation (future)
      LoginDialog.tsx               # Authentication modal
      SectionHeader.tsx             # Reusable section header
    
    utils/
      developer-sidebar-script.ts   # Sidebar manipulation utilities
      context-providers.tsx         # Context provider implementations
```

## Implementation Notes

1. Adapt all UI components to use your project's existing component library instead of Material UI
2. Maintain the exact functionality while adjusting styling to match your design system
3. Preserve all authentication flows and API endpoints exactly as specified
4. Ensure responsive behavior works consistently across devices
5. Test theme switching thoroughly to prevent any flickering or visual issues

By following this guide, you should be able to implement the Vanguard Parking Developer Portal with all its features and functionality while integrating it smoothly into your Next.js application.
