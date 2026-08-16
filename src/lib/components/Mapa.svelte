<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import type { Map as LeafletMap } from 'leaflet';

	let { lat, lng, zoom = 16 }: { lat: number; lng: number; zoom?: number } = $props();

	let container: HTMLDivElement;
	let map: LeafletMap | undefined;
	let destroyed = false;

	onMount(() => {
		void (async () => {
			const L = (await import('leaflet')).default;
			const { default: iconUrl } = await import('leaflet/dist/images/marker-icon.png');
			const { default: iconRetinaUrl } = await import('leaflet/dist/images/marker-icon-2x.png');
			const { default: shadowUrl } = await import('leaflet/dist/images/marker-shadow.png');

			if (destroyed) return;

			const icon = L.icon({
				iconUrl,
				iconRetinaUrl,
				shadowUrl,
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				shadowSize: [41, 41]
			});

			map = L.map(container, { scrollWheelZoom: false }).setView([lat, lng], zoom);
			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);
			L.marker([lat, lng], { icon }).addTo(map);
		})();

		return () => {
			destroyed = true;
			map?.remove();
		};
	});
</script>

<div class="mapa" bind:this={container} aria-label="Mapa de ubicación"></div>

<style>
	.mapa {
		position: relative;
		z-index: 0;
		width: 100%;
		height: 16rem;
		border: 1px solid var(--silver-light);
		border-radius: 0.5rem;
		overflow: hidden;
	}
</style>
