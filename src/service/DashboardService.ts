const API_URL = import.meta.env.VITE_API_URL;

export interface DashboardData {
  resumo: {
    saldoTotal: number;
    totalReceitas: number;
    totalDespesas: number;
    mes: {
      receitas: number;
      despesas: number;
      saldo: number;
      percentualVariacao: number;
    };
  };
  grafico: {
    dias: { dia: string; data: string; total: number }[];
    totalPeriodo: number;
  };
  ultimasTransacoes: {
    id: string;
    descricao: string;
    valor: number;
    tipo: 'RECEITA' | 'DESPESA';
    categoria: string;
    data: string;
  }[];
}

export async function getDashboard(token: string): Promise<DashboardData> {
  const res = await fetch(`${API_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erro ao buscar dashboard.');
  return res.json();
}