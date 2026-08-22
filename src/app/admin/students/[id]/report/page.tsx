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
  const { anamnesis, workouts, user } = student;

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
            </div>
            <div className="print-card">
              <strong>IMC Atual:</strong> {anamnesis.bmi?.toFixed(2)}<br/>
              <strong>Objetivo:</strong> {anamnesis.goal}<br/>
              <strong>Modalidade:</strong> {anamnesis.modality}
            </div>
          </div>
        ) : (
          <p style={{ marginTop: "10px", fontStyle: "italic" }}>Anamnese não preenchida.</p>
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
