import { useEffect, useState } from "react";
import { generarFacturaPDF } from "../utils/facturaGenerator";
import LoadingSpinner from "./LoadingSpinner";
import SkeletonLoader from "./SkeletonLoader";

// Función para formatear moneda colombiana
const formatCOP = (valor: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
};

export default function PurchasesList() {
  const [compras, setCompras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setTimeout(() => {
      const c = JSON.parse(localStorage.getItem("compras") || "[]");
      setCompras(c.reverse());
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm("Eliminar registro?")) return;
    const c = JSON.parse(localStorage.getItem("compras") || "[]");
    const filtered = c.filter((x: any) => x.id !== id);
    localStorage.setItem("compras", JSON.stringify(filtered));
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Compras Registradas</h2>
      {loading ? (
        <SkeletonLoader count={3} />
      ) : compras.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">📭 No hay compras registradas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {compras.map((c) => (
            <div
              key={c.id}
              className="bg-white p-4 rounded shadow border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-lg">
                    Factura #{c.id}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(c.fecha).toLocaleString("es-CO")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCOP(c.total)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {c.items?.length || 1} producto{c.items?.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              {c.items ? (
                <div className="mb-2 bg-gray-50 p-2 rounded text-sm">
                  {c.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs mb-1">
                      <span>{item.nombre} × {item.cantidad}</span>
                      <span>{formatCOP(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-2 text-sm text-gray-600">
                  {c.nombre} × {c.cantidad}
                </div>
              )}

              {c.nota && (
                <div className="mb-2 text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                  <strong>Nota:</strong> {c.nota}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
                  onClick={() => generarFacturaPDF(c)}
                >
                  📄 Descargar Factura
                </button>
                <button
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  onClick={() => handleDelete(c.id)}
                >
                  ✕ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
