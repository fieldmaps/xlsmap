<script lang="ts">
  import { PUBLIC_API } from '$env/static/public';
  import { init } from '$lib/map';
  import { map } from '$lib/stores';
  import { Map, NavigationControl, ScaleControl } from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import { onMount } from 'svelte';

  let container: HTMLDivElement;

  onMount(() => {
    $map = new Map({
      attributionControl: false,
      container,
      bounds: [
        [-180, -90],
        [180, 90],
      ],
      preserveDrawingBuffer: true,
      style: `https://api.maptiler.com/maps/dataviz/style.json?key=${PUBLIC_API}`,
    });
    $map.addControl(new ScaleControl({}), 'bottom-right');
    $map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right');
    $map.once('styledata', init);
  });
</script>

<div bind:this={container} />

<style>
  div {
    height: 100%;
    flex-grow: 1;
  }
</style>
