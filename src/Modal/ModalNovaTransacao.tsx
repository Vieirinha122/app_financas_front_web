import { useState } from "react"
import { X, AlignLeft, DollarSign } from "lucide-react"
import { useAuth } from "../lib/useAuth"
import { criarTransacao } from "@/service/TransacaoService"

const CATEGORIAS = [
  { label: "Alimentação", emoji: "🛒" },
  { label: "Moradia", emoji: "🏠" },
  { label: "Transporte", emoji: "🚗" },
  { label: "Saúde", emoji: "❤️" },
  { label: "Lazer", emoji: "🎉" },
  { label: "Salário", emoji: "💰" },
  { label: "Outro", emoji: "📦" },
]

interface NovaTransacaoModalProps {
  aberto: boolean
  onFechar: () => void
  onSucesso: () => void
}

export function ModalNovaTransacao({
  aberto,
  onFechar,
  onSucesso,
}: NovaTransacaoModalProps) {
  const { token } = useAuth()
  const [tipo, setTipo] = useState<"RECEITA" | "DESPESA">("DESPESA")
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [categoria, setCategoria] = useState("")
  const [erro, setErro] = useState("")
  const [salvando, setSalvando] = useState(false)

  function limpar() {
    setTipo("DESPESA")
    setDescricao("")
    setValor("")
    setCategoria("")
    setErro("")
  }

  function handleFechar() {
    limpar()
    onFechar()
  }

  function handleValorChange(texto: string) {
    const numeros = texto.replace(/\D/g, "")
    const numero = parseInt(numeros || "0", 10)
    const formatado = (numero / 100).toFixed(2).replace(".", ",")
    setValor(formatado === "0,00" ? "" : formatado)
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    if (!descricao || descricao.length < 3)
      return setErro("Descrição deve ter pelo menos 3 caracteres.")
    if (!valor || parseFloat(valor.replace(",", ".")) <= 0)
      return setErro("Informe um valor válido.")
    if (!categoria) return setErro("Selecione uma categoria.")

    setSalvando(true)
    try {
      await criarTransacao(
        {
          descricao,
          valor: parseFloat(valor.replace(",", ".")),
          tipo,
          categoria,
        },
        token!
      )
      limpar()
      onSucesso()
      onFechar()
    } catch (err: Error | unknown) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar transação.")
    } finally {
      setSalvando(false)
    }
  }

  if (!aberto) return null

  return (
    // Mobile: sobe da base | sm+: centralizado com padding
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={handleFechar}
    >
      <div
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 sm:max-w-md sm:rounded-3xl md:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Nova Transação
          </h2>
          <button
            onClick={handleFechar}
            className="rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
          >
            <X size={20} className="text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSalvar} className="flex flex-col gap-5">
          {/* Toggle RECEITA / DESPESA */}
          <div className="flex gap-1 rounded-2xl bg-gray-100 p-1">
            {(["DESPESA", "RECEITA"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-colors sm:py-3.5 sm:text-base ${
                  tipo === t
                    ? t === "RECEITA"
                      ? "bg-green-600 text-white"
                      : "bg-red-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "RECEITA" ? "↑ Receita" : "↓ Despesa"}
              </button>
            ))}
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1">
            <label className="ml-1 text-sm font-medium text-gray-700 sm:text-base">
              Descrição
            </label>
            <div className="flex h-14 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 transition-colors focus-within:border-green-500 sm:h-[58px]">
              <AlignLeft size={18} className="shrink-0 text-gray-400" />
              <input
                type="text"
                placeholder="Ex: Supermercado, Salário..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none sm:text-base"
              />
            </div>
          </div>

          {/* Valor */}
          <div className="flex flex-col gap-1">
            <label className="ml-1 text-sm font-medium text-gray-700 sm:text-base">
              Valor (R$)
            </label>
            <div className="flex h-14 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 transition-colors focus-within:border-green-500 sm:h-[58px]">
              <DollarSign size={18} className="shrink-0 text-gray-400" />
              <input
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                value={valor}
                onChange={(e) => handleValorChange(e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none sm:text-base"
              />
            </div>
          </div>

          {/* Categorias */}
          <div className="flex flex-col gap-2">
            <label className="ml-1 text-sm font-medium text-gray-700 sm:text-base">
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setCategoria(cat.label)}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors sm:px-4 sm:py-2 sm:text-base ${
                    categoria === cat.label
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {erro && (
            <p className="text-center text-sm text-red-500 sm:text-base">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={salvando}
            className={`mt-2 h-14 rounded-xl text-base font-bold text-white transition-colors disabled:opacity-60 sm:h-[58px] sm:text-lg ${
              tipo === "RECEITA"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {salvando
              ? "Salvando..."
              : tipo === "RECEITA"
                ? "Salvar Receita"
                : "Salvar Despesa"}
          </button>
        </form>
      </div>
    </div>
  )
}
