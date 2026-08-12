<script lang="ts">
	import { servicios } from '$lib/content.svelte';

	let { id = 'servicios' }: { id?: string } = $props();

	let track = $derived([...servicios, ...servicios]);

	const VELOCIDAD = 0.04;
	let carrusel = $state<HTMLDivElement | null>(null);
	let pausado = $state(false);
	let arrastrando = $state(false);
	let indiceActivo = $state(0);
	let reducedMotion = $state(false);

	let ultimoT = 0;
	let frame = 0;
	let inicioX = 0;
	let inicioScroll = 0;
	let dragged = false;
	let resumeTimer: ReturnType<typeof setTimeout> | null = null;

	function anchoTarjeta() {
		return carrusel ? carrusel.scrollWidth / track.length : 0;
	}

	function animar(t: number) {
		const el = carrusel;
		if (!el) return;
		if (!pausado) {
			const dt = Math.min(t - ultimoT, 50);
			el.scrollLeft += VELOCIDAD * dt;
			const mitad = el.scrollWidth / 2;
			if (el.scrollLeft >= mitad) el.scrollLeft -= mitad;
		}
		ultimoT = t;
		frame = requestAnimationFrame(animar);
	}

	function pausar() {
		if (resumeTimer) {
			clearTimeout(resumeTimer);
			resumeTimer = null;
		}
		pausado = true;
	}

	function reanudar() {
		if (resumeTimer) clearTimeout(resumeTimer);
		resumeTimer = setTimeout(() => {
			if (!arrastrando) pausado = false;
		}, 2000);
	}

	function onScroll() {
		const el = carrusel;
		if (!el) return;
		const ancho = anchoTarjeta();
		if (!ancho) return;
		indiceActivo = Math.round(el.scrollLeft / ancho) % servicios.length;
	}

	function onPointerDown(e: PointerEvent) {
		if (reducedMotion) return;
		pausar();
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
		arrastrando = false;
		carrusel?.classList.remove('drag');
		reanudar();
	}

	function onClick(e: MouseEvent) {
		if (dragged) {
			e.preventDefault();
			dragged = false;
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			deslizar(-1);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			deslizar(1);
		}
	}

	function deslizar(dir: -1 | 1) {
		if (reducedMotion) return;
		const el = carrusel;
		if (!el) return;
		pausar();
		el.scrollBy({ left: dir * anchoTarjeta(), behavior: 'smooth' });
		reanudar();
	}

	function irA(indice: number) {
		if (reducedMotion) return;
		const el = carrusel;
		if (!el) return;
		pausar();
		el.scrollTo({ left: indice * anchoTarjeta(), behavior: 'smooth' });
		reanudar();
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
		el.addEventListener('pointerenter', pausar);
		el.addEventListener('pointerleave', reanudar);
		el.addEventListener('click', onClick);
		el.addEventListener('scroll', onScroll);
		el.addEventListener('keydown', onKeyDown);

		return () => {
			cancelAnimationFrame(frame);
			el.removeEventListener('pointerdown', onPointerDown);
			el.removeEventListener('pointermove', onPointerMove);
			el.removeEventListener('pointerup', onPointerUp);
			el.removeEventListener('pointercancel', onPointerUp);
			el.removeEventListener('pointerenter', pausar);
			el.removeEventListener('pointerleave', reanudar);
			el.removeEventListener('click', onClick);
			el.removeEventListener('scroll', onScroll);
			el.removeEventListener('keydown', onKeyDown);
		};
	});
</script>

<section id={id} aria-labelledby="servicios-titulo">
	<h2 id="servicios-titulo">Servicios</h2>
	<p>Áreas de práctica en las que podemos ayudarte.</p>

	<div class="carrusel-wrapper">
		<button type="button" class="flecha flecha-izq" aria-label="Servicios anteriores" onclick={() => deslizar(-1)}>
			<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
				<path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>

		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div
			class="carrusel"
			role="region"
			aria-label="Lista de servicios, desliza para ver más"
			tabindex="0"
			bind:this={carrusel}
		>
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

		<button type="button" class="flecha flecha-der" aria-label="Siguientes servicios" onclick={() => deslizar(1)}>
			<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
				<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
	</div>

	<div class="indicadores" role="tablist" aria-label="Ir a un servicio">
		{#each servicios as servicio, i (servicio.titulo)}
			<button
				type="button"
				class="punto"
				class:activo={indiceActivo === i}
				aria-label={`Ir al servicio: ${servicio.titulo}`}
				onclick={() => irA(i)}
			></button>
		{/each}
	</div>
</section>

<style>
	.carrusel-wrapper {
		position: relative;
	}

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

	.card:hover {
		transform: scale(1.05);
		border-color: var(--blue-light);
		box-shadow: 0 8px 20px rgb(2 102 193 / 0.25);
	}

	.flecha {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border: none;
		border-radius: 50%;
		background-color: var(--blue-primary);
		color: var(--text-white);
		cursor: pointer;
		box-shadow: 0 2px 8px rgb(0 0 0 / 0.25);
		opacity: 0.9;
		transition:
			opacity 0.2s ease,
			background-color 0.2s ease;
	}

	.flecha:hover {
		opacity: 1;
		background-color: var(--blue-dark);
	}

	.flecha-izq {
		left: 0.25rem;
	}

	.flecha-der {
		right: 0.25rem;
	}

	.indicadores {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.punto {
		width: 0.75rem;
		height: 0.75rem;
		padding: 0;
		border: none;
		border-radius: 50%;
		background-color: var(--silver-dark);
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			transform 0.3s ease;
	}

	.punto:hover {
		transform: scale(1.25);
	}

	.punto.activo {
		background-color: var(--blue-light);
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

		.flecha,
		.indicadores {
			display: none;
		}
	}
</style>
