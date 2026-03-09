import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts"

interface DiaDados {
  dia: string
  data: string
  total: number
}

interface GraficoGastosProps {
  dias: DiaDados[]
  totalPeriodo: number
}

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function GraficoGastos({ dias, totalPeriodo }: GraficoGastosProps) {
  const maiorValor = Math.max(...dias.map((d) => d.total))

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-bold text-gray-900">Gastos (7 dias)</span>
        <span className="text-sm font-semibold text-green-600">
          {fmt(totalPeriodo)} total
        </span>
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={dias} barSize={28}>
          <XAxis
            dataKey="dia"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {dias.map((d, i) => (
              <Cell
                key={i}
                fill={
                  d.total === maiorValor && maiorValor > 0
                    ? "#16a34a"
                    : "#bbf7d0"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
