import { prisma } from "@/lib/prisma";
import { MoveRight, Play, FileText, Activity, Dumbbell, Trophy } from "lucide-react";
import ExpressWorkoutCard from "@/components/ExpressWorkoutCard";
import VideoPlayerCard from "@/components/VideoPlayerCard";
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
      assessments: {
        where: { isVisibleToStudent: true },
        orderBy: { createdAt: "desc" }
      }
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

        {/* Seção de Avaliação Física (Visível para o Aluno) */}
        {student.assessments.length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Trophy size={20} color="var(--vivid-green-cyan)" /> Minhas Avaliações Físicas
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {/* Card VO2máx Cooper */}
              {student.assessments[0].cooperVo2Max && (
                <div className="glass" style={{ padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(0, 208, 132, 0.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--vivid-green-cyan)", fontWeight: 700 }}>
                      <Activity size={20} /> Teste de Cooper (VO₂máx)
                    </div>
                    <span style={{ 
                      fontSize: "0.8rem", 
                      padding: "0.2rem 0.6rem", 
                      borderRadius: "1rem", 
                      fontWeight: 700,
                      backgroundColor: student.assessments[0].cooperClassification === "Excelente" || student.assessments[0].cooperClassification === "Bom" ? "rgba(0, 208, 132, 0.2)" : "rgba(255, 180, 0, 0.2)",
                      color: student.assessments[0].cooperClassification === "Excelente" || student.assessments[0].cooperClassification === "Bom" ? "var(--vivid-green-cyan)" : "#ffb400"
                    }}>
                      {student.assessments[0].cooperClassification}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", margin: "0.5rem 0" }}>
                    <span style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--vivid-green-cyan)" }}>
                      {student.assessments[0].cooperVo2Max.toFixed(1)}
                    </span>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>mL/kg/min</span>
                  </div>

                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Distância em 12 min: <strong style={{ color: "white" }}>{student.assessments[0].cooperDistance} metros</strong>
                  </p>
                </div>
              )}

              {/* Card 1RM Estimado */}
              {student.assessments[0].oneRmResultEpley && (
                <div className="glass" style={{ padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(232, 25, 24, 0.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary-color)", fontWeight: 700 }}>
                      <Dumbbell size={20} /> Força Máxima Estimada (1RM)
                    </div>
                    <span style={{ fontSize: "0.8rem", padding: "0.2rem 0.6rem", borderRadius: "1rem", fontWeight: 700, backgroundColor: "rgba(232, 25, 24, 0.15)", color: "var(--primary-color)" }}>
                      {student.assessments[0].oneRmExercise || "Geral"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", margin: "0.5rem 0" }}>
                    <span style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--primary-color)" }}>
                      {student.assessments[0].oneRmResultEpley.toFixed(1)}
                    </span>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>kg (100% 1RM)</span>
                  </div>

                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Carga teste: <strong style={{ color: "white" }}>{student.assessments[0].oneRmWeight} kg × {student.assessments[0].oneRmReps} reps</strong>
                  </p>

                  {student.assessments[0].notes && (
                    <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      <strong style={{ color: "white" }}>Prescrição:</strong> {student.assessments[0].notes}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

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

          {/* Mensagem / Apresentação do Treinador */}
          <div className="glass" style={{ padding: "2rem", borderRadius: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h3 style={{ width: "100%", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Play size={20} color="var(--primary-color)" /> Mensagem do Coach
            </h3>
            <p style={{ width: "100%", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Orientações exclusivas do Professor Junior Glória para a sua jornada.
            </p>
            <VideoPlayerCard
              src="/app-video.mp4"
              badge="#TEAMJUNIORGLORIA"
              title="Apresentação do Treinador"
              subtitle="Instruções de alta performance"
              maxWidth="290px"
              autoPlay={false}
            />
          </div>
          
        </div>
      </div>
    </main>
  );
}
