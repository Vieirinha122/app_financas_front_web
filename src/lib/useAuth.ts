import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

// separado do AuthContext para satisfazer a regra react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)