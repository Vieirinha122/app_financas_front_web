import { useState } from "react"
import { Eye, EyeOff, TrendingUp, TrendingDown } from "lucide-react"

interface SaldoCardProps {
  saldoTotal: number
  percentualVariacao: number
}

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function SaldoCard({ saldoTotal, percentualVariacao }: SaldoCardProps) {
  const [mostrar, setMostrar] = useState(true)
  const positivo = percentualVariacao >= 0

  return (
    <div className="relative overflow-hidden rounded-3xl bg-green-600 p-5">
      {/* Círculo decorativo */}
      <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-green-500 opacity-40" />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-sm text-white opacity-90">Saldo Total</span>
        <button onClick={() => setMostrar(!mostrar)} className="text-white">
          {mostrar ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>

      <p className="relative z-10 mt-2 text-3xl font-bold text-white">
        {mostrar ? fmt(saldoTotal) : "R$ ••••••"}
      </p>

      <div className="relative z-10 mt-3 flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1">
          {positivo ? (
            <TrendingUp size={12} color="white" />
          ) : (
            <TrendingDown size={12} color="white" />
          )}
          <span className="text-xs font-semibold text-white">
            {positivo ? "+" : ""}
            {percentualVariacao}%
          </span>
        </div>
        <span className="text-xs text-white opacity-80">este mês</span>
      </div>
    </div>
  )
}
