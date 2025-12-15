import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

interface User {
  _id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (data: any) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (data: any) => {
    const res = await api.post('/auth/login', data)
    setUser(res.data.user)
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) as AuthContextType
