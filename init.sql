-- Script para crear la base de datos y tabla de productos
-- Ejecutar este script en MySQL antes de iniciar la aplicación

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS productos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE productos_db;

-- Crear tabla productos
CREATE TABLE IF NOT EXISTS productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DOUBLE NOT NULL,
    stock INT NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    fecha_creacion DATETIME NOT NULL,
    fecha_actualizacion DATETIME NOT NULL,
    INDEX idx_nombre (nombre),
    INDEX idx_categoria (categoria),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, activo, fecha_creacion, fecha_actualizacion) VALUES
('Laptop HP 15', 'Laptop HP 15 pulgadas, Intel Core i7, 16GB RAM, 512GB SSD', 899.99, 10, 'Electrónica', 1, NOW(), NOW()),
('Monitor Dell 27"', 'Monitor IPS 4K UltraSharp, 60Hz', 599.99, 8, 'Electrónica', 1, NOW(), NOW()),
('Teclado Mecánico RGB', 'Teclado mecánico RGB con switches Cherry MX', 129.99, 25, 'Periféricos', 1, NOW(), NOW()),
('Mouse Logitech MX Master 3', 'Mouse inalámbrico para productividad premium', 99.99, 30, 'Periféricos', 1, NOW(), NOW()),
('Hub USB-C 7 puertos', 'Concentrador USB-C con múltiples conexiones', 59.99, 15, 'Accesorios', 1, NOW(), NOW()),
('Webcam Logitech 4K', 'Webcam USB 4K con micrófono integrado', 79.99, 12, 'Periféricos', 1, NOW(), NOW()),
('SSD Samsung 1TB', 'Unidad SSD NVMe de 1TB para almacenamiento rápido', 149.99, 20, 'Almacenamiento', 1, NOW(), NOW()),
('RAM DDR4 16GB', 'Memoria RAM DDR4 16GB 3200MHz', 79.99, 40, 'Componentes', 1, NOW(), NOW()),
('Windows 11 Pro', 'Licencia digital de Windows 11 Professional', 199.99, 50, 'Software', 1, NOW(), NOW()),
('Office 365 Anual', 'Suscripción anual de Microsoft Office 365', 99.99, 35, 'Software', 1, NOW(), NOW());

-- Verificar que los datos fueron insertados
SELECT COUNT(*) as total_productos FROM productos;

-- Ver todos los productos
SELECT * FROM productos;

-- Verificar estructura de la tabla
DESCRIBE productos;

-- Crear tabla compras
CREATE TABLE IF NOT EXISTS compras (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    nombre_producto VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DOUBLE NOT NULL,
    subtotal DOUBLE NOT NULL,
    descuento DOUBLE NOT NULL DEFAULT 0,
    total DOUBLE NOT NULL,
    nota VARCHAR(500),
    fecha_compra DATETIME NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar compras de ejemplo
INSERT INTO compras (producto_id, nombre_producto, cantidad, precio_unitario, subtotal, descuento, total, nota, fecha_compra) VALUES
(1, 'Laptop HP 15', 1, 899.99, 899.99, 0, 899.99, 'Compra para equipo de ventas', '2025-11-05 10:15:00'),
(4, 'Mouse Logitech MX Master 3', 1, 99.99, 99.99, 0, 99.99, 'Compra para equipo de ventas', '2025-11-05 10:17:00'),
(7, 'SSD Samsung 1TB', 2, 149.99, 299.98, 20, 279.98, 'Actualización de almacenamiento', '2025-11-08 16:35:00'),
(8, 'RAM DDR4 16GB', 1, 79.99, 79.99, 0, 79.99, 'Actualización de servidor', '2025-11-08 16:36:00'),
(9, 'Windows 11 Pro', 1, 199.99, 199.99, 0, 199.99, 'Nueva licencia de sistema operativo', '2025-11-12 09:05:00'),
(5, 'Hub USB-C 7 puertos', 1, 59.99, 59.99, 0, 59.99, 'Accesorios para estación de trabajo', '2025-11-12 09:06:00');

-- Verificar que las compras fueron insertadas
SELECT COUNT(*) as total_compras FROM compras;

-- Ver todas las compras
SELECT * FROM compras;

-- Verificar estructura de la tabla
DESCRIBE compras;
