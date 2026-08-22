import { adminCreateStudent } from "@/app/actions";
import { MoveLeft, UserPlus } from "lucide-react";
import Link from "next/link";

export default async function NewStudentPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", textDecoration: "none", marginBottom: "2rem" }}>
        <MoveLeft size={18} /> Voltar ao Painel
      </Link>

      <h2 style={{ marginBottom: "0.5rem" }}>Cadastrar Novo Aluno</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        Alunos cadastrados por aqui já entram como <strong style={{ color: "var(--vivid-green-cyan)" }}>Ativos</strong> automaticamente.
      </p>

      <form action={adminCreateStudent} className="glass" style={{ padding: "2.5rem", borderRadius: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {error === "email_exists" && (
          <div style={{ padding: "1rem", backgroundColor: "rgba(232, 25, 24, 0.1)", color: "var(--primary-color)", borderRadius: "0.5rem", marginBottom: "0.5rem", textAlign: "center", fontSize: "0.9rem", border: "1px solid var(--primary-color)" }}>
            Este e-mail já está em uso por outro aluno!
          </div>
        )}

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Nome Completo</label>
          <input type="text" name="name" className="input-field" placeholder="Ex: João da Silva" required />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>E-mail de Acesso</label>
          <input type="email" name="email" className="input-field" placeholder="joao@email.com" required />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Senha Temporária</label>
          <input type="text" name="password" className="input-field" placeholder="Ex: Mudar123" required minLength={6} />
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
            O aluno usará essa senha para o primeiro login.
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Local do Treino</label>
            <select name="location" className="input-field" required>
              <option value="Plataforma">Plataforma (Online)</option>
              <option value="Presencial">Presencial</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Valor do Pacote (R$)</label>
            <input type="number" step="0.01" name="packageValue" className="input-field" placeholder="150.00" required />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
          <UserPlus size={20} /> Cadastrar e Ativar Aluno
        </button>
      </form>
    </div>
  );
}
