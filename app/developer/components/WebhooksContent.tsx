import * as React from 'react'
import { SectionHeader } from './SectionHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function WebhooksContent() {
  return (
    <div className="space-y-8 pb-16">
      <SectionHeader
        title="Webhooks"
        description="Receive real-time notifications for events in your Vanguard Parking account"
      />

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Coming Soon</AlertTitle>
        <AlertDescription>
          Webhook functionality is currently under development and will be available soon.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>What to Expect</CardTitle>
          <CardDescription>
            Features planned for the webhook integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-medium">Real-time Event Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Receive instant notifications for events such as parking session start/end, payment events, and more.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-medium">Webhook Management Console</h3>
            <p className="text-sm text-muted-foreground">
              A dashboard to create, manage, and test your webhook endpoints.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-medium">Event Filtering</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to specific events to only receive the notifications you need.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-medium">Security Features</h3>
            <p className="text-sm text-muted-foreground">
              Webhook signatures and endpoint verification to ensure secure data delivery.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 