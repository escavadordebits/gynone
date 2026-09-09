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
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Sexo (Gênero)</label>
            <select name="gender" className="input-field" defaultValue={anam?.gender || "Masculino"} required style={{ width: "100%" }}>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>
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

        <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem", fontSize: "1.2rem" }}>Histórico e Disponibilidade</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Experiência com Treinamento</label>
            <select name="trainingExperience" className="input-field" defaultValue={anam?.trainingExperience || "Iniciante"} style={{ width: "100%" }}>
              <option value="Iniciante">Iniciante (Nunca treinou ou parou há muito tempo)</option>
              <option value="Intermediário">Intermediário (Treina esporadicamente)</option>
              <option value="Avançado">Avançado (Treina regularmente há mais de 1 ano)</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Disponibilidade para Treinar</label>
            <select name="trainingAvailability" className="input-field" defaultValue={anam?.trainingAvailability || "3x semana"} style={{ width: "100%" }}>
              <option value="1x semana">1x semana</option>
              <option value="2x semana">2x semana</option>
              <option value="3x semana">3x semana</option>
              <option value="4x semana">4x semana</option>
              <option value="5x semana">5x semana</option>
              <option value="6x semana">6x semana</option>
              <option value="todos dias">Todos os dias</option>
            </select>
          </div>
        </div>

        <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem", fontSize: "1.2rem" }}>Saúde e Restrições</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Tem condição de saúde, lesão ou limitação?</label>
            <select name="hasHealthCondition" className="input-field" defaultValue={anam?.hasHealthCondition ? "true" : "false"} style={{ width: "100%" }}>
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Se sim, qual?</label>
            <input type="text" name="healthConditionDetails" className="input-field" defaultValue={anam?.healthConditionDetails || ""} placeholder="Especifique a lesão/condição" style={{ width: "100%" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginTop: "0.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Já teve dor no peito durante esforço?</label>
            <select name="chestPain" className="input-field" defaultValue={anam?.chestPain ? "true" : "false"} style={{ width: "100%" }}>
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Já teve desmaio ou tontura no exercício?</label>
            <select name="faintingOrDizziness" className="input-field" defaultValue={anam?.faintingOrDizziness ? "true" : "false"} style={{ width: "100%" }}>
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Sente falta de ar durante o esforço?</label>
            <select name="shortnessOfBreath" className="input-field" defaultValue={anam?.shortnessOfBreath ? "true" : "false"} style={{ width: "100%" }}>
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Possui alguma condição Cardiovascular?</label>
            <select name="cardiovascularCondition" className="input-field" defaultValue={anam?.cardiovascularCondition ? "true" : "false"} style={{ width: "100%" }}>
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Foi orientado por médico a evitar atividade?</label>
            <select name="medicalRestriction" className="input-field" defaultValue={anam?.medicalRestriction ? "true" : "false"} style={{ width: "100%" }}>
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Retomando exercícios após cirurgia?</label>
            <select name="postSurgery" className="input-field" defaultValue={anam?.postSurgery ? "true" : "false"} style={{ width: "100%" }}>
              <option value="false">Não</option>
              <option value="true">Sim</option>
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
