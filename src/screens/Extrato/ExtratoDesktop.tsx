import {
  SlidersHorizontal,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"
import { DesktopLayout } from "@/layout/DesktopLayout"
import { type ExtratoViewProps } from "./useExtrato"
import { TransacaoRow } from "./TransacaoRow"
import { ModalFiltros } from "./ModalFiltros"
import { ModalNovaTransacao } from "@/Modal/ModalNovaTransacao"

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const TABS = [
  { label: "Tudo", value: "tudo" },
  { label: "Entradas", value: "RECEITA" },
  { label: "Saídas", value: "DESPESA" },
] as const

export function ExtratoDesktop({ state, actions }: ExtratoViewProps) {
  const {
    agrupadas,
    carregando,
    modalFiltroAberto,
    modalNovaTransacao,
    tabAtiva,
    filtrosAtivos,
    totalReceitas,
    totalDespesas,
  } = state

  return (
    <DesktopLayout>
      {/* Cabeçalho da página */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Extrato</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => actions.setModalFiltroAberto(true)}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
              filtrosAtivos
                ? "border-[#00D084] bg-[#e6faf3] text-[#00D084]"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filtros
          </button>
          <button
            onClick={() => actions.setModalNovaTransacao(true)}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#00D084] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#00B875]"
          >
            <Plus size={16} />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Cards receitas / despesas */}
      <div className="mb-6 grid grid-cols-2 gap-5">
        {/* Receitas */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
              <ArrowUpRight size={16} className="text-[#00D084]" />
            </div>
            <span className="text-sm font-medium text-gray-500">Receitas</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">
              {fmt(totalReceitas)}
            </p>
            <span className="text-sm font-semibold text-[#00D084]">+12%</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-3/5 rounded-full bg-[#00D084]" />
          </div>
        </div>

        {/* Despesas */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50">
              <ArrowDownLeft size={16} className="text-red-500" />
            </div>
            <span className="text-sm font-medium text-gray-500">Despesas</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">
              {fmt(totalDespesas)}
            </p>
            <span className="text-sm font-semibold text-red-400">-5%</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-2/5 rounded-full bg-red-400" />
          </div>
        </div>
      </div>

      {/* Tabs Tudo / Entradas / Saídas */}
      <div className="mb-5 flex gap-6 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => actions.setTabAtiva(tab.value)}
            className={`cursor-pointer pb-3 text-sm font-semibold transition-colors ${
              tabAtiva === tab.value
                ? "border-b-2 border-[#00D084] text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista agrupada */}
      {carregando ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00D084] border-t-transparent" />
        </div>
      ) : Object.keys(agrupadas).length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">
          Nenhuma transação encontrada.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(agrupadas).map(([data, lista]) => (
            <div key={data}>
              <p className="mb-3 text-xs font-bold tracking-widest text-gray-400 uppercase">
                {data}
              </p>
              <div className="flex flex-col gap-2">
                {lista.map((t) => (
                  <TransacaoRow
                    key={t.id}
                    descricao={t.descricao}
                    categoria={t.categoria}
                    data={t.data}
                    valor={t.valor}
                    tipo={t.tipo}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalFiltroAberto && (
        <ModalFiltros state={state} actions={actions} variant="desktop" />
      )}

      <ModalNovaTransacao
        aberto={modalNovaTransacao}
        onFechar={() => actions.setModalNovaTransacao(false)}
        onSucesso={actions.carregarTransacoes}
      />
    </DesktopLayout>
  )
}
