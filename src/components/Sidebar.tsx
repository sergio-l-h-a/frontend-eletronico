import { Wrench, Package, MonitorPlay, Users, DollarSign, LayoutDashboard } from "lucide-react";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Ordens de Serviço", href: "/os", icon: Wrench },
  { name: "Estoque / Vendas", href: "/estoque", icon: Package },
  { name: "Frente de Caixa", href: "/pdv", icon: MonitorPlay },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Financeiro", href: "/financeiro", icon: DollarSign },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
          <Wrench className="w-6 h-6" />
          OficinaPro
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Gestão de Eletrodomésticos</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
