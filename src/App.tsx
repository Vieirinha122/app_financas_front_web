import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { useAuth } from "./lib/useAuth"
import { LoginScreen } from "./screens/LoginScreen"
import { HomeScreen } from "./screens/HomeScreen"
import { ExtratoScreen } from "./screens/ExtratoScreen"
import { SplashScreen } from "./components/SplashScrenn"

function RotaProtegida({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  return token ? <>{children}</> : <Navigate to="/" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route
        path="/home"
        element={
          <RotaProtegida>
            <HomeScreen />
          </RotaProtegida>
        }
      />
      <Route
        path="/extrato"
        element={
          <RotaProtegida>
            <ExtratoScreen />
          </RotaProtegida>
        }
      />
    </Routes>
  )
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // splash dura 2.2s — tempo suficiente para a animação completar
    const timer = setTimeout(() => setShowSplash(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) return <SplashScreen />

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
