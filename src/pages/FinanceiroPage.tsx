import { useEffect, useState } from "react";

export default function FinanceiroPage() {
  const [resumo, setResumo] = useState<any>(null);
  const [despesas, setDespesas] = useState([]);
  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    categoria: "",
  });

  function carregarResumo() {
    fetch("http://localhost:4000/api/financeiro/resumo")
      .then((res) => res.json())
      .then(setResumo);
  }

  function carregarDespesas() {
    fetch("http://localhost:4000/api/financeiro/despesas")
      .then((res) => res.json())
      .then(setDespesas);
  }

  useEffect(() => {
    carregarResumo();
    carregarDespesas();
  }, []);

  function atualizarForm(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function salvarDespesa() {
    fetch("http://localhost:4000/api/financeiro/despesas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      setForm({ descricao: "", valor: "", categoria: "" });
      carregarResumo();
      carregarDespesas();
    });
  }

  if (!resumo) {
    return <div className="p-8 text-zinc-100">Carregando...</div>;
  }

  return (
    <div className="p-8 text-zinc-100 space-y-10">
      <h1 className="text-2xl font-bold">Financeiro</h1>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card titulo="Vendas" valor={resumo.totalVendas} cor="emerald" />
        <Card titulo="OS Concluídas" valor={resumo.totalOS} cor="blue" />
        <Card titulo="Despesas" valor={resumo.totalDespesas} cor="red" />
        <Card titulo="Lucro Líquido" valor={resumo.lucro} cor="amber" />
      </div>

      {/* Cadastro de despesas */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Registrar Despesa</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={atualizarForm}
            className="p-3 bg-zinc-800 border border-zinc-700 rounded"
          />
          <input
            name="valor"
            placeholder="Valor"
            value={form.valor}
            onChange={atualizarForm}
            className="p-3 bg-zinc-800 border border-zinc-700 rounded"
          />
          <input
            name="categoria"
            placeholder="Categoria"
            value={form.categoria}
            onChange={atualizarForm}
            className="p-3 bg-zinc-800 border border-zinc-700 rounded"
          />
        </div>

        <button
          onClick={salvarDespesa}
          className="mt-4 px-4 py-2 bg-emerald-600 rounded"
        >
          Salvar Despesa
        </button>
      </div>

      {/* Lista de despesas */}
      <div className="space-y-4">
        {despesas.map((d: any) => (
          <div
            key={d.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded"
          >
            <h3 className="font-semibold">{d.descricao}</h3>
            <p className="text-zinc-400 text-sm">R$ {d.valor}</p>
            <p className="text-zinc-500 text-sm">{d.categoria || "Sem categoria"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ titulo, valor, cor }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
      <p className="text-sm text-zinc-400">{titulo}</p>
      <p className={`text-2xl font-bold text-${cor}-400 mt-1`}>
        R$ {Number(valor || 0).toFixed(2)}
      </p>
    </div>
  );
}
