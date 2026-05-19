import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const obtenerProductos = () => api.get("/productos");
export const obtenerProducto = (id: number) => api.get(`/productos/${id}`);
export const crearProducto = (data: any) => api.post("/productos", data);
export const actualizarProducto = (id: number, data: any) =>
  api.put(`/productos/${id}`, data);
export const obtenerCategorias = () => api.get("/productos/categorias");
export const buscarProductos = (texto: string) =>
  api.get(`/productos/buscar?texto=${encodeURIComponent(texto)}`);
export const obtenerProductosPorCategoria = (categoria: string) =>
  api.get(`/productos/categoria/${encodeURIComponent(categoria)}`);

// Compras
export const registrarCompra = (data: any) => api.post("/compras", data);
export const obtenerCompras = () => api.get("/compras");
export const obtenerCompraPorId = (id: number) => api.get(`/compras/${id}`);
export const obtenerComprasPorProducto = (productoId: number) =>
  api.get(`/compras/producto/${productoId}`);
export const eliminarCompra = (id: number) => api.delete(`/compras/${id}`);

export default api;
