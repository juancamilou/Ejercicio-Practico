import { useEffect, useState } from "react";
import {
  actualizarProducto,
  buscarProductos,
  eliminarProducto,
  obtenerCategorias,
  obtenerProductos,
  obtenerProductosPorCategoria,
} from "../api";
import AlertDialog from "./AlertDialog";
import LoadingSpinner from "./LoadingSpinner";
import ProductForm from "./ProductForm";
import { useToast } from "./ToastContainer";

// Función para formatear moneda colombiana
const formatCOP = (valor: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
};

function StockBadge({ stock }: { stock: number }) {
  const level = stock <= 0 ? "out" : stock <= 5 ? "low" : "ok";
  const bg =
    level === "out"
      ? "bg-red-500 text-white"
      : level === "low"
        ? "bg-yellow-400 text-black"
        : "bg-green-500 text-white";
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg}`}>
      {stock <= 0 ? "Sin stock" : `Stock: ${stock}`}
    </span>
  );
}

export default function ProductList() {
  const [productos, setProductos] = useState<any[]>([]);
  const [originalProductos, setOriginalProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const { addToast } = useToast();
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    type: "confirm" | "warning" | "error" | "success" | "info";
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await obtenerProductos();
      const list = res.data.datos || [];
      setOriginalProductos(list);
      setProductos(applyFiltersAndSort(list));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await obtenerCategorias();
      setCategorias(res.data.datos || []);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSearch = async () => {
    if (!searchText || searchText.trim() === "") {
      setProductos(applyFiltersAndSort(originalProductos));
      return;
    }
    setLoading(true);
    try {
      const res = await buscarProductos(searchText.trim());
      const list = res.data.datos || [];
      setOriginalProductos(list);
      setProductos(applyFiltersAndSort(list));
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = (list: any[]) => {
    let filtered = [...list];
    
    // Aplicar filtro de estado
    if (statusFilter === "active") {
      filtered = filtered.filter((p) => p.activo === true);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((p) => p.activo === false);
    }
    
    // Aplicar ordenamiento
    if (!sort) return filtered;
    const copy = [...filtered];
    if (sort === "price-asc") return copy.sort((a, b) => a.precio - b.precio);
    if (sort === "price-desc") return copy.sort((a, b) => b.precio - a.precio);
    if (sort === "stock-desc") return copy.sort((a, b) => b.stock - a.stock);
    if (sort === "active-first") return copy.sort((a, b) => (b.activo ? 1 : -1) - (a.activo ? 1 : -1));
    return copy;
  };

  useEffect(() => {
    const id = setTimeout(() => {
      if (!searchText || searchText.trim() === "") {
        setProductos(applyFiltersAndSort(originalProductos));
        return;
      }
      const q = searchText.toLowerCase();
      const filtered = originalProductos.filter((p) => {
        return (
          (p.nombre || "").toLowerCase().includes(q) ||
          (p.descripcion || "").toLowerCase().includes(q) ||
          (p.categoria || "").toLowerCase().includes(q) ||
          String(p.precio || "")
            .toLowerCase()
            .includes(q)
        );
      });
      setProductos(applyFiltersAndSort(filtered));
    }, 300);
    return () => clearTimeout(id);
  }, [searchText, originalProductos, sort, statusFilter]);

  useEffect(() => {
    fetch();
    fetchCategorias();
  }, []);

  const handleDelete = async (id: number) => {
    setAlertDialog({
      isOpen: true,
      type: "error",
      title: "Eliminar Producto",
      message:
        "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          await eliminarProducto(id);
          addToast("Producto eliminado exitosamente", "success");
          fetch();
        } catch (err) {
          addToast("Error al eliminar el producto", "error");
          console.error(err);
        } finally {
          setAlertDialog({ ...alertDialog, isOpen: false });
        }
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-2">📦 Productos</h2>
        <p className="text-indigo-100">Administra tu catálogo de productos</p>
      </div>

      {/* Controles Principales */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {/* Fila 1: Búsqueda */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre, descripción, categoría..."
            className="flex-1 border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition"
            onClick={handleSearch}
          >
            Buscar
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition"
            onClick={() => {
              setSearchText("");
              fetch();
            }}
          >
            Limpiar
          </button>
        </div>

        {/* Fila 2: Filtros y Orden */}
        <div className="grid md:grid-cols-4 gap-3">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold transition flex items-center justify-center gap-2"
            onClick={() => {
              setEditItem(null);
              setShowForm(true);
            }}
          >
            ➕ Nuevo Producto
          </button>

          <select
            className="border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            onChange={async (e) => {
              const cat = e.target.value;
              if (!cat) {
                fetch();
                return;
              }
              setLoading(true);
              try {
                const res = await obtenerProductosPorCategoria(cat);
                const list = res.data.datos || [];
                setOriginalProductos(list);
                setProductos(applyFiltersAndSort(list));
              } catch (err) {
                console.warn(err);
              } finally {
                setLoading(false);
              }
            }}
          >
            <option value="">🏷️ Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
          >
            <option value="all">📊 Todos los estados</option>
            <option value="active">✅ Solo activos</option>
            <option value="inactive">⏸️ Solo inactivos</option>
          </select>

          <select
            className="border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">↕️ Ordenar por...</option>
            <option value="active-first">✅ Activos primero</option>
            <option value="price-asc">💰 Precio menor</option>
            <option value="price-desc">💰 Precio mayor</option>
            <option value="stock-desc">📦 Stock mayor</option>
          </select>
        </div>

        {/* Información de resultados */}
        {!loading && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <span className="font-semibold text-gray-800">{productos.length}</span> producto{productos.length !== 1 ? 's' : ''} 
            {statusFilter !== "all" && (
              <span> ({statusFilter === "active" ? "activos" : "inactivos"})</span>
            )}
          </div>
        )}
      </div>

      {/* Lista de Productos */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="lg" message="Cargando productos..." />
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-500 text-lg font-semibold">No hay productos para mostrar</p>
          <p className="text-gray-400 mt-2">Intenta cambiar los filtros o agregar un nuevo producto</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((p) => (
            <div
              key={p.id}
              className={`rounded-lg shadow-md hover:shadow-xl transition-all border-l-4 overflow-hidden ${
                p.activo
                  ? "bg-white border-green-500 hover:border-green-600"
                  : "bg-gray-50 border-red-500 opacity-85 hover:opacity-100"
              }`}
            >
              <div className="p-4 space-y-3">
                {/* Encabezado */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{p.nombre}</h3>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          p.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.activo ? "✓ Activo" : "✗ Inactivo"}
                      </span>
                      <span className="text-xs text-white bg-indigo-600 px-2 py-1 rounded-full">
                        {p.categoria}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-gray-600 text-sm line-clamp-2">{p.descripcion}</p>

                {/* Precio y Stock */}
                <div className="flex justify-between items-end pt-2 border-t">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Precio</p>
                    <p className="text-2xl font-bold text-green-600">{formatCOP(p.precio)}</p>
                  </div>
                  <StockBadge stock={p.stock} />
                </div>

                {/* Botones */}
                <div className="flex gap-2 pt-2">
                  <button
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 font-semibold transition flex items-center justify-center gap-1"
                    onClick={() => {
                      setEditItem(p);
                      setShowForm(true);
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className={`flex-1 px-3 py-2 rounded-lg text-sm text-white font-semibold transition ${
                      p.activo
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={() => {
                      setAlertDialog({
                        isOpen: true,
                        type: p.activo ? "warning" : "info",
                        title: p.activo
                          ? "Desactivar Producto"
                          : "Activar Producto",
                        message: p.activo
                          ? `¿Desactivar "${p.nombre}"? No aparecerá en el formulario de compras.`
                          : `¿Activar "${p.nombre}"? Volverá a estar disponible para comprar.`,
                        onConfirm: async () => {
                          try {
                            await actualizarProducto(p.id, {
                              ...p,
                              activo: !p.activo,
                            });
                            addToast(
                              p.activo
                                ? "Producto desactivado"
                                : "Producto activado",
                              "success",
                            );
                            fetch();
                          } catch (err) {
                            addToast(
                              "Error al actualizar el producto",
                              "error",
                            );
                            console.warn(err);
                          } finally {
                            setAlertDialog({ ...alertDialog, isOpen: false });
                          }
                        },
                      });
                    }}
                  >
                    {p.activo ? "🔴 Desactivar" : "🟢 Activar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProductForm
          onClose={() => {
            setShowForm(false);
            fetch();
          }}
          item={editItem}
          onProductoGuardado={() => fetch()}
        />
      )}

      <AlertDialog
        isOpen={alertDialog.isOpen}
        type={alertDialog.type}
        title={alertDialog.title}
        message={alertDialog.message}
        onConfirm={alertDialog.onConfirm}
        onCancel={() => setAlertDialog({ ...alertDialog, isOpen: false })}
        confirmText={alertDialog.type === "error" ? "Eliminar" : "Confirmar"}
        cancelText="Cancelar"
      />
    </div>
  );
}
