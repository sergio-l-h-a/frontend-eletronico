import { useEffect, useState } from "react";
import { DollarSign, Wrench, AlertTriangle, TrendingUp } from "lucide-react";
import DashboardCharts from "../components/DashboardCharts";

type RecentOS = {
  id: number;
  aparelho: string;
  marca: string | null;
  status: string;
  valorTotal: string | null;
  criadoEm: string | null;
};

type DashboardData = {
  receitaOs: number;
  receitaBalcao: number;
  osAbertas: number;
  estoqueBaixo: number;
  recentOs: RecentOS[];
  totalReceita: number;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <div className="p-8">Carregando...</div>;
  }

  const { totalReceita, osAbertas, estoqueBaixo, receitaOs, recentOs } = data;

  return (
    <div className="p-8 space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-zinc-100">Visão Geral da Oficina</h2>
        <p className="text-zinc-400 mt-1">Acompanhe seus KPIs e o movimento do dia.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400 font-medium">Faturamento Mês</p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">R$ {totalReceita.toFixed(2)}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400 font-medium">OS em Aberto</p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">{osAbertas}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400 font-medium">Estoque Baixo</p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">{estoqueBaixo}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400 font-medium">Ticket Médio (OS)</p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">
              R$ {data.osAbertas > 0 ? (receitaOs / data.osAbertas).toFixed(2) : "0.00"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-6">Fluxo de Receitas (Simulação)</h3>
          <DashboardCharts />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-zinc-100">Fila de OS Ativas</h3>
            <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full">Ao Vivo</span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {recentOs.map((os) => (
              <div key={os.id} className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-200">
                    OS #{os.id.toString().padStart(4, "0")}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-zinc-800 text-zinc-300">
                    {os.status}
                  </span>
                </div>
                <div className="text-sm text-zinc-400">
                  {os.aparelho} {os.marca}
                </div>
              </div>
            ))}
            {recentOs.length === 0 && (
              <p className="text-zinc-500 text-sm text-center py-4">Nenhuma OS em andamento.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
