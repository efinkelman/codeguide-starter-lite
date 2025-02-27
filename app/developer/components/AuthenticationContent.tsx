'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionHeader } from './SectionHeader'
import { useDeveloperContext } from '../utils/context-providers'

export function AuthenticationContent() {
  const { isAuthenticated, setIsAuthModalOpen, token } = useDeveloperContext()
  const [activeCodeTab, setActiveCodeTab] = React.useState('curl')

  const handleLogin = () => {
    setIsAuthModalOpen(true)
  }

  const curlCode = `curl -X POST https://api.vparking.co/v1/resource \\
  -H "Authorization: Bearer ${token || 'YOUR_API_TOKEN'}" \\
  -H "Content-Type: application/json" \\
  -d '{"param1": "value1", "param2": "value2"}'`

  const nodeCode = `const axios = require('axios');

const apiToken = '${token || 'YOUR_API_TOKEN'}';

async function makeApiRequest() {
  try {
    const response = await axios.get('https://api.vparking.co/v1/resource', {
      headers: {
        'Authorization': \`Bearer \${apiToken}\`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(response.data);
  } catch (error) {
    console.error('API request failed:', error);
  }
}

makeApiRequest();`

  const pythonCode = `import requests

api_token = '${token || 'YOUR_API_TOKEN'}'

def make_api_request():
    headers = {
        'Authorization': f'Bearer {api_token}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(
        'https://api.vparking.co/v1/resource',
        headers=headers
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return None

data = make_api_request()
print(data)`

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
            All API requests must include a Bearer token for authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Vanguard Parking API uses token-based authentication. You need to include your API token in the
            Authorization header of each request using the Bearer scheme.
          </p>

          <div className="rounded-md bg-muted p-4">
            <p className="text-sm font-medium">Example Request Header:</p>
            <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-2">
              <code className="text-sm">Authorization: Bearer {token || 'YOUR_API_TOKEN'}</code>
            </pre>
          </div>

          <div className="my-6 border-t"></div>

          <h3 className="text-lg font-medium">Code Examples</h3>
          <p className="text-sm text-muted-foreground">
            Here are examples of how to authenticate API requests in different programming languages:
          </p>

          <Tabs value={activeCodeTab} onValueChange={setActiveCodeTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="nodejs">Node.js</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
            <TabsContent value="curl">
              <div className="rounded-md bg-black p-4">
                <pre className="overflow-x-auto text-sm text-white">
                  <code>{curlCode}</code>
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="nodejs">
              <div className="rounded-md bg-black p-4">
                <pre className="overflow-x-auto text-sm text-white">
                  <code>{nodeCode}</code>
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="python">
              <div className="rounded-md bg-black p-4">
                <pre className="overflow-x-auto text-sm text-white">
                  <code>{pythonCode}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
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
                Check if your developer account has access to the API endpoint you're trying to use.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-medium">429 Too Many Requests</h4>
              <p className="text-sm text-muted-foreground">
                This error occurs when you've exceeded the rate limit for API requests.
                Implement exponential backoff and retry logic in your application.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 