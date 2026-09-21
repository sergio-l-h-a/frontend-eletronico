import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VendaItensPage() {
  const { id } = useParams();
  const [itens, setItens] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({
    produtoId: "",
    descricao: "",
    quantidade: 1,
    valorUnitario: 0,
  });

  function carregar() {
    fetch(`http://localhost:4000/api/vendas/itens/${id}`)
      .then((res) => res.json())
      .then(setItens);

    fetch("http://localhost:4000/api/estoque")
      .then((res) => res.json())
      .then(setProdutos);
  }

  useEffect(() => {
    carregar();
  }, []);

  function atualizar(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function salvar() {
    const produto = produtos.find((p) => p.id == form.produtoId);

    fetch(`http://localhost:4000/api/vendas/itens/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        produtoId: Number(form.produtoId),
        descricao: produto.nome,
        quantidade: Number(form.quantidade),
        valorUnitario: Number(form.valorUnitario),
      }),
    }).then(() => {
      setForm({
        produtoId: "",
        descricao: "",
        quantidade: 1,
        valorUnitario: 0,
      });
      carregar();
    });
  }

  function excluir(itemId: number) {
    if (!confirm("Excluir item?")) return;

    fetch(`http://localhost:4000/api/vendas/itens/${itemId}`, {
      method: "DELETE",
    }).then(carregar);
  }

  return (
    <div className="p-8 text-zinc-100">
      <h1 className="text-2xl font-bold mb-6">Itens da Venda #{id}</h1>

      {/* Formulário */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded mb-8">
        <h2 className="text-xl font-semibold mb-4">Adicionar Item</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="produtoId"
            value={form.produtoId}
            onChange={atualizar}
            className="p-3 bg-zinc-800 border border-zinc-700 rounded"
          >
            <option value="">Selecione um produto</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} — R$ {p.preco}
              </option>
            ))}
          </select>

          <input
            name="quantidade"
            type="number"
            value={form.quantidade}
            onChange={atualizar}
            className="p-3 bg-zinc-800 border border-zinc-700 rounded"
          />

          <input
            name="valorUnitario"
            type="number"
            value={form.valorUnitario}
            onChange={atualizar}
            className="p-3 bg-zinc-800 border border-zinc-700 rounded"
          />
        </div>

        <button
          onClick={salvar}
          className="mt-4 px-4 py-2 bg-emerald-600 rounded"
        >
          Salvar Item
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {itens.map((item: any) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">{item.descricao}</p>
              <p className="text-zinc-400 text-sm">
                {item.quantidade} × R$ {item.valorUnitario}
              </p>
            </div>

            <button
              onClick={() => excluir(item.id)}
              className="px-3 py-1 bg-red-600 rounded"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
