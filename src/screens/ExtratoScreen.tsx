import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react"
import { useAuth } from "../lib/useAuth"
import { TransacaoItem } from "@/components/TransacaoItem"

const API_URL = import.meta.env.VITE_API_URL

interface Transacao {
  id: string
  descricao: string
  valor: number
  tipo: "RECEITA" | "DESPESA"
  categoria: string
  data: string
}

const CATEGORIAS = [
  "Alimentação",
  "Moradia",
  "Transporte",
  "Saúde",
  "Lazer",
  "Salário",
  "Outro",
]

export function ExtratoScreen() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [tipo, setTipo] = useState<"" | "RECEITA" | "DESPESA">("")
  const [categoria, setCategoria] = useState("")
  const [dataInicial, setDataInicial] = useState("")
  const [dataFinal, setDataFinal] = useState("")

  async function carregarTransacoes() {
    if (!token) return
    setCarregando(true)
    try {
      const params = new URLSearchParams()
      if (tipo) params.append("tipo", tipo)
      if (categoria) params.append("categoria", categoria)
      if (dataInicial)
        params.append("dataInicial", new Date(dataInicial).toISOString())
      if (dataFinal)
        params.append("dataFinal", new Date(dataFinal).toISOString())

      const res = await fetch(`${API_URL}/transacoes?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTransacoes(await res.json())
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarTransacoes()
  }, [token])

  function limparFiltros() {
    setTipo("")
    setCategoria("")
    setDataInicial("")
    setDataFinal("")
  }

  const filtrosAtivos = !!(tipo || categoria || dataInicial || dataFinal)
  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  const totalReceitas = transacoes
    .filter((t) => t.tipo === "RECEITA")
    .reduce((a, t) => a + t.valor, 0)
  const totalDespesas = transacoes
    .filter((t) => t.tipo === "DESPESA")
    .reduce((a, t) => a + t.valor, 0)

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="mx-auto max-w-sm px-4 py-6 sm:max-w-xl md:max-w-3xl lg:max-w-4xl lg:px-8">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between sm:mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/home")}
              className="rounded-full bg-white p-2 shadow-sm transition-colors hover:bg-gray-100 sm:p-3"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Extrato
            </h1>
          </div>

          <button
            onClick={() => setFiltrosAbertos(!filtrosAbertos)}
            className={`relative flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-colors sm:px-5 sm:py-2.5 sm:text-base ${
              filtrosAtivos
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 shadow-sm hover:bg-gray-100"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filtros
            {filtrosAtivos && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                !
              </span>
            )}
          </button>
        </div>

        {/* Resumo */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <p className="mb-1 text-xs text-gray-500 sm:text-sm">Receitas</p>
            <p className="text-lg font-bold text-green-600 sm:text-xl">
              {fmt(totalReceitas)}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <p className="mb-1 text-xs text-gray-500 sm:text-sm">Despesas</p>
            <p className="text-lg font-bold text-red-500 sm:text-xl">
              {fmt(totalDespesas)}
            </p>
          </div>
        </div>

        {/* Painel de filtros */}
        {filtrosAbertos && (
          <div className="mb-5 flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 sm:text-lg">Filtros</h3>
              {filtrosAtivos && (
                <button
                  onClick={limparFiltros}
                  className="flex items-center gap-1 text-sm text-red-500 hover:underline sm:text-base"
                >
                  <X size={14} /> Limpar
                </button>
              )}
            </div>

            {/* Tipo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 sm:text-base">
                Tipo
              </label>
              <div className="flex gap-2">
                {(["", "RECEITA", "DESPESA"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTipo(t)}
                    className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors sm:py-2.5 sm:text-base ${
                      tipo === t
                        ? t === "RECEITA"
                          ? "border-green-600 bg-green-50 text-green-700"
                          : t === "DESPESA"
                            ? "border-red-500 bg-red-50 text-red-600"
                            : "border-green-600 bg-green-50 text-green-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {t === ""
                      ? "Todos"
                      : t === "RECEITA"
                        ? "↑ Receita"
                        : "↓ Despesa"}
                  </button>
                ))}
              </div>
            </div>

            {/* Categoria */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 sm:text-base">
                Categoria
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoria(categoria === cat ? "" : cat)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors sm:px-4 sm:py-1.5 sm:text-base ${
                      categoria === cat
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Período */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 sm:text-base">
                  De
                </label>
                <input
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                  className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none focus:border-green-500 sm:h-12 sm:text-base"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 sm:text-base">
                  Até
                </label>
                <input
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                  className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none focus:border-green-500 sm:h-12 sm:text-base"
                />
              </div>
            </div>

            <button
              onClick={() => {
                carregarTransacoes()
                setFiltrosAbertos(false)
              }}
              className="h-12 rounded-xl bg-green-600 text-sm font-bold text-white transition-colors hover:bg-green-700 sm:h-14 sm:text-base"
            >
              Aplicar Filtros
            </button>
          </div>
        )}

        {/* Lista de transações */}
        <div className="rounded-3xl bg-white px-4 py-2 shadow-sm">
          {carregando ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
            </div>
          ) : transacoes.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400 sm:text-base">
              Nenhuma transação encontrada.
            </p>
          ) : (
            <>
              <p className="px-1 pt-2 pb-1 text-xs text-gray-400 sm:text-sm">
                {transacoes.length} transaç
                {transacoes.length === 1 ? "ão" : "ões"}
              </p>
              {transacoes.map((t) => (
                <TransacaoItem
                  key={t.id}
                  descricao={t.descricao}
                  data={t.data}
                  valor={t.valor}
                  tipo={t.tipo}
                  categoria={t.categoria}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
