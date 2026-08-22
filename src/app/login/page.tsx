import Link from "next/link";
import { MoveRight } from "lucide-react";
import { loginUser } from "@/app/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ requested?: string, error?: string }> }) {
  const { requested, error } = await searchParams;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div className="glass" style={{ maxWidth: "400px", width: "100%", padding: "2.5rem", borderRadius: "1rem" }}>
        
        {requested === "true" && (
          <div style={{ padding: "1rem", backgroundColor: "rgba(232, 25, 24, 0.1)", color: "var(--primary-color)", borderRadius: "0.5rem", marginBottom: "1.5rem", textAlign: "center", fontSize: "0.9rem", border: "1px solid var(--primary-color)" }}>
            Solicitação de acesso enviada! Aguarde a aprovação do professor.
          </div>
        )}

        {error === "invalid" && (
          <div style={{ padding: "1rem", backgroundColor: "rgba(232, 25, 24, 0.1)", color: "var(--primary-color)", borderRadius: "0.5rem", marginBottom: "1.5rem", textAlign: "center", fontSize: "0.9rem", border: "1px solid var(--primary-color)" }}>
            Email ou senha incorretos!
          </div>
        )}

        {error === "pending" && (
          <div style={{ padding: "1rem", backgroundColor: "rgba(255, 255, 255, 0.1)", color: "var(--text-color)", borderRadius: "0.5rem", marginBottom: "1.5rem", textAlign: "center", fontSize: "0.9rem", border: "1px solid var(--border-color)" }}>
            Sua conta ainda está aguardando a aprovação do professor. Tente novamente mais tarde.
          </div>
        )}

        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Acesso ao Sistema</h2>
        
        <form action={loginUser} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>Email</label>
            <input 
              type="email" 
              name="email" 
              className="input-field" 
              placeholder="seu@email.com" 
              required 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>Senha</label>
            <input 
              type="password" 
              name="password" 
              className="input-field" 
              placeholder="••••••••" 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: "100%", display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
            Entrar <MoveRight size={20} />
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Ainda não é aluno? <Link href="/register" style={{ color: "var(--primary-color)", textDecoration: "none" }}>Solicite seu acesso</Link>
        </div>
      </div>
    </div>
  );
}
