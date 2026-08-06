<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Servicios from '$lib/components/Servicios.svelte';
	import Proceso from '$lib/components/Proceso.svelte';
	import Contacto from '$lib/components/Contacto.svelte';
</script>

<Hero
	titulo="Asesoría legal cercana y comprometida"
	subtitulo="Abogados en Chile que te guían en cada etapa de tu caso, con claridad y resultados."
	cta="Agenda una consulta gratuita"
/>

<Servicios />
<Proceso />
<Contacto />
