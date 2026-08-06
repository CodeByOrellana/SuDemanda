<script lang="ts">
	import { pasos } from '$lib/content.svelte';

	let { id = 'proceso' }: { id?: string } = $props();
</script>

<section id={id} aria-labelledby="proceso-titulo">
	<h2 id="proceso-titulo">Cómo trabajamos</h2>
	<p>Un proceso claro y transparente, paso a paso.</p>

	<ol>
		{#each pasos as paso, i (paso.titulo)}
			<li>
				<h3>{paso.titulo}</h3>
				<p>{paso.descripcion}</p>
			</li>
		{/each}
	</ol>
</section>
