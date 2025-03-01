'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from './SectionHeader'
import { Button } from '@/components/ui/button'
import { useDeveloperContext } from '../utils/context-providers'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Lock, KeyRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CodeBlock } from '@/components/ui/code-block'
import Script from 'next/script'

// Add TypeScript declaration for the VanguardEmbed global
declare global {
  interface Window {
    VanguardEmbed?: {
      init: (config: {
        container: string;
        token: string;
        partnerId?: string;
        debug?: boolean;
        onLoad?: () => void;
        onError?: (error: any) => void;
      }) => void;
      destroy?: () => void;
    };
  }
}

// Define the actual dashboard URL for the iframe
const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || `${process.env.NEXT_PUBLIC_VANGUARD_EMBED_HOST || 'https://app.vanguardparking.co'}/embed/dashboard`;

export function EmbeddingContent() {
  const { isAuthenticated, setIsAuthModalOpen, token } = useDeveloperContext()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [demoStatus, setDemoStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [scriptLoaded, setScriptLoaded] = React.useState(false)
  
  // Define the embed script URL from environment variable
  const dashboardEnvUrl = process.env.NEXT_PUBLIC_VANGUARD_EMBED_HOST || 'https://app.vanguardparking.co';
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  // Use the environment variable or default to the production URL
  const dashboardUrl = dashboardEnvUrl || (isLocalhost ? 'http://localhost:3001' : 'https://app.vanguardparking.co');
  const embedScriptUrl = `${dashboardUrl}/embed/vanguard-embed.js`;

  const handleLogin = () => {
    setIsAuthModalOpen(true)
  }
  
  // Handle script load event
  const handleScriptLoad = React.useCallback(() => {
    console.log('Vanguard embed script loaded successfully');
    setScriptLoaded(true);
    
    // If the user is authenticated and we have a token, initialize the dashboard
    if (isAuthenticated && token && containerRef.current) {
      setDemoStatus('loading');
      
      try {
        // Make sure the VanguardEmbed global object is available
        if (window.VanguardEmbed && typeof window.VanguardEmbed.init === 'function') {
          // Get partnerId from environment if available
          const partnerId = process.env.NEXT_PUBLIC_PARTNER_ID;
          
          // Initialize the dashboard
          window.VanguardEmbed.init({
            container: containerRef.current.id,
            token: token,
            partnerId: partnerId || undefined,
            debug: isLocalhost,
            onLoad: function() {
              console.log('Dashboard content loaded successfully');
              setDemoStatus('success');
            },
            onError: function(error: any) {
              console.error('Error loading dashboard content:', error);
              setErrorMessage(error?.message || 'Failed to load the dashboard content');
              setDemoStatus('error');
            }
          });
        } else {
          throw new Error('Vanguard embed script failed to initialize properly');
        }
      } catch (error: any) {
        console.error('Error initializing dashboard:', error);
        setErrorMessage(error?.message || 'Failed to initialize the dashboard');
        setDemoStatus('error');
      }
    }
  }, [isAuthenticated, token, isLocalhost]);
  
  // Handle script error event
  const handleScriptError = React.useCallback(() => {
    console.error('Failed to load Vanguard embed script');
    setErrorMessage('Failed to load the embed script. Please try again later.');
    setDemoStatus('error');
  }, []);

  // Initialize dashboard when script is loaded and user gets authenticated
  React.useEffect(() => {
    if (scriptLoaded && isAuthenticated && token && containerRef.current) {
      handleScriptLoad();
      
      // Set a timeout for loading
      const timer = setTimeout(() => {
        // Check if still loading after timeout
        setDemoStatus((currentStatus) => {
          if (currentStatus === 'loading') {
            setErrorMessage('Dashboard took too long to load. Please try again.');
            return 'error';
          }
          return currentStatus;
        });
      }, 15000); // 15 seconds timeout
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [scriptLoaded, isAuthenticated, token, handleScriptLoad]);

  // Clean up when component unmounts or token changes
  React.useEffect(() => {
    return () => {
      // If there's a cleanup method in the VanguardEmbed API, call it here
      if (window.VanguardEmbed && typeof window.VanguardEmbed.destroy === 'function') {
        window.VanguardEmbed.destroy();
      }
    };
  }, [token]);

  return (
    <div className="space-y-8 pb-16">
      {/* Add the embed script to the page */}
      <Script
        src={embedScriptUrl}
        onLoad={handleScriptLoad}
        onError={handleScriptError}
        strategy="lazyOnload"
      />
      
      <SectionHeader
        title="Embedding"
        description="Integrate Vanguard Parking dashboards into your applications"
        action={
          !isAuthenticated && (
            <Button onClick={handleLogin}>
              Log In for API Token
            </Button>
          )
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Live Demo</CardTitle>
            <CardDescription>
              See the dashboard embedding in action
            </CardDescription>
          </div>
          <div>
            {isAuthenticated ? (
              demoStatus === 'success' ? (
                <Badge className="bg-green-600 hover:bg-green-700 gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Connected</span>
                </Badge>
              ) : demoStatus === 'error' ? (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Error</span>
                </Badge>
              ) : demoStatus === 'loading' ? (
                <Badge variant="outline" className="gap-1">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <span>Loading</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Authenticated</span>
                </Badge>
              )
            ) : (
              <Badge variant="outline" className="gap-1 text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                <span>Login Required</span>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          {!isAuthenticated ? (
            <div className="px-6 pb-6">
              <Alert className="bg-muted border-primary/20">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertTitle>Authentication required</AlertTitle>
                <AlertDescription>
                  Log in with your developer account to see a live preview of the dashboard embedding.
                  <div className="mt-4">
                    <Button onClick={handleLogin} variant="outline">
                      Log In for Demo
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="relative">
              {/* Only show loading overlay if in loading state */}
              {demoStatus === 'loading' && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2 bg-card p-4 rounded-md shadow-md">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <div className="text-sm font-medium">Loading dashboard...</div>
                  </div>
                </div>
              )}
              
              {/* Error alert - show above the container */}
              {demoStatus === 'error' && (
                <div className="px-6 pb-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="space-y-2">
                      <p>{errorMessage || 'Failed to load the dashboard. Please try again later.'}</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => {
                          setDemoStatus('loading');
                          // Force re-initialization
                          if (window.VanguardEmbed && typeof window.VanguardEmbed.init === 'function' && containerRef.current && token) {
                            window.VanguardEmbed.init({
                              container: containerRef.current.id,
                              token: token,
                              partnerId: process.env.NEXT_PUBLIC_PARTNER_ID || undefined,
                              debug: isLocalhost,
                              onLoad: function() {
                                setDemoStatus('success');
                              },
                              onError: function(error: any) {
                                setErrorMessage(error?.message || 'Failed to load the dashboard content');
                                setDemoStatus('error');
                              }
                            });
                          }
                        }}
                      >
                        Try again
                      </Button>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              
              {/* Dashboard container - this will be populated by the VanguardEmbed.init method */}
              <div 
                id="vanguard-dashboard-demo" 
                ref={containerRef}
                className="w-full h-[600px] overflow-hidden"
              ></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Embedding</CardTitle>
          <CardDescription>
            Embed Vanguard Parking dashboards directly in your web application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Vanguard Parking embedding feature allows you to seamlessly integrate 
            parking dashboards into your own web applications. This provides your users 
            with real-time parking data without leaving your application.
          </p>

          <h3 className="text-lg font-medium">Getting Started</h3>
          
          <Alert className="bg-muted border-primary/20 mb-4">
            <KeyRound className="h-4 w-4 text-primary" />
            <AlertTitle>API Token Required</AlertTitle>
            <AlertDescription className="text-sm">
              <p>
                To embed dashboards, you&apos;ll need an API token. To generate a token,
                follow the instructions in the Authentication section of the Developer Portal.
                {!isAuthenticated && (
                  <Button onClick={handleLogin} size="sm" variant="outline" className="ml-2 gap-1">
                    <Lock className="h-3.5 w-3.5" />
                    <span>Log In</span>
                  </Button>
                )}
              </p>
            </AlertDescription>
          </Alert>
          
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-medium">Include the embed script</span>
              <p className="text-sm text-muted-foreground">
                Add the Vanguard Parking embed script to your HTML page:
              </p>
              <CodeBlock 
                code={`<script src="${dashboardUrl}/embed/vanguard-embed.js"></script>`}
                language="html"
                className="mt-2"
              />
            </li>
            <li>
              <span className="font-medium">Create a container element</span>
              <p className="text-sm text-muted-foreground">
                Add a div element where the dashboard will be rendered:
              </p>
              <CodeBlock 
                code={`<div id="vanguard-dashboard" style="width: 100%; height: 800px;"></div>`}
                language="html"
                className="mt-2"
              />
            </li>
            <li>
              <span className="font-medium">Initialize the dashboard</span>
              <p className="text-sm text-muted-foreground">
                Initialize the dashboard with your JWT token:
              </p>
              <CodeBlock 
                code={`<script>
  document.addEventListener('DOMContentLoaded', function() {
    VanguardEmbed.init({
      container: 'vanguard-dashboard',
      token: '${token || 'YOUR_JWT_TOKEN'}',  // Replace with actual JWT token
      partnerId: 'YOUR_PARTNER_ID', // Optional: Include if you have a partner ID
      debug: true // Set to true for development, false for production
    });
  });
</script>`}
                language="html"
                className="mt-2"
              />
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
} 