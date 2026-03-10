import { useContext } from "react"
import { LayoutContext } from "@/context/LayoutContex"

export function useLayout() {
  return useContext(LayoutContext)
}