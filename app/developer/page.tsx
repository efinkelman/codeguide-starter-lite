'use client'

import * as React from 'react'
import { WelcomePage } from './components/WelcomePage'
import { LoginDialog } from './components/LoginDialog'

export default function DeveloperPortalPage() {
  return (
    <>
      <WelcomePage />
      <LoginDialog />
    </>
  )
} 