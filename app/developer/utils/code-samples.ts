import { ApiEndpoint } from '../components/api-reference/types';

/**
 * Generate code samples for an API endpoint
 * @param endpoint The API endpoint to generate code samples for
 * @param apiToken Optional authentication token to include in the examples
 */
export function generateCodeSamples(endpoint: ApiEndpoint, apiToken?: string | null) {
  const baseUrl = 'https://api.vparking.co';
  const fullUrl = `${baseUrl}${endpoint.path}`;
  
  // Replace path parameters with placeholders
  const urlWithParams = endpoint.parameters
    .filter(param => param.in === 'path')
    .reduce((url, param) => {
      return url.replace(`{${param.name}}`, `YOUR_${param.name.toUpperCase()}`);
    }, fullUrl);
  
  // Create curl command
  const curlCommand = [
    'curl',
    `-X ${endpoint.method}`,
    `"${urlWithParams}"`,
    '-H "Content-Type: application/json"',
    apiToken 
      ? `-H "Authorization: Bearer ${apiToken.slice(0, 12)}...${apiToken.slice(-8)}"` 
      : '-H "Authorization: Bearer YOUR_API_TOKEN"',
  ];
  
  // Add request body if needed
  if (endpoint.requestBody) {
    curlCommand.push('-d \'{ "example": "data" }\'');
  }
  
  // Create JavaScript fetch example
  const fetchExample = `
const response = await fetch("${urlWithParams}", {
  method: "${endpoint.method}",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${apiToken 
      ? `${apiToken.slice(0, 12)}...${apiToken.slice(-8)}` 
      : 'YOUR_API_TOKEN'}"
  }${endpoint.requestBody ? `,
  body: JSON.stringify({
    // Request data
    "example": "data"
  })` : ''}
});

const data = await response.json();
console.log(data);`;

  // Python example with requests
  const pythonExample = `
import requests

url = "${urlWithParams}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${apiToken 
      ? `${apiToken.slice(0, 12)}...${apiToken.slice(-8)}` 
      : 'YOUR_API_TOKEN'}"
}
${endpoint.requestBody ? `
payload = {
    "example": "data"
}

response = requests.${endpoint.method.toLowerCase()}(url, json=payload, headers=headers)
` : `
response = requests.${endpoint.method.toLowerCase()}(url, headers=headers)
`}
print(response.json())`;

  return {
    curl: curlCommand.join(' '),
    javascript: fetchExample.trim(),
    python: pythonExample.trim()
  };
} 