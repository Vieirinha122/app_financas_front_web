import { createContext, useState } from "react"

interface User {
  id: string
  nome: string
  email: string
}

interface AuthContextData {
  user: User | null
  token: string | null
  signIn: (token: string, user: User) => void
  signOut: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // inicializa já lendo o localStorage — sem useEffect, sem cascading renders
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("@financas:token")
  )
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("@financas:user")
    return stored ? JSON.parse(stored) : null
  })

  function signIn(newToken: string, newUser: User) {
    localStorage.setItem("@financas:token", newToken)
    localStorage.setItem("@financas:user", JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  function signOut() {
    localStorage.removeItem("@financas:token")
    localStorage.removeItem("@financas:user")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
