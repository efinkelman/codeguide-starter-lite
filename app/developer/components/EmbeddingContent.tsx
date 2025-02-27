'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionHeader } from './SectionHeader'
import { Button } from '@/components/ui/button'
import { useDeveloperContext } from '../utils/context-providers'
import { Separator } from '@/components/ui/separator'

export function EmbeddingContent() {
  const { isAuthenticated, setIsAuthModalOpen, token } = useDeveloperContext()
  const [activeCodeTab, setActiveCodeTab] = React.useState('react')

  const handleLogin = () => {
    setIsAuthModalOpen(true)
  }

  const reactCode = `import React, { useEffect } from 'react';

// Vanguard Parking Dashboard embedding component
function VanguardDashboard({ dashboardId, apiToken }) {
  useEffect(() => {
    // Initialize the dashboard
    const vp = window.VanguardParking.initialize({
      container: '#vanguard-dashboard',
      dashboardId: dashboardId,
      token: apiToken,
      theme: 'light', // 'light' or 'dark'
      height: '600px',
      width: '100%',
    });

    // Optional: Listen for events
    vp.on('ready', () => {
      console.log('Dashboard is ready');
    });

    vp.on('error', (error) => {
      console.error('Dashboard error:', error);
    });

    // Cleanup on unmount
    return () => {
      vp.destroy();
    };
  }, [dashboardId, apiToken]);

  return (
    <div id="vanguard-dashboard" className="vanguard-embed">
      {/* Dashboard will be rendered here */}
    </div>
  );
}

export default function App() {
  // Your actual dashboard ID and token
  const dashboardId = 'dashboard_123456';
  const apiToken = '${token || 'YOUR_API_TOKEN'}';

  return (
    <div className="app">
      <h1>My Application</h1>
      <VanguardDashboard dashboardId={dashboardId} apiToken={apiToken} />
    </div>
  );
}`

  const vueCode = `<template>
  <div>
    <h1>My Application</h1>
    <div id="vanguard-dashboard" class="vanguard-embed">
      <!-- Dashboard will be rendered here -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'VanguardDashboard',
  props: {
    dashboardId: {
      type: String,
      required: true
    },
    apiToken: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      vp: null
    }
  },
  mounted() {
    // Initialize the dashboard
    this.vp = window.VanguardParking.initialize({
      container: '#vanguard-dashboard',
      dashboardId: this.dashboardId,
      token: this.apiToken,
      theme: 'light', // 'light' or 'dark'
      height: '600px',
      width: '100%',
    })

    // Optional: Listen for events
    this.vp.on('ready', () => {
      console.log('Dashboard is ready')
    })

    this.vp.on('error', (error) => {
      console.error('Dashboard error:', error)
    })
  },
  beforeDestroy() {
    // Cleanup when component is destroyed
    if (this.vp) {
      this.vp.destroy()
    }
  }
}
</script>

<script setup>
// In your main component or App.vue
const dashboardId = 'dashboard_123456'
const apiToken = '${token || 'YOUR_API_TOKEN'}'
</script>

<style scoped>
.vanguard-embed {
  width: 100%;
  height: 600px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
</style>`

  const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vanguard Parking Dashboard</title>
  <style>
    .vanguard-embed {
      width: 100%;
      height: 600px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
  </style>
  <!-- Include Vanguard Parking embedding script -->
  <script src="https://embed.vparking.co/embed.js"></script>
</head>
<body>
  <h1>My Application</h1>
  
  <div id="vanguard-dashboard" class="vanguard-embed">
    <!-- Dashboard will be rendered here -->
  </div>

  <script>
    // Initialize when document is ready
    document.addEventListener('DOMContentLoaded', function() {
      // Your actual dashboard ID and token
      const dashboardId = 'dashboard_123456';
      const apiToken = '${token || 'YOUR_API_TOKEN'}';
      
      // Initialize the dashboard
      const vp = window.VanguardParking.initialize({
        container: '#vanguard-dashboard',
        dashboardId: dashboardId,
        token: apiToken,
        theme: 'light', // 'light' or 'dark'
        height: '600px',
        width: '100%',
      });

      // Optional: Listen for events
      vp.on('ready', () => {
        console.log('Dashboard is ready');
      });

      vp.on('error', (error) => {
        console.error('Dashboard error:', error);
      });
    });
  </script>
</body>
</html>`

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
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-medium">Include the embedding script</span>
              <p className="text-sm text-muted-foreground">
                Add the Vanguard Parking embedding script to your HTML page:
              </p>
              <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-2 text-sm">
                <code>{'<script src="https://embed.vparking.co/embed.js"></script>'}</code>
              </pre>
            </li>
            <li>
              <span className="font-medium">Create a container element</span>
              <p className="text-sm text-muted-foreground">
                Add a div element where the dashboard will be rendered:
              </p>
              <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-2 text-sm">
                <code>{'<div id="vanguard-dashboard" class="vanguard-embed"></div>'}</code>
              </pre>
            </li>
            <li>
              <span className="font-medium">Initialize the dashboard</span>
              <p className="text-sm text-muted-foreground">
                Use the API to initialize the dashboard with your configuration:
              </p>
            </li>
          </ol>

          <Separator className="my-4" />

          <h3 className="text-lg font-medium">Code Examples</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Here are examples of how to embed Vanguard Parking dashboards in different frameworks:
          </p>

          <Tabs value={activeCodeTab} onValueChange={setActiveCodeTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="vue">Vue</TabsTrigger>
              <TabsTrigger value="html">HTML/JS</TabsTrigger>
            </TabsList>
            <TabsContent value="react">
              <div className="rounded-md bg-black p-4">
                <pre className="overflow-x-auto text-sm text-white">
                  <code>{reactCode}</code>
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="vue">
              <div className="rounded-md bg-black p-4">
                <pre className="overflow-x-auto text-sm text-white">
                  <code>{vueCode}</code>
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="html">
              <div className="rounded-md bg-black p-4">
                <pre className="overflow-x-auto text-sm text-white">
                  <code>{htmlCode}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Options</CardTitle>
          <CardDescription>
            Customize the behavior and appearance of embedded dashboards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-base font-medium">container</h4>
                <p className="text-sm text-muted-foreground">
                  CSS selector or DOM element where the dashboard will be rendered.
                </p>
                <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-2 text-xs">
                  <code>container: '#vanguard-dashboard'</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-medium">dashboardId</h4>
                <p className="text-sm text-muted-foreground">
                  Unique identifier for the dashboard you want to embed.
                </p>
                <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-2 text-xs">
                  <code>dashboardId: 'dashboard_123456'</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-medium">token</h4>
                <p className="text-sm text-muted-foreground">
                  Your API token for authentication.
                </p>
                <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-2 text-xs">
                  <code>token: '{token || 'YOUR_API_TOKEN'}'</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-medium">theme</h4>
                <p className="text-sm text-muted-foreground">
                  Visual theme for the dashboard. Options: 'light' or 'dark'.
                </p>
                <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-2 text-xs">
                  <code>theme: 'light'</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-medium">height</h4>
                <p className="text-sm text-muted-foreground">
                  Height of the dashboard container. CSS value (px, %, vh).
                </p>
                <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-2 text-xs">
                  <code>height: '600px'</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-medium">width</h4>
                <p className="text-sm text-muted-foreground">
                  Width of the dashboard container. CSS value (px, %, vw).
                </p>
                <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-2 text-xs">
                  <code>width: '100%'</code>
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 