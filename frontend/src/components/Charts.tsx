import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { obtenerProductos } from "../api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function Charts() {
  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await obtenerProductos();
        setProductos(res.data.datos || []);
      } catch (err) {
        console.warn(err);
        setProductos([]);
      }
    })();
  }, []);

  const labels = productos.map((p) => p.nombre);
  const stockData = productos.map((p) => p.stock || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock por producto",
        data: stockData,
        backgroundColor: "rgba(34,197,94,0.8)",
      },
    ],
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gráficos</h2>
      <div className="bg-white p-4 rounded shadow">
        <Bar data={data} />
      </div>
    </div>
  );
}
