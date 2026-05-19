import { useEffect, useState } from "react";
import { actualizarProducto, obtenerProductos, registrarCompra } from "../api";
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

interface ItemCarrito {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

export default function PurchaseForm({
  onClose,
  onRegistered,
}: {
  onClose: () => void;
  onRegistered: () => void;
}) {
  const [productos, setProductos] = useState<any[]>([]);
  const [productoId, setProductoId] = useState<number | "">("");
  const [cantidad, setCantidad] = useState<number>(1);
  const [descuentoGlobal, setDescuentoGlobal] = useState<number>(0);
  const [nota, setNota] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState<string>("");
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const { addToast } = useToast();

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

  const productoSeleccionado = productoId
    ? productos.find((p) => p.id === Number(productoId))
    : null;
  const stockDisponible = productoSeleccionado?.stock || 0;
  const puedeAgregarAlCarrito =
    stockDisponible >= cantidad && cantidad > 0 && productoId;

  // Cálculos del carrito
  const subtotalCarrito = carrito.reduce((sum, item) => sum + item.subtotal, 0);
  const totalCarrito = Math.max(0, subtotalCarrito - descuentoGlobal);

  const productosFiltrados = productos.filter(
    (p) =>
      p.activo &&
      `${p.nombre} ${p.descripcion} ${p.categoria}`
        .toLowerCase()
        .includes(busqueda.toLowerCase()),
  );

  const agregarAlCarrito = () => {
    const prod = productos.find((p) => p.id === Number(productoId));
    if (!prod) {
      addToast("Producto no encontrado", "error");
      return;
    }

    if (!prod.activo) {
      addToast("Este producto está inactivo", "error");
      return;
    }

    if (cantidad <= 0) {
      addToast("La cantidad debe ser mayor a 0", "error");
      return;
    }

    if (cantidad > stockDisponible) {
      addToast(`Stock insuficiente. Disponible: ${stockDisponible}`, "error");
      return;
    }

    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find((item) => item.productoId === prod.id);
    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      if (nuevaCantidad > stockDisponible) {
        addToast(`Stock insuficiente. Disponible: ${stockDisponible}`, "error");
        return;
      }
      setCarrito(
        carrito.map((item) =>
          item.productoId === prod.id
            ? {
                ...item,
                cantidad: nuevaCantidad,
                subtotal: prod.precio * nuevaCantidad,
              }
            : item,
        ),
      );
      addToast(`${prod.nombre} actualizado en el carrito ✓`, "success");
    } else {
      setCarrito([
        ...carrito,
        {
          productoId: prod.id,
          nombre: prod.nombre,
          precio: prod.precio,
          cantidad,
          subtotal: prod.precio * cantidad,
        },
      ]);
      addToast(`${prod.nombre} agregado al carrito ✓`, "success");
    }

    setProductoId("");
    setBusqueda("");
    setCantidad(1);
  };

  const eliminarDelCarrito = (productoId: number) => {
    const prod = carrito.find((item) => item.productoId === productoId);
    if (prod) {
      addToast(`${prod.nombre} eliminado del carrito`, "info");
    }
    setCarrito(carrito.filter((item) => item.productoId !== productoId));
  };

  const actualizarCantidadCarrito = (
    productoId: number,
    nuevaCantidad: number,
  ) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }
    const prod = productos.find((p) => p.id === productoId);
    if (prod && nuevaCantidad > prod.stock) {
      addToast(
        `Stock insuficiente para ${prod.nombre}. Disponible: ${prod.stock}`,
        "error",
      );
      return;
    }
    setCarrito(
      carrito.map((item) =>
        item.productoId === productoId
          ? {
              ...item,
              cantidad: nuevaCantidad,
              subtotal: item.precio * nuevaCantidad,
            }
          : item,
      ),
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (carrito.length === 0) {
      addToast("Agrega al menos un producto al carrito", "error");
      return;
    }

    setLoading(true);
    try {
      // Actualizar stock de todos los productos
      for (const item of carrito) {
        const prod = productos.find((p) => p.id === item.productoId);
        if (prod) {
          const nuevaCantidad = (prod.stock || 0) - item.cantidad;
          await actualizarProducto(prod.id, { ...prod, stock: nuevaCantidad });
        }
      }
      // Guardar cada item como registro de compra en la API
      for (const item of carrito) {
        const descuentoItem = subtotalCarrito
          ? parseFloat(
              (descuentoGlobal * (item.subtotal / subtotalCarrito)).toFixed(2),
            )
          : 0;
        const totalItem = parseFloat(
          (item.subtotal - descuentoItem).toFixed(2),
        );
        await registrarCompra({
          productoId: item.productoId,
          nombreProducto: item.nombre,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          subtotal: item.subtotal,
          descuento: descuentoItem,
          total: totalItem,
          nota,
          fechaCompra: new Date().toISOString(),
        });
      }

      // Guardar compra localmente para compatibilidad con el frontend actual
      const compras = JSON.parse(localStorage.getItem("compras") || "[]");
      const nuevaCompra = {
        id: Date.now(),
        items: carrito,
        descuentoGlobal,
        subtotal: subtotalCarrito,
        total: totalCarrito,
        nota,
        fecha: new Date().toISOString(),
      };
      compras.push(nuevaCompra);
      localStorage.setItem("compras", JSON.stringify(compras));

      addToast(
        `¡Compra registrada! ${carrito.length} producto(s) 🎉`,
        "success",
      );
      setTimeout(() => {
        setCarrito([]);
        setDescuentoGlobal(0);
        setNota("");
        onRegistered();
        onClose();
      }, 1000);
    } catch (err) {
      console.warn(
        "Advertencia: No se pudo actualizar backend, compra se guarda localmente",
        err,
      );
      const compras = JSON.parse(localStorage.getItem("compras") || "[]");
      const nuevaCompra = {
        id: Date.now(),
        items: carrito,
        descuentoGlobal,
        subtotal: subtotalCarrito,
        total: totalCarrito,
        nota,
        fecha: new Date().toISOString(),
      };
      compras.push(nuevaCompra);
      localStorage.setItem("compras", JSON.stringify(compras));

      addToast(
        `¡Compra registrada! ${carrito.length} producto(s) 🎉`,
        "success",
      );
      setTimeout(() => {
        setCarrito([]);
        setDescuentoGlobal(0);
        setNota("");
        onRegistered();
        onClose();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-2xl my-8"
      >
        <h3 className="text-lg font-semibold mb-4">
          Registrar Compra (Múltiples Productos)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Columna izquierda: Agregar productos */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Agregar Producto</h4>

            <div className="mb-3">
              <label className="block text-sm font-semibold">
                Producto *{" "}
                {productoSeleccionado && (
                  <span className="text-green-600">✓</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar o seleccionar producto..."
                  className="w-full border px-3 py-2 rounded text-sm"
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setMostrarOpciones(true);
                  }}
                  onFocus={() => setMostrarOpciones(true)}
                />
                {busqueda && (
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setBusqueda("");
                      setProductoId("");
                    }}
                  >
                    ✕
                  </button>
                )}
                {mostrarOpciones && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded shadow-lg max-h-40 overflow-y-auto z-10">
                    {(busqueda ? productosFiltrados : productos).length > 0 ? (
                      (busqueda ? productosFiltrados : productos).map((p) => (
                        <div
                          key={p.id}
                          className={`px-3 py-2 hover:bg-indigo-50 cursor-pointer border-b text-xs transition ${
                            productoId === p.id
                              ? "bg-indigo-100 border-l-4 border-l-indigo-600"
                              : ""
                          }`}
                          onClick={() => {
                            setProductoId(p.id);
                            setBusqueda(p.nombre);
                            setMostrarOpciones(false);
                          }}
                        >
                          <div className="font-semibold flex justify-between items-center">
                            <span>{p.nombre}</span>
                            {productoId === p.id && (
                              <span className="text-green-600">✓</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 flex justify-between mt-1">
                            <span>{formatCOP(p.precio)}</span>
                            <span
                              className={
                                p.stock > 0 ? "text-green-600" : "text-red-600"
                              }
                            >
                              Stock: {p.stock}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-xs text-gray-500 text-center">
                        {busqueda ? "Sin resultados" : "No hay productos"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-semibold">Cantidad *</label>
              <input
                type="number"
                min={1}
                max={stockDisponible}
                className="w-full border px-2 py-2 rounded text-sm"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                disabled={!productoSeleccionado}
              />
              {productoSeleccionado && (
                <div className="text-xs text-gray-500 mt-1">
                  Disponible: {stockDisponible}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={agregarAlCarrito}
              disabled={!puedeAgregarAlCarrito}
              className={`w-full py-2 rounded text-white text-sm font-semibold ${
                puedeAgregarAlCarrito
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              + Agregar al Carrito
            </button>
          </div>

          {/* Columna derecha: Carrito */}
          <div>
            <h4 className="font-semibold text-sm mb-3">
              Carrito ({carrito.length} producto
              {carrito.length !== 1 ? "s" : ""})
            </h4>
            <div className="border rounded bg-gray-50 max-h-48 overflow-y-auto mb-3">
              {carrito.length > 0 ? (
                carrito.map((item) => (
                  <div key={item.productoId} className="p-2 border-b text-xs">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold">{item.nombre}</p>
                        <p className="text-gray-600">
                          {item.cantidad} × {formatCOP(item.precio)}
                        </p>
                      </div>
                      <p className="font-semibold text-right mr-2">
                        {formatCOP(item.subtotal)}
                      </p>
                      <button
                        type="button"
                        onClick={() => eliminarDelCarrito(item.productoId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() =>
                          actualizarCantidadCarrito(
                            item.productoId,
                            item.cantidad - 1,
                          )
                        }
                        className="px-1 py-0 bg-gray-300 rounded text-xs hover:bg-gray-400"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.cantidad}
                        onChange={(e) =>
                          actualizarCantidadCarrito(
                            item.productoId,
                            Number(e.target.value),
                          )
                        }
                        className="w-10 border px-1 py-0 rounded text-xs text-center"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          actualizarCantidadCarrito(
                            item.productoId,
                            item.cantidad + 1,
                          )
                        }
                        className="px-1 py-0 bg-gray-300 rounded text-xs hover:bg-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-500">
                  Carrito vacío
                </div>
              )}
            </div>

            <div className="mb-3 p-3 bg-gray-100 rounded text-sm">
              <div className="flex justify-between mb-1">
                <span>Subtotal:</span>
                <span>{formatCOP(subtotalCarrito)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Descuento:</span>
                <input
                  type="number"
                  min={0}
                  max={subtotalCarrito}
                  className="w-24 border px-2 py-1 rounded text-xs"
                  value={descuentoGlobal}
                  onChange={(e) =>
                    setDescuentoGlobal(Math.max(0, Number(e.target.value)))
                  }
                />
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total:</span>
                <span>{formatCOP(totalCarrito)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold">Nota</label>
          <textarea
            className="w-full border px-2 py-2 rounded text-sm"
            rows={2}
            placeholder="Observaciones (opcional)"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
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
            className={`px-4 py-2 rounded text-white font-semibold text-sm ${
              carrito.length > 0 && !loading
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={carrito.length === 0 || loading}
          >
            {loading ? "Guardando..." : `Registrar Compra (${carrito.length})`}
          </button>
        </div>
      </form>

      {loading && <LoadingOverlay message="Registrando compra..." />}
    </div>
  );
}
