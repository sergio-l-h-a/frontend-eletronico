import { useEffect, useState } from "react";

interface ResumoFinanceiro {
  totalVendas: number;
  totalOS: number;
  totalDespesas: number;
  lucro: number;
}

interface Despesa {
  id: number;
  descricao: string;
  valor: number;
  categoria?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "https://backend-eletronico.onrender.com";

export default function FinanceiroPage() {
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    categoria: "",
  });

  function carregarResumo() {
    fetch(`${API_URL}/api/financeiro/resumo`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === "object") setResumo(data);
      })
      .catch((err) => console.error("Erro ao carregar resumo financeiro:", err));
  }

  function carregarDespesas() {
    fetch(`${API_URL}/api/financeiro/despesas`)
      .then((res) => res.json())
      .then((data) => setDespesas(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar despesas:", err))
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregarResumo();
    carregarDespesas();
  }, []);

  function atualizarForm(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function salvarDespesa() {
    if (!form.descricao || !form.valor) {
      alert("Preencha a descrição e o valor da despesa.");
      return;
    }

    fetch(`${API_URL}/api/financeiro/despesas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        valor: Number(form.valor.replace(",", ".")),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao salvar despesa");
        return res.json();
      })
      .then(() => {
        setForm({ descricao: "", valor: "", categoria: "" });
        carregarResumo();
        carregarDespesas();
      })
      .catch((err) => console.error("Erro ao cadastrar despesa:", err));
  }

  if (carregando && !resumo) {
    return <div className="p-8 text-zinc-100">Carregando dados financeiros...</div>;
  }

  return (
    <div className="p-8 text-zinc-100 space-y-10">
      <h1 className="text-2xl font-bold">Financeiro</h1>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card titulo="Vendas" valor={resumo?.totalVendas} cor="emerald" />
        <Card titulo="OS Concluídas" valor={resumo?.totalOS} cor="blue" />
        <Card titulo="Despesas" valor={resumo?.totalDespesas} cor="red" />
        <Card titulo="Lucro Líquido" valor={resumo?.lucro} cor="amber" />
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
            className="p-3 bg-zinc-800 border border-zinc-700 rounded text-zinc-100"
          />
          <input
            name="valor"
            type="number"
            step="0.01"
            placeholder="Valor (R$)"
            value={form.valor}
            onChange={atualizarForm}
            className="p-3 bg-zinc-800 border border-zinc-700 rounded text-zinc-100"
          />
          <input
            name="categoria"
            placeholder="Categoria"
            value={form.categoria}
            onChange={atualizarForm}
            className="p-3 bg-zinc-800 border border-zinc-700 rounded text-zinc-100"
          />
        </div>

        <button
          onClick={salvarDespesa}
          className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-medium transition"
        >
          Salvar Despesa
        </button>
      </div>

      {/* Lista de despesas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Histórico de Despesas</h2>
        {despesas.map((d) => (
          <div
            key={d.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{d.descricao}</h3>
              <p className="text-zinc-500 text-sm">{d.categoria || "Sem categoria"}</p>
            </div>
            <p className="text-red-400 font-bold">
              - R$ {Number(d.valor || 0).toFixed(2)}
            </p>
          </div>
        ))}

        {despesas.length === 0 && (
          <p className="text-zinc-500 text-sm py-2">Nenhuma despesa registrada.</p>
        )}
      </div>
    </div>
  );
}

interface CardProps {
  titulo: string;
  valor?: number;
  cor: "emerald" | "blue" | "red" | "amber";
}

function Card({ titulo, valor, cor }: CardProps) {
  const corTexto = {
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    red: "text-red-400",
    amber: "text-amber-400",
  }[cor];

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
      <p className="text-sm text-zinc-400">{titulo}</p>
      <p className={`text-2xl font-bold ${corTexto} mt-1`}>
        R$ {Number(valor || 0).toFixed(2)}
      </p>
    </div>
  );
}