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
