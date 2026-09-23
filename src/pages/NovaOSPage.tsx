import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://backend-eletronico.onrender.com";

export default function NovaOSPage() {
  const navigate = useNavigate();
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({
    cliente: "",
    telefone: "",
    aparelho: "",
    marca: "",
    defeito: "",
  });

  function atualizar(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault(); // Impede o recarregamento nativo da página

    if (!form.cliente || !form.aparelho) {
      alert("Por favor, preencha pelo menos o cliente e o aparelho.");
      return;
    }

    setSalvando(true);

    try {
      // Faz o POST para o endpoint do backend
      const res = await fetch(`${API_URL}/nova-os`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar a Ordem de Serviço.");
      }

      alert("OS criada com sucesso!");
      // CORRIGIDO: Redireciona para a rota da lista do frontend (/os)
      navigate("/nova-os");
    } catch (err) {
      console.error("Erro ao criar OS:", err);
      alert("Falha ao salvar a OS. Verifique a conexão com o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="p-8 text-zinc-100 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Criar Nova OS</h1>

      <form onSubmit={enviar} className="space-y-4">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Nome do Cliente *</label>
          <input
            name="cliente"
            placeholder="Ex: João da Silva"
            value={form.cliente}
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            onChange={atualizar}
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1">Telefone / WhatsApp</label>
          <input
            name="telefone"
            placeholder="Ex: (11) 99999-9999"
            value={form.telefone}
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            onChange={atualizar}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Aparelho *</label>
            <input
              name="aparelho"
              placeholder="Ex: iPhone 11"
              value={form.aparelho}
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              onChange={atualizar}
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Marca</label>
            <input
              name="marca"
              placeholder="Ex: Apple"
              value={form.marca}
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              onChange={atualizar}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1">Defeito Relatado</label>
          <textarea
            name="defeito"
            placeholder="Descreva o problema relatado pelo cliente..."
            value={form.defeito}
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded h-32 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            onChange={atualizar}
          />
        </div>

        <button
          type="submit"
          disabled={salvando}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 rounded-lg font-medium transition cursor-pointer text-white"
        >
          {salvando ? "Salvando..." : "Salvar OS"}
        </button>
      </form>
    </div>
  );
}