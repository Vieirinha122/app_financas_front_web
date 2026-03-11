import { X, AlertCircle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type MetasViewProps } from "./useMeta"

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

interface Props {
  state: MetasViewProps["state"]
  actions: MetasViewProps["actions"]
  variant: "mobile" | "desktop"
}

export function ModalAporte({ state, actions, variant }: Props) {
  const { metaSelecionada, notaAporte, salvando, erro, aporteMascara } = state
  if (!metaSelecionada) return null

  const novoTotal = metaSelecionada.valorAtual + aporteMascara.valorNumerico
  const novoPercent = Math.min(
    (novoTotal / metaSelecionada.valorAlvo) * 100,
    100
  )

  const conteudo = (
    <div className="flex flex-col gap-4">
      {/* Resumo da meta */}
      <div
        className="flex items-center gap-3 rounded-2xl p-4"
        style={{ backgroundColor: `${metaSelecionada.cor}15` }}
      >
        <span className="text-2xl">{metaSelecionada.emoji}</span>
        <div>
          <p className="text-sm font-bold text-gray-900">
            {metaSelecionada.titulo}
          </p>
          <p className="text-xs text-gray-500">
            {fmt(metaSelecionada.valorAtual)} de{" "}
            {fmt(metaSelecionada.valorAlvo)} ({metaSelecionada.percentual}%)
          </p>
        </div>
      </div>

      {/* Preview barra de progresso */}
      {aporteMascara.valorNumerico > 0 && (
        <div>
          <div className="mb-1 flex justify-between text-xs text-gray-400">
            <span>Progresso após aporte</span>
            <span style={{ color: metaSelecionada.cor }}>
              {novoPercent.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${novoPercent}%`,
                backgroundColor: metaSelecionada.cor,
              }}
            />
          </div>
        </div>
      )}

      {/* Valor */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Valor do aporte *
        </Label>
        <div className="relative">
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-gray-400">
            R$
          </span>
          <Input
            inputMode="numeric"
            autoFocus
            value={aporteMascara.valorFormatado}
            onChange={aporteMascara.onChangeFormatado}
            placeholder="0,00"
            className="h-12 rounded-xl border-gray-100 bg-gray-50 pl-9 text-sm text-black"
          />
        </div>
      </div>

      {/* Nota */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Nota (opcional)
        </Label>
        <Input
          value={notaAporte}
          onChange={(e) => actions.setNotaAporte(e.target.value)}
          placeholder="Ex: salário de março"
          className="h-11 rounded-xl border-gray-100 bg-gray-50 text-sm text-black"
        />
      </div>

      {/* Erro */}
      {erro && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5">
          <AlertCircle size={14} className="text-red-500" />
          <p className="text-xs font-medium text-red-600">{erro}</p>
        </div>
      )}
    </div>
  )

  // ── Mobile ────────────────────────────────────────────────────────────────
  if (variant === "mobile") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end bg-black/50"
        onClick={actions.fecharModalAporte}
      >
        <div
          className="w-full rounded-t-3xl bg-white px-5 pt-3 pb-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              Adicionar Aporte
            </h2>
            <button onClick={actions.fecharModalAporte}>
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          {conteudo}
          <Button
            onClick={actions.fazerAporte}
            disabled={salvando || aporteMascara.valorNumerico <= 0}
            className="mt-5 h-12 w-full rounded-2xl bg-[#00D084] text-sm font-bold hover:bg-[#00B875]"
          >
            <TrendingUp size={16} className="mr-2" />
            {salvando ? "Registrando..." : "Confirmar Aporte"}
          </Button>
        </div>
      </div>
    )
  }

  // ── Desktop ───────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={actions.fecharModalAporte}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">Adicionar Aporte</h2>
          <button
            onClick={actions.fecharModalAporte}
            className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-5">{conteudo}</div>
        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
          <Button
            onClick={actions.fazerAporte}
            disabled={salvando || aporteMascara.valorNumerico <= 0}
            className="h-11 flex-1 cursor-pointer rounded-xl bg-[#00D084] text-sm font-bold hover:bg-[#00B875]"
          >
            <TrendingUp size={15} className="mr-2" />
            {salvando ? "Registrando..." : "Confirmar Aporte"}
          </Button>
          <Button
            variant="secondary"
            onClick={actions.fecharModalAporte}
            className="h-11 cursor-pointer rounded-xl px-5 text-sm"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
