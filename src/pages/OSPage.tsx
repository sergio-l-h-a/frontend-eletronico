import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface OrdemServico {
  id: number;
  cliente: string;
  telefone?: string;
  aparelho: string;
  marca?: string;
  status: string;
}

const API_URL = import.meta.env.VITE_API_URL || "https://backend-eletronico.onrender.com";

export default function OSPage() {
  const [lista, setLista] = useState<OrdemServico[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/os`)
      .then((res) => res.json())
      .then((data) => setLista(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar Ordens de Serviço:", err))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="p-8 text-zinc-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
        <Link
          to="/nova-os"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition"
        >
          Nova OS
        </Link>
      </div>

      {carregando ? (
        <p className="text-zinc-500 text-sm">Carregando ordens de serviço...</p>
      ) : (
        <div className="space-y-4">
          {lista.map((os) => (
            <div
              key={os.id}
              className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  OS #{os.id.toString().padStart(4, "0")}
                </h2>
                <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded font-medium">
                  {os.status || "Pendente"}
                </span>
              </div>

              <p className="text-zinc-400 mt-1">
                {os.aparelho} {os.marca ? `— ${os.marca}` : ""}
              </p>

              <p className="text-zinc-500 text-sm mt-2">
                Cliente: {os.cliente} {os.telefone ? `— ${os.telefone}` : ""}
              </p>

              <Link
                to={`/os/${os.id}`}
                className="text-emerald-400 hover:text-emerald-300 text-sm mt-3 inline-block font-medium"
              >
                Ver detalhes →
              </Link>
            </div>
          ))}

          {lista.length === 0 && (
            <p className="text-zinc-500 text-sm py-4">
              Nenhuma ordem de serviço cadastrada.
            </p>
          )}
        </div>
      )}
    </div>
  );
}