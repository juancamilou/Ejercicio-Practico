package com.productos.api.controller;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.notNullValue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import io.restassured.RestAssured;

/**
 * CLASE DE PRUEBAS: ProductoControllerTest
 * 
 * Esta clase contiene todas las pruebas automatizadas para el controlador de Productos.
 * Usa REST Assured para hacer peticiones HTTP reales al servidor.
 * 
 * @SpringBootTest: levanta toda la aplicación Spring Boot para las pruebas
 * webEnvironment.RANDOM_PORT: usa un puerto aleatorio para no conflictuar con otros servicios
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DisplayName("Pruebas del Controlador de Productos")
class ProductoControllerTest {

    /**
     * @LocalServerPort: inyecta automáticamente el puerto donde corre la aplicación
     * Necesario para construir las URLs correctas en las pruebas
     */
    @LocalServerPort
    private int port;

    /**
     * @BeforeEach: se ejecuta ANTES de cada prueba
     * Aquí configuramos REST Assured con el puerto y la ruta base
     */
    @BeforeEach
    void setUp() {
        RestAssured.port = port;  // Le decimos a REST Assured qué puerto usar
        RestAssured.basePath = "/api/productos";  // Ruta base para todos los endpoints
    }

    /**
     * PRUEBA 1: Obtener lista de todos los productos
     * 
     * Estructura REST Assured:
     * - given(): prepara la petición (headers, body, etc.)
     * - when(): ejecuta la petición HTTP
     * - then(): valida la respuesta (status, datos, etc.)
     */
    @Test
    @DisplayName("Debe obtener la lista de todos los productos")
    void testObtenerProductos() {
        given()
                // No necesitamos headers ni body para GET
                .when()
                .get()  // GET a /api/productos
                .then()
                .statusCode(200)  // Esperamos código 200 (OK)
                .body("datos", notNullValue())  // datos NO debe ser null
                .body("total", greaterThanOrEqualTo(0));  // total debe ser >= 0
    }

    /**
     * PRUEBA 2: Crear un nuevo producto
     * 
     * Enviamos JSON con los datos del producto
     * Esperamos código 201 (CREATED) cuando se crea exitosamente
     */
    @Test
    @DisplayName("Debe crear un nuevo producto")
    void testCrearProducto() {
        // JSON que enviamos al servidor (en formato String)
        String nuevoProducto = """
                {
                    "nombre": "Producto Test",
                    "descripcion": "Descripción de prueba",
                    "precio": 25000,
                    "stock": 10,
                    "categoria": "Test",
                    "activo": true
                }
                """;

        given()
                .header("Content-Type", "application/json")  // Le decimos que es JSON
                .body(nuevoProducto)  // Enviamos el JSON
                .when()
                .post()  // POST a /api/productos
                .then()
                .statusCode(201)  // 201 = recurso creado
                .body("dato.nombre", equalTo("Producto Test"))  // Validamos el nombre
                .body("dato.precio", notNullValue())  // Validamos el precio
                .body("dato.activo", equalTo(true));  // Validamos que está activo
    }

    /**
     * PRUEBA 3: Obtener un producto por su ID
     * 
     * Pruebamos GET con parámetro en la URL
     * En este caso, /api/productos/1
     */
    @Test
    @DisplayName("Debe obtener un producto por ID")
    void testObtenerProductoPorId() {
        given()
                .when()
                .get("/1")  // GET a /api/productos/1
                .then()
                .statusCode(200)  // OK
                .body("dato.id", notNullValue());  // El producto debe tener ID
    }

    /**
     * PRUEBA 4: Error 404 cuando el producto no existe
     * 
     * Probamos que el servidor devuelve error cuando buscamos un ID que no existe
     * Esto valida que el manejo de errores funciona correctamente
     */
    @Test
    @DisplayName("Debe devolver 404 para ID no existente")
    void testObtenerProductoNoExistente() {
        given()
                .when()
                .get("/99999")  // ID que seguramente no existe
                .then()
                .statusCode(404);  // 404 = NOT FOUND (recurso no encontrado)
    }

    /**
     * PRUEBA 5: Obtener solo productos activos
     * 
     * Probamos el endpoint especial que retorna solo productos con activo=true
     */
    @Test
    @DisplayName("Debe obtener productos activos")
    void testObtenerProductosActivos() {
        given()
                .when()
                .get("/activos/lista")  // GET a /api/productos/activos/lista
                .then()
                .statusCode(200)  // OK
                .body("datos", notNullValue());  // Debe devolver un array
    }

    /**
     * PRUEBA 6: Obtener todas las categorías
     * 
     * Probamos que podemos obtener la lista de categorías disponibles
     */
    @Test
    @DisplayName("Debe obtener todas las categorías")
    void testObtenerCategorias() {
        given()
                .when()
                .get("/categorias")  // GET a /api/productos/categorias
                .then()
                .statusCode(200)  // OK
                .body("datos", notNullValue());  // Debe devolver un array de categorías
    }

    /**
     * PRUEBA 7: Buscar productos por término
     * 
     * Probamos la búsqueda usando query parameters
     * queryParam: agrega parámetros a la URL (?q=Shampoo)
     */
    @Test
    @DisplayName("Debe buscar productos por término")
    void testBuscarProductos() {
        given()
                .queryParam("q", "Shampoo")  // Parámetro de búsqueda: q=Shampoo
                .when()
                .get("/buscar")  // GET a /api/productos/buscar?q=Shampoo
                .then()
                .statusCode(200)  // OK
                .body("datos", notNullValue());  // Debe devolver resultados
    }

}
