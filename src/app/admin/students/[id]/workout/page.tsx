import { prisma } from "@/lib/prisma";
import { addWorkout, deleteWorkout } from "@/app/actions";
import { MoveLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function WorkoutManagerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const student = await prisma.student.findUnique({
    where: { id },
    include: { user: true, workouts: true }
  });

  if (!student) return notFound();

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", textDecoration: "none", marginBottom: "2rem" }}>
        <MoveLeft size={18} /> Voltar ao Painel
      </Link>

      <h2 style={{ marginBottom: "0.5rem" }}>Gerenciador de Treinos</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Aluno: <strong style={{ color: "var(--primary-color)" }}>{student.user.name}</strong></p>

      {/* Add New Workout Form */}
      <form action={addWorkout} className="glass" style={{ padding: "2rem", borderRadius: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "3rem" }}>
        <h3 style={{ fontSize: "1.25rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>Novo Treino</h3>
        <input type="hidden" name="studentId" value={student.id} />
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Título (ex: Treino A - Peito)</label>
          <input type="text" name="title" className="input-field" required placeholder="Treino A..." />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Descrição / Observações</label>
          <input type="text" name="description" className="input-field" placeholder="Foco em hipertrofia, cadência 2-0-2..." />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Exercícios (Séries x Repetições)</label>
          <textarea name="exercises" className="input-field" required rows={4} placeholder="- Supino Reto: 4x10&#10;- Crucifixo: 3x12"></textarea>
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Link do Vídeo (YouTube)</label>
          <input type="url" name="videoUrl" className="input-field" placeholder="https://youtube.com/watch?v=..." />
        </div>

        <button type="submit" className="btn btn-primary" style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
          <Plus size={20} /> Adicionar Treino
        </button>
      </form>

      {/* List Workouts */}
      <h3 style={{ marginBottom: "1rem" }}>Treinos Atuais ({student.workouts.length})</h3>
      
      {student.workouts.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", backgroundColor: "rgba(0,0,0,0.1)", borderRadius: "0.5rem" }}>
          Nenhum treino cadastrado para este aluno.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {student.workouts.map((workout) => (
            <div key={workout.id} className="glass" style={{ padding: "1.5rem", borderRadius: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ color: "var(--primary-color)", marginBottom: "0.5rem", fontSize: "1.1rem" }}>{workout.title}</h4>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <strong style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Data do Treinamento</strong>
                    <span style={{ fontSize: "0.95rem" }}>{workout.createdAt.toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div>
                    <strong style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Objetivos Principais</strong>
                    <span style={{ fontSize: "0.95rem" }}>{workout.description || "Nenhum objetivo específico definido"}</span>
                  </div>
                </div>
                
                <strong style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>O que foi feito (Exercícios)</strong>
                <div style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "0.5rem", whiteSpace: "pre-wrap", fontSize: "0.9rem", marginBottom: "1rem", fontFamily: "monospace", borderLeft: "3px solid var(--primary-color)" }}>
                  {workout.exercises}
                </div>

                {workout.videoUrl && (
                  <a href={workout.videoUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--vivid-green-cyan)", textDecoration: "none", fontSize: "0.9rem" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.125C2.5 7.125 2.5 5 4.625 5C5.875 5 12 5 12 5s6.125 0 7.375.0C21.5 5 21.5 7.125 21.5 7.125C21.5 7.125 21.5 10.5 21.5 12C21.5 13.5 21.5 16.875 21.5 16.875C21.5 16.875 21.5 19 19.375 19C18.125 19 12 19 12 19s-6.125 0-7.375 0C2.5 19 2.5 16.875 2.5 16.875C2.5 16.875 2.5 13.5 2.5 12C2.5 10.5 2.5 7.125 2.5 7.125z"/><polygon points="9.5 8 9.5 16 16.5 12 9.5 8"/></svg> Ver Vídeo Demonstrativo
                  </a>
                )}
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginLeft: "1rem" }}>
                {/* <Link href={`/admin/students/${student.id}/workout/${workout.id}/edit`} style={{ color: "var(--text-color)", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem", textDecoration: "none" }} title="Editar Treino">
                  <Pencil size={20} />
                </Link> */}
                <form action={async () => {
                  "use server";
                  await deleteWorkout(workout.id, student.id);
                }}>
                  <button type="submit" style={{ background: "none", border: "none", color: "var(--primary-color)", cursor: "pointer", padding: "0.5rem" }} title="Excluir Treino">
                    <Trash2 size={20} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
