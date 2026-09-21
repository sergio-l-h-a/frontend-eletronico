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

export default function DashboardCharts() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#a1a1aa"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$ ${value}`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#f4f4f5" }}
            itemStyle={{ color: "#10b981" }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }} />
          <Bar dataKey="receitaOS" name="Mão de Obra (OS)" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="receitaPecas" name="Venda de Peças" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
