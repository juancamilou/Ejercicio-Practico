# API REST Productos

Este proyecto es una aplicación full-stack para la gestión de productos.

- Backend: API REST construida con **Spring Boot**.
- Frontend: interfaz web moderna con **React** y **Vite**.
- Base de datos: almacenamiento de productos con **MySQL**.

## Qué hace el proyecto

La aplicación permite:

- administrar productos con operaciones CRUD
- buscar productos por nombre o categoría
- filtrar productos por estado y stock
- manejar respuestas JSON estructuradas
- gestionar errores con un controlador global

## Estructura básica

- `backend/`: código del servidor Java y configuración Maven
- `frontend/`: aplicación web React/Vite
- `README.md`: descripción del proyecto

## Cómo ejecutar

1. Ejecuta el script de base de datos:

```bash
mysql -u root -p < init.sql
```

2. Ajusta las credenciales en `backend/src/main/resources/application.properties`.
3. Ejecuta el backend con Maven:

```bash
cd backend
mvn spring-boot:run
```

4. Ejecuta el frontend:

```bash
cd frontend
npm install
npm run dev
```

## Nota

Esta versión del proyecto incluye solo el código principal y la descripción del proyecto. No contiene documentación adicional ni referencias a contenedores.
