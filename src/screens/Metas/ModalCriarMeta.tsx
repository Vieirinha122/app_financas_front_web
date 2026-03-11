import { X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type MetasViewProps, EMOJIS, CORES } from "./useMeta"

interface Props {
  state: MetasViewProps["state"]
  actions: MetasViewProps["actions"]
  variant: "mobile" | "desktop"
}

export function ModalCriarMeta({ state, actions, variant }: Props) {
  const { form, salvando, erro, editando, valorAlvoMascara } = state

  const conteudo = (
    <div className="flex flex-col gap-4">
      {/* Emoji + Título */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Emoji
          </Label>
          <select
            value={form.emoji}
            onChange={(e) => actions.updateForm("emoji", e.target.value)}
            className="h-11 w-20 appearance-none rounded-xl border border-gray-100 bg-gray-50 text-center text-xl outline-none focus:border-[#00D084]"
          >
            {EMOJIS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <Label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Título *
          </Label>
          <Input
            value={form.titulo}
            onChange={(e) => actions.updateForm("titulo", e.target.value)}
            placeholder="Ex: Viagem para Europa"
            className="h-11 rounded-xl border-gray-100 bg-gray-50 text-sm text-black"
          />
        </div>
      </div>

      {/* Descrição */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Descrição
        </Label>
        <Input
          value={form.descricao}
          onChange={(e) => actions.updateForm("descricao", e.target.value)}
          placeholder="Opcional — detalhes da meta"
          className="h-11 rounded-xl border-gray-100 bg-gray-50 text-sm text-black"
        />
      </div>

      {/* Valor + Prazo */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Valor alvo *
          </Label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-gray-400">
              R$
            </span>
            <Input
              inputMode="numeric"
              value={valorAlvoMascara.valorFormatado}
              onChange={valorAlvoMascara.onChangeFormatado}
              placeholder="0,00"
              className="h-11 rounded-xl border-gray-100 bg-gray-50 pl-9 text-sm text-black"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Prazo
          </Label>
          <Input
            type="date"
            value={form.prazo}
            onChange={(e) => actions.updateForm("prazo", e.target.value)}
            className="h-11 rounded-xl border-gray-100 bg-gray-50 text-sm text-black"
          />
        </div>
      </div>

      {/* Prioridade */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Prioridade
        </Label>
        <div className="flex gap-2">
          {[
            {
              value: 1,
              label: "Baixa",
              ativo: "border-gray-400 bg-gray-100 text-gray-600",
            },
            {
              value: 2,
              label: "Média",
              ativo: "border-yellow-400 bg-yellow-50 text-yellow-600",
            },
            {
              value: 3,
              label: "Alta",
              ativo: "border-red-400 bg-red-50 text-red-500",
            },
          ].map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => actions.updateForm("prioridade", p.value)}
              className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition-colors ${
                form.prioridade === p.value
                  ? p.ativo
                  : "cursor-pointer border-gray-100 bg-gray-50 text-gray-400"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cor */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Cor
        </Label>
        <div className="flex gap-2">
          {CORES.map((cor) => (
            <button
              key={cor}
              type="button"
              onClick={() => actions.updateForm("cor", cor)}
              className={`h-7 w-7 cursor-pointer rounded-full transition-transform ${
                form.cor === cor
                  ? "scale-125 ring-2 ring-current ring-offset-2"
                  : ""
              }`}
              style={{ backgroundColor: cor, outlineColor: cor, color: cor }}
            />
          ))}
        </div>
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
        onClick={actions.fecharModalCriar}
      >
        <div
          className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white px-5 pt-3 pb-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              {editando ? "Editar Meta" : "Nova Meta"}
            </h2>
            <button onClick={actions.fecharModalCriar}>
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          {conteudo}
          <Button
            onClick={actions.salvarMeta}
            disabled={salvando}
            className="mt-5 h-12 w-full rounded-2xl bg-[#00D084] text-sm font-bold hover:bg-[#00B875]"
          >
            {salvando
              ? "Salvando..."
              : editando
                ? "Salvar alterações"
                : "Criar Meta"}
          </Button>
        </div>
      </div>
    )
  }

  // ── Desktop ───────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={actions.fecharModalCriar}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">
            {editando ? "Editar Meta" : "Nova Meta"}
          </h2>
          <button
            onClick={actions.fecharModalCriar}
            className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
          >
            <X size={16} className="cursor-pointer text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-5">{conteudo}</div>
        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
          <Button
            onClick={actions.salvarMeta}
            disabled={salvando}
            className="h-11 flex-1 cursor-pointer rounded-xl bg-[#00D084] text-sm font-bold hover:bg-[#00B875]"
          >
            {salvando
              ? "Salvando..."
              : editando
                ? "Salvar alterações"
                : "Criar Meta"}
          </Button>
          <Button
            variant="secondary"
            onClick={actions.fecharModalCriar}
            className="h-11 cursor-pointer rounded-xl px-5 text-sm"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
