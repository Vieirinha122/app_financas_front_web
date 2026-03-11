import {
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type Meta, type MetasViewProps } from "./useMeta"

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

interface Props {
  meta: Meta
  actions: MetasViewProps["actions"]
  onClick: () => void
}

export function MetaCard({ meta, actions, onClick }: Props) {
  const concluida = meta.status === "CONCLUIDA"
  const cancelada = meta.status === "CANCELADA"

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden rounded-3xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${cancelada ? "opacity-60" : ""}`}
    >
      {/* Barra de progresso no topo */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${meta.percentual}%`, backgroundColor: meta.cor }}
        />
      </div>

      <div className="flex items-start justify-between">
        {/* Emoji + título */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl"
            style={{ backgroundColor: `${meta.cor}20` }}
          >
            {meta.emoji}
          </div>
          <div>
            <p className="text-sm leading-tight font-bold text-gray-900">
              {meta.titulo}
            </p>
            {meta.descricao && (
              <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">
                {meta.descricao}
              </p>
            )}
          </div>
        </div>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
              <MoreHorizontal size={16} className="text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl">
            {!cancelada && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  actions.abrirModalAporte(meta)
                }}
                className="gap-2 rounded-xl"
              >
                <Plus size={14} /> Adicionar aporte
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                actions.abrirModalEditar(meta)
              }}
              className="gap-2 rounded-xl"
            >
              <Pencil size={14} /> Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {meta.status === "ATIVA" && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  actions.atualizarStatus(meta.id, "CANCELADA")
                }}
                className="gap-2 rounded-xl text-red-500 focus:text-red-500"
              >
                <XCircle size={14} /> Cancelar meta
              </DropdownMenuItem>
            )}
            {meta.status === "CANCELADA" && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  actions.atualizarStatus(meta.id, "ATIVA")
                }}
                className="gap-2 rounded-xl text-[#00D084] focus:text-[#00D084]"
              >
                <RotateCcw size={14} /> Reativar meta
              </DropdownMenuItem>
            )}
            {meta.status === "CONCLUIDA" && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  actions.atualizarStatus(meta.id, "ATIVA")
                }}
                className="gap-2 rounded-xl"
              >
                <RotateCcw size={14} /> Reabrir
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                actions.deletarMeta(meta.id)
              }}
              className="gap-2 rounded-xl text-red-500 focus:text-red-500"
            >
              <Trash2 size={14} /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Valores */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-end justify-between">
          <span className="text-xs text-gray-400">
            {fmt(meta.valorAtual)} de {fmt(meta.valorAlvo)}
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: concluida ? "#00D084" : meta.cor }}
          >
            {meta.percentual}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${meta.percentual}%`, backgroundColor: meta.cor }}
          />
        </div>
      </div>

      {/* Rodapé: prazo / previsão / aporte sugerido */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {concluida ? (
          <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-[#00D084]">
            <CheckCircle size={11} /> Concluída
          </span>
        ) : cancelada ? (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-400">
            Cancelada
          </span>
        ) : (
          <>
            {meta.falta > 0 && (
              <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-500">
                Falta {fmt(meta.falta)}
              </span>
            )}
            {meta.aporteMensalSugerido && (
              <span
                className="rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ backgroundColor: `${meta.cor}15`, color: meta.cor }}
              >
                {fmt(meta.aporteMensalSugerido)}/mês
              </span>
            )}
            {meta.prazo && (
              <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-400">
                📅{" "}
                {new Date(meta.prazo).toLocaleDateString("pt-BR", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
