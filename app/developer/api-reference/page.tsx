'use client'

import * as React from 'react'
import { ApiReferenceContent } from '../components/ApiReferenceContent'
import { isApiReferenceEnabled } from '../utils/feature-flags'

export default function ApiReferencePage() {
  const [apiReferenceEnabled, setApiReferenceEnabled] = React.useState(false)
  
  React.useEffect(() => {
    setApiReferenceEnabled(isApiReferenceEnabled())
  }, [])
  
  return (
    <>
      {apiReferenceEnabled ? (
        <ApiReferenceContent />
      ) : (
        <div className="rounded-md bg-yellow-50 p-4 my-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">API Reference is not available</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>The API Reference is currently disabled in production. It is only available in development environments.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 