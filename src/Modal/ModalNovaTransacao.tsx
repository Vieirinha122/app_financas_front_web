import { useState } from "react"
import {
  X,
  Car,
  ShoppingBag,
  Home,
  HeartPulse,
  Ticket,
  GraduationCap,
  MoreHorizontal,
  Utensils,
  CheckCircle2,
  Delete,
} from "lucide-react"
import { useAuth } from "@/lib/useAuth"
import { useLayout } from "@/hooks/useLayout"
import { criarTransacao } from "@/service/TransacaoService"

// ── Categorias com ícone lucide ───────────────────────────────────────────────
const CATEGORIAS = [
  { label: "Comida", icone: <Utensils size={16} /> },
  { label: "Transporte", icone: <Car size={16} /> },
  { label: "Compras", icone: <ShoppingBag size={16} /> },
  { label: "Casa", icone: <Home size={16} /> },
  { label: "Saúde", icone: <HeartPulse size={16} /> },
  { label: "Lazer", icone: <Ticket size={16} /> },
  { label: "Educação", icone: <GraduationCap size={16} /> },
  { label: "Outros", icone: <MoreHorizontal size={16} /> },
]

interface Props {
  aberto: boolean
  onFechar: () => void
  onSucesso: () => void
}

export function ModalNovaTransacao({ aberto, onFechar, onSucesso }: Props) {
  const { token } = useAuth()
  const { isMobile } = useLayout()

  const [tipo, setTipo] = useState<"RECEITA" | "DESPESA">("DESPESA")
  const [descricao, setDescricao] = useState("")
  const [valorRaw, setValorRaw] = useState("") // dígitos sem pontuação
  const [categoria, setCategoria] = useState("")
  const [erro, setErro] = useState("")
  const [salvando, setSalvando] = useState(false)

  // ── helpers ────────────────────────────────────────────────────────────────

  /** Converte "12550" → "125,50" */
  function formatarValor(raw: string) {
    const n = parseInt(raw || "0", 10)
    return (n / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
  }

  /** Retorna o valor numérico para enviar ao backend */
  function valorNumerico() {
    return parseInt(valorRaw || "0", 10) / 100
  }

  function limpar() {
    setTipo("DESPESA")
    setDescricao("")
    setValorRaw("")
    setCategoria("")
    setErro("")
  }

  function handleFechar() {
    limpar()
    onFechar()
  }

  // ── teclado numérico (mobile) ──────────────────────────────────────────────
  function pressDigito(d: string) {
    setValorRaw((prev) => {
      const novo = (prev + d).replace(/^0+/, "")
      return novo.length > 10 ? prev : novo // limita a 9.999.999,99
    })
  }

  function pressDelete() {
    setValorRaw((prev) => prev.slice(0, -1))
  }

  // ── submit ─────────────────────────────────────────────────────────────────
  async function handleSalvar(e?: React.FormEvent) {
    e?.preventDefault()
    setErro("")

    if (!descricao || descricao.length < 3)
      return setErro("Descrição deve ter pelo menos 3 caracteres.")
    if (valorNumerico() <= 0) return setErro("Informe um valor válido.")
    if (!categoria) return setErro("Selecione uma categoria.")

    setSalvando(true)
    try {
      await criarTransacao(
        { descricao, valor: valorNumerico(), tipo, categoria },
        token!
      )
      limpar()
      onSucesso()
      onFechar()
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar transação.")
    } finally {
      setSalvando(false)
    }
  }

  if (!aberto) return null

  // ── blocos compartilhados ──────────────────────────────────────────────────

  const labelTipo = tipo === "DESPESA" ? "VALOR DA DESPESA" : "VALOR DA RECEITA"
  const corTipo = tipo === "DESPESA" ? "#ef4444" : "#00D084"

  const cabecalho = (
    <div className="mb-4 flex items-center justify-between">
      <button
        onClick={handleFechar}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
      >
        <X size={18} />
      </button>
      <h2 className="text-base font-bold text-gray-900">Nova Transação</h2>
      {/* espaçador para centralizar o título */}
      <div className="h-9 w-9" />
    </div>
  )

  const displayValor = (
    <div className="mb-4 text-center">
      <p
        className="mb-0.5 text-[10px] font-bold tracking-widest uppercase"
        style={{ color: corTipo }}
      >
        {labelTipo}
      </p>
      <p className="text-4xl font-extrabold text-[#0F172A]">
        <span className="mr-1 text-lg font-semibold text-gray-400">R$</span>
        {formatarValor(valorRaw)}
      </p>
    </div>
  )

  const campoDescricao = (
    <div className="mb-3">
      <label className="mb-1 block text-xs font-semibold text-gray-700">
        Descrição
      </label>
      <input
        type="text"
        placeholder="Ex: Almoço com a família"
        value={descricao}
        onChange={(e) => {
          setDescricao(e.target.value)
          if (erro) setErro("")
        }}
        className="h-11 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#00D084] focus:ring-2 focus:ring-[#00D084]/20"
      />
    </div>
  )

  const gridCategorias = (
    <div className="mb-3">
      <label className="mb-1.5 block text-xs font-semibold text-gray-700">
        Categoria
      </label>
      <div className="grid grid-cols-4 gap-1.5">
        {CATEGORIAS.map((cat) => {
          const ativo = categoria === cat.label
          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => {
                setCategoria(cat.label)
                if (erro) setErro("")
              }}
              className={`flex flex-col items-center gap-1 rounded-xl border py-2 transition-colors ${
                ativo
                  ? "border-[#00D084] bg-[#e6faf3]"
                  : "border-transparent bg-gray-100"
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  ativo
                    ? "bg-[#00D084] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {cat.icone}
              </div>
              <span
                className={`text-[9px] font-bold tracking-wide uppercase ${
                  ativo ? "text-[#00D084]" : "text-gray-500"
                }`}
              >
                {cat.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )

  const mensagemErro = erro ? (
    <p className="mb-3 text-center text-sm text-red-500">{erro}</p>
  ) : null

  // ── teclado numérico (só no mobile) ───────────────────────────────────────
  const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]

  const tecladoNumerico = (
    <div className="mb-4 grid grid-cols-3 gap-2">
      {DIGITS.slice(0, 9).map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => pressDigito(d)}
          className="flex h-16 items-center justify-center rounded-2xl bg-gray-50 text-2xl font-semibold text-gray-800 active:bg-gray-200"
        >
          {d}
        </button>
      ))}
      {/* linha final: vazio | 0 | delete */}
      <div />
      <button
        type="button"
        onClick={() => pressDigito("0")}
        className="flex h-16 items-center justify-center rounded-2xl bg-gray-50 text-2xl font-semibold text-gray-800 active:bg-gray-200"
      >
        0
      </button>
      <button
        type="button"
        onClick={pressDelete}
        className="flex h-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-500 active:bg-gray-200"
      >
        <Delete size={22} />
      </button>
    </div>
  )

  const botaoSalvar = (
    <button
      type="button"
      disabled={salvando}
      onClick={() => handleSalvar()}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00D084] text-sm font-bold text-white shadow-lg shadow-[#00D084]/20 transition-colors hover:bg-[#00B875] disabled:opacity-60"
    >
      {salvando ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <>
          <CheckCircle2 size={17} />
          Salvar Transação
        </>
      )}
    </button>
  )

  // ── toggle tipo (só no desktop) ───────────────────────────────────────────
  const toggleTipo = (
    <div className="mb-4 flex gap-1 rounded-xl bg-gray-100 p-1">
      {(["DESPESA", "RECEITA"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTipo(t)}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
            tipo === t
              ? t === "RECEITA"
                ? "bg-[#00D084] text-white"
                : "bg-red-500 text-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t === "RECEITA" ? "↑ Receita" : "↓ Despesa"}
        </button>
      ))}
    </div>
  )

  // ══════════════════════════════════════════════════════════════════════════
  // MOBILE — bottom sheet + teclado numérico customizado
  // ══════════════════════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end bg-black/50"
        onClick={handleFechar}
      >
        <div
          className="max-h-[96vh] w-full overflow-y-auto rounded-t-3xl bg-white px-5 pt-3 pb-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* handle */}
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />

          {cabecalho}
          {displayValor}
          {campoDescricao}
          {gridCategorias}
          {tecladoNumerico}
          {mensagemErro}
          {botaoSalvar}
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // DESKTOP — modal compacto, cabe na tela sem scroll
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleFechar}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {cabecalho}
        {toggleTipo}
        {displayValor}

        {/* Campo de valor via input no desktop */}
        <div className="mb-3">
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Valor (R$)
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0,00"
            value={valorRaw ? formatarValor(valorRaw) : ""}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "")
              setValorRaw(raw)
              if (erro) setErro("")
            }}
            className="h-11 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#00D084] focus:ring-2 focus:ring-[#00D084]/20"
          />
        </div>

        {campoDescricao}
        {gridCategorias}
        {mensagemErro}
        {botaoSalvar}
      </div>
    </div>
  )
}
