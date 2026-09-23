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

  async function enviar() {
    if (!form.cliente || !form.aparelho) {
      alert("Por favor, preencha pelo menos o cliente e o aparelho.");
      return;
    }

    setSalvando(true);

    try {
      // Ajustado de /api/os para /ordens-servico (rota real do backend)
      const res = await fetch(`${API_URL}/api/ordens-servico`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar a Ordem de Serviço.");
      }

      alert("OS criada com sucesso!");
      // Redireciona para a rota correta da listagem
      navigate("/api/ordens-servico");
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

      <div className="space-y-4">
        {(["cliente", "telefone", "aparelho", "marca"] as const).map((campo) => (
          <input
            key={campo}
            name={campo}
            placeholder={campo.toUpperCase()}
            value={form[campo]}
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            onChange={atualizar}
          />
        ))}

        <textarea
          name="defeito"
          placeholder="Descreva o defeito"
          value={form.defeito}
          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded h-32 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          onChange={atualizar}
        />

        <button
          onClick={enviar}
          disabled={salvando}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 rounded-lg font-medium transition cursor-pointer"
        >
          {salvando ? "Salvando..." : "Salvar OS"}
        </button>
      </div>
    </div>
  );
}