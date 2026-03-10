import { useNavigate } from "react-router-dom"
import {
  Eye,
  EyeOff,
  Bell,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingCart,
  Plus,
  Home,
  FileText,
  Target,
  User,
  BarChart2,
  Folder,
} from "lucide-react"
import { type HomeViewProps } from "./useHome"
import { ModalNovaTransacao } from "@/Modal/ModalNovaTransacao"

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const ACOES = [
  { icone: <FileText size={24} />, label: "Extrato", path: "/extrato" },
  { icone: <Folder size={24} />, label: "Categoria", path: "/categorias" },
  { icone: <Target size={24} />, label: "Metas", path: "/metas" },
  { icone: <BarChart2 size={24} />, label: "Relatórios", path: "/relatorios" },
]

export function HomeMobile({ state, actions }: HomeViewProps) {
  const navigate = useNavigate()
  const { user, dashboard, carregando, mostrarSaldo, modalAberto } = state

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00D084] border-t-transparent" />
      </div>
    )
  }

  if (!dashboard) return null

  return (
    <div className="flex min-h-screen flex-col bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Olá, {user?.nome.split(" ")[0]}
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Bem-vindo</h1>
          </div>
          <button className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#00D084] ring-2 ring-white" />
          </button>
        </div>
      </div>

      {/* Card de saldo escuro */}
      <div className="mx-6 mb-6 rounded-3xl bg-[#0F172A] p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-400">Saldo Total</span>
          <button
            onClick={() => actions.setMostrarSaldo(!mostrarSaldo)}
            className="text-gray-400"
          >
            {mostrarSaldo ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        <p className="mb-5 text-4xl font-bold text-white">
          <span className="mr-1 text-2xl font-semibold text-[#00D084]">R$</span>
          {mostrarSaldo
            ? dashboard.resumo.saldoTotal.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })
            : "••••••"}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00D084]">
              <ArrowDownLeft size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                Entradas
              </p>
              <p className="text-sm font-bold text-white">
                {fmt(dashboard.resumo.mes.receitas)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
              <ArrowUpRight size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                Saídas
              </p>
              <p className="text-sm font-bold text-white">
                {fmt(dashboard.resumo.mes.despesas)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="mb-6 px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Ações Rápidas</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {ACOES.map((acao) => (
            <button
              key={acao.label}
              onClick={() => navigate(acao.path)}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6faf3] text-[#00D084]">
                {acao.icone}
              </div>
              <span className="text-center text-xs leading-tight whitespace-pre-line text-gray-600">
                {acao.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Metas — estado vazio (back ainda não implementado) */}
      <div className="mx-6 mb-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <Target size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-500">
            Nenhuma meta criada ainda
          </p>
          <p className="text-xs text-gray-400">
            Crie sua primeira meta e acompanhe seu progresso
          </p>
          <button
            onClick={() => navigate("/metas")}
            className="mt-1 rounded-xl bg-[#e6faf3] px-4 py-2 text-xs font-bold text-[#00D084]"
          >
            Criar meta
          </button>
        </div>
      </div>

      {/* Últimas Transações */}
      <div className="px-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Últimas Transações
        </h2>
        <div className="flex flex-col gap-1">
          {dashboard.ultimasTransacoes.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-xl px-1 py-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-100">
                <ShoppingCart size={18} className="text-gray-500" />
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
          ))}
        </div>
      </div>

      {/* FAB — botão flutuante nova transação */}
      <button
        onClick={() => actions.setModalAberto(true)}
        className="fixed right-6 bottom-24 flex h-14 w-14 items-center justify-center rounded-full bg-[#00D084] shadow-lg shadow-[#00D084]/30 transition-transform active:scale-95"
      >
        <Plus size={28} className="text-white" />
      </button>

      {/* Bottom navigation */}
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
              className={`flex flex-col items-center gap-1 ${
                ativo ? "text-[#00D084]" : "text-gray-400"
              }`}
            >
              {item.icone}
              <span className="text-[10px] font-semibold tracking-wider">
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      <ModalNovaTransacao
        aberto={modalAberto}
        onFechar={() => actions.setModalAberto(false)}
        onSucesso={actions.carregarDashboard}
      />
    </div>
  )
}
