import { useLayout } from "@/hooks/useLayout"
import { useMetas } from "./useMeta"
import { MetasMobile } from "./MetaMobile"
import { MetasDesktop } from "./MetaDesktop"

export function MetasScreen() {
  const { isMobile } = useLayout()
  const metasProps = useMetas()
  return isMobile ? (
    <MetasMobile {...metasProps} />
  ) : (
    <MetasDesktop {...metasProps} />
  )
}
