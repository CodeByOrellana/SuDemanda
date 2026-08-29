<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Servicios from '$lib/components/Servicios.svelte';
	import Proceso from '$lib/components/Proceso.svelte';
	import Contacto from '$lib/components/Contacto.svelte';
</script>

<Hero
	titulo="Asesoría legal cercana y comprometida"
	subtitulo="Abogado con basta experiencia ha trabajado en distintos Estudios Jurídicos de la ciudad de Santiago."
	cta="Agenda una consulta gratuita"
/>

<div class="servicios-proceso">
	<Servicios />
	<Proceso />
</div>
<Contacto />

<style>
	.servicios-proceso {
		background: linear-gradient(
			180deg,
			var(--blue-section) 0%,
			var(--blue-section-light) 50%,
			var(--blue-section) 100%
		);
		color: var(--text-light);
	}
</style>
