import { requestAccess } from "@/app/actions";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div className="glass" style={{ maxWidth: "450px", width: "100%", padding: "2.5rem", borderRadius: "1rem" }}>
        
        {error === "email_exists" && (
          <div style={{ padding: "1rem", backgroundColor: "rgba(232, 25, 24, 0.1)", color: "var(--primary-color)", borderRadius: "0.5rem", marginBottom: "1.5rem", textAlign: "center", fontSize: "0.9rem", border: "1px solid var(--primary-color)" }}>
            Este e-mail já está cadastrado no sistema!
          </div>
        )}

        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Solicitar Acesso</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Preencha seus dados para solicitar o acesso à plataforma. Seu perfil passará por aprovação do professor.
        </p>

        <form action={requestAccess} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>Nome Completo</label>
            <input 
              type="text" 
              name="name" 
              className="input-field" 
              placeholder="Seu nome" 
              required 
            />
          </div>
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
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>Crie uma Senha</label>
            <input 
              type="password" 
              name="password" 
              className="input-field" 
              placeholder="••••••••" 
              required 
              minLength={6}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: "100%", display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
            Enviar Solicitação <UserPlus size={20} />
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Já tem uma conta? <Link href="/login" style={{ color: "var(--primary-color)", textDecoration: "none" }}>Faça Login</Link>
        </div>
      </div>
    </div>
  );
}
