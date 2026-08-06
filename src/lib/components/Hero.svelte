<script lang="ts">
	import { site } from '$lib/content.svelte';
	import escudo from '$lib/assets/escudo.svg';
	import oficina from '$lib/assets/oficina.jpg';

	let { titulo = '', subtitulo = '', cta = 'Agenda tu consulta' }: { titulo?: string; subtitulo?: string; cta?: string } = $props();
</script>

<section id="inicio" aria-label="Presentación">
	<div class="hero-bg" role="presentation" aria-hidden="true" style="background-image: url('{oficina}')"></div>
	<img class="escudo" src={escudo} alt="Escudo SuDemanda">
	<div class="inicio-card">
	<h1>{titulo || site.lema}</h1>
	{#if subtitulo}
		<p>{subtitulo}</p>
	{/if}
	<div class="cta-group">
		<a href="#contacto">{cta}</a>
		<a href="#servicios">Ver servicios</a>
	</div>
	</div>
</section>

<style>
	section {
		position: relative;
		overflow: hidden;
		text-align: center;
	}

	section > *:not(.hero-bg) {
		position: relative;
	}

	.hero-bg {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
	}

	.hero-bg::after {
		content: '';
		position: absolute;
		inset: 0;
		background-color: rgba(43, 82, 87, 0.7);
	}

	.escudo {
		max-width: 12rem;
		margin: 0 auto 1.5rem;
	}

	.inicio-card {
		background-color: var(--silver-light);
		border-radius: 0.5rem;
		padding: 1.5rem;
		max-width: 36rem;
		margin: 0 auto;
	}

	.cta-group {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.cta-group a {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		border-radius: 0.375rem;
		background-color: var(--blue-primary);
		color: var(--text-white);
		font-weight: 600;
	}

	.cta-group a:hover {
		background-color: var(--blue-dark);
		text-decoration: none;
	}
</style>
