package com.productos.api.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.productos.api.dto.ProductoDTO;
import com.productos.api.service.ProductoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    /**
     * GET /api/productos
     * Obtiene todos los productos
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> obtenerTodos() {
        List<ProductoDTO> productos = productoService.obtenerTodos();
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Productos obtenidos exitosamente");
        response.put("total", productos.size());
        response.put("datos", productos);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/productos/{id}
     * Obtiene un producto específico por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerPorId(@PathVariable Long id) {
        ProductoDTO producto = productoService.obtenerPorId(id);
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Producto obtenido exitosamente");
        response.put("dato", producto);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/productos/activos/lista
     * Obtiene todos los productos activos
     */
    @GetMapping("/activos/lista")
    public ResponseEntity<Map<String, Object>> obtenerActivos() {
        List<ProductoDTO> productos = productoService.obtenerActivos();
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Productos activos obtenidos exitosamente");
        response.put("total", productos.size());
        response.put("datos", productos);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/productos/categoria/{categoria}
     * Obtiene productos por categoría
     */
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<Map<String, Object>> obtenerPorCategoria(@PathVariable String categoria) {
        List<ProductoDTO> productos = productoService.obtenerPorCategoria(categoria);
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Productos de la categoría obtenidos exitosamente");
        response.put("categoria", categoria);
        response.put("total", productos.size());
        response.put("datos", productos);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/productos/categorias
     * Obtiene la lista de categorías únicas
     */
    @GetMapping("/categorias")
    public ResponseEntity<Map<String, Object>> obtenerCategorias() {
        List<String> categorias = productoService.obtenerCategorias();
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Categorías obtenidas exitosamente");
        response.put("total", categorias.size());
        response.put("datos", categorias);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/productos/buscar?q=termino
     * Busca productos por nombre o descripción
     */
    @GetMapping("/buscar")
    public ResponseEntity<Map<String, Object>> buscar(@RequestParam String q) {
        List<ProductoDTO> productos = productoService.buscarPorTexto(q);
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Búsqueda realizada exitosamente");
        response.put("busqueda", q);
        response.put("total", productos.size());
        response.put("datos", productos);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/productos/stock-bajo?cantidad=10
     * Obtiene productos con stock bajo
     */
    @GetMapping("/stock-bajo")
    public ResponseEntity<Map<String, Object>> obtenerStockBajo(@RequestParam(defaultValue = "10") Integer cantidad) {
        List<ProductoDTO> productos = productoService.obtenerStockBajo(cantidad);
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Productos con stock bajo obtenidos exitosamente");
        response.put("limite", cantidad);
        response.put("total", productos.size());
        response.put("datos", productos);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/productos
     * Crea un nuevo producto
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> crear(@Valid @RequestBody ProductoDTO productoDTO) {
        ProductoDTO productoCreado = productoService.crear(productoDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Producto creado exitosamente");
        response.put("dato", productoCreado);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * PUT /api/productos/{id}
     * Actualiza completamente un producto
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProductoDTO productoDTO) {
        ProductoDTO productoActualizado = productoService.actualizar(id, productoDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Producto actualizado exitosamente");
        response.put("dato", productoActualizado);
        return ResponseEntity.ok(response);
    }

    /**
     * PATCH /api/productos/{id}
     * Actualiza parcialmente un producto
     */
    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizarParcial(
            @PathVariable Long id,
            @RequestBody ProductoDTO productoDTO) {
        ProductoDTO productoActualizado = productoService.actualizarParcial(id, productoDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Producto actualizado parcialmente");
        response.put("dato", productoActualizado);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/productos/{id}
     * Elimina un producto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Producto eliminado exitosamente");
        response.put("id", id);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/productos/{id}/desactivar
     * Desactiva un producto sin eliminarlo
     */
    @DeleteMapping("/{id}/desactivar")
    public ResponseEntity<Map<String, Object>> desactivar(@PathVariable Long id) {
        ProductoDTO productoDesactivado = productoService.desactivar(id);
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Producto desactivado exitosamente");
        response.put("dato", productoDesactivado);
        return ResponseEntity.ok(response);
    }

}
