import { useEffect, useState } from "react"
import { useAuth } from "@/lib/useAuth"

const API_URL = import.meta.env.VITE_API_URL

export interface Transacao {
  id: string
  descricao: string
  valor: number
  tipo: "RECEITA" | "DESPESA"
  categoria: string
  data: string
}

export type PeriodoPreset = "7dias" | "30dias" | "mes" | "personalizado"

export function useExtrato() {
  const { token } = useAuth()

  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [modalFiltroAberto, setModalFiltroAberto] = useState(false)
  const [tabAtiva, setTabAtiva] = useState<"tudo" | "RECEITA" | "DESPESA">("tudo")
  const [modalNovaTransacao, setModalNovaTransacao] = useState(false)
  const [busca, setBusca] = useState("")
  const [buscaAberta, setBuscaAberta] = useState(false)

  // filtros
  const [periodo, setPeriodo] = useState<PeriodoPreset>("30dias")
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
      if (dataInicial) params.append("dataInicial", new Date(dataInicial).toISOString())
      if (dataFinal) params.append("dataFinal", new Date(dataFinal).toISOString())

      const res = await fetch(`${API_URL}/transacoes?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTransacoes(await res.json())
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregarTransacoes() }, [token])

  function limparFiltros() {
    setTipo("")
    setCategoria("")
    setDataInicial("")
    setDataFinal("")
    setPeriodo("30dias")
    setBusca("")
  }

  function aplicarFiltros() {
    carregarTransacoes()
    setModalFiltroAberto(false)
  }

  // tab + busca local (sem chamada ao backend)
  const transacoesFiltradas = transacoes
    .filter((t) => tabAtiva === "tudo" || t.tipo === tabAtiva)
    .filter((t) =>
      busca.trim() === "" ||
      t.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      t.categoria.toLowerCase().includes(busca.toLowerCase())
    )

  // agrupa por data
  const agrupadas = transacoesFiltradas.reduce<Record<string, Transacao[]>>((acc, t) => {
    const chave = t.data.split(",")[0]?.trim() ?? t.data
    if (!acc[chave]) acc[chave] = []
    acc[chave].push(t)
    return acc
  }, {})

  const totalReceitas = transacoes.filter((t) => t.tipo === "RECEITA").reduce((a, t) => a + t.valor, 0)
  const totalDespesas = transacoes.filter((t) => t.tipo === "DESPESA").reduce((a, t) => a + t.valor, 0)
  const filtrosAtivos = !!(tipo || categoria || dataInicial || dataFinal)

  return {
    state: {
      transacoes,
      transacoesFiltradas,
      agrupadas,
      carregando,
      modalFiltroAberto,
      modalNovaTransacao,
      tabAtiva,
      periodo,
      tipo,
      categoria,
      dataInicial,
      dataFinal,
      filtrosAtivos,
      totalReceitas,
      totalDespesas,
      busca,
      buscaAberta,
    },
    actions: {
      setTabAtiva,
      setModalFiltroAberto,
      setModalNovaTransacao,
      setPeriodo,
      setTipo,
      setCategoria,
      setDataInicial,
      setDataFinal,
      setBusca,
      setBuscaAberta,
      limparFiltros,
      aplicarFiltros,
      carregarTransacoes,
    },
  }
}

export type ExtratoViewProps = ReturnType<typeof useExtrato>