import { adminUpdateStudent } from "@/app/actions";
import { MoveLeft, Save } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditStudentPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;

  const student = await prisma.student.findUnique({
    where: { id },
    include: { user: true }
  });

  if (!student) return notFound();

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", textDecoration: "none", marginBottom: "2rem" }}>
        <MoveLeft size={18} /> Voltar ao Painel
      </Link>

      <h2 style={{ marginBottom: "0.5rem" }}>Editar Aluno</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        Atualize os dados cadastrais do aluno.
      </p>

      <form action={adminUpdateStudent} className="glass" style={{ padding: "2.5rem", borderRadius: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {error === "email_exists" && (
          <div style={{ padding: "1rem", backgroundColor: "rgba(232, 25, 24, 0.1)", color: "var(--primary-color)", borderRadius: "0.5rem", marginBottom: "0.5rem", textAlign: "center", fontSize: "0.9rem", border: "1px solid var(--primary-color)" }}>
            Este e-mail já está em uso por outro usuário!
          </div>
        )}

        <input type="hidden" name="studentId" value={student.id} />

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Nome Completo</label>
          <input type="text" name="name" defaultValue={student.user.name} className="input-field" required />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>E-mail de Acesso</label>
          <input type="email" name="email" defaultValue={student.user.email} className="input-field" required />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Nova Senha (opcional)</label>
          <input type="text" name="password" className="input-field" placeholder="Deixe em branco para manter a atual" minLength={6} />
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
            Preencha apenas se quiser alterar a senha do aluno.
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Local do Treino</label>
            <select name="location" defaultValue={student.location || "Plataforma"} className="input-field" required>
              <option value="Plataforma">Plataforma (Online)</option>
              <option value="Presencial">Presencial</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Valor do Pacote (R$)</label>
            <input type="number" step="0.01" name="packageValue" defaultValue={student.packageValue || 0} className="input-field" required />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
          <Save size={20} /> Salvar Alterações
        </button>
      </form>
    </div>
  );
}
