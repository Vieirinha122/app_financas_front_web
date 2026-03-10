import { useNavigate, useLocation } from "react-router-dom"
import { Bell } from "lucide-react"
import { useAuth } from "@/lib/useAuth"

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
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#f0f2f0]">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          {/* Logo */}
          <div
            className="flex cursor-pointer items-center gap-2.5"
            onClick={() => navigate("/home")}
          ></div>

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
                      ? "text-[#00D084]"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                  {ativo && (
                    <div className="mx-auto mt-0.5 h-0.5 w-4/5 rounded-full bg-[#00D084]" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Sino + avatar */}
          <div className="flex items-center gap-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200">
              <Bell size={18} />
            </button>
            <button
              onClick={() => navigate("/perfil")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00D084] text-sm font-bold text-white transition-opacity hover:opacity-80"
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

      <main className="mx-auto max-w-7xl px-8 py-8">{children}</main>
    </div>
  )
}
