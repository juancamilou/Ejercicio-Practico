import { useEffect, useState } from "react";
import { actualizarProducto, crearProducto, obtenerCategorias } from "../api";
import LoadingOverlay from "./LoadingOverlay";
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

export default function ProductForm({
  onClose,
  item,
  onProductoGuardado,
}: any) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria: "",
    activo: true,
  });
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaNueva, setCategoriaNueva] = useState("");
  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await obtenerCategorias();
        setCategorias(res.data.datos || []);
      } catch (err) {
        console.warn(err);
      }
    })();
    if (item) setForm(item);
  }, [item]);

  // Auto-desactivar si stock es 0
  useEffect(() => {
    if (form.stock === 0 && form.activo) {
      setForm((prevForm) => ({ ...prevForm, activo: false }));
    }
  }, [form.stock]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!form.nombre.trim()) {
        addToast("El nombre es requerido", "error");
        setLoading(false);
        return;
      }

      if (form.precio <= 0) {
        addToast("El precio debe ser mayor a 0", "error");
        setLoading(false);
        return;
      }

      if (form.stock < 0) {
        addToast("El stock no puede ser negativo", "error");
        setLoading(false);
        return;
      }

      if (!form.categoria.trim()) {
        addToast("Selecciona o crea una categoría", "error");
        setLoading(false);
        return;
      }

      if (item) {
        await actualizarProducto(item.id, form);
        addToast("Producto actualizado correctamente ✨", "success");
      } else {
        await crearProducto(form);
        addToast("Producto creado correctamente ✨", "success");
        setForm({
          nombre: "",
          descripcion: "",
          precio: 0,
          stock: 0,
          categoria: "",
          activo: true,
        });
      }

      setTimeout(() => {
        onProductoGuardado?.();
        onClose();
      }, 1000);
    } catch (err) {
      addToast("Error al guardar el producto", "error");
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const agregarCategoria = () => {
    if (categoriaNueva.trim()) {
      const nuevaCategoria = categoriaNueva.trim();
      if (!categorias.includes(nuevaCategoria)) {
        setCategorias([...categorias, nuevaCategoria]);
        setForm({ ...form, categoria: nuevaCategoria });
        setCategoriaNueva("");
        setMostrarNuevaCategoria(false);
        addToast("Categoría creada exitosamente", "success");
      } else {
        addToast("Esta categoría ya existe", "warning");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md my-8"
      >
        <h3 className="text-xl font-semibold mb-4">
          {item ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
        </h3>

        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Nombre *</label>
          <input
            className="w-full border px-3 py-2 rounded text-sm"
            placeholder="Ej: Laptop Dell"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">
            Descripción
          </label>
          <textarea
            className="w-full border px-3 py-2 rounded text-sm"
            placeholder="Ej: Laptop de 15 pulgadas con procesador Intel..."
            rows={2}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Precio (COP) *
            </label>
            <input
              type="number"
              step="1"
              min="0"
              className="w-full border px-3 py-2 rounded text-sm"
              placeholder="0"
              value={form.precio}
              onChange={(e) =>
                setForm({ ...form, precio: parseFloat(e.target.value) || 0 })
              }
              required
            />
            {form.precio > 0 && (
              <div className="text-xs text-gray-600 mt-1">
                {formatCOP(form.precio)}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Stock *</label>
            <input
              type="number"
              min="0"
              className="w-full border px-3 py-2 rounded text-sm"
              placeholder="0"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: parseInt(e.target.value) || 0 })
              }
              required
            />
            {form.stock === 0 && (
              <div className="text-xs text-red-600 mt-1">
                ⚠️ Stock 0 = Producto desactivado
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-semibold">
              {form.activo ? "✓ Producto Activo" : "✗ Producto Inactivo"}
            </span>
          </label>
          <p className="text-xs text-gray-600 mt-2">
            {form.stock === 0
              ? "El producto se desactivará automáticamente porque el stock es 0"
              : "Activa o desactiva este producto"}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Categoría *
          </label>
          {!mostrarNuevaCategoria ? (
            <div className="flex gap-2">
              <select
                className="flex-1 border px-3 py-2 rounded text-sm"
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
              >
                <option value="">-- Selecciona categoría --</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                onClick={() => setMostrarNuevaCategoria(true)}
                title="Crear nueva categoría"
              >
                ➕
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: Electrónica"
                className="flex-1 border px-3 py-2 rounded text-sm"
                value={categoriaNueva}
                onChange={(e) => setCategoriaNueva(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && agregarCategoria()}
                autoFocus
              />
              <button
                type="button"
                className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                onClick={agregarCategoria}
              >
                ✓
              </button>
              <button
                type="button"
                className="px-3 py-2 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                onClick={() => {
                  setMostrarNuevaCategoria(false);
                  setCategoriaNueva("");
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-semibold disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>

      {loading && <LoadingOverlay message="Guardando producto..." />}
    </div>
  );
}
