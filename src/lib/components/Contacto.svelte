<script lang="ts">
	import { enhance } from '$app/forms';
	import { site } from '$lib/content.svelte';
	import oficina from '$lib/assets/oficina.png';
	import Mapa from '$lib/components/Mapa.svelte';

	let { id = 'contacto' }: { id?: string } = $props();

	const ubicacion = { lat: -33.4395597, lng: -70.6443989 };

	const inicio = Date.now();

	let nombre = $state('');
	let email = $state('');
	let servicio = $state('');
	let mensaje = $state('');
	let honey = $state('');
	let enviando = $state(false);
	let feedback = $state<{ ok: boolean; mensaje: string } | null>(null);
</script>

<section id={id} aria-labelledby="contacto-titulo" style="background-image: url('{oficina}')">
	<div class="grid">
		<div class="card">
			<h2 id="contacto-titulo">Contacto</h2>
			<p>Cuéntanos tu caso y te responderemos a la brevedad.</p>

			{#if feedback}
				<p role="status" class:ok={feedback.ok} class:error={!feedback.ok}>{feedback.mensaje}</p>
			{/if}

			<form
				method="POST"
				action="?/contactar"
			use:enhance={({ formData }) => {
				formData.set('_ts', String(inicio));
					enviando = true;
					return async ({ result, formElement }) => {
						enviando = false;
						if (result.type === 'success') {
							formElement.reset();
							const data = result.data as { message?: string } | undefined;
							feedback = { ok: true, mensaje: data?.message ?? 'Mensaje enviado.' };
						} else if (result.type === 'failure') {
							const data = result.data as { message?: string } | undefined;
							feedback = { ok: false, mensaje: data?.message ?? 'No se pudo enviar.' };
						} else if (result.type === 'error') {
							feedback = { ok: false, mensaje: 'Error de red. Inténtalo de nuevo.' };
						}
					};
				}}
			>
			<div class="honey" aria-hidden="true">
				<label for="honey">No llenar este campo</label>
				<input
					id="honey"
					name="_honey"
					type="text"
					tabindex="-1"
					autocomplete="off"
					bind:value={honey}
				/>
			</div>

			<input type="hidden" name="_ts" value={inicio} />

				<label>
					Nombre
					<input type="text" name="nombre" required bind:value={nombre} />
				</label>

				<label>
					Email
					<input type="email" name="email" required bind:value={email} />
				</label>

				<label>
					Servicio de interés
					<select name="servicio" bind:value={servicio}>
						<option value="">Selecciona una opción</option>
						<option value="derecho-civil">Derecho Civil</option>
						<option value="derecho-de-familia">Derecho de Familia</option>
						<option value="derecho-laboral">Derecho Laboral</option>
						<option value="derecho-penal">Derecho Penal</option>
						<option value="derecho-comercial">Derecho Comercial</option>
						<option value="derecho-de-consumidor">Derecho del Consumidor</option>
						<option value="otro">Otro</option>
					</select>
				</label>

				<label>
					Mensaje
					<textarea name="mensaje" rows="5" required bind:value={mensaje}></textarea>
				</label>

				<button type="submit" disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar mensaje'}</button>
			</form>

			<div class="canales">
				<a href="mailto:{site.email}">{site.email}</a>
				<a href="tel:{site.telefono.replace(/[^+\d]/g, '')}">{site.telefono}</a>
			</div>
		</div>

		<div class="card info">
			<h3>¿Dónde nos encontramos?</h3>
			<address class="direccion">{site.direccion}</address>
			<Mapa lat={ubicacion.lat} lng={ubicacion.lng} />
			<a
				class="como-llegar"
				href="https://www.google.com/maps/dir/?api=1&destination={ubicacion.lat},{ubicacion.lng}"
				target="_blank"
				rel="noopener noreferrer"
			>
				Cómo llegar
			</a>
		</div>
	</div>
</section>

<style>
	section {
		background-color: var(--silver-light);
		background-size: cover;
		background-position: center;
	}

	.grid {
		display: grid;
		gap: 1.5rem;
		max-width: 64rem;
		margin: 0 auto;
	}

	@media (min-width: 860px) {
		.grid {
			grid-template-columns: 1.15fr 0.85fr;
			align-items: start;
		}
	}

	.card {
		padding: 2rem;
		border: 2px solid var(--silver-light);
		border-radius: 0.75rem;
		background-color: var(--text-white);
		box-shadow: 0 4px 16px rgb(0 0 0 / 0.1);
	}

	.info h3 {
		margin-bottom: 0.75rem;
		color: var(--blue-dark);
	}

	.direccion {
		margin-bottom: 1rem;
		font-style: normal;
		color: var(--blue-dark);
	}

	.como-llegar {
		display: block;
		margin-top: 1rem;
		padding: 0.625rem 1.25rem;
		border-radius: 0.375rem;
		background-color: var(--blue-primary);
		color: var(--text-white);
		font-weight: 600;
		text-align: center;
	}

	.como-llegar:hover {
		background-color: var(--blue-dark);
		color: var(--text-white);
		text-decoration: none;
	}

	.honey {
		position: absolute;
		left: -9999px;
		top: -9999px;
		height: 0;
		width: 0;
		overflow: hidden;
		opacity: 0;
	}

	form label {
		display: block;
		margin-bottom: 1rem;
		font-weight: 600;
		color: var(--blue-dark);
	}

	form input,
	form select,
	form textarea {
		display: block;
		width: 100%;
		margin-top: 0.25rem;
		padding: 0.625rem;
		border: 1px solid var(--silver-dark);
		border-radius: 0.375rem;
	}

	form input:focus,
	form select:focus,
	form textarea:focus {
		outline: 2px solid var(--blue-light);
		outline-offset: 1px;
		border-color: var(--blue-light);
	}

	.ok {
		padding: 0.75rem 1rem;
		border-radius: 0.375rem;
		background-color: color-mix(in srgb, var(--blue-light) 15%, var(--text-white));
		color: var(--blue-dark);
	}

	.error {
		padding: 0.75rem 1rem;
		border-radius: 0.375rem;
		background-color: color-mix(in srgb, #c0392b 12%, var(--text-white));
		color: #7f1d1d;
	}

	button[type='submit'] {
		padding: 0.625rem 1.25rem;
		border: none;
		border-radius: 0.375rem;
		background-color: var(--blue-primary);
		color: var(--text-white);
		font-weight: 600;
		cursor: pointer;
	}

	button[type='submit']:hover {
		background-color: var(--blue-dark);
	}

	button[type='submit']:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.canales {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		justify-content: center;
		margin-top: 1rem;
	}
</style>
