export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

export interface ApiEndpoint {
  path: string
  method: HttpMethod
  operationId: string
  description: string
  parameters: ApiParameter[]
  requestBody?: ApiRequestBody
  responses: Record<string, ApiResponse>
  tag: string
}

export interface ApiParameter {
  name: string
  required: boolean
  in: 'path' | 'query' | 'header' | 'cookie'
  schema: {
    type: string
    format?: string
  }
  description?: string
}

export interface ApiRequestBody {
  description?: string
  required?: boolean
  schema: {
    $ref: string
  }
}

export interface ApiResponse {
  description?: string
  schema?: {
    $ref?: string
    items?: {
      $ref: string
    }
  }
}

export interface ApiData {
  apiTags: string[]
  methodColors: Record<HttpMethod, string>
  endpoints: ApiEndpoint[]
} 