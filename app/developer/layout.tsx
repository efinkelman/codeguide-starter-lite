'use client'

import * as React from 'react'
import { Toaster } from 'sonner'
import { SidebarProvider, DeveloperProvider } from './utils/context-providers'
import { hideSidebar, createSidebarObserver } from './utils/developer-sidebar-script'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { DeveloperSidebar } from './components/DeveloperSidebar'

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

  // Hide the footer on the developer portal
  React.useEffect(() => {
    // Select all footer elements
    const footerElements = document.querySelectorAll('footer')
    
    // Save original display values and hide all matched elements
    const originalDisplays = new Map()
    
    footerElements.forEach(el => {
      // Skip if element is within the developer portal
      if (el.closest('[data-developer-portal="true"]')) return
      
      // Store original display value
      const htmlEl = el as HTMLElement
      originalDisplays.set(el, htmlEl.style.display)
      
      // Hide element
      htmlEl.style.display = 'none'
    })
    
    // Return cleanup function
    return () => {
      footerElements.forEach(el => {
        // Skip if element is within the developer portal
        if (el.closest('[data-developer-portal="true"]')) return
        
        // Restore original display value
        const htmlEl = el as HTMLElement
        const originalDisplay = originalDisplays.get(el)
        
        if (originalDisplay !== undefined) {
          htmlEl.style.display = originalDisplay
        } else {
          htmlEl.style.display = ''
        }
      })
    }
  }, [])

  return (
    <SidebarProvider>
      <DeveloperProvider>
        <div className="flex min-h-screen flex-col sm:flex-row" data-developer-portal="true">
          <DeveloperSidebar />
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-4xl">
              {children}
            </div>
          </div>
          
          <Toaster position="top-right" />
          
          <div className="fixed bottom-4 right-4">
            <ThemeToggle />
          </div>
        </div>
      </DeveloperProvider>
    </SidebarProvider>
  )
} 