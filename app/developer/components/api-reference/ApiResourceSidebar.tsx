'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronRight, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ApiResourceSidebarProps {
  categories: string[]
  activeCategory: string
  setActiveCategory: (category: string) => void
}

export function ApiResourceSidebar({ 
  categories, 
  activeCategory, 
  setActiveCategory 
}: ApiResourceSidebarProps) {
  return (
    <Card className="lg:w-64 shrink-0 h-[calc(100vh-14rem)] sticky top-24">
      <CardHeader className="py-4 px-4">
        <CardTitle className="text-lg flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          API Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-18rem)]">
          <div className="px-2 py-1">
            {categories.map(category => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-sm py-2.5 px-3 h-auto mb-1 rounded-md",
                  activeCategory === category ? 
                    "bg-primary/10 text-primary font-medium" : 
                    "font-normal text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveCategory(category)}
              >
                <span className="truncate">{category}</span>
                {activeCategory === category && <ChevronRight className="h-4 w-4 ml-auto opacity-70" />}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 