import { useState } from "react";

export default function NovaOSPage() {
  const [form, setForm] = useState({
    cliente: "",
    telefone: "",
    aparelho: "",
    marca: "",
    defeito: "",
  });

  function atualizar(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function enviar() {
    fetch("http://localhost:4000/api/os", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      alert("OS criada com sucesso!");
      window.location.href = "/os";
    });
  }

  return (
    <div className="p-8 text-zinc-100 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Criar Nova OS</h1>

      <div className="space-y-4">
        {["cliente", "telefone", "aparelho", "marca"].map((campo) => (
          <input
            key={campo}
            name={campo}
            placeholder={campo.toUpperCase()}
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded"
            onChange={atualizar}
          />
        ))}

        <textarea
          name="defeito"
          placeholder="Descreva o defeito"
          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded h-32"
          onChange={atualizar}
        />

        <button
          onClick={enviar}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg"
        >
          Salvar OS
        </button>
      </div>
    </div>
  );
}
