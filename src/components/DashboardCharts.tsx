import DashboardCharts from "../components/DashboardCharts"; // Ajuste o caminho se necessário

export default function DashboardPage() {
  return (
    <div className="w-full space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Visão Geral da Oficina</h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Acompanhe seus KPIs e o movimento do dia.
        </p>
      </div>

      {/* Grid de KPIs: 1 coluna no mobile, 2 em tablets, 4 em monitores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        {/* KPI 1 */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-zinc-400 font-medium">Faturamento Mês</p>
            <p className="text-xl sm:text-2xl font-bold text-zinc-100">R$ 140.00</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <span className="text-lg font-bold">$</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-zinc-400 font-medium">OS em Aberto</p>
            <p className="text-xl sm:text-2xl font-bold text-zinc-100">3</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
            <span className="text-lg">🔧</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-zinc-400 font-medium">Estoque Baixo</p>
            <p className="text-xl sm:text-2xl font-bold text-zinc-100">1</p>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-lg">
            <span className="text-lg">⚠️</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-zinc-400 font-medium">Ticket Médio (OS)</p>
            <p className="text-xl sm:text-2xl font-bold text-zinc-100">R$ 46.67</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
            <span className="text-lg">📈</span>
          </div>
        </div>
      </div>

      {/* Grid Principal: 1 coluna no mobile, dividida no Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Gráfico */}
        <div className="lg:col-span-2 p-5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4 w-full">
          <h2 className="text-base font-semibold text-center sm:text-left">
            Fluxo de Receitas (Simulação)
          </h2>
          <div className="w-full overflow-hidden">
            <DashboardCharts />
          </div>
        </div>

        {/* Fila de OS Ativas */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Fila de OS Ativas</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Ao Vivo
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-zinc-200">OS #0001</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
                  Aguardando Avaliação
                </span>
              </div>
              <p className="text-sm text-zinc-300">Ventilador Mondial</p>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-zinc-200">OS #0002</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 text-[10px]">
                  Pronto para Retirada
                </span>
              </div>
              <p className="text-sm text-zinc-300">Liquidificador Arno</p>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-zinc-200">OS #0003</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
                  Aguardando Avaliação
                </span>
              </div>
              <p className="text-sm text-zinc-300">Microonda Electrolux</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}