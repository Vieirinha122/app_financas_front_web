import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

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

// Tooltip customizado
function TooltipCustom({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: DiaDados; value: number }[]
}) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-semibold">{d.payload.data}</p>
      <p className="text-green-400">{fmt(d.value)}</p>
    </div>
  )
}

export function GraficoGastos({ dias, totalPeriodo }: GraficoGastosProps) {
  const maiorValor = Math.max(...dias.map((d) => d.total))

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-bold text-gray-900 sm:text-lg">
          Gastos (7 dias)
        </span>
        <span className="text-sm font-semibold text-green-600 sm:text-base">
          {fmt(totalPeriodo)} total
        </span>
      </div>

      {/* Altura cresce progressivamente em cada breakpoint */}
      <ResponsiveContainer
        width="100%"
        height={140}
        className="sm:!h-[170px] md:!h-[200px] lg:!h-[220px]"
      >
        <BarChart
          data={dias}
          barSize={28}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <XAxis
            dataKey="dia"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
          />
          <YAxis hide />
          <Tooltip
            content={<TooltipCustom />}
            cursor={{ fill: "transparent" }}
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
