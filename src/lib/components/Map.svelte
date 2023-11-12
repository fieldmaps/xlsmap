<script lang="ts">
  import { PUBLIC_API } from '$env/static/public';
  import { fetchAreas } from '$lib/data/fetch';
  import { map } from '$lib/stores';
  import { Map, NavigationControl, ScaleControl, type LngLatBoundsLike } from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import { onMount } from 'svelte';

  export let root: boolean;
  let container: HTMLDivElement;
  const bounds: LngLatBoundsLike = [
    [-180, -90],
    [180, 90],
  ];

  onMount(async () => {
    $map = new Map({
      attributionControl: false,
      container,
      bounds,
      preserveDrawingBuffer: true,
      style: `https://api.maptiler.com/maps/dataviz/style.json?key=${PUBLIC_API}`,
    });
    $map.addControl(new ScaleControl({}), 'bottom-right');
    $map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right');
    if (!root) $map.once('styledata', fetchAreas);
  });
</script>

<div bind:this={container} />

<style>
  div {
    height: 100%;
    flex-grow: 1;
  }
</style>
