import { useNavigate, useLocation } from "react-router-dom"
import { Bell } from "lucide-react"
import { useAuth } from "../lib/useAuth"

// Itens do navbar — adicione novas rotas aqui
const NAV_ITEMS = [
  { label: "Início", path: "/home" },
  { label: "Extrato", path: "/extrato" },
  { label: "Metas", path: "/metas" },
  { label: "Perfil", path: "/perfil" },
]

interface DesktopLayoutProps {
  children: React.ReactNode
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()

  function handleLogout() {
    signOut()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-[#f0f2f0]">
      {/* Navbar top */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          {/* Logo */}
          <div
            className="flex cursor-pointer items-center gap-2.5"
            onClick={() => navigate("/home")}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1db96a]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="8" rx="2" fill="white" />
                <rect
                  x="13"
                  y="3"
                  width="8"
                  height="8"
                  rx="2"
                  fill="white"
                  fillOpacity="0.5"
                />
                <rect
                  x="3"
                  y="13"
                  width="8"
                  height="8"
                  rx="2"
                  fill="white"
                  fillOpacity="0.5"
                />
                <rect x="13" y="13" width="8" height="8" rx="2" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">Finanças</span>
          </div>

          {/* Links de navegação */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const ativo = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    ativo
                      ? "text-[#1db96a]"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                  {/* underline ativo */}
                  {ativo && (
                    <div className="mx-auto mt-0.5 h-0.5 w-4/5 rounded-full bg-[#1db96a]" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Ações direita: sino + avatar */}
          <div className="flex items-center gap-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200">
              <Bell size={18} />
            </button>

            {/* Avatar com iniciais — clica vai pro perfil */}
            <button
              onClick={() => navigate("/perfil")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-gray-700 transition-opacity hover:opacity-80"
            >
              {user?.nome
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo da página */}
      <main className="mx-auto max-w-7xl px-8 py-8">{children}</main>
    </div>
  )
}
