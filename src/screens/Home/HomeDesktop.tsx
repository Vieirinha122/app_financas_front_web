import { useNavigate } from "react-router-dom"
import {
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Plus,
  Target,
  BarChart2,
  FileText,
  ShoppingCart,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts"
import { DesktopLayout } from "@/layout/DesktopLayout"
import { ModalNovaTransacao } from "@/Modal/ModalNovaTransacao"
import { type HomeViewProps } from "./useHome"

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

// Tooltip customizado do gráfico
function TooltipCustom({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: { data: string }; value: number }[]
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-semibold">{payload[0].payload.data}</p>
      <p className="text-[#00D084]">{fmt(payload[0].value)}</p>
    </div>
  )
}

// Ações rápidas do grid 2x2
const ACOES = [
  {
    icone: <Target size={22} className="text-[#00D084]" />,
    label: "Metas",
    path: "/metas",
  },
  {
    icone: <BarChart2 size={22} className="text-[#00D084]" />,
    label: "Relatórios",
    path: "/relatorios",
  },
  {
    icone: <FileText size={22} className="text-[#00D084]" />,
    label: "Extrato",
    path: "/extrato",
  },
]

export function HomeDesktop({ state, actions }: HomeViewProps) {
  const navigate = useNavigate()
  const { user, dashboard, carregando, mostrarSaldo, modalAberto } = state

  if (carregando) {
    return (
      <DesktopLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00D084] border-t-transparent" />
        </div>
      </DesktopLayout>
    )
  }

  if (!dashboard) return null

  const maiorValor = Math.max(...dashboard.grafico.dias.map((d) => d.total))

  return (
    <DesktopLayout>
      {/* Saudação */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {user?.nome.split(" ")[0]}
        </h1>
        <p className="mt-1 text-gray-500">
          Bom ver você de novo! Aqui está o resumo das suas finanças.
        </p>
      </div>

      {/* Grid principal: saldo+ações | gráfico+transações */}
      <div className="grid grid-cols-[1fr_320px] gap-5 xl:grid-cols-[1fr_360px]">
        {/* ── Coluna esquerda ── */}
        <div className="flex flex-col gap-5">
          {/* Card de saldo escuro + grid de ações */}
          <div className="grid grid-cols-[1fr_280px] gap-5">
            {/* Card saldo */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-7">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Saldo Total
                </span>
                <button
                  onClick={() => actions.setMostrarSaldo(!mostrarSaldo)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  {mostrarSaldo ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <p className="mb-6 text-4xl font-bold text-white xl:text-5xl">
                {mostrarSaldo ? fmt(dashboard.resumo.saldoTotal) : "R$ ••••••"}
              </p>

              {/* Badge variação */}
              <div className="mb-6 flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                  {dashboard.resumo.mes.percentualVariacao >= 0 ? (
                    <TrendingUp size={12} className="text-[#00D084]" />
                  ) : (
                    <TrendingDown size={12} className="text-red-400" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      dashboard.resumo.mes.percentualVariacao >= 0
                        ? "text-[#00D084]"
                        : "text-red-400"
                    }`}
                  >
                    {dashboard.resumo.mes.percentualVariacao >= 0 ? "+" : ""}
                    {dashboard.resumo.mes.percentualVariacao}% este mês
                  </span>
                </div>
              </div>

              {/* Botão Nova Transação */}
              <button
                onClick={() => actions.setModalAberto(true)}
                className="flex items-center gap-2 rounded-2xl bg-[#00D084] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#00B875]"
              >
                <Plus size={18} />
                Nova Transação
              </button>
            </div>

            {/* Grid 2x2 de ações rápidas */}
            <div className="grid grid-cols-2 gap-3">
              {ACOES.map((acao) => (
                <button
                  key={acao.label}
                  onClick={() => navigate(acao.path)}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6faf3]">
                    {acao.icone}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {acao.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards receitas e despesas do mês */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50">
                <ArrowDownLeft size={22} className="text-[#00D084]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Receitas do mês</p>
                <p className="text-xl font-bold text-[#00D084]">
                  {fmt(dashboard.resumo.mes.receitas)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50">
                <ArrowUpRight size={22} className="text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Despesas do mês</p>
                <p className="text-xl font-bold text-red-500">
                  {fmt(dashboard.resumo.mes.despesas)}
                </p>
              </div>
            </div>
          </div>

          {/* Gráfico de gastos */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Gastos (7 dias)
              </h2>
              <span className="text-sm font-semibold text-[#00D084]">
                {fmt(dashboard.grafico.totalPeriodo)} total
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={dashboard.grafico.dias}
                barSize={32}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="dia"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
                <Tooltip
                  content={<TooltipCustom />}
                  cursor={{ fill: "transparent" }}
                />
                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                  {dashboard.grafico.dias.map((d, i) => (
                    <Cell
                      key={i}
                      fill={
                        d.total === maiorValor && maiorValor > 0
                          ? "#00D084"
                          : "#d1fae5"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Coluna direita: transações recentes ── */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Transações Recentes
            </h2>
            <span
              onClick={() => navigate("/extrato")}
              className="cursor-pointer text-sm font-semibold text-[#00D084] hover:underline"
            >
              Ver tudo
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {dashboard.ultimasTransacoes.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">
                Nenhuma transação ainda.
              </p>
            ) : (
              dashboard.ultimasTransacoes.map((t) => (
                <div
                  key={t.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-gray-50"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      t.tipo === "RECEITA" ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <ShoppingCart
                      size={16}
                      className={
                        t.tipo === "RECEITA" ? "text-[#00D084]" : "text-red-400"
                      }
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {t.descricao}
                    </p>
                    <p className="text-xs text-gray-400">{t.data}</p>
                  </div>
                  <span
                    className={`shrink-0 text-sm font-bold ${
                      t.tipo === "RECEITA" ? "text-[#00D084]" : "text-red-500"
                    }`}
                  >
                    {t.tipo === "RECEITA" ? "+" : "-"} {fmt(Math.abs(t.valor))}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ModalNovaTransacao
        aberto={modalAberto}
        onFechar={() => actions.setModalAberto(false)}
        onSucesso={actions.carregarDashboard}
      />
    </DesktopLayout>
  )
}
