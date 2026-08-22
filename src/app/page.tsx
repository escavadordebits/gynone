import Header from "@/components/Header";
import Link from "next/link";
import { ArrowRight, UserPlus, Play, Dumbbell } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="container" style={{ marginTop: "6rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4rem" }}>
        <div style={{ flex: "1 1 400px" }}>
          <h2 style={{ color: "var(--text-muted)", fontSize: "1.25rem", fontWeight: 600, letterSpacing: "2px", marginBottom: "1rem" }}>
            #TEAMJUNIORGLORIA
          </h2>
          <h1 style={{ fontSize: "4rem", lineHeight: "1.1", marginBottom: "1.5rem" }}>
            Desperte a sua<br/>
            <span className="text-primary">Melhor forma FÍSICA</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.25rem", marginBottom: "2.5rem", maxWidth: "500px" }}>
            Você está pronto para alcançar níveis INCRÍVEIS de evolução física e aperfeiçoamento do corpo? Faça parte do nosso time e mude completamente seus resultados.
          </p>
          <div className="flex gap-4">
            <Link href="https://wa.me/5521970414201" target="_blank" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "1rem 2rem", fontSize: "1.1rem" }}>
              Venha treinar comigo
            </Link>
            <Link href="/login" className="btn" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "1rem 2rem", fontSize: "1.1rem", backgroundColor: "var(--surface-color)", color: "var(--text-color)" }}>
              Acesso de Alunos <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <div style={{ flex: "1 1 400px", display: "flex", justifyContent: "center", position: "relative" }}>
          {/* Placeholder for the Trainer Image, styled as a glowing card */}
          <div style={{ 
            width: "100%", 
            maxWidth: "500px", 
            aspectRatio: "1/1", 
            background: "linear-gradient(135deg, rgba(232,25,24,0.2) 0%, rgba(26,28,35,0.8) 100%)",
            borderRadius: "2rem",
            border: "1px solid rgba(232, 25, 24, 0.3)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}>
            <Dumbbell size={100} color="var(--primary-color)" style={{ opacity: 0.5 }} />
            <div style={{ position: "absolute", bottom: "2rem", right: "2rem", background: "var(--bg-color)", padding: "1rem", borderRadius: "1rem", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", backgroundColor: "var(--primary-color)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Play color="white" fill="white" size={20} style={{ marginLeft: "4px" }} />
              </div>
              <div>
                <div style={{ fontWeight: 800 }}>Resultados Reais</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Assista ao vídeo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ marginTop: "8rem", marginBottom: "8rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2.5rem" }}>Acesso Exclusivo GymOne</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
            A plataforma digital do #TeamJuniorGloria para potencializar seus treinos.
          </p>
        </div>

        <div className="flex justify-center gap-4" style={{ flexWrap: "wrap" }}>
          <div className="glass p-6" style={{ borderRadius: "1rem", flex: "1", minWidth: "300px", maxWidth: "400px" }}>
            <Dumbbell color="var(--primary-color)" size={32} style={{ marginBottom: "1rem" }} />
            <h3>Séries Personalizadas</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              Acompanhe sua série de treinos, repetições e carga diretamente pelo celular, de forma interativa.
            </p>
          </div>
          
          <div className="glass p-6" style={{ borderRadius: "1rem", flex: "1", minWidth: "300px", maxWidth: "400px" }}>
            <Play color="var(--primary-color)" size={32} style={{ marginBottom: "1rem" }} />
            <h3>Galeria de Vídeos</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              Acesso a vídeos exclusivos com a execução correta dos exercícios de musculação e lutas.
            </p>
          </div>

          <div className="glass p-6" style={{ borderRadius: "1rem", flex: "1", minWidth: "300px", maxWidth: "400px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <span style={{ backgroundColor: "var(--primary-color)", color: "white", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.8rem", fontWeight: 800 }}>NOVO</span>
            </div>
            <h3>Treino Express (IA)</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              Tem pouco tempo hoje? Use nossa Inteligência Artificial para gerar um treino rápido focado nos seus objetivos.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "4rem 0", backgroundColor: "var(--surface-color)" }}>
        <div className="container flex justify-between items-center" style={{ flexWrap: "wrap", gap: "2rem" }}>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              GYM<span className="text-primary">ONE</span>
            </div>
            <div style={{ color: "var(--text-muted)" }}>© 2024 Junior Glória. Todos os direitos reservados.</div>
          </div>
          
          <div className="flex gap-4">
            <Link href="https://www.instagram.com/professorjuniorgloria/" target="_blank" style={{ color: "var(--text-muted)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </Link>
            <Link href="https://www.youtube.com/@kingboxingteamtv" target="_blank" style={{ color: "var(--text-muted)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.125C2.5 7.125 2.5 5 4.625 5C5.875 5 12 5 12 5s6.125 0 7.375.0C21.5 5 21.5 7.125 21.5 7.125C21.5 7.125 21.5 10.5 21.5 12C21.5 13.5 21.5 16.875 21.5 16.875C21.5 16.875 21.5 19 19.375 19C18.125 19 12 19 12 19s-6.125 0-7.375 0C2.5 19 2.5 16.875 2.5 16.875C2.5 16.875 2.5 13.5 2.5 12C2.5 10.5 2.5 7.125 2.5 7.125z"/><polygon points="9.5 8 9.5 16 16.5 12 9.5 8"/></svg>
            </Link>
            <Link href="https://www.linkedin.com/in/júnior-glória-5a6a8389/" target="_blank" style={{ color: "var(--text-muted)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
