'use client'

import * as React from 'react'

// SidebarContext manages the sidebar state and navigation
type SidebarContextType = {
  sidebarOpen: boolean
  setSidebarOpen: (isOpen: boolean) => void
  activeTab: number
  setActiveTab: (tabIndex: number) => void
}

export const SidebarContext = React.createContext<SidebarContextType>({
  sidebarOpen: true,
  setSidebarOpen: () => {},
  activeTab: 0,
  setActiveTab: () => {},
})

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState(0)

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => React.useContext(SidebarContext)

// DeveloperContext manages authentication and token state
type DeveloperContextType = {
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
  token: string | null
  setToken: (token: string | null) => void
  isAuthModalOpen: boolean
  setIsAuthModalOpen: (isOpen: boolean) => void
  loginLoading: boolean
  setLoginLoading: (isLoading: boolean) => void
  loginError: string | null
  setLoginError: (error: string | null) => void
  handleLogin: (email: string, password: string) => Promise<void>
  handleLogout: () => void
  copyToken: () => void
  copySuccess: boolean
}

export const DeveloperContext = React.createContext<DeveloperContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  token: null,
  setToken: () => {},
  isAuthModalOpen: false,
  setIsAuthModalOpen: () => {},
  loginLoading: false,
  setLoginLoading: () => {},
  loginError: null,
  setLoginError: () => {},
  handleLogin: async () => {},
  handleLogout: () => {},
  copyToken: () => {},
  copySuccess: false,
})

export const DeveloperProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [token, setToken] = React.useState<string | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false)
  const [loginLoading, setLoginLoading] = React.useState(false)
  const [loginError, setLoginError] = React.useState<string | null>(null)
  const [copySuccess, setCopySuccess] = React.useState(false)

  // Check for existing token on component mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('dev_portal_token')
      if (storedToken) {
        setToken(storedToken)
        setIsAuthenticated(true)
      }
    }
  }, [])

  // Handle login logic
  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true)
    setLoginError(null)
    
    try {
      // Real API call to authentication endpoint
      const response = await fetch('https://qapi.vparking.co/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }
      
      // Save the JWT token
      const accessToken = data.access_token
      setToken(accessToken)
      setIsAuthenticated(true)
      localStorage.setItem('dev_portal_token', accessToken)
      setIsAuthModalOpen(false)
      
      // Show success toast (will be implemented with Sonner)
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Authentication failed. Please check your credentials and try again.')
      
      // Show error toast (will be implemented with Sonner)
    } finally {
      setLoginLoading(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem('dev_portal_token')
  }

  // Copy token to clipboard
  const copyToken = () => {
    if (token && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(token)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  return (
    <DeveloperContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        token,
        setToken,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginLoading,
        setLoginLoading,
        loginError,
        setLoginError,
        handleLogin,
        handleLogout,
        copyToken,
        copySuccess,
      }}
    >
      {children}
    </DeveloperContext.Provider>
  )
}

export const useDeveloperContext = () => React.useContext(DeveloperContext) 