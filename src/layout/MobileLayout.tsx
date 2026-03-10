interface MobileLayoutProps {
  children: React.ReactNode
  className?: string
}

export function MobileLayout({ children, className = "" }: MobileLayoutProps) {
  return (
    <div className={`min-h-screen bg-[#eef2ee] ${className}`}>{children}</div>
  )
}
