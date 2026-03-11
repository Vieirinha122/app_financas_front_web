import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { LayoutProvider } from "@/context/LayoutContex"
import { useAuth } from "./lib/useAuth"
import { LoginScreen } from "./screens/Login/LoginScreen"
import { HomeScreen } from "./screens/Home/HomeScreen"
import { ExtratoScreen } from "./screens/Extrato/ExtratoScreen"
import { SplashScreen } from "@/components/SplashScrenn"
import { PerfilScreen } from "./screens/Perfil/PerfilScreen"
import { MetasScreen } from "./screens/Metas/MetaScreen"

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
      <Route
        path="/perfil"
        element={
          <RotaProtegida>
            <PerfilScreen />
          </RotaProtegida>
        }
      />
      <Route
        path="/metas"
        element={
          <RotaProtegida>
            <MetasScreen />
          </RotaProtegida>
        }
      />
    </Routes>
  )
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) return <SplashScreen />

  return (
    <LayoutProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LayoutProvider>
  )
}
