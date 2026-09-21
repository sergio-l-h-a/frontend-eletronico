import { useEffect, useState } from "react";

export default function EstoquePage() {
  const [lista, setLista] = useState([]);
  const [busca, setBusca] = useState("");

  function carregar() {
    fetch("http://localhost:4000/api/estoque")
      .then((res) => res.json())
      .then(setLista);
  }

  function buscar() {
    fetch(`http://localhost:4000/api/estoque/buscar?q=${busca}`)
      .then((res) => res.json())
      .then(setLista);
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="p-8 text-zinc-100">
      <h1 className="text-2xl font-bold mb-6">Controle de Estoque</h1>

      {/* Busca */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 p-3 bg-zinc-900 border border-zinc-800 rounded"
          placeholder="Buscar produto..."
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

      {/* Lista */}
      <div className="space-y-4">
        {lista.map((p: any) => (
          <div
            key={p.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{p.nome}</h2>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  p.estoqueAtual <= p.estoqueMinimo
                    ? "bg-red-500/20 text-red-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {p.estoqueAtual <= p.estoqueMinimo
                  ? "Estoque Baixo"
                  : "OK"}
              </span>
            </div>

            <p className="text-zinc-400 text-sm mt-1">
              Preço: R$ {p.preco}
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
                className="px-3 py-1 bg-blue-600 rounded"
              >
                Entrada
              </button>

              <button
                onClick={() => saida(p.id)}
                className="px-3 py-1 bg-amber-600 rounded"
              >
                Saída
              </button>

              <button
                onClick={() => excluir(p.id)}
                className="px-3 py-1 bg-red-600 rounded"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  function entrada(id: number) {
    const q = Number(prompt("Quantidade de entrada:"));
    if (!q) return;

    fetch(`http://localhost:4000/api/estoque/${id}/entrada`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade: q }),
    }).then(carregar);
  }

  function saida(id: number) {
    const q = Number(prompt("Quantidade de saída:"));
    if (!q) return;

    fetch(`http://localhostlocalhost:4000/api/estoque/${id}/saida`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade: q }),
    }).then(carregar);
  }

  function excluir(id: number) {
    if (!confirm("Excluir produto?")) return;

    fetch(`http://localhost:4000/api/estoque/${id}`, {
      method: "DELETE",
    }).then(carregar);
  }
}
