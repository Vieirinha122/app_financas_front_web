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
    <div className="relative overflow-hidden rounded-3xl bg-green-600 p-5 sm:p-6 md:p-8">
      {/* Círculos decorativos — crescem no desktop */}
      <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-green-500 opacity-40 sm:h-48 sm:w-48 md:-top-10 md:-right-10 md:h-60 md:w-60" />
      <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-green-500 opacity-20 md:h-36 md:w-36" />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-sm text-white opacity-90 sm:text-base">
          Saldo Total
        </span>
        <button
          onClick={() => setMostrar(!mostrar)}
          className="rounded-full bg-white/20 p-1.5 text-white transition-colors hover:bg-white/30"
        >
          {mostrar ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>

      <p className="relative z-10 mt-2 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
        {mostrar ? fmt(saldoTotal) : "R$ ••••••"}
      </p>

      <div className="relative z-10 mt-3 flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1">
          {positivo ? (
            <TrendingUp size={13} color="white" />
          ) : (
            <TrendingDown size={13} color="white" />
          )}
          <span className="text-xs font-semibold text-white sm:text-sm">
            {positivo ? "+" : ""}
            {percentualVariacao}%
          </span>
        </div>
        <span className="text-xs text-white opacity-80 sm:text-sm">
          este mês
        </span>
      </div>
    </div>
  )
}
