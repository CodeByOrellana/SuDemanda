# SuDemanda — Registro de avances

Bitácora de los cambios realizados sobre la landing de SuDemanda.cl.

## Sesión 1: Landing y estilos

### Hero (`#inicio`) — `src/lib/components/Hero.svelte`

- **Fondo con imagen de oficina** (`oficina.jpg`): se agregó un `<div class="hero-bg">`
  posicionado absoluto detrás del contenido con `background-size: cover`.
- El `url()` de la imagen se puso en el **atributo `style` inline** y no en el
  `<style>` del componente. Motivo: Svelte no interpola `{variable}` dentro de
  los bloques `<style>`; quedaba el texto literal `url('{oficina}')` y el
  navegador pedía `GET /{oficina}` (404).
- **Tarjeta `.inicio-card`**: recuadro centrado con fondo `var(--silver-light)`,
  `border-radius`, `max-width: 36rem` para mejorar la legibilidad del texto
  sobre el fondo.
- El blur se probó y se descartó por pedido del usuario.

### Contacto (`#contacto`) — `src/lib/components/Contacto.svelte`

- Misma imagen `oficina.jpg` como fondo de la sección (con el mismo truco del
  `url()` inline).

## Sesión 2: Envío de correo y anti-spam

> Documentación de estudio completa en `docs/formulario-contacto.md`.

### `src/routes/+page.server.ts` (nuevo)

- **Form action `contactar`** de SvelteKit. Flujo de defensas en orden:
  1. **Honeypot**: campo oculto `_honey`. Si viene con contenido, se responde
     "éxito" falso sin enviar nada (para no entrenar bots).
  2. **Timestamp**: si el formulario se envió en menos de 3 s, se rechaza.
  3. **Validación**: nombre, email (regex), servicio (whitelist), mensaje (mín. 10).
  4. **Rate limit**: máx. 3 envíos por IP por hora (`fail(429)`).
  5. **Envío**: API de Resend vía `fetch` con `replyTo` del cliente.
- Variables de entorno leídas con `$env/dynamic/private` → `env.RESEND_API_KEY`,
  `env.EMAIL_FROM`, `env.EMAIL_TO`. Si faltan, responde `fail(500)` sin crashear.

### `src/lib/server/rateLimit.ts` (nuevo)

- Rate limiter en memoria: `Map<string, { count, resetAt }>`, ventana fija de
  1 hora por IP. Limitación conocida: no persiste entre reinicios ni entre
  instancias (en producción real → Redis).

### `Contacto.svelte` (actualizado)

- `use:enhance` para enviar sin recargar la página: inyecta `_ts` antes del
  envío, deshabilita el botón mientras envía y muestra feedback según el tipo de
  resultado (`success` / `failure` / `error`).
- Campo honeypot oculto por CSS (posición fuera de pantalla, no `display:none`).

### `.env.example` (nuevo)

- Plantilla con `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`. `.env` real está en
  `.gitignore` (no se sube).

## Sesión 3: Git y GitHub

- Repo git inicializado en la raíz del proyecto, rama renombrada a `main`.
- **Primer commit** creado con todo el proyecto (verificado: incluye `src/`,
  `docs/`, `.env.example`, **excluye** `.env` y `node_modules`).
- Se eliminó una carpeta accidental `SuDemanda/` (repo git anidado sobrante que
  solo tenía un README descargado de GitHub).
- **Multi-cuenta SSH** (4 claves con passphrase): se diagnosticó que el
  `ssh-agent` no estaba corriendo; la clave se carga con
  `eval "$(ssh-agent -s)"` + `ssh-add ~/.ssh/id_ed25519_prof`.
- Remote configurado: `git@github.com:CodeByOrellana/SuDemanda.git` (cuenta
  **prof**, alias `github.com` del `~/.ssh/config`).
- Push rechazado por "Initial commit" auto-generado de GitHub → pendiente
  resolver con `git push -u origin main --force`.

## Pendiente / próximos pasos

- [x] Fondo Hero con `oficina.jpg` + tarjeta de legibilidad
- [x] Fondo de la sección Contacto con `oficina.jpg`
- [x] Form action `contactar` + honeypot + timestamp + validación + rate limit
- [x] Envío a Resend (requiere `RESEND_API_KEY` real en `.env`)
- [x] Primer commit + remote configurado
- [ ] `git push -u origin main --force` (cuenta prof, repo `SuDemanda`)
- [ ] Estilos de Servicios y Proceso (scoped styles)
- [ ] Diseño responsive completo (mobile-first)
- [ ] SEO: meta tags Open Graph, structured data
- [ ] Integrar Google Analytics o similar
- [ ] Configurar dominio sudemanda.cl (DNS, SSL, deploy)
