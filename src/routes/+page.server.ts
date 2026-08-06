import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { checkRateLimit } from '$lib/server/rateLimit';
import type { Actions } from './$types';

const SERVICIOS = new Set([
	'derecho-civil',
	'derecho-de-familia',
	'derecho-laboral',
	'derecho-penal',
	'derecho-comercial',
	'derecho-de-consumidor',
	'otro'
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const MIN_FILL_MS = 3000;

type Datos = {
	nombre: string;
	email: string;
	servicio: string;
	mensaje: string;
};

function validar(form: FormData): { datos?: Datos; errores: Record<string, string> } {
	const errores: Record<string, string> = {};

	const nombre = String(form.get('nombre') ?? '').trim();
	const email = String(form.get('email') ?? '').trim();
	const servicio = String(form.get('servicio') ?? '').trim();
	const mensaje = String(form.get('mensaje') ?? '').trim();

	if (nombre.length < 2) errores.nombre = 'Escribe tu nombre.';
	if (!EMAIL_REGEX.test(email)) errores.email = 'Escribe un correo válido.';
	if (!SERVICIOS.has(servicio)) errores.servicio = 'Selecciona una opción.';
	if (mensaje.length < 10) errores.mensaje = 'Cuéntanos tu caso (mínimo 10 caracteres).';

	if (Object.keys(errores).length > 0) {
		return { errores };
	}

	return { errores, datos: { nombre, email, servicio, mensaje } };
}

async function enviarCorreo(datos: Datos): Promise<boolean> {
	const apiKey = env.RESEND_API_KEY;
	const from = env.EMAIL_FROM;
	const to = env.EMAIL_TO;

	if (!apiKey || !from || !to) {
		console.warn('Variables de correo no configuradas (RESEND_API_KEY, EMAIL_FROM, EMAIL_TO).');
		return false;
	}

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			from,
			to: [to],
			replyTo: datos.email,
			subject: `Nuevo mensaje desde el sitio - ${datos.nombre}`,
			text: [
				`Nombre: ${datos.nombre}`,
				`Email: ${datos.email}`,
				`Servicio: ${datos.servicio}`,
				'',
				'Mensaje:',
				datos.mensaje
			].join('\n')
		})
	});

	if (!res.ok) {
		console.error('Resend error:', await res.text());
		return false;
	}

	return true;
}

export const actions: Actions = {
	contactar: async ({ request, getClientAddress }) => {
		const form = await request.formData();

		if (String(form.get('_honey') ?? '').trim() !== '') {
			return { success: true, message: 'Mensaje enviado. Te contactaremos pronto.' };
		}

		const ts = Number(form.get('_ts'));
		if (!ts || Date.now() - ts < MIN_FILL_MS) {
			return fail(400, {
				success: false,
				message: 'El mensaje se envió demasiado rápido. Espera unos segundos e inténtalo de nuevo.'
			});
		}

		const { datos, errores } = validar(form);
		if (Object.keys(errores).length > 0) {
			return fail(400, { success: false, errores, message: 'Revisa los campos del formulario.' });
		}

		const ip = getClientAddress();
		const rl = checkRateLimit(`contacto:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
		if (!rl.ok) {
			return fail(429, {
				success: false,
				message: 'Has enviado varios mensajes seguidos. Inténtalo de nuevo en una hora.'
			});
		}

		const enviado = await enviarCorreo(datos!);
		if (!enviado) {
			return fail(500, {
				success: false,
				message: 'No se pudo enviar el mensaje. Inténtalo más tarde o escríbenos directo.'
			});
		}

		return { success: true, message: 'Mensaje enviado. Te contactaremos pronto.' };
	}
};
