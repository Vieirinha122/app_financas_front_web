import { useNavigate } from "react-router-dom"
import {
  User,
  Mail,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Shield,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { DesktopLayout } from "@/layout/DesktopLayout"
import { type PerfilViewProps } from "./usePerfil"

export function PerfilDesktop({ state, actions }: PerfilViewProps) {
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
      <DesktopLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00D084] border-t-transparent" />
        </div>
      </DesktopLayout>
    )
  }

  return (
    <DesktopLayout>
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
        <p className="mt-1 text-gray-500">
          Gerencie suas informações e segurança
        </p>
      </div>

      <div className="grid grid-cols-[280px_1fr] gap-6 xl:grid-cols-[320px_1fr]">
        {/* ── Coluna esquerda: avatar + info ── */}
        <div className="flex flex-col gap-4">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8">
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#00D084] shadow-lg shadow-[#00D084]/30">
                  <span className="text-3xl font-bold text-white">
                    {iniciais}
                  </span>
                </div>
                <div className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
                  <div className="h-3.5 w-3.5 rounded-full bg-[#00D084]" />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-lg font-bold text-white">{perfil?.nome}</h2>
                <p className="text-sm text-gray-400">{perfil?.email}</p>
              </div>

              <Badge
                variant="secondary"
                className="gap-1.5 text-xs text-gray-500"
              >
                <Calendar size={11} />
                Membro desde {membroDesde}
              </Badge>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardContent className="pt-4 pb-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-red-50">
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
            </CardContent>
          </Card>
        </div>

        {/* ── Coluna direita: formulários ── */}
        <div className="flex flex-col gap-5">
          {/* Feedback global */}
          {sucesso && (
            <div className="flex items-center gap-2 rounded-2xl bg-green-50 px-5 py-3.5">
              <Check size={16} className="text-[#00D084]" />
              <p className="text-sm font-semibold text-[#00D084]">{sucesso}</p>
            </div>
          )}

          {/* Card: Dados Pessoais */}
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6faf3]">
                    <User size={18} className="text-[#00D084]" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Dados Pessoais</CardTitle>
                    <CardDescription className="text-xs">
                      Nome e endereço de e-mail
                    </CardDescription>
                  </div>
                </div>
                {secaoAberta !== "dados" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => actions.abrirSecao("dados")}
                    className="rounded-xl text-xs"
                  >
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {secaoAberta !== "dados" ? (
                /* Modo leitura */
                <div className="mt-2 flex flex-col gap-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                    <User size={15} className="shrink-0 text-gray-400" />
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        Nome
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {perfil?.nome}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                    <Mail size={15} className="shrink-0 text-gray-400" />
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        E-mail
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {perfil?.email}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Modo edição */
                <div className="mt-2 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Nome completo
                      </Label>
                      <div className="relative">
                        <User
                          size={14}
                          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                          value={nome}
                          onChange={(e) => actions.setNome(e.target.value)}
                          className="h-11 rounded-xl border-gray-100 bg-gray-50 pl-9 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        E-mail
                      </Label>
                      <div className="relative">
                        <Mail
                          size={14}
                          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                        />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => actions.setEmail(e.target.value)}
                          className="h-11 rounded-xl border-gray-100 bg-gray-50 pl-9 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {erro && secaoAberta === "dados" && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3">
                      <AlertCircle size={14} className="text-red-500" />
                      <p className="text-sm text-red-600">{erro}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={actions.salvarDados}
                      disabled={salvando}
                      className="h-11 rounded-xl bg-[#00D084] px-6 text-sm font-bold hover:bg-[#00B875]"
                    >
                      {salvando ? "Salvando..." : "Salvar"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => actions.abrirSecao("dados")}
                      className="h-11 rounded-xl px-5 text-sm"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card: Segurança / Senha */}
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                    <Shield size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Segurança</CardTitle>
                    <CardDescription className="text-xs">
                      Altere sua senha de acesso
                    </CardDescription>
                  </div>
                </div>
                {secaoAberta !== "senha" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => actions.abrirSecao("senha")}
                    className="rounded-xl text-xs"
                  >
                    Alterar senha
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {secaoAberta !== "senha" ? (
                <div className="mt-2 flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                  <Lock size={15} className="shrink-0 text-gray-400" />
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      Senha
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      ••••••••
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex flex-col gap-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => actions.setMostrarSenhas(!mostrarSenhas)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#00D084]"
                    >
                      {mostrarSenhas ? <EyeOff size={13} /> : <Eye size={13} />}
                      {mostrarSenhas ? "Ocultar" : "Mostrar"} senhas
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
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
                            size={14}
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
                  </div>

                  {/* Indicador de força */}
                  {novaSenha && (
                    <div className="flex items-center gap-3">
                      <div className="flex flex-1 gap-1">
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
                      <span className="text-xs text-gray-400">
                        {novaSenha.length < 6
                          ? "Fraca"
                          : novaSenha.length < 9
                            ? "Média"
                            : novaSenha.length < 12
                              ? "Boa"
                              : "Forte"}
                      </span>
                    </div>
                  )}

                  {erro && secaoAberta === "senha" && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3">
                      <AlertCircle size={14} className="text-red-500" />
                      <p className="text-sm text-red-600">{erro}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={actions.salvarSenha}
                      disabled={salvando}
                      className="h-11 rounded-xl bg-[#00D084] px-6 text-sm font-bold hover:bg-[#00B875]"
                    >
                      {salvando ? "Atualizando..." : "Atualizar senha"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => actions.abrirSecao("senha")}
                      className="h-11 rounded-xl px-5 text-sm"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator className="opacity-0" />
        </div>
      </div>
    </DesktopLayout>
  )
}
