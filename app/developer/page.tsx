'use client'

import * as React from 'react'
import { Tabs, TabsContent } from '@/components/ui/tabs'

import { DeveloperSidebar } from './components/DeveloperSidebar'
import { WelcomePage } from './components/WelcomePage'
import { AuthenticationContent } from './components/AuthenticationContent'
import { EmbeddingContent } from './components/EmbeddingContent'
import { ApiReferenceContent } from './components/ApiReferenceContent'
import { WebhooksContent } from './components/WebhooksContent'
import { LoginDialog } from './components/LoginDialog'
import { useSidebar } from './utils/context-providers'
import { isApiReferenceEnabled } from './utils/feature-flags'

export default function DeveloperPortalPage() {
  const { activeTab } = useSidebar()
  const [apiReferenceEnabled, setApiReferenceEnabled] = React.useState(false)
  
  React.useEffect(() => {
    setApiReferenceEnabled(isApiReferenceEnabled())
  }, [])
  
  return (
    <div className="flex min-h-screen flex-col sm:flex-row" data-developer-portal="true">
      <DeveloperSidebar />
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          <Tabs value={activeTab.toString()} className="w-full">
            <TabsContent value="0" className="mt-0">
              <WelcomePage />
            </TabsContent>
            <TabsContent value="1" className="mt-0">
              <AuthenticationContent />
            </TabsContent>
            <TabsContent value="2" className="mt-0">
              <EmbeddingContent />
            </TabsContent>
            <TabsContent value="3" className="mt-0">
              {apiReferenceEnabled ? (
                <ApiReferenceContent />
              ) : (
                <div className="rounded-md bg-yellow-50 p-4 my-6">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">API Reference is not available</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>The API Reference is currently disabled in production. It is only available in development environments.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="4" className="mt-0">
              <WebhooksContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <LoginDialog />
    </div>
  )
} 