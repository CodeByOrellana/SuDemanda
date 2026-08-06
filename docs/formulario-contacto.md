# Formulario de contacto — Cómo funciona

Documento de estudio para entender de punta a punta cómo funciona el envío del
formulario de Contacto y las protecciones anti-spam.

## Arquitectura general

```
Navegador (Contacto.svelte)          Servidor (SvelteKit)
─────────────────────────────        ─────────────────────────────
<form use:enhance>  ──POST JSON──▶  +page.server.ts  → action "contactar"
        ▲                                    │
        │   ←  { success, message }          ▼
        │                            Resend API (correo real)
```

Regla de oro: **todo lo que viene del navegador es hostil**. El HTML, el JS y
los `required` del navegador solo son para UX; la seguridad vive 100% en el
servidor (`+page.server.ts`).

## Flujo de una petición

1. El usuario envía el formulario.
2. `use:enhance` intercepta el submit y lo envía por `fetch` (sin recargar la
   página). Antes de enviar, agrega `_ts` (timestamp) al FormData.
3. El servidor recibe el POST en `actions.contactar` y ejecuta las defensas en
   orden:
   1. **Honeypot** → si el campo oculto `_honey` viene con contenido, es bot.
      Se le responde "éxito" falso y no se envía nada (para no entrenar al bot).
   2. **Timestamp** → si el formulario se envió en menos de 3 s desde que se
      generó, probablemente es un bot que no "escribió".
   3. **Validación** → campos requeridos, formato de email, servicio permitido,
      longitud mínima del mensaje.
   4. **Rate limit** → máx. 3 envíos por IP en 1 hora.
4. Si todo pasa, se llama a la API de Resend para enviar el correo.
5. El servidor devuelve `{ success, message }` y el componente muestra el
   mensaje de éxito o error.

## Archivos

### `src/routes/+page.server.ts`

El corazón de todo. Solo se ejecuta en el servidor (por eso tiene `.server`).

- **`actions.contactar`**: una *form action* de SvelteKit. Se declara con
  `export const actions` y se dispara cuando un formulario hace `POST` con
  `action="?/contactar"`.
- `request.formData()`: lee los campos enviados.
- `validar(form)`: devuelve `{ datos, errores }`. Las validaciones se hacen
  **aquí y no solo en el HTML** porque el HTML se puede manipular.
- `enviarCorreo(datos)`: llama a la API de Resend con `fetch`.
  - `Authorization: Bearer ${RESEND_API_KEY}` — autenticación.
  - `replyTo: datos.email` — la respuesta del abogado va directo al cliente.
  - Devuelve `true/false` según si Resend aceptó el correo.
- `fail(status, data)`: función de SvelteKit que devuelve una respuesta con
  código de error (400, 429, 500) + datos. El cliente distingue el tipo de
  resultado por `result.type` (`success` / `failure` / `error`).

### `src/lib/server/rateLimit.ts`

Rate limiter en memoria (por IP):

- Un `Map<string, { count, resetAt }>` guarda cuántas veces ha enviado cada IP.
- `resetAt` es el instante en que la "ventana" expira; al pasar, el contador se
  reinicia (ventana deslizante simplificada a ventana fija).
- Devuelve `{ ok, remaining, resetAt }` para saber si está permitido.

**Limitación importante:** la memoria se pierde al reiniciar el servidor y no es
compartida entre múltiples instancias (por ej. en serverless). Para producción
real se usaría Redis (el algoritmo sería el mismo, solo cambia el storage).

### `src/lib/components/Contacto.svelte`

- `use:enhance`: mejoramiento de formularios de SvelteKit. Envía el POST por
  `fetch`, actualiza `page.form` y permite lógica pre/post.
  - **Callback pre-envío**: agrega `_ts` y pone `enviando = true`.
  - **Callback post-envío**: recibe `result` y muestra feedback según el tipo.
- Honeypot: campo `<input name="_honey">` oculto con CSS (posición fuera de
  pantalla, no `display:none`, porque algunos bots respetan `display:none` y lo
  saltan). Los humanos no lo ven; los bots rellenan todos los inputs.
- `disabled={enviando}` evita envíos dobles mientras el correo se procesa.

## Variables de entorno (`.env`)

| Variable | Qué es | Ejemplo |
|---|---|---|
| `RESEND_API_KEY` | API key de Resend | `re_123abc...` |
| `EMAIL_FROM` | Remitente (dominio verificado en Resend) | `SuDemanda <onboarding@resend.dev>` |
| `EMAIL_TO` | Correo donde llegan los mensajes | `leojuridico@gmail.com` |

Se leen con `$env/dynamic/private` (solo disponibles en módulos de servidor).
Con `dynamic` las lees en runtime; si usaras `$env/static/private` se incrustan
en el build y **fallan** si no existen. El archivo `.env` está en `.gitignore`.

## Cómo ponerlo en marcha

1. Crear cuenta en https://resend.com.
2. Ir a **API Keys** → crear una key y copiarla.
3. Copiar `.env.example` a `.env` y pegar la key + `EMAIL_TO`.
4. En el plan gratis, `EMAIL_FROM` debe ser `onboarding@resend.dev` (Resend solo
   te deja enviar **a tu propio correo** hasta que verifiques un dominio).
5. Para enviar al público: verificar `sudemanda.cl` en Resend (agregar DNS TXT)
   y usar un correo tipo `no-responder@sudemanda.cl`.

## Cuándo usar un SDK en vez de `fetch`

Aquí se usa `fetch` a la API REST de Resend para que se vea la mecánica HTTP.
Alternativa oficial: `npm i resend` y luego

```ts
import { Resend } from 'resend';
const resend = new Resend(RESEND_API_KEY);
await resend.emails.send({ from, to, replyTo, subject, text });
```

Hace exactamente lo mismo, con tipado y manejo de errores.

## Protecciones extra (futuro)

- **Cloudflare Turnstile / hCaptcha**: para spam sofisticado. Se valida con una
  petición extra desde el servidor (token → verificación). Añade fricción ~0
  pero bloquea bots que pasan honeypot.
- **Rate limit con Redis**: compartido entre instancias.
- **Verificación de dominio + SPF/DKIM/DMARC**: mejora la entregabilidad de los
  correos (que no caigan en spam).

## Deploy

Necesitas un runtime que ejecute código de servidor (Node). Con `adapter-auto`
eso depende de la plataforma (Vercel, Netlify, Cloudflare Pages...). Si
desplegaras como **sitio estático** (sin servidor), las form actions no
funcionan y habría que usar un proveedor externo tipo Formspree/Resend con
`fetch` desde el cliente (menos seguro).
