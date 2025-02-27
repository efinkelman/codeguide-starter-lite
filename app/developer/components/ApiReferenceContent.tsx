import * as React from 'react'
import { SectionHeader } from './SectionHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function ApiReferenceContent() {
  return (
    <div className="space-y-8 pb-16">
      <SectionHeader
        title="API Reference"
        description="Comprehensive documentation for the Vanguard Parking API"
      />

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Coming Soon</AlertTitle>
        <AlertDescription>
          The API Reference documentation is currently under development and will be available soon.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>What to Expect</CardTitle>
          <CardDescription>
            Features planned for the API Reference documentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-medium">Comprehensive Endpoint Documentation</h3>
            <p className="text-sm text-muted-foreground">
              Detailed documentation for all API endpoints, including request parameters, response formats, and examples.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-medium">Interactive API Explorer</h3>
            <p className="text-sm text-muted-foreground">
              Try out API calls directly from the documentation with our interactive explorer.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-medium">Code Samples</h3>
            <p className="text-sm text-muted-foreground">
              Implementation examples in multiple programming languages for each endpoint.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-medium">Schema References</h3>
            <p className="text-sm text-muted-foreground">
              Detailed object schemas and data models used throughout the API.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 