'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeBlock } from '@/components/ui/code-block'
import { generateCodeSamples } from '../../utils/code-samples'
import { RefreshCw } from 'lucide-react'
import { ApiEndpoint, HttpMethod } from './types'

interface ApiEndpointDetailsProps {
  endpoint: ApiEndpoint
  token: string | null
  isAuthenticated: boolean
  methodColors: Record<HttpMethod, string>
}

export function ApiEndpointDetails({ 
  endpoint, 
  token, 
  isAuthenticated,
  methodColors 
}: ApiEndpointDetailsProps) {
  const [codeLanguage, setCodeLanguage] = React.useState<'curl' | 'javascript' | 'python'>('curl')
  
  return (
    <div className="mt-4 space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium text-base">Description</h3>
        <p className="text-sm text-muted-foreground">
          {endpoint.description || endpoint.operationId}
        </p>
      </div>
      
      {endpoint.parameters.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-base">Path Parameters</h3>
          <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
            {endpoint.parameters.filter(p => p.in === 'path').map(param => (
              <div key={param.name} className="flex items-center">
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded mr-2">{param.name}</span>
                <span className="text-sm text-muted-foreground">{param.schema.type}</span>
                {param.required && (
                  <Badge variant="outline" className="ml-2 text-[10px] bg-red-600/10 text-red-600 border-red-600/20">
                    Required
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {endpoint.requestBody && (
        <div className="space-y-2">
          <h3 className="font-medium text-base">Request Body</h3>
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="text-sm text-muted-foreground flex items-center">
              Required schema: 
              <code className="font-mono text-xs bg-muted px-2 py-1 rounded ml-2">
                {endpoint.requestBody.schema.$ref.split('/').pop()}
              </code>
            </div>
          </div>
        </div>
      )}
      
      {endpoint.responses && (
        <div className="space-y-2">
          <h3 className="font-medium text-base">Responses</h3>
          <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
            {Object.entries(endpoint.responses).map(([code, response]) => (
              <div key={code} className="flex items-center">
                <Badge className="mr-2 bg-blue-600/10 text-blue-600 border-blue-600/20">
                  {code}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {response.description || 
                    (response.schema?.$ref ? 
                      `Returns ${response.schema.$ref.split('/').pop()}` : 
                      'Success')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="font-medium text-base">Code Examples</h3>
        <Tabs defaultValue="curl" className="w-full" onValueChange={(value) => setCodeLanguage(value as any)}>
          <TabsList className="bg-secondary/50 border border-border">
            <TabsTrigger value="curl" className="text-xs data-[state=active]:bg-background">
              cURL
            </TabsTrigger>
            <TabsTrigger value="javascript" className="text-xs data-[state=active]:bg-background">
              JavaScript
            </TabsTrigger>
            <TabsTrigger value="python" className="text-xs data-[state=active]:bg-background">
              Python
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-2 rounded-md overflow-hidden border border-border">
            <CodeBlock 
              code={generateCodeSamples(endpoint, token)[codeLanguage]}
              language={codeLanguage === 'curl' ? 'bash' : codeLanguage}
              wrapLongLines={true}
            />
          </div>
          
          {!isAuthenticated && (
            <div className="mt-2 text-sm text-muted-foreground flex items-center">
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              <span>Log in to include your API token in the examples</span>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  )
} 