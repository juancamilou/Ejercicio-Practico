import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { obtenerCompras } from "../api";
import LoadingSpinner from "./LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

// Función para formatear moneda colombiana
const formatCOP = (valor: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
};

interface ItemCarrito {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

interface Compra {
  id: number;
  items: ItemCarrito[];
  descuentoGlobal: number;
  subtotal: number;
  total: number;
  nota: string;
  fecha: string;
  nombreProducto?: string;
  fechaCompra?: string;
  descuento?: number;
}

export default function SalesCharts() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [ventasPorProducto, setVentasPorProducto] = useState<any>({});
  const [ventasPorDia, setVentasPorDia] = useState<any>({});
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    cantidadCompras: 0,
    montoTotal: 0,
    montoPromedio: 0,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const cargarCompras = async () => {
      setLoading(true);
      try {
        const res = await obtenerCompras();
        const c = res.data?.datos || res.data || [];
        if (!Array.isArray(c) || c.length === 0) {
          throw new Error("No hay compras en la API");
        }
        processCompras(c);
      } catch (error) {
        const c = JSON.parse(localStorage.getItem("compras") || "[]");
        processCompras(c);
      } finally {
        setLoading(false);
      }
    };

    const processCompras = (c: Compra[]) => {
      const ventasProducto: any = {};
      const ventasDia: any = {};
      let totalVentas = 0;
      let montoTotal = 0;

      c.forEach((compra: Compra) => {
        const total = compra.total ?? compra.subtotal ?? 0;
        totalVentas += 1;
        montoTotal += total;

        if (compra.items?.length) {
          compra.items.forEach((item: ItemCarrito) => {
            ventasProducto[item.nombre] =
              (ventasProducto[item.nombre] || 0) + item.cantidad;
          });
        } else if (compra.nombreProducto) {
          ventasProducto[compra.nombreProducto] =
            (ventasProducto[compra.nombreProducto] || 0) +
            (compra.cantidad || 0);
        }

        const fecha = new Date(
          compra.fecha || compra.fechaCompra || new Date(),
        ).toLocaleDateString("es-CO");
        ventasDia[fecha] = (ventasDia[fecha] || 0) + total;
      });

      setCompras(c);
      setVentasPorProducto(ventasProducto);
      setVentasPorDia(ventasDia);
      setEstadisticas({
        totalVentas,
        cantidadCompras: c.length,
        montoTotal,
        montoPromedio: c.length > 0 ? Math.round(montoTotal / c.length) : 0,
      });
    };

    cargarCompras();
  }, []);

  // Datos para gráfico de barras (ventas por producto)
  const productosLabels = Object.keys(ventasPorProducto).sort(
    (a, b) => ventasPorProducto[b] - ventasPorProducto[a],
  );
  const productosData = productosLabels.map((p) => ventasPorProducto[p]);

  const dataProductos = {
    labels: productosLabels,
    datasets: [
      {
        label: "Cantidad vendida",
        data: productosData,
        backgroundColor: [
          "rgb(59, 130, 246)",
          "rgb(34, 197, 94)",
          "rgb(249, 115, 22)",
          "rgb(239, 68, 68)",
          "rgb(168, 85, 247)",
          "rgb(14, 165, 233)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Datos para gráfico de líneas (ventas por día)
  const diasLabels = Object.keys(ventasPorDia).sort();
  const diasData = diasLabels.map((d) => ventasPorDia[d]);

  const dataDias = {
    labels: diasLabels,
    datasets: [
      {
        label: "Ventas diarias (COP)",
        data: diasData,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📊 Reportes de Ventas</h2>

      {loading ? (
        <div className="py-16 flex justify-center">
          <LoadingSpinner size="lg" message="Cargando análisis de ventas..." />
        </div>
      ) : compras.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed">
          <p className="text-gray-500 text-lg">
            📈 No hay datos de ventas para mostrar
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Registra compras para ver análisis
          </p>
        </div>
      ) : (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded shadow border-l-4 border-blue-600">
              <div className="text-sm text-gray-600 font-semibold">
                Total Compras
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {estadisticas.cantidadCompras}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Número de transacciones
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded shadow border-l-4 border-green-600">
              <div className="text-sm text-gray-600 font-semibold">
                Monto Total
              </div>
              <div className="text-2xl font-bold text-green-600 break-words">
                {formatCOP(estadisticas.montoTotal)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Dinero total vendido
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded shadow border-l-4 border-orange-600">
              <div className="text-sm text-gray-600 font-semibold">
                Promedio/Compra
              </div>
              <div className="text-2xl font-bold text-orange-600 break-words">
                {formatCOP(estadisticas.montoPromedio)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Monto promedio por venta
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded shadow border-l-4 border-purple-600">
              <div className="text-sm text-gray-600 font-semibold">
                Productos
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {Object.keys(ventasPorProducto).length}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Diferentes productos vendidos
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de productos */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">
                📦 Ventas por Producto
              </h3>
              {productosLabels.length > 0 ? (
                <Bar
                  data={dataProductos}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                      title: {
                        display: true,
                        text: "Cantidad de unidades vendidas",
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Sin datos de ventas aún
                </div>
              )}
            </div>

            {/* Gráfico de días */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">📈 Ventas Diarias</h3>
              {diasLabels.length > 0 ? (
                <Line
                  data={dataDias}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                      title: {
                        display: true,
                        text: "Dinero vendido por día",
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Sin datos de ventas aún
                </div>
              )}
            </div>
          </div>

          {/* Detalle de productos vendidos */}
          {Object.keys(ventasPorProducto).length > 0 && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">
                🏆 Ranking de Productos
              </h3>
              <div className="space-y-2">
                {productosLabels.map((producto, idx) => {
                  const cantidad = ventasPorProducto[producto];
                  const maxCantidad = Math.max(...productosData);
                  const porcentaje = (cantidad / maxCantidad) * 100;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="text-sm font-semibold w-8 text-center text-gray-600">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-semibold">
                            {producto}
                          </span>
                          <span className="text-sm text-gray-600">
                            {cantidad} unid.
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${porcentaje}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
