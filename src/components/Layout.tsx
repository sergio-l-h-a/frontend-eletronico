// src/components/Layout.tsx
import React from "react";
import { Sidebar } from "./Sidebar"; // Ajuste se seu Sidebar estiver em outra pasta

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-zinc-950 text-zinc-100 antialiased overflow-x-hidden">
      {/* Sidebar fixo/recolhível */}
      <Sidebar />

      {/* Área principal do conteúdo - Ocupa 100% da largura restante */}
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}