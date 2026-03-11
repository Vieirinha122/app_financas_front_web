import {
  ShoppingCart,
  Car,
  Home,
  HeartPulse,
  Ticket,
  GraduationCap,
  MoreHorizontal,
  Utensils,
  Banknote,
} from "lucide-react"

const ICONES: Record<string, React.ReactNode> = {
  Comida: <Utensils size={18} />,
  Alimentação: <Utensils size={18} />,
  Transporte: <Car size={18} />,
  Compras: <ShoppingCart size={18} />,
  Casa: <Home size={18} />,
  Moradia: <Home size={18} />,
  Saúde: <HeartPulse size={18} />,
  Lazer: <Ticket size={18} />,
  Educação: <GraduationCap size={18} />,
  Salário: <Banknote size={18} />,
  Rendimentos: <Banknote size={18} />,
}

const COR_CATEGORIA: Record<string, string> = {
  Comida: "bg-orange-100 text-orange-500",
  Alimentação: "bg-orange-100 text-orange-500",
  Transporte: "bg-blue-100 text-blue-500",
  Compras: "bg-purple-100 text-purple-500",
  Casa: "bg-yellow-100 text-yellow-600",
  Moradia: "bg-yellow-100 text-yellow-600",
  Saúde: "bg-red-100 text-red-500",
  Lazer: "bg-pink-100 text-pink-500",
  Educação: "bg-indigo-100 text-indigo-500",
  Salário: "bg-green-100 text-green-600",
  Rendimentos: "bg-green-100 text-green-600",
}

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

interface Props {
  descricao: string
  categoria: string
  data: string
  valor: number
  tipo: "RECEITA" | "DESPESA"
}

export function TransacaoRow({
  descricao,
  categoria,
  data,
  valor,
  tipo,
}: Props) {
  const cor = COR_CATEGORIA[categoria] ?? "bg-gray-100 text-gray-500"
  const icone = ICONES[categoria] ?? <MoreHorizontal size={18} />

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${cor}`}
      >
        {icone}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">
          {descricao}
        </p>
        <p className="text-xs text-gray-400">
          {categoria} • {data}
        </p>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-bold ${tipo === "RECEITA" ? "text-[#00D084]" : "text-red-500"}`}
        >
          {tipo === "RECEITA" ? "+" : "-"} {fmt(Math.abs(valor))}
        </p>
      </div>
    </div>
  )
}
