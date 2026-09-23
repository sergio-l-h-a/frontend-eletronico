import { useState } from "react";

interface ItemCarrinho {
  id: number;
  nome: string;
  precoUnitario: number;
  quantidade: number;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque?: number;
}

const API_URL = import.meta.env.VITE_API_URL || "https://backend-eletronico.onrender.com";

export default function PDVPage() {
  const [busca, setBusca] = useState<string>("");
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  function buscarProdutos() {
    fetch(`${API_URL}/api/pdv/buscar?q=${busca}`)
      .then((res) => res.json())
      .then((data) => setProdutos(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }

  function adicionar(produto: Produto) {
    const existe = carrinho.find((p) => p.id === produto.id);

    if (existe) {
      setCarrinho(
        carrinho.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      setCarrinho([
        ...carrinho,
        {
          id: produto.id,
          nome: produto.nome,
          precoUnitario: Number(produto.preco),
          quantidade: 1,
        },
      ]);
    }
  }

  function alterarQuantidade(id: number, q: number) {
    setCarrinho(
      carrinho.map((p) => (p.id === id ? { ...p, quantidade: q } : p))
    );
  }

  function finalizar() {
    fetch(`${API_URL}/api/pdv/finalizar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente: "Cliente Balcão",
        itens: carrinho,
      }),
    })
      .then((res) => res.json())
      .then((r) => {
        alert("Venda finalizada! ID: " + (r.vendaId || r.id || "Sucesso"));
        setCarrinho([]);
      })
      .catch((err) => console.error("Erro ao finalizar venda:", err));
  }

  const total = carrinho.reduce(
    (acc, p) => acc + (p.precoUnitario || 0) * (p.quantidade || 0),
    0
  );

  return (
    <div className="p-8 text-zinc-100">
      <h1 className="text-2xl font-bold mb-6">PDV - Frente de Caixa</h1>

      {/* Busca */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 p-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-100"
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button
          onClick={buscarProdutos}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-medium transition"
        >
          Buscar
        </button>
      </div>

      {/* Lista de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {produtos.map((p) => (
          <div
            key={p.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded flex items-center justify-between"
          >
            <div>
              <h2 className="font-semibold">{p.nome}</h2>
              <p className="text-zinc-400 text-sm">
                R$ {Number(p.preco).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => adicionar(p)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded transition"
            >
              Adicionar
            </button>
          </div>
        ))}
      </div>

      {/* Carrinho */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded">
        <h2 className="text-xl font-bold mb-4">Carrinho</h2>

        {carrinho.map((p) => (
          <div key={p.id} className="flex items-center justify-between mb-3">
            <span>{p.nome}</span>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min={1}
                value={p.quantidade}
                onChange={(e) =>
                  alterarQuantidade(p.id, Number(e.target.value))
                }
                className="w-16 p-2 bg-zinc-800 rounded text-center text-zinc-100"
              />
              <span className="w-24 text-right">
                R$ {((p.precoUnitario || 0) * p.quantidade).toFixed(2)}
              </span>
            </div>
          </div>
        ))}

        {carrinho.length === 0 && (
          <p className="text-zinc-500 text-sm py-4">
            Nenhum item no carrinho.
          </p>
        )}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold text-emerald-400">
            R$ {total.toFixed(2)}
          </span>
        </div>

        <button
          onClick={finalizar}
          disabled={carrinho.length === 0}
          className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-lg font-semibold transition"
        >
          Finalizar Venda
        </button>
      </div>
    </div>
  );
}