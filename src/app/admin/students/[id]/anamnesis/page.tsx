import { prisma } from "@/lib/prisma";
import { saveAnamnesis } from "@/app/actions";
import { MoveLeft, Save } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AnamnesisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const student = await prisma.student.findUnique({
    where: { id },
    include: { user: true, anamnesis: true }
  });

  if (!student) return notFound();

  const anam = student.anamnesis;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", textDecoration: "none", marginBottom: "2rem" }}>
        <MoveLeft size={18} /> Voltar ao Painel
      </Link>

      <h2 style={{ marginBottom: "0.5rem" }}>Ficha de Anamnese</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Aluno: <strong style={{ color: "var(--primary-color)" }}>{student.user.name}</strong></p>

      <form action={saveAnamnesis} className="glass" style={{ padding: "2rem", borderRadius: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <input type="hidden" name="studentId" value={student.id} />
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Idade</label>
            <input type="number" name="age" className="input-field" defaultValue={anam?.age ?? ""} required min={10} max={100} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Peso (kg)</label>
            <input type="number" step="0.1" name="weight" className="input-field" defaultValue={anam?.weight ?? ""} required min={30} max={250} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Altura (m)</label>
            <input type="number" step="0.01" name="height" className="input-field" defaultValue={anam?.height ?? ""} required min={1.0} max={2.5} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Objetivo Principal</label>
            <select name="goal" className="input-field" defaultValue={anam?.goal || "Emagrecimento"} required style={{ width: "100%" }}>
              <option value="Emagrecimento">Emagrecimento</option>
              <option value="Hipertrofia">Hipertrofia</option>
              <option value="Condicionamento">Condicionamento Físico</option>
              <option value="Saúde">Qualidade de Vida / Saúde</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Modalidade de Interesse</label>
            <select name="modality" className="input-field" defaultValue={anam?.modality || "Musculação"} required style={{ width: "100%" }}>
              <option value="Musculação">Musculação</option>
              <option value="Lutas">Lutas (Boxe/Kickboxing)</option>
              <option value="Híbrido">Híbrido (Ambos)</option>
            </select>
          </div>
        </div>

        {anam && (
          <div style={{ padding: "1rem", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "0.5rem", marginTop: "1rem" }}>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>IMC Atual Calculado:</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--vivid-green-cyan)" }}>
              {anam.bmi != null ? anam.bmi.toFixed(2) : "—"}
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
          <Save size={20} /> Salvar Ficha de Anamnese
        </button>
      </form>
    </div>
  );
}
