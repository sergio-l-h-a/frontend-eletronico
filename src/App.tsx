import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";

import DashboardPage from "./pages/DashboardPage";
import OSPage from "./pages/OSPage";
import NovaOSPage from "./pages/NovaOSPage";
import PDVPage from "./pages/PDVPage";
import EstoquePage from "./pages/EstoquePage";
import FinanceiroPage from "./pages/FinanceiroPage";
import ClientesPage from "./pages/ClientesPage";
import './styles/globals.css';

export default function App() {
  return (
    <div className="bg-zinc-950 text-zinc-50 antialiased h-screen overflow-hidden flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-zinc-950">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/os" element={<OSPage />} />
          <Route path="/ordens-servico" element={<NovaOSPage />} />
          <Route path="/pdv" element={<PDVPage />} />
          <Route path="/estoque" element={<EstoquePage />} />
          <Route path="/financeiro" element={<FinanceiroPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
        </Routes>
      </main>
    </div>
  );
}