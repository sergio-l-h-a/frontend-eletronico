import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wrench, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Menu, 
  X 
} from "lucide-react";

export function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Ordens de Serviço", icon: Wrench, path: "/os" },
    { label: "Estoque / Vendas", icon: Package, path: "/estoque" },
    { label: "Frente de Caixa", icon: ShoppingCart, path: "/pdv" },
    { label: "Clientes", icon: Users, path: "/clientes" },
    { label: "Financeiro", icon: DollarSign, path: "/financeiro" },
  ];

  return (
    <>
      {/* Botão Hamburguer no Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay no Mobile quando o menu tá aberto */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-zinc-900/50 border-r border-zinc-800/80 p-6 flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="space-y-8">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-zinc-100 flex items-center gap-2">
              <Wrench className="text-emerald-500" size={22} />
              OficinaPro
            </h1>
            <p className="text-[11px] text-zinc-500 mt-0.5">Gestão de Eletrodomésticos</p>
          </div>

          <nav className="space-y-1.5">
            {menu.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                    }
                  `}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}