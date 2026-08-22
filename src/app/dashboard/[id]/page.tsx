import { prisma } from "@/lib/prisma";
import { MoveRight, Play, FileText } from "lucide-react";
import ExpressWorkoutCard from "@/components/ExpressWorkoutCard";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import { cookies } from "next/headers";

export default async function StudentDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const sessionStudentId = cookieStore.get("session_student_id")?.value;
  const sessionRole = cookieStore.get("session_role")?.value;

  if (sessionRole !== "ADMIN" && sessionStudentId !== id) {
    redirect("/login");
  }

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      user: true,
      workouts: true,
    }
  });

  if (!student) return notFound();

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container" style={{ marginTop: "3rem", paddingBottom: "4rem" }}>
        
        <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Olá, <span style={{ color: "var(--primary-color)" }}>{student.user.name.split(' ')[0]}</span>!
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "3rem", fontSize: "1.1rem" }}>
          Bem-vindo(a) ao seu painel de treinamento.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          
          {/* Seus Treinos */}
          <div className="glass" style={{ padding: "2rem", borderRadius: "1rem" }}>
            <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>Meus Treinos</h3>
            
            {student.workouts.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>Nenhum treino disponível ainda. O professor será notificado.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {student.workouts.map((workout) => (
                  <div key={workout.id} style={{ padding: "1.5rem", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "0.5rem", border: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                      <h4 style={{ color: "var(--vivid-green-cyan)", margin: 0, fontSize: "1.2rem" }}>{workout.title}</h4>
                      {workout.videoUrl && (
                        <a href={workout.videoUrl} target="_blank" rel="noreferrer" style={{ color: "var(--primary-color)", display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, backgroundColor: "rgba(232, 25, 24, 0.1)", padding: "0.25rem 0.5rem", borderRadius: "0.5rem" }} title="Ver Vídeo">
                          <Play size={16} /> Assistir
                        </a>
                      )}
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <strong style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Data do Treinamento</strong>
                        <span style={{ fontSize: "0.95rem" }}>{workout.createdAt.toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div>
                        <strong style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Objetivos Principais</strong>
                        <span style={{ fontSize: "0.95rem" }}>{workout.description || "Geral"}</span>
                      </div>
                    </div>
                    
                    <strong style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>O que deve ser feito (Exercícios)</strong>
                    <pre style={{ margin: 0, padding: "1rem", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "0.25rem", fontSize: "0.95rem", fontFamily: "monospace", whiteSpace: "pre-wrap", borderLeft: "3px solid var(--vivid-green-cyan)" }}>
                      {workout.exercises}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Treino Express (IA) */}
          <div className="glass" style={{ padding: "2rem", borderRadius: "1rem", display: "flex", flexDirection: "column" }}>
            <ExpressWorkoutCard studentId={student.id} />
          </div>
          
        </div>
      </div>
    </main>
  );
}
