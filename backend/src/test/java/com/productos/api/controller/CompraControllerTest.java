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
 * CLASE DE PRUEBAS: CompraControllerTest
 * 
 * Esta clase contiene todas las pruebas automatizadas para el controlador de Compras.
 * Usa REST Assured para hacer peticiones HTTP reales al servidor.
 * 
 * @SpringBootTest: levanta toda la aplicación Spring Boot para las pruebas
 * webEnvironment.RANDOM_PORT: usa un puerto aleatorio para no conflictuar con otros servicios
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DisplayName("Pruebas del Controlador de Compras")
class CompraControllerTest {

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
        RestAssured.basePath = "/api/compras";  // Ruta base para todos los endpoints
    }

    /**
     * PRUEBA 1: Obtener lista de todas las compras
     * 
     * Estructura REST Assured:
     * - given(): prepara la petición (headers, body, etc.)
     * - when(): ejecuta la petición HTTP
     * - then(): valida la respuesta (status, datos, etc.)
     */
    @Test
    @DisplayName("Debe obtener la lista de todas las compras")
    void testObtenerCompras() {
        given()
                // No necesitamos headers ni body para GET
                .when()
                .get()  // GET a /api/compras
                .then()
                .statusCode(200)  // Esperamos código 200 (OK)
                .body("datos", notNullValue())  // datos NO debe ser null
                .body("total", greaterThanOrEqualTo(0));  // total debe ser >= 0
    }

    /**
     * PRUEBA 2: Registrar una nueva compra
     * 
     * Enviamos JSON con los datos de la compra (productoId, cantidad, total)
     * Esperamos código 201 (CREATED) cuando se registra exitosamente
     */
    @Test
    @DisplayName("Debe registrar una nueva compra")
    void testRegistrarCompra() {
        // JSON que enviamos al servidor (en formato String)
        // productoId: ID del producto que se está comprando
        // cantidad: cuántas unidades se compran
        // total: precio total de la compra
        String nuevaCompra = """
                {
                    "productoId": 1,
                    "cantidad": 2,
                    "total": 100000
                }
                """;

        given()
                .header("Content-Type", "application/json")  // Le decimos que es JSON
                .body(nuevaCompra)  // Enviamos el JSON
                .when()
                .post()  // POST a /api/compras
                .then()
                .statusCode(201)  // 201 = recurso creado exitosamente
                .body("datos.cantidad", equalTo(2))  // Validamos la cantidad
                .body("datos.precioUnitario", equalTo(899.99f))  // Validamos el precio unitario
                .body("datos.total", equalTo(1799.98f));  // Validamos el total calculado
    }

    /**
     * PRUEBA 3: Obtener una compra por su ID
     * 
     * Probamos GET con parámetro en la URL
     * En este caso, /api/compras/1
     */
    @Test
    @DisplayName("Debe obtener una compra por ID")
    void testObtenerCompraPorId() {
        given()
                .when()
                .get("/1")  // GET a /api/compras/1
                .then()
                .statusCode(200)  // OK
                .body("datos.id", notNullValue());  // La compra debe tener ID
    }

    /**
     * PRUEBA 4: Obtener compras filtrando por producto
     * 
     * Probamos el endpoint especial que devuelve solo las compras de un producto específico
     * Útil para ver el historial de compras de un producto
     */
    @Test
    @DisplayName("Debe obtener compras por producto")
    void testObtenerComprasPorProducto() {
        given()
                .when()
                .get("/producto/1")  // GET a /api/compras/producto/1
                .then()
                .statusCode(200)  // OK
                .body("datos", notNullValue());  // Debe devolver un array de compras
    }

}
