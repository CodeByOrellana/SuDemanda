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
		background: linear-gradient(180deg, #1c88e8 0%, #67b5fe 50%, #1c88e8 100%);
		color: #f4f3f2;
	}
</style>
