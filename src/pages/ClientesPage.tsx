import { useEffect, useState } from "react";

interface Cliente {
  id: number;
  nome: string;
  telefone?: string;
  cpf?: string;
  email?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "https://backend-eletronico.onrender.com";

export default function ClientesPage() {
  const [lista, setLista] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    email: "",
  });

  function carregar() {
    fetch(`${API_URL}/api/clientes`)
      .then((res) => res.json())
      .then((data) => setLista(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar clientes:", err));
  }

  function buscar() {
    fetch(`${API_URL}/api/clientes/buscar?q=${busca}`)
      .then((res) => res.json())
      .then((data) => setLista(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao buscar clientes:", err));
  }

  useEffect(() => {
    carregar();
  }, []);

  function atualizarForm(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function salvar() {
    fetch(`${API_URL}/api/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao salvar cliente");
        return res.json();
      })
      .then(() => {
        alert("Cliente cadastrado!");
        setForm({ nome: "", telefone: "", cpf: "", email: "" });
        carregar();
      })
      .catch((err) => console.error("Erro ao cadastrar cliente:", err));
  }

  function excluir(id: number) {
    if (!confirm("Excluir cliente?")) return;

    fetch(`${API_URL}/api/clientes/${id}`, {
      method: "DELETE",
    })
      .then(() => carregar())
      .catch((err) => console.error("Erro ao excluir cliente:", err));
  }

  return (
    <div className="p-8 text-zinc-100">
      <h1 className="text-2xl font-bold mb-6">Clientes</h1>

      {/* Busca */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 p-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-100"
          placeholder="Buscar cliente por nome, telefone ou CPF..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button
          onClick={buscar}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-medium transition"
        >
          Buscar
        </button>
      </div>

      {/* Cadastro */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded mb-8">
        <h2 className="text-xl font-semibold mb-4">Cadastrar Cliente</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(["nome", "telefone", "cpf", "email"] as const).map((campo) => (
            <input
              key={campo}
              name={campo}
              placeholder={campo.toUpperCase()}
              value={form[campo]}
              onChange={atualizarForm}
              className="p-3 bg-zinc-800 border border-zinc-700 rounded text-zinc-100"
            />
          ))}
        </div>

        <button
          onClick={salvar}
          className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-medium transition"
        >
          Salvar Cliente
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {lista.map((c) => (
          <div
            key={c.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{c.nome}</h2>
              <button
                onClick={() => excluir(c.id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-sm font-medium rounded transition"
              >
                Excluir
              </button>
            </div>

            <p className="text-zinc-400 text-sm mt-1">
              Telefone: {c.telefone || "—"}
            </p>
            <p className="text-zinc-400 text-sm">
              CPF: {c.cpf || "—"}
            </p>
            <p className="text-zinc-400 text-sm">
              Email: {c.email || "—"}
            </p>
          </div>
        ))}

        {lista.length === 0 && (
          <p className="text-zinc-500 text-sm py-4">Nenhum cliente encontrado.</p>
        )}
      </div>
    </div>
  );
}