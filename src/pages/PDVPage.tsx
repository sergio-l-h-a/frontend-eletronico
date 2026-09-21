import { useState } from "react";

export default function PDVPage() {
  const [busca, setBusca] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);

  function buscarProdutos() {
    fetch(`http://localhost:4000/api/pdv/buscar?q=${busca}`)
      .then((res) => res.json())
      .then(setProdutos);
  }

  function adicionar(produto: any) {
    const existe = carrinho.find((p) => p.id === produto.id);

    if (existe) {
      existe.quantidade++;
      setCarrinho([...carrinho]);
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  }

  function alterarQuantidade(id: number, q: number) {
    const novo = carrinho.map((p) =>
      p.id === id ? { ...p, quantidade: q } : p
    );
    setCarrinho(novo);
  }

  function finalizar() {
    fetch("http://localhost:4000/api/pdv/finalizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente: "Cliente Balcão",
        itens: carrinho,
      }),
    })
      .then((res) => res.json())
      .then((r) => {
        alert("Venda finalizada! ID: " + r.vendaId);
        setCarrinho([]);
      });
  }

  const total = carrinho.reduce(
    (acc, p) => acc + p.precoUnitario * p.quantidade,
    0
  );

  return (
    <div className="p-8 text-zinc-100">
      <h1 className="text-2xl font-bold mb-6">PDV - Frente de Caixa</h1>

      {/* Busca */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 p-3 bg-zinc-900 border border-zinc-800 rounded"
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button
          onClick={buscarProdutos}
          className="px-4 py-2 bg-emerald-600 rounded"
        >
          Buscar
        </button>
      </div>

      {/* Lista de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {produtos.map((p: any) => (
          <div
            key={p.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded"
          >
            <h2 className="font-semibold">{p.nome}</h2>
            <p className="text-zinc-400 text-sm">R$ {p.preco}</p>
            <button
              onClick={() => adicionar(p)}
              className="mt-3 px-3 py-1 bg-emerald-600 rounded"
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
            <input
              type="number"
              min={1}
              value={p.quantidade}
              onChange={(e) =>
                alterarQuantidade(p.id, Number(e.target.value))
              }
              className="w-16 p-2 bg-zinc-800 rounded"
            />
            <span>R$ {(p.precoUnitario * p.quantidade).toFixed(2)}</span>
          </div>
        ))}

        <div className="flex items-center justify-between mt-6">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold">R$ {total.toFixed(2)}</span>
        </div>

        <button
          onClick={finalizar}
          className="mt-6 w-full py-3 bg-emerald-600 rounded text-lg font-semibold"
        >
          Finalizar Venda
        </button>
      </div>
    </div>
  );
}
