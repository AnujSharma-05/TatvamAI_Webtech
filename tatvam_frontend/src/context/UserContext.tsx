'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type User = {
  id: string
  name: string
  email: string
  phone: string
  city: string
  motherTongue: string
  knownLanguages: string[]
  tokens: number
  contributedHours: number
} | null

type UserContextType = {
  user: User
  setUser: (user: User) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 