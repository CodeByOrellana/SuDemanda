<script lang="ts">
	import { navItems, site } from '$lib/content.svelte';
	import { fly } from 'svelte/transition';
	import { onNavigate } from '$app/navigation';

	let { id = 'header' }: { id?: string } = $props();

	let abierto = $state(false);
	let scrolled = $state(false);

	function toggle() {
		abierto = !abierto;
	}

	function cerrar() {
		abierto = false;
	}

	$effect(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 8;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	onNavigate(() => cerrar());
</script>

<header id={id} class:scrolled>
	<a href="#inicio" aria-label="{site.name} - Inicio">
		<span>{site.name}</span>
	</a>

	<nav aria-label="Navegación principal">
		{#each navItems as item (item.href)}
			<a href={item.href}>{item.label}</a>
		{/each}
	</nav>

	<button
		type="button"
		class="menu-toggle"
		class:abierto
		aria-expanded={abierto}
		aria-controls="menu-movil"
		aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
		onclick={toggle}
	>
		<span class="hamburger" aria-hidden="true">
			<span></span>
			<span></span>
			<span></span>
		</span>
	</button>

	{#if abierto}
		<div id="menu-movil" transition:fly={{ y: -8, duration: 150 }}>
			{#each navItems as item (item.href)}
				<a href={item.href} onclick={cerrar}>{item.label}</a>
			{/each}
		</div>
	{/if}
</header>
