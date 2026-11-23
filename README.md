# Formación Técnica · Mediciones Especiales

Plataforma web modular de capacitación técnica construida con arquitectura **Core + Data** lista para desplegar en **GitHub Pages**.

## Estructura del Proyecto

```text
formacion-tecnica-mediciones-especiales/
├── .nojekyll               # Evita procesamiento Jekyll en GitHub Pages
├── index.html              # Portal principal (Módulo 01 activo + 2 módulos Próximamente)
├── assets/
│   └── logo.png            # Coloca aquí tu logotipo institucional
├── core/
│   ├── theme.css           # Sistema visual reutilizable (#007e75, Bento Grid, Modales)
│   └── engine.js           # Motor compartido de tarjetas, flashcards centradas y taller práctico
└── modulos/
    └── 01-tcm/
        ├── index.html
        ├── tcm-data.js
        └── tcm-animations.js
```

## Cómo publicar en GitHub Pages

1. Extrae este archivo `.zip` y coloca tu logotipo en `assets/logo.png`.
2. Sube el contenido de la carpeta a un repositorio en GitHub (rama `main`).
3. En tu repositorio, ve a **Settings → Pages → Build and deployment**:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` / `/ (root)`
4. Guarda los cambios; en ~1 minuto tu portal estará activo.

## Cómo agregar futuros módulos (Letalidad Acumulada / Incertidumbre)

1. Duplica la carpeta `modulos/01-tcm/` (por ejemplo, `modulos/02-letalidad/`).
2. Renombra `tcm-data.js` y `tcm-animations.js` y actualiza las etiquetas `<script>` en su `index.html`.
3. Edita el contenido de datos y animaciones del nuevo módulo.
4. En `index.html` de la raíz, cambia la tarjeta `<article class="bento-card ... is-coming-soon">` correspondiente por `<a href="modulos/02-letalidad/index.html" class="bento-card span-6 featured">` y actualiza la etiqueta a `Disponible ahora`.
