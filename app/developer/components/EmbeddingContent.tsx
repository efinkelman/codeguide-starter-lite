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
  // Define the dashboard URL from environment variable or fallback to a default
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_EMBED_URL || 'https://embed.vparking.co'

  const handleLogin = () => {
    setIsAuthModalOpen(true)
  }

  const reactCode = `import React, { useEffect } from 'react';

// Vanguard Parking Dashboard embedding component
function VanguardDashboard({ token }) {
  // The dashboard URL should come from your environment variables
  // In Next.js, you would access it as: process.env.NEXT_PUBLIC_DASHBOARD_EMBED_URL
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_EMBED_URL || 'https://embed.vparking.co';
  
  return (
    <div id="vanguard-dashboard" className="vanguard-embed">
      <iframe 
        src={\`\${dashboardUrl}/embed/dashboard?embedded=true&token=\${token}\`}
        title="Vanguard Parking Dashboard"
        allowFullScreen
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}

export default function App() {
  // Your API token from authentication
  const apiToken = '${token || 'YOUR_API_TOKEN'}';

  return (
    <div className="app">
      <h1>My Application</h1>
      <VanguardDashboard token={apiToken} />
    </div>
  );
}`

  const vueCode = `<template>
  <div>
    <h1>My Application</h1>
    <div id="vanguard-dashboard" class="vanguard-embed">
      <iframe 
        :src="embedUrl"
        title="Vanguard Parking Dashboard"
        allowfullscreen
        style="width: 100%; height: 100%; border: none;"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VanguardDashboard',
  props: {
    token: {
      type: String,
      required: true
    }
  },
  computed: {
    dashboardUrl() {
      // Get dashboard URL from environment variable in your build setup
      // In Vite, you would access it as: import.meta.env.VITE_DASHBOARD_URL
      return process.env.DASHBOARD_URL || 'https://embed.vparking.co';
    },
    embedUrl() {
      return \`\${this.dashboardUrl}/embed/dashboard?embedded=true&token=\${this.token}\`;
    }
  }
}
</script>

<script setup>
// In your main component or App.vue
const apiToken = '${token || 'YOUR_API_TOKEN'}';
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
  <title>Embedded Vanguard Parking Dashboard</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    #vanguard-dashboard {
      width: 100%;
      height: 800px;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  </style>
</head>
<body>
  <div id="vanguard-dashboard">
    <iframe 
      src="${dashboardUrl}/embed/dashboard?embedded=true&token=${token || 'YOUR_API_TOKEN'}" 
      title="Vanguard Parking Dashboard"
      allowfullscreen>
    </iframe>
  </div>
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
              <span className="font-medium">Create an iframe element</span>
              <p className="text-sm text-muted-foreground">
                Add an iframe that points to the dashboard with your token:
              </p>
              <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-2 text-sm">
                <code>{`<iframe 
  src="${dashboardUrl}/embed/dashboard?embedded=true&token=YOUR_API_TOKEN" 
  title="Vanguard Parking Dashboard"
  allowfullscreen>
</iframe>`}</code>
              </pre>
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
                <h4 className="text-base font-medium">Dashboard URL</h4>
                <p className="text-sm text-muted-foreground">
                  The URL of the dashboard embedding service, set via environment variable.
                </p>
                <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-2 text-xs">
                  <code>NEXT_PUBLIC_DASHBOARD_EMBED_URL='{process.env.NEXT_PUBLIC_DASHBOARD_EMBED_URL || 'https://embed.vparking.co'}'</code>
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
                  <code>height: '800px'</code>
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