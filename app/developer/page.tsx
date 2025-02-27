'use client'

import * as React from 'react'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useIsMobile } from '@/hooks/use-mobile'

import { DeveloperSidebar } from './components/DeveloperSidebar'
import { WelcomePage } from './components/WelcomePage'
import { AuthenticationContent } from './components/AuthenticationContent'
import { EmbeddingContent } from './components/EmbeddingContent'
import { ApiReferenceContent } from './components/ApiReferenceContent'
import { WebhooksContent } from './components/WebhooksContent'
import { LoginDialog } from './components/LoginDialog'
import { useSidebar } from './utils/context-providers'

export default function DeveloperPortalPage() {
  const isMobile = useIsMobile()
  const { activeTab } = useSidebar()
  
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
              <ApiReferenceContent />
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