import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  SlidersHorizontal,
  Plus,
  Search,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  Home,
  FileText,
  Target,
  User,
} from "lucide-react"
import { type ExtratoViewProps } from "./useExtrato"
import { TransacaoRow } from "./TransacaoRow"
import { ModalFiltros } from "./ModalFiltros"
import { ModalNovaTransacao } from "@/Modal/ModalNovaTransacao"

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const TABS = [
  { label: "Tudo", value: "tudo" },
  { label: "Receitas", value: "RECEITA" },
  { label: "Despesas", value: "DESPESA" },
] as const

export function ExtratoMobile({ state, actions }: ExtratoViewProps) {
  const navigate = useNavigate()
  const {
    agrupadas,
    carregando,
    modalFiltroAberto,
    modalNovaTransacao,
    tabAtiva,
    filtrosAtivos,
    totalReceitas,
    totalDespesas,
    busca,
    buscaAberta,
  } = state

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f0] pb-24">
      {/* Header fixo */}
      <div className="bg-white px-5 pt-12 pb-0">
        {/* Linha título + ações */}
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/home")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Extrato</h1>
          <button
            onClick={() => {
              actions.setBuscaAberta(!buscaAberta)
              if (buscaAberta) actions.setBusca("")
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
          >
            {buscaAberta ? (
              <X size={18} className="text-gray-700" />
            ) : (
              <Search size={18} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Campo de busca expansível */}
        {buscaAberta && (
          <div className="mb-3 flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2.5">
            <Search size={15} className="shrink-0 text-gray-400" />
            <input
              autoFocus
              type="text"
              placeholder="Buscar por descrição ou categoria..."
              value={busca}
              onChange={(e) => actions.setBusca(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
            />
            {busca && (
              <button onClick={() => actions.setBusca("")}>
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => actions.setTabAtiva(tab.value)}
              className={`pb-3 text-sm font-semibold transition-colors ${
                tabAtiva === tab.value
                  ? "border-b-2 border-[#00D084] text-[#00D084]"
                  : "text-gray-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5">
        {/* Cards resumo */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-1.5 flex items-center gap-1.5">
              <ArrowUpRight size={13} className="text-[#00D084]" />
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Receitas
              </p>
            </div>
            <p className="text-base font-bold text-gray-900">
              {fmt(totalReceitas)}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-1.5 flex items-center gap-1.5">
              <ArrowDownLeft size={13} className="text-red-500" />
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Despesas
              </p>
            </div>
            <p className="text-base font-bold text-gray-900">
              {fmt(totalDespesas)}
            </p>
          </div>
        </div>

        {/* Botão filtros */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => actions.setModalFiltroAberto(true)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              filtrosAtivos
                ? "bg-[#00D084] text-white"
                : "bg-white text-gray-600 shadow-sm"
            }`}
          >
            <SlidersHorizontal size={13} />
            Filtros
            {filtrosAtivos && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[#00D084]">
                !
              </span>
            )}
          </button>
        </div>

        {/* Resultado da busca */}
        {busca && (
          <p className="mb-3 text-xs text-gray-400">
            {Object.values(agrupadas).flat().length} resultado(s) para "{busca}"
          </p>
        )}

        {/* Lista agrupada */}
        {carregando ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00D084] border-t-transparent" />
          </div>
        ) : Object.keys(agrupadas).length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Search size={32} className="mb-3 text-gray-200" />
            <p className="text-sm font-semibold text-gray-400">
              {busca
                ? `Nenhum resultado para "${busca}"`
                : "Nenhuma transação encontrada."}
            </p>
          </div>
        ) : (
          Object.entries(agrupadas).map(([data, lista]) => (
            <div key={data} className="mb-5">
              <p className="mb-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
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
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => actions.setModalNovaTransacao(true)}
        className="fixed right-1/2 bottom-20 flex h-14 w-14 translate-x-1/2 items-center justify-center rounded-full bg-[#00D084] shadow-lg shadow-[#00D084]/30 active:scale-95"
      >
        <Plus size={26} className="text-white" />
      </button>

      {/* Bottom nav */}
      <nav className="fixed right-0 bottom-0 left-0 flex items-center justify-around border-t border-gray-100 bg-white px-4 py-3">
        {[
          { icone: <Home size={22} />, label: "INÍCIO", path: "/home" },
          { icone: <FileText size={22} />, label: "EXTRATO", path: "/extrato" },
          { icone: <Target size={22} />, label: "METAS", path: "/metas" },
          { icone: <User size={22} />, label: "PERFIL", path: "/perfil" },
        ].map((item) => {
          const ativo = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 ${ativo ? "text-[#00D084]" : "text-gray-400"}`}
            >
              {item.icone}
              <span className="text-[10px] font-semibold tracking-wider">
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      {modalFiltroAberto && (
        <ModalFiltros state={state} actions={actions} variant="mobile" />
      )}

      <ModalNovaTransacao
        aberto={modalNovaTransacao}
        onFechar={() => actions.setModalNovaTransacao(false)}
        onSucesso={actions.carregarTransacoes}
      />
    </div>
  )
}
