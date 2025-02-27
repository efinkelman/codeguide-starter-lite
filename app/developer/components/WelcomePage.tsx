'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SectionHeader } from './SectionHeader'
import { useDeveloperContext, useSidebar } from '../utils/context-providers'
import { Lock, PanelLeft, Code, Webhook } from 'lucide-react'

export function WelcomePage() {
  const { isAuthenticated, setIsAuthModalOpen } = useDeveloperContext()
  const { setActiveTab } = useSidebar()

  const handleLogin = () => {
    setIsAuthModalOpen(true)
  }

  const featureCards = [
    {
      title: 'Authentication',
      description: 'Learn how to authenticate with our API and manage your tokens.',
      icon: <Lock className="h-10 w-10 text-primary" />,
      buttonText: 'View Docs',
      tabIndex: 1,
      disabled: false,
    },
    {
      title: 'Embedding',
      description: 'Embed Vanguard Parking dashboards in your own applications.',
      icon: <PanelLeft className="h-10 w-10 text-primary" />,
      buttonText: 'View Docs',
      tabIndex: 2,
      disabled: false,
    },
    {
      title: 'API Reference',
      description: 'Comprehensive API documentation with examples for all endpoints.',
      icon: <Code className="h-10 w-10 text-primary" />,
      buttonText: 'View Reference',
      tabIndex: 3,
      disabled: true,
    },
    {
      title: 'Webhooks',
      description: 'Set up webhooks to receive real-time updates from Vanguard Parking.',
      icon: <Webhook className="h-10 w-10 text-primary" />,
      buttonText: 'View Docs',
      tabIndex: 4,
      disabled: true,
    },
  ]

  return (
    <div className="space-y-8 pb-16">
      <SectionHeader
        title="Vanguard Parking Developer Portal"
        description="Tools and documentation to help you integrate with Vanguard Parking services"
        action={
          !isAuthenticated && (
            <Button onClick={handleLogin}>
              Log In
            </Button>
          )
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {featureCards.map((card) => (
          <Card key={card.title} className={card.disabled ? 'opacity-70' : ''}>
            <CardHeader className="space-y-1 pb-2">
              <div className="mb-2">{card.icon}</div>
              <CardTitle className="text-xl">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => !card.disabled && setActiveTab(card.tabIndex)}
                disabled={card.disabled}
              >
                {card.buttonText}
                {card.disabled && ' (Coming Soon)'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Follow these steps to integrate with Vanguard Parking services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              1
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-medium">Create a developer account</h4>
              <p className="text-sm text-muted-foreground">
                {isAuthenticated 
                  ? 'You are currently logged in and ready to use the API.'
                  : 'Log in with your Vanguard Parking credentials to access your API token.'}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              2
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-medium">Retrieve your API token</h4>
              <p className="text-sm text-muted-foreground">
                Your API token is displayed in the sidebar once you&apos;re logged in.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              3
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-medium">Integrate with our API</h4>
              <p className="text-sm text-muted-foreground">
                Use our documentation to integrate Vanguard Parking into your applications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 