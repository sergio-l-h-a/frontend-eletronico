import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function OSPage() {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/os")
      .then((res) => res.json())
      .then(setLista);
  }, []);

  return (
    <div className="p-8 text-zinc-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
        <Link
          to="/nova-os"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg"
        >
          Nova OS
        </Link>
      </div>

      <div className="space-y-4">
        {lista.map((os: any) => (
          <div
            key={os.id}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                OS #{os.id.toString().padStart(4, "0")}
              </h2>
              <span className="text-xs px-2 py-1 bg-zinc-800 rounded">
                {os.status}
              </span>
            </div>

            <p className="text-zinc-400 mt-1">
              {os.aparelho} — {os.marca}
            </p>

            <p className="text-zinc-500 text-sm mt-2">
              Cliente: {os.cliente} — {os.telefone}
            </p>

            <Link
              to={`/os/${os.id}`}
              className="text-emerald-400 text-sm mt-3 inline-block"
            >
              Ver detalhes →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
