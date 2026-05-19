# Pruebas del Backend - REST Assured

Esta carpeta contiene todas las pruebas automatizadas para la API REST usando **REST Assured**.

## Estructura

```
src/test/
├── java/com/productos/api/
│   ├── controller/          # Pruebas de endpoints
│   │   ├── ProductoControllerTest.java
│   │   └── CompraControllerTest.java
│   └── service/             # Pruebas de servicios (próximamente)
└── resources/
    └── application-test.properties  # Configuración para pruebas
```

## Ejecutar pruebas

### Ejecutar todas las pruebas

```bash
cd backend
mvn test
```

### Ejecutar una clase de prueba específica

```bash
mvn test -Dtest=ProductoControllerTest
```

### Ejecutar un método de prueba específico

```bash
mvn test -Dtest=ProductoControllerTest#testObtenerProductos
```


## Requisitos

- El backend debe estar compilado: `mvn clean install`
- MySQL debe estar corriendo
- La base de datos debe existir (ejecuta `init.sql` antes)

## Pruebas disponibles

### ProductoControllerTest

- `testObtenerProductos()` - Valida obtener lista de productos
- `testCrearProducto()` - Valida creación de nuevo producto
- `testObtenerProductoPorId()` - Valida obtener producto específico
- `testObtenerProductoNoExistente()` - Valida manejo de errores 404
- `testObtenerProductosActivos()` - Valida filtro de activos
- `testObtenerCategorias()` - Valida listado de categorías
- `testBuscarProductos()` - Valida búsqueda por término

### CompraControllerTest

- `testObtenerCompras()` - Valida obtener lista de compras
- `testRegistrarCompra()` - Valida registro de nueva compra
- `testObtenerCompraPorId()` - Valida obtener compra específica
- `testObtenerComprasPorProducto()` - Valida obtener compras por producto

## Agregar nuevas pruebas

1. Crea una nueva clase en `src/test/java/com/productos/api/controller/` o `service/`
2. Usa `@SpringBootTest` con `webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT`
3. Inyecta `@LocalServerPort` para obtener el puerto
4. Usa REST Assured en tus test methods

Ejemplo:

```java
@Test
void testEjemplo() {
    given()
        .header("Content-Type", "application/json")
        .body(payload)
    .when()
        .post("/endpoint")
    .then()
        .statusCode(200)
        .body("field", equalTo("value"));
}
```
