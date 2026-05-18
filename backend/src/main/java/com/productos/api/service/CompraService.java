package com.productos.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.productos.api.model.Compra;
import com.productos.api.repository.CompraRepository;

@Service
public class CompraService {
    @Autowired
    private CompraRepository compraRepository;

    public Compra registrarCompra(Compra compra) {
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
