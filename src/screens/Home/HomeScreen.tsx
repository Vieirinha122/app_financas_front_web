import { useLayout } from "@/hooks/useLayout"
import { useHome } from "./useHome"
import { HomeMobile } from "./HomeMobile"
import { HomeDesktop } from "./HomeDesktop"

export function HomeScreen() {
  const { isMobile } = useLayout()
  const homeProps = useHome()

  return isMobile ? (
    <HomeMobile {...homeProps} />
  ) : (
    <HomeDesktop {...homeProps} />
  )
}
