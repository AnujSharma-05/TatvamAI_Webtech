'use client'

import { ReactNode } from 'react'
import { UserProvider } from '@/context/UserContext'
import { LanguageProvider } from '@/context/LanguageContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </UserProvider>
  )
} 