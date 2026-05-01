import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, clearAuthToken, setAuthToken } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api('/api/auth/me')
        if (!cancelled) setUser(data.user)
      } catch {
        if (!cancelled) {
          clearAuthToken()
          setUser(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      async login(username, password) {
        const data = await api('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        })
        setAuthToken(data.token)
        setUser(data.user)
        return data.user
      },
      async signup(username, password) {
        const data = await api('/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        })
        setAuthToken(data.token)
        setUser(data.user)
        return data.user
      },
      logout() {
        clearAuthToken()
        setUser(null)
      },
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
