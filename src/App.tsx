import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import { useAuth } from "@/lib/useAuth"
import { LoginScreen } from "@/screens/LoginScreen"
import { HomeScreen } from "@/screens/HomeScreen"

// Rota protegida — redireciona pro login se não estiver autenticado
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
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
