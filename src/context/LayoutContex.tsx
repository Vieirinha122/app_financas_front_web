import { createContext, useEffect, useState } from "react"

type LayoutMode = "mobile" | "desktop"

interface LayoutContextData {
  mode: LayoutMode
  isMobile: boolean
  isDesktop: boolean
}

export const LayoutContext = createContext<LayoutContextData>(
  {} as LayoutContextData
)

// breakpoint: abaixo de 768px é mobile (PWA), acima é desktop
const MOBILE_BREAKPOINT = 768

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<LayoutMode>(() =>
    window.innerWidth < MOBILE_BREAKPOINT ? "mobile" : "desktop"
  )

  useEffect(() => {
    function handleResize() {
      setMode(window.innerWidth < MOBILE_BREAKPOINT ? "mobile" : "desktop")
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <LayoutContext.Provider
      value={{
        mode,
        isMobile: mode === "mobile",
        isDesktop: mode === "desktop",
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}
