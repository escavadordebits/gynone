"use client";

import { useState } from "react";
import { savePhysicalAssessment } from "@/app/actions";
import { 
  calculateCooperVo2Max, 
  classifyCooper, 
  calculate1RM, 
  MEN_COOPER_TABLE, 
  WOMEN_COOPER_TABLE,
  CooperTableEntry
} from "@/lib/fitnessCalculations";
import { Activity, Dumbbell, Eye, EyeOff, Save, CheckCircle, Flame, Trophy } from "lucide-react";

interface AssessmentFormProps {
  studentId: string;
  studentAge: number;
  studentGender: string;
}

export default function AssessmentForm({ studentId, studentAge, studentGender }: AssessmentFormProps) {
  const [distance, setDistance] = useState<number | "">(2400);
  const [exercise, setExercise] = useState("Supino Reto");
  const [weight, setWeight] = useState<number | "">(60);
  const [reps, setReps] = useState<number | "">(10);
  const [notes, setNotes] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [activeTableGender, setActiveTableGender] = useState<"Masculino" | "Feminino">(
    studentGender.toLowerCase().startsWith("f") ? "Feminino" : "Masculino"
  );

  // Cálculos em tempo real de Cooper
  const numDistance = typeof distance === "number" ? distance : 0;
  const vo2Max = calculateCooperVo2Max(numDistance);
  const cooperResult = vo2Max > 0 ? classifyCooper(vo2Max, studentAge, activeTableGender) : null;

  // Cálculos em tempo real de 1RM
  const numWeight = typeof weight === "number" ? weight : 0;
  const numReps = typeof reps === "number" ? reps : 0;
  const rmResult = calculate1RM(numWeight, numReps);

  const currentTable: CooperTableEntry[] = activeTableGender === "Feminino" ? WOMEN_COOPER_TABLE : MEN_COOPER_TABLE;

  return (
    <form action={savePhysicalAssessment} className="glass" style={{ padding: "2rem", borderRadius: "1rem", marginBottom: "3rem" }}>
      <input type="hidden" name="studentId" value={studentId} />
      <input type="hidden" name="isVisibleToStudent" value={isVisible ? "true" : "false"} />

      {/* SEÇÃO 1: TESTE DE COOPER */}
      <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "2rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(0, 208, 132, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vivid-green-cyan)" }}>
            <Activity size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.3rem" }}>1. Teste de Cooper (12 Minutos) — VO₂máx</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Fórmula: VO₂máx = (distância em metros − 504,9) ÷ 44,73 mL/kg/min
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Distância Percorrida (Metros)
            </label>
            <input 
              type="number" 
              name="cooperDistance" 
              className="input-field" 
              value={distance}
              onChange={(e) => setDistance(e.target.value === "" ? "" : parseFloat(e.target.value))}
              placeholder="Ex: 2400" 
              step="10"
              min="100"
              max="6000"
              required
              style={{ width: "100%", fontSize: "1.1rem", fontWeight: 600 }}
            />
          </div>

          <div style={{ backgroundColor: "rgba(0,0,0,0.25)", padding: "1.2rem", borderRadius: "0.75rem", border: "1px solid rgba(0, 208, 132, 0.2)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>VO₂máx Estimado:</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
              <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--vivid-green-cyan)" }}>
                {vo2Max > 0 ? vo2Max.toFixed(1) : "—"}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>mL/kg/min</span>
              {cooperResult && (
                <span style={{ 
                  marginLeft: "auto", 
                  padding: "0.3rem 0.8rem", 
                  borderRadius: "2rem", 
                  fontSize: "0.85rem", 
                  fontWeight: 700,
                  backgroundColor: cooperResult.classification === "Excelente" || cooperResult.classification === "Bom" ? "rgba(0, 208, 132, 0.2)" : "rgba(255, 180, 0, 0.2)",
                  color: cooperResult.classification === "Excelente" || cooperResult.classification === "Bom" ? "var(--vivid-green-cyan)" : "#ffb400",
                  border: "1px solid currentColor"
                }}>
                  {cooperResult.classification}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* TABELA DE CLASSIFICAÇÃO COM DESTAQUE DA CÉLULA */}
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.95rem", fontWeight: 600 }}>
              Tabela de Referência — {activeTableGender === "Masculino" ? "Homens" : "Mulheres"} (VO₂máx mL/kg/min):
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                type="button" 
                onClick={() => setActiveTableGender("Masculino")}
                className={`btn ${activeTableGender === "Masculino" ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem" }}
              >
                Homens
              </button>
              <button 
                type="button" 
                onClick={() => setActiveTableGender("Feminino")}
                className={`btn ${activeTableGender === "Feminino" ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem" }}
              >
                Mulheres
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto", borderRadius: "0.5rem", border: "1px solid var(--border-color)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", fontSize: "0.85rem" }}>
              <thead style={{ backgroundColor: "rgba(0,0,0,0.4)", borderBottom: "1px solid var(--border-color)" }}>
                <tr>
                  <th style={{ padding: "0.6rem 0.8rem", textAlign: "left" }}>Idade</th>
                  <th style={{ padding: "0.6rem 0.8rem" }}>Muito baixo</th>
                  <th style={{ padding: "0.6rem 0.8rem" }}>Baixo</th>
                  <th style={{ padding: "0.6rem 0.8rem" }}>Regular</th>
                  <th style={{ padding: "0.6rem 0.8rem" }}>Bom</th>
                  <th style={{ padding: "0.6rem 0.8rem" }}>Excelente</th>
                </tr>
              </thead>
              <tbody>
                {currentTable.map((row) => {
                  const isAgeRow = studentAge >= row.minAge && studentAge <= row.maxAge;
                  return (
                    <tr 
                      key={row.ageGroup} 
                      style={{ 
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        backgroundColor: isAgeRow ? "rgba(0, 208, 132, 0.08)" : "transparent"
                      }}
                    >
                      <td style={{ padding: "0.6rem 0.8rem", textAlign: "left", fontWeight: isAgeRow ? 700 : 400, color: isAgeRow ? "var(--vivid-green-cyan)" : "inherit" }}>
                        {row.ageGroup} anos {isAgeRow && <span style={{ fontSize: "0.7rem", backgroundColor: "var(--vivid-green-cyan)", color: "#000", padding: "0.1rem 0.4rem", borderRadius: "4px", marginLeft: "4px" }}>Aluno ({studentAge})</span>}
                      </td>

                      {[row.muitoBaixo, row.baixo, row.regular, row.bom, row.excelente].map((val, colIdx) => {
                        const isMatch = isAgeRow && cooperResult && cooperResult.matchedColIndex === colIdx;
                        return (
                          <td 
                            key={colIdx} 
                            style={{ 
                              padding: "0.6rem 0.8rem",
                              fontWeight: isMatch ? 800 : 400,
                              backgroundColor: isMatch ? "rgba(0, 208, 132, 0.28)" : "transparent",
                              color: isMatch ? "#ffffff" : "inherit",
                              border: isMatch ? "2px solid var(--vivid-green-cyan)" : "none",
                              borderRadius: isMatch ? "6px" : "0"
                            }}
                          >
                            {val}
                            {isMatch && (
                              <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "var(--vivid-green-cyan)", textTransform: "uppercase", marginTop: "2px" }}>
                                ✓ Marcado
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: ESTIMATIVA DO 1RM */}
      <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "2rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(232, 25, 24, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-color)" }}>
            <Dumbbell size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.3rem" }}>2. Estimativa do 1RM por Repetições</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Fórmulas de Epley: Carga × (1 + Reps/30) & Brzycki: Carga ÷ [1,0278 − (0,0278 × Reps)]
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Exercício Avaliado
            </label>
            <input 
              type="text" 
              name="oneRmExercise" 
              className="input-field" 
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              placeholder="Ex: Supino Reto, Agachamento" 
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Carga do Teste (kg)
            </label>
            <input 
              type="number" 
              name="oneRmWeight" 
              className="input-field" 
              value={weight}
              onChange={(e) => setWeight(e.target.value === "" ? "" : parseFloat(e.target.value))}
              placeholder="Ex: 60" 
              step="0.5"
              min="1"
              max="500"
              style={{ width: "100%", fontSize: "1.1rem", fontWeight: 600 }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Repetições Realizadas
            </label>
            <input 
              type="number" 
              name="oneRmReps" 
              className="input-field" 
              value={reps}
              onChange={(e) => setReps(e.target.value === "" ? "" : parseInt(e.target.value))}
              placeholder="Ex: 10" 
              min="1"
              max="30"
              style={{ width: "100%", fontSize: "1.1rem", fontWeight: 600 }}
            />
          </div>
        </div>

        {/* COMPARATIVO EPLEY & BRZYCKI */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ backgroundColor: "rgba(0,0,0,0.25)", padding: "1.2rem", borderRadius: "0.75rem", border: "1px solid rgba(232, 25, 24, 0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>1RM Estimado (Epley)</span>
              <span style={{ fontSize: "0.75rem", color: "var(--primary-color)", fontWeight: 600 }}>Mais utilizado</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary-color)", marginTop: "0.25rem" }}>
              {rmResult.epley > 0 ? `${rmResult.epley.toFixed(1)} kg` : "—"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Carga × (1 + {numReps}/30)
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(0,0,0,0.25)", padding: "1.2rem", borderRadius: "0.75rem", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>1RM Estimado (Brzycki)</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Alta precisão</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-color)", marginTop: "0.25rem" }}>
              {rmResult.brzycki > 0 ? `${rmResult.brzycki.toFixed(1)} kg` : "—"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Carga ÷ [1,0278 − (0,0278 × {numReps})]
            </div>
          </div>
        </div>

        {/* TABELA DE INTENSIDADES POR PERCENTUAL DE 1RM */}
        {rmResult.intensityZones.length > 0 && (
          <div>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              Tabela de Prescrição por % de 1RM ({exercise}):
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: "0.5rem" }}>
              {rmResult.intensityZones.map((zone) => (
                <div key={zone.percent} style={{ backgroundColor: "rgba(255,255,255,0.03)", padding: "0.6rem", borderRadius: "0.5rem", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{zone.percent}%</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--vivid-green-cyan)", marginTop: "2px" }}>
                    {zone.weight} kg
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SEÇÃO 3: VISIBILIDADE E OBSERVAÇÕES */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(0,0,0,0.25)", padding: "1.2rem", borderRadius: "0.75rem", border: "1px solid var(--border-color)", marginBottom: "1rem" }}>
          <div>
            <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1rem" }}>
              {isVisible ? <Eye size={18} color="var(--vivid-green-cyan)" /> : <EyeOff size={18} color="var(--text-muted)" />}
              Visível para o Aluno
            </div>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {isVisible 
                ? "Sim, estes cálculos aparecerão destacados no Painel do Aluno e no Relatório impresso." 
                : "Não, estes cálculos permanecerão ocultos para o aluno (visíveis apenas para o treinador)."
              }
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: "2rem",
              border: isVisible ? "1px solid var(--vivid-green-cyan)" : "1px solid var(--border-color)",
              backgroundColor: isVisible ? "rgba(0, 208, 132, 0.2)" : "rgba(255,255,255,0.05)",
              color: isVisible ? "var(--vivid-green-cyan)" : "var(--text-muted)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {isVisible ? "✓ Visível" : "✕ Oculto"}
          </button>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Observações do Treinador (Opcional)
          </label>
          <textarea 
            name="notes" 
            className="input-field" 
            rows={2} 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Aluno apresentou boa recuperação após o teste de Cooper. Carga de supino pode ser progredida no próximo ciclo."
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.9rem" }}>
        <Save size={20} /> Salvar Avaliação Física (Cooper & 1RM)
      </button>
    </form>
  );
}
