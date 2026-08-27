# ATLAS TÁCTICO

Catálogo web de ropa y equipo táctico para personal militar. Precios en soles (PEN).

## Qué incluye

- Catálogo con filtros por categoría y búsqueda
- Ficha de producto (galería, tallas, colores, descripción)
- Panel de administrador con contraseña para añadir, editar y eliminar productos
- Los productos nuevos aparecen al instante en el catálogo

## Estructura

```text
src/
  routes/          páginas (inicio, catálogo, producto, admin)
  components/      interfaz (tarjetas, ficha, panel admin)
  lib/             datos del catálogo y utilidades
public/            favicon e imagen de compartir
migrations/        esquema y productos de ejemplo
```

## Cómo ejecutarlo

Necesitas Node.js 22+.

```bash
npm install
npm run dev
```

Luego abre la URL que muestre la terminal (por defecto el puerto 8080).

```bash
npm run build      # producción
npm run typecheck  # tipos
```

## Administrador

En el menú: **Administrador**. Contraseña: `589`.

Desde ahí se publican fotos, tallas, colores, precio y descripción.

## Stack

React 19, TanStack Start, Tailwind CSS v4, Postgres (Neon en producción, PGLite en local).
