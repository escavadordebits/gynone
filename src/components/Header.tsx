"use client";

import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function Header() {
  return (
    <header className="glass" style={{ position: "sticky", top: 0, zIndex: 10, padding: "1rem 0" }}>
      <div className="container flex justify-between items-center">
        <Link href="/" style={{ textDecoration: "none", color: "white", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Dumbbell color="var(--primary-color)" size={32} />
          <span style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            GYM<span className="text-primary">ONE</span>
          </span>
        </Link>
        <nav style={{ display: "flex", gap: "1.5rem" }}>
          <Link href="/login" style={{ color: "var(--text-muted)", textDecoration: "none", fontWeight: 600 }}>
            Acesso do Aluno
          </Link>
          <Link href="/admin" style={{ color: "white", textDecoration: "none", fontWeight: 600 }}>
            Painel Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
