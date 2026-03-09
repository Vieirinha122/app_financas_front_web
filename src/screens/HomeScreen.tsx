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

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

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

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    )
  }

  if (!dashboard) return null

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* Container: estreito no mobile → largo no desktop */}
      <div className="mx-auto max-w-sm px-4 py-6 sm:max-w-xl md:max-w-3xl lg:max-w-6xl lg:px-8 xl:max-w-7xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700 sm:h-12 sm:w-12 sm:text-base">
              {user?.nome
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <p className="text-sm text-gray-500 sm:text-base">
                Bem-vindo de volta,
              </p>
              <p className="text-lg font-bold text-gray-900 sm:text-xl">
                Olá, {user?.nome.split(" ")[0]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-gray-100 p-3 transition-colors hover:bg-gray-200">
              <Bell size={20} className="text-gray-700" />
            </button>
            <button
              onClick={() => {
                signOut()
                navigate("/")
              }}
              className="rounded-full bg-gray-100 p-3 transition-colors hover:bg-gray-200"
            >
              <LogOut size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Layout: coluna única até md, duas colunas no lg */}
        <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-6 xl:grid-cols-[1fr_440px]">
          {/* ── Coluna esquerda ── */}
          <div className="flex flex-col gap-5">
            <SaldoCard
              saldoTotal={dashboard.resumo.saldoTotal}
              percentualVariacao={dashboard.resumo.mes.percentualVariacao}
            />

            {/* Cards resumo — 2 colunas sempre, crescem no sm */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
                <p className="text-xs text-gray-500 sm:text-sm">
                  Receitas do mês
                </p>
                <p className="mt-1 text-base font-bold text-green-600 sm:text-lg">
                  {fmt(dashboard.resumo.mes.receitas)}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
                <p className="text-xs text-gray-500 sm:text-sm">
                  Despesas do mês
                </p>
                <p className="mt-1 text-base font-bold text-red-500 sm:text-lg">
                  {fmt(dashboard.resumo.mes.despesas)}
                </p>
              </div>
            </div>

            <AcoesRapidas
              onNovaTransacao={() => setModalAberto(true)}
              onMetas={() => {}}
              onRelatorios={() => {}}
            />

            <GraficoGastos
              dias={dashboard.grafico.dias}
              totalPeriodo={dashboard.grafico.totalPeriodo}
            />
          </div>

          {/* ── Coluna direita: transações recentes ── */}
          {/* mt-5 no mobile (coluna única), sem margin no lg (grid) */}
          <div className="mt-5 lg:mt-0">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Transações Recentes
              </h2>
              <span
                onClick={() => navigate("/extrato")}
                className="cursor-pointer text-sm font-medium text-green-600 hover:underline sm:text-base"
              >
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
      </div>

      <ModalNovaTransacao
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSucesso={carregarDashboard}
      />
    </div>
  )
}
