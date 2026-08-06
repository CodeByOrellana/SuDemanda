<script lang="ts">
	import { navItems, site } from '$lib/content.svelte';

	let { id = 'footer' }: { id?: string } = $props();
	const anio = $derived(new Date().getFullYear());
</script>

<footer id={id}>
	<div>
		<h2>{site.name}</h2>
		<p>{site.lema}</p>
	</div>

	<address>
		<a href="mailto:{site.email}">{site.email}</a>
		<a href="tel:{site.telefono.replace(/[^+\d]/g, '')}">{site.telefono}</a>
		<p>{site.direccion}</p>
	</address>

	<p>© {anio} {site.name}. Todos los derechos reservados.</p>
</footer>
