import { useEffect, useState } from "react"
import { useAuth } from "@/lib/useAuth"
import { getDashboard, type DashboardData } from "@/service/DashboardService"

export function useHome() {
  const { user, token, signOut } = useAuth()
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [mostrarSaldo, setMostrarSaldo] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)

  async function carregarDashboard() {
    if (!token) return
    setCarregando(true)
    try {
      const data = await getDashboard(token)
      setDashboard(data)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDashboard()
  }, [token])

  return {
    state: { user, dashboard, carregando, mostrarSaldo, modalAberto },
    actions: {
      setMostrarSaldo,
      setModalAberto,
      carregarDashboard,
      signOut,
    },
  }
}

export type HomeViewProps = ReturnType<typeof useHome>