const API_URL = import.meta.env.VITE_API_URL;

export interface CriarTransacaoDTO {
  descricao: string;
  valor: number;
  tipo: 'RECEITA' | 'DESPESA';
  categoria: string;
}

export async function criarTransacao(data: CriarTransacaoDTO, token: string) {
  const res = await fetch(`${API_URL}/transacoes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao salvar transação.');
  return res.json();
}