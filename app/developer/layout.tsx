'use client'

import * as React from 'react'
import { Toaster } from 'sonner'
import { SidebarProvider, DeveloperProvider } from './utils/context-providers'
import { hideSidebar, createSidebarObserver } from './utils/developer-sidebar-script'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Hide the main app sidebar and create an observer for dynamic sidebar elements
  React.useEffect(() => {
    // Hide existing sidebars
    const cleanup = hideSidebar()
    
    // Create observer for dynamically added sidebars
    const observer = createSidebarObserver()
    
    // Cleanup function
    return () => {
      cleanup()
      if (observer) {
        observer.disconnect()
      }
    }
  }, [])

  return (
    <DeveloperProvider>
      <SidebarProvider>
        <div className="flex min-h-full flex-col">
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster position="top-center" />
      </SidebarProvider>
    </DeveloperProvider>
  )
} 