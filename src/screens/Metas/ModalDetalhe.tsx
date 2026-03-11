import { X, Trash2, TrendingUp, Calendar, Target, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type MetasViewProps } from "./useMeta"
import { useLayout } from "@/hooks/useLayout"

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

interface Props {
  state: MetasViewProps["state"]
  actions: MetasViewProps["actions"]
  variant: "mobile" | "desktop"
}

export function ModalDetalhe({ state, actions, variant }: Props) {
  const { metaSelecionada } = state
  const { isMobile } = useLayout()
  if (!metaSelecionada) return null

  const m = metaSelecionada

  const conteudo = (
    <div className="flex flex-col gap-5">
      {/* Cabeçalho da meta */}
      <div className="flex items-center gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl"
          style={{ backgroundColor: `${m.cor}20` }}
        >
          {m.emoji}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{m.titulo}</h3>
          {m.descricao && (
            <p className="text-sm text-gray-400">{m.descricao}</p>
          )}
        </div>
      </div>

      {/* Barra de progresso grande */}
      <div>
        <div className="mb-2 flex items-end justify-between">
          <p className="text-2xl font-bold text-gray-900">
            {fmt(m.valorAtual)}
          </p>
          <p className="text-sm text-gray-400">de {fmt(m.valorAlvo)}</p>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${m.percentual}%`, backgroundColor: m.cor }}
          />
        </div>
        <p
          className="mt-1 text-right text-xs font-semibold"
          style={{ color: m.cor }}
        >
          {m.percentual}% concluído
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-gray-50 p-3">
          <div className="mb-1 flex items-center gap-1.5">
            <Target size={13} className="text-gray-400" />
            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              Falta
            </p>
          </div>
          <p className="text-sm font-bold text-gray-900">{fmt(m.falta)}</p>
        </div>
        {m.aporteMensalSugerido && (
          <div className="rounded-2xl bg-gray-50 p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <Zap size={13} className="text-gray-400" />
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                Sugerido/mês
              </p>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {fmt(m.aporteMensalSugerido)}
            </p>
          </div>
        )}
        {m.prazo && (
          <div className="rounded-2xl bg-gray-50 p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <Calendar size={13} className="text-gray-400" />
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                Prazo
              </p>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {new Date(m.prazo).toLocaleDateString("pt-BR", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        )}
        {m.previsaoConclusao && (
          <div className="rounded-2xl bg-gray-50 p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <TrendingUp size={13} className="text-gray-400" />
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                Previsão
              </p>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {m.previsaoConclusao}
            </p>
          </div>
        )}
      </div>

      {/* Histórico de aportes */}
      <div>
        <p className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
          Histórico de aportes
        </p>
        {!m.contribuicoes || m.contribuicoes.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">
            Nenhum aporte ainda.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {m.contribuicoes.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {fmt(c.valor)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {c.nota && <span>{c.nota} · </span>}
                    {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <button
                  onClick={() => actions.deletarContribuicao(m.id, c.id)}
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                    isMobile
                      ? "bg-red-50 text-red-500" // Cores diretas no Mobile
                      : "text-gray-300 hover:bg-red-50 hover:text-red-400" // Comportamento padrão Desktop
                  }`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botão aporte */}
      {m.status === "ATIVA" && (
        <Button
          onClick={() => {
            actions.setModalDetalheAberto(false)
            actions.abrirModalAporte(m)
          }}
          className="h-11 w-full cursor-pointer rounded-xl bg-[#00D084] text-sm font-bold hover:bg-[#00B875]"
        >
          <TrendingUp size={15} className="mr-2" />
          Adicionar Aporte
        </Button>
      )}
    </div>
  )

  // ── Mobile ────────────────────────────────────────────────────────────────
  if (variant === "mobile") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end bg-black/50"
        onClick={() => actions.setModalDetalheAberto(false)}
      >
        <div
          className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-white px-5 pt-3 pb-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Detalhes</h2>
            <button onClick={() => actions.setModalDetalheAberto(false)}>
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          {conteudo}
        </div>
      </div>
    )
  }

  // ── Desktop ───────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={() => actions.setModalDetalheAberto(false)}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">Detalhes da Meta</h2>
          <button
            onClick={() => actions.setModalDetalheAberto(false)}
            className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{conteudo}</div>
      </div>
    </div>
  )
}
