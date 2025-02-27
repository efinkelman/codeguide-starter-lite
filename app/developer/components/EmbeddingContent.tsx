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

// Define the actual dashboard URL for the iframe
const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000/embed/dashboard';

export function EmbeddingContent() {
  const { isAuthenticated, setIsAuthModalOpen, token } = useDeveloperContext()
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [demoStatus, setDemoStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')
  
  // Define the embed script URL from environment variable
  const dashboardEnvUrl = process.env.NEXT_PUBLIC_DASHBOARD_EMBED_URL || '';
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const dashboardUrl = dashboardEnvUrl || (isLocalhost ? 'http://localhost:3001' : 'https://partner.vparking.co');

  const handleLogin = () => {
    setIsAuthModalOpen(true)
  }

  // Handle iframe load events
  const handleIframeLoad = React.useCallback(() => {
    console.log('Dashboard iframe loaded successfully');
    setDemoStatus('success');
  }, []);

  // Handle iframe error events
  const handleIframeError = React.useCallback((event: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    console.error('Error loading dashboard iframe:', event);
    setErrorMessage('Failed to load the dashboard iframe');
    setDemoStatus('error');
  }, []);

  // Generate the iframe URL with token
  const getIframeUrl = React.useCallback((token: string) => {
    try {
      const url = new URL(DASHBOARD_URL);
      url.searchParams.append('embedded', 'true');
      url.searchParams.append('token', token);
      return url.toString();
    } catch (error) {
      console.error('Error creating iframe URL:', error);
      return `${DASHBOARD_URL}?embedded=true&token=${token}`;
    }
  }, []);

  // Initialize dashboard when component mounts and user is authenticated
  React.useEffect(() => {
    // Only set loading state if currently idle
    if (isAuthenticated && token) {
      // Only start loading if not already in loading/success/error state
      if (demoStatus === 'idle') {
        setDemoStatus('loading');
      }
      
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
  }, [isAuthenticated, token, demoStatus]);

  return (
    <div className="space-y-8 pb-16">
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
              
              {/* Error alert - show above the iframe container */}
              {demoStatus === 'error' && (
                <div className="px-6 pb-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="space-y-2">
                      <p>{errorMessage || 'Failed to load the dashboard. Please try again later.'}</p>
                      {DASHBOARD_URL.includes('localhost') && (
                        <p className="text-sm">
                          You&apos;re trying to load a dashboard from: <code className="bg-background p-1 rounded">{DASHBOARD_URL}</code>. 
                          Make sure this service is running locally.
                        </p>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => {
                          setDemoStatus('loading');
                          if (iframeRef.current) {
                            // Reset the iframe by reloading it
                            const currentSrc = iframeRef.current.src;
                            iframeRef.current.src = '';
                            setTimeout(() => {
                              if (iframeRef.current) {
                                iframeRef.current.src = currentSrc;
                              }
                            }, 100);
                          }
                        }}
                      >
                        Try again
                      </Button>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              
              {/* Always render the iframe container, but only populate it when authenticated */}
              <div className="w-full h-[600px] overflow-hidden">
                {isAuthenticated && token && (
                  <iframe
                    ref={iframeRef}
                    src={getIframeUrl(token)}
                    title="Vanguard Parking Dashboard"
                    className="w-full h-full border-0"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    allowFullScreen
                  />
                )}
              </div>
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
                Initialize the dashboard with your access token:
              </p>
              <CodeBlock 
                code={`<script>
  document.addEventListener('DOMContentLoaded', function() {
    VanguardEmbed.init({
      container: 'vanguard-dashboard',
      accessToken: '${token || 'YOUR_API_TOKEN'}',  // Use your authentication token here
      baseUrl: '${dashboardUrl}'
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