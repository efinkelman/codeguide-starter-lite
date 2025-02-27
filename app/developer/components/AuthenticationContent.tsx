'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SectionHeader } from './SectionHeader'
import { useDeveloperContext } from '../utils/context-providers'

export function AuthenticationContent() {
  const { isAuthenticated, setIsAuthModalOpen, token } = useDeveloperContext()

  const handleLogin = () => {
    setIsAuthModalOpen(true)
  }

  const curlCode = `curl -X 'POST' \\
  'https://qapi.vparking.co/auth/login' \\
  -H 'accept: */*' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "email": "your_email@example.com",
  "password": "your_password"
}'`

  const responseExample = `{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"}`

  return (
    <div className="space-y-8 pb-16">
      <SectionHeader
        title="Authentication"
        description="Learn how to authenticate API requests with Vanguard Parking"
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
          <CardTitle>API Authentication</CardTitle>
          <CardDescription>
            Generate an authentication token to access the API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Vanguard Parking API uses token-based authentication. You need to generate an API token
            which must be included in the Authorization header of each request using the Bearer scheme.
          </p>

          <div className="my-6 border-t"></div>

          <h3 className="text-lg font-medium">How to Generate a Token</h3>
          <p className="text-sm text-muted-foreground">
            To generate an authentication token, make a POST request to the login endpoint with your credentials:
          </p>

          <div className="rounded-md bg-black p-4 mt-4">
            <pre className="overflow-x-auto text-sm text-white">
              <code>{curlCode}</code>
            </pre>
          </div>

          <h3 className="text-lg font-medium mt-6">Response</h3>
          <p className="text-sm text-muted-foreground">
            Upon successful authentication, you will receive a response with your access token:
          </p>

          <div className="rounded-md bg-black p-4 mt-4">
            <pre className="overflow-x-auto text-sm text-white">
              <code>{responseExample}</code>
            </pre>
          </div>

          <div className="mt-6">
            <p className="text-sm">
              Include this token in the Authorization header for all subsequent API requests:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-2">
              <code className="text-sm">Authorization: Bearer {token || "YOUR_ACCESS_TOKEN"}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Handling</CardTitle>
          <CardDescription>
            Common authentication-related errors and how to resolve them
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-base font-medium">401 Unauthorized</h4>
              <p className="text-sm text-muted-foreground">
                This error occurs when the API token is missing, invalid, or expired.
                Make sure you are including the token correctly in the Authorization header.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-medium">403 Forbidden</h4>
              <p className="text-sm text-muted-foreground">
                This error occurs when the provided token does not have permission to access the requested resource.
                Check if your developer account has access to the API endpoint you&apos;re trying to use.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-medium">429 Too Many Requests</h4>
              <p className="text-sm text-muted-foreground">
                This error occurs when you&apos;ve exceeded the rate limit for API requests.
                Implement exponential backoff and retry logic in your application.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 