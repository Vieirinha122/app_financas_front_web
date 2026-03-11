import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Target, Home, FileText, User } from "lucide-react"
import { type MetasViewProps } from "./useMeta"
import { MetaCard } from "./MetaCard"
import { ModalCriarMeta } from "./ModalCriarMeta"
import { ModalAporte } from "./ModalAporte"
import { ModalDetalhe } from "./ModalDetalhe"

export function MetasMobile({ state, actions }: MetasViewProps) {
  const navigate = useNavigate()
  const {
    metasAtivas,
    metasConcluidas,
    metasCanceladas,
    carregando,
    modalCriarAberto,
    modalAporteAberto,
    modalDetalheAberto,
  } = state

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f2f0]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00D084] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f0] pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/home")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
            >
              <ArrowLeft size={18} className="text-gray-700" />
            </button>
            <h1 className="text-base font-bold text-gray-900">Metas</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5">
        {/* Estado vazio */}
        {metasAtivas.length === 0 && metasConcluidas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Target size={28} className="text-gray-300" />
            </div>
            <p className="text-base font-bold text-gray-700">
              Nenhuma meta criada
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Crie sua primeira meta financeira
            </p>
            <button
              onClick={actions.abrirModalCriar}
              className="mt-5 flex items-center gap-2 rounded-2xl bg-[#00D084] px-5 py-3 text-sm font-bold text-white"
            >
              <Plus size={16} /> Criar meta
            </button>
          </div>
        )}

        {/* Metas ativas */}
        {metasAtivas.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              Em andamento · {metasAtivas.length}
            </p>
            <div className="flex flex-col gap-3">
              {metasAtivas.map((meta) => (
                <MetaCard
                  key={meta.id}
                  meta={meta}
                  actions={actions}
                  onClick={() => actions.abrirDetalhe(meta)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Metas concluídas */}
        {metasConcluidas.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              Concluídas · {metasConcluidas.length}
            </p>
            <div className="flex flex-col gap-3">
              {metasConcluidas.map((meta) => (
                <MetaCard
                  key={meta.id}
                  meta={meta}
                  actions={actions}
                  onClick={() => actions.abrirDetalhe(meta)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Metas canceladas */}
        {metasCanceladas.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              Canceladas · {metasCanceladas.length}
            </p>
            <div className="flex flex-col gap-3">
              {metasCanceladas.map((meta) => (
                <MetaCard
                  key={meta.id}
                  meta={meta}
                  actions={actions}
                  onClick={() => actions.abrirDetalhe(meta)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={actions.abrirModalCriar}
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

      {modalCriarAberto && (
        <ModalCriarMeta state={state} actions={actions} variant="mobile" />
      )}
      {modalAporteAberto && (
        <ModalAporte state={state} actions={actions} variant="mobile" />
      )}
      {modalDetalheAberto && (
        <ModalDetalhe state={state} actions={actions} variant="mobile" />
      )}
    </div>
  )
}
