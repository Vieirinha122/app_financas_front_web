import { useEffect, useState } from "react"
import { useAuth } from "@/lib/useAuth"
import { useValorFormatado } from "./useValorFormatado"

const API_URL = import.meta.env.VITE_API_URL

// ─── Types ────────────────────────────────────────────────────────────────────

export type MetaStatus = "ATIVA" | "CONCLUIDA" | "CANCELADA"

export interface Contribuicao {
  id: string
  metaId: string
  valor: number
  nota: string | null
  createdAt: string
}

export interface Meta {
  id: string
  titulo: string
  descricao: string | null
  emoji: string
  cor: string
  valorAlvo: number
  valorAtual: number
  percentual: number
  falta: number
  aporteMensalSugerido: number | null
  previsaoConclusao: string | null
  prazo: string | null
  prioridade: number
  status: MetaStatus
  createdAt: string
  contribuicoes?: Contribuicao[]
}

export interface CriarMetaForm {
  titulo: string
  descricao: string
  emoji: string
  cor: string
  prazo: string
  prioridade: number
}

export const EMOJIS = ["🎯", "✈️", "🏠", "🚗", "💻", "📚", "💰", "🏋️", "🎓", "💍", "🌎", "🛒"]
export const CORES  = ["#00D084", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]

const FORM_VAZIO: CriarMetaForm = {
  titulo: "", descricao: "", emoji: "🎯",
  cor: "#00D084", prazo: "", prioridade: 1,
}

export function useMetas() {
  const { token } = useAuth()

  const [metas, setMetas]                           = useState<Meta[]>([])
  const [carregando, setCarregando]                 = useState(true)
  const [salvando, setSalvando]                     = useState(false)
  const [erro, setErro]                             = useState("")

  const [modalCriarAberto, setModalCriarAberto]     = useState(false)
  const [modalAporteAberto, setModalAporteAberto]   = useState(false)
  const [modalDetalheAberto, setModalDetalheAberto] = useState(false)
  const [metaSelecionada, setMetaSelecionada]       = useState<Meta | null>(null)

  const [form, setForm]         = useState<CriarMetaForm>(FORM_VAZIO)
  const [editando, setEditando] = useState(false)
  const [notaAporte, setNotaAporte] = useState("")

  // valorInicial para sincronizar a máscara ao abrir edição
  const [valorAlvoInicial, setValorAlvoInicial] = useState("")

  // ── Máscaras — sempre chamadas no topo, incondicionalmente ────────────────
  const valorAlvoMascara = useValorFormatado(valorAlvoInicial)
  const aporteMascara    = useValorFormatado()

  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  })

  async function carregarMetas() {
    if (!token) return
    setCarregando(true)
    try {
      const res = await fetch(`${API_URL}/metas`, { headers: headers() })
      setMetas(await res.json())
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregarMetas() }, [token])

  async function salvarMeta() {
    setErro("")
    if (!form.titulo.trim()) { setErro("Título obrigatório"); return }
    const valorNum = valorAlvoMascara.valorNumerico
    if (!valorNum || valorNum <= 0) { setErro("Valor alvo inválido"); return }

    setSalvando(true)
    try {
      const body = {
        titulo:     form.titulo,
        descricao:  form.descricao || undefined,
        emoji:      form.emoji,
        cor:        form.cor,
        valorAlvo:  valorNum,
        prazo:      form.prazo ? new Date(form.prazo).toISOString() : undefined,
        prioridade: form.prioridade,
      }
      const url    = editando && metaSelecionada ? `${API_URL}/metas/${metaSelecionada.id}` : `${API_URL}/metas`
      const method = editando ? "PUT" : "POST"

      const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(body) })
      if (!res.ok) { const e = await res.json(); throw new Error(e.message ?? "Erro ao salvar") }

      await carregarMetas()
      fecharModalCriar()
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar")
    } finally {
      setSalvando(false)
    }
  }

  async function deletarMeta(id: string) {
    await fetch(`${API_URL}/metas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    await carregarMetas()
  }

  async function atualizarStatus(id: string, status: MetaStatus) {
    await fetch(`${API_URL}/metas/${id}/status`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ status }),
    })
    await carregarMetas()
  }

  async function fazerAporte() {
    if (!metaSelecionada) return
    setErro("")
    const valor = aporteMascara.valorNumerico
    if (!valor || valor <= 0) { setErro("Valor inválido"); return }

    setSalvando(true)
    try {
      const res = await fetch(`${API_URL}/metas/${metaSelecionada.id}/contribuicoes`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ valor, nota: notaAporte || undefined }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.message ?? "Erro ao registrar aporte") }

      await carregarMetas()
      fecharModalAporte()
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao registrar aporte")
    } finally {
      setSalvando(false)
    }
  }

  async function deletarContribuicao(metaId: string, contribuicaoId: string) {
    await fetch(`${API_URL}/metas/${metaId}/contribuicoes/${contribuicaoId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (metaSelecionada) {
      const res = await fetch(`${API_URL}/metas/${metaSelecionada.id}`, { headers: headers() })
      setMetaSelecionada(await res.json())
    }
    await carregarMetas()
  }

  function abrirModalCriar() {
    setForm(FORM_VAZIO)
    setValorAlvoInicial("")
    valorAlvoMascara.resetar()
    setEditando(false)
    setErro("")
    setModalCriarAberto(true)
  }

  function abrirModalEditar(meta: Meta) {
    setForm({
      titulo:     meta.titulo,
      descricao:  meta.descricao ?? "",
      emoji:      meta.emoji,
      cor:        meta.cor,
      prazo:      meta.prazo ? meta.prazo.split("T")[0] : "",
      prioridade: meta.prioridade,
    })
    setValorAlvoInicial(String(meta.valorAlvo))
    setMetaSelecionada(meta)
    setEditando(true)
    setErro("")
    setModalCriarAberto(true)
  }

  function fecharModalCriar() {
    setModalCriarAberto(false)
    setForm(FORM_VAZIO)
    setValorAlvoInicial("")
    valorAlvoMascara.resetar()
    setEditando(false)
    setErro("")
  }

  function abrirModalAporte(meta: Meta) {
    setMetaSelecionada(meta)
    aporteMascara.resetar()
    setNotaAporte("")
    setErro("")
    setModalAporteAberto(true)
  }

  function fecharModalAporte() {
    setModalAporteAberto(false)
    aporteMascara.resetar()
    setNotaAporte("")
    setErro("")
  }

  async function abrirDetalhe(meta: Meta) {
    setMetaSelecionada(meta)
    setModalDetalheAberto(true)
    const res = await fetch(`${API_URL}/metas/${meta.id}`, { headers: headers() })
    setMetaSelecionada(await res.json())
  }

  function updateForm(field: keyof CriarMetaForm, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const metasAtivas     = metas.filter((m) => m.status === "ATIVA")
  const metasConcluidas = metas.filter((m) => m.status === "CONCLUIDA")
  const metasCanceladas = metas.filter((m) => m.status === "CANCELADA")

  return {
    state: {
      metas, metasAtivas, metasConcluidas, metasCanceladas,
      carregando, salvando, erro,
      modalCriarAberto, modalAporteAberto, modalDetalheAberto,
      metaSelecionada, form, editando,
      notaAporte,
      valorAlvoMascara,
      aporteMascara,
    },
    actions: {
      carregarMetas, salvarMeta, deletarMeta, atualizarStatus,
      fazerAporte, deletarContribuicao,
      abrirModalCriar, abrirModalEditar, fecharModalCriar,
      abrirModalAporte, fecharModalAporte,
      abrirDetalhe, setModalDetalheAberto,
      updateForm, setNotaAporte,
    },
  }
}

export type MetasViewProps = ReturnType<typeof useMetas>