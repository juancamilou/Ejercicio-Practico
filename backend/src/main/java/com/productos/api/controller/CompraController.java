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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.productos.api.model.Compra;
import com.productos.api.service.CompraService;

@RestController
@RequestMapping("/compras")
@CrossOrigin(origins = "*")
public class CompraController {
    @Autowired
    private CompraService compraService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> registrarCompra(@RequestBody Compra compra) {
        try {
            Compra nuevaCompra = compraService.registrarCompra(compra);
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Compra registrada exitosamente");
            response.put("id", nuevaCompra.getId());
            response.put("datos", nuevaCompra);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al registrar compra: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> obtenerCompras() {
        try {
            List<Compra> compras = compraService.obtenerTodasCompras();
            Map<String, Object> response = new HashMap<>();
            response.put("datos", compras);
            response.put("total", compras.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al obtener compras: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerCompraPorId(@PathVariable Long id) {
        try {
            var compra = compraService.obtenerCompraById(id);
            if (compra.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("datos", compra.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Compra no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al obtener compra: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<Map<String, Object>> obtenerComprasPorProducto(@PathVariable Long productoId) {
        try {
            List<Compra> compras = compraService.obtenerComprasPorProducto(productoId);
            Map<String, Object> response = new HashMap<>();
            response.put("datos", compras);
            response.put("total", compras.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al obtener compras: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> eliminarCompra(@PathVariable Long id) {
        try {
            compraService.eliminarCompra(id);
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Compra eliminada exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al eliminar compra: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
