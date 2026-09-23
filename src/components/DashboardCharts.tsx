import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Seg", receitaOS: 400, receitaPecas: 240 },
  { name: "Ter", receitaOS: 300, receitaPecas: 139 },
  { name: "Qua", receitaOS: 200, receitaPecas: 980 },
  { name: "Qui", receitaOS: 278, receitaPecas: 390 },
  { name: "Sex", receitaOS: 189, receitaPecas: 480 },
  { name: "Sáb", receitaOS: 239, receitaPecas: 380 },
];

const formatYAxis = (value: number) => {
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}k`;
  }
  return `R$ ${value}`;
};

interface DashboardChartsProps {
  className?: string;
}

export default function DashboardCharts({ className = "h-64 sm:h-80" }: DashboardChartsProps) {
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          
          <XAxis
            dataKey="name"
            stroke="#a1a1aa"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={5}
          />
          
          <YAxis
            stroke="#a1a1aa"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxis}
            width={55}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              borderColor: "#27272a",
              borderRadius: "0.5rem",
              color: "#f4f4f5",
              fontSize: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
            }}
            formatter={(value: any) => [
              `R$ ${Number(value || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            ]}
            cursor={{ fill: "#27272a", opacity: 0.4 }}
          />

          <Legend
            wrapperStyle={{
              fontSize: "12px",
              color: "#a1a1aa",
              paddingTop: "12px",
            }}
          />

          <Bar
            dataKey="receitaOS"
            name="Mão de Obra (OS)"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="receitaPecas"
            name="Venda de Peças"
            fill="#f59e0b"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}