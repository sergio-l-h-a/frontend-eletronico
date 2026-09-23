import { useEffect, useState } from "react";

interface ProdutoEstoque {
  id: number;
  nome: string;
  preco: number;
  estoqueAtual: number;
  estoqueMinimo: number;
}

const API_URL = import.meta.env.VITE_API_URL || "https://backend-eletronico.onrender.com";

export default function EstoquePage() {
  const [lista, setLista] = useState<ProdutoEstoque[]>([]);
  const [busca, setBusca] = useState("");

  function carregar() {
    fetch(`${API_URL}/api/estoque`)
      .then((res) => res.json())
      .then((data) => setLista(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar estoque:", err));
  }

  function buscar() {
    fetch(`${API_URL}/api/estoque/buscar?q=${busca}`)
      .then((res) => res.json())
      .then((data) => setLista(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao buscar no estoque:", err));
  }

  useEffect(() => {
    carregar();
  }, []);

  function entrada(id: number) {
    const q = Number(prompt("Quantidade de entrada:"));
    if (!q || isNaN(q)) return;

    fetch(`${API_URL}/api/estoque/${id}/entrada`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade: q }),
    })
      .then(() => carregar())
      .catch((err) => console.error("Erro ao dar entrada:", err));
  }

  function saida(id: number) {
    const q = Number(prompt("Quantidade de saída:"));
    if (!q || isNaN(q)) return;

    fetch(`${API_URL}/api/estoque/${id}/saida`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade: q }),
    })
      .then(() => carregar())
      .catch((err) => console.error("Erro ao dar saída:", err));
  }

  function excluir(id: number) {
    if (!confirm("Excluir produto?")) return;

    fetch(`${API_URL}/api/estoque/${id}`, {
      method: "DELETE",
    })
      .then(() => carregar())
      .catch((err) => console.error("Erro ao excluir produto:", err));
  }

  return (
    <div className="p-8 text-zinc-100">
      <h1 className="text-2xl font-bold mb-6">Controle de Estoque</h1>

      {/* Busca */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 p-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-100"
          placeholder="Buscar produto..."
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

      {/* Lista */}
      <div className="space-y-4">
        {lista.map((p) => (
          <div
            key={p.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{p.nome}</h2>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  p.estoqueAtual <= p.estoqueMinimo
                    ? "bg-red-500/20 text-red-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {p.estoqueAtual <= p.estoqueMinimo ? "Estoque Baixo" : "OK"}
              </span>
            </div>

            <p className="text-zinc-400 text-sm mt-1">
              Preço: R$ {Number(p.preco || 0).toFixed(2)}
            </p>

            <p className="text-zinc-400 text-sm">
              Estoque Atual: {p.estoqueAtual}
            </p>

            <p className="text-zinc-400 text-sm">
              Estoque Mínimo: {p.estoqueMinimo}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => entrada(p.id)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition"
              >
                Entrada
              </button>

              <button
                onClick={() => saida(p.id)}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded text-sm font-medium transition"
              >
                Saída
              </button>

              <button
                onClick={() => excluir(p.id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm font-medium transition"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {lista.length === 0 && (
          <p className="text-zinc-500 text-sm py-4">
            Nenhum produto em estoque encontrado.
          </p>
        )}
      </div>
    </div>
  );
}