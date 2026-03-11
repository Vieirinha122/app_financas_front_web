import { X, TrendingUp, TrendingDown } from "lucide-react"
import { type ExtratoViewProps, type PeriodoPreset } from "./useExtrato"

const CATEGORIAS = [
  { label: "Alimentação", icone: "🍽️" },
  { label: "Transporte", icone: "🚗" },
  { label: "Moradia", icone: "🏠" },
  { label: "Compras", icone: "🛍️" },
  { label: "Saúde", icone: "💊" },
  { label: "Lazer", icone: "🎮" },
  { label: "Outros", icone: "···" },
]

const PERIODOS: { label: string; value: PeriodoPreset }[] = [
  { label: "Últimos 7 dias", value: "7dias" },
  { label: "Últimos 30 dias", value: "30dias" },
  { label: "Este mês", value: "mes" },
  { label: "Personalizado", value: "personalizado" },
]

interface Props extends ExtratoViewProps {
  variant: "mobile" | "desktop"
}

export function ModalFiltros({ state, actions, variant }: Props) {
  const { periodo, tipo, categoria, dataInicial, dataFinal, filtrosAtivos } =
    state

  const conteudo = (
    <div className="flex flex-col gap-6">
      {/* Período */}
      <div>
        <p className="mb-3 text-xs font-bold tracking-widest text-gray-400 uppercase">
          Período
        </p>
        <div className="flex flex-wrap gap-2">
          {PERIODOS.map((p) => (
            <button
              key={p.value}
              onClick={() => actions.setPeriodo(p.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                periodo === p.value
                  ? "bg-[#00D084] text-white"
                  : p.value === "personalizado"
                    ? "border border-dashed border-[#00D084] text-[#00D084]"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {periodo === "personalizado" && (
          <div className="mt-3 grid animate-in grid-cols-2 gap-3 duration-200 fade-in slide-in-from-top-1">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                De
              </label>
              <input
                type="date"
                value={dataInicial}
                onChange={(e) => actions.setDataInicial(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-black outline-none focus:border-[#00D084]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Até
              </label>
              <input
                type="date"
                value={dataFinal}
                onChange={(e) => actions.setDataFinal(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-black outline-none focus:border-[#00D084]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tipo de transação */}
      <div>
        <p className="mb-3 text-xs font-bold tracking-widest text-gray-400 uppercase">
          Tipo de Transação
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => actions.setTipo(tipo === "RECEITA" ? "" : "RECEITA")}
            className={`flex items-center gap-3 rounded-2xl border-2 p-4 transition-colors ${
              tipo === "RECEITA"
                ? "border-[#00D084] bg-[#e6faf3]"
                : "border-gray-100 bg-gray-50"
            }`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${tipo === "RECEITA" ? "bg-[#00D084]" : "bg-gray-200"}`}
            >
              <TrendingUp
                size={16}
                className={tipo === "RECEITA" ? "text-white" : "text-gray-500"}
              />
            </div>
            <div className="text-left">
              <p
                className={`text-sm font-bold ${tipo === "RECEITA" ? "text-[#00D084]" : "text-gray-700"}`}
              >
                Receita
              </p>
              <p className="text-xs text-gray-400">Entrando</p>
            </div>
          </button>

          <button
            onClick={() => actions.setTipo(tipo === "DESPESA" ? "" : "DESPESA")}
            className={`flex items-center gap-3 rounded-2xl border-2 p-4 transition-colors ${
              tipo === "DESPESA"
                ? "border-red-400 bg-red-50"
                : "border-gray-100 bg-gray-50"
            }`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${tipo === "DESPESA" ? "bg-red-400" : "bg-gray-200"}`}
            >
              <TrendingDown
                size={16}
                className={tipo === "DESPESA" ? "text-white" : "text-gray-500"}
              />
            </div>
            <div className="text-left">
              <p
                className={`text-sm font-bold ${tipo === "DESPESA" ? "text-red-500" : "text-gray-700"}`}
              >
                Gasto
              </p>
              <p className="text-xs text-gray-400">Saindo</p>
            </div>
          </button>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            Categorias
          </p>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 lg:grid-cols-4">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.label}
              onClick={() =>
                actions.setCategoria(categoria === cat.label ? "" : cat.label)
              }
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors md:shrink md:justify-center md:rounded-xl ${
                categoria === cat.label
                  ? "border-[#00D084] bg-[#e6faf3] text-[#00D084]"
                  : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              <span className="text-xs">{cat.icone}</span>
              <span className="truncate">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  if (variant === "mobile") {
    return (
      <div
        className="fixed inset-0 z-50 flex animate-in items-end bg-black/50 duration-300 fade-in"
        onClick={() => actions.setModalFiltroAberto(false)}
      >
        <div
          className="max-h-[85vh] w-full animate-in overflow-y-auto rounded-t-3xl bg-white px-5 pt-3 pb-8 duration-300 slide-in-from-bottom-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => actions.setModalFiltroAberto(false)}
              className="p-1"
            >
              <X size={20} className="text-gray-400" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">Filtrar</h2>
            {filtrosAtivos ? (
              <button
                onClick={actions.limparFiltros}
                className="text-sm font-semibold text-[#00D084]"
              >
                Limpar Tudo
              </button>
            ) : (
              <div className="w-10" />
            )}
          </div>
          {conteudo}
          <button
            onClick={actions.aplicarFiltros}
            className="mt-8 h-14 w-full rounded-2xl bg-[#00D084] text-base font-bold text-white shadow-lg shadow-[#00D084]/20 transition-transform active:scale-[0.98]"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/40 px-4 duration-200 fade-in"
      onClick={() => actions.setModalFiltroAberto(false)}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-xl animate-in flex-col overflow-hidden rounded-3xl bg-white shadow-2xl duration-200 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-gray-100 px-8 py-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Filtrar Extrato</h2>
            <p className="text-sm text-gray-500">
              Ajuste os filtros para organizar suas finanças
            </p>
          </div>
          <button
            onClick={() => actions.setModalFiltroAberto(false)}
            className="rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6">{conteudo}</div>
        <div className="flex items-center gap-4 border-t border-gray-100 bg-gray-50/50 px-8 py-5">
          <button
            onClick={actions.aplicarFiltros}
            className="h-12 flex-1 rounded-xl bg-[#00D084] text-sm font-bold text-white shadow-md shadow-[#00D084]/10 transition-colors hover:bg-[#00B875]"
          >
            Aplicar Filtros
          </button>
          {filtrosAtivos && (
            <button
              onClick={actions.limparFiltros}
              className="h-12 px-6 text-sm font-semibold text-gray-400 transition-colors hover:text-red-500"
            >
              Limpar Tudo
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
