package com.productos.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.productos.api.exception.ProductoNoEncontradoException;
import com.productos.api.model.Compra;
import com.productos.api.model.Producto;
import com.productos.api.repository.CompraRepository;
import com.productos.api.repository.ProductoRepository;

@Service
public class CompraService {
    @Autowired
    private CompraRepository compraRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public Compra registrarCompra(Compra compra) {
        if (compra.getProductoId() == null) {
            throw new IllegalArgumentException("productoId es obligatorio");
        }

        Producto producto = productoRepository.findById(compra.getProductoId())
                .orElseThrow(() -> new ProductoNoEncontradoException("Producto con ID " + compra.getProductoId() + " no encontrado"));

        if (compra.getCantidad() == null || compra.getCantidad() <= 0) {
            throw new IllegalArgumentException("cantidad debe ser mayor a 0");
        }

        compra.setNombreProducto(producto.getNombre());
        compra.setPrecioUnitario(producto.getPrecio());

        double subtotal = compra.getCantidad() * producto.getPrecio();
        compra.setSubtotal(subtotal);

        if (compra.getTotal() == null) {
            compra.setTotal(subtotal);
        } else {
            compra.setTotal(subtotal);
        }

        if (compra.getDescuento() == null) {
            compra.setDescuento(0.0);
        } else {
            compra.setDescuento(0.0);
        }

        return compraRepository.save(compra);
    }

    public List<Compra> obtenerTodasCompras() {
        return compraRepository.findAll();
    }

    public Optional<Compra> obtenerCompraById(Long id) {
        return compraRepository.findById(id);
    }

    public List<Compra> obtenerComprasPorProducto(Long productoId) {
        return compraRepository.findByProductoId(productoId);
    }

    public void eliminarCompra(Long id) {
        compraRepository.deleteById(id);
    }
}
