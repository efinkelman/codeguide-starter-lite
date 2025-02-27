/**
 * Utility functions for feature flags
 */

/**
 * Checks if the API Reference feature should be enabled
 * It will be enabled if:
 * 1. Running on localhost/127.0.0.1
 * 2. Explicitly enabled via the NEXT_PUBLIC_ENABLE_API_REFERENCE environment variable
 */
export function isApiReferenceEnabled(): boolean {
  if (typeof window === 'undefined') {
    // During server-side rendering, rely only on environment variable
    return process.env.NEXT_PUBLIC_ENABLE_API_REFERENCE === 'true'
  }
  
  // On client-side, check hostname or environment variable
  const isLocalhost = 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
  const isEnabledByEnv = process.env.NEXT_PUBLIC_ENABLE_API_REFERENCE === 'true'
  
  return isLocalhost || isEnabledByEnv
} 