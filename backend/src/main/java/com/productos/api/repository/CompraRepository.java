package com.productos.api.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.productos.api.model.Compra;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {
    List<Compra> findByProductoId(Long productoId);
    List<Compra> findByFechaCompraAfter(LocalDateTime fecha);
}
