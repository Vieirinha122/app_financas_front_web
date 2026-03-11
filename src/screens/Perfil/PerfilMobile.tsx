import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Home,
  FileText,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { type PerfilViewProps } from "./usePerfil"

export function PerfilMobile({ state, actions }: PerfilViewProps) {
  const navigate = useNavigate()
  const {
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
    perfil,
  } = state

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f2f0]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00D084] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f0] pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/home")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Perfil</h1>
          <div className="w-9" />
        </div>

        {/* Avatar + info */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#00D084] shadow-lg shadow-[#00D084]/30">
              <span className="text-2xl font-bold text-white">{iniciais}</span>
            </div>
            <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
              <div className="h-3 w-3 rounded-full bg-[#00D084]" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900">{perfil?.nome}</h2>
            <p className="text-sm text-gray-400">{perfil?.email}</p>
          </div>
          <Badge variant="secondary" className="text-xs text-gray-500">
            Membro desde {membroDesde}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 pt-5">
        {/* Feedback global */}
        {sucesso && (
          <div className="flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3">
            <Check size={16} className="text-[#00D084]" />
            <p className="text-sm font-medium text-[#00D084]">{sucesso}</p>
          </div>
        )}

        {/* Seção: Dados Pessoais */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <button
            onClick={() => actions.abrirSecao("dados")}
            className="flex w-full items-center justify-between px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6faf3]">
                <User size={18} className="text-[#00D084]" />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Dados Pessoais
              </span>
            </div>
            <ChevronRight
              size={18}
              className={`text-gray-400 transition-transform duration-200 ${secaoAberta === "dados" ? "rotate-90" : ""}`}
            />
          </button>

          {secaoAberta === "dados" && (
            <div className="border-t border-gray-50 px-5 pb-5">
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Nome completo
                  </Label>
                  <div className="relative">
                    <User
                      size={15}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      value={nome}
                      onChange={(e) => actions.setNome(e.target.value)}
                      className="h-11 rounded-xl border-gray-100 bg-gray-50 pl-9 text-sm"
                      placeholder="Seu nome"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    E-mail
                  </Label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => actions.setEmail(e.target.value)}
                      className="h-11 rounded-xl border-gray-100 bg-gray-50 pl-9 text-sm"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                {erro && secaoAberta === "dados" && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5">
                    <AlertCircle size={14} className="text-red-500" />
                    <p className="text-xs font-medium text-red-600">{erro}</p>
                  </div>
                )}

                <Button
                  onClick={actions.salvarDados}
                  disabled={salvando}
                  className="h-11 w-full rounded-xl bg-[#00D084] text-sm font-bold hover:bg-[#00B875]"
                >
                  {salvando ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Seção: Alterar Senha */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <button
            onClick={() => actions.abrirSecao("senha")}
            className="flex w-full items-center justify-between px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <Lock size={18} className="text-blue-500" />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Alterar Senha
              </span>
            </div>
            <ChevronRight
              size={18}
              className={`text-gray-400 transition-transform duration-200 ${secaoAberta === "senha" ? "rotate-90" : ""}`}
            />
          </button>

          {secaoAberta === "senha" && (
            <div className="border-t border-gray-50 px-5 pb-5">
              <div className="flex flex-col gap-4 pt-4">
                {/* Toggle mostrar senhas */}
                <button
                  type="button"
                  onClick={() => actions.setMostrarSenhas(!mostrarSenhas)}
                  className="flex items-center gap-2 self-end text-xs font-semibold text-[#00D084]"
                >
                  {mostrarSenhas ? <EyeOff size={13} /> : <Eye size={13} />}
                  {mostrarSenhas ? "Ocultar" : "Mostrar"} senhas
                </button>

                {[
                  {
                    label: "Senha atual",
                    value: senhaAtual,
                    set: actions.setSenhaAtual,
                  },
                  {
                    label: "Nova senha",
                    value: novaSenha,
                    set: actions.setNovaSenha,
                  },
                  {
                    label: "Confirmar senha",
                    value: confirmarSenha,
                    set: actions.setConfirmarSenha,
                  },
                ].map(({ label, value, set }) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      {label}
                    </Label>
                    <div className="relative">
                      <Lock
                        size={15}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        type={mostrarSenhas ? "text" : "password"}
                        value={value}
                        onChange={(e) => set(e.target.value)}
                        className="h-11 rounded-xl border-gray-100 bg-gray-50 pl-9 text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                ))}

                {/* Dica força de senha */}
                {novaSenha && (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          novaSenha.length >= i * 3
                            ? novaSenha.length >= 12
                              ? "bg-[#00D084]"
                              : "bg-yellow-400"
                            : "bg-gray-100"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {erro && secaoAberta === "senha" && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5">
                    <AlertCircle size={14} className="text-red-500" />
                    <p className="text-xs font-medium text-red-600">{erro}</p>
                  </div>
                )}

                <Button
                  onClick={actions.salvarSenha}
                  disabled={salvando}
                  className="h-11 w-full rounded-xl bg-[#00D084] text-sm font-bold hover:bg-[#00B875]"
                >
                  {salvando ? "Atualizando..." : "Atualizar senha"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="rounded-3xl bg-white shadow-sm">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex w-full items-center gap-3 px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                  <LogOut size={18} className="text-red-500" />
                </div>
                <span className="text-sm font-semibold text-red-500">
                  Sair da conta
                </span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Sair da conta?</AlertDialogTitle>
                <AlertDialogDescription>
                  Você será redirecionado para a tela de login.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    actions.signOut()
                    navigate("/")
                  }}
                  className="rounded-xl bg-red-500 hover:bg-red-600"
                >
                  Sair
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Separator className="opacity-0" />
      </div>

      {/* Bottom nav */}
      <nav className="fixed right-0 bottom-0 left-0 flex items-center justify-around border-t border-gray-100 bg-white px-4 py-3">
        {[
          { icone: <Home size={22} />, label: "INÍCIO", path: "/home" },
          { icone: <FileText size={22} />, label: "EXTRATO", path: "/extrato" },
          { icone: <Target size={22} />, label: "METAS", path: "/metas" },
          { icone: <User size={22} />, label: "PERFIL", path: "/perfil" },
        ].map((item) => {
          const ativo = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 ${ativo ? "text-[#00D084]" : "text-gray-400"}`}
            >
              {item.icone}
              <span className="text-[10px] font-semibold tracking-wider">
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
