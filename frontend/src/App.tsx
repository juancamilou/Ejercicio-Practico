import { useState } from "react";
import Charts from "./components/Charts";
import ProductList from "./components/ProductList";
import PurchaseForm from "./components/PurchaseForm";
import PurchasesList from "./components/PurchasesList";
import SalesCharts from "./components/SalesCharts";
import { useToast } from "./components/ToastContainer";

export default function App() {
  const [view, setView] = useState<"prod" | "compras" | "graficos" | "ventas">(
    "prod",
  );
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const { addToast, ToastContainer } = useToast();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🏪 Gestor de Inventario</h1>
            <p className="text-indigo-100 text-sm mt-1">
              Sistema de gestión de productos y ventas
            </p>
          </div>
          <nav className="flex gap-2">
            <button
              className={`px-4 py-2 rounded transition ${view === "prod" ? "bg-white text-indigo-600 font-semibold" : "bg-indigo-500 hover:bg-indigo-400"}`}
              onClick={() => setView("prod")}
            >
              📦 Productos
            </button>
            <button
              className={`px-4 py-2 rounded transition ${view === "compras" ? "bg-white text-indigo-600 font-semibold" : "bg-indigo-500 hover:bg-indigo-400"}`}
              onClick={() => setView("compras")}
            >
              🛒 Compras
            </button>
            <button
              className={`px-4 py-2 rounded transition ${view === "ventas" ? "bg-white text-indigo-600 font-semibold" : "bg-indigo-500 hover:bg-indigo-400"}`}
              onClick={() => setView("ventas")}
            >
              📈 Ventas
            </button>
            <button
              className={`px-4 py-2 rounded transition ${view === "graficos" ? "bg-white text-indigo-600 font-semibold" : "bg-indigo-500 hover:bg-indigo-400"}`}
              onClick={() => setView("graficos")}
            >
              📊 Stock
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {view === "prod" && (
          <div>
            <ProductList />
          </div>
        )}

        {view === "compras" && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
                onClick={() => setShowPurchaseForm(true)}
              >
                🛒 Registrar Compra
              </button>
            </div>
            <PurchasesList />
          </div>
        )}
        {view === "ventas" && <SalesCharts />}
        {view === "graficos" && <Charts />}
      </main>

      {showPurchaseForm && (
        <PurchaseForm
          onClose={() => setShowPurchaseForm(false)}
          onRegistered={() => {
            setShowPurchaseForm(false); /* optionally refresh list */
          }}
        />
      )}

      <ToastContainer />
    </div>
  );
}
