# SuDemanda.cl - Contexto del Proyecto

## Stack

- **Framework**: SvelteKit 2 + Svelte 5 (runes)
- **Lenguaje**: TypeScript
- **Bundler**: Vite 8
- **Dominio**: sudemanda.cl
- **Idioma**: es-CL (Chile)

## Paleta de colores (CSS custom properties)

| Variable | Valor | Uso |
|---|---|---|
| `--bg-primary` | `#2b5257` | Fondo verde azulado (sin uso activo) |
| `--blue-primary` | `#0266c1` | Azul corporativo (header, footer, CTAs) |
| `--blue-dark` | `#073461` | Azul oscuro / marino (textos) |
| `--blue-light` | `#1886e8` | Acentos y enlaces |
| `--blue-section` | `#1c88e8` | Sección azul (Servicios, Proceso, QS) |
| `--blue-section-light` | `#67b5fe` | Mitad del degradado de la sección azul |
| `--blue-card-text` | `#76b9f4` | Texto claro de tarjetas (sin uso activo) |
| `--silver-light` | `#d1d8df` | Fondos secundarios (Hero card, Contacto) |
| `--silver-dark` | `#83919e` | Bordes y textos secundarios |
| `--text-white` | `#ffffff` | Texto blanco |
| `--text-light` | `#f4f3f2` | Texto claro (sin uso activo) |
| `--error-red` / `--error-text` | `#c0392b` / `#7f1d1d` | Feedback de error del formulario |
| `--font-base` | Cormorant Garamond, Georgia, serif | Tipografía base (body) |
| `--font-body` | Merriweather, Georgia, serif | Párrafos |
| `--font-display` | Playfair Display, Georgia, serif | Títulos (definida, sin uso directo) |

## Estructura del proyecto

```
src/
├── app.d.ts
├── app.html                          # lang="es-CL", meta title/description
├── lib/
│   ├── assets/
│   │   ├── escudo.png                # Imagen original (1536x1024)
│   │   ├── escudo.svg                # SVG generado con Inkscape (embebido)
│   │   ├── BannerOffice.png          # Banner del Hero (imagen de fondo)
│   │   ├── oficina.png               # Imagen de fondo de la sección Contacto
│   │   └── favicon.svg               # Favicon del scaffold (sin usar)
│   ├── components/
│   │   ├── Header.svelte             # Nav sticky, menú móvil ($state, $effect)
│   │   ├── Hero.svelte               # Banner con escudo, título y card gris con CTAs
│   │   ├── Servicios.svelte          # Carrusel horizontal infinito (drag + flechas)
│   │   ├── Proceso.svelte            # Lista ordenada (<ol>) en panel gris translúcido
│   │   ├── QuienesSomos.svelte       # Fundación, modelo y enfoque en panel gris translúcido
│   │   ├── Contacto.svelte           # Formulario en tarjeta + tarjeta de info/mapa
│   │   ├── Mapa.svelte               # Mapa Leaflet con marcador de la oficina
│   │   └── Footer.svelte             # Footer con datos de contacto
│   ├── content.svelte.ts             # Datos con runes ($state)
│   ├── index.ts
│   └── styles/
│       └── global.css                # Variables, reset, base, .seccion-azul, .panel-gris
├── routes/
│   ├── +layout.svelte                # Header, global.css import, favicon
│   ├── +page.server.ts               # Acción "contactar" del formulario (honeypot + timestamp)
│   └── +page.svelte                  # Ensambla las secciones de la landing
└── vite.config.ts
```

## Secciones de la landing (`+page.svelte`)

1. **Hero** (`#inicio`) - Banner con foto, escudo, título y CTAs en card gris (`#inicio-card`)
2. **Servicios** (`#servicios`) - Carrusel horizontal infinito con tarjetas y flechas
3. **Proceso** (`#proceso`) - Lista ordenada de pasos
4. **Quiénes Somos** (`#quienes-somos`) - Fundación, modelo de asesoría y enfoque
5. **Contacto** (`#contacto`) - Formulario en tarjeta + mapa Leaflet

> Servicios, Proceso y Quiénes Somos viven dentro de `.seccion-azul`, un wrapper con
> degradado azul (`--blue-section` → `--blue-section-light` → `--blue-section`).

## Componentes clave con runes

- **Header.svelte**: `abierto` y `scrolled` con `$state`, `$effect` para scroll listener, `onNavigate` para cerrar menú, `transition:fly` en el menú móvil
- **Servicios.svelte**: `track = $derived([...servicios, ...servicios])`; carrusel con `requestAnimationFrame`, drag con puntero, flechas, indicadores (`indiceActivo`) y `prefers-reduced-motion`
- **Contacto.svelte**: `nombre`, `email`, `servicio`, `mensaje`, `honey`, `enviando`, `feedback` con `$state`; submit con el helper `enhance`
- **Footer.svelte**: `anio = $derived(new Date().getFullYear())`
- **content.svelte.ts**: `servicios`, `pasos`, `navItems` con `$state`, `site` como constante

## Datos (`content.svelte.ts`)

- **site**: nombre, dominio, lema, email, teléfono, dirección
- **servicios**: Derecho Civil, Familia, Laboral, Penal, Comercial, Consumidor
- **pasos**: 4 pasos del proceso de trabajo
- **navItems**: Inicio, Servicios, Cómo trabajamos, Quiénes Somos, Contacto

## Comandos útiles

```bash
npm run dev        # Desarrollo
npm run build      # Build producción
npm run check      # Type-check Svelte + TS
npm run preview    # Preview del build
```

## Notas de diseño

- Header y footer comparten fondo `--blue-primary`; footer con `padding: 3rem 1.5rem`
- Textos de la página en `--blue-dark`; textos de header/footer (sobre azul) en blanco
- Sección azul (`.seccion-azul` en `+page.svelte`) con `color: var(--blue-dark)` para texto
- `.panel-gris` (global.css): tarjeta gris translúcida `rgb(209 216 223 / 0.55)`, borde blanco al 40%, `border-radius: 0.75rem`, `max-width: 56rem`, usada detrás de Proceso y Quiénes Somos
- Scoped styles en Hero, Servicios, Proceso, QuienesSomos y Contacto
- Header sticky con `position: sticky; top: 0`, `box-shadow` al hacer scroll
- Carrusel: `overflow-x: auto` + `requestAnimationFrame`, pausa al hover/drag, flechas y `prefers-reduced-motion` respetado (mosaico estático)
- Contacto: fondo `--silver-light` con imagen de fondo, tarjetas blancas, fórmula Leaflet en `Mapa.svelte`
- Formulario con honeypot (`_honey`), timestamp (`_ts`) y feedback de éxito/error

## Pendiente

- [x] Estilos de Hero: contenido centrado, escudo, CTAs apilados en `.cta-group`
- [x] Estilos de Servicios (carrusel con drag, flechas e indicadores)
- [x] Estilos de Proceso y Quiénes Somos (scoped styles + `.panel-gris`)
- [x] Ajustes de paleta: footer en `--blue-primary`, textos en `--blue-dark`
- [ ] Diseño responsive completo (mobile-first)
- [ ] Conexión real del formulario (verificar transporte del correo en `+page.server.ts`)
- [ ] Optimizar imágenes (escudo.png → favicon adecuado)
- [ ] SEO: meta tags Open Graph, structured data
- [ ] Integrar Google Analytics o similar
- [ ] Configurar dominio sudemanda.cl (DNS, SSL, deploy)