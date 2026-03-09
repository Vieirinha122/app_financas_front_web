const API_URL = import.meta.env.VITE_API_URL;

export type LoginDTO = { email: string; senha: string };
export type RegisterDTO = { nome: string; email: string; senha: string };
export type AuthResponse = {
  token: string;
  user: { id: string; nome: string; email: string };
};

export async function loginUser(data: LoginDTO): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'E-mail ou senha incorretos.');
  }
  return res.json();
}

export async function registerUser(data: RegisterDTO): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Erro ao criar conta.');
  }
  return res.json();
}