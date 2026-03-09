import { useEffect, useState } from "react"
import { Bell, LogOut } from "lucide-react"
import { useAuth } from "../lib/useAuth"
import { getDashboard, type DashboardData } from "@/service/DashboardService"
import { SaldoCard } from "@/components/SaldoCard"
import { AcoesRapidas } from "@/components/AcoesRapidas"
import { GraficoGastos } from "@/components/GraficosGastos"
import { TransacaoItem } from "@/components/TransacaoItem"
import { ModalNovaTransacao } from "@/Modal/ModalNovaTransacao"
import { useNavigate } from "react-router-dom"

export function HomeScreen() {
  const { user, token, signOut } = useAuth()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [carregando, setCarregando] = useState(true)
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

  function handleLogout() {
    signOut()
    navigate("/")
  }

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    )
  }

  if (!dashboard) return null

  return (
    // max-w-sm centraliza em desktop mantendo visual mobile
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="mx-auto flex max-w-sm flex-col gap-5 px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
              {user?.nome
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <p className="text-sm text-gray-500">Bem-vindo de volta,</p>
              <p className="text-lg font-bold text-gray-900">
                Olá, {user?.nome.split(" ")[0]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-gray-100 p-3 transition-colors hover:bg-gray-200">
              <Bell size={20} className="text-gray-700" />
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full bg-gray-100 p-3 transition-colors hover:bg-gray-200"
            >
              <LogOut size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Saldo */}
        <SaldoCard
          saldoTotal={dashboard.resumo.saldoTotal}
          percentualVariacao={dashboard.resumo.mes.percentualVariacao}
        />

        {/* Ações rápidas */}
        <AcoesRapidas
          onNovaTransacao={() => setModalAberto(true)}
          onMetas={() => {}}
          onRelatorios={() => {}}
        />

        {/* Gráfico */}
        <GraficoGastos
          dias={dashboard.grafico.dias}
          totalPeriodo={dashboard.grafico.totalPeriodo}
        />

        {/* Transações recentes */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Transações Recentes
            </h2>
            <span className="cursor-pointer text-sm font-medium text-green-600 hover:underline">
              Ver tudo
            </span>
          </div>
          <div className="rounded-3xl bg-white px-4 py-2 shadow-sm">
            {dashboard.ultimasTransacoes.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                Nenhuma transação ainda.
              </p>
            ) : (
              dashboard.ultimasTransacoes.map((t) => (
                <TransacaoItem
                  key={t.id}
                  descricao={t.descricao}
                  data={t.data}
                  valor={t.valor}
                  tipo={t.tipo}
                  categoria={t.categoria}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de nova transação */}
      <ModalNovaTransacao
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSucesso={carregarDashboard}
      />
    </div>
  )
}
