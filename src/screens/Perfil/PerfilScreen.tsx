import { useLayout } from "@/hooks/useLayout"
import { usePerfil } from "./usePerfil"
import { PerfilMobile } from "./PerfilMobile"
import { PerfilDesktop } from "./PerfilDesktop"

export function PerfilScreen() {
  const { isMobile } = useLayout()
  const perfilProps = usePerfil()
  return isMobile ? (
    <PerfilMobile {...perfilProps} />
  ) : (
    <PerfilDesktop {...perfilProps} />
  )
}
