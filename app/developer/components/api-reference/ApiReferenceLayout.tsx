'use client'

import * as React from 'react'
import { SectionHeader } from '../SectionHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useDeveloperContext } from '../../utils/context-providers'
import { ApiResourceSidebar } from './ApiResourceSidebar'
import { ApiEndpointList } from './ApiEndpointList'
import { ApiData } from './types'

// Import the API data
import apiData from '../../data/api-endpoints.json'

export function ApiReferenceLayout() {
  const { isAuthenticated, token, setIsAuthModalOpen } = useDeveloperContext()
  const [activeCategory, setActiveCategory] = React.useState(apiData.apiTags[0])
  
  const handleLogin = () => {
    setIsAuthModalOpen(true)
  }

  // We need to use this assertion since JSON imports don't have type information
  const typedApiData = apiData as unknown as ApiData

  return (
    <div className="space-y-8 pb-16">
      <SectionHeader
        title="API Reference"
        description="Comprehensive documentation for the Vanguard Parking API"
        action={
          !isAuthenticated && (
            <Button onClick={handleLogin}>
              Log In for API Token
            </Button>
          )
        }
      />
      
      {isAuthenticated && (
        <Card className="border-green-600/20 bg-green-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-600/10 text-green-600 border-green-600/20">
                Authenticated
              </Badge>
              <span className="text-sm">Your API requests will include your authentication token</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(token || '')
                toast.success('API token copied to clipboard')
              }}
              className="flex items-center space-x-1"
            >
              <Copy className="h-3.5 w-3.5 mr-1" />
              <span>Copy Token</span>
            </Button>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8">
        <ApiResourceSidebar 
          categories={typedApiData.apiTags}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        
        <ApiEndpointList 
          endpoints={typedApiData.endpoints}
          activeCategory={activeCategory}
          methodColors={typedApiData.methodColors}
          token={token}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  )
} 