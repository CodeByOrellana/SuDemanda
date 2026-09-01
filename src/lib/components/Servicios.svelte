<script lang="ts">
	import { servicios, ui } from '$lib/content.svelte';

	let { id = 'servicios' }: { id?: string } = $props();

	let track = $derived([...servicios, ...servicios]);

	const VELOCIDAD_SEG = 2.5;
	let carrusel = $state<HTMLDivElement | null>(null);
	let indiceCentro = $state(-1);
	let reducedMotion = $state(false);

	let ultimoT = 0;
	let frame = 0;
	let inicioX = 0;
	let inicioScroll = 0;
	let dragged = false;
	let arrastrando = $state(false);
	let pausado = $state(false);
	let resumeTimer: ReturnType<typeof setTimeout> | null = null;

	function anchoTarjeta() {
		return carrusel ? carrusel.scrollWidth / track.length : 0;
	}

	function actualizarCentro() {
		const el = carrusel;
		if (!el) return;
		const ancho = anchoTarjeta();
		if (!ancho) return;
		const centroViewport = el.scrollLeft + el.clientWidth / 2;
		indiceCentro = Math.round((centroViewport - ancho / 2) / ancho);
	}

	function animar(t: number) {
		const el = carrusel;
		if (!el) return;
		if (!pausado) {
			const dt = Math.min(t - ultimoT, 50);
			const paso = (VELOCIDAD_SEG * Math.sqrt(el.clientWidth) * dt) / 1000;
			el.scrollLeft += paso;
			const mitad = el.scrollWidth / 2;
			if (el.scrollLeft >= mitad) el.scrollLeft -= mitad;
			actualizarCentro();
		}
		ultimoT = t;
		frame = requestAnimationFrame(animar);
	}

	function onPointerDown(e: PointerEvent) {
		if (reducedMotion) return;
		if ((e.target as Element | null)?.closest('a')) return;
		pausado = true;
		arrastrando = true;
		dragged = false;
		inicioX = e.clientX;
		inicioScroll = carrusel?.scrollLeft ?? 0;
		carrusel?.setPointerCapture(e.pointerId);
		carrusel?.classList.add('drag');
	}

	function onPointerMove(e: PointerEvent) {
		const el = carrusel;
		if (!arrastrando || !el) return;
		const delta = e.clientX - inicioX;
		if (!dragged && Math.abs(delta) > 5) dragged = true;
		el.scrollLeft = inicioScroll - delta;
	}

	function onPointerUp() {
		if (!arrastrando) return;
		arrastrando = false;
		carrusel?.classList.remove('drag');
		if (resumeTimer) clearTimeout(resumeTimer);
		resumeTimer = setTimeout(() => {
			pausado = false;
		}, 800);
	}

	function onClick(e: MouseEvent) {
		if (dragged) {
			e.preventDefault();
			dragged = false;
		}
	}

	$effect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		const onChange = () => (reducedMotion = mq.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	$effect(() => {
		const el = carrusel;
		if (!el) return;
		ultimoT = performance.now();
		frame = requestAnimationFrame(animar);

		el.addEventListener('pointerdown', onPointerDown);
		el.addEventListener('pointermove', onPointerMove);
		el.addEventListener('pointerup', onPointerUp);
		el.addEventListener('pointercancel', onPointerUp);
		el.addEventListener('scroll', actualizarCentro);
		el.addEventListener('click', onClick);

		return () => {
			cancelAnimationFrame(frame);
			if (resumeTimer) clearTimeout(resumeTimer);
			el.removeEventListener('pointerdown', onPointerDown);
			el.removeEventListener('pointermove', onPointerMove);
			el.removeEventListener('pointerup', onPointerUp);
			el.removeEventListener('pointercancel', onPointerUp);
			el.removeEventListener('scroll', actualizarCentro);
			el.removeEventListener('click', onClick);
		};
	});
</script>

<section id={id} aria-labelledby="servicios-titulo">
	<h2 id="servicios-titulo">Servicios</h2>
	<p>Áreas de práctica en las que podemos ayudarte.</p>

	<div class="carrusel-wrapper">
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div
			class="carrusel"
			role="region"
			aria-label="Lista de servicios"
			tabindex="0"
			bind:this={carrusel}
		>
			<div class="carrusel-track">
				{#each track as servicio, i (i)}
					<article class="card" class:centro={i === indiceCentro}>
						<h3>{servicio.titulo}</h3>
						<p>{servicio.descripcion}</p>
						<a href="#contacto" onclick={() => (ui.servicioInteres = servicio.slug)}>Consultar por este servicio</a>
					</article>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.carrusel {
		overflow-x: auto;
		scrollbar-width: none;
		overscroll-behavior-x: contain;
		touch-action: pan-y;
		cursor: grab;
		padding-block: 1.5rem;
	}

	.carrusel::-webkit-scrollbar {
		display: none;
	}

	.carrusel-track {
		display: flex;
		width: max-content;
	}

	.card a {
		color: var(--blue-dark);
	}

	:global(.carrusel.drag) {
		cursor: grabbing;
		user-select: none;
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

	.card h3 {
		margin-top: 0;
	}

	.card p {
		color: var(--blue-dark);
	}

	.card a {
		color: var(--blue-dark);
	}

	.card:hover {
		transform: scale(1.02);
	}

	.card.centro {
		transform: scale(1.1);
		position: relative;
		z-index: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.carrusel {
			overflow: visible;
			cursor: auto;
		}

		.carrusel-track {
			flex-wrap: wrap;
			width: auto;
		}

.card,
	.card.centro {
		transform: none;
	}
	}
</style>
