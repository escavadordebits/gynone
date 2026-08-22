"use client";

import { useState } from "react";
import { Zap, Loader2, Save, Check } from "lucide-react";
import { generateExpressWorkout, saveAiWorkout } from "@/app/actions";

export default function ExpressWorkoutCard({ studentId }: { studentId: string }) {
  const [workout, setWorkout] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const generatedText = await generateExpressWorkout(studentId);
      setWorkout(generatedText);
    } catch (err: any) {
      setError(err.message || "Erro ao gerar treino. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!workout) return;
    setSaving(true);
    try {
      await saveAiWorkout(studentId, workout);
      setSaved(true);
    } catch (err: any) {
      setError("Falha ao salvar o treino.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass" style={{ padding: "2rem", borderRadius: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary-color)" }}>
        <Zap size={24} />
        <h3 style={{ margin: 0 }}>Treino Express (IA)</h3>
      </div>
      
      {!workout && !loading && (
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Sem tempo hoje? Nossa Inteligência Artificial monta um treino rápido de 15 minutos focado no seu objetivo e usando apenas o peso do corpo.
        </p>
      )}

      {error && (
        <div style={{ padding: "1rem", backgroundColor: "rgba(232, 25, 24, 0.1)", color: "var(--primary-color)", borderRadius: "0.5rem", fontSize: "0.9rem", border: "1px solid var(--primary-color)" }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", color: "var(--vivid-green-cyan)" }}>
          <Loader2 size={32} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>A Inteligência Artificial está montando seu treino...</span>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {workout && !loading && (
        <div style={{ padding: "1.5rem", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "0.5rem", borderLeft: "4px solid var(--primary-color)" }}>
          <div 
            style={{ color: "var(--text-color)", fontSize: "0.95rem", lineHeight: "1.6", whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: workout.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
          />
        </div>
      )}

      <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
        <button 
          className="btn btn-primary" 
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          onClick={handleGenerate}
          disabled={loading || saving}
        >
          {loading ? (
            <>Gerando...</>
          ) : workout ? (
            <>
              <Zap size={18} /> Gerar Novo Treino
            </>
          ) : (
            <>
              <Zap size={18} /> Gerar Treino Agora
            </>
          )}
        </button>

        {workout && !loading && (
          <button 
            className="btn" 
            style={{ 
              display: "flex", alignItems: "center", gap: "0.5rem", 
              backgroundColor: saved ? "var(--vivid-green-cyan)" : "var(--surface-color)", 
              color: saved ? "black" : "white" 
            }}
            onClick={handleSave}
            disabled={saving || saved}
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
            ) : saved ? (
              <>
                <Check size={18} /> Treino Salvo
              </>
            ) : (
              <>
                <Save size={18} /> Salvar Treino
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
