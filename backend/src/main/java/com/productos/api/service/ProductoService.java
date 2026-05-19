package com.productos.api.service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.productos.api.dto.ProductoDTO;
import com.productos.api.exception.ProductoNoEncontradoException;
import com.productos.api.model.Producto;
import com.productos.api.repository.ProductoRepository;

@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Obtiene todos los productos
     */
    public List<ProductoDTO> obtenerTodos() {
        return productoRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un producto por ID
     */
    public ProductoDTO obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNoEncontradoException("Producto con ID " + id + " no encontrado"));
        return convertirADTO(producto);
    }

    /**
     * Obtiene todos los productos activos
     */
    public List<ProductoDTO> obtenerActivos() {
        return productoRepository.findByActivoTrue()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene productos por categoría
     */
    public List<ProductoDTO> obtenerPorCategoria(String categoria) {
        return productoRepository.findByCategoria(categoria)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca productos por texto
     */
    public List<ProductoDTO> buscarPorTexto(String busqueda) {
        return productoRepository.buscarPorTexto(busqueda)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene productos con stock bajo
     */
    public List<ProductoDTO> obtenerStockBajo(Integer cantidad) {
        return productoRepository.findByStockLessThan(cantidad)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene la lista de categorías únicas
     */
    public List<String> obtenerCategorias() {
        return productoRepository.findDistinctCategorias();
    }

    /**
     * Crea un nuevo producto
     */
    public ProductoDTO crear(ProductoDTO productoDTO) {
        Producto producto = new Producto();
        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setStock(productoDTO.getStock());
        producto.setCategoria(productoDTO.getCategoria());
        producto.setActivo(true);

        Producto productoGuardado = productoRepository.save(producto);
        return convertirADTO(productoGuardado);
    }

    /**
     * Actualiza un producto existente
     */
    public ProductoDTO actualizar(Long id, ProductoDTO productoDTO) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNoEncontradoException("Producto con ID " + id + " no encontrado"));

        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setStock(productoDTO.getStock());
        producto.setCategoria(productoDTO.getCategoria());

        if (productoDTO.getActivo() != null) {
            producto.setActivo(productoDTO.getActivo());
        }

        Producto productoActualizado = productoRepository.save(producto);
        return convertirADTO(productoActualizado);
    }

    /**
     * Actualiza parcialmente un producto
     */
    public ProductoDTO actualizarParcial(Long id, ProductoDTO productoDTO) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNoEncontradoException("Producto con ID " + id + " no encontrado"));

        if (productoDTO.getNombre() != null) {
            producto.setNombre(productoDTO.getNombre());
        }
        if (productoDTO.getDescripcion() != null) {
            producto.setDescripcion(productoDTO.getDescripcion());
        }
        if (productoDTO.getPrecio() != null) {
            producto.setPrecio(productoDTO.getPrecio());
        }
        if (productoDTO.getStock() != null) {
            producto.setStock(productoDTO.getStock());
        }
        if (productoDTO.getCategoria() != null) {
            producto.setCategoria(productoDTO.getCategoria());
        }
        if (productoDTO.getActivo() != null) {
            producto.setActivo(productoDTO.getActivo());
        }

        Producto productoActualizado = productoRepository.save(producto);
        return convertirADTO(productoActualizado);
    }

    /**
     * Desactiva un producto sin eliminarlo
     */
    public ProductoDTO desactivar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNoEncontradoException("Producto con ID " + id + " no encontrado"));
        producto.setActivo(false);
        Producto productoActualizado = productoRepository.save(producto);
        return convertirADTO(productoActualizado);
    }

    /**
     * Convierte una entidad Producto a DTO
     */
    private ProductoDTO convertirADTO(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setPrecio(producto.getPrecio());
        dto.setStock(producto.getStock());
        dto.setCategoria(producto.getCategoria());
        dto.setActivo(producto.getActivo());
        dto.setFechaCreacion(producto.getFechaCreacion().format(FORMATTER));
        dto.setFechaActualizacion(producto.getFechaActualizacion().format(FORMATTER));
        return dto;
    }

}
