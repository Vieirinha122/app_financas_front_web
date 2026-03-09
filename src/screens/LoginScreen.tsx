import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../lib/useAuth"
import { loginUser } from "@/service/AuthService"

export function LoginScreen() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)

  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    setCarregando(true)
    try {
      const { token, user } = await loginUser({ email, senha })
      signIn(token, user)
      navigate("/home")
    } catch (err: Error | unknown) {
      setErro(err instanceof Error ? err.message : "Erro ao fazer login")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8faf9] p-4">
      {/* Largura: 100% no mobile, fixo no sm+ */}
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center sm:mb-10">
          <div className="mb-4 rounded-3xl bg-[#e1f0e4] p-5 sm:p-6">
            <div className="flex h-10 w-12 items-center justify-center rounded-xl bg-[#16a34a] sm:h-12 sm:w-14">
              <span className="text-xl sm:text-2xl">💰</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Finanças Pessoais
          </h1>
          <p className="mt-1 text-center text-gray-500 sm:text-lg">
            Gerencie seu dinheiro com inteligência
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
          <h2 className="mb-6 text-center text-xl font-bold text-gray-900 sm:mb-8 sm:text-2xl">
            Acesse sua conta
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="ml-1 text-sm font-medium text-gray-700 sm:text-base">
                E-mail
              </label>
              <div className="flex h-14 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 transition-colors focus-within:border-green-500 sm:h-[58px]">
                <Mail size={18} className="shrink-0 text-green-600" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1">
              <div className="mr-1 ml-1 flex justify-between">
                <label className="text-sm font-medium text-gray-700 sm:text-base">
                  Senha
                </label>
                <span className="cursor-pointer text-sm font-semibold text-green-600 sm:text-base">
                  Esqueceu?
                </span>
              </div>
              <div className="flex h-14 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 transition-colors focus-within:border-green-500 sm:h-[58px]">
                <Lock size={18} className="shrink-0 text-green-600" />
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {erro && (
              <p className="text-center text-sm text-red-500 sm:text-base">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="mt-2 h-14 rounded-xl bg-green-600 text-base font-bold text-white transition-colors hover:bg-green-700 active:bg-green-800 disabled:opacity-60 sm:h-[58px] sm:text-lg"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-gray-500 sm:mt-8 sm:text-base">
          Não tem uma conta?{" "}
          <span
            className="cursor-pointer font-bold text-green-600"
            onClick={() => navigate("/register")}
          >
            Criar conta
          </span>
        </p>
      </div>
    </div>
  )
}
