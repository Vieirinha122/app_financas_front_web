import { Plus, Target, BarChart2 } from "lucide-react"

interface AcoesRapidasProps {
  onNovaTransacao: () => void
  onMetas: () => void
  onRelatorios: () => void
}

function AcaoItem({
  icone,
  label,
  onClick,
}: {
  icone: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer flex-col items-center gap-2"
    >
      <div className="rounded-2xl bg-green-50 p-4 transition-colors hover:bg-green-100">
        {icone}
      </div>
      <span className="text-xs font-medium text-gray-600">{label}</span>
    </button>
  )
}

export function AcoesRapidas({
  onNovaTransacao,
  onMetas,
  onRelatorios,
}: AcoesRapidasProps) {
  return (
    <div className="flex justify-around">
      <AcaoItem
        icone={<Plus size={22} className="text-green-600" />}
        label="Nova Transação"
        onClick={onNovaTransacao}
      />
      <AcaoItem
        icone={<Target size={22} className="text-green-600" />}
        label="Metas"
        onClick={onMetas}
      />
      <AcaoItem
        icone={<BarChart2 size={22} className="text-green-600" />}
        label="Relatórios"
        onClick={onRelatorios}
      />
    </div>
  )
}
