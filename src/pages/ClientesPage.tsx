import { useEffect, useState } from "react";

export default function ClientesPage() {
  const [lista, setLista] = useState([]);
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    email: "",
  });

  function carregar() {
    fetch("http://localhost:4000/api/clientes")
      .then((res) => res.json())
      .then(setLista);
  }

  function buscar() {
    fetch(`http://localhost:4000/api/clientes/buscar?q=${busca}`)
      .then((res) => res.json())
      .then(setLista);
  }

  useEffect(() => {
    carregar();
  }, []);

  function atualizarForm(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function salvar() {
    fetch("http://localhost:4000/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      alert("Cliente cadastrado!");
      setForm({ nome: "", telefone: "", cpf: "", email: "" });
      carregar();
    });
  }

  function excluir(id: number) {
    if (!confirm("Excluir cliente?")) return;

    fetch(`http://localhost:4000/api/clientes/${id}`, {
      method: "DELETE",
    }).then(carregar);
  }

  return (
    <div className="p-8 text-zinc-100">
      <h1 className="text-2xl font-bold mb-6">Clientes</h1>

      {/* Busca */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 p-3 bg-zinc-900 border border-zinc-800 rounded"
          placeholder="Buscar cliente por nome, telefone ou CPF..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button
          onClick={buscar}
          className="px-4 py-2 bg-emerald-600 rounded"
        >
          Buscar
        </button>
      </div>

      {/* Cadastro */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded mb-8">
        <h2 className="text-xl font-semibold mb-4">Cadastrar Cliente</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["nome", "telefone", "cpf", "email"].map((campo) => (
            <input
              key={campo}
              name={campo}
              placeholder={campo.toUpperCase()}
              value={(form as any)[campo]}
              onChange={atualizarForm}
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
          ))}
        </div>

        <button
          onClick={salvar}
          className="mt-4 px-4 py-2 bg-emerald-600 rounded"
        >
          Salvar Cliente
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {lista.map((c: any) => (
          <div
            key={c.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{c.nome}</h2>
              <button
                onClick={() => excluir(c.id)}
                className="px-3 py-1 bg-red-600 rounded"
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
      </div>
    </div>
  );
}
