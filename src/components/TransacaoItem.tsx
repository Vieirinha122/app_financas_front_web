import {
  ShoppingBag,
  ArrowDownCircle,
  Coffee,
  Car,
  Home,
  Heart,
  Gift,
  Wallet,
} from "lucide-react"

interface TransacaoItemProps {
  descricao: string
  data: string
  valor: number
  tipo: "RECEITA" | "DESPESA"
  categoria: string
}

const iconeCategoria = (categoria: string) => {
  const c = categoria.toLowerCase()
  if (c.includes("alimentação") || c.includes("mercado"))
    return <ShoppingBag size={18} className="text-red-500" />
  if (c.includes("café") || c.includes("restaurante"))
    return <Coffee size={18} className="text-orange-500" />
  if (c.includes("transporte") || c.includes("uber"))
    return <Car size={18} className="text-blue-500" />
  if (c.includes("moradia"))
    return <Home size={18} className="text-purple-500" />
  if (c.includes("saúde")) return <Heart size={18} className="text-pink-500" />
  if (c.includes("lazer")) return <Gift size={18} className="text-yellow-500" />
  if (c.includes("salário"))
    return <Wallet size={18} className="text-green-600" />
  return <ArrowDownCircle size={18} className="text-green-600" />
}

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function TransacaoItem({
  descricao,
  data,
  valor,
  tipo,
  categoria,
}: TransacaoItemProps) {
  const isReceita = tipo === "RECEITA"
  return (
    <div className="flex cursor-pointer items-center gap-3 rounded-xl px-1 py-3 transition-colors hover:bg-gray-50 sm:gap-4 sm:py-4">
      <div
        className={`shrink-0 rounded-full p-2.5 sm:p-3 ${isReceita ? "bg-green-50" : "bg-red-50"}`}
      >
        {iconeCategoria(categoria)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
          {descricao}
        </p>
        <p className="text-xs text-gray-400 sm:text-sm">{data}</p>
      </div>
      <span
        className={`shrink-0 text-sm font-bold sm:text-base ${isReceita ? "text-green-600" : "text-gray-900"}`}
      >
        {isReceita ? "+ " : "− "}
        {fmt(Math.abs(valor))}
      </span>
    </div>
  )
}
