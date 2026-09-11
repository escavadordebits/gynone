"use client";

import { useEffect, useState } from "react";
import { Printer, MoveLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Client component wrapper for fetching data
export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In Next.js 15 app router, we can fetch from an API route or server action
    // Here we'll fetch via a server action that we'll create right after this
    import("@/app/actions").then(module => {
      module.getStudentReportData(id).then(res => {
        setData(res);
        setLoading(false);
      });
    });
  }, [id]);

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Carregando relatório...</div>;
  }

  if (!data) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Aluno não encontrado.</div>;
  }

  const { student } = data;
  const { anamnesis, workouts, user, assessments } = student;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem", backgroundColor: "white", color: "black", minHeight: "100vh" }}>
      
      {/* NO PRINT UI */}
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", padding: "1rem", backgroundColor: "var(--surface-color)", color: "white", borderRadius: "0.5rem" }}>
        <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", textDecoration: "none" }}>
          <MoveLeft size={18} /> Voltar
        </Link>
        <button 
          onClick={() => window.print()}
          className="btn btn-primary" 
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Printer size={18} /> Gerar PDF (Imprimir)
        </button>
      </div>

      {/* PRINT LAYOUT */}
      <div className="print-header">
        <h1 className="print-title" style={{ fontSize: "24pt", margin: "0 0 5px 0" }}>GymOne - Relatório do Aluno</h1>
        <p style={{ margin: 0, color: "#555" }}>Gerado em: {new Date().toLocaleDateString("pt-BR")}</p>
      </div>

      <div className="print-section">
        <h2 className="print-title" style={{ fontSize: "16pt", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Dados Pessoais</h2>
        <div className="print-grid" style={{ marginTop: "15px" }}>
          <div><strong>Nome:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Sexo:</strong> {anamnesis?.gender || "Não informado"}</div>
          <div><strong>Plano/Local:</strong> {student.location || "Não especificado"}</div>
          <div><strong>Situação:</strong> Ativo</div>
        </div>
      </div>

      <div className="print-section">
        <h2 className="print-title" style={{ fontSize: "16pt", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Avaliação Física (Anamnese)</h2>
        {anamnesis ? (
          <div className="print-grid" style={{ marginTop: "15px" }}>
            <div className="print-card">
              <strong>Idade:</strong> {anamnesis.age} anos<br/>
              <strong>Peso:</strong> {anamnesis.weight} kg<br/>
              <strong>Altura:</strong> {anamnesis.height} m<br/>
              <strong>IMC Atual:</strong> {anamnesis.bmi?.toFixed(2)}<br/>
              <strong>Objetivo:</strong> {anamnesis.goal}<br/>
              <strong>Modalidade:</strong> {anamnesis.modality}
            </div>
            <div className="print-card">
              <strong>Experiência:</strong> {anamnesis.trainingExperience || "Não informada"}<br/>
              <strong>Disponibilidade:</strong> {anamnesis.trainingAvailability || "Não informada"}<br/>
              <strong>Lesão/Condição de Saúde:</strong> {anamnesis.hasHealthCondition ? `Sim (${anamnesis.healthConditionDetails || "Não especificada"})` : "Não"}<br/>
              <strong>Condição Cardiovascular:</strong> {anamnesis.cardiovascularCondition ? "Sim" : "Não"}<br/>
              <strong>Restrição Médica:</strong> {anamnesis.medicalRestriction ? "Sim" : "Não"}<br/>
              <strong>Pós-Cirúrgico:</strong> {anamnesis.postSurgery ? "Sim" : "Não"}<br/>
              <strong>Sintomas (Dor/Falta de ar/Desmaio):</strong> {anamnesis.chestPain || anamnesis.shortnessOfBreath || anamnesis.faintingOrDizziness ? "Sim (Requer Atenção)" : "Nenhum relatado"}
            </div>
          </div>
        ) : (
          <p style={{ marginTop: "10px", fontStyle: "italic" }}>Anamnese não preenchida.</p>
        )}
      </div>

      {/* SEÇÃO TESTES FÍSICOS (COOPER & 1RM) */}
      <div className="print-section">
        <h2 className="print-title" style={{ fontSize: "16pt", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Testes de Aptidão Física (Cooper & 1RM)</h2>
        {assessments && assessments.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
            {assessments.map((a: any, idx: number) => {
              const assessmentNumber = assessments.length - idx;
              const label = assessmentNumber === 1 ? "Avaliação Inicial" : `Reavaliação #${assessmentNumber - 1}`;
              return (
              <div key={a.id} style={{ backgroundColor: "#fafafa", border: "1px solid #eee", padding: "12px", borderRadius: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", borderBottom: "1px solid #eee", paddingBottom: "4px", fontSize: "9pt", color: "#666" }}>
                  <strong>{label}</strong>
                  <span>Data: {new Date(a.createdAt).toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="print-grid">
                  <div className="print-card" style={{ border: "none", padding: 0 }}>
                    <h3 style={{ fontSize: "11pt", margin: "0 0 5px 0", color: "#000" }}>Teste de Cooper (12 min) — VO₂máx</h3>
                    <strong>Distância:</strong> {a.cooperDistance ? `${a.cooperDistance} m` : "—"}<br/>
                    <strong>VO₂máx:</strong> {a.cooperVo2Max ? `${a.cooperVo2Max.toFixed(1)} mL/kg/min` : "—"}<br/>
                    <strong>Classificação:</strong> <strong>{a.cooperClassification || "—"}</strong>
                  </div>
                  <div className="print-card" style={{ border: "none", padding: 0 }}>
                    <h3 style={{ fontSize: "11pt", margin: "0 0 5px 0", color: "#000" }}>Força Máxima (1RM Estimado)</h3>
                    <strong>Exercício:</strong> {a.oneRmExercise || "Geral"}<br/>
                    <strong>Carga no Teste:</strong> {a.oneRmWeight} kg × {a.oneRmReps} reps<br/>
                    <strong>1RM (Epley):</strong> <strong>{a.oneRmResultEpley ? `${a.oneRmResultEpley.toFixed(1)} kg` : "—"}</strong><br/>
                    <strong>1RM (Brzycki):</strong> {a.oneRmResultBrzycki ? `${a.oneRmResultBrzycki.toFixed(1)} kg` : "—"}
                  </div>
                </div>
                {a.notes && (
                  <div style={{ marginTop: "8px", fontSize: "9pt", color: "#444", borderTop: "1px dashed #eee", paddingTop: "5px" }}>
                    <strong>Prescrição / Observações:</strong> {a.notes}
                  </div>
                )}
              </div>
              );
            })}

          </div>
        ) : (
          <p style={{ marginTop: "10px", fontStyle: "italic" }}>Nenhuma avaliação física registrada.</p>
        )}
      </div>

      <div className="print-section">
        <h2 className="print-title" style={{ fontSize: "16pt", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Treinos Atuais</h2>
        {workouts && workouts.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "15px" }}>
            {workouts.map((w: any) => (
              <div key={w.id} className="print-card" style={{ pageBreakInside: "avoid" }}>
                <h3 style={{ fontSize: "14pt", margin: "0 0 10px 0" }}>{w.title}</h3>
                {w.description && <p style={{ fontSize: "10pt", fontStyle: "italic", margin: "0 0 10px 0" }}>{w.description}</p>}
                
                <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "11pt", backgroundColor: "#f9f9f9", padding: "10px", border: "1px solid #eee", borderRadius: "4px" }}>
                  {w.exercises}
                </div>
                
                {w.videoUrl && (
                  <div style={{ marginTop: "10px", fontSize: "10pt" }}>
                    <strong>Vídeo Auxiliar:</strong> {w.videoUrl}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ marginTop: "10px", fontStyle: "italic" }}>Nenhum treino cadastrado.</p>
        )}
      </div>

      <div style={{ marginTop: "50px", textAlign: "center", fontSize: "10pt", color: "#888", borderTop: "1px solid #eee", paddingTop: "10px" }}>
        #TeamJuniorGloria - Este documento é para uso exclusivo do aluno.
      </div>
    </div>
  );
}
