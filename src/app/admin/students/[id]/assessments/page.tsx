import { prisma } from "@/lib/prisma";
import { MoveLeft, Activity, Dumbbell, Calendar, Trash2, Eye, EyeOff, FileText, PlusCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AssessmentForm from "@/components/AssessmentForm";
import { toggleAssessmentVisibility, deletePhysicalAssessment } from "@/app/actions";

export default async function AssessmentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: { 
      user: true, 
      anamnesis: true,
      assessments: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!student) return notFound();

  const studentAge = student.anamnesis?.age || 25;
  const studentGender = student.anamnesis?.gender || "Masculino";

  const latestAssessment = student.assessments[0];
  const previousAssessment = student.assessments[1];
  let strengthEvolution: { diff: number; pct: number } | null = null;
  if (latestAssessment?.oneRmResultEpley && previousAssessment?.oneRmResultEpley) {
    const diff = parseFloat((latestAssessment.oneRmResultEpley - previousAssessment.oneRmResultEpley).toFixed(1));
    const pct = parseFloat(((diff / previousAssessment.oneRmResultEpley) * 100).toFixed(1));
    strengthEvolution = { diff, pct };
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1.5rem" }}>
      <Link 
        href="/admin" 
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", textDecoration: "none", marginBottom: "2rem" }}
      >
        <MoveLeft size={18} /> Voltar ao Painel
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "2rem" }}>Avaliação Física & Calculadora 1RM</h2>
          <p style={{ color: "var(--text-muted)", margin: "0.5rem 0 0 0" }}>
            Aluno: <strong style={{ color: "var(--primary-color)" }}>{student.user.name}</strong> • 
            Idade: <strong>{studentAge} anos</strong> • 
            Gênero: <strong>{studentGender}</strong>
          </p>
        </div>

        {/* BOTÕES DE HISTÓRICO & REAVALIAÇÃO */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link
            href={`/admin/students/${student.id}/report`}
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", padding: "0.6rem 1.2rem" }}
            title="Visualizar e exportar histórico em PDF"
          >
            <FileText size={18} /> Histórico em PDF
          </Link>

          <a
            href="#calculadora-avaliacao"
            className="btn"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              fontSize: "0.9rem", 
              padding: "0.6rem 1.2rem", 
              backgroundColor: "rgba(255,255,255,0.08)", 
              color: "white", 
              border: "1px solid var(--border-color)",
              textDecoration: "none",
              borderRadius: "0.5rem",
              fontWeight: 600
            }}
          >
            <PlusCircle size={18} color="var(--primary-color)" /> Nova Reavaliação
          </a>

          <Link
            href={`/admin/students/${student.id}/anamnesis`}
            className="btn btn-secondary"
            style={{ fontSize: "0.85rem", padding: "0.6rem 1rem" }}
          >
            Editar Anamnese
          </Link>
        </div>
      </div>

      {/* BANNER DE EVOLUÇÃO DE FORÇA (SE HOUVER HISTÓRICO DE REAVALIAÇÃO) */}
      {strengthEvolution && (
        <div className="glass" style={{ padding: "1.25rem 1.5rem", borderRadius: "0.75rem", border: "1px solid rgba(0, 208, 132, 0.3)", backgroundColor: "rgba(0, 208, 132, 0.08)", marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(0, 208, 132, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={22} color="var(--vivid-green-cyan)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "white" }}>
                Evolução de 1RM: {strengthEvolution.diff >= 0 ? `+${strengthEvolution.diff} kg (+${strengthEvolution.pct}%)` : `${strengthEvolution.diff} kg (${strengthEvolution.pct}%)`}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Comparativo entre a última reavaliação ({new Date(latestAssessment.createdAt).toLocaleDateString("pt-BR")}) e a avaliação anterior ({new Date(previousAssessment.createdAt).toLocaleDateString("pt-BR")}).
              </div>
            </div>
          </div>
          <span style={{ padding: "0.3rem 0.8rem", borderRadius: "1rem", backgroundColor: "rgba(0, 208, 132, 0.2)", color: "var(--vivid-green-cyan)", fontWeight: 800, fontSize: "0.85rem" }}>
            {student.assessments.length} avaliações no histórico
          </span>
        </div>
      )}

      {/* FORMULÁRIO INTERATIVO / REAVALIAÇÃO */}
      <div id="calculadora-avaliacao">
        <AssessmentForm 
          studentId={student.id} 
          studentAge={studentAge} 
          studentGender={studentGender} 
        />
      </div>


      {/* HISTÓRICO DE AVALIAÇÕES */}
      <div>
        <h3 style={{ marginBottom: "1.5rem", fontSize: "1.4rem" }}>Histórico de Avaliações Salvas</h3>

        {student.assessments.length === 0 ? (
          <div className="glass" style={{ padding: "3rem", textAlign: "center", borderRadius: "1rem", color: "var(--text-muted)" }}>
            Nenhuma avaliação física registrada para este aluno ainda. Utilize a calculadora acima para salvar a primeira.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {student.assessments.map((a, idx) => {
              const isLatest = idx === 0;
              const assessmentNumber = student.assessments.length - idx;
              const label = assessmentNumber === 1 ? "Avaliação Inicial" : `Reavaliação #${assessmentNumber - 1}`;

              return (
              <div 
                key={a.id} 
                className="glass" 
                style={{ 
                  padding: "1.5rem", 
                  borderRadius: "1rem", 
                  border: a.isVisibleToStudent ? "1px solid rgba(0, 208, 132, 0.3)" : "1px solid var(--border-color)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    <span style={{ 
                      padding: "0.2rem 0.65rem", 
                      borderRadius: "1rem", 
                      fontSize: "0.75rem", 
                      fontWeight: 800, 
                      backgroundColor: isLatest ? "rgba(232, 25, 24, 0.2)" : "rgba(255,255,255,0.06)", 
                      color: isLatest ? "var(--primary-color)" : "var(--text-muted)",
                      border: isLatest ? "1px solid rgba(232, 25, 24, 0.4)" : "1px solid var(--border-color)"
                    }}>
                      {label} {isLatest && "• Atual"}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Calendar size={15} />
                      <span>{new Date(a.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>


                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {/* BOTÃO ALTERNAR VISIBILIDADE */}
                    <form action={async () => {
                      "use server";
                      await toggleAssessmentVisibility(a.id, student.id, !a.isVisibleToStudent);
                    }}>
                      <button
                        type="submit"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          padding: "0.35rem 0.8rem",
                          borderRadius: "2rem",
                          border: a.isVisibleToStudent ? "1px solid var(--vivid-green-cyan)" : "1px solid var(--border-color)",
                          backgroundColor: a.isVisibleToStudent ? "rgba(0, 208, 132, 0.15)" : "rgba(255,255,255,0.05)",
                          color: a.isVisibleToStudent ? "var(--vivid-green-cyan)" : "var(--text-muted)",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                        title="Clique para alternar se o aluno pode ver este teste"
                      >
                        {a.isVisibleToStudent ? (
                          <>
                            <Eye size={14} /> Visível para o Aluno
                          </>
                        ) : (
                          <>
                            <EyeOff size={14} /> Oculto para o Aluno
                          </>
                        )}
                      </button>
                    </form>

                    {/* BOTÃO EXCLUIR */}
                    <form action={async () => {
                      "use server";
                      await deletePhysicalAssessment(a.id, student.id);
                    }}>
                      <button
                        type="submit"
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--primary-color)",
                          cursor: "pointer",
                          padding: "0.25rem",
                          display: "flex",
                          alignItems: "center"
                        }}
                        title="Excluir esta avaliação"
                      >
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                  {/* COOPER */}
                  <div style={{ backgroundColor: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--vivid-green-cyan)", fontWeight: 600, marginBottom: "0.5rem" }}>
                      <Activity size={18} /> Teste de Cooper (12 min)
                    </div>
                    <div style={{ fontSize: "0.9rem" }}>
                      <strong>Distância:</strong> {a.cooperDistance ? `${a.cooperDistance} metros` : "Não informado"}<br />
                      <strong>VO₂máx:</strong> {a.cooperVo2Max ? `${a.cooperVo2Max.toFixed(1)} mL/kg/min` : "—"}<br />
                      <strong>Classificação:</strong>{" "}
                      <span style={{ 
                        fontWeight: 700, 
                        color: a.cooperClassification === "Excelente" || a.cooperClassification === "Bom" ? "var(--vivid-green-cyan)" : "#ffb400" 
                      }}>
                        {a.cooperClassification || "—"}
                      </span>
                    </div>
                  </div>

                  {/* 1RM */}
                  <div style={{ backgroundColor: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary-color)", fontWeight: 600, marginBottom: "0.5rem" }}>
                      <Dumbbell size={18} /> Força Máxima (1RM Estimado)
                    </div>
                    <div style={{ fontSize: "0.9rem" }}>
                      <strong>Exercício:</strong> {a.oneRmExercise || "Geral"}<br />
                      <strong>Teste:</strong> {a.oneRmWeight} kg × {a.oneRmReps} repetições<br />
                      <strong>1RM Epley:</strong> <span style={{ fontWeight: 700, color: "var(--primary-color)" }}>{a.oneRmResultEpley ? `${a.oneRmResultEpley.toFixed(1)} kg` : "—"}</span><br />
                      <strong>1RM Brzycki:</strong> {a.oneRmResultBrzycki ? `${a.oneRmResultBrzycki.toFixed(1)} kg` : "—"}
                    </div>
                  </div>
                </div>

                {a.notes && (
                  <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "0.5rem", fontSize: "0.85rem", fontStyle: "italic", color: "var(--text-muted)" }}>
                    "{a.notes}"
                  </div>
                )}
              </div>
              );
            })}
          </div>

        )}
      </div>
    </div>
  );
}
