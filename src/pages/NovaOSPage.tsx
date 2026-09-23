import { useState } from "react";
import { useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL || "https://backend-eletronico.onrender.com";

export default function NovaOSPage() {
  const navigate = useNavigate();
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

  function enviar() {
    if (!form.cliente || !form.aparelho) {
      alert("Por favor, preencha pelo menos o cliente e o aparelho.");
      return;
    }

    fetch(`${API_URL}/api/os`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao criar a Ordem de Serviço.");
        return res.json();
      })
      .then(() => {
        alert("OS criada com sucesso!");
        navigate("/os");
      })
      .catch((err) => {
        console.error("Erro ao criar OS:", err);
        alert("Falha ao salvar a OS. Tente novamente.");
      });
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
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500"
            onChange={atualizar}
          />
        ))}

        <textarea
          name="defeito"
          placeholder="Descreva o defeito"
          value={form.defeito}
          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded h-32 text-zinc-100 placeholder-zinc-500"
          onChange={atualizar}
        />

        <button
          onClick={enviar}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition"
        >
          Salvar OS
        </button>
      </div>
    </div>
  );
}