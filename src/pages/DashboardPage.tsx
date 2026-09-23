import { useEffect, useState } from "react";
import { DollarSign, Wrench, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";
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

const API_URL = import.meta.env.VITE_API_URL || "https://backend-eletronico.onrender.com";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Faz o consumo das rotas ativas do backend em paralelo
      const [resOS, resProd, resVendas] = await Promise.all([
        fetch(`${API_URL}/api/ordens-servico`),
        fetch(`${API_URL}/api/produtos`),
        fetch(`${API_URL}/api/vendas-balcao`).catch(() => null) // Fallback caso vendas não esteja populado
      ]);

      if (!resOS.ok || !resProd.ok) {
        throw new Error("Erro ao buscar dados das rotas do servidor");
      }

      const ordens = await resOS.json();
      const produtos = await resProd.json();
      const vendas = resVendas && resVendas.ok ? await resVendas.json() : [];

      const osList = Array.isArray(ordens) ? ordens : [];
      const prodList = Array.isArray(produtos) ? produtos : [];
      const vendList = Array.isArray(vendas) ? vendas : [];

      // Cálculos dinâmicos para os KPIs
      const receitaOs = osList.reduce((acc: number, item: any) => acc + Number(item.valorTotal || 0), 0);
      const receitaBalcao = vendList.reduce((acc: number, item: any) => acc + Number(item.valorTotal || 0), 0);
      const totalReceita = receitaOs + receitaBalcao;
      
      const osAbertas = osList.filter((item: any) => item.status !== "Entregue" && item.status !== "Cancelado").length;
      const estoqueBaixo = prodList.filter((item: any) => Number(item.estoqueAtual || 0) <= Number(item.estoqueMinimo || 0)).length;

      // Mapeamento das 5 últimas OSs
      const recentOsMapped: RecentOS[] = osList.slice(-5).reverse().map((item: any) => ({
        id: item.id,
        aparelho: item.aparelho || item.descricao || "Aparelho",
        marca: item.marca || "",
        status: item.status || "Aguardando",
        valorTotal: item.valorTotal ? String(item.valorTotal) : "0.00",
        criadoEm: item.criadoEm || null
      }));

      setData({
        receitaOs,
        receitaBalcao,
        totalReceita,
        osAbertas,
        estoqueBaixo,
        recentOs: recentOsMapped
      });
    } catch (err) {
      console.error("Falha ao buscar dados do dashboard:", err);
      setError("Não foi possível conectar ao servidor. Verifique a URL da API ou conexão.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-zinc-400 flex items-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin" /> Carregando informações do servidor...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl m-8 flex flex-col items-start gap-4">
        <p className="font-semibold">{error || "Ocorreu um erro ao carregar os dados."}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const { totalReceita = 0, osAbertas = 0, estoqueBaixo = 0, receitaOs = 0, recentOs = [] } = data;

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
            <p className="text-2xl font-bold text-zinc-100 mt-1">R$ {Number(totalReceita).toFixed(2)}</p>
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
              R$ {osAbertas > 0 ? (Number(receitaOs) / osAbertas).toFixed(2) : "0.00"}
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