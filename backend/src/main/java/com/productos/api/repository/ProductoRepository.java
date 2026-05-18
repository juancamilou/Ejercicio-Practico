package com.productos.api.repository;

import com.productos.api.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    List<Producto> findByCategoria(String categoria);

    List<Producto> findByActivoTrue();

    List<Producto> findByStockLessThan(Integer stock);

    @Query("SELECT p FROM Producto p WHERE p.nombre LIKE %:busqueda% OR p.descripcion LIKE %:busqueda%")
    List<Producto> buscarPorTexto(@Param("busqueda") String busqueda);

    Optional<Producto> findByNombreIgnoreCase(String nombre);

    @Query("SELECT DISTINCT p.categoria FROM Producto p")
    List<String> findDistinctCategorias();

}
