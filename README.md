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
| `--bg-primary` | `#2b5257` | Fondo principal (header, footer) |
| `--blue-primary` | `#0266c1` | Azul corporativo |
| `--blue-dark` | `#073461` | Azul oscuro / marino |
| `--blue-light` | `#1886e8` | Acentos y enlaces |
| `--silver-light` | `#d1d8df` | Fondos secundarios |
| `--silver-dark` | `#83919e` | Bordes y textos secundarios |
| `--text-white` | `#ffffff` | Texto blanco |
| `--font-base` | Segoe UI, Tahoma... | Tipografía base |

## Estructura del proyecto

```
src/
├── app.d.ts
├── app.html                          # lang="es-CL", meta title/description
├── lib/
│   ├── assets/
│   │   ├── escudo.png                # Imagen original (1536x1024)
│   │   ├── escudo.svg                # SVG generado con Inkscape (embebido, 3.1MB)
│   │   └── favicon.svg               # Favicon del scaffold (sin usar)
│   ├── components/
│   │   ├── Header.svelte             # Nav sticky, menú móvil ($state, $effect)
│   │   ├── Hero.svelte               # Sección presentación: escudo, título, CTAs apilados
│   │   ├── Servicios.svelte          # Carrusel horizontal infinito
│   │   ├── Proceso.svelte            # Lista ordenada (<ol>)
│   │   ├── QuienesSomos.svelte       # Sección QS: fundación, modelo y enfoque
│   │   ├── Contacto.svelte           # Formulario en tarjeta
│   │   └── Footer.svelte             # Footer con datos de contacto
│   ├── content.svelte.ts             # Datos con runes ($state)
│   ├── index.ts
│   └── styles/
│       └── global.css                # Variables, reset, base de elementos
├── routes/
│   ├── +layout.svelte                # Header, global.css import, favicon
│   └── +page.svelte                  # Ensambla las secciones de la landing
├── static/
│   └── favicon.png                   # Favicon 32x32 generado de escudo.png
└── vite.config.ts
```

## Secciones de la landing (`+page.svelte`)

1. **Hero** (`#inicio`) - Título, subtítulo y CTAs
2. **Servicios** (`#servicios`) - Carrusel horizontal infinito con tarjetas
3. **Proceso** (`#proceso`) - Lista ordenada de pasos
4. **Quiénes Somos** (`#quienes-somos`) - Fundación, modelo de asesoría y enfoque
5. **Contacto** (`#contacto`) - Formulario en tarjeta sobre fondo gris

## Componentes clave con runes

- **Header.svelte**: `abierto` y `scrolled` con `$state`, `$effect` para scroll listener, `onNavigate` para cerrar menú
- **Servicios.svelte**: `track = $derived([...servicios, ...servicios])` para loop infinito del carrusel
- **Contacto.svelte**: `nombre`, `email`, `servicio`, `mensaje`, `enviado` con `$state`
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

- Sin estilos en componentes individuales (excepto Hero, Proceso y Contacto que tienen scoped styles)
- Header sticky con `position: sticky; top: 0`
- Footer con fondo `--bg-primary`
- Carrusel: `overflow: hidden`, animación CSS `translateX(-50%)`, pausa al hover, `prefers-reduced-motion` respetado
- Contacto: tarjeta centrada (`max-width: 40rem`) sobre fondo `--silver-light`
- Formulario con estilos básicos de inputs y focus states

## Pendiente

- [x] Estilos de Hero: contenido centrado, escudo (importado de `$lib/assets/escudo.svg`, `max-width: 12rem`), CTAs apilados verticalmente en `.cta-group`
- [ ] Estilos de Servicios y Proceso (scoped styles)
- [ ] Diseño responsive completo (mobile-first)
- [ ] Conexión real del formulario de contacto (backend/API)
- [ ] Optimizar imágenes (escudo.png → favicon adecuado)
- [ ] SEO: meta tags Open Graph, structured data
- [ ] Integrar Google Analytics o similar
- [ ] Configurar dominio sudemanda.cl (DNS, SSL, deploy)