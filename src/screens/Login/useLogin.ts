import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/useAuth";
import { loginUser } from "@/service/AuthService";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const setEmailWithClear = (val: string) => {
  setEmail(val);
  if (erro) setErro(""); // Limpa o erro ao digitar
};

const setSenhaWithClear = (val: string) => {
  setSenha(val);
  if (erro) setErro(""); // Limpa o erro ao digitar
};

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const { token, user } = await loginUser({ email, senha });
      signIn(token, user);
      navigate("/home");
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setCarregando(false);
    }
  }

  return {
    state: { email, senha, mostrarSenha, erro, carregando },
    actions: { setEmail: setEmailWithClear, setSenha: setSenhaWithClear, setMostrarSenha, handleLogin }
  };
}

// Criamos um tipo para as props para garantir que Mobile e Desktop usem o mesmo padrão
export type LoginViewProps = ReturnType<typeof useLogin>;