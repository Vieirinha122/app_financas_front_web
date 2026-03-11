import { Mail, Lock, Eye, ArrowRight, Wallet, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type LoginViewProps } from "./useLogin"
import { useNavigate } from "react-router-dom"

export function LoginDesktop({ state, actions }: LoginViewProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      {/* Card Central */}
      <main className="mt-5 flex flex-col items-center justify-center">
        <div className="mb-2 rounded-xl bg-[#00D084] p-2 shadow-lg shadow-[#00D084]/30">
          <Wallet className="text-white" size={50} />
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0F172A]">Bem-vindo!</h1>
          <p className="mt-2 max-w-[300px] text-sm text-gray-500">
            Acesse sua conta para gerenciar seu dinheiro com inteligência
          </p>
        </div>

        <form
          onSubmit={actions.handleLogin}
          className="w-full max-w-[400px] space-y-5"
        >
          <div className="space-y-2">
            <Label className="text-md font-semibold text-gray-700">
              E-mail
            </Label>
            <div className="relative">
              <Mail
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="exemplo@email.com"
                value={state.email}
                onChange={(e) => actions.setEmail(e.target.value)}
                className="h-12 rounded-xl border-gray-100 bg-white pl-12 text-black placeholder:text-black focus-visible:ring-[#00D084]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-md font-semibold text-gray-700">
                Senha
              </Label>
              <button
                type="button"
                className="text-xs font-bold text-[#00D084]"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <Lock
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type={state.mostrarSenha ? "text" : "password"}
                placeholder="........"
                value={state.senha}
                onChange={(e) => actions.setSenha(e.target.value)}
                className="h-12 rounded-xl border-gray-100 bg-white pr-12 pl-12 text-lg text-black placeholder:text-black focus-visible:ring-[#00D084]"
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

          {/* Erro Desktop: Alert Inline Minimalista */}
          {state.erro && (
            <div className="relative animate-in overflow-hidden rounded-xl border border-red-100 bg-red-50/50 p-4 duration-200 zoom-in-95">
              {/* Barrinha lateral de destaque */}
              <div className="absolute top-0 left-0 h-full w-1 bg-red-500" />

              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-800">
                    Ops! Algo deu errado
                  </h4>
                  <p className="mt-0.5 text-xs text-red-600/90">{state.erro}</p>
                </div>
              </div>
            </div>
          )}

          <Button
            className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#00D084] text-base font-bold text-white transition-all hover:bg-[#00B875]"
            disabled={state.carregando}
          >
            Entrar <ArrowRight size={20} />
          </Button>
        </form>

        <p className="mt-8 text-sm text-gray-500">
          Não tem uma conta?{" "}
          <span
            className="cursor-pointer font-bold text-[#00D084]"
            onClick={() => navigate("/register")}
          >
            Criar nova conta
          </span>
        </p>
      </main>
    </div>
  )
}
