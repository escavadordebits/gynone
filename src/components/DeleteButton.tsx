"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

export default function DeleteButton({ studentName }: { studentName: string }) {
  const [showModal, setShowModal] = useState(false);
  const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormRef(e.currentTarget.closest("form"));
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    if (formRef) {
      formRef.requestSubmit();
    }
  };

  return (
    <>
      <button 
        type="button" 
        onClick={handleClick}
        style={{ background: "none", border: "none", color: "var(--primary-color)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", padding: 0 }}
      >
        <Trash2 size={18} /> Excluir
      </button>

      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(5px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "1rem"
        }}>
          <div className="glass" style={{
            maxWidth: "400px",
            width: "100%",
            padding: "2rem",
            borderRadius: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center"
          }}>
            <div style={{ backgroundColor: "rgba(232, 25, 24, 0.1)", padding: "1rem", borderRadius: "50%", marginBottom: "1rem" }}>
              <AlertTriangle size={32} color="var(--primary-color)" />
            </div>
            
            <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem" }}>Confirmar Exclusão</h3>
            
            <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>
              Deseja realmente excluir o aluno <strong>{studentName}</strong>?<br/><br/>
              Esta ação é <strong style={{color: "var(--primary-color)"}}>irreversível</strong> e apagará permanentemente todos os treinos e anamnese associados a ele.
            </p>

            <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                className="btn" 
                style={{ flex: 1, backgroundColor: "var(--surface-color)", color: "white" }}
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleConfirm}
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
