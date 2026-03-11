import { useEffect, useState } from "react"
import { useAuth } from "@/lib/useAuth"

const API_URL = import.meta.env.VITE_API_URL

export interface PerfilData {
  id: string
  nome: string
  email: string
  createdAt: string
}

type Secao = "dados" | "senha"

export function usePerfil() {
  const { token, signOut } = useAuth()

  const [perfil, setPerfil] = useState<PerfilData | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [secaoAberta, setSecaoAberta] = useState<Secao | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  // campos dados pessoais
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")

  // campos senha
  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [mostrarSenhas, setMostrarSenhas] = useState(false)

  async function carregarPerfil() {
    if (!token) return
    setCarregando(true)
    try {
      const res = await fetch(`${API_URL}/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data: PerfilData = await res.json()
      setPerfil(data)
      setNome(data.nome)
      setEmail(data.email)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregarPerfil() }, [token])

  function abrirSecao(s: Secao) {
    setSecaoAberta(secaoAberta === s ? null : s)
    setErro("")
    setSucesso("")
    // reset campos senha ao abrir
    if (s === "senha") {
      setSenhaAtual("")
      setNovaSenha("")
      setConfirmarSenha("")
    }
  }

  async function salvarDados() {
    if (!token || !perfil) return
    setErro("")
    setSalvando(true)
    try {
      const body: Record<string, string> = {}
      if (nome !== perfil.nome) body.nome = nome
      if (email !== perfil.email) body.email = email
      if (Object.keys(body).length === 0) {
        setSecaoAberta(null)
        return
      }
      const res = await fetch(`${API_URL}/perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message ?? "Erro ao salvar")
      }
      const atualizado: PerfilData = await res.json()
      setPerfil(atualizado)
      setSucesso("Dados atualizados com sucesso!")
      setSecaoAberta(null)
      setTimeout(() => setSucesso(""), 3000)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar")
    } finally {
      setSalvando(false)
    }
  }

  async function salvarSenha() {
    if (!token) return
    setErro("")
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem")
      return
    }
    if (novaSenha.length < 6) {
      setErro("Nova senha deve ter pelo menos 6 caracteres")
      return
    }
    setSalvando(true)
    try {
      const res = await fetch(`${API_URL}/perfil/senha`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senhaAtual, novaSenha, confirmarSenha }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message ?? "Erro ao atualizar senha")
      }
      setSucesso("Senha atualizada com sucesso!")
      setSecaoAberta(null)
      setTimeout(() => setSucesso(""), 3000)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao atualizar senha")
    } finally {
      setSalvando(false)
    }
  }

  // iniciais para avatar
  const iniciais = perfil?.nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "?"

  // data de cadastro formatada
  const membroDesde = perfil
    ? new Date(perfil.createdAt).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : ""

  return {
    state: {
      perfil,
      carregando,
      secaoAberta,
      salvando,
      erro,
      sucesso,
      nome,
      email,
      senhaAtual,
      novaSenha,
      confirmarSenha,
      mostrarSenhas,
      iniciais,
      membroDesde,
    },
    actions: {
      abrirSecao,
      setNome,
      setEmail,
      setSenhaAtual,
      setNovaSenha,
      setConfirmarSenha,
      setMostrarSenhas,
      salvarDados,
      salvarSenha,
      signOut,
    },
  }
}

export type PerfilViewProps = ReturnType<typeof usePerfil>            