import { Mail, Lock, Eye, EyeOff, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type LoginViewProps } from "./useLogin"
import { useNavigate } from "react-router-dom"

export function LoginMobile({ state, actions }: LoginViewProps) {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-white px-8 py-12">
      <header className="mb-5 text-center">
        <div className="mt-2 flex justify-center">
          <div className="mb-2 rounded-xl bg-[#00D084] p-2 shadow-lg shadow-[#00D084]/30">
            <Wallet className="text-white" size={40} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mb-5 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#0F172A]">
            Bem-vindo!
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Acesse sua conta para continuar sua jornada
          </p>
        </div>

        <form onSubmit={actions.handleLogin} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label className="text-base font-bold text-gray-800">E-mail</Label>
            <div className="relative">
              <Mail
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                size={24}
              />
              <Input
                placeholder="seuemail@exemplo.com"
                value={state.email}
                onChange={(e) => actions.setEmail(e.target.value)}
                className="h-16 rounded-2xl border-gray-100 bg-white pl-12 text-lg text-black shadow-sm placeholder:text-black focus-visible:ring-[#00D084]"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label className="text-base font-bold text-gray-800">Senha</Label>
            <div className="relative">
              <Lock
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                size={24}
              />
              <Input
                type={state.mostrarSenha ? "text" : "password"}
                placeholder="........"
                value={state.senha}
                onChange={(e) => actions.setSenha(e.target.value)}
                className="h-16 rounded-2xl border-gray-100 bg-white pr-12 pl-12 text-2xl text-black shadow-sm placeholder:text-black focus-visible:ring-[#00D084]"
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400"
                onClick={() => actions.setMostrarSenha(!state.mostrarSenha)}
              >
                {state.mostrarSenha ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>

          {/* Esqueceu */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-base font-bold text-[#00D084]"
            >
              Esqueceu a senha?
            </button>
          </div>

          {/* Erro */}
          {state.erro && (
            <div className="flex animate-in items-center gap-2 rounded-2xl bg-red-50 p-4 duration-300 fade-in slide-in-from-top-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                <span className="text-xs font-bold">!</span>
              </div>
              <p className="text-sm font-medium text-red-600">{state.erro}</p>
            </div>
          )}

          <Button
            className="h-16 w-full rounded-2xl bg-[#00D084] text-lg font-bold text-white shadow-lg shadow-[#00D084]/20 hover:bg-[#00B875]"
            disabled={state.carregando}
          >
            {state.carregando ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Entrar na Conta"
            )}
          </Button>
        </form>
      </main>

      <footer className="mt-10 text-center text-gray-500">
        Não tem uma conta?{" "}
        <span
          className="cursor-pointer font-bold text-[#00D084]"
          onClick={() => navigate("/register")}
        >
          Cadastre-se
        </span>
      </footer>
    </div>
  )
}
