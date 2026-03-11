import { useState, useEffect } from "react"

export function formatarReal(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (!digits) return ""
  const num = parseInt(digits, 10) / 100
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function rawParaFloat(raw: string): number {
  const digits = raw.replace(/\D/g, "")
  if (!digits) return 0
  return parseInt(digits, 10) / 100
}

export function useValorFormatado(valorInicial = "") {
  const toRaw = (v: string) => {
    if (!v) return ""
    const num = parseFloat(v.replace(",", "."))
    if (isNaN(num)) return ""
    return Math.round(num * 100).toString()
  }

  const [raw, setRaw] = useState(() => toRaw(valorInicial))

  // sincroniza ao abrir edição de meta diferente
  useEffect(() => {
    setRaw(toRaw(valorInicial))
  }, [valorInicial])

  function onChangeFormatado(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "")
    setRaw(digits)
  }

  function pressDigito(d: string) {
    setRaw((prev) => (prev + d).replace(/^0+/, "") || "0")
  }

  function pressDelete() {
    setRaw((prev) => prev.slice(0, -1))
  }

  function resetar() {
    setRaw("")
  }

  return {
    raw,
    valorFormatado: formatarReal(raw),
    valorNumerico:  rawParaFloat(raw),
    onChangeFormatado,
    pressDigito,
    pressDelete,
    resetar,
  }
}