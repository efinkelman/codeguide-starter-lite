'use client'

import * as React from 'react'
import { X, Menu, ChevronRight, Code, Lock, PanelLeft, Webhook, BookOpen, Copy, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

import { useSidebar, useDeveloperContext } from '../utils/context-providers'
import { isApiReferenceEnabled } from '../utils/feature-flags'

const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
}

type NavItemProps = {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
  disabled?: boolean
  badge?: React.ReactNode
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, disabled = false, badge }) => (
  <button
    className={`flex w-full items-center space-x-2 px-4 py-3 text-left text-sm transition-colors
      ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/50'}
      ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
  >
    <span className="flex h-5 w-5 items-center justify-center">
      {icon}
    </span>
    <span className="flex-grow">{label}</span>
    {badge}
    {isActive && <ChevronRight className="h-4 w-4" />}
  </button>
)

export function DeveloperSidebar() {
  const isMobile = useIsMobile()
  const { sidebarOpen, setSidebarOpen, activeRoute, navigateTo } = useSidebar()
  const { isAuthenticated, token, copyToken, copySuccess, handleLogout } = useDeveloperContext()
  const sidebarRef = React.useRef<HTMLDivElement>(null)
  
  // Check if API Reference should be enabled using our utility function
  const [apiReferenceEnabled, setApiReferenceEnabled] = React.useState(false)
  
  React.useEffect(() => {
    setApiReferenceEnabled(isApiReferenceEnabled())
  }, [])

  // Handle clicks outside the sidebar to close it on mobile
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobile, sidebarOpen, setSidebarOpen])

  const ComingSoonBadge = () => (
    <Badge variant="outline" className="ml-2 text-xs bg-primary/5 text-primary border-primary/20">
      Soon
    </Badge>
  )

  const navItems = [
    { icon: <BookOpen className="h-4 w-4" />, label: 'Overview', route: '/' },
    { icon: <Lock className="h-4 w-4" />, label: 'Authentication', route: 'authentication' },
    { icon: <PanelLeft className="h-4 w-4" />, label: 'Embedding', route: 'embedding' },
    { 
      icon: <Code className="h-4 w-4" />, 
      label: 'API Reference', 
      route: 'api-reference',
      disabled: !apiReferenceEnabled,
      badge: !apiReferenceEnabled ? <ComingSoonBadge /> : undefined
    },
    { 
      icon: <Webhook className="h-4 w-4" />, 
      label: 'Webhooks', 
      route: 'webhooks', 
      disabled: true,
      badge: <ComingSoonBadge />
    },
  ]

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      handleLogout()
      toast.success('Logged out successfully')
    }
  }

  return (
    <>
      {isMobile && (
        <div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Developer Portal</h1>
        </div>
      )}

      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <motion.div
            ref={sidebarRef}
            className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[280px] flex-col overflow-hidden bg-background transition-transform sm:z-0 sm:sticky sm:top-0 ${
              isMobile ? 'shadow-lg' : 'border-r'
            }`}
            initial={isMobile ? 'hidden' : 'visible'}
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            data-developer-portal="true"
          >
            <div className="flex h-16 items-center justify-between px-6 py-4">
              <h2 className="text-lg font-semibold">Developer Portal</h2>
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col">
              <nav className="flex flex-col py-2">
                {navItems.map((item) => (
                  <NavItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    isActive={activeRoute === item.route}
                    onClick={() => !item.disabled && navigateTo(item.route)}
                    disabled={item.disabled}
                    badge={item.badge}
                  />
                ))}
              </nav>

              <Separator className="my-4" />

              {isAuthenticated ? (
                <div className="px-4 flex-shrink-0">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Your API Token</CardTitle>
                      <CardDescription className="text-xs">
                        Use this token to authenticate API requests
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="rounded-md bg-muted p-2">
                        <code className="block truncate text-xs">
                          {token ? `${token.substring(0, 12)}...` : 'No token available'}
                        </code>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="w-full" 
                        onClick={copyToken}
                        disabled={!token}
                      >
                        {copySuccess ? 'Copied!' : 'Copy Token'}
                        <Copy className="ml-2 h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-4 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogoutClick}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="px-4 flex-shrink-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Authentication Required</CardTitle>
                      <CardDescription className="text-xs">
                        Log in to access your API tokens
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 