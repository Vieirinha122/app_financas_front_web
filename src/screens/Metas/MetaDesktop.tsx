import { Plus, Target, TrendingUp, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DesktopLayout } from "@/layout/DesktopLayout"
import { type MetasViewProps } from "./useMeta"
import { MetaCard } from "./MetaCard"
import { ModalCriarMeta } from "./ModalCriarMeta"
import { ModalAporte } from "./ModalAporte"
import { ModalDetalhe } from "./ModalDetalhe"

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function MetasDesktop({ state, actions }: MetasViewProps) {
  const {
    metas,
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
      <DesktopLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00D084] border-t-transparent" />
        </div>
      </DesktopLayout>
    )
  }

  // totais para os cards de resumo
  const totalAlvo = metas.reduce((a, m) => a + m.valorAlvo, 0)
  const totalAtual = metas.reduce((a, m) => a + m.valorAtual, 0)
  const percentGeral =
    totalAlvo > 0 ? Math.min((totalAtual / totalAlvo) * 100, 100) : 0

  return (
    <DesktopLayout>
      {/* Cabeçalho */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Metas</h1>
          <p className="mt-1 text-gray-500">
            Acompanhe seus objetivos financeiros
          </p>
        </div>
        <Button
          onClick={actions.abrirModalCriar}
          className="h-11 gap-2 rounded-xl bg-[#00D084] px-5 text-sm font-bold hover:bg-[#00B875]"
        >
          <Plus size={16} /> Nova Meta
        </Button>
      </div>

      {metas.length === 0 ? (
        /* Estado vazio */
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Target size={36} className="text-gray-300" />
          </div>
          <p className="text-xl font-bold text-gray-700">Nenhuma meta criada</p>
          <p className="mt-2 text-gray-400">
            Defina objetivos e acompanhe seu progresso
          </p>
          <Button
            onClick={actions.abrirModalCriar}
            className="mt-6 gap-2 rounded-xl bg-[#00D084] px-6 text-sm font-bold hover:bg-[#00B875]"
          >
            <Plus size={16} /> Criar primeira meta
          </Button>
        </div>
      ) : (
        <>
          {/* Cards de resumo */}
          <div className="mb-8 grid grid-cols-3 gap-5">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6faf3]">
                  <Target size={16} className="text-[#00D084]" />
                </div>
                <span className="text-sm text-gray-500">Metas ativas</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {metasAtivas.length}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {metasConcluidas.length} concluída(s)
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                  <TrendingUp size={16} className="text-blue-500" />
                </div>
                <span className="text-sm text-gray-500">Total acumulado</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {fmt(totalAtual)}
              </p>
              <p className="mt-1 text-xs text-gray-400">de {fmt(totalAlvo)}</p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle size={16} className="text-[#00D084]" />
                </div>
                <span className="text-sm text-gray-500">Progresso geral</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {percentGeral.toFixed(1)}%
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#00D084] transition-all"
                  style={{ width: `${percentGeral}%` }}
                />
              </div>
            </div>
          </div>

          {/* Grid de metas ativas */}
          {metasAtivas.length > 0 && (
            <div className="mb-8">
              <p className="mb-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Em andamento · {metasAtivas.length}
              </p>
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
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
            <div className="mb-8">
              <p className="mb-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Concluídas · {metasConcluidas.length}
              </p>
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
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
            <div>
              <p className="mb-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Canceladas · {metasCanceladas.length}
              </p>
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
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
        </>
      )}

      {modalCriarAberto && (
        <ModalCriarMeta state={state} actions={actions} variant="desktop" />
      )}
      {modalAporteAberto && (
        <ModalAporte state={state} actions={actions} variant="desktop" />
      )}
      {modalDetalheAberto && (
        <ModalDetalhe state={state} actions={actions} variant="desktop" />
      )}
    </DesktopLayout>
  )
}
