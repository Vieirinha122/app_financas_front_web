import { useLayout } from "../hooks/useLayout"
import { MobileLayout } from "./MobileLayout"
import { DesktopLayout } from "./DesktopLayout"

interface AppLayoutProps {
  children: React.ReactNode
  // páginas públicas (login) não mostram navbar no desktop
  isPublic?: boolean
  className?: string
}

export function AppLayout({
  children,
  isPublic = false,
  className,
}: AppLayoutProps) {
  const { isMobile } = useLayout()

  // mobile: sempre MobileLayout (sem navbar)
  if (isMobile) {
    return <MobileLayout className={className}>{children}</MobileLayout>
  }

  // desktop público (login/register): sem navbar
  if (isPublic) {
    return (
      <div className={`min-h-screen bg-[#f0f2f0] ${className ?? ""}`}>
        {children}
      </div>
    )
  }

  // desktop autenticado: com navbar
  return <DesktopLayout>{children}</DesktopLayout>
}
