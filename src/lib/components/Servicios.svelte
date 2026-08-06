<script lang="ts">
	import { servicios } from '$lib/content.svelte';

	let { id = 'servicios' }: { id?: string } = $props();

	let track = $derived([...servicios, ...servicios]);
</script>

<section id={id} aria-labelledby="servicios-titulo">
	<h2 id="servicios-titulo">Servicios</h2>
	<p>Áreas de práctica en las que podemos ayudarte.</p>

	<div class="carrusel">
		<div class="carrusel-track">
			{#each track as servicio, i (i)}
				<article class="card">
					<h3>{servicio.titulo}</h3>
					<p>{servicio.descripcion}</p>
					<a href="#contacto">Consultar por este servicio</a>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.carrusel {
		overflow: hidden;
		padding-block: 1.5rem;
	}

	.carrusel-track {
		display: flex;
		width: max-content;
		animation: scroll 28s linear infinite;
	}

	.card {
		flex: 0 0 auto;
		width: 20rem;
		padding: 1.5rem;
		margin-right: 1.5rem;
		border: 2px solid var(--silver-light);
		border-radius: 0.75rem;
		background-color: var(--text-white);
		box-shadow: 0 2px 8px rgb(0 0 0 / 0.08);
		transition:
			transform 0.3s ease,
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.carrusel:hover .carrusel-track {
		animation-play-state: paused;
	}

	.card h3 {
		margin-top: 0;
	}

	.card:hover {
		transform: scale(1.05);
		border-color: var(--blue-light);
		box-shadow: 0 8px 20px rgb(2 102 193 / 0.25);
	}

	@keyframes scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.carrusel-track {
			animation: none;
			flex-wrap: wrap;
			width: auto;
		}
	}
</style>
