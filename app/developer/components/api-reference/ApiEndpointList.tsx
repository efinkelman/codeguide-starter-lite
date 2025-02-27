'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ApiEndpointDetails } from './ApiEndpointDetails'
import { cn } from '@/lib/utils'
import { ApiEndpoint, HttpMethod } from './types'

interface ApiEndpointListProps {
  endpoints: ApiEndpoint[]
  activeCategory: string
  methodColors: Record<HttpMethod, string>
  token: string | null
  isAuthenticated: boolean
}

export function ApiEndpointList({ 
  endpoints, 
  activeCategory, 
  methodColors,
  token,
  isAuthenticated
}: ApiEndpointListProps) {
  const [expandedEndpoints, setExpandedEndpoints] = React.useState<Record<string, boolean>>({})
  
  // Filter endpoints by the active category
  const filteredEndpoints = endpoints.filter(endpoint => endpoint.tag === activeCategory)
  
  const toggleEndpoint = (operationId: string) => {
    setExpandedEndpoints(prev => ({
      ...prev,
      [operationId]: !prev[operationId]
    }))
  }

  return (
    <Card className="flex-1">
      <CardHeader className="py-5">
        <CardTitle className="text-2xl font-bold">{activeCategory}</CardTitle>
        <CardDescription>
          Available API endpoints for the {activeCategory} resource
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {filteredEndpoints.length > 0 ? (
            filteredEndpoints.map(endpoint => (
              <div key={endpoint.operationId} className="border-b border-border last:border-0">
                <div className="px-6 py-4">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleEndpoint(endpoint.operationId)}
                  >
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "mr-3 py-1 px-2.5 font-mono text-xs",
                        methodColors[endpoint.method]
                      )}
                    >
                      {endpoint.method}
                    </Badge>
                    <div className="font-mono text-sm">{endpoint.path}</div>
                    <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                      {expandedEndpoints[endpoint.operationId] ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                  
                  {expandedEndpoints[endpoint.operationId] && (
                    <ApiEndpointDetails 
                      endpoint={endpoint}
                      token={token}
                      isAuthenticated={isAuthenticated}
                      methodColors={methodColors}
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-muted-foreground">No endpoints found for this resource.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 