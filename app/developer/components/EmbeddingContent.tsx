'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from './SectionHeader'
import { Button } from '@/components/ui/button'
import { useDeveloperContext } from '../utils/context-providers'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Lock, KeyRound, Terminal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CodeBlock } from '@/components/ui/code-block'
import Script from 'next/script'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

// Updated TypeScript declaration for the VanguardEmbed global
declare global {
  interface Window {
    VanguardEmbed?: {
      init: (config: {
        container: string;
        token: string;
        partnerId?: string;
        dashboardUrl?: string;
        debug?: boolean;
        timeout?: number;
        onReady?: () => void;
        onLoad?: () => void;
        onError?: (error: any) => void;
        onNavigate?: (url: string) => void;
      }) => void;
      destroy?: () => void;
      refresh?: () => void;
      version?: () => string;
    };
  }
}

export function EmbeddingContent() {
  const { isAuthenticated, setIsAuthModalOpen, token } = useDeveloperContext()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [demoStatus, setDemoStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [scriptLoaded, setScriptLoaded] = React.useState(false)
  const [logs, setLogs] = React.useState<Array<{time: string, message: string, type: 'info' | 'error' | 'warning'}>>([])
  const [isLogsOpen, setIsLogsOpen] = React.useState(false)
  
  // Use only environment variables for URLs, with fallbacks
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const dashboardUrl = process.env.NEXT_PUBLIC_VANGUARD_EMBED_HOST || (isLocalhost ? 'http://localhost:3001' : 'https://app.vanguardparking.co');
  const embedScriptUrl = `${dashboardUrl}/embed/vanguard-embed.js`;

  // Track if the dashboard has initialized to prevent duplicate initializations
  const dashboardInitializedRef = React.useRef<boolean>(false);
  
  // Track timeout timer to clear it when needed
  const timeoutTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Add a log entry
  const addLog = React.useCallback((message: string, type: 'info' | 'error' | 'warning' = 'info') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    setLogs(prevLogs => [...prevLogs, { time: timeStr, message, type }]);
    
    // Auto-open logs on errors or warnings
    if (type === 'error' || type === 'warning') {
      setIsLogsOpen(true);
    }
    
    // Limit logs to last 100 entries to prevent memory issues
    if (logs.length > 100) {
      setLogs(prevLogs => prevLogs.slice(-100));
    }
  }, [logs.length]);

  const handleLogin = () => {
    setIsAuthModalOpen(true)
  }
  
  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  }
  
  // Initialize the dashboard with all necessary callbacks
  const initializeDashboard = React.useCallback(() => {
    if (!containerRef.current || !token || !window.VanguardEmbed || dashboardInitializedRef.current) {
      return;
    }
    
    setDemoStatus('loading');
    addLog('Initializing dashboard...');
    
    try {
      // Mark as initialized to prevent duplicate initializations
      dashboardInitializedRef.current = true;
      
      // Get partnerId from environment if available
      const partnerId = process.env.NEXT_PUBLIC_PARTNER_ID;
      
      // Set up the timeout for dashboard loading
      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
      }
      
      timeoutTimerRef.current = setTimeout(() => {
        // Only trigger timeout if still in loading state
        setDemoStatus((currentStatus) => {
          if (currentStatus === 'loading') {
            const errorMsg = 'Dashboard took too long to load. Please try again.';
            addLog(errorMsg, 'error');
            setErrorMessage(errorMsg);
            return 'error';
          }
          return currentStatus;
        });
      }, 20000); // 20 seconds timeout
      
      // Log the embed version if available
      if (typeof window.VanguardEmbed.version === 'function') {
        addLog(`Embed script version: ${window.VanguardEmbed.version()}`);
      }
      
      // Initialize the dashboard with both onLoad and onReady callbacks
      window.VanguardEmbed.init({
        container: containerRef.current.id,
        token: token,
        partnerId: partnerId || undefined,
        // Explicitly set dashboardUrl to ensure consistency
        dashboardUrl: dashboardUrl,
        debug: true, // Always enable debug for logging
        timeout: 20000, // 20 seconds timeout (should match the React timeout)
        // onLoad is triggered when the iframe itself has loaded
        onLoad: function() {
          addLog('Dashboard iframe loaded');
          // We don't set success here as we wait for the dashboard to be ready
        },
        // onReady is triggered when the dashboard application is fully loaded and ready
        onReady: function() {
          addLog('Dashboard content loaded and ready');
          // Clear timeout timer since dashboard is loaded
          if (timeoutTimerRef.current) {
            clearTimeout(timeoutTimerRef.current);
            timeoutTimerRef.current = null;
          }
          setDemoStatus('success');
        },
        // Handle various error scenarios with appropriate messaging
        onError: function(error: any) {
          addLog(`Error loading dashboard: ${error?.message || JSON.stringify(error)}`, 'error');
          
          // Clear timeout timer since we have an error response
          if (timeoutTimerRef.current) {
            clearTimeout(timeoutTimerRef.current);
            timeoutTimerRef.current = null;
          }
          
          // Provide more specific error messaging based on error code
          let errorMessage = 'Failed to load the dashboard content';
          
          if (error?.code === 'AUTH_ERROR') {
            errorMessage = 'Authentication failed. Please check your API token.';
          } else if (error?.code === 'LOAD_TIMEOUT') {
            errorMessage = 'Dashboard took too long to load. Please try again.';
          } else if (error?.code === 'IFRAME_LOAD_ERROR') {
            errorMessage = 'Failed to load the dashboard. Please check your network connection.';
          } else if (error?.message) {
            errorMessage = error.message;
          }
          
          setErrorMessage(errorMessage);
          setDemoStatus('error');
          
          // Reset the initialization flag to allow retrying
          dashboardInitializedRef.current = false;
        },
        // Track dashboard navigation events
        onNavigate: function(url: string) {
          addLog(`Dashboard navigation: ${url}`);
        }
      });
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to initialize the dashboard';
      addLog(`Initialization error: ${errorMsg}`, 'error');
      setErrorMessage(errorMsg);
      setDemoStatus('error');
      dashboardInitializedRef.current = false;
    }
  }, [token, dashboardUrl, addLog]);
  
  // Handle script load event
  const handleScriptLoad = React.useCallback(() => {
    addLog('Vanguard embed script loaded successfully');
    setScriptLoaded(true);
    
    // Initialize dashboard if user is already authenticated
    if (isAuthenticated && token && containerRef.current) {
      initializeDashboard();
    }
  }, [isAuthenticated, token, initializeDashboard, addLog]);
  
  // Handle script error event
  const handleScriptError = React.useCallback(() => {
    const errorMsg = 'Failed to load the embed script. Please try again later.';
    addLog(errorMsg, 'error');
    setErrorMessage(errorMsg);
    setDemoStatus('error');
  }, [addLog]);

  // Initialize dashboard when script is loaded and user gets authenticated
  React.useEffect(() => {
    if (scriptLoaded && isAuthenticated && token && containerRef.current && !dashboardInitializedRef.current) {
      initializeDashboard();
    }
    
    // Clean up timeout on unmount
    return () => {
      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
        timeoutTimerRef.current = null;
      }
    };
  }, [scriptLoaded, isAuthenticated, token, initializeDashboard]);

  // Clean up when component unmounts or token changes
  React.useEffect(() => {
    return () => {
      // If there's a cleanup method in the VanguardEmbed API, call it here
      if (window.VanguardEmbed && typeof window.VanguardEmbed.destroy === 'function') {
        window.VanguardEmbed.destroy();
      }
      
      // Reset the initialization flag
      dashboardInitializedRef.current = false;
      
      // Clear any pending timeouts
      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
        timeoutTimerRef.current = null;
      }
    };
  }, [token]);

  // Handle retry attempts
  const handleRetry = React.useCallback(() => {
    setDemoStatus('loading');
    
    // Reset the error message
    setErrorMessage('');
    addLog('Retrying dashboard initialization...');
    
    // Reset the initialization flag
    dashboardInitializedRef.current = false;
    
    // Use refresh if available, otherwise reinitialize
    if (window.VanguardEmbed && typeof window.VanguardEmbed.refresh === 'function') {
      // Set up timeout for refresh operation
      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
      }
      
      timeoutTimerRef.current = setTimeout(() => {
        setDemoStatus((currentStatus) => {
          if (currentStatus === 'loading') {
            const errorMsg = 'Dashboard took too long to load. Please try again.';
            addLog(errorMsg, 'error');
            setErrorMessage(errorMsg);
            return 'error';
          }
          return currentStatus;
        });
      }, 20000);
      
      // Call refresh method
      addLog('Using refresh method to reload dashboard');
      window.VanguardEmbed.refresh();
    } else {
      // Reinitialize from scratch
      addLog('Reinitializing dashboard from scratch');
      initializeDashboard();
    }
  }, [initializeDashboard, addLog]);

  // Format logs for display
  const getLogClass = (type: 'info' | 'error' | 'warning') => {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-amber-500';
      default:
        return 'text-foreground';
    }
  };

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
                        onClick={handleRetry}
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
                className="w-full overflow-auto"
                style={{ height: '600px', minHeight: '600px' }}
              ></div>
              
              {/* Logs section */}
              <Collapsible 
                open={isLogsOpen} 
                onOpenChange={setIsLogsOpen}
                className="mt-4 px-6 pb-6"
              >
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Terminal className="h-4 w-4" />
                      <span>{isLogsOpen ? 'Hide Logs' : 'Show Logs'}</span>
                    </Button>
                  </CollapsibleTrigger>
                  
                  {logs.length > 0 && isLogsOpen && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearLogs}
                    >
                      Clear Logs
                    </Button>
                  )}
                </div>
                
                <CollapsibleContent className="mt-2">
                  <Card>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[200px] w-full rounded-md border">
                        <div className="p-4 font-mono text-sm">
                          {logs.length > 0 ? (
                            logs.map((log, index) => (
                              <div key={index} className={`${getLogClass(log.type)} mb-1`}>
                                <span className="text-muted-foreground">[{log.time}]</span> {log.message}
                              </div>
                            ))
                          ) : (
                            <div className="text-muted-foreground italic">No logs yet</div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
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
                code={`<div id="vanguard-dashboard" style="width: 100%; height: 800px; overflow: auto;"></div>`}
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
      debug: true, // Set to true for development, false for production
      onReady: function() {
        console.log('Dashboard is ready and fully loaded');
      },
      onError: function(error) {
        console.error('Dashboard error:', error.message);
      }
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