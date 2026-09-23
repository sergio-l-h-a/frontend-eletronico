import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface ItemVenda {
  id: number;
  descricao?: string;
  nome?: string;
  quantidade: number;
  valorUnitario?: number;
  preco?: number;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque?: number;
}

interface FormState {
  produtoId: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

const API_URL = import.meta.env.VITE_API_URL || "https://backend-eletronico.onrender.com";

export default function VendaItensPage() {
  const { id } = useParams<{ id: string }>();

  const [itens, setItens] = useState<ItemVenda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState<FormState>({
    produtoId: "",
    descricao: "",
    quantidade: 1,
    valorUnitario: 0,
  });

  function carregar() {
    if (!id) return;

    fetch(`${API_URL}/api/vendas/itens/${id}`)
      .then((res) => res.json())
      .then((data) => setItens(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar itens da venda:", err));

    fetch(`${API_URL}/api/estoque`)
      .then((res) => res.json())
      .then((data) => setProdutos(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  }

  useEffect(() => {
    carregar();
  }, [id]);

  function atualizar(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    // Se o usuário selecionar um produto, preenchemos o valorUnitario automaticamente
    if (name === "produtoId") {
      const prodEncontrado = produtos.find((p) => p.id === Number(value));
      setForm((prev) => ({
        ...prev,
        produtoId: value,
        valorUnitario: prodEncontrado ? Number(prodEncontrado.preco) : prev.valorUnitario,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function salvar() {
    if (!id || !form.produtoId) return;

    const produto = produtos.find((p) => p.id === Number(form.produtoId));

    fetch(`${API_URL}/api/vendas/itens/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        produtoId: Number(form.produtoId),
        descricao: produto ? produto.nome : "Produto",
        quantidade: Number(form.quantidade),
        valorUnitario: Number(form.valorUnitario),
      }),
    })
      .then(() => {
        setForm({
          produtoId: "",
          descricao: "",
          quantidade: 1,
          valorUnitario: 0,
        });
        carregar();
      })
      .catch((err) => console.error("Erro ao salvar item:", err));
  }

  function excluir(itemId: number) {
    if (!confirm("Excluir item?")) return;

    fetch(`${API_URL}/api/vendas/itens/${itemId}`, {
      method: "DELETE",
    })
      .then(carregar)
      .catch((err) => console.error("Erro ao excluir item:", err));
  }

  return (
    <div className="p-8 text-zinc-100">
      <h1 className="text-2xl font-bold mb-6">Itens da Venda #{id}</h1>

      {/* Formulário */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Adicionar Item</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            name="produtoId"
            value={form.produtoId}
            onChange={atualizar}
            className="p-3 bg-zinc-800 border border-zinc-700 rounded text-zinc-100"
          >
            <option value="">Selecione um produto</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} — R$ {Number(p.preco).toFixed(2)}
              </option>
            ))}
          </select>

          <input
            name="quantidade"
            type="number"
            min={1}
            value={form.quantidade}
            onChange={atualizar}
            placeholder="Quantidade"
            className="p-3 bg-zinc-800 border border-zinc-700 rounded text-zinc-100"
          />

          <input
            name="valorUnitario"
            type="number"
            step="0.01"
            value={form.valorUnitario}
            onChange={atualizar}
            placeholder="Valor Unitário (R$)"
            className="p-3 bg-zinc-800 border border-zinc-700 rounded text-zinc-100"
          />
        </div>

        <button
          onClick={salvar}
          disabled={!form.produtoId}
          className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded font-medium transition"
        >
          Salvar Item
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {itens.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">{item.descricao || item.nome}</p>
              <p className="text-zinc-400 text-sm">
                {item.quantidade} × R$ {Number(item.valorUnitario || item.preco || 0).toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => excluir(item.id)}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-sm font-medium rounded transition"
            >
              Excluir
            </button>
          </div>
        ))}

        {itens.length === 0 && (
          <p className="text-zinc-500 text-sm py-4">
            Nenhum item adicionado a esta venda.
          </p>
        )}
      </div>
    </div>
  );
}