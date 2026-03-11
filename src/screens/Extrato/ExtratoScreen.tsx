import { useLayout } from "@/hooks/useLayout"
import { useExtrato } from "./useExtrato"
import { ExtratoMobile } from "./ExtratoMobile"
import { ExtratoDesktop } from "./ExtratoDesktop"

export function ExtratoScreen() {
  const { isMobile } = useLayout()
  const extratoProps = useExtrato()

  return isMobile ? (
    <ExtratoMobile {...extratoProps} />
  ) : (
    <ExtratoDesktop {...extratoProps} />
  )
}
