import { useLayout } from "@/hooks/useLayout"
import { useLogin } from "@/screens/Login/useLogin"
import { LoginMobile } from "@/screens/Login/LoginMobile"
import { LoginDesktop } from "@/screens/Login/LoginDesktop"

export function LoginScreen() {
  const { isMobile } = useLayout()
  const loginProps = useLogin()

  return isMobile ? (
    <LoginMobile {...loginProps} />
  ) : (
    <LoginDesktop {...loginProps} />
  )
}
