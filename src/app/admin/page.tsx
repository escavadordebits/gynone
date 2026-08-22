import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UserPlus, Settings, FileText, CheckCircle, XCircle, Pencil, Trash2 } from "lucide-react";
import { approveStudent, rejectStudent, adminDeleteStudent } from "../actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const sessionRole = cookieStore.get("session_role")?.value;

  if (sessionRole !== "ADMIN") {
    redirect("/login");
  }
  const allStudents = await prisma.student.findMany({
    include: {
      user: true,
      anamnesis: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  const pendingStudents = allStudents.filter(s => s.status === 'PENDING');
  const activeStudents = allStudents.filter(s => s.status === 'APPROVED');

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: "2rem" }}>
        <h2>Dashboard - Alunos</h2>
        <Link href="/admin/students/new" className="btn btn-primary" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <UserPlus size={18} /> Novo Aluno
        </Link>
      </div>

      {pendingStudents.length > 0 && (
        <div style={{ marginBottom: "3rem" }}>
          <h3 style={{ color: "var(--primary-color)", marginBottom: "1rem" }}>Aprovações Pendentes</h3>
          <div className="glass" style={{ borderRadius: "0.5rem", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead style={{ backgroundColor: "rgba(232, 25, 24, 0.1)", borderBottom: "1px solid var(--border-color)" }}>
                <tr>
                  <th style={{ padding: "1rem" }}>Nome</th>
                  <th style={{ padding: "1rem" }}>Ações (Aprovação)</th>
                </tr>
              </thead>
              <tbody>
                {pendingStudents.map((student) => (
                  <tr key={student.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: 600 }}>{student.user.name}</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{student.user.email}</div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div className="flex gap-4">
                        <form action={async () => {
                          "use server";
                          await approveStudent(student.id, 150.0, "Plataforma");
                        }}>
                          <button type="submit" className="btn" style={{ padding: "0.5rem 1rem", backgroundColor: "var(--vivid-green-cyan)", color: "black", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <CheckCircle size={16} /> Aprovar (Plataforma)
                          </button>
                        </form>
                        <form action={async () => {
                          "use server";
                          await rejectStudent(student.id);
                        }}>
                          <button type="submit" className="btn" style={{ padding: "0.5rem 1rem", backgroundColor: "var(--surface-color)", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <XCircle size={16} /> Rejeitar
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <h3 style={{ marginBottom: "1rem" }}>Alunos Ativos</h3>
      <div className="glass" style={{ borderRadius: "0.5rem", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ backgroundColor: "rgba(0,0,0,0.2)", borderBottom: "1px solid var(--border-color)" }}>
            <tr>
              <th style={{ padding: "1rem" }}>Nome</th>
              <th style={{ padding: "1rem" }}>Local</th>
              <th style={{ padding: "1rem" }}>Pacote</th>
              <th style={{ padding: "1rem" }}>Anamnese</th>
              <th style={{ padding: "1rem" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {activeStudents.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                  Nenhum aluno ativo.
                </td>
              </tr>
            ) : (
              activeStudents.map((student) => (
                <tr key={student.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 600 }}>{student.user.name}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{student.user.email}</div>
                  </td>
                  <td style={{ padding: "1rem" }}>{student.location || "N/A"}</td>
                  <td style={{ padding: "1rem" }}>
                    {student.packageValue ? `R$ ${student.packageValue.toFixed(2)}` : "N/A"}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {student.anamnesis ? (
                      <span style={{ color: "var(--vivid-green-cyan)", fontWeight: 600 }}>Preenchida</span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>Pendente</span>
                    )}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div className="flex gap-4">
                      <Link href={`/admin/students/${student.id}/anamnesis`} style={{ color: "var(--primary-color)", display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none" }}>
                        <FileText size={18} /> Anamnese
                      </Link>
                      <Link href={`/admin/students/${student.id}/workout`} style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none" }}>
                        <Settings size={18} /> Treinos
                      </Link>
                      <Link href={`/admin/students/${student.id}/report`} target="_blank" style={{ color: "var(--vivid-green-cyan)", display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none" }}>
                        <FileText size={18} /> Relatório
                      </Link>
                      <Link href={`/admin/students/${student.id}/edit`} style={{ color: "var(--text-color)", display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none" }}>
                        <Pencil size={18} /> Editar
                      </Link>
                      <form action={async () => {
                        "use server";
                        await adminDeleteStudent(student.id);
                      }}>
                        <DeleteButton studentName={student.user.name} />
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
